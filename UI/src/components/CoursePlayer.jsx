import React, { useState, useEffect } from 'react';
import { fileService } from '../services/courseService';

const CoursePlayer = ({ courseId, files = [] }) => {
  const [currentFile, setCurrentFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (files.length > 0 && !currentFile) {
      setCurrentFile(files[0]);
    }
  }, [files, currentFile]);

  const selectFile = (file) => {
    setCurrentFile(file);
    setError('');
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('video/')) {
      return 'fas fa-video';
    } else if (mimeType.startsWith('audio/')) {
      return 'fas fa-music';
    } else if (mimeType === 'application/pdf') {
      return 'fas fa-file-pdf';
    } else if (mimeType.includes('zip')) {
      return 'fas fa-file-archive';
    } else if (mimeType.startsWith('image/')) {
      return 'fas fa-image';
    } else {
      return 'fas fa-file';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderFilePlayer = () => {
    if (!currentFile) {
      return (
        <div className="text-center p-4">
          <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
          <p className="text-muted">Select a file to view</p>
        </div>
      );
    }

    const streamUrl = fileService.getFileStreamUrl(currentFile._id);
    const downloadUrl = fileService.getFileDownloadUrl(currentFile._id);

    if (currentFile.mimeType.startsWith('video/')) {
      return (
        <div className="video-player">
          <video
            controls
            style={{ width: '100%', maxHeight: '500px' }}
            preload="metadata"
          >
            <source src={streamUrl} type={currentFile.mimeType} />
            Your browser does not support the video tag.
          </video>
          <div className="video-controls mt-3">
            <a
              href={downloadUrl}
              className="btn btn-primary"
              download
            >
              <i className="fas fa-download me-2"></i>
              Download Video
            </a>
          </div>
        </div>
      );
    }

    if (currentFile.mimeType.startsWith('audio/')) {
      return (
        <div className="audio-player">
          <audio controls style={{ width: '100%' }}>
            <source src={streamUrl} type={currentFile.mimeType} />
            Your browser does not support the audio tag.
          </audio>
          <div className="audio-controls mt-3">
            <a
              href={downloadUrl}
              className="btn btn-primary"
              download
            >
              <i className="fas fa-download me-2"></i>
              Download Audio
            </a>
          </div>
        </div>
      );
    }

    if (currentFile.mimeType.startsWith('image/')) {
      return (
        <div className="image-viewer">
          <img
            src={streamUrl}
            alt={currentFile.originalName}
            style={{ maxWidth: '100%', maxHeight: '500px' }}
            className="img-fluid"
          />
          <div className="image-controls mt-3">
            <a
              href={downloadUrl}
              className="btn btn-primary"
              download
            >
              <i className="fas fa-download me-2"></i>
              Download Image
            </a>
          </div>
        </div>
      );
    }

    if (currentFile.mimeType === 'application/pdf') {
      return (
        <div className="pdf-viewer">
          <iframe
            src={streamUrl}
            style={{ width: '100%', height: '500px', border: 'none' }}
            title={currentFile.originalName}
          />
          <div className="pdf-controls mt-3">
            <a
              href={downloadUrl}
              className="btn btn-primary"
              download
            >
              <i className="fas fa-download me-2"></i>
              Download PDF
            </a>
            <a
              href={streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary ms-2"
            >
              <i className="fas fa-external-link-alt me-2"></i>
              Open in New Tab
            </a>
          </div>
        </div>
      );
    }

    // For other file types (ZIP, etc.)
    return (
      <div className="file-download">
        <div className="text-center p-4">
          <i className={`${getFileIcon(currentFile.mimeType)} fa-3x text-muted mb-3`}></i>
          <h5>{currentFile.originalName}</h5>
          <p className="text-muted">Size: {formatFileSize(currentFile.size)}</p>
          <p className="text-muted">This file type cannot be previewed. Please download to view.</p>
          <a
            href={downloadUrl}
            className="btn btn-primary"
            download
          >
            <i className="fas fa-download me-2"></i>
            Download File
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="course-player">
      <div className="row">
        <div className="col-md-3">
          <h5>Course Files</h5>
          <div className="file-list">
            {files.map((file, index) => (
              <div
                key={file._id}
                className={`file-item p-2 mb-2 rounded cursor-pointer ${
                  currentFile?._id === file._id ? 'bg-primary text-white' : 'bg-light'
                }`}
                onClick={() => selectFile(file)}
                style={{
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                <div className="d-flex align-items-center">
                  <i className={`${getFileIcon(file.mimeType)} me-2`}></i>
                  <div className="flex-grow-1">
                    <div className="file-name" style={{ fontSize: '0.9rem' }}>
                      {file.originalName}
                    </div>
                    <div className="file-size text-muted" style={{ fontSize: '0.8rem' }}>
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="col-md-9">
          <h5>File Viewer</h5>
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          {renderFilePlayer()}
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;
