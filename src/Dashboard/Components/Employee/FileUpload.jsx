import { Upload, X, File } from 'lucide-react';
import { useCallback, useState, useRef, useEffect } from 'react';

export default function FileUpload({ label, accept = '', onChange, required = false }) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const allowedTypes = accept.split(',').map(type => type.trim().toLowerCase());

    const isFileTypeAllowed = (file) => {
        const fileName = file.name.toLowerCase();
        const fileType = file.type;

        return allowedTypes.some(type => {
            if (type.startsWith('.')) {
                return fileName.endsWith(type);
            }
            if (type.endsWith('/*')) {
                return fileType.startsWith(type.split('/')[0]);
            }
            return fileType === type;
        });
    };

    const validateFile = (file) => {
        if (required && !file) {
            setError('File is required.');
            return false;
        }

        if (file && !isFileTypeAllowed(file)) {
            setError(`Invalid file type. Allowed types: ${accept}`);
            return false;
        }

        setError(null);
        return true;
    };

    const handleFiles = (files) => {
        const file = files[0];
        if (!validateFile(file)) {
            setUploadedFile(null);
            if (onChange) onChange(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        setUploadedFile(file);
        setError(null);
        if (onChange) onChange(file);
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
    }, [allowedTypes]);

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFiles(files);
        } else if (required) {
            setError('File is required.');
        }
    };

    const handleRemoveFile = (e) => {
        e.stopPropagation();
        setUploadedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (required) {
            setError('File is required.');
        } else {
            setError(null);
        }
        if (onChange) onChange(null);
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    // Optional: Validate on mount if required
    useEffect(() => {
        if (required && !uploadedFile) {
            setError('File is required.');
        }
    }, [required, uploadedFile]);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
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
                            {accept && (
                                <p className="text-xs text-gray-400 mt-1">Allowed: {accept}</p>
                            )}
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
            {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
            )}
        </div>
    );
}
