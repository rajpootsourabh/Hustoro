import React, { useState } from "react";
import CompanyProfileForm from "../Components/Settings/CompanyProfileForm";
import YourProfileForm from "../Components/Settings/YourProfileForm"; // Import more as needed

const sidebarItems = {
    // "EMPLOYEE MANAGEMENT": [
    //     "Company entities",
    //     "Time off",
    //     "Holiday calendars",
    // ],
    "COMPANY": [
        "Company profile",
        // "Departments",
        // "Account members",
    ],
    "PERSONAL": [
        // "Your preferences",
        "Your profile",
    ]
};

const itemContent = {
    "Careers page": "Company name, subdomain, website, and phone form",
    "Company entities": "Manage your legal entities, addresses, and jurisdictions.",
    "Time off": "Configure and track employee time off policies.",
    "Holiday calendars": "Customize your company-wide holiday schedule.",
    "Departments": "Define company departments and assign members.",
    "Account members": "Manage admin, recruiter, and HR access.",
    "Your preferences": "Set up personal preferences like language and theme."
};

export default function SettingsLayout() {
    const [activeItem, setActiveItem] = useState("Company profile");

    const componentMap = {
        "Company profile": <CompanyProfileForm />,
        "Your profile": <YourProfileForm />,
        // Add more mapped components here as needed
    };

    return (
        <div className="flex w-full min-h-screen bg-[#F9FAFB] text-[#1F2937] font-inter border-r">
            {/* Sidebar */}
            <aside className="w-[300px] pt-10 pl-8 pr-4 text-sm">
                {Object.entries(sidebarItems).map(([section, items]) => (
                    <div key={section} className="mb-6">
                        <p className="text-[13px] font-semibold tracking-wide mb-2">
                            {section}
                        </p>
                        {items.map((item) => (
                            <div
                                key={item}
                                onClick={() => setActiveItem(item)}
                                className={`cursor-pointer rounded px-4 py-2 text-[12px] leading-tight mb-1.5 ${activeItem === item
                                    ? "bg-gray-200"
                                    : "text-gray-500 hover:bg-gray-200"
                                    }`}
                            >
                                {item}
                            </div>
                        ))}
                    </div>
                ))}
            </aside>

            {/* Content */}
            <main className="flex-1 px-4 py-10">
                {componentMap[activeItem] ? (
                    componentMap[activeItem]
                ) : (
                    <>
                        <h2 className="text-[14px] font-semibold text-gray-500 mb-4 uppercase">
                            {activeItem}
                        </h2>
                        <p className="text-[14px] leading-relaxed">
                            {itemContent[activeItem] || "Content goes here."}
                        </p>
                    </>
                )}
            </main>

        </div>
    );
}
