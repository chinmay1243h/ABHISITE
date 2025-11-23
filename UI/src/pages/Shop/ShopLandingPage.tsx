import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ShopCard from "../../components/cards/ShopCard";
import EntityCategory from "../../components/utils/Category";
import color from "../../components/utils/Colors";
import { responsive } from "../../components/utils/CommonStyle";
import { artCategories } from "../../components/utils/data";
import SearchBar from "../../components/utils/SearchBar";
import { getAllCourse } from "../../services/services";

export const ShopLandingPage: React.FC = () => {
  // const booksData = [
  //   {
  //     title: "How To Talk To Anyone",
  //     author: "Leil Lowndes",
  //     price: 327,
  //     originalPrice: 399,
  //     discount: 18,
  //     rating: 4.5,
  //     type: "Soft Books",
  //     format: "Document",
  //     image: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg",
  //   },
  //   {
  //     title: "The Power of Habit",
  //     author: "Charles Duhigg",
  //     price: 299,
  //     originalPrice: 499,
  //     discount: 40,
  //     type: "Dialogue",
  //     format: "Document",
  //     rating: 4.7,

  //     image: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg",
  //   },
  //   {
  //     title: "Atomic Habits",
  //     author: "James Clear",
  //     price: 420,
  //     originalPrice: 599,
  //     discount: 30,
  //     format: "Video",
  //     type: "Songs",

  //     rating: 4.8,
  //     image: "https://m.media-amazon.com/images/I/81wgcld4wxL.jpg",
  //   },
  //   {
  //     title: "Atomic Habits",
  //     author: "James Clear",
  //     price: 420,
  //     originalPrice: 599,
  //     discount: 30,
  //     type: "Dialogue",
  //     format: "Document",
  //     rating: 4.8,
  //     image: "https://m.media-amazon.com/images/I/81wgcld4wxL.jpg",
  //   },
  //   {
  //     title: "Atomic Habits",
  //     author: "James Clear",
  //     price: 420,
  //     originalPrice: 599,
  //     discount: 30,
  //     type: "Film",
  //     format: "Video",
  //     rating: 4.8,
  //     image: "https://m.media-amazon.com/images/I/81wgcld4wxL.jpg",
  //   },
  // ];

  const handleSearch = (query: string) => {
    // console.log("Searching for:", query);
  };

  const [booksData, setBooksData] = useState<any>([]);

  console.log(booksData)

  useEffect(() => {
    const payLoad = {
      data: { filter: "" },
      page: 0,
      pageSize: 50,
      order: [["createdAt", "ASC"]],
    };
    getAllCourse(payLoad)
      .then((res: any) => {
        // console.log("j", res?.data?.data?.rows);
        setBooksData(res?.data?.data?.rows);
      })
      .catch((err: any) => {
        // console.log(err)
        toast.error(err);
      });
  }, []);

  const navigate = useNavigate();

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
        boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.11)",
        color: "white",
        borderRadius: "4px 0px 0px 4px",
        background: color.textColor1,
        height: "60px",
        transition: "color 0.3s ease,background 0.3s ease",
        mixBlendMode: "multiply",

        "&:hover": {
          color: color.textColor1,
          background: "rgb(246, 246, 246)",
          // boxShadow: "-5px -5px 10px rgba(0, 0, 0, 0.37) inset",
        },
      }}
    >
      <ArrowBackIos sx={{ translate: "8px 0px", borderRadius: "0px" }} />
    </IconButton>
  );

  const CustomRightArrow: React.FC<CustomArrowProps> = ({ onClick }) => (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        right: 4,
        top: "40%",
        transform: "translateY(-)",
        boxShadow: "-5px 5px 10px rgba(0, 0, 0, 0.11)",
        color: "white",
        borderRadius: "0px 4px 4px 0px",
        background: color.textColor1,
        height: "60px",
        transition: "color 0.3s ease,background 0.3s ease",
        mixBlendMode: "multiply",
        "&:hover": {
          color: color.textColor1,
          background: "rgb(246, 246, 246)",
          // boxShadow: "-5px -5px 10px rgba(0, 0, 0, 0.37) inset",
        },
      }}
    >
      <ArrowForwardIos />
    </IconButton>
  );

  return (
    <>
      <div>
        <Box
          sx={{
            backgroundImage: "url(/assets/shop.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "100%",
            height: "60vh",
            display: "flex",
            mt: { xs: "-54px", md: "-94px" },
            alignItems: "center",
            "&::before": {
              content: '""',
              height: "60vh",

              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2))",
              zIndex: 1,
            },
          }}
        >
          <Box
            sx={{
              maxWidth: "600px",
              width: "80%",
              position: "absolute",
              zIndex: 100,
              top: "40%",
              left: "50%",
              transform: "translateY(-50%) translateX(-50%)",
            }}
          >
            <SearchBar
              label={"Search Products..."}
              onSearch={handleSearch}
              suggestions={booksData}
            />
          </Box>
        </Box>

        <Box
          sx={{
            background: "white",
            p: 2,
          }}
        >
          <Typography sx={{ fontSize: "28px", my: 2, mb: 1, pl: 2 }}>
            Top Courses :
          </Typography>

          <Box sx={{ m: 0, position: "relative" }}>
            <Carousel
              responsive={responsive}
              infinite
              customLeftArrow={<CustomLeftArrow />}
              customRightArrow={<CustomRightArrow />}
              draggable={false}
            //   autoPlay={true}
            >
              {!booksData || booksData.length === 0 ? (
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
                      minHeight: "336px",
                      zIndex: 5,
                      width: { md: 300, xs: 300 },
                      background: "#f0f0f0",
                      boxShadow: "none",
                      borderRadius: "10px",
                      position: "relative",
                      overflow: "hidden",
                      // marginTop: "30px",
                    }}
                  >
                    <CardContent
                      style={{
                        padding: 0,
                        position: "absolute",
                        top: -5,
                        right: 0,
                      }}
                    >
                      <Skeleton variant="text" width="60px" height="30px" />
                    </CardContent>
                    <Skeleton
                      variant="rectangular"
                      height="200px"
                      style={{ borderRadius: "6px" }}
                    />
                    <CardContent
                      style={{
                        paddingBottom: "16px",
                        // position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "100%",
                      }}
                    >
                      <Skeleton variant="text" width="60%" height="30px" />
                      <Skeleton variant="text" width="40%" height="30px" />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Skeleton variant="text" width="40%" height="40px" />
                        <Skeleton variant="text" width="40%" height="40px" />
                      </Box>
                      {/* <Skeleton variant="text" width="80%" height="50px" /> */}
                    </CardContent>
                  </Card>
                </Box>
              ) : (
                booksData.map((book: any, index: any) => (
                  <Box
                    onClick={() => navigate(`/productDetails/${book?.id}`)}
                    key={index}
                    p={4}
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ShopCard {...book} />
                  </Box>
                ))
              )}
            </Carousel>
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                flexWrap: "wrap",
                height: "0px",
              }}
            >
             
            </Box>

            <img
              src="/assets/crismas.jpg"
              alt="banner"
              style={{
                display: "block",
                width: "100%",
                maxHeight: "400px",
                borderRadius: "8px",
                objectFit: "contain",
                position: "relative",
                background: "black",
              }}
            />
          </Box>

          <Typography sx={{ fontSize: "28px", my: 2, mb: 1, pl: 2 }}>
            Explore Categories :
          </Typography>
          <EntityCategory categories={artCategories} />

          <img
            src="/assets/musics.png"
            alt="banner"
            style={{
              display: "block",
              width: "100%",
              maxHeight: "400px",
              borderRadius: "8px",
              objectFit: "contain",
              position: "relative",
            }}
          />

          <Typography sx={{ fontSize: "28px", my: 2, mb: 1, pl: 2 }}>
            Top Music Courses :
          </Typography>

          <Box sx={{ m: 0, position: "relative" }}>
            <Carousel
              responsive={responsive}
              infinite
              customLeftArrow={<CustomLeftArrow />}
              customRightArrow={<CustomRightArrow />}
              draggable={false}
            //   autoPlay={true}
            >
              {!booksData || booksData.length === 0 || !booksData.some((book: any) => book.category === 'music') ? (
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
                      minHeight: "336px",
                      zIndex: 5,
                      width: { md: 300, xs: 300 },
                      background: "#f0f0f0",
                      boxShadow: "none",
                      borderRadius: "10px",
                      position: "relative",
                      overflow: "hidden",
                      // marginTop: "30px",
                    }}
                  >
                    <CardContent
                      style={{
                        padding: 0,
                        position: "absolute",
                        top: -5,
                        right: 0,
                      }}
                    >
                      <Skeleton variant="text" width="60px" height="30px" />
                    </CardContent>
                    <Skeleton
                      variant="rectangular"
                      height="200px"
                      style={{ borderRadius: "6px" }}
                    />
                    <CardContent
                      style={{
                        paddingBottom: "16px",
                        // position: "absolute",
                        bottom: 0,
                        right: 0,
                        width: "100%",
                      }}
                    >
                      <Skeleton variant="text" width="60%" height="30px" />
                      <Skeleton variant="text" width="40%" height="30px" />
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Skeleton variant="text" width="40%" height="40px" />
                        <Skeleton variant="text" width="40%" height="40px" />
                      </Box>
                      {/* <Skeleton variant="text" width="80%" height="50px" /> */}
                    </CardContent>
                  </Card>
                </Box>
              ) : (
                booksData
                  .filter((book: any) => book.category === "music")
                  .map((book: any, index: any) => (
                    <Box
                      onClick={() => navigate(`/productDetails/${book?.id}`)}
                      key={index}
                      p={4}
                      sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ShopCard {...book} />
                    </Box>
                  ))
              )}
            </Carousel>
          </Box>
        </Box>
      </div>
    </>
  );
};
