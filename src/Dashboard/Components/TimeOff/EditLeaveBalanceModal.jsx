import React, { useState } from 'react';
import axios from 'axios';

export default function EditLeaveBalanceModal({ leave, onClose, onSaved }) {
  const [newBalance, setNewBalance] = useState(leave?.value === '∞' ? 0 : leave?.value);
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/time-off-requests/leave-balance/${leave.id}`,
        {
          allocated_days: newBalance,
          note, // Optional, for logging if supported
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (response.data.success) {
        if (onSaved) onSaved(); // refresh parent list
        onClose(); // close modal
      } else {
        alert(response.data.message || 'Failed to update balance.');
      }
    } catch (error) {
      console.error('Failed to update leave balance:', error);
      alert('Error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit time-off balance</h2>
        <p className="text-gray-600 mb-4">{leave.name} - Current: {leave.value} days</p>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">New Balance</label>
          <input
            type="number"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={newBalance}
            onChange={(e) => setNewBalance(parseFloat(e.target.value))}
            min={0}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Note (optional)</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
            placeholder="Write a note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded text-gray-700"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-emerald-700 text-white rounded disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
