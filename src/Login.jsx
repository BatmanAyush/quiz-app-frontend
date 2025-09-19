import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// --- SVG Icons ---

const PadlockIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M7 9V7a5 5 0 0 1 10 0v2M12 15v2m7-5v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity=".9"
    />
  </svg>
);

const HidEye = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M17 17L7 7M1 12c2.5 4 6.5 7 11 7s8.5-3 11-7c-2.5-4-6.5-7-11-7-1.16 0-2.29.13-3.37.38"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ShowEye = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

// NEW: Google Icon for the login button
const GoogleIcon = () => (
    <svg className="w-5 h-5" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
        <path d="M1 1h22v22H1z" fill="none"></path>
    </svg>
);


export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [hid, setHid] = useState(true);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const reqBody = { name: name.toLowerCase(), password };
    try {
      const response = await fetch("https://15-207-151-132.nip.io/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqBody),
      });
      const result = await response.json();
      if (response.ok && result.token) {
        localStorage.setItem("jwt", result.token);
        navigate("/home");
      } else {
        console.error("Login failed:", result);
      }
    } catch (error) {
      console.error("Error during POST request:", error);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-center mb-4">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gray-100 text-gray-700">
            <PadlockIcon />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 text-center">Sign in</h2>
        <p className="mt-1 text-center text-sm text-gray-500">
          Welcome back. Please enter your details.
        </p>

        {/* --- NEW: Google Login Button --- */}
        <div className="mt-6">
          <a
            href="https://15-207-151-132.nip.io/oauth2/authorization/google"
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium py-2.5 hover:bg-gray-50 transition
                       focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          >
            <GoogleIcon />
            <span>Sign in with Google</span>
          </a>
        </div>

        {/* --- NEW: Visual Separator --- */}
        <div className="mt-6 flex items-center">
          <div className="flex-grow h-px bg-gray-100"></div>
          <span className="mx-4 text-xs text-gray-400 font-medium">OR</span>
          <div className="flex-grow h-px bg-gray-100"></div>
        </div>

        {/* --- Existing Manual Login Form --- */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="block w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-xs
                         focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={hid ? "password" : "text"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="block w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 pr-12 text-gray-900 placeholder:text-gray-400 shadow-xs
                           focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition"
              />
              <button
                type="button"
                onClick={() => setHid(!hid)}
                aria-label={hid ? "Show password" : "Hide password"}
                className="absolute inset-y-0 right-3 my-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              >
                {hid ? <ShowEye /> : <HidEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gray-900 text-white font-medium py-2.5 hover:bg-black transition
                       focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          >
            Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}
