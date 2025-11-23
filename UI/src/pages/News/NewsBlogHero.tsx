import {
  faCalendar,
  faChevronCircleRight,
  faNewspaper,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Grid2, Pagination, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import color from "../../components/utils/Colors";
import { getAllNewsAndBlogs } from "../../services/services";



export const NewsBlogHero = () => {

  const [newsAllData, setNewsAllData] = useState<any>([])


  useEffect(() => {
    const payLoad = {
      data: { filter: "" },
      page: 0,
      pageSize: 50,
      order: [["createdAt", "ASC"]],
    };

    getAllNewsAndBlogs(payLoad).then((res) => {

      const excludedTypes = ["Hero Section", "Trending News", "Trending News Video"];
      const filteredData = res?.data?.data?.rows.filter((news: any) => !excludedTypes.includes(news.newsType));

      setNewsAllData(filteredData);
    }).catch((err) => {
      console.log(err);
    });
  }, []);

  interface Item {
    id: number;
    thumbnail: string;
    title: string;
    date: string;
    author: string;
    theme: string;
    type: string;
    newsType: string;
  }

  const navigate = useNavigate();

  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});

  const handleChange = (
    event: ChangeEvent<unknown>,
    value: number,
    category: string
  ) => {
    setCurrentPage((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const groupByCategory = (data: Item[]): Record<string, Item[]> => {
    return data.reduce((acc, item) => {
      const { newsType } = item;
      if (!acc[newsType]) {
        acc[newsType] = [];
      }
      acc[newsType].push(item);
      return acc;
    }, {} as Record<string, Item[]>);
  };

  const groupedData = groupByCategory(newsAllData);

  return (
    <>
      {Object.entries(groupedData).map(([category, newsData]) => {
        const startIndex = ((currentPage[category] || 1) - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const currentNews = newsData.slice(startIndex, endIndex);

        return (
          <div style={{ paddingTop: "10px", background: "white" }}>
            <Box
              style={{ textAlign: "left" }}
              sx={{
                borderRadius: "12px",
                fontSize: "12px",
                color: "white",
                py: 2,
                width: '100vw',
                // mx:-2
              }}

            >
              <Typography className="heading2"
                style={{ width: '100%', borderRadius: '0px', paddingBottom: '5px', color: 'red' }}>
                Latest {category} News
              </Typography>

            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                minHeight: "650px",
                p: 2,
              }}
            >
              <Box
                sx={{
                  width: { sx: "100%", md: "100%" },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  overflow: "hidden",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    // padding: "16px",
                    background: "white",
                    borderRadius: "12px",
                    overflow: "hidden",
                    maxWidth: "100vw",
                  }}
                >
                  {currentNews.slice(0, 1).map((news, index) => (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: "15px",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        className="smooth-scale"
                        sx={{
                          backgroundImage: `url(${news.thumbnail})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center bottom",
                          backgroundRepeat: "no-repeat",
                          height: { xs: "200px", sm: "300px" },
                          minWidth: { xs: "100%", sm: "50%" },
                          position: "relative",
                          borderRadius: "12px",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            opacity: "0.8",
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                            height: "100%",
                            background:
                              "linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0))",
                            zIndex: 1,
                          }}
                        />
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 2,
                            width: "100%",
                            color: "white",
                            p: 2,
                            zIndex: 2,
                          }}
                        ></Box>
                      </Box>

                      <div style={{ paddingLeft: "5px" }}>
                        <Typography
                          id="r-news-date"
                          style={{ marginBottom: "10px", fontSize: "14px" }}
                        >
                          <FontAwesomeIcon icon={faNewspaper} />
                          {news.newsType}
                        </Typography>
                        <Typography
                          sx={{ lineHeight: 1.2 }}
                          style={{
                            fontSize: "18px",
                          }}
                          id="r-news-head-horz"
                        >
                          {news.title}
                        </Typography>
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            marginTop: "10px",
                          }}
                        >
                          <Typography id="r-news-date">
                            <FontAwesomeIcon icon={faCalendar} />
                            {/* {new Date(news.createdAt).toISOString().split("T")[0]} */}
                          </Typography>
                          <Typography id="r-news-date">
                            <FontAwesomeIcon icon={faUser} /> By
                            {news.author}
                          </Typography>
                        </div>
                      </div>
                    </Box>
                  ))}
                </div>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-around",
                    flexWrap: "wrap",
                    gap: "10px",
                    py: 1,
                    // background: ,
                  }}
                >
                  <Grid2 container spacing={1} sx={{ width: "100%" }}>
                    {currentNews.map((news, index) => (
                      <Grid2 size={{ xs: 6, sm: 4 }}>
                        <Box
                          onClick={() => navigate(`/news-details/${news?.id}`)}
                          key={news.id}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            border: "solid 1px white",
                            borderRadius: "6px",
                            overflow: "hidden",
                            background: "white",
                            minHeight: { xs: "250px", sm: "350px" },
                            transition: "all 0.4s ease",

                            gap: "10px",
                            "&:hover": {
                              transform: "scale(1.01)",
                              boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.17)",
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
                              minHeight: { xs: "150px", sm: "200px" },
                            }}
                          ></Box>

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              gap: "5px",
                              padding: "10px",
                              paddingTop: "0px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: "5px",
                                marginTop: "5px",
                              }}
                            >
                              <Typography id="r-news-date">
                                <FontAwesomeIcon icon={faCalendar} />{" "}
                                {/* {new Date(news.createdAt).toISOString().split("T")[0]} */}
                              </Typography>
                              <Typography id="r-news-date">
                                <FontAwesomeIcon icon={faUser} /> By{" "}
                                {news.author}
                              </Typography>
                            </div>
                            <Typography
                              sx={{
                                color: "black",
                                fontFamily: "custom-bold",
                              }}
                              onClick={() => {
                                navigate(`/news-details/${news.id}`);
                              }}
                              id="r-news-head-horz"
                            >
                              {news.title}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: "10px",
                                color: "black",
                                textAlign: "end",
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                            >
                              Read More
                              <FontAwesomeIcon
                                style={{
                                  marginLeft: "5px",
                                  // background: news.theme,
                                  borderRadius: "50%",
                                }}
                                icon={faChevronCircleRight}
                              />
                            </Typography>
                          </div>
                        </Box>
                      </Grid2>
                    ))}
                  </Grid2>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                  <Pagination
                    count={Math.ceil(newsData.length / itemsPerPage)}
                    page={currentPage[category] || 1}
                    onChange={(event, value) =>
                      handleChange(event, value, category)
                    }
                    sx={{
                      "& .MuiPaginationItem-root": {
                        color: color.firstColor,
                      },
                      "& .MuiPaginationItem-root.Mui-selected": {
                        backgroundColor: "black",
                        color: "white",
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* <Box
            sx={{
              // background: color.firstColor,
              // width: "35%",
              width: { sx: "100%", md: "35%" },
              gap: 2,
              p: 2,
              pt: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box
              style={{ textAlign: "left" }}
              sx={{
                // px: 2,
                borderRadius: "12px",
                fontSize: "12px",
                color: "white",
                width: "fit-content",
                py: 2,
              }}
            >
              <Typography
                // style={{ background: color.firstColor }}
                className="heading2"
              >
                Featured Post
              </Typography>
            </Box>

            {featuredPosts.map((news) => (
              <div
                key={news.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  // width: "230px",
                  border: "solid 1px white",
                  borderRadius: "6px",
                  overflow: "hidden",
                  padding: "10px",
                  fontSize: "10px",
                  color: "black",
                  fontFamily: "custom-bold",
                  background: "white",
                  // height: "300px",
                  //   justifyContent: "space-between",
                  gap: "10px",
                  //   marginBottom: "15px",
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
                  }}
                ></Box>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    gap: "5px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      marginTop: "5px",
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
                    style={{
                      color: "black",
                      fontFamily: "custom-bold",
                      fontSize: "12px",
                    }}
                    onClick={() => {
                      navigate("/news-details");
                    }}
                    id="r-news-head-horz"
                  >
                    {news.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "black",
                      display: "flex",
                      alignItems: "center",
                      textAlign: "left",
                    }}
                  >
                    Read More
                    <FontAwesomeIcon
                      style={{
                        marginLeft: "5px",
                        // background: news.theme,
                        borderRadius: "50%",
                      }}
                      icon={faChevronCircleRight}
                    />
                  </Typography>
                </div>
              </div>
            ))}

            <Box
              style={{ textAlign: "left" }}
              sx={{
                borderRadius: "12px",
                fontSize: "12px",
                color: "white",
                width: "fit-content",
                py: 2,
              }}
            >
              <Typography
                // style={{ background: color.firstColor }}
                className="heading2"
              >
                Recent Posts
              </Typography>
            </Box>

            {recentPosts.map((news) => (
              <div
                key={news.id}
                style={{
                  display: "flex",
                  width: "fit-content",
                  height: "85px",
                  justifyContent: "space-between",
                  gap: "10px",
                  background: "white",
                  borderRadius: "4px",
                  overflow: "hidden",
                  //   marginBottom: "15px",
                }}
              >
                <Box
                  sx={{
                    backgroundImage: `url(${news.thumbnail})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    minWidth: "85px",
                    height: "85px",
                  }}
                ></Box>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                    paddingRight: "10px",
                    color: color.textColor2,
                  }}
                >
                  <Typography
                    style={{
                      fontSize: "10px",
                      color: "black",
                      fontFamily: "custom-bold",
                    }}
                    id="r-news-head"
                    onClick={() => {
                      navigate("/news-details");
                    }}
                  >
                    {news.title}
                  </Typography>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      color: "black",
                    }}
                  >
                    <Typography id="r-news-date">
                      <FontAwesomeIcon icon={faCalendar} />{" "}
                      {new Date(news.createdAt).toISOString().split("T")[0]}
                    </Typography>
                    <Typography id="r-news-date">
                      <FontAwesomeIcon icon={faUser} /> By {news.author}
                    </Typography>
                    <FontAwesomeIcon
                      style={{
                        // color: color.textColor,
                        marginLeft: "5px",
                        // background: news.theme,
                        borderRadius: "50%",
                      }}
                      icon={faChevronCircleRight}
                    />
                  </div>
                </div>
              </div>
            ))}
          </Box> */}
            </Box>
          </div>
        );
      })}
    </>
  );
};
