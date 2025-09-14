import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

const FileUploadDialog = ({ open, onClose, onSubmit, title, accept, maxSizeMB = 2 }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const formik = useFormik({
        initialValues: { file: null },
        validationSchema: Yup.object({
            file: Yup.mixed()
                .required("File is required")
                .test(
                    "fileSize",
                    `File too large. Max size is ${maxSizeMB}MB`,
                    (value) => !value || value.size <= maxSizeMB * 1024 * 1024
                )
                .test(
                    "fileType",
                    `Unsupported file type. Allowed: ${accept}`,
                    (value) => {
                        if (!value) return true;
                        const allowedExtensions = accept.split(",").map((ext) => ext.trim().toLowerCase());
                        const fileExt = value.name.split(".").pop().toLowerCase();
                        return allowedExtensions.includes("." + fileExt);
                    }
                ),
        }),
        onSubmit: (values) => {
            onSubmit(values.file);
            setSelectedFile(null);
            formik.resetForm();
        },
    });

    const handleFileChange = (e) => {
        const file = e.currentTarget.files[0];
        setSelectedFile(file);
        formik.setFieldValue("file", file);
    };

    const handleClose = () => {
        setSelectedFile(null);
        formik.resetForm();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} PaperProps={{ className: "rounded-xl p-2" }}>
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            <form onSubmit={formik.handleSubmit}>
                <DialogContent className="flex flex-col gap-3">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept={accept}
                        className="border border-gray-300 rounded-md p-2"
                    />
                    {formik.errors.file && formik.touched.file && (
                        <div className="text-red-500 text-sm">{formik.errors.file}</div>
                    )}
                    {selectedFile && (
                        <div className="text-gray-700 text-sm">Selected: {selectedFile.name}</div>
                    )}
                </DialogContent>
                <DialogActions className="pt-3">
                    <Button
                        onClick={handleClose}
                        variant="outlined"
                        className="text-black border hover:bg-gray-100 rounded-md px-4 py-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={!selectedFile}
                        className="bg-transparent hover:bg-teal-600 text-teal-600 hover:text-white rounded-md px-5 py-2 font-medium border border-teal-600 transition-all duration-200"
                    >
                        Upload
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default FileUploadDialog;
