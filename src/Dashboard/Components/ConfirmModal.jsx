import React from "react";
import { AlertTriangle } from "lucide-react";
import ActionButton from "../Components/ActionButton";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "destructive", // 'default', 'secondary', etc.
  loadingState = false,
  icon = <AlertTriangle size={24} />,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl transition-transform transform scale-100 hover:scale-[1.01]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="bg-red-100 text-red-600 p-2 rounded-full dark:bg-red-900 dark:text-red-300 mt-1 shrink-0">
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
          >
            {cancelText}
          </button>

          <ActionButton
            onClick={onConfirm}
            label={confirmText}
            isLoading={loadingState}
            className={`w-[100px] bg-red-600 hover:bg-red-700`}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
