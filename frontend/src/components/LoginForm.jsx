"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useLoginMutation } from "../store/authApi"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const [login, { isLoading, error }] = useLoginMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await login({ email, password }).unwrap()
      localStorage.setItem("accessToken", result.accessToken)
      localStorage.setItem("isAuthenticated", "true")
      // Notify AuthProvider (and other windows) that auth state changed
      try {
        window.dispatchEvent(new Event("authChanged"))
      } catch (e) {
        /* ignore */
      }
      navigate("/")
    } catch (err) {
      // Error is handled by RTK Query
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 animate__animated animate__fadeIn">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 animate__animated animate__zoomIn">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8 animate__animated animate__bounceIn">Food Delivery</h1>

        <form onSubmit={handleSubmit} className="space-y-4 animate__animated animate__fadeInUp">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex justify-between items-center">
              <span>{error.data?.error || "Login failed"}</span>
              <button type="button" onClick={() => {}} className="text-red-500 hover:text-red-700">
                ×
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
