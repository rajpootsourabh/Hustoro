import { forwardRef } from "react";
import FormInput from "../FormInput";

const CredentialsSection = forwardRef(({ data, onChange, errors = {} }, ref) => {
    const handleInputChange = (field, value) => {
        onChange({ [field]: value });
    };

    return (
        <section id="Credentials" ref={ref} className="scroll-mt-32">
            <h2 className="text-xl mb-2">Credentials</h2>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">Set Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <FormInput
                            label="Password"
                            value={data.password || ""}
                            onChange={(val) => handleInputChange("password", val)}
                           
                        />
                    </div>
                </div>
            </div>
        </section>
    );
});

export default CredentialsSection;
