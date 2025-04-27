import { forwardRef } from "react";
import FormInput from "./FormInput";

const EmergencySection = forwardRef((props, ref) => {
    return (
        <section id="Emergency" ref={ref}>
            <h2 className="text-xl mb-4">Emergency Contact</h2>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Contact Name" />
                    <FormInput label="Phone Number" type="tel" />
                </div>
            </div>
        </section>
    );
});

export default EmergencySection;