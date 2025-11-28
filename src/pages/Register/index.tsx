import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import "../../styles/AuthPage.css";
import { AuthService } from "../../services/authService";
import { useAuth } from "../../routes/AuthContext";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(true);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const {login: persistSession} = useAuth();

  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.warn("Google Client ID not configured");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleResponse,
        ux_mode: 'popup',
        use_fedcm_for_prompt: false
      });
      console.log("Google SDK loaded");
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;
    if (!facebookAppId) {
      console.warn("Facebook App ID not configured");
      return;
    }

    const fbScript = document.createElement("script");
    fbScript.src = "https://connect.facebook.net/en_US/sdk.js";
    fbScript.async = true;
    fbScript.onload = () => {
      window.FB.init({
        appId: facebookAppId,
        cookie: true,
        xfbml: true,
        version: "v16.0",
      });
      console.log("Facebook SDK loaded");
    };
    document.body.appendChild(fbScript);
    return () => {
      if (document.body.contains(fbScript)) {
        document.body.removeChild(fbScript);
      }
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setFeedback({
        type: "error",
        message: "Mật khẩu xác nhận chưa khớp. Vui lòng kiểm tra lại nhé.",
      });
      return;
    }

    if (!agree) {
      setFeedback({
        type: "error",
        message: "Bạn cần đồng ý với điều khoản trước khi tiếp tục.",
      });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await AuthService.register({
        username: userName.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        fullName: fullName.trim(),
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Đăng ký thất bại");
      }

      setFeedback({
        type: "success",
        message: response.message,
      });
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`);

    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Đăng ký thất bại, vui lòng thử lại.";
      setFeedback({
        type: "error",
        message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleResponse = async (response: any) => {
    console.log("Google response received");
    try {
      const result = await AuthService.oauthLogin({
        provider: "google",
        accessToken: response.credential,
      });

      if (result.success && result.data) {
        persistSession(
          {
            username: result.data.username,
            role: result.data.role,
            tokens: {
              accessToken: result.data.token.accessToken,
              expiresIn: result.data.token.expiresIn,
            },
          },
          true
        );
        setFeedback({
          type: "success",
          message: "Đăng nhập Google thành công!",
        });
        setTimeout(() => {
          navigate("/heartbeat/home");
        }, 1000);
      } else {
        setFeedback({
          type: "error",
          message: result.message || "Đăng nhập Google thất bại",
        });
      }
    } catch (error) {
      console.error("Google login error:", error);
      setFeedback({
        type: "error",
        message: "Đăng nhập Google thất bại, vui lòng thử lại",
      });
    }
  };

  const handleGoogleLoginClick = () => {
    if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
      setFeedback({
        type: "error",
        message: "Google login chưa được cấu hình.",
      });
      return;
    }

    if (!window.google?.accounts?.id) {
      setFeedback({
        type: "error",
        message: "Google SDK chưa được tải. Vui lòng refresh trang.",
      });
      return;
    }

    console.log("Initiating Google login...");
    
    try {
      // Sử dụng popup thay vì prompt để tránh FedCM
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          console.log("Prompt not displayed, using fallback");
          // Fallback: Tạo button tạm thời và click
          const tempDiv = document.createElement('div');
          tempDiv.style.display = 'none';
          document.body.appendChild(tempDiv);
          
          window.google.accounts.id.renderButton(tempDiv, {
            type: 'standard',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
          });
          
          // Trigger click on the rendered button
          setTimeout(() => {
            const googleBtn = tempDiv.querySelector('div[role="button"]') as HTMLElement;
            if (googleBtn) {
              googleBtn.click();
            }
            setTimeout(() => {
              if (document.body.contains(tempDiv)) {
                document.body.removeChild(tempDiv);
              }
            }, 1000);
          }, 100);
        }
      });
    } catch (error) {
      console.error("Google login error:", error);
      setFeedback({
        type: "error",
        message: "Không thể mở Google login. Vui lòng thử lại.",
      });
    }
  };

  const handleFacebookLogin = () => {
    if (!import.meta.env.VITE_FACEBOOK_APP_ID) {
      setFeedback({
        type: "error",
        message: "Facebook login chưa được cấu hình.",
      });
      return;
    }

    if (!window.FB) {
      setFeedback({
        type: "error",
        message: "Facebook SDK chưa được tải. Vui lòng refresh trang.",
      });
      return;
    }

    console.log("Initiating Facebook login...");

    window.FB.login(
        (response: any) => {
          console.log("Facebook response:", response);
          if (response.authResponse) {
            console.log("Facebook access token received");
            
            // Handle async operation separately
            AuthService.oauthLogin({
              provider: "facebook",
              accessToken: response.authResponse.accessToken,
            }).then((result) => {
              if (result.success && result.data) {
                persistSession(
                  {
                    username: result.data.username,
                    role: result.data.role,
                    tokens: {
                      accessToken: result.data.token.accessToken,
                      expiresIn: result.data.token.expiresIn,
                    },
                  },
                  true
                );
                setFeedback({
                  type: "success",
                  message: "Đăng nhập Facebook thành công!",
                });
                setTimeout(() => {
                  navigate("/heartbeat/home");
                }, 1000);
              } else {
                setFeedback({
                  type: "error",
                  message: result.message || "Đăng nhập Facebook thất bại",
                });
              }
            }).catch((error) => {
              console.error("Facebook login error:", error);
              setFeedback({
                type: "error",
                message: "Đăng nhập Facebook thất bại, vui lòng thử lại",
              });
            });
          } else {
            console.log("Facebook login cancelled");
            setFeedback({
              type: "error",
              message: "Đăng nhập Facebook bị hủy",
            });
          }
        },
        { scope: "public_profile" }
    );
  };

  return (
    <main className="auth-page">
      <section className="auth-panel auth-panel--accent">
        <span className="auth-logo">HeartBeat</span>
        <h1>Xây dựng hồ sơ cá nhân nổi bật</h1>
        <p>
          Cá nhân hóa profile bằng template video, khung hình AI và huy hiệu
          Linh Hoạt giúp bạn khác biệt trong mọi cộng đồng.
        </p>
        <ul className="auth-highlights">
          <li>90+ preset màu sắc cho nhật ký và story</li>
          <li>Cửa hàng theme cá nhân hóa giao diện</li>
          <li>Hệ thống nhiệm vụ & huy hiệu theo cấp độ</li>
        </ul>

        <div className="auth-progress">
          <div className="auth-progress__header">
            <div>
              <strong>98%</strong>
              <p style={{ margin: 0 }}>người mới hoàn tất hồ sơ trong 3 phút</p>
            </div>
            <span>Level Boost</span>
          </div>
          <div className="auth-progress__bar">
            <span style={{ width: "98%" }} />
          </div>
          <div className="auth-tags">
            <span>#Storyteller</span>
            <span>#Lifestyle</span>
            <span>#Music</span>
            <span>#Tech</span>
            <span>#Creator</span>
          </div>
        </div>
      </section>

      <section className="auth-panel auth-panel--card">
        <div className="auth-tabs">
          <Link className="auth-tab" to="/login">
            Đăng nhập
          </Link>
          <Link className="auth-tab active" to="/register">
            Đăng ký
          </Link>
        </div>

        <div>
          <h2 className="auth-card-title">Tạo tài khoản mới</h2>
          <p className="auth-card-subtitle">
            Gia nhập cộng đồng sáng tạo của HeartBeat chỉ với vài bước.
          </p>
        </div>



        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-split">
            <div className="form-group">
              <label htmlFor="register-fullname">Họ và tên</label>
              <input
                id="register-fullname"
                className="form-input"
                placeholder="Nguyễn Thảo Linh"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="register-username">Tên hiển thị</label>
              <input
                id="register-username"
                className="form-input"
                placeholder="@linhtn"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="form-split">
            <div className="form-group">
              <label htmlFor="register-password">Mật khẩu</label>
              <input
                id="register-password"
                className="form-input form-input--password"
                type="password"
                placeholder="Ít nhất 8 ký tự"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <span className="form-hint">
                • 1 chữ hoa • 1 số • 1 ký tự đặc biệt
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="register-confirm">Nhập lại mật khẩu</label>
              <input
                id="register-confirm"
                className="form-input form-input--password"
                type="password"
                placeholder="Nhập lại"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>
          </div>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={agree}
              onChange={(event) => setAgree(event.target.checked)}
            />
            Tôi đồng ý với{" "}
            <Link className="link" to="/terms-of-service" target="_blank">
              điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link className="link" to="/privacy-policy" target="_blank">
              chính sách bảo mật
            </Link>
            .
          </label>

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Đang xử lý..." : "Hoàn tất đăng ký"}
          </button>
        </form>

        <div className="auth-divider">Hoặc tiếp tục với</div>
        <div className="auth-social">
          <button
              className="social-btn"
              onClick={handleGoogleLoginClick}
              type="button"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M21.6 12.227c0-.84-.075-1.68-.227-2.507H12v4.74h5.37a4.59 4.59 0 0 1-1.98 3.01v2.51h3.2c1.87-1.72 3.01-4.26 3.01-7.753Z"
                fill="#4285F4"
              />
              <path
                d="M12 22c2.97 0 5.46-.986 7.28-2.66l-3.2-2.51c-.89.6-2.03.95-3.77.95-2.89 0-5.35-1.95-6.23-4.57H2.98v2.58A10 10 0 0 0 12 22Z"
                fill="#34A853"
              />
              <path
                d="M5.77 13.21c-.2-.6-.32-1.24-.32-1.88 0-.65.11-1.29.3-1.89V6.86H2.98A10 10 0 0 0 2 11.33c0 1.56.37 3.03.98 4.47l2.79-2.59Z"
                fill="#FBBC05"
              />
              <path
                d="M12 4.73c1.62 0 3.07.56 4.21 1.66l3.14-3.14C17.45 1.21 14.97 0 12 0 7.69 0 3.99 2.46 2.21 6.06l3.24 2.58C6.34 6.01 8.8 4.73 12 4.73Z"
                fill="#EA4335"
              />
            </svg>
            Google Workspace
          </button>
          <button
              className="social-btn"
              onClick={handleFacebookLogin}
              type="button"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.5 12c0-6.35-5.15-11.5-11.5-11.5S0.5 5.65 0.5 12c0 5.73 4.2 10.47 9.7 11.37v-7.98H7.38V12h2.82V9.57c0-2.78 1.65-4.32 4.18-4.32 1.21 0 2.47.22 2.47.22v2.72h-1.39c-1.37 0-1.8.85-1.8 1.73V12h3.06l-.49 3.39h-2.57v7.98c5.5-.9 9.7-5.64 9.7-11.37Z" />
            </svg>
            Meta Portal
          </button>
        </div>

        <p className="auth-footer">
          Đã có tài khoản?{" "}
          <Link className="link" to="/login">
            Đăng nhập ngay
          </Link>
        </p>
      </section>

      {/* Snackbar for notifications */}
      <Snackbar
        open={feedback !== null}
        autoHideDuration={6000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setFeedback(null)}
          severity={feedback?.type || "info"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {feedback?.message}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default Register;
