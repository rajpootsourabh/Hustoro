import CustomSelect from "../Components/CustomSelect";

export default function FormSelect({ label, options = [], required = false, showSearch = false, ...props }) {
    return (
        <div>
            <CustomSelect 
                label={label} 
                optionsList={options} 
                required
                showSearch={showSearch} 
                {...props}
            />
        </div>
    );
}