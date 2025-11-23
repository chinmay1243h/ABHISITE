import React, { useEffect, useState } from "react";
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

import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { docsUpload, getOneNewsRecord, updateNewsAndBlogRecod } from "../../../services/services";

// Validation schema
const validationSchema = Yup.object({
    thumbnail: Yup.mixed().nullable(), // Thumbnail is now optional
    title: Yup.string().required("Title is required"),
    author: Yup.string().required("Author name is required"),
    type: Yup.string().required("Type is required"),
    newsType: Yup.string().required("News Type is required"),
    description: Yup.string().required("Description is required"),
});

const EditNewsAndBlogs: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [initialValues, setInitialValues] = useState({
        thumbnail: null,
        title: "",
        author: "",
        type: "",
        newsType: "",
        videoUrl: "",
        description: "",
        photoUrl: null,
    });

    useEffect(() => {
        fetchNewsData();
    }, []);

    const fetchNewsData = async () => {
        try {
            await getOneNewsRecord(id).then((res) => {
                setInitialValues(res?.data?.data);
            })

        } catch (error: any) {
            console.error("Error fetching news/blog:", error);
            const errorMessage = error?.response?.data?.msg || error?.message || "Failed to fetch news/blog data";
            toast.error(errorMessage);
        }
    };

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            // Clean up the payload - ensure thumbnail is null if not provided
            const payLoad = {
                ...values,
                thumbnail: values.thumbnail || null, // Set to null if empty/undefined
                photoUrl: values.photoUrl || null, // Set to null if empty/undefined
                videoUrl: values.videoUrl || null, // Set to null if empty/undefined
            }
            console.log("Updating news/blog with payload:", payLoad);
            await updateNewsAndBlogRecod(payLoad, id);
            toast.success("News/Blog updated successfully!");
            navigate("/admin-dashboard");
        } catch (error: any) {
            console.error("Error updating news/blog:", error);
            const errorMessage = error?.response?.data?.msg || error?.message || "Failed to update news/blog";
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
            const res = await docsUpload(formData);
            const uploadedUrl = res?.data?.data?.doc0;
            if (uploadedUrl) {
                setFieldValue(fieldName, uploadedUrl); // Update the respective field with the URL
            } else {
                alert("File uploaded, but no URL was returned.");
            }
        } catch (error: any) {
            console.error(`Error uploading ${fieldName}:`, error);
            const errorMessage = error?.response?.data?.msg || error?.message || "An error occurred during file upload. Please try again.";
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
                    maxWidth: "600px",
                    padding: "24px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        marginBottom: 3,
                        color: "#333",
                        textAlign: "center",
                    }}
                >
                    Edit News & Blogs
                </Typography>
                <Formik
                    enableReinitialize
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
                                type="text"
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
                                Update News/Blog
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default EditNewsAndBlogs;
