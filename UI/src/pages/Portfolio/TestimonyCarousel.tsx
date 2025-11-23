import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Container, IconButton, Avatar } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import color from "../../components/utils/Colors";
import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

interface TestimonyCarouselProps {
  title?: string;
  testimonials: { profilePic: string; testimony: string; name: string }[];
}

interface CustomArrowProps {
  onClick?: () => void;
}

const CustomLeftArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      left: 1,
      top: "50%",
      transform: "translateY(-50%)",
      background: color.textColor1,

      boxShadow: "-5px -5px 10px rgba(0, 0, 0, 0.57) inset",
      color: "white",
      transition: "color 0.3s ease,background 0.3s ease",
      "&:hover": {
        color: color.textColor1,
        background: "white",
      },
    }}
  >
    <ArrowBackIosIcon sx={{ translate: "5px 0px" }} />
  </IconButton>
);

const CustomRightArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: "absolute",
      right: 1,
      top: "50%",
      transform: "translateY(-50%)",
      background: color.textColor1,
      color: "white",
      boxShadow: "-5px -5px 10px rgba(0, 0, 0, 0.57) inset",
      transition: "color 0.3s ease,background 0.3s ease",
      "&:hover": {
        color: color.textColor1,
        background: "white",
      },
    }}
  >
    <ArrowForwardIosIcon />
  </IconButton>
);

const TestimonyCarousel: React.FC<TestimonyCarouselProps> = ({
  title,
  testimonials,
}) => {
  return (
    <Container
      sx={{
        height: "auto",
        flexWrap: "wrap",
        overflow: "hidden",
        py: 4,
      }}
    >
      {title && (
        <Typography
          variant="h4"
          sx={{ textAlign: "center", mb: 4, mt: 2, fontWeight: "bold" }}
        >
          {title}
        </Typography>
      )}
      <Box sx={{ m: 0, position: "relative" }}>
        <Carousel
          responsive={responsive}
          infinite
          customLeftArrow={<CustomLeftArrow />}
          customRightArrow={<CustomRightArrow />}
          draggable={false}
        >
          {testimonials.map((testimonial, index) => (
            <Box
              key={index}
              sx={{
                width: "100%",
                p: 3,
                m: 2,
                textAlign: "center",
                border: "2px solid",
                borderColor: color.textColor1,
                borderRadius: 2,
                boxShadow: "-4px -4px 8px rgba(0,0,0,0.1) inset",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Avatar
                src={testimonial.profilePic}
                alt={testimonial.name}
                sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
              />
              <div style={{ padding: "0px 20px" }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  {testimonial.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontSize: "12px" }}
                >
                  {/* <span style={{ color: color.textColor1 , fontSize:'18px'}}>"</span>{" "} */}
                  <FontAwesomeIcon
                    style={{
                      color: color.textColor1,
                      marginBottom: "2px",
                      marginRight: "5px",
                      fontSize: "12px",
                    }}
                    icon={faQuoteLeft}
                  />
                  {testimonial.testimony}
                  {/* <span style={{ color: color.textColor1 }}>"</span>{" "} */}
                  <FontAwesomeIcon
                    style={{
                      color: color.textColor1,
                      marginLeft: "5px",
                      fontSize: "12px",
                    }}
                    icon={faQuoteRight}
                  />
                </Typography>
              </div>
            </Box>
          ))}
        </Carousel>
      </Box>
    </Container>
  );
};

export default TestimonyCarousel;
