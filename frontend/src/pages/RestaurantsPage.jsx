import { useState } from "react";
import { useGetRestaurantsQuery, useGetFeaturedRestaurantsQuery } from "../store/restaurantsApi";
import { useNavigate } from "react-router-dom";
import { Star, Clock, DollarSign, MapPin, Search, Filter, TrendingUp } from "lucide-react";

export default function RestaurantsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    search: "",
    cuisine: "",
    priceRange: "",
    rating: "",
    sortBy: "rating",
  });

  const { data: restaurantsData, isLoading, error } = useGetRestaurantsQuery(filters);
  const { data: featured } = useGetFeaturedRestaurantsQuery();

  const [showFilters, setShowFilters] = useState(false);

  const cuisineOptions = ["Italian", "Chinese", "Japanese", "Mexican", "Indian", "American", "Thai", "Mediterranean"];
  const priceRanges = ["$", "$$", "$$$", "$$$$"];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      search: "",
      cuisine: "",
      priceRange: "",
      rating: "",
      sortBy: "rating",
    });
  };

  const handleRestaurantClick = (slug) => {
    navigate(`/restaurants/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Discover Amazing Restaurants</h1>
          <p className="text-xl mb-6">Order from the best restaurants in your area</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search restaurants, cuisines..."
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Restaurants */}
      {featured && featured.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-orange-600" />
            <h2 className="text-2xl font-bold">Featured Restaurants</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {featured.map((restaurant) => (
              <div
                key={restaurant.id}
                onClick={() => handleRestaurantClick(restaurant.slug)}
                className="flex-shrink-0 w-64 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              >
                <img
                  src={restaurant.coverImage || "/placeholder-restaurant.jpg"}
                  alt={restaurant.name}
                  className="w-full h-32 object-cover rounded-t-lg"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{restaurant.rating} ({restaurant.totalRatings})</span>
                    <span>•</span>
                    <span>{restaurant.priceRange}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.avgDeliveryTime} min</span>
                    <span>•</span>
                    <span>${restaurant.deliveryFee} delivery</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-600 hover:underline"
                >
                  Clear
                </button>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="totalOrders">Most Popular</option>
                  <option value="newest">Newest</option>
                </select>
              </div>

              {/* Cuisine Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Cuisine</label>
                <select
                  value={filters.cuisine}
                  onChange={(e) => handleFilterChange("cuisine", e.target.value)}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">All Cuisines</option>
                  {cuisineOptions.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="flex gap-2">
                  {priceRanges.map((price) => (
                    <button
                      key={price}
                      onClick={() =>
                        handleFilterChange("priceRange", filters.priceRange === price ? "" : price)
                      }
                      className={`px-3 py-1 rounded-lg border ${
                        filters.priceRange === price
                          ? "bg-orange-600 text-white border-orange-600"
                          : "bg-white text-gray-700 border-gray-300 hover:border-orange-600"
                      }`}
                    >
                      {price}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange("rating", e.target.value)}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>

              {/* Dietary Filters */}
              <div>
                <label className="block text-sm font-medium mb-2">Dietary Options</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.isVegetarian === "true"}
                      onChange={(e) =>
                        handleFilterChange("isVegetarian", e.target.checked ? "true" : "")
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Vegetarian</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.isVegan === "true"}
                      onChange={(e) =>
                        handleFilterChange("isVegan", e.target.checked ? "true" : "")
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Vegan</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.isHalal === "true"}
                      onChange={(e) =>
                        handleFilterChange("isHalal", e.target.checked ? "true" : "")
                      }
                      className="rounded"
                    />
                    <span className="text-sm">Halal</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading restaurants...</div>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">
                Failed to load restaurants. Please try again.
              </div>
            ) : restaurantsData?.restaurants?.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No restaurants found. Try adjusting your filters.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurantsData?.restaurants?.map((restaurant) => (
                    <div
                      key={restaurant.id}
                      onClick={() => handleRestaurantClick(restaurant.slug)}
                      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                    >
                      <div className="relative">
                        <img
                          src={restaurant.coverImage || "/placeholder-restaurant.jpg"}
                          alt={restaurant.name}
                          className="w-full h-48 object-cover"
                        />
                        {restaurant.isFeatured && (
                          <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded text-xs font-bold">
                            FEATURED
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-lg">{restaurant.name}</h3>
                          <span className="text-gray-600 font-medium">{restaurant.priceRange}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {restaurant.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{restaurant.rating}</span>
                            <span className="text-gray-400">({restaurant.totalRatings})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{restaurant.avgDeliveryTime} min</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">
                            ${restaurant.deliveryFee} delivery
                          </span>
                          <span className="text-gray-600">
                            Min: ${restaurant.minOrderAmount}
                          </span>
                        </div>
                        {restaurant.tags && restaurant.tags.length > 0 && (
                          <div className="flex gap-2 mt-3 flex-wrap">
                            {restaurant.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {restaurantsData?.pagination && restaurantsData.pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button
                      onClick={() => handleFilterChange("page", filters.page - 1)}
                      disabled={filters.page === 1}
                      className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                      Page {filters.page} of {restaurantsData.pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handleFilterChange("page", filters.page + 1)}
                      disabled={filters.page === restaurantsData.pagination.totalPages}
                      className="px-4 py-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
