import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
} from "@mui/material";
import dayjs from "dayjs";
import { getUserId } from "../../services/axiosClient";
import { getAllCourse, getAllPaymentDetailsForUser } from "../../services/services";
import { useNavigate } from "react-router-dom";

const MyOrderPage: React.FC = () => {
    const navigate = useNavigate();

    const [combinedData, setCombinedData] = useState<any>([]);

    useEffect(() => {
        const payLoad = {
            data: { filter: "" },
            page: 0,
            pageSize: 50,
            order: [["createdAt", "ASC"]],
        };

        Promise.all([
            getAllCourse(payLoad),
            getAllPaymentDetailsForUser(payLoad),
        ])
            .then(([courseRes, paymentRes]) => {
                const courses = courseRes?.data?.data?.rows || [];
                const payments = paymentRes?.data?.data?.rows || [];

                const filteredData = courses.map((course: any) => {
                    const matchingPayment = payments.find(
                        (payment: any) =>
                            payment.courseId === course.id &&
                            payment.userId === getUserId() &&
                            payment.status === "success"
                    );

                    if (matchingPayment) {
                        return {
                            ...course,
                            updatedAt: dayjs(matchingPayment.updatedAt).format("MMM D, YYYY"),
                        };
                    }

                    return null;
                }).filter(Boolean);

                setCombinedData(filteredData);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                backgroundColor: "#f5f5f5",
                padding: 2,
            }}
        >
            <Card
                sx={{
                    width: 400,
                    padding: 2,
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    backgroundColor: "#fff",
                }}
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        sx={{ marginBottom: 2, fontWeight: "bold", textAlign: "center" }}
                    >
                        My Order
                    </Typography>

                    {/* Order Items */}
                    <List>
                        {combinedData.map((item: any, index: number) => (
                            <React.Fragment key={index}>
                                <ListItem

                                    component="li"
                                    onClick={() =>
                                        //  navigate(`/player/${item.id}`)
                                        navigate('/mycorse')
                                    }
                                    sx={{
                                        "&:hover": {
                                            backgroundColor: "#f0f0f0",
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={item.title}
                                        secondary={`Price: ${item.price} RS`}
                                    />
                                </ListItem>
                                {index < combinedData.length - 1 && <Divider />}
                            </React.Fragment>
                        ))}
                    </List>



                </CardContent>


            </Card>
        </Box>
    );
};

export default MyOrderPage;
