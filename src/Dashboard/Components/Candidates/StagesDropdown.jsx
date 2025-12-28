import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { useSnackbar } from "../../Components/SnackbarContext";
import { useRoleEnabled } from "../../../hooks/useRoleEnabled";

export default function StagesDropdown({
  currentStageId = null,
  stages = [],
  onSelect,
  disabled = false,
  applicationId,
  isLoading = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [isChangingStage, setIsChangingStage] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStage, setPendingStage] = useState(null);
  const { showSnackbar } = useSnackbar();

  const wrapperRef = useRef(null);
  const iconRef = useRef(null);
  const buttonRef = useRef(null);

  // Check user permissions
  const { isEnabled: isAdminEnabled } = useRoleEnabled(1); // Employer/Admin
  const { isEnabled: isEmployeeEnabled } = useRoleEnabled(5); // Employee
  const { isEnabled: isCandidateEnabled } = useRoleEnabled(6); // Candidate

  // Only show StagesDropdown for Employer and Employee, NOT for Candidate
  const canUseStagesDropdown = isAdminEnabled || isEmployeeEnabled;

  // Final enabled state
  const isEnabled = canUseStagesDropdown && !disabled;

  // Sync selected stage from props
  useEffect(() => {
    if (currentStageId && stages.length > 0) {
      const currentStage = stages.find(stage => stage.id === currentStageId);
      setSelectedStage(currentStage);
    }
  }, [currentStageId, stages]);

  const currentIndex = stages.findIndex((s) => s.id === selectedStage?.id);
  const nextStage = currentIndex !== -1 && currentIndex < stages.length - 1
    ? stages[currentIndex + 1]
    : null;

  // Check if current stage is the final stage
  const isFinalStage = currentIndex !== -1 && currentIndex === stages.length - 1;

  const label = isLoading
    ? "Loading stages..."
    : isChangingStage
      ? "Moving..."
      : nextStage
        ? nextStage.name
        : selectedStage
          ? `${selectedStage.name}`
          : stages.length === 0
            ? "No stages"
            : "Select Stage";

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (isEnabled && stages.length > 0 && !isLoading) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleMoveToNextStage = async () => {
    if (!isChangingStage && nextStage && isEnabled && !isLoading) {
      await handleStageChange(nextStage);
    }
  };

  const handleSelect = async (stage) => {
    if (stage.id !== selectedStage?.id && isEnabled && !isLoading) {
      if (isFinalStage && currentIndex > stages.findIndex(s => s.id === stage.id)) {
        setPendingStage(stage);
        // Commented out: Confirmation modal for moving back from final stage
        // setShowConfirmModal(true);
        // For now, just proceed with the stage change
        await handleStageChange(stage);
      } else {
        await handleStageChange(stage);
      }
    }
  };

  // Commented out: Confirmation modal handler
  /*
  const handleConfirmStageChange = async (shouldDeleteEmployee) => {
    setShowConfirmModal(false);
    if (pendingStage) {
      await handleStageChange(pendingStage, shouldDeleteEmployee);
    }
  };
  */

  const handleStageChange = async (stage, shouldDeleteEmployee = false) => {
    setIsChangingStage(true);
    try {
      const payload = { stage_id: stage.id };
      if (shouldDeleteEmployee !== false) {
        payload.should_delete_employee = shouldDeleteEmployee;
      }

      await onSelect(payload);
      setSelectedStage(stage);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to change stage:', error);

      if (error.response?.data?.error_type === 'employee_already_exists') {
        showSnackbar(error.response.data.message, "warning");
      } else {
        showSnackbar(
          error.response?.data?.message || 'Failed to change stage',
          "error"
        );
      }
    } finally {
      setIsChangingStage(false);
      setPendingStage(null);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dropdown direction
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = Math.min(stages.length * 40, 224);
      setDropUp(spaceBelow < dropdownHeight && spaceAbove > spaceBelow);
    }
  }, [isOpen, stages.length]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="relative inline-flex items-center bg-gray-400 text-white rounded-3xl overflow-visible opacity-70">
        <button
          disabled
          className="flex-1 text-sm px-4 py-2 text-left cursor-not-allowed rounded-3xl flex items-center gap-2 min-w-40"
        >
          <Loader2 size={16} className="animate-spin" />
          Loading stages...
        </button>
      </div>
    );
  }

  // Show "no stages" state only when not loading and stages are empty
  if (stages.length === 0) {
    return (
      <div className="relative inline-flex items-center bg-gray-400 text-white rounded-3xl overflow-visible opacity-50">
        <button
          disabled
          className="flex-1 text-sm px-4 py-2 text-left cursor-not-allowed rounded-3xl flex items-center gap-2"
        >
          No stages configured
        </button>
      </div>
    );
  }

  // If candidate, don't show the StagesDropdown at all
  if (isCandidateEnabled) {
    return (
      <div className="relative inline-flex items-center bg-gray-300 text-gray-600 rounded-3xl overflow-visible opacity-70">
        <button
          disabled
          className="flex-1 text-sm px-4 py-2 text-left cursor-not-allowed rounded-3xl flex items-center gap-2 min-w-40"
        >
          {selectedStage?.name || "Current Stage"}
        </button>
        <button
          disabled
          className={`px-3 py-[10px] rounded-r-3xl opacity-50 cursor-not-allowed`}
        >
          <ChevronDown size={16} />
        </button>
      </div>
    );
  }

  // If not authorized (not employer or employee), show disabled state with current stage
  if (!canUseStagesDropdown) {
    return (
      <div className="relative inline-flex items-center bg-gray-300 text-gray-600 rounded-3xl overflow-visible opacity-70">
        <button
          disabled
          className="flex-1 text-sm px-4 py-2 text-left cursor-not-allowed rounded-3xl flex items-center gap-2 min-w-40"
        >
          {selectedStage?.name || "Current Stage"}
        </button>
        <button
          disabled
          className={`px-3 py-[10px] rounded-r-3xl opacity-50 cursor-not-allowed`}
        >
          <ChevronDown size={16} />
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        ref={wrapperRef}
        className="relative inline-flex items-center bg-teal-700 text-white rounded-3xl overflow-visible"
      >
        <button
          ref={buttonRef}
          onClick={handleMoveToNextStage}
          disabled={isChangingStage || !nextStage || !isEnabled || isLoading}
          className={`flex-1 text-sm px-4 py-2 text-left cursor-pointer rounded-l-3xl hover:bg-teal-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-40`}
        >
          {isChangingStage && <Loader2 size={16} className="animate-spin" />}
          {isFinalStage ? selectedStage?.name || "Current Stage" : `Move to ${label}`}
        </button>

        <button
          onClick={toggleDropdown}
          ref={iconRef}
          disabled={!isEnabled || stages.length === 0 || isLoading}
          className={`px-3 py-[10px] rounded-r-3xl hover:bg-teal-800 focus:outline-none transition ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && isEnabled && (
          <div
            className={`absolute z-[9999] w-64 bg-white text-black border border-gray-200 rounded-xl shadow-lg right-0 py-2
            ${dropUp ? "bottom-full mb-2" : "top-full mt-2"} animate-fade-in max-h-60 overflow-y-auto`}
          >
            {stages.map((stage, i) => {
              const isCurrent = stage.id === selectedStage?.id;
              const isPastStage = i < currentIndex;
              const isFutureStage = i > currentIndex;

              return (
                <button
                  key={stage.id}
                  onClick={() => handleSelect(stage)}
                  disabled={isCurrent || isLoading}
                  className={`w-full text-left px-4 py-1.5 text-sm transition ${isCurrent
                    ? "bg-teal-50 text-teal-700 font-medium cursor-not-allowed"
                    : isPastStage
                      ? "hover:bg-gray-100 text-gray-600"
                      : isFutureStage
                        ? "hover:bg-gray-100 text-gray-800"
                        : "hover:bg-gray-100"
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{stage.name}</span>
                    {isCurrent && (
                      <span className="text-xs text-teal-600 ml-2">(current)</span>
                    )}
                    {isPastStage && (
                      <span className="text-xs text-gray-400 ml-2">✓</span>
                    )}
                    {isFinalStage && i === stages.length - 1 && (
                      <span className="text-xs text-orange-600 ml-2">(final)</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Commented out: Confirmation Modal for moving back from final stage */}
      {/* 
      {showConfirmModal && pendingStage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Moving Back from Final Stage</h3>
            </div>

            <p className="text-gray-600 mb-4">
              You are moving the candidate back from the final stage "{selectedStage?.name}" to "{pendingStage.name}".
              An employee record may have been created when they reached the final stage.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> The stage change will proceed, but any existing employee record will be preserved unless you choose to delete it.
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmStageChange(false)}
                className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
              >
                Keep Employee
              </button>
              <button
                onClick={() => handleConfirmStageChange(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete Employee
              </button>
            </div>
          </div>
        </div>
      )}
      */}
    </>
  );
}