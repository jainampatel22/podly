'use client'
import { MagicCard } from "./magicui/magic-card"
import { Sparkles } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
interface Invite {
  id: string
  senderName: string
  reciverName: string
  date: string         
  time: string
  subject:string
 status: 'approved' | 'pending' | 'rejected'
  createdAt: string   
  email: string
   
}
import { useSession } from "next-auth/react";

import { useEffect, useState } from "react";
import axios from "axios";
export default  function Meetings(){
   const {data:session} = useSession()
    const [invites,setInvites] = useState<Invite[]>([])
    useEffect(() => {
      const fetchInvites = async () => {
        try {
          const res = await axios.get('http://localhost:3000/api/all-invites')
          setInvites(res.data)
          console.log(res.data)
        } catch (error) {
           console.error('Error fetching invites:', error)
        }
      }
      fetchInvites()
    }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
        default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '🎉'
      case 'rejected':
        return '✗'
        default:
        return '⏳'
    }
  }
  

  
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
                  {session?.user?.name}'s Meetings
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Meeting Cards */}
        <div className="grid grid-cols-1 px-4 sm:px-6 lg:px-10 py-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {invites.map((invite) => (
            <Card key={invite.id} className="p-0 max-w-sm w-full shadow-none border-none hover:scale-105 transition-transform duration-300">
              <MagicCard
                gradientColor={"#c7d2fe"}
                className="p-0 overflow-hidden"
              >
                <CardHeader className="border-b border-border p-4 [.border-b]:pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-slate-800">Meeting Details</CardTitle>
                <span className={`${getStatusColor(invite.status)} capitalize font-medium px-3 py-1 rounded-full text-xs border`}>
  <span className="mr-1">{getStatusIcon(invite.status)}</span>
  {invite.status}
</span>
                  </div>
                  <CardDescription className="text-slate-600 mt-2">
                    Scheduled meeting information
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-500 font-medium">Name</span>
                      <span className="text-sm text-slate-800 font-medium">{invite.reciverName}</span>
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
                      <span className="text-sm text-slate-800 font-medium">{new Date(invite.date)?.toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </MagicCard>
            </Card>
          ))}
        </div>
      </div>
    </div>
        </>
    )
}