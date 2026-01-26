// src/pages/Reports/CandidateReports.jsx
import React, { useState, useEffect, useRef } from "react";
import { Search, Filter, Clock, DollarSign, Eye, FileText, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "../../Components/SnackbarContext";
import Loader from "../../Components/Loader";
import GenerateInvoiceModal from "../../Components/Candidates/GenerateInvoiceModal";

// Helper function to format hours for display
const formatHoursForDisplay = (hours) => {
    if (hours === undefined || hours === null) return '0.00 hrs';
    
    // If backend provides formatted_hours, use it
    if (typeof hours === 'object' && hours.formatted_hours) {
        return hours.formatted_hours;
    }
    
    // Otherwise format it client-side
    const hoursValue = typeof hours === 'object' ? hours.total_hours || 0 : hours;
    
    if (hoursValue < 0.01) {
        const minutes = hoursValue * 60;
        
        if (minutes < 0.1) {
            const seconds = Math.round(hoursValue * 3600);
            return `${seconds} sec`;
        }
        
        return `${minutes.toFixed(1)} min`;
    }
    
    // If less than 1 hour but more than 0.01 hours, show in minutes
    if (hoursValue < 1) {
        const minutes = hoursValue * 60;
        return `${minutes.toFixed(1)} min`;
    }
    
    // For 1 hour or more, show in hours with 2 decimal places
    return `${hoursValue.toFixed(2)} hrs`;
};

export default function CandidateReports() {
    const [loading, setLoading] = useState(true);
    const [candidates, setCandidates] = useState([]);
    const [employeeInfo, setEmployeeInfo] = useState(null);
    const [selectedCandidates, setSelectedCandidates] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState("");
    
    // Separate states for date inputs and applied filters
    const [tempDateRange, setTempDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date()
    });
    const [appliedDateRange, setAppliedDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date()
    });
    
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const abortControllerRef = useRef(null);

    // Format dates for input fields
    const formatDateForInput = (date) => {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Fetch candidate work hours
    const fetchCandidateWorkHours = async (startDate, endDate) => {
        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/invoices/work-hours/employee`,
                {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token"),
                    },
                    params: {
                        start_date: formatDateForInput(startDate),
                        end_date: formatDateForInput(endDate)
                    },
                    signal: abortControllerRef.current.signal
                }
            );
            
            // Ensure all candidates have proper formatted hours
            const formattedCandidates = (response.data.data.candidates || []).map(candidate => ({
                ...candidate,
                display_hours: candidate.formatted_hours || formatHoursForDisplay(candidate.total_hours || 0)
            }));
            
            setCandidates(formattedCandidates);
            setEmployeeInfo(response.data.data.employee);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
            } else {
                console.error("Error fetching candidate work hours:", error);
                showSnackbar("Failed to load candidate data", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchCandidateWorkHours(appliedDateRange.startDate, appliedDateRange.endDate);
        
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = filteredCandidates.map(c => c.id);
            setSelectedCandidates(new Set(allIds));
        } else {
            setSelectedCandidates(new Set());
        }
    };

    const handleSelectCandidate = (candidateId) => {
        const newSelected = new Set(selectedCandidates);
        if (newSelected.has(candidateId)) {
            newSelected.delete(candidateId);
        } else {
            newSelected.add(candidateId);
        }
        setSelectedCandidates(newSelected);
    };

    const handleViewInvoices = (candidateId) => {
        navigate(`/dashboard/reports/candidate/${candidateId}/invoices`);
    };

    // Date input handlers
    const handleStartDateChange = (e) => {
        const value = e.target.value;
        if (!value) return;
        
        const newDate = new Date(value);
        setTempDateRange(prev => ({
            ...prev,
            startDate: newDate
        }));
    };

    const handleEndDateChange = (e) => {
        const value = e.target.value;
        if (!value) return;
        
        const newDate = new Date(value);
        setTempDateRange(prev => ({
            ...prev,
            endDate: newDate
        }));
    };

    // Apply filter button handler
    const handleApplyFilter = async () => {
        // Validate dates
        if (!tempDateRange.startDate || !tempDateRange.endDate) {
            showSnackbar("Please select both start and end dates", "error");
            return;
        }
        
        if (tempDateRange.endDate < tempDateRange.startDate) {
            showSnackbar("End date cannot be before start date", "error");
            return;
        }
        
        // Apply the filter
        setAppliedDateRange({
            startDate: tempDateRange.startDate,
            endDate: tempDateRange.endDate
        });
        
        // Fetch data with new filter
        await fetchCandidateWorkHours(tempDateRange.startDate, tempDateRange.endDate);
        
        // Reset to first page
        setCurrentPage(1);
        
        // Clear selected candidates
        setSelectedCandidates(new Set());
        
        showSnackbar("Filter applied successfully", "success");
    };

    // Clear filter button handler
    const handleClearFilter = async () => {
        const defaultStartDate = new Date(new Date().setDate(new Date().getDate() - 30));
        const defaultEndDate = new Date();
        
        setTempDateRange({
            startDate: defaultStartDate,
            endDate: defaultEndDate
        });
        
        setAppliedDateRange({
            startDate: defaultStartDate,
            endDate: defaultEndDate
        });
        
        // Fetch data with default filter
        await fetchCandidateWorkHours(defaultStartDate, defaultEndDate);
        
        setCurrentPage(1);
        setSelectedCandidates(new Set());
        
        showSnackbar("Filter cleared", "info");
    };

    // Check if filter has been changed from applied values
    const isFilterChanged = () => {
        return (
            tempDateRange.startDate.getTime() !== appliedDateRange.startDate.getTime() ||
            tempDateRange.endDate.getTime() !== appliedDateRange.endDate.getTime()
        );
    };

    // Quick filter handlers - apply immediately
    const handleQuickFilter = async (days) => {
        const today = new Date();
        const startDate = new Date(today);
        
        let newStartDate = today;
        let newEndDate = today;
        
        if (days === 0) {
            // Today
            newStartDate = today;
            newEndDate = today;
        } else if (days === 7) {
            // Last 7 days
            startDate.setDate(today.getDate() - 6);
            newStartDate = startDate;
            newEndDate = today;
        } else if (days === 30) {
            // Last 30 days
            startDate.setDate(today.getDate() - 29);
            newStartDate = startDate;
            newEndDate = today;
        } else if (days === 'thisMonth') {
            // This month
            newStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
            newEndDate = today;
        } else if (days === 'lastMonth') {
            // Last month
            newStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            newEndDate = new Date(today.getFullYear(), today.getMonth(), 0);
        }
        
        setTempDateRange({
            startDate: newStartDate,
            endDate: newEndDate
        });
        
        setAppliedDateRange({
            startDate: newStartDate,
            endDate: newEndDate
        });
        
        // Fetch data immediately
        await fetchCandidateWorkHours(newStartDate, newEndDate);
        
        // Reset to first page
        setCurrentPage(1);
        setSelectedCandidates(new Set());
        
        showSnackbar("Quick filter applied", "success");
    };

    // Filter candidates based on search term (client-side filtering)
    const filteredCandidates = candidates.filter(candidate => {
        if (!searchTerm.trim()) return true;
        
        const fullName = `${candidate.first_name || ''} ${candidate.last_name || ''}`.toLowerCase();
        const searchLower = searchTerm.toLowerCase();
        
        return (
            fullName.includes(searchLower) ||
            (candidate.email && candidate.email.toLowerCase().includes(searchLower)) ||
            (candidate.phone && candidate.phone.includes(searchTerm)) ||
            (candidate.job_title && candidate.job_title.toLowerCase().includes(searchLower)) ||
            (candidate.client_name && candidate.client_name.toLowerCase().includes(searchLower)) ||
            (candidate.client && candidate.client.name && candidate.client.name.toLowerCase().includes(searchLower))
        );
    });

    const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
    const paginatedCandidates = filteredCandidates.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages || page === currentPage) return;
        setCurrentPage(page);
        
        // Smooth scroll to top of table
        const tableElement = document.querySelector('.bg-white.rounded-xl.shadow.overflow-hidden');
        if (tableElement) {
            window.scrollTo({
                top: tableElement.offsetTop - 20,
                behavior: 'smooth'
            });
        }
    };

    // Debounced search handler
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    if (loading) return <Loader message="Loading candidate reports..." />;

    return (
        <div className="min-h-screen flex flex-col bg-[#fef2f2]">
            <div className="w-full max-w-7xl mx-auto py-8 px-4 flex-grow flex flex-col space-y-8">
                {/* Header Card */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Candidate Work Reports</h1>
                            <p className="text-gray-600 mt-1">
                                Manage and generate invoices for candidates
                        
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/dashboard/reports/invoices')}
                                className="px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 flex items-center gap-2 transition-colors"
                            >
                                <FileText size={18} />
                                View All Invoices
                            </button>

                            <button
                                onClick={() => setShowInvoiceModal(true)}
                                disabled={selectedCandidates.size === 0}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                                    selectedCandidates.size > 0
                                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <DollarSign size={18} />
                                Generate Invoice
                            </button>
                        </div>
                    </div>

                    {/* Filters Section - Optimized layout */}
                    <div className="space-y-6">
                        {/* Main Filters Grid - Now 2 columns */}
                        <div className="grid grid-cols-2 lg:grid-cols-2 gap-6">
                            {/* Left Column: Date Range with buttons aligned */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Date Range</h3>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="date"
                                            value={formatDateForInput(tempDateRange.startDate)}
                                            onChange={handleStartDateChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                            max={formatDateForInput(new Date())}
                                        />
                                        <span className="text-gray-500 font-medium">to</span>
                                        <input
                                            type="date"
                                            value={formatDateForInput(tempDateRange.endDate)}
                                            onChange={handleEndDateChange}
                                            min={formatDateForInput(tempDateRange.startDate)}
                                            max={formatDateForInput(new Date())}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                        />
                                    </div>
                                </div>

                                {/* Filter Action Buttons - Perfectly aligned */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleApplyFilter}
                                        disabled={!isFilterChanged()}
                                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                                            isFilterChanged()
                                                ? 'bg-teal-600 text-white hover:bg-teal-700'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <Filter size={16} />
                                        Apply Filter
                                    </button>
                                    
                                    <button
                                        onClick={handleClearFilter}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span className="text-sm">Clear</span>
                                    </button>
                                </div>
                            </div>

                            {/* Right Column: Search with statistics */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Search</h3>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-[450px] px-3 py-[9px] pl-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="Search candidates, jobs, or clients..."
                                        />
                                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Filters Section - Compact and aligned */}
                        <div className="pt-4 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                                <h3 className="text-sm font-medium text-gray-700">Quick filters:</h3>
                                <div className="text-xs text-gray-500">
                                    Click to apply immediately
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => handleQuickFilter(0)}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
                                >
                                    Today
                                </button>
                                <button
                                    onClick={() => handleQuickFilter(7)}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
                                >
                                    Last 7 days
                                </button>
                                <button
                                    onClick={() => handleQuickFilter(30)}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
                                >
                                    Last 30 days
                                </button>
                                <button
                                    onClick={() => handleQuickFilter('thisMonth')}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
                                >
                                    This month
                                </button>
                                <button
                                    onClick={() => handleQuickFilter('lastMonth')}
                                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors"
                                >
                                    Last month
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Candidates Table - Only shows candidates with hours */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    {filteredCandidates.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-4 text-left">
                                                <div className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCandidates.size === filteredCandidates.length && filteredCandidates.length > 0}
                                                        onChange={handleSelectAll}
                                                        className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                                                    />
                                                    <span className="ml-2 text-sm font-medium text-gray-700">Select All</span>
                                                </div>
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Candidate</th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Job & Client</th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm">Hours Worked</span>
                                                </div>
                                            </th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Status</th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {paginatedCandidates.map((candidate) => (
                                            <tr key={candidate.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCandidates.has(candidate.id)}
                                                        onChange={() => handleSelectCandidate(candidate.id)}
                                                        className="h-4 w-4 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
                                                    />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div>
                                                        <div className="font-medium text-sm text-gray-900">
                                                            {candidate.first_name} {candidate.last_name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {candidate.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="text-sm">
                                                        <div className="font-medium text-sm text-gray-900">
                                                            {candidate.job_title || 'No job assigned'}
                                                        </div>
                                                        {candidate.client && (
                                                            <div className="flex items-center text-sm gap-1 text-gray-500">
                                                                {candidate.client.name}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="min-w-[80px]">
                                                            <span className="font-semibold text-sm text-gray-900">
                                                                {candidate.display_hours || formatHoursForDisplay(candidate.total_hours || 0)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        (candidate.total_hours || 0) > 0
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        Worked
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <button
                                                        onClick={() => handleViewInvoices(candidate.id)}
                                                        className="px-3 py-1 text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded flex items-center gap-1 transition-colors"
                                                    >
                                                        <Eye size={14} />
                                                        View Invoices
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="border-t border-gray-200 px-4 py-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="text-sm text-gray-700">
                                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCandidates.length)} of {filteredCandidates.length} candidates
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                            >
                                                Previous
                                            </button>
                                            
                                            {/* Page numbers */}
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (currentPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (currentPage >= totalPages - 2) {
                                                    pageNum = totalPages - 4 + i;
                                                } else {
                                                    pageNum = currentPage - 2 + i;
                                                }

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`px-4 py-2 text-sm border rounded-lg min-w-[44px] transition-colors ${
                                                            currentPage === pageNum
                                                                ? 'bg-teal-600 text-white border-teal-600'
                                                                : 'border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                            
                                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                                <span className="px-2 py-2 text-gray-500">...</span>
                                            )}
                                            
                                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                                <button
                                                    onClick={() => handlePageChange(totalPages)}
                                                    className={`px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors ${
                                                        currentPage === totalPages ? 'bg-teal-600 text-white border-teal-600' : ''
                                                    }`}
                                                >
                                                    {totalPages}
                                                </button>
                                            )}
                                            
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="px-4 py-2 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Filter size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates with work hours found</h3>
                            <p className="text-gray-500">
                                {searchTerm 
                                    ? 'No candidates match your search in the selected date range' 
                                    : 'No candidates have worked in the selected date range'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Invoice Modal */}
            {showInvoiceModal && (
                <GenerateInvoiceModal
                    selectedCandidates={Array.from(selectedCandidates)}
                    candidates={candidates.filter(c => selectedCandidates.has(c.id))}
                    dateRange={appliedDateRange}
                    onClose={() => setShowInvoiceModal(false)}
                    onSuccess={() => {
                        setShowInvoiceModal(false);
                        setSelectedCandidates(new Set());
                        fetchCandidateWorkHours(appliedDateRange.startDate, appliedDateRange.endDate);
                    }}
                />
            )}
        </div>
    );
}