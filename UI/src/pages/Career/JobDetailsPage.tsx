import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getOneJob } from "../../services/services";
import color from "../../components/utils/Colors";

const JobDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [jobdetails, setJobDetails] = useState<any>({}); // Initialize as an object

  useEffect(() => {
    getOneJob(id).then((res) => {
      console.log(res);
      setJobDetails(res?.data?.data || {});
    });
  }, [id]);

  // Fallback in case data isn't loaded
  const updatedAtDate = jobdetails.updatedAt
    ? new Date(jobdetails.updatedAt).toLocaleDateString()
    : "N/A";

  return (
    <Box sx={{ padding: "1rem", backgroundColor: "#ffffff", minHeight: "100vh" }}>
      <Grid container>
        <Box
          sx={{
            width: "100%",
            background: color.firstColor,
            height: "250px",
            position: "relative",
            borderRadius: "6px",
          }}
        >
          <Avatar
            src="/path/to/logo.png"
            alt="Company Logo"
            sx={{
              width: 100,
              height: 100,
              position: "absolute",
              bottom: -50,
              left: 80,
            }}
          />
        </Box>

        <Grid item xs={12} md={8} sx={{ mt: 2 }}>
          <Card sx={{ padding: "2rem", backgroundColor: "#ffffff", mt: 2 }}>
            <Box display="flex" flexDirection="column" gap={2} mb="1rem">
              <Typography variant="h5" fontWeight="bold">
                {jobdetails.title || "Job Title"}
              </Typography>
            </Box>
            <Typography variant="body1" color="textSecondary">
              {jobdetails.company || "Company Name"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {jobdetails.location || "Location"}
            </Typography>

            <Box mt="2rem">
              <Typography variant="h6" fontWeight="bold" mb="1rem">
                Overview
              </Typography>
              <Typography variant="body1" style={{ fontFamily: "custom-regular" }}>
                {jobdetails.overview || "No overview provided."}
              </Typography>
            </Box>

            <Box mt="2rem">
              <Typography variant="h6" fontWeight="bold" mb="1rem">
                Responsibilities
              </Typography>
              <ul style={{ fontFamily: "custom-regular" }}>
                <li>{jobdetails.responsibilities || "No responsibilities listed."}</li>
              </ul>
            </Box>

            <Box mt="2rem">
              <Typography variant="h6" fontWeight="bold" mb="1rem">
                Skills
              </Typography>
              <Box display="flex" gap={1}>
                {(Array.isArray(jobdetails.skills) ? jobdetails.skills : []).map(
                  (skill: any, index: any) => (
                    <Chip key={index} label={skill} />
                  )
                )}
              </Box>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={4} sx={{ mt: 2, p: 2 }}>
          <Card sx={{ padding: "2rem", backgroundColor: "#ffffff", borderRadius: "12px" }}>
            <Typography variant="h6" fontWeight="bold" mb="1rem">
              {jobdetails.salary || "N/A"}
            </Typography>
            <Typography variant="body2" color="textSecondary" mb="1rem">
              Avg. salary
            </Typography>
            <Typography variant="body2" mb="1rem">
              <strong>Contact Email:</strong> {jobdetails.contactEmail || "N/A"}
            </Typography>
            <Typography variant="body2" mb="1rem">
              <strong>Job Type:</strong> {jobdetails.jobType || "N/A"}
            </Typography>
            <Typography variant="body2" mb="1rem">
              <strong>Category:</strong> {jobdetails.category || "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Posted:</strong> {updatedAtDate}
            </Typography>
            <Button
              style={{
                fontSize: "14px",
                borderRadius: "44px",
                color: "white",
                borderColor: "black",
                background: "black",
                margin: 0,
                marginTop: "20px",
              }}
              onClick={() => {
                navigate("/job-application-form", { state: { id: id } });
              }}
              id="custom-button"
              variant="text"
              endIcon={<span>↗</span>}
            >
              Apply For This Job
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobDetailsPage;