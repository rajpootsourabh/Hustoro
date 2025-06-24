import React, { useState, useEffect } from "react";
import axios from "axios";
import FormInput from "../../Components/FormInput";
import UploadBox from "../../Components/Settings/UploadBox";
import { useSnackbar } from '../../Components/SnackbarContext';
import Loader from '../../Components/Loader'


export default function CompanyProfileForm() {
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingIdentity, setSavingIdentity] = useState(false);

    const [formValues, setFormValues] = useState({
        companyName: "",
        companyWebsite: "",
        subdomain: "",
        phoneCode: "+91",
        phoneNumber: "",
        companySize: "",
        description: "",
        companyLogoUrl: "",
        companyLogoFile: null
    });

    const handleChange = (key, value) => {
        setFormValues((prev) => ({ ...prev, [key]: value }));
    };

    // ✅ Fetch company data
    useEffect(() => {
        setLoading(true);
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}/company`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })
            .then((res) => {
                const company = res.data.company;
                setFormValues((prev) => ({
                    ...prev,
                    companyName: company.name || "",
                    companyWebsite: company.website || "",
                    subdomain: company.subdomain || "",
                    phoneCode: company.phone_code || "+91",
                    phoneNumber: company.phone_number || "",
                    companySize: company.size ? String(company.size) : "",
                    description: company.company_description || "",
                    companyLogoUrl: company.company_logo || ""
                }));
            })
            .catch((err) => {
                console.error("Failed to fetch company info", err);
            }).finally(() => {
                setLoading(false);
            });
    }, []);


    // ✅ Update company profile
    const handleSave = async (section) => {
        try {
            if (section === 'profile') setSavingProfile(true);
            if (section === 'identity') setSavingIdentity(true);

            // Ensure website starts with https://
            let website = formValues.companyWebsite.trim();
            if (!website.startsWith("http://") && !website.startsWith("https://")) {
                website = "https://" + website;
            }

            // Update profile
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/company`,
                {
                    name: formValues.companyName,
                    website,
                    phone_code: formValues.phoneCode,
                    phone_number: formValues.phoneNumber,
                    size: formValues.companySize,
                    company_description: formValues.description || "",
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                }
            );

            // Upload logo if selected
            if (formValues.companyLogoFile) {
                const formData = new FormData();
                formData.append("logo", formValues.companyLogoFile);

                const logoRes = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/company/logo`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                    }
                );

                const newLogoUrl = logoRes.data.company_logo;

                setFormValues((prev) => ({
                    ...prev,
                    companyLogoUrl: newLogoUrl,
                    companyLogoFile: null,
                }));

                // Update localStorage
                const userStr = localStorage.getItem("user");
                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user.company) {
                        user.company.company_logo = newLogoUrl;
                        localStorage.setItem("user", JSON.stringify(user));
                    }
                }
            }

            showSnackbar("Company info updated successfully", "success");
        } catch (err) {
            console.error("Failed to update company", err);
            showSnackbar("Error updating company profile.", "error");
        } finally {
            if (section === 'profile') setSavingProfile(false);
            if (section === 'identity') setSavingIdentity(false);
        }
    };

    // ✅ Upload company logo
    const handleLogoUpload = (file) => {
        setFormValues((prev) => ({
            ...prev,
            companyLogoFile: file
        }));
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <Loader />
            </div>
        );
    }
    return (
        <div className="space-y-6">
            {/* Company Profile Section */}
            <h3 className="text-[14px] text-gray-500 leading-relaxed font-semibold mb-2">COMPANY PROFILE</h3>
            <div className="bg-white rounded-[6px] shadow-md px-8 py-6">
                <div className="grid grid-cols-2 gap-6">
                    <FormInput
                        label="* Company name"
                        value={formValues.companyName}
                        onChange={(val) => handleChange("companyName", val)}
                    />
                    <FormInput
                        label="* Website"
                        value={formValues.companyWebsite}
                        onChange={(val) => handleChange("companyWebsite", val)}
                    />

                    {/* Company Size */}
                    {/* Company Size (as text input) */}
                    <div className="space-y-1">
                        <label className="text-sm text-gray-700">*Size</label>
                        <input
                            type="text"
                            value={formValues.companySize}
                            onChange={(e) => handleChange("companySize", e.target.value)}
                            placeholder="e.g. 11-50, 1000+"
                            className="w-full px-3 py-2 border text-sm rounded border-gray-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-700">Phone number</label>
                        <div className="flex">
                            <input
                                type="text"
                                value={formValues.phoneNumber}
                                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                                className="w-full px-3 py-2 border rounded text-sm border-gray-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Profile Save button */}
                <div className="mt-10">
                    <button
                        className="bg-teal-600 text-white px-5 py-2 text-sm rounded hover:bg-teal-700 disabled:bg-teal-600 disabled:cursor-not-allowed"
                        type="button"
                        onClick={() => handleSave('profile')}
                        disabled={savingProfile}
                    >
                        {savingProfile ? "Saving..." : "Save changes"}
                    </button>


                </div>
            </div>

            {/* Company Identity Section */}
            <h3 className="text-[14px] text-gray-500 leading-relaxed font-semibold mb-2">COMPANY IDENTITY</h3>
            <div className="bg-white rounded-[6px] shadow-md px-8 py-6 mt-0">
                <div className="space-y-6">
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Company Logo</p>
                        <p className="text-sm text-gray-500 mb-3">
                            Bipani displays your company’s logo in your careers page, in emails to candidates as well as some job boards.
                        </p>

                        {formValues.companyLogoUrl && (
                            <div className="h-20 w-40 bg-white p-1 border rounded mb-3 flex items-center justify-center">
                                <img
                                    src={formValues.companyLogoUrl}
                                    alt="Company Logo"
                                    className="h-full w-full object-contain"
                                />
                            </div>
                        )}

                        <UploadBox
                            label="Profile Picture"
                            buttonText="Upload an image"
                            accept="image/*"
                            onChange={handleLogoUpload}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Only .jpg, .jpeg, .gif or .png files allowed, no size limit.
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Company Description</p>
                        <p className="text-sm text-gray-500 mb-2">
                            The company description helps to set you apart on some job boards, including the Workable Job Board. It also appears on welcome pages for features like video interviews and assessments.
                        </p>
                        <textarea
                            value={formValues.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            className="w-full border border-gray-300 text-sm rounded focus:ring-2 focus:ring-teal-600 focus:outline-none p-2"
                            rows={5}
                            placeholder="A brief description about your company..."
                        />
                    </div>
                </div>

                {/* Identity Save button */}
                <div className="mt-10">
                     <button
                        className="bg-teal-600 text-white px-5 py-2 text-sm rounded hover:bg-teal-700 disabled:bg-teal-600 disabled:cursor-not-allowed"
                        type="button"
                        onClick={() => handleSave('identity')}
                        disabled={savingIdentity}
                    >
                        {savingIdentity ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
