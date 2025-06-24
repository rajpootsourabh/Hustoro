import React, { useState } from 'react';
import TimeOffRequestModal from './TimeOffRequestModal';


export default function LeaveBalance() {
  const [showModal, setShowModal] = useState(false); // State to toggle modal

  const leaveTypes = [
    { name: 'Paid time off', value: '12', unit: 'Days available', active: false },
    { name: 'Sick Leave', value: '40', unit: 'Hours available', active: true },
    { name: 'Unpaid Leave', value: '0', unit: 'Days available', active: false },
    { name: 'Subbatical', value: '90', unit: 'Days available', active: false },
  ];

  return (
    <>
      <div className="bg-white p-6 border border-gray-200 space-y-6 rounded-b-xl rounded-bl-xl rounded-br-xl">
        {/* Header with Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Time Off Balance</h2>
          <button
            onClick={() => setShowModal(true)} // Open modal on click
            className="border border-teal-700 text-teal-700 px-4 py-[6px] rounded-full text-sm font-semibold hover:bg-teal-50"
          >
            Request Time Off
          </button>
        </div>

        {/* Leave Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {leaveTypes.map((leave, index) => (
            <div
              key={index}
              className={`rounded-lg border px-6 py-2 ${
                leave.active
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'border-gray-400 text-black'
              }`}
            >
              <div className="text-sm font-semibold mb-2">{leave.name}</div>
              <div className="text-3xl font-extrabold mb-1">{leave.value}</div>
              <div className="text-sm">{leave.unit}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <TimeOffRequestModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
