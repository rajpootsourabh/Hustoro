import React, { useState } from "react";
import { Pencil } from "lucide-react";

const EditableField = ({
  label,
  fieldKey,
  value,
  isEditing,
  tempValue,
  onChange,
  onStartEdit,
  onSave,
  onCancel,
  required = false,
  allowEdit = false,
}) => {
  const [error, setError] = useState("");

  const handleSave = () => {
    if (required && !tempValue.trim()) {
      setError(`${label} is required`);
      return;
    }
    setError("");
    onSave();
  };

  return (
    <div className="mb-4" key={fieldKey}>
      <div className={`flex gap-12 ${isEditing ? "items-start" : "items-center"}`}>
        {/* Label */}
        <label className="w-36 text-sm pt-[6px]">{label}</label>

        {/* Editable Section */}
        {isEditing ? (
          <div className="flex flex-col">
            {/* Input + Buttons with responsive wrapping */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <input
                className={`border rounded px-3 py-[6px] text-sm w-64 
                  hover:border-teal-500 focus:border-teal-600 focus:outline-none transition-colors duration-150 ${
                    error ? "border-red-500" : ""
                  }`}
                value={tempValue}
                onChange={(e) => onChange(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="bg-teal-700 hover:bg-teal-800 text-white text-sm px-3 py-[6px] rounded-md font-medium"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    onCancel();
                    setError("");
                  }}
                  className="text-gray-600 hover:underline text-sm px-2 py-[6px] font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Error below input only */}
            <p
              className="text-xs ml-1 mt-1"
              style={{
                minHeight: "18px",
                color: error ? "#ef4444" : "transparent",
              }}
            >
              {error || "placeholder"}
            </p>
          </div>
        ) : (
          <>
            <span className="text-sm pt-[6px] text-gray-800 flex-grow">{value || "-"}</span>
            {allowEdit && (
              <button
                onClick={() => onStartEdit(fieldKey, value)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Pencil size={16} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EditableField;
