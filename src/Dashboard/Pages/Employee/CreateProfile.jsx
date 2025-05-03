import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MultiLevelSelect from "../../Components/MultiLevelSelect";
import CustomSelect from "../../Components/CustomSelect";
import { entityOptionsData } from "../../../utils/selectOptionsData";
import FormInput from "../../Components/Employee/FormInput";
import FormDateInput from "../../Components/Employee/FormDateInput";
import { useSnackbar } from "../../../Dashboard/Components/SnackbarContext"; 

export default function CreateProfile() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    jobTitle: "",
    startDate: "",
    personalEmail: "",
    entity: "",
    profileTemplate: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // Clear error when user starts typing
  };

  const handleCancel = () => {
    navigate("/dashboard/employee", { state: { form } });
  };

  const handleNext = () => {
    // Validation for required fields
    let validationErrors = {};

    // Check for required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "jobTitle",
      "profileTemplate"
    ];

    requiredFields.forEach((field) => {
      if (!form[field]) {
        validationErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set the errors if any
      showSnackbar("Please fill in all required fields", "error");
    } else {
      navigate("/dashboard/employee/edit", { state: { form } });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between items-start sm:items-center mb-8 max-w-5xl mx-auto">
        <h1 className="text-lg sm:text-2xl text-gray-900">Create New Profile</h1>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleCancel} className="text-sm text-gray-500 hover:underline">Cancel</button>
          <button className="text-sm px-4 py-2 border-2 rounded-md text-gray-500 border-teal-700 hover:bg-gray-100">
            Save as Draft
          </button>
          <button
            onClick={handleNext}
            className="text-sm px-4 py-2 border-2 rounded-md border-teal-700 bg-teal-700 text-white hover:bg-teal-800"
          >
            Next: Fill Employee Info
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-lg p-6 sm:p-8 shadow-md">
        <div className="space-y-10">
          {/* Basic Information */}
          <div>
            <h2 className="text-md font-medium text-gray-800 mb-6">Basic information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="First name"
                required
                value={form.firstName}
                onChange={(val) => handleChange("firstName", val)}
                error={errors.firstName}
              />
              <FormInput
                label="Last name"
                required
                value={form.lastName}
                onChange={(val) => handleChange("lastName", val)}
                error={errors.lastName}
              />
              <FormInput
                label="Job title"
                required
                value={form.jobTitle}
                onChange={(val) => handleChange("jobTitle", val)}
                error={errors.jobTitle}
              />

              {/* Start Date */}
              <FormDateInput
                label="Start date"
                value={form.startDate || ""}
                onChange={(val) => handleChange("startDate", val)}
                error={errors.startDate}
              />

              {/* Personal Email */}
              <FormInput
                label="Personal email"
                type="email"
                value={form.personalEmail}
                onChange={(val) => handleChange("personalEmail", val)}
                error={errors.personalEmail}
              />
            </div>
          </div>

          {/* Entity & Profile Template */}
          <div>
            <h2 className="text-md font-medium text-gray-800 mb-6">Entity & profile template</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <MultiLevelSelect
                label="Entity"
                error={errors.entity}
                optionsList={entityOptionsData}
                value={form.entity}
                onChange={(val) => handleChange("entity", val)}
              />

              <CustomSelect
                label="Profile Template"
                required
                optionsList={["Default"]}
                value={form.profileTemplate}
                onChange={(val) => handleChange("profileTemplate", val)}
                error={errors.profileTemplate}
              />
            </div>

            {/* Bottom Navigation Button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={handleNext}
                className="px-4 py-2 border-2 border-teal-700 text-teal-700 rounded-md hover:bg-teal-50 flex items-center space-x-2 text-sm"
              >
                <span>Next: Fill employee info</span>
                <ChevronDown className="-rotate-90 w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
