import { forwardRef } from "react";
import FormInput from "../FormInput";
import FormDateInput from "../FormDateInput";
import FileUpload from "../FileUpload";
import FormSelect from "../FormSelect";

const LegalDocumentsSection = forwardRef(({ data, onChange, errors = {} }, ref) => {
    const handleChange = (field, value) => {
        onChange({ [field]: value });
    };

    return (
        <section id="LegalDocuments" ref={ref} className="scroll-mt-32">
            <h2 className="text-xl mb-4">Legal Documents</h2>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">ID Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Social Security Number"
                        required
                        value={data.socialSecurityNumber || ""}
                        onChange={(val) => handleChange("socialSecurityNumber", val)}
                        error={errors.socialSecurityNumber}
                    />
                    <FormDateInput
                        label="Issue Date (SSN)"
                        value={data.issueDateSSN || ""}
                        onChange={(val) => handleChange("issueDateSSN", val)}
                    />
                    <div className="md:col-span-2">
                        <FileUpload
                            label="File"
                            description="or drag and drop here"
                            accept=".pdf,.jpg,.png"
                            value={data.ssnFile}
                            onChange={(file) => handleChange("ssnFile", file)}
                        />
                    </div>

                    <FormInput
                        label="National Identification Number"
                        required
                        value={data.nationalId || ""}
                        onChange={(val) => handleChange("nationalId", val)}
                        error={errors.nationalId}
                    />
                    <FormDateInput
                        label="Issue Date (National ID)"
                        value={data.issueDateNationalId || ""}
                        onChange={(val) => handleChange("issueDateNationalId", val)}

                    />
                    <div className="md:col-span-2">
                        <FileUpload
                            label="File"
                            description="or drag and drop here"
                            accept=".pdf,.jpg,.png"
                            value={data.nationalIdFile}
                            onChange={(file) => handleChange("nationalIdFile", file)}
                        />
                    </div>

                    <FormInput
                        label="Social Insurance Number"
                        value={data.socialInsuranceNumber || ""}
                        onChange={(val) => handleChange("socialInsuranceNumber", val)}
                    />
                    <FormInput
                        label="Tax Identification Number"
                        required
                        value={data.taxId || ""}
                        onChange={(val) => handleChange("taxId", val)}
                        error={errors.taxId}
                    />
                    <FormDateInput
                        label="Issue Date (Tax ID)"
                        value={data.issueDateTaxId || ""}
                        onChange={(val) => handleChange("issueDateTaxId", val)}
                    />
                    <div className="md:col-span-2">
                        <FileUpload
                            label="File"
                            accept=".pdf,.jpg,.png"
                            value={data.taxIdFile}
                            onChange={(file) => handleChange("taxIdFile", file)}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <h3 className="text-lg mb-4 text-gray-600">Citizenship & Passport</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormSelect
                        label="Nationality"
                        options={["India", "USA", "Canada"]}
                        showSearch={true}
                        value={data.nationality || ""}
                        onChange={(val) => handleChange("nationality", val)}
                    />
                    <FormSelect
                        label="Citizenship"
                        options={["India", "USA", "Canada"]}
                        showSearch={true}
                        value={data.citizenship || ""}
                        onChange={(val) => handleChange("citizenship", val)}
                    />
                    <FormInput
                        label="Passport Details"
                        value={data.passport || ""}
                        onChange={(val) => handleChange("passport", val)}
                    />
                    <FormInput
                        label="Work Visa"
                        value={data.workVisa || ""}
                        onChange={(val) => handleChange("workVisa", val)}
                    />
                    <FormInput
                        label="Visa Details"
                        value={data.visaDetails || ""}
                        onChange={(val) => handleChange("visaDetails", val)}
                    />
                </div>
            </div>
        </section>
    );
});

export default LegalDocumentsSection;
