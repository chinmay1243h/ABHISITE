import { UploadFile } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import color from "../../components/utils/Colors";
import { inputSx } from "../../components/utils/CommonStyle";
import { useLocation, useNavigate } from "react-router-dom";
import { createJobApplications } from "../../services/services";
import { toast } from "react-toastify";

const JobApplicationForm = () => {
  const location = useLocation();
  const { id } = location.state;

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Full Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    dob: Yup.date().required("Date of Birth is required"),
    address: Yup.string().required("Address is required"),
    position: Yup.string().required("Position is required"),
    qualification: Yup.string().required("Qualification is required"),
    experience: Yup.string().required("Work experience is required"),
    skills: Yup.string().required("Skills are required"),
    startDate: Yup.date().required("Start date is required"),
    expectedSalary: Yup.number()
      .typeError("Expected salary must be a number")
      .required("Expected salary is required"),
    coverLetter: Yup.string().required("Cover Letter is required"),
  });
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      dob: "",
      address: "",
      position: "",
      qualification: "",
      experience: "",
      skills: "",
      startDate: "",
      expectedSalary: "",
      coverLetter: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // alert(
      //   `Application Submitted:\n\n${JSON.stringify(
      //     { ...values, resume: resume?.name || "No file uploaded" },
      //     null,
      //     2
      //   )}`
      // );
      // console.log(values)
      const payLoad = {
        ...values,
        jobId: id

      }
      createJobApplications(payLoad).then((res) => {
        toast(res?.data?.msg)
        navigate('/')
      }).catch((err) => {
        console.log(err)
      })
    },
  });

  const [resume, setResume] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setResume(file || null);
  };

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
        <Typography variant="h4" gutterBottom align="center">
          Job Application Form
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                sx={inputSx}
                className="input-root"
                fullWidth
                label="Full Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={inputSx}
                className="input-root"
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={inputSx}
                className="input-root"
                label="Phone"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={inputSx}
                style={{ marginTop: "15px" }}
                className="input-root"
                label="Date of Birth"
                type="date"
                name="dob"
                InputLabelProps={{ shrink: true }}
                value={formik.values.dob}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.dob && Boolean(formik.errors.dob)}
                helperText={formik.touched.dob && formik.errors.dob}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <TextField
                sx={{
                  ...inputSx,
                  "& .MuiInputBase-root": {
                    resize: "vertical",
                    minHeight: "40px",
                  },
                  "& textarea": {
                    resize: "vertical",
                    minHeight: "40px",
                  },
                }}
                className="input-root"
                label="Address"
                name="address"
                multiline
                rows={1.5}
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={inputSx}
                className="input-root"
                select
                label="Position Applying For"
                name="position"
                value={formik.values.position}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.position && Boolean(formik.errors.position)
                }
                helperText={formik.touched.position && formik.errors.position}
              >
                <MenuItem value="Software Engineer">Software Engineer</MenuItem>
                <MenuItem value="Product Manager">Product Manager</MenuItem>
                <MenuItem value="Designer">Designer</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={inputSx}
                className="input-root"
                label="Highest Qualification"
                name="qualification"
                value={formik.values.qualification}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.qualification &&
                  Boolean(formik.errors.qualification)
                }
                helperText={
                  formik.touched.qualification && formik.errors.qualification
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={inputSx}
                className="input-root"
                label="Work Experience (Years)"
                name="experience"
                value={formik.values.experience}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.experience && Boolean(formik.errors.experience)
                }
                helperText={
                  formik.touched.experience && formik.errors.experience
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={{
                  ...inputSx,
                  "& .MuiInputBase-root": {
                    resize: "vertical",
                    minHeight: "40px",
                  },
                  "& textarea": {
                    resize: "vertical",
                    minHeight: "40px",
                  },
                }}
                className="input-root"
                label="Skills"
                name="skills"
                multiline
                rows={1.5}
                value={formik.values.skills}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.skills && Boolean(formik.errors.skills)}
                helperText={formik.touched.skills && formik.errors.skills}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                style={{ marginTop: "15px" }}
                sx={inputSx}
                className="input-root"
                label="Availability to Start"
                type="date"
                name="startDate"
                InputLabelProps={{ shrink: true }}
                value={formik.values.startDate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.startDate && Boolean(formik.errors.startDate)
                }
                helperText={formik.touched.startDate && formik.errors.startDate}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={inputSx}
                className="input-root"
                label="Expected Salary"
                name="expectedSalary"
                value={formik.values.expectedSalary}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.expectedSalary &&
                  Boolean(formik.errors.expectedSalary)
                }
                helperText={
                  formik.touched.expectedSalary && formik.errors.expectedSalary
                }
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={{
                  ...inputSx,
                  "& .MuiInputBase-root": {
                    resize: "vertical",
                    minHeight: "40px",
                  },
                  "& textarea": {
                    resize: "vertical",
                    minHeight: "40px",
                  },
                }}
                className="input-root"
                multiline
                rows={1.5}
                label="Cover Letter"
                name="coverLetter"
                value={formik.values.coverLetter}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.coverLetter &&
                  Boolean(formik.errors.coverLetter)
                }
                helperText={
                  formik.touched.coverLetter && formik.errors.coverLetter
                }
              />
            </Grid>

            <Box
              sx={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "flex-end",
                width: "100%",
                marginTop: 4,
                marginBottom: 0,
                px: 2,
              }}
            >
              <Button
                variant="contained"
                component="label"
                sx={{
                  background: color.textColor1,
                }}
              >
                <UploadFile sx={{ marginRight: 1 }} />
                Upload Resume
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {resume && <Typography>{resume.name}</Typography>}
            </Box>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                id="custom-button"
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
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Box>
  );
};

export default JobApplicationForm;
