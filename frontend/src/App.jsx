
import { useEffect } from "react"
import { RouterProvider } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { DeliveryAddressProvider } from "./context/DeliveryAddressContext"
import { router } from "./routes/Routes"
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function App() {
  // Auth is now handled by AuthProvider and RTK Query
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <AuthProvider>
      <DeliveryAddressProvider>
        <RouterProvider router={router} />
      </DeliveryAddressProvider>
    </AuthProvider>
  )
}
