import { useState, useEffect, useRef } from "react";
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

export default function EditProfileLayout() {
    const [activeSection, setActiveSection] = useState("Personal");
    const [profileImage, setProfileImage] = useState(null);

    const sectionRefs = {
        Personal: useRef(null),
        Job: useRef(null),
        CompensationBenefits: useRef(null),
        LegalDocuments: useRef(null),
        Experience: useRef(null),
        Emergency: useRef(null),
    };

    const sections = [
        "Personal",
        "Job",
        "CompensationBenefits",
        "LegalDocuments",
        "Experience",
        "Emergency",
    ];

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

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            
            <div className="flex flex-1 overflow-hidden relative">
                <Sidebar 
                    sections={sections} 
                    activeSection={activeSection} 
                    handleSectionClick={handleSectionClick}
                />
                
                <main className="flex-1 overflow-y-auto px-4 py-6 lg:ml-64 lg:mr-72">
                    <div className="max-w-4xl mx-auto space-y-12">
                        <PersonalSection 
                            ref={sectionRefs.Personal} 
                            profileImage={profileImage}
                            handleImageUpload={handleImageUpload}
                        />
                        <JobSection ref={sectionRefs.Job} />
                        <CompensationBenefitsSection ref={sectionRefs.CompensationBenefits} />
                        <LegalDocumentsSection ref={sectionRefs.LegalDocuments} />
                        <ExperienceSection ref={sectionRefs.Experience} />
                        <EmergencySection ref={sectionRefs.Emergency} />
                    </div>
                </main>

                <div className="hidden lg:block fixed top-18 right-0 w-72 p-4 overflow-y-auto">
                    <ProgressCard max={6} current={5} />
                </div>
            </div>

            <MobileSidebar 
                sections={sections} 
                activeSection={activeSection} 
                handleSectionClick={handleSectionClick}
            />
        </div>
    );
}