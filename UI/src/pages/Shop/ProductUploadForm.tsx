/* eslint-disable react-hooks/rules-of-hooks */
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
import * as Yup from "yup";
import { inputSx } from "../../components/utils/CommonStyle";
import { docsUpload, getProfile, insertCourse } from "../../services/services";
import {
  getfirstName,
  getlastName,
  getUserId,
  isLoggedIn,
} from "../../services/axiosClient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { artCategories } from "../../components/utils/data";

const licenseTypes = ["Free", "Paid", "Creative Commons", "Royalty-Free"];

const validationSchema = Yup.object().shape({
  productTitle: Yup.string()
    .required("Product title is required")
    .min(3, "Title must be at least 3 characters long"),
  category: Yup.string().required("Please select a category"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters long"),
  tags: Yup.string().required("Tags are required"),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Price cannot be negative"),
  releaseDate: Yup.date().required("Release date is required"),
  // thumbnail: Yup.mixed().required("Thumbnail is required"),
  licenseType: Yup.string().required("Please select a license type"),
});

const courseUploadForm = () => {
  const [user, setUser] = useState<any>({ firstName: "", lastName: "" });
  useEffect(() => {
    getProfile()
      .then((res: any) => {
        setUser(res?.data?.data);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, []);
  console.log(user);
  const initialValues = {
    productTitle: "",
    category: "",
    description: "",
    tags: "",
    price: "",
    discount: "",
    productType: "",
    releaseDate: "",
    thumbnail: null,
    licenseType: "",
    courseType: "",
  };
  const navigate = useNavigate();

  const handleSubmit = (values: any) => {
    console.log("Form Values:", values);
    const payLoad = {
      userId: getUserId(),
      firstName: user.firstName,
      lastName: user.lastName,
      title: values.productTitle,
      description: values.description,
      category: values.category,
      tags: values.tags,
      price: values.price,
      discount: values.discount,
      productType: values.productType,
      licenseType: values.licenseType,
      thumbnail: values.thumbnail,
      releaseDate: values.releaseDate,
      courseType: values.courseType,
    };
    console.log(payLoad);
    insertCourse(payLoad)
      .then((res: any) => {
        toast(res?.data?.msg);
        navigate("/upload", { state: res?.data?.data?.id });
      })
      .catch((err: any) => {
        console.log(err);
      });
  };
  const [uploading, setUploading] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const handleThumbnail = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
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

  return (
    <Box
      sx={{ padding: "1rem", backgroundColor: "#ffffff", minHeight: "100vh" }}
    >
      <Box
        sx={{
          maxWidth: 600,
          mx: "auto",
          mt: 5,
          p: 3,
          boxShadow: 3,
          backgroundColor: "#ffffff",
        }}
      >
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 2 }}>
          Product Upload Form
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                {/* Product Title */}
                <Grid item xs={12}>
                  <Field
                    sx={inputSx}
                    name="productTitle"
                    as={TextField}
                    label="Product Title"
                    fullWidth
                    error={touched.productTitle && Boolean(errors.productTitle)}
                    helperText={touched.productTitle && errors.productTitle}
                  />
                </Grid>

                {/* Category */}
                <Grid item xs={12}>
                  <Field
                    sx={inputSx}
                    select
                    label="Category"
                    name="category"
                    as={TextField}
                    fullWidth
                    displayEmpty
                    error={touched.category && Boolean(errors.category)}
                  >
                    {artCategories.map((category) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Field>
                  {touched.category && (
                    <FormHelperText sx={{ pl: 2 }} error>
                      {errors.category}
                    </FormHelperText>
                  )}
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <Field
                    sx={{
                      ...inputSx,
                      "& .MuiInputBase-root": {
                        resize: "vertical",
                        minHeight: "40px",
                        marginTop: "10px",
                      },
                      "& textarea": {
                        resize: "vertical",
                        minHeight: "40px",
                      },
                    }}
                    name="description"
                    as={TextField}
                    label="Description"
                    multiline
                    rows={2}
                    fullWidth
                    error={touched.description && Boolean(errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="courseType"
                    as={TextField}
                    select
                    label="Course Type"
                    fullWidth
                    sx={{ marginTop: "10px" }}
                    error={touched.courseType && Boolean(errors.courseType)}
                    helperText={touched.courseType && errors.courseType}
                  >
                    {["Video", "Audio", "PDF"].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>

                {/* Tags */}
                <Grid item xs={12}>
                  <Field
                    sx={inputSx}
                    name="tags"
                    as={TextField}
                    label="Tags (comma-separated)"
                    fullWidth
                    error={touched.tags && Boolean(errors.tags)}
                    helperText={touched.tags && errors.tags}
                  />
                </Grid>

                {/* Price */}
                <Grid item xs={12}>
                  <Field
                    sx={inputSx}
                    name="price"
                    as={TextField}
                    label="Price ($)"
                    type="number"
                    fullWidth
                    error={touched.price && Boolean(errors.price)}
                    helperText={touched.price && errors.price}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    sx={inputSx}
                    name="discount"
                    as={TextField}
                    label="Discount ($)"
                    type="number"
                    fullWidth
                    error={touched.discount && Boolean(errors.discount)}
                    helperText={touched.discount && errors.discount}
                  />
                </Grid>

                {/* Release Date */}
                <Grid item xs={12}>
                  <Field
                    sx={inputSx}
                    name="releaseDate"
                    as={TextField}
                    label="Release Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    error={touched.releaseDate && Boolean(errors.releaseDate)}
                    helperText={touched.releaseDate && errors.releaseDate}
                  />
                </Grid>

                {/* Thumbnail */}
                <Grid item xs={12}>
                  <InputLabel sx={{ p: 1.5 }}>Thumbnail</InputLabel>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleThumbnail(e, setFieldValue)}
                    disabled={uploading}
                  />
                  {thumbnailPreview && (
                    <div style={{ marginTop: "10px" }}>
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "200px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  )}
                  {touched.thumbnail && (
                    <FormHelperText error>{errors.thumbnail}</FormHelperText>
                  )}
                </Grid>

                {/* License Type */}
                <Grid item xs={12}>
                  <Field
                    sx={inputSx}
                    select
                    label="License Type"
                    name="licenseType"
                    as={TextField}
                    fullWidth
                    displayEmpty
                    error={touched.licenseType && Boolean(errors.licenseType)}
                  >
                    {licenseTypes.map((license) => (
                      <MenuItem value={license} key={license}>
                        {license}
                      </MenuItem>
                    ))}
                  </Field>
                  {touched.licenseType && (
                    <FormHelperText error>{errors.licenseType}</FormHelperText>
                  )}
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
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
                      marginTop: "20px",
                      width: "100%",
                      boxShadow: "none",
                    }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default courseUploadForm;
