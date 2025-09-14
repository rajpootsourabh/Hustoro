import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileCard = () => {
  const [teammates, setTeammates] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const employeeId = localStorage.getItem("employeeId");
    const token = localStorage.getItem("access_token");

    const fetchAllData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [subRes, detailRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/employee/${employeeId}/subordinates`, { headers }),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/employee/${employeeId}/details`, { headers }),
        ]);

        const subordinates = subRes?.data?.subordinates || [];
        const formattedTeammates = subordinates.map((emp) => ({
          id: emp.id,
          name: `${emp.first_name} ${emp.last_name}`,
          title: emp.job_title || "Employee",
          image: emp.profile_image || `https://api.dicebear.com/6.x/initials/svg?seed=${emp.first_name}`,
        }));

        setTeammates(formattedTeammates);
        setEmployee(detailRes?.data?.data || null);
      } catch (err) {
        console.error("Error fetching profile card data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const initials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleTeammateClick = (id) => {
    navigate(`/dashboard/employee/${id}/view`);
  };

  return (
    <div className="bg-[#007A6E] text-white rounded-2xl shadow px-6 py-12 space-y-5 w-full max-w-sm mx-auto">
      {/* Profile Image or Initials */}
      {employee?.profile_image ? (
        <img
          src={employee.profile_image}
          alt={employee.first_name}
          className="w-16 h-16 rounded-full mx-auto object-cover"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-white text-[#007A6E] text-xl font-bold flex items-center justify-center mx-auto">
          {initials(`${employee?.first_name || ""} ${employee?.last_name || ""}`)}
        </div>
      )}

      {/* Name, Job Title, Company, Address */}
      <div className="text-center space-y-1">
        {employee?.first_name && (
          <p className="text-lg font-bold">
            {employee?.preferred_name || `${employee?.first_name} ${employee?.last_name}`}
          </p>
        )}
        {employee?.job_detail?.job_title && (
          <p className="text-sm font-medium">{employee?.job_detail?.job_title}</p>
        )}
        {employee?.company?.name && (
          <p className="text-xs text-white/70">{employee?.company?.name}</p>
        )}
        {employee?.address && (
          <p className="text-xs text-white/70">{employee.address}</p>
        )}
      </div>

      {/* Manager Section */}
      {employee?.job_detail?.manager?.name && (
        <div className="bg-[#00B5A0] p-3 rounded-xl space-y-2">
          <p className="text-sm font-semibold text-white">Manager</p>
          <div className="flex items-center gap-3">
            <img
              src={`https://api.dicebear.com/6.x/initials/svg?seed=${employee.job_detail.manager.name}`}
              alt="Manager"
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold text-white">{employee.job_detail.manager.name}</p>
              <p className="text-xs text-white/70">Manager</p>
            </div>
          </div>
        </div>
      )}

      {/* Teammates Section */}
      {(loading || teammates.length > 0) && (
        <div className="bg-[#00B5A0] p-3 rounded-xl space-y-2">
          <p className="text-sm font-semibold text-white">Teammates</p>
          <div className="max-h-[160px] overflow-y-auto pr-1 scrollbar-enhanced space-y-2">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-white/30" />
                  <div className="space-y-1">
                    <div className="w-24 h-3 bg-white/30 rounded" />
                    <div className="w-16 h-3 bg-white/20 rounded" />
                  </div>
                </div>
              ))
            ) : (
              teammates.map((tm, idx) => (
                <div key={idx}>
                  <div
                    onClick={() => handleTeammateClick(tm.id)}
                    className="cursor-pointer flex items-center gap-3 p-2 rounded-md hover:bg-[#00a390] transition"
                  >
                    <img
                      src={tm.image}
                      alt={tm.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">{tm.name}</p>
                      <p className="text-xs text-white/70">{tm.title}</p>
                    </div>
                  </div>

                  {/* Separator except for the last item */}
                  {idx !== teammates.length - 1 && (
                    <div className="border-t border-white/20 mx-2" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
