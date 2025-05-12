import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header({ title, onSubmit, isFormDirty, onSaveDraft }) {
    const navigate = useNavigate(); // ✅ get the navigate function

    const handleCancel = () => {
        navigate("/dashboard/employees");
    };
    return (
        <header className="sticky top-0 z-50 bg-white shadow-sm px-6">
            <div className="max-w-7xl mx-auto py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl">{title}</h1>
                    <p className="text-gray-500 text-xs">
                        h, h5ty [Draft] - y6
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={handleCancel} className="text-sm text-gray-500 hover:underline">
                        Cancel
                    </button>
                    <button
                        className="border border-teal-700 text-teal-700 rounded px-4 py-2 hover:bg-teal-50 text-sm"
                        disabled={!isFormDirty}
                        onClick={onSaveDraft} // Call onSaveDraft when clicked
                    >
                        Save as draft and exit
                    </button>
                    <button
                        className="bg-teal-700 text-white rounded px-6 py-2 hover:bg-teal-800 text-sm"
                        onClick={onSubmit}
                        disabled={!isFormDirty} // Disable the button if the form is not dirty
                    >
                        Publish
                    </button>
                </div>
            </div>
        </header>
    );
}
