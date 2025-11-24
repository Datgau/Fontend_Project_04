// Token refresh service with debouncing and queue management
import { publicClient } from "./api";
import { updateStoredTokens, clearAuthSession } from "./authStorage";

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;
let refreshSubscribers: ((token: string) => void)[] = [];

// Subscribe to token refresh
const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Notify all subscribers when token is refreshed
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

/**
 * Refresh access token using refresh token from cookie
 * Implements debouncing - multiple simultaneous calls will share the same refresh request
 */
export const refreshAccessToken = async (): Promise<string> => {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    console.log("Token refresh already in progress, waiting...");
    return refreshPromise;
  }

  // If multiple requests come in, queue them
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      subscribeTokenRefresh((token: string) => {
        resolve(token);
      });
    });
  }

  isRefreshing = true;

  // Create and store the refresh promise
  refreshPromise = (async () => {
    try {
      console.log("Refreshing access token...");
      
      // Backend uses refresh token from cookie (withCredentials: true)
      const response = await publicClient.post("/auth/refresh-token");

      if (response.data?.success && response.data?.data?.accessToken) {
        const newAccessToken = response.data.data.accessToken;
        
        console.log("Token refreshed successfully");
        
        // Update stored tokens
        updateStoredTokens({
          accessToken: newAccessToken,
          expiresIn: response.data.data.expiresIn,
        });

        // Notify all waiting requests
        onTokenRefreshed(newAccessToken);
        
        return newAccessToken;
      } else {
        throw new Error("Invalid refresh token response");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      refreshSubscribers = [];
      
      // Clear session and redirect to login
      clearAuthSession();
      
      // Broadcast logout to other tabs
      window.localStorage.removeItem("pulse.auth.session");
      window.sessionStorage.removeItem("pulse.auth.session");
      
      // Redirect to login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      
      throw error;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

