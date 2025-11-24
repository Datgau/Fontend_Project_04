export default function DataDeletion() {
  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>Hướng Dẫn Xóa Dữ Liệu Người Dùng – HeartBeat</h1>
      <p>Cập nhật lần cuối: {new Date().toLocaleDateString()}</p>

      <p>
        Nếu bạn muốn xóa dữ liệu cá nhân đã cung cấp cho HeartBeat thông qua đăng nhập
        Facebook, Google hoặc tài khoản email, bạn có thể thực hiện theo các bước sau:
      </p>

      <h2>1. Cách yêu cầu xóa dữ liệu</h2>
      <ol>
        <li>Gửi email đến: <strong>HeartBeat.support@example.com</strong></li>
        <li>Tiêu đề: "Yêu cầu xóa dữ liệu người dùng"</li>
        <li>Cung cấp thông tin:
          <ul>
            <li>ID tài khoản hoặc email đăng nhập</li>
            <li>Phương thức đăng nhập (Email, Facebook, Google)</li>
            <li>Lý do xóa dữ liệu (tùy chọn)</li>
          </ul>
        </li>
      </ol>

      <h2>2. Dữ liệu sẽ bị xóa</h2>
      <p>Khi bạn yêu cầu xóa tài khoản, các dữ liệu sau sẽ bị xóa vĩnh viễn:</p>
      <ul>
        <li>Thông tin tài khoản (email, tên, username)</li>
        <li>Ảnh đại diện và ảnh bìa</li>
        <li>Tất cả bài viết, hình ảnh, video đã đăng</li>
        <li>Bình luận và tương tác</li>
        <li>Tin nhắn và cuộc trò chuyện</li>
        <li>Thông tin OAuth (Facebook, Google)</li>
      </ul>

      <h2>3. Dữ liệu được giữ lại</h2>
      <p>Một số dữ liệu có thể được giữ lại theo yêu cầu pháp lý:</p>
      <ul>
        <li>Logs hệ thống (để bảo mật và phòng chống gian lận)</li>
        <li>Dữ liệu thanh toán (nếu có, theo quy định pháp luật)</li>
        <li>Báo cáo vi phạm đã được xử lý</li>
      </ul>

      <h2>4. Thời gian xử lý</h2>
      <p>
        Sau khi nhận yêu cầu, chúng tôi sẽ xóa toàn bộ dữ liệu liên quan trong vòng
        <strong> 48 giờ</strong> theo chính sách của Facebook và Google.
      </p>
      <p>
        Bạn sẽ nhận được email xác nhận khi quá trình xóa dữ liệu hoàn tất.
      </p>

      <h2>5. Xóa dữ liệu OAuth (Facebook/Google)</h2>
      <p>Nếu bạn đăng nhập bằng Facebook hoặc Google, bạn cũng có thể:</p>
      
      <h3>Thu hồi quyền truy cập Facebook:</h3>
      <ol>
        <li>Vào <strong>Facebook → Settings & Privacy → Settings</strong></li>
        <li>Chọn <strong>Apps and Websites</strong></li>
        <li>Tìm <strong>HeartBeat</strong> và click <strong>Remove</strong></li>
      </ol>

      <h3>Thu hồi quyền truy cập Google:</h3>
      <ol>
        <li>Vào <strong>Google Account → Security</strong></li>
        <li>Chọn <strong>Third-party apps with account access</strong></li>
        <li>Tìm <strong>HeartBeat</strong> và click <strong>Remove Access</strong></li>
      </ol>

      <h2>6. Xóa tài khoản trong ứng dụng</h2>
      <p>Bạn cũng có thể tự xóa tài khoản trực tiếp trong ứng dụng:</p>
      <ol>
        <li>Đăng nhập vào HeartBeat</li>
        <li>Vào <strong>Settings → Account</strong></li>
        <li>Chọn <strong>Delete Account</strong></li>
        <li>Xác nhận xóa tài khoản</li>
      </ol>
      <p><em>Lưu ý: Tính năng này đang được phát triển.</em></p>

      <h2>7. Liên hệ hỗ trợ</h2>
      <p>
        Nếu bạn có bất kỳ câu hỏi nào về việc xóa dữ liệu, vui lòng liên hệ:
      </p>
      <ul>
        <li>Email: <strong>dattn12042001@gmail.com</strong></li>
        <li>Thời gian phản hồi: Trong vòng 24 giờ</li>
      </ul>

      <h2>8. Cam kết của chúng tôi</h2>
      <p>
        HeartBeat cam kết tôn trọng quyền riêng tư của bạn và tuân thủ các quy định về
        bảo vệ dữ liệu cá nhân. Chúng tôi sẽ xử lý yêu cầu xóa dữ liệu của bạn một cách
        nhanh chóng và minh bạch.
      </p>

      <p style={{ marginTop: "40px", fontStyle: "italic", color: "#666" }}>
        Cảm ơn bạn đã sử dụng HeartBeat. Chúng tôi rất tiếc khi bạn rời đi và hy vọng
        sẽ được phục vụ bạn trong tương lai.
      </p>
    </div>
  );
}
