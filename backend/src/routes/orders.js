import express from "express"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middlewares/auth.js"
import { io } from "../index.js"
import { emitOrderUpdate } from "../utils/socket-handlers.js"

const router = express.Router()
const prisma = new PrismaClient()

// Place order (supports both authenticated users and guests)
router.post("/", async (req, res) => {
  try {
    const { items, total, guestInfo, deliveryAddress, notes, coupon, restaurantId } = req.body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid items" })
    }

    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required" })
    }

    // Verify restaurant exists and is active
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    })

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    if (!restaurant.isActive || !restaurant.isOpen) {
      return res.status(400).json({ error: "Restaurant is currently not accepting orders" })
    }

    // Validate minimum order amount
    if (total < restaurant.minOrderAmount) {
      return res.status(400).json({ 
        error: `Minimum order amount is $${restaurant.minOrderAmount}` 
      })
    }

    // Generate unique order number
    const date = new Date()
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '')
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const orderNumber = `ORD-${dateStr}-${randomNum}`

    const orderData = {
      restaurantId,
      items,
      total: Number.parseFloat(total),
      status: "placed",
      orderNumber,
      steps: [
        {
          step: "placed",
          timestamp: new Date().toISOString(),
          message: "Order placed successfully. Waiting for restaurant confirmation."
        },
      ],
    }

    // Add userId if authenticated
    if (req.user?.userId) {
      orderData.userId = req.user.userId
    }

    // Add guest info if provided (required for guest orders)
    if (!req.user?.userId) {
      if (!guestInfo || !guestInfo.name || !guestInfo.email) {
        return res.status(400).json({ error: "Guest information required for guest orders" })
      }
      orderData.guestInfo = guestInfo
    }

    // Add optional fields
    if (deliveryAddress) {
      orderData.deliveryAddress = deliveryAddress
    }
    if (notes) {
      orderData.notes = notes
    }
    if (coupon) {
      orderData.coupons = coupon
    }

    const order = await prisma.order.create({
      data: orderData,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            logo: true,
            phone: true,
            address: true,
            avgDeliveryTime: true
          }
        }
      }
    })

    // Emit real-time event to restaurant room and order room
    try {
      // notify restaurant owners/admins
      io.to(`restaurant-${restaurantId}`).emit("new_order", order)
      // notify any client watching this specific order
      io.to(order.id).emit("order:update", order)
    } catch (emitErr) {
      console.error("Socket emit error (new order):", emitErr)
    }

    // Update restaurant total orders
    await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        totalOrders: { increment: 1 }
      }
    })

    // TODO: Emit Socket.IO event to restaurant owner
    // io.to(`restaurant-${restaurantId}`).emit('new_order', order)

    res.status(201).json({
      ...order,
      message: "Order placed successfully",
      trackingUrl: `/order/${order.orderNumber}`
    })
  } catch (error) {
    console.error("Order creation error:", error)
    res.status(500).json({ error: "Failed to create order" })
  }
})

// Get user orders (authenticated users only)
router.get("/", authenticate, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: "desc" },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            logo: true,
            phone: true,
            address: true
          }
        },
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            vehicleType: true
          }
        }
      }
    })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" })
  }
})

// Track order by order number (public route for guests and users)
router.get("/track/:orderNumber", async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: req.params.orderNumber }
    })

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    // If user is authenticated, check if they own this order
    if (req.user && order.userId !== req.user.userId) {
      return res.status(403).json({ error: "Access denied" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" })
  }
})

// Get order by id (authenticated users only)
router.get("/:id", authenticate, async (req, res) => {
  try {
    const order = await prisma.order.findUnique({ 
      where: { id: req.params.id },
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            logo: true,
            phone: true,
            address: true
          }
        },
        driver: {
          select: {
            id: true,
            name: true,
            phone: true,
            vehicleType: true
          }
        }
      }
    })
    if (!order) return res.status(404).json({ error: "Order not found" })
    if (order.userId !== req.user.userId) return res.status(403).json({ error: "Access denied" })
    res.json(order)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" })
  }
})

// ============= RESTAURANT OWNER ROUTES =============

// Get restaurant orders (Restaurant Owner)
router.get("/restaurant/:restaurantId", authenticate, async (req, res) => {
  try {
    const { restaurantId } = req.params
    const { status, page = 1, limit = 20 } = req.query

    // Verify owner owns this restaurant
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId }
    })

    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" })
    }

    if (req.user.role !== "admin" && restaurant.ownerId !== req.user.userId) {
      return res.status(403).json({ error: "Access denied" })
    }

    const where = { restaurantId }
    if (status) where.status = status

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: parseInt(limit),
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          },
          driver: {
            select: {
              id: true,
              name: true,
              phone: true,
              vehicleType: true
            }
          }
        }
      }),
      prisma.order.count({ where })
    ])

    res.json({
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    console.error("Error fetching restaurant orders:", error)
    res.status(500).json({ error: "Failed to fetch orders" })
  }
})

// Accept/Reject order (Restaurant Owner)
router.patch("/:orderId/status", authenticate, async (req, res) => {
  try {
    const { orderId } = req.params
    const { status, estimatedTime, rejectionReason } = req.body

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { restaurant: true }
    })

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    // Verify permission
    if (req.user.role !== "admin" && order.restaurant.ownerId !== req.user.userId) {
      return res.status(403).json({ error: "Access denied" })
    }

    // Build update data
    const updateData = { status }

    // Add step to tracking
    const newStep = {
      step: status,
      timestamp: new Date().toISOString(),
      message: ""
    }

    switch (status) {
      case "accepted":
        newStep.message = `Order accepted by ${order.restaurant.name}. Preparing your food...`
        if (estimatedTime) {
          updateData.estimatedDeliveryTime = new Date(Date.now() + estimatedTime * 60000)
        }
        break
      case "preparing":
        newStep.message = "Your food is being prepared"
        break
      case "ready":
        newStep.message = "Order is ready for pickup. Waiting for driver..."
        break
      case "rejected":
        newStep.message = rejectionReason || "Order rejected by restaurant"
        updateData.rejectionReason = rejectionReason
        break
      default:
        newStep.message = `Order status updated to ${status}`
    }

    updateData.steps = [...order.steps, newStep]

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        restaurant: {
          select: {
            id: true,
            name: true,
            logo: true,
            phone: true
          }
        }
      }
    })

    // Emit socket event to listeners about order update
    try {
      // Emit to the order room
      await emitOrderUpdate(io, orderId, updatedOrder)

      // If order is ready, notify available drivers
      if (status === 'ready') {
        try {
          io.to('available-drivers').emit('order_ready', updatedOrder)
        } catch (err) {
          console.error('Failed to emit order_ready to drivers:', err)
        }
      }
    } catch (emitErr) {
      console.error('Socket emit error (order update):', emitErr)
    }

    res.json(updatedOrder)
  } catch (error) {
    console.error("Error updating order status:", error)
    res.status(500).json({ error: "Failed to update order status" })
  }
})

export default router

