import { useRef, useState } from "react";
import { CalendarDays, ChevronDown, X } from "lucide-react";
import { Link } from "react-router-dom";

const entityOptions = [
  { name: "UK Entity", location: "London, England, United Kingdom" },
  { name: "India Entity", location: "Delhi, India" },
  { name: "US Entity", location: "New York, USA" },
];

export default function CreateProfile() {
  const inputRef = useRef(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    startDate: "",
    email: "",
    profileTemplate: "",
    entitySearch: "",
    selectedEntity: null,
    showDropdown: false,
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const filteredEntities = entityOptions.filter((e) =>
    e.name.toLowerCase().includes(form.entitySearch.toLowerCase())
  );

  const openDatePicker = () => {
    inputRef.current?.showPicker?.();
    inputRef.current?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between items-start sm:items-center mb-8 max-w-5xl mx-auto">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Create New Profile</h1>
        <div className="flex flex-wrap gap-3">
          <button className="text-sm text-gray-500 hover:underline">Cancel</button>
          <button className="text-sm px-4 py-2 border-2 rounded-md text-gray-500 border-teal-700 hover:bg-gray-100">
            Save as Draft
          </button>
          <button className="text-sm px-4 py-2 border-2 rounded-md border-teal-700 bg-teal-700 text-white hover:bg-teal-800">
            Next: Fill Employee Info
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-lg p-6 sm:p-8 shadow-md">
        {/* Form Content */}
        <div className="space-y-10">
          {/* Basic Information */}
          <div>
            <h2 className="text-md font-medium text-gray-800 mb-6">Basic information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                ["First name", "firstName"],
                ["Last name", "lastName"],
                ["Job title", "jobTitle"],
              ].map(([label, field]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    <span className="text-red-500">*</span> {label}
                  </label>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 outline-none"
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Start date</label>
                <div
                  className="relative cursor-pointer"
                  onClick={openDatePicker}
                >
                  <input
                    ref={inputRef}
                    type="date"
                    value={form.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-800 outline-none appearance-none"
                    style={{ WebkitAppearance: "none" }}
                  />
                  <CalendarDays className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div className="w-full md:w-1/2 md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Personal email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 outline-none"
                />
              </div>

            </div>
          </div>

          {/* Entity & Profile Template */}
          <div>
            <h2 className="text-md font-medium text-gray-800 mb-6">Entity & profile template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Entity</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Select an option..."
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white outline-none"
                    value={form.entitySearch}
                    onFocus={() => handleChange("showDropdown", true)}
                    onChange={(e) => handleChange("entitySearch", e.target.value)}
                  />
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    onClick={() => handleChange("showDropdown", !form.showDropdown)}
                  />

                  {form.showDropdown && (
                    <div className="absolute mt-2 w-full z-20 bg-white border rounded-md shadow-md max-h-40 overflow-y-auto">
                      {filteredEntities.map((entity, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              selectedEntity: entity,
                              entitySearch: `${entity.name} — ${entity.location}`,
                              showDropdown: false,
                            }))
                          }
                        >
                          <p className="text-sm font-medium">{entity.name}</p>
                          <p className="text-xs text-gray-500">{entity.location}</p>
                        </div>
                      ))}
                      {filteredEntities.length === 0 && (
                        <p className="px-4 py-2 text-sm text-gray-500">No options found</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  <span className="text-red-500">*</span> Profile template
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.profileTemplate}
                    onChange={(e) => handleChange("profileTemplate", e.target.value)}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 bg-white outline-none"
                  />
                  {form.profileTemplate && (
                    <X
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                      onClick={() => handleChange("profileTemplate", "")}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="flex justify-end mt-8">
              <Link to="/dashboard/employee/edit">
              <button className="px-4 py-2 border-2 border-teal-700 text-teal-700 rounded-md hover:bg-teal-50 flex items-center space-x-2 text-sm">
                <span>Next: Fill employee info</span>
                <ChevronDown className="-rotate-90 w-4 h-4" />
              </button>
              </Link>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
