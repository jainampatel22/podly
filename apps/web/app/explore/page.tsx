import { redirect    } from 'next/navigation'
import {authOptions} from '../api/auth/[...nextauth]/route'
import Sidebar from '@/components/SideBar'
import { getServerSession } from 'next-auth'
import Header from '@/components/Header'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default async function  Explore(){

const session = await getServerSession(authOptions)
if(!session){
    redirect('/sign-in')
}

return (<>
<div className='flex bg-black min-h-screen'>
    <Sidebar/>
    
{/* <Button className="flex mt-20 mx-auto items-center gap-2 bg-black border shadow-xl border-white rounded-2xl text-sm font-anzo py-1 px-3 hover:bg-gray-800 text-white border border-gray-500 relative md:ml-[37%] md:text-xl md:px-5 md:gap-3">
   <span className='font-inter'>Welcome to <span className='text-blue-700'>Podly</span></span>
  <ArrowRight className="text-white w-4 h-4 md:w-5 md:h-5" />
</Button> */}
</div>
</>)
}