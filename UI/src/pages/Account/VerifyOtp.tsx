import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    CircularProgress
} from "@mui/material";
import { useFormik } from "formik";
import { Arrow } from "../../components/shared/Arrow";
import color from "../../components/utils/Colors";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPwdSchema } from "../../components/utils/schema";
import { resendOTP, verifyOTP } from "../../services/services";
import { inputSx } from "../../components/utils/CommonStyle";

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [isResendEnabled, setIsResendEnabled] = useState(false);
    const email = location?.state;

    const formik = useFormik({
        initialValues: { VerifyOtp: "" },
        validationSchema: resetPwdSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const payload = { email, otp: values.VerifyOtp };
                const res = await verifyOTP(payload);
                toast.success(res?.data?.msg);

                if (res?.data?.data?.role === 'Artist') {
                    const params = new URLSearchParams({
                        id: res?.data?.data?.id,
                        firstName: res?.data?.data?.firstName,
                        lastName: res?.data?.data?.lastName
                    });
                    navigate(`/portfolio-form?${params.toString()}`);
                } else {
                    navigate("/login");
                }
            } catch (err) {
                toast.error("Invalid OTP. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        if (timer === 0) {
            setIsResendEnabled(true);
            return;
        }
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleResendOtp = async () => {
        if (!email) {
            toast.error("Email is missing. Please try again.");
            return;
        }

        setResendLoading(true);
        try {
            const res = await resendOTP({ email });
            toast.success(res?.data?.msg || "OTP resent successfully!");
            setTimer(60);
            setIsResendEnabled(false);
        } catch (err) {
            toast.error("Failed to resend OTP. Please try again.");
            console.error(err);
        } finally {
            setResendLoading(false);
        }
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
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 2,
                }}
            >
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
                        Verify OTP
                    </Typography>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            id="verifyOtp"
                            name="VerifyOtp"
                            placeholder="Enter OTP"
                            value={formik.values.VerifyOtp}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={!!(formik.touched.VerifyOtp && formik.errors.VerifyOtp)}
                            helperText={formik.touched.VerifyOtp && formik.errors.VerifyOtp}
                            sx={inputSx}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 2,
                                background: color.textColor1,
                                height: "40px",
                                width: "100%",
                                fontWeight: "bold",
                                textTransform: "none",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Submit"}
                            {!loading && <Arrow />}
                        </Button>

                        <Button
                            onClick={handleResendOtp}
                            disabled={!isResendEnabled || resendLoading}
                            sx={{ mt: 2, textTransform: "none", fontWeight: "bold" }}
                        >
                            {resendLoading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : isResendEnabled ? "Resend OTP" : `Resend in ${timer}s`}
                        </Button>
                    </form>
                </Box>
            </Container>
        </Box>
    );
};

export default VerifyOtp;
