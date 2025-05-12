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
import CreateJob from "./Dashboard/Pages/Jobs/CreateJob";
import Employee from "./Dashboard/Pages/Employee/Employee"
import CreateProfile from "./Dashboard/Pages/Employee/CreateProfile"
import EmployeeProfileForm from "./Dashboard/Pages/Employee/EmployeeProfileForm"
import NotFound from "./Pages/NotFoundPage";
import Candidate from "./Dashboard/Pages/Candidates/Candidates";


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

            {/* Dashboard Home */}
            <Route index element={<Dashboard />} />

            {/* Jobs Management */}
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/new" element={<CreateJob />} />

            {/* Employees Management */}
            <Route path="employees" element={<Employee />} />
            <Route path="candidates" element={<Candidate />} />
          </Route>

          {/* Special Route WITHOUT Navbar */}
          <Route path="/dashboard/employee/new" element={<EmployeeProfileForm />} />
          <Route path="/dashboard/employee/:employeeId/edit" element={<EmployeeProfileForm />} />

          {/* Catch-all route for 404 page */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Suspense>

    </>
  )
}

export default App



