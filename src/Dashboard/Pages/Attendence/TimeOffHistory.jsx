import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CalendarDays } from 'lucide-react';

export default function TimeOffHistory() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeOffHistory();
  }, []);

  const fetchTimeOffHistory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/time-off-requests/all`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.data.success) {
        setHistoryData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching time off history:', error);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Loading */}
      {loading ? (
        Array(4).fill().map((_, i) => (
          <div key={i} className="grid grid-cols-12 animate-pulse border-b py-4">
            <div className="col-span-6 flex space-x-3">
              <div className="w-5 h-5 bg-gray-300 rounded" />
              <div className="space-y-1">
                <div className="h-3 w-32 bg-gray-300 rounded"></div>
                <div className="h-3 w-40 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="col-span-3 h-3 w-16 bg-gray-300 rounded"></div>
            <div className="col-span-3 space-y-1">
              <div className="h-3 w-24 bg-gray-300 rounded"></div>
              <div className="h-2 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))
      ) : historyData.length === 0 ? (
        <div className="text-sm text-gray-500 py-4">No time off history found.</div>
      ) : (
        historyData.map((item, index) => (
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

            {/* Status with color */}
            <div
              className={`col-span-3 font-semibold text-sm ${
                item.status === 'Approved'
                  ? 'text-teal-700'
                  : item.status === 'Rejected'
                  ? 'text-red-600'
                  : item.status === 'Cancelled'
                  ? 'text-gray-500'
                  : 'text-yellow-600'
              }`}
            >
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
  );
}
