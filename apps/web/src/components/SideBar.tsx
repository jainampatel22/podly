"use client";

import { useState } from "react";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  PartyPopper,
} from "lucide-react";
import { useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const userInitial = session?.user?.name?.trim().charAt(0).toUpperCase();

  const items = [
    { title: "Home", url: "#", icon: Home },
    { title: "Projects", url: "#", icon: Inbox },
    { title: "Calendar", url: "#", icon: Calendar },
    { title: "Scheduled", url: "#", icon: Search },
  ];

  const endIcons = [
    { title: "Settings", url: "#", icon: Settings },
    { title: "What's New ?", url: "#", icon: PartyPopper },
  ];

  return (
    <>
    
    <div
    className={`bg-black text-white min-h-screen fixed top-0 left-0 transition-[width] duration-500 ease-in-out ${isOpen ? "w-[200px]" : "w-1"} overflow-hidden`}

      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Logo */}
      {isOpen && (
        <div className="mt-7 flex ml-5 gap-2 items-center">
          <img
            src="https://shuttle.zip/images/homepage/icon.webp"
            width={35}
            height={35}
            alt=""
          />
          <h1 className="font-inter text-3xl">Podly</h1>
        </div>
      )}

      {/* Menu Items */}
      <div className="mt-14 ml-5 space-y-7">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 cursor-pointer hover:text-gray-300"
          >
            <item.icon size={24} />
            {isOpen && <span className="font-inter text-lg">{item.title}</span>}
          </div>
        ))}
      </div>

      {/* Footer Icons */}
      <div className="mt-40 ml-5 space-y-5">
        {endIcons.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 cursor-pointer hover:text-gray-300"
          >
            <item.icon size={24} />
            {isOpen && (
              <span className="font-inter text-lg">{item.title}</span>
            )}
          </div>
        ))}

        {/* User Avatar with Tooltip */}
        {session?.user?.image && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <img
                  src={session.user.image}
                  alt={userInitial}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{session.user.name || "User"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
    </>
  );
}
