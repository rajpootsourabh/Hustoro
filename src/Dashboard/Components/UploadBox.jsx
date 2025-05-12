import React, { useCallback, useRef, useState } from "react";
import { Upload, X, File } from "lucide-react";

export default function UploadBox({ label, buttonText = "Upload File", accept, onChange }) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const allowedTypes = accept?.split(',').map(type => type.trim()) || [];

    const isFileTypeAllowed = (file) => {
        if (!accept) return true;
        const fileType = file.type;
        const fileName = file.name;

        return allowedTypes.some(type => {
            if (type.startsWith('.')) {
                return fileName.toLowerCase().endsWith(type.toLowerCase());
            }
            if (type.endsWith('/*')) {
                const baseType = type.split('/')[0];
                return fileType.startsWith(baseType);
            }
            return fileType === type;
        });
    };

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
        const file = files[0];
        if (!isFileTypeAllowed(file)) {
            setError("Invalid file type.");
            setUploadedFile(null);
            if (onChange) onChange(null);
            return;
        }

        setUploadedFile(file);
        setError(null);
        if (onChange) onChange(file);
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setUploadedFile(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (onChange) onChange(null);
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    return (
        <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">{label}</label>
            <div
                className={`flex flex-col items-center justify-center h-28 border-2 border-dashed rounded-xl px-4 py-2 cursor-pointer transition-colors text-center ${isDragging ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:bg-gray-50"
                    }`}
                onClick={handleClick}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {uploadedFile ? (
                    <div className="flex items-center justify-between w-full px-2">
                        <div className="flex items-center gap-3">
                            <div className="bg-teal-100 p-2 rounded-full">
                                <File className="h-5 w-5 text-teal-700" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                                    {uploadedFile.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {(uploadedFile.size / 1024).toFixed(1)} KB
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="text-gray-400 hover:text-red-500 transition"
                            onClick={handleRemoveFile}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <>
                        <Upload className="w-5 h-5 text-teal-600 mb-2" />
                        <p className="text-sm text-gray-600">{buttonText} or drag and drop</p>
                        {accept && (
                            <p className="text-xs text-gray-400 mt-1">Allowed: {accept}</p>
                        )}
                    </>
                )}
                <input
                    type="file"
                    ref={fileInputRef}
                    accept={accept}
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
    );
}
