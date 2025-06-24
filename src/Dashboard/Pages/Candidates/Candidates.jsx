import { Search, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import BottomCommandBar from '../../Components/Candidates/BottomCommandBar';
import { getTimeAgo } from '../../../utils/dateUtils';
import CandidateCard from '../../Components/Candidates/CandidateCard';

const Candidates = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [filters, setFilters] = useState({ department: '', job: '', stage: '', tag: '' });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch candidates from API
  useEffect(() => {
    const fetchCandidates = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/job-applications`, {
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
            country: application.candidate.country,
            stage: 'Sourced',
            source: 'Applied Stage',
            time: getTimeAgo(application.applied_at),
            img: application.candidate.profile_pic || null,
            jobLocation: application.job_post.job_location,
            designation: application.candidate.designation,
            department: 'Engineering', // Example: assign department here or fetch it properly
          }));

          setCandidates(transformedCandidates);
          setFilteredCandidates(transformedCandidates);
          setCurrentPage(1); // Reset to first page
        }
      } catch (error) {
        console.error("Failed to fetch candidates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  // Filter candidates based on search term and filters
  useEffect(() => {
    let results = candidates;

    if (searchTerm) {
      results = results.filter(candidate =>
        candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.stage.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

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
    setCurrentPage(1); // Reset page on filter/search change
  }, [searchTerm, filters, candidates]);

  // Pagination calculations
  const totalCandidates = filteredCandidates.length;
  const totalPages = Math.ceil(totalCandidates / pageSize);
  const paginatedCandidates = filteredCandidates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleCandidateSelection = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Filtering handled by useEffect
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName.toLowerCase()]: value
    }));
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedCandidates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedCandidates.map(c => c.id));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    setSelectedIds([]); // Clear selection on page change
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

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
                onFocus={() => setOpenDropdown(label)}
                onBlur={() => setOpenDropdown(null)}
                value={filters[label.toLowerCase()] || ''}
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
                className={`pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform duration-200 ${openDropdown === label ? 'rotate-180' : ''
                  }`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <div className="text-lg text-gray-800 font-medium">
            {totalCandidates} Candidate{totalCandidates !== 1 ? 's' : ''} Found
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-700">Per page:</label>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            >
              {[5, 10, 20, 50].map(size => (
                <option className="text-sm" key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
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
              checked={selectedIds.length === paginatedCandidates.length && paginatedCandidates.length > 0}
              onChange={handleSelectAll}
              className="w-5 h-5 accent-green-500 rounded-none"
            />
            <span>Candidate Information</span>
          </div>

          {/* Job Status Header */}
          <div className="hidden sm:flex text-left sm:mr-[220px]">Job Status</div>
        </div>

        {/* Candidate Items */}
        {paginatedCandidates.length > 0 ? (
          paginatedCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isLoading={isLoading}
              isSelected={selectedIds.includes(candidate.id)}
              onSelect={() => toggleCandidateSelection(candidate.id)}
            />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            No candidates found matching your search criteria.
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-6 text-gray-700">
            <button
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, idx) => {
              const pageNum = idx + 1;
              return (
                <button
                  key={pageNum}
                  className={`px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 ${pageNum === currentPage ? 'bg-teal-700 text-white hover:bg-teal-600' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {selectedIds.length > 0 && (
          <BottomCommandBar
            selectedCandidateIds={selectedIds}
            onCommandClick={(action, ids) => {
              console.log(`Action: ${action}, Candidates:`, ids);
              // handle logic based on action and selected IDs
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Candidates;
