import { Card, CardContent, Grid, Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import "react-multi-carousel/lib/styles.css";
import { useNavigate } from "react-router-dom";
import { getAllMovies } from "../../services/services";
import PosterCard from "../cards/PosterCard";
import color from "./Colors";

interface PosterCarouselProps {
  title?: string;
}

// const responsive = {
//   superLargeDesktop: {
//     breakpoint: { max: 3000, min: 1024 },
//     items: 3,
//   },
//   desktop: {
//     breakpoint: { max: 1024, min: 768 },
//     items: 2,
//   },
//   tablet: {
//     breakpoint: { max: 768, min: 464 },
//     items: 1,
//   },
//   mobile: {
//     breakpoint: { max: 464, min: 0 },
//     items: 1,
//   },
// };

const PosterGallery: React.FC<PosterCarouselProps> = ({ title }) => {
  const [movies, setMovies] = useState<any>([]);
  useEffect(() => {
    const payLoad = {
      data: { filter: "" },
      page: 0,
      pageSize: 12,
      order: [["createdAt", "ASC"]],
    };
    getAllMovies(payLoad)
      .then((res) => {
        console.log(res);
        setMovies(res?.data?.data?.rows || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const navigate = useNavigate();
  return (
    <Box
      sx={(theme) => ({
        height: "auto",
        borderColor: "black",
        flexWrap: "wrap",
        overflow: "hidden",
        pr: 0,
        textAlign: "center",
        // background:'#000028'000028
        background: "linear-gradient(to top, #000028, rgba(0, 0, 0, 1))",
      })}
    >
      <Box
        sx={{
          position: "relative",
          py: 4,
          color: color.textColor,
          //   boxShadow:
          //     "-15px -15px 40px rgba(255, 255, 255, 0.1) inset,0 0px 30px rgba(0, 0, 0, 0.6)",
        }}
      >
        <Typography sx={{ color: color.textColor2, fontSize: "80px" }}>
          100+
        </Typography>
        <Typography
          sx={{
            // color: "white",
            fontSize: "44px",
            mt: -8,
            textShadow: "0px 0px 8px rgba(0, 0, 0, 20)",
            zIndex: 1000,
          }}
        >
          Live Projects
        </Typography>
        <Typography
          sx={{
            color: "white",
            fontSize: "14px",
            fontFamily: "Custom-regular",
            mt: 1,
            textShadow: "0px 0px 8px rgba(0, 0, 0, 10)",
            zIndex: 1000,
          }}
        >
          Immersive Storytelling, Crafted with Passion and Precision for an
          Everlasting Impact...
        </Typography>
      </Box>

      <Grid
        container
        spacing={2}
        sx={{
          p: 2,
          position: "relative",
          // display: "flex",
          // flexWrap: "wrap",
          // gap: 2,
          // justifyContent: "space-between",
          width: "100%",
        }}
      >
        {!movies || movies.length === 0 ? (
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
                minHeight: "250px",
                zIndex: 5,
                width: 200,
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
                  paddingBottom: "16px",
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: "100%",
                }}
              >
                <Skeleton variant="text" width="50%" height="30px" />
                <Skeleton variant="text" width="40%" height="20px" />
              </CardContent>
            </Card>
          </Box>
        ) : (
          movies.map((movie: any) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <PosterCard
                key={movie.id}
                title={movie.title}
                genre={movie.genre}
                image={movie.images}
                onClick={() => navigate(`/movies/details/${movie.id}`)}
              />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default PosterGallery;
