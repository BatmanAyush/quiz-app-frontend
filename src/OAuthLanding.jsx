// OAuthLanding.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthLanding() {
  const navigate = useNavigate();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
    console.log("Found the token"+token)
      localStorage.setItem("jwt", token);
      navigate("/home", { replace: true });
    } 
  }, [navigate]);

  return <div className="p-6 text-center">Signing you in…</div>;
}
