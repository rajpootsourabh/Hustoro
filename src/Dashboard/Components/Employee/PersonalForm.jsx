"use client";

import { useRef } from "react";
import CustomSelect from "../CustomSelect"; // adjust path as needed
import DateInput from "../DateInputt"; // adjust path as needed

export default function PersonalInformationForm({profileImage,handleImageUpload}) {
    const sectionRefs = {
        Personal: useRef(null),
    };

    return (
        <section
            id="Personal"
            ref={sectionRefs.Personal}
            className="mt-2"
        >
            <h2 className="text-xl mb-2">Personal</h2>
            <p className="text-gray-500 text-sm">2/3 mandatory fields</p>

            {/* Basic Subsection */}
            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">Basic</h3>

                {/* Profile Picture Upload */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <label
                            htmlFor="profile-upload"
                            className="absolute -bottom-2 -right-2 bg-teal-600 text-white rounded-full p-2 cursor-pointer hover:bg-teal-700"
                            title="Upload photo"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </label>
                        <input
                            id="profile-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </div>
                    <div>
                        <p className="text-sm mb-1">Profile photo</p>
                        <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 5MB</p>
                    </div>
                </div>

                {/* Basic Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                        <label className="block text-sm mb-1">
                            <span className="text-red-500">*</span> First name
                        </label>
                        <input type="text" className="border rounded w-full p-2 text-sm" />
                    </div>

                    {/* Middle Name */}
                    <div>
                        <label className="block text-sm mb-1">Middle name</label>
                        <input type="text" className="border rounded w-full p-2 text-sm" />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm mb-1">
                            <span className="text-red-500">*</span> Last name
                        </label>
                        <input type="text" className="border rounded w-full p-2 text-sm" />
                    </div>

                    {/* Preferred Name */}
                    <div>
                        <label className="block text-sm mb-1">Preferred name</label>
                        <input type="text" className="border rounded w-full p-2 text-sm" />
                    </div>

                    {/* Country */}
                    <div>
                        <CustomSelect
                            label="Country"
                            optionsList={["India", "USA", "Canada"]}
                            showSearch
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm mb-1">Address</label>
                        <input type="text" className="border rounded w-full p-2 text-sm" />
                    </div>

                    {/* Gender */}
                    <div>
                        <CustomSelect
                            label="Gender"
                            optionsList={["Male", "Female", "Others"]}
                        />
                    </div>

                    {/* Birthdate */}
                    <div>
                        <label className="block text-sm mb-1">Birthdate</label>
                        <DateInput />
                    </div>

                    {/* Marital Status */}
                    <div>
                        <CustomSelect
                            label="Marital Status"
                            optionsList={["Single", "Married", "Common Law", "Domestic Partnership"]}
                        />
                    </div>
                </div>
            </div>

            {/* Contact Subsection */}
            <div>
                <h3 className="text-lg mb-4 text-gray-600">Contact</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm mb-1">Phone Number</label>
                        <input
                            type="text"
                            className="border rounded w-full p-2 text-sm"
                        />
                    </div>

                    {/* Work Email */}
                    <div>
                        <label className="block text-sm mb-1">Work Email</label>
                        <input
                            type="email"
                            className="border rounded w-full p-2 text-sm"
                        />
                    </div>

                    {/* Personal Email */}
                    <div>
                        <label className="block text-sm mb-1">Personal Email</label>
                        <input
                            type="email"
                            className="border rounded w-full p-2 text-sm"
                        />
                    </div>

                    {/* Chat & Video Call */}
                    <div>
                        <label className="block text-sm mb-1">Chat & video call</label>
                        <select className="border rounded w-full p-2 text-sm">
                            <option>Select</option>
                        </select>
                    </div>

                    {/* Social Media */}
                    <div>
                        <label className="block text-sm mb-1">Social Media</label>
                        <input
                            type="text"
                            className="border rounded w-full p-2 text-sm"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
