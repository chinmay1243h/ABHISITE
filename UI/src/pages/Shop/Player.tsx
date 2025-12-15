import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  IconButton,
  List,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AudioPlayer from "../../components/payments/AudioPlayer";
import PDFViewer from "../../components/payments/PdfPlayer";
import VideoPlayer from "../../components/payments/VideoPlayer";
import {
  getAllComments,
  getCourseBelongsTo,
  getOneCourse,
  getProfile,
  postComment,
} from "../../services/services";
import CoursesCarousel from "../../components/utils/CoursesCarousel";
import color from "../../components/utils/Colors";
import { MoreVert, SendRounded } from "@mui/icons-material";
import ShareIcon from "@mui/icons-material/Share";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { inputSx } from "../../components/utils/CommonStyle";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  // password: string;
  profileImage: string;
}

const Player = () => {
  const [courseData, setCourseData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [courseType, setCourseType] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [thumbnail, setThumbnail] = useState<string>("")
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState<string>("");


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

  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    getOneCourse(id)
      .then((res: any) => {
        setThumbnail(res?.data?.data?.thumbnail)
        setFirstName(res?.data?.data?.firstName);
        setLastName(res?.data?.data?.lastName);
        setDesc(res?.data?.data?.description)
        if (res?.data?.data?.courseType === "PDF") {
          setCourseType(res?.data?.data?.courseType?.charAt(0).toUpperCase() + res?.data?.data?.courseType?.slice(1).toLowerCase());

        } else {
          setCourseType(res?.data?.data?.courseType);
        }

      })
      .catch((err: any) => {
        console.error(err);
        setError("Failed to fetch course type.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!courseType) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getCourseBelongsTo({
          id: id,
          secondTable: courseType,
        });
        console.log(res)
        if (courseType === 'Video') {
          setCourseData(res?.data?.data[0][courseType]);
        }
        else {
          setCourseData(res?.data?.data[0][courseType.toLowerCase()]);

        }

      } catch (err) {
        console.error(err);
        setError("Failed to fetch course data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, courseType]);
  const [user, setUser] = useState<any>({
    firstName: "jhy",
  });

  useEffect(() => {
    getProfile()
      .then((res: any) => {
        setUser(res?.data?.data);
      })
      .catch((err: any) => {
        console.error(err);
        // Check if it's an authentication error
        if (err?.response?.status === 401) {
          console.error("Session expired");
          // Redirect to login page
          window.location.href = '/login';
        }
      });
  }, []);

  const handleAddComment = () => {
    if (!newComment.trim()) return; // Prevent empty comments

    const payLoad = {
      courseId: id,
      comment: newComment,
      name: user.firstName,
    };

    postComment(payLoad)
      .then((res: any) => {
        toast(res?.data?.msg);
        setComments((prevComments) => [
          ...prevComments,
          { username: user.firstName, text: newComment },
        ]);
        setNewComment(""); // Clear the comment input field after adding
      })
      .catch((err: any) => {
        console.error("Error posting comment:", err);
        toast.error("Failed to add comment.");
      });
  };

  useEffect(() => {
    const payLoad = {
      data: { filter: "", courseId: id },
      page: 0,
      pageSize: 50,
      order: [["createdAt", "ASC"]],
    };
    getAllComments(payLoad).then((res) => {
      setComments(res?.data?.data?.rows);
    });
  }, [id]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (courseData?.videoUrl) {
      setVideoUrl(courseData.videoUrl);
    }
  }, [courseData?.videoUrl]);
  const [songUrl, setSongUrl] = useState<string>("");

  useEffect(() => {
    if (courseData?.audioUrl) {
      setSongUrl(courseData.audioUrl);
    }
  }, [courseData?.audioUrl]);
  const [pdfUrl, setPdfUrl] = useState<string>("");

  useEffect(() => {
    if (courseData?.pdfUrl) {
      setPdfUrl(courseData.pdfUrl);
    }
  }, [courseData?.pdfUrl]);


  const renderPlayer = () => {
    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;
    if (!courseData)
      return <Typography>No data available for this course.</Typography>;






    switch (courseType) {
      case "Video":
        return videoUrl ? <VideoPlayer url={videoUrl} /> : <CircularProgress />;
      case "Audio":
        return <AudioPlayer data={songUrl} thumbnail={thumbnail} />;
      case "Pdf":
        return <PDFViewer url={pdfUrl} />;
      default:
        return <Typography>Unsupported course type</Typography>;
    }

  };

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [menuCommentIndex, setMenuCommentIndex] = useState<number | null>(null);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    setAnchorEl(event.currentTarget);
    setMenuCommentIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuCommentIndex(null);
  };

  const handleDeleteComment = () => {
    setComments(comments.filter((_, index) => index !== menuCommentIndex));
    handleMenuClose();
  };

  return (
    <Box sx={{ background: "white" }}>
      <Box
        sx={{
          padding: 3,
          background: "white",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >

        <Card
          sx={{
            marginBottom: 3,
            p: 2,
            pb: 0,
            width: "100%",
            background: color.secondColor,
            borderRadius: "12px",
            color: "white",
          }}
        // key={item.id}
        >
          {renderPlayer()}

          <CardContent
            sx={{
              p: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 1,
            }}
          >
            <div>
              <Typography variant="h5">{/* {item.title} */}</Typography>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
              >
                <Avatar style={{ height: "28px", width: "28px" }} />

                <Typography variant="subtitle1">{firstName}{" "}{lastName}</Typography>
              </div>
              <Typography variant="body2" sx={{ marginBottom: 1 }}>
                {desc}
              </Typography>
            </div>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: 2,
                pt: 0,
              }}
            >
              <Box>
                <IconButton
                  style={{
                    color: "white",
                  }}
                >
                  <ThumbUpIcon />
                </IconButton>
                <IconButton
                  style={{
                    color: "white",
                  }}
                >
                  <ShareIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <div
          style={{
            border: "solid 2px",
            borderColor: color.secondColor,
            borderRadius: "12px",
            padding: "10px",
            paddingTop: "0px",
          }}
        >
          <Box mt={3}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              sx={{ marginBottom: 2, mt: 1 }}
            >
              <Grid item>
                <Avatar
                  src={profileData.profileImage}
                  alt="Profile Avatar"
                  sx={{

                    background: "white",
                    color: "grey",
                  }}
                ></Avatar>
              </Grid>
              <Grid item xs>
                <TextField
                  sx={{
                    ...inputSx,
                    "& .MuiInputBase-root": {
                      borderColor: color.secondColor,
                    },
                  }}
                  style={{ borderColor: "red" }}
                  label="Add a comment..."
                  variant="outlined"
                  fullWidth
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </Grid>
              <Grid item>
                <Button
                  sx={{
                    fontSize: "12px",
                    background: color.secondColor,
                    textTransform: "none",
                  }}
                  variant="contained"
                  onClick={handleAddComment}
                >
                  Comment{" "}
                  <SendRounded
                    style={{ fontSize: "12px", marginLeft: "5px" }}
                  />
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              m: -1.5,
              marginTop: 4,
              p: 2,
              borderRadius: "0px 0px 12px 12px",
              background: color.secondColor,
              color: "white",
            }}
          >
            <Typography sx={{ mb: 2 }} variant="h6">
              Comments ({comments.length})
            </Typography>

            <Box sx={{ overflow: "hidden" }}>
              {comments.length === 0 ? (
                <Typography>
                  No comments yet. Be the first to comment!
                </Typography>
              ) : (
                <List>
                  {comments.map((comment, index) => (
                    <>
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          marginBottom: 2,
                          width: "100%",
                        }}
                      >
                        <Avatar sx={{ marginRight: 2 }} />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle2">
                            {comment.name}
                            {/* <span
                                style={{
                                  fontFamily: "custom-regular",
                                  fontSize: "12px",
                                  marginLeft: "10px",
                                }}
                              >
                                2mins ago
                              </span> */}
                          </Typography>
                          <Typography
                            variant="body2"
                            style={{
                              display: "-webkit-box",
                              WebkitBoxOrient: "vertical",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              WebkitLineClamp: 3,
                            }}
                          >
                            {comment.comment}
                          </Typography>
                        </Box>
                        <IconButton
                          onClick={(event) => handleMenuOpen(event, index)}
                          sx={{ marginLeft: 1, color: "white" }}
                        >
                          <MoreVert />
                        </IconButton>
                        <Menu
                          anchorEl={anchorEl}
                          open={
                            Boolean(anchorEl) && menuCommentIndex === index
                          }
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={handleDeleteComment}>
                            Delete
                          </MenuItem>
                        </Menu>
                      </Box>
                    </>
                  ))}
                </List>
              )}
            </Box>
          </Box>
        </div>
      </Box>
      <Typography
        sx={{
          fontSize: "28px",
          my: 2,
          mt: 4,
          pl: 2,
          textDecoration: "underline",
        }}
      >
        Related Courses
      </Typography>
      <CoursesCarousel textused={false}></CoursesCarousel>
    </Box>

  );
};

export default Player;
