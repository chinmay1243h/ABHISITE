import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteMovies, getAllMovies } from "../../services/services";

const MoviesTable = () => {
    const [movies, setMovies] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const payLoad = {
                    data: { filter: "" },
                    page: 0,
                    pageSize: 50,
                    order: [["createdAt", "ASC"]],
                };
                const res = await getAllMovies(payLoad);
                const moviesData = res?.data?.data?.rows || [];
                // Ensure each movie has id field
                const processedMovies = moviesData.map((movie: any) => ({
                    ...movie,
                    id: movie.id || movie._id?.toString() || movie._id
                }));
                setMovies(processedMovies);
            } catch (error: any) {
                console.error("Failed to fetch movies:", error);
                const errorMessage = error?.response?.data?.msg || error?.message || "Failed to load movies";
                toast.error(errorMessage);
            }
        };

        fetchMovies();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deleteMovies(id);
            setMovies((prev: any) => prev.filter((movie: any) => (movie.id || movie._id) !== id));
            toast.success("Movie deleted successfully.");
        } catch (error: any) {
            console.error("Failed to delete movie:", error);
            
            if (error?.response?.status === 401) {
                toast.error("Session expired. Please login again.");
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            } else if (error?.response?.status === 403) {
                toast.error("You don't have permission to delete this movie.");
            } else if (error?.response?.status === 404) {
                toast.error("Movie not found or already deleted.");
            } else {
                const errorMessage = error?.response?.data?.msg || error?.message || "Failed to delete movie";
                toast.error(errorMessage);
            }
        }
    };

    const handleEdit = (id: string) => {
        navigate(`/edit-movie/${id}`);
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
                    Manage Movies
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Year</TableCell>
                                <TableCell>Rating</TableCell>
                                <TableCell>Genre</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(movies) && movies.length > 0 ? (
                                movies.map((movie: any, index: number) => (
                                    <TableRow key={movie.id || movie._id || `movie-${index}`}>
                                        <TableCell>{movie.id || movie._id || "N/A"}</TableCell>
                                        <TableCell>{movie.title || "N/A"}</TableCell>
                                        <TableCell>{movie.year || "N/A"}</TableCell>
                                        <TableCell>{movie.rating || "N/A"}</TableCell>
                                        <TableCell>{movie.genre || "N/A"}</TableCell>
                                        <TableCell align="right">
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleEdit(movie.id || movie._id)}
                                                sx={{ mr: 1 }}
                                            >
                                                Edit
                                            </Button>
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
                                        No movies available
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

export default MoviesTable;
