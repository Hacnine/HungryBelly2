"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { placeOrder } from "../store/orderSlice"
import { clearCart } from "../store/cartSlice"
import CheckoutForm from "../components/CheckoutForm"
import { CouponInput } from "../components/CouponInput"

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, total } = useSelector((state) => state.cart)
  const { loading, selectedOrder } = useSelector((state) => state.order)
  const { applied: appliedCoupon } = useSelector((state) => state.coupons)
  const [address, setAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [showPayment, setShowPayment] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center animate__animated animate__fadeIn">
        <div className="text-center animate__animated animate__zoomIn">
          <h1 className="text-2xl font-bold mb-4">Cart is empty</h1>
          <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-6 py-2 rounded-lg">
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault()

    if (!address || !phone) {
      alert("Please fill in all fields")
      return
    }

    const result = await dispatch(
      placeOrder({
        items,
        total,
      }),
    )

    if (result.meta.requestStatus === "fulfilled") {
      setOrderPlaced(true)
      setShowPayment(true)
    }
  }

  const handlePaymentSuccess = () => {
    dispatch(clearCart())
    navigate(`/order/${selectedOrder.id}`)
  }

  const deliveryFee = 3.0
  const tax = total * 0.08
  const discountAmount = appliedCoupon?.discountAmount || 0
  const finalTotal = Math.max(0, total + deliveryFee + tax - discountAmount)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 animate__animated animate__fadeIn">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 animate__animated animate__bounceIn">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2 animate__animated animate__slideInLeft">
            {!showPayment ? (
              <>
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-gray-700">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Subtotal:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <CouponInput orderTotal={total + deliveryFee + tax} onApply={() => {}} />

                {/* Delivery Info */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                  <h2 className="text-xl font-bold mb-4">Delivery Information</h2>
                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="123 Main St, Apt 4B"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Instructions (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Leave at door, allergies, etc."
                        rows="3"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
                    >
                      {loading ? "Placing Order..." : "Continue to Payment"}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Payment</h2>
                <CheckoutForm orderId={selectedOrder.id} amount={finalTotal} onSuccess={handlePaymentSuccess} />
              </div>
            )}
          </div>

          {/* Order Total */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit sticky top-8 animate__animated animate__slideInRight">
            <h3 className="text-lg font-bold mb-4">Order Total</h3>
            <div className="space-y-2 text-gray-700 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold text-blue-600">
                <span>Total:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
