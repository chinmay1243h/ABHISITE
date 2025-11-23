import { Box, Typography } from "@mui/material";
import TestimonyCarousel from "./TestimonyCarousel";

interface PortfolioProps {
  portfolioAchivement?: {
    portfolioAchivements?: {
      achievements?: any[];
      testimonies?: any[];
    }[];
  }[];
}

const Achievements = ({ portfolioAchivement }: PortfolioProps) => {
  // Safely extract testimonies with null checks
  const testimonies = portfolioAchivement
    ?.flatMap((achivementGroup) =>
      achivementGroup?.portfolioAchivements?.flatMap((item) =>
        item?.testimonies ?? []
      ) ?? []
    )
    .filter(Boolean) ?? [];

  // Safely extract achievements with null checks
  const achievements = portfolioAchivement
    ?.flatMap((achivementGroup) =>
      achivementGroup?.portfolioAchivements?.flatMap((item) =>
        item?.achievements ?? []
      ) ?? []
    )
    .filter(Boolean) ?? [];

  // If there's no data at all, you might want to return null or a message
  if (testimonies.length === 0 && achievements.length === 0) {
    return null; // or return a "No data available" message
  }

  return (
    <Box>
      {achievements.length > 0 && (
        <>
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              mb: 2,
            }}
          >
            Award & Honors
          </Typography>
          <Typography
            component="ul"
            sx={{
              fontFamily: "custom-regular",
              fontSize: "14px",
              textAlign: "center",
              marginTop: "5px",
              lineHeight: 1.8,
              listStyleType: "none",
              paddingLeft: 0,
            }}
          >
            {achievements.map((award, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{ marginRight: "8px", fontSize: "1.2em" }}>.</span>
                {award}
              </li>
            ))}
          </Typography>
        </>
      )}

      {testimonies.length > 0 && (
        <Box>
          <TestimonyCarousel title="Testimonies" testimonials={testimonies} />
        </Box>
      )}
    </Box>
  );
};

export default Achievements;