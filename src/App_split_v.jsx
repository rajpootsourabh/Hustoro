import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import "./App.css";
import ScrollToTop from "./Components/ScrollToTop";

// Dynamically import components based on the build target
let LandingPage, PricingPage, ProductsPage, Signup, Login, Dashboard;

if (import.meta.env.MODE === "development" || __BUILD_TARGET__ === "website") {
  LandingPage = lazy(() => import("./Pages/LandingPage"));
  PricingPage = lazy(() => import("./Pages/PricingPage"));
  ProductsPage = lazy(() => import("./Pages/ProductsPage"));
}

if (import.meta.env.MODE === "development" || __BUILD_TARGET__ === "dashboard") {
  Signup = lazy(() => import("./Dashboard/Pages/Signup"));
  Login = lazy(() => import("./Dashboard/Pages/Login"));
  Dashboard = lazy(() => import("./Dashboard/Pages/Dashboard"));
}

function App() {
  return (
    <>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <ScrollToTop />
        <Routes>
          {/* Render all routes in development mode */}
          {import.meta.env.MODE === "development" ? (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </>
          ) : __BUILD_TARGET__ === "website" ? (
            <>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/products" element={<ProductsPage />} />
            </>
          ) : (
            <>
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </>
          )}
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
