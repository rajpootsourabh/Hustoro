export default function FormInput({
    label,
    required = false,
    type = "text",
    value = "",
    onChange,
    error,
    ...rest
}) {
    return (
        <div>
            <label className="block text-sm mb-1">
                {required && <span className="text-red-500">*</span>} {label}
            </label>
            <input 
                type={type}
                value={typeof value === "string" ? value : String(value)} // Ensure string
                onChange={(e) => onChange?.(e.target.value)} // Ensure string passed back
                className={`border rounded w-full p-2 text-sm transition-colors duration-200 ${
                    error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                {...rest}
            />
            {error && typeof error === "string" && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
            )}
        </div>
    );
}
