import { Search, PlayCircle, PictureAsPdf, MusicNote } from "@mui/icons-material";
import {
    Box,
    Button,
    Grid,
    Paper,
    Typography,
    TextField,
    Alert,
    Card,
    CardContent,
    CardActions,
    Chip,
    CircularProgress,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getCourseByAccessCode } from "../../services/services";
import color from "../../components/utils/Colors";

interface CourseData {
    id: string;
    title: string;
    description: string;
    category: string;
    price: string;
    courseCode: string;
    accessCode: string;
    telegramFileId: string;
    fileType: 'video' | 'audio' | 'pdf';
}

const CourseAccess: React.FC = () => {
    const navigate = useNavigate();
    const [accessCode, setAccessCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState<CourseData | null>(null);
    const [error, setError] = useState("");

    const handleAccessCodeSubmit = async () => {
        if (!accessCode.trim()) {
            toast.error("Please enter an access code");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await getCourseByAccessCode(accessCode.trim());
            
            if (response.data && response.data.data) {
                setCourse(response.data.data);
                toast.success("Course found!");
            } else {
                setError("Invalid access code or course not found");
                setCourse(null);
            }
        } catch (err: any) {
            console.error("Error accessing course:", err);
            setError(err.response?.data?.message || "Failed to access course");
            setCourse(null);
        } finally {
            setLoading(false);
        }
    };

    const getFileIcon = (fileType: string) => {
        switch (fileType) {
            case 'video':
                return <PlayCircle color="primary" />;
            case 'audio':
                return <MusicNote color="primary" />;
            case 'pdf':
                return <PictureAsPdf color="primary" />;
            default:
                return <PlayCircle color="primary" />;
        }
    };

    const getFileTypeLabel = (fileType: string) => {
        switch (fileType) {
            case 'video':
                return 'Video Course';
            case 'audio':
                return 'Audio Course';
            case 'pdf':
                return 'PDF Document';
            default:
                return 'Course Material';
        }
    };

    const getTelegramFileUrl = (fileId: string) => {
        // This would need your TELEGRAM_BOT_TOKEN
        return `https://api.telegram.org/file/bot${process.env.REACT_APP_TELEGRAM_BOT_TOKEN}/${fileId}`;
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
            }}
        >
            <Typography variant="h4" gutterBottom textAlign={'center'}>
                Access Course
            </Typography>
            
            <Paper sx={{ padding: "24px", boxShadow: "none" }}>
                {/* Access Code Input */}
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Enter Access Code
                        </Typography>
                        <Box display="flex" gap={2}>
                            <TextField
                                fullWidth
                                label="Access Code"
                                value={accessCode}
                                onChange={(e) => setAccessCode(e.target.value)}
                                placeholder="Enter your course access code"
                                disabled={loading}
                            />
                            <Button
                                variant="contained"
                                sx={{
                                    background: color.textColor1,
                                    minWidth: '120px'
                                }}
                                onClick={handleAccessCodeSubmit}
                                disabled={loading || !accessCode.trim()}
                                startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                            >
                                {loading ? "Searching" : "Access"}
                            </Button>
                        </Box>
                    </Grid>

                    {/* Error Message */}
                    {error && (
                        <Grid item xs={12}>
                            <Alert severity="error">{error}</Alert>
                        </Grid>
                    )}

                    {/* Course Details */}
                    {course && (
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Course Details
                            </Typography>
                            <Card elevation={2}>
                                <CardContent>
                                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                                        {getFileIcon(course.fileType)}
                                        <Typography variant="h5" component="div">
                                            {course.title}
                                        </Typography>
                                    </Box>
                                    
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        {course.description}
                                    </Typography>
                                    
                                    <Box display="flex" gap={1} mb={2}>
                                        <Chip label={course.category} size="small" variant="outlined" />
                                        <Chip label={getFileTypeLabel(course.fileType)} size="small" color="primary" />
                                        <Chip label={`$${course.price}`} size="small" color="success" />
                                    </Box>
                                    
                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Course Code:
                                            </Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {course.courseCode}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="body2" color="text.secondary">
                                                Access Code:
                                            </Typography>
                                            <Typography variant="body1" fontWeight="bold">
                                                {course.accessCode}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                
                                <CardActions>
                                    <Button
                                        size="small"
                                        color="primary"
                                        href={getTelegramFileUrl(course.telegramFileId)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        sx={{
                                            background: color.textColor1,
                                            color: 'white'
                                        }}
                                    >
                                        Download Course Material
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Box>
    );
};

export default CourseAccess;
