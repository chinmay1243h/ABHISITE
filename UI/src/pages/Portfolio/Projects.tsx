import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import color from "../../components/utils/Colors";
interface PortfolioProps {

  portfolioProject: { portfolioProjects: any[] }[]

}

export default function Projects({ portfolioProject }: PortfolioProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );



  const handleDiscoverMoreClick = (id: number) => {
    setSelectedProjectId((prevId) => (prevId === id ? null : id));
  };

  return (
    <Box>
      {portfolioProject?.[0]?.portfolioProjects.map((news) => (
        <Box
          key={news.id}
          sx={{
            display: "flex",
            flexDirection: { xs: 'column', md: 'row' },
            gap: "20px",
            margin: "5px",
            border: "solid 1px white",
            borderRadius: "6px",
            overflow: "hidden",
            padding: "10px",
            transition: "all 0.3s",
            "&:hover": {
              background: "#f5f5f5",
              "& .imageBox": {
                transform: "scale(1.05)",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
              },
            },
          }}
        >
          <Box
            className="imageBox"
            sx={{
              backgroundImage: `url(${news.imageFile})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minWidth: "40%",
              height: "250px",
              transition: "transform 0.5s, box-shadow 0.5s",
            }}
          ></Box>

          <div
            style={{
              padding: "5px",
              paddingTop: "0px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            <Typography sx={{ fontSize: "14px" }}>{news.title}</Typography>

            {selectedProjectId === news.id && (
              <Box
                sx={{
                  borderRadius: "4px",
                  fontSize: "12px",
                  background: color.textColor1,
                  color: "white",
                  p: 2,
                  my: 1,
                  mb: 1.5,
                  animation: "fadeIn 0.5s ease-in-out",
                  "@keyframes fadeIn": {
                    "0%": {
                      opacity: 0,
                      transform: "translateY(-10px)",
                    },
                    "100%": {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                }}
              >
                <Typography style={{ fontSize: "inherit", color: "inherit" }}>
                  {news.description}
                </Typography>
                <Typography style={{ fontSize: "inherit", color: "inherit" }}>
                  Role: {news.role}
                </Typography>
                <Typography style={{ fontSize: "inherit", color: "inherit" }}>
                  Date: {news.date}
                </Typography>
                <Typography style={{ fontSize: "inherit", color: "inherit" }}>
                  Collaborators: {news.collaborators}
                </Typography>
                <Typography style={{ fontSize: "inherit", color: "inherit" }}>
                  Location: {news.location}
                </Typography>
                {news.awards && (
                  <Typography style={{ fontSize: "inherit", color: "inherit" }}>
                    Awards: {news.awards}
                  </Typography>
                )}
              </Box>
            )}
            <Button
              variant="outlined"
              onClick={() => handleDiscoverMoreClick(news.id)}
              sx={{
                color: "black",
                borderColor: "black",
                fontSize: "12px",
                padding: "5px 20px",
              }}
            >
              {selectedProjectId === news.id ? "Hide Details" : "Show Details"}
            </Button>
          </div>
        </Box>
      ))}
    </Box>
  );
}
