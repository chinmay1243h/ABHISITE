import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Card, CardContent, IconButton, Skeleton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { faCalendar, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import color from "../../components/utils/Colors";
import { useNavigate } from "react-router-dom";
import { responsive } from "../../components/utils/CommonStyle";



interface CustomArrowProps {
  onClick?: () => void;
}
interface TrendingNews {
  trendingNews: any[];
}

const CustomLeftArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      left: 4,
      top: "40%",
      transform: "translateY(-)",
      // boxShadow: "-5px -5px 10px rgba(0, 0, 0, 0.97) inset",
      color: "black",
      borderRadius: "0px 4px 4px 0px",
      background: "white",
      height: "60px",

      transition: "color 0.3s ease,background 0.3s ease",
      "&:hover": {
        // color: "red",
        background: "rgb(246, 246, 246)",
        // boxShadow: "-5px -5px 10px rgba(0, 0, 0, 0.37) inset",
      },
    }}
  >
    <ArrowBackIosIcon sx={{ translate: "8px 0px", borderRadius: "0px" }} />
  </IconButton>
);

const CustomRightArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      right: 4,
      top: "40%",
      transform: "translateY(-)",
      // boxShadow: "-5px -5px 10px rgba(0, 0, 0, 0.97) inset",
      color: "black",
      borderRadius: "4px 0px 0px 4px",
      background: "white",
      height: "60px",

      transition: "color 0.3s ease,background 0.3s ease",
      "&:hover": {
        // color: "red",
        background: "rgb(246, 246, 246)",
        // boxShadow: "-5px -5px 10px rgba(0, 0, 0, 0.37) inset",
      },
    }}
  >
    <ArrowForwardIosIcon />
  </IconButton>
);

const NewsCarousel = ({ trendingNews }: TrendingNews) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={(theme) => ({
        height: "auto",
        borderColor: "black",
        flexWrap: "wrap",
        // background: "black",
        overflow: "hidden",
        color: "white",
      })}
    >
      {/* {title && <Typography className="heading">{title}</Typography>} */}
      <Box sx={{ m: 2, position: "relative" }}>
        <Typography
          className="heading"
          sx={{
            my: 4,
          }}
        >
          Trending News
        </Typography>
        <Carousel
          responsive={responsive}
          infinite
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
          draggable={false}
        //   autoPlay={true}
        >


          {!trendingNews || trendingNews.length === 0 ? (
            <Box
              p={4}
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Card
                sx={{
                  minHeight: "336px",
                  zIndex: 5,
                  width: "300px",
                  background: "#f0f0f0",
                  boxShadow: "none",
                  borderRadius: "10px",
                  position: "relative",
                  overflow: "hidden",
                  // marginTop: "30px",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  height="100%"
                  style={{ borderRadius: "6px" }}
                />
                <CardContent
                  style={{
                    paddingBottom: "8px",
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "100%",
                  }}
                >

                  <Box
                    sx={{
                      display: "flex",
                      gap: '10px'
                      // justifyContent: "flex-start",
                    }}
                  >
                    <Skeleton variant="text" width="30%" height="30px" />
                    <Skeleton variant="text" width="30%" height="30px" />
                  </Box>

                  <Skeleton variant="text" width="40%" height="30px" />

                  {/* <Skeleton variant="text" width="80%" height="50px" /> */}
                </CardContent>
              </Card>
            </Box>
          ) : (

            trendingNews.map((news, index) => (
              <Box
                p={4}

                sx={{ display: "flex", justifyContent: "center", width: "100%" }}
              >
                <div
                  key={news.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "300px",
                    margin: "5px",
                    border: "solid 1px white",
                    borderRadius: "6px",
                    overflow: "hidden",
                    padding: "10px",
                    background: "white",
                    // height: "300px",
                    //   justifyContent: "space-between",
                    // gap: "10px",
                    //   marginBottom: "15px",
                  }}
                  onClick={() => navigate(`/news-details/${news?.id}`)}

                >
                  <Box
                    sx={{
                      backgroundImage: `url(${news.thumbnail})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center-top",
                      backgroundRepeat: "no-repeat",
                      minWidth: "85px",
                      height: "250px",
                    }}
                  ></Box>

                  <div
                    style={{
                      padding: "5px",
                      paddingTop: "0px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
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
                        <FontAwesomeIcon icon={faCalendar} />
                        {new Date(news.createdAt).toISOString().split("T")[0]}
                      </Typography>
                      <Typography id="r-news-date">
                        <FontAwesomeIcon icon={faUser} /> By {news.author}
                      </Typography>
                    </div>
                    <Typography
                      onClick={() => {
                        navigate(`/news-details/${news.id}`);
                      }}
                      id="r-news-head-horz"
                    >
                      {news.title}
                    </Typography>
                  </div>
                </div>
              </Box>
            ))

          )}
        </Carousel>
      </Box>
    </Box>
  );
};

export default NewsCarousel;
