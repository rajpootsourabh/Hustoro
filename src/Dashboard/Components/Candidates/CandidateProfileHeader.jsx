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
  stageId,
  stages = [],
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
  applicationId,
  isLoadingStages = false,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Get user info from localStorage
  const getUserInfo = () => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Failed to parse user data:", error);
      return null;
    }
  };

  const user = getUserInfo();
  const userRole = user?.role;

  // Check permissions for different roles
  const { isEnabled: isAdminEnabled } = useRoleEnabled(1); // Employer/Admin role
  const { isEnabled: isEmployeeEnabled, isManager } = useRoleEnabled(5); // Employee role
  const { isEnabled: isCandidateEnabled } = useRoleEnabled(6); // Candidate role

  // Determine which buttons to enable based on role
  // According to your requirements:
  // 1. Candidate (role=6): ONLY AddEvaluation enabled
  // 2. Employer (role=1): AddEvaluation, Schedule Interview, Disqualify enabled
  // 3. Employee (role=5): ALL buttons enabled

  const canScheduleInterview = isEmployeeEnabled; // Only Employee
  const canAddEvaluation = isAdminEnabled ||isEmployeeEnabled || isCandidateEnabled; // ALL (Employer, Employee, Candidate)
  const canSendText = isEmployeeEnabled || isAdminEnabled; // Employer & Employee
  const canDisqualify = isEmployeeEnabled; // Only Employee
  const canMoveStages = isEmployeeEnabled || isAdminEnabled; // Employer & Employee (for moving stages)
  const canSendEmail = isEmployeeEnabled || isAdminEnabled; //  Employer & Employee
  const canGenerateLink = isEmployeeEnabled || isAdminEnabled; // Employer & Employee

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

          {/* Schedule interview - Only for Employer and Employee */}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Schedule interview"
            className={`p-2 rounded-md hover:bg-gray-100 ${!canScheduleInterview ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={canScheduleInterview ? handleScheduleClick : undefined}
            disabled={!canScheduleInterview}
          >
            <Calendar size={20} className="text-gray-600" />
          </button>

          {/* Send email - Only for Employee */}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Send Email"
            className={`p-2 rounded-md hover:bg-gray-100 ${!canSendEmail ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={canSendEmail ? onSendEmailClick : undefined}
            disabled={!canSendEmail}
          >
            <Mail size={20} className="text-gray-600" />
          </button>

          {/* Add evaluation - Enabled for ALL (Employer, Employee, Candidate) */}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Add evaluation"
            className={`p-2 rounded-md hover:bg-gray-100 ${!canAddEvaluation ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={canAddEvaluation ? onAddEvaluationClick : undefined}
            disabled={!canAddEvaluation}
          >
            <ClipboardList size={20} className="text-gray-600" />
          </button>

          {/* Send text message - Only for Employee */}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Send text message"
            className={`p-2 rounded-md hover:bg-gray-100 ${!canSendText ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={canSendText ? onSendTextClick : undefined}
            disabled={!canSendText}
          >
            <MessageSquareText size={20} className="text-gray-600" />
          </button>

          {/* Generate Link - Only for Employee */}
          <button
            data-tooltip-id="tooltip"
            data-tooltip-content="Generate Link"
            className={`p-2 rounded-md hover:bg-gray-100 ${!canGenerateLink ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={canGenerateLink ? onGenerateLinkClick : undefined}
            disabled={!canGenerateLink}
          >
            <Link size={20} className="text-gray-600" />
          </button>

          {/* Disqualify dropdown - Only for Employer and Employee */}
          <DisqualifyDropdown
            onSelectReason={canDisqualify ? onDisqualify : undefined}
            disabled={!canDisqualify}
          />

          {/* Dynamic Stages dropdown - Only for Employee (for moving stages) */}
          <StagesDropdown
            currentStageId={stageId}
            stages={stages}
            onSelect={canMoveStages ? handleStageChange : undefined}
            disabled={!canMoveStages}
            applicationId={applicationId}
            isLoading={isLoadingStages}
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
        onSchedule={canScheduleInterview ? handleScheduleSubmit : undefined}
        disabled={!canScheduleInterview}
      />
    </>
  );
}