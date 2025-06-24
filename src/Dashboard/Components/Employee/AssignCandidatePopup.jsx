import React, { useState, useRef, useMemo } from "react";
import { useDebouncedEffect } from "../../../hooks/useDebouncedEffect";
import { Search } from "lucide-react";
import axios from "axios";
import { getAvatarUrl } from "../../../utils/avatarUtils.js";
import AssignCandidateCard from "../Candidates/AssignCandidateCard.jsx";

export default function AssignCandidatePopup({ onClose, onAssign }) {
    const [candidates, setCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const tokenRef = useRef(localStorage.getItem("access_token"));
    const [selectedCandidate, setSelectedCandidate] = useState(null);


    const cancelTokenRef = useRef(null);

    const candidateWithAvatars = useMemo(() => {
        return candidates.map((cand) => ({
            ...cand,
            avatarUrl: getAvatarUrl(cand.first_name, cand.last_name, cand.profile_pic),
        }));
    }, [candidates]);


    useDebouncedEffect(() => {
        fetchCandidates(searchTerm);
    }, [searchTerm], 300);


    const fetchCandidates = async (query) => {
        if (cancelTokenRef.current) {
            cancelTokenRef.current.cancel("Operation canceled due to new request.");
        }

        cancelTokenRef.current = axios.CancelToken.source();

        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/candidate`, {
                params: { search: query },
                headers: {
                    Authorization: `Bearer ${tokenRef.current}`,
                },
                cancelToken: cancelTokenRef.current.token,
            });

            if (response.data.status) {
                setCandidates(response.data.data);
            } else {
                setCandidates([]);
            }
        } catch (error) {
            if (axios.isCancel(error)) {
                // Request was canceled
                console.log("Request canceled", error.message);
            } else {
                console.error("Error fetching candidates:", error);
                setCandidates([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAssign = () => {
        if (selectedCandidate) {
            onAssign(selectedCandidate.id);
            onClose();
        }
    };
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-2xl p-6 w-[90%] max-w-md shadow-2xl space-y-4 transition-all">
                <h2 className="text-xl font-semibold text-center text-teal-600">Assign Candidate</h2>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search candidate..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full text-sm px-4 py-2 pr-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-800"
                    />
                    <Search className="absolute top-2.5 right-3 text-gray-400 dark:text-gray-500" />
                </div>

                {loading ? (
                    <div className="max-h-[360px] min-h-[360px] overflow-y-auto space-y-3 pr-1">
                        {[...Array(5)].map((_, idx) => (
                            <AssignCandidateCard.Skeleton key={idx} />
                        ))}
                    </div>
                ) : (
                    <div className="max-h-[360px] overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        {candidateWithAvatars.length > 0 ? (
                            candidateWithAvatars.map((cand) => {
                                const isSelected = selectedCandidate?.id === cand.id;
                                return (
                                    <AssignCandidateCard
                                        key={cand.id}
                                        candidate={cand}
                                        isSelected={isSelected}
                                        onSelect={setSelectedCandidate}
                                    />
                                );
                            })
                        ) : (
                            <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-6">
                                No candidates found.
                            </div>
                        )}

                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedCandidate}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Assign
                    </button>
                </div>
            </div>
        </div>
    );
}
