import { forwardRef } from "react";
import FormInput from "./FormInput";
import FormDateInput from "./FormDateInput";
import FormSelect from "./FormSelect";

const JobSection = forwardRef((props, ref) => {
    return (
        <section id="Job" ref={ref} className="mt-12">
            <h2 className="text-xl mb-2">Job</h2>
            <p className="text-gray-500 text-sm mb-6">0/3 mandatory fields</p>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">Basic</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Job Title" required />
                    <FormDateInput label="Hire Date" required />
                    <FormDateInput label="Start Date" required />
                    <FormSelect 
                        label="Entity" 
                        options={["AU Entity", "UK Entity", "US Entity"]} 
                        showSearch={true} 
                    />
                    <FormInput label="Department" />
                    <FormInput label="Division" />
                    <FormInput label="Manager" />
                </div>
            </div>

            <div>
                <h3 className="text-lg mb-4 text-gray-600">Employment</h3>
                <div className="border rounded-lg p-6 bg-gray-50 mb-8">
                    <h4 className="mb-4">Contract details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormDateInput label="Effective Date" required />
                        <FormSelect 
                            label="Employment Type" 
                            options={["Contractor", "Full-Time", "Part-Time"]}
                        />
                        <FormSelect 
                            label="Workplace" 
                            options={["Onsite", "Remote", "Hybrid"]}
                        />
                        <FormDateInput label="Expiry Date" />
                        <div className="md:col-span-2">
                            <FormInput 
                                label="Note" 
                                as="textarea" 
                                rows="3" 
                                className="border rounded w-full p-2 text-sm"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <FormInput label="Work Schedule" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

export default JobSection;