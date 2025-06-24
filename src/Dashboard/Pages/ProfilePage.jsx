import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { Box, Button, Typography } from "@mui/material";
import FormInput from "../Components/FormInput";
import CustomSelect from "../Components/CustomSelect";
import ActionButton from "../Components/ActionButton";

const roles = [
    "Business Owner / Executive",
    "Human Resources",
    "Recruitment",
    "Finance",
];

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formValues, setFormValues] = useState({
        first_name: "Rahul",
        last_name: "Singh",
        email: "rahul@example.com",
        phoneNumber: "1234567890",
        companyName: "Example Pvt Ltd",
        companyWebsite: "www.example.com",
        companySize: 50,
        evaluatingWebsite: {
            Recruiting: true,
            HR: false,
        },
        role: "Human Resources",
    });

    const handleChange = (field, value) => {
        setFormValues((prev) => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = (key) => {
        setFormValues((prev) => ({
            ...prev,
            evaluatingWebsite: {
                ...prev.evaluatingWebsite,
                [key]: !prev.evaluatingWebsite[key],
            },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsEditing(false);
        console.log("Updated profile:", formValues);
    };

    return (
        <Box className="max-w-5xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">Profile Information</h2>
                    <p className="text-sm text-gray-500">Update your personal and company details</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-primary-600 hover:text-primary-800 transition-colors"
                    >
                        <Pencil size={20} />
                    </button>
                )}

            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="First Name"
                        value={formValues.first_name}
                        onChange={(val) => handleChange("first_name", val)}
                        disabled={!isEditing}
                        required
                    />
                    <FormInput
                        label="Last Name"
                        value={formValues.last_name}
                        onChange={(val) => handleChange("last_name", val)}
                        disabled={!isEditing}
                        required
                    />
                    <FormInput
                        label="Email"
                        type="email"
                        value={formValues.email}
                        onChange={(val) => handleChange("email", val)}
                        disabled={!isEditing}
                        required
                    />
                    <FormInput
                        label="Phone Number"
                        type="tel"
                        value={formValues.phoneNumber}
                        onChange={(val) => handleChange("phoneNumber", val)}
                        disabled={!isEditing}
                    />
                    <FormInput
                        label="Company Name"
                        value={formValues.companyName}
                        onChange={(val) => handleChange("companyName", val)}
                        disabled={!isEditing}
                    />
                    <FormInput
                        label="Company Website"
                        value={formValues.companyWebsite}
                        onChange={(val) => handleChange("companyWebsite", val)}
                        disabled={!isEditing}
                    />
                    <FormInput
                        label="Company Size"
                        type="number"
                        value={formValues.companySize}
                        onChange={(val) => handleChange("companySize", val)}
                        disabled={!isEditing}
                    />

                    <CustomSelect
                        label="Role"
                        value={formValues.role}
                        onChange={(val) => handleChange("role", val)}
                        optionsList={roles}
                        disabled={!isEditing}
                    />

                    <fieldset className="col-span-2 border border-gray-200 p-4 rounded-xl">
                        <legend className="text-sm font-medium text-gray-700 px-2">Evaluating Website For</legend>
                        <div className="flex gap-8 mt-2">
                            <label className="flex items-center gap-3 text-base text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={formValues.evaluatingWebsite.Recruiting}
                                    onChange={() => handleCheckboxChange("Recruiting")}
                                    disabled={!isEditing}
                                    className="accent-primary-600 rounded-md w-5 h-5"
                                />
                                Recruiting
                            </label>
                            <label className="flex items-center gap-3 text-base text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={formValues.evaluatingWebsite.HR}
                                    onChange={() => handleCheckboxChange("HR")}
                                    disabled={!isEditing}
                                    className="accent-primary-600 rounded-md w-5 h-5"
                                />
                                HR
                            </label>
                        </div>
                    </fieldset>
                </div>

                {isEditing && (
                    <div className="flex justify-end mt-10 gap-4">
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="text-gray-600 hover:underline text-sm w-[80px] h-[40px]"
                        >
                            Cancel
                        </button>

                        <ActionButton
                            label="Save Changes"
                            type="submit"
                            isLoading={false}
                            className="w-[170px] h-[40px] px-[20px]"
                            labelClassName="text-sm"
                        />
                    </div>
                )}
            </form>
        </Box>
    );
};

export default ProfilePage;
