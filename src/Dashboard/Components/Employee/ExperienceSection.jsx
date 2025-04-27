import { forwardRef } from "react";
import FormInput from "./FormInput";
import FileUpload from "./FileUpload";

const ExperienceSection = forwardRef((props, ref) => {
    return (
        <section id="Experience" ref={ref}>
            <h2 className="text-xl mb-4">Experience</h2>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Education Details" />
                </div>
            </div>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">Work Experience</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Job Details" />
                </div>
            </div>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Skill" />
                </div>
            </div>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">Languages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Language" />
                </div>
            </div>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">Resume</h3>
                <FileUpload 
                    label="Upload Resume" 
                    description="or drag and drop here" 
                    accept=".pdf,.doc,.docx"
                />
            </div>
        </section>
    );
});

export default ExperienceSection;