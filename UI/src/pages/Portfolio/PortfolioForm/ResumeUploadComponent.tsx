import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  CloudUpload,
  FileUpload,
  AutoAwesome,
  CheckCircle,
  Error
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getCurrentAccessToken } from '../../../services/axiosClient';
import CryptoJS from 'crypto-js';
import CYS from '../../../services/Secret';

interface ParsedResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institute: string;
    year: string;
    location: string;
  }>;
  skills: string[];
  summary?: string;
}

interface ResumeUploadProps {
  onResumeParsed: (data: ParsedResumeData) => void;
}

const ResumeUploadComponent: React.FC<ResumeUploadProps> = ({ onResumeParsed }) => {
  const [uploading, setUploading] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      // Get authentication token
      const token = getCurrentAccessToken();
      
      // Call AI resume parsing service
      const response = await fetch('http://localhost:4000/api/resume/parse', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: responseText };
        }
        const errorMessage = errorData.message || 'Failed to parse resume';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Resume parsing failed:', errorData);
        return;
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        console.error('Failed to parse response as JSON:', responseText);
        setError('Invalid response from server');
        toast.error('Invalid response from server');
        return;
      }
      
      console.log('Parsed result:', result);
      
      // Check if status_code is 'OK' for success
      if (result.status_code === 'OK') {
        try {
          console.log('Attempting to decrypt data with key:', CYS);
          console.log('Encrypted data:', result.data);
          
          // Decrypt the data
          const decryptedBytes = CryptoJS.AES.decrypt(result.data, CYS);
          const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
          
          console.log('Decrypted string:', decryptedData);
          
          // Parse the decrypted JSON
          const parsedResumeData = JSON.parse(decryptedData);
          
          console.log('Parsed resume data:', parsedResumeData);
          
          setParsedData(parsedResumeData);
          onResumeParsed(parsedResumeData);
          toast.success('Resume parsed successfully!');
          setError(null); // Clear any previous errors
        } catch (decodeError: any) {
          console.error('Failed to decrypt or parse resume data:', decodeError);
          console.error('Decode error details:', decodeError.message);
          setError('Failed to process resume data from server');
          toast.error('Failed to process resume data');
        }
      } else {
        const errorMessage = result.msg || 'Failed to parse resume';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error('Resume parsing failed:', result);
      }
    } catch (error: any) {
      console.error('Resume parsing error:', error);
      setError(error.message || 'Failed to parse resume. Please try again.');
      toast.error('Failed to parse resume');
    } finally {
      setUploading(false);
    }
  };

  const formatParsedDataPreview = () => {
    if (!parsedData) return null;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          <AutoAwesome sx={{ mr: 1, color: '#1976d2' }} />
          Extracted Information
        </Typography>
        
        <Paper sx={{ p: 3, bgcolor: '#f8f9fa' }}>
          {/* Personal Info */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Personal Information
            </Typography>
            <Typography variant="body2">
              <strong>Name:</strong> {parsedData.personalInfo.name}
            </Typography>
            <Typography variant="body2">
              <strong>Email:</strong> {parsedData.personalInfo.email}
            </Typography>
            <Typography variant="body2">
              <strong>Phone:</strong> {parsedData.personalInfo.phone}
            </Typography>
            <Typography variant="body2">
              <strong>Location:</strong> {parsedData.personalInfo.location}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Experience */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Experience ({parsedData.experience.length})
            </Typography>
            {parsedData.experience.map((exp, index) => (
              <Box key={index} sx={{ mb: 2, ml: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  {exp.title} at {exp.company}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {exp.duration}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  {exp.description}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Education */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Education ({parsedData.education.length})
            </Typography>
            {parsedData.education.map((edu, index) => (
              <Box key={index} sx={{ mb: 1, ml: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  {edu.degree}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {edu.institute}, {edu.year}, {edu.location}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Skills */}
          {parsedData.skills.length > 0 && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {parsedData.skills.map((skill, index) => (
                    <Chip key={index} label={skill} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            </>
          )}

          {/* Summary */}
          {parsedData.summary && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Professional Summary
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  {parsedData.summary}
                </Typography>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    );
  };

  return (
    <Paper sx={{ p: 3, mb: 3, border: '2px dashed #1976d2', bgcolor: '#fafafa' }}>
      <Box sx={{ textAlign: 'center' }}>
        <CloudUpload sx={{ fontSize: 48, color: '#1976d2', mb: 2 }} />
        
        <Typography variant="h6" gutterBottom>
          AI Resume Parser
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Upload your resume (PDF or Word) and let AI automatically extract your information
        </Typography>

        <input
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          id="resume-upload"
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        
        <label htmlFor="resume-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={uploading ? <CircularProgress size={20} /> : <FileUpload />}
            disabled={uploading}
            sx={{ 
              mb: 2,
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #1e88e5)',
              }
            }}
          >
            {uploading ? 'Parsing Resume...' : 'Upload Resume'}
          </Button>
        </label>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <Error sx={{ mr: 1 }} />
            {error}
          </Alert>
        )}

        {parsedData && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <CheckCircle sx={{ mr: 1 }} />
            Resume parsed successfully! Information has been extracted and will be used to auto-fill your portfolio.
          </Alert>
        )}

        {formatParsedDataPreview()}
      </Box>
    </Paper>
  );
};

export default ResumeUploadComponent;
