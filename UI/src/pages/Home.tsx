import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import color from "../components/utils/Colors";
import CoursesCarousel from "../components/utils/CoursesCarousel";
import PosterGallery from "../components/utils/PosterGallery";
import { isLoggedIn } from "../services/axiosClient";
import { getAllArtist, getAllNewsAndBlogs } from "../services/services";
import TopArtists from "./Artist/TopArtists";
import "./Home.css";
import NewsCarousel from "./News/NewsCarousel";
import NewsletterSubscription from "./News/NewsletterSubscription";

const slideInAnimation = keyframes`
  from {
    transform: translateX(-50%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (ref.current) observer.disconnect();
    };
  }, []);

  const [artist, setArtist] = useState([]);

  useEffect(() => {
    const fetchArtists = async () => {

      try {
        const payLoad = {
          data: { filter: "" },
          page: 0,
          pageSize: 50,
          order: [["createdAt", "ASC"]],
        };
        const response = await getAllArtist(payLoad);
        setArtist(response?.data?.data?.rows || []);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      }

    };
        fetchArtists();
  }, []);
  const [trendingnews, setTrendingNews] = useState<any>([]);

  useEffect(() => {
    const fetchNews = async () => {

      try {
        const payLoad = {
          data: { filter: "" },
          page: 0,
          pageSize: 50,
          order: [["createdAt", "ASC"]],
        };

        const res = await getAllNewsAndBlogs(payLoad);

        setTrendingNews(res?.data?.data?.rows || []);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      }

    };

    fetchNews();
  }, []);
  const navigate = useNavigate();

  return (
    <>
      <div>
        <Box
          sx={{
            backgroundImage: "url(/assets/hero-banner.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: { xs: "50vh", md: "100vh" },
            display: "flex",
            mt: { xs: "-54px", md: "-94px" },
            alignItems: "center",
            "&::before": {
              content: '""',
              height: { xs: "50vh", md: "100vh" },
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))",
              zIndex: 1,
            },
          }}
        >
          <Box
            ref={ref}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              zIndex: 2,
              animation: isVisible
                ? `${slideInAnimation} 1s ease forwards`
                : "none",
              // alignItems:'center'
            }}
          >
            <Typography
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "48px",
                textAlign: "left",
                lineHeight: 1.1,
                pl: 6,
              }}
            >
              See Your Dream <br />
              With Us!
            </Typography>

            {!isLoggedIn() && (
              <Typography id="custom-button" onClick={() => navigate("/login")}>
                Login{" "}
                <FontAwesomeIcon
                  id="custom-button-icon"
                  icon={faArrowRight}
                ></FontAwesomeIcon>
              </Typography>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            background: color.firstColor,
          }}
        >
          {/* <Carousel items={PosterData} /> */}

          {/* <PosterCarousel title="Latest Projects" productions={PosterData} /> */}
          <PosterGallery />

          {/* <div>
            <Typography className="heading">News and Blogs</Typography>
            <NewsBlog></NewsBlog>
          </div> */}

          {/* <Box  sx={{border:'solid 5px white', background:'black', mt:2,borderRadius:2}}> */}

          <TopArtists variant="heading2" artist={artist}></TopArtists>
          {/* </Box> */}

          <CoursesCarousel textused={true}></CoursesCarousel>

          <NewsCarousel trendingNews={trendingnews}></NewsCarousel>
          <NewsletterSubscription></NewsletterSubscription>
        </Box>
      </div>
    </>
  );
};
