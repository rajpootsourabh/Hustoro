import EmploymentApplicationFiller from './EmploymentApplicationFiller';

// Registry of all PDF fillers
export const pdfFillerRegistry = {
  1: EmploymentApplicationFiller,
};

// Helper function to get filler for document
export const getPdfFiller = (documentId) => {
  const filler = pdfFillerRegistry[documentId];
  if (!filler) {
    console.warn(`No PDF filler found for document ID: ${documentId}`);
    return null;
  }
  return filler;
};

// Check if document has filler
export const hasPdfFiller = (documentId) => {
  return !!pdfFillerRegistry[documentId];
};

export default pdfFillerRegistry;