"use client";

import { useState, useEffect } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

const AUTH_STORAGE_KEY = "daily-journal-google-auth";

interface StoredAuth {
  email: string;
  accessToken: string;
  expiresAt: number;
}

function GoogleAuthButtonInner() {
  const [auth, setAuth] = useState<StoredAuth | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredAuth;
        if (parsed.expiresAt > Date.now()) {
          setAuth(parsed);
        } else {
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }
    } catch {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/userinfo.email",
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        const user = (await res.json()) as { email?: string };
        const expiresAt = Date.now() + (tokenResponse.expires_in ?? 3600) * 1000;
        const stored: StoredAuth = {
          email: user.email ?? "Signed in",
          accessToken: tokenResponse.access_token,
          expiresAt,
        };
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(stored));
        setAuth(stored);
      } catch {
        setAuth({
          email: "Signed in",
          accessToken: tokenResponse.access_token,
          expiresAt: Date.now() + 3600000,
        });
      }
    },
  });

  const logout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setAuth(null);
  };

  if (auth) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-600 truncate max-w-[120px]">
          {auth.email}
        </span>
        <button
          type="button"
          onClick={logout}
          className="px-3 py-1.5 rounded-lg border-2 border-thistle/50 bg-white/80 hover:bg-slate-100 text-slate-700 text-sm font-medium"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => login()}
      className="px-4 py-2 rounded-lg border-2 border-thistle/50 bg-thistle hover:bg-thistle/80 text-slate-800 text-sm font-medium"
    >
      Sign in with Google
    </button>
  );
}

export function GoogleAuthButton() {
  if (!GOOGLE_CLIENT_ID) {
    return null;
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleAuthButtonInner />
    </GoogleOAuthProvider>
  );
}
