import { Box, Container, Typography } from "@mui/material";
import "./pages/PrivacyPolicyPage.css";

const RefundPolicy = () => {
  return (
    <Container>
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Refund Policy
        </Typography>
        <Typography variant="body1" paragraph>
          This is the refund policy page.
        </Typography>
      </Box>
    </Container>
  );
};

export default RefundPolicy;
