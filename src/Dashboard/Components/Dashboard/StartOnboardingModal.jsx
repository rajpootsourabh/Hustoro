import React, { useState } from "react";
import { X } from "lucide-react";
import ActionButton from "../../Components/ActionButton";
import ModalWrapper from "../ModalWrapper";

const StartOnboardingModal = ({ candidateName, onCancel, onStart }) => {
  const [profileTemplate, setProfileTemplate] = useState("Default");
  const [onboardingWorkflow, setOnboardingWorkflow] = useState("Default");
  const [startDate, setStartDate] = useState("immediately");
  const [publishProfile, setPublishProfile] = useState(true);
  const [inviteUser] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingAction, setSubmittingAction] = useState("");

  const handleSubmit = () => {
    setIsSubmitting(true);
    setSubmittingAction("start");
    setTimeout(() => {
      onStart({
        profileTemplate,
        onboardingWorkflow,
        startDate,
        publishProfile,
        inviteUser,
      });
      setIsSubmitting(false);
      setSubmittingAction("");
    }, 2000);
  };

  return (
    <ModalWrapper>
      <div className="bg-white w-full max-w-xl min-h-[520px] rounded-lg shadow-lg px-10 py-10 relative space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Start Onboarding for {candidateName}
          </h2>
          <button onClick={onCancel}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* Profile Template */}
        <div className="space-y-2">
          <label className="block text-md font-medium text-gray-700">
            Profile Template <span className="text-red-500">*</span>
          </label>
          <select
            value={profileTemplate}
            onChange={(e) => setProfileTemplate(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007a6e]"
          >
            <option>Default</option>
          </select>
        </div>

        {/* Onboarding Workflow */}
        <div className="space-y-2">
          <label className="block text-md font-medium text-gray-700">
            Onboarding Workflow <span className="text-red-500">*</span>
          </label>
          <select
            value={onboardingWorkflow}
            onChange={(e) => setOnboardingWorkflow(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007a6e]"
          >
            <option>Default</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <p className="text-md font-semibold text-gray-700">
            Onboarding Start Date
          </p>
          <div className="flex items-center gap-6">
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="radio"
                name="startDate"
                value="immediately"
                checked={startDate === "immediately"}
                onChange={() => setStartDate("immediately")}
                className="text-[#007a6e] focus:ring-[#007a6e] w-[18px] h-[20px]"
              />

              <span className="ml-2 text-md">Immediately</span>
            </label>
            <label className="flex items-center text-sm text-gray-700">
              <input
                type="radio"
                name="startDate"
                value="custom"
                checked={startDate === "custom"}
                onChange={() => setStartDate("custom")}
                className="text-[#007a6e] focus:ring-[#007a6e] w-[18px] h-[20px]"
              />
              <span className="ml-2">Custom</span>
            </label>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-3">
          <p className="text-md font-semibold text-gray-700">
            Publish profile and invite user
          </p>
          <label className="flex items-center text-md text-gray-700">
            <input
              type="checkbox"
              checked={publishProfile}
              onChange={() => setPublishProfile(!publishProfile)}
              className="text-[#007a6e] focus:ring-[#007a6e] w-[18px] h-[20px]"
            />

            <span className="ml-2 text-md">
              Automatically publish profile on start date
            </span>
          </label>
          <label className="flex items-center text-md text-gray-400 cursor-not-allowed">
            <input
              type="checkbox"
              checked={inviteUser}
              disabled
              className="text-[#007a6e] w-[18px] h-[20px]"
            />
            <span className="ml-2 text-md">
              Automatically Invite for basic access upon publishing
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onCancel}
            className="px-5 py-[6px] text-md rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <ActionButton
            label="Start Onboarding"
            onClick={handleSubmit}
            isLoading={isSubmitting && submittingAction === "start"}
            disabled={isSubmitting}
            className="h-[40px] px-[24px] w-[200px] disabled:opacity-50"
            labelClassName="text-md"
          />
        </div>
      </div>
    </ModalWrapper>
  );
};

export default StartOnboardingModal;
