import { MoreVert, SendRounded } from "@mui/icons-material";
import ShareIcon from "@mui/icons-material/Share";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AudioPlayer from "../../components/utils/AudioPlayer";
import color from "../../components/utils/Colors";
import { inputSx } from "../../components/utils/CommonStyle";
import CoursesCarousel from "../../components/utils/CoursesCarousel";
import "../../App.css";
const mockData = [
  // {
  //   id: 1,
  //   type: "video",
  //   title: "Sample Video",
  //   artist: "Artist 1",
  //   description: "This is a sample video.",
  //   source: "https://www.w3schools.com/html/mov_bbb.mp4",
  // },
  {
    id: 2,
    type: "audio",
    title: "Sample Audio",
    artist: "Artist 2",
    description: "This is a sample audio file.",
    source: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  // {
  //   id: 3,
  //   type: "document",
  //   title: "Sample PDF",
  //   artist: "Artist 3",
  //   description: "This is a sample PDF document.",
  //   source: "https://morth.nic.in/sites/default/files/dd12-13_0.pdf",
  // },
];

const CourseDetails = () => {
  const [comments, setComments] = useState<string[]>([]);
  const [newComment, setNewComment] = useState("");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [menuCommentIndex, setMenuCommentIndex] = useState<number | null>(null);

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, newComment.trim()]);
      setNewComment("");
    }
  };

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

  const audioData = mockData.find((item) => item.type === "audio");

  const renderContent = (item: (typeof mockData)[0]) => {
    switch (item.type) {
      case "video":
        return (
          <video controls width="100%" style={{ borderRadius: "12px" }}>
            <source src={item.source} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      case "audio":
        return (
          <>
            {/* <audio controls>
              <source src={item.source} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio> */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                position: "relative",
              }}
            >
              <div className="visualizer-container">
                {[...Array(40)].map((_, index) => (
                  <div key={index} className="bar"></div>
                ))}
              </div>
              {audioData ? (
                <AudioPlayer data={audioData} />
              ) : (
                <p>No audio data available</p>
              )}
            </div>
          </>
        );
      case "document":
        return (
          // const express = require("express");
          // const request = require("request");

          // const app = express();

          // app.get("/proxy", (req, res) => {
          //   const url = req.query.url;
          //   request(url).pipe(res);
          // });

          // app.listen(3000, () => console.log("Proxy server running on port 3000"));

          <iframe
            src={`http://your-proxy-server.com/proxy?url=${encodeURIComponent(
              item.source
            )}`}
            title={item.title}
            width="100%"
            height="500px"
          ></iframe>
        );
      default:
        return null;
    }
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
        {mockData.map((item) => (
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
            key={item.id}
          >
            {renderContent(item)}
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
                <Typography variant="h5">{item.title}</Typography>

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

                  <Typography variant="subtitle1">By {item.artist}</Typography>
                </div>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                  {item.description}
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
        ))}

        <div
          style={{
            border: "solid 2px",
            borderColor: color.secondColor,
            borderRadius: "12px",
            padding: "10px",
            paddingTop: "0px",
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: 2, mt: 1 }}
          >
            <Grid item>
              <Avatar />
            </Grid>
            <Grid item xs>
              <TextField
                sx={{
                  ...inputSx,
                  "& .MuiInputBase-root": { borderColor: color.secondColor },
                }}
                style={{ borderColor: "red" }}
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddComment();
                  }
                }}
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
                <SendRounded style={{ fontSize: "12px", marginLeft: "5px" }} />
              </Button>
            </Grid>
          </Grid>
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
              {comments.map((comment, index) => (
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
                      User {index + 1}
                      <span
                        style={{
                          fontFamily: "custom-regular",
                          fontSize: "12px",
                          marginLeft: "10px",
                        }}
                      >
                        2mins ago
                      </span>
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
                      {comment}
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
                    open={Boolean(anchorEl) && menuCommentIndex === index}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleDeleteComment}>Delete</MenuItem>
                  </Menu>
                </Box>
              ))}
            </Box>
          </Box>
        </div>

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
    </Box>
  );
};

export default CourseDetails;
