import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Card, CardContent, Skeleton, Typography } from "@mui/material";
import { Grid, keyframes } from "@mui/system";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArtistsCard from "../../components/cards/ArtistsCard";
import EntityCategory from "../../components/utils/Category";
import color from "../../components/utils/Colors";
import { artistCategoryTypes } from "../../components/utils/data";
import { getAllArtist } from "../../services/services";
import "../Home.css";
import ArtistTestimony from "./ArtistTestimony";
import TopArtists from "./TopArtists";

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

export const Artists: React.FC = () => {
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

  const [artist, setArtist] = useState([]);

  useEffect(() => {
    const payLoad = {
      data: { filter: "" },
      page: 0,
      pageSize: 50,
      order: [["createdAt", "ASC"]],
    };

    getAllArtist(payLoad)
      .then((res: { data: { data: { rows: SetStateAction<never[]> } } }) => {
        console.log(res.data)
        setArtist(res?.data?.data?.rows);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, []);

  const navigate = useNavigate();

  function handleCardClick(id: any, userId: any) {
    // console.log(userId)
    navigate(`/portfolio1/${id}`, { state: userId });
  }

  return (
    <>
      <div>
        <Box
          sx={{
            backgroundImage: "url(/assets/artist-banner.jpg)",
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
              height: { xs: "50vh", md: "100vh" },

              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3))",
              backdropFilter: "blur(2px)",
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
              // marginLeft: "5%",
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
                // pl: 6,
              }}
            >
              You've came to <br /> right place!
            </Typography>

            <Typography
              style={{
                marginTop: "15px",
                marginLeft: "0px",
              }}
              id="custom-button"
            >
              Become an Artist{" "}
              <FontAwesomeIcon
                id="custom-button-icon"
                icon={faArrowRight}
              ></FontAwesomeIcon>
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", md: "block" },
              zIndex: 2,
              color: "white",
              marginRight: { xs: "0px", sm: "40px" },
              backgroundImage: "url(/assets/artist-5.png)",
              border: "solid 1px white",
            }}
            className="card"
          >
            <div className="card-content">
              <Typography className="card-title">Beyonce</Typography>
              <p className="card-body">
                Beyoncé, a Grammy-winning icon, excels in music, film, and
                activism, empowering women and inspiring global audiences
                through her artistry.
              </p>
              {/* <Button
                id="custom-button"
                style={{ marginLeft: "0px", fontSize: "16px" }}
              >
                Learn More
              </Button> */}
            </div>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "white",
           pt:0
          }}
        >
          <TopArtists variant="heading1" artist={artist}></TopArtists>

          <Typography
            className="heading"
            style={{ background: "black" }}
            sx={{
              background: color.firstColor,
              // padding: "10px",
              color: "#fff",
              textAlign: "center",
            }}
          >
            Artists Categories
          </Typography>

          <EntityCategory categories={artistCategoryTypes} />

          {artist?.filter(
            (artist: any) => artist?.artistCategory === "musician"
          ).length !== 0 && (
              <div
                style={{
                  padding: "20px",
                  paddingTop: "48px",
                  position: "relative",
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
                  Top Music Artists
                </Typography>

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
                      {artist
                        ?.filter(
                          (artist: any) => artist?.artistCategory === "musician"
                        )
                        .slice(0, 10)
                        .map((artist: any, index: number) => (
                          <ArtistsCard
                            key={index}
                            title={artist.firstName}
                            profession={artist?.artistCategory}
                            theme={artist.theme}
                            description={artist.tagline}
                            image={artist.coverPhoto}
                            onClick={() =>
                              handleCardClick(artist.id, artist.userId)
                            }
                          />
                        ))}
                    </>
                  )}
                </Grid>
              </div>
            )}

          <ArtistTestimony></ArtistTestimony>
        </Box>
      </div>
    </>
  );
};
