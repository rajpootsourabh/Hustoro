import React, { useEffect, useRef, useState } from 'react';
import {
  Calendar,
  ClipboardList,
  Mail,
  MessageSquareText,
  Edit,
  Trash2,
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import { MoreHoriz } from '@mui/icons-material';
import DisqualifyDropdown from './DisqualifyDropdown';
import StagesDropdown from './StagesDropdown';
import { useRoleEnabled } from '../../../hooks/useRoleEnabled'; // Import the hook

export default function CandidateProfileHeader({
  stage,
  onUpdateStage,
  onSendEmailClick,
  onSendTextClick,
  onAddEvaluationClick,
  onScheduleInterviewClick,
  onDisqualify,
  onEditCandidate,
  onDeleteCandidate,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const isEnabled = useRoleEnabled(5); // Use hook here

  // Close menu when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Decide dropdown direction (up/down) based on viewport
  useEffect(() => {
    if (menuOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      setDropUp(buttonRect.bottom + 100 > viewportHeight);
    }
  }, [menuOpen]);

  return (
    <div className="flex justify-end items-center bg-white px-4 py-2 rounded-xl shadow-sm flex-wrap gap-4">
      <div className="flex space-x-4 items-center relative">

        {/* Schedule interview */}
        <button
          data-tooltip-id="tooltip"
          data-tooltip-content="Schedule interview"
          className={`p-2 rounded-md hover:bg-gray-100 ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={isEnabled ? onScheduleInterviewClick : undefined}
          disabled={!isEnabled}
        >
          <Calendar size={20} className="text-gray-600" />
        </button>

        {/* Send email */}
        <button
          data-tooltip-id="tooltip"
          data-tooltip-content="Send Email"
          className={`p-2 rounded-md hover:bg-gray-100 ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={isEnabled ? onSendEmailClick : undefined}
          disabled={!isEnabled}
        >
          <Mail size={20} className="text-gray-600" />
        </button>

        {/* Add evaluation */}
        <button
          data-tooltip-id="tooltip"
          data-tooltip-content="Add evaluation"
          className={`p-2 rounded-md hover:bg-gray-100 ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={isEnabled ? onAddEvaluationClick : undefined}
          disabled={!isEnabled}
        >
          <ClipboardList size={20} className="text-gray-600" />
        </button>

        {/* Send text message */}
        <button
          data-tooltip-id="tooltip"
          data-tooltip-content="Send text message"
          className={`p-2 rounded-md hover:bg-gray-100 ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={isEnabled ? onSendTextClick : undefined}
          disabled={!isEnabled}
        >
          <MessageSquareText size={20} className="text-gray-600" />
        </button>

        {/* Disqualify dropdown */}
        <DisqualifyDropdown onSelectReason={isEnabled ? onDisqualify : undefined} disabled={!isEnabled} />

        {/* Stages dropdown */}
        <StagesDropdown
          currentStage={stage}
          stages={[1, 2, 3, 4, 5, 6, 7]}
          onSelect={isEnabled ? onUpdateStage : undefined}
          disabled={!isEnabled}
        />

        {/* Tooltip */}
        <Tooltip id="tooltip" place="top" />
      </div>
    </div>
  );
}
