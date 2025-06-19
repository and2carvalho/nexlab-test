import type { Metadata } from "next";
import { ReactNode } from "react";

import "./globals.css";
import AppContextProvider from "@/context";


export const metadata: Metadata = {
  title: "NexLab Photo Code",
  description: "Easy photo share app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      </head>
      <body>
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
