import React, { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import ActionButton from '../ActionButton';

export default function SendTextMessageForm({ candidateData = '', onClose }) {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        alert("Currently, this feature is not supported");
        onClose();
    };

    return (
        <div className="relative flex flex-col justify-between px-6 py-4 min-h-[370px] bg-white rounded-md">
            {/* Close Button */}
            <button
                onClick={onClose}
                aria-label="Close"
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
                <X size={24} />
            </button>

            <div className="space-y-6">
                {/* Title */}
                <h4 className="text-lg font-semibold text-gray-900">Send Text Message</h4>

                {/* Phone Number */}
                <div>
                    <label className="block text-sm text-gray-700 mb-1">
                        <span className="text-red-500">*</span>{' '}
                        To {candidateData?.first_name && candidateData?.last_name
                            ? `${candidateData.first_name} ${candidateData.last_name}`
                            : 'Phone Number'}
                    </label>

                    <div className="relative">
                        <input
                            type="text"
                            value={candidateData?.phone || ''}
                            readOnly
                            className="w-full text-sm px-3 py-2 pr-10 border border-gray-300 rounded-md text-gray-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                        />

                        {candidateData?.phone && (
                            <CheckCircle
                                size={18}
                                className="absolute top-1/2 right-3 -translate-y-1/2 text-green-500"
                            />
                        )}
                    </div>
                </div>


                {/* Message */}
                <div>
                    <label className="block text-sm text-gray-700 mb-1">Message</label>
                    <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-teal-600"
                        placeholder="Type your message here..."
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-4 gap-4">
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-700 rounded-md text-sm hover:underline"
                >
                    Cancel
                </button>
                <ActionButton
                    label="Send"
                    onClick={handleSend}
                    isLoading={false}
                    className="w-[120px] h-[38px] px-[20px]"
                    labelClassName="text-sm"
                />
            </div>
        </div>
    );
}
