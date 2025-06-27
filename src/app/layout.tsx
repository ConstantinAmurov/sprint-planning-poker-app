import "./globals.css";
import { ReactNode } from "react";
import { WebSocketProvider } from "@/context/WebSocketContext";

export const metadata = {
  title: "Planning Poker",
  description: "Real-time estimation tool",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <header className="bg-neutral-800 p-4 text-white text-lg font-bold shadow-xl">
        {metadata.title}
      </header>
      <body className="bg-neutral-50 dark:bg-gray-900">
        <WebSocketProvider>{children}</WebSocketProvider>
      </body>
    </html>
  );
}
