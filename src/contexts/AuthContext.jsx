import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api"; // Your API service object

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading initially
  const navigate = useNavigate();

  // Check for existing token and fetch user on initial load
  useEffect(() => {
    const fetchUserOnLoad = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false); // No token, not logged in, stop loading
        return;
      }

      try {
        // Token exists, verify it by fetching user data
        // The API interceptor should handle adding the token header
        const response = await API.getMe();
        setUser(response.data.data); // Set user data
      } catch (error) {
        console.log(
          "Failed to fetch user on load (token might be invalid):",
          error,
        );
        localStorage.removeItem("token"); // Clean up invalid token
        setUser(null);
      } finally {
        setIsLoading(false); // Done checking auth status
      }
    };

    fetchUserOnLoad();
  }, []); // Empty dependency array: runs only once on mount

  // Login function
  const login = async (email, password) => {
    // setError(null); // Optional: Clear previous errors in consuming component
    try {
      const response = await API.login(email, password);
      const token = response.data.token;
      localStorage.setItem("token", token); // Store token

      // Fetch user data after login
      const userResponse = await API.getMe();
      setUser(userResponse.data.data); // Update context state
      // No navigation here, let the consuming component decide where to go
      return userResponse.data.data; // Return user data on success
    } catch (err) {
      console.error("Login failed in context:", err);
      localStorage.removeItem("token"); // Ensure cleanup if login fails after token set
      setUser(null);
      // Re-throw the error so the calling component can handle it (e.g., show message)
      throw err.response?.data?.error || err.message || "Login failed";
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await API.register(userData);
      const token = response.data.token;
      localStorage.setItem("token", token);

      // Fetch user data after registration
      const userResponse = await API.getMe();
      setUser(userResponse.data.data);
      return userResponse.data.data; // Return user data
    } catch (err) {
      console.error("Registration failed in context:", err);
      localStorage.removeItem("token");
      setUser(null);
      throw err.response?.data?.error || err.message || "Registration failed";
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // Navigate to login or home page after logout
    navigate("/login"); // Or navigate("/")
  };

  // The value provided to consuming components
  const value = {
    user,
    setUser, // Allow manual updates if needed (e.g., after profile update)
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Render children only when not initially loading auth status */}
      {!isLoading ? (
        children
      ) : (
        <div className="flex items-center justify-center h-screen">
          Loading... {/* Or a proper loading spinner */}
        </div>
      )}
    </AuthContext.Provider>
  );
}

// Custom hook to easily consume the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
