'use client'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/SideBar'
import { Button } from '@/components/ui/button'
import { ArrowRight, Upload, Radio, ScissorsLineDashed, Disc, Sparkles } from 'lucide-react'
import VideoHover from '@/components/VideoHover'
import Link from 'next/link'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"

import React from 'react'


export default function ExploreHome() {
  const { data: session } = useSession()
  const router= useRouter()
  if (!session) {
    redirect('/sign-in')
  }
  const [error, setError] = useState<string | null>(null);
const [loading,setLoading] =useState<boolean>(false)

  const fetchstudioName = session?.user?.name
  const studioName = (fetchstudioName ?? "user-studio").trim().toLowerCase().replace(/\s+/g, '-');
const [open, setOpen] = useState(false);
const [time, setTime] = React.useState(dayjs())
const [ name,setName]= useState<string | undefined>('Jainam Patel')
const [email, setEmail] = useState<string | undefined>('')
const [subject, setSubject] = useState<string | undefined>('Late Night Talks')
const [date, setDate] = React.useState<Date | undefined>(new Date())
  const actionItems = [
    {
      id: 'record',
      icon: Disc,
      label: 'Record',
      href: `/studio/${studioName}-studio`,
      color: 'from-red-500 to-pink-600',
      hoverColor: 'hover:from-red-600 hover:to-pink-700',
      shadow: 'shadow-red-500/25 hover:shadow-red-500/40'
    },
    {
      id: 'edit',
      icon: ScissorsLineDashed,
      label: 'Edit',
      href: '#',
      color: 'from-purple-500 to-indigo-600',
      hoverColor: 'hover:from-purple-600 hover:to-indigo-700',
      shadow: 'shadow-purple-500/25 hover:shadow-purple-500/40'
    },
   
    {
      id: 'plan',
      icon: Upload,
      label: 'Plan',
      href: '#',
      color: 'from-blue-500 to-cyan-600',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-700',
      shadow: 'shadow-blue-500/25 hover:shadow-blue-500/40'

    },
    {
      id: 'import',
      icon: Upload,
      label: 'Import',
      href: '#',
      color: 'from-orange-500 to-yellow-600',
      hoverColor: 'hover:from-orange-600 hover:to-yellow-700',
      shadow: 'shadow-orange-500/25 hover:shadow-orange-500/40'
    }
  ];

const sendMail = async()=>{
    if (!name || !email || !subject || !date || !time) {
    setError("All fields are required.");
    return;
  }
  setError(null);
  setLoading(true)
try {
  const response = await axios.post('http://localhost:5050/send-mail',{
    name,
    email,
    subject,
    date: date?.toLocaleDateString(),
    time: time.format('hh:mm A')
  })
  
  
  const validDate = date?.toISOString()
  const user1 = session?.user?.name
  
  await axios.post('http://localhost:3000/api/invite',{
    senderName:user1,
    reciverName:name,
    date:validDate,
    email,
    subject,
    time:time.format('hh:mm A'),

  })
setOpen(false)

} catch (error) {
  alert('Failed to send email.');
      console.error(error);
}
finally{
  setLoading(false)
}
}
  return (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-400/20 to-pink-400/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-400/10 to-blue-400/10 blur-3xl"></div>
      </div>

      {/* Desktop Layout with Sidebar */}
      <div className="hidden lg:flex relative z-10">
        <Sidebar />
        <div className="flex-1">
          {/* Welcome Section - Desktop */}
          <div className="flex justify-center pt-12">
            <div className="backdrop-blur-sm bg-white/60 border border-white/80 rounded-2xl p-6 shadow-lg shadow-blue-100/50 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl cursor-pointer font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">Podler</span>
                </span>
                <ArrowRight className="text-slate-600 w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Action Items - Desktop */}
          <div className="flex justify-center gap-8 mt-16 px-8">
            {actionItems.map((item, index) => {
              const IconComponent = item.icon;
              if(item.id === 'plan'){
                return (
                   <Dialog key={item.id} open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div
              className="group cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setOpen(true)}
            >
              <div className="flex flex-col items-center">
                <div className={`
                  w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} ${item.hoverColor}
                  flex items-center justify-center shadow-lg ${item.shadow}
                  transition-all duration-300 hover:scale-110 hover:shadow-xl
                  group-hover:animate-pulse backdrop-blur-sm
                `}>
                  <IconComponent className="text-white w-7 h-7" />
                </div>
                <h3 className="font-semibold text-slate-700 mt-3 text-lg group-hover:text-slate-900 transition-colors duration-300">
                  {item.label}
                </h3>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
            <DialogTitle>Schedule Call </DialogTitle>
            <DialogDescription>
             schedule a your call with your friends, family or special one&apos;s
              
            </DialogDescription>
          </DialogHeader>
           {error && (
    <div className="text-red-600 font-medium mb-2">{error}</div>
  )}
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" value={name} onChange={(e)=>setName(e.target.value)}  />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Email</Label>
              <Input id="username-1" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} type="email"  />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Subject</Label>
              <Input id="username-1" name="subject" value={subject} onChange={(e)=>setSubject(e.target.value)}  />
            </div>
               <div className="grid gap-3">
                  <Label htmlFor="username-1">Pick a date</Label>
         <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border sm:ml-24 shadow-sm"
      captionLayout="dropdown"
    />
 
       
       
               </div>
               <div className="grid gap-3">
                  <Label htmlFor="username-1">Pick a Time</Label>
        
    <TimePicker
  value={time}
  onChange={(newValue) => {
    if (newValue !== null) setTime(newValue)
  }}
  slotProps={{
    textField: {
      fullWidth: true,
      sx: {
        // Input border when focused
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'black',
        },
        // Label color when focused
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'black',
        },
        // Remove blue focus ring
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused': {
            boxShadow: '0 0 0 1px black', // optional subtle glow
            outline: 'none',
          },
        },
      },
    },
  }}
/>
{/* {name}
{email}
{subject}
{date?.toLocaleDateString()}
{time.format('hh:mm A')} */}
        </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
<Button type="submit" onClick={sendMail} disabled={loading}>
  {loading ? "Sending..." : "Save changes"}
</Button>
   </DialogFooter>
          </DialogContent>
        </Dialog>
                )
              }
              return (
                <div
                  key={item.id}
                  className="group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link href={item.href}>
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} ${item.hoverColor}
                        flex items-center justify-center shadow-lg ${item.shadow}
                        transition-all duration-300 hover:scale-110 hover:shadow-xl
                        group-hover:animate-pulse backdrop-blur-sm
                      `}>
                        <IconComponent className="text-white w-7 h-7" />
                      </div>
                      <h3 className="font-semibold text-slate-700 mt-3 text-lg group-hover:text-slate-900 transition-colors duration-300">
                        {item.label}
                      </h3>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* AI Tools Section - Desktop */}
          <div className="mt-20 px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-3 backdrop-blur-sm bg-white/40 border border-white/60 rounded-2xl px-6 py-3 shadow-lg shadow-blue-100/50">
                <Sparkles className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  AI Tools
                </h2>
              </div>
            </div>
            <div className=" rounded-3xl p-8 shadow-lg shadow-blue-100/50">
              <VideoHover />
            </div>
          </div>
          <div className="h-10"></div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden relative z-10">
        {/* Welcome Section - Mobile */}
        <div className="flex justify-center pt-6 px-4">
          <div className="backdrop-blur-sm bg-white/60 border border-white/80 rounded-2xl p-4 shadow-lg shadow-blue-100/50 animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Podly</span>
              </span>
              <ArrowRight className="text-slate-600 w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Action Items Grid - Mobile */}
        <div className="px-4 mt-8">
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {actionItems.slice(0, 4).map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.id}
                  className="group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Link href={item.href}>
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} ${item.hoverColor}
                        flex items-center justify-center shadow-lg ${item.shadow}
                        transition-all duration-300 hover:scale-110 hover:shadow-xl
                        group-hover:animate-pulse backdrop-blur-sm
                      `}>
                        <IconComponent className="text-white w-7 h-7" />
                      </div>
                      <h3 className="font-semibold text-slate-700 mt-2 text-sm group-hover:text-slate-900 transition-colors duration-300">
                        {item.label}
                      </h3>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Import - Full Width on Mobile */}
          <div className="flex justify-center mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="group cursor-pointer">
              {/* <Link href={actionItems[4]?.href}> */}
                <div className="flex flex-col items-center">
                  <div className={`
                    w-16 h-16 rounded-2xl bg-gradient-to-br ${actionItems[4]?.color} ${actionItems[4]?.hoverColor}
                    flex items-center justify-center shadow-lg ${actionItems[4]?.shadow}
                    transition-all duration-300 hover:scale-110 hover:shadow-xl
                    group-hover:animate-pulse backdrop-blur-sm
                  `}>
                    <Upload className="text-white w-7 h-7" />
                  </div>
                  <h3 className="font-semibold text-slate-700 mt-2 text-sm group-hover:text-slate-900 transition-colors duration-300">
                    {actionItems[4]?.label}
                  </h3>
                </div>
              
            </div>
          </div>
        </div>

        {/* AI Tools Section - Mobile */}
        <div className="mt-12 px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 backdrop-blur-sm bg-white/40 border border-white/60 rounded-2xl px-4 py-2 shadow-lg shadow-blue-100/50">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                AI Tools
              </h2>
            </div>
          </div>
          <div className="backdrop-blur-sm bg-white/30 border border-white/50 rounded-3xl p-6 shadow-lg shadow-blue-100/50">
            <VideoHover />
          </div>
        </div>
        <div className="h-8"></div>
      </div>
   </div>
  </LocalizationProvider>
  );
}
