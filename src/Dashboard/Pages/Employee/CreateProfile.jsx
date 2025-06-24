import { useState, useEffect, useRef } from "react";
import { useSnackbar } from "../../Components/SnackbarContext"; // import useSnackbar hook
import Header from "../../Components/Employee/Header";
import Sidebar from "../../Components/Employee/Sidebar";
import MobileSidebar from "../../Components/Employee/MobileSidebar";
import ProgressCard from "../../Components/Employee/ProgressCard";
import PersonalSection from "../../Components/Employee/FormSections/PersonalSection";
import JobSection from "../../Components/Employee/FormSections/JobSection";
import CompensationBenefitsSection from "../../Components/Employee/FormSections/CompensationBenefitsSection";
import LegalDocumentsSection from "../../Components/Employee/FormSections/LegalDocumentsSection";
import ExperienceSection from "../../Components/Employee/FormSections/ExperienceSection";
import EmergencySection from "../../Components/Employee/FormSections/EmergencySection";
import Loader from "../../Components/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { validateCompensationBenefits, validateEmergencyContact, validateExperience, validateJobInfo, validateLegalDocuments, validatePersonalInfo, appendFormData } from "../../../utils/validators/employeeFormValidator";
import { convertKeysToCamel } from "../../../utils/caseConverter";
import CredentialsSection from "../../Components/Employee/FormSections/CredentialsSection";



const CreateProfile = () => {
    const navigate = useNavigate();
    const { employeeId } = useParams();
    const isEditMode = Boolean(employeeId);
    const [isLoading, setIsLoading] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);
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
        credentials: {}
    });


    const validateForm = () => {
        const personalErrors = validatePersonalInfo(formData.personal);
        const jobErrors = validateJobInfo(formData.job);
        const compensationErrors = validateCompensationBenefits(formData.compensationBenefits);
        const legalErrors = validateLegalDocuments(formData.legalDocuments);
        const experienceErrors = validateExperience(formData.experience);
        const emergencyErrors = validateEmergencyContact(formData.emergency);
        const credentialErrors = {}

        setErrors({
            personal: personalErrors,
            job: jobErrors,
            compensationBenefits: compensationErrors,
            legalDocuments: legalErrors,
            experience: experienceErrors,
            emergency: emergencyErrors,
            credentials: credentialErrors
        });

        // Check if there are any errors
        return Object.values({
            personalErrors,
            jobErrors,
            compensationErrors,
            legalErrors,
            experienceErrors,
            emergencyErrors,
            credentialErrors
        }).some((error) => Object.keys(error).length > 0);
    };


    useEffect(() => {
        const fetchEmployeeData = async () => {
            if (!employeeId) return;

            setIsLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employee/${employeeId}/details`, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token"),
                    },
                });

                if (response.ok) {
                    const employeeData = await response.json();
                    const preFilledData = convertKeysToCamel(employeeData?.data || {});

                    setFormData((prev) => ({
                        personal: {
                            ...prev.personal,
                            ...preFilledData,
                        },
                        job: {
                            ...prev.job,
                            ...(preFilledData.jobDetail || {}),
                        },
                        compensationBenefits: {
                            ...prev.compensationBenefits,
                            ...(preFilledData.compensationDetail || {}),
                        },
                        legalDocuments: {
                            ...prev.legalDocuments,
                            ...(preFilledData.legalDocument || {}),
                        },
                        experience: {
                            ...prev.experience,
                            ...(preFilledData.experienceDetail || {}),
                        },
                        emergency: {
                            ...prev.emergency,
                            ...(preFilledData.emergencyContact || {}),
                        },
                         credentials: {
                            ...prev.credentials,
                            ...(preFilledData.credentials || {}),
                        },
                    }));
                } else {
                    showSnackbar("Failed to fetch employee details", "error");
                }
            } catch (error) {
                console.error("Error fetching employee details:", error);
                showSnackbar("An error occurred while fetching employee data.", "error");
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployeeData();
    }, [employeeId]);


    const [formData, setFormData] = useState({
        personal: {},
        job: {},
        compensationBenefits: {},
        legalDocuments: {},
        experience: {},
        emergency: {},
        credentials: { password: '' }
    });
    const [isFormDirty, setIsFormDirty] = useState(false);

    const sectionRefs = {
        Personal: useRef(null),
        Job: useRef(null),
        CompensationBenefits: useRef(null),
        LegalDocuments: useRef(null),
        Experience: useRef(null),
        Emergency: useRef(null),
        Credentials: useRef(null)
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


    // Handle Form Submit (Publish)
    const handleSubmit = async () => {
        if (!isFormDirty) {
            showSnackbar("No changes to submit!", "warning");
            return;
        }

        const hasErrors = await validateForm();
        if (hasErrors) {
            showSnackbar("Please fill all required fields before submitting.", "error");
            return;
        }

        setIsLoading(true);

        try {
            const formPayload = new FormData();
            appendFormData(formPayload, formData);

            // 👇 Laravel-compatible spoofing
            if (isEditMode) {
                formPayload.append('_method', 'PUT');
            }

            const url = isEditMode
                ? `${import.meta.env.VITE_API_BASE_URL}/employee/${employeeId}`
                : `${import.meta.env.VITE_API_BASE_URL}/employee`;

            const response = await fetch(url, {
                method: 'POST', // Always use POST when sending FormData
                body: formPayload,
                headers: {
                    "Authorization": "Bearer " + localStorage.getItem("access_token"),
                    // DO NOT manually set 'Content-Type' when sending FormData; browser will set the correct boundary
                },
            });

            if (response.ok) {
                showSnackbar(isEditMode ? "Employee updated successfully!" : "Employee added successfully!", "success");
                setIsFormDirty(false);
                // Navigate to employee list after success
                navigate("/dashboard/employees");
            } else {
                const errorData = await response.json();
                const errorMessages = errorData?.message;
                if (errorMessages) {
                    const errorList = Object.values(errorMessages).flat();
                    const errorMessage = errorList.join(' ');
                    showSnackbar(errorMessage, "error");
                } else {
                    showSnackbar("Failed to submit employee data!", "error");
                }
            }
        } catch (error) {
            console.error("Error submitting employee:", error);
            showSnackbar("An error occurred while submitting employee.", "error");
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {isLoading && <Loader />} {/* Show loader while loading */}
            <Header
                title={isEditMode ? "Edit Employee" : "Add New Employee"}
                // onSaveDraft={handleSaveDraft}  // Pass Save Draft function
                onSubmit={handleSubmit}         // Pass Submit function
                isFormDirty={isFormDirty}       // Pass form dirty state
            />

            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar
                    sections={Object.keys(sectionRefs).filter(
                        (key) => isEditMode || key !== "Credentials"
                    )}
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
                        {isEditMode && (
                            <CredentialsSection
                                ref={sectionRefs.Credentials}
                                data={formData.credentials}
                                onChange={(data) => handleFormDataChange("credentials", data)}
                                errors={errors.credentialErrors}
                            />
                        )}
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

export default CreateProfile