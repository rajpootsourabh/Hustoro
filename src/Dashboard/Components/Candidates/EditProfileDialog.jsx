import React, { useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Typography,
    IconButton,
    CircularProgress,
} from "@mui/material";
import { X, Edit3 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSnackbar } from "../SnackbarContext";

// Validation schema using camelCase
const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    designation: Yup.string().required("Designation is required"),
    location: Yup.string().required("Location is required"),
    experience: Yup.number()
        .typeError("Must be a number")
        .min(0, "Invalid experience")
        .required("Experience is required"),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
        .required("Phone number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    currentCtc: Yup.number().typeError("Must be a number").nullable(),
    expectedCtc: Yup.number().typeError("Must be a number").nullable(),
    country: Yup.string().required("Country is required"),
    education: Yup.string().nullable(),
});

const EditProfileDialog = ({ open, onClose, candidateData, applicationId, onSuccess }) => {
    const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = React.useState(false);
    const formik = useFormik({
        initialValues: {
            firstName: "",
            lastName: "",
            designation: "",
            location: "",
            experience: "",
            phone: "",
            email: "",
            currentCtc: "",
            expectedCtc: "",
            country: "",
            education: "",
        },
        validationSchema,
        enableReinitialize: true,


        onSubmit: async (values) => {
            try {
                setLoading(true); // start loader

                const payload = {
                    first_name: values.firstName,
                    last_name: values.lastName,
                    designation: values.designation,
                    location: values.location,
                    experience: parseFloat(values.experience) || 0,
                    phone: values.phone,
                    email: values.email,
                    current_ctc: parseFloat(values.currentCtc) || 0,
                    expected_ctc: parseFloat(values.expectedCtc) || 0,
                    country: values.country,
                    education: values.education || "",
                };

                const response = await axios.put(
                    `${import.meta.env.VITE_API_BASE_URL}/job-applications/${applicationId}`,
                    payload,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                        },
                    }
                );

                showSnackbar("Candidate updated successfully!", "success");

                if (onSuccess) {
                    onSuccess(response.data.candidate);
                }
            } catch (error) {
                console.error(error.response?.data || error.message);
                showSnackbar(
                    error.response?.data?.message || "Failed to update candidate",
                    "error"
                );
            } finally {
                setLoading(false); // stop loader
            }
        },


    });

    useEffect(() => {
        if (candidateData) {
            formik.setValues({
                firstName: candidateData.candidate?.first_name || "",
                lastName: candidateData.candidate?.last_name || "",
                designation: candidateData.candidate?.designation || "",
                location: candidateData.candidate?.location || "",
                experience: candidateData.candidate?.experience || "",
                phone: candidateData.candidate?.phone || "",
                email: candidateData.candidate?.email || "",
                currentCtc: candidateData.candidate?.current_ctc || "",
                expectedCtc: candidateData.candidate?.expected_ctc || "",
                country: candidateData.candidate?.country || "",
                education: candidateData.candidate?.education || "",
            });
        }
    }, [candidateData]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "#f9fafb",
                    borderBottom: "1px solid #eee",
                }}
            >
                <Typography variant="h6" fontWeight="600" display="flex" alignItems="center" gap={1}>
                    <Edit3 size={18} /> Edit Candidate Details
                </Typography>
                <IconButton onClick={onClose} size="small">
                    <X size={20} />
                </IconButton>
            </DialogTitle>

            <form onSubmit={formik.handleSubmit}>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="First Name"
                                name="firstName"
                                value={formik.values.firstName}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                                helperText={formik.touched.firstName && formik.errors.firstName}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Last Name"
                                name="lastName"
                                value={formik.values.lastName}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                                helperText={formik.touched.lastName && formik.errors.lastName}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Designation"
                                name="designation"
                                value={formik.values.designation}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.designation && Boolean(formik.errors.designation)}
                                helperText={formik.touched.designation && formik.errors.designation}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Location"
                                name="location"
                                value={formik.values.location}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.location && Boolean(formik.errors.location)}
                                helperText={formik.touched.location && formik.errors.location}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Experience"
                                name="experience"
                                value={formik.values.experience}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.experience && Boolean(formik.errors.experience)}
                                helperText={formik.touched.experience && formik.errors.experience}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Current CTC"
                                name="currentCtc"
                                value={formik.values.currentCtc}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.currentCtc && Boolean(formik.errors.currentCtc)}
                                helperText={formik.touched.currentCtc && formik.errors.currentCtc}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Expected CTC"
                                name="expectedCtc"
                                value={formik.values.expectedCtc}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.expectedCtc && Boolean(formik.errors.expectedCtc)}
                                helperText={formik.touched.expectedCtc && formik.errors.expectedCtc}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Phone"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.phone && Boolean(formik.errors.phone)}
                                helperText={formik.touched.phone && formik.errors.phone}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Country"
                                name="country"
                                value={formik.values.country}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.country && Boolean(formik.errors.country)}
                                helperText={formik.touched.country && formik.errors.country}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Education"
                                name="education"
                                value={formik.values.education}
                                onChange={formik.handleChange}
                                fullWidth
                                error={formik.touched.education && Boolean(formik.errors.education)}
                                helperText={formik.touched.education && formik.errors.education}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button
                        onClick={onClose}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            borderColor: "black",
                            color: "black",
                            "&:hover": {
                                borderColor: "black",
                                backgroundColor: "rgba(0,0,0,0.04)",
                            },
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            borderRadius: 2,
                            backgroundColor: "#0d9488",
                            "&:hover": { backgroundColor: "#0f766e" },
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                        }}
                        disabled={loading}
                    >
                        {loading && <CircularProgress size={18} color="inherit" />}
                        Save Changes
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default EditProfileDialog;
