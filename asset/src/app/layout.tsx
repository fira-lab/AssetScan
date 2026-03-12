import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../css/style.css";
import Navbar from "./Navbar/page";
import { ThemeProvider } from "next-themes";

import { ChakraProvider } from "@chakra-ui/react";

import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "g-omm global onesmos missionary movement",
  description: "A powerful admin dashboard built with Next.js and Clerk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ChakraProvider>
        <html lang="en" suppressHydrationWarning>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <ThemeProvider attribute="class">
              {/* Header Section */}
              <Navbar />

              {/* Main Content */}
              <main>{children}</main>

              {/* ScrollToTop at root level */}
            </ThemeProvider>
          </body>
        </html>
      </ChakraProvider>
    </ClerkProvider>
  );
}
