import React, { useState } from "react";
import { X } from "lucide-react";
import TimeOffBreakdown from "../../Components/TimeOff/TimeOffBreakdown";
import TimeOffSummary from "./TimeOffSummary";
import ActionButton from "../../Components/ActionButton";
import { useSnackbar } from "../../Components/SnackbarContext";

export default function TimeOffRequestReviewModal({ leave, onClose }) {
    const [showAllDays, setShowAllDays] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittingAction, setSubmittingAction] = useState(null);
    const { showSnackbar } = useSnackbar();

    const fromDate = new Date(leave?.start);
    const toDate = new Date(leave?.end);
    const requestedOn = new Date(leave?.created_at || leave?.requestedOn || leave?.start);

    const formatDate = (date) =>
        date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    const handleStatusUpdate = async (status) => {
        try {
            setIsSubmitting(true);
            setSubmittingAction(status);

            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/time-off-requests/${leave.id}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + localStorage.getItem('access_token'),
                    },
                    body: JSON.stringify({ status }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update status");
            }

            const data = await response.json();
            console.log("Success:", data);
            showSnackbar(`Request ${status} successfully`, "success"); // ✅ optional success feedback
            onClose();
        } catch (error) {
            console.error("Error updating status:", error);
            showSnackbar(error.message || "Please fix all mandatory fields", "error"); // ✅ show error message
        } finally {
            setIsSubmitting(false);
            setSubmittingAction(null);
        }
    };



    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg w-full max-w-xl h-[90vh] flex flex-col shadow-lg overflow-hidden relative">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black z-20"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-white z-10">
                    <h2 className="text-xl font-semibold text-gray-900">Review time-off request</h2>
                    <p className="text-sm text-gray-500">
                        {leave?.employee?.name || "Unknown"} · Requested on {formatDate(requestedOn)}
                    </p>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                    <TimeOffSummary
                        fromDate={fromDate}
                        toDate={toDate}
                        type={leave?.label || "Time Off"}
                        status={leave?.status || "pending"}
                        daysCount={Math.ceil((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1}
                    />

                    <TimeOffBreakdown
                        fromDate={fromDate}
                        toDate={toDate}
                        showAllDays={showAllDays}
                        onToggle={() => setShowAllDays(!showAllDays)}
                    />
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 flex justify-end gap-3 bg-white z-10">
                    <button
                        onClick={onClose}
                        className="text-sm font-medium text-gray-700 hover:text-black"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>

                    <ActionButton
                        label="Reject"
                        onClick={() => handleStatusUpdate("rejected")}
                        isLoading={isSubmitting && submittingAction === "rejected"}
                        disabled={isSubmitting}
                        className="h-[38px] px-[20px] bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
                        labelClassName="text-sm"
                    />

                    <ActionButton
                        label="Approve"
                        onClick={() => handleStatusUpdate("approved")}
                        isLoading={isSubmitting && submittingAction === "approved"}
                        disabled={isSubmitting}
                        className="h-[38px] px-[20px] disabled:opacity-50"
                        labelClassName="text-sm"
                    />
                </div>
            </div>
        </div>
    );
}
