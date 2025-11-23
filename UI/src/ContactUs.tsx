import React from "react";
import { Container, Typography, Paper, Box } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const ContactUs = () => {
  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" gutterBottom>
          If you have any questions, concerns, or inquiries, please feel free to reach out to us. You can contact us via the following methods:
        </Typography>
        
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <EmailIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="body1"><strong>Email:</strong> livabhiproductions@gmail.com</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <PhoneIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="body1"><strong>Phone:</strong> +91 90278 34183</Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <LocationOnIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="body1"><strong>Address:</strong> India, Uttar Pradesh, Pilibhit</Typography>
        </Box>

        <Typography variant="body2" color="textSecondary" sx={{ mt: 3 }}>
          We strive to respond to all inquiries within 24-48 hours.
        </Typography>
      </Paper>
    </Container>
  );
};

export default ContactUs;
