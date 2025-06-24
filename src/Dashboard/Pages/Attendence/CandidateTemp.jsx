import { ChevronLeft, Info, Upload } from 'lucide-react';
import React, { useState } from 'react';
import InteractiveCalendar from "./InteractiveCalendar"

const CandidateTemp = () => {
    const [mainTab, setMainTab] = useState('Information');
    const [subTab, setSubTab] = useState('Personal');

    const renderSubTabContent = () => {
        if (mainTab !== 'Information' || subTab !== 'Personal') return null;

        return (
            <div className="p-6 grid grid-cols-3 gap-4 text-sm">
                <div>
                    <label className="block text-gray-500">First Name</label>
                    <input className="bg-gray-100 p-2 rounded w-full" defaultValue="Rex" />
                </div>
                <div>
                    <label className="block text-gray-500">Last name</label>
                    <input className="bg-gray-100 p-2 rounded w-full" defaultValue="Abernathy" />
                </div>
                <div>
                    <label className="block text-gray-500">Last name</label>
                    <input className="bg-gray-100 p-2 rounded w-full" defaultValue="Abernathy" />
                </div>

                <div>
                    <label className="block text-gray-500">Preferred</label>
                    <input className="bg-gray-100 p-2 rounded w-full" defaultValue="1" />
                </div>
                <div>
                    <label className="block text-gray-500">Employee ID</label>
                    <input className="bg-gray-100 p-2 rounded w-full" defaultValue="5" />
                </div>
                <div>
                    <label className="block text-gray-500">Status</label>
                    <input className="bg-gray-100 p-2 rounded w-full" defaultValue="Active" />
                </div>

                <div>
                    <label className="block text-gray-500">Country</label>
                    <input className="bg-gray-100 p-2 rounded w-full" defaultValue="United States of America" />
                </div>
                <div>
                    <label className="block text-gray-500">Address</label>
                    <input className="bg-gray-100 p-2 rounded w-full" defaultValue="US Entity | Boston, Massachusetts" />
                </div>
                <div>
                    <label className="block text-gray-500">Gender</label>
                    <input className="bg-gray-100 p-2 rounded w-full" defaultValue="-" />
                </div>

                <div>
                    <label className="block text-gray-500">Birthday</label>
                    <input className="bg-gray-100 p-2 rounded w-full" type="date" />
                </div>

                <div>
                    <label className="block text-gray-500">Marital Status</label>
                    <input className="bg-gray-100 p-2 rounded w-full" defaultValue="Married" />
                </div>
                <div>
                    <label className="block text-gray-500">Certificate</label>
                    <input className="bg-gray-100 p-2 rounded w-full" />
                </div>

                <div>
                    <label className="block text-gray-500">Phone</label>
                    <input className="bg-gray-100 p-2 rounded w-full" />
                </div>
                <div>
                    <label className="block text-gray-500">Extension</label>
                    <input className="bg-gray-100 p-2 rounded w-full" />
                </div>
            </div>
        );
    };

    const renderTimeOffTab = () => {
        if (mainTab !== "Time Off") return null;

        return (
            <div className="p-6 space-y-6 text-sm">
                <InteractiveCalendar />
            </div>

        );
    };


    const tabs = ['Information', 'Files', 'Time Off', 'Performance'];
    const subTabs = ['Personal', 'Job', 'Compensation & Benefits', 'Legal Documents', 'Experience', 'Emergency'];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Profile Header */}
                <div className="bg-white shadow-md rounded-xl p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <img
                            src="https://randomuser.me/api/portraits/men/67.jpg"
                            alt="Profile"
                            className="w-20 h-20 rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-xl font-semibold">Abernathy, Rex</h2>
                            <p className="text-sm text-gray-600">Account Manager (Full-Time)</p>
                            <p className="text-sm text-gray-600">
                                US Entity | Boston, Massachusetts, United States | Boston HQ
                            </p>
                            <p className="text-sm text-gray-600">rex_abernathy@gmail.com</p>
                            <p className="text-sm text-gray-600">+0 000 000 0000</p>
                        </div>
                    </div>
                    <div className="relative">
                        <button className="border px-4 py-[6px] rounded-lg">Actions</button>
                        <p className="text-xs text-gray-500 mt-1 text-center">Updates (0)</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white shadow-md rounded-xl">
                    <div className="border-b px-6 pt-4 pb-2">
                        <div className="flex space-x-6 text-sm font-medium">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    className={`pb-2 ${mainTab === tab ? 'text-teal-700 border-b-2 border-teal-700' : 'text-gray-500'}`}
                                    onClick={() => setMainTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        {mainTab === 'Information' && (
                            <div className="flex space-x-6 text-sm font-medium mt-4">
                                {subTabs.map((tab) => (
                                    <button
                                        key={tab}
                                        className={`pb-2 ${subTab === tab ? 'text-teal-700 border-b-2 border-teal-700' : 'text-gray-500'}`}
                                        onClick={() => setSubTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Subtab Content */}
                    {renderSubTabContent() || renderTimeOffTab() || (
                        <div className="p-6 text-gray-400 text-sm">No data available for "{subTab}" under "{mainTab}"</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CandidateTemp;
