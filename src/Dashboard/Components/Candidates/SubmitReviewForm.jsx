import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import ActionButton from '../ActionButton';

export default function SubmitReviewForm({ onClose, onSubmit, isLoading }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const validateInputs = () => {
    if (rating === 0 && feedback.trim() === '') {
      setError('Please add note and rating.');
      return false;
    } else if (rating === 0) {
      setError('Please add rating.');
      return false;
    } else if (feedback.trim() === '') {
      setError('Please add note.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = () => {
    if (!validateInputs()) return;
    onSubmit({ rating, feedback });
  };

  const handleRatingChange = (value) => {
    setRating(value);
    if (error) validateInputs();
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
    if (error) validateInputs();
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
        <h4 className="text-lg font-semibold text-gray-900">Submit Review</h4>

        {/* Rating */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">Rating</label>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                disabled={isLoading}
                onClick={() => handleRatingChange(i + 1)}
                fill={i < rating ? '#f97316' : 'none'}
                stroke="#f97316"
                className="cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            How would you rate this candidate?
          </label>
          <textarea
            rows={4}
            value={feedback}
            onChange={handleFeedbackChange}
            disabled={isLoading}
            className={`w-full text-sm px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-1 ${
              error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-600'
            }`}
            placeholder="Add note"
          />
          {error && (
            <p className="text-xs text-red-600 mt-1">{error}</p>
          )}
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
          label="Submit"
          onClick={handleSubmit}
          isLoading={isLoading}
          className="w-[120px] h-[38px] px-[20px]"
          labelClassName="text-sm"
        />
      </div>
    </div>
  );
}
