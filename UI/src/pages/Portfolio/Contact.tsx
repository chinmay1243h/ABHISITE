import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  Box,
  Button,
  Container,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { inputSx } from "../../components/utils/CommonStyle";
import { toast } from "react-toastify";


interface PortfolioProps {
  portfolioContact: { portfolioContacts: { email: string }[] }[]


  user: any

}
const Contact = ({ portfolioContact, user }: PortfolioProps) => {
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    subject: Yup.string().required("Subject is required"),
    message: Yup.string().required("Message is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      subject: "",
      message: "",
      email: "",
    },
    validationSchema,
    onSubmit: (values) => {
      // alert(
      //   `Thank you for contacting us! \n\n${JSON.stringify(values, null, 2)}`
      // );
      toast.success("Thank you for contacting!");
    },
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" textAlign="center" marginBottom={4}>
        Contact {user.firstName}
      </Typography>
      <Box component="form" onSubmit={formik.handleSubmit}>


        <TextField
          fullWidth
          sx={inputSx}
          className="input-root"
          label="Email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
        />

        <TextField
          style={{ marginTop: "15px" }}
          sx={inputSx}
          className="input-root"
          fullWidth
          label="Subject"
          name="subject"
          value={formik.values.subject}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.subject && Boolean(formik.errors.subject)}
          helperText={formik.touched.subject && formik.errors.subject}
          margin="normal"
        />


        <TextField
          style={{ marginTop: "15px", paddingTop: "15px", minHeight: "40px" }}
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
          fullWidth
          label="Message"
          name="message"
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.message && Boolean(formik.errors.message)}
          helperText={formik.touched.message && formik.errors.message}
          multiline
          rows={2}
          margin="normal"
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
            marginTop: "40px",
            width: "100%",
            boxShadow: "none",
          }}
        >
          Submit
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          mt: 6,
          mb: 2,
        }}
      >
        <IconButton color="inherit" component="a" href="https://facebook.com">
          <FacebookIcon />
        </IconButton>
        <IconButton color="inherit" component="a" href="https://twitter.com">
          <TwitterIcon />
        </IconButton>
        <IconButton color="inherit" component="a" href="https://linkedin.com">
          <LinkedInIcon />
        </IconButton>
        <IconButton color="inherit" component="a" href="https://instagram.com">
          <InstagramIcon />
        </IconButton>
      </Box>

      <Typography sx={{ textAlign: "center" }}>{portfolioContact?.[0]?.portfolioContacts?.[0]?.email}</Typography>
    </Container>
  );
};

export default Contact;
