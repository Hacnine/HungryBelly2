import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import "./index.css"
import App from "./App"
import { store } from "./store/store"
import { AuthProvider } from "./context/AuthContext"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
)
