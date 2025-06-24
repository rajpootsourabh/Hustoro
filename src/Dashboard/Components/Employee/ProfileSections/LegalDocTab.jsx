import React from 'react';
import { maskSensitiveData } from '../../../../utils/formatters';
import { formatDate } from '../../../../utils/dateUtils';

const Field = ({ label, value = '-' }) => (
  <div>
    <label className="text-sm text-gray-500">{label}</label>
    <div className="text-sm bg-gray-100 p-2 rounded">{value}</div>
  </div>
);

const FileField = ({ label, url }) => (
  <div>
    <label className="text-sm text-gray-500">{label}</label>
    <div className="text-sm bg-gray-100 p-2 rounded">
      {url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          View File
        </a>
      ) : (
        '-'
      )}
    </div>
  </div>
);

const LegalDocTab = ({ legalDocument = {} }) => {
  return (
    <div className="p-6 text-sm space-y-8">
      {/* Social Security Number */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Social Security Number</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Number" value={maskSensitiveData(legalDocument.social_security_number)} />
          <Field label="Issue Date" value={formatDate(legalDocument.issue_date_s_s_n)} />
          <FileField label="File" url={legalDocument.ssn_file} />
        </div>
      </div>

      {/* National Identification Number */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">National Identification Number</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Number" value={maskSensitiveData(legalDocument.national_id)} />
          <Field label="Issue Date" value={formatDate(legalDocument.issue_date_national_id)} />
          <FileField label="File" url={legalDocument.national_id_file} />
        </div>
      </div>

      {/* Social Insurance Number */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Social Insurance Number</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Number" value={maskSensitiveData(legalDocument.social_insurance_number)} />
          <Field label="Issue Date" value="-" />
          <Field label="Insurance Career" value="-" />
          {/* <FileField label="File" url="-" /> */}
        </div>
      </div>

      {/* Tax Identification Number */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Tax Identification Number</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Number" value={maskSensitiveData(legalDocument.tax_id)} />
          <Field label="Issue Date" value={formatDate(legalDocument.issue_date_tax_id)} />
          <FileField label="File" url={legalDocument.tax_id_file} />
        </div>
      </div>

      {/* Citizenship */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Citizenship</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Nationality" value={legalDocument.nationality || '-'} />
          <Field label="Citizenship" value={legalDocument.citizenship || '-'} />
        </div>
      </div>

      {/* Passport Details */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Passport Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Country" value="-" />
          <Field label="Number" value={maskSensitiveData(legalDocument.passport)} />
          <Field label="Issue Date" value="-" />
          <Field label="Expiry Date" value="-" />
          {/* <FileField label="File" url="-" /> */}
        </div>
      </div>

      {/* Work Visa Details */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Work Visa Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Country" value="-" />
          <Field label="Type" value={legalDocument.work_visa || '-'} />
          <Field label="Number" value={maskSensitiveData(legalDocument.visa_details)} />
          <Field label="Issue Date" value="-" />
          <Field label="Expiry Date" value="-" />
          {/* <FileField label="File" url="-" /> */}
        </div>
      </div>
    </div>
  );
};

export default LegalDocTab;
