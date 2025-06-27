import "./globals.css";
import { ReactNode } from "react";
import { SocketProvider } from "@/context/SocketProvider";

export const metadata = {
  title: "Planning Poker",
  description: "Real-time estimation tool",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 dark:bg-gray-900">
        <SocketProvider>{children}</SocketProvider>
      </body>
    </html>
  );
}
