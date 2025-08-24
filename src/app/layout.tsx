import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { auth } from "@/lib/auth";
import AuthButtons from "@/components/AuthButtons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Knowbase AI",
  description: "Knowbase AI",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  console.log("session", session);
  const authed = Boolean(session);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="p-3 border-b-2 border-b-gray-600">
          <strong>Knowbase AI</strong>
          <span className="float-right">
            <AuthButtons authed={authed} />
          </span>
        </header>
        {children}
      </body>
    </html>
  );
}
