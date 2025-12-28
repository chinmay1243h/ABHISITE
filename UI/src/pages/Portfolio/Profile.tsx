import { Box, Typography, Card, CardContent, Grid, Divider, Chip, Avatar } from "@mui/material";
import { Work, School, Email, Phone, EmojiEvents, BusinessCenter } from "@mui/icons-material";

interface PortfolioContact {
  id: number;
  email: string;
  phoneNumber: string;
  portfolioId: number;
  createdAt: string;
  updatedAt: string;
}

interface PortfolioProject {
  id: number;
  title: string;
}

interface PortfolioAchivement {
  [x: string]: any;

  portfolioAchivement: {
    portfolioAchivements: { achievements: any[]; testimonies: any[] }[];
  }[];
}

interface Portfolio {
  id: number;
  about: string;
  artistCategory: string;
  coverPhoto: string;
  createdAt: string;
  experienceOverview: string;
  tagline: string;
  updatedAt: string;
  userId: number;
  experience: any[];
  education: any[];
}

interface PortfolioProps {
  portfolio: Portfolio;
  portfolioProject: { portfolioProjects: PortfolioProject[] }[];
  portfolioContact: { portfolioContacts: PortfolioContact[] }[];
  portfolioAchivement: PortfolioAchivement;
  user: { firstName: string; lastName: string; profileImage: string };
}

export default function profile({
  portfolio,
  portfolioContact,
  portfolioProject,
  portfolioAchivement,
  user,
}: PortfolioProps) {
  console.log("portfolio1:", portfolioProject);
  return (
    <Box sx={{ maxWidth: "1200px", margin: "0 auto", p: { xs: 2, md: 4 } }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            fontWeight: 700,
            color: "#1a1a1a",
            mb: 2,
            lineHeight: 1.2
          }}
        >
          {portfolio?.tagline}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            fontSize: "1.1rem",
            color: "#666",
            maxWidth: "800px",
            margin: "0 auto",
            lineHeight: 1.6
          }}
        >
          {portfolio?.about}
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column - Experience & Education */}
        <Grid item xs={12} md={8}>
          {/* Professional Experience */}
          <Card sx={{ mb: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <BusinessCenter sx={{ mr: 2, color: "#d1c7b8" }} />
                <Typography 
                  variant="h4" 
                  component="h2"
                  sx={{ 
                    fontSize: "1.8rem",
                    fontWeight: 600,
                    color: "#1a1a1a"
                  }}
                >
                  Professional Experience
                </Typography>
              </Box>
              
              {portfolio?.experience?.map((experience: any, index: any) => (
                <Box key={index} sx={{ mb: 3 }}>
                  {index !== 0 && <Divider sx={{ mb: 3 }} />}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          color: "#1a1a1a",
                          fontSize: "1.2rem"
                        }}
                      >
                        {experience?.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: "#666",
                          mt: 0.5
                        }}
                      >
                        {experience?.description}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`${experience?.dateRange?.from}-${experience?.dateRange?.to}`}
                      variant="outlined"
                      size="small"
                      sx={{ 
                        ml: 2,
                        borderColor: "#d1c7b8",
                        color: "#666",
                        fontWeight: 500
                      }}
                    />
                  </Box>
                </Box>
              ))}
              
              {(!portfolio?.experience || portfolio.experience.length === 0) && (
                <Typography sx={{ color: "#999", fontStyle: "italic" }}>
                  No experience added yet
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Education */}
          <Card sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <School sx={{ mr: 2, color: "#d1c7b8" }} />
                <Typography 
                  variant="h4" 
                  component="h2"
                  sx={{ 
                    fontSize: "1.8rem",
                    fontWeight: 600,
                    color: "#1a1a1a"
                  }}
                >
                  Educational Qualification
                </Typography>
              </Box>
              
              {portfolio?.education?.map((education: any, index: any) => (
                <Box key={index} sx={{ mb: 3 }}>
                  {index !== 0 && <Divider sx={{ mb: 3 }} />}
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: "#1a1a1a",
                      mb: 1
                    }}
                  >
                    {education.degree}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "#666",
                      mb: 0.5
                    }}
                  >
                    {education.instituteName}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "#999"
                    }}
                  >
                    {education.year} • {education.location}
                  </Typography>
                </Box>
              ))}
              
              {(!portfolio?.education || portfolio.education.length === 0) && (
                <Typography sx={{ color: "#999", fontStyle: "italic" }}>
                  No education details added yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Profile & Contact */}
        <Grid item xs={12} md={4}>
          {/* Profile Card */}
          <Card sx={{ mb: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: "center" }}>
              <Avatar 
                src={user?.profileImage}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  margin: "0 auto 2rem",
                  border: "4px solid #d1c7b8"
                }}
              />
              <Typography 
                variant="h4" 
                component="h2"
                sx={{ 
                  fontSize: "1.8rem",
                  fontWeight: 600,
                  color: "#1a1a1a",
                  mb: 1
                }}
              >
                {user?.firstName} {user?.lastName}
              </Typography>
              <Chip 
                label={portfolio?.artistCategory}
                sx={{ 
                  background: "#1a1a1a",
                  color: "white",
                  fontWeight: 500,
                  mb: 2
                }}
              />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#666",
                  lineHeight: 1.6,
                  textAlign: "center"
                }}
              >
                {portfolio?.experienceOverview}
              </Typography>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card sx={{ mb: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 2 }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Email sx={{ mr: 2, color: "#d1c7b8" }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: "#1a1a1a"
                  }}
                >
                  Contact
                </Typography>
              </Box>
              
              {portfolioContact?.[0]?.portfolioContacts?.map((contact: any, index: any) => (
                <Box key={index}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Phone sx={{ fontSize: 16, mr: 1, color: "#999" }} />
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      {contact.phoneNumber}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Email sx={{ fontSize: 16, mr: 1, color: "#999" }} />
                    <Typography variant="body2" sx={{ color: "#666" }}>
                      {contact.email}
                    </Typography>
                  </Box>
                </Box>
              ))}
              
              {!portfolioContact?.[0]?.portfolioContacts?.length && (
                <Typography sx={{ color: "#999", fontStyle: "italic" }}>
                  No contact information available
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Awards Card */}
          {portfolioAchivement[0]?.portfolioAchivement && 
           portfolioAchivement[0]?.portfolioAchivement.length > 0 && (
            <Card sx={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 2 }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <EmojiEvents sx={{ mr: 2, color: "#d1c7b8" }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: "#1a1a1a"
                    }}
                  >
                    Awards
                  </Typography>
                </Box>
                
                {portfolioAchivement?.map(
                  (achivementGroup: any, groupIndex: any) =>
                    achivementGroup?.portfolioAchivements?.map(
                      (achievement: any, achievementIndex: any) =>
                        achievement?.achievements?.map(
                          (award: any, awardIndex: any) => (
                            <Box key={`${groupIndex}-${achievementIndex}-${awardIndex}`} sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ color: "#666" }}>
                                • {award}
                              </Typography>
                            </Box>
                          )
                        )
                    )
                )}
              </CardContent>
            </Card>
          )}

          {/* Projects Card */}
          {portfolioProject[0]?.portfolioProjects && 
           portfolioProject[0]?.portfolioProjects.length > 0 && (
            <Card sx={{ mt: 4, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", borderRadius: 2 }}>
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Work sx={{ mr: 2, color: "#d1c7b8" }} />
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 600,
                      color: "#1a1a1a"
                    }}
                  >
                    Projects
                  </Typography>
                </Box>
                
                {portfolioProject?.[0]?.portfolioProjects?.map((project: any, index: any) => (
                  <Typography key={index} variant="body2" sx={{ color: "#666", mb: 1 }}>
                    • {project?.title}
                  </Typography>
                ))}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
