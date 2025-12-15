import { Box, Button, TextField, Typography } from "@mui/material";
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState, useCallback } from "react";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { inputSx } from "../../components/utils/CommonStyle";
import { getOneMovies, updateMovies, docsUpload, getProfile } from "../../services/services";
import { getUserId } from "../../services/axiosClient";
import { toast } from "react-toastify";

const validationSchema = Yup.object({
    poster: Yup.string().required("Poster is required"),
    title: Yup.string().required("Title is required"),
    year: Yup.number()
        .typeError("Year must be a number")
        .min(1888, "Enter a valid year")
        .max(new Date().getFullYear(), "Enter a valid year")
        .required("Year is required"),
    duration: Yup.string().required("Duration is required"),
    rating: Yup.number()
        .typeError("Rating must be a number")
        .min(0, "Rating must be at least 0")
        .max(10, "Rating cannot exceed 10")
        .required("Rating is required"),
    age: Yup.string().required("Age is required"),
    overview: Yup.string().required("Overview is required"),
    plot: Yup.string().required("Plot is required"),
    trailer: Yup.string().url("Enter a valid YouTube link").required("Trailer link is required"),
    images: Yup.string().required("An image is required"), // Single image
});

const EditMovie: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<any>(null);
    const [posterPreview, setPosterPreview] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const fetchMovieDetails = useCallback(async () => {
        try {
            const res = await getOneMovies(id);
            const movieData = res?.data?.data;

            if (movieData) {
                setPosterPreview(movieData.poster || null);
                setImagePreview(movieData.images || null); // Expecting a single image
                setInitialValues({
                    poster: movieData.poster || "",
                    title: movieData.title || "",
                    year: movieData.year || "",
                    duration: movieData.duration || "",
                    rating: movieData.rating || "",
                    age: movieData.age || "",
                    overview: movieData.overview || "",
                    plot: movieData.plot || "",
                    trailer: movieData.trailer || "",
                    images: movieData.images || "",
                });
            }
        } catch (error: any) {
            console.error("Error fetching movie details:", error);
            toast.error("Failed to load movie details.");
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchMovieDetails();
        }
    }, [id, fetchMovieDetails]);

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: any) => void,
        fieldName: string
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("files", file);

        try {
            console.log(`Uploading ${fieldName}...`);
            const res = await docsUpload(formData);
            console.log("Upload response:", res);
            console.log("Response data:", res?.data);
            console.log("Response data.data:", res?.data?.data);
            
            // Check multiple possible response structures
            const uploadedUrl = res?.data?.data?.doc0 || 
                                 res?.data?.doc0 || 
                                 res?.data?.data?.doc1 ||
                                 res?.data?.doc1 ||
                                 (res?.data?.data && Object.values(res?.data?.data)[0]) ||
                                 (res?.data && typeof res?.data === 'string' ? res?.data : null);

            if (uploadedUrl) {
                console.log(`Uploaded ${fieldName} URL:`, uploadedUrl);
                if (fieldName === "poster") {
                    setPosterPreview(uploadedUrl);
                    setFieldValue("poster", uploadedUrl);
                } else if (fieldName === "images") {
                    setImagePreview(uploadedUrl);
                    setFieldValue("images", uploadedUrl);
                }
                toast.success(`${fieldName} uploaded successfully!`);
            } else {
                console.error("Upload response structure:", JSON.stringify(res, null, 2));
                toast.error("File uploaded, but no URL was returned. Please check the server logs.");
                alert("File uploaded, but no URL was returned. Please try again or contact support.");
            }
        } catch (error: any) {
            console.error(`Error uploading ${fieldName}:`, error);
            console.error("Error response:", error?.response);
            const errorMessage = error?.response?.data?.msg || 
                                 error?.response?.data?.message ||
                                 error?.message || 
                                 "An error occurred during file upload. Please try again.";
            toast.error(errorMessage);
            alert(errorMessage);
        }
    };

    const handleSubmit = async (values: any) => {
        try {
            // Validate required fields
            if (!values.title || !values.year || !values.duration || !values.rating || !values.overview || !values.plot) {
                toast.error("Please fill in all required fields");
                return;
            }

            // Validate userId - try to get from token first, then from profile
            let userId = getUserId();
            console.log("User ID from token:", userId);
            
            // If user ID is not in token (old token), try to get from profile
            if (!userId || userId === '' || userId === '0') {
                try {
                    // Try to get user ID from profile API as fallback
                    const profileRes = await getProfile();
                    userId = profileRes?.data?.data?.id || profileRes?.data?.data?._id;
                    console.log("User ID from profile:", userId);
                    
                    if (!userId || userId === '' || userId === '0') {
                        toast.error("User ID not found. Please login again.");
                        console.error("No valid user ID found. Please log out and log back in.");
                        return;
                    }
                } catch (profileError: any) {
                    console.error("Error fetching profile:", profileError);
                    // Check if it's an authentication error
                    if (profileError?.response?.status === 401) {
                        toast.error("Session expired. Please login again.");
                        // Redirect to login page
                        navigate('/login');
                        return;
                    }
                    toast.error("Unable to verify user identity. Please login again.");
                    return;
                }
            }

            const payLoad = {
                ...values,
                userId: userId,
            };
            
            console.log("Updating movie with payload:", payLoad);
            
            const res = await updateMovies(payLoad, id);
            console.log("Update response:", res);
            
            const successMessage = res?.data?.msg || res?.data?.message || "Movie updated successfully!";
            toast.success(successMessage);
            navigate("/admin-dashboard");
        } catch (error: any) {
            console.error("Error updating movie:", error);
            console.error("Error response:", error?.response);
            const errorMessage = error?.response?.data?.msg || 
                                 error?.response?.data?.message ||
                                 error?.message || 
                                 "Failed to update movie. Please try again.";
            toast.error(errorMessage);
        }
    };

    if (!initialValues) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ padding: "1rem", backgroundColor: "#ffffff", minHeight: "100vh" }}>
            <Box sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 3, boxShadow: 3, backgroundColor: "#ffffff" }}>
                <Typography variant="h4" gutterBottom align="center">
                    Edit Movie
                </Typography>
                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit} enableReinitialize>
                    {({ errors, touched, setFieldValue }) => (
                        <Form>
                            <Box sx={{ maxWidth: "500px", margin: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
                                {/* Poster Upload */}
                                <label>Poster:</label>
                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setFieldValue, "poster")} />
                                {posterPreview && <img src={posterPreview} alt="Poster Preview" style={{ width: "100%", marginBottom: "16px" }} />}
                                {touched.poster && errors.poster && <Typography color="error"></Typography>}

                                {/* Fields */}
                                <Field name="title" as={TextField} label="Title" sx={inputSx} error={touched.title && Boolean(errors.title)} helperText={touched.title && errors.title} />
                                <Field name="year" as={TextField} label="Year" type="number" sx={inputSx} error={touched.year && Boolean(errors.year)} helperText={touched.year && errors.year} />
                                <Field name="duration" as={TextField} label="Duration" sx={inputSx} error={touched.duration && Boolean(errors.duration)} helperText={touched.duration && errors.duration} />
                                <Field name="rating" as={TextField} label="Rating" type="number" sx={inputSx} error={touched.rating && Boolean(errors.rating)} helperText={touched.rating && errors.rating} />
                                <Field name="age" as={TextField} label="Age Restriction" sx={inputSx} error={touched.age && Boolean(errors.age)} helperText={touched.age && errors.age} />
                                <Field name="overview" as={TextField} label="Overview" multiline rows={2} sx={inputSx} error={touched.overview && Boolean(errors.overview)} helperText={touched.overview && errors.overview} />
                                <Field name="plot" as={TextField} label="Plot" multiline rows={2} sx={inputSx} error={touched.plot && Boolean(errors.plot)} helperText={touched.plot && errors.plot} />
                                <Field name="trailer" as={TextField} label="Trailer YouTube Link" sx={inputSx} error={touched.trailer && Boolean(errors.trailer)} helperText={touched.trailer && errors.trailer} />

                                {/* Single Image Upload */}
                                <label>Image:</label>
                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setFieldValue, "images")} />
                                {imagePreview && <img src={imagePreview} alt="Uploaded" style={{ width: "100%", height: "150px", objectFit: "cover", marginTop: "10px", borderRadius: "8px" }} />}
                                {touched.images && errors.images && <Typography color="error"></Typography>}

                                {/* Submit Button */}
                                <Button type="submit" variant="contained" sx={{ mt: 2, width: "100%" }}>
                                    Update Movie
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default EditMovie;
