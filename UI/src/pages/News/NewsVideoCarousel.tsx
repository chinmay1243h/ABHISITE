import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Card, CardContent, styled } from "@mui/material";
import { faCalendar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import YouTube, { YouTubeEvent } from "react-youtube";
import { PlayCircleOutlineRounded } from "@mui/icons-material";
import color from "../../components/utils/Colors";
import { useNavigate } from "react-router-dom";

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 2,
  },
  desktop: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
  },
  tablet: {
    breakpoint: { max: 768, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const responsive1 = {
  superLargeDesktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
  },
  tablet: {
    breakpoint: { max: 768, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const CardStyled = styled(Card)<{ isPlaying: boolean }>(({ isPlaying }) => ({
  width: "100%",
  padding: "10px",
  margin: "5px",

  // flexShrink: 0,
  backgroundColor: "white",
  boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
  transition: isPlaying
    ? "none"
    : "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  transform: isPlaying ? "none" : "scale(1)",
  "&:hover": {
    boxShadow: isPlaying ? "none" : "0 4px 8px rgba(0, 0, 0, 0.2)",
    transform: isPlaying ? "none" : "scale(1.03)",
  },
}));
interface NewsVideos {
  trendingNewsVideos: any[]
}
const NewsVideoCarousel = ({ trendingNewsVideos }: NewsVideos) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [players, setPlayers] = useState<{ [key: number]: any }>({});
  const navigate = useNavigate();

  const handlePlayButtonClick = (index: number, id: any) => {
    navigate(`/news-details/${id}`)
    setPlayingIndex(index);
    if (players[index]) {
      players[index].playVideo();
    }
  };
  const extractVideoId = (url: string): string | undefined => {
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
    return match ? match[1] : undefined;
  };

  const onPlayerReady = (index: number) => {
    return (event: YouTubeEvent<any>) => {
      setPlayers((prevPlayers) => ({
        ...prevPlayers,
        [index]: event.target,
      }));
      if (playingIndex === index) {
        event.target.playVideo();
      }
    };
  };


  return (
    <Box
      sx={{
        height: "auto",
        borderColor: "black",
        flexWrap: "wrap",
        // background: "black",
        overflow: "hidden",
        color: "white",
      }}
    >
      {trendingNewsVideos.length > 0 && (
        <Box sx={{ m: 2, position: "relative" }}>
          <Typography
            className="heading"
            sx={{
              fontSize: "34px",
              // background: color.firstColor,
              my: 3,
            }}
          >
            Trending News Video
          </Typography>
          <Carousel responsive={responsive} infinite draggable={false}>
            {trendingNewsVideos.map((news, index) => (
              <CardStyled
                key={index}
                isPlaying={playingIndex === index}
                sx={{
                  cursor: "pointer",
                  objectFit: "fill",
                  borderRadius: "12px",
                  minHeight: "300px",
                }}
              >
                {playingIndex === index ? (
                  <YouTube
                    videoId={extractVideoId(news.videoUrl)}
                    opts={{ width: "100%", height: "280px" }}
                    onReady={onPlayerReady(index)}
                  />
                ) : (
                  <CardContent
                    onClick={() => handlePlayButtonClick(index, news.id)}
                    style={{
                      position: "relative",
                      height: "100%",
                      padding: 0,
                      background: "white",
                      //   backgroundImage: url(${news.imageUrl}),
                      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), url(${news.thumbnail})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      display: "flex",
                      alignItems: "flex-end",
                      borderRadius: "6px",
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "35%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      <PlayCircleOutlineRounded
                        style={{ width: "40px", height: "40px" }}
                      />
                    </div>

                    <div
                      style={{
                        zIndex: 2,

                        padding: "5px",
                        paddingTop: "0px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        position: "absolute",
                        bottom: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          marginTop: "10px",
                        }}
                      >
                        <Typography id="r-news-date">
                          <FontAwesomeIcon icon={faCalendar} /> {new Date(news.createdAt).toISOString().split("T")[0]}
                        </Typography>
                        <Typography id="r-news-date">
                          <FontAwesomeIcon icon={faUser} /> By {news.author}
                        </Typography>
                      </div>
                      <Typography style={{ color: 'white' }} id="r-news-head-horz">{news.title}</Typography>
                    </div>
                  </CardContent>
                )}
              </CardStyled>
            ))}
          </Carousel>
          <Carousel responsive={responsive1} infinite draggable={false}>
            {trendingNewsVideos.map((news, index) => (
              <CardStyled
                key={index}
                isPlaying={playingIndex === index}
                sx={{
                  cursor: "pointer",
                  objectFit: "fill",
                  borderRadius: "18px",
                  minHeight: "300px",
                }}
              >
                {playingIndex === index ? (
                  <YouTube
                    videoId={extractVideoId(news.videoUrl)}
                    opts={{ width: "100%", height: "280px" }}
                    onReady={onPlayerReady(index)}
                  />
                ) : (
                  <CardContent
                    onClick={() => handlePlayButtonClick(index, news.id)}
                    style={{
                      position: "relative",
                      height: "100%",
                      padding: 0,
                      background: "white",
                      //   backgroundImage: url(${news.imageUrl}),
                      backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)), url(${news.thumbnail})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      display: "flex",
                      alignItems: "flex-end",
                      borderRadius: "12px",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "35%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      <PlayCircleOutlineRounded
                        style={{ width: "40px", height: "40px" }}
                      />
                    </div>

                    <div
                      style={{
                        zIndex: 2,

                        padding: "5px",
                        paddingTop: "0px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        position: "absolute",
                        bottom: 10,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: "5px",
                          marginTop: "10px",
                        }}
                      >
                        <Typography id="r-news-date">
                          <FontAwesomeIcon icon={faCalendar} /> {new Date(news.createdAt).toISOString().split("T")[0]}
                        </Typography>
                        <Typography id="r-news-date">
                          <FontAwesomeIcon icon={faUser} /> By {news.author}
                        </Typography>
                      </div>
                      <Typography style={{ color: 'white' }} id="r-news-head-horz">{news.title}</Typography>
                    </div>
                  </CardContent>
                )}
              </CardStyled>
            ))}
          </Carousel>
        </Box>
      )}
    </Box>
  );
};

export default NewsVideoCarousel;
