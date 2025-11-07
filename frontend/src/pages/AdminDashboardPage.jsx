"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchAdminStats, fetchAllDrivers, createDriver } from "../store/adminSlice"
import AdminOrdersPage from "./AdminOrdersPage"
import AdminAddProductForm from "../components/AdminAddProductForm"
import { useAuth } from "../context/AuthContext"

export default function AdminDashboardPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // Use the AuthContext (RTK Query) for current user — the app fetches the user via AuthProvider
  const { user } = useAuth()
  const { stats, drivers } = useSelector((state) => state.admin)
  const [activeTab, setActiveTab] = useState("orders")
  const [showDriverForm, setShowDriverForm] = useState(false)
  const [driverForm, setDriverForm] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    licensePlate: "",
  })

  useEffect(() => {
    dispatch(fetchAdminStats())
    dispatch(fetchAllDrivers())
    const interval = setInterval(() => {
      dispatch(fetchAdminStats())
    }, 30000)
    return () => clearInterval(interval)
  }, [dispatch])

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center animate__animated animate__fadeIn">
        <div className="text-center animate__animated animate__zoomIn">
          <p className="text-gray-500 mb-4">Access denied. Admin only.</p>
          <button onClick={() => navigate("/")} className="bg-admin-orange text-white px-6 py-2 rounded-lg">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const handleCreateDriver = async (e) => {
    e.preventDefault()
    if (driverForm.name && driverForm.email && driverForm.phone) {
      await dispatch(createDriver(driverForm))
      setDriverForm({ name: "", email: "", phone: "", vehicle: "", licensePlate: "" })
      setShowDriverForm(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 animate__animated animate__fadeIn">
      <nav className="bg-white shadow animate__animated animate__slideInDown">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-admin-orange animate__animated animate__bounceIn">Admin Dashboard</h1>
          <div className="flex items-center gap-4 animate__animated animate__fadeInRight">
            <span className="text-gray-700">{user?.name}</span>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-admin-orange text-white rounded-lg hover:bg-orange-600"
            >
              Back to App
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate__animated animate__fadeInUp">
            <div className="bg-white rounded-lg shadow p-6 animate__animated animate__zoomIn">
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-admin-orange">{stats.totalOrders}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 animate__animated animate__zoomIn">
              <p className="text-gray-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 animate__animated animate__zoomIn">
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 animate__animated animate__zoomIn">
              <p className="text-gray-600 text-sm">Active Drivers</p>
              <p className="text-3xl font-bold text-orange-600">{drivers?.length || 0}</p>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6 animate__animated animate__slideInUp">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "orders"
                  ? "text-admin-orange border-b-2 border-admin-orange"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab("drivers")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "drivers"
                  ? "text-admin-orange border-b-2 border-admin-orange"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Drivers
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`px-6 py-3 font-medium transition ${
                activeTab === "products"
                  ? "text-admin-orange border-b-2 border-admin-orange"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Products
            </button>
          </div>

          <div className="p-6 animate__animated animate__fadeIn">
            {activeTab === "orders" ? (
              <AdminOrdersPage />
            ) : activeTab === "drivers" ? (
              <div className="animate__animated animate__slideInLeft">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Drivers</h2>
                  <button
                    onClick={() => setShowDriverForm(!showDriverForm)}
                    className="px-4 py-2 bg-admin-orange text-white rounded-lg hover:bg-orange-600"
                  >
                    {showDriverForm ? "Cancel" : "Add Driver"}
                  </button>
                </div>

                {showDriverForm && (
                  <form onSubmit={handleCreateDriver} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4 animate__animated animate__fadeInDown">
                    <input
                      type="text"
                      placeholder="Name"
                      value={driverForm.name}
                      onChange={(e) => setDriverForm({ ...driverForm, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={driverForm.email}
                      onChange={(e) => setDriverForm({ ...driverForm, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={driverForm.phone}
                      onChange={(e) => setDriverForm({ ...driverForm, phone: e.target.value })}
                      required
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Vehicle (optional)"
                      value={driverForm.vehicle}
                      onChange={(e) => setDriverForm({ ...driverForm, vehicle: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="License Plate (optional)"
                      value={driverForm.licensePlate}
                      onChange={(e) => setDriverForm({ ...driverForm, licensePlate: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
                      Create Driver
                    </button>
                  </form>
                )}

                {/* Drivers Table */}
                <div className="overflow-x-auto animate__animated animate__fadeInUp">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-bold">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-bold">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-bold">Phone</th>
                        <th className="px-6 py-3 text-left text-sm font-bold">Vehicle</th>
                        <th className="px-6 py-3 text-left text-sm font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {drivers && drivers.length > 0 ? (
                        drivers.map((driver) => (
                          <tr key={driver.id} className="border-b hover:bg-gray-50">
                            <td className="px-6 py-4">{driver.name}</td>
                            <td className="px-6 py-4">{driver.email}</td>
                            <td className="px-6 py-4">{driver.phone}</td>
                            <td className="px-6 py-4">{driver.vehicle || "-"}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  driver.available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {driver.available ? "Available" : "Busy"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                            No drivers yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <AdminAddProductForm />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
