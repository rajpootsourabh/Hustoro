import React from "react";
import { Clock, CheckCircle, XCircle, Ban } from "lucide-react";

const statusStyles = {
    pending: {
        icon: <Clock size={16} className="text-orange-700" />,
        textColor: "text-orange-700",
        bgColor: "bg-orange-100",
        label: "Pending",
    },
    approved: {
        icon: <CheckCircle size={16} className="text-teal-700" />,
        textColor: "text-teal-700",
        bgColor: "bg-teal-100",
        label: "Approved",
    },
    rejected: {
        icon: <XCircle size={16} className="text-red-600" />,
        textColor: "text-red-600",
        bgColor: "bg-red-100",
        label: "Rejected",
    },
    cancelled: {
        icon: <Ban size={16} className="text-gray-600" />,
        textColor: "text-gray-600",
        bgColor: "bg-gray-200",
        label: "Cancelled",
    },
};

const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

const getDaysCount = (fromDate, toDate) => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    const diffTime = end - start;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
};

export default function TimeOffSummary({ fromDate, toDate, type, status }) {
    const style = statusStyles[status];
    const daysCount = getDaysCount(fromDate, toDate);

    return (
        <div className="flex justify-between items-center border border-gray-300 rounded-lg px-4 py-3">
            <div className="text-sm text-gray-800">
                {formatDate(fromDate)} - {formatDate(toDate)}
                <div className={`text-sm font-medium ${style.textColor}`}>
                    {type} · {daysCount} days
                </div>
            </div>
            <div
                className={`text-sm flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold ${style.textColor} ${style.bgColor}`}
            >
                {style.icon}
                {style.label}
            </div>
        </div>
    );
}
