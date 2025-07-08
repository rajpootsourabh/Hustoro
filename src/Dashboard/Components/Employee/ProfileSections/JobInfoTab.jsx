import React from 'react';

const JobInfoTab = ({ job }) => {
  const formatValue = (value) =>
    value === null || value === undefined || value === '' || value === 'NA'
      ? '-'
      : value;

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return isNaN(date) ? '-' : date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const Field = ({ label, value }) => (
    <div>
      <label className="text-sm text-gray-500">{label}</label>
      <div className="text-sm bg-gray-100 p-2 rounded">{value}</div>
    </div>
  );

  return (
    <div className="p-6 text-sm space-y-8">
      {/* Basic Section */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Basic</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Job Title" value={formatValue(job?.job_title)} />
          <Field label="Hire Date" value={formatDate(job?.hire_date)} />
          <Field label="Start Date" value={formatDate(job?.start_date)} />
          <Field label="Department" value={formatValue(job?.department)} />
          <Field label="Manager" value={formatValue(job?.manager?.name)} />
        </div>
      </div>

      {/* Employment Section */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Employment</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Effective Date" value={formatDate(job?.effective_date)} />
          <Field label="Employment Type" value={formatValue(job?.employment_type)} />
          <Field label="Workspace" value={formatValue(job?.workplace)} />
          <Field label="Expiry Date" value={formatDate(job?.expiry_date)} />
          <Field label="Note" value={formatValue(job?.note)} />
          <Field label="Work Schedule" value={formatValue(job?.work_schedule)} />
        </div>
      </div>
    </div>
  );
};

export default JobInfoTab;
