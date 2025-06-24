import React, { useCallback, useRef, useState } from "react";
import { Upload, X, User } from "lucide-react";

export default function UploadBox({
    label,
    buttonText = "Upload an image",
    accept,
    onChange,
    maxSizeMB = 2 // default to 2MB if not provided
}) {
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
            if (type.startsWith('.')) return fileName.toLowerCase().endsWith(type.toLowerCase());
            if (type.endsWith('/*')) return fileType.startsWith(type.split('/')[0]);
            return fileType === type;
        });
    };

    const handleDragEnter = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
    const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
    const handleDragOver = useCallback((e) => { e.preventDefault(); }, []);
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files?.length > 0) handleFiles(files);
    }, []);

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files?.length > 0) handleFiles(files);
    };

    const handleFiles = (files) => {
        const file = files[0];

        if (!isFileTypeAllowed(file)) {
            setError("Invalid file type.");
            setUploadedFile(null);
            onChange?.(null);
            return;
        }

        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            setError(`File is too large. Maximum allowed size is ${maxSizeMB} MB.`);
            setUploadedFile(null);
            onChange?.(null);
            return;
        }

        setUploadedFile(file);
        setError(null);
        onChange?.(file);
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setUploadedFile(null);
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onChange?.(null);
    };

    const handleClick = () => fileInputRef.current.click();

    return (
        <div className="relative w-full">
            <div
                className={`flex flex-col items-center justify-center border border-dashed rounded-[10px] px-4 py-6 text-center transition-colors ${isDragging ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:bg-gray-50"}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {uploadedFile ? (
                    <div className="flex items-center justify-between w-full px-2">
                        <div className="flex items-center gap-3">
                            <div className="bg-teal-100 p-2 rounded-full">
                                <Upload className="h-5 w-5 text-teal-700" />
                            </div>
                            <div className="min-w-0 text-left">
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
                        <div className="bg-[#d7f7f0] hover:bg-teal-100 p-3 rounded-full mb-2">
                            <User
                                className="w-6 h-6 text-teal-700 cursor-pointer"
                                onClick={handleClick}
                            />
                        </div>
                        <p className="text-sm font-medium text-teal-700">
                            <span
                                className="text-sm text-teal-700 cursor-pointer hover:underline"
                                onClick={handleClick}
                            >
                                {buttonText}
                            </span>{" "}
                            <span className="text-sm text-gray-500">or drag and drop here</span>
                        </p>
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

            {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
            )}

            {/* {(accept || maxSizeMB) && (
                <p className="text-xs text-gray-400 mt-1">
                    {accept && `Allowed: ${accept}. `}Max size: {maxSizeMB} MB.
                </p>
            )} */}
        </div>
    );
}
