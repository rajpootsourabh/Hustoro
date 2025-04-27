import DateInput from "../DateInput";

export default function FormDateInput({ label, required = false, ...props }) {
    return (
        <div>
            <label className="block text-sm mb-1">
                {required && <span className="text-red-500">*</span>} {label}
            </label>
            <DateInput {...props} />
        </div>
    );
}