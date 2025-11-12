import express from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate, requireRole } from "../middlewares/auth.js"
import { io } from "../index.js"
import { emitDriverAssigned, emitDriverLocation, emitOrderUpdate } from "../utils/socket-handlers.js"

const router = express.Router()
const prisma = new PrismaClient()

// Get all available drivers (admin only)
router.get("/", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: "desc" },
    })
    res.json(drivers)
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

// Get driver by id
router.get("/:id", authenticate, async (req, res) => {
  try {
    const driver = await prisma.driver.findUnique({
      where: { id: req.params.id },
    })
    if (!driver) return res.status(404).json({ error: "not found" })
    res.json(driver)
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

// Create driver (admin only)
router.post("/", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { name, email, phone, vehicle, licensePlate } = req.body
    if (!name || !email || !phone) {
      return res.status(400).json({ error: "missing required fields" })
    }
    const driver = await prisma.driver.create({
      data: { name, email, phone, vehicle, licensePlate },
    })
    res.status(201).json(driver)
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

// Update driver status/assignment (admin only)
router.put("/:id", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const { available, currentOrderId } = req.body
    const driver = await prisma.driver.update({
      where: { id: req.params.id },
      data: {
        ...(available !== undefined && { available }),
        ...(currentOrderId !== undefined && { currentOrderId }),
      },
    })
    res.json(driver)
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

// ============= DRIVER APP ROUTES =============

// Get available orders for drivers (orders that are ready for pickup)
router.get("/available/orders", authenticate, requireRole("driver"), async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: "ready",
        driverId: null // Not yet assigned to a driver
      },
      orderBy: { createdAt: "asc" },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            logo: true
          }
        }
      }
    })
    res.json(orders)
  } catch (error) {
    console.error("Error fetching available orders:", error)
    res.status(500).json({ error: "Failed to fetch orders" })
  }
})

// Driver accepts an order
router.post("/accept/:orderId", authenticate, requireRole("driver"), async (req, res) => {
  try {
    const { orderId } = req.params

    // Find the driver record for this user
    const driver = await prisma.driver.findFirst({
      where: { userId: req.user.userId }
    })

    if (!driver) {
      return res.status(404).json({ error: "Driver profile not found" })
    }

    if (!driver.isAvailable) {
      return res.status(400).json({ error: "Driver is not available" })
    }

    // Check if order is still available
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { restaurant: true }
    })

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    if (order.driverId) {
      return res.status(400).json({ error: "Order already assigned to another driver" })
    }

    if (order.status !== "ready") {
      return res.status(400).json({ error: "Order is not ready for pickup" })
    }

    // Assign driver to order
    const [updatedOrder, updatedDriver] = await Promise.all([
      prisma.order.update({
        where: { id: orderId },
        data: {
          driverId: driver.id,
          status: "picked_up",
          steps: [
            ...order.steps,
            {
              step: "picked_up",
              timestamp: new Date().toISOString(),
              message: `Driver ${driver.name} is on the way to pick up your order`
            }
          ]
        },
        include: {
          restaurant: {
            select: {
              id: true,
              name: true,
              address: true,
              phone: true
            }
          }
        }
      }),
      prisma.driver.update({
        where: { id: driver.id },
        data: {
          isAvailable: false,
          currentLocation: order.deliveryAddress?.coordinates || null
        }
      })
    ])

    // TODO: Emit Socket.IO events
    // io.to(`order-${orderId}`).emit('driver_assigned', { driver, order: updatedOrder })

    // Emit events: driver assigned and order update
    try {
      await emitDriverAssigned(io, orderId, updatedDriver)
    } catch (err) {
      console.error('Failed to emit driver assigned:', err)
    }

    try {
      await emitOrderUpdate(io, orderId, updatedOrder)
    } catch (err) {
      console.error('Failed to emit order update after driver accept:', err)
    }

    res.json({ 
      order: updatedOrder, 
      driver: updatedDriver,
      message: "Order accepted successfully" 
    })
  } catch (error) {
    console.error("Error accepting order:", error)
    res.status(500).json({ error: "Failed to accept order" })
  }
})

// Driver updates location
router.post("/location", authenticate, requireRole("driver"), async (req, res) => {
  try {
    const { latitude, longitude, orderId } = req.body

    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Location coordinates required" })
    }

    const driver = await prisma.driver.findFirst({
      where: { userId: req.user.userId }
    })

    if (!driver) {
      return res.status(404).json({ error: "Driver profile not found" })
    }

    // Update driver location
    await prisma.driver.update({
      where: { id: driver.id },
      data: {
        currentLocation: { latitude, longitude },
        lastLocationUpdate: new Date()
      }
    })

    // TODO: Emit Socket.IO event for real-time tracking
    // if (orderId) {
    //   io.to(`order-${orderId}`).emit('driver_location', { latitude, longitude })
    // }

    // Emit driver location to the order room (if provided)
    try {
      if (orderId) {
        await emitDriverLocation(io, orderId, { latitude, longitude })
      }
    } catch (err) {
      console.error('Failed to emit driver location:', err)
    }

    res.json({ success: true, message: "Location updated" })
  } catch (error) {
    console.error("Error updating location:", error)
    res.status(500).json({ error: "Failed to update location" })
  }
})

// Driver marks order as delivered
router.post("/deliver/:orderId", authenticate, requireRole("driver"), async (req, res) => {
  try {
    const { orderId } = req.params
    const { deliveryNote, deliveryPhoto } = req.body

    const driver = await prisma.driver.findFirst({
      where: { userId: req.user.userId }
    })

    if (!driver) {
      return res.status(404).json({ error: "Driver profile not found" })
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    })

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    if (order.driverId !== driver.id) {
      return res.status(403).json({ error: "This order is not assigned to you" })
    }

    if (order.status === "delivered") {
      return res.status(400).json({ error: "Order already marked as delivered" })
    }

    // Mark order as delivered
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "delivered",
        deliveredAt: new Date(),
        steps: [
          ...order.steps,
          {
            step: "delivered",
            timestamp: new Date().toISOString(),
            message: "Order delivered successfully"
          }
        ]
      }
    })

    // Update driver status and earnings
    await prisma.driver.update({
      where: { id: driver.id },
      data: {
        isAvailable: true,
        totalEarnings: { increment: order.deliveryFee || 5 },
        totalDeliveries: { increment: 1 }
      }
    })

    // Record driver earning
    await prisma.driverEarning.create({
      data: {
        driverId: driver.id,
        orderId: order.id,
        totalEarning: order.deliveryFee || 5,
        platformFee: (order.deliveryFee || 5) * 0.2, // 20% platform fee
        netEarning: (order.deliveryFee || 5) * 0.8,
        currency: "USD"
      }
    })

    // TODO: Emit Socket.IO event
    // io.to(`order-${orderId}`).emit('order_delivered', updatedOrder)

    try {
      await emitOrderUpdate(io, orderId, updatedOrder)
    } catch (err) {
      console.error('Failed to emit order delivered update:', err)
    }

    res.json({ 
      order: updatedOrder,
      message: "Order delivered successfully" 
    })
  } catch (error) {
    console.error("Error delivering order:", error)
    res.status(500).json({ error: "Failed to mark order as delivered" })
  }
})

// Get driver's current and past orders
router.get("/my/orders", authenticate, requireRole("driver"), async (req, res) => {
  try {
    const { status } = req.query

    const driver = await prisma.driver.findFirst({
      where: { userId: req.user.userId }
    })

    if (!driver) {
      return res.status(404).json({ error: "Driver profile not found" })
    }

    const where = { driverId: driver.id }
    if (status) where.status = status

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            logo: true
          }
        }
      }
    })

    res.json(orders)
  } catch (error) {
    console.error("Error fetching driver orders:", error)
    res.status(500).json({ error: "Failed to fetch orders" })
  }
})

// Get driver earnings
router.get("/my/earnings", authenticate, requireRole("driver"), async (req, res) => {
  try {
    const driver = await prisma.driver.findFirst({
      where: { userId: req.user.userId }
    })

    if (!driver) {
      return res.status(404).json({ error: "Driver profile not found" })
    }

    const earnings = await prisma.driverEarning.findMany({
      where: { driverId: driver.id },
      orderBy: { createdAt: "desc" },
      include: {
        order: {
          select: {
            orderNumber: true,
            total: true,
            deliveredAt: true
          }
        }
      }
    })

    const totalEarnings = earnings.reduce((sum, e) => sum + e.netEarning, 0)

    res.json({
      totalEarnings,
      totalDeliveries: driver.totalDeliveries,
      earnings
    })
  } catch (error) {
    console.error("Error fetching earnings:", error)
    res.status(500).json({ error: "Failed to fetch earnings" })
  }
})

export default router

