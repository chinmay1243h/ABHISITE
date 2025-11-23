import { faCamera, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import color from "../../components/utils/Colors";

import { useNavigate, useParams } from "react-router-dom";
import Achievements from "./Achievements";
import Contact from "./Contact";
import Photos from "./Photos";
import Profile from "./Profile";
import Projects from "./Projects";
import { getportfolioAchivement, getportfolioContact, getportfolioData, getPortfolioDetails, getPortfolioDetailsBelongsToTable, getPortfolioPhoto, getportfolioProject, getProfile } from "../../services/services";
import { getfirstName, getlastName, getUserId, getUserRoll } from "../../services/axiosClient";
import { toast } from "react-toastify";
export const Portfolio: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const TabPanel = ({
    children,
    value,
    index,
  }: {
    children: React.ReactNode;
    value: number;
    index: number;
  }) => (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
  const { id } = useParams();
  const userId = getUserId();

  const [portfolio, setPortfolio] = useState<any>([])
  const [user, setUser] = useState<any>([])
  const [portfolioProject, setPortfolioProject] = useState<any>([])
  const [portfolioPhoto, setPortfolioPhoto] = useState<any>([])
  const [portfolioAchivement, setPortfolioAchivement] = useState<any>([])
  const [portfolioContact, setPortfolioContact] = useState<any>([])



  useEffect(() => {
    getProfile().then((res) => {
      // console.log(res)
      setUser(res?.data?.data)
    }).catch((err) => {
      console.log(err)
    })
  }, [])



  useEffect(() => {
    getPortfolioDetails(userId).then((res) => {
      console.log(res)
      setPortfolio(res?.data?.data);
    }).catch((err) => {
      console.log(err)
      toast(err);
    })
  }, [])

  console.log(portfolio.id)
  useEffect(() => {
    if (portfolio?.id) {

      getPortfolioDetailsBelongsToTable({
        id: portfolio.id,
        secondTable: "portfolioProject",
      })
        .then((res) => {
          console.log(res);
          setPortfolioProject(res?.data?.data);
        })
        .catch((err) => {
          console.log(err);
          toast(err);
        });

      getPortfolioDetailsBelongsToTable({
        id: portfolio.id,
        secondTable: "portfolioPhoto",
      })
        .then((res) => {
          // console.log(res);
          setPortfolioPhoto(res?.data?.data);
        })
        .catch((err) => {
          console.log(err);
          toast(err);
        });

      getPortfolioDetailsBelongsToTable({
        id: portfolio.id,
        secondTable: "portfolioAchivement",
      })
        .then((res) => {
          console.log(res);
          setPortfolioAchivement(res?.data?.data);
        })
        .catch((err) => {
          console.log(err);
          toast(err);
        });

      getPortfolioDetailsBelongsToTable({
        id: portfolio.id,
        secondTable: "portfolioContact",
      })
        .then((res) => {
          // console.log(res);
          setPortfolioContact(res?.data?.data);
        })
        .catch((err) => {
          console.log(err);
          toast(err);
        });
    }
  }, [portfolio.id]);

  // console.log(portfolio)

  return (
    <>
      <div>
        <Box
          sx={{
            // background: color.firstColor,
            background: "white",
            width: "100%",
            minHeight: "100vh",
            mt: { xs: "-174px", md: "-94px" },
            pb: 4,
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.2))",
              //   backdropFilter: "blur(2px)",
              // zIndex: 1,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 2,
              position: "relative",
            }}
          >
            <Button
              onClick={() => {
                navigate(`/portfolio-form?id=${getUserId()}&firstName=${getfirstName()}&lastName=${getlastName()}`, { state: id });
              }}
              id="custom-button"
              sx={{
                position: "absolute",
                right: { xs: '10px', md: '100px' },
                bottom: "150px",

              }}
              style={{
                color: color.textColor1,
                borderColor: color.textColor1,
                fontSize: "16px",
                display: "flex",
                gap: "10px",
                textTransform: 'none'
              }}
            >
              Edit
              <FontAwesomeIcon icon={faEdit}></FontAwesomeIcon>
            </Button>

            <Box
              sx={{
                backgroundImage: `url(${portfolio?.coverPhoto})`,
                backgroundSize: "cover",
                objectPosition: "center top",
                height: "250px",
                width: "100%",
                position: "absolute",
                zIndex: 1,
              }}
            >
              {/* <FontAwesomeIcon
                icon={faCamera}
                style={{
                  fontSize: "24px",
                  bottom: 20,
                  right: 20,
                  position: "absolute",
                  color: "white",
                  // textShadow: "2px 2px 8px rgba(0, 0, 0, 0.68)",
                  filter: "drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.28))",
                }}
              ></FontAwesomeIcon> */}
            </Box>

            <Box
              sx={{
                backgroundImage: `url(${user.profileImage})`,
                // backgroundImage: "url(/images/Photography.jpg)",
                backgroundSize: "cover",
                height: "200px",
                width: "200px",
                borderRadius: "50%",
                mt: 16,
                zIndex: 2,
                position: "relative",
              }}
            >
              {/* <FontAwesomeIcon
                icon={faCamera}
                style={{
                  fontSize: "24px",
                  bottom: 20,
                  right: 20,
                  position: "absolute",
                  color: "white",
                  // textShadow: "2px 2px 8px rgba(0, 0, 0, 0.68)",
                  filter: "drop-shadow(0px 0px 8px rgba(0, 0, 0, 0.28))",
                }}
              ></FontAwesomeIcon> */}
            </Box>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Typography fontSize={"32px"}>{user?.firstName}{" "}{user?.lastName}</Typography>
              {/* <Typography fontSize={"18px"} fontFamily={'custom-regular'}>
              "Jane Doe" is a placeholder name often used in legal contexts,
              healthcare, and general examples when referring to an
              unidentified, anonymous, or hypothetical female individual.{" "}
            </Typography> */}
            </div>

            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                maxWidth: '100%',
                overflow: 'hidden',
                mb: 4,
                "& .MuiTab-root": {
                  color: "gray",
                  "&.Mui-selected": {
                    color: color.textColor1,
                  },
                },
              }}
              TabIndicatorProps={{
                style: {
                  backgroundColor: "#1fd8d1",
                },
              }}
            >
              <Tab label="Profile" />
              {/* <Tab label="About" /> */}
              <Tab label="Projects" />
              <Tab label="Photos" />
              <Tab label="Achievements" />
              {/* <Tab label="Blogs" /> */}
              {getUserRoll() === "User" && <Tab label="Contact" />}

            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <Profile portfolio={portfolio}
              portfolioProject={portfolioProject}
              portfolioContact={portfolioContact}
              portfolioAchivement={portfolioAchivement}
              user={user}></Profile>
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <Projects portfolioProject={portfolioProject}></Projects>
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            <Photos portfolioPhoto={portfolioPhoto}></Photos>
          </TabPanel>
          <TabPanel value={activeTab} index={3}>
            <Achievements
              portfolioAchivement={portfolioAchivement} />
          </TabPanel>
          {getUserRoll() === "User" && (
            <TabPanel value={activeTab} index={4}>
              <Contact portfolioContact={portfolioContact} user={user} />
            </TabPanel>
          )}

        </Box>
      </div>
    </>
  );
};
