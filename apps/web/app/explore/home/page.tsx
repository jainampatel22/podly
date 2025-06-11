import { redirect } from 'next/navigation'
import { authOptions } from '../../api/auth/[...nextauth]/route'
import Sidebar from '@/components/SideBar'
import { getServerSession } from 'next-auth'
import { Button } from '@/components/ui/button'
import { ArrowRight, Upload, Calendar, Radio, ScissorsLineDashed, Disc } from 'lucide-react'
import VideoHover from '@/components/VideoHover'
import Link from 'next/link'

export default async function Explore() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/sign-in')
  }

  const fetchstudioName = session?.user?.name
  const studioName = (fetchstudioName ?? "user-studio").trim().toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="bg-black min-h-screen">
      {/* Desktop Layout with Sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
        <div className="flex-1">
          {/* Welcome Button - Desktop */}
          <div className="flex justify-center pt-12">
            <Button className="flex items-center gap-3 bg-black border border-white rounded-2xl text-xl font-inter py-3 px-6 hover:bg-gray-800 text-white shadow-xl">
              <span className="font-inter">Welcome to <span className="text-blue-700">Podly</span></span>
              <ArrowRight className="text-white w-5 h-5" />
            </Button>
          </div>

          {/* Action Items - Desktop */}
          <div className="flex justify-center gap-14 mt-16">
            <div className="flex flex-col items-center cursor-pointer group">
              <div className="w-12 h-12 border border-red-600 hover:border-red-800 rounded-full flex items-center justify-center bg-transparent">
                <Link href={`/studio/${studioName}-studio`}>
                  <Disc className="text-red-600 hover:text-red-800" size={24} />
                </Link>
              </div>
              <h1 className="font-inter text-white mt-1 text-md">Record</h1>
            </div>

            <div className="flex flex-col items-center cursor-pointer group">
              <div className="w-12 h-12 border border-white hover:border-gray-600 rounded-full flex items-center justify-center bg-transparent">
                <ScissorsLineDashed className="text-white hover:text-gray-600" size={24} />
              </div>
              <h1 className="font-inter text-white mt-1 text-md">Edit</h1>
            </div>

            <div className="flex flex-col items-center cursor-pointer group">
              <div className="w-12 h-12 border border-white hover:border-gray-600 rounded-full flex items-center justify-center bg-transparent">
                <Radio className="text-white hover:text-gray-600" size={24} />
              </div>
              <h1 className="font-inter text-white mt-1 text-md">Live</h1>
            </div>

            <div className="flex flex-col items-center cursor-pointer group">
              <div className="w-12 h-12 border border-white hover:border-gray-600 rounded-full flex items-center justify-center bg-transparent">
                <Calendar className="text-white hover:text-gray-600" size={24} />
              </div>
              <h1 className="font-inter text-white mt-1 text-md">Plan</h1>
            </div>

            <div className="flex flex-col items-center cursor-pointer group">
              <div className="w-12 h-12 border border-white hover:border-gray-600 rounded-full flex items-center justify-center bg-transparent">
                <Upload className="text-white hover:text-gray-600" size={24} />
              </div>
              <h1 className="font-inter text-white mt-1 text-md">Import</h1>
            </div>
          </div>

          {/* AI Tools Section - Desktop */}
          <div className="mt-14 text-white">
            <h1 className="font-inter text-center font-semibold text-2xl">AI tools</h1>
            <VideoHover />
          </div>
          <div className="h-10"></div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Welcome Button - Mobile */}
        <div className="flex justify-center pt-6 px-4">
          <Button className="flex items-center gap-2 bg-black border border-white rounded-2xl text-sm font-inter py-2 px-4 hover:bg-gray-800 text-white shadow-xl">
            <span className="font-inter">Welcome to <span className="text-blue-700">Podly</span></span>
            <ArrowRight className="text-white w-4 h-4" />
          </Button>
        </div>

        {/* Action Items Grid - Mobile */}
        <div className="px-4 mt-8">
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {/* Record */}
            <div className="flex flex-col items-center cursor-pointer group">
              <div className="w-16 h-16 border border-red-600 hover:border-red-800 rounded-full flex items-center justify-center bg-transparent">
                <Link href={`/studio/${studioName}-studio`}>
                  <Disc className="text-red-600 hover:text-red-800" size={28} />
                </Link>
              </div>
              <h1 className="font-inter text-white mt-2 text-sm">Record</h1>
            </div>

            {/* Edit */}
            <div className="flex flex-col items-center cursor-pointer group">
              <div className="w-16 h-16 border border-white hover:border-gray-600 rounded-full flex items-center justify-center bg-transparent">
                <ScissorsLineDashed className="text-white hover:text-gray-600" size={28} />
              </div>
              <h1 className="font-inter text-white mt-2 text-sm">Edit</h1>
            </div>

            {/* Live */}
            <div className="flex flex-col items-center cursor-pointer group">
              <div className="w-16 h-16 border border-white hover:border-gray-600 rounded-full flex items-center justify-center bg-transparent">
                <Radio className="text-white hover:text-gray-600" size={28} />
              </div>
              <h1 className="font-inter text-white mt-2 text-sm">Live</h1>
            </div>

            {/* Plan */}
            <div className="flex flex-col items-center cursor-pointer group">
              <div className="w-16 h-16 border border-white hover:border-gray-600 rounded-full flex items-center justify-center bg-transparent">
                <Calendar className="text-white hover:text-gray-600" size={28} />
              </div>
              <h1 className="font-inter text-white mt-2 text-sm">Plan</h1>
            </div>
          </div>

          {/* Import - Full Width on Mobile */}
          <div className="flex justify-center mt-4">
            <div className="flex flex-col items-center cursor-pointer group">
              <div className="w-16 h-16 border border-white hover:border-gray-600 rounded-full flex items-center justify-center bg-transparent">
                <Upload className="text-white hover:text-gray-600" size={28} />
              </div>
              <h1 className="font-inter text-white mt-2 text-sm">Import</h1>
            </div>
          </div>
        </div>

        {/* AI Tools Section - Mobile */}
        <div className="mt-12  text-white">
          <h1 className="font-inter text-center font-semibold text-xl mb-6">AI tools</h1>
          <VideoHover />
        </div>
        <div className="h-8"></div>
      </div>
    </div>
  );
}