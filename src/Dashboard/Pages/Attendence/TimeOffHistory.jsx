import React from 'react';
import { CalendarDays } from 'lucide-react'; // Use any calendar icon you like

export default function TimeOffHistory() {
  const historyData = [
    {
      date: '10 January 2025',
      title: 'Winter Vacation',
      days: '5 days',
      status: 'Approved',
      modifiedDate: '12 January 2025',
      modifiedBy: 'HR Admin',
    },
    {
      date: '05 March 2025',
      title: 'Personal Leave',
      days: '2 days',
      status: 'Rejected',
      modifiedDate: '07 March 2025',
      modifiedBy: 'Manager',
    },
    {
      date: '20 April 2025',
      title: 'Medical Leave',
      days: '3 days',
      status: 'Cancelled',
      modifiedDate: '22 April 2025',
      modifiedBy: 'Employee',
    },
    {
      date: '15 May 2025',
      title: 'Conference',
      days: '1 day',
      status: 'Approved',
      modifiedDate: '16 May 2025',
      modifiedBy: 'HR Admin',
    },
  ];

  return (
    <div className="bg-white p-6 border border-gray-200 space-y-6 rounded-b-xl rounded-bl-xl rounded-br-xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Time Off History</h2>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 text-sm font-semibold text-gray-700 border-b pb-2">
        <div className="col-span-6 text-sm">Time Off</div>
        <div className="col-span-3 text-sm">Status</div>
        <div className="col-span-3 text-sm">Last Modified</div>
      </div>

      {/* History Rows */}
      {historyData.map((item, index) => (
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
          <div className={`col-span-3 font-semibold text-sm ${
            item.status === 'Approved'
              ? 'text-teal-700'
              : item.status === 'Rejected'
              ? 'text-red-600'
              : item.status === 'Cancelled'
              ? 'text-gray-500'
              : 'text-gray-700'
          }`}>
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
  );
}
