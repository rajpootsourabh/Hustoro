import React, { useState } from 'react';
import { FileText, Printer, Download as DownloadIcon, Upload, ExternalLink, RefreshCw } from 'lucide-react';

const ResumeViewer = ({ fileUrl, onOpenUploadDialog, uploading = false }) => {
    const [pdfError, setPdfError] = useState(false);
    const [useGoogleViewer, setUseGoogleViewer] = useState(false);

    const googleDocsViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(fileUrl)}&embedded=true`;

    const handleRetry = () => {
        setPdfError(false);
        setUseGoogleViewer(!useGoogleViewer);
    };

    const handleDownload = () => {
        if (fileUrl) {
            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = 'resume.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const handleView = () => {
        if (fileUrl) {
            window.open(fileUrl, '_blank');
        }
    };

    return (
        <div className="bg-white shadow-sm rounded-lg w-full h-[100vh] md:h-[135vh] overflow-hidden flex flex-col relative mt-6">
            <div className="flex items-center justify-between mb-2 p-4">
                <h2 className="text-md font-semibold flex items-center gap-2">
                    Resume {fileUrl ? '' : '(No PDF provided)'}
                    {fileUrl && <FileText size={16} />}
                </h2>
            </div>

            <div className="flex-1 border rounded-lg overflow-hidden bg-gray-100 relative">
                {fileUrl && (
                    <div className="no-print absolute top-4 right-4 flex gap-2 bg-white bg-opacity-90 rounded-md p-1 z-30 shadow-sm border">
                        {pdfError && (
                            <button
                                onClick={handleRetry}
                                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors rounded-md"
                                title="Try different viewer"
                            >
                                <RefreshCw size={16} />
                            </button>
                        )}
                        
                        <button
                            onClick={handleView}
                            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors rounded-md"
                            title="Open in new tab"
                        >
                            <ExternalLink size={16} />
                        </button>

                        <button
                            onClick={handleDownload}
                            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors rounded-md"
                            title="Download resume"
                        >
                            <DownloadIcon size={17} />
                        </button>

                        {onOpenUploadDialog && (
                            <button
                                onClick={onOpenUploadDialog}
                                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors rounded-md"
                                title="Upload new resume"
                            >
                                <Upload size={16} />
                            </button>
                        )}
                    </div>
                )}

                {uploading ? (
                    <div className="p-4 text-center text-gray-500 text-sm h-full flex items-center justify-center">
                        Uploading new resume...
                    </div>
                ) : fileUrl ? (
                    pdfError ? (
                        <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-4">
                            <FileText size={64} className="text-gray-300 mb-4" />
                            <p className="text-gray-500 mb-2 text-center">
                                Unable to preview PDF
                            </p>
                            <div className="flex gap-2 flex-wrap justify-center">
                                <button
                                    onClick={handleView}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    Open in New Tab
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    ) : (
                        <iframe
                            src={useGoogleViewer ? googleDocsViewerUrl : fileUrl}
                            className="w-full h-full"
                            title="Resume PDF"
                            frameBorder="0"
                            onError={() => setPdfError(true)}
                            onLoad={() => setPdfError(false)}
                        />
                    )
                ) : (
                    <div className="h-full flex flex-col justify-center items-center text-gray-400 text-sm">
                        <FileText size={48} className="mb-2 opacity-50" />
                        <p>No PDF file provided.</p>
                        {onOpenUploadDialog && (
                            <button
                                onClick={onOpenUploadDialog}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                            >
                                <Upload size={16} />
                                Upload Resume
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResumeViewer;