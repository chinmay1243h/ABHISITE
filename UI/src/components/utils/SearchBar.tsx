import { faFileAlt, faMusic, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import color from "./Colors";

// Styled components for the search bar
const StyledSearchBar = styled(Box)(({ theme }) => ({
  display: "flex",
  position: "relative",
  alignItems: "center",
  background: color.textColor1,
  border: `2px solid white`,
  borderRadius: "44px",
  // overflow: "hidden",
  padding: "0px 10px",
  boxShadow:
    "0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)",
  color: "rgba(0, 0, 0, 0.27)",
  transition: "all 0.4s ease",
  "&:hover": {
    // boxShadow: "-1px -1px 10px inset",
    border: "2px solid white",
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  flex: 1,
  color: "white",
  "& .MuiInputBase-root": {
    padding: "0px",
    background: "transparent",
    color: "white",
    borderRadius: theme.shape.borderRadius,
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
    padding: "0px",
    color: "white",
  },
  "& .MuiInputBase-input::placeholder": {
    opacity: 1,
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
  color: theme.palette.primary.main,
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

// SearchBar component
interface SearchBarProps {
  onSearch: (query: string) => void;
  label: string;
  suggestions: Array<any>; // New prop for suggestions data
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  label,
  suggestions,
}) => {
  const [query, setQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);
  // console.log(filteredSuggestions);
  const navigate = useNavigate();

  // Handle search input changes
  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  // Handle search suggestions filtering
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    // Filter suggestions based on query
    const filtered = suggestions.filter(
      (item) =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.courseType?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artistCategory?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };

  const location = useLocation();

  const currentURL = location.pathname + location.search;
  const isCategoryURL = currentURL.includes("/categories") || currentURL === ('/shop');
  const isArtistCategoryURL = currentURL.includes("/artist-categories");

  const handleCardClick = (categoryName: string) => {
    navigate(`/productDetails/${categoryName}`, { state: { categoryName } });
  };

  function handleCardClick1(id: any, userId: any) {
    // console.log(userId)
    navigate(`/portfolio1/${id}`, { state: userId });
  }

  const textFieldRef = useRef<HTMLDivElement | null>(null);
  const [listWidth, setListWidth] = useState(0);

  useEffect(() => {
    if (textFieldRef.current) {
      setListWidth(textFieldRef.current.offsetWidth);
    }
  }, [textFieldRef.current]);

  return (
    <StyledSearchBar ref={textFieldRef}>
      <StyledTextField
        style={{ padding: "0px" }}
        variant="outlined"
        placeholder={label}
        value={query}
        onChange={handleQueryChange}
        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
      />
      <StyledIconButton style={{ background: "white" }} onClick={handleSearch}>
        <SearchIcon />
      </StyledIconButton>

      {query && filteredSuggestions.length > 0 && (
        <List
          style={{
            padding: "16px",
            top: 70,
            left: 0,
            position: "absolute",
            background: color.textColor1,
            border: "1px solid #ccc",
            borderRadius: "12px",
            maxHeight: "300px",
            overflowY: "auto",
            width: "100%",
            maxWidth: `${listWidth}px`,
            zIndex: 999,
          }}
        >
          {filteredSuggestions.map((item, index) => (
            <ListItem
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "12px",
                marginBottom: "10px",
              }}
              sx={{
                background: "white",
                '&:hover': {
                  background: '#f5f5f5'
                }
              }}
              // button
              key={index}
              onClick={() => {
                if (isCategoryURL) {
                  handleCardClick(item.id);
                } else {
                  handleCardClick1(item.id, item.userId);
                }
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  borderRadius: "12px",

                }}
              >
                <Avatar
                  src={item.thumbnail || item.coverPhoto}
                  style={{
                    borderRadius: "8px",
                    marginRight: "10px",
                  }}
                  imgProps={{
                    style: {
                      objectFit: "cover",
                      objectPosition: "top",
                    },
                  }}
                ></Avatar>

                {isCategoryURL ? (
                  <ListItemText
                    style={{ color: "black", cursor: "pointer" }}
                    primary={item.name || item.title}
                    secondary={item.description || item.author}
                  />
                ) : (
                  <ListItemText
                    style={{ color: "black", cursor: "pointer" }}
                    primary={
                      <>
                        {item.firstName} {item.lastName}
                      </>
                    }
                    secondary={item.artistCategory}
                  />
                )}
              </Box>

              {!isArtistCategoryURL && (
                <Box>
                  <Typography id="r-news-date">
                    {item.firstName} {item.lastName}
                  </Typography>
                  <Typography id="r-news-date">
                    {item.courseType === "Audio" && (
                      <FontAwesomeIcon icon={faMusic} />
                    )}
                    {item.courseType === "Video" && (
                      <FontAwesomeIcon icon={faVideo} />
                    )}
                    {item.courseType === "Document" && (
                      <FontAwesomeIcon icon={faFileAlt} />
                    )}
                    {item.courseType}
                  </Typography>
                </Box>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </StyledSearchBar>
  );
};

export default SearchBar;
