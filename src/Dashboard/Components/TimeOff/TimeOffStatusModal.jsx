import React from 'react';
import { X, CheckCircle } from 'lucide-react';

export default function TimeOffStatusModal({ leave, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative space-y-4">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                    <X size={24} />
                </button>

                {/* Title */}
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold">Approved Time-Off Request</h2>
                    <p className="text-gray-500 text-sm">
                        Vineet Anand (Scrum Master) . Requested on 20 jan 2025
                    </p>
                </div>

                {/* Date Range + Status */}
                <div className="flex justify-between items-center border border-gray-400 rounded-lg px-4 py-3">
                    <div className="text-sm text-gray-800">
                        Monday 20 January 2025 - Saturday 01 February 2025
                        <div className="text-sm text-teal-700 font-medium">
                            Paid time off . 9 days
                        </div>
                    </div>
                    <div className="text-sm flex items-center gap-2 bg-teal-700 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                        <CheckCircle size={16} />
                        Approved
                    </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-base font-semibold">Breakdown</h3>
                        <button className="text-sm font-medium text-gray-500">
                            Show all days
                        </button>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-md">
                        <div className="flex">
                            {/* LINE column */}
                            <div className="flex flex-col items-center px-2">
                                {/* Top dot */}
                                <div className="w-3 h-3 bg-gray-500 rounded-full" />
                                {/* Full vertical dashed line */}
                                <div className="flex-1 border-l-2 border-dashed border-gray-400" />
                                {/* Bottom dot */}
                                <div className="w-3 h-3 bg-gray-500 rounded-full" />
                            </div>

                            {/* Content column */}
                            <div className="flex-1 space-y-8 text-sm text-gray-700">
                                {/* From */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-gray-600 text-sm">From</div>
                                        <div className="text-sm text-black">Monday 20 January 2025</div>
                                    </div>
                                    <div className="text-sm text-gray-600">0 Days</div>
                                </div>

                                {/* Between */}
                                <div className="text-sm text-gray-500">11 days in between</div>

                                {/* To */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-sm text-gray-600">To</div>
                                        <div className="text-sm text-black">Saturday 1 February 2025</div>
                                    </div>
                                    <div className="text-sm text-gray-600">0 Days</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Request Timeline */}
                <div className="space-y-3">
                    <h3 className="text-base font-semibold">Request Timeline</h3>
                    <div className="flex items-center gap-3">
                        <img
                            src="https://randomuser.me/api/portraits/men/32.jpg" // placeholder img - replace with real image URL
                            alt="User"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                            <div className="text-sm font-medium text-black">
                                Vineet Anand (Scrum Master)
                            </div>
                            <div className="text-sm text-gray-500">20 January 2025</div>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <div className="pt-2">
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
