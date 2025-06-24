import React from 'react';
import { maskSensitiveData } from '../../../../utils/formatters';

const Field = ({ label, value = '-' }) => (
  <div>
    <label className="text-sm text-gray-500">{label}</label>
    <div className="text-sm bg-gray-100 p-2 rounded">{value}</div>
  </div>
);

const CompensationAndBenefitsTab = ({ compensationData }) => {
  const salary = compensationData?.salary_details || {};

  return (
    <div className="p-6 text-sm space-y-10">
      {/* Salary Details Section */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Salary Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Effective Date" value={salary?.effective_date ? new Date(salary.effective_date).toLocaleDateString() : '-'} />
          <Field label="Pay Type" value={salary?.pay_type || '**********'} />
          <Field label="Pay Rate" value={salary?.pay_rate || '**********'} />
          <Field label="Pay Schedule" value={salary?.pay_schedule || '**********'} />
          <Field label="Overtime Status" value={salary?.overtime_status || '**********'} />
          <Field label="Reason" value={salary?.reason || '**********'} />
          <div className="col-span-3">
            <Field label="Note" value={salary?.note || '**********'} />
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-300" />

      {/* Bank Account Section */}
      <div>
        <h3 className="font-medium text-gray-700 mb-4">Bank Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Bank Name" value={compensationData?.bank_name || '-'} />
          <Field label="IBAN" value={maskSensitiveData(compensationData?.iban)} />
          <Field label="Account Number" value={maskSensitiveData(compensationData?.account_number)} />
        </div>
      </div>
    </div>
  );
};

export default CompensationAndBenefitsTab;
