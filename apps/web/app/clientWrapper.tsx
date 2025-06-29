
'use client';
import { Analytics } from "@vercel/analytics/next"
import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "./Context/SocketContext";
import { Toaster } from "@/components/ui/sonner";
import PageViewTracker from "./analytics/page";
export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SocketProvider>
        {children}
        <PageViewTracker/>
        <Analytics/>
        <Toaster position="top-right" />
      </SocketProvider>
    </SessionProvider>
  );
}
