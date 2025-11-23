import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import React from "react";
import color from "../utils/Colors";
import { useNavigate } from "react-router-dom";

interface ArtistCardProps {
  title: string;
  profession: string;
  description: string;
  image: string;
  theme: string;
  onClick?: () => void;
}

const ArtistsCard: React.FC<ArtistCardProps> = ({
  title,
  profession,
  description,
  image,
  theme,
  onClick
}) => {

  const navigate = useNavigate();

  return (
    <Card
      onClick={onClick}
      sx={{
        minHeight: "250px",
        zIndex: 5,
        width: { md: 200, xs: 250 },
        background: theme,
        boxShadow: "0px 0px 40px rgba(0, 0, 0, 0.2)",
        border: "solid 1px",
        borderColor: "white",
        borderRadius: "10px",
        position: "relative",
        overflow: "hidden",
        marginTop: "30px",
        transition: "transform 0.4s ease",
        "&:hover": {
          transform: "translateY(-20px)",
        },
      }}
    >
      <CardContent
        sx={{
          position: "absolute",
          top: 0,
          right: 0,
          mt: 0,
          p: 0,
          pb: 1,
          pt: 0.2,
          pl: 1,
          borderBottomLeftRadius: "6px",
          borderTopRightRadius: "6px",
          width: "80px",
          height: "20px",
          background: "black",
          zIndex: 101,
          fontSize: "12px",
          color: "white",
        }}
      >
        #Trending
      </CardContent>
      <Box>
        <CardMedia
          component="img"
          height="250px"
          image={image}
          alt={title}
          sx={{
            // mt: 6,
            objectFit: "cover",
            filter: "drop-shadow(0px 0px 40px rgba(0, 0, 0, 0.1))",
          }}
        />
        <CardContent
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "200px",
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0))",
            zIndex: 1,
          }}
        ></CardContent>
        <CardContent
          className="hoverContent"
          sx={{
            zIndex: 100,
            position: "absolute",
            bottom: 10,
            left: 0,
            padding: "10px",
            paddingLeft: "5px",
            maxWidth: "100%",
            opacity: 1,
            transform: "translateY(20px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <Typography
            sx={{
              color: "black",
              marginLeft: "-5px",
              paddingLeft: "7px",
              paddingRight: "5px",
              background: "white",
              textAlign: "left",
              borderRadius: "0px 6px 6px 0px",
              fontSize: "12px",
              position: "relative",
            }}
          >
            {profession}
          </Typography>
          <Typography
            gutterBottom
            sx={{
              color: "white",
              textAlign: "left",
              borderRadius: "0px 6px 6px 0px",
              fontSize: "20px",
              cursor: "pointer",
              position: "relative",
              transition: "text-decoration 0.3s ease",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {title}
          </Typography>
        </CardContent>
      </Box>
      <CardContent
        className="hoverContent"
        sx={{
          zIndex: 101,
          position: "absolute",
          bottom: 0,
          left: 0,
          padding: "10px",
          maxWidth: "100%",
          height: "100%",
          width: "100%",
          opacity: 0,
          transform: "translateY(20px)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        <Typography
          style={{
            fontFamily: "Custom-Bold",
            position: "relative",
          }}
          sx={{
            color: "white",
            m: -2.5,
            mt: 6,
            p: 2,
            py: 1,
            fontSize: "10px",
            textAlign: "center",
          }}
        >
          <FontAwesomeIcon
            style={{
              color: color.firstColor,
              marginBottom: "2px",
              marginRight: "5px",
              fontSize: "12px",
            }}
            icon={faQuoteLeft}
          />
          {description}
          <FontAwesomeIcon
            style={{
              color: color.firstColor,
              marginLeft: "5px",
              fontSize: "12px",
            }}
            icon={faQuoteRight}
          />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ArtistsCard;
