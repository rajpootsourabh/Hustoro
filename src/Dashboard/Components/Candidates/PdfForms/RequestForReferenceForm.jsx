// components/forms/RequestForReferenceForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';
import StatusModal from '../../../../Components/StatusModal';
import RequestForReferenceSection from './sections/RequestForReference/RequestForReferenceSection';

const RequestForReferenceForm = ({ document, token, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        // Basic Information
        "Please reply by": "",
        "Company Name 1": "",
        "Phone Number": "",
        "Employee Name": "",
        "Date of Birth": "",
        "I": "",
        "Date": "",
        "Address 1": "", // Added Address field
        
        // Employment Verification
        "From": "",
        "To": "",
        "Reason for Leaving": "",
        "Salary": "",
        "Notice Yes": false,
        "Notice No": false,
        
        // Reference Verification
        "Additional InformationRow1": "",
        "Name": "",
        "Date_2": "",
        "Title": "",
        "Mastercare Representative": "",
        "Date_3": "",
        "Signature202_es_:signer:signature": "",
        "Mastercare Office Address": "",
        
        // Checkbox fields
        "Knowledgeable Yes": false,
        "Knowledgeable No": false,
        "Dependable Yes": false,
        "Dependable No": false,
        "Rehire Yes": false,
        "Rehire No": false,
        "Recommend Yes": false,
        "Recommend No": false
    });

    const [generatingPreview, setGeneratingPreview] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [filledPdfBytes, setFilledPdfBytes] = useState(null);

    // Status modal state
    const [statusModal, setStatusModal] = useState({
        isOpen: false,
        type: 'success',
        title: '',
        message: ''
    });

    // Show status modal
    const showStatusModal = (type, title, message) => {
        setStatusModal({
            isOpen: true,
            type,
            title,
            message
        });
    };

    // Close status modal
    const closeStatusModal = () => {
        setStatusModal(prev => ({ ...prev, isOpen: false }));
    };

    // Handler functions
    const handleInputChange = (fieldName, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));
    };

    const handleCheckboxChange = (fieldName, checked) => {
        console.log(`🔘 Checkbox changed: ${fieldName} = ${checked}`);
        setFormData(prev => ({
            ...prev,
            [fieldName]: checked
        }));
    };

    // PDF filling logic
    const fillPdf = async (formData, pdfUrl) => {
        try {
            const pdfResponse = await fetch(pdfUrl);
            const pdfBuffer = await pdfResponse.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBuffer);
            const form = pdfDoc.getForm();

            // Fill all text fields
            const textFields = [
                "Please reply by", "Company Name 1", "Phone Number", "Employee Name", 
                "Date of Birth", "I", "Date", "From", "To", "Reason for Leaving", 
                "Salary", "Additional InformationRow1", "Name", "Date_2", "Title", 
                "Mastercare Representative", "Date_3", "Signature202_es_:signer:signature", 
                "Mastercare Office Address", "Address 1" // Added Address 1
            ];

            console.log('🔄 Filling text fields...');
            textFields.forEach(fieldName => {
                try {
                    const field = form.getTextField(fieldName);
                    if (field) {
                        field.setText(formData[fieldName] || "");
                        console.log(`✅ Set text field: ${fieldName} = "${formData[fieldName]}"`);
                    } else {
                        console.log(`❌ Text field not found: ${fieldName}`);
                    }
                } catch (error) {
                    console.log(`❌ Error setting text field ${fieldName}:`, error.message);
                }
            });

            // Fill checkbox fields
            const checkboxFields = [
                "Notice Yes", "Notice No", "Knowledgeable Yes", "Knowledgeable No",
                "Dependable Yes", "Dependable No", "Rehire Yes", "Rehire No",
                "Recommend Yes", "Recommend No"
            ];

            console.log('🔄 Filling checkbox fields...');
            checkboxFields.forEach(fieldName => {
                try {
                    const field = form.getCheckBox(fieldName);
                    if (field) {
                        if (formData[fieldName] === true) {
                            field.check();
                            console.log(`✅ Checked: ${fieldName}`);
                        } else {
                            field.uncheck();
                            console.log(`✅ Unchecked: ${fieldName}`);
                        }
                    } else {
                        console.log(`❌ Checkbox field not found: ${fieldName}`);
                    }
                } catch (error) {
                    console.log(`❌ Error setting checkbox ${fieldName}:`, error.message);
                }
            });

            // Lock all fields
            form.getFields().forEach((f) => {
                try {
                    f.enableReadOnly();
                } catch (err) {
                    // ignore
                }
            });

            form.flatten();
            const filledPdfBytes = await pdfDoc.save();
            return filledPdfBytes;

        } catch (error) {
            console.error('Error filling Request for Reference Form:', error);
            throw error;
        }
    };

    const handlePreview = async () => {
        console.log('📊 Current formData:', formData);
        try {
            setGeneratingPreview(true);

            if (previewUrl) {
                try { URL.revokeObjectURL(previewUrl); } catch (e) { /* ignore */ }
                setPreviewUrl('');
            }

            const bytes = await fillPdf(formData, document.url);
            setFilledPdfBytes(bytes);

            const blob = new Blob([bytes], { type: "application/pdf" });
            const blobUrl = URL.createObjectURL(blob);
            setPreviewUrl(blobUrl);
        } catch (error) {
            showStatusModal(
                'error',
                'Preview Generation Failed',
                'Failed to generate preview. Please try again.'
            );
        } finally {
            setGeneratingPreview(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);

            let bytes = filledPdfBytes;
            if (!bytes) {
                bytes = await fillPdf(formData, document.url);
            }

            const filledPdfBlob = new Blob([bytes], { type: "application/pdf" });

            const submitFormData = new FormData();
            submitFormData.append('filled_document', filledPdfBlob, `${document.name}_filled.pdf`);

            const uploadUrl = `${import.meta.env.VITE_API_BASE_URL}/candidate/document/${token}/submit`;
            const uploadResponse = await axios.post(uploadUrl, submitFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            showStatusModal(
                'success',
                'Document Submitted Successfully!',
                'Your Request for Reference form has been submitted successfully.'
            );

            if (previewUrl) {
                try { URL.revokeObjectURL(previewUrl); } catch (e) { /* ignore */ }
            }
            setPreviewUrl('');
            setFilledPdfBytes(null);

            setTimeout(() => {
                try { onSuccess && onSuccess(); } catch (e) { /* ignore */ }
                try { onClose && onClose(); } catch (e) { /* ignore */ }
            }, 2000);

        } catch (error) {
            console.error('Error submitting PDF:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit document. Please try again.';
            showStatusModal('error', 'Submission Failed', errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // cleanup on unmount
    useEffect(() => {
        return () => {
            if (previewUrl) {
                try { URL.revokeObjectURL(previewUrl); } catch (e) { /* ignore */ }
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 className="text-xl font-semibold">Fill Request for Reference Form</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
                    </div>

                    <div className="p-6 overflow-y-auto max-h-[85vh]">
                        {/* Main Section */}
                        <RequestForReferenceSection
                            formData={formData}
                            onInputChange={handleInputChange}
                            onCheckboxChange={handleCheckboxChange}
                        />

                        {/* Action Buttons */}
                        <div className="flex gap-4 mb-6 mt-8">
                            <button
                                onClick={handlePreview}
                                disabled={generatingPreview}
                                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors min-w-[160px]"
                            >
                                {generatingPreview ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Generating Preview...
                                    </>
                                ) : (
                                    'Generate Preview'
                                )}
                            </button>

                            {previewUrl && (
                                <button
                                    onClick={handleSubmit}
                                    disabled={submitting}
                                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors min-w-[160px]"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Document'
                                    )}
                                </button>
                            )}
                        </div>

                        {/* PDF Preview */}
                        {previewUrl && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-4">Preview Filled Document</h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <iframe
                                        src={previewUrl}
                                        className="w-full h-96"
                                        title="Filled PDF Preview"
                                    />
                                    <div className="bg-gray-50 p-3 text-sm text-gray-600">
                                        <p>Review your document above. If everything looks correct, click "Submit Document".</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Modal */}
            <StatusModal
                isOpen={statusModal.isOpen}
                onClose={closeStatusModal}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
                duration={statusModal.type === 'success' ? 2000 : 3000}
            />
        </>
    );
};

export default RequestForReferenceForm;