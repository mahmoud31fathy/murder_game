import type { Metadata } from "next";
import { Libre_Caslon_Text, Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const libreCaslonText = Libre_Caslon_Text({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-libre-caslon",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

import { LanguageProvider } from "@/components/LanguageProvider";

export const metadata: Metadata = {
  title: "A Crime at the Closed Gallery",
  description: "A live-action multiplayer murder mystery game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${libreCaslonText.variable} ${geist.variable} ${jetbrainsMono.variable} bg-background text-on-background font-body-md min-h-screen overflow-x-hidden selection:bg-primary-container selection:text-white`}
      >
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
