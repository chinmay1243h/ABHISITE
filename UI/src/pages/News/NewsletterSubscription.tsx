import { faArrowRight, faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, CardMedia, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useFormik } from "formik";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Yup from "yup";

const useStyles = makeStyles((theme: { spacing: (arg0: number) => any }) => ({
  container: {
    color: "white",
    borderRadius: "8px",
    padding: theme.spacing(4),
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    alignItems: "center",
    zIndex: 2,
  },
  title: {
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
  },
  inputField: {
    marginBottom: theme.spacing(2),
    width: "100%",
    background: "white",
  },
}));

const NewsletterSubscription = () => {
  const classes = useStyles();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      toast.success("Subscribed successfully!");
      resetForm(); // Clear the form after submission
    },
  });

  return (
    <>
      <ToastContainer position="top-center" />
      <Box
        sx={{


          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          // background: "black",
          gap: { xs: "0px", md: "20px" },
          justifyContent: "space-around",
          alignItems: "center",
          p: 2,
          pb: 6,
          pt: { xs: 6, md: 2 },
          position: "relative",
        }}
      >
        <Box
          sx={{
            background: "black",
            opacity: "0.8",
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "100%",
            // background: "transparent",
            zIndex: 1,
          }}
        ></Box>

        <Box className={classes.container}>
          <Typography
            sx={{
              fontSize: "36px",
            }}
            className={classes.title}
          >
            STAY IN TOUCH
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "inherit", fontSize: "18px", mb: 2 }}
            style={{
              fontFamily: "Rosttel",
            }}
            gutterBottom
          >
            <FontAwesomeIcon
              style={{ color: "red" }}
              id="custom-button-icon"
              icon={faBullhorn}
            />{" "}
            Register today for the LivAbhi Productions and work to receive all the latest information about our upcoming films and projects.
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              className={classes.inputField}
              variant="outlined"
              placeholder="Enter your email address"
              type="email"
              fullWidth
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              style={{
                marginLeft: 0,
                cursor: "pointer",
                textTransform: "none",
                fontSize: "24px",
                marginTop: "30px",
              }}
              id="custom-button"
            >
              Subscribe{" "}
              <FontAwesomeIcon
                id="custom-button-icon"
                icon={faArrowRight}
                style={{ marginLeft: "8px" }}
              />
            </Button>
          </form>
        </Box>

        <CardMedia
          component="img"
          image="/assets/newsletter image.jpg"
          sx={{
            zIndex: 2,
            // display: { xs: "none", md: "block" },
            height: { xs: "200px", md: "300px" },
            minWidth: { xs: "200px", md: "300px" },
            objectFit: "contain",
            filter: "drop-shadow(0px 0px 30px rgba(255, 255, 255, 0.377))",
          }}
        />
      </Box>
    </>
  );
};

export default NewsletterSubscription;
