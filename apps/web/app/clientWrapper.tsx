// app/ClientWrapper.tsx
'use client';
import { SessionProvider } from "next-auth/react";
import { SocketProvider } from "./Context/SocketContext";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <SessionProvider> <SocketProvider>{children}</SocketProvider></SessionProvider>;
}
