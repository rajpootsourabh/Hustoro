import React, { useState } from 'react';
import { X } from 'lucide-react';
import TimeOffBreakdown from './TimeOffBreakdown';
import TimeOffSummary from '../../Pages/Attendence/TimeOffSummary';

export default function TimeOffApprovalStatusModal({ leave, onClose }) {
    const [showAllDays, setShowAllDays] = useState(false);

    const fromDate = new Date(leave.start);
    const toDate = new Date(leave.end);
    const requestedOn = leave.requestedOn ? new Date(leave.requestedOn) : null;
    const employee = leave.employee;

    const formatDate = (date) =>
        date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg max-w-lg w-full h-[90vh] flex flex-col shadow-lg relative overflow-hidden">

                {/* Close (X) Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black z-20"
                >
                    <X size={24} />
                </button>

                {/* Fixed Header */}
                <div className="p-6 space-y-1 border-b border-gray-200 bg-white z-10">
                    <h2 className="text-lg font-semibold">
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)} Time-Off Request
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {employee?.name}
                        {employee?.role && ` (${employee.role})`}
                        {requestedOn && ` · Requested on ${formatDate(requestedOn)}`}
                    </p>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                    <TimeOffSummary
                        fromDate={fromDate}
                        toDate={toDate}
                        type={leave.label}
                        status={leave.status}
                    />

                    <TimeOffBreakdown
                        fromDate={fromDate}
                        toDate={toDate}
                        showAllDays={showAllDays}
                        onToggle={() => setShowAllDays(!showAllDays)}
                    />

                    {/* Request Timeline */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold">Request Timeline</h3>
                        <div className="flex items-center gap-3">
                            <img
                                src={employee.avatar}
                                alt={employee.name}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                                <div className="text-sm font-medium text-black">
                                    {employee.name} ({employee.role})
                                </div>
                                <div className="text-sm text-gray-500">{formatDate(new Date(leave.start))}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="p-4 border-t border-gray-200 bg-white z-10">
                    <button
                        onClick={onClose}
                        className="block w-full bg-teal-700 text-white text-sm font-semibold py-2 rounded-full hover:bg-teal-800"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
