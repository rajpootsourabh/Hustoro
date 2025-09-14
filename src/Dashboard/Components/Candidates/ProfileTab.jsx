import React, { useState, useEffect } from "react";
import axios from "axios";
import EditableField from "../Candidates/EditableField";
import ResumeViewer from "./ResumeViewer";
import EditProfileDialog from "./EditProfileDialog";
import FileUploadDialog from "../FileUploadDialog";
import { useSnackbar } from '../../Components/SnackbarContext';

const ProfileTab = ({ candidateData, isEditMode, onRefresh }) => {
  const { showSnackbar } = useSnackbar();
  const [data, setData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("Upload Resume");
  const [uploadAccept, setUploadAccept] = useState(".pdf");

  useEffect(() => {
    if (candidateData) {
      setData(candidateData);
    }
  }, [candidateData]);

  const startEditing = (field, value) => {
    setEditingField(field);
    setTempValue(value);
  };

  const saveChange = () => {
    setData((prev) => ({
      ...prev,
      candidate: { ...prev.candidate, [editingField]: tempValue },
    }));
    setEditingField(null);
  };

  const cancelChange = () => setEditingField(null);

  const handleResumeUpload = async (file, onSuccessClose) => {
    if (!file || !data?.id) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/job-applications/${data.id}/files`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const newResumeUrl = `${response.data.candidate.resume}?t=${Date.now()}`;

      // Retry HEAD check until file exists
      let ready = false;
      let retries = 0;
      while (!ready && retries < 5) {
        try {
          await axios.head(newResumeUrl, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
          });
          ready = true;
        } catch {
          await new Promise((r) => setTimeout(r, 1000));
          retries++;
        }
      }

      if (!ready) throw new Error("File not available yet");

      setData((prev) => ({
        ...prev,
        candidate: { ...prev.candidate, resume: newResumeUrl },
      }));

      if (onRefresh) onRefresh();
      if (onSuccessClose) onSuccessClose();

      showSnackbar("Resume uploaded successfully", "success");
    } catch (err) {
      console.error(err.response?.data || err.message);

      showSnackbar("Failed to upload resume", "error");
    } finally {
      setUploading(false);
    }
  };


  const handleOpenUploadDialog = (title, accept) => {
    setUploadTitle(title);
    setUploadAccept(accept);
    setUploadDialogOpen(true);
  };

  const handleFileUpload = (file) => {
    handleResumeUpload(file); // reuse existing upload logic
    setUploadDialogOpen(false);
  };

  const renderEditableField = (label, key, required = false) => (
    <EditableField
      label={label}
      fieldKey={key}
      value={data?.candidate?.[key] || ""}
      isEditing={editingField === key}
      tempValue={tempValue}
      onChange={setTempValue}
      onStartEdit={startEditing}
      onSave={saveChange}
      onCancel={cancelChange}
      required={required}
      allowEdit={isEditMode}
    />
  );

  if (!data) return <div>Loading...</div>;

  return (
    <div className="max-w-full mx-auto bg-white py-4">
      {/* Personal Details */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-md font-semibold">Personal Details</h2>
        <button
          onClick={() => setOpenDialog(true)}
          className="px-3 py-1 bg-teal-700 text-white rounded-md text-sm mr-5"
        >
          Edit
        </button>
      </div>

      {renderEditableField("First Name", "first_name", true)}
      {renderEditableField("Last Name", "last_name", true)}
      {renderEditableField("Designation", "designation")}
      {renderEditableField("Location", "location")}
      {renderEditableField("Experience", "experience")}
      {renderEditableField("Education", "education")}
      {renderEditableField("Current CTC (LPA)", "current_ctc")}
      {renderEditableField("Expected CTC (LPA)", "expected_ctc")}

      <hr className="my-6" />

      {/* Contact Details */}
      <h2 className="text-md font-semibold mb-4">Contact Details</h2>
      {renderEditableField("Phone", "phone")}
      {renderEditableField("Email", "email")}

      {/* Resume Viewer */}
      {data?.candidate?.resume && (
        <ResumeViewer
          fileUrl={data.candidate.resume}
          uploading={uploading}
          onOpenUploadDialog={() =>
            handleOpenUploadDialog("Upload Resume", ".pdf")
          }
        />
      )}

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        applicationId={data?.id}
        candidateData={data}
        onSuccess={(updatedCandidate) => {
          setData((prev) => ({
            ...prev,
            candidate: updatedCandidate,
          }));
          setOpenDialog(false);
          if (onRefresh) onRefresh();
        }}
      />

      {/* File Upload Dialog */}
      <FileUploadDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onSubmit={handleFileUpload}
        title={uploadTitle}
        accept={uploadAccept}
        maxSizeMB={2}
      />
    </div>
  );
};

export default ProfileTab;
