import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getPdfForm, hasPdfForm } from '../../Components/Candidates/PdfForms';
import {
    CheckCircle,
    AlertCircle,
    Home,
    Download,
    Eye,
    FileText,
    AlertTriangle,
    Clock,
    Mail,
    ArrowLeft,
    Check
} from 'lucide-react';

const CandidateDocuments = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchCandidateDocument();
    }, [token]);

    // NEW: Fetch single document for individual document links
    const fetchCandidateDocument = async () => {
        try {
            setLoading(true);
            setError('');

            // Use the new single document endpoint
            const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/candidate/document/${token}`;
            const response = await axios.get(apiUrl);

            if (response.data.success) {
                // Transform the response to match the expected format
                const singleDocData = {
                    candidate: response.data.data.candidate,
                    stage: response.data.data.stage,
                    document: response.data.data.document,
                    token: response.data.data.token,
                    expires_at: response.data.data.expires_at
                };
                setData(singleDocData);
            } else {
                throw new Error(response.data.message || 'Failed to load document');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Failed to load document. The link may have expired.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const openPdfForm = (document) => {
        if (!hasPdfForm(document.id)) {
            alert('Online form not available for this document. Please download and fill manually.');
            return;
        }
        setSelectedDocument(document);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setSelectedDocument(null);
    };

    const refreshDocument = () => {
        fetchCandidateDocument();
        closeForm();
    };

    const renderPdfForm = () => {
        if (!showForm || !selectedDocument) return null;

        const PdfFormComponent = getPdfForm(selectedDocument.id);
        if (!PdfFormComponent) return null;

        return (
            <PdfFormComponent
                document={selectedDocument}
                token={token}
                onClose={closeForm}
                onSuccess={refreshDocument}
            />
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-700 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your document...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-auto border border-gray-100">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-teal-700 hover:bg-teal-800 text-white px-8 py-3 rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2 mx-auto"
                        >
                            <Home size={18} />
                            Go to Homepage
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-10 h-10 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No Document Found</h2>
                    <p className="text-gray-600">Unable to load document information.</p>
                </div>
            </div>
        );
    }

    // Check if this is a single document (individual link) or multiple documents (old format)
    const isSingleDocument = data.document && !data.documents;
    const documents = isSingleDocument ? [data.document] : (data.documents || []);
    const currentDocument = isSingleDocument ? data.document : null;

    const completedCount = documents.filter(doc => doc.is_completed).length;
    const totalCount = documents.length;
    const progressPercentage = isSingleDocument ?
        (currentDocument?.is_completed ? 100 : 0) :
        (completedCount / totalCount) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 to-indigo-100 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">

                            <h1 className="text-3xl font-bold text-gray-900 flex-1 text-center">
                                {isSingleDocument ? 'Document Completion' : 'Document Completion'}
                            </h1>
                            {isSingleDocument && <div className="w-6"></div>} {/* Spacer for alignment */}
                        </div>

                        <div className="w-24 h-1 bg-teal-700 mx-auto mb-6 rounded-full"></div>

                        <div className="bg-teal-50 rounded-xl p-6 border border-grey-500">
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">
                                Hello, {data.candidate.name}!
                            </h2>
                            <p className="text-gray-600 mb-2 flex items-center justify-center gap-2">
                                <FileText size={18} className="text-teal-700" />
                                You are in the <strong className="text-teal-700 font-semibold">{data.stage}</strong> stage
                            </p>
                            <p className="text-gray-500 flex items-center justify-center gap-2">
                                <Mail size={16} />
                                {data.candidate.email}
                            </p>
                            {isSingleDocument && data.expires_at && (
                                <p className="text-sm text-amber-600 mt-2 flex items-center justify-center gap-2">
                                    <Clock size={14} />
                                    This link expires on {new Date(data.expires_at).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Progress Stats - Only show for single document */}
                {isSingleDocument && (
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Clock className="text-teal-700" size={20} />
                                Document Status
                            </h3>
                            <span className={`text-sm px-3 py-1 rounded-full ${currentDocument?.is_completed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                                }`}>
                                {currentDocument?.is_completed ? 'Completed' : 'Pending Completion'}
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                            <div
                                className={`h-2 rounded-full transition-all duration-500 ease-out ${currentDocument?.is_completed
                                    ? 'bg-green-600'
                                    : 'bg-teal-800'
                                    }`}
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Multiple Documents Progress - Only show for multiple documents */}
                {!isSingleDocument && totalCount > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Clock className="text-teal-700" size={20} />
                                Your Progress
                            </h3>
                            <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                                {completedCount} of {totalCount} documents completed
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-teal-700 to-green-500 h-3 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Document List/Single Document */}
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <FileText className="text-teal-700" size={24} />
                        {isSingleDocument ? 'Document to Complete' : 'Required Documents'}
                    </h3>

                    <div className="bg-teal-50 border-l-4 border-teal-700 rounded-r-lg p-4 mb-6">
                        <p className="text-teal-800 flex items-start gap-2">
                            <FileText size={18} className="mt-0.5 flex-shrink-0" />
                            {isSingleDocument
                                ? 'Complete this document using the form below. You can preview the document before filling.'
                                : 'Click "Fill Form" to complete documents online. You can preview before submitting.'
                            }
                        </p>
                    </div>

                    <div className="space-y-4">
                        {documents.map((document) => (
                            <div
                                key={document.id}
                                className={`border rounded-xl p-6 transition-all duration-200 ${document.is_completed
                                    ? 'border-green-200 bg-green-50'
                                    : 'border-gray-200 bg-white hover:shadow-md hover:border-teal-700'
                                    }`}
                            >
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h4 className="text-lg font-semibold text-gray-900">
                                                {document.name}
                                            </h4>
                                            <div className="flex gap-2">
                                                {document.is_required && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                                        Required
                                                    </span>
                                                )}
                                                {document.is_completed && (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                        <CheckCircle size={12} className="mr-1" />
                                                        Completed
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 mb-4 leading-relaxed">{document.description}</p>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-2">
                                        {!document.is_completed ? (
                                            <>
                                                <button
                                                    onClick={hasPdfForm(document.id) ? () => openPdfForm(document) : undefined}
                                                    disabled={!hasPdfForm(document.id)}
                                                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white gap-2 ${hasPdfForm(document.id)
                                                        ? "bg-teal-700 hover:bg-teal-800 transition-colors duration-200"
                                                        : "bg-gray-400 cursor-not-allowed opacity-50"
                                                        }`}
                                                >
                                                    <FileText size={16} />
                                                    Fill Form
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                disabled
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 cursor-not-allowed opacity-75 gap-2"
                                            >
                                                <Check size={16} />
                                                Already Submitted
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {document.is_completed && document.completed_at && (
                                    <div className="mt-4 pt-4 border-t border-green-200 border-dashed">
                                        <div className="flex items-center text-green-700 text-sm">
                                            <CheckCircle size={16} className="mr-2" />
                                            Completed on {new Date(document.completed_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Support Info */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-amber-800 text-sm">
                                {isSingleDocument
                                    ? 'This link is for a single document only. If you need to complete other documents, please use the individual links provided.'
                                    : 'Need help? Contact your recruiter or support team for assistance with any questions about these documents.'
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Render the specific PDF form as modal */}
            {renderPdfForm()}
        </div>
    );
};

export default CandidateDocuments;