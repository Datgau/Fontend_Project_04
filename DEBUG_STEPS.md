# Debug Steps - Post Creation Issue

## 🐛 Vấn đề
- Không thể tạo post
- Không hiển thị gì cả
- Lỗi khi thêm bài viết chỉ có chữ

## 🔍 Các bước debug

### 1. Kiểm tra Backend đang chạy
```bash
# Check if backend is running
curl http://localhost:8080/api/auth/login
```

**Expected:** Response (có thể 401 hoặc 400, nhưng không phải connection refused)

---

### 2. Kiểm tra Token trong localStorage
```javascript
// Mở Console (F12) và chạy:
localStorage.getItem('auth_session')
```

**Expected:** Phải có token
```json
{
  "user": {
    "username": "...",
    "tokens": {
      "accessToken": "eyJ..."
    }
  }
}
```

**Nếu không có token:**
- Đăng xuất và đăng nhập lại
- Check console xem có lỗi login không

---

### 3. Test API trực tiếp với Postman/curl

#### 3.1 Login để lấy token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "password": "your_password"
  }'
```

Copy `accessToken` từ response.

#### 3.2 Test create post
```bash
curl -X POST http://localhost:8080/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "content=Test post from curl"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "id": 1,
    "user": {...},
    "content": "Test post from curl",
    "images": [],
    ...
  }
}
```

**Nếu lỗi 401:**
- Token hết hạn hoặc không hợp lệ
- SecurityConfig chưa cho phép endpoint

**Nếu lỗi 500:**
- Check backend logs
- Database connection issue
- Entity mapping issue

---

### 4. Kiểm tra Console Errors

Mở DevTools (F12) → Console tab

**Các lỗi thường gặp:**

#### 4.1 CORS Error
```
Access to XMLHttpRequest at 'http://localhost:8080/api/posts' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Fix:** Check `CustomCorsFilter.java`
```java
response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
response.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
```

#### 4.2 401 Unauthorized
```
POST http://localhost:8080/api/posts 401 (Unauthorized)
```

**Fix:**
1. Check token trong localStorage
2. Đăng nhập lại
3. Check SecurityConfig

#### 4.3 Network Error
```
Network Error
```

**Fix:**
1. Backend không chạy
2. Sai URL (check VITE_API_BASE_URL trong .env)

#### 4.4 TypeError
```
TypeError: Cannot read property 'map' of undefined
```

**Fix:**
- Response data không đúng format
- Check PostResponse DTO

---

### 5. Kiểm tra Network Tab

DevTools (F12) → Network tab

#### 5.1 Check Request
- Method: POST
- URL: http://localhost:8080/api/posts
- Headers:
  - Authorization: Bearer eyJ...
  - Content-Type: multipart/form-data (nếu có ảnh)
- Body:
  - content: "..."
  - images: [files] (nếu có)

#### 5.2 Check Response
- Status: 200 OK
- Response body:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user": {...},
    "content": "...",
    "images": [],
    "likesCount": 0,
    "commentsCount": 0,
    "createdAt": "2024-01-23T..."
  }
}
```

---

### 6. Kiểm tra Backend Logs

```bash
# Xem logs của Spring Boot
# Tìm dòng:
# - POST /api/posts
# - Errors/Exceptions
```

**Các lỗi thường gặp:**

#### 6.1 NullPointerException
```
java.lang.NullPointerException: Cannot invoke "User.getId()" because "user" is null
```

**Fix:** UserService.findByUsername() trả về empty

#### 6.2 SQL Error
```
SQLServerException: Invalid column name 'images'
```

**Fix:** Chưa chạy migration
```bash
# Run migration
mvn flyway:migrate
```

#### 6.3 Jackson Error
```
JsonProcessingException: Cannot construct instance of `Post`
```

**Fix:** DTO mapping issue

---

### 7. Quick Fixes

#### Fix 1: Fallback to Mock Data
Nếu API không hoạt động, tạm thời dùng mock data:

```typescript
// PostForm.tsx
const handleSubmit = async () => {
  // ... validation ...
  
  try {
    const response = await PostService.createPost({...});
    
    if (response.success && response.data) {
      onPostCreated(response.data);
    }
  } catch (error) {
    // FALLBACK: Create mock post
    console.warn("API failed, creating mock post");
    const mockPost: Post = {
      id: `mock-${Date.now()}`,
      user: mockCurrentUser,
      content: content.trim(),
      images: [],
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    onPostCreated(mockPost);
    setSnackbar({ open: true, message: "Đăng bài thành công (mock)", severity: "success" });
  }
};
```

#### Fix 2: Check Database
```sql
-- Check if posts table exists
SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'posts';

-- Check posts table structure
SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'posts';

-- Check if there are any posts
SELECT * FROM posts;
```

#### Fix 3: Restart Everything
```bash
# Stop backend
Ctrl+C

# Stop frontend
Ctrl+C

# Clear browser cache
Ctrl+Shift+Delete

# Restart backend
cd Project_Backend04
mvn spring-boot:run

# Restart frontend
cd Project_FontEnd04
npm run dev

# Clear localStorage
# Console: localStorage.clear()

# Login again
```

---

## 🎯 Checklist

- [ ] Backend đang chạy (http://localhost:8080)
- [ ] Frontend đang chạy (http://localhost:5173)
- [ ] Đã đăng nhập thành công
- [ ] Token có trong localStorage
- [ ] CORS configured đúng
- [ ] Database migration đã chạy
- [ ] Posts table tồn tại
- [ ] SecurityConfig cho phép /api/posts với authentication
- [ ] Console không có lỗi CORS
- [ ] Console không có lỗi 401
- [ ] Network tab shows request được gửi
- [ ] Response status 200

---

## 📞 Nếu vẫn lỗi

Gửi cho tôi:
1. Screenshot console errors
2. Screenshot network tab (request + response)
3. Backend logs (5-10 dòng cuối)
4. Output của: `localStorage.getItem('auth_session')`

---

**Last Updated:** 2024-01-23
