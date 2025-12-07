// pages/Login.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert, Snackbar } from "@mui/material";
import { AuthService } from "../../services/authService";
import { useAuth } from "../../routes/AuthContext";

import styles from "../../styles/Auth/Login.module.css";
import AuthPanel from "../../components/Auth/AuthPanel";
import { useGoogleAuth } from "../../hook/useGoogleAuth";
import { useFacebookAuth } from "../../hook/useFacebookAuth";
import LoginForm from "../../components/Auth/LoginForm";
import SocialLogin from "../../components/Auth/SocialLogin";
import AuthTabs from "../../components/Auth/AuthTabs";

const Login = () => {
  const navigate = useNavigate();
  const { login: persistSession } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Custom hooks cho OAuth
  const { handleGoogleLoginClick } = useGoogleAuth({ setFeedback });
  const { handleFacebookLogin } = useFacebookAuth({ setFeedback });

  const handleFormSubmit = async (
      identifier: string,
      password: string,
      remember: boolean
  ) => {
    setSubmitting(true);
    setFeedback(null);

    try {
      const response = await AuthService.login({
        username: identifier,
        password,
      });

      if (!response.success || !response.data) {
        throw new Error(response.message || "Đăng nhập thất bại");
      }

      persistSession(
          {
            id: response.data.id,
            username: response.data.username,
            role: response.data.role,
            email: response.data.email,
            fullName: response.data.fullName,
            avatar: response.data.avatar,
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
      <main className={styles.authPage}>
        <AuthPanel />

        <section className={`${styles.authPanel} ${styles.authPanelCard}`}>
          <AuthTabs activeTab="login" />

          <div>
            <h2 className={styles.authCardTitle}>Chào mừng trở lại</h2>
            <p className={styles.authCardSubtitle}>
              Tiếp tục trò chuyện với cộng đồng yêu thích của bạn.
            </p>
          </div>

          <LoginForm onSubmit={handleFormSubmit} submitting={submitting} />

          <SocialLogin
              onGoogleLogin={handleGoogleLoginClick}
              onFacebookLogin={handleFacebookLogin}
          />

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

          <p className={styles.authFooter}>
            Chưa có tài khoản?{" "}
            <Link className={styles.link} to="/register">
              Tạo ngay - miễn phí!
            </Link>
          </p>
        </section>
      </main>
  );
};

export default Login;