import React from "react";
import NewsAndBlogsTable from "./AddNewsandBlogs/NewsBlogsTable";
import { Box, Typography, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AllUsersTable from "./AllUserTable";
import MoviesTable from "./MoviesTable";
import CareerTable from "./CarrerTable";
import CourseTable from "./CourseTable";

const AdminHomepage = () => {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                backgroundColor: "#f5f5f5",
                minHeight: "100vh",
                padding: "24px",
            }}
        >
            {/* Header Section */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
                    Admin Dashboard
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        textTransform: "none",
                        fontSize: "16px",
                        fontWeight: "bold",
                    }}
                    onClick={() => navigate('/addnewsandblogs')}
                >
                    Add New News/Blog
                </Button>
            </Box>

            {/* News and Blogs Table */}
            <Paper
                elevation={3}
                sx={{
                    padding: "24px",
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        marginBottom: "16px",
                        color: "#333",
                    }}
                >
                    News and Blogs
                </Typography>
                <NewsAndBlogsTable />
            </Paper>
            {/* User  */}
            <Paper
                elevation={3}
                sx={{
                    padding: "24px",
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                    marginTop: '50px'
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        marginBottom: "16px",
                        color: "#333",
                    }}
                >
                    User
                </Typography>
                <AllUsersTable />
            </Paper>



            {/*Movies  */}
            <Paper
                elevation={3}
                sx={{
                    padding: "24px",
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                    marginTop: '50px'
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        marginBottom: "16px",
                        color: "#333",
                    }}
                >
                    Movies
                </Typography>
                <MoviesTable />
            </Paper>

            <Paper
                elevation={3}
                sx={{
                    padding: "24px",
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                    marginTop: '50px'
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        marginBottom: "16px",
                        color: "#333",
                    }}
                >
                    Carrer
                </Typography>
                <CareerTable />
            </Paper>
            <Paper
                elevation={3}
                sx={{
                    padding: "24px",
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                    marginTop: '50px'
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "16px",
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: "bold",
                            color: "#333",
                        }}
                    >
                        Course
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                        }}
                        onClick={() => navigate("/course-upload")}
                    >
                        Add Product
                    </Button>
                </Box>
                <CourseTable />
            </Paper>
        </Box>
    );
};

export default AdminHomepage;
