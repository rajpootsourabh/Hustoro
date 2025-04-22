import React, { useState } from "react";
import { Autocomplete, TextField, Chip } from "@mui/material";

// Predefined options
const predefinedOptions = ["React", "JavaScript", "Django", "Python", "Node.js"];

const TagInput = ({formik,keywords_list}) => {
  const [tags, setTags] = useState([]);

  const handleChange = (_, newValues) => {
    const prevTags = [...tags];
    const lowerCaseTags = prevTags.map((tag) => tag.label.toLowerCase());
    const newTags = newValues
        .filter((val) => !lowerCaseTags.includes(val.toLowerCase())) // Prevent duplicates
        .map((label) => ({
          label,
          color: "#00756A", // Fixed color for all tags
        }));
    setTags((prevTags) => [...prevTags, ...newTags]); // Append to existing tags
    const tagvalues = [...prevTags, ...newTags].map((tag) => tag.label); // Get the label values of the tags
    formik.setFieldValue("keywords", tagvalues); // Update Formik state
  };

  const handleDelete = (tagToDelete) => {
    const updatedTags = tags.filter((tag) => tag.label !== tagToDelete);
    setTags(updatedTags);
    const tagvalues = updatedTags.map((tag) => tag.label); // Get the label values of the tags
    formik.setFieldValue("keywords", tagvalues); // Update Formik state
  };
  // {console.log("formik.values.job_title ",formik.values.job_title)}
  return (
    <Autocomplete
      multiple
      freeSolo
      options={
        formik.values.job_title
        ?
          keywords_list[formik.values.job_title].filter((option) => !tags.some((tag) => tag.label.toLowerCase() === option.toLowerCase()))
        :
          Object.keys(keywords_list).reduce((acc, key) => {
            const options = keywords_list[key].filter((option) => !tags.some((tag) => tag.label.toLowerCase() === option.toLowerCase()));
            return acc.concat(options);
          }, [])
        }
      value={tags.map((tag) => tag.label)}
      onChange={handleChange}
      error={formik.touched.job_function && Boolean(formik.errors.job_function)}
      helperText={formik.touched.job_function && formik.errors.job_function}
      filterOptions={(options, params) => {
        const inputLower = params.inputValue.toLowerCase();
        const filtered = options.filter((option) => !tags.some((tag) => tag.label.toLowerCase() === option.toLowerCase()));

        if (params.inputValue !== "" && !tags.some((tag) => tag.label.toLowerCase() === inputLower)) {
          filtered.push(params.inputValue); // Allow user to add custom input if not a duplicate
        }
        return filtered;
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => {
          const { key, onDelete } = getTagProps({ index });
          return (
            <Chip
              key={key}
              label={option}
              onDelete={() => handleDelete(option)}
              sx={{
                backgroundColor: "#00756A", // Fixed tag color
                color: "#fff",
                margin: "4px", // Adds spacing between chips
              }}
            />
          );
        })
      }
      renderInput={(params) => 
        <TextField 
          {...params} 
          label="Keywords" 
          variant="outlined"
          error={formik.touched.keywords && Boolean(formik.errors.keywords)} // Pass error state
          helperText={formik.touched.keywords && formik.errors.keywords} // Display error message 
        />
      }
    />
  );
};

export default TagInput;
