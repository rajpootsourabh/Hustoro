// src/pages/Reports/CandidateInvoices.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Eye, FileText, Calendar, DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react";
import axios from "axios";
import { useSnackbar } from "../../Components/SnackbarContext";
import Loader from "../../Components/Loader";

export default function CandidateInvoices() {
    const { candidateId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState([]);
    const [candidate, setCandidate] = useState(null);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchCandidateInvoices();
    }, [candidateId]);

    const fetchCandidateInvoices = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/invoices/candidate/${candidateId}`,
                {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token"),
                    }
                }
            );
            
            setInvoices(response.data.data.invoices || []);
            setCandidate(response.data.data.candidate);
        } catch (error) {
            console.error("Error fetching candidate invoices:", error);
            showSnackbar("Failed to load invoices", "error");
        } finally {
            setLoading(false);
        }
    };

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
            showSnackbar("Invoice downloaded successfully", "success");
        } catch (error) {
            console.error("Error downloading PDF:", error);
            showSnackbar("Failed to download invoice", "error");
        }
    };

    const getStatusBadge = (status) => {
        const config = {
            draft: { color: 'bg-gray-100 text-gray-800', icon: Clock },
            sent: { color: 'bg-blue-100 text-blue-800', icon: Eye },
            paid: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            overdue: { color: 'bg-red-100 text-red-800', icon: AlertCircle }
        };
        
        const { color, icon: Icon } = config[status] || config.draft;
        
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                <Icon size={12} className="mr-1" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

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

                {/* Header */}
                <div className="bg-white rounded-xl shadow p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Invoices</h1>
                            {candidate && (
                                <p className="text-gray-600 mt-1">
                                    For {candidate.first_name} {candidate.last_name} • {candidate.email}
                                </p>
                            )}
                        </div>
                        <div className="text-sm text-gray-500">
                            Total Invoices: {invoices.length}
                        </div>
                    </div>
                </div>

                {/* Invoices List */}
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    {invoices.length > 0 ? (
                        <div className="divide-y divide-gray-200">
                            {invoices.map((invoice) => (
                                <div key={invoice.id} className="p-6 hover:bg-gray-50">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-lg font-semibold text-gray-800">
                                                    {invoice.invoice_number}
                                                </h3>
                                                {getStatusBadge(invoice.status)}
                                            </div>
                                            
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>Date: {formatDate(invoice.invoice_date)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>Due: {formatDate(invoice.due_date)}</span>
                                                </div>
                                                {invoice.period_start && invoice.period_end && (
                                                    <div className="flex items-center gap-1">
                                                        <FileText size={14} />
                                                        <span>Period: {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign size={14} className="text-gray-500" />
                                                    <span className="font-medium">${parseFloat(invoice.total_amount).toFixed(2)}</span>
                                                </div>
                                                <div className="text-gray-500">
                                                    {invoice.total_hours} hours @ ${invoice.hourly_rate}/hr
                                                </div>
                                            </div>

                                            {invoice.client_details && (
                                                <div className="text-sm text-gray-500">
                                                    Client: {invoice.client_details.name}
                                                </div>
                                            )}

                                            {invoice.notes && (
                                                <div className="text-sm text-gray-500 mt-2">
                                                    <span className="font-medium">Notes:</span> {invoice.notes}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => downloadInvoicePDF(invoice.id, invoice.invoice_number)}
                                                className="px-3 py-1.5 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"
                                            >
                                                <Download size={14} />
                                                Download PDF
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <FileText size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
                            <p className="text-gray-500">
                                No invoices have been generated for this candidate yet.
                            </p>
                        </div>
                    )}
                </div>

                {/* Summary */}
                {invoices.length > 0 && (
                    <div className="mt-6 bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Summary</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600">Total Amount</div>
                                <div className="text-2xl font-bold text-teal-600">
                                    ${invoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount), 0).toFixed(2)}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600">Total Hours</div>
                                <div className="text-2xl font-bold text-gray-800">
                                    {invoices.reduce((sum, inv) => sum + parseFloat(inv.total_hours), 0).toFixed(2)}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600">Paid Invoices</div>
                                <div className="text-2xl font-bold text-green-600">
                                    {invoices.filter(inv => inv.status === 'paid').length}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm text-gray-600">Pending</div>
                                <div className="text-2xl font-bold text-amber-600">
                                    {invoices.filter(inv => ['draft', 'sent'].includes(inv.status)).length}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}