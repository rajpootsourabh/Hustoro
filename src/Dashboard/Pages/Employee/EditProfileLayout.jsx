import { useState, useEffect, useRef } from "react";
import { useSnackbar } from "../../../Dashboard/Components/SnackbarContext"; // import useSnackbar hook
import Header from "../../../Dashboard/Components/Employee/Header";
import Sidebar from "../../../Dashboard/Components/Employee/Sidebar";
import MobileSidebar from "../../../Dashboard/Components/Employee/MobileSidebar";
import ProgressCard from "../../../Dashboard/Components/Employee/ProgressCard";
import PersonalSection from "../../../Dashboard/Components/Employee/PersonalSection";
import JobSection from "../../../Dashboard/Components/Employee/JobSection";
import CompensationBenefitsSection from "../../../Dashboard/Components/Employee/CompensationBenefitsSection";
import LegalDocumentsSection from "../../../Dashboard/Components/Employee/LegalDocumentsSection";
import ExperienceSection from "../../../Dashboard/Components/Employee/ExperienceSection";
import EmergencySection from "../../../Dashboard/Components/Employee/EmergencySection";
import Loader from "../../Components/Loader";
import { useLocation } from "react-router-dom";
import { validateCompensationBenefits, validateEmergencyContact, validateExperience, validateJobInfo, validateLegalDocuments, validatePersonalInfo } from "../../../utils/validateEmpData";


export default function EditProfileLayout() {
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const { showSnackbar } = useSnackbar(); // Get the showSnackbar function from the context
    const [activeSection, setActiveSection] = useState("Personal");
    const [profileImage, setProfileImage] = useState(null);
    const [errors, setErrors] = useState({
        personal: {},
        job: {},
        compensationBenefits: {},
        legalDocuments: {},
        experience: {},
        emergency: {},
    });

    const validateForm = () => {
        const personalErrors = validatePersonalInfo(formData.personal);
        const jobErrors = validateJobInfo(formData.job);
        const compensationErrors = validateCompensationBenefits(formData.compensationBenefits);
        const legalErrors = validateLegalDocuments(formData.legalDocuments);
        const experienceErrors = validateExperience(formData.experience);
        const emergencyErrors = validateEmergencyContact(formData.emergency);

        setErrors({
            personal: personalErrors,
            job: jobErrors,
            compensationBenefits: compensationErrors,
            legalDocuments: legalErrors,
            experience: experienceErrors,
            emergency: emergencyErrors,
        });

        // Check if there are any errors
        return Object.values({
            personalErrors,
            jobErrors,
            compensationErrors,
            legalErrors,
            experienceErrors,
            emergencyErrors,
        }).some((error) => Object.keys(error).length > 0);
    };


    const preFilledData = location.state?.form;
    console.log(preFilledData)

    useEffect(() => {
        if (preFilledData) {
            setFormData((prev) => ({
                ...prev,
                personal: {
                    ...prev.personal,
                    firstName: preFilledData.firstName || "",
                    lastName: preFilledData.lastName || "",
                    personalEmail: preFilledData.personalEmail
                },
                job: {
                    ...prev.job,
                    jobTitle: preFilledData.jobTitle || "",
                    startDate: preFilledData.startDate,
                    entity: preFilledData.entity || ""
                }
            }));
        }
    }, [preFilledData]);

    const [formData, setFormData] = useState({
        personal: {},
        job: {},
        compensationBenefits: {},
        legalDocuments: {},
        experience: {},
        emergency: {},
    });
    const [isFormDirty, setIsFormDirty] = useState(false);

    const sectionRefs = {
        Personal: useRef(null),
        Job: useRef(null),
        CompensationBenefits: useRef(null),
        LegalDocuments: useRef(null),
        Experience: useRef(null),
        Emergency: useRef(null),
    };

    const handleFormDataChange = (section, updatedData) => {
        setFormData((prev) => {
            const newFormData = {
                ...prev,
                [section]: {
                    ...prev[section],
                    ...updatedData,
                },
            };
            setIsFormDirty(true);
            return newFormData;
        });
    };

    const handleSectionClick = (section) => {
        setActiveSection(section);
        const sectionElement = sectionRefs[section]?.current;
        if (sectionElement) {
            window.scrollTo({
                top: sectionElement.offsetTop - 20,
                behavior: "smooth",
            });
        }
    };

    const handleImageUpload = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "0px 0px -70% 0px",
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute("id");
                    if (sectionId) {
                        setActiveSection(sectionId);
                    }
                }
            });
        }, observerOptions);

        Object.values(sectionRefs).forEach((ref) => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    // Handle Save Draft functionality
    const handleSaveDraft = async () => {
        if (!isFormDirty) {
            showSnackbar("No changes to save!", "warning");
            return;
        }

        setIsLoading(true); // Start loading

        try {
            // Make an API request to save the form data as a draft
            const response = await fetch("/api/saveDraft", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                showSnackbar("Draft saved successfully!", "success");
                console.log(data); // Handle data response from the server
                setIsFormDirty(false); // Reset dirty flag after saving
            } else {
                showSnackbar("Failed to save draft!", "error");
            }
        } catch (error) {
            console.error("Error saving draft:", error);
            showSnackbar("An error occurred while saving the draft.", "error");
        }
        finally {
            setIsLoading(false); // Stop loading
        }
    };

    // Handle Form Submit (Publish)
    const handleSubmit = async () => {
        if (!isFormDirty) {
            showSnackbar("No changes to submit!", "warning");
            return;
        }
        if (await validateForm()) {
            showSnackbar("Please fill all required fields before submitting.", "error");
            return;
        }

        setIsLoading(true); // Start loading

        try {
            const formPayload = new FormData();

            // Loop through the formData to append each field to FormData
            for (const sectionKey in formData) {
                const sectionData = formData[sectionKey];
                for (const fieldKey in sectionData) {
                    const value = sectionData[fieldKey];

                    // This formats keys like personal[firstName], job[jobTitle], etc.
                    formPayload.append(`${sectionKey}[${fieldKey}]`, value);
                }
            }

            // Log FormData entries for inspection
            for (let [key, value] of formPayload.entries()) {
                console.log(key, value);
            }

            // Make the POST request
            const response = await fetch("http://127.0.0.1:8000/api/v.1/employee", {
                method: "POST",
                body: formPayload, // No need to stringify, FormData will handle it
                headers: {
                    // No need to manually set "Content-Type" for FormData
                    "Authorization": "Bearer " + localStorage.getItem("access_token"),
                },
            });

            if (response.ok) {
                const data = await response.json();
                showSnackbar("Employee added successfully!", "success");
                // ✅ Clear errors after successful submission
                setErrors({
                    personal: {},
                    job: {},
                    compensationBenefits: {},
                    legalDocuments: {},
                    experience: {},
                    emergency: {},
                });
                setIsFormDirty(false);
            } else {
                // If response is not OK, try to get the actual error message from the response body
                const errorData = await response.json(); // Assuming the server sends an error message in JSON
                const errorMessages = errorData?.message;

                if (errorMessages) {
                    // Loop through each error field and show its message
                    const errorList = Object.values(errorMessages).flat();
                    const errorMessage = errorList.join(' '); // Combine all error messages into a single string
                    showSnackbar(errorMessage, "error");
                } else {
                    showSnackbar("Failed to submit employee data!", "error");
                }
            }
        } catch (error) {
            console.error("Error adding employee:", error);
            showSnackbar("An error occurred while adding employee.", "error");
        } finally {
            setIsLoading(false); // Stop loading
        }
    };



    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {isLoading && <Loader message="Saving..." />} {/* Show loader while loading */}
            <Header
                onSaveDraft={handleSaveDraft}  // Pass Save Draft function
                onSubmit={handleSubmit}         // Pass Submit function
                isFormDirty={isFormDirty}       // Pass form dirty state
            />

            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar
                    sections={Object.keys(sectionRefs)}
                    activeSection={activeSection}
                    handleSectionClick={handleSectionClick}
                />

                <main className="flex-1 overflow-y-auto px-4 py-6 lg:ml-64 lg:mr-72">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <PersonalSection
                            ref={sectionRefs.Personal}
                            profileImage={profileImage}
                            handleImageUpload={handleImageUpload}
                            data={formData.personal}
                            onChange={(data) => handleFormDataChange("personal", data)}
                            errors={errors.personal}
                        />
                        <JobSection
                            ref={sectionRefs.Job}
                            data={formData.job}
                            onChange={(data) => handleFormDataChange("job", data)}
                            errors={errors.job}
                        />
                        <CompensationBenefitsSection
                            ref={sectionRefs.CompensationBenefits}
                            data={formData.compensationBenefits}
                            onChange={(data) => handleFormDataChange("compensationBenefits", data)}
                            errors={errors.compensationBenefits}
                        />
                        <LegalDocumentsSection
                            ref={sectionRefs.LegalDocuments}
                            data={formData.legalDocuments}
                            onChange={(data) => handleFormDataChange("legalDocuments", data)}
                            errors={errors.legalDocuments}
                        />
                        <ExperienceSection
                            ref={sectionRefs.Experience}
                            data={formData.experience}
                            onChange={(data) => handleFormDataChange("experience", data)}
                            errors={errors.experience}
                        />
                        <EmergencySection
                            ref={sectionRefs.Emergency}
                            data={formData.emergency}
                            onChange={(data) => handleFormDataChange("emergency", data)}
                            errors={errors.emergency}
                        />
                    </div>
                </main>

                <div className="hidden lg:block fixed top-18 right-0 w-72 p-4 overflow-y-auto">
                    <ProgressCard max={6} current={5} />
                </div>
            </div>

            <MobileSidebar
                sections={Object.keys(sectionRefs)}
                activeSection={activeSection}
                handleSectionClick={handleSectionClick}
            />
        </div>
    );
}
