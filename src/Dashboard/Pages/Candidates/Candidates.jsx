import { Search, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import BottomCommandBar from '../../Components/Candidates/BottomCommandBar';
import Loader from '../../Components/Loader';
import { getTimeAgo } from '../../../utils/dateUtils';
import { GoPerson } from 'react-icons/go';

const Candidates = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [filteredCandidates, setFilteredCandidates] = useState([]);
    const [filters, setFilters] = useState({ department: '', job: '', stage: '', tag: '' });
    const [openDropdown, setOpenDropdown] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);


    // Mock data - in a real app, you'd fetch this from an API
    useEffect(() => {
        const fetchCandidates = async () => {
            setIsLoading(true);
            try {
                // const response = await fetch("http://127.0.0.1:8000/api/v.1/job-applications", {
                const response = await fetch("http://127.0.0.1:8000/api/v.1/job-applications", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });

                const result = await response.json();

                if (result.status) {
                    const transformedCandidates = result.data.map(application => ({
                        id: application.id,
                        name: `${application.candidate.first_name} ${application.candidate.last_name}`,
                        status: application.status,
                        tag: '#developer',
                        jobTitle: application.job_post.job_title,
                        location: application.candidate.location,
                        stage: 'Sourced',
                        source: 'Applied Stage',
                        time: getTimeAgo(application.applied_at),
                        img: application.candidate.profile_pic || null
                    }));

                    setCandidates(transformedCandidates);
                    setFilteredCandidates(transformedCandidates);
                }
            } catch (error) {
                console.error("Failed to fetch candidates:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCandidates();
    }, []);


    // Handle search and filtering
    useEffect(() => {
        let results = candidates;

        // Apply search term filter
        if (searchTerm) {
            results = results.filter(candidate =>
                candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidate.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidate.stage.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply other filters
        if (filters.department) {
            results = results.filter(candidate =>
                candidate.department === filters.department
            );
        }

        if (filters.job) {
            results = results.filter(candidate =>
                candidate.jobTitle === filters.job
            );
        }

        if (filters.stage) {
            results = results.filter(candidate =>
                candidate.stage === filters.stage
            );
        }

        if (filters.tag) {
            results = results.filter(candidate =>
                candidate.tag === filters.tag
            );
        }

        setFilteredCandidates(results);
    }, [searchTerm, filters, candidates]);

    const toggleCandidateSelection = (id) => {
        setSelectedIds((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // The useEffect will handle the filtering automatically
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName.toLowerCase()]: value
        }));
    };

    if (isLoading) {
        return (
            <Loader message="Fetching candidates data..." />
        );
    }

    return (
        <div className="bg-[#f5f5f5] min-h-screen p-6 space-y-6">
            {/* Search Box */}
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">Candidate Search</h2>

                <form onSubmit={handleSearch} className="flex items-center gap-4">
                    <div className="flex items-center border rounded-md px-3 py-2 w-full max-w-xl">
                        <Search className="text-gray-400 w-4 h-4 mr-2" />
                        <input
                            type="text"
                            placeholder="Search all candidate using keyword"
                            className="w-full outline-none text-sm text-gray-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-teal-700 hover:bg-teal-600 text-white px-8 py-[10px] rounded-3xl font-medium text-sm"
                    >
                        Search
                    </button>
                </form>

                <hr />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {['Department', 'Job', 'Stage', 'Tag'].map((label) => (
                        <div key={label} className="relative">
                            <label className="absolute -top-2 left-3 px-1 text-sm bg-white text-gray-500 z-10">
                                {label}
                            </label>
                            <select
                                className="w-full px-3 py-3 text-sm border border-gray-300 rounded-lg appearance-none text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                onChange={(e) => handleFilterChange(label, e.target.value)}
                                onFocus={() => setOpenDropdown(label)}         // NEW
                                onBlur={() => setOpenDropdown(null)}           // NEW
                            >

                                <option value="">All {label}s</option>
                                {label === 'Department' && (
                                    <>
                                        <option>HR</option>
                                        <option>Engineering</option>
                                        <option>Design</option>
                                    </>
                                )}
                                {label === 'Job' && (
                                    <>
                                        <option>HR Executive</option>
                                        <option>Software Engineer</option>
                                        <option>UI/UX Designer</option>
                                    </>
                                )}
                                {label === 'Stage' && (
                                    <>
                                        <option>Screening</option>
                                        <option>Interview</option>
                                        <option>Offer</option>
                                    </>
                                )}
                                {label === 'Tag' && (
                                    <>
                                        <option>#candidate</option>
                                        <option>#developer</option>
                                        <option>#designer</option>
                                    </>
                                )}
                            </select>
                            <ChevronDown
                                className={`pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform duration-200 ${openDropdown === label ? 'rotate-180' : ''}`}
                            />

                        </div>
                    ))}
                </div>

            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
                <div className="text-lg text-gray-800 font-medium mb-4 sm:mb-6">
                    {filteredCandidates.length} Candidate{filteredCandidates.length !== 1 ? 's' : ''} Found
                </div>

                {/* Table Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b rounded-[4px] p-4 bg-red-50 mb-4 text-sm text-black gap-2 sm:gap-0">
                    {/* Mobile: Only checkbox */}
                    <div className="flex items-center gap-2 sm:hidden">
                        <input type="checkbox" className="w-5 h-5 accent-green-500 rounded-none" />
                    </div>

                    {/* Desktop: Full header */}
                    <div className="hidden sm:flex items-center gap-4">
                        <input
                            type="checkbox"
                            checked={selectedIds.length === filteredCandidates.length}
                            onChange={() => {
                                if (selectedIds.length === filteredCandidates.length) {
                                    setSelectedIds([]);
                                } else {
                                    setSelectedIds(filteredCandidates.map((c) => c.id));
                                }
                            }}
                            className="w-5 h-5 accent-green-500 rounded-none"
                        />


                        <span>Candidate Search</span>
                    </div>

                    {/* Job Status Header */}
                    <div className="hidden sm:flex text-left sm:mr-[220px]">Job Status</div>
                </div>

                {/* Candidate Items */}

                {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((candidate) => (
                        <div
                            key={candidate.id}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border-b-2 last:border-0 gap-4 sm:gap-6 hover:bg-gray-50 transition-colors"
                        >
                            {/* Left */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(candidate.id)}
                                        onChange={() => toggleCandidateSelection(candidate.id)}
                                        className="w-5 h-5 accent-green-500 rounded-none"
                                    />

                                    {candidate.img ? (
                                        <img
                                            src={candidate.img}
                                            alt={candidate.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                            <GoPerson className="w-6 h-6 text-gray-500" />
                                        </div>
                                    )}

                                </div>
                                <div className="min-w-0">
                                    <div className="font-semibold text-md text-gray-800 truncate">{candidate.name}</div>
                                    <div className="text-sm text-gray-500 truncate">{candidate.location}</div>
                                    <div className="text-xs mt-1 text-gray-400 truncate">{candidate.tag}</div>
                                </div>
                            </div>

                            {/* Right - Job Status */}
                            <div className="text-sm text-gray-600 space-y-1 sm:w-[300px] flex-shrink-0">
                                <div className="text-sm text-gray-800 truncate">{candidate.jobTitle}</div>
                                <div className="text-sm text-gray-800 truncate">{candidate.location}</div>
                                <div className="text-sm text-gray-800 truncate">
                                    At <span className="text-sm text-black font-semibold">{candidate.stage}</span> Stage
                                </div>
                                <div className="text-sm text-gray-800 truncate">
                                    Via <span className="text-sm text-black font-semibold">{candidate.source}</span>, {candidate.time}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No candidates found matching your search criteria.
                    </div>
                )}
                {selectedIds.length > 0 && <BottomCommandBar
                    selectedCandidateIds={selectedIds}
                    onCommandClick={(action, ids) => {
                        console.log(`Action: ${action}, Candidates:`, ids);
                        // handle logic based on action and selected IDs
                    }}
                />}

            </div>


        </div>
    );
};

export default Candidates;