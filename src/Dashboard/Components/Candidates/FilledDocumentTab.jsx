import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Eye, FileText, Calendar, CheckCircle, AlertCircle, Filter, Users, Archive, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const FilledDocumentTab = ({ applicationId }) => {
  const [filledDocuments, setFilledDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStage, setFilterStage] = useState('all');
  const [downloading, setDownloading] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    if (applicationId) {
      fetchAllFilledDocuments();
    }
  }, [applicationId]);

  const fetchAllFilledDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/job-applications/${applicationId}/filled-documents`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );

      if (response.data.success) {
        setFilledDocuments(response.data.data.filled_documents || []);
      } else {
        throw new Error('Failed to fetch filled documents');
      }
    } catch (err) {
      console.error('Error fetching filled documents:', err);
      setError(err.response?.data?.message || 'Failed to load filled documents');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileSize = (url) => {
    return 'PDF Doc';
  };

  const handleDownload = async (doc) => {
    try {
      setDownloading(doc.id);

      // Method 1: Direct download using fetch and blob
      const response = await fetch(doc.filled_document_url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.name.replace(/\s+/g, '_')}_${doc.stage_name.replace(/\s+/g, '_')}_filled.pdf`;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Download failed:', error);

      // Method 2: Fallback - try to force download with different approach
      try {
        const link = document.createElement('a');
        link.href = doc.filled_document_url;
        link.download = `${doc.name.replace(/\s+/g, '_')}_${doc.stage_name.replace(/\s+/g, '_')}_filled.pdf`;
        link.target = '_blank';

        // Add download attribute and trigger click
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (fallbackError) {
        console.error('Fallback download also failed:', fallbackError);

        // Method 3: Final fallback - open in new tab
        window.open(doc.filled_document_url, '_blank');

        // Show message to user
        alert('Your browser is opening the document in a new tab. You can save it from there using the browser\'s save option (Ctrl+S or right-click → Save As).');
      }
    } finally {
      setDownloading(null);
    }
  };

  const handleView = (doc) => {
    window.open(doc.filled_document_url, '_blank');
  };

  // Get unique stages for filter
  const stages = [...new Set(filledDocuments.map(doc => doc.stage_name))];

  // Filter documents by stage
  const filteredDocuments = filterStage === 'all'
    ? filledDocuments
    : filledDocuments.filter(doc => doc.stage_name === filterStage);

  // Calculate pagination
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredDocuments.length);
  const currentDocuments = filteredDocuments.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">Loading filled documents...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle size={48} className="text-red-400 mx-auto mb-3" />
            <p className="text-gray-700 mb-2">Failed to load documents</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchAllFilledDocuments}
              className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm hover:bg-teal-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              Filled Documents
            </h2>
            <p className="text-gray-600 text-sm">
              {filledDocuments.length} document(s) completed across all stages
            </p>
          </div>

          {/* Stage Filter
          {stages.length > 0 && (
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Stages</option>
                {stages.map(stage => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>
          )} */}
        </div>

        {/* Stats Cards */}
        
      </div>

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <FileText size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            {filterStage === 'all'
              ? 'No filled documents yet'
              : `No documents filled in ${filterStage} stage`
            }
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Documents completed by the candidate will appear here
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-6">
            {currentDocuments.map((doc, index) => (
              <div
                key={`${doc.id}-${doc.stage_id}-${index}`}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors bg-white"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle size={14} className="text-green-600" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1.5">
                        <h3 className="font-medium text-gray-900 text-sm truncate">
                          {doc.name}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 border border-green-200 shrink-0">
                          Completed
                        </span>
                      </div>

                      <p className="text-gray-600 text-xs mb-1.5 line-clamp-2">
                        {doc.description || 'No description available'}
                      </p>

                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-4 text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span className='text-xs'>Completed {formatDate(doc.completed_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right column with stage and action buttons */}
                  <div className="flex flex-col items-end gap-3">
                    {/* View and Download buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleView(doc)}
                        className="flex items-center justify-center p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        title="View Document"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDownload(doc)}
                        disabled={downloading === doc.id}
                        className="flex items-center justify-center p-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-teal-600 disabled:cursor-not-allowed transition-colors"
                        title="Download Document"
                      >
                        {downloading === doc.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <Download size={16} />
                        )}
                      </button>
                    </div>
                    {/* Stage badge
                    <div className="bg-teal-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                      {doc.stage_name}
                    </div> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Items per page:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
                >
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{endIndex} of {filteredDocuments.length}
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="First Page"
                  >
                    <ChevronsLeft size={16} />
                  </button>
                  
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Previous Page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="flex items-center gap-1 mx-2">
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
                          className={`min-w-[32px] h-8 rounded-md text-sm ${
                            currentPage === pageNum
                              ? 'bg-teal-600 text-white'
                              : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Next Page"
                  >
                    <ChevronRight size={16} />
                  </button>
                  
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Last Page"
                  >
                    <ChevronsRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Stats Footer */}
      {filteredDocuments.length > 0 && totalPages <= 1 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-600 gap-2">
            <span className='text-xs'>
              Showing {filteredDocuments.length} of {filledDocuments.length} filled document(s)
              {filterStage !== 'all' && ` in ${filterStage} stage`}
            </span>
            <div className="flex items-center gap-2">
              <CheckCircle size={14} className="text-green-500" />
              <span className='text-xs'>All documents completed by candidate</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilledDocumentTab;