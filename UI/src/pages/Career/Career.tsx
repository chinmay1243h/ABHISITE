import { Box, Button, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import { SetStateAction, useEffect, useRef, useState } from "react";
import color from "../../components/utils/Colors";
import { getAllPostJob } from "../../services/services";
import "../Home.css";
import JobBoard from "./JobBoard";
import { useNavigate } from "react-router-dom";

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

export const Career: React.FC = () => {
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

  const [job, setJob] = useState(() => [] as any[]);
  useEffect(() => {
    const payLoad = {
      data: { filter: "" },
      page: 0,
      pageSize: 50,
      order: [["createdAt", "ASC"]],
    };

    getAllPostJob(payLoad).then(
      (res: { data: { data: { rows: SetStateAction<never[]> } } }) => {
        setJob(res?.data?.data?.rows as any);
      }
    );
  }, []);

  const navigate = useNavigate();

  return (
    <>
      <div>
        <Box
          sx={{
            backgroundImage: "url(/assets/Career.jpg)",
            // background: '#fff',
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: { xs: "50vh", md: "100vh" },

            display: "flex",
            flexDirection: { xs: "column-reverse", md: "row" },
            justifyContent: "space-around",
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
                "linear-gradient(to top, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.6))",
              //   backdropFilter: "blur(2px)",
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
              marginLeft: "2%",

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
              }}
            >
              Looking for career?
            </Typography>

            <Typography
              style={{ marginTop: "15px", color: "white" }}
              //   id="custom-button"
            >
              We're looking for passionate people to join us on our mission. We
              value flat hierarchies, clear communication, and full ownership
              and responsibility.
            </Typography>
          </Box>

          <Box
            sx={{
              marginTop: "20px",
              zIndex: 2,
              color: "white",
              marginRight: { xs: "0px", sm: "40px" },
              display: { xs: "none", sm: "block" },
              backgroundImage: `url("/assets/art category/Digital Artist.jpg")`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              border: "solid 1px white",
              backgroundPosition: "center",
              position: "relative",
            }}
            className="card"
          >
            <Typography
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                p: 0,
                pb: 1,
                pt: 0.2,
                pl: 1,
                borderBottomLeftRadius: "6px",
                borderTopRightRadius: "6px",
                width: "80px",
                height: "20px",
                background: color.textColor1,
                zIndex: 101,
                fontSize: "12px",
                color: "white",
              }}
            >
              #Trending
            </Typography>

            {job && (
              <div style={{ position: "relative" }} className="card-content">
                <Typography
                  sx={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                    width: "100%",
                    fontSize: "22px !important",
                    fontWeight: "bold",
                  }}
                  className="card-title"
                >
                  {" "}
                  {job[0]?.title}
                </Typography>
                <p
                  className="card-body"
                  style={{
                    display: "-webkit-box",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
                  }}
                >
                  {job[0]?.overview}
                </p>
                <Button
                  onClick={() => {
                    navigate(`/job-details/${2}`);
                  }}
                  id="custom-button"
                  style={{ marginLeft: "0px", fontSize: "16px" }}
                >
                  Learn More
                </Button>
              </div>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            // background: color.firstColor,
            background: "#fff",
            py: 6,
          }}
        >
          <JobBoard jobs={job}></JobBoard>
        </Box>
      </div>
    </>
  );
};
