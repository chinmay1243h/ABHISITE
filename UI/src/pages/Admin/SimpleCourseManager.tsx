import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Snackbar,
  LinearProgress,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Edit as EditIcon
} from '@mui/icons-material';
import { getAllCourse, updateCourse } from '../../services/services';

interface Course {
  id: string;
  title: string;
  description: string;
  courseType: string;
  price: number;
  category: string;
  isPublished: boolean;
  isDraft: boolean;
  instructor: string;
  firstName: string;
  lastName: string;
}

const SimpleCourseManager = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishDialog, setPublishDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const payload = {
        data: { filter: '' },
        page: 0,
        pageSize: 50,
        order: [['createdAt', 'DESC']]
      };
      
      const response = await getAllCourse(payload);
      const allCourses = response?.data?.data?.rows || [];
      setCourses(allCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setSnackbar({ open: true, message: 'Failed to load courses', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (course: Course) => {
    setSelectedCourse(course);
    setPublishDialog(true);
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      const updatedCourse = {
        ...course,
        isPublished: !course.isPublished,
        isDraft: course.isPublished
      };

      await updateCourse(updatedCourse, course.id);
      
      setSnackbar({ 
        open: true, 
        message: course.isPublished ? 'Course unpublished' : 'Course published!', 
        severity: 'success' 
      });
      fetchCourses();
    } catch (error) {
      console.error('Error toggling course:', error);
      setSnackbar({ open: true, message: 'Failed to update course', severity: 'error' });
    }
  };

  const getStatusColor = (course: any) => {
    if (course.isPublished) return 'success';
    if (course.isDraft) return 'warning';
    return 'default';
  };

  const getStatusText = (course: any) => {
    if (course.isPublished) return 'Published';
    if (course.isDraft) return 'Draft';
    return 'Draft';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Course Management - Admin Panel
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage artist course publishing permissions
        </Typography>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {courses.length === 0 && !loading ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          No courses found. Artists need to create courses first.
        </Alert>
      ) : (
        <Typography variant="h6" sx={{ mb: 2 }}>
          Artist Courses - Approval Management
        </Typography>
      )}

      <List>
        {courses.map((course) => (
          <ListItem key={course.id} sx={{ border: 1, borderColor: 'grey.300', borderRadius: 1, mb: 1 }}>
            <ListItemText
              primary={
                <Box>
                  <Typography variant="h6">{course.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {course.description?.substring(0, 100)}...
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Artist: {course.firstName} {course.lastName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip 
                      label={getStatusText(course)} 
                      color={getStatusColor(course)} 
                      size="small" 
                    />
                    <Chip label={course.courseType} variant="outlined" size="small" />
                    <Chip label={`$${course.price}`} variant="outlined" size="small" />
                    <Chip label={course.category} variant="outlined" size="small" />
                  </Box>
                </Box>
              }
            />
            <ListItemSecondaryAction>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">
                  Publish:
                </Typography>
                <Switch
                  checked={course.isPublished}
                  onChange={() => handleTogglePublish(course)}
                  color="success"
                />
                <IconButton 
                  size="small" 
                  onClick={() => handlePublish(course)}
                  title="Course Details"
                >
                  <EditIcon />
                </IconButton>
              </Box>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Publish Confirmation Dialog */}
      <Dialog open={publishDialog} onClose={() => setPublishDialog(false)}>
        <DialogTitle>Course Details</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{selectedCourse?.title}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {selectedCourse?.description}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Artist: {selectedCourse?.firstName} {selectedCourse?.lastName}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Price: ${selectedCourse?.price} | Type: {selectedCourse?.courseType}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPublishDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SimpleCourseManager;
