import { Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import './App.css'
import LandingPage from "./Pages/LandingPage";
import PricingPage from "./Pages/PricingPage";
import ProductsPage from "./Pages/ProductsPage";
import Signup from './Dashboard/Pages/Signup'
import Login from './Dashboard/Pages/Login'
import Dashboard from "./Dashboard/Pages/Dashboard";
import ScrollToTop from "./Components/ScrollToTop";
import Jobs from "./Dashboard/Pages/Jobs/Jobs";
import DashboardLayout from "./Dashboard/DashboardLayout";
import Candidates from "./Dashboard/Pages/Candidates";
import CreateJob from "./Dashboard/Pages/Jobs/CreateJob";
import Employee from "./Dashboard/Pages/Employee/Employee"
import CreateProfile from "./Dashboard/Pages/Employee/CreateProfile"
import EditProfileLayout from "./Dashboard/Pages/Employee/EditProfileLayout"

function App() {

  return (
    <>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Login />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/create-job" element={<CreateJob />} />
            <Route path="employee" element={<Employee />} />
            <Route path="candidates" element={<Candidates />} />
          </Route>
          {/* Special Route WITHOUT Navbar */}
          <Route path="/dashboard/employee/new" element={<CreateProfile />} />
          <Route path="/dashboard/employee/edit" element={<EditProfileLayout />} />
        </Routes>
      </Suspense>
    </>
  )
}

export default App
