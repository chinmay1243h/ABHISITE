import React, { useState, useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  getportfolioAchivement,
  insertPortfolioAchivements,
  editPortfolioAchivememts
} from "../../../services/services";
import { toast } from "react-toastify";

interface AchievementsTabProps {
  onSubmit: (values: any) => void;
  profileId: string;
  isEditing?: boolean;
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({
  onSubmit,
  profileId,
  isEditing = false
}) => {
  console.log(profileId)
  const [initialValues, setInitialValues] = useState({
    id: "",
    achievements: [""],
    testimonies: [{
      name: "",
      relation: "",
      content: ""
    }]
  });
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<{ type: string, index: number } | null>(null);

  // Fetch existing achievements when in edit mode
  useEffect(() => {
    if (isEditing && profileId) {
      const payLoad = {
        data: { filter: "", portfolioId: profileId },
        page: 0,
        pageSize: 50,
        order: [["createdAt", "ASC"]],
      };
      getportfolioAchivement(payLoad)
        .then((res: any) => {
          const data = res?.data?.data?.rows?.[0]; // Get first record
          if (data) {
            setInitialValues({
              id: data.id,
              achievements: data.achievements?.length ? data.achievements : [""],
              testimonies: data.testimonies?.length ? data.testimonies : [{
                name: "",
                relation: "",
                content: ""
              }]
            });
          }
          setLoading(false);
        })
        .catch((err: any) => {
          console.error("Error fetching achievements:", err);
          toast.error("Failed to load achievements");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isEditing, profileId]);

  const handleDeleteAchievement = (remove: (index: number) => void, index: number) => {
    setDeleting({ type: 'achievement', index });
    remove(index);
    setDeleting(null);
  };

  const handleDeleteTestimonial = (remove: (index: number) => void, index: number) => {
    setDeleting({ type: 'testimonial', index });
    remove(index);
    setDeleting(null);
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      const payload = {
        id: values.id, // Include the portfolioAchivements ID for updates
        portfolioId: profileId,
        achievements: values.achievements.filter(a => a.trim() !== ""),
        testimonies: values.testimonies.filter(t =>
          t.name.trim() !== "" && t.content.trim() !== ""
        )
      };

      const payload1 = {

        portfolioId: profileId,
        achievements: values.achievements.filter(a => a.trim() !== ""),
        testimonies: values.testimonies.filter(t =>
          t.name.trim() !== "" && t.content.trim() !== ""
        )
      };
      if (isEditing && values.id) {
        // Update using the portfolioAchivements record ID
        await editPortfolioAchivememts(values.id, payload);
        toast.success("Achievements updated successfully!");
      } else {
        // Create new record
        await insertPortfolioAchivements(payload1);
        toast.success("Achievements added successfully!");
      }
      onSubmit(profileId);
    } catch (err: any) {
      console.error("Error saving achievements:", err);
      toast.error(err?.response?.data?.message || "Failed to save achievements");
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Form>
          <input type="hidden" name="id" value={values.id} />

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Awards & Honors
            </Typography>

            <FieldArray name="achievements">
              {({ push, remove }) => (
                <div>
                  {values.achievements.map((achievement, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TextField
                        name={`achievements[${index}]`}
                        label={`Achievement ${index + 1}`}
                        fullWidth
                        variant="outlined"
                        size="small"
                        value={achievement}
                        onChange={(e) => setFieldValue(`achievements[${index}]`, e.target.value)}
                      />
                      <IconButton
                        onClick={() => handleDeleteAchievement(remove, index)}
                        sx={{ ml: 1 }}
                        disabled={values.achievements.length <= 1 ||
                          (deleting?.type === 'achievement' && deleting.index === index)}
                      >
                        {deleting?.type === 'achievement' && deleting.index === index ? (
                          <CircularProgress size={24} />
                        ) : (
                          <DeleteIcon color="error" />
                        )}
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => push("")}
                    variant="outlined"
                  >
                    Add Achievement
                  </Button>
                </div>
              )}
            </FieldArray>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Testimonials
            </Typography>

            <FieldArray name="testimonies">
              {({ push, remove }) => (
                <div>
                  {values.testimonies.map((testimonial, index) => (
                    <Box key={index} sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                      <TextField
                        name={`testimonies[${index}].name`}
                        label="Name"
                        fullWidth
                        margin="normal"
                        size="small"
                        value={testimonial.name}
                        onChange={(e) => setFieldValue(`testimonies[${index}].name`, e.target.value)}
                      />
                      <TextField
                        name={`testimonies[${index}].relation`}
                        label="Relation"
                        fullWidth
                        margin="normal"
                        size="small"
                        value={testimonial.relation}
                        onChange={(e) => setFieldValue(`testimonies[${index}].relation`, e.target.value)}
                      />
                      <TextField
                        name={`testimonies[${index}].content`}
                        label="Testimonial"
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                        value={testimonial.content}
                        onChange={(e) => setFieldValue(`testimonies[${index}].content`, e.target.value)}
                      />
                      <Button
                        startIcon={
                          deleting?.type === 'testimonial' && deleting.index === index ? (
                            <CircularProgress size={16} color="error" />
                          ) : (
                            <DeleteIcon />
                          )
                        }
                        onClick={() => handleDeleteTestimonial(remove, index)}
                        color="error"
                        disabled={values.testimonies.length <= 1 ||
                          (deleting?.type === 'testimonial' && deleting.index === index)}
                        sx={{ mt: 1 }}
                      >
                        Remove Testimonial
                      </Button>
                    </Box>
                  ))}
                  <Button
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={() => push({ name: "", relation: "", content: "" })}
                    variant="outlined"
                  >
                    Add Testimonial
                  </Button>
                </div>
              )}
            </FieldArray>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default AchievementsTab;