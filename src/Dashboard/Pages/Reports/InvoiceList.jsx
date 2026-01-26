// src/Dashboard/Pages/Reports/InvoiceList.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Download, FileText, Calendar, DollarSign, User, Building, ChevronDown, CheckCircle, Clock, Eye, AlertCircle, ArrowLeft } from "lucide-react";
import axios from "axios";
import { useSnackbar } from "../../Components/SnackbarContext";
import Loader from "../../Components/Loader";

export default function InvoiceList() {
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    
    // Separate states for date inputs and applied filters
    const [tempDateRange, setTempDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate: new Date()
    });
    const [appliedDateRange, setAppliedDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate: new Date()
    });
    
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

    // Fetch invoices
    const fetchInvoices = async (startDate, endDate) => {
        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        abortControllerRef.current = new AbortController();
        
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/invoices/employee/list`,
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
            
            setInvoices(response.data.data.invoices || []);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
            } else {
                console.error("Error fetching invoices:", error);
                showSnackbar("Failed to load invoices", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchInvoices(appliedDateRange.startDate, appliedDateRange.endDate);
        
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const downloadInvoicePDF = async (invoiceId, invoiceNumber) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/invoices/${invoiceId}/pdf`,
                {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token"),
                    },
                    responseType: 'blob'
                }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Invoice-${invoiceNumber}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            //showSnackbar("Invoice downloaded successfully", "success");
        } catch (error) {
            console.error("Error downloading PDF:", error);
            showSnackbar("Failed to download invoice", "error");
        }
    };

    const updateInvoiceStatus = async (invoiceId, newStatus) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/invoices/${invoiceId}/status`,
                { status: newStatus },
                {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token"),
                        "Content-Type": "application/json"
                    }
                }
            );

            showSnackbar("Invoice status updated successfully", "success");
            fetchInvoices(appliedDateRange.startDate, appliedDateRange.endDate); // Refresh the list
        } catch (error) {
            console.error("Error updating invoice status:", error);
            showSnackbar("Failed to update invoice status", "error");
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            draft: { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Draft' },
            sent: { color: 'bg-blue-100 text-blue-800', icon: Eye, label: 'Sent' },
            paid: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Paid' },
            overdue: { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Overdue' }
        };
        
        const { color, icon: Icon, label } = config[status] || config.draft;
        
        return (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-sm text-xs ${color}`}>
                <Icon size={10} className="mr-1" />
                {label}
            </span>
        );
    };

    const getStatusOptions = (currentStatus) => {
        const allOptions = {
            draft: ['sent', 'paid'],
            sent: ['paid', 'overdue'],
            paid: [],
            overdue: ['paid']
        };

        return allOptions[currentStatus] || [];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
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
        await fetchInvoices(tempDateRange.startDate, tempDateRange.endDate);
        
        // Reset to first page
        setCurrentPage(1);
        
        //showSnackbar("Filter applied successfully", "success");
    };

    // Clear filter button handler
    const handleClearFilter = async () => {
        const defaultStartDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
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
        await fetchInvoices(defaultStartDate, defaultEndDate);
        
        setCurrentPage(1);
        
        //showSnackbar("Filter cleared", "info");
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
        await fetchInvoices(newStartDate, newEndDate);
        
        // Reset to first page
        setCurrentPage(1);
        
        //showSnackbar("Quick filter applied", "success");
    };

    const filteredInvoices = invoices.filter(invoice => {
        // Status filter
        if (statusFilter !== 'all' && invoice.status !== statusFilter) {
            return false;
        }

        // Search filter
        const searchLower = searchTerm.toLowerCase();
        return (
            invoice.invoice_number?.toLowerCase().includes(searchLower) ||
            invoice.candidate?.first_name?.toLowerCase().includes(searchLower) ||
            invoice.candidate?.last_name?.toLowerCase().includes(searchLower) ||
            invoice.candidate?.email?.toLowerCase().includes(searchLower) ||
            invoice.job?.job_title?.toLowerCase().includes(searchLower) ||
            invoice.client_details?.name?.toLowerCase().includes(searchLower)
        );
    });

    const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
    const paginatedInvoices = filteredInvoices.slice(
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

    const calculateTotals = () => {
        return filteredInvoices.reduce(
            (totals, invoice) => {
                totals.totalAmount += parseFloat(invoice.total_amount) || 0;
                totals.totalHours += parseFloat(invoice.total_hours) || 0;
                totals.paidAmount += invoice.status === 'paid' ? parseFloat(invoice.total_amount) || 0 : 0;
                return totals;
            },
            { totalAmount: 0, totalHours: 0, paidAmount: 0 }
        );
    };

    const totals = calculateTotals();

    // Debounced search handler
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Reset page when status filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter]);

    if (loading) return <Loader message="Loading invoices..." />;

    return (
        <div className="min-h-screen bg-[#fef2f2]">
            <div className="w-full max-w-7xl mx-auto py-8 px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/dashboard/reports')}
                    className="mb-6 flex items-center gap-2 text-teal-600 hover:text-teal-700"
                >
                    <ArrowLeft size={18} />
                    Back to Reports
                </button>

                {/* Filters Card */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="space-y-6">
                        {/* Filters Header with Applied Date Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold text-gray-800">All Invoices</h1>
                            </div>
                            
                            {/* Applied Date Info - Now in header */}
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-600 text-sm">Applied:</span>
                                <span className="font-medium text-xs text-gray-800 bg-gray-100 px-3 py-1 rounded-lg">
                                    {formatDateForInput(appliedDateRange.startDate)} - {formatDateForInput(appliedDateRange.endDate)}
                                </span>
                            </div>
                        </div>

                        {/* Main Filters Grid - Now 3 columns */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

                            {/* Middle Column: Status and Search */}
                            <div className="space-y-4">
                                {/* Status Filter */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="draft">Draft</option>
                                        <option value="sent">Sent</option>
                                        <option value="paid">Paid</option>
                                        <option value="overdue">Overdue</option>
                                    </select>
                                </div>

                                {/* Search */}
                                <div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                            placeholder="Search invoices..."
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

                {/* Invoices Table */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    {filteredInvoices.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Invoice #</th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Candidate & Client</th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Date & Period</th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Amount & Hours</th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Status</th>
                                            <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {paginatedInvoices.map((invoice) => (
                                            <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-3 px-4">
                                                    <div className="font-medium text-sm text-gray-900">{invoice.invoice_number}</div>
                                                    {invoice.job && (
                                                        <div className="text-sm text-gray-500">{invoice.job.job_title}</div>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <User size={14} className="text-gray-400" />
                                                            <span className="font-medium text-sm">
                                                                {invoice.candidate?.first_name} {invoice.candidate?.last_name}
                                                            </span>
                                                        </div>
                                                        {invoice.client_details && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                <Building size={12} className="text-gray-400" />
                                                                <span className="text-sm">{invoice.client_details.name}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="space-y-1">
                                                        <div className="text-sm">
                                                            <Calendar size={12} className="inline mr-1 text-gray-400" />
                                                            Date: {formatDate(invoice.invoice_date)}
                                                        </div>
                                
                                                        {invoice.period_start && invoice.period_end && (
                                                            <div className="text-sm text-gray-400">
                                                                {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="space-y-1">
                                                        <div className="font-semibold text-sm text-gray-900">
                                                            {formatCurrency(invoice.total_amount)}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {invoice.total_hours} hrs @ {formatCurrency(invoice.hourly_rate)}/hr
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="space-y-2 text-xs">
                                                        {getStatusBadge(invoice.status)}
                                                        {getStatusOptions(invoice.status).length > 0 && (
                                                            <div className="relative inline-block ml-3">
                                                                <select
                                                                    onChange={(e) => updateInvoiceStatus(invoice.id, e.target.value)}
                                                                    className="text-xs rounded px-2 py-1 appearance-none pr-6 cursor-pointer hover:bg-gray-50"
                                                                    defaultValue=""
                                                                >
                                                                    <option className="text-xs" value="" disabled>Change Status</option>
                                                                    {getStatusOptions(invoice.status).map(status => (
                                                                        <option className="text-xs" key={status} value={status}>
                                                                            Mark as {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <ChevronDown size={10} className="absolute right-2 top-2 text-gray-400 pointer-events-none" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => downloadInvoicePDF(invoice.id, invoice.invoice_number)}
                                                            className="px-3 py-1.5 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"
                                                        >
                                                            <Download size={14} />
                                                            PDF
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/dashboard/reports/candidate/${invoice.candidate_id}/invoices`)}
                                                            className="px-3 py-1.5 text-sm border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 flex items-center gap-2"
                                                        >
                                                            <FileText size={14} />
                                                            View All
                                                        </button>
                                                    </div>
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
                                            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} invoices
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
                                <FileText size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                            <p className="text-gray-500">
                                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your filters' : 'No invoices have been generated yet.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Statistics Summary */}
                {filteredInvoices.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-teal-100 rounded-lg">
                                    <DollarSign size={20} className="text-teal-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Total Amount</div>
                                    <div className="text-xl font-bold text-gray-800">{formatCurrency(totals.totalAmount)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Clock size={20} className="text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Total Hours</div>
                                    <div className="text-xl font-bold text-gray-800">{totals.totalHours.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle size={20} className="text-green-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Paid Amount</div>
                                    <div className="text-xl font-bold text-green-600">{formatCurrency(totals.paidAmount)}</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <FileText size={20} className="text-purple-600" />
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Total Invoices</div>
                                    <div className="text-xl font-bold text-gray-800">{filteredInvoices.length}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}