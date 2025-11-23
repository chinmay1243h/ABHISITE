import {
    Box,
    Button,
    FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { inputSx } from "../../components/utils/CommonStyle";
import { docsUpload, getOneCourse, updateCourse } from "../../services/services";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { artCategories } from "../../components/utils/data";
import { title } from "process";





const EditCourseForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<any>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        getOneCourse(id)
            .then((res: any) => {
                const course = res.data.data;
                setInitialValues({
                    productTitle: course.title,
                    category: course.category,
                    description: course.description,
                    tags: course.tags,
                    price: course.price,
                    discount: course.discount,
                    productType: course.productType,
                    releaseDate: course.releaseDate,
                    thumbnail: course.thumbnail,
                    licenseType: course.licenseType,
                    courseType: course.courseType,
                });
                setThumbnailPreview(course.thumbnail);
            })
            .catch((err: any) => console.error("Error fetching course data:", err));
    }, [id]);

    const handleSubmit = (values: any) => {
        const payload = {
            title: values.productTitle,
            ...values
        };
        updateCourse(payload, id)
            .then((res: any) => {
                console.log("Update Response:", res);
                toast.success("Course updated successfully!");
                navigate("/artist-courses");
            })
            .catch((err: any) => console.error("Error updating course:", err));
    };

    const handleThumbnail = async (e: any, setFieldValue: any) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("files", file);
            setUploading(true);
            try {
                const res = await docsUpload(formData);
                const uploadedUrl = res?.data?.data?.doc0;
                setThumbnailPreview(uploadedUrl);
                setFieldValue("thumbnail", uploadedUrl);
            } catch (error) {
                console.error("Error uploading file:", error);
            } finally {
                setUploading(false);
            }
        }
    };

    if (!initialValues) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ padding: "1rem", backgroundColor: "#ffffff", minHeight: "100vh" }}>
            <Box sx={{ maxWidth: 600, mx: "auto", mt: 5, p: 3, boxShadow: 3, backgroundColor: "#ffffff" }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ mb: 2 }}>
                    Edit Course
                </Typography>
                <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
                    {({ errors, touched, setFieldValue }) => (
                        <Form>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Field sx={inputSx} name="productTitle" as={TextField} label="Product Title" fullWidth error={touched.productTitle && Boolean(errors.productTitle)} helperText={touched.productTitle && errors.productTitle} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field sx={inputSx} select label="Category" name="category" as={TextField} fullWidth>
                                        {artCategories.map((category) => (
                                            <MenuItem key={category.value} value={category.value}>{category.name}</MenuItem>
                                        ))}
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    <Field sx={inputSx} name="description" as={TextField} label="Description" multiline rows={2} fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field sx={inputSx} name="tags" as={TextField} label="Tags" fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field sx={inputSx} name="price" as={TextField} label="Price ($)" type="number" fullWidth />
                                </Grid>
                                <Grid item xs={12}>
                                    <InputLabel sx={{ p: 1.5 }}>Thumbnail</InputLabel>
                                    <input type="file" accept="image/*" onChange={(e) => handleThumbnail(e, setFieldValue)} disabled={uploading} />
                                    {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "cover" }} />}
                                </Grid>
                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Update</Button>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Box>
    );
};

export default EditCourseForm;
