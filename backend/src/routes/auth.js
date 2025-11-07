import express from "express"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { PrismaClient } from "@prisma/client"
import { authenticate } from "../middlewares/auth.js"

const router = express.Router()
const prisma = new PrismaClient()

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn: "15m" })

  const refreshToken = jwt.sign({ userId, role }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" })

  return { accessToken, refreshToken }
}

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: "missing fields" })
    }

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return res.status(400).json({ error: "email already exists" })
    }

    const hashedPassword = await bcryptjs.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "user",
      },
    })

    const { accessToken, refreshToken } = generateTokens(user.id, user.role)

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(201).json({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "server error" })
  }
})

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "missing email or password" })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: "invalid credentials" })
    }

    const validPassword = await bcryptjs.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: "invalid credentials" })
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.role)

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "server error" })
  }
})

// Refresh
router.post("/refresh", (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
      return res.status(401).json({ error: "no refresh token" })
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload.userId, payload.role)

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({ accessToken })
  } catch (error) {
    res.status(401).json({ error: "invalid refresh token" })
  }
})

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken")
  res.json({ ok: true })
})

// Get current user
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    })
    let user2 = { id: user.id, name: user.name, email: user.email, role: user.role }
    console.log(user2)
    res.json(user2)
  } catch (error) {
    res.status(500).json({ error: "server error" })
  }
})

export default router
