import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Loader2, Lock } from "lucide-react";
import { useRoleEnabled } from '../../../hooks/useRoleEnabled';

export default function StagesDropdown({
  currentStageId = null,
  stages = [],
  onSelect,
  disabled = false,
  applicationId,
  isLoading = false // Add isLoading prop
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [isChangingStage, setIsChangingStage] = useState(false);

  const wrapperRef = useRef(null);
  const iconRef = useRef(null);
  const buttonRef = useRef(null);

  const isEnabled = useRoleEnabled(5) && !disabled;

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
    : isFinalStage
      ? `${selectedStage?.name}`
      : nextStage
        ? nextStage.name
        : selectedStage
          ? `${selectedStage.name}`
          : stages.length === 0
            ? "No stages"
            : "Select Stage";

  const toggleDropdown = (e) => {
    e.stopPropagation();
    // Don't open dropdown if it's the final stage or loading
    if (isEnabled && stages.length > 0 && !isFinalStage && !isLoading) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleMoveToNextStage = async () => {
    // Don't allow moving if it's the final stage or loading
    if (!isChangingStage && nextStage && isEnabled && !isFinalStage && !isLoading) {
      setIsChangingStage(true);
      try {
        await onSelect(nextStage.id);
        setSelectedStage(nextStage);
      } catch (error) {
        console.error('Failed to move to next stage:', error);
      } finally {
        setIsChangingStage(false);
        setIsOpen(false);
      }
    }
  };

  const handleSelect = async (stage) => {
    // Don't allow any stage changes if it's the final stage or loading
    if (stage.id !== selectedStage?.id && isEnabled && !isFinalStage && !isLoading) {
      setIsChangingStage(true);
      try {
        await onSelect(stage.id);
        setSelectedStage(stage);
      } catch (error) {
        console.error('Failed to change stage:', error);
      } finally {
        setIsChangingStage(false);
        setIsOpen(false);
      }
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

  // If it's the final stage, show locked state
  if (isFinalStage) {
    return (
      <div className="relative inline-flex items-center bg-teal-700 text-white rounded-3xl overflow-visible">
        <button
          disabled
          className="flex-1 text-sm px-4 py-2 text-left cursor-not-allowed rounded-l-3xl flex items-center gap-2 min-w-40"
        >
          <Lock size={16} />
          {label}
        </button>
        <button
          onClick={toggleDropdown}
          ref={iconRef}
          disabled={!isEnabled || isLoading}
          className={`px-3 py-[10px] rounded-r-3xl hover:bg-teal-800 focus:outline-none transition ${!isEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <ChevronDown
            size={16}
            className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && isEnabled && (
          <div className={`absolute z-[9999] w-64 bg-white text-black border border-gray-200 rounded-xl shadow-lg right-0 py-2
          ${dropUp ? "bottom-full mb-2" : "top-full mt-2"} animate-fade-in max-h-60 overflow-y-auto`}
          >
            {stages.map((stage, i) => {
              const isCurrent = stage.id === selectedStage?.id;
              return (
                <button
                  key={stage.id}
                  disabled
                  className="w-full text-left px-4 py-2 text-sm opacity-50 cursor-not-allowed"
                >
                  <div className="flex justify-between items-center">
                    <span>{stage.name}</span>
                    {isCurrent && (
                      <span className="text-xs text-green-600 ml-2">(completed)</span>
                    )}
                    {i < currentIndex && (
                      <span className="text-xs text-gray-400 ml-2">✓</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
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
        {label}
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
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}