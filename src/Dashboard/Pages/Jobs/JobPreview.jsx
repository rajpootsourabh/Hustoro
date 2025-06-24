import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ActionButton from "../../Components/ActionButton";
import { motion, AnimatePresence } from "framer-motion";

export default function JobPreview() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    // State for active tab: 'overview' or 'application'
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/job/${id}`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("access_token"),
                    },
                });
                setJob(response.data.data);
            } catch (error) {
                console.error("Error fetching job:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    if (loading)
        return (
            <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse space-y-6 text-gray-300">
                {/* Your existing skeleton loader code unchanged */}
                <div className="text-center mb-10 space-y-4">
                    <div className="mx-auto h-6 w-48 bg-gray-300 rounded-md" />
                    <div className="mx-auto h-5 w-40 bg-gray-300 rounded-md" />
                    <div className="mx-auto h-4 w-32 bg-gray-300 rounded-md" />
                    <div className="mx-auto h-4 w-60 bg-gray-300 rounded-md" />
                </div>

                <div className="h-10 w-full border-b border-gray-300" />

                <div className="space-y-8">
                    <div>
                        <div className="h-6 w-40 bg-gray-300 rounded mb-2" />
                        <div className="h-20 w-full bg-gray-300 rounded" />
                    </div>
                    <div>
                        <div className="h-6 w-40 bg-gray-300 rounded mb-2" />
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-4 w-3/4 bg-gray-300 rounded" />
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="h-6 w-40 bg-gray-300 rounded mb-2" />
                        <div className="space-y-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-4 w-3/4 bg-gray-300 rounded" />
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 flex justify-center">
                        <div className="h-10 w-[180px] bg-gray-300 rounded" />
                    </div>
                </div>
            </div>
        );

    if (!job) return <div className="text-center mt-10">Job not found.</div>;

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Top Section (White) */}
            <div className="flex-shrink-0 flex flex-col max-w-4xl mx-auto px-4 pt-10 text-gray-800">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-semibold text-teal-600 mb-2">{job.company_name}</h1>
                    <p className="text-lg font-medium">{job.job_title}</p>
                    <p className="uppercase text-sm text-gray-500">{job.job_workplace}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        {job.job_location} • {job.employment_type} • {job.job_code}
                    </p>
                </div>

                {/* Tabs */}
                <div className="sticky top-0 border-b border-gray-300 z-30 bg-white">
                    <nav className="flex justify-start gap-6 font-medium">
                        <span
                            onClick={() => setActiveTab("overview")}
                            className={`cursor-pointer pb-2 ${activeTab === "overview"
                                ? "border-b-2 border-teal-600 text-teal-600"
                                : "text-gray-400"
                                }`}
                        >
                            Overview
                        </span>
                        <span
                            onClick={() => setActiveTab("application")}
                            className={`cursor-pointer pb-2 ${activeTab === "application"
                                ? "border-b-2 border-teal-600 text-teal-600"
                                : "text-gray-400"
                                }`}
                        >
                            Application
                        </span>
                    </nav>
                </div>
            </div>

            {/* Bottom Section (Light Red Background) */}
            <div className="bg-[#f3f5f8] flex-grow flex flex-col py-10">
                <div className="max-w-4xl mx-auto px-4 flex-grow">
                    <AnimatePresence mode="wait">
                        {activeTab === "overview" && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                className="space-y-8 h-full"
                            >
                                <section>
                                    <h2 className="text-lg font-semibold mb-2">Description</h2>
                                    <p className="text-sm text-gray-700">{job.description}</p>
                                </section>

                                <section>
                                    <h2 className="text-lg font-semibold mb-2">Requirement</h2>
                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                        {job.requirements
                                            .split("\n")
                                            .map(req => req.trim())
                                            .filter(req => req.length > 0) // remove empty lines
                                            .map((req, index) => {
                                                const withDot = req.endsWith(".") ? req : req + ".";
                                                return (
                                                    <li className="text-sm" key={index}>
                                                        {withDot}
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                </section>


                                <section>
                                    <h2 className="text-lg font-semibold mb-2">Benefits</h2>
                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                        {job.benefits
                                            .split("\n")
                                            .map(benefit => benefit.trim())
                                            .filter(benefit => benefit.length > 0) // remove empty lines
                                            .map((benefit, index) => {
                                                const withDot = benefit.endsWith(".") ? benefit : benefit + ".";
                                                return (
                                                    <li className="text-sm" key={index}>
                                                        {withDot}
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                </section>
                                <div className="pt-6 flex justify-center">
                                    <ActionButton
                                        label="Apply For this job"
                                        onClick={() => setActiveTab("application")} // <-- Switch to application tab
                                        isLoading={false}
                                        className="w-[180px] h-[38px] font-semibold"
                                        labelClassName="text-sm"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {activeTab === "application" && (
                            <motion.div
                                key="application"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                className="text-center text-gray-700 h-full flex items-center justify-center"
                            >
                                <p>Application process details or form can go here.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
