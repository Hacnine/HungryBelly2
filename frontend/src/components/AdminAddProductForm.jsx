import React, { useState } from "react";
import { useCreateFoodItemMutation } from "../store/foodItemsApi";

const initialState = {
  name: "",
  description: "",
  category: "",
  subcategory: "",
  price: "",
  discount: 0,
  ingredients: [{ name: "", quantity: "" }],
  nutrition: { calories: "", protein: "", fat: "", carbs: "", sugar: "", fiber: "" },
  stock: 0,
  isAvailable: true,
  image: "",
  tags: [],
  preparationTime: 0,
};

export default function AdminAddProductForm() {
  const [form, setForm] = useState(initialState);
  const [message, setMessage] = useState("");
  const [createFoodItem, { isLoading, error }] = useCreateFoodItemMutation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleIngredientChange = (idx, e) => {
    const { name, value } = e.target;
    const newIngredients = [...form.ingredients];
    newIngredients[idx][name] = value;
    setForm({ ...form, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setForm({ ...form, ingredients: [...form.ingredients, { name: "", quantity: "" }] });
  };

  const handleNutritionChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, nutrition: { ...form.nutrition, [name]: value } });
  };

  const handleTagsChange = (e) => {
    setForm({ ...form, tags: e.target.value.split(",").map((t) => t.trim()) });
  };

  const removeIngredient = (idx) => {
    const newIngredients = form.ingredients.filter((_, i) => i !== idx);
    setForm({ ...form, ingredients: newIngredients });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await createFoodItem(form).unwrap();
      setMessage("Product added successfully!");
      setForm(initialState);
    } catch (err) {
      setMessage(err.data?.error || "Error adding product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Add New Product</h2>
        <p className="text-gray-600">Fill in the details to add a new food item to your menu.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., Margherita Pizza"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-orange focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g., Pizza, Burger"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-orange focus:border-transparent transition"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the product..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-orange focus:border-transparent transition resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
              <input
                name="subcategory"
                value={form.subcategory}
                onChange={handleChange}
                placeholder="e.g., Vegetarian"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-orange focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-orange focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        {/* Pricing and Availability */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Pricing & Availability</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-orange focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
              <input
                name="discount"
                type="number"
                min="0"
                max="100"
                value={form.discount}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-orange focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-orange focus:border-transparent transition"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <input
              name="isAvailable"
              type="checkbox"
              checked={form.isAvailable}
              onChange={handleChange}
              className="h-4 w-4 text-admin-orange focus:ring-admin-orange border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Available for order</label>
          </div>
        </div>

        {/* Ingredients */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Ingredients</h3>
          <div className="space-y-3">
            {form.ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <input
                  name="name"
                  value={ing.name}
                  onChange={(e) => handleIngredientChange(idx, e)}
                  placeholder="Ingredient name"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-orange focus:border-transparent transition"
                />
                <input
                  name="quantity"
                  value={ing.quantity}
                  onChange={(e) => handleIngredientChange(idx, e)}
                  placeholder="Quantity"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-orange focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(idx)}
                  className="px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addIngredient}
            className="mt-4 px-4 py-2 bg-admin-orange text-white rounded-lg hover:bg-orange-600 transition"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Nutrition */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Nutrition Facts (per serving)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(form.nutrition).map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                <input
                  name={key}
                  value={form.nutrition[key]}
                  onChange={handleNutritionChange}
                  placeholder={`e.g., 250 ${key === 'calories' ? 'kcal' : 'g'}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-orange focus:border-transparent transition"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Additional Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                name="tags"
                value={form.tags.join(", ")}
                onChange={handleTagsChange}
                placeholder="e.g., spicy, vegan, popular"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-orange focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preparation Time (minutes)</label>
              <input
                name="preparationTime"
                type="number"
                min="0"
                value={form.preparationTime}
                onChange={handleChange}
                placeholder="30"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-admin-orange focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setForm(initialState)}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-admin-orange to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isLoading ? "Adding Product..." : "Add Product"}
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-4 rounded-lg text-center ${message.includes("successfully") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
