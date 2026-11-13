import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { apiRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    sessionStorage.getItem("justgo_token")
  );

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(() =>
    Boolean(sessionStorage.getItem("justgo_token"))
  );

  // Verify saved token when app starts or token changes
  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    apiRequest("/api/auth/profile", { token })
      .then((data) => {
        if (!cancelled) {
          setUser(data.user);
        }
      })
      .catch(() => {
        if (!cancelled) {
          sessionStorage.removeItem("justgo_token");
          setToken(null);
          setUser(null);
          setLoading(false);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const saveAuth = (data) => {
    sessionStorage.setItem("justgo_token", data.token);

    setLoading(true);
    setUser(data.user);
    setToken(data.token);
  };

  const register = async (formData) => {
    const data = await apiRequest(
      "/api/auth/register",
      {
        method: "POST",
        body: formData
      }
    );

    saveAuth(data);

    return data;
  };

  const login = async (formData) => {
    const data = await apiRequest(
      "/api/auth/login",
      {
        method: "POST",
        body: formData
      }
    );

    saveAuth(data);

    return data;
  };

  const logout = () => {
    sessionStorage.removeItem("justgo_token");

    setToken(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
