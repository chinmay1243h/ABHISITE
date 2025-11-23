import React, { useState, useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import { Button, Box, Grid, IconButton, CircularProgress } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  docsUpload,
  editPortfolioPhoto,
  getPortfolioPhoto,
  insertPortfolioPhotos,
  deletePortfolioPhoto
} from "../../../services/services";
import { toast } from "react-toastify";

interface Photo {
  id?: string;
  url: string;
  portfolioId: string;
}

interface PhotosTabProps {
  onSubmit: (values: any) => void;
  profileId: string;
  isEditing?: boolean;
}

const PhotosTab: React.FC<PhotosTabProps> = ({
  onSubmit,
  profileId,
  isEditing = false
}) => {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<{ photos: Photo[] }>({
    photos: [{
      url: "",
      portfolioId: profileId
    }]
  });

  // Fetch existing photos when in edit mode
  useEffect(() => {
    if (isEditing && profileId) {
      const payLoad = {
        data: { filter: "", portfolioId: profileId },
        page: 0,
        pageSize: 50,
        order: [["createdAt", "ASC"]],
      };
      getPortfolioPhoto(payLoad)
        .then((res) => {
          const photosData = res?.data?.data?.rows;
          if (photosData && photosData.length > 0) {
            setInitialValues({
              photos: photosData.map((photo: any) => ({
                id: photo.id,
                url: photo.url || "",
                portfolioId: profileId
              }))
            });
          } else {
            setInitialValues({
              photos: [{
                url: "",
                portfolioId: profileId
              }]
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching photos:", err);
          toast.error("Failed to load photos");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isEditing, profileId]);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    index: number
  ) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploadingIndex(index);
      const formData = new FormData();
      formData.append("files", selectedFile);

      try {
        const res = await docsUpload(formData);
        const uploadedUrl = res?.data?.data?.doc0;
        setFieldValue(`photos[${index}].url`, uploadedUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("File upload failed");
      } finally {
        setUploadingIndex(null);
      }
    }
  };

  const handleDeletePhoto = async (photoId: string | undefined, remove: (index: number) => void, index: number) => {
    if (!photoId) {
      // If no ID, just remove from form (wasn't saved yet)
      remove(index);
      return;
    }

    try {
      await deletePortfolioPhoto(photoId);
      toast.success("Photo deleted successfully!");
      remove(index);
    } catch (err: any) {
      console.error("Error deleting photo:", err);
      toast.error(err?.response?.data?.message || "Failed to delete photo");
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      // Filter out empty photos
      const photosToSubmit = values.photos.filter(photo => photo.url.trim() !== "");

      // if (photosToSubmit.length === 0) {
      //   toast.warning("Please upload at least one photo");
      //   return;
      // }

      if (isEditing) {
        // Handle updates for existing photos and creates for new ones
        const updateOperations = photosToSubmit.map(photo => {
          if (photo.id) {
            // Update existing photo
            return editPortfolioPhoto(photo.id, { url: photo.url });
          } else {
            // Create new photo
            return insertPortfolioPhotos({
              portfolioId: profileId,
              url: photo.url
            });
          }
        });

        await Promise.all(updateOperations);
        toast.success("Photos updated successfully!");
      } else {
        // Create new photos
        await insertPortfolioPhotos({
          portfolioId: profileId,
          photos: photosToSubmit.map(photo => photo.url)
        });
        toast.success("Photos added successfully!");
      }

      onSubmit(profileId);
    } catch (err: any) {
      console.error("Error saving photos:", err);
      toast.error(err?.response?.data?.message || "Failed to save photos");
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
          <FieldArray name="photos">
            {({ push, remove }) => (
              <div>
                <h4>Photos</h4>
                {values.photos.map((photo, index) => (
                  <Box key={index} sx={{ mb: 4, p: 2, border: '1px solid #eee', borderRadius: 1 }}>
                    {photo.id && (
                      <input type="hidden" name={`photos[${index}].id`} value={photo.id} />
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                      <label htmlFor={`photo-upload-${index}`}>
                        <Button
                          variant="contained"
                          component="span"
                          disabled={uploadingIndex === index}
                        >
                          {uploadingIndex === index ? "Uploading..." : "Select Photo"}
                        </Button>
                      </label>
                      <input
                        id={`photo-upload-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setFieldValue, index)}
                        style={{ display: 'none' }}
                        disabled={uploadingIndex === index}
                      />

                      {uploadingIndex === index && <CircularProgress size={24} />}

                      {photo.url && (
                        <Box sx={{ position: 'relative', maxWidth: 400 }}>
                          <img
                            src={photo.url}
                            alt={`Preview ${index + 1}`}
                            style={{
                              width: '100%',
                              height: 'auto',
                              borderRadius: '8px',
                              border: '1px solid #ddd'
                            }}
                          />
                          <IconButton
                            onClick={() => handleDeletePhoto(photo.id, remove, index)}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              backgroundColor: 'rgba(255,255,255,0.7)',
                              '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.9)'
                              }
                            }}
                          >
                            <DeleteIcon color="error" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </Box>
                ))}

                <Button
                  onClick={() => push({ url: "", portfolioId: profileId })}
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{ mt: 2 }}
                >
                  Add Another Photo
                </Button>
              </div>
            )}
          </FieldArray>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || uploadingIndex !== null}
            sx={{ mt: 4 }}
          >
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Photos' : 'Save Photos')}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default PhotosTab;