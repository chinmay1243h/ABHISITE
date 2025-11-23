import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Box, IconButton, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { deletePortfolioPhoto } from "../../services/services";
import { toast } from "react-toastify";

interface PortfolioProps {
  portfolioPhoto: { portfolioPhotos: any[] }[];
  onDelete?: (id: string) => void; // Callback when photo is deleted
}

export default function Photos({ portfolioPhoto, onDelete }: PortfolioProps) {
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [photoToDelete, setPhotoToDelete] = React.useState<string | null>(null);

  const handleDeleteClick = (photoId: string) => {
    setPhotoToDelete(photoId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPhotoToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!photoToDelete) return;

    setOpenDialog(false);
    setDeletingId(photoToDelete);

    try {
      await deletePortfolioPhoto(photoToDelete);
      toast.success("Photo deleted successfully!");
      if (onDelete) {
        onDelete(photoToDelete); // Notify parent component about the deletion
      }
    } catch (error) {
      console.error("Error deleting photo:", error);
      toast.error("Failed to delete photo");
    } finally {
      setDeletingId(null);
      setPhotoToDelete(null);
    }
  };

  return (
    <>
      <ImageList
        sx={{ width: "100%", height: "100%" }}
        variant="quilted"
        cols={4}
        rowHeight={121}
      >
        {portfolioPhoto?.[0]?.portfolioPhotos?.map((item) => (
          <ImageListItem
            key={item.id}
            cols={item.cols || 1}
            rows={item.rows || 1}
          >
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                "&:hover .delete-icon": { opacity: 1 },
              }}
            >
              <img
                src={item.url}
                alt={item.title}
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <IconButton
                className="delete-icon"
                onClick={() => handleDeleteClick(item.id)}
                disabled={deletingId === item.id}
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  color: "white",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  opacity: 0,
                  transition: "opacity 0.3s",
                  "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.8)" },
                }}
              >
                {deletingId === item.id ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <Delete />
                )}
              </IconButton>
            </Box>
          </ImageListItem>
        ))}
      </ImageList>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this photo? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}