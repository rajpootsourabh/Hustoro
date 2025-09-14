import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { printPlugin } from '@react-pdf-viewer/print';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import { FileText, Printer, Download as DownloadIcon, Upload } from 'lucide-react';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/print/lib/styles/index.css';

const ResumeViewer = ({ fileUrl, onOpenUploadDialog, uploading = false }) => {
    const printPluginInstance = printPlugin();
    const getFilePluginInstance = getFilePlugin();

    const { Print } = printPluginInstance;
    const { Download } = getFilePluginInstance;

    return (
        <div className="bg-white shadow-sm rounded-lg w-full h-[100vh] md:h-[135vh] overflow-hidden flex flex-col relative mt-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h2 className="text-md font-semibold flex items-center gap-2">
                    Resume {fileUrl && <FileText size={16} />}
                </h2>
            </div>

            {/* PDF Viewer Container */}
            <div className="flex-1 border rounded-lg overflow-hidden bg-gray-100 relative">
                {/* Toolbar */}
                <div className="no-print absolute top-1 right-14 flex gap-2 bg-white bg-opacity-90 rounded-md p-1 z-30">
                    <Print>
                        {(props) => (
                            <button
                                onClick={props.onClick}
                                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors rounded-md"
                            >
                                <Printer size={16} />
                            </button>
                        )}
                    </Print>

                    <Download>
                        {(props) => (
                            <button
                                onClick={props.onClick}
                                className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors rounded-md"
                            >
                                <DownloadIcon size={17} />
                            </button>
                        )}
                    </Download>

                    {/* UPLOAD BUTTON now triggers parent dialog */}
                    {onOpenUploadDialog && (
                        <button
                            onClick={onOpenUploadDialog}
                            className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors rounded-md"
                        >
                            <Upload size={16} />
                        </button>
                    )}
                </div>

                {/* Viewer wrapper */}
                <div className="h-full overflow-auto flex items-center justify-center">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        {uploading ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                Uploading new resume...
                            </div>
                        ) : fileUrl ? (
                            <Viewer
                                key={fileUrl}
                                fileUrl={fileUrl}
                                plugins={[printPluginInstance, getFilePluginInstance]}
                            />
                        ) : (
                            <div className="h-full flex justify-center items-center text-gray-400 text-sm">
                                No PDF file provided.
                            </div>
                        )}
                    </Worker>
                </div>
            </div>
        </div>
    );
};

export default ResumeViewer;
