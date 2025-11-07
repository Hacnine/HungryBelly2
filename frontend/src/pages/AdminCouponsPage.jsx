"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCoupons, createCoupon } from "../store/couponSlice"

export function AdminCouponsPage() {
  const dispatch = useDispatch()
  const { list, loading } = useSelector((state) => state.coupons)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: 0,
    maxUses: null,
    expiresAt: "",
    minOrderValue: 0,
  })

  useEffect(() => {
    dispatch(fetchCoupons())
  }, [dispatch])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await dispatch(createCoupon(formData))
    setFormData({
      code: "",
      description: "",
      discountType: "PERCENTAGE",
      discountValue: 0,
      maxUses: null,
      expiresAt: "",
      minOrderValue: 0,
    })
    setShowForm(false)
    dispatch(fetchCoupons())
  }

  return (
    <div className="p-6 animate__animated animate__fadeIn">
      <div className="flex justify-between items-center mb-6 animate__animated animate__slideInDown">
        <h1 className="text-3xl font-bold">Manage Coupons</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? "Cancel" : "Create Coupon"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg animate__animated animate__slideInDown">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="px-3 py-2 border rounded"
            />
            <select
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              className="px-3 py-2 border rounded"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed ($)</option>
            </select>
            <input
              type="number"
              placeholder="Discount Value"
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: Number.parseFloat(e.target.value) })}
              className="px-3 py-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Max Uses (optional)"
              value={formData.maxUses || ""}
              onChange={(e) =>
                setFormData({ ...formData, maxUses: e.target.value ? Number.parseInt(e.target.value) : null })
              }
              className="px-3 py-2 border rounded"
            />
            <input
              type="number"
              placeholder="Min Order Value"
              value={formData.minOrderValue}
              onChange={(e) => setFormData({ ...formData, minOrderValue: Number.parseFloat(e.target.value) })}
              className="px-3 py-2 border rounded"
            />
            <input
              type="datetime-local"
              placeholder="Expires At (optional)"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              className="px-3 py-2 border rounded"
            />
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Create Coupon
          </button>
        </form>
      )}

      <div className="grid gap-4 animate__animated animate__fadeInUp">
        {loading ? (
          <p>Loading coupons...</p>
        ) : (
          list.map((coupon) => (
            <div key={coupon.id} className="p-4 border rounded-lg animate__animated animate__zoomIn">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{coupon.code}</h3>
                  <p className="text-gray-600">{coupon.description}</p>
                  <p className="text-sm mt-2">
                    {coupon.discountType === "PERCENTAGE"
                      ? `${coupon.discountValue}% off`
                      : `$${coupon.discountValue} off`}
                  </p>
                  {coupon.maxUses && (
                    <p className="text-sm text-gray-500">
                      Used: {coupon.usedCount} / {coupon.maxUses}
                    </p>
                  )}
                  {coupon.expiresAt && (
                    <p className="text-sm text-gray-500">Expires: {new Date(coupon.expiresAt).toLocaleDateString()}</p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded ${coupon.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {coupon.active ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
