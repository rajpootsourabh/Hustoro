import EmploymentApplicationForm from './EmploymentApplicationForm';
// Import other forms as you create them
// import OrientationAcknowledgementsForm from './OrientationAcknowledgementsForm';

export const pdfFormRegistry = {
  1: EmploymentApplicationForm,
  // 9: OrientationAcknowledgementsForm,
  // Add more as needed
};

export const getPdfForm = (documentId) => {
  return pdfFormRegistry[documentId] || null;
};

export const hasPdfForm = (documentId) => {
  return !!pdfFormRegistry[documentId];
};