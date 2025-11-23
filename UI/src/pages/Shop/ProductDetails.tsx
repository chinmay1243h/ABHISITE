import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Container,
  Grid,
  Rating,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOneCourse } from "../../services/services";
import color from "../../components/utils/Colors";

const ProductDetails = () => {
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>([]);
  const { id } = useParams();

  useEffect(() => {
    getOneCourse(id)
      .then((res) => {
        setProduct(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleAddToCart = (course: any) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(course);
    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        // my: 4,
        padding: "2rem",
        background: "linear-gradient(to bottom, #ffffff, #f0f0f0)",
        // borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              boxShadow: "none",
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <CardMedia
              component="img"
              image={product.thumbnail}
              alt={product.title}
              sx={{ height: 400, objectFit: "contain", borderRadius: "10px" }}
            />
          </Card>
        </Grid>

        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography variant="h3" gutterBottom>
              {product.title}
            </Typography>

            <Typography variant="subtitle1" color="textSecondary">
              Author: {product.firstName} {product.lastName}
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <Typography variant="h5" color="error">
                ₹{product.price}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  textDecoration: "line-through",
                  color: "gray",
                  fontSize: "1rem",
                }}
              >
                ₹5000.00 {/* Example Original Price */}
              </Typography>
            </Box>

            {/* <Rating value={4} readOnly sx={{ mb: 2 }} /> */}

            <Typography
              variant="body1"
              paragraph
              sx={{
                color: "#555",
                lineHeight: "1.8",
              }}
            >
              Description:
            </Typography>

            <Typography
              variant="body1"
              paragraph
              sx={{
                color: "#555",
                lineHeight: "1.8",
                marginTop: -4,
              }}
            >
              {product.description}
            </Typography>

            <Typography variant="body2" color="textSecondary">
              Product Type: {product.courseType}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Uploaded on: {new Date(product.createdAt).toLocaleDateString()}
            </Typography>

            <Box mt={1} display={"flex"}>
              <Button
                fullWidth
                onClick={() => handleAddToCart(product)}
                variant="contained"
                color="primary"
                size="small"
                style={{
                  background: color.textColor1,
                  fontSize: "18px",
                  textTransform: "none",
                  marginTop: '8px',
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
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetails;
