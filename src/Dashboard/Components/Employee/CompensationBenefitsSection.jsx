import { forwardRef } from "react";
import FormInput from "./FormInput";

const CompensationBenefitsSection = forwardRef((props, ref) => {
    return (
        <section id="CompensationBenefits" ref={ref} className="mt-12">
            <h2 className="text-xl mb-2">Compensation & Benefits</h2>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">Salary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <FormInput label="Salary Details" />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg mb-4 text-gray-600">Bank Account</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Bank Name" required />
                    <FormInput label="IBAN" required />
                    <div className="md:col-span-2">
                        <FormInput label="Account Number" />
                    </div>
                </div>
            </div>
        </section>
    );
});

export default CompensationBenefitsSection;