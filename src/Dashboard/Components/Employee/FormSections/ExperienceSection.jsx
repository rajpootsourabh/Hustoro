import { forwardRef } from "react";
import FormInput from "../FormInput";
import FileUpload from "../FileUpload";

const ExperienceSection = forwardRef(({ data = {}, onChange, errors = {} }, ref) => {
    const handleChange = (field, value) => {
        onChange({ [field]: value });
    };

    const handleFileChange = (file) => {
        onChange({ resume: file });
    };

    return (
        <section id="Experience" ref={ref} className="scroll-mt-32">
            <h2 className="text-xl mb-4">Experience</h2>

            <div className="mb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-lg mb-4 text-gray-600">Education</h3>
                        <FormInput
                            label="Education Details"
                            value={data.education || ""}
                            onChange={(val) => handleChange("education", val)}
                        />
                    </div>
                    <div>
                        <h3 className="text-lg mb-4 text-gray-600">Work Experience</h3>
                        <FormInput
                            label="Job Details"
                            value={data.job || ""}
                            onChange={(val) => handleChange("job", val)}
                        />
                    </div>

                    <div>
                        <h3 className="text-lg mb-4 text-gray-600">Skills</h3>
                        <FormInput
                            label="Skill"
                            value={data.skill || ""}
                            onChange={(val) => handleChange("skill", val)}
                        />
                    </div>

                    <div>
                        <h3 className="text-lg mb-4 text-gray-600">Languages</h3>
                        <FormInput
                            label="Language"
                            value={data.language || ""}
                            onChange={(val) => handleChange("language", val)}
                        />
                    </div>
                </div>
            </div>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">Resume</h3>
                <FileUpload
                    label="Upload Resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}  // Handle file upload state
                />
            </div>
        </section>
    );
});

export default ExperienceSection;
