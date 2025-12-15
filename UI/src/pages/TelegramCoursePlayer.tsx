import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface File {
  _id: string;
  originalName: string;
  size: number;
  mimeType: string;
  createdAt: string;
  telegramFileId: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  instructor: any;
  createdAt: string;
  files: File[];
  tags: string[];
  requirements: string[];
  whatYouWillLearn: string[];
}

const TelegramCoursePlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:4000/api/courses/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        
        setCourse(response.data.data);
        setFiles(response.data.data.files || []);
        
        if (response.data.data.files && response.data.data.files.length > 0) {
          setCurrentFile(response.data.data.files[0]);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleFileSelect = (file: File) => {
    setCurrentFile(file);
  };

  const handleDownload = async (fileId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:4000/api/telegram-files/${fileId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', currentFile?.originalName || 'file');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to download file');
    }
  };

  const renderFileContent = (file: File) => {
    if (!file) return <div className="no-file-selected">Select a file to view</div>;

    const fileUrl = `http://localhost:4000/api/telegram-files/${file._id}/stream`;
    
    if (file.mimeType.startsWith('video/')) {
      return (
        <div className="video-player">
          <video controls width="100%" height="auto">
            <source src={fileUrl} type={file.mimeType} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }
    
    if (file.mimeType.startsWith('audio/')) {
      return (
        <div className="audio-player">
          <audio controls>
            <source src={fileUrl} type={file.mimeType} />
            Your browser does not support the audio element.
          </audio>
        </div>
      );
    }
    
    if (file.mimeType.startsWith('image/')) {
      return (
        <div className="image-viewer">
          <img src={fileUrl} alt={file.originalName} style={{ maxWidth: '100%' }} />
        </div>
      );
    }
    
    if (file.mimeType === 'application/pdf') {
      return (
        <div className="pdf-viewer">
          <iframe
            src={fileUrl}
            width="100%"
            height="600px"
            title={file.originalName}
          />
        </div>
      );
    }
    
    // For other file types, show download option
    return (
      <div className="file-download">
        <p>This file type cannot be previewed. Please download to view.</p>
        <button
          className="btn btn-primary"
          onClick={() => handleDownload(file._id)}
        >
          Download {file.originalName}
        </button>
      </div>
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="telegram-course-player loading">
        <div className="spinner"></div>
        <p>Loading course...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="telegram-course-player error">
        <h2>Error loading course</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => navigate('/courses')}>
          Back to Courses
        </button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="telegram-course-player not-found">
        <h2>Course not found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/courses')}>
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div className="telegram-course-player">
      <div className="course-header">
        <button className="btn btn-secondary back-btn" onClick={() => navigate('/courses')}>
          ← Back to Courses
        </button>
        <h1>{course.title}</h1>
        <p className="course-description">{course.description}</p>
        <div className="course-meta">
          <span className="category">{course.category}</span>
          <span className="level">{course.level}</span>
          <span className="instructor">
            By {course.instructor?.profile?.firstName} {course.instructor?.profile?.lastName}
          </span>
          <span className="created">Created: {formatDate(course.createdAt)}</span>
        </div>
      </div>

      <div className="course-content">
        <div className="files-sidebar">
          <h3>Course Files (Stored in Telegram)</h3>
          <div className="files-list">
            {files.map((file, index) => (
              <div
                key={file._id}
                className={`file-item ${currentFile?._id === file._id ? 'active' : ''}`}
                onClick={() => handleFileSelect(file)}
              >
                <div className="file-info">
                  <h4>{file.originalName}</h4>
                  <p className="file-meta">
                    {formatFileSize(file.size)} • {file.mimeType}
                  </p>
                  <p className="file-date">Added: {formatDate(file.createdAt)}</p>
                  <p className="telegram-info">Telegram Storage</p>
                </div>
                <div className="file-actions">
                  <button
                    className="btn btn-small btn-outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file._id);
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="file-content">
          <div className="content-header">
            <h2>{currentFile ? currentFile.originalName : 'No file selected'}</h2>
            {currentFile && (
              <div className="file-actions-top">
                <button
                  className="btn btn-primary"
                  onClick={() => handleDownload(currentFile._id)}
                >
                  Download File
                </button>
              </div>
            )}
          </div>
          
          <div className="content-viewer">
            {currentFile ? renderFileContent(currentFile) : <div className="no-file-selected">Select a file to view</div>}
          </div>
        </div>
      </div>

      {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
        <div className="course-section">
          <h3>What You'll Learn</h3>
          <ul className="learning-objectives">
            {course.whatYouWillLearn.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </div>
      )}

      {course.requirements && course.requirements.length > 0 && (
        <div className="course-section">
          <h3>Requirements</h3>
          <ul className="requirements">
            {course.requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </div>
      )}

      {course.tags && course.tags.length > 0 && (
        <div className="course-section">
          <h3>Tags</h3>
          <div className="tags">
            {course.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TelegramCoursePlayer;
