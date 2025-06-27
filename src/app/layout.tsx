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
      <body className="bg-neutral-50 dark:bg-gray-900">
        <header className="bg-neutral-800 p-4 text-white text-lg font-bold shadow-xl">
          {metadata.title}
        </header>
        <WebSocketProvider>{children}</WebSocketProvider>
        <footer></footer>
      </body>
    </html>
  );
}
