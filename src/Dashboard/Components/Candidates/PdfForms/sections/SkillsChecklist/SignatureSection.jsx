import React from 'react';
import SignatureCanvas from 'react-signature-canvas';

const SignatureSection = ({ 
  formData, 
  onInputChange, 
  signatureDataUrl, 
  onSignatureEnd, 
  onClearSignature, 
  sigCanvasRef 
}) => {
  // Format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;
    
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
    
    return dateString;
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Final Verification & Signature</h3>
      
      {/* Languages Section */}
      <div className="mb-6 p-4 border border-gray-300 rounded">
        <h4 className="text-md font-semibold text-gray-800 mb-3">
          Languages, other than English, that I can speak and understand:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language 1</label>
            <input
              type="text"
              value={formData["Languages other than English that I can speak and understand 1"]}
              onChange={(e) => onInputChange("Languages other than English that I can speak and understand 1", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Spanish, French, etc."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language 2</label>
            <input
              type="text"
              value={formData["Languages other than English that I can speak and understand 2"]}
              onChange={(e) => onInputChange("Languages other than English that I can speak and understand 2", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language 3</label>
            <input
              type="text"
              value={formData["Languages other than English that I can speak and understand 3"]}
              onChange={(e) => onInputChange("Languages other than English that I can speak and understand 3", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional"
            />
          </div>
        </div>
      </div>

      {/* Certification Statement */}
      <div className="mb-6 p-4 border border-gray-300 rounded bg-gray-50">
        <h4 className="text-md font-semibold text-gray-800 mb-3">Certification:</h4>
        <p className="text-sm text-gray-700 italic">
          "I confirm that the information I have checked and provided is correct."
        </p>
      </div>

      {/* Signature Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Print Name and Date */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Print Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData["Print Name"]}
              onChange={(e) => onInputChange("Print Name", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your printed name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formatDateForInput(formData["Date"])}
              onChange={(e) => onInputChange("Date", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Right Column - Signature */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Signature <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={onClearSignature}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear Signature
            </button>
          </div>
          <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
            <SignatureCanvas
              ref={sigCanvasRef}
              canvasProps={{
                className: "w-full h-40 bg-white",
                style: { cursor: 'crosshair' }
              }}
              onEnd={onSignatureEnd}
            />
          </div>
          {signatureDataUrl && (
            <div className="mt-2">
              <p className="text-xs text-green-600">
                ✓ Signature captured. You can re-draw if needed.
              </p>
            </div>
          )}

          {/* Signature Preview */}
          {signatureDataUrl && (
            <div className="mt-4 p-3 border border-gray-200 rounded bg-white">
              <p className="text-sm font-medium text-gray-700 mb-2">Signature Preview:</p>
              <div className="border border-gray-300 rounded p-2 bg-white">
                <img 
                  src={signatureDataUrl} 
                  alt="Signature preview" 
                  className="h-16 max-w-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Important Note */}
      <div className="mt-6 p-4 border border-yellow-200 rounded-lg bg-yellow-50">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-yellow-800">Final Step</h4>
            <p className="mt-1 text-sm text-yellow-700">
              By signing this form, you certify that all information provided is accurate and complete. 
              This information will be used to match your skills with appropriate assignments.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 p-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          1050/MC-Rev.0118 ©Mastercare, Inc. All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default SignatureSection;