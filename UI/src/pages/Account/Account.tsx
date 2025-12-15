import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { inputSx } from "../../components/utils/CommonStyle";
import color from "../../components/utils/Colors";
import { docsUpload, editProfile, getPortfolio, getProfile, updatePortfolio } from "../../services/services";
import { toast } from "react-toastify";
import { getUserId, getUserRoll } from "../../services/axiosClient";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  // password: string;
  profileImage: string;
}

const Account: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  useEffect(() => {
    getProfile().then((res: { data: { data: React.SetStateAction<ProfileData>; }; }) => {
      setProfileData(res?.data?.data)
    }).catch((err: any) => {
      console.log(err)
      // Check if it's an authentication error
      if (err?.response?.status === 401) {
        console.error("Session expired");
        // Redirect to login page
        window.location.href = '/login';
      }
    })
  }, [])
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    // password: "password123",
    profileImage: "",
  });
  // console.log(profileData)

  const isMobile1 = useMediaQuery("(max-width:700px)");

  const [isEditable, setIsEditable] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setUploading(true);

      let formData = new FormData();
      formData.append("files", selectedFile);

      try {
        const res = await docsUpload(formData);
        const uploadedUrl = res?.data?.data?.doc0;

        setProfileData({ ...profileData, profileImage: uploadedUrl });
        toast("profileImage Uploaded Successfully")
      } catch (error) {
        console.error("Error uploading avatar:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const [portfolioId, setPortfolioId] = useState<any>("");

  useEffect(() => {
    if (getUserRoll() === "Artist") {
      const payLoad = {
        data: { filter: "", userId: getUserId() },
        page: 0,
        pageSize: 50,
        order: [["createdAt", "ASC"]],
      };
      getPortfolio(payLoad).then((res) => {
        // console.log(res)
        if (res?.data?.data?.rows[0]) {
          setPortfolioId(res?.data?.data?.rows[0]?.id);
        }
      })
    }
  }, [])
  // console.log(portfolioId)


  const toggleEdit = () => {
    if (isEditable) {
      const updatedData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        profileImage: profileData.profileImage,
      };

      const portfolioImageset = {
        profileImage: profileData.profileImage
      }




      if (getUserRoll() === "Artist") {
        updatePortfolio(portfolioId, portfolioImageset).then((res) => {
          console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      }



      editProfile(updatedData).then((res: { data: { msg: any; }; }) => {
        console.log(res)
        toast(res?.data?.msg);
        setIsEditable(false);
      }).catch((err: any) => {
        console.log(err);
      })

    } else {
      setIsEditable(true);
    }

  };

  // const [showPassword, setShowPassword] = useState(false);
  // const handleClickShowPassword = () => {
  //   setShowPassword(!showPassword);
  // };

  return (
    <Box
      className="header-box"
      sx={{
        backgroundImage: "url(/assets/head1.jpg)",
      }}
    >
      <Container
        style={{
          zIndex: 1,
          width: isMobile1 ? "85vw" : "65vw",
          border: "solid 0px #0079c1",
          marginBottom: "50px",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
          borderRadius: "8px",
          marginTop: "50px",
          padding: "0px",
          overflow: "hidden",
        }}
      >
        {/* <Typography variant="h4" gutterBottom>
                Profile Details
            </Typography> */}
        <Grid container spacing={0}>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            style={{
              position: "relative",
              display: "flex",
              background: color.textColor1,
              padding: "20px 0px",
              borderRadius: "8px 0px 0px 8px",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              style={{
                position: "absolute",
                top: 45,
                textAlign: "center",
                textShadow: "0px 0px 20px rgba(255,255,255,0.5)",
                color: "white",
                fontWeight: "bold",
                lineHeight: 1,
                fontSize: "20px",
              }}
            >
              <span>Hello!</span>
              <br />
            </Typography>

            <input
              accept="image/*"
              style={{ display: "none" }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
              disabled={!isEditable || uploading}
            />
            <label htmlFor="avatar-upload">
              <IconButton
                component="span"
                disabled={!isEditable || uploading}
                style={{
                  display: "flex",
                  borderRadius: "50%",
                  overflow: "hidden",
                  padding: 0,
                  flexDirection: "column",
                }}
              >
                <Avatar
                  src={profileData.profileImage}
                  alt="Profile Avatar"
                  sx={{
                    width: isMobile1 ? 100 : 150,
                    height: isMobile1 ? 100 : 150,
                    background: "white",
                    color: "grey",
                  }}
                ></Avatar>
                <PhotoCamera
                  style={{
                    position: "absolute",
                    boxShadow: "0px -4px 20px rgba(0,0,0,0.2)",
                    bottom: 1,
                    background: "rgba(255,255,255,0.5)",
                    width: "100%",
                  }}
                />
              </IconButton>
            </label>
            <Typography
              sx={{
                background: "white",
                color: color.textColor1,
                mt: 1,
                borderRadius: "4px",
                padding: "0px 10px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {profileData.firstName} {profileData.lastName}
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={8}
            style={{
              background: "white",
              zIndex: 1,
              boxShadow: isMobile1
                ? "0px 0px 10px rgba(0,0,0,0.2)"
                : "-6px 0px 20px rgba(0,0,0,0.2)",
              borderRadius: "0px 8px 8px 0px",
            }}
          >
            <div
              style={{
                padding: isMobile1 ? "5%" : "7%",
                paddingTop: "7%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: '10px'
              }}
            >
              <Typography
                component="h1"
                variant="h5"
                sx={{ fontWeight: "bold", mb: "4%" }}
              >
                Profile
              </Typography>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  style={{
                    width: isMobile1 ? "40%" : "30%",
                    display: "flex",
                    justifyContent: "flex-start",
                    fontWeight: "bold",
                    marginTop: '-6px'
                  }}
                >
                  First Name:
                </Typography>

                <TextField
                  name="firstName"
                  sx={inputSx}
                  className="input-root"
                  value={profileData.firstName}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    readOnly: !isEditable,
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  style={{
                    width: isMobile1 ? "40%" : "30%",
                    display: "flex",
                    justifyContent: "flex-start",
                    fontWeight: "bold",
                    marginTop: '-6px'

                  }}
                >
                  Last Name:
                </Typography>

                <TextField
                  name="lastName"
                  sx={inputSx}
                  className="input-root"
                  value={profileData.lastName}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    readOnly: !isEditable,
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  style={{
                    width: isMobile1 ? "40%" : "30%",
                    display: "flex",
                    justifyContent: "flex-start",
                    fontWeight: "bold",
                    marginTop: '-6px'

                  }}
                >
                  Email:
                </Typography>
                <TextField
                  name="email"
                  sx={inputSx}
                  //   className="input-root"
                  value={profileData.email}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    readOnly: !isEditable,
                  }}
                />{" "}
              </div>

              {/* <div
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  style={{
                    width: isMobile1 ? "40%" : "30%",
                    display: "flex",
                    justifyContent: "flex-start",
                    fontWeight: "bold",
                    marginTop: '-6px'

                  }}
                >
                  Password:
                </Typography>
                <TextField
                  sx={inputSx}
                  className="input-root"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={profileData.password}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{
                    readOnly: !isEditable,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          sx={{ color: color.textColor1, marginRight: "5px" }}
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          disabled={!isEditable}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />{" "}
              </div> */}

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flexDirection: isMobile1 ? "column" : "row",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={toggleEdit}
                  id="subscribe_btn"
                  style={{
                    marginTop: "20px",
                    marginBottom: 2,
                    height: "40px",
                    padding: "8px 10%",
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: "8px",
                    background: color.textColor1,
                    width: "fit-content",
                  }}
                >
                  {isEditable ? "Save Changes" : "Edit Profile"}
                </Button>
                {/* {isEditable && (
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => console.log("Profile updated", profileData)}
                    id="subscribe_btn"
                    style={{
                      marginTop: "20px",
                      marginBottom: 2,
                      marginLeft: "10px",
                      height: "40px",
                      padding: "8px 10%",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderRadius: "8px",
                      background: color.textColor1,
                      width: "fit-content",
                    }}
                  >
                    Save
                  </Button>
                )} */}
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Account;
