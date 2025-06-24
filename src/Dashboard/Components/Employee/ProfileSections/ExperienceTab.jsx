import React from 'react';

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
          View Resume
        </a>
      ) : (
        '-'
      )}
    </div>
  </div>
);

const ExperienceTab = ({ experience = {} }) => {
  return (
    <div className="p-6 text-sm space-y-8">
      {/* Education Details */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Education Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Start Date" value="-" />
          <Field label="End Date" value="-" />
          <Field label="Degree" value={experience.education || '-'} />
          <Field label="Field of Study" value="-" />
          <Field label="School" value="-" />
        </div>
      </div>

      {/* Work Experience */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Work Experience: Job Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Start Date" value="-" />
          <Field label="End Date" value="-" />
          <Field label="Job Title" value={experience.job || '-'} />
          <Field label="Company" value="-" />
          <Field label="Summary" value="-" />
          <Field label="Present" value="-" />
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Skills</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Skill" value={experience.skill || '-'} />
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Languages</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Language" value={experience.language || '-'} />
        </div>
      </div>
    </div>
  );
};

export default ExperienceTab;
