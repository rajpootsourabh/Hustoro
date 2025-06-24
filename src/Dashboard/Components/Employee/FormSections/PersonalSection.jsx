import { forwardRef } from "react";
import ProfileImageUpload from "../ProfileImageUpload";
import FormInput from "../FormInput";
import FormDateInput from "../FormDateInput";
import CustomSelect from "../../CustomSelect";
import countryList from '../../../../utils/countryList';

const PersonalSection = forwardRef(({ profileImage, handleImageUpload, data, onChange, errors}, ref) => {
    const handleInputChange = (field, value) => {
        onChange({ [field]: value });
    };

    // ✅ Updated handler to sync both preview and form state
    const handleImageChange = (file) => {
        handleImageUpload(file);                  // for preview
        handleInputChange("profileImage", file);  // store in data.profileImage
    };

    return (
        <section id="Personal" ref={ref} className="scroll-mt-32">
            <h2 className="text-xl mb-2">Personal</h2>
            <p className="text-gray-500 text-sm">2/3 mandatory fields</p>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">Basic</h3>
                <ProfileImageUpload
                    profileImage={profileImage}
                    handleImageUpload={handleImageChange} // ⬅ use the new combined handler
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="First name" value={data.firstName || ""} required onChange={(val) => handleInputChange("firstName", val)} error={errors.firstName}  />
                    <FormInput label="Middle name" value={data.middleName || ""} onChange={(val) => handleInputChange("middleName", val)} />
                    <FormInput label="Last name" value={data.lastName || ""} required onChange={(val) => handleInputChange("lastName", val)} error={errors.lastName} />
                    <FormInput label="Preferred name" value={data.preferredName || ""} onChange={(val) => handleInputChange("preferredName", val)} />
                    <CustomSelect
                        label="Country"
                        optionsList={countryList}
                        value={data.country || ""}
                        onChange={(val) => handleInputChange("country", val)}
                        showSearch
                    />
                    <FormInput label="Address" value={data.address || ""} onChange={(val) => handleInputChange("address", val)}/>
                    <CustomSelect
                        label="Gender"
                        optionsList={["Male", "Female", "Others"]}
                        value={data.gender || ""}
                        onChange={(val) => handleInputChange("gender", val)}
                    />
                    <FormDateInput label="Birthdate" value={data.birthdate || ""} onChange={(val) => handleInputChange("birthdate", val)} error={errors.birthdate} />
                    <CustomSelect
                        label="Marital Status"
                        optionsList={["Single", "Married", "Common Law", "Domestic Partnership"]}
                        value={data.maritalStatus || ""}
                        onChange={(val) => handleInputChange("maritalStatus", val)}
                        error={errors.maritalStatus}
                        required
                    />
                </div>
            </div>

            <div>
                <h3 className="text-lg mb-4 text-gray-600">Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Phone Number" type="tel" value={data.phone || ""} onChange={(val) => handleInputChange("phone", val)} error={errors.phone}/>
                    <FormInput label="Work Email" type="email" required value={data.workEmail || ""} onChange={(val) => handleInputChange("workEmail", val)} error={errors.workEmail}/>
                    <FormInput label="Personal Email" type="email" value={data.personalEmail || ""} onChange={(val) => handleInputChange("personalEmail", val)} error={errors.personalEmail} />
                </div>
            </div>
        </section>
    );
});

export default PersonalSection;
