import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box, Typography, Container } from '@mui/material';
import ProfileForm from './ProfileForm';
import ProjectsForm from './ProjectsForm';
import PhotosForm from './PhotosForm';
import AchievementsTab from './AchievementsForm';
import ContactTab from './ContactForm';
import { useLocation } from 'react-router-dom';
import { getPortfolioDetails } from '../../../services/services';

const PortfolioFormTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [profileId, setProfileId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Get id from location state if in edit mode
  const id = location.state;

  useEffect(() => {
    if (id) {
      setIsEditing(true);


      // Fetch existing data when in edit mode
      const fetchData = async () => {
        try {
          const response = await getPortfolioDetails(id);
          setProfileId(response?.data?.data?.id)
          // console.log(response)
          setLoading(false);
        } catch (error) {
          console.error('Error fetching portfolio data:', error);
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleNextTab = () => {
    setActiveTab((prev) => (prev < 4 ? prev + 1 : prev));
  };

  const handleTabChange = (event: any, newValue: React.SetStateAction<number>) => {
    setActiveTab(newValue);
  };

  const renderTabContent = () => {
    if (loading) return <Typography>Loading...</Typography>;

    switch (activeTab) {
      case 0:
        return (
          <ProfileForm
            onSubmit={handleNextTab}
            setProfileId={setProfileId}
            isEditing={isEditing}
            profileId={profileId}

          />
        );
      case 1:
        return <ProjectsForm onSubmit={handleNextTab} profileId={profileId} isEditing={isEditing} />;
      case 2:
        return <PhotosForm onSubmit={handleNextTab} profileId={profileId} isEditing={isEditing} />;
      case 3:
        return <AchievementsTab onSubmit={handleNextTab} profileId={profileId} isEditing={isEditing} />;
      case 4:
        return <ContactTab onSubmit={handleNextTab} profileId={profileId} isEditing={isEditing} />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{
      mt: 4,
      padding: "1rem",
      backgroundColor: "#ffffff",
      minHeight: "100vh"
    }}>
      <Box>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Profile" />
          <Tab label="Projects" />
          <Tab label="Photos" />
          <Tab label="Achievements" />
          <Tab label="Contact" />
        </Tabs>
        <Box sx={{ marginTop: 2 }}>
          {renderTabContent()}
        </Box>
      </Box>
    </Container>
  );
};

export default PortfolioFormTabs;
