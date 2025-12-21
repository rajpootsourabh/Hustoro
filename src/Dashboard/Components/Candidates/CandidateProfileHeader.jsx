import React, { useEffect, useRef, useState } from 'react';
import {
  Calendar,
  ClipboardList,
  Link,
  Mail,
  MessageSquareText,
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import DisqualifyDropdown from './DisqualifyDropdown';
import StagesDropdown from './StagesDropdown';
import { useRoleEnabled } from '../../../hooks/useRoleEnabled';
import ScheduleInterviewModal from './ScheduleInterviewModal';

export default function CandidateProfileHeader({
  stageId, // Changed from stage to stageId (company_stage_id)
  stages = [], // Now receives array of stage objects instead of numbers
  onUpdateStage,
  onSendEmailClick,
  onSendTextClick,
  onAddEvaluationClick,
  onScheduleInterviewClick,
  onDisqualify,
  onGenerateLinkClick,
  onEditCandidate,
  onDeleteCandidate,
  candidate,
  applicationId, // Added for API calls
  isLoadingStages = false, // Add loading prop for stages
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const isEnabled = useRoleEnabled(5);

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

  const handleScheduleClick = () => {
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (interviewData) => {
    try {
      await onScheduleInterviewClick(interviewData);
      setShowScheduleModal(false);
    } catch (error) {
      console.error('Scheduling failed:', error);
    }
  };

  const handleStageChange = async (newStageId) => {
    if (onUpdateStage) {
      await onUpdateStage(newStageId);
    }
  };

  return (
    <>
      <div className="flex justify-end items-center bg-white px-4 py-2 rounded-xl shadow-sm flex-wrap gap-4">
        <div className="flex space-x-4 items-center relative">

          {/* Schedule interview */}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Schedule interview"
            className={`p-2 rounded-md hover:bg-gray-100 ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={isEnabled ? handleScheduleClick : undefined}
            disabled={!isEnabled}
          >
            <Calendar size={20} className="text-gray-600" />
          </button>

          {/* Send email */}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Send Email"
            className={`p-2 rounded-md hover:bg-gray-100`}
            onClick={onSendEmailClick}
            // disabled={!isEnabled}
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

          {/* Generate Link */}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Generate Link"
            className={`p-2 rounded-md hover:bg-gray-100`}
            onClick={onGenerateLinkClick}
            // disabled={!isEnabled}
          >
            <Link size={20} className="text-gray-600" />
          </button>

          {/* Disqualify dropdown */}
          <DisqualifyDropdown onSelectReason={isEnabled ? onDisqualify : undefined} disabled={!isEnabled} />

          {/* Dynamic Stages dropdown */}
          <StagesDropdown
            currentStageId={stageId}
            stages={stages}
            onSelect={handleStageChange}
            // disabled={!isEnabled}
            applicationId={applicationId}
            isLoading={isLoadingStages} // Pass the loading state
          />

          {/* Tooltip */}
          <Tooltip id="tooltip" place="top" />
        </div>
      </div>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        candidate={candidate}
        onSchedule={handleScheduleSubmit}
      />
    </>
  );
}