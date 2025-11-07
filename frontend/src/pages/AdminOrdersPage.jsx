"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllOrders, updateOrderStatus } from "../store/adminSlice"

export default function AdminOrdersPage() {
  const dispatch = useDispatch()
  const { orders, loading } = useSelector((state) => state.admin)
  const [statusFilter, setStatusFilter] = useState(null)
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null)

  useEffect(() => {
    dispatch(fetchAllOrders())
    const interval = setInterval(() => {
      dispatch(fetchAllOrders())
    }, 10000)
    return () => clearInterval(interval)
  }, [dispatch])

  const filteredOrders = statusFilter ? orders.filter((o) => o.status === statusFilter) : orders

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ orderId, status: newStatus }))
  }

  const statuses = ["placed", "accepted", "preparing", "out_for_delivery", "delivered", "cancelled"]

  return (
    <div className="space-y-6 animate__animated animate__fadeIn">
      <div className="animate__animated animate__slideInDown">
        <h2 className="text-2xl font-bold mb-4">All Orders</h2>

        {/* Status Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 animate__animated animate__fadeInUp">
          <button
            onClick={() => setStatusFilter(null)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
              statusFilter === null ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition ${
                statusFilter === status ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status.replace(/_/g, " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow animate__animated animate__slideInUp">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-bold">Order ID</th>
              <th className="px-6 py-3 text-left text-sm font-bold">Status</th>
              <th className="px-6 py-3 text-left text-sm font-bold">Total</th>
              <th className="px-6 py-3 text-left text-sm font-bold">Items</th>
              <th className="px-6 py-3 text-left text-sm font-bold">Created</th>
              <th className="px-6 py-3 text-left text-sm font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-gray-50 animate__animated animate__fadeIn">
                  <td className="px-6 py-4 font-mono text-sm">{order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.items.length} items</td>
                  <td className="px-6 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
