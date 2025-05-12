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

  // Location
  if (!data.location || data.location.trim() === "") {
    errors.location = "Location is required";
  }

  if (!data.designation || data.designation.trim() === "") {
    errors.designation = "Designation is required";
  }
  // Experience (Optional: can mark required if needed)
  if (!data.experience || data.experience.trim() === "") {
    errors.experience = "Work experience is required";
  }

  // CTC Fields (Optional: Add numeric check if you want stricter validation)
  if (data.currentCtc && isNaN(data.currentCtc)) {
    errors.currentCtc = "Current CTC must be a number";
  }

  if (data.expectedCtc && isNaN(data.expectedCtc)) {
    errors.expectedCtc = "Expected CTC must be a number";
  }

  return errors;
};
