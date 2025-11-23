import color from "./Colors";

export const inputSx = {
    padding: "0px",
    marginTop: "0px",
    color:'white',
    width: "100%",
    boxSizing: "border-box",
    "& .MuiOutlinedInput-root": {
      padding: "0px",
      borderBottom: "4px solid",
      borderColor:color.textColor1,
      "& fieldset": {
        border: "none",
      },
      "&:hover fieldset": {
        border: "none",
      },
      "&.Mui-focused fieldset": {
        border: "none",
      },
    },
  };


  export const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    desktop: {
      breakpoint: { max: 1024, min: 768 },
      items: 2,
    },
    tablet: {
      breakpoint: { max: 768, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };