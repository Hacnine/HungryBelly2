"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useNavigate } from "react-router-dom"
import { fetchOrderDetail } from "../store/orderSlice"

export default function OrderConfirmationPage() {
  const { orderId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedOrder, loading } = useSelector((state) => state.order)

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderDetail(orderId))
    }
  }, [orderId, dispatch])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center animate__animated animate__fadeIn">
        <div className="text-gray-500">Loading order...</div>
      </div>
    )
  }

  if (!selectedOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center animate__animated animate__fadeIn">
        <div className="text-center animate__animated animate__zoomIn">
          <p className="text-gray-500 mb-4">Order not found</p>
          <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 py-8 animate__animated animate__fadeIn">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center animate__animated animate__zoomIn">
          <div className="text-5xl mb-4 animate__animated animate__bounceIn">✓</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2 animate__animated animate__fadeInUp">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6 animate__animated animate__fadeIn">Your order has been placed successfully</p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left animate__animated animate__slideInUp">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-mono text-sm break-all">{selectedOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-bold capitalize">{selectedOrder.status}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-bold mb-3">Items</h3>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 animate__animated animate__fadeInUp">
            <button
              onClick={() => navigate(`/order/${orderId}`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg"
            >
              Track Order
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
