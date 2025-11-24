# Testing Guide - HeartBeat Social Network

## 🧪 Hướng dẫn test đầy đủ các tính năng

---

## 📋 Checklist Test

### 1. Authentication ✅
- [ ] Đăng ký tài khoản mới (email/password)
- [ ] Xác thực OTP
- [ ] Đăng nhập email/password
- [ ] Đăng nhập Google OAuth
- [ ] Đăng nhập Facebook OAuth
- [ ] Remember me
- [ ] Đăng xuất
- [ ] Auto token refresh

### 2. Posts 📝
- [ ] Tạo post chỉ có text
- [ ] Tạo post với 1 ảnh
- [ ] Tạo post với nhiều ảnh (2-5 ảnh)
- [ ] Xem feed posts
- [ ] Like/Unlike post
- [ ] Comment trên post
- [ ] Xóa post của mình
- [ ] Không thể xóa post của người khác

### 3. Profile 👤
- [ ] Xem profile của mình
- [ ] Xem profile người khác
- [ ] Cập nhật avatar
- [ ] Cập nhật cover photo
- [ ] Cập nhật bio
- [ ] Xem posts của user
- [ ] Xem followers/following count

### 4. Settings ⚙️
- [ ] Cập nhật thông tin cá nhân
- [ ] Đổi mật khẩu
- [ ] Cài đặt notifications
- [ ] Chuyển đổi theme (dark/light)
- [ ] Chọn ngôn ngữ

### 5. Admin Dashboard 👨‍💼
- [ ] Chỉ admin mới vào được
- [ ] Xem thống kê users
- [ ] Xem thống kê posts
- [ ] Quản lý users
- [ ] Quản lý posts
- [ ] Block/Unblock user

### 6. Responsive Design 📱
- [ ] Mobile (< 600px)
- [ ] Tablet (600px - 900px)
- [ ] Desktop (> 900px)
- [ ] Landscape orientation

---

## 🚀 Bắt đầu Test

### Bước 1: Khởi động Backend

```bash
cd Project_Backend04

# Chạy Spring Boot
mvn spring-boot:run

# Hoặc nếu đã build
java -jar target/project-backend04-0.0.1-SNAPSHOT.jar
```

**Kiểm tra:**
- Backend chạy ở: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

---

### Bước 2: Khởi động Frontend

```bash
cd Project_FontEnd04

# Install dependencies (nếu chưa)
npm install

# Start dev server
npm run dev
```

**Kiểm tra:**
- Frontend chạy ở: `http://localhost:5173`
- Hoặc port khác nếu 5173 đã bị chiếm

---

### Bước 3: Khởi động ngrok (cho Facebook OAuth)

```bash
ngrok http 5173
```

**Lưu ý:**
- Copy HTTPS URL từ ngrok
- Cập nhật trong Facebook App settings
- Cập nhật `VITE_APP_URL` trong `.env`

---

## 📝 Test Cases Chi Tiết

### Test 1: Đăng ký & Đăng nhập

#### 1.1 Đăng ký tài khoản mới
```
1. Mở http://localhost:5173/register
2. Nhập thông tin:
   - Username: testuser01
   - Email: test@example.com
   - Password: Test@123
   - Full Name: Test User
3. Click "Đăng ký"
4. Kiểm tra email nhận OTP
5. Nhập OTP
6. Verify thành công → Redirect to login
```

**Expected:**
- ✅ Hiển thị form OTP
- ✅ Email nhận được OTP
- ✅ Sau verify redirect to /login
- ✅ Hiển thị success message

#### 1.2 Đăng nhập
```
1. Mở http://localhost:5173/login
2. Nhập:
   - Username: testuser01
   - Password: Test@123
3. Check "Remember me"
4. Click "Đăng nhập"
```

**Expected:**
- ✅ Redirect to /heartbeat/home
- ✅ Token lưu trong localStorage
- ✅ Header hiển thị user info

---

### Test 2: Tạo Post

#### 2.1 Post chỉ có text
```
1. Ở Home page
2. Click vào "Bạn đang nghĩ gì?"
3. Nhập: "Hello World! This is my first post 🎉"
4. Click "Đăng"
```

**Expected:**
- ✅ Loading indicator hiển thị
- ✅ Post xuất hiện ở đầu feed
- ✅ Hiển thị success message
- ✅ Form reset về trạng thái ban đầu

#### 2.2 Post với nhiều ảnh
```
1. Click vào "Bạn đang nghĩ gì?"
2. Nhập: "Check out these amazing photos!"
3. Click icon Photo
4. Chọn 3 ảnh từ máy
5. Xem preview ảnh
6. Click "Đăng"
```

**Expected:**
- ✅ Preview 3 ảnh hiển thị
- ✅ Có thể xóa từng ảnh trước khi đăng
- ✅ Upload progress (nếu ảnh lớn)
- ✅ Post hiển thị với 3 ảnh
- ✅ Ảnh có thể click để xem full size

---

### Test 3: Tương tác với Post

#### 3.1 Like/Unlike
```
1. Tìm một post trong feed
2. Click icon ❤️
3. Kiểm tra số like tăng
4. Click lại icon ❤️
5. Kiểm tra số like giảm
```

**Expected:**
- ✅ Icon đổi màu khi liked
- ✅ Count cập nhật real-time
- ✅ Animation smooth

#### 3.2 Comment
```
1. Click "Comment" trên post
2. Nhập: "Great post! 👍"
3. Click "Send" hoặc Enter
```

**Expected:**
- ✅ Comment xuất hiện ngay lập tức
- ✅ Hiển thị avatar và tên user
- ✅ Timestamp hiển thị đúng

---

### Test 4: Profile

#### 4.1 Xem profile
```
1. Click vào avatar ở header
2. Click "Trang cá nhân"
```

**Expected:**
- ✅ Hiển thị cover photo
- ✅ Hiển thị avatar
- ✅ Hiển thị stats (Posts, Followers, Following)
- ✅ Hiển thị bio
- ✅ Tab Posts hiển thị posts của user

#### 4.2 Cập nhật profile
```
1. Ở Profile page
2. Click "Edit Profile"
3. Cập nhật:
   - Bio: "Software Engineer | Coffee Lover ☕"
   - Upload avatar mới
   - Upload cover photo mới
4. Click "Save"
```

**Expected:**
- ✅ Upload progress hiển thị
- ✅ Ảnh cập nhật ngay lập tức
- ✅ Success message
- ✅ Ảnh cũ bị xóa khỏi Google Cloud

---

### Test 5: Settings

#### 5.1 Đổi mật khẩu
```
1. Click avatar → "Cài đặt"
2. Tab "Password"
3. Nhập:
   - Current Password: Test@123
   - New Password: NewTest@456
   - Confirm: NewTest@456
4. Click "Update Password"
```

**Expected:**
- ✅ Success message
- ✅ Có thể đăng nhập với password mới
- ✅ Password cũ không còn hoạt động

#### 5.2 Notification Settings
```
1. Tab "Notifications"
2. Toggle các options:
   - Email Notifications: ON
   - Push Notifications: OFF
   - Like Notifications: ON
```

**Expected:**
- ✅ Settings lưu ngay lập tức
- ✅ Reload page vẫn giữ settings

---

### Test 6: Admin Dashboard

#### 6.1 Access Control
```
1. Đăng nhập với user thường
2. Navigate to /admin
```

**Expected:**
- ✅ Redirect to /heartbeat/home
- ✅ Hoặc hiển thị "Permission Denied"

```
3. Đăng nhập với admin account
4. Navigate to /admin
```

**Expected:**
- ✅ Hiển thị Admin Dashboard
- ✅ 4 stat cards
- ✅ Tabs: Overview, Users, Posts, Settings

#### 6.2 User Management
```
1. Tab "Users"
2. Xem danh sách users
3. Click menu (⋮) trên một user
4. Click "Block"
```

**Expected:**
- ✅ Confirmation dialog
- ✅ User status đổi thành "blocked"
- ✅ User không thể đăng nhập

---

### Test 7: Responsive Design

#### 7.1 Mobile (< 600px)
```
1. Mở DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Chọn iPhone 12 Pro
4. Test các trang:
   - Home
   - Profile
   - Settings
   - Admin
```

**Expected:**
- ✅ Layout 1 cột
- ✅ Sidebar collapse
- ✅ Font size nhỏ hơn
- ✅ Touch-friendly buttons
- ✅ No horizontal scroll

#### 7.2 Tablet (600px - 900px)
```
1. Chọn iPad
2. Test landscape và portrait
```

**Expected:**
- ✅ Layout 2 cột (nếu có)
- ✅ Sidebar visible
- ✅ Comfortable spacing

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
```
Access to XMLHttpRequest at 'http://localhost:8080/api/posts' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**
```java
// CustomCorsFilter.java
response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
response.setHeader("Access-Control-Allow-Credentials", "true");
```

---

### Issue 2: 401 Unauthorized
```
POST /api/posts 401 Unauthorized
```

**Solution:**
1. Check token trong localStorage
2. Check token expiry
3. Try logout và login lại
4. Check SecurityConfig permitAll() endpoints

---

### Issue 3: Image Upload Failed
```
Failed to upload images: File size too large
```

**Solution:**
```yaml
# application.yml
spring:
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 50MB
```

---

### Issue 4: Facebook OAuth Not Working
```
Given URL is not allowed by the Application configuration
```

**Solution:**
1. Check ngrok HTTPS URL
2. Update Facebook App Settings:
   - Valid OAuth Redirect URIs
   - App Domains
3. Update `.env`:
   ```
   VITE_APP_URL=https://your-ngrok-url.ngrok.io
   ```

---

## 📊 Performance Testing

### Load Testing với nhiều posts
```
1. Tạo 50+ posts
2. Scroll feed
3. Check:
   - Load time < 2s
   - Smooth scrolling
   - No memory leaks
```

### Image Upload Performance
```
1. Upload 5 ảnh (mỗi ảnh 2-3MB)
2. Check:
   - Upload time < 10s
   - Progress indicator
   - No UI freeze
```

---

## ✅ Final Checklist

### Before Production
- [ ] All tests passed
- [ ] No console errors
- [ ] No console warnings
- [ ] Responsive on all devices
- [ ] Images optimized
- [ ] API endpoints secured
- [ ] Environment variables set
- [ ] Database migrated
- [ ] Google Cloud Storage configured
- [ ] OAuth apps configured
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Success/Error messages
- [ ] Accessibility (a11y) checked

---

## 🎯 Test Results Template

```markdown
## Test Session: [Date]
**Tester:** [Name]
**Environment:** Dev/Staging/Prod
**Browser:** Chrome 120 / Firefox 121 / Safari 17

### Results:
- ✅ Authentication: PASS
- ✅ Posts: PASS
- ✅ Profile: PASS
- ⚠️ Settings: PARTIAL (Password change slow)
- ✅ Admin: PASS
- ✅ Responsive: PASS

### Issues Found:
1. Password change takes 5s (expected < 2s)
2. Image preview not showing on Safari
3. Notification count not updating real-time

### Recommendations:
1. Optimize password hashing
2. Add Safari-specific CSS
3. Implement WebSocket for notifications
```

---

**Happy Testing! 🚀**
