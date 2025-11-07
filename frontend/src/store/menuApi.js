import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const menuApi = createApi({
  reducerPath: "menuApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/menu`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Menu"],
  endpoints: (builder) => ({
    getMenu: builder.query({
      query: () => ({ url: `/`, method: "GET" }),
      providesTags: ["Menu"],
    }),
    getMenuItem: builder.query({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
      providesTags: ["Menu"],
    }),
    createMenuItem: builder.mutation({
      query: (body) => ({ url: `/`, method: "POST", body }),
      invalidatesTags: ["Menu"],
    }),
    updateMenuItem: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/${id}`, method: "PUT", body }),
      invalidatesTags: ["Menu"],
    }),
    deleteMenuItem: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: ["Menu"],
    }),
  }),
});

export const {
  useGetMenuQuery,
  useGetMenuItemQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} = menuApi;
