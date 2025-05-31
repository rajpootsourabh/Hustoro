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
      setDropUp(buttonRect.bottom + 100 > viewportHeight); // flip if too close to bottom
    }
  }, [menuOpen]);

  return (
    <div className="flex justify-end items-center bg-white px-4 py-2 rounded-xl shadow-sm flex-wrap gap-4">
      <div className="flex space-x-4 items-center relative">
        {/* More menu
        <div className="relative">
          <button
            ref={buttonRef}
            className="p-2 rounded-md hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            data-tooltip-id="tooltip"
            data-tooltip-content="More"
          >
            <MoreHoriz fontSize="small" className="text-gray-600" />
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              className={`absolute left-0 ${
                dropUp ? 'bottom-10' : 'top-12'
              } w-56 py-4 bg-white border border-gray-200 shadow-lg rounded-md z-50`}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEditCandidate?.();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Edit size={16} /> Edit Candidate
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDeleteCandidate?.();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Trash2 size={16} /> Delete Candidate
              </button>
            </div>
          )}
        </div> */}

        {/* Schedule interview */}
        <button
          data-tooltip-id="tooltip"
          data-tooltip-content="Schedule interview"
          className="p-2 rounded-md hover:bg-gray-100"
          onClick={onScheduleInterviewClick}
        >
          <Calendar size={20} className="text-gray-600" />
        </button>

        {/* Send email */}
        <button
          data-tooltip-id="tooltip"
          data-tooltip-content="Send Email"
          className="p-2 rounded-md hover:bg-gray-100"
          onClick={onSendEmailClick}
        >
          <Mail size={20} className="text-gray-600" />
        </button>

        {/* Add evaluation */}
        <button
          data-tooltip-id="tooltip"
          data-tooltip-content="Add evaluation"
          className="p-2 rounded-md hover:bg-gray-100"
          onClick={onAddEvaluationClick}
        >
          <ClipboardList size={20} className="text-gray-600" />
        </button>

        {/* Send text message */}
        <button
          data-tooltip-id="tooltip"
          data-tooltip-content="Send text message"
          className="p-2 rounded-md hover:bg-gray-100"
          onClick={onSendTextClick}
        >
          <MessageSquareText size={20} className="text-gray-600" />
        </button>

        {/* Disqualify dropdown */}
        <DisqualifyDropdown onSelectReason={onDisqualify} />

        {/* Stages dropdown */}
        <StagesDropdown
          currentStage={stage}
          stages={[1, 2, 3, 4, 5, 6]}
          onSelect={onUpdateStage}
        />

        {/* Tooltip */}
        <Tooltip id="tooltip" place="top" />
      </div>
    </div>
  );
}
