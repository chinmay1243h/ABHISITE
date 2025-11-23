import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import YouTube from "react-youtube";
import color from "../../components/utils/Colors";
import { useParams } from "react-router-dom";
import { getOneMovies } from "../../services/services";

interface TabPanelProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
};

const MovieDetailsPage = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  const { id } = useParams();
  const [movies, setMovies] = useState<any>({});
  useEffect(() => {
    getOneMovies(id)
      .then((res) => {
        setMovies(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const tabsData = {
    overview: (
      <>
        <Typography>{movies.overview}</Typography>
        <Box mt={2}>
          <Typography
            style={{ fontFamily: "custom-regular" }}
            fontWeight="bold"
          >
            Starring:
          </Typography>
          <Typography>{movies.starring}</Typography>
        </Box>
        <Box mt={2}>
          <Typography
            style={{ fontFamily: "custom-regular" }}
            fontWeight="bold"
          >
            Creators:
          </Typography>
          <Typography>{movies.creators}</Typography>
        </Box>
        <Box mt={2}>
          <Typography
            style={{ fontFamily: "custom-regular" }}
            fontWeight="bold"
          >
            Genre:
          </Typography>
          <Typography>{movies.genre}</Typography>
        </Box>
      </>
    ),
    trailers: (
      <>
        <Box mt={0}>
          <Typography fontWeight="bold" variant="h6">
            Trailer:
          </Typography>
          <YouTube
            videoId={movies.trailer}
            opts={{ width: "100%", height: "360" }}
          />
        </Box>
        <Box mt={4}>
          <Typography fontWeight="bold" variant="h6">
            Images:
          </Typography>
          <Box display="flex" gap={2} mt={2}>
            {/* {movieData.images.map((src, index) => ( */}
            <img
              src={movies.images}
              alt={`Movie Scene `}
              style={{
                width: "30%",
                height: "auto",
                borderRadius: 8,
              }}
            />
            {/* ))} */}
          </Box>
        </Box>
      </>
    ),
    cast: (
      <>
        <Box mt={0}>
          <Typography
            style={{ fontFamily: "custom-regular" }}
            fontWeight="bold"
          >
            Starring:
          </Typography>
          <Typography>{movies.starring}</Typography>
        </Box>
        <Box mt={2}>
          <Typography
            style={{ fontFamily: "custom-regular" }}
            fontWeight="bold"
          >
            Directed by:
          </Typography>
          <Typography>{movies.directors}</Typography>
        </Box>
        <Box mt={2}>
          <Typography
            style={{ fontFamily: "custom-regular" }}
            fontWeight="bold"
          >
            Written by:
          </Typography>
          <Typography>{movies.writers}</Typography>
        </Box>
        <Box mt={2}>
          <Typography
            style={{ fontFamily: "custom-regular" }}
            fontWeight="bold"
          >
            Produced by:
          </Typography>
          <Typography>{movies.producers}</Typography>
        </Box>
        <Box mt={2}>
          <Typography
            style={{ fontFamily: "custom-regular" }}
            fontWeight="bold"
          >
            Director of Photography:
          </Typography>
          <Typography>{movies.dop}</Typography>
        </Box>
        <Box mt={2}>
          <Typography
            style={{ fontFamily: "custom-regular" }}
            fontWeight="bold"
          >
            Music:
          </Typography>
          <Typography>{movies.music}</Typography>
        </Box>
      </>
    ),
    details: movies.plot,
  };
  return (
    <Container
      maxWidth="lg"
      style={{
        background: color.thirdColor,
      }}
    >
      {/* Header Section */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        mt={4}
        py={4}
      >
        <Box flex={1}>
          <img
            src={movies.poster}
            alt={movies.title}
            style={{ width: "100%", borderRadius: 8 }}
          />
        </Box>
        <Box flex={2} ml={{ md: 4 }} mt={{ xs: 2, md: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <Typography variant="h4" fontWeight="bold">
                {movies.title}
              </Typography>
              <Typography variant="body1" color="textSecondary" mt={1}>
                {movies.year} | {movies.duration} | {movies.age}
              </Typography>
            </div>

            <Typography variant="h5">{movies.rating}.0 ⭐</Typography>
          </div>

          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              mt: 2,
              "& .MuiTab-root": {
                color: "gray",
                "&.Mui-selected": {
                  color: color.textColor1,
                },
              },
            }}
            TabIndicatorProps={{
              style: {
                backgroundColor: "#1fd8d1",
              },
            }}
          >
            <Tab label="Overview" />
            <Tab label="Trailers & More" />
            <Tab label="Cast & Crew" />
            <Tab label="Plot" />
          </Tabs>
          <Box mt={2}>
            {Object.values(tabsData).map((content, index) => (
              <TabPanel value={tabIndex} index={index} key={index}>
                {content}
              </TabPanel>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Related Movies */}
      {/* <Typography variant="h5" fontWeight="bold" mt={4}>
        Related Movies
      </Typography>
      <PosterCarousel
        // title="Latest Projects"
        productions={PosterData}
      ></PosterCarousel> */}
    </Container>
  );
};

export default MovieDetailsPage;
