import {
  Box,
  Button,
  Container,
  Typography
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import PasswordField from "../../components/form/PasswordField";
import { Arrow } from "../../components/shared/Arrow";
import color from "../../components/utils/Colors";
import { inputSx } from "../../components/utils/CommonStyle";
import { resetPwdSchema } from "../../components/utils/schema";

const ResetPassword = () => {
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: resetPwdSchema,
    onSubmit: (values) => {
      // Handle form submission
      console.log(values);
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  return (
    <Box
      sx={{
        backgroundImage: "url(/assets/head1.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        minHeight: { xs: "90vh", md: "130vh" },
        display: "flex",
        mt: { xs: "-54px", md: "-94px" },
        alignItems: "center",
        "&::before": {
          content: '""',
          height: { xs: "90vh", md: "130vh" },
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.6))",
          zIndex: 1,
          backdropFilter: "blur(1px)",
        },
      }}
    >
      <Container
        maxWidth="sm"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        {/* <Box
          sx={{
            borderRadius: "8px",
            backgroundImage: `url('/images/ADESO LOGO RGB.png')`,
            backgroundSize: "100%",
            boxShadow: "0px 0px 20px rgba(255,255,255,0.5)",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundColor: "white",
            height: "70px",
            width: "120px",
            margin: "20px 0px",
          }}
        ></Box> */}
        <Box
          display="flex"
          flexDirection="column"
          sx={{
            padding: 4,
            pb: 6,
            boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
            borderRadius: "8px",
            mb: 6,
            border: "solid 2px ",
            zIndex: 2,
            borderColor: color.textColor1,
            background: 'white'
          }}
          alignItems="center"
          mt={0}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", mb: "5%", color: color.textColor1 }}
            gutterBottom
          >
            Reset Password
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <PasswordField
              id="password"
              name="password"
              placeholder="Create Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!(formik.touched.password && formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
              inputSx={inputSx}
            />
            <PasswordField
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={!!(formik.touched.password && formik.errors.password)}
              helperText={
                formik.touched.confirmPassword &&
                formik.errors.confirmPassword
              }
              showPassword={showPassword}
              togglePasswordVisibility={togglePasswordVisibility}
              inputSx={inputSx}
            />

            <Button
              type="submit"
              variant="contained"
              style={{
                margin: "auto",
                marginTop: "20px",
                marginBottom: 2,
                background: color.textColor1,
                height: "40px",
                width: "100%",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: "8px",
              }}
            >
              <a
                style={{ textDecoration: "none", color: "inherit" }}
                href="/reset-password"
              >
                {" "}
                Submit{" "}
              </a>
              <Arrow></Arrow>
            </Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default ResetPassword;
