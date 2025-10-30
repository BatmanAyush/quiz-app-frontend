// OAuthLanding.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthLanding() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    console.log("OAuthLanding component mounted");
    console.log("Current URL:", window.location.href);
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    
    console.log("Token from URL:", token);
    
    if (token) {
      try {
        setStatus("Token found, saving...");
        console.log("Saving token to localStorage");
        
        localStorage.setItem("jwt", token);
        
        // Verify it was saved
        const savedToken = localStorage.getItem("jwt");
        console.log("Token saved successfully:", savedToken ? "Yes" : "No");
        
        setStatus("Redirecting to home...");
        console.log("Navigating to /home");
        
        navigate("/home", { replace: true });
      } catch (err) {
        console.error("Error during OAuth processing:", err);
        setError("Failed to save authentication. Please try again.");
      }
    } else {
      console.error("No token found in URL");
      setError("No authentication token found. Please try logging in again.");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);
    }
  }, [navigate]);

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <div className="text-sm text-gray-600">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="p-6 text-center">
      <div className="mb-4">{status}</div>
      <div className="text-sm text-gray-600">Please wait...</div>
    </div>
  );
}