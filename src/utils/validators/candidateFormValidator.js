export const validateCandidateForm = (data) => {
  const errors = {};

  // First Name
  if (!data.firstName || data.firstName.trim() === "") {
    errors.firstName = "First name is required";
  }

  // Last Name
  if (!data.lastName || data.lastName.trim() === "") {
    errors.lastName = "Last name is required";
  }

  // Phone
  if (!data.phone || !/^\d{10}$/.test(data.phone)) {
    errors.phone = "Valid 10-digit phone number is required";
  }

  // Email
  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(data.email)) {
    errors.email = "Invalid email address";
  }

  // Location
  if (!data.location || data.location.trim() === "") {
    errors.location = "Location is required";
  }

  // Country
  if (!data.country || data.country.trim() === "") {
    errors.country = "Country is required";
  }

  // Designation
  if (!data.designation || data.designation.trim() === "") {
    errors.designation = "Designation is required";
  }

   // Education
  if (!data.education || data.education.trim() === "") {
    errors.education = "Education is required";
  }

  // Experience
  if (!data.experience || data.experience.trim() === "") {
    errors.experience = "Work experience is required";
  }

  // Current CTC (optional but must be numeric if provided)
  if (data.currentCtc !== "" && isNaN(data.currentCtc)) {
    errors.currentCtc = "Current CTC must be a number";
  }

  // Expected CTC (optional but must be numeric if provided)
  if (data.expectedCtc !== "" && isNaN(data.expectedCtc)) {
    errors.expectedCtc = "Expected CTC must be a number";
  }

  return errors;
};
