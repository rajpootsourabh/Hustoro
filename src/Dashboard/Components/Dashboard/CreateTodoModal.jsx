import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const CreateTodoModal = ({ isOpen, onClose, onSubmit }) => {
  const [todoInputs, setTodoInputs] = useState([""]);
  const [error, setError] = useState("");

  const handleInputChange = (index, value) => {
    const updated = [...todoInputs];
    updated[index] = value;
    setTodoInputs(updated);
  };

  const handleAddMore = () => {
    setTodoInputs([...todoInputs, ""]);
  };

  const handleSubmit = () => {
    const trimmed = todoInputs.map((t) => t.trim());
    if (trimmed.some((t) => t === "")) {
      setError("All fields must be filled out.");
      return;
    }

    setError("");
    onSubmit(trimmed);
    setTodoInputs([""]);
    onClose();
  };

  const handleCancel = () => {
    setTodoInputs([""]);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-xl p-6 relative shadow-xl">
        <button
          className="absolute top-4 right-4 text-black hover:opacity-70"
          onClick={handleCancel}
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">To Do List</h2>

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <div className="space-y-5 max-h-[38vh] overflow-y-auto pr-2 scrollbar-enhanced">
          {todoInputs.map((value, index) => (
            <div key={index}>
              <label className="text-sm text-gray-500 block mb-2">
                Create List {index + 1}
              </label>
              <textarea
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder="Review daily goals before sleeping. Add some new if time permits."
                rows={2}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#007a6e]"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={handleAddMore}
            className="flex items-center gap-2 text-[#007a6e] text-sm font-medium"
          >
            <span className="w-5 h-5 rounded-full bg-[#007a6e] flex items-center justify-center text-white">
              <Plus size={16} />
            </span>
            <span className="hover:underline text-sm">Add More</span>
          </button>

          <div className="flex gap-4">
            <button
              onClick={handleCancel}
              className="text-sm text-gray-600 hover:text-black"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-[#007a6e] hover:bg-[#005f56] text-white text-sm font-semibold px-5 py-2 rounded-full"
            >
              Create List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTodoModal;
