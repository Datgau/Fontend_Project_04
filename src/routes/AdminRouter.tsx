import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const AdminRoute = () => {
    const { isLoggedIn, user, loading } = useAuth();
    const [showDialog, setShowDialog] = useState(false);
    const [redirect, setRedirect] = useState(false);

    const allowedRoles = ["ADMIN", "EMPLOYEE"];

    useEffect(() => {
        if (!loading && (!isLoggedIn || !user)) {
            setShowDialog(true);
        }
    }, [isLoggedIn, user, loading]);

    const handleLogin = () => {
        setShowDialog(false);
        setRedirect(true);
    };

    const handleCancel = () => {
        setShowDialog(false); // hoặc giữ dialog mở tuỳ ý
    };

    if (loading) return <div>Loading...</div>;
    if (redirect) return <Navigate to="/login" replace />;

    if (isLoggedIn && user) {
        if (allowedRoles.includes(user.role?.toUpperCase?.() ?? "")) {
            return <Outlet />;
        }
        return <Navigate to="/home" replace />;
    }

    return (
        <>
            <div>Checking access rights...</div>
            <Dialog open={showDialog} onClose={handleCancel} disableEscapeKeyDown>
                <DialogTitle>Login Required</DialogTitle>
                <DialogContent>
                    <Typography>
                        You need to log in with Admin or Employee privileges to access this page!
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleLogin} color="primary" variant="contained">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AdminRoute;
