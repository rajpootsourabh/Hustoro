import DateInput from "../DateInput";

export default function FormDateInput({ label, required = false, error, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <DateInput
        {...props}
        error={error}
      />
    </div>
  );
}
