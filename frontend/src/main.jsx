import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";

function Init() {
  const initializeUser = useAuthStore((s) => s.initializeUser);

  useEffect(() => {
    initializeUser();
  }, []);

  return <App />;
}


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Init />
      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 4000,
          style: {
            background: "linear-gradient(135deg, #1a1a1f 0%, #2a2a32 100%)",
            color: "white",
            padding: "16px 20px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
            border: "1px solid rgba(59, 130, 246, 0.2)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)",
            backdropFilter: "blur(10px)",
          },
          success: {
            style: {
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "white",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#10b981",
            },
          },
          error: {
            style: {
              background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "white",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#ef4444",
            },
          },
          loading: {
            style: {
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              color: "white",
            },
          },
        }}
        containerStyle={{
          top: 20,
          right: 20,
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
