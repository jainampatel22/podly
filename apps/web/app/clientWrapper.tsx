
'use client';
import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "./Context/SocketContext";
import { Toaster } from "@/components/ui/sonner";
export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SocketProvider>
        {children}
        <Toaster />
      </SocketProvider>
    </SessionProvider>
  );
}
