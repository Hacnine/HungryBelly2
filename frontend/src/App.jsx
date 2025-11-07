
import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import AOS from 'aos';
import 'aos/dist/aos.css';
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import ProfilePage from "./pages/ProfilePage"
import CheckoutPage from "./pages/CheckoutPage"
import OrderTrackingPage from "./pages/OrderTrackingPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"
import Navbar from "./components/Home/Header/Navbar"
import Footer from "./components/Footer/Footer"
import Home from "./components/Home/Home"
import About from "./components/About/AboutPage"
import Portfolio from "./components/Portfolio/Portfolio"
import Clients from "./components/Clients/Clients"
import Blog from "./components/Blog/Blog"
import Contact from "./components/Contact/Contact"
import OrderList from "./components/Order/OrderList"

function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />
  }

  return children
}

export default function App() {
  // Auth is now handled by AuthProvider and RTK Query
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/client" element={<Clients />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/order" element={<OrderList />} />
        <Route path="/admin" element={<AdminDashboardPage />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:orderId"
          element={
            <ProtectedRoute>
              <OrderTrackingPage />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="user">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
      <Footer />
    </Router>
  )
}
