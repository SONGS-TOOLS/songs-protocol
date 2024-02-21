import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

import { cookieToInitialState } from "wagmi";

import { config } from "@/config";
import { ContextProvider } from "@/context";
import { PageProvider } from "@/context/PageContext";

export const metadata: Metadata = {
  title: "App | Mufi",
  description: "Mufi | Universal Music Distribution Protocol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialState = cookieToInitialState(config, headers().get("cookie"));
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ContextProvider initialState={initialState}>
          <PageProvider>{children}</PageProvider>
        </ContextProvider>
      </body>
    </html>
  );
}
