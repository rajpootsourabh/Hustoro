import React, { useState } from "react";
import { Search, MoreVertical, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const employees = [
    {
        name: "Abernathy, Rex",
        role: "Account Manager",
        email: "rex_abernathy@gmail.com",
        phone: "+0 000 000 0000",
        reportTo: "Greenholt, Eulah",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        name: "Adams, Okey",
        role: "Senior Account",
        email: "okey_adams@gmail.com",
        phone: "+0 000 000 0000",
        reportTo: "Pollich, Sam",
        img: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
        name: "Benson, Clare",
        role: "Marketing Director",
        email: "clare_benson@gmail.com",
        phone: "+0 000 000 0000",
        reportTo: "Morris, Emma",
        img: "https://randomuser.me/api/portraits/women/47.jpg",
    },
    {
        name: "Cameron, Sarah",
        role: "Lead Developer",
        email: "sarah_cameron@gmail.com",
        phone: "+0 000 000 0000",
        reportTo: "Barton, David",
        img: "https://randomuser.me/api/portraits/women/42.jpg",
    },
    {
        name: "Fletcher, Dean",
        role: "Product Manager",
        email: "dean_fletcher@gmail.com",
        phone: "+0 000 000 0000",
        reportTo: "Browning, Mia",
        img: "https://randomuser.me/api/portraits/men/50.jpg",
    },
    {
        name: "Gregory, Tara",
        role: "HR Specialist",
        email: "tara_gregory@gmail.com",
        phone: "+0 000 000 0000",
        reportTo: "Wells, Kevin",
        img: "https://randomuser.me/api/portraits/women/35.jpg",
    },
];


export default function Employee() {
    const [isFocused, setIsFocused] = useState(false);
    const tabs = ["People Directory", "ORG Chart", "Onboarding", "Performance"];
    const [activeTab, setActiveTab] = useState("People Directory");

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
            {/* Main Card */}
            <div className="bg-white rounded-xl shadow p-6 space-y-6">
                {/* Tabs */}
                <div className="overflow-x-auto">
                    <div className="flex space-x-3 sm:space-x-6 md:space-x-10 lg:space-x-14 border-b border-gray-300 pb-2 mb-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`text-sm pb-2 transition-colors whitespace-nowrap ${activeTab === tab
                                        ? "text-teal-700 font-semibold"
                                        : "text-black hover:text-teal-600"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>


                {/* Top Bar */}
                <div className="flex justify-between items-center flex-wrap gap-2">
                    <h2 className="text-xl font-semibold">People Directory</h2>
                    <Link to="new">
                    <button className="text-sm px-6 py-[5px] border-[1.5px] border-teal-700 text-teal-700 rounded-full font-semibold hover:bg-teal-50">
                        Add Employee
                    </button>
                    </Link>
                </div>

                {/* Search Input */}
                <div className="relative w-full max-w-lg">
                    {/* Floating Label */}
                    <label
                        className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-white px-1 text-gray-500 transition-all duration-200 pointer-events-none ${isFocused ? "top-1 text-xs text-gray-400" : ""
                            }`}
                    >
                        Search Employee
                    </label>

                    {/* Input with icon */}
                    <div className="flex items-center border-[1.5px] border-gray-400 rounded-xl overflow-hidden focus-within:border-black transition">
                        <input
                            type="text"
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="flex-grow bg-transparent px-4 pt-5 pb-2 text-gray-800 placeholder-transparent focus:outline-none"
                        />
                        <div className="px-4 py-2">
                            <Search className="w-5 h-5 text-black" />
                        </div>
                    </div>
                </div>

            </div>

            {/* Employee Cards */}
            <div className="space-y-6">
                {employees.map((emp, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between flex-wrap gap-4 hover:shadow-sm"
                    >
                        {/* Image + Name */}
                        <div className="flex items-center space-x-4">
                            <img
                                src={emp.img}
                                alt={emp.name}
                                className="w-14 h-14 rounded-full object-cover"
                            />
                            <div>
                                <div className="font-semibold text-sm">{emp.name}</div>
                                <div className="text-xs text-gray-500">{emp.role}</div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="text-gray-500 space-y-1 text-left min-w-[200px]">
                            <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span className="text-xs">{emp.email}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span className="text-xs">{emp.phone}</span>
                            </div>
                        </div>

                        {/* Reporting Line */}
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                            Report to {emp.reportTo}
                        </div>

                        {/* More Menu */}
                        <MoreVertical className="text-gray-500 cursor-pointer" />
                    </div>
                ))}
            </div>
        </div>
    );
}





