import React from "react";
import { Card, CardContent, CardMedia, Typography, Box } from "@mui/material";
// import { useNavigate } from "react-router-dom";
import color from "../utils/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";

interface PosterCardProps {
  title: string;
  genre: string[];
  image: string;
  onClick?: () => void;
}

const PosterCard: React.FC<PosterCardProps> = ({ title, genre, image, onClick }) => {
  // const navigate = useNavigate();

  return (
    <Card
      onClick={onClick}
      sx={{
        width: { md: 200, xs: "200px" },
        // minWidth: 280,
        background: "transparent",
        boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.18)",
        border: "solid 1px transparent",
        borderRadius: "10px",
        position: "relative",
        overflow: "hidden",
        mt: 1,
        transition: "transform 0.4s ease",
        "&:hover": {
          transform: "translateY(-20px)",
          // border: "solid 1px white",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",

          "&:hover .hoverContent": {
            opacity: 1,
            transform: "translateY(0)",
          },
          "&:hover::after": {
            opacity: 1,
          },
          "::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100%",
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))",
            opacity: 0,
            transition: "opacity 0.4s ease",
            backdropFilter: "blur(2px)",
          },
        }}
      >
        <CardMedia component="img" height="250px" image={image} alt={title} />

        <CardContent
          sx={{
            position: "absolute",
            boxShadow: "-5px -5px 20px rgba(0, 0, 0, 0.9) inset",
            width: "100%",
            height: "350px",
            zIndex: 100,
            transform: "translateY(-349px)",
          }}
        ></CardContent>

        <CardContent
          className="hoverContent"
          sx={{
            // background:'linear-gradient(35deg, red 1%, #000000 100%)',
            background: color.thirdColor,
            boxShadow: "-5px -5px 20px rgba(0, 0, 0, 0.9) inset",

            zIndex: 100,
            position: "absolute",
            bottom: -15,
            left: 0,
            padding: "10px",
            maxWidth: "100%",
            width: "100%",
            opacity: 0,
            transform: "translateY(20px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              color: color.textColor,
              background: "black",
              width: "fit-content",
              mt: 1,
              pl: 1.5,
              pr: 1,
              ml: -2,
              borderRadius: "0px 6px 6px 0px",
              whiteSpace: "normal",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              lineHeight: 1.2,
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              maxWidth: "100%",
              fontSize: "20px",
              cursor: "pointer",
              position: "relative",
              transition: "text-decoration 0.3s ease",
              textAlign: "left",
              textShadow:
                "0px 0px 6px rgba(255, 255, 255, 0.35),0px -5px 35px rgba(255,255,255,0.3)",

              "&:hover": {
                // textDecoration: "underline",
              },
            }}
          >
            {title}
          </Typography>

          <Typography
            style={{
              fontFamily: "Custom-Regular",
              textAlign: "left",
            }}
            sx={{
              color: "black",
              textShadow:
                "2px 8px 6px rgba(0,0,0,0.2),0px -5px 35px rgba(255,255,255,0.3)",
              // WebkitTextStroke:'1px black',
              mt: 1,
              whiteSpace: "normal",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              fontSize: "12px",
              lineHeight: 1.1,
            }}
          >
            <FontAwesomeIcon
              style={{ marginRight: "3px" }}
              icon={faVideo}
            ></FontAwesomeIcon>{" "}
            {genre}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default PosterCard;
