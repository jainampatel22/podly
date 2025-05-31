
import { redirect    } from 'next/navigation'
import {authOptions} from '../../api/auth/[...nextauth]/route'
import Sidebar from '@/components/SideBar'
import { getServerSession } from 'next-auth'
import { Button } from '@/components/ui/button'
import { ArrowRight,Upload,Calendar,Radio,ScissorsLineDashed,Disc} from 'lucide-react'
import VideoHover from '@/components/VideoHover'
import Link from 'next/link'
export default async function  Explore(){


const session = await getServerSession(authOptions)
if(!session){
    redirect('/sign-in')
}

const fetchstudioName = session?.user?.name
const studioName = (fetchstudioName ?? "user-studio").trim().toLowerCase().replace(/\s+/g, '-');


return (<>

<div className='flex bg-black min-h-screen'>
    <Sidebar/>
    
    
<Button className="flex mt-12 mx-auto items-center gap-2 bg-black border shadow-xl border-white rounded-2xl text-sm font-anzo py-1 px-3 hover:bg-gray-800 text-white border border-gray-500 relative md:ml-[37%] md:text-xl md:px-5 md:gap-3">
   <span className='font-inter'>Welcome to <span className='text-blue-700'>Podly</span></span>
  <ArrowRight className="text-white w-4 h-4 md:w-5 md:h-5" />
</Button>

</div>
<div className='-mt-[48%] ml-[27%] flex gap-14'>

<div className="mt-1  cursor-pointer items-center">
    <div className="w-12 h-12  border  border-red-600 hover:border hover:border-red-800 rounded-full flex items-center justify-center bg-transparent">
  <Link href={`/studio/${studioName}-studio`}>
    <Disc className="text-red-600 hover:text-red-800 " size={24} />
</Link>
  </div>
  <h1 className='font-inter text-white mt-1   text-md '>Record</h1>

</div>


<div className="mt-1 cursor-pointer items-center">
    <div className="w-12 h-12 border border-white hover:border hover:border-gray-600 rounded-full flex items-center justify-center bg-transparent">
    <ScissorsLineDashed className="text-white hover:text-gray-600" size={24} />
  </div>
<h1 className='font-inter text-white mt-1 ml-3  text-md '>Edit</h1>
</div>

<div className="mt-1 cursor-pointer items-center">
    <div className="w-12 h-12 border border-white rounded-full hover:border hover:border-gray-600 flex items-center justify-center bg-transparent">
    <Radio className="text-white hover:text-gray-600" size={24} />
  </div>
<h1 className='font-inter text-white mt-1 ml-2  text-md '>Live</h1>
</div>
<div className="mt-1 cursor-pointer items-center">
    <div className="w-12 h-12 border border-white  hover:border hover:border-gray-600 rounded-full flex items-center justify-center bg-transparent">
    <Calendar className="text-white hover:text-gray-600" size={24} />
  </div>
<h1 className='font-inter text-white mt-1 ml-3  text-md '>Plan</h1>
</div>
<div className="mt-1 cursor-pointer items-center">
  <div className="w-12 h-12 border border-white hover:border hover:border-gray-600 rounded-full flex items-center justify-center bg-transparent">
    <Upload className="text-white hover:text-gray-600" size={24} />
  </div>
  <h1 className="font-inter text-white mt-1  text-md">Import</h1>
</div>

</div>
<div className="text-center mt-14 bg-black  text-white">
      <h1 className="font-inter  font-semibold text-2xl">AI tools</h1>

      <VideoHover/>
    </div>
    <div className='bg-black h-10'>

    </div>
    
</>)
}