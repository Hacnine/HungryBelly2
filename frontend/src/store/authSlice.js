import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../api/axiosInstance"

export const register = createAsyncThunk("auth/register", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/auth/register", credentials)
    localStorage.setItem("accessToken", data.accessToken)
    return data.user
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Registration failed")
  }
})

export const login = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.post("/auth/login", credentials)
    localStorage.setItem("accessToken", data.accessToken)
    return data.user
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Login failed")
  }
})

export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.post("/auth/logout")
    localStorage.removeItem("accessToken")
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Logout failed")
  }
})

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await axiosInstance.get("/auth/me")
    return data.user
  } catch (error) {
    return rejectWithValue(error.response?.data?.error || "Fetch user failed")
  }
})

const initialState = {
  user: null,
  isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        localStorage.setItem("isAuthenticated", "true")
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        localStorage.setItem("isAuthenticated", "true")
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.error = null
        localStorage.setItem("isAuthenticated", "false")
      })
      // Fetch current user
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        localStorage.setItem("isAuthenticated", "true")
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null
        state.isAuthenticated = false
        localStorage.setItem("isAuthenticated", "false")
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
