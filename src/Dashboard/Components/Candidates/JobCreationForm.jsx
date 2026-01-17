import React, { useState, useEffect } from 'react';
import { getMultiTimezoneDisplay, getUserTimezone } from '../../../utils/timezone';
import {
    Calendar,
    Clock,
    Briefcase,
    FileText,
    Globe,
    X,
    Save,
    AlertCircle,
    ChevronDown,
    User2,
    Info,
    Plus,
    Trash2,
    Lock,
    Building,
    Users
} from 'lucide-react';
import { useSnackbar } from '../../Components/SnackbarContext';
import { useRolePermissions } from '../../../hooks/useRolePermissions';
import ClientCreationModal from './ClientCreationModal';

export default function JobCreationForm({
    candidateData = null,
    job = null,
    onSuccess,
    onCancel
}) {
    const [formData, setFormData] = useState({
        job_title: '',
        job_startdate: '',
        job_enddate: '',
        job_description: '',
        shift_ids: [],
        candidate_id: '',
        assignment_notes: '',
        client_id: ''
    });

    const [shifts, setShifts] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [shiftsLoading, setShiftsLoading] = useState(true);
    const [clientsLoading, setClientsLoading] = useState(true);
    const [selectedShiftTimes, setSelectedShiftTimes] = useState([]);
    const [userTimezone, setUserTimezone] = useState('UTC');
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [showClientModal, setShowClientModal] = useState(false);
    
    const { showSnackbar } = useSnackbar();
    const { canCreateJobs, canEditJobs, isLoading: roleLoading } = useRolePermissions();

    useEffect(() => {
        setUserTimezone(getUserTimezone());
        fetchShifts();
        fetchClients();
    }, []);

    useEffect(() => {
        let newFormData = {
            job_title: '',
            job_startdate: '',
            job_enddate: '',
            job_description: '',
            shift_ids: [],
            candidate_id: '',
            assignment_notes: '',
            client_id: ''
        };

        if (job) {
            setIsEditing(true);
            
            let formattedStartDate = '';
            if (job.job_startdate) {
                const date = new Date(job.job_startdate);
                if (!isNaN(date.getTime())) {
                    formattedStartDate = date.toISOString().split('T')[0];
                }
            }
            
            let formattedEndDate = '';
            if (job.job_enddate) {
                const date = new Date(job.job_enddate);
                if (!isNaN(date.getTime())) {
                    formattedEndDate = date.toISOString().split('T')[0];
                }
            }

            const shiftIds = job.shifts ? job.shifts.map(shift => shift.id.toString()) : [];

            newFormData = {
                ...newFormData,
                job_title: job.job_title || '',
                job_startdate: formattedStartDate,
                job_enddate: formattedEndDate,
                job_description: job.job_description || '',
                shift_ids: shiftIds,
                client_id: job.client_id || job.client?.id || ''
            };
        }

        if (candidateData) {
            newFormData = {
                ...newFormData,
                candidate_id: candidateData.candidate_id || candidateData.id || ''
            };
        }

        setFormData(newFormData);
    }, [job, candidateData]);

    useEffect(() => {
        if (formData.shift_ids.length > 0 && shifts.length > 0) {
            const selectedShifts = shifts.filter(s => 
                formData.shift_ids.includes(s.id.toString())
            );
            const times = selectedShifts.map(shift => ({
                id: shift.id,
                title: shift.title,
                start_time_utc: shift.start_time_utc,
                end_time_utc: shift.end_time_utc,
                timezoneDisplay: getMultiTimezoneDisplay(shift.start_time_utc?.split(':')[0] + ':' + shift.start_time_utc?.split(':')[1])
            }));
            setSelectedShiftTimes(times);
        } else {
            setSelectedShiftTimes([]);
        }
    }, [formData.shift_ids, shifts]);

    const fetchShifts = async () => {
        try {
            setShiftsLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/shifts/active`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setShifts(data.data || []);
            } else {
                console.error('Failed to fetch shifts:', response.status);
                showSnackbar('Failed to fetch shifts', 'error');
            }
        } catch (error) {
            console.error('Error fetching shifts:', error);
            showSnackbar('Error fetching shifts', 'error');
        } finally {
            setShiftsLoading(false);
        }
    };

    const fetchClients = async () => {
        try {
            setClientsLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/clients`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setClients(data.data || []);
            } else {
                console.error('Failed to fetch clients:', response.status);
                showSnackbar('Failed to fetch clients', 'error');
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
            showSnackbar('Error fetching clients', 'error');
        } finally {
            setClientsLoading(false);
        }
    };

    const handleClientCreated = (newClient) => {
        setClients(prev => [...prev, newClient]);
        setFormData(prev => ({ ...prev, client_id: newClient.id.toString() }));
        showSnackbar('Client created successfully!', 'success');
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.job_title.trim()) {
            newErrors.job_title = 'Job title is required';
        }

        if (!formData.job_startdate) {
            newErrors.job_startdate = 'Job start date is required';
        }

        if (!formData.job_enddate) {
            newErrors.job_enddate = 'Job end date is required';
        }

        if (formData.job_enddate && formData.job_startdate && 
            new Date(formData.job_enddate) < new Date(formData.job_startdate)) {
            newErrors.job_enddate = 'End date cannot be before start date';
        }

        if (formData.shift_ids.length === 0) {
            newErrors.shift_ids = 'Please select at least one shift';
        }

        if (!formData.client_id) {
            newErrors.client_id = 'Please select a client';
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

    const handleShiftChange = (shiftId) => {
        setFormData(prev => {
            const shiftIds = [...prev.shift_ids];
            const shiftIdStr = shiftId.toString();
            
            if (shiftIds.includes(shiftIdStr)) {
                return {
                    ...prev,
                    shift_ids: shiftIds.filter(id => id !== shiftIdStr)
                };
            } else {
                return {
                    ...prev,
                    shift_ids: [...shiftIds, shiftIdStr]
                };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            showSnackbar('Please fix the errors in the form', 'error');
            return;
        }

        if (isEditing && !canEditJobs()) {
            showSnackbar('You do not have permission to edit jobs', 'error');
            return;
        }

        if (!isEditing && !canCreateJobs()) {
            showSnackbar('You do not have permission to create jobs', 'error');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                job_title: formData.job_title.trim(),
                job_startdate: formData.job_startdate,
                job_enddate: formData.job_enddate,
                job_description: formData.job_description?.trim() || null,
                shift_ids: formData.shift_ids.map(id => parseInt(id)),
                client_id: parseInt(formData.client_id)
            };

            if (candidateData && !isEditing) {
                payload.candidate_id = parseInt(formData.candidate_id);
                if (formData.assignment_notes?.trim()) {
                    payload.assignment_notes = formData.assignment_notes.trim();
                }
            }

            const jobUrl = job
                ? `${import.meta.env.VITE_API_BASE_URL}/jobs/${job.id}`
                : `${import.meta.env.VITE_API_BASE_URL}/jobs`;

            const jobMethod = job ? 'PUT' : 'POST';

            const jobResponse = await fetch(jobUrl, {
                method: jobMethod,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify(payload)
            });

            if (!jobResponse.ok) {
                const error = await jobResponse.json();
                showSnackbar(error.message || `Failed to ${isEditing ? 'update' : 'create'} job`, 'error');
                throw new Error(error.message || `Failed to ${isEditing ? 'update' : 'create'} job`);
            }

            const responseData = await jobResponse.json();
            
            const successMessage = isEditing 
                ? 'Job updated successfully!' 
                : candidateData 
                    ? 'Job created and assigned to candidate successfully!' 
                    : 'Job created successfully!';
            
            showSnackbar(successMessage, 'success');
            onSuccess();

        } catch (error) {
            console.error('Error in form submission:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (timeString) => {
        if (!timeString) return '';
        const time = timeString.split(':').slice(0, 2).join(':');
        const [hours, minutes] = time.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    if (roleLoading) {
        return (
            <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">
                <div className="p-6 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
            </div>
        );
    }

    const hasPermission = isEditing ? canEditJobs() : canCreateJobs();
    
    if (!hasPermission) {
        return (
            <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">
                <div className="bg-red-700 px-6 py-2.5">
                    <div className="flex items-center space-x-3">
                        <div>
                            <div className="flex items-center space-x-2 mt-1">
                                <Lock className="w-4 h-4 text-white" />
                                <span className="text-sm text-white">
                                    Access Denied
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-6 text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
                        <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Permission Required</h3>
                        <p className="text-gray-600 mb-4">
                            You do not have permission to {isEditing ? 'edit' : 'create'} jobs. 
                            Only administrators and employees can manage jobs.
                        </p>
                    </div>
                    <button
                        onClick={onCancel}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border shadow-lg overflow-hidden">
            <div className="bg-teal-700 px-6 py-2.5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div>
                            <div className="flex items-center space-x-2 mt-1">
                                <Briefcase className="w-4 h-4 text-white" />
                                <span className="text-sm text-white">
                                    {isEditing ? 'Edit Job' : candidateData ? 'Create Job & Assign to Candidate' : 'Create New Job'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Job Title */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Job Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="job_title"
                            value={formData.job_title}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 text-sm py-2.5 rounded-xl border ${errors.job_title ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'} bg-white shadow-sm transition-all duration-200 hover:border-gray-400`}
                            placeholder="Enter job title"
                            required
                        />
                    </div>
                    {errors.job_title && (
                        <div className="flex items-center space-x-1 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.job_title}</span>
                        </div>
                    )}
                </div>

                {/* Job Dates - Side by Side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Date */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Start Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="date"
                                name="job_startdate"
                                value={formData.job_startdate}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 text-sm py-2.5 rounded-xl border ${errors.job_startdate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'} bg-white shadow-sm transition-all duration-200 hover:border-gray-400`}
                                required
                            />
                        </div>
                        {errors.job_startdate && (
                            <div className="flex items-center space-x-1 text-sm text-red-600">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.job_startdate}</span>
                            </div>
                        )}
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            End Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="date"
                                name="job_enddate"
                                value={formData.job_enddate}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 text-sm py-2.5 rounded-xl border ${errors.job_enddate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'} bg-white shadow-sm transition-all duration-200 hover:border-gray-400`}
                                required
                            />
                        </div>
                        {errors.job_enddate && (
                            <div className="flex items-center space-x-1 text-sm text-red-600">
                                <AlertCircle className="w-4 h-4" />
                                <span>{errors.job_enddate}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Job Description
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-3">
                            <FileText className="w-4 h-4 text-gray-400" />
                        </div>
                        <textarea
                            name="job_description"
                            value={formData.job_description}
                            onChange={handleChange}
                            rows={4}
                            className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border ${errors.job_description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'} bg-white shadow-sm transition-all duration-200 hover:border-gray-400 resize-none`}
                            placeholder="A short description of the job (max 2000 characters)"
                            maxLength={2000}
                        />
                        <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                            {formData.job_description.length}/2000
                        </div>
                    </div>
                </div>

                {/* Client Field */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                            Client <span className="text-red-500">*</span>
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowClientModal(true)}
                            className="inline-flex items-center text-xs px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors"
                        >
                            <Plus className="w-3 h-3 mr-1" />
                            Add New Client
                        </button>
                    </div>
                    
                    {clientsLoading ? (
                        <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                            <span className="ml-2 text-sm text-gray-500">Loading clients...</span>
                        </div>
                    ) : (
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                <Building className="w-4 h-4 text-gray-400" />
                            </div>
                            <select
                                name="client_id"
                                value={formData.client_id}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 text-sm py-2.5 rounded-xl border ${errors.client_id ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-teal-500 focus:ring-teal-500'} bg-white shadow-sm appearance-none cursor-pointer`}
                                required
                            >
                                <option value="">Select a client</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>
                                        {client.name}
                                        {client.contact_person ? ` (${client.contact_person})` : ''}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    )}
                    
                    {errors.client_id && (
                        <div className="flex items-center space-x-1 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.client_id}</span>
                        </div>
                    )}
                </div>

                {/* Shifts Selection - Multi Select */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                            Assign Shifts <span className="text-red-500">*</span>
                            {candidateData && !isEditing && (
                                <span className="block text-xs text-gray-500 font-normal mt-1">
                                    Selected shifts will be automatically assigned to the candidate
                                </span>
                            )}
                        </label>
                        <span className="text-xs text-gray-500">
                            {formData.shift_ids.length} shift{formData.shift_ids.length !== 1 ? 's' : ''} selected
                        </span>
                    </div>

                    {shiftsLoading ? (
                        <div className="text-center py-8 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
                            <p className="mt-3 text-sm text-gray-500">Loading available shifts...</p>
                        </div>
                    ) : (
                        <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${errors.shift_ids ? 'border-red-300' : ''}`}>
                            {shifts.map(shift => (
                                <div
                                    key={shift.id}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${formData.shift_ids.includes(shift.id.toString()) 
                                        ? 'border-teal-500 bg-teal-50' 
                                        : 'border-gray-300 hover:border-gray-400'}`}
                                    onClick={() => handleShiftChange(shift.id)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.shift_ids.includes(shift.id.toString()) 
                                                    ? 'border-teal-500 bg-teal-500' 
                                                    : 'border-gray-300'}`}>
                                                    {formData.shift_ids.includes(shift.id.toString()) && (
                                                        <div className="w-2 h-2 rounded-full bg-white"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{shift.title}</h3>
                                                    <p className="text-sm text-gray-500">
                                                        {formatTime(shift.start_time_utc)} - {formatTime(shift.end_time_utc)} UTC
                                                    </p>
                                                </div>
                                            </div>
                                            {shift.description && (
                                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                                    {shift.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className={`text-xs px-2 py-1 rounded ${shift.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {shift.is_active ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {errors.shift_ids && (
                        <div className="flex items-center space-x-1 text-sm text-red-600">
                            <AlertCircle className="w-4 h-4" />
                            <span>{errors.shift_ids}</span>
                        </div>
                    )}
                </div>

                {/* Selected Shifts Preview */}
                {selectedShiftTimes.length > 0 && (
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Globe className="w-5 h-5 text-gray-600" />
                                    <h3 className="font-medium text-sm text-gray-900">Selected Shifts - Global Times</h3>
                                </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                Shift times will be automatically converted for users in different timezones
                            </p>
                        </div>

                        <div className="p-4 space-y-4">
                            {selectedShiftTimes.map(shift => (
                                <div key={shift.id} className="bg-white p-4 rounded-xl border border-gray-200 hover:border-teal-200 transition-all duration-200">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-teal-50 rounded-lg">
                                                <Clock className="w-4 h-4 text-teal-600" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm text-gray-900">{shift.title}</div>
                                                <div className="text-xs text-gray-500 flex items-center mt-1">
                                                    <span className='text-xs'>UTC: {formatTime(shift.start_time_utc)} - {formatTime(shift.end_time_utc)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                        {shift.timezoneDisplay?.map((tz, index) => (
                                            <div
                                                key={index}
                                                className={`p-3 rounded-lg border ${tz.label === 'UTC' ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200' : 'bg-white border-gray-200'} hover:shadow-sm transition-shadow duration-200`}
                                            >
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <div className={`p-1.5 text-sm rounded ${tz.label === 'UTC' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                                        {tz.label === 'UTC' ? (
                                                            <Globe className="w-3 h-3 text-blue-600" />
                                                        ) : tz.label.includes('India') ? (
                                                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                                        ) : tz.label.includes('US') ? (
                                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                        ) : (
                                                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                                        )}
                                                    </div>
                                                    <span className={`text-xs font-medium ${tz.label === 'UTC' ? 'text-blue-700' : 'text-gray-700'}`}>
                                                        {tz.label}
                                                    </span>
                                                </div>
                                                <div className={`text-sm font-bold ${tz.label === 'UTC' ? 'text-blue-900' : 'text-gray-900'}`}>
                                                    {tz.time}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Assignment Notes (only when creating for candidate) */}
                {candidateData && !isEditing && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Assignment Notes
                        </label>
                        <textarea
                            name="assignment_notes"
                            value={formData.assignment_notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 text-sm rounded-xl border border-gray-300 focus:border-teal-500 focus:ring-teal-500 bg-white shadow-sm resize-none"
                            placeholder="Any specific notes for this assignment..."
                            maxLength={500}
                        />
                        <div className="text-xs text-gray-400 text-right">
                            {formData.assignment_notes.length}/500
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="group flex text-sm items-center px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        <X className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || formData.shift_ids.length === 0 || !formData.client_id}
                        className="group relative flex items-center px-4 py-2 rounded-md bg-gradient-to-r from-teal-700 to-teal-700 text-white hover:from-teal-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        {loading ? (
                            <>
                                <div className="relative flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {isEditing ? 'Updating...' : candidateData ? 'Creating & Assigning...' : 'Creating...'}
                                </div>
                            </>
                        ) : (
                            <div className="flex text-sm items-center">
                                <Save className="w-4 h-4 mr-2" />
                                {isEditing ? 'Update Job' : candidateData ? 'Create Job & Assign' : 'Create Job'}
                            </div>
                        )}
                    </button>
                </div>
            </form>

            {/* Client Creation Modal */}
            <ClientCreationModal
                isOpen={showClientModal}
                onClose={() => setShowClientModal(false)}
                onSuccess={handleClientCreated}
            />
        </div>
    );
}