import React, { useEffect, useState } from "react";
import PosterCard from "../../components/cards/PosterCard";
import color from "../../components/utils/Colors";
import { Button, TextField } from "@mui/material";
import { inputSx } from "../../components/utils/CommonStyle";
import { SentimentDissatisfied } from "@mui/icons-material";
import { getAllMovies } from "../../services/services";
import { useNavigate } from "react-router-dom";

const MoviePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);


  const genres = ["Sci-Fi", "Thriller", "Action", "Drama", "Adventure"];
  // const movies = [
  //   {
  //     id: 1,
  //     title: "Inception",
  //     genres: ["Sci-Fi", "Thriller"],
  //     image: "inception.jpg",
  //   },
  //   {
  //     id: 2,
  //     title: "The Dark Knight",
  //     genres: ["Action", "Drama"],
  //     image: "dark_knight.jpg",
  //   },
  //   {
  //     id: 3,
  //     title: "Interstellar",
  //     genres: ["Sci-Fi", "Drama"],
  //     image: "interstellar.jpg",
  //   },
  //   {
  //     id: 4,
  //     title: "Joker",
  //     genres: ["Drama", "Thriller"],
  //     image: "joker.jpg",
  //   },
  //   {
  //     id: 5,
  //     title: "Avatar",
  //     genres: ["Sci-Fi", "Adventure"],
  //     image: "avatar.jpg",
  //   },
  // ];
  const navigate = useNavigate();
  const [movies, setMovies] = useState<any>([]);
  useEffect(() => {
    const payLoad = {
      data: { filter: "" },
      page: 0,
      pageSize: 50,
      order: [["createdAt", "ASC"]],
    };
    getAllMovies(payLoad).then((res) => {
      console.log(res)
      setMovies(res?.data?.data?.rows || [])
    }).catch((err) => {
      console.log(err);
    })
  }, [])

  const filteredMovies = movies.filter((movie: any) => {
    const matchesGenres =
      selectedGenres.length > 0
        ? selectedGenres.every((genre) => movie.genre.includes(genre))
        : true;
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGenres && matchesSearch;
  });

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };
  return (
    <div style={{ minHeight: "80vh", padding: "10px" }}>
      <TextField
        sx={inputSx}
        type="text"
        placeholder="Search Movies..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          //   padding: "10px",
          borderRadius: "18px",
          overflow: "hidden",
          marginBottom: "20px",
          fontSize: "16px",
          background: "white",
        }}
      />

      {/* Genre Filters */}
      <div style={{ marginBottom: "20px" }}>
        {genres.map((genre) => (
          <Button
            key={genre}
            onClick={() => toggleGenre(genre)}
            style={{
              padding: "10px 15px",
              margin: "5px",
              background: selectedGenres.includes(genre) ? color.textColor1 : "#FFF",
              color: selectedGenres.includes(genre) ? "#FFF" : "#000",
              borderRadius: "18px",
              cursor: "pointer",
            }}
          >
            {genre}
          </Button>
        ))}
      </div>

      {/* Movie List */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "20px",
          color: "white",
          textAlign: "center",
          minHeight: '40vh'
        }}
      >
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie: any) => (
            <PosterCard
              key={movie.id}
              title={movie.title}
              genre={movie.genre}
              image={movie.images}
              onClick={() => navigate(`/movies/details/${movie.id}`)}
            />
          ))
        ) : (
          <p
            style={{
              textAlign: "center",
              fontSize: "24px",
              marginTop: '50px',
              animation: "fadeIn 1s ease-in-out",
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "bounce 2s infinite",
              }}
            >
              OOPS! <SentimentDissatisfied style={{ fontSize: "30px", marginLeft: "8px" }} />
            </span>
            <span style={{ animation: "fadeIn 2s ease-in-out" }}>No Movies Found.</span>
            <style>
              {`
                @keyframes bounce {
                  0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                  }
                  40% {
                    transform: translateY(-10px);
                  }
                  60% {
                    transform: translateY(-5px);
                  }
                }
      
                @keyframes fadeIn {
                  from {
                    opacity: 0;
                  }
                  to {
                    opacity: 1;
                  }
                }
              `}
            </style>
          </p>

        )}
      </div>
    </div>
  );
};

export default MoviePage;
