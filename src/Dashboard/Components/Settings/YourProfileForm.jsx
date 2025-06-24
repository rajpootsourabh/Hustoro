import React, { useEffect, useState } from "react";
import UploadBox from "./UploadBox";
import FormInput from "../FormInput";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSnackbar } from '../../Components/SnackbarContext';
import Loader from '../../Components/Loader';
import axios from "axios";

export default function YourProfileForm() {
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);        // <-- new state
    const [savingCredentials, setSavingCredentials] = useState(false); // <-- new state
    const [showPasswordFields, setShowPasswordFields] = useState(false);

    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        profilePicture: null,
        profilePictureUrl: "",
        email: "",
        status: "",
    });

    const handleChange = (field, value) => {
        setFormValues((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleProfileSave = async () => {
        setSavingProfile(true); // start loading
        try {
            const formData = new FormData();
            console.log("Form Values on submit", formValues);

            formData.append("first_name", formValues.firstName);
            formData.append("last_name", formValues.lastName);

            if (formValues.profilePicture instanceof File) {
                formData.append("profile_image", formValues.profilePicture);
            }

            const res = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/profile?_method=PATCH`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                }
            );

            const { user } = res.data;

            setFormValues({
                firstName: user.first_name || "",
                lastName: user.last_name || "",
                profilePicture: null,
                profilePictureUrl: user.profile_image || "",
                email: user.email || "",
                status: user.status || "",
            });

            showSnackbar("Profile updated successfully.", "success");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Something went wrong.";
            showSnackbar(errorMessage, "error");
        } finally {
            setSavingProfile(false); // end loading
        }
    };

    const handleCredentialsSave = async () => {
        const { email, oldPassword, password, confirmPassword } = formValues;

        if (!email) {
            showSnackbar("Email is required.", "error");
            return;
        }

        if (showPasswordFields) {
            if (!oldPassword || !password || !confirmPassword) {
                showSnackbar("Please fill all password fields.", "error");
                return;
            }
            if (password !== confirmPassword) {
                showSnackbar("Passwords do not match.", "error");
                return;
            }
        }

        setSavingCredentials(true); // start loading
        try {
            const payload = { email };
            if (showPasswordFields) {
                payload.old_password = oldPassword;
                payload.new_password = password;
                payload.new_password_confirmation = confirmPassword;
            }

            const res = await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/auth/profile/credentials`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                }
            );

            showSnackbar("Credentials updated successfully.", "success");
            console.log(res.data);
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Something went wrong.";
            showSnackbar(errorMessage, "error");
        } finally {
            setSavingCredentials(false); // end loading
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });

                const { user } = res.data;

                setFormValues({
                    firstName: user.first_name || "",
                    lastName: user.last_name || "",
                    profilePicture: null,
                    profilePictureUrl: user.profile_image || "",
                    email: user.email || "",
                    status: user.status || "",
                });

            } catch (err) {
                console.error("Failed to fetch profile", err);
                showSnackbar("Failed to load profile info.", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[300px]">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* PROFILE Section */}
            <h3 className="text-[14px] text-gray-500 leading-relaxed font-semibold">PROFILE</h3>
            <div className="bg-white rounded-[6px] shadow-md px-8 py-6 space-y-6">
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Profile picture</p>

                    {formValues.profilePictureUrl && (
                        <div className="h-20 w-20 bg-white p-1 border rounded mb-3 flex items-center justify-center">
                            <img
                                src={formValues.profilePictureUrl}
                                alt="Profile Picture"
                                className="h-full w-full object-contain"
                            />
                        </div>
                    )}

                    <UploadBox
                        label="Profile Picture"
                        buttonText="Upload an image"
                        accept="image/*"
                        maxSizeMB={3}
                        onChange={(file) => handleChange("profilePicture", file)}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Maximum file size 3MB - acceptable file types .jpg, .jpeg, .gif, .png.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <FormInput
                        label="* First/Preferred name"
                        value={formValues.firstName}
                        onChange={(val) => handleChange("firstName", val)}
                    />
                    <FormInput
                        label="* Last name"
                        value={formValues.lastName}
                        onChange={(val) => handleChange("lastName", val)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <FormInput
                        label="Status"
                        value={formValues.status === 1 ? "Active" : "Inactive"}
                        disabled={true}
                    />
                </div>

                {/* Save Profile Button */}
                <div className="pt-4">
                    <button
                        className="bg-teal-600 text-white px-5 py-2 text-sm rounded hover:bg-teal-700 disabled:bg-teal-600 disabled:cursor-not-allowed"
                        onClick={handleProfileSave}
                        disabled={savingProfile}
                    >
                        {savingProfile ? "Saving..." : "Save Profile"}
                    </button>
                </div>
            </div>

            {/* CREDENTIALS Section */}
            <h3 className="text-[14px] text-gray-500 leading-relaxed font-semibold">CREDENTIALS</h3>
            <div className="bg-white rounded-[6px] shadow-md px-8 py-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <FormInput
                        label="* Email"
                        type="email"
                        value={formValues.email}
                        onChange={(val) => handleChange("email", val)}
                    />
                    {showPasswordFields && (
                        <FormInput
                            label="Old Password"
                            type="password"
                            value={formValues.oldPassword}
                            onChange={(val) => handleChange("oldPassword", val)}
                        />
                    )}
                </div>

                <button
                    type="button"
                    className="text-sm text-gray-600 inline-flex items-center space-x-1 focus:outline-none"
                    onClick={() => {
                        setShowPasswordFields((prev) => {
                            const newState = !prev;

                            if (newState) {
                                setFormValues((prev) => ({
                                    ...prev,
                                    oldPassword: "",
                                    password: "",
                                    confirmPassword: ""
                                }));
                            } else {
                                setFormValues(({ oldPassword, password, confirmPassword, ...rest }) => rest);
                            }

                            return newState;
                        });
                    }}
                >
                    <span className="text-sm hover:underline">Update your password</span>
                    {showPasswordFields ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {showPasswordFields && (
                    <div className="grid grid-cols-2 gap-6">
                        <FormInput
                            label="New Password"
                            type="password"
                            value={formValues.password}
                            onChange={(val) => handleChange("password", val)}
                        />
                        <FormInput
                            label="Password Confirmation"
                            type="password"
                            value={formValues.confirmPassword}
                            onChange={(val) => handleChange("confirmPassword", val)}
                        />
                    </div>
                )}

                <div className="pt-4">
                    <button
                        className="bg-teal-600 text-white hover:bg-teal-700 px-5 py-2 text-sm rounded disabled:bg-teal-600 disabled:cursor-not-allowed"
                        onClick={handleCredentialsSave}
                        disabled={savingCredentials}
                    >
                        {savingCredentials ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
