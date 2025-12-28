import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { artistCategoryTypes } from "../../../components/utils/data";
import { ProfileSchema } from "../../../components/utils/schema";
import { docsUpload, getPortfolioDetails, insertPortfolioData, updatePortfolio } from "../../../services/services";
import { getUserId } from "../../../services/axiosClient";
import ResumeUploadComponent from "./ResumeUploadComponent";

type PortfolioFormProps = {
  onSubmit: () => void;
  setProfileId: (id: string) => void;
  isEditing?: boolean;
  profileId: string
};

const PortfolioForm: React.FC<PortfolioFormProps> = ({
  onSubmit,
  setProfileId,
  profileId,
  isEditing = false
}) => {
  const [uploading, setUploading] = useState(false);

  const [portfolio, setPortfolio] = useState<any>({})
  const [resumeData, setResumeData] = useState<any>(null)
  
  useEffect(() => {
    if (isEditing && profileId) {
      getPortfolioDetails(getUserId()).then((res) => {
        setPortfolio(res?.data?.data)
      }).catch((err) => {
        console.log(err)
      })
    }
  }, [isEditing, profileId])

  // Handle resume data parsing
  const handleResumeParsed = (data: any) => {
    setResumeData(data);
    toast.success('Resume data extracted! Form fields have been populated.');
  };
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploading(true);
      let formData = new FormData();
      formData.append("files", selectedFile);

      try {

        const res = await docsUpload(formData);
        const uploadedUrl = res?.data?.data?.doc0;

        setFieldValue("coverPhoto", uploadedUrl);

        // console.log("File uploaded successfully:", uploadedUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
      } finally {
        setUploading(false);
      }
    }
  };
  const location = useLocation();
  const userId = location?.state?.id || new URLSearchParams(location.search).get('id');
  const firstName = location.state?.firstName || new URLSearchParams(location.search).get('firstName');
  const lastName = location.state?.lastName || new URLSearchParams(location.search).get('lastName');



  return (
    <>
      {/* Resume Upload Component */}
      <ResumeUploadComponent onResumeParsed={handleResumeParsed} />
      
      <Formik
        initialValues={{
          tagline: resumeData?.summary || portfolio?.tagline || "",
          about: resumeData?.summary || portfolio?.about || "",
          coverPhoto: portfolio?.coverPhoto || null,
          experienceOverview: resumeData?.summary || portfolio?.experienceOverview || "",
          socialLinks: {
            instagram: "",
            x: "",
            facebook: "",
            linkedin: "",
          },
          artistCategory: portfolio?.artistCategory || "",
          experience: resumeData?.experience?.length > 0 ? resumeData.experience.map((exp: any) => ({
            title: exp.title || "",
            dateRange: { 
              from: exp.duration?.split('-')[0]?.trim() || "", 
              to: exp.duration?.split('-')[1]?.trim() || "" 
            }, 
            description: exp.description || ""
          })) : [{ title: portfolio?.experience?.title || "", dateRange: { from: portfolio?.experience?.dateRange?.from || "", to: portfolio?.experience?.dateRange?.to || "" }, description: portfolio?.experience?.dateRange?.description || "" }],
          education: resumeData?.education?.length > 0 ? resumeData.education.map((edu: any) => ({
            degree: edu.degree || "",
            instituteName: edu.institute || "",
            year: edu.year || "",
            location: edu.location || ""
          })) : [{ degree: portfolio?.education?.degree || "", instituteName: portfolio?.education?.instituteName || "", year: portfolio?.education?.year || "", location: portfolio?.education?.location || "" }],
        }}
      validationSchema={ProfileSchema}
      enableReinitialize
      onSubmit={async (values) => {
        // console.log(values);
        const payLoad = {
          userId: userId,
          firstName: firstName,
          lastname: lastName,
          tagline: values.tagline,
          about: values.about,
          coverPhoto: values.coverPhoto,
          experienceOverview: values.experienceOverview,
          portfolioSocialLinks: values.socialLinks,
          artistCategory: values.artistCategory,

          experience: values.experience,

          // Education Fields
          education: values.education,
          // Social Links Fields
          // socialLinks:
        };
        const payLoad1 = {

          tagline: values.tagline,
          about: values.about,
          coverPhoto: values.coverPhoto,
          experienceOverview: values.experienceOverview,
          portfolioSocialLinks: values.socialLinks,
          artistCategory: values.artistCategory,
          experience: values.experience,
          education: values.education,

        };
        try {
          let res;
          if (isEditing) {
            res = await updatePortfolio(portfolio.id, payLoad1);
          } else {
            res = await insertPortfolioData(payLoad);
            const id = res?.data?.data?.id;
            setProfileId(id);
          }


          toast.success(res?.data?.msg || (isEditing ? "Portfolio updated successfully!" : "Portfolio created successfully!"));
          onSubmit();
        } catch (err: any) {
          toast.error(err?.response?.data?.message || "Something went wrong");
        }

        // insertPortfolioData(payLoad)
        //   .then((res: any) => {
        //     // console.log(res);
        //     const id = res?.data?.data?.id;
        //     setProfileId(id);

        //     toast(res?.data?.msg);
        //     onSubmit();
        //   })
        //   .catch((err: any) => {
        //     toast(err);
        //   });
      }}
    >
      {({
        values,
        handleChange,
        setFieldValue,
        validateForm,
        errors,
        handleSubmit,
        touched,
      }) => (
        <Form>
          {/* <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          <label>Upload Profile Photo</label>
          <input
            accept="image/*"
            type="file"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files[0]) {
                setFieldValue("profilePhoto", files[0]);
              }
            }}
          />
          </div> */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <label>Upload Cover Photo</label>
            <input
              accept="image/*"
              type="file"
              onChange={(e) => handleFileChange(e, setFieldValue)}
              disabled={uploading}
            />
          </div>
          <Field name="tagline">
            {({ field, meta }: any) => (
              <TextField
                {...field}
                label="Tagline"
                fullWidth
                margin="normal"
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
              />
            )}
          </Field>

          <Field name="about">
            {({ field, meta }: any) => (
              <TextField
                {...field}
                label="About"
                fullWidth
                margin="normal"
                error={meta.touched && Boolean(meta.error)}
                helperText={meta.touched && meta.error}
              />
            )}
          </Field>

          <FormControl fullWidth margin="normal">
            <InputLabel>Artist Category</InputLabel>
            <Field name="artistCategory">
              {({ field, meta }: any) => (
                <Select
                  {...field}
                  label="Artist Category"
                  error={meta.touched && Boolean(meta.error)}
                >
                  {artistCategoryTypes.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Field>
            <ErrorMessage name="artistCategory">
              {(msg) => (
                <div
                  style={{
                    color: "#d32f2f",
                    fontSize: "12px",
                    padding: "3px",
                    paddingLeft: "14px",
                  }}
                >
                  {msg}
                </div>
              )}
            </ErrorMessage>
          </FormControl>

          <Field
            name="experienceOverview"
            as={TextField}
            label="Experience Overview"
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />

          <FieldArray name="experience">
            {({ push, remove }) => (
              <div>
                <h4>Experience</h4>
                {values.experience.map((_: any, index: number) => (
                  <div key={index} style={{ marginBottom: "20px" }}>
                    <Field
                      name={`experience[${index}].title`}
                      as={TextField}
                      label="Title"
                      fullWidth
                      margin="normal"
                    />
                    <Field
                      name={`experience[${index}].dateRange.from`}
                      as={TextField}
                      label="From (Year)"
                      type="number"
                      fullWidth
                      margin="normal"
                    />
                    <Field
                      name={`experience[${index}].dateRange.to`}
                      as={TextField}
                      label="To (Year)"
                      type="number"
                      fullWidth
                      margin="normal"
                    />
                    <Field
                      name={`experience[${index}].description`}
                      as={TextField}
                      label="Description"
                      multiline
                      rows={3}
                      fullWidth
                      margin="normal"
                    />
                    <IconButton onClick={() => remove(index)}>
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </div>
                ))}
                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() =>
                    push({
                      title: "",
                      dateRange: { from: "", to: "" },
                      description: "",
                    })
                  }
                >
                  Add Experience
                </Button>
              </div>
            )}
          </FieldArray>

          <FieldArray name="education">
            {({ push, remove }) => (
              <div>
                <h4>Educational Qualifications</h4>
                {values.education.map((_: any, index: number) => (
                  <div key={index} style={{ marginBottom: "20px" }}>
                    <Field
                      name={`education[${index}].degree`}
                      as={TextField}
                      label="Degree"
                      fullWidth
                      margin="normal"
                    />
                    <Field
                      name={`education[${index}].instituteName`}
                      as={TextField}
                      label="Institute Name"
                      fullWidth
                      margin="normal"
                    />
                    <Field
                      name={`education[${index}].year`}
                      as={TextField}
                      label="Year"
                      type="number"
                      fullWidth
                      margin="normal"
                    />
                    <Field
                      name={`education[${index}].location`}
                      as={TextField}
                      label="Location (City, State, Country)"
                      fullWidth
                      margin="normal"
                    />
                    <IconButton onClick={() => remove(index)}>
                      <RemoveCircleOutlineIcon />
                    </IconButton>
                  </div>
                ))}
                <Button
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() =>
                    push({
                      degree: "",
                      instituteName: "",
                      year: "",
                      location: "",
                    })
                  }
                >
                  Add Education
                </Button>
              </div>
            )}
          </FieldArray>

          <Button
            sx={{ mt: 2 }}
            variant="contained"
            type="submit"
            onClick={async () => {
              const validationErrors = await validateForm();
              if (Object.keys(validationErrors).length > 0) {
                // Toast all errors
                Object.values(validationErrors).forEach((error: any) => {
                  if (typeof error === "string") {
                    toast.error(error);
                  } else if (typeof error === "object") {
                    Object.values(error).forEach((nestedError: any) => {
                      if (typeof nestedError === "string") {
                        toast.error(nestedError);
                      }
                    });
                  }
                });
              }
            }}
          >
            {isEditing ? "Update Portfolio" : "Save and Next"}

          </Button>
        </Form>
      )}
    </Formik>
    </>
  );
};

export default PortfolioForm;
