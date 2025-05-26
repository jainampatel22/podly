"use client"
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
 
import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
export default function Header(){
    const {data:session} = useSession()
    const userInitial = session?.user?.name?.trim().charAt(0).toUpperCase()
  return (<>
    <div >
    <div className=" rounded-xl pt-5 mx-80 p-3">
  <div className="flex justify-between">
    <div>
      <h1 className="text-2xl text-blue-700 font-inter font-bold ml-3">Podly</h1>
    </div>
    <div className="flex font-inter font-semibold text-[#020202] text-xl gap-7">
      <h1><Link href='/pricing'>Pricing</Link></h1>
      <h1><Link href='/explore'>Explore</Link></h1>
    </div>
  </div>

  {/* Line below the navbar */}
  <div className="h-[1px] bg-gray-300 mt-3"></div>
</div>
</div>
{
    session && (
         <div className="ml-[95%] -mt-14">
       {
        session.user?.image? (
            <>
            <DropdownMenu>
                     <DropdownMenuTrigger asChild>
            <Button className="p-0 rounded-full bg-gray-300 hover:bg-gray-200 shadow-xl "  >
                <img src={session.user.image} alt={userInitial} className="w-8 cursor-pointer h-8 rounded-full object-cover"/>
            </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent className="w-56">
        <DropdownMenuLabel><p className="font-inter tracking-normal">My Account</p></DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <p className="font-inter ">Profile</p>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
       
        <DropdownMenuItem>
        <button className="font-inter" onClick={()=>signOut()}>Log out</button>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
            </DropdownMenu>
          
   
            </>

        ):(<>
        <div className="w-8 h-8 cursor-pointer rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
              {userInitial}
            </div>
        </>)
       }
        </div>
    )
}



    </>)
}