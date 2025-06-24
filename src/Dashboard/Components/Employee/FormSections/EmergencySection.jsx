import { forwardRef } from "react";
import FormInput from "../FormInput";

const EmergencySection = forwardRef(({ data, onChange, errors }, ref) => {
    const handleInputChange = (field, value) => {
        onChange({ [field]: value });
    };

    return (
        <section id="Emergency" ref={ref} className="scroll-mt-32">
            <h2 className="text-xl mb-4">Emergency</h2>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Contact Name"
                        value={data.contactName || ""}
                        onChange={(val) => handleInputChange("contactName", val)}
                    />
                    <FormInput
                        label="Phone Number"
                        type="tel"
                        value={data.contactPhone || ""}
                        onChange={(val) => handleInputChange("contactPhone", val)}
                    />
                </div>
            </div>
        </section>
    );
});

export default EmergencySection;
