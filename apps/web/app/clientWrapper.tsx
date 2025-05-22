// app/ClientWrapper.tsx
'use client';
import { SocketProvider } from "./Context/SocketContext";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <SocketProvider>{children}</SocketProvider>;
}
