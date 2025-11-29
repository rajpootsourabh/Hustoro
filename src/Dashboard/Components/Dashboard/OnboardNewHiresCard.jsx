import React, { useState, useEffect } from "react";
import { Rocket } from "lucide-react";
import StartOnboardingModal from "../Dashboard/StartOnboardingModal";
import axios from "axios";

// Avatar utility function
const getAvatarUrl = (employee) => {
  if (employee.avatar) {
    return employee.avatar;
  }
  const firstName = employee.first_name || "";
  const lastName = employee.last_name || "";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + " " + lastName)}&background=007a6e&color=fff&size=40`;
};

const OnboardNewHiresCard = () => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [hires, setHires] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOnboardingEmployees = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/employee/onboarding-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data?.data || [];

        if (Array.isArray(data) && data.length > 0) {
          const latestHires = data
            .slice(-4) // Get last 4 from the 10 fetched
            .reverse() // Reverse to show newest first
            .map((emp) => ({
              name: `${emp.first_name} ${emp.last_name}`,
              role: emp.job_title || "No role assigned",
              avatar: emp.profile_image,
              id: emp.id,
              first_name: emp.first_name,
              last_name: emp.last_name,
            }));

          setHires(latestHires);
        } else {
          setHires([]); // Set empty array instead of fallback hires
        }
      } catch (error) {
        console.error("Failed to fetch onboarding employees:", error);
        setHires([]); // Set empty array on error too
      } finally {
        setLoading(false);
      }
    };

    fetchOnboardingEmployees();
  }, []);

  const handleStartOnboarding = (employee) => {
    setSelectedEmployee(employee);
  };

  const handleCancel = () => setSelectedEmployee(null);

  return (
    <>
      <div className="bg-white rounded-xl shadow p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b">
          <div className="w-10 h-10 bg-[#007a6e] rounded-full flex items-center justify-center text-white">
            <Rocket className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold text-black">Onboard New Hires</h2>
        </div>

        {/* Separator line */}
        <hr className="border-gray-200" />

        {/* Section Title */}
        <p className="text-sm font-semibold text-[#0e079a] px-6 py-2">Employees</p>

        {/* Hires List or Skeleton */}
        <div className="divide-y">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-3 animate-pulse"
              >
                <div className="w-10 h-10 rounded-full bg-gray-300" />
                <div className="flex-1 space-y-2">
                  <div className="w-2/3 h-3 bg-gray-300 rounded" />
                  <div className="w-1/3 h-3 bg-gray-200 rounded" />
                </div>
              </div>
            ))
            : hires.length > 0 
              ? hires.map((hire) => (
                <div
                  key={hire.id}
                  className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleStartOnboarding(hire)}
                >
                  <img
                    src={getAvatarUrl(hire)}
                    alt={hire.name}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      // If the image fails to load, fall back to initials
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(hire.first_name + " " + hire.last_name)}&size=40`;
                    }}
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {hire.name}
                    </p>
                    <p className="text-sm text-gray-500">{hire.role}</p>
                  </div>
                </div>
              ))
              : (
                <div className="px-6 py-4 text-center text-gray-500">
                  No employees found
                </div>
              )
          }
        </div>
      </div>

      {/* Show Modal If Employee Selected */}
      {selectedEmployee && (
        <StartOnboardingModal
          candidateName={selectedEmployee.name}
          onCancel={handleCancel}
          onStart={(data) => {
            console.log("Onboarding Started for:", selectedEmployee.name, data);
            handleCancel();
          }}
        />
      )}
    </>
  );
};

export default OnboardNewHiresCard;