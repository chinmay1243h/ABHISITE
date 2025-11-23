import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React from "react";
import color from "../utils/Colors";

interface ShopCardProps {
  title: string;
  firstName: string;
  lastName: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  category: string;
  courseType: string;
  thumbnail: string;
}

const ShopCard: React.FC<ShopCardProps> = ({
  title,
  firstName,
  lastName,
  price,
  originalPrice,
  discount,
  courseType,
  thumbnail,
}) => {
  return (
    <Card
      sx={{
        // minWidth: 300,
        width: { md: 300, xs: 300 },
        borderRadius: 2,
        boxShadow: 3,
        border: "solid 2px",
        borderColor: "white",
        transition: "all 0.4s ease",
        overflow: "visible",
        "&:hover": {
          borderColor: color.textColor1,
          transform: "scale(1.01)",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.07)",
        },
        "&:hover .offer": {
          transform: "rotate(360deg)",
        },
      }}
    >
      <Box position="relative">
        <CardMedia
          style={{
            borderRadius: '6px',
            objectFit: "cover",
          }}
          component="img"
          height="200"
          image={thumbnail}
          alt={title}
        ></CardMedia>
        <Typography
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            mt: 0,
            pb: 1,
            pt: 0.2,
            px: 1,
            borderBottomLeftRadius: "6px",
            borderTopRightRadius: "6px",
            width: "fit-content",
            height: "20px",
            background: color.textColor1,
            zIndex: 101,
            fontSize: "12px",
            color: "white",
          }}
        >
          {courseType}
        </Typography>

        {discount&&

        <Typography
          className="offer"
          variant="body2"
          color="green"
          ml={1}
          sx={{
            position: "absolute",
            top: -10,
            left: -20,
            fontSize: "12px",
            padding: "2px",
            width: "50px",
            height: "50px",
            aspectRatio: "1 / 1",
            borderRadius: "50%",
            background: color.textColor1,
            color: "white",
            textAlign: "center",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            boxShadow: "-5px -5px 10px rgba(0, 0, 0, 0.33) inset",
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {discount}% <br /> OFF
        </Typography>}

        {/* <IconButton
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "white",
            borderRadius: "50%",
          }}
        >
          <FavoriteBorderIcon />
        </IconButton> */}
      </Box>

      <CardContent style={{ paddingBottom: "16px" }}>
        <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
          {title}
        </Typography>

        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Avatar sx={{ height: "24px", width: "24px" }}></Avatar>
          <Typography variant="body2" color="text.secondary">
            {firstName} {lastName}
          </Typography>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "4px",
          }}
        >
          <Box
            display="flex"
            flexDirection={"column"}
            alignItems="center"
            mt={1}
          >
            <Typography variant="h6" fontWeight="bold" sx={{ color: "green" }}>
              ₹ {price}
            </Typography>
            {/* <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: "line-through", ml: 1 }}
            >
              ₹ 2700.00{originalPrice}
            </Typography> */}
          </Box>

          <Box mt={1} display={"flex"}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{
                whiteSpace: 'nowrap',
                background: color.textColor1,
                fontSize: "14px",
                textTransform: "none",
                margin: 0,
                marginRight: "auto",
                border: "solid 1px white",
              }}
              sx={{
                padding: "2px 10px",
                transition: "all 0.4s ease",

                "&:hover": {
                  paddingRight: "20px",
                },
              }}
            >
              Add to Cart
              <FontAwesomeIcon
                icon={faCartShopping}
                style={{ marginLeft: "6px" }}
              ></FontAwesomeIcon>
            </Button>
          </Box>
        </div>

        {/* <Box mt={1}>
          <Typography variant="body2" color="text.secondary">
            ⭐ {rating ? rating : 5}
          </Typography>
        </Box> */}
      </CardContent>
    </Card>
  );
};

export default ShopCard;
