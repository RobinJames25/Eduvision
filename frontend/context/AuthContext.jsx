import React, { createContext, useContext, useEffect, useState} from "react";

const AuthContext = createContext(null);
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/auth/me`, {
                    credentials: "include"
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error("Auth check failed", err);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const signup = async (firstName, lastName, email, password) => {
        const res = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                full_name: `${firstName} ${lastName}`.trim(),
                email,
                password
            }),
        });

        const data = await res.json();
        if (res.ok) {
            setUser(data);
            return { success: true };
        }
        return { success: false, message: data.detail || "Signup failed" };
    }

    const signin = async (email, password) => {
        try {
        const res = await fetch(`${API_BASE_URL}/auth/signin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (res.ok) {
            setUser(data);
            return { success: true };
        }
        return { success: false, message: data.detail || "Invalid credentials" };
    } catch (err) {
        return { success: false, message: "Connection error. Is the backend running?"}
    }
}

    const signout = async () => {
        await fetch(`${API_BASE_URL}/auth/signout`, { 
            method: "POST", 
            credentials: "include" 
        });
        setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}