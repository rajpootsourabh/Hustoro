import React, { useState, useEffect } from "react";
import CalendarCard from "../Components/Dashboard/CalendarCard";
import JobsCard from "../Components/Dashboard/JobsCard";
import OnboardNewHiresCard from "../Components/Dashboard/OnboardNewHiresCard";
import TimeOffBalancesCard from "../Components/Dashboard/TimeOffBalancesCard";
import ProfileCard from "../Components/Dashboard/ProfileCard";
import NotificationsCard from "../Components/Dashboard/NotificationsCard";
import UpcomingTimeOffCard from "../Components/Dashboard/UpcomingTimeOffCard";
import TimeOffRequestReviewModal from "./Attendence/TimeOffRequestReviewModal";
import TimeOffApprovalStatusModal from "../Components/TimeOff/TimeOffApprovalStatusModal";
import ModalWrapper from "../Components/ModalWrapper";


export default function Dashboard() {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [modalType, setModalType] = useState(null); // 'review' | 'view'

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/notifications/unread`,
                    {
                        headers: {
                            Authorization: "Bearer " + localStorage.getItem("access_token"),
                        },
                    }
                );
                const data = await response.json();
                setNotifications(data.data || []);
            } catch (error) {
                console.error("Failed to fetch notifications", error);
            } finally {
                setIsLoading(false); // 👈 Done loading
            }
        };

        fetchNotifications();
    }, []);

    const handleNotificationClick = async (notif) => {
        try {
            const token = localStorage.getItem("access_token");
            if (!token) throw new Error("No access token found");

            let base = import.meta.env.VITE_API_BASE_URL;
            if (base.endsWith("/")) base = base.slice(0, -1);

            const url = `${base}/time-off-requests/${notif.time_off_request_id}`;
            const response = await fetch(url, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch leave data");

            const result = await response.json();
            const leave = result.data;

            const formatted = {
                ...leave,
                start: leave.start_date,
                end: leave.end_date,
                label: leave.time_off_type?.name || "Time Off",
                note: leave.note,
                status: leave.status,
                employee: {
                    name: `${leave.employee?.first_name || ""} ${leave.employee?.last_name || ""}`.trim(),
                    role: leave.employee?.role || "",
                    avatar: leave.employee?.profile_image
                        ? `${import.meta.env.VITE_API_BASE_URL}/${leave.employee.profile_image}`
                        : `https://ui-avatars.com/api/?name=${leave.employee?.first_name || "U"}`
                },
                requestedOn: leave.created_at,
            };

            setSelectedLeave(formatted);
            setModalType(formatted.status === "pending" ? "review" : "view");
        } catch (err) {
            console.error("Failed to fetch fresh leave data:", err);
        }
    };

    const closeModal = () => {
        setSelectedLeave(null);
        setModalType(null);
    };

    return (
        <div className="min-h-screen bg-[#F4F4F5] px-6 lg:px-24 py-12 space-y-6">
            {/* Greeting */}
            <div className="text-xl font-semibold text-[#1A1A1A] px-6 lg:px-0">
                Hello {localStorage.getItem("email")?.split("@")[0] || "User"}!
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
                {/* LEFT SIDE */}
                <div className="space-y-6">
                    <CalendarCard />
                    <JobsCard />
                    <OnboardNewHiresCard />
                    <TimeOffBalancesCard />
                </div>

                {/* RIGHT SIDE */}
                <div className="space-y-6">
                    <ProfileCard />
                    <NotificationsCard
                        notifications={notifications.slice(0, 5)}
                        onNotificationClick={handleNotificationClick}
                        isLoading={isLoading}
                    />
                    <UpcomingTimeOffCard />
                </div>
            </div>

            {/* MODALS */}
            {modalType === "review" && selectedLeave && (
                <ModalWrapper>
                    <TimeOffRequestReviewModal leave={selectedLeave} onClose={closeModal} />
                </ModalWrapper>
            )}

            {modalType === "view" && selectedLeave && (
                <ModalWrapper>
                    <TimeOffApprovalStatusModal leave={selectedLeave} onClose={closeModal} />
                </ModalWrapper>
            )}
        </div>
    );
}
