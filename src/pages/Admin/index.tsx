import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  LinearProgress,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Article as ArticleIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import { useAuth } from "../../routes/AuthContext";
import Header from "../../components/Home/Header";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock data
const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "USER",
    status: "active",
    posts: 45,
    joined: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "USER",
    status: "active",
    posts: 32,
    joined: "2024-01-20",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "ADMIN",
    status: "active",
    posts: 78,
    joined: "2024-01-10",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice@example.com",
    role: "USER",
    status: "blocked",
    posts: 12,
    joined: "2024-02-01",
  },
];

const mockPosts = [
  {
    id: 1,
    title: "Amazing sunset at the beach",
    author: "John Doe",
    likes: 234,
    comments: 45,
    status: "published",
    date: "2024-01-20",
  },
  {
    id: 2,
    title: "My new photography setup",
    author: "Jane Smith",
    likes: 189,
    comments: 32,
    status: "published",
    date: "2024-01-21",
  },
  {
    id: 3,
    title: "Travel tips for Vietnam",
    author: "Bob Johnson",
    likes: 456,
    comments: 78,
    status: "pending",
    date: "2024-01-22",
  },
];

const Admin = () => {
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteUser = () => {
    setOpenDialog(true);
    handleMenuClose();
  };

  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: "#1976d2",
    },
    {
      title: "Total Posts",
      value: "5,678",
      change: "+8%",
      icon: <ArticleIcon sx={{ fontSize: 40 }} />,
      color: "#2e7d32",
    },
    {
      title: "Active Users",
      value: "890",
      change: "+5%",
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: "#ed6c02",
    },
    {
      title: "Reports",
      value: "23",
      change: "-3%",
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      color: "#d32f2f",
    },
  ];

  return (
    <Box sx={{ bgcolor: "#f0f2f5", minHeight: "100vh" }}>
      <Header />

      <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user?.fullName || user?.username}!
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 3,
            mb: 3,
          }}
        >
          {stats.map((stat, index) => (
            <Card
              key={index}
              elevation={2}
              sx={{
                borderRadius: 2,
                transition: "transform 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box
                    sx={{
                      bgcolor: `${stat.color}20`,
                      color: stat.color,
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    color={stat.change.startsWith("+") ? "success" : "error"}
                  />
                </Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Main Content */}
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              px: 2,
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
              },
            }}
          >
            <Tab icon={<DashboardIcon />} iconPosition="start" label="Overview" />
            <Tab icon={<PeopleIcon />} iconPosition="start" label="Users" />
            <Tab icon={<ArticleIcon />} iconPosition="start" label="Posts" />
            <Tab icon={<SettingsIcon />} iconPosition="start" label="Settings" />
          </Tabs>

          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ px: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Recent Activity
              </Typography>
              
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                  gap: 3,
                  mt: 2,
                }}
              >
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      User Growth
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2">This Month</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          75%
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={75} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2">Last Month</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          60%
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={60} sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Content Engagement
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2">Posts</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          85%
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={85} color="success" sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2">Comments</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          70%
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={70} color="success" sx={{ height: 8, borderRadius: 4 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </TabPanel>

          {/* Users Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ px: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <TextField
                  placeholder="Search users..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: { xs: "100%", sm: 300 } }}
                />
                <Button variant="contained" startIcon={<AddIcon />}>
                  Add User
                </Button>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Posts</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockUsers.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar src={`https://ui-avatars.com/api/?name=${user.name}`} />
                            <Typography variant="body2" fontWeight="medium">
                              {user.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            size="small"
                            color={user.role === "ADMIN" ? "primary" : "default"}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.status}
                            size="small"
                            color={user.status === "active" ? "success" : "error"}
                            icon={user.status === "active" ? <CheckCircleIcon /> : <BlockIcon />}
                          />
                        </TableCell>
                        <TableCell>{user.posts}</TableCell>
                        <TableCell>{user.joined}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </TabPanel>

          {/* Posts Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ px: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <TextField
                  placeholder="Search posts..."
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: { xs: "100%", sm: 300 } }}
                />
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>Likes</TableCell>
                      <TableCell>Comments</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockPosts.map((post) => (
                      <TableRow key={post.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {post.title}
                          </Typography>
                        </TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>{post.likes}</TableCell>
                        <TableCell>{post.comments}</TableCell>
                        <TableCell>
                          <Chip
                            label={post.status}
                            size="small"
                            color={post.status === "published" ? "success" : "warning"}
                          />
                        </TableCell>
                        <TableCell>{post.date}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </TabPanel>

          {/* Settings Tab */}
          <TabPanel value={tabValue} index={3}>
            <Box sx={{ px: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                System Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Configure system-wide settings and preferences
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                  gap: 3,
                  mt: 2,
                }}
              >
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      General Settings
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <TextField fullWidth label="Site Name" defaultValue="HeartBeat" margin="normal" />
                      <TextField fullWidth label="Site Description" multiline rows={3} margin="normal" />
                      <Button variant="contained" sx={{ mt: 2 }}>
                        Save Changes
                      </Button>
                    </Box>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Email Settings
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <TextField fullWidth label="SMTP Host" margin="normal" />
                      <TextField fullWidth label="SMTP Port" margin="normal" />
                      <TextField fullWidth label="SMTP Username" margin="normal" />
                      <Button variant="contained" sx={{ mt: 2 }}>
                        Save Changes
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </TabPanel>
        </Paper>
      </Container>

      {/* User Actions Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <BlockIcon fontSize="small" sx={{ mr: 1 }} />
          Block
        </MenuItem>
        <MenuItem onClick={handleDeleteUser}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{selectedUser?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={() => setOpenDialog(false)} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Admin;
