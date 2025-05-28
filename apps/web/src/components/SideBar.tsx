"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  PartyPopper,
  Menu,
  Link
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
const [activeItem,SetActiveItem]=useState("Home")
  const items = [
    { title: "Home", url: "/home", icon: Home },
    { title: "Projects", url: "/explore/myprojects", icon: Inbox },
    { title: "Calendar", url: "/explore/calendar", icon: Calendar },
    { title: "Scheduled", url: "/explore/schedule", icon: Search },
  ];
const router = useRouter()
  const endIcons = [
    { title: "Settings", url: "/settings", icon: Settings },
    { title: "What's New ?", url: "/updates", icon: PartyPopper },
  ];

    function handleMenuClick(title: string,url:string): void {
      SetActiveItem(title)
      router.push(url)
    }

  return (
    <div>
        <Menu
  className={`bg-black text-white  rounded-xl p-1 fixed top-10 left-4 cursor-pointer z-20
    transition-opacity duration-300 ease-in-out
    ${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
  size={30}
  onClick={() => setIsOpen(true)}
/>
    <div
   className={`bg-black  text-white min-h-screen fixed top-0 left-0 overflow-hidden
  transition-[width] duration-1000 ease-in-out
  ${isOpen ? "w-[250px]" : "w-5"}`}
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
      <div className="mt-20 ml-5 space-y-7">
        {items.map((item, idx) => (
          
          <div
            key={idx} onClick={() => handleMenuClick(item.title,item.url)}
            className={`flex items-center gap-3 cursor-pointer hover:text-gray-300 transition-colors ${activeItem==item.title?"text-blue-700 ":"text-white"}` } >
                      <item.icon size={24} />
            {isOpen && <span className="font-inter text-lg">{item.title}</span>}
          </div>
        ))}
      </div>

      {/* Footer Icons */}
      <div className="mt-36 ml-5 space-y-5">
        {endIcons.map((item, idx) => (
          <div
            key={idx} onClick={() => handleMenuClick(item.title,item.url)}
            className={`flex items-center gap-3 cursor-pointer hover:text-gray-300 transition-colors ${activeItem==item.title?"text-blue-700 ":"text-white"}` }
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
    </div>
  );
}
