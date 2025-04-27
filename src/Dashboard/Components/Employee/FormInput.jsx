export default function FormInput({ label, required = false, type = "text", ...props }) {
    return (
        <div>
            <label className="block text-sm mb-1">
                {required && <span className="text-red-500">*</span>} {label}
            </label>
            <input 
                type={type} 
                className="border rounded w-full p-2 text-sm" 
                {...props}
            />
        </div>
    );
}