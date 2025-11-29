import React from 'react';
import { PDFDocument } from 'pdf-lib';

const EmploymentApplicationFiller = {
  documentId: 1,
  documentName: "Employment Application",

  fillPdf: async (formData, pdfUrl) => {
    try {
      // Fetch the original PDF
      const pdfResponse = await fetch(pdfUrl);
      const pdfBuffer = await pdfResponse.arrayBuffer();

      // Load PDF document
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const form = pdfDoc.getForm();

      console.log('🔄 Filling Employment Application with hardcoded fields');
      console.log('📋 Form data received:', formData);

      // ===== PERSONAL INFORMATION =====
      form.getTextField("Name").setText(formData.Name || "");
      form.getTextField("Date").setText(formData.Date || "");
      form.getTextField("Address").setText(formData.Address || "");
      form.getTextField("City").setText(formData.City || "");
      form.getTextField("State").setText(formData.State || "");
      form.getTextField("Zip").setText(formData.Zip || "");
      form.getTextField("Email Address").setText(formData["Email Address"] || "");
      form.getTextField("Phone").setText(formData.Phone || "");

      // ===== POSITION INFORMATION =====
      form.getTextField("Position").setText(formData.Position || "");
      form.getTextField("Location Preference").setText(formData["Location Preference"] || "");
      form.getTextField("Salary Desired").setText(formData["Salary Desired"] || "");
      form.getTextField("How many hours can you work weekly").setText(formData["How many hours can you work weekly"] || "");
      form.getTextField("When would you be available to begin work").setText(formData["When would you be available to begin work"] || "");

      // ===== WORK PREFERENCES - CHECKBOXES =====
      // No Preference
      const noPreferenceField = form.getCheckBox("No Preference");
      if (formData["No Preference"] === true) {
        noPreferenceField.check();
        console.log('✅ Checked "No Preference"');
      } else {
        noPreferenceField.uncheck();
        console.log('✅ Unchecked "No Preference"');
      }

      // Weekdays - Handle both array and individual field approaches
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      days.forEach(day => {
        const field = form.getCheckBox(day);
        
        // Check if day is selected (multiple approaches)
        const isSelected = 
          (formData.weekdays && formData.weekdays.includes(day)) || // Array approach
          formData[day] === true; // Individual field approach
        
        if (isSelected) {
          field.check();
          console.log(`✅ Checked "${day}"`);
        } else {
          field.uncheck();
          console.log(`✅ Unchecked "${day}"`);
        }
      });

      // ===== WORK TYPE - RADIO BUTTONS =====
      const fullTimeField = form.getCheckBox("Full Time Only");
      const partTimeField = form.getCheckBox("Part Time Only");
      const fullOrPartField = form.getCheckBox("Full or Part Time");

      // Uncheck all first
      fullTimeField.uncheck();
      partTimeField.uncheck();
      fullOrPartField.uncheck();

      // Check selected one
      if (formData["Full Time Only"] === true) {
        fullTimeField.check();
        console.log('✅ Checked "Full Time Only"');
      } else if (formData["Part Time Only"] === true) {
        partTimeField.check();
        console.log('✅ Checked "Part Time Only"');
      } else if (formData["Full or Part Time"] === true) {
        fullOrPartField.check();
        console.log('✅ Checked "Full or Part Time"');
      }

      // ===== YES/NO PAIRS =====
      // Nights
      const nightsYesField = form.getCheckBox("Nights Yes");
      const nightsNoField = form.getCheckBox("Nights No");
      if (formData["Nights Yes"] === true) {
        nightsYesField.check();
        nightsNoField.uncheck();
        console.log('✅ Checked "Nights Yes"');
      } else {
        nightsYesField.uncheck();
        nightsNoField.check();
        console.log('✅ Checked "Nights No"');
      }

      // Work US
      const workUsYesField = form.getCheckBox("Work US Yes");
      const workUsNoField = form.getCheckBox("Work US No");
      if (formData["Work US Yes"] === true) {
        workUsYesField.check();
        workUsNoField.uncheck();
        console.log('✅ Checked "Work US Yes"');
      } else {
        workUsYesField.uncheck();
        workUsNoField.check();
        console.log('✅ Checked "Work US No"');
      }

      // Test
      const testYesField = form.getCheckBox("Test Yes");
      const testNoField = form.getCheckBox("Test No");
      if (formData["Test Yes"] === true) {
        testYesField.check();
        testNoField.uncheck();
        console.log('✅ Checked "Test Yes"');
      } else {
        testYesField.uncheck();
        testNoField.check();
        console.log('✅ Checked "Test No"');
      }

      // Accommodation
      const accommodationYesField = form.getCheckBox("Accommodation Yes");
      const accommodationNoField = form.getCheckBox("Accommodation No");
      if (formData["Accommodation Yes"] === true) {
        accommodationYesField.check();
        accommodationNoField.uncheck();
        console.log('✅ Checked "Accommodation Yes"');
      } else {
        accommodationYesField.uncheck();
        accommodationNoField.check();
        console.log('✅ Checked "Accommodation No"');
      }

      // ===== ACCOMMODATION DETAILS =====
      form.getTextField("reasonable accommodation If no describe what accommodations you would need 1")
        .setText(formData["reasonable accommodation If no describe what accommodations you would need 1"] || "");

      // ===== SIGNATURE SECTION =====
      form.getTextField("Date_2").setText(formData["Date_2"] || "");
      form.getTextField("Date_3").setText(formData["Date_3"] || "");
      
      // Signature fields
      const signatureFields = ["Signature1_es_:signer:signature", "Signature2_es_:signer:signature"];
      signatureFields.forEach(fieldName => {
        try {
          const field = form.getTextField(fieldName);
          if (field) {
            field.setText(formData[fieldName] || "");
            console.log(`✅ Set signature field "${fieldName}"`);
          }
        } catch (error) {
          console.log(`Could not set signature field ${fieldName}`);
        }
      });

      // ===== FLATTEN AND SAVE =====
      form.flatten();
      const filledPdfBytes = await pdfDoc.save();
      
      console.log('✅ Employment Application filled successfully');
      return filledPdfBytes;

    } catch (error) {
      console.error('❌ Error filling Employment Application:', error);
      throw error;
    }
  },

  // Form configuration for the modal
  formConfig: {
    fields: [
      // Personal Information
      { pdfFieldName: "Name", label: "Full Name", type: "text", required: true, placeholder: "Enter your full name" },
      { pdfFieldName: "Date", label: "Date", type: "date", required: true },
      { pdfFieldName: "Address", label: "Address", type: "text", required: true, placeholder: "Enter your street address" },
      { pdfFieldName: "City", label: "City", type: "text", required: true, placeholder: "Enter your city" },
      { pdfFieldName: "State", label: "State", type: "text", required: true, placeholder: "Enter your state" },
      { pdfFieldName: "Zip", label: "ZIP Code", type: "text", required: true, placeholder: "Enter your ZIP code" },
      { pdfFieldName: "Email Address", label: "Email Address", type: "email", required: true, placeholder: "Enter your email address" },
      { pdfFieldName: "Phone", label: "Phone Number", type: "tel", required: true, placeholder: "Enter your phone number" },

      // Position Information
      { pdfFieldName: "Position", label: "Position Applied For", type: "text", required: true, placeholder: "Enter the position you're applying for" },
      { pdfFieldName: "Location Preference", label: "Location Preference", type: "text", placeholder: "Preferred work location" },
      { pdfFieldName: "Salary Desired", label: "Desired Salary", type: "text", placeholder: "Enter desired salary" },
      { pdfFieldName: "How many hours can you work weekly", label: "Hours Available Per Week", type: "text", placeholder: "Enter available hours per week" },
      { pdfFieldName: "When would you be available to begin work", label: "Available Start Date", type: "text", placeholder: "Enter when you can start" },

      // Work Preferences - Days Available
      { pdfFieldName: "No Preference", label: "No Preference on Work Days", type: "checkbox" },
      { pdfFieldName: "Monday", label: "Available Monday", type: "checkbox" },
      { pdfFieldName: "Tuesday", label: "Available Tuesday", type: "checkbox" },
      { pdfFieldName: "Wednesday", label: "Available Wednesday", type: "checkbox" },
      { pdfFieldName: "Thursday", label: "Available Thursday", type: "checkbox" },
      { pdfFieldName: "Friday", label: "Available Friday", type: "checkbox" },
      { pdfFieldName: "Saturday", label: "Available Saturday", type: "checkbox" },
      { pdfFieldName: "Sunday", label: "Available Sunday", type: "checkbox" },

      // Work Type
      { pdfFieldName: "Full Time Only", label: "Full Time Only", type: "checkbox" },
      { pdfFieldName: "Part Time Only", label: "Part Time Only", type: "checkbox" },
      { pdfFieldName: "Full or Part Time", label: "Full or Part Time", type: "checkbox" },

      // Yes/No Questions
      { pdfFieldName: "Nights Yes", label: "Available to Work Nights", type: "checkbox" },
      { pdfFieldName: "Work US Yes", label: "Authorized to Work in US", type: "checkbox", required: true },
      { pdfFieldName: "Test Yes", label: "Willing to Take Pre-employment Test", type: "checkbox" },
      { pdfFieldName: "Accommodation Yes", label: "Need Accommodation", type: "checkbox" },

      // Accommodation Details
      { pdfFieldName: "reasonable accommodation If no describe what accommodations you would need 1", 
        label: "Accommodation Details", type: "textarea", placeholder: "Please describe any accommodations needed" },

      // Signature
      { pdfFieldName: "Date_2", label: "Application Date", type: "date", required: true },
      { pdfFieldName: "Signature1_es_:signer:signature", label: "Applicant Signature", type: "text", required: true, placeholder: "Type your full name as signature" }
    ]
  }
};

export default EmploymentApplicationFiller;