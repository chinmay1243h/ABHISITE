import {
  faChevronCircleDown,
  faChevronCircleUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import color from "./Colors";

type Category = {
  name: string;
  description: string;
  value: string;
  theme: string;
  src: string;
};

type EntityCategoryProps = {
  categories: Category[];
};

const EntityCategory: React.FC<EntityCategoryProps> = ({ categories }) => {
  const navigate = useNavigate();

  const location = useLocation();
  const handleCardClick = (categoryName: string) => {

    if (location.pathname === '/shop') {
      navigate(`/categories?filters=${encodeURIComponent(categoryName)}`);
    } else if (location.pathname === '/artists') {
      navigate(`/artist-categories?filters=${encodeURIComponent(categoryName)}`);
    }
  };

  const [imageLoaded, setImageLoaded] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false); // Toggle state for showing all categories

  const handleToggle = () => {
    setIsExpanded(!isExpanded); // Toggle between expanded and collapsed states
  };

  return (
    <Box>
      <Box
        display="flex"
        flexWrap="wrap"
        alignItems={"center"}
        gap="20px"
        p={2}
        mt={3}
        sx={{
          justifyContent: { xs: "center", md: "flex-start" },
        }}
      >
        {categories
          .slice(0, isExpanded ? categories.length : 10)
          .map((category, index) => {
            return (
              <Box
                className="flip-card"
                key={index}
                sx={{
                  width: { xs: '150px', sm: '200px' },
                  height: { xs: '150px', sm: '200px' },
                  borderRadius: "12px",
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick(category.name)}
              >
                <div className="flip-card-inner">
                  <div
                    className="flip-card-front"
                    style={{ position: "relative" }}
                  >
                    {!imageLoaded && (
                      <Skeleton
                        variant="rectangular"
                        width={200}
                        height={200}
                        style={{ borderRadius: "8px", position: "relative" }}
                      ></Skeleton>
                    )}
                    <img
                      src={`${category.src}`}
                      alt={category.name}
                      onLoad={() => setImageLoaded(true)}
                      style={{
                        display: imageLoaded ? "block" : "none",
                        width: "100%",
                        height: "100%",
                        borderRadius: "8px",
                        objectFit: "cover",
                        position: "relative",
                      }}
                    />
                    {imageLoaded && (
                      <Typography
                        style={{
                          position: "absolute",
                          fontSize: "16px",
                          color: "white",
                          bottom: 5,
                          left: 5,
                        }}
                      >
                        {category.name}
                      </Typography>
                    )}
                  </div>

                  <div
                    className="flip-card-back"
                    style={{
                      backgroundColor: category.theme,
                      color: "#fff",
                      padding: "10px",
                      borderRadius: "8px",
                      textAlign: "center",
                      fontSize: "18px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <span>{category.name}</span>
                    {category.description}
                    <Button
                      style={{ fontSize: "14px", marginLeft: "0px" }}
                      id="custom-button"
                    >
                      See All
                    </Button>
                  </div>
                </div>
              </Box>
            );
          })}

        <div style={{ width: "100%" }}>
          {categories.length > 10 && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{
                whiteSpace: "nowrap",
                background: color.textColor1,
                fontSize: "14px",
                textTransform: "none",
                margin: 0,
                marginLeft: "auto",
                border: "solid 1px white",
                display: "flex",
                alignItems: "center",
              }}
              sx={{
                padding: "2px 10px",
                transition: "all 0.4s ease",

                "&:hover": {
                  paddingRight: "20px",
                },
              }}
              onClick={handleToggle}
            >
              {isExpanded ? "Show Less" : "Show All Categories"}
              {isExpanded ? (
                <FontAwesomeIcon
                  style={{ marginLeft: "6px" }}
                  icon={faChevronCircleUp}
                />
              ) : (
                <FontAwesomeIcon
                  style={{ marginLeft: "6px" }}
                  icon={faChevronCircleDown}
                />
              )}
            </Button>
          )}
        </div>
      </Box>
    </Box>
  );
};

export default EntityCategory;
