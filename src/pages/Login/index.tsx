import {useEffect, useState} from "react";
import type { FormEvent } from "react";
import {Link, useNavigate} from "react-router-dom";
import "../../styles/AuthPage.css";
import { AuthService } from "../../services/authService";
import { useAuth } from "../../routes/AuthContext";
import { Alert, Snackbar } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const {login: persistSession} = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.warn("Google Client ID not configured");
      return;
    }
    if (document.getElementById("google-client-script")) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = "google-client-script";

    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleResponse,
          ux_mode: "popup",
          use_fedcm_for_prompt: false,
        });
        window.google.accounts.id.renderButton(
            document.getElementById("google-signin-button"),
            { theme: "outline", size: "large" }
        );
      }
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


  const handleGoogleResponse = async (response: any) => {
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
        message: "Google login chưa được cấu hình. Vui lòng liên hệ quản trị viên.",
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

    try {
      // Tạo hidden div và render Google button
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.top = '-9999px';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);
      
      window.google.accounts.id.renderButton(tempDiv, {
        type: 'standard',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
      });
      
      // Trigger click sau khi render
      setTimeout(() => {
        const googleBtn = tempDiv.querySelector('div[role="button"]') as HTMLElement;
        if (googleBtn) {
          googleBtn.click();
        }
        // Cleanup sau 2 giây
        setTimeout(() => {
          if (document.body.contains(tempDiv)) {
            document.body.removeChild(tempDiv);
          }
        }, 2000);
      }, 100);
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
        message: "Facebook login chưa được cấu hình. Vui lòng liên hệ quản trị viên.",
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
            setFeedback({
              type: "error",
              message: "Đăng nhập Facebook bị hủy",
            });
          }
        },
        { scope: "public_profile,email" }
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await AuthService.login({
        username: identifier.trim(),
        password,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Đăng nhập thất bại");
      }

      persistSession(
        {
          username: response.data.username,
          role: response.data.role,
          tokens: {
            accessToken: response.data.token.accessToken,
            expiresIn: response.data.token.expiresIn,
          },
        },
        remember
      );

      setFeedback({
        type: "success",
        message: response.message || "Đăng nhập thành công!",
      });
      setTimeout(() => {
        navigate("/heartbeat/home");
      }, 1000);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Đăng nhập thất bại, vui lòng thử lại.";
      setFeedback({
        type: "error",
        message,
      });
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <main className="auth-page">
      <section className="auth-panel auth-panel--accent">
        <span className="auth-logo">HeartBeat</span>
        <h1>Kết nối cộng đồng, chia sẻ khoảnh khắc</h1>
        <p>
          HeartBeat giúp bạn cập nhật mọi xu hướng, trò chuyện với cộng đồng và
          kể câu chuyện của riêng mình bằng những công cụ sáng tạo mạnh mẽ.
        </p>
        <ul className="auth-highlights">
          <li>Livestream chất lượng 4K cùng bộ lọc realtime</li>
          <li>Không gian Story 48h với sticker tương tác</li>
          <li>Công cụ nhóm kín chống rò rỉ nội dung</li>
        </ul>
        <div className="auth-community">
          <div className="avatar-stack" aria-hidden="true">
            <span>AN</span>
            <span>MT</span>
            <span>LD</span>
            <span>+8</span>
          </div>
          <div>
            <strong>120.000+</strong>
            <span> thành viên hoạt động mỗi ngày</span>
          </div>
        </div>
      </section>

      <section className="auth-panel auth-panel--card">
        <div className="auth-tabs">
          <Link className="auth-tab active" to="/login">
            Đăng nhập
          </Link>
          <Link className="auth-tab" to="/register">
            Đăng ký
          </Link>
        </div>

        <div>
          <h2 className="auth-card-title">Chào mừng trở lại</h2>
          <p className="auth-card-subtitle">
            Tiếp tục trò chuyện với cộng đồng yêu thích của bạn.
          </p>
        </div>



        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-identifier">Tên đăng nhập hoặc email</label>
            <input
              id="login-identifier"
              className="form-input"
              value={identifier}
              placeholder="vd: datnguyen01 hoặc dat@example.com"
              onChange={(event) => setIdentifier(event.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Mật khẩu</label>
            <input
              id="login-password"
              className="form-input form-input--password"
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <div className="form-extra">
            <label className="checkbox">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
              />
              Ghi nhớ tài khoản
            </label>
            <a className="link" href="#">
              Quên mật khẩu?
            </a>
          </div>

          <button className="auth-submit" type="submit" disabled={submitting}>
            {submitting ? "Đang đăng nhập..." : "Đăng nhập vào HeartBeat"}
          </button>
        </form>

        <div className="auth-divider">Hoặc tiếp tục với</div>

        <div className="auth-social">
          <button className="social-btn" onClick={handleGoogleLoginClick} type="button">

            <svg viewBox="0 0 24 24" fill="#4285F4">
              {/* Google SVG icon */}
            </svg>
            Google Workspace
          </button>
          <button className="social-btn" onClick={handleFacebookLogin} type="button">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path
                  d="M13 22V12h3.2l.5-3.9H13V5.5c0-1.1.3-1.8 1.9-1.8H17V0.2C16.7 0.1 15.6 0 14.2 0 11.3 0 9.4 1.7 9.4 4.8V8.1H6v3.9h3.4V22h3.6Z"/>
            </svg>
            Meta Portal
          </button>
        </div>
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
        <p className="auth-footer">
          Chưa có tài khoản?{" "}
          <Link className="link" to="/register">
            Tạo ngay - miễn phí!
          </Link>
        </p>
      </section>
    </main>
  );

};

export default Login;
