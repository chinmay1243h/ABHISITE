import React, { useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import color from "../../components/utils/Colors";
import { useNavigate } from "react-router-dom";



const jobTypes = [
  "View all",
  "Development",
  "Design",
  "Marketing",
  "Customer Service",
  "Operations",
  "Finance",
  "Management",
];

const JobBoard = ({ jobs }: any) => {
  const [selectedJobType, setSelectedJobType] = useState("View all");
  const navigate = useNavigate();

  const filteredJobs =
    selectedJobType === "View all"
      ? jobs
      : jobs.filter((job: any) => job.jobType === selectedJobType);

  return (
    <>
      <Box
        sx={{
          fontSize: "12px",
          margin: "auto",
          mb: 4,
          width: "fit-content",
        }}
      >
        <Typography
          style={{
            background: "black",
            color: "white",
            boxShadow: "4px 4px 1px black",
            padding: "2px 35px",
          }}
          className="heading2"
        >
          Current Openings
        </Typography>
      </Box>

      <Box sx={{ p: 3, background: "white", m: 2, mt: 0, borderRadius: 2 }}>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
          {jobTypes.map((type) => (
            <Button
              id="custom-button"
              style={{
                fontSize: "16px",
                borderRadius: "44px",
                margin: "0px",
                padding: "10px 25px",
                background: selectedJobType === type ? "black" : "transparent",
                color: selectedJobType === type ? "white" : "black",
                borderColor: "black",
              }}
              key={type}
              variant={selectedJobType === type ? "contained" : "outlined"}
              onClick={() => setSelectedJobType(type)}
            >
              {type}
            </Button>
          ))}
        </Box>

        <Grid container spacing={1}>
          {filteredJobs.map((job: any) => (
            <Grid item xs={12} key={job.id}>
              <Box
                sx={{
                  p: 2,
                  backgroundColor: "#fff",
                  borderTop: "solid 1px black",
                  // borderRadius: 2,
                  // boxShadow: 1,
                  display: "flex",
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    onClick={() => {
                      navigate(`/job-details/${job.id}`);
                    }}
                    sx={{
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {job.title}
                  </Typography>
                  <Typography
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                    variant="body1"
                  >
                    {job.overview}
                  </Typography>
                  <Box
                    sx={{
                      mt: 1,
                      display: "flex",
                      gap: 2,
                      color: color.textColor1,
                    }}
                  >
                    {/* <Typography variant="body2">{job.remote}</Typography> */}
                    <Typography variant="body2">{job.jobType}</Typography>
                  </Box>
                </Box>
                <Button
                  onClick={() => {
                    navigate("/job-application-form", { state: { id: job.id } });
                  }}
                  style={{
                    fontSize: "16px",
                    borderRadius: "44px",
                    color: "white",
                    borderColor: "black",
                    background: "black",
                  }}
                  id="custom-button"
                  variant="text"
                  endIcon={<span>↗</span>}
                >
                  Apply
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        sx={{
          fontSize: "12px",
          margin: "auto",
          mb: 4,
          mt: 6,
          width: "fit-content",
        }}
      >
        <Typography
          style={{
            background: "black",
            color: "white",
            boxShadow: "4px 4px 1px black",
            padding: "2px 35px",
          }}
          className="heading2"
        >
          Top Jobs
        </Typography>
      </Box>

      <Grid container spacing={1} sx={{ p: 2 }}>
        {jobs.map((job: any) => (
          <Grid item xs={12} sm={6} md={4} key={job.id}>
            <Box
              sx={{
                p: 2,
                backgroundColor: "white",
                border: "solid 1.5px",
                borderColor: color.textColor1,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  onClick={() => {
                    navigate("/job-details");
                  }}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {job.title}
                </Typography>
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  fontSize={"12px"}
                >
                  {job.overview}
                </Typography>
                <Box sx={{ mt: 1, display: "flex", gap: 2 }}>
                  {/* <Typography variant="body2" color={color.textColor1}>
                    {job.remote}
                  </Typography> */}
                  <Typography variant="body2" color={color.textColor1}>
                    {job.jobType}
                  </Typography>
                </Box>

                <Button
                  onClick={() => {
                    navigate("/job-application-form", { state: { id: job.id } });
                  }}
                  style={{
                    fontSize: "16px",
                    borderRadius: "44px",
                    color: "white",
                    borderColor: "black",
                    background: "black",
                    margin: 0,
                    marginTop: "16px",
                  }}
                  id="custom-button"
                  variant="text"
                  endIcon={<span>↗</span>}
                >
                  Apply
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default JobBoard;
