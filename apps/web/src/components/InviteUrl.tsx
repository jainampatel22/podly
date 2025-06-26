'use client'
import { MagicCard } from "@/components/magicui/magic-card";
import { Sparkles } from "lucide-react"
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "axios";
interface Invite {
  id: string
  senderName: string
  reciverName: string
  date: string         
  time: string
  subject: string
  createdAt: string   
  email: string
}
export default function InviteUrl(props:{name:string}){
    const {name} =props
    const [invites,setInvites] = useState<Invite[]>([])
   const handleUpdate =async(status:'approved'|"rejected",id:string)=>{
try {
    const res = await axios.put('https://podly-web.vercel.app//api/invite-status',{
        id,status
    })
    console.log(res.data.message)
     setInvites(prevInvites => prevInvites.filter(invite => invite.id !== id))
} catch (error) {
    console.error('Failed to update invite:', error)
}
   }
    useEffect(()=>{
const invite = async()=>{
    const res = await axios.get(`https://podly-web.vercel.app/api/invite-for-meet?name=${name}`)
    console.log(res.data)
    setInvites(res.data)
}
invite()
    },[name])
    return (
        <>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400/20 to-pink-400/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-400/10 blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex-shrink-0 px-4 sm:px-6 lg:px-10 py-6">
          <div className="backdrop-blur-sm bg-white/60 border border-white/80 rounded-2xl p-6 shadow-lg shadow-blue-100/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <a href="/">
                  <h1 className="cursor-pointer text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    PODLY
                  </h1>
                </a>
                <p className="text-sm text-slate-600 mt-1">
                 
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Meeting Cards */}
        <div className="grid grid-cols-1 px-4 sm:px-6 lg:px-10 py-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
         {invites.map((invite)=>(

       
            <Card key={ invite.id} className="p-0 max-w-sm w-full shadow-none border-none hover:scale-105 transition-transform duration-300">
              <MagicCard
                gradientColor={"#c7d2fe"}
                className="p-0 overflow-hidden"
              >
                <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-slate-800">Meeting Details</CardTitle>
               
                  </div>
                  <CardDescription className="text-slate-600 mt-2">
                    Scheduled meeting information
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 font-medium">Name</span>
                      <span className="text-sm text-slate-800 font-medium">{invite.senderName}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 font-medium">Email</span>
                      <span className="text-sm text-slate-800 font-medium truncate ml-2">{invite.email}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 font-medium">Subject</span>
                      <span className="text-sm text-slate-800 font-medium">{invite.subject}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 font-medium">Time</span>
                      <span className="text-sm text-slate-800 font-medium">{invite.time}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 font-medium">Date</span>
                      <span className="text-sm text-slate-800 font-medium">{new Date(invite.date)?.toDateString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 gap-3 border-t border-border [.border-t]:pt-4">
          <Button className="w-full text-md bg-green-500 hover:bg-white hover:text-green-500" onClick={()=>handleUpdate('approved',invite.id)}>Accept</Button>
                   <Button className="w-full text-md bg-white border text-red-600 hover:text-white hover:bg-red-600" onClick={()=>handleUpdate('rejected',invite.id)}>Reject</Button> 
        </CardFooter>
              </MagicCard>
            </Card>
            ))}
        </div>
      </div>
    </div>
        </>
    )
}