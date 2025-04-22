import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const CustomDropdown = ({ options, label, formik, name }) => {
  return (
    <Autocomplete
      freeSolo
      options={options}
      value={formik.values[name]}
      onChange={(event, newValue) => {
        formik.setFieldValue(name, newValue); // Update Formik state
      }}
      onBlur={() => formik.setFieldTouched(name, true)} // Mark field as touched
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          style={{fontFamily: "Poppins"}}
          variant="outlined"
          error={formik.touched[name] && Boolean(formik.errors[name])}
          helperText={formik.touched[name] && formik.errors[name]}
        />
      )}
    />
  );
};

export default CustomDropdown;

