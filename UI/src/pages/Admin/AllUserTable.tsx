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
import { deleteUser, getAllUser } from "../../services/services";

const AllUsersTable: React.FC = () => {
    const [users, setUsers] = useState([]);
    const [openDialog, setOpenDialog] = useState(false); // For dialog visibility
    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null); // Track the user to delete

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const payLoad = {
                data: { filter: "" },
                page: 0,
                pageSize: 50,
                order: [["createdAt", "ASC"]],
            };
            const res = await getAllUser(payLoad);
            const usersData = res?.data?.data?.rows || [];
            // Ensure each user has id field
            const processedUsers = usersData.map((user: any) => ({
                ...user,
                id: user.id || user._id?.toString() || user._id
            }));
            setUsers(processedUsers);
        } catch (error: any) {
            console.error("Error fetching users:", error);
            const errorMessage = error?.response?.data?.msg || error?.message || "Failed to fetch users";
            toast.error(errorMessage);
        }
    };

    const handleDelete = async () => {
        if (userIdToDelete) {
            try {
                const res = await deleteUser(userIdToDelete);
                toast.success(res?.data?.msg || "User deleted successfully");
                fetchUsers(); // Refresh the list
                setOpenDialog(false); // Close dialog after deletion
                setUserIdToDelete(null); // Reset the ID
            } catch (error: any) {
                console.error("Delete user error:", error);
                const errorMessage = error?.response?.data?.msg || error?.message || "Failed to delete user";
                toast.error(errorMessage);
            }
        }
    };

    const handleOpenDialog = (id: string) => {
        setUserIdToDelete(id);
        setOpenDialog(true); // Open confirmation dialog
    };

    const handleCloseDialog = () => {
        setOpenDialog(false); // Close confirmation dialog
    };

    return (
        <Box sx={{ padding: "32px" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 3 }}>
                All Users
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>User ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Password:</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Array.isArray(users) && users.length > 0 ? (
                            users.map((user: any, index: number) => (
                                <TableRow key={user.id || user._id || `user-${index}`}>
                                    <TableCell>{user.id || user._id || "N/A"}</TableCell>
                                    <TableCell>{user.firstName || ""}{" "}{user.lastName || ""}</TableCell>
                                    <TableCell>{user.email || "N/A"}</TableCell>
                                    <TableCell>{user.password ? "****" : "N/A"}</TableCell>
                                    <TableCell>{user.role || "N/A"}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleOpenDialog(user.id || user._id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No users available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this user?
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

export default AllUsersTable;
