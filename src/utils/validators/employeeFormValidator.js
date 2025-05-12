export const validatePersonalInfo = (personal) => {
  const errors = {};

  if (!personal.firstName) {
    errors.firstName = "First name is required";
  }

  if (!personal.lastName) {
    errors.lastName = "Last name is required";
  }
  if (!personal.maritalStatus) {
    errors.maritalStatus = "Marital status is required";
  }
  if (!personal.workEmail || !/\S+@\S+\.\S+/.test(personal.workEmail)) {
    errors.workEmail = "Work email is required and must be a valid email";
  }
  

  // Optional Fields: Only validate if user entered something

  if (personal.birthdate) {
    const birthdate = new Date(personal.birthdate);
    const today = new Date();
    if (birthdate > today) {
      errors.birthdate = "Birthdate cannot be in the future";
    }
  }

  if (personal.phone) {
    if (!/^[0-9]+$/.test(personal.phone)) {
      errors.phone = "Phone number must contain only digits";
    } else if (personal.phone.length < 10) {
      errors.phone = "Phone number too short";
    } else if (personal.phone.length > 15) {
      errors.phone = "Phone number too long";
    }
  }

  if (personal.personalEmail) {
    if (!/^\S+@\S+\.\S+$/.test(personal.personalEmail)) {
      errors.personalEmail = "Invalid personal email format";
    }
  }

  return errors;
};

export const validateJobInfo = (job) => {
  const errors = {};

  if (!job.jobTitle) {
    errors.jobTitle = "Job title is required";
  }

  if (!job.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!job.manager) {
    errors.manager = "Manager is required";
  }


  if (!job.employmentType) {
    errors.employmentType = "Employment type is required";
  }

  if (job.hireDate) {
    const hireDate = new Date(job.hireDate);
    const today = new Date();
    if (hireDate > today) {
      errors.hireDate = "Hire date cannot be in the future";
    }
  }

  

  // if (job.expiryDate && new Date(job.expiryDate) < new Date(job.startDate)) {
  //   errors.expiryDate = 'Expiry date must be after start date';
  // }

  return errors;
};

export const validateCompensationBenefits = (compensationBenefits) => {
  const errors = {};

  if (!compensationBenefits.bankName) {
    errors.bankName = "Bank name is required";
  }

  if (!compensationBenefits.iban) {
    errors.iban = "IBAN is required";
  }

  return errors;
};

export const validateLegalDocuments = (legalDocuments) => {
  const errors = {};

  if (!legalDocuments.socialSecurityNumber) {
    errors.socialSecurityNumber = "SSN is required";
  }

  if (!legalDocuments.nationalId) {
    errors.nationalId = "National ID is required";
  }

  if (!legalDocuments.taxId) {
    errors.taxId = "Tax ID is required";
  }

  return errors;
};

export const validateExperience = (experience) => {
  const errors = {};

  // if (!experience.education) {
  //   errors.education = 'Education details are required';
  // }

  return errors;
};

export const validateEmergencyContact = (emergency) => {
  const errors = {};

  // if (emergency.contactPhone && !/^[0-9]+$/.test(emergency.contactPhone)) {
  //   errors.contactPhone = 'Must be a valid phone number';
  // }

  // if (emergency.contactPhone && emergency.contactPhone.length < 10) {
  //   errors.contactPhone = 'Phone number too short';
  // }

  // if (emergency.contactPhone && emergency.contactPhone.length > 15) {
  //   errors.contactPhone = 'Phone number too long';
  // }

  return errors;
};



// Utility functions

export function appendFormData(formData, data, parentKey = '') {
  for (const key in data) {
      const value = data[key];
      const fullKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof File || value instanceof Blob) {
          formData.append(fullKey, value);
      } else if (typeof value === 'object' && value !== null) {
          appendFormData(formData, value, fullKey); // recurse for nested object
      } else {
          formData.append(fullKey, value ?? ''); // treat null/undefined as empty string
      }
  }
}








/**
 * Cleans nested objects by removing empty/null/undefined values.
 */
// export function cleanNestedData(obj) {
//   if (Array.isArray(obj)) {
//     return obj.map(cleanNestedData).filter(item => item !== undefined && item !== null);
//   }

//   if (obj !== null && typeof obj === 'object') {
//     const cleanedObj = {};

//     for (const key in obj) {
//       let value = obj[key];

//       if (value === 'null') value = null;

//       const isFileUrl = typeof value === 'string' && value.startsWith('http');

//       if (value !== null && typeof value === 'object' && !isFileUrl) {
//         const cleanedValue = cleanNestedData(value);
//         if (
//           (Array.isArray(cleanedValue) && cleanedValue.length > 0) ||
//           (Object.keys(cleanedValue).length > 0)
//         ) {
//           cleanedObj[key] = cleanedValue;
//         }
//       } else if (
//         value !== null &&
//         value !== undefined &&
//         value !== '' &&
//         (isFileUrl || typeof value !== 'string' || value.trim() !== '')
//       ) {
//         cleanedObj[key] = value;
//       }
//     }

//     return cleanedObj;
//   }

//   return obj;
// }

// /**
//  * Appends nested data to FormData in key[subkey] format.
//  */
// export function appendFormData(formData, data, parentKey = '') {
//   for (const key in data) {
//     const value = data[key];
//     const formKey = parentKey ? `${parentKey}[${key}]` : key;

//     if (value instanceof File || value instanceof Blob) {
//       formData.append(formKey, value);
//     } else if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
//       appendFormData(formData, value, formKey);
//     } else {
//       formData.append(formKey, value);
//     }
//   }
// }

