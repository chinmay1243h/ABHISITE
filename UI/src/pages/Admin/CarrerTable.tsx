import React, { useEffect, useState } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Typography,
    IconButton,
} from "@mui/material";
import { deleteJobs, getAllAppliedJobsBelongsTo } from "../../services/services"; // Custom function for fetching data
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";

const CareerTable = () => {
    const [jobs, setJobs] = useState<any[]>([]); // Array to store jobs
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllAppliedJobsBelongsTo({ secondTable: "JobApplication" })
            .then((res) => {
                console.log("Jobs response:", res);
                console.log("Jobs data:", res?.data?.data);
                
                // Ensure we always get an array
                const jobsData = res?.data?.data;
                if (Array.isArray(jobsData)) {
                    // Ensure each job has job_applications as an array
                    const processedJobs = jobsData.map((job: any) => ({
                        ...job,
                        job_applications: Array.isArray(job.job_applications) ? job.job_applications : (job.JobApplication ? (Array.isArray(job.JobApplication) ? job.JobApplication : []) : [])
                    }));
                    setJobs(processedJobs);
                } else {
                    console.warn("Jobs data is not an array:", jobsData);
                    setJobs([]);
                }
                setLoading(false); // Stop loading once data is fetched
            })
            .catch((error: any) => {
                console.error("Error fetching data:", error);
                const errorMessage = error?.response?.data?.msg || error?.message || "Failed to fetch jobs";
                toast.error(errorMessage);
                setJobs([]); // Set empty array in case of error
                setLoading(false);
            });
    }, []);

    const handleDeleteJob = async (jobId: string) => {
        try {
            await deleteJobs(jobId); // API call to delete the job
            setJobs((prev) => prev.filter((job) => job.id !== jobId)); // Remove job from state
            toast.success("Job deleted successfully.");
        } catch (error: any) {
            console.error("Failed to delete job:", error);
            const errorMessage = error?.response?.data?.msg || error?.message || "Failed to delete job";
            toast.error(errorMessage);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Ensure jobs is always an array
    const jobsArray = Array.isArray(jobs) ? jobs : [];

    return (
        <Box sx={{ padding: "1rem" }}>
            <Typography variant="h4" gutterBottom>
                Career Table
            </Typography>
            {jobsArray.length === 0 ? (
                <Typography>No jobs available</Typography>
            ) : (
                jobsArray.map((job, index) => {
                    // Ensure job_applications is always an array
                    const applications = Array.isArray(job.job_applications) 
                        ? job.job_applications 
                        : (Array.isArray(job.JobApplication) ? job.JobApplication : []);
                    
                    return (
                    <Box key={job.id || job._id || `job-${index}`} sx={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Typography variant="h5">
                                {job.title} at {job.company}
                            </Typography>
                            <IconButton onClick={() => handleDeleteJob(job.id || job._id)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                        <Typography variant="body1" color="textSecondary">
                            Posted by: {job.company} ({job.contactEmail})
                        </Typography>
                        <Typography variant="body1" color="textSecondary">
                            Salary: {job.salary} | Job Type: {job.jobType}
                        </Typography>
                        <TableContainer component={Paper} sx={{ marginTop: "1rem" }}>
                            <Table sx={{ minWidth: 650 }} aria-label="career table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User Name</TableCell>
                                        <TableCell align="left">Email</TableCell>
                                        <TableCell align="left">Applied On</TableCell>
                                        <TableCell align="left">Expected Salary</TableCell>
                                        <TableCell align="left">Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {applications.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">
                                                No applications for this job.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        applications.map((application: any, appIndex: number) => (
                                            <TableRow key={application.id || application._id || appIndex}>
                                                <TableCell component="th" scope="row">
                                                    {application.name || "N/A"}
                                                </TableCell>
                                                <TableCell align="left">{application.email || "N/A"}</TableCell>
                                                <TableCell align="left">
                                                    {application.appliedOn 
                                                        ? new Date(application.appliedOn).toLocaleDateString() 
                                                        : (application.createdAt 
                                                            ? new Date(application.createdAt).toLocaleDateString() 
                                                            : "N/A")}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {application.expectedSalary ? `$${application.expectedSalary}` : "N/A"}
                                                </TableCell>
                                                <TableCell align="left">{application.status || "Pending"}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    );
                })
            )}
        </Box>
    );
};

export default CareerTable;
