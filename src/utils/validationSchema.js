import * as yup from 'yup';

export const employeeValidationSchema = yup.object().shape({
  personal: yup.object().shape({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    workEmail: yup.string().email('Invalid email format').required('Work email is required'),
    birthdate: yup.date()
      .max(new Date(), 'Birthdate cannot be in the future'),

    phone: yup.string()
      .matches(/^[0-9]+$/, 'Must be a valid phone number')
      .min(10, 'Phone number too short')
      .max(15, 'Phone number too long'),
    personalEmail: yup.string().email('Invalid email format')
  }),

  job: yup.object().shape({
    jobTitle: yup.string().required('Job title is required'),
    startDate: yup.date().required('Start date is required'),
    employmentType: yup.string().required('Employment type is required'),
    hireDate: yup.date().max(new Date(), 'Hire date cannot be in the future'),
    effectiveDate: yup.date().required('Effective date is required'),
    expiryDate: yup.date()
      .min(yup.ref('startDate'), 'Expiry date must be after start date')
      .when('startDate', (startDate, schema) => {
        return startDate ? schema.min(startDate, 'Expiry date must be after start date') : schema;
      })
  }),

  compensationBenefits: yup.object().shape({
    bankName: yup.string().required('Bank name is required'),
    iban: yup.string()
      .required('IBAN is required')
      .matches(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/, 'Invalid IBAN format')
  }),

  legalDocuments: yup.object().shape({
    socialSecurityNumber: yup.string().required('SSN is required'),
    nationalId: yup.string().required('National ID is required'),
    taxId: yup.string().required('Tax ID is required'),
  }),

  experience: yup.object().shape({
    education: yup.string().required('Education details are required'),
    // job: yup.string().required('Job experience is required')
  }),

  emergency: yup.object().shape({
    contactPhone: yup.string()
      .matches(/^[0-9]+$/, 'Must be a valid phone number')
      .min(10, 'Phone number too short')
      .max(15, 'Phone number too long')
  })
})



// // utils/validationSchema.js
// import * as yup from 'yup';

// export const employeeValidationSchema = yup.object().shape({
//   personal: yup.object().shape({
//     firstName: yup.string().required('First name is required'),
//     lastName: yup.string().required('Last name is required'),
//     workEmail: yup.string().email('Invalid email format').required('Work email is required'),
//     maritalStatus: yup.string().required('Marital status is required'),
//     // Add other personal field validations
//   }),
//   job: yup.object().shape({
//     jobTitle: yup.string().required('Job title is required'),
//     startDate: yup.date().required('Start date is required'),
//     employmentType: yup.string().required('Employment type is required'),
//     // Add other job field validations
//   }),
//   // Add validations for other sections
// });