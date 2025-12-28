import {
    faCalendar,
    faChevronCircleRight,
    faFileAlt,
    faMusic,
    faVideo,
    faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar, Box, Container, Grid2, Typography } from "@mui/material";
import color from "../../components/utils/Colors";
//   import SearchBar from "../../components/utils/SearchBar";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserId } from "../../services/axiosClient";
import {
    getAllCourse,
    getAllPaymentDetailsForUser,
} from "../../services/services";
import SearchBar from "../../components/utils/SearchBar";

const MyCourses = () => {
  const [combinedData, setCombinedData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const payLoad = {
      data: { filter: "" },
      page: 0,
      pageSize: 50,
      order: [["createdAt", "ASC"]],
    };

    console.log('Fetching courses with payload:', payLoad);
    console.log('Current user ID:', getUserId());
    setLoading(true);
    setError(null);

    Promise.all([getAllCourse(payLoad), getAllPaymentDetailsForUser(payLoad)])
      .then(([courseRes, paymentRes]) => {
        console.log('Course response:', courseRes);
        console.log('Payment response:', paymentRes);
        
        const courses = courseRes?.data?.data?.rows || [];
        const payments = paymentRes?.data?.data?.rows || [];
        const currentUserId = getUserId();

        console.log('Total courses found:', courses.length);
        console.log('Total payments found:', payments.length);

        const filteredData = courses
          .map((course: any) => {
            // Show courses if user is the instructor OR if user has purchased the course
            const isInstructor = course.instructor === currentUserId || course.userId === currentUserId;
            const matchingPayment = payments.find(
              (payment: any) =>
                payment.courseId === course.id &&
                payment.userId === currentUserId &&
                payment.status === "success"
            );

            console.log(`Course ${course.id}:`, {
              title: course.title,
              instructor: course.instructor,
              userId: course.userId,
              currentUserId: currentUserId,
              isInstructor,
              hasPayment: !!matchingPayment
            });

            if (isInstructor || matchingPayment) {
              return {
                ...course,
                updatedAt: matchingPayment ? 
                  dayjs(matchingPayment.updatedAt).format("MMM D, YYYY") :
                  dayjs(course.updatedAt).format("MMM D, YYYY"),
                isOwner: isInstructor,
              };
            }

            return null;
          })
          .filter(Boolean);

        console.log('Filtered courses to display:', filteredData);
        setCombinedData(filteredData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses');
        setLoading(false);
      });
  }, []);

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const navigate = useNavigate();

  return (
    <Container
      maxWidth="lg"
      sx={{
        // mt: 4,
        padding: "1rem",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        mt: "0px",
      }}
    >
      <Typography style={{ background: color.headingBg }} className="heading1">
        My Courses
      </Typography>

      <SearchBar label={"Search Your Courses..."} onSearch={handleSearch} 
       suggestions={combinedData}/>

      <Grid2 container sx={{ mt: 4 }} spacing={2}>
        {combinedData.map((news: any, index: any) => (
          <Grid2 size={{ md: 3, sm: 6, xs: 12 }}>
            <Box
              onClick={() => {
                navigate(`/player/${news.id}`);
              }}
              key={news.id}
              sx={{
                display: "flex",
                flexDirection: "column",
                background: color.thirdColor,
                color: "black",
                borderRadius: "12px",
                minWidth: "95%",
                overflow: "hidden",
                margin: "5px",
                padding: "2px",
                boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.2)",
                transition: "all 0.4s ease",
                "&:hover": {
                  transform: "translateY(-20px)",
                  boxShadow: "2px 2px 20px rgba(0, 0, 0, 0.4)",
                  //   color: "#a5b702",
                },
              }}
            >
              <Box
                sx={{
                  backgroundImage: `url(${news.thumbnail})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center-top",
                  backgroundRepeat: "no-repeat",
                  minWidth: "85px",
                  height: "150px",
                  borderRadius: "10px",
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
                <Typography
                  style={{
                    fontSize: "12px",
                    color: "black",

                    marginTop: "10px",
                    WebkitLineClamp: 1,
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
                    <FontAwesomeIcon icon={faCalendar} /> {news.updatedAt}
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
                      gap: "8px",
                    }}
                  >
                    {/* Show upload button only for instructors */}
                    {(news.instructor === getUserId() || news.userId === getUserId()) && (
                      <FontAwesomeIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/upload', { state: news.id });
                        }}
                        style={{
                          color: "white",
                          background: "#1976d2",
                          borderRadius: "50%",
                          padding: "4px",
                          cursor: "pointer",
                          border: "solid 1px #1976d2",
                        }}
                        icon={faUpload}
                        title="Upload Files"
                      />
                    )}
                    
                    <FontAwesomeIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/player/${news.id}`);
                      }}
                      style={{
                        color: "white",
                        background: "black",
                        borderRadius: "50%",
                        border: "solid 1px",
                        borderColor: "black",
                        cursor: "pointer",
                      }}
                      icon={faChevronCircleRight}
                    />
                  </div>
                </div>
              </div>
            </Box>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};

export default MyCourses;
