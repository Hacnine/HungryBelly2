import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetRestaurantBySlugQuery } from "../store/restaurantsApi";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { Star, Clock, DollarSign, MapPin, Phone, Heart, Share2, ChevronLeft, Filter } from "lucide-react";

export default function RestaurantDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: restaurant, isLoading, error } = useGetRestaurantBySlugQuery(slug);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dietaryFilter, setDietaryFilter] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-xl">Loading restaurant...</div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-600 text-xl mb-4">Restaurant not found</div>
        <button
          onClick={() => navigate("/restaurants")}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          Back to Restaurants
        </button>
      </div>
    );
  }

  // Get unique categories from menu items
  const categories = ["All", ...new Set(restaurant.foodItems?.map((item) => item.category) || [])];

  // Filter menu items
  const filteredItems = restaurant.foodItems?.filter((item) => {
    if (selectedCategory !== "All" && item.category !== selectedCategory) return false;
    if (dietaryFilter.vegetarian && !item.isVegetarian) return false;
    if (dietaryFilter.vegan && !item.isVegan) return false;
    if (dietaryFilter.glutenFree && !item.isGlutenFree) return false;
    return true;
  });

  const handleAddToCart = (item) => {
    dispatch(
      addToCart({
        ...item,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        quantity: 1,
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => navigate("/restaurants")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Back to Restaurants</span>
          </button>
        </div>
      </div>

      {/* Restaurant Header */}
      <div className="relative">
        <img
          src={restaurant.coverImage || "/placeholder-restaurant.jpg"}
          alt={restaurant.name}
          className="w-full h-64 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 text-white p-6">
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
            <p className="text-lg mb-3">{restaurant.description}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{restaurant.rating}</span>
                <span className="text-gray-300">({restaurant.totalRatings} ratings)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="w-5 h-5" />
                <span>{restaurant.avgDeliveryTime} min delivery</span>
              </div>
              <span>•</span>
              <span>{restaurant.priceRange}</span>
              <span>•</span>
              <span>${restaurant.deliveryFee} delivery fee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Info Bar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm text-gray-600">
              {restaurant.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant.address}</span>
                </div>
              )}
              {restaurant.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{restaurant.phone}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Heart className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar with Categories */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedCategory === category
                        ? "bg-orange-600 text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Dietary Filters */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Dietary
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dietaryFilter.vegetarian}
                      onChange={(e) =>
                        setDietaryFilter((prev) => ({ ...prev, vegetarian: e.target.checked }))
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dietaryFilter.vegan}
                      onChange={(e) =>
                        setDietaryFilter((prev) => ({ ...prev, vegan: e.target.checked }))
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Vegan</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={dietaryFilter.glutenFree}
                      onChange={(e) =>
                        setDietaryFilter((prev) => ({ ...prev, glutenFree: e.target.checked }))
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Gluten-Free</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-6">Menu</h2>
            {filteredItems && filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="flex">
                      <img
                        src={item.image || "/placeholder-food.jpg"}
                        alt={item.name}
                        className="w-32 h-32 object-cover"
                      />
                      <div className="flex-1 p-4">
                        <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                        <div className="flex items-center gap-2 mb-2 text-xs">
                          {item.isVegetarian && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                              Vegetarian
                            </span>
                          )}
                          {item.isVegan && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                              Vegan
                            </span>
                          )}
                          {item.isGlutenFree && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              Gluten-Free
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-orange-600">
                            ${item.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No items found matching your filters.
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {restaurant.reviews && restaurant.reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurant.reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={review.user.profileImage || "/default-avatar.png"}
                      alt={review.user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-bold">{review.user.name}</div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
