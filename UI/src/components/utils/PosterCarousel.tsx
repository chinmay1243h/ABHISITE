import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PosterCard from "../cards/PosterCard";
import { Container, IconButton } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import color from "./Colors";

interface production {
  title: string;
  genre: string[];
  image: string;
}

interface PosterCarouselProps {
  title?: string;
  productions: production[];
}

const responsive = {
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
      left: 4,
      top: "40%",
      transform: "translateY(-)",
      boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.22)",
      color: "black",
      borderRadius: "4px 0px 0px 4px",
      background: color.thirdColor,

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
      right: 8,
      top: "40%",
      transform: "translateY(-)",
      boxShadow: "-5px 5px 10px rgba(0, 0, 0, 0.22)",

      color: "black",
      borderRadius: "0px 4px 4px 0px",
      background: color.thirdColor,
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

const PosterCarousel: React.FC<PosterCarouselProps> = ({
  title,
  productions,
}) => {
  return (
    <Container
      sx={(theme) => ({
        height: "auto",
        borderColor: "black",
        flexWrap: "wrap",
        overflow: "hidden",
      })}
    >
      {title && <Typography className="heading">{title}</Typography>}
      <Box sx={{ m: 0, position: "relative" }}>
        <Carousel
          responsive={responsive}
          infinite
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
          draggable={false}
          //   autoPlay={true}
        >
          {productions.map((production, index) => (
            <Box
              key={index}
              p={4}
              pl={5.5}
              pr={6}
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PosterCard
                // key={index}
                title={production.title}
                genre={production.genre}
                image={production.image}
              />
            </Box>
          ))}
        </Carousel>
      </Box>
    </Container>
  );
};

export default PosterCarousel;
