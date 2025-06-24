import React from 'react';

const Field = ({ label, value = '-' }) => (
  <div>
    <label className="text-sm text-gray-500">{label}</label>
    <div className="text-sm bg-gray-100 p-2 rounded">{value}</div>
  </div>
);

const EmergencyTab = ({ emergency = {} }) => {
  return (
    <div className="p-6 text-sm space-y-8">
      {/* Contact Details */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Contact Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Name" value={emergency?.contact_name || '-'} />
          <Field label="Relationship" value={emergency?.relationship || '-'} />
          <Field label="Phone" value={emergency?.contact_phone || '-'} />
          <Field label="Email" value={emergency?.email || '-'} />
          <Field label="Country" value={emergency?.country || '-'} />
          <Field label="Address" value={emergency?.address || '-'} />
        </div>
      </div>
    </div>
  );
};

export default EmergencyTab;
