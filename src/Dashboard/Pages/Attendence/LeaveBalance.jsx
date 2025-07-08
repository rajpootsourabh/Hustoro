import React, { useEffect, useState } from 'react';
import TimeOffRequestModal from './TimeOffRequestModal';
import axios from 'axios';

export default function LeaveBalance() {
  const [showModal, setShowModal] = useState(false);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveBalances();
  }, []);

  const fetchLeaveBalances = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/time-off-requests/leave-balance`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.data.success) {

        const sorted = response.data.data
          .sort((a, b) => {
            const preferredOrder = ['Paid Time Off', 'Sick Leave', 'Unpaid Leave'];
            const aIndex = preferredOrder.indexOf(a.type);
            const bIndex = preferredOrder.indexOf(b.type);
            return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
          })
          .map((item) => ({
            name: item.type,
            value: item.type === 'Unpaid Leave' && item.remaining_days === 0 ? '∞' : item.remaining_days,
            unit: 'Days available',
            active: item.type === 'Sick Leave',
          }));

        setLeaveBalances(sorted);
      }
    } catch (error) {
      console.error('Failed to fetch leave balances:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white p-6 border border-gray-200 space-y-6 rounded-b-xl">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Time Off Balance</h2>
          <button
            onClick={() => setShowModal(true)}
            className="border border-teal-700 text-teal-700 px-4 py-[6px] rounded-full text-sm font-semibold hover:bg-teal-50"
          >
            Request Time Off
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-300 px-6 py-4 animate-pulse space-y-2"
              >
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="h-9 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {leaveBalances.map((leave) => (
              <div
                key={leave.id}
                className={`rounded-lg border px-6 py-2 ${leave.active
                  ? 'bg-teal-700 text-white border-teal-700'
                  : 'border-gray-400 text-black'
                  }`}
              >
                <div className="text-sm font-semibold mb-2">{leave.name}</div>
                <div className="text-3xl font-extrabold mb-1">
                  {leave.value === '∞' ? <span className="text-5xl font-extrabold leading-none">∞</span> : leave.value}
                </div>
                <div className="text-sm">{leave.unit}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <TimeOffRequestModal onClose={() => setShowModal(false)} />}
    </>
  );
}
