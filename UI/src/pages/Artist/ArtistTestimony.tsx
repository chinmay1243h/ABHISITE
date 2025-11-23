import { Box, Typography, CardMedia } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: { spacing: (arg0: number) => any }) => ({
  container: {
    // background: 'linear-gradient(135deg, #f3f4f6, #e0e7ff)',
    color: "white",
    borderRadius: "8px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: '0px 10px',
    alignItems: "center",
  },
  title: {
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
  },
}));

const ArtistTestimony = () => {
  const classes = useStyles();

  return (
    <Box
      sx={{
        mt: 8,
        display: "flex",
        // flexDirection:'column',
        flexDirection: { xs: "column", md: "row" },
        background: "white",
        height: { xs: 'fit-content', md: '400px' },
        gap: "10px",
        justifyContent: "space-around",
        alignItems: "center",
        boxShadow:
          "0 -4px 20px rgba(0, 0, 0, 0.1) inset,0 4px 20px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box
        sx={{
          height: { xs: '400px', md: '85%' },
          minWidth: "300px",
          width: 'fit-content',
          position: "relative",
          overflow: 'hidden',
          margin: '20px',
          borderRadius: "12px",
          boxShadow:
            "0 -4px 20px rgba(0, 0, 0, 0.1) inset,0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardMedia
          component="img"
          image="/assets/artist-4.png"
          //   alt={title}
          sx={{
            height: "100%",

            border: "solid 1.5px black",
            // m: 2,
            // mb: 1,
            position: "relative",
            width: "100%",
            objectFit: "cover",
            borderRadius: "12px",
            boxShadow:
              "0 -4px 20px rgba(0, 0, 0, 0.1) inset,0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "100%",
            // background: "black",
            background:
              "linear-gradient(to top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0))",
            // backdropFilter: "blur(2px)",
            left: 0,
          }}
        ></Box>
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "fit-content",
            height: "fit-content",
            background: "black",
            left: 0,
            p: 2,
            py: 0.5,
            borderRadius: '4px',
            color: 'white'
          }}
        >
          Actor
        </Box>
      </Box>

      <Box className={classes.container}>
        <Typography
          sx={{
            fontSize: "18px",
            color: "black",
            p: 2,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }}
        //   className={classes.title}
        >
          “I have always believed that if you want something very badly, you
          have to give it your best. Work hard, be sincere, be honest with
          yourself, and be true to your dreams. It doesn’t matter how many
          obstacles come your way. If you have the determination, the love for
          what you do, and the drive to never give up, the universe will
          conspire to make it happen for you."
        </Typography>

        <Typography
          sx={{
            color: "black",
            width: "100%",
            fontSize: "22px",
            fontFamily: "Rosttel",
            textAlign: "right",
          }}
        >
          -Shahrukh Khan
        </Typography>
      </Box>

      {/* <img style={{width:'300px'}} src='/assets/newsletter.png'>
    </img> */}
    </Box>
  );
};

export default ArtistTestimony;
