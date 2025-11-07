"use client"

import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import MenuBrowser from "../components/MenuBrowser"
import CartSidebar from "../components/CartSidebar"

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 animate__animated animate__fadeIn">
      <nav className="bg-white shadow animate__animated animate__slideInDown">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 animate__animated animate__bounceIn">Food Delivery</h1>
          <div className="flex items-center gap-4 animate__animated animate__fadeInRight">
            <span className="text-gray-700">{user?.name}</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{user?.role}</span>
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/admin")}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium animate__animated animate__pulse"
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 animate__animated animate__fadeInUp">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 animate__animated animate__slideInLeft">
            <MenuBrowser />
          </div>
          <div className="animate__animated animate__slideInRight">
            <CartSidebar />
          </div>
        </div>
      </div>
    </div>
  )
}
