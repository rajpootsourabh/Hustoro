import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarDays } from 'lucide-react';
import TimeOffRequestModal from './TimeOffRequestModal';

export default function UpcomingTimeOff() {
    const [showModal, setShowModal] = useState(false);
    const [timeOffs, setTimeOffs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUpcomingTimeOff();
    }, []);

    const fetchUpcomingTimeOff = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/time-off-requests/upcoming`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
            });

            if (response.data.success) {
                const formatted = response.data.data.map(item => ({
                    ...item,
                    date: formatDate(item.date),
                    modifiedDate: formatDate(item.modifiedDate),
                }));
                setTimeOffs(formatted);
            }
        } catch (error) {
            console.error('Failed to fetch upcoming time off:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <>
            <div className="bg-white p-6 border border-gray-200 space-y-6 rounded-b-xl rounded-bl-xl rounded-br-xl">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold"> Upcoming Time Off</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="border border-teal-700 text-teal-700 px-4 py-[6px] rounded-full text-sm font-semibold hover:bg-teal-50">
                        Request Time Off
                    </button>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 font-semibold text-gray-700 border-b pb-2">
                    <div className="col-span-6 text-sm">Time Off</div>
                    <div className="col-span-3 text-sm">Status</div>
                    <div className="col-span-3 text-sm">Last Modified</div>
                </div>

                {/* Time Off Rows */}
                {loading ? (
                    Array.from({ length: 3 }).map((_, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-12 items-center border-b py-4 last:border-b-0 animate-pulse"
                        >
                            {/* Time Off Info Skeleton */}
                            <div className="col-span-6 flex items-start space-x-3">
                                <div className="w-5 h-5 bg-gray-300 rounded mt-1" />
                                <div className="space-y-2 w-full">
                                    <div className="h-3 w-32 bg-gray-300 rounded"></div>
                                    <div className="h-3 w-48 bg-gray-200 rounded"></div>
                                </div>
                            </div>

                            {/* Status Skeleton */}
                            <div className="col-span-3">
                                <div className="h-3 w-20 bg-gray-300 rounded"></div>
                            </div>

                            {/* Last Modified Skeleton */}
                            <div className="col-span-3 space-y-1">
                                <div className="h-3 w-24 bg-gray-300 rounded"></div>
                                <div className="h-2 w-20 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))
                ) : timeOffs.length === 0 ? (
                    <div className="text-sm text-gray-500 py-4">No upcoming time off.</div>
                ) : (
                    timeOffs.map((item, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-12 items-center text-sm text-gray-800 border-b py-4 last:border-b-0"
                        >
                            {/* Time Off Info */}
                            <div className="col-span-6 flex items-start space-x-3">
                                <CalendarDays className="w-5 h-5 text-gray-500 mt-0.5" />
                                <div>
                                    <div className="font-medium text-sm">{item.date}</div>
                                    {item.note ? (
                                        <div className="text-gray-600 text-sm">{item.note}</div>
                                    ) : (
                                        <div className="text-gray-600 text-sm">{item.title} {item.days}</div>
                                    )}
                                </div>
                            </div>

                            {/* Status */}
                            <div className="col-span-3 text-sm text-teal-700 font-semibold">
                                {item.status}
                            </div>

                            {/* Last Modified */}
                            <div className="col-span-3">
                                <div className="text-sm">{item.modifiedDate}</div>
                                <div className="text-gray-500 text-xs">By {item.modifiedBy}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <TimeOffRequestModal onClose={() => setShowModal(false)} />
            )}
        </>
    );
}
