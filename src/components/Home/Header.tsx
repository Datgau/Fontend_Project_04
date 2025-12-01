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
  Chip,
} from "@mui/material";
import {
  Search,
  Home,
  Person,
  Settings,
  Logout,
  FavoriteBorder,
} from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../routes/AuthContext";
import NotificationDropdown from "../Notifications/NotificationDropdown";
import MessageDropdown from "../Messages/MessageDropdown";

const SearchBox = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "24px",
  backgroundColor: "#f5f5f5",
  border: "2px solid transparent",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#eeeeee",
    borderColor: alpha("#e91e63", 0.2),
  },
  "&:focus-within": {
    backgroundColor: "white",
    borderColor: "#e91e63",
    boxShadow: `0 0 0 4px ${alpha("#e91e63", 0.1)}`,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
    minWidth: "300px",
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
  color: "#757575",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.25, 1, 1.25, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    fontSize: "0.95rem",
    "&::placeholder": {
      color: "#9e9e9e",
      opacity: 1,
    },
    [theme.breakpoints.up("md")]: {
      width: "30ch",
    },
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: "relative",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: alpha("#e91e63", 0.08),
    transform: "translateY(-2px)",
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -2,
    left: "50%",
    transform: "translateX(-50%) scaleX(0)",
    width: "70%",
    height: "2px",
    backgroundColor: "#e91e63",
    transition: "transform 0.3s ease",
  },
  "&:hover::after": {
    transform: "translateX(-50%) scaleX(1)",
  },
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  transition: "all 0.3s ease",
  border: "2px solid transparent",
  cursor: "pointer",
  "&:hover": {
    borderColor: "#e91e63",
    transform: "scale(1.1)",
    boxShadow: `0 0 0 4px ${alpha("#e91e63", 0.1)}`,
  },
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  borderRadius: "8px",
  margin: "4px 8px",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: alpha("#e91e63", 0.08),
    transform: "translateX(4px)",
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Fallback values nếu user chưa có thông tin
  const displayName = user?.fullName || user?.username || "User";
  const displayAvatar = user?.avatar || "/heartbeat.svg";

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
          elevation={0}
          sx={{
            backgroundColor: "white",
            color: "text.primary",
            borderBottom: "1px solid #f0f0f0",
            backdropFilter: "blur(10px)",
          }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 }, py: 1 }}>
          {/* Logo */}
          <Box
              onClick={() => navigate("/heartbeat/home")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
          >
            <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #e91e63 0%, #f50057 100%)",
                  boxShadow: `0 4px 12px ${alpha("#e91e63", 0.3)}`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: `0 6px 20px ${alpha("#e91e63", 0.4)}`,
                  },
                }}
            >
              <FavoriteBorder sx={{ color: "white", fontSize: 24 }} />
            </Box>
            <Typography
                variant="h6"
                noWrap
                sx={{
                  display: { xs: "none", sm: "block" },
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #e91e63 0%, #f50057 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.05em",
                  fontSize: "1.3rem",
                }}
            >
              HeartBeat
            </Typography>
          </Box>

          {/* Search Bar */}
          <SearchBox>
            <SearchIconWrapper>
              <Search />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Tìm kiếm trên HeartBeat..."
                inputProps={{ "aria-label": "search" }}
            />
          </SearchBox>

          <Box sx={{ flexGrow: 1 }} />

          {/* Icons */}
          <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 }, alignItems: "center" }}>
            <StyledIconButton
                color="inherit"
                onClick={() => navigate("/heartbeat/home")}
                sx={{ display: { xs: "none", sm: "inline-flex" } }}
            >
              <Home />
            </StyledIconButton>

            {/* Notification Dropdown */}
            <NotificationDropdown />

            {/* Message Dropdown */}
            <MessageDropdown />

            {/* User Avatar with Menu */}
            <Box sx={{ position: "relative", ml: { xs: 0.5, sm: 1 } }}>
              <StyledAvatar
                  alt={displayName}
                  src={displayAvatar}
                  sx={{ width: { xs: 32, sm: 36 }, height: { xs: 32, sm: 36 } }}
                  onClick={handleMenuOpen}
              />
              <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#4caf50",
                    border: "2px solid white",
                    boxShadow: "0 0 0 1px #4caf50",
                  }}
              />
            </Box>
          </Box>
        </Toolbar>

        {/* User Menu */}
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                width: 260,
                mt: 1.5,
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                border: "1px solid #f0f0f0",
                overflow: "visible",
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 20,
                  width: 12,
                  height: 12,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                  borderLeft: "1px solid #f0f0f0",
                  borderTop: "1px solid #f0f0f0",
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {/* User Info */}
          <Box
              sx={{
                px: 2.5,
                py: 2,
                background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)",
                borderRadius: "12px 12px 0 0",
                mb: 1,
              }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
              <Avatar
                  alt={displayName}
                  src={displayAvatar}
                  sx={{
                    width: 48,
                    height: 48,
                    border: "3px solid white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                  {displayName}
                </Typography>
                <Chip
                    label={`@${user?.username || "user"}`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      backgroundColor: "white",
                      color: "#e91e63",
                      fontWeight: 600,
                      mt: 0.5,
                    }}
                />
              </Box>
            </Box>
          </Box>

          {/* Menu Items */}
          <Box sx={{ py: 0.5 }}>
            <StyledMenuItem onClick={handleProfile}>
              <ListItemIcon>
                <Person fontSize="small" sx={{ color: "#e91e63" }} />
              </ListItemIcon>
              <Typography fontWeight={500}>Trang cá nhân</Typography>
            </StyledMenuItem>

            <StyledMenuItem onClick={handleSettings}>
              <ListItemIcon>
                <Settings fontSize="small" sx={{ color: "#e91e63" }} />
              </ListItemIcon>
              <Typography fontWeight={500}>Cài đặt</Typography>
            </StyledMenuItem>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ py: 0.5 }}>
            <StyledMenuItem
                onClick={handleLogout}
                sx={{
                  "&:hover": {
                    backgroundColor: alpha("#f44336", 0.08),
                  },
                }}
            >
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <Typography color="error" fontWeight={600}>Đăng xuất</Typography>
            </StyledMenuItem>
          </Box>
        </Menu>
      </AppBar>
  );
};

export default Header;