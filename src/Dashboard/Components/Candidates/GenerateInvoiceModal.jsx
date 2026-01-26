// src/Components/Invoice/GenerateInvoiceModal.jsx
import React, { useState, useEffect } from "react";
import { X, Check, Download, Building, User } from "lucide-react";
import axios from "axios";
import { useSnackbar } from "../../Components/SnackbarContext";

export default function GenerateInvoiceModal({ selectedCandidates, candidates, dateRange, onClose, onSuccess }) {
    const [invoiceForm, setInvoiceForm] = useState({
        hourlyRate: "",
        taxRate: 0,
        discount: 0,
        dueDays: 30,
        notes: "",
        client_id: ""
    });
    const [loading, setLoading] = useState(false);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        // Get unique clients from selected candidates
        const clients = candidates
            .filter(c => c.client)
            .map(c => c.client)
            .filter((client, index, self) =>
                index === self.findIndex(c => c.id === client.id)
            );

        if (clients.length === 1) {
            setInvoiceForm(prev => ({ ...prev, client_id: clients[0].id }));
        }
    }, [candidates]);

    const handleGenerateInvoice = async () => {
        if (!invoiceForm.hourlyRate || invoiceForm.hourlyRate <= 0) {
            showSnackbar("Please enter a valid hourly rate", "warning");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/invoices/employee/create`,
                {
                    candidate_ids: selectedCandidates,
                    period_start: dateRange.startDate.toISOString().split('T')[0],
                    period_end: dateRange.endDate.toISOString().split('T')[0],
                    hourly_rate: parseFloat(invoiceForm.hourlyRate),
                    tax_rate: parseFloat(invoiceForm.taxRate),
                    discount: parseFloat(invoiceForm.discount),
                    due_days: parseInt(invoiceForm.dueDays),
                    notes: invoiceForm.notes,
                    client_id: invoiceForm.client_id || null
                },
                {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token"),
                        "Content-Type": "application/json"
                    }
                }
            );

            showSnackbar(response.data.message || "Invoice generated successfully", "success");

            // Download PDFs if generated
            if (response.data.data?.invoices) {
                response.data.data.invoices.forEach(invoice => {
                    if (invoice.pdf_path) {
                        downloadInvoicePDF(invoice.id, invoice.invoice_number);
                    }
                });
            }

            onSuccess();
        } catch (error) {
            const message = error.response?.data?.message || "Failed to generate invoice";
            showSnackbar(message, "error");
            console.error("Error generating invoice:", error);
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
        } catch (error) {
            console.error("Error downloading PDF:", error);
        }
    };

    const calculateTotalHours = () => {
        return candidates.reduce((sum, candidate) => sum + (candidate.total_hours || 0), 0);
    };

    const calculateTotalAmount = () => {
        const hourlyRate = parseFloat(invoiceForm.hourlyRate) || 0;
        return candidates.reduce((sum, candidate) => {
            return sum + ((candidate.total_hours || 0) * hourlyRate);
        }, 0);
    };

    const getUniqueClients = () => {
        return candidates
            .filter(c => c.client)
            .map(c => c.client)
            .filter((client, index, self) =>
                index === self.findIndex(c => c.id === client.id)
            );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-800">Generate Invoice</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                            disabled={loading}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Summary */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-medium text-gray-700 mb-3">Invoice Summary</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                                <div>
                                    <div className="text-sm text-gray-600">Selcted</div>
                                    <div className="text-sm font-medium">
                                        <div className="text-lg font-semibold">{selectedCandidates.length}</div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Total Hours</div>
                                    <div className="text-lg font-semibold">{calculateTotalHours().toFixed(2)}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Est. Total</div>
                                    <div className="text-lg font-semibold text-teal-600">
                                        ${calculateTotalAmount().toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Invoice Form */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Hourly Rate ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={invoiceForm.hourlyRate}
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, hourlyRate: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                        placeholder="Enter hourly rate"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tax Rate (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={invoiceForm.taxRate}
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, taxRate: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Discount ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={invoiceForm.discount}
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, discount: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                        disabled={loading}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Days
                                    </label>
                                    <select
                                        value={invoiceForm.dueDays}
                                        onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDays: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg text-sm"
                                        disabled={loading}
                                    >
                                        <option value="15">15 days</option>
                                        <option value="30">30 days</option>
                                        <option value="45">45 days</option>
                                        <option value="60">60 days</option>
                                    </select>
                                </div>
                            </div>

                            {/* Client Selection */}
                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Client (Optional)
                                </label>
                                <select
                                    value={invoiceForm.client_id}
                                    onChange={(e) => setInvoiceForm({ ...invoiceForm, client_id: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    disabled={loading}
                                >
                                    <option value="">Select Client (Optional)</option>
                                    {getUniqueClients().map(client => (
                                        <option key={client.id} value={client.id}>
                                            {client.name} {client.email ? `(${client.email})` : ''}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                    If not selected, will use the client from the job
                                </p>
                            </div> */}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    value={invoiceForm.notes}
                                    onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg text-sm h-32"
                                    placeholder="Add any additional notes for the invoice..."
                                    disabled={loading}
                                />
                            </div>


                            {/* Total Calculation */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium">${calculateTotalAmount().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Tax ({invoiceForm.taxRate}%):</span>
                                    <span className="font-medium">
                                        ${(calculateTotalAmount() * (invoiceForm.taxRate / 100)).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Discount:</span>
                                    <span className="font-medium text-red-600">
                                        -${parseFloat(invoiceForm.discount || 0).toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                    <span className="font-semibold">Total Amount:</span>
                                    <span className="font-bold text-lg text-teal-600">
                                        ${
                                            (
                                                calculateTotalAmount() +
                                                (calculateTotalAmount() * (invoiceForm.taxRate / 100)) -
                                                parseFloat(invoiceForm.discount || 0)
                                            ).toFixed(2)
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGenerateInvoice}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"
                                disabled={loading || !invoiceForm.hourlyRate || invoiceForm.hourlyRate <= 0}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Download size={18} />
                                        Generate & Download
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}