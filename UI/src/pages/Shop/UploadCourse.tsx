import { CloudUpload, Delete } from "@mui/icons-material";
import {
    Box,
    Button,
    Grid,
    IconButton,
    Paper,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { createAudio, createPdf, createVideo, docsUpload } from "../../services/services";
import color from "../../components/utils/Colors";

interface FilePreview {
    file: File;
    type: string;
    previewURL: string;
}

const UploadCourse: React.FC = () => {
    const location = useLocation();
    const courseid = location.state;
    const [file, setFile] = useState<FilePreview | null>(null); // Only one file
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        const selectedFile = event.target.files[0];
        const fileType = selectedFile.type.startsWith("video")
            ? "video"
            : selectedFile.type.startsWith("audio")
                ? "audio"
                : selectedFile.type === "application/pdf"
                    ? "pdf"
                    : "other";

        if (fileType === "other") {
            alert("Unsupported file type. Please upload a video, audio, or PDF.");
            return;
        }

        setFile({
            file: selectedFile,
            type: fileType,
            previewURL: URL.createObjectURL(selectedFile),
        });
    };

    const handleFileRemove = () => {
        if (file) {
            URL.revokeObjectURL(file.previewURL);
            setFile(null);
        }
    };

    const navigate = useNavigate();
    // const handleSubmit = async () => {
    //     if (!file) {
    //         alert("Please upload a file before submitting.");
    //         return;
    //     }

    //     setUploading(true);

    //     const formData = new FormData();
    //     formData.append("files", file.file);

    //     try {
    //         const res = await docsUpload(formData);
    //         const uploadedUrl = res?.data?.data?.doc0;

    //         let payLoad;
    //         if (file.type === "video") {
    //             payLoad = {
    //                 courseId: courseid,
    //                 videoUrl: uploadedUrl,
    //             };
    //             createVideo(payLoad).then((res: any) => {
    //                 toast(res?.data?.msg);
    //                 navigate("/artist-courses")
    //             }).catch((err: any) => {
    //                 toast(err);
    //             })
    //         } else if (file.type === "audio") {
    //             payLoad = {
    //                 courseId: courseid,
    //                 audioUrl: uploadedUrl,
    //             };
    //             createAudio(payLoad).then((res: any) => {
    //                 toast(res?.data?.msg);
    //                 navigate("/artist-courses")
    //             }).catch((err: any) => {
    //                 toast(err);
    //             })
    //         } else if (file.type === "pdf") {
    //             payLoad = {
    //                 courseId: courseid,
    //                 pdfUrl: uploadedUrl,
    //             };
    //             createPdf(payLoad).then((res: any) => {
    //                 toast(res?.data?.msg);
    //                 navigate("/artist-courses")
    //             }).catch((err: any) => {
    //                 toast(err);
    //             })
    //         }

    //         console.log(`${file.type} uploaded successfully:`, uploadedUrl);
    //         console.log("Payload:", payLoad);
    //     } catch (error) {
    //         console.error(`Error uploading ${file.type}:`, error);
    //     } finally {
    //         setUploading(false);
    //     }
    // };

    const handleSubmit = async () => {
        if (!file) {
            alert("Please upload a file before submitting.");
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append("files", file.file);

        try {
            const res = await docsUpload(formData);
            const uploadedUrl = res?.data?.data?.doc0;

            if (!uploadedUrl) {
                throw new Error("Upload failed");
            }

            let payLoad;
            if (file.type === "video") {
                payLoad = {
                    courseId: courseid,
                    videoUrl: uploadedUrl,
                };
                await createVideo(payLoad);
            } else if (file.type === "audio") {
                payLoad = {
                    courseId: courseid,
                    audioUrl: uploadedUrl,
                };
                await createAudio(payLoad);
            } else if (file.type === "pdf") {
                payLoad = {
                    courseId: courseid,
                    pdfUrl: uploadedUrl,
                };
                await createPdf(payLoad);
            }

            toast("File uploaded successfully!");
            navigate("/artist-courses");
        } catch (error) {
            toast.error("Error uploading file.");
            console.error("Error:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 700,
                mx: "auto",
                mt: 5,
                mb: 5,
                p: 3,
                boxShadow: 3,
                backgroundColor: "#ffffff",
                borderRadius: 2,
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Typography variant="h4" gutterBottom textAlign={'center'}>
                Upload Course Materials
            </Typography>
            <Paper sx={{ padding: "16px", boxShadow: "none", margin: "auto" }}>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            component="label"
                            sx={{
                                background: color.textColor1,
                            }}

                            startIcon={<CloudUpload />}
                            disabled={uploading || !!file}
                        >
                            {uploading ? "Uploading..." : "Upload File"}
                            <input
                                type="file"
                                hidden
                                accept="video/*,audio/*,.pdf"
                                onChange={handleFileChange}
                            />
                        </Button>
                    </Grid>

                    {file && (
                        <Grid item xs={12}>
                            <Typography variant="h6">Preview:</Typography>
                            <Paper elevation={1} style={{ padding: "8px", boxShadow: 'none' }}>
                                <Box position="relative">
                                    {file.type === "video" && (
                                        <video
                                            src={file.previewURL}
                                            controls
                                            style={{ width: "100%" }}
                                        />
                                    )}
                                    {file.type === "audio" && (
                                        <audio
                                            src={file.previewURL}
                                            controls
                                            style={{ width: "100%" }}
                                        />
                                    )}
                                    {file.type === "pdf" && (
                                        <iframe
                                            src={file.previewURL}
                                            style={{ width: "100%", height: "300px" }}
                                            title="PDF Preview"
                                        ></iframe>
                                    )}
                                    <IconButton
                                        color="secondary"
                                        style={{ position: "absolute", top: 8, right: 8 }}
                                        onClick={handleFileRemove}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Box>
                                <Typography variant="body2" noWrap>
                                    {file.file.name}
                                </Typography>
                            </Paper>
                        </Grid>
                    )}

                    {file && (
                        <Grid item xs={12}>
                            <Button
                                sx={{
                                    background: color.textColor1,
                                }}
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={uploading}
                            >
                                Submit File
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Box>
    );
};

export default UploadCourse;
