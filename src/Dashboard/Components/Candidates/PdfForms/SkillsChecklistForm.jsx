import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';
import StatusModal from '../../../../Components/StatusModal';
import ADLSection from './sections/SkillsChecklist/ADLSection';
// import HousekeepingSection from './sections/SkillsChecklist/HousekeepingSection';
// import BodyMechanicsSection from './sections/SkillsChecklist/BodyMechanicsSection';
// import GeneralSection from './sections/SkillsChecklist/GeneralSection';
// import DiabeticSection from './sections/SkillsChecklist/DiabeticSection';
// import GastrointestinalSection from './sections/SkillsChecklist/GastrointestinalSection';
// import VitalSignsSection from './sections/SkillsChecklist/VitalSignsSection';
// import GenitourinarySection from './sections/SkillsChecklist/GenitourinarySection';
// import MedicalSection from './sections/SkillsChecklist/MedicalSection';
// import EquipmentSection from './sections/SkillsChecklist/EquipmentSection';
// import NeurologicalSection from './sections/SkillsChecklist/NeurologicalSection';
// import RespiratorySection from './sections/SkillsChecklist/RespiratorySection';
// import VascularSection from './sections/SkillsChecklist/VascularSection';
import SignatureSection from './sections/SkillsChecklist/SignatureSection';

const SkillsChecklistForm = ({ document, token, onClose, onSuccess }) => {
  // Initialize form data based on the actual field names from the mapping
  const initialFormData = {
    // Text fields
    "Languages other than English that I can speak and understand 1": "",
    "Languages other than English that I can speak and understand 2": "",
    "Languages other than English that I can speak and understand 3": "",
    "Print Name": "",
    "Date": "",
    "Signature131_es_:signer:signature": "",
    
    // Initialize all checkbox fields from the mapping
    ...createInitialCheckboxData()
  };

  function createInitialCheckboxData() {
    const checkboxData = {};
    
    // ADL Skills (Section 1)
    for (let i = 6; i <= 21; i++) {
      checkboxData[`1.1.${i-6}`] = false; // 1.1.0 to 1.1.15
    }
    for (let i = 22; i <= 37; i++) {
      checkboxData[`1.2.${i-22}`] = false; // 1.2.0 to 1.2.15
    }
    // ... Continue for all sections based on the mapping
    
    // For now, let's initialize with a simpler approach
    // We'll dynamically create field names as we need them
    return checkboxData;
  }

  const [formData, setFormData] = useState(initialFormData);
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [filledPdfBytes, setFilledPdfBytes] = useState(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState('');
  const [activeSection, setActiveSection] = useState('adl');
  const sigCanvasRef = useRef();

  // Status modal state
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Navigation sections
  const sections = [
    { id: 'adl', name: 'ADL Skills' },
    { id: 'housekeeping', name: 'Housekeeping' },
    { id: 'body', name: 'Body Mechanics' },
    { id: 'general', name: 'General' },
    { id: 'diabetic', name: 'Diabetic Care' },
    { id: 'gastro', name: 'Gastrointestinal' },
    { id: 'vitals', name: 'Vital Signs' },
    { id: 'genito', name: 'Genitourinary' },
    { id: 'medical', name: 'Medical' },
    { id: 'equipment', name: 'Equipment' },
    { id: 'neuro', name: 'Neurological' },
    { id: 'resp', name: 'Respiratory' },
    { id: 'vascular', name: 'Vascular' },
    { id: 'signature', name: 'Signature' }
  ];

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

  // Handle checkbox selection
  const handleCheckboxChange = (fieldName, checked) => {
    // For radio button behavior, we need to clear other options in the same group
    // The field name format is like "1.1.0", "1.1.1", etc.
    // We need to clear all fields in the same skill group
    
    // Extract skill group (e.g., "1.1" from "1.1.0")
    const skillGroup = fieldName.substring(0, fieldName.lastIndexOf('.'));
    
    // Clear all checkboxes in this skill group
    const updatedFormData = { ...formData };
    Object.keys(updatedFormData).forEach(key => {
      if (key.startsWith(skillGroup + '.') && key !== fieldName) {
        updatedFormData[key] = false;
      }
    });
    
    // Set the selected checkbox
    updatedFormData[fieldName] = checked;
    
    setFormData(updatedFormData);
  };

  // Signature handling
  const handleSignatureEnd = () => {
    if (sigCanvasRef.current && !sigCanvasRef.current.isEmpty()) {
      const signatureDataURL = sigCanvasRef.current.toDataURL();
      setSignatureDataUrl(signatureDataURL);
      handleInputChange("Signature131_es_:signer:signature", "Signed");
    }
  };

  const clearSignature = () => {
    if (sigCanvasRef.current) {
      sigCanvasRef.current.clear();
      setSignatureDataUrl('');
      handleInputChange("Signature131_es_:signer:signature", "");
    }
  };

  // Convert data URL to image bytes for PDF embedding
  const dataURLToImageBytes = async (dataURL) => {
    if (!dataURL) return null;
    try {
      const response = await fetch(dataURL);
      const blob = await response.blob();
      return new Uint8Array(await blob.arrayBuffer());
    } catch (error) {
      console.error("Error converting signature to image:", error);
      return null;
    }
  };

  // PDF filling logic - SIMPLIFIED VERSION
  const fillPdf = async (formData, pdfUrl) => {
    try {
      const pdfResponse = await fetch(pdfUrl);
      const pdfBuffer = await pdfResponse.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const form = pdfDoc.getForm();

      console.log('🔄 Filling Skills Checklist form fields...');

      // Fill text fields first
      console.log('🔄 Filling text fields...');
      const textFields = [
        "Languages other than English that I can speak and understand 1",
        "Languages other than English that I can speak and understand 2",
        "Languages other than English that I can speak and understand 3",
        "Print Name",
        "Date"
      ];

      textFields.forEach(fieldName => {
        try {
          const field = form.getTextField(fieldName);
          if (field) {
            field.setText(formData[fieldName] || "");
            console.log(`✅ Set text field: ${fieldName} = "${formData[fieldName]}"`);
          }
        } catch (error) {
          console.log(`❌ Error with text field ${fieldName}:`, error.message);
        }
      });

      // Fill checkbox fields - ONLY FOR FIELDS THAT EXIST IN THE FORM
      console.log('🔄 Filling checkbox fields...');
      
      // Get all form fields to see what actually exists
      const allFields = form.getFields();
      console.log('📋 Available fields in PDF:', allFields.map(f => f.getName()));
      
      // Try to fill checkboxes for fields that we have in formData
      Object.keys(formData).forEach(fieldName => {
        // Skip text fields and signature
        if (textFields.includes(fieldName) || fieldName === "Signature131_es_:signer:signature") {
          return;
        }
        
        // Only process checkbox-like field names
        if (fieldName.match(/^\d+\.\d+\.\d+$/)) {
          try {
            const field = form.getCheckBox(fieldName);
            if (field) {
              field.setValue(formData[fieldName] || false);
              console.log(`✅ Set checkbox: ${fieldName} = ${formData[fieldName]}`);
            }
          } catch (error) {
            // Field might not exist, that's okay
          }
        }
      });

      // Handle signature image
      if (signatureDataUrl) {
        const signatureImageBytes = await dataURLToImageBytes(signatureDataUrl);
        if (signatureImageBytes) {
          const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
          const pages = pdfDoc.getPages();

          try {
            const signatureField = form.getTextField("Signature131_es_:signer:signature");
            if (signatureField) {
              const widgets = signatureField.acroField.getWidgets();
              if (widgets && widgets.length > 0) {
                const rect = widgets[0].getRectangle();
                const pageRef = widgets[0].P();
                
                let pageIndex = 0;
                for (let i = 0; i < pages.length; i++) {
                  if (pages[i].ref === pageRef) {
                    pageIndex = i;
                    break;
                  }
                }
                
                pages[pageIndex].drawImage(signatureImage, {
                  x: rect.x || rect.left || 100,
                  y: rect.y || rect.bottom || 100,
                  width: rect.width || (rect.right - rect.left) || 150,
                  height: rect.height || (rect.top - rect.bottom) || 50,
                });
              }
            }
          } catch (error) {
            console.warn("Could not find signature field position:", error);
          }
        }
      }

      // Set signature text
      try {
        const signatureField = form.getTextField("Signature131_es_:signer:signature");
        if (signatureField) {
          signatureField.setText(formData["Signature131_es_:signer:signature"] || "");
        }
      } catch (error) {
        console.log(`Error setting signature text field:`, error.message);
      }

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
      console.error('Error filling Skills Checklist form:', error);
      throw error;
    }
  };

  const handlePreview = async () => {
    console.log('📊 Current formData:', formData);
    
    // Basic validation
    if (!formData["Print Name"]) {
      showStatusModal(
        'error',
        'Missing Information',
        'Please enter your printed name.'
      );
      return;
    }

    if (!signatureDataUrl) {
      showStatusModal(
        'error',
        'Signature Required',
        'Please provide your signature.'
      );
      return;
    }

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
      console.error('Preview error:', error);
      showStatusModal(
        'error',
        'Preview Generation Failed',
        `Failed to generate preview: ${error.message}. Please check the console for details.`
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
        'Your Skills Checklist has been submitted successfully.'
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

  // Render current section
  const renderCurrentSection = () => {
    const commonProps = {
      formData,
      onCheckboxChange: handleCheckboxChange
    };

    switch (activeSection) {
      case 'adl':
        return <ADLSection {...commonProps} />;
      // case 'housekeeping':
      //   return <HousekeepingSection {...commonProps} />;
      // case 'body':
      //   return <BodyMechanicsSection {...commonProps} />;
      // case 'general':
      //   return <GeneralSection {...commonProps} />;
      // case 'diabetic':
      //   return <DiabeticSection {...commonProps} />;
      // case 'gastro':
      //   return <GastrointestinalSection {...commonProps} />;
      // case 'vitals':
      //   return <VitalSignsSection {...commonProps} />;
      // case 'genito':
      //   return <GenitourinarySection {...commonProps} />;
      // case 'medical':
      //   return <MedicalSection {...commonProps} />;
      // case 'equipment':
      //   return <EquipmentSection {...commonProps} />;
      // case 'neuro':
      //   return <NeurologicalSection {...commonProps} />;
      // case 'resp':
      //   return <RespiratorySection {...commonProps} />;
      // case 'vascular':
      //   return <VascularSection {...commonProps} />;
      case 'signature':
        return (
          <SignatureSection
            formData={formData}
            onInputChange={handleInputChange}
            signatureDataUrl={signatureDataUrl}
            onSignatureEnd={handleSignatureEnd}
            onClearSignature={clearSignature}
            sigCanvasRef={sigCanvasRef}
          />
        );
      default:
        return <ADLSection {...commonProps} />;
    }
  };

  // Calculate completion percentage based on actual selections
  const calculateCompletion = () => {
    // Count how many skills have at least one selection
    const skillGroups = new Set();
    let selectedSkills = 0;
    
    Object.keys(formData).forEach(key => {
      if (key.match(/^\d+\.\d+\.\d+$/)) {
        const skillGroup = key.substring(0, key.lastIndexOf('.'));
        skillGroups.add(skillGroup);
        
        if (formData[key] === true) {
          selectedSkills++;
        }
      }
    });
    
    // Each skill group should have exactly one selection (4 options)
    const totalPossibleSelections = skillGroups.size;
    const percentage = totalPossibleSelections > 0 
      ? Math.round((selectedSkills / totalPossibleSelections) * 100)
      : 0;
    
    return percentage > 100 ? 100 : percentage;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        try { URL.revokeObjectURL(previewUrl); } catch (e) { /* ignore */ }
      }
      if (sigCanvasRef.current) {
        try { sigCanvasRef.current.clear(); } catch (e) { /* ignore */ }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-xl font-semibold">Skills Checklist for Care Associates</h2>
              <p className="text-sm text-gray-600 mt-1">
                Please indicate your level of experience next to each skill
              </p>
            </div>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">✕</button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[85vh]">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Form Completion</span>
                <span className="text-sm font-medium text-blue-600">{calculateCompletion()}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${calculateCompletion()}%` }}
                ></div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                  >
                    {section.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mb-6 p-3 border border-gray-300 rounded bg-gray-50">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Rating Legend:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs">1 - Very Experienced</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-xs">2 - Moderate Experience</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <span className="text-xs">3 - No Experience</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                  <span className="text-xs">4 - Do Not Want to Perform</span>
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-600">
                <strong>Note:</strong> Select only one rating per skill. All ratings are mutually exclusive.
              </p>
            </div>

            {/* Current Section */}
            {renderCurrentSection()}

            {/* Debug info (remove in production) */}
            <div className="mt-4 p-3 border border-gray-300 rounded bg-gray-100">
              <details className="text-sm">
                <summary className="cursor-pointer font-medium text-gray-700">Debug Info</summary>
                <div className="mt-2 text-xs">
                  <p>Selected checkboxes: {Object.keys(formData).filter(k => formData[k] === true).length}</p>
                  <p>Total form fields: {Object.keys(formData).length}</p>
                  <p>Signature captured: {signatureDataUrl ? 'Yes' : 'No'}</p>
                </div>
              </details>
            </div>

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

export default SkillsChecklistForm;