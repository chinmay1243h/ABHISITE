import React from "react";
import {
    Box,
    TextField,
    Button,
    MenuItem,
    Typography,
    Select,
    FormControl,
    InputLabel,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { createNewsandBlogs, docsUpload, getProfile } from "../../../services/services";
import { getUserId } from "../../../services/axiosClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Validation schema using Yup
const validationSchema = Yup.object({
    thumbnail: Yup.mixed().nullable(), // Thumbnail is now optional
    title: Yup.string().required("Title is required"),
    author: Yup.string().required("Author name is required"),
    type: Yup.string().required("Type is required"),
    newsType: Yup.string().required("News Type is required"),
    description: Yup.string().required("Description is required"),
    // photoUrl: Yup.mixed().when("type", {
    //     is: "photo",
    //     then: Yup.mixed().required("Photo is required"),
    //     otherwise: Yup.mixed(),
    // }),
});

const AddNewsandBlogsPage: React.FC = () => {
    const initialValues = {
        thumbnail: null,
        title: "",
        author: "",
        type: "",
        newsType: "",
        videoUrl: "",
        description: "",
        photoUrl: null, // For photo URL
    };

    const navigate = useNavigate();

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            // Validate required fields
            if (!values.title || !values.author || !values.type || !values.newsType || !values.description) {
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

            // Clean up the payload - ensure thumbnail is null if not provided
            const payLoad = {
                ...values,
                userId: userId,
                thumbnail: values.thumbnail || null, // Set to null if empty/undefined
                photoUrl: values.photoUrl || null, // Set to null if empty/undefined
                videoUrl: values.videoUrl || null, // Set to null if empty/undefined
            }
            
            console.log("Creating news/blog with payload:", payLoad);
            
            const res = await createNewsandBlogs(payLoad);
            console.log("Create response:", res);
            
            const successMessage = res?.data?.msg || res?.data?.message || "News/Blog created successfully!";
            toast.success(successMessage);
            navigate('/admin-dashboard');
        } catch (err: any) {
            console.error("Error creating news/blog:", err);
            console.error("Error response:", err?.response);
            const errorMessage = err?.response?.data?.msg || 
                               err?.response?.data?.message ||
                               err?.message || 
                               "Failed to create news/blog. Please try again.";
            toast.error(errorMessage);
        }
    };

    async function handleFileUpload(
        event: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: any) => void,
        fieldName: string
    ): Promise<void> {
        const file = event.target.files?.[0];
        if (!file) {
            alert("Please select a valid file.");
            return;
        }

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
                setFieldValue(fieldName, uploadedUrl); // Update the respective field with the URL
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
    }

    return (
        <Box
            sx={{
                backgroundColor: "#fff",
                minHeight: "100vh",
                padding: "32px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    width: "100%",
                    padding: "24px",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        marginBottom: 3,
                        color: "#333",
                    }}
                >
                    Add News & Blogs
                </Typography>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, handleChange, setFieldValue }) => (
                        <Form>
                            {/* Thumbnail - Optional */}
                            <FormControl fullWidth margin="normal">
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        mb: 1,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Thumbnail (Optional)
                                </Typography>
                                <input
                                    id="thumbnail"
                                    name="thumbnail"
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) =>
                                        handleFileUpload(event, setFieldValue, "thumbnail")
                                    }
                                    style={{
                                        marginBottom: "16px",
                                        display: "block",
                                    }}
                                />
                                {touched.thumbnail && errors.thumbnail && (
                                    <Typography variant="caption" color="error">
                                        {errors.thumbnail}
                                    </Typography>
                                )}
                            </FormControl>

                            {/* Date */}
                            <TextField
                                fullWidth
                                margin="normal"
                                name="title"
                                label="Title"
                                type="text" // Regular text input for date
                                placeholder="Title"
                                value={values.title}
                                onChange={handleChange}
                                error={touched.title && Boolean(errors.title)}
                                helperText={touched.title && errors.title}
                            />

                            {/* Author */}
                            <TextField
                                fullWidth
                                margin="normal"
                                name="author"
                                label="Author"
                                value={values.author}
                                onChange={handleChange}
                                error={touched.author && Boolean(errors.author)}
                                helperText={touched.author && errors.author}
                            />

                            {/* Type (Dropdown) */}
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Type</InputLabel>
                                <Select
                                    name="type"
                                    value={values.type}
                                    onChange={handleChange}
                                    error={touched.type && Boolean(errors.type)}
                                >
                                    <MenuItem value="photo">Photo</MenuItem>
                                    <MenuItem value="video">Video</MenuItem>
                                </Select>

                            </FormControl>

                            {/* Photo File Uploader (Conditional Field) */}
                            {values.type === "photo" && (
                                <FormControl fullWidth margin="normal">
                                    <Typography
                                        variant="subtitle1"
                                        sx={{
                                            mb: 1,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Photo
                                    </Typography>
                                    <input
                                        id="photoUrl"
                                        name="photoUrl"
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) =>
                                            handleFileUpload(event, setFieldValue, "photoUrl")
                                        }
                                        style={{
                                            marginBottom: "16px",
                                            display: "block",
                                        }}
                                    />

                                </FormControl>
                            )}

                            {/* News Type (Dropdown) */}
                            <FormControl fullWidth margin="normal">
                                <InputLabel>News Type</InputLabel>
                                <Select
                                    name="newsType"
                                    value={values.newsType}
                                    onChange={handleChange}
                                    error={touched.newsType && Boolean(errors.newsType)}
                                >
                                    <MenuItem value="Hero Section">Hero Section</MenuItem>
                                    <MenuItem value="Trending News">Trending News</MenuItem>
                                    <MenuItem value="movie">Latest movie News</MenuItem>
                                    <MenuItem value="podcast">Latest podcast News</MenuItem>
                                    <MenuItem value="series">Latest series News</MenuItem>
                                    <MenuItem value="comic">Comic</MenuItem>
                                    <MenuItem value="game">Game</MenuItem>
                                    <MenuItem value="Culture & Lifestyle">Culture & Lifestyle</MenuItem>
                                    <MenuItem value="Trending News Video">Trending News Video</MenuItem>
                                </Select>
                                {touched.newsType && errors.newsType && (
                                    <Typography variant="caption" color="error">
                                        {errors.newsType}
                                    </Typography>
                                )}
                            </FormControl>



                            {/* Video URL (Conditional Field) */}
                            {values.type === "video" && (
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    name="videoUrl"
                                    label="Video URL"
                                    value={values.videoUrl}
                                    onChange={handleChange}

                                />
                            )}

                            {/* Description */}
                            <TextField
                                fullWidth
                                margin="normal"
                                name="description"
                                label="Description"
                                multiline
                                rows={4}
                                value={values.description}
                                onChange={handleChange}
                                error={touched.description && Boolean(errors.description)}
                                helperText={touched.description && errors.description}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{
                                    mt: 3,
                                    py: 1.5,
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}
                            >
                                Add News/Blog
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default AddNewsandBlogsPage;
