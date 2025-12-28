import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { courseService, authService } from '../services/courseService';

const CourseUpload = ({ course, onFileUploaded, onUploadProgress }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const userRole = authService.getUserRole();
  
  // Check if user can upload files
  const canUpload = ['Artist', 'Business', 'Admin'].includes(userRole);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!canUpload) {
      setError('Only Artists and Businesses can upload files');
      return;
    }

    if (!course) {
      setError('Please select a course first');
      return;
    }

    setError('');
    setSuccess('');

    for (const file of acceptedFiles) {
      await uploadFile(file);
    }
  }, [course, canUpload]);

  const uploadFile = async (file) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await courseService.uploadFile(
        file,
        course._id,
        `Uploaded file: ${file.name}`
      );

      setSuccess(`File "${file.name}" uploaded successfully!`);
      onFileUploaded && onFileUploaded(result.data);
      
    } catch (err) {
      setError(
        err.response?.data?.message || 
        `Failed to upload "${file.name}": ${err.message}`
      );
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: !canUpload || uploading,
    maxSize: 2 * 1024 * 1024 * 1024, // 2GB
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.webm'],
      'application/pdf': ['.pdf'],
      'application/zip': ['.zip'],
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg']
    }
  });

  if (!canUpload) {
    return (
      <div className="alert alert-warning">
        <h4>Upload Restricted</h4>
        <p>Only Artists and Businesses can upload course files.</p>
      </div>
    );
  }

  return (
    <div className="course-upload">
      <h3>Upload Course Files</h3>
      
      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success" style={{ marginBottom: '1rem' }}>
          {success}
        </div>
      )}

      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
        style={{
          border: '2px dashed #ccc',
          borderRadius: '8px',
          padding: '2rem',
          textAlign: 'center',
          cursor: uploading ? 'not-allowed' : 'pointer',
          backgroundColor: isDragActive ? '#f0f8ff' : '#fafafa',
          transition: 'all 0.3s ease'
        }}
      >
        <input {...getInputProps()} />
        
        {uploading ? (
          <div>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Uploading...</span>
            </div>
            <p className="mt-2">Uploading... {uploadProgress}%</p>
            <div className="progress" style={{ width: '100%', marginTop: '1rem' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{
                  width: `${uploadProgress}%`,
                  backgroundColor: '#007bff'
                }}
                aria-valuenow={uploadProgress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        ) : (
          <div>
            <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-3"></i>
            <h4>
              {isDragActive
                ? 'Drop the files here...'
                : 'Drag & drop files here, or click to select'}
            </h4>
            <p className="text-muted">
              Supported formats: Videos (MP4, AVI, MOV), PDFs, ZIP files, Images, Audio
            </p>
            <p className="text-muted">
              Maximum file size: 2GB per file
            </p>
          </div>
        )}
      </div>

      <div className="upload-info mt-3">
        <h5>Upload Guidelines:</h5>
        <ul>
          <li>Maximum file size: 2GB</li>
          <li>Supported video formats: MP4, AVI, MOV, WMV</li>
          <li>Supported document formats: PDF, ZIP</li>
          <li>Supported image formats: JPEG, PNG, GIF</li>
          <li>Supported audio formats: MP3, WAV, M4A</li>
          <li>Files are stored securely and never exposed to users</li>
        </ul>
      </div>
    </div>
  );
};

export default CourseUpload;
