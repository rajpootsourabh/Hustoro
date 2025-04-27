import { forwardRef } from "react";
import FormInput from "./FormInput";
import FormDateInput from "./FormDateInput";
import FileUpload from "./FileUpload";
import FormSelect from "./FormSelect";

const LegalDocumentsSection = forwardRef((props, ref) => {
    return (
        <section id="LegalDocuments" ref={ref} className="mt-12">
            <h2 className="text-xl mb-4">Legal Documents</h2>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">ID Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Social Security Number" required />
                    <FormDateInput label="Issue Date" required />
                    <div className="md:col-span-2">
                        <FileUpload
                            label="Upload SSN document"
                            description="or drag and drop here"
                            accept=".pdf,.jpg,.png"
                        />
                    </div>
                    <FormInput label="National Identification Number" required />
                    <FormDateInput label="Issue Date" required />
                    <div className="md:col-span-2">
                        <FileUpload
                            label="Upload national ID document"
                            description="or drag and drop here"
                            accept=".pdf,.jpg,.png"
                        />
                    </div>
                    <FormInput label="Social Insurance Number" />
                    <FormInput label="Tax Identification Number" required />
                    <FormDateInput label="Issue Date" />
                    <div className="md:col-span-2">
                        <FileUpload
                              label="Upload TIN document"
                            accept=".pdf,.jpg,.png"
                            onChange={(file) => {
                                if (file) {
                                    console.log('Selected file:', file.name);
                                } else {
                                    console.log('File removed');
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <h3 className="text-lg mb-4 text-gray-600">Citizenship & Passport</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Citizenship" />
                    <FormSelect
                        label="Nationality"
                        options={["India", "USA", "Canada"]}
                        showSearch={true}
                    />
                    <FormInput label="Passport Details" />
                    <FormInput label="Work Visa" />
                    <FormInput label="Visa Details" />
                </div>
            </div>
        </section>
    );
});

export default LegalDocumentsSection;