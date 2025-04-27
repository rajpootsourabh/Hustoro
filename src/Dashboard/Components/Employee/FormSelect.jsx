import CustomSelect from "../CustomSelect";

export default function FormSelect({ label, options = [], required = false, showSearch = false, ...props }) {
    return (
        <div>
            <CustomSelect 
                label={label} 
                optionsList={options} 
                showSearch={showSearch} 
                {...props}
            />
        </div>
    );
}