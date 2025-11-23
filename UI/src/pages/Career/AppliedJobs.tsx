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
} from "@mui/material";
import { getAllAppliedJobsBelongsTo } from "../../services/services";
import { getUserId } from "../../services/axiosClient";

const AppliedJobs = () => {
    const [jobs, setJobs] = useState<any[]>([]); // Initialize as an empty array
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllAppliedJobsBelongsTo({ userId: getUserId(), secondTable: "JobApplication" })
            .then((res) => {
                console.log(res); // Log the response to check its structure
                const jobData = res?.data?.data || []; // Ensure it's an array
                setJobs(jobData); // Store the job data in state
                setLoading(false); // Set loading to false once the data is fetched
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setJobs([]); // Set empty array in case of error
                setLoading(false); // Stop loading even on error
            });
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ padding: "1rem" }}>
            <Typography variant="h4" gutterBottom>
                Applied Jobs
            </Typography>
            {jobs.length === 0 ? (
                <Typography>No jobs available</Typography>
            ) : (
                jobs.map((job: any) => (
                    <Box key={job.id} sx={{ marginBottom: "2rem" }}>
                        <Typography variant="h5">{job.title} at {job.company}</Typography>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="applied jobs table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User Name</TableCell>
                                        <TableCell align="left">Email</TableCell>
                                        <TableCell align="left">Applied On</TableCell>
                                        <TableCell align="left">Salary</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {job.job_applications && job.job_applications.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                No applications for this job.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        job.job_applications?.map((application: any) => (
                                            <TableRow key={application.id}>
                                                <TableCell component="th" scope="row">
                                                    {application.name}
                                                </TableCell>
                                                <TableCell align="left">{application.email}</TableCell>
                                                <TableCell align="left">
                                                    {new Date(application.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell align="left">
                                                    {application.expectedSalary ? `$${application.expectedSalary}` : "N/A"}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ))
            )}
        </Box>
    );
};

export default AppliedJobs;
