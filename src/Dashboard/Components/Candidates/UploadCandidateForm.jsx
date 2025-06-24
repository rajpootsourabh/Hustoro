import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import FormInput from "../../Components/FormInput";
import FormSelect from "../../Components/FormSelect";
import UploadBox from "../../Components/UploadBox";
import { validateCandidateForm } from "../../../utils/validators/candidateFormValidator";
import { useSnackbar } from "../../Components/SnackbarContext";
import { toTitleCase } from "../../../utils/caseConverter";
import countryList from "../../../utils/countryList";
import CustomSelect from "../CustomSelect";
import ActionButton from "../ActionButton";

const initialFormState = {
    firstName: "",
    lastName: "",
    designation: "",
    location: "",
    experience: "",
    phone: "",
    currentCtc: "",
    expectedCtc: "",
    dob: "",
    summary: "",
    skills: "",
    profilePic: null,
    resume: null,
    country: "",
    education: "",
    email: "",
};

export default function UploadCandidateForm({ onClose, onSubmit, selectedJob, sourceId = 1, loading }) {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [animateOut, setAnimateOut] = useState(false);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        if (selectedJob) {
            setFormData(initialFormState);
            setErrors({});
        }
    }, [selectedJob]);

    const handleChange = (key) => (value) => {
        const updatedData = { ...formData, [key]: value };
        setFormData(updatedData);
        const validationErrors = validateCandidateForm(updatedData);
        setErrors((prev) => ({ ...prev, [key]: validationErrors[key] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateCandidateForm(formData);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            showSnackbar("Please fix all mandatory fields", "error");
            return;
        }

        const data = new FormData();
        data.append("first_name", formData.firstName);
        data.append("last_name", formData.lastName);
        data.append("designation", formData.designation || "");
        data.append("experience", parseFloat(formData.experience) || 0);
        data.append("phone", formData.phone);
        data.append("location", formData.location);
        data.append("current_ctc", parseInt(formData.currentCtc) || 0);
        data.append("expected_ctc", parseInt(formData.expectedCtc) || 0);
        data.append("job_id", selectedJob?.id);
        data.append("source_id", sourceId);
        data.append("email", formData.email);
        data.append("country", formData.country);
        data.append("education", formData.education || "");

        if (formData.profilePic) data.append("profile_pic", formData.profilePic);
        if (formData.resume) data.append("resume", formData.resume);

        const success = await onSubmit(data);
        if (success) triggerClose();
    };

    const triggerClose = () => setAnimateOut(true);

    useEffect(() => {
        if (!animateOut) return;
        const timer = setTimeout(() => onClose(), 300);
        return () => clearTimeout(timer);
    }, [animateOut, onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
            {/* X Button - Floating top-right outside header */}
            <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 bg-transparent bg-opacity-90 shadow-md p-1.5 hover:bg-opacity-100 transition"
            >
                <X className="w-6 h-6 text-white" />
            </button>

            <div
                className="relative w-full max-w-screen-2xl h-[90vh] bg-white rounded-t-2xl shadow-lg flex flex-col overflow-y-auto"
            >

                {/* Header */}
                <div className="sticky top-0 bg-white px-8 py-6 border-b flex items-start justify-between rounded-t-2xl w-full">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Add candidate</h2>
                        {selectedJob ? (
                            <p className="text-sm text-gray-600">
                                {toTitleCase(selectedJob?.job_title)} · {toTitleCase(selectedJob?.job_workplace)} · {toTitleCase(selectedJob?.job_location)}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400">Job info not available</p>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>

                        {/* <button
                            type="submit"
                            onClick={handleSubmit} // Trigger form submission
                            className="bg-teal-700 text-white px-5 py-2 rounded-md hover:bg-teal-800 transition"
                        >
                            Add to Sourced
                        </button> */}

                        <ActionButton
                            label="Add to Sourced"
                            type="submit"
                            onClick={handleSubmit}
                            isLoading={loading}
                            className="w-[150px] h-[38px] px-[20px]"
                            labelClassName="text-sm"
                        />
                    </div>
                </div>

                {/* Scrollable Form Section */}
                <div className="overflow-y-auto px-8 py-4 flex-1">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                label="First Name"
                                required
                                value={formData.firstName}
                                onChange={handleChange("firstName")}
                                error={errors?.firstName}
                            />
                            <FormInput
                                label="Last Name"
                                required
                                value={formData.lastName}
                                onChange={handleChange("lastName")}
                                error={errors?.lastName}
                            />
                            <FormSelect
                                label="Location"
                                required
                                value={formData.location}
                                onChange={handleChange("location")}
                                options={["Delhi", "Bangalore", "Remote"]}
                                error={errors?.location}
                            />
                            <CustomSelect
                                label="Country"
                                optionsList={countryList}
                                required
                                onChange={handleChange("country")}
                                error={errors?.country}
                                showSearch
                            />

                            <FormInput
                                label="Current Designation"
                                required
                                value={formData.designation}
                                onChange={handleChange("designation")}
                                error={errors?.designation}
                            />
                            <FormInput
                                label="Education"
                                value={formData.education}
                                required
                                onChange={handleChange("education")}
                                error={errors?.education}
                            />
                            <FormSelect
                                label="Work Experience"
                                required
                                value={formData.experience}
                                onChange={handleChange("experience")}
                                options={["Fresher", "1-3 years", "3-5 years", "5+ years"]}
                                error={errors?.experience}
                            />
                            <FormInput
                                label="Phone Number"
                                type="tel"
                                required
                                value={formData.phone}
                                onChange={handleChange("phone")}
                                error={errors?.phone}
                            />
                            <FormInput
                                label="Email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange("email")}
                                error={errors?.email}
                            />


                            <FormInput
                                label="Current CTC"
                                type="number"
                                value={formData.currentCtc}
                                onChange={handleChange("currentCtc")}
                                error={errors?.currentCtc}
                            />
                            <FormInput
                                label="Expected CTC"
                                type="number"
                                value={formData.expectedCtc}
                                onChange={handleChange("expectedCtc")}
                                error={errors?.expectedCtc}
                            />
                            <FormInput
                                label="Summary"
                                type="text"
                                value={formData.summary}
                                onChange={handleChange("summary")}
                            />

                            <FormInput
                                label="Skills"
                                type="text"
                                value={formData.skills}
                                onChange={handleChange("skills")}
                            />

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <UploadBox
                                label="Upload Profile Pic"
                                buttonText="Upload Photo"
                                accept=".jpg, .png, .jpeg"
                                onChange={(file) => handleChange("profilePic")(file)}
                            />
                            <UploadBox
                                label="Upload Resume"
                                buttonText="Upload Resume"
                                accept=".pdf,.doc,.docx"
                                onChange={(file) => handleChange("resume")(file)}
                                error={errors?.resume}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
