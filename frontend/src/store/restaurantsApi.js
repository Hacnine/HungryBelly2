import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const restaurantsApi = createApi({
  reducerPath: "restaurantsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/restaurants`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Restaurant"],
  endpoints: (builder) => ({
    // Get all restaurants with filters
    getRestaurants: builder.query({
      query: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return { url: `/?${queryString}`, method: "GET" };
      },
      providesTags: ["Restaurant"],
    }),
    
    // Get featured restaurants
    getFeaturedRestaurants: builder.query({
      query: () => ({ url: `/featured`, method: "GET" }),
      providesTags: ["Restaurant"],
    }),
    
    // Get restaurant by slug
    getRestaurantBySlug: builder.query({
      query: (slug) => ({ url: `/slug/${slug}`, method: "GET" }),
      providesTags: (result, error, slug) => [{ type: "Restaurant", id: slug }],
    }),
    
    // Get restaurant menu
    getRestaurantMenu: builder.query({
      query: ({ id, ...params }) => {
        const queryString = new URLSearchParams(params).toString();
        return { url: `/${id}/menu?${queryString}`, method: "GET" };
      },
      providesTags: (result, error, { id }) => [{ type: "Restaurant", id: `menu-${id}` }],
    }),
    
    // Create restaurant (owner)
    createRestaurant: builder.mutation({
      query: (body) => ({ url: `/`, method: "POST", body }),
      invalidatesTags: ["Restaurant"],
    }),
    
    // Update restaurant
    updateRestaurant: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/${id}`, method: "PUT", body }),
      invalidatesTags: (result, error, { id }) => [{ type: "Restaurant", id }],
    }),
    
    // Get my restaurants (owner)
    getMyRestaurants: builder.query({
      query: () => ({ url: `/my/restaurants`, method: "GET" }),
      providesTags: ["Restaurant"],
    }),
    
    // Get restaurant analytics
    getRestaurantAnalytics: builder.query({
      query: ({ id, startDate, endDate }) => {
        const params = new URLSearchParams();
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        return { url: `/${id}/analytics?${params.toString()}`, method: "GET" };
      },
    }),
    
    // Verify restaurant (admin)
    verifyRestaurant: builder.mutation({
      query: ({ id, isVerified, isActive }) => ({
        url: `/${id}/verify`,
        method: "PATCH",
        body: { isVerified, isActive },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Restaurant", id }],
    }),
  }),
});

export const {
  useGetRestaurantsQuery,
  useGetFeaturedRestaurantsQuery,
  useGetRestaurantBySlugQuery,
  useGetRestaurantMenuQuery,
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
  useGetMyRestaurantsQuery,
  useGetRestaurantAnalyticsQuery,
  useVerifyRestaurantMutation,
} = restaurantsApi;
