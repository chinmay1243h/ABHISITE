import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";

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
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "80%",
          margin: "auto",
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            height: "100%",
            width: { xs: "100%", md: "50%" },
          }}
        >
          <Typography sx={{ fontSize: "32px" }}>
            {portfolio?.tagline}
          </Typography>
          <Typography
            sx={{ fontSize: "16px", mt: 2, fontFamily: "custom-regular" }}
          >
            {portfolio?.about}
          </Typography>

          {/* <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              mt: 2,
            }}
          >
            <IconButton
              color="inherit"
              component="a"
              href={"https://facebook.com/"}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" component="a" href={"https://x.com/"}>
              <TwitterIcon />
            </IconButton>
            <IconButton
              color="inherit"
              component="a"
              href={"https://linkedin.com/"}
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              color="inherit"
              component="a"
              href={"https://instagram.com"}
            >
              <InstagramIcon />
            </IconButton>
          </Box> */}
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "40%" },
            display: "flex",
          }}
        >
          <Box
            sx={{
              backgroundImage: `url(${user?.profileImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "350px",
              width: "300px",
              zIndex: 1,
              justifySelf: "center",
              marginLeft: { xs: "none", md: "auto" },
            }}
          ></Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "start", md: "space-between" },
          alignItems: "center",
          maxWidth: "100%",
          margin: "auto",
          minHeight: "400px",
          marginTop: "30px",
          flexDirection: { xs: "column-reverse", md: "row" },
          gap: 6,
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            height: "100%",
            width: { xs: "100%", md: "50%" },
          }}
        >
          <Typography sx={{ fontSize: "22px" }}>
            Professional Experience(s)
          </Typography>

          {portfolio?.experience?.map((experience: any, index: any) => (
            <div key={index}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "25px",
                  marginBottom: "10px",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>
                  {experience?.title}
                </Typography>
                <Typography sx={{ fontWeight: "bold" }}>
                  {experience?.dateRange?.from}-{experience?.dateRange?.to}
                </Typography>
              </div>

              <div
                style={{
                  fontFamily: "custom-regular",
                  fontSize: "14px",
                  textAlign: "left",
                }}
              >
                {experience?.description}
              </div>
            </div>
          ))}

          <Typography sx={{ fontSize: "22px", mt: 4, mb: 2 }}>
            Educational Qualification
          </Typography>

          {portfolio?.education?.map((education: any, index: any) => (
            <div key={index}>
              <Typography
                sx={{
                  textAlign: "left",
                  fontSize: "14px",
                  mt: 2,
                  fontWeight: "bold",
                }}
              >
                {education.degree}
              </Typography>
              <Typography
                sx={{
                  textAlign: "left",
                  fontFamily: "custom-regular",
                  fontSize: "14px",
                }}
              >
                {education.instituteName}, {education.year},{" "}
                {education.location}
              </Typography>
            </div>
          ))}
        </Box>

        <Box
          sx={{
            width: { xs: "100%", md: "40%" },

            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: "300px",
            }}
          ></Box>
          <Typography sx={{ fontSize: "22px", textAlign: "center" }}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              background: "black",
              color: "white",
              fontSize: "16px",
              borderRadius: "44px",
              margin: "auto",
              marginTop: "10px",
              padding: "2px 25px",
              width: "fit-content",
            }}
          >
            {portfolio?.artistCategory}
          </Typography>

          <Typography
            sx={{
              marginTop: "15px",
              fontSize: "12px",
              lineHeight: 1.2,
              fontFamily: "custom-regular",
            }}
          >
            {portfolio?.experienceOverview}
          </Typography>

          {portfolioAchivement[0]?.portfolioAchivement &&
            portfolioAchivement[0]?.portfolioAchivement.length > 0 && (
              <>
                <Typography
                  sx={{
                    marginTop: "15px",
                    textAlign: "left",
                  }}
                >
                  Awards{" "}
                  <FontAwesomeIcon
                    style={{ fontSize: "12px", marginLeft: "4px" }}
                    icon={faArrowUpRightFromSquare}
                  ></FontAwesomeIcon>
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "custom-regular",
                    fontSize: "12px",
                    textAlign: "left",
                    marginTop: "5px",
                  }}
                >
                  {portfolioAchivement?.map(
                    (achivementGroup: any, groupIndex: any) =>
                      achivementGroup?.portfolioAchivements?.map(
                        (achievement: any, achievementIndex: any) =>
                          achievement?.achievements?.map(
                            (award: any, awardIndex: any) => (
                              <li
                                key={`${groupIndex}-${achievementIndex}-${awardIndex}`}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <span
                                  style={{
                                    marginRight: "8px",
                                    fontSize: "1.2em",
                                  }}
                                >
                                  .
                                </span>
                                {award}
                              </li>
                            )
                          )
                      )
                  )}
                </Typography>
              </>
            )}

          {portfolioProject[0]?.portfolioProjects &&
            portfolioProject[0]?.portfolioProjects.length > 0 && (
              <Typography
                sx={{
                  marginTop: "15px",
                  textAlign: "left",
                }}
              >
                Projects
                <FontAwesomeIcon
                  style={{ fontSize: "12px", marginLeft: "4px" }}
                  icon={faArrowUpRightFromSquare}
                ></FontAwesomeIcon>
              </Typography>
            )}

          {portfolioProject?.[0]?.portfolioProjects?.map(
            (project: any, index: any) => (
              <Typography
                key={index}
                sx={{
                  fontFamily: "custom-regular",
                  fontSize: "12px",
                  textAlign: "left",
                  marginTop: "5px",
                }}
              >
                {project?.title} <br />
              </Typography>
            )
          )}

          <Typography
            sx={{
              marginTop: "15px",
              textAlign: "left",
            }}
          >
            Contact
            <FontAwesomeIcon
              style={{ fontSize: "12px", marginLeft: "4px" }}
              icon={faArrowUpRightFromSquare}
            ></FontAwesomeIcon>
          </Typography>

          {portfolioContact?.[0]?.portfolioContacts?.map(
            (contact: any, index: any) => (
              <div key={index}>
                <Typography
                  sx={{
                    fontFamily: "custom-regular",
                    fontSize: "12px",
                    textAlign: "left",
                  }}
                >
                  Phone: {contact.phoneNumber} <br />
                  Email: {contact.email}
                </Typography>
              </div>
            )
          )}
        </Box>
      </Box>
    </>
  );
}
