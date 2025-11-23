import {
    Autocomplete,
    Box,
    Button,
    Grid,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { inputSx } from "../../components/utils/CommonStyle";
import { useLocation, useNavigate } from "react-router-dom";
import { postJob } from "../../services/services";
import { toast } from "react-toastify";
import { useState } from "react";

const defaultValues = {
    title: "Sales Consultant",
    company: "Workze Inc.",
    location: "San Francisco, CA · USA · Full-time",
    overview:
        "We’re a remote team spread all over the world. From top to bottom, our team makes growth a top priority, and it's ingrained in our company culture. But most importantly, we enjoy making customers happy and having fun while doing so.",
    responsibilities: "",
    qualifications: "",
    skills: ["Retail"],
    salary: "$187,300",
    contactEmail: "career@workze.xyz",
    jobType: "Full-time",
    category: "Retail sales",
};

const validationSchema = Yup.object({
    title: Yup.string().required("Job title is required"),
    company: Yup.string().required("Company name is required"),
    location: Yup.string().required("Location is required"),
    overview: Yup.string().required("Overview is required"),
    responsibilities: Yup.string().required("Responsibilities are required"),
    qualifications: Yup.string().required("Qualifications are required"),
    skills: Yup.array().min(1, "At least one skill is required"),
    salary: Yup.string().required("Salary is required"),
    contactEmail: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    jobType: Yup.string().required("Job type is required"),
    category: Yup.string().required("Category is required"),
});

const jobTypes = ["Full-time", "Part-time"];
const categories = [
    "Retail Sales",
    "Engineering",
    "Healthcare",
    "Education",
    "Technology",
    "Marketing",
];
const skillsList = [
    "Sales",
    "Marketing",
    "Retail",
    "Commerce",
    "Engineering",
    "Management",
];

const JobPostingForm = () => {
    const location = useLocation();
    const id = location.state;
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    // console.log(id)
    return (
        <Box
            sx={{ padding: "1rem", backgroundColor: "#ffffff", minHeight: "100vh" }}
        >
            <Box
                sx={{
                    maxWidth: 600,
                    mx: "auto",
                    mt: 5,
                    p: 3,
                    boxShadow: 3,
                    backgroundColor: "#ffffff",
                }}
            >
                <Typography variant="h4" gutterBottom align="center" sx={{ mb: 2 }}>
                    Job Posting Form
                </Typography>
                <Formik
                    initialValues={defaultValues}
                    validationSchema={validationSchema}
                    onSubmit={async (values) => {
                        setLoading(true);
                        //   console.log("Form data:", values);
                        try {
                            const payLoad = { userId: id, ...values };
                            const res = await postJob(payLoad);
                            toast(res?.data?.msg);
                            navigate("/career");
                        } catch (error) {
                            toast.error("Something went wrong!");
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    {({ values, handleChange, handleBlur, setFieldValue }) => (
                        <Form>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="title"
                                        label="Job Title"
                                        fullWidth
                                        value={values.title}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        sx={inputSx}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="company"
                                        label="Company Name"
                                        fullWidth
                                        value={values.company}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        sx={inputSx}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="location"
                                        label="Location"
                                        fullWidth
                                        value={values.location}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        sx={inputSx}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="overview"
                                        label="Job Overview"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        value={values.overview}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        sx={{
                                            ...inputSx,
                                            "& .MuiInputBase-root": {
                                                resize: "vertical",
                                                minHeight: "40px",
                                                marginTop: "10px",
                                            },
                                            "& textarea": {
                                                resize: "vertical",
                                                minHeight: "40px",
                                            },
                                        }}
                                        className="input-root"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="responsibilities"
                                        label="Responsibilities"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        value={values.responsibilities}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        sx={{
                                            ...inputSx,
                                            "& .MuiInputBase-root": {
                                                resize: "vertical",
                                                minHeight: "40px",
                                                marginTop: "10px",
                                            },
                                            "& textarea": {
                                                resize: "vertical",
                                                minHeight: "40px",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="qualifications"
                                        label="Qualifications"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        value={values.qualifications}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        sx={{
                                            ...inputSx,
                                            "& .MuiInputBase-root": {
                                                resize: "vertical",
                                                minHeight: "40px",
                                                marginTop: "10px",
                                            },
                                            "& textarea": {
                                                resize: "vertical",
                                                minHeight: "40px",
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        sx={{
                                            ...inputSx,
                                            "& .MuiInputBase-root": {
                                                resize: "vertical",
                                                minHeight: "40px",
                                                paddingTop: "20px",
                                                paddingLeft: "10px",
                                                paddingBottom: "20px",
                                            },
                                            "& textarea": {
                                                resize: "vertical",
                                                minHeight: "40px",
                                            },
                                        }}
                                        multiple
                                        options={skillsList}
                                        getOptionLabel={(option) => option}
                                        value={values.skills}
                                        onChange={(e, value) => setFieldValue("skills", value)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                name="skills"
                                                label="Skills"
                                                fullWidth
                                                onBlur={handleBlur}
                                                error={!values.skills.length}
                                                helperText={
                                                    !values.skills.length &&
                                                    "At least one skill is required"
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="salary"
                                        label="Salary"
                                        fullWidth
                                        value={values.salary}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        sx={inputSx}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="contactEmail"
                                        label="Contact Email"
                                        fullWidth
                                        value={values.contactEmail}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        sx={inputSx}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        as={TextField}
                                        name="jobType"
                                        label="Job Type"
                                        fullWidth
                                        select
                                        value={values.jobType}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        sx={inputSx}
                                        className="input-root"
                                    >
                                        {jobTypes.map((type) => (
                                            <MenuItem key={type} value={type}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        sx={{
                                            ...inputSx,
                                            "& .MuiInputBase-root": {
                                                resize: "vertical",
                                                minHeight: "40px",
                                                marginTop: "10px",
                                                paddingLeft: "10px",
                                                paddingBottom: "10px",
                                            },
                                            "& textarea": {
                                                resize: "vertical",
                                                minHeight: "40px",
                                            },
                                        }}
                                        className="input-root"
                                        options={categories}
                                        getOptionLabel={(option) => option}
                                        value={values.category}
                                        onChange={(e, value) => setFieldValue("category", value)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                name="category"
                                                label="Category"
                                                fullWidth
                                                onBlur={handleBlur}
                                                error={!values.category}
                                                helperText={!values.category && "Category is required"}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        id="custom-button"
                                        disabled={loading}
                                        style={{
                                            borderColor: "black",
                                            borderWidth: "4px",
                                            color: "black",
                                            fontSize: "16px",
                                            padding: "10px 20px",
                                            margin: 0,
                                            marginTop: "20px",
                                            width: "100%",
                                            boxShadow: "none",
                                        }}
                                    >
                                        {loading ? "Submitting..." : "Submit"}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default JobPostingForm;
