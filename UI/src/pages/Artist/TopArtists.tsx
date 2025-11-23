import { faQuoteLeft, faQuoteRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import React from "react";
import ArtistsCard from "../../components/cards/ArtistsCard";
import color from "../../components/utils/Colors";
import { useNavigate } from "react-router-dom";

interface TopArtistsProps {
  variant: "heading1" | "heading2";
  artist: any[];
}

const TopArtists: React.FC<TopArtistsProps> = ({ variant, artist }) => {
  // console.log(artist);
  const navigate = useNavigate()

  function handleCardClick(id: any, userId: any) {
    // console.log(userId)
    navigate(`/portfolio1/${id}`, { state: userId });

  }

  return (
    <div
      style={{
        // background: color.firstColor,
        // background:'white',
        padding: "20px",
        paddingTop: "48px",
        position: "relative",
      }}
    >
      {variant === "heading1" ? (
        <Typography
          style={{
            marginTop: "0px",
            background: color.headingBg,
            color: color.textColor,
          }}
          className="heading"
        >
          Featured Artists
        </Typography>
      ) : (
        <Typography
              style={{ textAlign: "center", paddingTop: "20px" }}
          sx={{
            // px: 16,
            borderRadius: "12px",
            fontSize: "14px",
            // fontFamily: "Custom-regular",
            // background: "black",
            color: color.textColor,

            width: "fit-content",
            margin: "auto",
            // mx: 8,
            mb: 2,
            py: 5,
            // boxShadow: "-5px -5px 15px #00000050 inset",
            // fontFamily: "Rosttel",
            // mt: 1,
            // textShadow: "0px 0px 8px rgba(0, 0, 0, 10)",
          }}
        >
          <Typography
            style={{
              marginTop: "0px",
              background: color.headingBg,
              color: color.textColor,
            }}
            className="heading"
          >
            Featured Artists
          </Typography>
          <FontAwesomeIcon
            style={{
              color: color.textColor,

              marginBottom: "6px",
              marginRight: "5px",
              fontSize: "14px",
            }}
            icon={faQuoteLeft}
          />
          "Spotlighting Featured Artists" celebrates trailblazing creators who
          redefine music, visual arts, and media. Each artist brings a unique
          perspective, blending tradition with innovation. From emerging talents
          to seasoned visionaries, their work inspires and resonates, shaping
          cultural landscapes and sparking conversations. Discover the pioneers
          crafting tomorrow’s artistic expressions today
          <FontAwesomeIcon
            style={{
              color: color.textColor,
              marginLeft: "5px",
              marginBottom: "4px",
              fontSize: "12px",
            }}
            icon={faQuoteRight}
          />
        </Typography>
      )}
      <Grid
        container
        // spacing={2}
        justifyContent="space-around"
        sx={{
          position: "relative",
          mt: 0,
          p: 4,
          pt: 2,
          pb: 6,
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundSize: "cover",
            backgroundRepeat: "repeat-x",
            animation: "moveBackground 20s linear infinite",
            position: "absolute",
            top: 0,
            // boxShadow: "0px 0px 40px rgba(0, 0, 0, 10)",
            opacity: 0.4,
            "@keyframes moveBackground": {
              from: { backgroundPosition: "0 0" },
              to: { backgroundPosition: "100% 100%" },
            },
          }}
        ></Box>
        <Box
          sx={{
            opacity: "0.8",
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
          }}
        ></Box>
        <Box
          sx={{
            opacity: "1",
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "100%",
            background: "transparent",
            zIndex: 1,
          }}
        ></Box>

        {!artist || artist.length === 0 ? (
          <Card
            sx={{
              minHeight: "250px",
              zIndex: 5,
              width: { md: 200, xs: "200px" },
              background: "#f0f0f0",
              boxShadow: "0px 0px 40px rgba(0, 0, 0, 0.2)",
              borderRadius: "10px",
              position: "relative",
              overflow: "hidden",
              marginTop: "30px",
            }}
          >
            <CardContent
              style={{
                position: "absolute",
                top: -5,
                right: 0,
              }}
            >
              <Skeleton variant="text" width="80px" height="30px" />
            </CardContent>
            <Skeleton variant="rectangular" height="100%" />
            <CardContent
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "100%",
              }}
            >
              <Skeleton variant="text" width="60%" height="20px" />
              <Skeleton variant="text" width="40%" height="20px" />
              {/* <Skeleton variant="text" width="80%" height="50px" /> */}
            </CardContent>
          </Card>
        ) : (
          <>
            {artist?.slice(0, 10).map((artist: any, index: number) => (
              <ArtistsCard
                key={index}
                title={artist.firstName}
                profession={artist?.artistCategory}
                theme={artist.theme}
                description={artist.tagline}
                image={artist.profileImage}
                onClick={() => handleCardClick(artist.id, artist.userId)}
              />
            ))}
          </>
        )}
      </Grid>
    </div>
  );
};

export default TopArtists;
