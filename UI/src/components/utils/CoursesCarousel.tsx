import {
  faCalendar,
  faChevronCircleRight,
  faFileAlt,
  faMusic,
  faQuoteLeft,
  faQuoteRight,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Avatar, Card, CardContent, IconButton, Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllCourse } from "../../services/services";
import ShopCard from "../cards/ShopCard";
import color from "./Colors";
import { responsive } from "./CommonStyle";

const responsive1 = {
  superLargeDesktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
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

interface CustomArrowProps {
  onClick?: () => void;
}

const CustomLeftArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      left: 10,
      top: "45%",
      transform: "translateY(-50%)",
      background: color.thirdColor,
      color: "black",
      transition: "all 0.3s ease",
      boxShadow: "-5px -5px 10px rgba(0, 0, 0, 0.13) inset",

      "&:hover": {
        background: "rgba(0, 0, 0, 0.47)",
        color: "white",
      },
    }}
  >
    <ArrowBackIosIcon sx={{ translate: "5px 0px", fontSize: "24px" }} />
  </IconButton>
);

const CustomRightArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      right: 10,
      top: "45%",
      transform: "translateY(-50%)",
      background: color.thirdColor,
      color: "black",
      transition: "all 0.3s ease",
      boxShadow: "-5px -5px 10px rgba(0, 0, 0, 0.13) inset",

      "&:hover": {
        background: "rgba(0, 0, 0, 0.47)",
        color: "white",
      },
    }}
  >
    <ArrowForwardIosIcon />
  </IconButton>
);

interface CoursesCarouselProps {
  textused: boolean;
}

const CoursesCarousel: React.FC<CoursesCarouselProps> = ({ textused }) => {


  const [booksData, setBooksData] = useState<any>([]);

  useEffect(() => {
    const payLoad = {
      data: { filter: "" },
      page: 0,
      pageSize: 50,
      order: [["createdAt", "ASC"]],
    };
    getAllCourse(payLoad)
      .then((res: any) => {
        console.log(res?.data?.data?.rows);
        setBooksData(res?.data?.data?.rows);
      })
      .catch((err: any) => {
        // console.log(err)
        toast.error(err);
      });
  }, []);

  const navigate = useNavigate();

  return (
    <div
      style={
        {
          // background: color.firstColor,
          // background:'white',
          // padding: "20px",
        }
      }
    >
      {textused && (
        <>
          <Typography
            sx={{
              textAlign: "center",
              fontFamily: "Rosttel",
              fontSize: "60px",
              marginBottom: "-54px",
              color: "white",
            }}
          >
            Artist's
          </Typography>

          <Box
            style={{ textAlign: "center" }}
            sx={{
              px: 2,
              borderRadius: "12px",
              fontSize: "12px",
              color: "white",
              width: "fit-content",
              margin: "auto",
              mb: 4,
              py: 2,
            }}
          >
            <Typography
              style={{ background: color.headingBg }}
              className="heading"
            >
              Top Courses
            </Typography>
            <FontAwesomeIcon
              style={{
                color: color.textColor,

                marginBottom: "6px",
                marginRight: "5px",
                fontSize: "14px",
              }}
              icon={faQuoteLeft}
            />

            <span style={{ marginTop: "44px" }}>
              Artists' courses provide essential skills and creative insights,
              offering structured guidance for all levels—from beginners to
              advanced creators. These courses cover a wide range of
              disciplines, such as painting, digital art, music production, and
              multimedia storytelling. Taught by industry experts, they delve
              into techniques, tools, and trends, encouraging artists to explore
              their style and push creative boundaries. By learning from
              experienced mentors, participants gain practical knowledge and
              inspiration, refining their craft and expanding their professional
              networks. These courses empower artists to bring their visions to
              life and excel in today’s competitive creative industries.
            </span>

            <FontAwesomeIcon
              style={{
                color: color.textColor,
                marginLeft: "5px",
                marginBottom: "4px",
                fontSize: "12px",
              }}
              icon={faQuoteRight}
            />
          </Box>
        </>
      )}
      {/* <Typography
        style={{ textAlign: "center" }}
        sx={{
          px: 16,
          borderRadius: "12px",
          fontSize: "24px",
          // fontFamily: "Custom-regular",
          color: "white",
          width: "fit-content",
          margin: "auto",
          mx: 8,
          mb: 4,
          boxShadow: "-5px -5px 15px #fdb50090 inset",
        }}
      >
        <FontAwesomeIcon
          style={{
            color: "black",
            marginBottom: "12px",
            marginRight: "5px",
            fontSize: "18px",
          }}
          icon={faQuoteLeft}
        />
        Spotlighting Featured Artists: Celebrating Innovative Creators Shaping
        Music, Visual Arts, and Media
        <FontAwesomeIcon
          style={{
            color: "black",

            marginLeft: "5px",
            marginBottom: "12px",
            fontSize: "18px",
          }}
          icon={faQuoteRight}
        />
      </Typography> */}

      <Box
        sx={{
          m: 2,
          // minHeight:'250px',
          // p: 2,
          borderRadius: "12px",
          position: "relative",
          // background: "black",
        }}
      >
        <Carousel
          responsive={responsive1}
          infinite
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
          draggable={false}
        //   autoPlay={true}
        >
          {!booksData || booksData.length === 0 ? (
            <Box
              // p={4}
              sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                maxHeight: "268px",
              }}
            >
              <Card
                sx={{
                  maxHeight: "258px",
                  zIndex: 5,
                  width: "245px",
                  background: "#f0f0f0",
                  boxShadow: "none",
                  borderRadius: "10px",
                  position: "relative",
                  // marginTop: "30px",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  height="150px"
                  style={{ borderRadius: "12px", width: "250px" }}
                />
                <CardContent
                  style={{
                    paddingTop: "8px",
                    paddingBottom: "16px",
                    // position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "100%",
                  }}
                >
                  <Skeleton variant="text" width="60%" height="25px" />

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Skeleton variant="text" width="40%" height="30px" />
                    <Skeleton variant="text" width="30%" height="30px" />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Skeleton variant="text" width="40%" height="30px" />
                    <Skeleton variant="text" width="10%" height="30px" />
                  </Box>
                  {/* <Skeleton variant="text" width="80%" height="50px" /> */}
                </CardContent>
              </Card>
            </Box>
          ) : (
            booksData.map((news: any, index: number) => (
              <Box
                onClick={() => navigate(`/productDetails/${news?.id}`)}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <Box
                  key={news.id}
                  sx={{
                    width: "250px",
                    // maxWidth:'300px',
                    display: "flex",
                    flexDirection: "column",
                    background: color.thirdColor,
                    color: "black",
                    borderRadius: "12px",
                    // minWidth: "95%",
                    overflow: "hidden",
                    margin: "5px",
                    padding: "2px",
                    paddingBottom: "5px",
                    transition: "all 0.4s ease",

                    "&:hover": {
                      boxShadow: "-2px -2px 20px rgba(0, 0, 0, 0.56) inset",
                    },
                    "&:hover .imageBox": {
                      transform: "translateY(-20px)",
                      // boxShadow: "-2px -2px 20px rgba(0, 0, 0, 0.56) inset",
                    },
                  }}
                >
                  <Box
                    className="imageBox"
                    sx={{
                      backgroundImage: `url(${news.thumbnail})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center-top",
                      backgroundRepeat: "no-repeat",
                      minWidth: "85px",
                      height: "150px",
                      borderRadius: "10px",
                      transition: "all 0.4s ease",
                    }}
                  ></Box>

                  <div
                    className="imageBox"
                    style={{
                      padding: "5px",
                      paddingTop: "0px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "all 0.4s ease",
                    }}
                  >
                    <Typography
                      style={{
                        fontSize: "12px",
                        color: "black",
                        marginTop: "10px",
                        WebkitLineClamp: 2,
                        // minHeight:'28px'
                      }}
                      id="r-news-head-horz"
                    >
                      {news.title}
                    </Typography>

                    <div
                      style={{
                        display: "flex",
                        gap: "5px",
                        justifyContent: "space-between",
                        marginTop: "10px",
                      }}
                    >
                      <Typography
                        id="r-news-date"
                        style={{ background: "black", color: "white" }}
                      >
                        <FontAwesomeIcon icon={faCalendar} />
                        {new Date(news.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography
                        id="r-news-date"
                        style={{ background: "black", color: "white" }}
                      >
                        {news.courseType === "Audio" && (
                          <FontAwesomeIcon icon={faMusic} />
                        )}
                        {news.courseType === "Video" && (
                          <FontAwesomeIcon icon={faVideo} />
                        )}
                        {news.courseType === "Document" && (
                          <FontAwesomeIcon icon={faFileAlt} />
                        )}
                        {news.courseType}
                      </Typography>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "5px",
                        // padding:'0px 10px',
                        paddingRight: "5px",
                        marginTop: "10px",
                        marginBottom: "5px",
                        color: "white",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "5px",
                          color: "black",
                        }}
                      >
                        <Avatar
                          src={news.profileImage}
                          style={{
                            height: "24px",
                            width: "24px",
                            background: "black",
                          }}
                        ></Avatar>
                        <Typography>
                          {news.firstName} {news.lastName}
                        </Typography>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          // gap: "5px",
                          // // margin: "10px 0px",
                          // marginBottom:'5px',
                          // background: "white",
                          // color: news.theme,
                          // borderRadius: "12px",
                          // padding: "0px 15px",
                        }}
                      >
                        {/* <Typography style={{fontSize:'12px'}}>Enter</Typography> */}
                        <FontAwesomeIcon
                          style={{
                            // fontSize:'12px',
                            color: "white",
                            background: "black",
                            borderRadius: "50%",
                            border: "solid 1px",
                            borderColor: "black",
                          }}
                          icon={faChevronCircleRight}
                        />
                      </div>
                    </div>
                  </div>
                </Box>
              </Box>
            ))
          )}
        </Carousel>
      </Box>

      <img
        src="/assets/shop banner 8.png"
        alt="banner"
        style={{
          display: "block",
          width: "100%",
          maxHeight: "400px",
          borderRadius: "8px",
          objectFit: "contain",
          position: "relative",
          background: "#0d0d0b",
        }}
      />

      <Box
        sx={{
          // background: "white",
          p: 2,
        }}
      >
        <Typography
          sx={{ fontSize: "28px", color: "white", my: 2, mb: 1, pl: 2 }}
        >
          Top Video Courses :
        </Typography>
        <Box sx={{ m: 0, position: "relative" }}>
          <Carousel
            responsive={responsive}
            infinite
            customLeftArrow={<CustomLeftArrow />}
            customRightArrow={<CustomRightArrow />}
            draggable={false}
          //   autoPlay={true}
          >
            {!booksData || booksData.length === 0 ? (
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
                    width: { md: 300, xs: 300 },
                    background: "#f0f0f0",
                    boxShadow: "none",
                    borderRadius: "10px",
                    position: "relative",
                    overflow: "hidden",
                    // marginTop: "30px",
                  }}
                >
                  <CardContent
                    style={{
                      padding: 0,
                      position: "absolute",
                      top: -5,
                      right: 0,
                    }}
                  >
                    <Skeleton variant="text" width="60px" height="30px" />
                  </CardContent>
                  <Skeleton
                    variant="rectangular"
                    height="200px"
                    style={{ borderRadius: "6px" }}
                  />
                  <CardContent
                    style={{
                      paddingBottom: "16px",
                      // position: "absolute",
                      bottom: 0,
                      right: 0,
                      width: "100%",
                    }}
                  >
                    <Skeleton variant="text" width="60%" height="30px" />
                    <Skeleton variant="text" width="40%" height="30px" />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Skeleton variant="text" width="40%" height="40px" />
                      <Skeleton variant="text" width="40%" height="40px" />
                    </Box>
                    {/* <Skeleton variant="text" width="80%" height="50px" /> */}
                  </CardContent>
                </Card>
              </Box>
            ) : (

              booksData
                .filter((book: any) => book.courseType === "Video")
                .map((book: any, index: any) => (
                  <Box
                    onClick={() => navigate(`/productDetails/${book?.id}`)}
                    key={index}
                    p={4}
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ShopCard {...book} />
                  </Box>
                ))

            )}
          </Carousel>
        </Box>
      </Box>
    </div>
  );
};

export default CoursesCarousel;
