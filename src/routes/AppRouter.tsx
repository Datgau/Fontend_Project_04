import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {AuthProvider} from "./AuthContext.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import AdminRoute from "./AdminRouter.tsx";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Register from "../pages/Register";
import VerifyOtp from "../pages/VerifyOtp";
import Home from "../pages/Home";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsOfService from "../pages/TermsOfService";
import DataDeletion from "../pages/DataDeletion";
// import Contact from "../pages/Contact";
// import About from "../pages/About";
// import Checkout from "../pages/Checkout";
// import Shop from "../pages/Shop";
// import Cart from "../pages/Cart";
// import NotFound from "../pages/NotFound";
// import Blog from "../pages/Blog";
// import AuthLayout from "../layouts/AuthLayout";
// import MainLayout from "../layouts/MainLayout";
// import AdminLayout from "../layouts/AdminLayout";
// import WishlistPage from "../pages/Wishlist";
// import Users from "../pages/admin/Users";
// import Dashboard from "../pages/admin/Dashboard";
// import Products from "../pages/admin/Products";
// import Stocks from "../pages/admin/Stocks";
// import Orders from "../pages/admin/Orders";
// import Coupons from "../pages/admin/Coupons";
// import BlogAdmin from "../pages/admin/Blog";
// import BlogDetail from "../pages/Blog/BlogDetail";
// import Profile from "../pages/Profile";
// import { AuthProvider } from "./AuthContext";
// import EditProfile from "../pages/Profile/EditProfile";
// import ForgotPassword from "../pages/Auth/ForgotPassword";
// import ResetPassword from "../pages/Auth/ResetPassword";
// import FAQPage from "../pages/Faq";
// import FaqAdmin from "../pages/admin/FaqAdmin";
// import MyOrders from "../pages/MyOrders";
// import ProductAttributes from "../pages/admin/ProductAttributes";
// import ProductDetail from "../pages/ProductDetail";
// import ProtectedRoute from "./ProtectedRoute";
// import AdminRoute from "./AdminRouter";
// import GlobalLoginModal from "./GlobalLoginModal";
// import AdminReviews from "../pages/admin/Reviews";
// import ContactManager from "../pages/admin/ContactManager";

export const AppRouter = () => (
    <>
    {/*<GlobalLoginModal />*/}
    <AuthProvider>
        <Routes>
            {/* Public Auth Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/data-deletion" element={<DataDeletion />} />
            <Route path="/heartbeat/home" element={<Home/>} />
            {/* Public Routes */}
            {/*<Route element={<MainLayout />}>*/}
            {/*    <Route path="/" element={<Home />} />*/}
            {/*    <Route path="/home" element={<Home />} />*/}
            {/*    <Route path="/shop" element={<Shop />} />*/}
            {/*    <Route path="/about" element={<About />} />*/}
            {/*    <Route path="/contact" element={<Contact />} />*/}
            {/*    <Route path="/blog" element={<Blog />} />*/}
            {/*    <Route path="/blog/:id" element={<BlogDetail />} />*/}
            {/*    <Route path="/detail-product/:id" element={<ProductDetail />} />*/}
            {/*    <Route path="/cart" element={<Cart />} />*/}
            {/*    <Route path="/wishlist" element={<WishlistPage />} />*/}
            {/*    <Route path="/faqs" element={<FAQPage />} />*/}
            {/*    <Route path="/myorders" element={<MyOrders />} />*/}
            {/*    <Route path="/checkout" element={<Checkout />} />*/}
            {/*</Route>*/}

            {/* Protected Routes - cần đăng nhập */}
            <Route element={<ProtectedRoute />}>
                {/*<Route element={<MainLayout />}>*/}

                {/*    <Route path="/profile" element={<Profile />} />*/}
                {/*    <Route path="/profile/edit" element={<EditProfile />} />*/}
                {/*</Route>*/}
            </Route>
            <Route element={<AdminRoute />}>
                {/*<Route path="/admin" element={<AdminLayout />}>*/}
                {/*    <Route index element={<Dashboard />} />*/}
                {/*    <Route path="dashboard" element={<Dashboard />} />*/}
                {/*    <Route path="users" element={<Users />} />*/}
                {/*    <Route path="products" element={<Products />} />*/}
                {/*    <Route path="productAttributes" element={<ProductAttributes/>}/>*/}
                {/*    <Route path="stocks" element={<Stocks />} />*/}
                {/*    <Route path="faqs" element={<FaqAdmin />} />*/}
                {/*    <Route path="orders" element={<Orders />} />*/}
                {/*    <Route path="coupons" element={<Coupons />} />*/}
                {/*    <Route path="blog" element={<BlogAdmin />} />*/}
                {/*    <Route path="reviews" element={<AdminReviews />} />*/}
                {/*    <Route path= "contact" element={<ContactManager />} />*/}
                {/*</Route>*/}
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
    </AuthProvider>
</>
);