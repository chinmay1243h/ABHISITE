import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { Link } from "react-router-dom";
// import FooterLogo from "../../assets/g2i-logo.svg";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Button, IconButton, Modal, TextField } from "@mui/material";
import { Field, Form, Formik, useFormik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { inputSx } from "../utils/CommonStyle";
const Footer: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    message: Yup.string().required("Message is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleSubmit = (values: {
    name: string;
    email: string;
    message: string;
  }) => {
    console.log("Form Data", values);
    handleClose();
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      message: "",
      email: "",
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      toast.success("Subscribed successfully!");
      resetForm(); // Clear the form after submission
    },
  });

  return (
    <Box
      sx={{
        padding: "40px 20px",
        boxShadow: "-25px -25px 60px rgba(255, 255, 255, 0.1) inset",
        marginTop:{xs:"-40px",sm:'0px'},
        backgroundColor: "black",
        color: "#fff",
        textAlign: "center",
      }}
    >
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={6} sm={6} md={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: {xs:"center", md:'flex-start'},

              gap: "15px",
              width: "fit-content",
              margin: "auto",
            }}
          >
            <Typography
              variant="h5"
              sx={{ marginBottom: "5px", fontWeight: "bold" }}
            >
              Explore
            </Typography>
            <Link
              className="hover-text"
              to="/"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Home
            </Link>
            <Link
              className="hover-text"
              to="/shop"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Store
            </Link>
            <Link
              className="hover-text"
              to="/career"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Careers
            </Link>

            <Link
              className="hover-text"
              to="/contact"
              onClick={(e) => {
                e.preventDefault();
                handleOpen();
              }}
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Contact Us
            </Link>

            <Modal open={open} onClose={handleClose}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                  borderRadius: 2,
                }}
              >
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                  Contact Us
                </Typography>

                <Formik
                  initialValues={{ name: "", email: "", message: "" }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {() => (
                    <Form>
                      <Field
                        sx={inputSx}
                        as={TextField}
                        name="name"
                        placeholder="Name"
                        fullWidth
                        margin="normal"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.name && Boolean(formik.errors.name)
                        }
                        helperText={formik.touched.name && formik.errors.name}
                      />

                      <TextField
                        sx={inputSx}
                        fullWidth
                        // className="input-root"
                        id="email"
                        name="email"
                        placeholder="Email Address"
                        // margin="normal"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                      />

                      <TextField
                        multiline
                        rows={2}
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
                            padding: "0px 14px",
                          },
                        }}
                        fullWidth
                        id="message"
                        name="message"
                        placeholder="Message"
                        margin="normal"
                        value={formik.values.message}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.message &&
                          Boolean(formik.errors.message)
                        }
                        helperText={
                          formik.touched.message && formik.errors.message
                        }
                      />

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
                    </Form>
                  )}
                </Formik>
              </Box>
            </Modal>
            {/* <Link
              className="hover-text"
              to="/about-us"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              About Us
            </Link> */}
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: {xs:"center", md:'flex-start'},

              gap: "15px",
              width: "fit-content",
              margin: "auto",
            }}
          >
            {" "}
            <Typography
              variant="h5"
              sx={{ marginBottom: "5px", fontWeight: "bold" }}
            >
              Courses
            </Typography>
            <Link
              className="hover-text"
              to="/categories?filters=/Songs"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Songs
            </Link>
            <Link
              className="hover-text"
              to="/categories?filters=/Film"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Film
            </Link>
            <Link
              className="hover-text"
              to="/categories?filters=/Documentary"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Documentary
            </Link>
          </Box>
        </Grid>
        <Grid item xs={6} sm={6} md={4}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: {xs:"center", md:'flex-start'},
              gap: "15px",
              width: "fit-content",
              margin: "auto",
              marginTop:{xs:'20px',md:'0px'}
            }}
          >
            {" "}
            <Typography
              variant="h5"
              sx={{
                marginBottom: "5px",
                fontWeight: "bold",
                textAlign: "left",
              }}
            >
              Company
            </Typography>
            <Typography
              className="hover-text"
              sx={{ marginBottom: { xs: "10px", md: "0" } }}
            >
              <Link
                to="/privacy-policy"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Privacy Policy
              </Link>
            </Typography>
            <Typography
              className="hover-text"
              sx={{ marginBottom: { xs: "10px", md: "0" } }}
            >
              <Link
                to="/terms-conditions"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Terms & Conditions
              </Link>
            </Typography>

        
              <Link
              className="hover-text"

                to="/cancellation-policy"
                style={{ color: "inherit", textDecoration: "none",  }}
              >
                Cancellations and Refunds Policy
              </Link>
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: { xs: "0px", md: "50px" },
          marginTop: "20px",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box>
          <img src="/assets/logo.png" alt="Logo" style={{ width: "100px" }} />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "20px",
            marginTop: { xs: "20px", md: "0" },
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <div>
            <Typography
              variant="h5"
              sx={{
                marginBottom: "20px",
                fontWeight: "bold",
                pl: 1,
              }}
            >
              Follow Us
            </Typography>
            <Box
              sx={{ display: "flex", justifyContent: "center", gap: "10px" }}
            >
              <IconButton
                className="hover-text"
                color="inherit"
                component="a"
                 href="https://www.facebook.com/share/1EaX2Dxmj2/"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                className="hover-text"
                color="inherit"
                component="a"
                  href="https://x.com/MasterAi41514"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                className="hover-text"
                color="inherit"
                component="a"
                href="https://www.linkedin.com/in/livabhi-productions-514722355"
              >
                <LinkedInIcon />
              </IconButton>
              <IconButton
                className="hover-text"
                color="inherit"
                component="a"
                href="https://www.instagram.com/livabhiproductions/profilecard/?igsh=ZmRmZTRjZWhkdWZ0"
              >
                <InstagramIcon />
              </IconButton>
            </Box>
          </div>

          {/* <Typography>
            <Link
              to="/copyright-notification"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Copyright Notification
            </Link>
          </Typography> */}
        </Box>
      </Box>

      <Typography
        variant="body2"
        sx={{ marginTop: "20px", fontSize: "0.875rem" }}
      >
        &copy;{new Date().getFullYear()} Liv Abhi Productions. All rights
        reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
