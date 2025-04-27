import { forwardRef } from "react";
import ProfileImageUpload from "./ProfileImageUpload";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import FormDateInput from "./FormDateInput";

const PersonalSection = forwardRef(({ profileImage, handleImageUpload }, ref) => {
    return (
        <section id="Personal" ref={ref} className="mt-2">
            <h2 className="text-xl mb-2">Personal</h2>
            <p className="text-gray-500 text-sm">2/3 mandatory fields</p>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">Basic</h3>
                <ProfileImageUpload 
                    profileImage={profileImage} 
                    handleImageUpload={handleImageUpload}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="First name" required />
                    <FormInput label="Middle name" />
                    <FormInput label="Last name" required />
                    <FormInput label="Preferred name" />
                    <FormSelect 
                        label="Country" 
                        options={["India", "USA", "Canada"]} 
                        showSearch={true} 
                    />
                    <FormInput label="Address" />
                    <FormSelect 
                        label="Gender" 
                        options={["Male", "Female", "Others"]} 
                    />
                    <FormDateInput label="Birthdate" />
                    <FormSelect 
                        label="Marital Status" 
                        options={["Single", "Married", "Common Law", "Domestic Partnership"]} 
                    />
                </div>
            </div>

            <div>
                <h3 className="text-lg mb-4 text-gray-600">Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Phone Number" type="tel" />
                    <FormInput label="Work Email" type="email" />
                    <FormInput label="Personal Email" type="email" />
                    <FormSelect label="Chat & video call" options={["Select"]} />
                    <FormInput label="Social media" />
                </div>
            </div>
        </section>
    );
});

export default PersonalSection;