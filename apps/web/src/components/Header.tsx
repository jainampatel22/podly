"use client"
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useSession } from "next-auth/react";
import { Button } from "./ui/button";

export default function Header() {
  const { data: session } = useSession();
  const userInitial = session?.user?.name?.trim().charAt(0).toUpperCase();

  return (
    <header className="border-b border-gray-300 px-4 md:px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <h1 className="text-2xl text-blue-700 font-inter font-bold">
          <Link href="/">Podler</Link>
        </h1>

        {/* Nav Links */}
        <nav className="hidden md:flex space-x-6 font-inter font-semibold text-[#020202] text-lg">
          <Link href='/pricing'>Pricing</Link>
          <Link href='/explore/home'>Explore</Link>
        </nav>

        {/* User Dropdown */}
        {session && (
          <div className="ml-2">
            {session.user?.image ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="p-0 rounded-full bg-gray-300 hover:bg-gray-200 shadow-xl">
                    <img
                      src={session.user.image}
                      alt={userInitial}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>
                    <p className="font-inter tracking-normal">My Account</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <p className="font-inter">Profile</p>
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <button className="font-inter" onClick={() => signOut()}>
                      Log out
                    </button>
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                {userInitial}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
