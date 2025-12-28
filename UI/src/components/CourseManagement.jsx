import React, { useState, useEffect } from 'react';
import { courseService, authService } from '../services/courseService';
import CourseUpload from './CourseUpload';
import CoursePlayer from './CoursePlayer';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseFiles, setCourseFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('courses');

  const userRole = authService.getUserRole();
  const canCreateCourse = ['Artist', 'Business', 'Admin'].includes(userRole);

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const fetchMyCourses = async () => {
    setLoading(true);
    try {
      const response = await courseService.getMyCourses();
      if (response.success) {
        setCourses(response.data);
      }
    } catch (err) {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseFiles = async (courseId) => {
    setLoading(true);
    try {
      const response = await courseService.getCourseFiles(courseId);
      if (response.success) {
        setCourseFiles(response.data);
      }
    } catch (err) {
      setError('Failed to fetch course files');
    } finally {
      setLoading(false);
    }
  };

  const selectCourse = async (course) => {
    setSelectedCourse(course);
    setActiveTab('files');
    await fetchCourseFiles(course._id);
  };

  const handleFileUploaded = (uploadedFile) => {
    setCourseFiles(prev => [...prev, uploadedFile]);
    setSuccess('File uploaded successfully!');
  };

  const deleteFile = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }

    try {
      await courseService.deleteFile(fileId);
      setCourseFiles(prev => prev.filter(file => file._id !== fileId));
      setSuccess('File deleted successfully!');
    } catch (err) {
      setError('Failed to delete file');
    }
  };

  const submitCourseForApproval = async () => {
    if (!selectedCourse) return;

    try {
      await courseService.submitForApproval(selectedCourse._id);
      setSuccess('Course submitted for approval!');
      fetchMyCourses();
    } catch (err) {
      setError('Failed to submit course for approval');
    }
  };

  const renderCoursesList = () => (
    <div className="courses-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>My Courses</h3>
        {canCreateCourse && (
          <button
            className="btn btn-primary"
            onClick={() => alert('Course creation form will be implemented')}
          >
            <i className="fas fa-plus me-2"></i>
            Create New Course
          </button>
        )}
      </div>

      {loading && (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="text-center p-4">
          <i className="fas fa-graduation-cap fa-3x text-muted mb-3"></i>
          <h5>No courses yet</h5>
          <p className="text-muted">Create your first course to get started</p>
        </div>
      )}

      <div className="row">
        {courses.map(course => (
          <div key={course._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  className="card-img-top"
                  alt={course.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text text-muted">
                  {course.description.substring(0, 100)}...
                </p>
                <div className="mb-2">
                  <span className="badge bg-primary">{course.category}</span>
                  <span className="badge bg-secondary ms-2">{course.level}</span>
                  <span className="badge bg-success ms-2">${course.price}</span>
                </div>
                <div className="mb-2">
                  <small className="text-muted">
                    Files: {course.files?.length || 0}
                  </small>
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => selectCourse(course)}
                  >
                    <i className="fas fa-folder-open me-1"></i>
                    Manage Files
                  </button>
                  <div>
                    {course.isPublished ? (
                      <span className="badge bg-success">Published</span>
                    ) : course.submittedForApproval ? (
                      <span className="badge bg-warning">Pending Approval</span>
                    ) : (
                      <span className="badge bg-secondary">Draft</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCourseFiles = () => (
    <div className="course-files">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => setActiveTab('courses')}
          >
            <i className="fas fa-arrow-left me-1"></i>
            Back to Courses
          </button>
          <h3 className="d-inline">{selectedCourse?.title}</h3>
        </div>
        {selectedCourse && !selectedCourse.isPublished && !selectedCourse.submittedForApproval && (
          <button
            className="btn btn-success"
            onClick={submitCourseForApproval}
            disabled={courseFiles.length === 0}
          >
            <i className="fas fa-paper-plane me-2"></i>
            Submit for Approval
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      <div className="row">
        <div className="col-md-6">
          <CourseUpload
            course={selectedCourse}
            onFileUploaded={handleFileUploaded}
          />
        </div>
        <div className="col-md-6">
          <h5>Uploaded Files</h5>
          {courseFiles.length === 0 ? (
            <div className="text-center p-4 bg-light rounded">
              <i className="fas fa-file-upload fa-3x text-muted mb-3"></i>
              <p className="text-muted">No files uploaded yet</p>
            </div>
          ) : (
            <div className="files-list">
              {courseFiles.map(file => (
                <div key={file._id} className="card mb-2">
                  <div className="card-body p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{file.originalName}</h6>
                        <small className="text-muted">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </small>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => deleteFile(file._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {courseFiles.length > 0 && (
        <div className="mt-4">
          <h5>Preview Course</h5>
          <CoursePlayer courseId={selectedCourse?._id} files={courseFiles} />
        </div>
      )}
    </div>
  );

  if (!canCreateCourse) {
    return (
      <div className="text-center p-5">
        <i className="fas fa-lock fa-3x text-muted mb-3"></i>
        <h3>Access Restricted</h3>
        <p className="text-muted">Only Artists and Businesses can create and manage courses.</p>
      </div>
    );
  }

  return (
    <div className="course-management">
      <div className="container">
        <h2 className="mb-4">Course Management</h2>
        
        {activeTab === 'courses' && renderCoursesList()}
        {activeTab === 'files' && renderCourseFiles()}
      </div>
    </div>
  );
};

export default CourseManagement;
