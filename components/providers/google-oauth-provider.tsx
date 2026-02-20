"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

interface GoogleOAuthProviderWrapperProps {
  children: React.ReactNode;
}

export function GoogleOAuthProviderWrapper({
  children,
}: GoogleOAuthProviderWrapperProps) {
  if (!GOOGLE_CLIENT_ID) {
    return <>{children}</>;
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
