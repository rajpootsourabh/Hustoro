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
import ViewProfile from "./Dashboard/Pages/Employee/ViewProfile"
import NotFound from "./Pages/NotFoundPage";
import Candidate from "./Dashboard/Pages/Candidates/Candidates";
import FindCandidates from "./Dashboard/Pages/Candidates/FindCandidates";
import CandidateProfile from "./Dashboard/Pages/Candidates/CandidateProfile";
import JobPreview from "./Dashboard/Pages/Jobs/JobPreview";
import ProfilePage from "./Dashboard/Pages/ProfilePage";
import SettingsLayout from "./Dashboard/Pages/SettingsLayout";
import TimeOffTypeModal from "./Dashboard/Pages/Attendence/TimeOffRequestModal";
import TimeOff from "./Dashboard/Pages/Attendence/TimeOff";


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

          {/* Protected Routes inside Layout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            {/* Dashboard Home */}
            <Route index element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<ProfilePage />} />
            <Route path="/dashboard/settings" element={<SettingsLayout />} />
            {/* Jobs Management */}
            <Route path="jobs" element={<Jobs />} />
            <Route path="jobs/new" element={<CreateJob />} />
            <Route path="jobs/edit/:id" element={<CreateJob />} />
            <Route path="jobs/overview/:id" element={<JobPreview />} />
            <Route path="jobs/:jobId/candidates" element={<FindCandidates />} />
            {/* Employees Management */}
            <Route path="employees" element={<Employee />} />
            <Route path="/dashboard/employee/new" element={<CreateProfile />} />
            <Route path="/dashboard/employee/:employeeId/edit" element={<CreateProfile />} />
            <Route path="/dashboard/employee/:id/view" element={<ViewProfile />} />
            <Route path="candidates" element={<Candidate />} />
            <Route path="candidates/profile/:id" element={<CandidateProfile />} />

             <Route path="attendence" element={<TimeOff />} />
             <Route path="/dashboard/attendence/modal" element={<TimeOffTypeModal />} />
          </Route>

          {/* Catch-all route for 404 page */}
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Suspense>

    </>
  )
}

export default App



