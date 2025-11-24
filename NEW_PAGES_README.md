# New Pages Documentation

## Pages Created

### 1. Profile Page (`/profile`)
- **Access**: All authenticated users
- **Features**:
  - Cover photo and profile picture with upload buttons
  - User stats (Posts, Followers, Following)
  - Edit profile button
  - Bio and user information display
  - Three tabs:
    - **Posts**: Grid view of user's posts with hover effects showing likes/comments
    - **About**: User information (email, username, role, member since)
    - **Photos**: Grid gallery of user's photos with interaction buttons
  - Fully responsive design (mobile, tablet, desktop)

### 2. Settings Page (`/settings`)
- **Access**: All authenticated users
- **Features**:
  - Sidebar navigation with 8 sections:
    - **Profile**: Edit personal information, avatar upload, bio
    - **Password**: Change password with current/new/confirm fields
    - **Notifications**: Toggle email, push, message, like, and comment notifications
    - **Appearance**: Dark mode and compact mode toggles
    - **Language**: Select preferred language (English, Vietnamese, Japanese)
    - **Privacy & Security**: Private account, 2FA, activity status settings
    - **Help & Support**: Help center, contact support, report problems
    - **About**: App version and build information
  - Responsive sidebar (collapses on mobile)
  - Form validation and success notifications

### 3. Admin Dashboard (`/admin`)
- **Access**: Only users with ADMIN or EMPLOYEE role
- **Features**:
  - **Overview Tab**:
    - 4 stat cards (Total Users, Total Posts, Active Users, Reports)
    - User growth chart
    - Content engagement metrics
  - **Users Tab**:
    - Search functionality
    - User table with avatar, email, role, status, posts count
    - Actions menu (Edit, Block, Delete)
    - Add user button
  - **Posts Tab**:
    - Search functionality
    - Posts table with title, author, likes, comments, status
    - Edit and delete actions
  - **Settings Tab**:
    - General settings (site name, description)
    - Email settings (SMTP configuration)
  - Fully responsive with mobile-optimized tables
  - Role-based access control

## Routes Configuration

```typescript
// Protected routes (all authenticated users)
<Route element={<ProtectedRoute />}>
  <Route path="/profile" element={<Profile />} />
  <Route path="/settings" element={<Settings />} />
</Route>

// Admin routes (ADMIN or EMPLOYEE only)
<Route element={<AdminRoute />}>
  <Route path="/admin" element={<Admin />} />
</Route>
```

## Navigation

- Profile and Settings are accessible from the user menu in the Header component
- Admin dashboard is accessible by navigating to `/admin` (only for admin users)

## Design Features

- Material-UI (MUI) v7 components
- Responsive design with breakpoints:
  - xs: < 600px (mobile)
  - sm: 600px - 900px (tablet)
  - md: 900px - 1200px (desktop)
  - lg: > 1200px (large desktop)
- Consistent color scheme matching the app theme
- Smooth transitions and hover effects
- Clean, modern UI with proper spacing and typography

## Mock Data

All pages currently use mock data for demonstration:
- User posts and photos
- Notification settings
- Admin statistics
- User and post tables

To integrate with real backend:
1. Replace mock data with API calls
2. Update form submissions to call backend endpoints
3. Implement real-time updates for admin dashboard
4. Add image upload functionality
