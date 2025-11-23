import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteCourse, deleteMovies, getAllCourse, getAllMovies } from "../../services/services";

const CourseTable = () => {
    const [movies, setMovies] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const payLoad = {
                    data: { filter: "" },
                    page: 0,
                    pageSize: 50,
                    order: [["createdAt", "ASC"]],
                };
                const res = await getAllCourse(payLoad);
                setMovies(res?.data?.data?.rows || []);
            } catch (error: any) {
                console.error("Failed to fetch courses:", error);
                const errorMessage = error?.response?.data?.msg || error?.message || "Failed to load courses";
                toast.error(errorMessage);
            }
        };

        fetchCourse();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteCourse(id);
            setMovies((prev: any) => prev.filter((movie: any) => movie.id !== id));
            toast.success("Course deleted successfully.");
        } catch (error: any) {
            console.error("Failed to delete course:", error);
            const errorMessage = error?.response?.data?.msg || error?.message || "Failed to delete course";
            toast.error(errorMessage);
        }
    };
    const truncateText = (text: string, wordLimit: number) => {
        const words = text.split(" ");
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
    };


    return (
        <Box sx={{ padding: "1rem", backgroundColor: "#ffffff", minHeight: "100vh" }}>
            <Box
                sx={{
                    maxWidth: 1200,
                    mx: "auto",
                    mt: 5,
                    p: 3,
                    boxShadow: 3,
                    backgroundColor: "#ffffff",
                }}
            >
                <Typography variant="h4" gutterBottom align="center">
                    Manage Course
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Desc</TableCell>
                                <TableCell>CourseType</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(movies) && movies.length > 0 ? (
                                movies.map((movie: any, index: number) => (
                                    <TableRow key={movie.id || movie._id || `course-${index}`}>
                                        <TableCell>{movie.id || movie._id || "N/A"}</TableCell>
                                        <TableCell>{movie.title || "N/A"}</TableCell>
                                        <TableCell>{movie.description ? truncateText(movie.description, 40) : "N/A"}</TableCell>
                                        <TableCell>{movie.courseType || "N/A"}</TableCell>
                                        <TableCell>{movie.price || "N/A"}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="contained"
                                                color="error"
                                                size="small"
                                                onClick={() => handleDelete(movie.id || movie._id)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No courses available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/add-movie")}
                        style={{ backgroundColor: "#007bff", color: "#fff" }}
                    >
                        Add New Movie
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default CourseTable;
