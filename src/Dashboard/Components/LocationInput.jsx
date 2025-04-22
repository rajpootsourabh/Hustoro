import React, { useState } from "react";
import { TextField } from "@mui/material";
import Autocomplete from "react-google-autocomplete";

const GOOGLE_API_KEY = "YOUR_GOOGLE_API_KEY"; // Replace with your actual API key

const LocationInput = () => {
  const [address, setAddress] = useState("");

  return (
    <Autocomplete
      apiKey={GOOGLE_API_KEY}
      onPlaceSelected={(place) => {
        setAddress(place.formatted_address);
        console.log("Selected Place:", place);
      }}
      options={{
        types: ["geocode"], // Restrict results to addresses
        componentRestrictions: { country: "us" }, // Restrict to the US
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Enter Location"
          variant="outlined"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      )}
    />
  );
};

export default LocationInput;
