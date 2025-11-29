import React, { useState, useEffect } from 'react';
import { X, Copy, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function DocumentLinksForm({ 
  candidateData, 
  applicationId, 
  onClose 
}) {
  const [documentLinks, setDocumentLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    fetchDocumentLinks();
  }, [applicationId]);

  const fetchDocumentLinks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/job-applications/${applicationId}/generate-document-links`,
        {
          documents: [],
          expiry_days: 7
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setDocumentLinks(response.data.data.document_links || []);
      } else {
        throw new Error(response.data.message || 'Failed to generate links');
      }
    } catch (err) {
      console.error('Failed to fetch document links:', err);
      setError(err.response?.data?.message || 'Failed to generate document links');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const copyAllLinks = async () => {
    const allLinks = documentLinks.map(link => 
      `${link.document_name}: ${link.url}`
    ).join('\n\n');
    
    try {
      await navigator.clipboard.writeText(allLinks);
      setCopiedIndex('all');
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy all links: ', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="relative bg-white rounded-xl p-4 min-h-[400px]">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto mb-3"></div>
            <p className="text-gray-500 text-sm">Generating document links...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative bg-white rounded-xl p-4 min-h-[400px]">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        <div className="flex items-center justify-center h-64">
          <div className="text-center max-w-xs">
            <AlertCircle size={40} className="text-red-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium mb-1">Unable to generate links</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-xl p-4">
      {/* Close Button */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X size={20} />
      </button>

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Document Links</h3>
        <p className="text-sm text-gray-500 mt-1">
          Share these secure links with the candidate
        </p>
      </div>

      {/* Candidate Card */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">{candidateData?.name}</p>
            <p className="text-sm text-gray-600 mt-0.5">{candidateData?.email}</p>
          </div>
          <div className="text-right">
            <div className="bg-white rounded-full px-3 py-1 text-xs font-medium text-gray-700 shadow-xs">
              {documentLinks.length} documents
            </div>
            <p className="text-xs text-gray-500 mt-2">Expires in 7 days</p>
          </div>
        </div>
      </div>

      {/* Document Links */}
      <div className="space-y-3 max-h-64 overflow-y-auto pr-2 mb-4">
        {documentLinks.map((link, index) => (
          <div
            key={link.token}
            className="group border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-xs transition-all duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
                    <FileText size={16} className="text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 text-sm truncate">
                      {link.document_name}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {link.document_code}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        Expires {formatDate(link.expires_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => copyToClipboard(link.url, index)}
                className={`ml-4 flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 ${
                  copiedIndex === index 
                    ? 'bg-green-100 text-green-700 shadow-xs' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 shadow-xs'
                }`}
              >
                {copiedIndex === index ? (
                  <>
                    <CheckCircle size={14} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-4 border-t border-gray-100">
        <button
          onClick={copyAllLinks}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            copiedIndex === 'all'
              ? 'bg-green-100 text-green-700 border border-green-200 shadow-xs'
              : 'bg-gray-900 text-white hover:bg-gray-800 shadow-xs'
          }`}
        >
          {copiedIndex === 'all' ? (
            <>
              <CheckCircle size={16} />
              All Links Copied!
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy All Links
            </>
          )}
        </button>
      </div>
    </div>
  );
}