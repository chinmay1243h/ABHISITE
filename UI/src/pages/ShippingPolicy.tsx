import { Box, Container, Typography } from "@mui/material";
import "./PrivacyPolicyPage.css";

const ShippingPolicy = () => {
  return (
    <Container className="privacy-policy-root">
      <Typography variant="h4" className="privacy-policy-title">
        Shipping Policy
      </Typography>
      {/* <Typography variant="subtitle1" className="privacy-policy-subtitle">
        Effective Date: [Insert Date]
      </Typography> */}

      {/* <Divider className="privacy-policy-divider" /> */}

      {/* Section 1 */}
      <Box mt={3} className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          1. Immediate Access:
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          Upon successful payment, you will typically gain direct access to your
          purchased product immediately.
        </Typography>
      </Box>

      {/* Section 2 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          2. Delayed Access:
        </Typography>

        <Typography variant="body1" className="privacy-policy-paragraph">
          In cases where immediate access is not available, you will receive
          access to the product within *7 days* of your purchase.
        </Typography>
      </Box>

      {/* Section 3 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          3. Processing Time:
        </Typography>

        <Typography variant="body1" className="privacy-policy-paragraph">
          All orders are processed promptly. Direct access to digital content
          may vary based on your account settings and network conditions.
        </Typography>
      </Box>

      {/* Section 4 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          4. Shipping Charges:
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          For physical products, shipping costs will be calculated at checkout
          based on the weight of the items and the delivery location.
        </Typography>
      </Box>

      {/* Section 5 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          5. Direct Shipping:
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          For physical products, all orders will be shipped directly to the
          address provided at checkout. Ensure your details are accurate to
          avoid delays.
        </Typography>
      </Box>

      {/* Section 6 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          6. International Shipping:
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          We offer international shipping for physical products. Additional
          customs duties or import taxes may apply upon delivery, which are the
          customer's responsibility.
        </Typography>
      </Box>

      {/* Section 7 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          7. Order Tracking:
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          Once your order has been processed for physical shipping, you will
          receive an email confirmation with tracking information.
        </Typography>
      </Box>

      {/* Section 8 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          8. Lost or Damaged Items:
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          If you experience any issues with accessing your product or if your
          order is lost or damaged during transit, please contact us immediately
          for assistance.
        </Typography>
      </Box>
    </Container>
  );
};

export default ShippingPolicy;
