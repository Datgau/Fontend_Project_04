import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  InputBase,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from "@mui/material";
import {
  Search,
  Home,
  Person,
  Settings,
  Logout,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../routes/AuthContext";
import { mockCurrentUser } from "../../data/mockData";
import NotificationDropdown from "../Notifications/NotificationDropdown";
import MessageDropdown from "../Messages/MessageDropdown";

const SearchBox = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "30ch",
    },
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleSettings = () => {
    navigate("/settings");
    handleMenuClose();
  };

  const handleLogout = () => {
    // TODO: Call logout API
    // await fetch('/api/auth/logout', { method: 'POST' });
    logout();
    handleMenuClose();
    navigate("/login");
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={1}
      sx={{
        backgroundColor: "white",
        color: "text.primary",
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
        {/* Logo */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          onClick={() => navigate("/heartbeat/home")}
          sx={{
            display: { xs: "none", sm: "block" },
            fontWeight: 700,
            background: "linear-gradient(45deg, #e91e63 30%, #f50057 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "0.1em",
            cursor: "pointer",
            "&:hover": {
              opacity: 0.8,
            },
          }}
        >
          HeartBeat
        </Typography>

        {/* Search Bar */}
        <SearchBox>
          <SearchIconWrapper>
            <Search />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Tìm kiếm..."
            inputProps={{ "aria-label": "search" }}
          />
        </SearchBox>

        <Box sx={{ flexGrow: 1 }} />

        {/* Icons */}
        <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 }, alignItems: "center" }}>
          <IconButton 
            color="inherit"
            onClick={() => navigate("/heartbeat/home")}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            <Home />
          </IconButton>
          
          {/* Notification Dropdown */}
          <NotificationDropdown />
          
          {/* Message Dropdown */}
          <MessageDropdown />

          {/* User Avatar with Menu */}
          <IconButton 
            onClick={handleMenuOpen}
            sx={{ p: 0, ml: { xs: 0.5, sm: 1 } }}
          >
            <Avatar
              alt={mockCurrentUser.fullName}
              src={mockCurrentUser.avatar}
              sx={{ width: { xs: 28, sm: 32 }, height: { xs: 28, sm: 32 } }}
            />
          </IconButton>
        </Box>
      </Toolbar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            width: 240,
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {/* User Info */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {mockCurrentUser.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            @{mockCurrentUser.username}
          </Typography>
        </Box>

        <Divider />

        {/* Menu Items */}
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Trang cá nhân
        </MenuItem>

        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Cài đặt
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Đăng xuất</Typography>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Header;
