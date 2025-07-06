'use client'

import { Sparkles } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Input } from "./ui/input"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
export default function ProfileCard(){
const {data:session}=useSession()
const [subscription,setSubscription]=useState('Free')
const [subscriptionStartDate, setSubscriptionStartDate] = useState<Date | null>(null);
const [subscriptionEndsDate, setSubscriptionEndsDate] = useState<Date | null>(null);
const [feature,setFeature]= useState('')
const [time,setTime]=useState<number | null>(null)

if(!session){
redirect('/sign-in')
}
const userName = session.user?.name
const Useremail = session.user?.email
const formatDuration = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.post('/api/get-user-info', {
        email: Useremail as string,
      });

      setSubscription(response.data.subscription);
      setSubscriptionStartDate(new Date(response.data.subscriptionStartedAt))
      setSubscriptionEndsDate(new Date(response.data.subscriptionEndsAt))
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  fetchData(); 
}, [Useremail]);


useEffect(()=>{
const fetchData  = async()=>{
    try {
        const response = await axios.get('/api/log-usage')
       
        setTime(response.data.used)
    } catch (error) {
          console.error("Error fetching user info:", error);
    }
}
fetchData()
},[Useremail])
const imageUrl = session.user?.image
    return (<>
     <div className="min-h-screen  relative overflow-hidden">
      <div className="hidden  md:block relative z-10">
        <header className="px-4 sm:px-6 lg:px-8 pt-6">
          <div className="max-w-7xl mx-auto">
            <div className="backdrop-blur-sm bg-white/60 text-white border border-white/20 rounded-2xl px-6 py-4 flex items-center space-x-4 shadow-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 " />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                <Link href='/'>Podler</Link>
              </h1>
              <div className="w-px h-8 bg-white/30"></div>
              <h2 className="text-black/90 font-bold">
                {session?.user?.name}'s Studio
              </h2>
            </div>
          </div>
        </header>
                <div className="max-w-2xl mx-auto p-10 mt-6">
  <div className="border border-black/20 p-10 rounded-2xl shadow-md">
    
   
    <div className="flex items-center gap-6">
     {
        imageUrl && (
             <img 
        src={imageUrl}
        alt="Profile " 
        className="w-20 h-20 rounded-full object-cover"
      />
        )
     }
      <h1 className="text-2xl font-semibold">{session?.user?.name}</h1>
    </div>

  
    <div className="mt-8">
      <div className="flex justify-between items-center text-lg">
        <label htmlFor="Email" className="font-medium">Email</label>
        <div className="border border-black/20 rounded-xl px-4 py-2 bg-gray-50">
          {session?.user?.email}
          
        </div>
      </div>
    </div>
   
  <div className="max-w-2xl mx-auto my-8 border-t border-gray-300" />


          <div className="mt-8">
      <div className="flex justify-between items-center text-lg">
        <label htmlFor="Email" className="font-medium">Subscription</label>
        <div className="border border-black/20 rounded-xl px-4 py-2 bg-gray-50">
          {subscription}
        </div>
      </div>
    </div>

   {
    subscription =='PRO' || subscription =="PROPlus" ?(<>  <div className="mt-8">
      <div className="flex justify-between items-center text-lg">
        <label htmlFor="Email" className="font-medium"> Start date</label>
        <div className="border border-black/20 rounded-xl px-4 py-2 bg-gray-50">
      {subscriptionStartDate?.toLocaleDateString()}
        </div>
      </div>
    </div>

    <div className="mt-8">
      <div className="flex justify-between items-center text-lg">
        <label htmlFor="Email" className="font-medium"> End date</label>
        <div className="border border-black/20 rounded-xl px-4 py-2 bg-gray-50">
       {subscriptionEndsDate?.toLocaleDateString()}
        </div>
      </div>
    </div></>):(<>
    <div className="mt-8">
      <div className="flex justify-between items-center text-lg">
        <label htmlFor="Email" className="font-medium"> Start date</label>
        <div className="border border-black/20 rounded-xl px-4 py-2 bg-gray-50">
-------
        </div>
      </div>
    </div>

    <div className="mt-8">
      <div className="flex justify-between items-center text-lg">
        <label htmlFor="Email" className="font-medium"> End date</label>
        <div className="border border-black/20 rounded-xl px-4 py-2 bg-gray-50">
  -------
        </div>
      </div>
    </div>
    
    </>)
   }
  
{/* <div className="mt-8">
      <div className="flex justify-between items-center text-lg">
        <label htmlFor="Email" className="font-medium">  Feature</label>
        <div className="border border-black/20 rounded-xl px-4 py-2 bg-gray-50">
       {feature}
        </div>
      </div>
    </div> */}

<div className="mt-8">
      <div className="flex justify-between items-center text-lg">
        <label htmlFor="Email" className="font-medium">  Total Time spend</label>
        <div className="border border-black/20 rounded-xl px-4 py-2 bg-gray-50">
       {formatDuration(time ?? 0)}
        </div>
      </div>
    </div>

  </div>
</div>

        </div>
        </div>
    
        </>)
}