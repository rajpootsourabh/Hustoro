import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, ChevronDown, ClipboardList, Hand, Mail, MessageCircle, MessageSquareText, UserPlus } from 'lucide-react';
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/solid';
import Timeline from '../../Components/Candidates/TimelineTab';
import ProfileTab from '../../Components/Candidates/ProfileTab';
import CommunicationTab from '../../Components/Candidates/CommunicationTab';
import ReviewTab from '../../Components/Candidates/ReviewTab';
import CommentTab from '../../Components/Candidates/CommentTab';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import ResumeViewer from '../../Components/Candidates/ResumeViewer';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ProfileImage from '../../Components/ProfileImage';


export default function CandidateProfile() {
    const [activeTab, setActiveTab] = useState('Profile');
    const { id } = useParams();
    const [candidateData, setCandidateData] = useState(null);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/dashboard/candidates');
    };

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/v.1/job-applications/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`
                    }
                });
                setCandidateData(response.data.data);
                console.log("Fetched candidate data:", response.data);
            } catch (error) {
                console.error("Error fetching candidate:", error);
            }
        };

        if (id) fetchCandidate();
    }, [id]);


    return (
        <div className="min-h-screen flex flex-col bg-[#f6f6f6]">
            <div className="w-full max-w-6xl mx-auto py-8 px-4 flex-grow flex flex-col space-y-6">
                <button onClick={handleBack} className="flex items-center gap-1 text-sm text-gray-600">
                    <ArrowLeft className="w-4 h-4" />
                    Back to candidates
                </button>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Left Section (2/3 Width on md+) */}
                    <div className="md:col-span-3 space-y-6">
                        {/* Top Header */}
                        <div className="flex justify-end items-center bg-white px-4 py-2 rounded-xl shadow-sm flex-wrap gap-4">
                            <div className="flex space-x-4 items-center">
                                {/* Calendar */}
                                <button
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Schedule interview"
                                    className="p-2 rounded-md hover:bg-gray-100"
                                >
                                    <Calendar size={20} />
                                </button>

                                {/* Comment */}
                                {/* <button
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Add comment"
                                    className="p-2 rounded-md hover:bg-gray-100"
                                >
                                    <MessageCircle size={20} />
                                </button> */}

                                {/* Send Email Button */}
                                <button
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Send Email"
                                    className="p-2 rounded-md hover:bg-gray-100"
                                >
                                    <Mail size={20} />
                                </button>

                                {/* Evaluation Button */}
                                <button
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Add evaluation"
                                    className="p-2 rounded-md hover:bg-gray-100"
                                >
                                    <ClipboardList size={20} />
                                </button>


                                {/* Send Text Message */}
                                <button
                                    data-tooltip-id="tooltip"
                                    data-tooltip-content="Send text message"
                                    className="p-2 rounded-md hover:bg-gray-100"
                                >
                                    <MessageSquareText size={20} />
                                </button>

                                {/* Red Hand */}
                                <div className="relative">
                                    <button
                                        data-tooltip-id="tooltip"
                                        data-tooltip-content="Disqualify candidate"
                                        className="px-2 py-[10px] rounded-md bg-red-100 text-red-600 flex items-center space-x-4"
                                    >
                                        <Hand size={16} />
                                        <ChevronDown size={16} />
                                    </button>
                                </div>

                                {/* Move to phone screen */}
                                <button
                                    className="bg-teal-700 text-white px-4 py-[8px] rounded-3xl flex items-center space-x-1"
                                >
                                    <span className="text-sm">Move to phone screen</span>
                                    <ChevronDown size={16} />
                                </button>
                                {/* Global Tooltip Component */}
                                <Tooltip id="tooltip" place="top" />
                            </div>
                        </div>


                        {/* Candidate Card */}
                        <div className="bg-white px-8 py-12 rounded-xl shadow-sm flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                            <ProfileImage
                                src={candidateData?.candidate?.profile_pic}
                                alt="Profile"
                                height={20}
                                width={20}
                                iconSize={50}
                            />
                            <div className="flex-grow text-center md:text-left">
                                <h2 className="text-md font-semibold"> {candidateData?.candidate?.first_name} {candidateData?.candidate?.last_name}</h2>

                                <div className="flex flex-col md:flex-row justify-center md:justify-start items-center gap-6 text-gray-700">
                                    <p className="flex items-center text-xs">
                                        <MapPinIcon className="w-4 h-4 mr-1" />
                                        {candidateData?.candidate?.location || "Not specified"}
                                    </p>
                                    <p className="flex items-center text-xs">
                                        <PhoneIcon className="w-4 h-4 mr-1" />
                                        +91  {candidateData?.candidate?.phone || "0 000 000 0000"}
                                    </p>
                                </div>

                                <p className="text-xs text-blue-500 mt-1">#referrals</p>
                            </div>

                            <div className="text-center md:text-right">
                                <button className="flex items-center text-sm text-gray-600 bg-[#f6f6f6] border px-2 py-1 rounded-md">
                                    <UserPlus size={16} className="mr-1" />
                                    0 <span className="ml-1 text-sm">Follow</span>
                                </button>
                                <p className="leading-tight mt-1 text-left">
                                    <span className="text-[#050359] text-xs">{candidateData?.candidate?.designation || "No designation"}</span><br />
                                    <span className="text-gray-600 text-xs">{candidateData?.job_post?.source_id || "Sourced"}</span>
                                </p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="bg-white rounded-xl shadow-sm">
                            <div className="border-b flex flex-wrap">
                                {['Profile', 'Timeline', 'Communication', 'Review', 'Comments'].map(tab => (
                                    <button
                                        key={tab}
                                        className={`px-4 py-4 text-sm font-medium ${activeTab === tab
                                            ? 'border-b-2 border-emerald-600 text-emerald-600'
                                            : 'text-gray-500'
                                            }`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            {activeTab === "Profile" && (
                                <div className="p-6">
                                    <ProfileTab candidateData={candidateData} />
                                </div>
                            )}

                            {activeTab === 'Timeline' && (
                                <div className="p-2">
                                    <Timeline applicationId={candidateData?.id} />
                                </div>
                            )}

                            {activeTab === 'Communication' && (
                                <div className="p-2">
                                    <CommunicationTab applicationId={candidateData?.id} />
                                </div>
                            )}

                            {activeTab === 'Review' && (
                                <div className="p-2">
                                    <ReviewTab applicationId={candidateData?.id} />
                                </div>
                            )}

                            {activeTab === 'Comments' && (
                                <div className="p-2">
                                    <CommentTab applicationId={candidateData?.id} />
                                </div>
                            )}

                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="md:col-span-1 bg-white rounded-xl shadow-sm p-4 h-fit border-l border-gray-200">
                        <h4 className="text-md font-semibold mb-2 text-center md:text-center">Candidate Overview</h4>

                        {/* Horizontal line */}
                        <div className="border-t border-gray-200 my-3" />

                        <p className="text-sm text-gray-400 text-center md:text-center">No Activity Yet</p>
                    </div>

                </div>
                {/* <ResumePreview pdfSrc="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf" /> */}

            </div>
        </div>
    );


}
