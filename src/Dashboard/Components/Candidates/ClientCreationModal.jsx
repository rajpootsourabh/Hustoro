import React, { useState } from 'react';
import { X, Building, MapPin, Phone } from 'lucide-react';

export default function ClientCreationModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact_number: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Client name is required';
        }

        if (!formData.contact_number.trim()) {
            newErrors.contact_number = 'Contact number is required';
        } else if (!/^[\d\s\-\+\(\)]{10,}$/.test(formData.contact_number.replace(/\D/g, ''))) {
            newErrors.contact_number = 'Invalid contact number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                name: formData.name.trim(),
                address: formData.address.trim() || null,
                contact_number: formData.contact_number.trim()
            };

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/clients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                onSuccess(data.data);
                resetForm();
                onClose();
            } else {
                const errorData = await response.json();
                setErrors(prev => ({ ...prev, form: errorData.message || 'Failed to create client' }));
            }
        } catch (error) {
            console.error('Error creating client:', error);
            setErrors(prev => ({ ...prev, form: 'Network error. Please try again.' }));
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            address: '',
            contact_number: ''
        });
        setErrors({});
    };

    const handleContactNumberChange = (e) => {
        const value = e.target.value;
        // Allow only numbers, spaces, hyphens, plus, and parentheses
        const cleaned = value.replace(/[^\d\s\-\+\(\)]/g, '');
        
        setFormData(prev => ({
            ...prev,
            contact_number: cleaned
        }));
        
        if (errors.contact_number) {
            setErrors(prev => ({ ...prev, contact_number: undefined }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
                {/* Modal Header */}
                <div className="bg-teal-700 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Building className="w-5 h-5 text-white" />
                            <h2 className="text-lg font-semibold text-white">Add New Client</h2>
                        </div>
                        <button
                            onClick={() => {
                                resetForm();
                                onClose();
                            }}
                            className="text-white hover:text-teal-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {errors.form && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-600">{errors.form}</p>
                        </div>
                    )}

                    {/* Client Name - Required */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Client Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <Building className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 text-sm py-2.5 rounded-xl border ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'}`}
                                placeholder="Enter client name"
                                maxLength={100}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-sm text-red-600">{errors.name}</p>
                        )}
                    </div>

                    {/* Contact Number - Required */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Contact Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <Phone className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                name="contact_number"
                                value={formData.contact_number}
                                onChange={handleContactNumberChange}
                                className={`w-full pl-10 pr-4 text-sm py-2.5 rounded-xl border ${errors.contact_number ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'}`}
                                placeholder="e.g., +1 (555) 123-4567"
                                maxLength={20}
                            />
                        </div>
                        {errors.contact_number && (
                            <p className="text-sm text-red-600">{errors.contact_number}</p>
                        )}
                    </div>

                    {/* Address - Optional */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Address
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-3">
                                <MapPin className="w-4 h-4 text-gray-400" />
                            </div>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                rows={3}
                                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-300 focus:border-teal-500 focus:ring-teal-500 resize-none"
                                placeholder="Enter full address (optional)"
                                maxLength={500}
                            />
                        </div>
                        <p className="text-xs text-gray-500 text-right">
                            {formData.address.length}/500
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                onClose();
                            }}
                            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-teal-700 text-white rounded-xl hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Creating...
                                </span>
                            ) : 'Create Client'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}