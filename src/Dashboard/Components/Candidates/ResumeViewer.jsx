import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { printPlugin } from '@react-pdf-viewer/print';
import { getFilePlugin } from '@react-pdf-viewer/get-file';
import { FileText, Printer, Download as DownloadIcon } from 'lucide-react';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/print/lib/styles/index.css';

const ResumeViewer = ({ fileUrl }) => {
  const printPluginInstance = printPlugin();
  const getFilePluginInstance = getFilePlugin();

  const { Print } = printPluginInstance;
  const { Download } = getFilePluginInstance;

  return (
    <div className="bg-white shadow-sm bg-red-100 rounded-lg w-full h-[100vh] md:h-[135vh] overflow-hidden flex flex-col relative mt-6">
      {/* Header */}
      <h2 className="text-md font-semibold flex items-center mb-2">
        Resume
      </h2>

      {/* PDF Viewer Container */}
      <div className="flex-1 border rounded-lg overflow-hidden bg-gray-100 relative">
        {/* Toolbar */}
        <div className="no-print absolute top-2 right-20 flex gap-2 bg-white bg-opacity-90 rounded-md p-1 z-30">
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
        </div>

        {/* Viewer wrapper with scroll and size fix */}
        <div className="h-[100vh] md:h-[135vh] overflow-auto">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            {fileUrl ? (
              <div className="w-full">
                <Viewer
                  fileUrl={fileUrl}
                  plugins={[printPluginInstance, getFilePluginInstance]}
                />
              </div>
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

