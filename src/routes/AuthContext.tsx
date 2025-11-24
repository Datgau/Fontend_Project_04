import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../@type/login";
import {
    clearAuthSession,
    loadAuthSession,
    persistAuthSession,
} from "../services/authStorage";

interface AuthContextType {
    isLoggedIn: boolean;
    user: AuthUser | null;
    currentUser: AuthUser | null;
    login: (user: AuthUser, rememberMe?: boolean) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);



    // Load session on mount
    useEffect(() => {
        const initAuth = async () => {
            const session = loadAuthSession();
            console.log("Loading auth session:", session);
            
            if (session?.user) {
                setUser(session.user);
                setIsLoggedIn(true);
            }
            setLoading(false);
        };
        
        initAuth();
    }, []);

    // Sync auth state across tabs using storage event
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "pulse.auth.session") {
                if (e.newValue) {
                    // Session updated in another tab
                    const session = JSON.parse(e.newValue);
                    if (session?.user) {
                        setUser(session.user);
                        setIsLoggedIn(true);
                    }
                } else {
                    // Session cleared in another tab (logout)
                    setUser(null);
                    setIsLoggedIn(false);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    // Token refresh is handled by API interceptor (api.ts)
    // No need for interval polling

    const login = (userData: AuthUser, rememberMe: boolean = true) => {
        persistAuthSession(userData, rememberMe);
        setUser(userData);
        setIsLoggedIn(true);
    };

    const logout = () => {
        clearAuthSession();
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                user,
                currentUser: user, // alias currentUser
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
