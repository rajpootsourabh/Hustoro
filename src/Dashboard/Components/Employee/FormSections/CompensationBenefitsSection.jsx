import { forwardRef } from "react";
import FormInput from "../FormInput";

const CompensationBenefitsSection = forwardRef(({ data, onChange, errors = {} }, ref) => {
    const handleInputChange = (field, value) => {
        onChange({ [field]: value });
    };

    return (
        <section id="CompensationBenefits" ref={ref} className="scroll-mt-32">
            <h2 className="text-xl mb-2">Compensation & Benefits</h2>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">Salary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <FormInput
                            label="Salary Details"
                            value={data.salaryDetails || ""}
                            onChange={(val) => handleInputChange("salaryDetails", val)}
                           
                        />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg mb-4 text-gray-600">Bank Account</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Bank Name"
                        required
                        value={data.bankName || ""}
                        onChange={(val) => handleInputChange("bankName", val)}
                        error={errors.bankName}
                    />
                    <FormInput
                        label="IBAN"
                        required
                        value={data.iban || ""}
                        onChange={(val) => handleInputChange("iban", val)}
                        error={errors.iban}
                    />
                    <div className="md:col-span-2">
                        <FormInput
                            label="Account Number"
                            value={data.accountNumber || ""}
                            onChange={(val) => handleInputChange("accountNumber", val)}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
});

export default CompensationBenefitsSection;
