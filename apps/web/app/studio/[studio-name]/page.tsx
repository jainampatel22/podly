import { AuthOptions } from "next-auth"
import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import HostStream from "@/components/hostStream"

export default async function Studio() {
  const session = await getServerSession(authOptions)
  
  return (
    <>
      <div className="hidden md:block bg-black min-h-screen">
        {/* Header */}
        <div className="header gap-3 flex items-center px-4 sm:px-6 md:px-10 py-5">
          <img
            src="https://shuttle.zip/images/homepage/icon.webp"
            width={35}
            height={35}
            alt=""
          />
          <Link href="/">
            <h1 className="cursor-pointer text-xl sm:text-2xl font-semibold font-inter text-white">
              PODLY
            </h1>
          </Link>
          <div className="w-[2px] h-6 sm:h-8 bg-gray-400"></div>
          <h1 className="text-sm sm:text-md mt-1 cursor-pointer font-inter text-white truncate">
            {session?.user?.name}'s STUDIO
          </h1>
        </div>

        {/* Main Content */}
        <div className="px-4 sm:px-6 md:px-12 lg:px-24 py-6 sm:py-8 text-white mt-16 sm:mt-24 md:mt-36">
          <h1 className="text-sm sm:text-base lg:text-lg text-gray-400 font-inter">
            You're about to join {session?.user?.name}'s Studio
          </h1>
          <h1 className="font-inter mt-2 font-semibold text-white text-xl sm:text-2xl lg:text-3xl">
            Let's check your camera and mic
          </h1>
          
          {/* Input Section */}
          <div className="relative w-96 max-w-sm sm:max-w-md lg:max-w-lg mt-4 sm:mt-6">
            <Input
              placeholder={session?.user?.name || ""}
              className="placeholder:text-white bg-white/5 placeholder:font-inter placeholder:text-base sm:placeholder:text-lg w-full h-12 sm:h-14 pr-16 sm:pr-20 focus:border border:transparent focus:ring-0 focus:border-blue-700"
            />
            <div className="font-inter cursor-pointer absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-gray-800 rounded-xl text-white text-xs px-2 py-1">
              HOST
            </div>
          </div>

          {/* Host Stream Component */}
          <div className="mt-6 sm:mt-8">
            <HostStream />
          </div>
        </div>
      </div>
<div className="md:hidden bg-black/90 backdrop-blur-md  min-h-screen flex flex-col">
  <div className="bg-black text-white header gap-3 flex items-center px-4 sm:px-6 md:px-10 py-5">
    <img
      src="https://shuttle.zip/images/homepage/icon.webp"
      width={25}
      height={25}
      alt="logo"
    />
    <Link href="/">
      <h1 className="cursor-pointer text-lg sm:text-2xl font-semibold font-inter text-white">
        PODLY
      </h1>
    </Link>
    <div className="w-[2px] h-6 sm:h-8 bg-gray-400"></div>
    <h1 className="text-sm sm:text-md cursor-pointer font-inter text-white truncate">
      {session?.user?.name}'s STUDIO
    </h1>
  </div>

  <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
    <h1 className="text-white font-inter text-2xl sm:text-3xl font-semibold mb-4">
      You can't access this via mobile device
    </h1>
    <h1 className="text-white mt-4 font-inter text-xl sm:text-2xl">
      Please switch to a desktop device to continue
    </h1>
  </div>
</div>

       
    </>
  )
}