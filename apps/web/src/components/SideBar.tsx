"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  PartyPopper,
  Menu,
  X,
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
  const [isMobile, setIsMobile] = useState(false);
  const { data: session } = useSession();
  const userInitial = session?.user?.name?.trim().charAt(0).toUpperCase();
  const [activeItem, setActiveItem] = useState("Home");
  const router = useRouter();

  const items = [
    { title: "Home", url: "/home", icon: Home },
    { title: "Projects", url: "/explore/projects", icon: Inbox },
    { title: "Calendar", url: "/explore/calendar", icon: Calendar },
    { title: "Scheduled", url: "/explore/schedule", icon: Search },
  ];

  const endIcons = [
    { title: "Settings", url: "/settings", icon: Settings },
    { title: "What's New ?", url: "/updates", icon: PartyPopper },
  ];

  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isOpen) {
        const sidebar = document.getElementById('sidebar');
        const menuButton = document.getElementById('menu-button');
        
        if (sidebar && !sidebar.contains(event.target as Node) && 
            menuButton && !menuButton.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isOpen]);

  function handleMenuClick(title: string, url: string): void {
    setActiveItem(title);
    router.push(url);
    
    // Close sidebar on mobile after navigation
    if (isMobile) {
      setIsOpen(false);
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-white bg-opacity-50 z-40 md:hidden" />
      )}

      {/* Menu Button */}
      <button
        id="menu-button"
        className={`
          bg-white text-black mt-10  rounded-xl p-2 fixed top-4 left-4 cursor-pointer z-50
          transition-opacity duration-300 ease-in-out
          ${isOpen && isMobile ? "opacity-0 pointer-events-none" : "opacity-100"}
          md:${isOpen ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`
          bg-slate-50 text-black fixed top-0 left-0 z-50 overflow-hidden
          transition-transform duration-300 ease-in-out
          ${isMobile 
            ? `h-full w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'}` 
            : `min-h-screen transition-[width] duration-1000 ease-in-out ${isOpen ? 'w-[250px]' : 'w-5'}`
          }
        `}
        onMouseEnter={() => !isMobile && setIsOpen(true)}
        onMouseLeave={() => !isMobile && setIsOpen(false)}
      >
        {/* Close button for mobile */}
        {isMobile && isOpen && (
          <button
            className="absolute top-4 right-4 text-black hover:text-gray-300 z-10"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        )}

        {/* Logo */}
        {(isOpen || isMobile) && (
          <div className="mt-16 md:mt-7 flex ml-5 gap-2 items-center">
            <img
              src="https://shuttle.zip/images/homepage/icon.webp"
              width={35}
              height={35}
              alt="Podly Logo"
            />
            <h1 className="font-semibold text-slate-700  text-3xl group-hover:text-slate-900 transition-colors duration-300">Podler</h1>
          </div>
        )}

        {/* Menu Items */}
        <div className="mt-12 md:mt-20 ml-5 space-y-6 md:space-y-7">
          {items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleMenuClick(item.title, item.url)}
              className={`
                flex items-center gap-3 cursor-pointer hover:bg-slate-200 transition-colors
                ${activeItem === item.title ? "text-blue-500 bg-slate-200" : "text-black"}
                py-2 pr-4 rounded-r-lg 
              `}
            >
              <item.icon size={20} className="md:w-6 md:h-6" />
              {(isOpen || isMobile) && (
                <span className="font-semibold text-slate-700  text-lg group-hover:text-slate-900 transition-colors duration-300">{item.title}</span>
              )}
            </div>
          ))}
        </div>

        {/* Footer Icons */}
        <div className="mt-20 md:mt-56 ml-5 space-y-4 md:space-y-5">
          {endIcons.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleMenuClick(item.title, item.url)}
              className={`
                flex items-center gap-3 cursor-pointer  
                ${activeItem === item.title ? "text-blue-500 bg-slate-400" : "text-black"}
                py-2 pr-4 rounded-r-lg hover:bg-slate-200
              `}
            >
              <item.icon size={20} className="md:w-6 md:h-6" />
              {(isOpen || isMobile) && (
                <span className="font-semibold text-slate-700  text-lg group-hover:text-slate-900 transition-colors duration-300">{item.title}</span>
              )}
            </div>
          ))}

          {/* User Avatar with Tooltip */}
          {session?.user?.image && (isOpen || isMobile) && (
            <div className="mt-24 p-5 ">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <img
                      src={session.user.image}
                      alt={userInitial}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover cursor-pointer"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{session.user.name || "User"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    </>
  );
}