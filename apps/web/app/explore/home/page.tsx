import { redirect } from 'next/navigation'
import Sidebar from '@/components/SideBar'

import { Button } from '@/components/ui/button'
import { ArrowRight, Upload, Calendar, Radio, ScissorsLineDashed, Disc } from 'lucide-react'
import VideoHover from '@/components/VideoHover'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import ExploreHome from '@/components/ExploreHome'
export default async function Explore() {

  
  return (
  <ExploreHome  />
  );
}