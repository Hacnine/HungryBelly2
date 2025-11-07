import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    // Call backend directly; use VITE_API_URL in .env or default to localhost:4000
    baseUrl: `${API_URL}/auth`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({ url: "/login", method: "POST", body }),
    }),
    register: builder.mutation({
      query: (body) => ({ url: "/register", method: "POST", body }),
    }),
    logout: builder.mutation({
      query: () => ({ url: "/logout", method: "POST" }),
    }),
    fetchCurrentUser: builder.query({
      query: () => ({ url: "/me", method: "GET" }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useFetchCurrentUserQuery,
} = authApi;
