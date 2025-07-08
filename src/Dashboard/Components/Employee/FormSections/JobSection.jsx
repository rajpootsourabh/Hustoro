import { forwardRef, useEffect, useState } from "react";
import FormInput from "../FormInput";
import FormDateInput from "../FormDateInput";
import MultiLevelSelect from "../../MultiLevelSelect";
import CustomSelect from "../../CustomSelect";
import { entityOptionsData, departmentOptionsData } from "../../../../utils/selectOptionsData";

const JobSection = forwardRef(({ data, onChange, errors }, ref) => {
    const [employeeOptions, setEmployeeOptions] = useState([]);
    const handleChange = (field, value) => {
        onChange({ [field]: value });
    };

    useEffect(() => {
        const fetchEmployeeOptions = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/employee/options`, {
                    headers: {
                        "Authorization": "Bearer " + localStorage.getItem("access_token"),
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    const employees = result?.data || [];

                    // Map to array of { value, label } for select component
                    const options = employees.map((emp) => ({
                        value: emp.id,
                        label: emp.name,
                    }));

                    setEmployeeOptions(options);
                } else {
                    console.log("Failed to fetch employee options");
                }
            } catch (error) {
                console.error("Error fetching employee options:", error);
            }
        };

        fetchEmployeeOptions();
    }, []);



    return (
        <section id="Job" ref={ref} className="scroll-mt-32">
            <h2 className="text-xl mb-2">Job</h2>
            <p className="text-gray-500 text-sm mb-6">0/3 mandatory fields</p>

            <div className="mb-10">
                <h3 className="text-lg mb-4 text-gray-600">Basic</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput
                        label="Job Title"
                        required
                        value={data.jobTitle || ""}
                        onChange={(val) => handleChange("jobTitle", val)}
                        error={errors.jobTitle}
                    />
                    <FormDateInput
                        label="Hire Date"
                        value={data.hireDate || ""}
                        onChange={(val) => handleChange("hireDate", val)}
                        error={errors.hireDate}
                    />
                    <FormDateInput
                        label="Start Date"
                        required
                        value={data.startDate || ""}
                        onChange={(val) => handleChange("startDate", val)}
                        error={errors?.startDate}
                    />
                    <MultiLevelSelect
                        label="Entity"
                        optionsList={entityOptionsData}
                        showSearch
                        required={false}
                        error={""}
                        value={data.entity || ""}
                        onChange={(val) => handleChange("entity", val)}
                    />
                    <MultiLevelSelect
                        label="Department"
                        optionsList={departmentOptionsData}
                        showSearch
                        error={""}
                        value={data.department || ""}
                        onChange={(val) => handleChange("department", val)}
                    />
                    {/* <MultiLevelSelect
                        label="Division"
                        error={""}
                        value={data.division || ""}
                        onChange={(val) => handleChange("division", val)}
                    /> */}

                    <CustomSelect
                        label="Manager"
                        optionsList={employeeOptions}
                        value={data.managerId || ""}
                        onChange={(val) => handleChange("managerId", val)}
                        error={errors.manager}
                    />

                    {/* <FormInput
                        label="Manager"
                        value={data.manager || ""}
                        onChange={(val) => handleChange("manager", val)}
                        required
                        error={errors.manager}
                    /> */}
                </div>
            </div>

            <div>
                <h3 className="text-lg mb-4 text-gray-600">Employment</h3>
                <p className="text-black text-sm mb-6">
                    <span className="text-red-500">*</span> Contract details
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormDateInput
                        label="Effective Date"
                        required
                        value={data.effectiveDate || ""}
                        onChange={(val) => handleChange("effectiveDate", val)}
                        error={errors.effectiveDate}
                    />
                    <CustomSelect
                        label="Employment Type"
                        optionsList={["Contractor", "Full-Time", "Part-Time"]}
                        required
                        value={data.employmentType || ""}
                        onChange={(val) => handleChange("employmentType", val)}
                        error={errors?.employmentType}
                    />
                    <CustomSelect
                        label="Workplace"
                        optionsList={["Onsite", "Remote", "Hybrid"]}
                        value={data.workplace || ""}
                        onChange={(val) => handleChange("workplace", val)}
                    />
                    <FormDateInput
                        label="Expiry Date"
                        value={data.expiryDate || ""}
                        onChange={(val) => handleChange("expiryDate", val)}
                    />
                    <FormInput
                        label="Note"
                        as="textarea"
                        rows="3"
                        value={data.note || ""}
                        onChange={(val) => handleChange("note", val)}
                    />
                    <FormInput
                        label="Work Schedule"
                        value={data.workSchedule || ""}
                        onChange={(val) => handleChange("workSchedule", val)}
                    />
                </div>
            </div>
        </section>
    );
});

export default JobSection;
