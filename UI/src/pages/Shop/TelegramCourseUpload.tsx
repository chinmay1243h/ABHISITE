import { CloudUpload, Delete, ContentCopy, CheckCircle } from "@mui/icons-material";
import {
    Box,
    Button,
    Grid,
    IconButton,
    Paper,
    Typography,
    TextField,
    Alert,
    Snackbar,
    Chip,
    Divider,
} from "@mui/material";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { uploadToTelegram } from "./TelegramUpload";
import { generateCourseCode, generateUniqueAccessCode } from "../../utils/courseCodeGenerator";
import { createVideo, createAudio, createPdf } from "../../services/services";
import color from "../../components/utils/Colors";

interface FilePreview {
    file: File;
    type: string;
    previewURL: string;
    telegramFileId?: string;
}

interface CourseFormData {
    title: string;
    description: string;
    price: string;
    category: string;
}

const TelegramCourseUpload: React.FC = () => {
    const location = useLocation();
    const courseid = location.state;
    
    const [file, setFile] = useState<FilePreview | null>(null);
    const [uploading, setUploading] = useState(false);
    const [courseData, setCourseData] = useState<CourseFormData>({
        title: "",
        description: "",
        price: "",
        category: ""
    });
    const [accessCode, setAccessCode] = useState<string>("");
    const [courseCode, setCourseCode] = useState<string>("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCourseDataChange = (field: keyof CourseFormData) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setCourseData(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
            toast.error("Unsupported file type. Please upload a video, audio, or PDF.");
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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async () => {
        if (!file) {
            toast.error("Please upload a file before submitting.");
            return;
        }

        if (!courseData.title || !courseData.description) {
            toast.error("Please fill in course title and description.");
            return;
        }

        setUploading(true);

        try {
            // Step 1: Upload to Telegram
            toast.info("Uploading file to Telegram...");
            const telegramFileId = await uploadToTelegram(file.file);
            
            // Step 2: Generate codes
            const generatedCourseCode = generateCourseCode();
            const generatedAccessCode = generateUniqueAccessCode(courseData.title);
            
            setCourseCode(generatedCourseCode);
            setAccessCode(generatedAccessCode);

            // Step 3: Save to database with Telegram file ID
            let payLoad;
            if (file.type === "video") {
                payLoad = {
                    courseId: courseid,
                    videoUrl: telegramFileId,
                    title: courseData.title,
                    description: courseData.description,
                    price: courseData.price,
                    category: courseData.category,
                    courseCode: generatedCourseCode,
                    accessCode: generatedAccessCode,
                    telegramFileId: telegramFileId
                };
                await createVideo(payLoad);
            } else if (file.type === "audio") {
                payLoad = {
                    courseId: courseid,
                    audioUrl: telegramFileId,
                    title: courseData.title,
                    description: courseData.description,
                    price: courseData.price,
                    category: courseData.category,
                    courseCode: generatedCourseCode,
                    accessCode: generatedAccessCode,
                    telegramFileId: telegramFileId
                };
                await createAudio(payLoad);
            } else if (file.type === "pdf") {
                payLoad = {
                    courseId: courseid,
                    pdfUrl: telegramFileId,
                    title: courseData.title,
                    description: courseData.description,
                    price: courseData.price,
                    category: courseData.category,
                    courseCode: generatedCourseCode,
                    accessCode: generatedAccessCode,
                    telegramFileId: telegramFileId
                };
                await createPdf(payLoad);
            }

            // Update file state with Telegram file ID
            setFile(prev => prev ? { ...prev, telegramFileId } : null);
            
            setShowSuccess(true);
            toast.success("Course uploaded successfully to Telegram!");
            
        } catch (error) {
            console.error("Error uploading course:", error);
            toast.error("Error uploading course. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 800,
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
                Upload Course via Telegram
            </Typography>
            
            <Paper sx={{ padding: "16px", boxShadow: "none", margin: "auto" }}>
                <Grid container spacing={3}>
                    {/* Course Information */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Course Information
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Course Title"
                                    value={courseData.title}
                                    onChange={handleCourseDataChange('title')}
                                    disabled={uploading}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Category"
                                    value={courseData.category}
                                    onChange={handleCourseDataChange('category')}
                                    disabled={uploading}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={3}
                                    value={courseData.description}
                                    onChange={handleCourseDataChange('description')}
                                    disabled={uploading}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Price ($)"
                                    type="number"
                                    value={courseData.price}
                                    onChange={handleCourseDataChange('price')}
                                    disabled={uploading}
                                />
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider />
                    </Grid>

                    {/* File Upload */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Course Material
                        </Typography>
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
                                        />
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
                                {file.telegramFileId && (
                                    <Chip 
                                        label="Uploaded to Telegram" 
                                        color="success" 
                                        size="small" 
                                        icon={<CheckCircle />}
                                    />
                                )}
                            </Paper>
                        </Grid>
                    )}

                    {/* Generated Codes Display */}
                    {(courseCode || accessCode) && (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                                <Typography variant="h6" gutterBottom>
                                    Generated Access Codes
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Course Code:
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="body1" fontWeight="bold">
                                                {courseCode}
                                            </Typography>
                                            <IconButton size="small" onClick={() => copyToClipboard(courseCode)}>
                                                <ContentCopy fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="body2" color="text.secondary">
                                            Access Code:
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="body1" fontWeight="bold">
                                                {accessCode}
                                            </Typography>
                                            <IconButton size="small" onClick={() => copyToClipboard(accessCode)}>
                                                <ContentCopy fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    )}

                    {/* Submit Button */}
                    {file && (
                        <Grid item xs={12}>
                            <Button
                                sx={{
                                    background: color.textColor1,
                                }}
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                disabled={uploading || !courseData.title || !courseData.description}
                                fullWidth
                            >
                                {uploading ? "Processing..." : "Upload Course to Telegram"}
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            {/* Success Snackbar */}
            <Snackbar
                open={showSuccess}
                autoHideDuration={6000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setShowSuccess(false)} 
                    severity="success" 
                    sx={{ width: '100%' }}
                >
                    Course uploaded successfully! Codes generated for access.
                </Alert>
            </Snackbar>

            {/* Copy Confirmation */}
            <Snackbar
                open={copied}
                autoHideDuration={2000}
                onClose={() => setCopied(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="info">
                    Copied to clipboard!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default TelegramCourseUpload;
