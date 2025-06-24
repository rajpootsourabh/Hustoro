import React from 'react';

const PersonalTab = ({ employee }) => {
  const formatValue = (value) =>
    value === null || value === undefined || value === '' ? '-' : value;

  const Field = ({ label, value }) => (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <div className="text-sm bg-gray-100 p-2 rounded">{formatValue(value)}</div>
    </div>
  );

  return (
    <div className="p-6 text-sm space-y-8">
      {/* Basic Section */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Basic</h3>
        <div className="grid grid-cols-3 gap-4">
          {/* Name */}
          <Field label="First Name" value={employee?.first_name} />
          <Field label="Middle Name" value={employee?.middle_name} />
          <Field label="Last Name" value={employee?.last_name} />
          <Field label="Preferred Name" value={employee?.preferred_name} />

          {/* ID & Status */}
          <Field label="Employee ID" value={employee?.id} />
          <Field label="Status" value="Active" />

          {/* Location */}
          <Field label="Country" value={employee?.country} />
          <Field label="Address" value={employee?.address} />

          {/* Demographics */}
          <Field label="Gender" value={employee?.gender} />
          <Field
            label="Birthday"
            value={
              employee?.birthdate
                ? new Date(employee.birthdate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })
                : '-'
            }
          />
        </div>
      </div>

      {/* Marital Status */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Marital Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Status" value={employee?.marital_status} />
          <Field label="Certificate" value="-" />
        </div>
      </div>

      {/* Contact */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Contact</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Phone" value={employee?.phone} />
          <Field label="Extension" value="-" />
        </div>
      </div>
    </div>
  );
};

export default PersonalTab;
