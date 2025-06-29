'use client'

import { Button } from '@/components/ui/button'

import { useSession } from 'next-auth/react'
import ExploreHome from '@/components/ExploreHome'
import axios from 'axios'
import { useState } from 'react'
import React from 'react'
import dayjs from 'dayjs'
import { redirect, useRouter } from 'next/navigation'
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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
export default  function Explore() {
    const {data:session}=useSession()
    const fetchstudioName = session?.user?.name
    const studioName = (fetchstudioName ?? "user-studio").trim().toLowerCase().replace(/\s+/g, '-');
  const [open, setOpen] = useState(false);
  const [time, setTime] = React.useState(dayjs())
  const [ name,setName]= useState<string | undefined>('')
  const [email, setEmail] = useState<string | undefined>('')
  const [subject, setSubject] = useState<string | undefined>('Late Night Talks')
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const router= useRouter()
 
  const [error, setError] = useState<string | null>(null);
const [loading,setLoading] =useState<boolean>(false)
 if (!session) { redirect(`/sign-in?callbackUrl=/schedule`) }
const sendMail = async()=>{
    if (!name || !email || !subject || !date || !time) {
    setError("All fields are required.");
    return;
  }
  setError(null);
  setLoading(true)
try {
  const response = await axios.post('https://podly-email-system.onrender.com/send-mail',{
    name,
    email,
    subject,
    date: date?.toLocaleDateString(),
    time: time.format('hh:mm A')
  })
  
  
  const validDate = date?.toISOString()
  const user1 = session?.user?.name
  
  await axios.post('/api/invite',{
    senderName:user1,
    reciverName:name,
    date:validDate,
    email,
    subject,
    time:time.format('hh:mm A'),

  })




} catch (error) {
  alert('Failed to send email.');
      console.error(error);
}
finally{
  setLoading(false)
  router.push('/explore/meetings')
}
}
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Dialog open={true}>
          <DialogTrigger asChild>
            <div
              className="group cursor-pointer animate-fade-in"
              
            
            >
              <div className="flex flex-col items-center">
                <div className={`
                  w-16 h-16 rounded-2xl bg-gradient-to-br 
                  flex items-center justify-center shadow-lg $
                  transition-all duration-300 hover:scale-110 hover:shadow-xl
                  group-hover:animate-pulse backdrop-blur-sm
                `}>
                  {/* <IconComponent className="text-white w-7 h-7" /> */}
                </div>
                <h3 className="font-semibold text-slate-700 mt-3 text-lg group-hover:text-slate-900 transition-colors duration-300">
                  {/* {item.label} */}
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
       
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'black',
        },
       
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'black',
        },
       
        '& .MuiOutlinedInput-root': {
          '&.Mui-focused': {
            boxShadow: '0 0 0 1px black', 
            outline: 'none',
          },
        },
      },
    },
  }}
/>

        </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={()=>router.push('/')}  variant="outline">Cancel</Button>
            </DialogClose>
<Button type="submit" onClick={sendMail} disabled={loading}>
  {loading ? "Sending..." : "Save changes"}

</Button>
   </DialogFooter>
          </DialogContent>
        </Dialog>
        </LocalizationProvider>
  );
}