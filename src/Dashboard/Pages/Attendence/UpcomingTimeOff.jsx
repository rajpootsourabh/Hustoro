import React, { useState } from 'react';
import { CalendarDays } from 'lucide-react'; // You can replace with any calendar icon you prefer
import TimeOffRequestModal from './TimeOffRequestModal';

export default function UpcomingTimeOff() {
    const [showModal, setShowModal] = useState(false); // State to toggle modal

    const timeOffs = [
        {
            date: '17 February 2025',
            title: 'George Washington’s Birthday',
            days: '1 day',
            status: 'Approved',
            modifiedDate: '20 December 2025',
            modifiedBy: 'George',
        },
        {
            date: '17 February 2025',
            title: 'George Washington’s Birthday',
            days: '1 day',
            status: 'Approved',
            modifiedDate: '20 December 2025',
            modifiedBy: 'George',
        },
        {
            date: '17 February 2025',
            title: 'George Washington’s Birthday',
            days: '1 day',
            status: 'Approved',
            modifiedDate: '20 December 2025',
            modifiedBy: 'George',
        },
        {
            date: '17 February 2025',
            title: 'George Washington’s Birthday',
            days: '1 day',
            status: 'Approved',
            modifiedDate: '20 December 2025',
            modifiedBy: 'George',
        },
    ];

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
                    <div className="col-span-6  text-sm">Time Off</div>
                    <div className="col-span-3  text-sm">Status</div>
                    <div className="col-span-3  text-sm">Last Modified</div>
                </div>

                {/* Time Off Rows */}
                {timeOffs.map((item, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-12 items-center text-sm text-gray-800 border-b py-4 last:border-b-0"
                    >
                        {/* Time Off Info */}
                        <div className="col-span-6 flex items-start space-x-3">
                            <CalendarDays className="w-5 h-5 text-gray-500 mt-0.5" />
                            <div>
                                <div className="font-medium text-sm">{item.date}</div>
                                <div className="text-gray-600 text-sm">{item.title} {item.days}</div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-3 text-sm text-teal-700 font-semibold">
                            {item.status}
                        </div>

                        {/* Last Modified */}
                        <div className="col-span-3">
                            <div className='text-sm'>{item.modifiedDate}</div>
                            <div className="text-gray-500 text-xs">By {item.modifiedBy}</div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Modal */}
            {showModal && (
                <TimeOffRequestModal onClose={() => setShowModal(false)} />
            )}
        </>
    );
}
