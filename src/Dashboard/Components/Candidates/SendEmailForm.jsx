import React, { useState } from 'react';
import { X } from 'lucide-react';
import ActionButton from '../ActionButton'; // Assuming you want to use the same ActionButton here

export default function SendEmailForm({ candidateData, onClose, onSend, isLoading }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailData = {
      subject,
      message,
    };
    onSend(emailData);
  };

  return (
    <div className="relative flex flex-col justify-between px-6 py-4 min-h-[400px] bg-white rounded-md">
      {/* Close Button */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <X size={24} />
      </button>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Title */}
        <h4 className="text-lg font-semibold text-gray-900">Send Email</h4>

        {/* To */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">To</label>

          <div className="w-full px-3 py-[6px] border border-gray-300 rounded-md flex items-center gap-2">
            <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
              {candidateData?.email
                ? `${candidateData.email}`
                : 'No email'}
            </span>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            <span className="text-red-500">*</span>{' '}
            Message
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-600"
            placeholder="Type your message here..."
          />
        </div>


        {/* Actions */}
        <div className="flex justify-end pt-4 gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 rounded-md text-sm hover:underline"
          >
            Cancel
          </button>
          <ActionButton
            label="Send"
            type="submit"
            isLoading={isLoading}
            className="w-[120px] h-[38px] px-[20px]"
            labelClassName="text-sm"
          />
        </div>
      </form>
    </div>
  );
}
