import { Upload, X, File } from 'lucide-react';
import { useCallback, useState, useRef } from 'react';

export default function FileUpload({ label, accept, onChange }) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFiles(files);
        }
    }, []);

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFiles(files);
        }
    };

    const handleFiles = (files) => {
        const file = files[0]; // Get the first file
        setUploadedFile(file);
        if (onChange) {
            onChange(file);
        }
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation(); // Prevent triggering the file input
        setUploadedFile(null);
        if (onChange) {
            onChange(null);
        }
        // Reset file input to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div 
                className={`border-dashed border-2 rounded-md flex flex-col items-center justify-center p-6 transition-colors cursor-pointer ${
                    isDragging 
                        ? 'border-teal-500 bg-teal-50' 
                        : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                {uploadedFile ? (
                    <div className="flex items-center gap-3 w-full">
                        <div className="bg-teal-50 p-2 rounded-full">
                            <File className="h-4 w-4 text-teal-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">
                                {uploadedFile.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {(uploadedFile.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                        <button 
                            type="button"
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            onClick={handleRemoveFile}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <div className="bg-teal-50 p-3 rounded-full mb-3">
                            <Upload className={`h-5 w-5 ${
                                isDragging ? 'text-teal-700' : 'text-teal-600'
                            }`} />
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                <span className="text-teal-600 font-medium">Upload file</span> or drag and drop here
                            </p>
                        </div>
                    </div>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept={accept}
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}