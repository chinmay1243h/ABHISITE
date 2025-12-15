import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface FormData {
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  tags: string[];
  requirements: string[];
  whatYouWillLearn: string[];
  courseId: string;
}

const TelegramCourseUpload: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'programming',
    level: 'beginner',
    price: 0,
    tags: [],
    requirements: [],
    whatYouWillLearn: [],
    courseId: '',
  });
  
  const [files, setFiles] = useState<any[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [currentRequirement, setCurrentRequirement] = useState('');
  const [currentLearning, setCurrentLearning] = useState('');

  const categories = [
    'programming', 'design', 'business', 'marketing', 'music', 'art', 'other'
  ];

  const levels = ['beginner', 'intermediate', 'advanced'];

  useEffect(() => {
    // Check if user has required role
    const userRole = localStorage.getItem('userRole');
    if (!['artist', 'business'].includes(userRole || '')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file size (2GB limit)
      if (selectedFile.size > 2 * 1024 * 1024 * 1024) {
        alert('File size must be less than 2GB');
        return;
      }
      setCurrentFile(selectedFile);
    }
  };

  const handleFileUpload = async () => {
    if (!currentFile || !formData.courseId) {
      alert('Please select a file and create a course first');
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', currentFile);
    uploadFormData.append('courseId', formData.courseId);
    uploadFormData.append('description', `File for ${formData.title}`);

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/telegram-files/upload', uploadFormData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });

      setFiles(prev => [...prev, response.data.data]);
      setCurrentFile(null);
      setUploadProgress(0);
      alert('File uploaded successfully to Telegram!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const createCourse = async () => {
    if (!formData.title || !formData.description) {
      alert('Please fill in title and description');
      return;
    }

    setIsCreatingCourse(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/courses', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      setFormData(prev => ({
        ...prev,
        courseId: response.data.data._id
      }));
      alert('Course created successfully! Now you can upload files.');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create course');
    } finally {
      setIsCreatingCourse(false);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = () => {
    if (currentRequirement.trim() && formData.requirements.length < 10) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, currentRequirement.trim()]
      }));
      setCurrentRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addLearning = () => {
    if (currentLearning.trim() && formData.whatYouWillLearn.length < 10) {
      setFormData(prev => ({
        ...prev,
        whatYouWillLearn: [...prev.whatYouWillLearn, currentLearning.trim()]
      }));
      setCurrentLearning('');
    }
  };

  const removeLearning = (index: number) => {
    setFormData(prev => ({
      ...prev,
      whatYouWillLearn: prev.whatYouWillLearn.filter((_, i) => i !== index)
    }));
  };

  const publishCourse = async () => {
    if (!formData.courseId || files.length === 0) {
      alert('Please upload at least one file before publishing');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:4000/api/courses/${formData.courseId}/publish`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      alert('Course published successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to publish course');
    }
  };

  const deleteFile = async (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:4000/api/telegram-files/${fileId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        setFiles(prev => prev.filter(f => f.id !== fileId));
        alert('File deleted successfully');
      } catch (error: any) {
        alert(error.response?.data?.message || 'Failed to delete file');
      }
    }
  };

  return (
    <div className="telegram-course-upload">
      <div className="container">
        <h1>Create New Course with Telegram Storage</h1>
        
        {/* Basic Information */}
        <div className="section">
          <h2>Basic Information</h2>
          <div className="form-group">
            <label>Course Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter course title"
              maxLength={200}
            />
          </div>
          
          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your course (minimum 10 characters)"
              minLength={10}
              maxLength={2000}
              rows={5}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleInputChange}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Level</label>
              <select name="level" value={formData.level} onChange={handleInputChange}>
                {levels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="section">
          <h2>Tags</h2>
          <div className="tag-input">
            <input
              type="text"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              maxLength={50}
            />
            <button type="button" onClick={addTag}>Add Tag</button>
          </div>
          <div className="tags">
            {formData.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button type="button" onClick={() => removeTag(index)}>×</button>
              </span>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="section">
          <h2>Course Requirements</h2>
          <div className="requirement-input">
            <input
              type="text"
              value={currentRequirement}
              onChange={(e) => setCurrentRequirement(e.target.value)}
              placeholder="Add a requirement"
              onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
              maxLength={200}
            />
            <button type="button" onClick={addRequirement}>Add Requirement</button>
          </div>
          <div className="requirements">
            {formData.requirements.map((requirement, index) => (
              <div key={index} className="requirement-item">
                {requirement}
                <button type="button" onClick={() => removeRequirement(index)}>×</button>
              </div>
            ))}
          </div>
        </div>

        {/* What You'll Learn */}
        <div className="section">
          <h2>What You'll Learn</h2>
          <div className="learning-input">
            <input
              type="text"
              value={currentLearning}
              onChange={(e) => setCurrentLearning(e.target.value)}
              placeholder="Add learning objective"
              onKeyPress={(e) => e.key === 'Enter' && addLearning()}
              maxLength={200}
            />
            <button type="button" onClick={addLearning}>Add Learning</button>
          </div>
          <div className="learning-objectives">
            {formData.whatYouWillLearn.map((objective, index) => (
              <div key={index} className="learning-item">
                {objective}
                <button type="button" onClick={() => removeLearning(index)}>×</button>
              </div>
            ))}
          </div>
        </div>

        {/* Course Creation */}
        {!formData.courseId && (
          <div className="section">
            <button
              type="button"
              className="btn btn-primary"
              onClick={createCourse}
              disabled={isCreatingCourse}
            >
              {isCreatingCourse ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        )}

        {/* File Upload */}
        {formData.courseId && (
          <div className="section">
            <h2>Upload Course Files to Telegram</h2>
            <div className="file-upload">
              <input
                type="file"
                onChange={handleFileSelect}
                accept="video/*,application/pdf,application/zip,image/*,audio/*"
              />
              {currentFile && (
                <div className="file-info">
                  <p>Selected: {currentFile.name}</p>
                  <p>Size: {(currentFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleFileUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? `Uploading... ${uploadProgress}%` : 'Upload File to Telegram'}
                  </button>
                </div>
              )}
            </div>
            
            {uploadProgress > 0 && (
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* Uploaded Files */}
        {files.length > 0 && (
          <div className="section">
            <h2>Uploaded Files (Stored in Telegram)</h2>
            <div className="files-list">
              {files.map(file => (
                <div key={file.id} className="file-item">
                  <div className="file-details">
                    <p className="filename">{file.filename}</p>
                    <p className="filesize">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="filetype">{file.mimeType}</p>
                    <p className="telegram-info">Telegram ID: {file.telegramFileId}</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => deleteFile(file.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publish Course */}
        {formData.courseId && files.length > 0 && (
          <div className="section">
            <button
              type="button"
              className="btn btn-success"
              onClick={publishCourse}
            >
              Publish Course
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelegramCourseUpload;
