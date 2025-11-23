import {
  faCircleXmark,
  faGrip,
  faList,
  faSort,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Add, DeleteSweep, Remove } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Collapse,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CSSTransition } from "react-transition-group";
import { getAllArtist, getAllCourse } from "../../services/services";
import ArtistsCard from "../cards/ArtistsCard";
import ShopCard from "../cards/ShopCard";
import color from "./Colors";
import SearchBar from "./SearchBar";
import { artCategories, artistCategoryTypes, contentFormats } from "./data";
const products = [
  {
    title: "How To Talk To Anyone",
    author: "Leil Lowndes",
    price: 327,
    originalPrice: 399,
    discount: 18,
    rating: 4.5,
    type: "Soft Books",
    format: "Document",
    image: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg",
  },
  {
    title: "The Power of Habit",
    author: "Charles Duhigg",
    price: 299,
    originalPrice: 499,
    discount: 40,
    type: "Dialogue",
    format: "Document",
    rating: 4.7,
    image: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    price: 420,
    originalPrice: 599,
    discount: 30,
    format: "Video",
    type: "Songs",

    rating: 4.8,
    image: "https://m.media-amazon.com/images/I/81wgcld4wxL.jpg",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    price: 420,
    originalPrice: 599,
    discount: 30,
    type: "Dialogue",
    format: "Document",
    rating: 4.8,
    image: "https://m.media-amazon.com/images/I/81wgcld4wxL.jpg",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    price: 420,
    originalPrice: 599,
    discount: 30,
    type: "Film",
    format: "Video",
    rating: 4.8,
    image: "https://m.media-amazon.com/images/I/81wgcld4wxL.jpg",
  },
];

const CategoryPage: React.FC = () => {
  const location = useLocation();
  const categoryName = location.state?.categoryName || "";

  const currentURL = location.pathname + location.search;
  const isCategoryURL = currentURL.includes("/categories");
  const isArtistCategoryURL = currentURL.includes("/artist-categories");

  const queryParams = new URLSearchParams(location.search);
  const initialSelectedCategories = queryParams.get("filters")
    ? queryParams.get("filters")!.split(",")
    : categoryName
      ? [categoryName]
      : [];

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialSelectedCategories
  );

  // console.log(selectedCategories);

  const handleCheckboxChange = (type: string) => {
    const updatedCategories = selectedCategories.includes(type)
      ? selectedCategories.filter((item) => item !== type)
      : [...selectedCategories, type];

    setSelectedCategories(updatedCategories);

    // Update query parameters in the URL
    const newParams = new URLSearchParams(location.search);
    newParams.set("filters", updatedCategories.join(","));
    navigate({ search: newParams.toString() }, { replace: true });
  };
  // const filteredProducts =
  //   selectedCategories.length === 0
  //     ? products
  //     : products.filter(
  //         (product) =>
  //           selectedCategories.includes(product.type) ||
  //           selectedCategories.includes(product.format)
  //       );

  const clearFilter = () => {
    setSelectedCategories([]);
    const newParams = new URLSearchParams(location.search);
    newParams.delete("filters");
    navigate({ search: newParams.toString() }, { replace: true });
  };

  useEffect(() => {
    // Apply filters when URL changes
    const filtersFromUrl = queryParams.get("filters")
      ? queryParams.get("filters")!.split(",")
      : [];
    setSelectedCategories(filtersFromUrl);
  }, [location.search]);

  type CollapseStateKeys = "artistType" | "contentFormat" | "contentType";

  const [collapseStates, setCollapseStates] = useState<{
    artistType: boolean;
    contentFormat: boolean;
    contentType: boolean;
  }>({
    artistType: isCategoryURL ? false : true,
    contentFormat: false,
    contentType: false,
  });

  const toggleCollapse = (section: CollapseStateKeys) => {
    setCollapseStates((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  interface FilterSectionProps {
    title: string;
    data: string[];
    collapseKey: keyof typeof collapseStates;
  }

  const renderFilterSection = ({
    title,
    data,
    collapseKey,
  }: FilterSectionProps) => (
    <>
      <Typography
        onClick={() => toggleCollapse(collapseKey)}
        variant="h6"
        sx={{
          fontSize: "14px",
          marginTop: "1rem",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <IconButton sx={{ marginRight: "5px", color: "inherit" }}>
          {collapseStates[collapseKey] ? (
            <Remove
              style={{
                fontSize: "18px",
              }}
            />
          ) : (
            <Add
              style={{
                fontSize: "18px",
                // color:color.textColor2
              }}
            />
          )}
        </IconButton>
        {title}
      </Typography>

      <Collapse in={collapseStates[collapseKey]} timeout="auto" unmountOnExit>
        {data.map((type, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={selectedCategories.includes(type)}
                onChange={() => handleCheckboxChange(type)}
                sx={{
                  color: selectedCategories.includes(type)
                    ? "primary.main"
                    : "white",
                  "&.Mui-checked": {
                    color: color.textColor1,
                  },
                }}
              />
            }
            label={<Typography sx={{ fontSize: "14px" }}>{type}</Typography>}
            sx={{ marginBottom: "4px", pl: 5 }}
          />
        ))}
      </Collapse>
    </>
  );

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const [width, setWidth] = useState(25);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newWidth = (e.clientX / window.innerWidth) * 100;
      if (newWidth > 5 && newWidth < 50) {
        setWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const [sortOption, setSortOption] = useState("popularity");

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSortOption(event.target.value);
  };

  const [booksData, setBooksData] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(6);

  const handlePageChange = (event: any, value: any) => {
    setCurrentPage(value);
  };

  const handleCardsPerPageChange = (event: any) => {
    setCardsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const categoryNames = artCategories?.map((category) => category.name);
  const artistCcategoryNames = artistCategoryTypes?.map(
    (category) => category.name
  );

  const navigate = useNavigate();

  useEffect(() => {
    const payLoad = {
      data: {
        filter: "",
      },
      page: 0,
      pageSize: 50,
      order: [["createdAt", "ASC"]],
    };

    getAllCourse(payLoad)
      .then((res: any) => {
        // Assuming res.data.data.rows contains the data array
        const fetchedData = res?.data?.data?.rows || [];

        const filteredData =
          selectedCategories.length === 0
            ? fetchedData
            : fetchedData.filter((item: any) =>
              selectedCategories.some(
                (category) =>
                  item.category
                    ?.toLowerCase()
                    .includes(category.toLowerCase()) ||
                  item.courseType
                    ?.toLowerCase()
                    .includes(category.toLowerCase())
              )
            );
        setBooksData(filteredData);
      })
      .catch((err: any) => {
        toast.error(err);
      });
  }, [selectedCategories]);

  const [artist, setArtist] = useState([]);
  useEffect(() => {
    const payLoad = {
      data: { filter: "" },
      page: 0,
      pageSize: 50,
      order: [["createdAt", "ASC"]],
    };

    getAllArtist(payLoad)
      .then((res: any) => {
        const fetchedData = res?.data?.data?.rows || [];
        const filteredData =
          selectedCategories.length === 0
            ? fetchedData
            : fetchedData.filter((item: any) =>
              selectedCategories.some((category) =>
                item.artistCategory
                  ?.toLowerCase()
                  .includes(category.toLowerCase())
              )
            );

        setArtist(filteredData);
        // console.log('f', filteredData);
      })
      .catch((err: any) => {
        console.log(err);
      });
  }, [selectedCategories]);

  function handleCardClick(id: any, userId: any) {
    // console.log(userId)
    navigate(`/portfolio1/${id}`, { state: userId });
  }

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;

  const currentCards = booksData.slice(indexOfFirstCard, indexOfLastCard);

  const currentCards1 = artist.slice(indexOfFirstCard, indexOfLastCard);

  return (
    <Box
      display="flex"
      sx={{
        padding: "1rem",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        maxWidth: "100vw",
      }}
    >
      <CSSTransition
        in={isVisible}
        timeout={300}
        classNames="sidebar"
        unmountOnExit
      >
        <Box
          width={`${width}vw`}
          p={2}
          px={0}
          // borderRight="1px solid #ccc"
          display="flex"
          flexDirection="column"
          sx={{
            background: color.secondColor,
            color: "white",
            position: { xs: "absolute", md: "relative" },
            borderRadius: "4px",
            boxShadow: "5px 5px 10px rgba(93, 93, 93, 0.2)",
            zIndex: 100,
            minHeight: "90%",
            overflowY: "scroll",
            maxHeight: "150vh",
            minWidth: { xs: "55vw", md: "0px" },
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0px 15px",
            }}
          >
            <Typography>Liv Abhi Productions</Typography>

            <FontAwesomeIcon
              onClick={() => setIsVisible(false)}
              icon={faCircleXmark}
            ></FontAwesomeIcon>
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              width: "5px",
              cursor: "ew-resize",
              background: "rgba(255, 255, 255, 0)",
            }}
            onMouseDown={handleMouseDown}
          ></div>

          <div
            style={{
              margin: "20px 0px",
              // borderRadius: "4px",
              boxShadow: "-5px -5px 10px rgba(189, 189, 189, 0.56) inset",
              paddingBottom: "15px",
            }}
          >
            {renderFilterSection({
              title: "Filter by Artist Type",
              data: artistCcategoryNames,
              collapseKey: "artistType",
            })}

            {isCategoryURL && (
              <>
                {renderFilterSection({
                  title: "Filter by Content Format",
                  data: contentFormats,
                  collapseKey: "contentFormat",
                })}
                {renderFilterSection({
                  title: "Filter by Content Type",
                  data: categoryNames,
                  collapseKey: "contentType",
                })}
              </>
            )}
          </div>

          <div style={{ marginTop: "20px", width: "100%", display: "flex" }}>
            {selectedCategories.length > 0 && (
              <Button
                variant="contained"
                onClick={clearFilter}
                style={{
                  padding: "10px 20px",
                  background: color.textColor1,
                  color: "white",
                  margin: "auto",
                }}
              >
                <DeleteSweep style={{ marginRight: "5px" }} /> Clear Filter
              </Button>
            )}
          </div>
        </Box>
      </CSSTransition>

      <Box flex={1} p={2} sx={{ width: "100%" }}>
        {/* <Typography mb={2} variant="h6">Categories</Typography> */}

        <SearchBar
          label={"Search Products..."}
          onSearch={handleSearch}
          suggestions={isCategoryURL ? booksData : artist}
        />

        <Box
          sx={{ flexWrap: "wrap" }}
          p={2}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={2}
          mt={1}
        >
          <Button
            onClick={() => setIsVisible((prev) => !prev)}
            variant="contained"
            style={{
              border: "solid 1px",
              borderRadius: "52px",
              color: !isVisible ? color.textColor1 : "white",
              background: isVisible ? color.textColor1 : "transparent",
            }}
          >
            <FontAwesomeIcon
              icon={faList}
              style={{ marginRight: "10px" }}
            ></FontAwesomeIcon>
            Filter
          </Button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              backgroundColor: color.textColor1,
              color: "white",
              borderRadius: "52px",
              paddingLeft: "16px",
              boxShadow:
                "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: "14px",
                whiteSpace: "nowrap",
              }}
            >
              <FontAwesomeIcon
                icon={faSort}
                style={{ marginRight: "10px" }}
              ></FontAwesomeIcon>
              Sort By:
            </Typography>
            <FormControl
              size="small"
              variant="outlined"
              style={{ minWidth: 200, color: "white" }}
            >
              <Select
                value={sortOption}
                onChange={handleChange}
                sx={{
                  border: "solid 2px white",
                  fontSize: "14px",
                  backgroundColor: sortOption
                    ? color.textColor1
                    : "transparent",
                  borderRadius: "52px",
                  color: sortOption ? "white" : "black",
                  boxShadow: "-3px 0px 5px rgba(0, 0, 0, 0.16)",
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <MenuItem value="popularity">Sort by popularity</MenuItem>
                <MenuItem value="priceLowHigh">Price: Low to High</MenuItem>
                <MenuItem value="priceHighLow">Price: High to Low</MenuItem>
                <MenuItem value="rating">Highest Rating</MenuItem>
              </Select>
            </FormControl>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              backgroundColor: color.textColor1,
              color: "white",
              borderRadius: "52px",
              paddingLeft: "16px",
              boxShadow:
                "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: "14px",
              }}
            >
              <FontAwesomeIcon
                icon={faGrip}
                style={{ marginRight: "10px" }}
              ></FontAwesomeIcon>
              Show:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 70 }}>
              <Select
                labelId="cards-per-page-label"
                value={cardsPerPage}
                onChange={handleCardsPerPageChange}
                sx={{
                  border: "solid 2px white",
                  fontSize: "14px",
                  backgroundColor: color.textColor1,
                  color: "white",
                  borderRadius: "52px",
                  boxShadow: "-3px 0px 5px rgba(0, 0, 0, 0.16)",
                  "& .MuiSelect-icon": {
                    color: "white",
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                  },
                }}
              >
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={10}>10</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Box>

        <Box
          flexWrap="wrap"
          mt={2}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            gap: 3,
          }}
        >
          {isCategoryURL ? (
            !currentCards || currentCards.length === 0 ? (
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
              <>
                {currentCards.map((book: any, index: any) => (
                  <Box
                    onClick={() => navigate(`/productDetails/${book?.id}`)}
                    key={index}
                    p={4}
                    sx={{
                      // width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    <ShopCard {...book} />
                  </Box>
                ))}
              </>
            )
          ) : !currentCards1 || currentCards1.length === 0 ? (
            <Card
              sx={{
                minHeight: "250px",
                zIndex: 5,
                width: { md: 200, xs: "200px" },
                background: "#f0f0f0",
                boxShadow: "0px 0px 40px rgba(0, 0, 0, 0.1)",
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
              {currentCards1.map((artist: any, index: number) => (
                <ArtistsCard
                  key={index}
                  title={artist.firstName}
                  profession={artist?.artistCategory}
                  theme={artist.theme}
                  description={artist.tagline}
                  image={artist.coverPhoto}
                  onClick={() => handleCardClick(artist.id, artist.userId)}
                />
              ))}
            </>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            mt: 6,
          }}
        >
          <Pagination
            count={Math.ceil(
              (isCategoryURL ? booksData.length : artist.length) / cardsPerPage
            )}
            page={currentPage}
            onChange={handlePageChange}
            // color="primary"
            sx={{
              button: {
                backgroundColor: "white",
                color: "grey",
                "&.Mui-selected": {
                  backgroundColor: color.textColor1,
                  color: "white",
                },
              },
            }}
            style={{ color: color.textColor1 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CategoryPage;
