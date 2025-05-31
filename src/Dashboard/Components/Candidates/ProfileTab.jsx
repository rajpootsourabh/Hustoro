import React, { useState, useEffect } from "react";
import EditableField from "../Candidates/EditableField";
import ResumeViewer from "./ResumeViewer";

const ProfileTab = ({ candidateData, isEditMode }) => {
  const [data, setData] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    if (candidateData) {
      const dynamicData = {
        firstName: candidateData.candidate?.first_name || "",
        lastName: candidateData.candidate?.last_name || "",
        designation: candidateData.candidate?.designation || "",
        location: candidateData.candidate?.location || "",
        experience: candidateData.candidate?.experience || "",
        phone: candidateData.candidate?.phone || "",
        email: candidateData.candidate?.email || "",
        currentCtc: candidateData.candidate?.current_ctc || "",
        expectedCtc: candidateData.candidate?.expected_ctc || "",
        texting: candidateData.candidate?.texting || "",
      };
      setData(dynamicData);
    }
  }, [candidateData]);

  const startEditing = (field, value) => {
    setEditingField(field);
    setTempValue(value);
  };

  const saveChange = () => {
    setData((prev) => ({ ...prev, [editingField]: tempValue }));
    setEditingField(null);
  };

  const cancelChange = () => {
    setEditingField(null);
  };

  const renderEditableField = (label, key, required = false) => (
    <EditableField
      label={label}
      fieldKey={key}
      value={data[key]}
      isEditing={editingField === key}
      tempValue={tempValue}
      onChange={setTempValue}
      onStartEdit={startEditing}
      onSave={saveChange}
      onCancel={cancelChange}
      required={required}
      allowEdit={isEditMode}  // <-- Pass isEditMode here
    />
  );

  if (!data) return <div>Loading...</div>;

  return (
    <div className="max-w-full mx-auto bg-white py-4">
      <h2 className="text-md font-semibold mb-4">Personal Details</h2>
      {renderEditableField("First Name", "firstName", true)}
      {renderEditableField("Last Name", "lastName", true)}
      {renderEditableField("Designation", "designation")}
      {renderEditableField("Location", "location")}
      {renderEditableField("Experience", "experience")}
      {renderEditableField("Current CTC (LPA)", "currentCtc")}
      {renderEditableField("Expected CTC (LPA)", "expectedCtc")}

      <hr className="my-6" />

      <h2 className="text-md font-semibold mb-4">Contact Details</h2>
      {renderEditableField("Phone", "phone")}
      {renderEditableField("Email", "email")}

      {candidateData?.candidate?.resume && (
        <ResumeViewer fileUrl={"https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf"} />
      )}
    </div>
  );
};

export default ProfileTab;
