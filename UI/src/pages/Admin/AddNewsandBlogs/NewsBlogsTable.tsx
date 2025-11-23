import React, { useEffect, useState } from "react";
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Paper,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
} from "@mui/material";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { deleteNewsRecord, getAllNewsAndBlogs } from "../../../services/services";
import { useNavigate } from "react-router-dom";

const NewsAndBlogsTable: React.FC = () => {
    const [newsAndBlogs, setNewsAndBlogs] = useState([]);
    const [openDialog, setOpenDialog] = useState(false); // For dialog visibility
    const [newsIdToDelete, setNewsIdToDelete] = useState<string | null>(null); // Track the news/blog to delete
    const navigate = useNavigate();

    useEffect(() => {
        fetchNewsAndBlogs();
    }, []);

    const fetchNewsAndBlogs = async () => {
        try {
            const payLoad = {
                data: { filter: "" },
                page: 0,
                pageSize: 50,
                order: [["createdAt", "ASC"]],
            };
            getAllNewsAndBlogs(payLoad).then((res) => {
                setNewsAndBlogs(res?.data?.data?.rows);
            }).catch((err) => {
                console.log(err);
            })

        } catch (error: any) {
            console.error("Error fetching news and blogs:", error);
            const errorMessage = error?.response?.data?.msg || error?.message || "Failed to fetch news and blogs";
            toast.error(errorMessage);
        }
    };

    const handleDelete = async () => {
        if (newsIdToDelete) {
            try {
                const res = await deleteNewsRecord(newsIdToDelete);
                toast.success(res?.data?.msg || "News/Blog deleted successfully");
                fetchNewsAndBlogs(); // Refresh the list
                setOpenDialog(false); // Close the dialog after deletion
                setNewsIdToDelete(null); // Reset the ID
            } catch (error: any) {
                console.error("Delete news/blog error:", error);
                const errorMessage = error?.response?.data?.msg || error?.message || "Failed to delete news/blog";
                toast.error(errorMessage);
            }
        }
    };

    const handleEdit = (id: string) => {
        // Navigate to edit page
        toast.info(`Editing entry with ID: ${id}`);
        navigate(`/edit-news-and-blogs/${id}`);
    };

    const handleOpenDialog = (id: string) => {
        setNewsIdToDelete(id);
        setOpenDialog(true); // Open confirmation dialog
    };

    const handleCloseDialog = () => {
        setOpenDialog(false); // Close the dialog without doing anything
    };
    const truncateText = (text: string, wordLimit: number) => {
        const words = text.split(" ");
        return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
    };

    return (
        <Box sx={{ padding: "32px" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 3 }}>
                News and Blogs
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Thumbnail</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>News Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {newsAndBlogs.map((news: any) => (
                            <TableRow key={news.id}>
                                <TableCell>
                                    {news.thumbnail ? (
                                        <img
                                            src={news.thumbnail}
                                            alt="Thumbnail"
                                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/50x50?text=No+Image";
                                            }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: "12px", color: "#999" }}>No thumbnail</span>
                                    )}
                                </TableCell>
                                <TableCell>{news.author}</TableCell>
                                <TableCell>{news.title}</TableCell>
                                <TableCell>{news.type}</TableCell>
                                <TableCell>{news.newsType}</TableCell>

                                <TableCell>{truncateText(news.description, 50)}</TableCell>

                                <TableCell>
                                    <IconButton onClick={() => handleEdit(news.id)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenDialog(news.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this news/blog record?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        Yes, Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default NewsAndBlogsTable;
