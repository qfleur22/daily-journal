import type { Metadata } from "next";
import "@/app/globals.css";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { GoogleOAuthProviderWrapper } from "@/components/providers/google-oauth-provider";

export const metadata: Metadata = {
  title: "Daily Journal",
  description: "Daily check-in and journal for tracking your day",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <GoogleOAuthProviderWrapper>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
        <Footer />
        </GoogleOAuthProviderWrapper>
      </body>
    </html>
  );
}
