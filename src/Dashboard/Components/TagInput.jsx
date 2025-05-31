import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";

const TagInput = ({ formik, keywords_list }) => {
  const [tags, setTags] = useState([]);

  // Sync tags when formik.values.keywords changes (especially useful when editing)
  useEffect(() => {
    if (Array.isArray(formik.values.keywords)) {
      const uniqueKeywords = [...new Set(formik.values.keywords.map(k => k.trim()))];
      const formatted = uniqueKeywords.map((label) => ({
        label,
        color: "#00756A",
      }));
      setTags(formatted);
    }
  }, [formik.values.keywords]);

  const handleChange = (_, newValues) => {
    const existingLabels = tags.map((tag) => tag.label.toLowerCase());
    const addedTags = newValues
      .filter((val) => !existingLabels.includes(val.toLowerCase()))
      .map((label) => ({ label, color: "#00756A" }));

    const updatedTags = [...tags, ...addedTags];
    setTags(updatedTags);
    formik.setFieldValue("keywords", updatedTags.map((tag) => tag.label));
  };

  const handleDelete = (labelToDelete) => {
    const filteredTags = tags.filter((tag) => tag.label !== labelToDelete);
    setTags(filteredTags);
    formik.setFieldValue("keywords", filteredTags.map((tag) => tag.label));
  };

  const allOptions = formik.values.job_title
    ? keywords_list[formik.values.job_title] || []
    : Object.values(keywords_list).flat();

  const filteredOptions = allOptions.filter(
    (option) => !tags.some((tag) => tag.label.toLowerCase() === option.toLowerCase())
  );

  return (
    <Autocomplete
      multiple
      freeSolo
      options={filteredOptions}
      value={tags.map((tag) => tag.label)}
      onChange={handleChange}
      filterOptions={(options, params) => {
        const input = params.inputValue.toLowerCase();
        const notSelected = options.filter(
          (option) => !tags.some((tag) => tag.label.toLowerCase() === option.toLowerCase())
        );
        if (input && !tags.some((tag) => tag.label.toLowerCase() === input)) {
          notSelected.push(params.inputValue);
        }
        return notSelected;
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={option}
            label={option}
            onDelete={() => handleDelete(option)}
            sx={{
              backgroundColor: "#00756A",
              color: "#fff",
              margin: "4px",
            }}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Keywords"
          variant="outlined"
          error={formik.touched.keywords && Boolean(formik.errors.keywords)}
          helperText={formik.touched.keywords && formik.errors.keywords}
        />
      )}
    />
  );
};

export default TagInput;
