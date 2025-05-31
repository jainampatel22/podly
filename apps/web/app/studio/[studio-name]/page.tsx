import { AuthOptions } from "next-auth"
import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import HostStream from "@/components/hostStream"
export default async function Studio (){
   const session = await getServerSession(authOptions)
    return (
        <>
        <div className="bg-black min-h-screen">
<div className="header gap-3 flex ml-10 p-5">
  <img
            src="https://shuttle.zip/images/homepage/icon.webp"
            width={35}
            height={35}
            alt=""
          />
          <Link href="/"><h1 className="cursor-pointer text-2xl font-semibold  font-inter text-white">PODLY</h1></Link>
          <div className="w-[2px] h-8 bg-gray-400"></div>
          
          <h1 className="text-md mt-1 cursor-pointer font-inter text-white">{session?.user?.name}'s STUDIO</h1>


</div>
<div className="ml-24  p-3 text-white mt-36">
<h1 className="font-lg text-gray-400 font-inter">You're about to join {session?.user?.name}'s Studio</h1>
<h1 className="font-inter mt-2 font-semibold text-white text-2xl">Let's check your camera and mic</h1>
<div className="relative w-96 mt-2">
    <Input
      placeholder={session?.user?.name || ""}
      className="placeholder:text-white bg-white/5 placeholder:font-inter placeholder:text-lg w-full h-14 pr-20 focus:border border:transparent focus:ring-0 focus:border-blue-700"
    />
    <div className="font-inter cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 bg-gray-800 rounded-xl text-white text-xs px-2 py-1 rounded">
HOST    </div>
</div>

<HostStream/>
</div>
        </div>
        </>
    )
}