import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useSnackbar } from "../../Components/SnackbarContext";

export default function AssignJobPopup({ onClose, onAssign, employeeId }) {
    const [jobs, setJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        setLoading(true);

        // Simulate fetching jobs
        setTimeout(() => {
            setJobs([
                {
                    id: 1,
                    title: "Frontend Developer",
                    department: "Engineering",
                    location: "Bangalore",
                    description: "React-based frontend application development",
                    postedBy: "John Doe",
                    photo: "https://randomuser.me/api/portraits/men/43.jpg",
                },
                {
                    id: 2,
                    title: "Backend Developer",
                    department: "Engineering",
                    location: "Hyderabad",
                    description: "Node.js API development and database management",
                    postedBy: "Jane Smith",
                    photo: "https://randomuser.me/api/portraits/women/55.jpg",
                },
                {
                    id: 3,
                    title: "Product Manager",
                    department: "Product",
                    location: "Mumbai",
                    description: "Lead cross-functional teams to launch product features",
                    postedBy: "Raj Kumar",
                    photo: "https://randomuser.me/api/portraits/men/68.jpg",
                },
                {
                    id: 4,
                    title: "UI/UX Designer",
                    department: "Design",
                    location: "Delhi",
                    description: "Design intuitive user experiences and interfaces",
                    postedBy: "Aisha Ali",
                    photo: "https://randomuser.me/api/portraits/women/43.jpg",
                },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    const filteredJobs = jobs.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.postedBy.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleAssign = () => {
        if (selectedJob) {
            onAssign(employeeId, selectedJob);
            onClose();
            showSnackbar(`Job has been successfully assigned`, "success");
        }
    };


    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl p-6 w-[90%] max-w-md shadow-2xl space-y-4 transition-all">
                <h2 className="text-xl font-semibold text-center text-teal-600">
                    Assign Job
                </h2>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by job title or employee name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-sm px-4 py-[10px] pr-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800"
                    />
                    <Search className="absolute top-[6px] right-3 text-gray-400 dark:text-gray-500" />
                </div>

                {loading ? (
                    <div className="text-center py-6 text-teal-500">Loading jobs...</div>
                ) : (
                    <div className="max-h-[360px] overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        {filteredJobs.map((job) => {
                            const isSelected = selectedJob?.id === job.id;

                            return (
                                <div
                                    key={job.id}
                                    className={`relative group p-5 rounded-2xl border shadow-md transition-all duration-200 ${isSelected
                                        ? "bg-teal-100/70 dark:bg-teal-800 border-teal-600"
                                        : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
                                        }`}
                                >
                                    {/* Checkbox on top-right */}
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => setSelectedJob(isSelected ? null : job)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute top-4 right-4 w-5 h-5 text-teal-600 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded focus:ring-teal-500"
                                    />

                                    {/* Profile */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <img
                                            src={job.photo}
                                            alt={job.postedBy}
                                            className="w-11 h-11 rounded-full border object-cover border-gray-300 dark:border-gray-600"
                                        />
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                            {job.postedBy}
                                        </div>
                                    </div>

                                    {/* Job Info */}
                                    <div className="space-y-1 pl-1">
                                        <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                                            {job.title}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {job.department} — {job.location}
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                            {job.description}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}


                    </div>
                )}

                <div className="flex justify-end gap-4 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedJob}
                        className="px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition disabled:opacity-50"
                    >
                        Assign Job
                    </button>
                </div>
            </div>
        </div>
    );
}
