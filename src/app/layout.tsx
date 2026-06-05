import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sec+ Prep - CompTIA Security+ SY0-701 Exam Practice",
  description: "Practice with 110+ real CompTIA Security+ SY0-701 exam questions, PBQs, and detailed explanations. Track your progress and pass with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="9737526c-26c9-45e0-80be-20ae4b53ad44"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

