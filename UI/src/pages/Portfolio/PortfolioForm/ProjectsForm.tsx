import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, TextField, CircularProgress } from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  docsUpload,
  editPortfolioProject,
  insertPortfolioProjectData,
  getPortfolioProjectDetails,
  deletePortfolioProject
} from "../../../services/services";

interface Project {
  id?: string;
  imageFile: string | null;
  title: string;
  description: string;
  role: string;
  date: string;
  collaborators: string;
  location: string;
  awards: string;
  porfolioId: string;
}

interface ProjectsTabProps {
  onSubmit: (values: any) => void;
  profileId: string;
  isEditing?: boolean;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({
  onSubmit,
  profileId,
  isEditing = false
}) => {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<{ projects: Project[] }>({
    projects: [{
      id: "",
      imageFile: null,
      title: "",
      description: "",
      role: "",
      date: "",
      collaborators: "",
      location: "",
      awards: "",
      porfolioId: profileId,
    }]
  });

  // Fetch all existing projects when in edit mode
  useEffect(() => {
    if (isEditing && profileId) {
      const payLoad = {
        data: { filter: "", portfolioId: profileId },
        page: 0,
        pageSize: 50,
        order: [["createdAt", "ASC"]],
      };
      getPortfolioProjectDetails(payLoad)
        .then((res) => {
          const projectsData = res?.data?.data?.rows;
          if (projectsData && projectsData.length > 0) {
            setInitialValues({
              projects: projectsData.map((project: any) => ({
                id: project.id,
                imageFile: project.imageFile || null,
                title: project.title || "",
                description: project.description || "",
                role: project.role || "",
                date: project.date || "",
                collaborators: project.collaborators || "",
                location: project.location || "",
                awards: project.awards || "",
                porfolioId: profileId,
              }))
            });
          } else {
            // If no projects exist, initialize with one empty project
            setInitialValues({
              projects: [{
                imageFile: null,
                title: "",
                description: "",
                role: "",
                date: "",
                collaborators: "",
                location: "",
                awards: "",
                porfolioId: profileId,
              }]
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching project data:", err);
          toast.error("Failed to load project data");
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
      setUploading(true);
      const formData = new FormData();
      formData.append("files", selectedFile);

      try {
        const res = await docsUpload(formData);
        const uploadedUrl = res?.data?.data?.doc0;
        setFieldValue(`projects[${index}].imageFile`, uploadedUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("File upload failed");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDelete = async (projectId: string, remove: (index: number) => void, index: number) => {
    if (!projectId) {
      // If no ID, just remove from form (wasn't saved yet)
      remove(index);
      return;
    }

    try {
      await deletePortfolioProject(projectId);
      toast.success("Project deleted successfully!");
      remove(index);
    } catch (err: any) {
      console.error("Error deleting project:", err);
      toast.error(err?.response?.data?.message || "Failed to delete project");
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      if (isEditing) {
        // Handle updates for existing projects and creates for new ones
        const updateOperations = values.projects.map(project => {
          const projectData = {
            imageFile: project.imageFile,
            title: project.title,
            description: project.description,
            role: project.role,
            date: project.date,
            collaborators: project.collaborators,
            location: project.location,
            awards: project.awards,
            porfolioId: profileId
          };

          if (project.id) {
            // Update existing project with its ID
            return editPortfolioProject(project.id, projectData);
          } else {
            // Create new project
            return insertPortfolioProjectData({
              portfolioProject: [projectData],
              portfolioId: profileId
            });
          }
        });

        await Promise.all(updateOperations);
        toast.success("Projects updated successfully!");
      } else {
        // Create new projects
        await insertPortfolioProjectData({
          portfolioProject: values.projects.map(project => ({
            ...project,
            porfolioId: profileId
          })),
          portfolioId: profileId
        });
        toast.success("Projects added successfully!");
      }

      onSubmit(profileId);
    } catch (err: any) {
      console.error("Error:", err);
      toast.error(err?.response?.data?.message || "Operation failed");
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
          <FieldArray name="projects">
            {({ push, remove }) => (
              <div>
                <h4>Projects</h4>
                {values.projects.map((project, index) => (
                  <div key={index} style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #eee" }}>
                    {project.id && (
                      <input type="hidden" name={`projects[${index}].id`} value={project.id} />
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1rem" }}>
                      <label>Upload Image:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleFileChange(event, setFieldValue, index)}
                        disabled={uploading}
                      />
                      {project.imageFile && (
                        <img
                          src={project.imageFile}
                          alt="Project preview"
                          style={{ maxWidth: "200px", maxHeight: "200px" }}
                        />
                      )}
                    </div>

                    <TextField
                      name={`projects[${index}].title`}
                      label="Title"
                      fullWidth
                      margin="normal"
                      value={project.title}
                      onChange={(e) => setFieldValue(`projects[${index}].title`, e.target.value)}
                    />
                    <TextField
                      name={`projects[${index}].description`}
                      label="Description"
                      multiline
                      rows={4}
                      fullWidth
                      margin="normal"
                      value={project.description}
                      onChange={(e) => setFieldValue(`projects[${index}].description`, e.target.value)}
                    />
                    <TextField
                      name={`projects[${index}].role`}
                      label="Role"
                      fullWidth
                      margin="normal"
                      value={project.role}
                      onChange={(e) => setFieldValue(`projects[${index}].role`, e.target.value)}
                    />
                    <TextField
                      name={`projects[${index}].date`}
                      label="Date"
                      fullWidth
                      margin="normal"
                      value={project.date}
                      onChange={(e) => setFieldValue(`projects[${index}].date`, e.target.value)}
                    />
                    <TextField
                      name={`projects[${index}].collaborators`}
                      label="Collaborators"
                      fullWidth
                      margin="normal"
                      value={project.collaborators}
                      onChange={(e) => setFieldValue(`projects[${index}].collaborators`, e.target.value)}
                    />
                    <TextField
                      name={`projects[${index}].location`}
                      label="Location"
                      fullWidth
                      margin="normal"
                      value={project.location}
                      onChange={(e) => setFieldValue(`projects[${index}].location`, e.target.value)}
                    />
                    <TextField
                      name={`projects[${index}].awards`}
                      label="Awards"
                      fullWidth
                      margin="normal"
                      value={project.awards}
                      onChange={(e) => setFieldValue(`projects[${index}].awards`, e.target.value)}
                    />

                    <Button
                      onClick={() => handleDelete(project.id || "", remove, index)}
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      sx={{ mt: 2 }}
                    >
                      Remove Project
                    </Button>
                  </div>
                ))}

                <Button
                  onClick={() =>
                    push({
                      imageFile: null,
                      title: "",
                      description: "",
                      role: "",
                      date: "",
                      collaborators: "",
                      location: "",
                      awards: "",
                      porfolioId: profileId,
                    })
                  }
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  sx={{ mt: 2 }}
                >
                  Add Another Project
                </Button>
              </div>
            )}
          </FieldArray>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || uploading}
            sx={{ mt: 4 }}
          >
            {isSubmitting ? "Processing..." : (isEditing ? "Update Projects" : "Save Projects")}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default ProjectsTab;