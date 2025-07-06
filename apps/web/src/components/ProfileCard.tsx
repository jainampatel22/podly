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
     <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10">
        <header className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          <div className="max-w-7xl mx-auto">
            <div className="backdrop-blur-sm bg-white/60 text-white border border-white/20 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center space-x-3 sm:space-x-4 shadow-lg">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                <Link href='/'>Podler</Link>
              </h1>
              <div className="w-px h-6 sm:h-8 bg-white/30"></div>
              <h2 className="text-black/90 font-bold text-sm sm:text-base truncate">
                {session?.user?.name}'s Studio
              </h2>
            </div>
          </div>
        </header>
        
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-10 mt-4 sm:mt-6">
          <div className="border border-black/20 p-4 sm:p-6 lg:p-10 rounded-2xl shadow-md">
            
            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
              {imageUrl && (
                <img 
                  src={imageUrl}
                  alt="Profile" 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0"
                />
              )}
              <h1 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
                {session?.user?.name}
              </h1>
            </div>

            {/* Email Section */}
            <div className="mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                <label htmlFor="Email" className="font-medium text-base sm:text-lg">Email</label>
                <div className="border border-black/20 rounded-xl px-3 sm:px-4 py-2 bg-gray-50 text-sm sm:text-base break-all sm:break-normal">
                  {session?.user?.email}
                </div>
              </div>
            </div>
           
            <div className="max-w-2xl mx-auto my-6 sm:my-8 border-t border-gray-300" />

            {/* Subscription Section */}
            <div className="mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                <label htmlFor="Subscription" className="font-medium text-base sm:text-lg">Subscription</label>
                <div className="border border-black/20 rounded-xl px-3 sm:px-4 py-2 bg-gray-50 text-sm sm:text-base">
                  {subscription}
                </div>
              </div>
            </div>

            {/* Subscription Dates */}
            {subscription == 'PRO' || subscription == "PROPlus" ? (
              <>
                <div className="mt-6 sm:mt-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                    <label htmlFor="StartDate" className="font-medium text-base sm:text-lg">Start date</label>
                    <div className="border border-black/20 rounded-xl px-3 sm:px-4 py-2 bg-gray-50 text-sm sm:text-base">
                      {subscriptionStartDate?.toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                    <label htmlFor="EndDate" className="font-medium text-base sm:text-lg">End date</label>
                    <div className="border border-black/20 rounded-xl px-3 sm:px-4 py-2 bg-gray-50 text-sm sm:text-base">
                      {subscriptionEndsDate?.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mt-6 sm:mt-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                    <label htmlFor="StartDate" className="font-medium text-base sm:text-lg">Start date</label>
                    <div className="border border-black/20 rounded-xl px-3 sm:px-4 py-2 bg-gray-50 text-sm sm:text-base">
                      -------
                    </div>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                    <label htmlFor="EndDate" className="font-medium text-base sm:text-lg">End date</label>
                    <div className="border border-black/20 rounded-xl px-3 sm:px-4 py-2 bg-gray-50 text-sm sm:text-base">
                      -------
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Total Time Section */}
            <div className="mt-6 sm:mt-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
                <label htmlFor="TotalTime" className="font-medium text-base sm:text-lg">Total Time spend</label>
                <div className="border border-black/20 rounded-xl px-3 sm:px-4 py-2 bg-gray-50 text-sm sm:text-base">
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