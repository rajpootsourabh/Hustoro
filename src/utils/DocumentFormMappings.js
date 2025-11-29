// Enhanced dynamic form field mappings
export const documentFormMappings = {
  // Employment Application form fields
  1: {
    documentName: "Employment Application",
    fields: [
      // Personal Information - Text Fields
      {
        pdfFieldName: "Name",
        label: "Full Name",
        type: "text",
        required: true,
        placeholder: "Enter your full name",
      },
      {
        pdfFieldName: "Date",
        label: "Date",
        type: "date",
        required: true,
      },
      {
        pdfFieldName: "Address",
        label: "Address",
        type: "text",
        required: true,
        placeholder: "Enter your street address",
      },
      {
        pdfFieldName: "City",
        label: "City",
        type: "text",
        required: true,
        placeholder: "Enter your city",
      },
      {
        pdfFieldName: "State",
        label: "State",
        type: "text",
        required: true,
        placeholder: "Enter your state",
      },
      {
        pdfFieldName: "Zip",
        label: "ZIP Code",
        type: "text",
        required: true,
        placeholder: "Enter your ZIP code",
      },
      {
        pdfFieldName: "Email Address",
        label: "Email Address",
        type: "email",
        required: true,
        placeholder: "Enter your email address",
      },
      {
        pdfFieldName: "Phone",
        label: "Phone Number",
        type: "tel",
        required: true,
        placeholder: "Enter your phone number",
      },

      // Position Information
      {
        pdfFieldName: "Position",
        label: "Position Applied For",
        type: "text",
        required: true,
        placeholder: "Enter the position you're applying for",
      },
      {
        pdfFieldName: "Location Preference",
        label: "Location Preference",
        type: "text",
        required: false,
        placeholder: "Preferred work location",
      },
      {
        pdfFieldName: "Salary Desired",
        label: "Desired Salary",
        type: "text",
        required: false,
        placeholder: "Enter desired salary",
      },
      {
        pdfFieldName: "How many hours can you work weekly",
        label: "Hours Available Per Week",
        type: "text",
        required: false,
        placeholder: "Enter available hours per week",
      },
      {
        pdfFieldName: "When would you be available to begin work",
        label: "Available Start Date",
        type: "text",
        required: false,
        placeholder: "Enter when you can start",
      },

      // Work Preferences - Regular Checkboxes
      {
        pdfFieldName: "No Preference",
        label: "No Preference on Work Days",
        type: "checkbox",
        required: false,
      },
      {
        pdfFieldName: "Monday",
        label: "Available Monday",
        type: "checkbox",
        required: false,
      },
      {
        pdfFieldName: "Tuesday",
        label: "Available Tuesday",
        type: "checkbox",
        required: false,
      },
      {
        pdfFieldName: "Wednesday",
        label: "Available Wednesday",
        type: "checkbox",
        required: false,
      },
      {
        pdfFieldName: "Thursday",
        label: "Available Thursday",
        type: "checkbox",
        required: false,
      },
      {
        pdfFieldName: "Friday",
        label: "Available Friday",
        type: "checkbox",
        required: false,
      },
      {
        pdfFieldName: "Saturday",
        label: "Available Saturday",
        type: "checkbox",
        required: false,
      },
      {
        pdfFieldName: "Sunday",
        label: "Available Sunday",
        type: "checkbox",
        required: false,
      },

      // Work Type - Radio Groups (mutually exclusive)
      {
        pdfFieldName: "Full Time Only",
        label: "Full Time Only",
        type: "checkbox",
        required: false,
        radioGroup: "workPreference",
      },
      {
        pdfFieldName: "Part Time Only",
        label: "Part Time Only",
        type: "checkbox",
        required: false,
        radioGroup: "workPreference",
      },
      {
        pdfFieldName: "Full or Part Time",
        label: "Full or Part Time",
        type: "checkbox",
        required: false,
        radioGroup: "workPreference",
      },

      // Yes/No Pairs
      {
        pdfFieldName: "Nights No",
        label: "Not Available to Work Nights",
        type: "checkbox",
        required: false,
        yesNoPair: "nights",
        hidden: true,
      },
      {
        pdfFieldName: "Work US No",
        label: "Not Authorized to Work in US",
        type: "checkbox",
        required: false,
        yesNoPair: "workUS",
        hidden: true,
      },
      {
        pdfFieldName: "Test No",
        label: "Not Willing to Take Pre-employment Test",
        type: "checkbox",
        required: false,
        yesNoPair: "test",
        hidden: true,
      },
      {
        pdfFieldName: "Accommodation No",
        label: "No Accommodation Needed",
        type: "checkbox",
        required: false,
        yesNoPair: "accommodation",
        hidden: true,
      },
      {
        pdfFieldName: "Accommodation No",
        label: "No Accommodation Needed",
        type: "checkbox",
        required: false,
        yesNoPair: "accommodation",
        hidden: true,
      },

      // Accommodation Details
      {
        pdfFieldName:
          "reasonable accommodation If no describe what accommodations you would need 1",
        label: "Accommodation Details",
        type: "textarea",
        required: false,
        placeholder: "Please describe any accommodations needed",
      },

      // Signature Section
      {
        pdfFieldName: "Date_2",
        label: "Application Date",
        type: "date",
        required: true,
      },
      {
        pdfFieldName: "Signature1_es_:signer:signature",
        label: "Applicant Signature",
        type: "text",
        required: true,
        placeholder: "Type your full name as signature",
      },
    ],
  },

  // Orientation Acknowledgements form fields
  9: {
    documentName: "Orientation Acknowledgements",
    fields: [
      {
        pdfFieldName: "field1",
        label: "Full Name",
        type: "text",
        required: true,
        placeholder: "Enter your full name",
      },
      {
        pdfFieldName: "field2",
        label: "Employee ID",
        type: "text",
        required: true,
        placeholder: "Enter your employee ID",
      },
    ],
  },

  // Orientation Curriculum - TX form fields
  10: {
    documentName: "Orientation Curriculum - TX",
    fields: [
      {
        pdfFieldName: "curriculum_field1",
        label: "Participant Name",
        type: "text",
        required: true,
        placeholder: "Enter participant name",
      },
      {
        pdfFieldName: "curriculum_field2",
        label: "Training Date",
        type: "date",
        required: true,
      },
    ],
  },
};

// Helper function to get form mapping for a document
export const getFormMapping = (documentId) => {
  const mapping = documentFormMappings[documentId];
  if (!mapping) {
    console.warn(`No form mapping found for document ID: ${documentId}`);
    return null;
  }

  // Filter out hidden fields
  if (mapping.fields) {
    mapping.fields = mapping.fields.filter((field) => !field.hidden);
  }

  return mapping;
};
