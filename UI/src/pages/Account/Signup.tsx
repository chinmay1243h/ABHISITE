import {
  Box,
  Button,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useFormik } from "formik";
import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContentProps } from "react-toastify";
import PasswordField from "../../components/form/PasswordField";
import FormSelect2 from "../../components/form/SingleFormSelect";
import { Arrow } from "../../components/shared/Arrow";
import color from "../../components/utils/Colors";
import { inputSx } from "../../components/utils/CommonStyle";
import { signupSchema } from "../../components/utils/schema";
import { Signup } from "../../services/services";

const SignupPage = () => {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupSchema,
    onSubmit: (values) => {
      setLoading(true);
      const payLoad = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: role
      }
      Signup(payLoad).then((res: { data: { msg: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | ((props: ToastContentProps<unknown>) => ReactNode) | null | undefined; }; }) => {

        toast(res?.data?.msg);
        navigate('/verify-otp', { state: values.email })
         }).catch((err) => {
        toast(err?.response?.data?.msg);
      }).finally(() => {
        setLoading(false);
      });

    },
  });

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 992);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isMobile1 = useMediaQuery("(max-width:700px)");

  const userRoles = ["User", "Artist", "Business"];

  const [role, setRole] = useState<string>("User");

  return (
    <Box
      sx={{
        backgroundImage: "url(/assets/head1.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%",
        // minHeight: "160vh",
        minHeight: { xs: "120vh", md: "160vh" },

        display: "flex",
        mt: { xs: "-54px", md: "-94px" },
        alignItems: "center",
        "&::before": {
          content: '""',
          height: { xs: "120vh", md: "160vh" },
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
      <div
        style={{
          zIndex: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: isMobile1 ? "column" : "row",
          margin: "auto",
          marginTop: "5%",
          marginBottom: "5%",
          width: isMobile1 ? "70vw" : isMobile ? "90vw" : "70vw",
          height: isMobile ? "fit-content" : "700px",

        }}
      >
        {/* <Box
          sx={{
            borderRadius: "8px 0px 0px 8px",

            color: color.textColor1,
            height: "auto",
            width: "100%",
            marginBottom: "2%",
            display: isMobile1 ? "flex" : "none",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            style={{
              textAlign: "center",
              textShadow: "0px 0px 20px rgba(255,255,255,0.5)",
              fontWeight: "bold",
              marginTop: "0%",
              marginBottom: "0%",
              lineHeight: 1,
              fontSize: "20px",
            }}
          >
            <span style={{ fontWeight: "normal" }}>Hello!</span>
            <br />
            Welcome To
          </Typography>

          <Box
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
              marginTop: "10px",
            }}
          ></Box>
        </Box> */}

        <Box
          sx={{
            borderRadius: "8px 0px 0px 8px",
            background: color.textColor1,
            height: "100%",
            width: "45%",
            display: isMobile1 ? "none" : "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            border: "solid 0px #0079c1",

          }}
        >
          <Typography
            style={{
              textAlign: "center",
              color: "white",
              textShadow: "0px 0px 20px rgba(255,255,255,0.5)",
              fontWeight: "bold",
              marginTop: "2%",
              marginBottom: "10%",
              lineHeight: 1,
              fontSize: "20px",
            }}
          >
            <span style={{ fontWeight: "normal" }}>Hello!</span>
            <br />
            Welcome To
          </Typography>

          <Box
            sx={{
              borderRadius: "8px",
              backgroundImage: `url('/assets/logo.png')`,
              backgroundSize: "60%",
              boxShadow: "0px 0px 20px rgba(255,255,255,0.5)",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundColor: "white",
              height: "70px",
              width: "120px",
            }}
          ></Box>

          <Typography
            style={{
              textAlign: "justify",
              hyphens: "auto",
              color: "white",
              lineHeight: 1,
              padding: "0px 10%",
              marginTop: "15%",
              marginBottom: "15%",
              fontSize: "12px",
              textShadow: "0px 0px 20px rgba(255,255,255,0.5)",
            }}
          >
            Crafting cinematic journeys that captivate and inspire. Turning
            imagination into breathtaking visuals. Where storytelling meets
            creativity, every step of the way.
          </Typography>

          <Typography
            style={{
              textAlign: "center",
              color: "white",
              lineHeight: 1,
              padding: "0%",
              fontWeight: "bold",
              fontSize: "12px",
              marginBottom: "10px",
            }}
          >
            <Typography
              style={{
                textAlign: "center",
                color: "white",
                fontWeight: "bold",
                marginBottom: "10px",
                fontSize: "12px",
              }}
            >
              Visit
            </Typography>
            <span
              onClick={() => {
                navigate("/news&blogs");
              }}
              style={{
                color: color.textColor1,
                borderRadius: "2px",
                background: "white",
                padding: "2px 10px",
                textDecoration: "none",
                boxShadow: "0px 0px 20px rgba(255,255,255,0.5)",
              }}
            >
              Blog
            </span>{" "}
            &nbsp;|&nbsp;&nbsp;
            <span
              onClick={() => {
                navigate("/shop");
              }}
              style={{
                color: color.textColor1,
                borderRadius: "2px",
                background: "white",
                padding: "2px 10px",
                textDecoration: "none",
                boxShadow: "0px 0px 20px rgba(255,255,255,0.5)",
              }}
            >
              Shop
            </span>{" "}
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "#fff",
            width: "100%",
            borderRadius: isMobile1 ? "8px" : "0px 8px 8px 0px",
            paddingBottom: "15%",

            height: "100%",
            boxShadow: isMobile1
              ? "0px 0px 10px rgba(0,0,0,0.2)"
              : "-6px 0px 20px rgba(0,0,0,0.2)",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{
              fontWeight: "bold",
              mb: "6%",
              mt: "12%",
              color: color.textColor1,
            }}
          >
            Sign Up
          </Typography>
          <Box
            component="form"
            onSubmit={formik.handleSubmit}
            sx={{
              mt: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "80%",
            }}
          >
            <div
              style={{
                display: "flex",
              }}
            >
              <TextField
                sx={inputSx}
                fullWidth
                style={{ width: "47%", marginRight: "5%" }}
                id="firstName"
                className="input-root"
                name="firstName"
                placeholder="First Name"
                margin="normal"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.firstName && Boolean(formik.errors.firstName)
                }
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
              <TextField
                sx={inputSx}
                style={{ width: "47%" }}
                fullWidth
                id="lastName"
                className="input-root"
                name="lastName"
                placeholder="Last Name"
                margin="normal"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.lastName && Boolean(formik.errors.lastName)
                }
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </div>
            <TextField
              sx={inputSx}
              style={{ marginTop: "0px" }}
              fullWidth
              id="email"
              className="input-root"
              name="email"
              placeholder="Email Address"
              margin="normal"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <FormSelect2
              options={userRoles}
              defaultValue={{ role: "User" }}
              label={"Select User Role"}
              valueProp={"role"}
              setter={setRole}
            ></FormSelect2>
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
                formik.touched.confirmPassword && formik.errors.confirmPassword
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
                marginTop: "30px",
                background: color.textColor1,
                marginBottom: 2,
                height: "40px",
                padding: "8px 30%",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: "8px",
                width: "fit-content",
                whiteSpace: "nowrap",

              }}
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}  <Arrow></Arrow>
            </Button>

            <Typography
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                textAlign: "center",
                marginTop: "5%",
              }}
            >
              Already have an account?
              <a
                href="/login"
                style={{
                  color: color.textColor1,
                  boxShadow: "0px 0px 20px rgba(255,255,255,0.5)",
                  borderRadius: "0px",
                  background: "white",
                  padding: "2px 10px",
                  whiteSpace: "nowrap",

                  textDecoration: "none",
                }}
              >
                Log in
              </a>
            </Typography>
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default SignupPage;
