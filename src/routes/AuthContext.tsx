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
    useEffect(() => {
        const initAuth = async () => {
            const session = loadAuthSession();
            if (session?.user) {
                setUser(session.user);
                setIsLoggedIn(true);
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "pulse.auth.session") {
                if (e.newValue) {
                    const session = JSON.parse(e.newValue);
                    if (session?.user) {
                        setUser(session.user);
                        setIsLoggedIn(true);
                    }
                } else {
                    setUser(null);
                    setIsLoggedIn(false);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

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
                currentUser: user,
                login,
                logout,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
