import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Container, Divider, Typography } from "@mui/material";
import color from "../components/utils/Colors";
import "./PrivacyPolicyPage.css";

const TermsAndConditionsPage = () => {
  return (
    <Container className="privacy-policy-root">
      <Typography variant="h4" className="privacy-policy-title">
        Terms and Conditions
      </Typography>
      {/* <Typography variant="subtitle1" className="privacy-policy-subtitle">
        Effective Date: [Insert Date]
      </Typography> */}

      {/* <Divider className="privacy-policy-divider" /> */}

      {/* Section 1 */}
      <Box mt={3} className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          1. Introduction
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          Welcome to{" "}
          <span className="privacy-policy-highlight">Liv Abhi Productions</span>
          . By accessing or using our website, you agree to comply with and be
          bound by these Terms and Conditions. If you do not agree with these
          terms, please do not use our site.
        </Typography>
      </Box>

      {/* Section 2 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          2. Use of the Site
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          - You must be at least{" "}
          <span className="privacy-policy-highlight">
            18 years old
          </span>{" "}
          to use this site.
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          - You agree to use our site only for lawful purposes and in accordance
          with these Terms.
        </Typography>
      </Box>

      {/* Section 3 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          3. Intellectual Property
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          - All content, trademarks, and other intellectual property displayed
          on the site are owned by or licensed to{" "}
          <span className="privacy-policy-highlight">Liv Abhi Productions</span>
          .
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          - You may not reproduce, distribute, or create derivative works from
          our content without prior written permission.
        </Typography>
      </Box>

      {/* Section 4 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          4. User Accounts
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          - To access certain features, you may be required to create an
          account. You must provide accurate and complete information and keep
          your account secure.
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          - You are responsible for maintaining the confidentiality of your
          account password and for any activities that occur under your account.
        </Typography>
      </Box>

      {/* Section 5 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          5. User-Generated Content
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          - You may have the opportunity to submit, post, or share content on
          our site. By doing so, you grant us a non-exclusive, royalty-free,
          perpetual, and worldwide license to use, modify, and distribute that
          content.
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          - You must not submit content that is unlawful, harmful, or infringes
          on the rights of others.
        </Typography>
      </Box>

      {/* Section 6 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          6. Payment Terms
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          - If you make purchases or subscribe to services on our site, you
          agree to provide accurate payment information and comply with all
          payment terms.
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          - All fees are subject to change, and we will notify you of any
          changes.
        </Typography>
      </Box>

      {/* Section 7 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          7. Limitation of Liability
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          -{" "}
          <span className="privacy-policy-highlight">Liv Abhi Productions</span>{" "}
          will not be liable for any indirect, incidental, or consequential
          damages arising from your use of our site.
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          - Our maximum liability to you for any claims related to our site
          shall not exceed the amount you paid to us, if any.
        </Typography>
      </Box>

      {/* Section 8 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          8. Indemnification
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          You agree to indemnify and hold harmless{" "}
          <span className="privacy-policy-highlight">Liv Abhi Productions</span>
          , its affiliates, and its employees from any claims, losses, damages,
          liabilities, and expenses (including attorney fees) arising from your
          use of the site or violation of these Terms.
        </Typography>
      </Box>

      {/* Section 9 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          9. Termination
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          We may suspend or terminate your access to our site at any time,
          without notice, for any conduct that we believe violates these Terms
          or is harmful to other users or us.
        </Typography>
      </Box>

      {/* Section 10 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          10. Changes to Terms
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          We reserve the right to modify these Terms and Conditions at any time.
          Changes will be effective immediately upon posting on our site. Your
          continued use of the site after changes are made constitutes your
          acceptance of the new Terms.
        </Typography>
      </Box>

      {/* Section 11 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          11. Governing Law
        </Typography>
        <Typography variant="body1" className="privacy-policy-paragraph">
          These Terms shall be governed by and construed in accordance with the
          laws of{" "}
          <span className="privacy-policy-highlight">The Supreme Court</span>.
          Any disputes arising from these Terms will be resolved in the
          competent courts of{" "}
          <span className="privacy-policy-highlight">The Supreme Court</span>.
        </Typography>
      </Box>

      {/* Section 12 */}
      <Box className="privacy-policy-section">
        <Typography variant="h5" className="privacy-policy-subtitle">
          12. Contact Information
        </Typography>
        <Typography
          variant="body1"
          className="privacy-policy-paragraph"
          sx={{ display: "flex", gap: "10px" }}
        >
          If you have any questions about these Terms and Conditions, please
          contact us at:
          <a
            href="mailto:livabhiproductions@gmail.com"
            style={{
              // textDecoration: "none",
              color: color.secondColor,
              display: "flex",
              alignItems: "center",
            }}
          >
            <FontAwesomeIcon
              style={{ marginTop: "-3px", marginRight: "5px" }}
              icon={faEnvelope}
            />
            livabhiproductions@gmail.com
          </a>
        </Typography>
      </Box>

    </Container>
  );
};

export default TermsAndConditionsPage;
