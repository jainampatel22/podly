'use client'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/SideBar'

import { Button } from '@/components/ui/button'
import { ArrowRight, Upload, Calendar, Radio, ScissorsLineDashed, Disc } from 'lucide-react'
import VideoHover from '@/components/VideoHover'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import ExploreHome from '@/components/ExploreHome'
import axios from 'axios'
import { useState } from 'react'
import React from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
export default async function Explore() {
    const {data:session}=useSession()
    const fetchstudioName = session?.user?.name
    const studioName = (fetchstudioName ?? "user-studio").trim().toLowerCase().replace(/\s+/g, '-');
  const [open, setOpen] = useState(false);
  const [time, setTime] = React.useState(dayjs())
  const [ name,setName]= useState<string | undefined>('Jainam Patel')
  const [email, setEmail] = useState<string | undefined>('')
  const [subject, setSubject] = useState<string | undefined>('Late Night Talks')
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const router= useRouter()
 
  const [error, setError] = useState<string | null>(null);
const [loading,setLoading] =useState<boolean>(false)
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
  <ExploreHome  />
  );
}