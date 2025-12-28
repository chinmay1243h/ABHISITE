import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Layout from "./components/shared/Layout";
import { Home } from "./pages/Home";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import { NewsBlogs } from "./pages/News/NewsBlogs";
import { Artists } from "./pages/Artist/Artists";
import LoginPage from "./pages/Account/Login";
import SignupPage from "./pages/Account/Signup";
import ForgotPassword from "./pages/Account/ForgotPassword";
import ResetPassword from "./pages/Account/ResetPassword";
import Account from "./pages/Account/Account";
import { Portfolio } from "./pages/Portfolio/Portfolio";
import JobDetailsPage from "./pages/Career/JobDetailsPage";
import { Career } from "./pages/Career/Career";
import JobApplicationForm from "./pages/Career/JobApplicationForm";
import NewsDetails from "./pages/News/NewsDetails";
import { ShopLandingPage } from "./pages/Shop/ShopLandingPage";
import ProductDetails from "./pages/Shop/ProductDetails";
import PortfolioFormTabs from "./pages/Portfolio/PortfolioForm/PortfolioFormTabs";
import VerifyOtp from "./pages/Account/VerifyOtp";
import { ToastContainer } from 'react-toastify';
import JobPostingForm from "./pages/Career/JobPostingForm";
import CourseUploadForm from "./pages/Shop/ProductUploadForm";
import UploadCourse from "./pages/Shop/UploadCourse";
import CartPage from "./pages/Shop/CartPage";

import AristMyCourse from "./pages/Shop/AristMyCourse";
import Player from "./pages/Shop/Player";
import CourseDetails from "./pages/Shop/CourseDetails";
import CategoryPage from "./components/utils/CategoryPage";
import MyCourses from "./pages/Shop/MyCourses";
import { Portfolio1 } from "./pages/Portfolio/Portfolio1";
import MoviePage from "./pages/Movies/MoviePage";
import MovieDetailsPage from "./pages/Movies/MovieDetailsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicy";
import TermsAndConditionsPage from "./pages/TermsAndConditions";
import SimpleCourseManager from "./pages/Admin/SimpleCourseManager";
import MyOrderPage from "./pages/Account/MyOrderPage";
import AddNewsandBlogsPage from "./pages/Admin/AddNewsandBlogs/AddNewsandBlogsPage";
import EditNewsAndBlogs from "./pages/Admin/AddNewsandBlogs/EditNewsandBlogs";
import AddMovie from "./pages/Admin/AddMovie";
import PrivateRoute from "./components/shared/PrivateRoute";
import AppliedJobs from "./pages/Career/AppliedJobs";
import EditMovie from "./pages/Admin/EditMovies";
import EditCourseForm from "./pages/Shop/EditCourse";
import RefundPolicy from "./RefundPolicy";
// import ShippingPolicy from './pages/ShippingPolicy'
import ContactUs from './ContactUs'
// import TelegramCourseUpload from "./pages/TelegramCourseUpload";
import CourseAccess from "./pages/Shop/CourseAccess";





function App() {
  const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [pathname]);

    return null;
  };
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route
            path="*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                </Routes>
                <Routes>
                  <Route path="/news&blogs" element={<NewsBlogs />} />
                  <Route path="/news-details/:id" element={<NewsDetails />} />
                  <Route path="/artists" element={< Artists />} />
                  <Route path="/career" element={<Career />} />

                  <Route path="/job-details/:id" element={<PrivateRoute component={JobDetailsPage} />} />
                  <Route path="/job-application-form" element={<PrivateRoute component={JobApplicationForm} />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  {/*                   <Route path='/shipping-policy' element={<ShippingPolicy />} /> */}
                  <Route path='/contact' element={<ContactUs />} />
                  <Route path='/cancellation-policy' element={<RefundPolicy />} />
                  <Route path="/account" element={<PrivateRoute component={Account} />} />
                  <Route path="/course-upload" element={<PrivateRoute component={CourseUploadForm} />} />
                  <Route path="/upload" element={<PrivateRoute component={UploadCourse} />} />
                  <Route path="/upload-course" element={<PrivateRoute component={UploadCourse} />} />
                  {/* <Route path="/telegram-upload" element={<PrivateRoute component={TelegramCourseUpload} />} /> */}
                  <Route path="/course-access" element={<CourseAccess />} />

                  <Route path="/portfolio/:id" element={<PrivateRoute component={Portfolio} />} />
                  <Route path="/portfolio-form" element={<PortfolioFormTabs />} />
                  <Route path="/mycorse" element={<PrivateRoute component={AristMyCourse} />} />

                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<PrivateRoute component={ResetPassword} />} />
                  <Route path="/shop" element={<ShopLandingPage />} />
                  <Route path="/productDetails/:id" element={<PrivateRoute component={ProductDetails} />} />
                  <Route path="/cart" element={<PrivateRoute component={CartPage} />} />
                  <Route path="/verify-otp" element={<VerifyOtp />} />
                  <Route path="/job-post" element={<JobPostingForm />} />
                  <Route path="/applied-jobs" element={<AppliedJobs />} />
                  <Route path="/player/:id" element={<PrivateRoute component={Player} />} />
                  <Route path="/artist-courses" element={<PrivateRoute component={AristMyCourse} />} />
                  <Route path="/admin/artist-courses" element={<PrivateRoute component={AristMyCourse} />} />
                  <Route path="/my-order" element={<PrivateRoute component={MyOrderPage} />} />
                  <Route path="/edit-course/:id" element={<PrivateRoute component={EditCourseForm} />} />

                  <Route path="/my-courses" element={<PrivateRoute component={MyCourses} />} />
                  <Route path="/courseDetails" element={<PrivateRoute component={CourseDetails} />} />
                  <Route path="/categories" element={<CategoryPage />} />

                  <Route path='/portfolio1/:id' element={<PrivateRoute component={Portfolio1} />} />
                  <Route path='/movies' element={<MoviePage />} />
                  <Route path='/edit-movie/:id' element={<EditMovie />} />
                  <Route path='/movies/details/:id' element={<PrivateRoute component={MovieDetailsPage} />} />

                  <Route path='/privacy-policy' element={<PrivacyPolicyPage />} />
                  <Route path='/terms-conditions' element={<TermsAndConditionsPage />} />

                  {/*Admin pages  */}
                  <Route path="/admin-dashboard" element={<PrivateRoute component={SimpleCourseManager} requiredRole="Admin" />} />
                  <Route path="/addnewsandblogs" element={<AddNewsandBlogsPage />} />
                  <Route path="/edit-news-and-blogs/:id" element={<EditNewsAndBlogs />} />
                  <Route path="/add-movie" element={<AddMovie />} />
                  <Route path="/artist-categories" element={<CategoryPage />} />


                </Routes>
              </Layout>
            }
          />
        </Routes>
        <ToastContainer />
      </Router>
    </ThemeProvider>
  );
}

export default App;
