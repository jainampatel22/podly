"use client"
import {signIn,signOut,useSession} from 'next-auth/react'
import Link from 'next/link'
import { Suspense } from 'react'
import { Button } from './ui/button'
import { FcGoogle } from "react-icons/fc"; // Google icon
import Header from './Header';
import SimpleHeader from './Simple-Header';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
export default function AuthPage(){
  const searchParams = useSearchParams()
const router = useRouter()
const callbackUrl = searchParams.get('callbackUrl') || '/explore/home'
    const {data:session} = useSession()
    useEffect(()=>{
      if(session){
        router.replace(callbackUrl)
      }
    },[session,callbackUrl,router])
    return(
        <div>
{session?(<>

    <p>signed in as {session.user?.email}</p>
    <button onClick={()=>signOut()}>signout</button>
</>):(<>
 {
 <div>
<SimpleHeader/>
<div className="flex items-center -mt-20 justify-center min-h-screen">
  <div className="rounded-xl  shadow-xl w-[450] h-[320px]  items-center justify-center border">
<img  src="https://shuttle.zip/images/homepage/icon.webp" className="ml-48 mt-7"width={50} height={50} alt="" />
<h1 className=' text-3xl font-inter ml-24 mt-2 font-semibold'>Welcome To Podly </h1>
  <p className='font-light font-inter text-gray-600 ml-5 text-tight text-md'>Access your Podly workspace — sign in to get started!</p>
  
 <div className="px-6"> {/* <-- Add horizontal padding here */}
  <div className="flex items-center my-6">
    <hr className="flex-grow border-t border-gray-300" />
    <span className="mx-4 text-gray-500 whitespace-nowrap">SIGN IN WITH</span>
    <hr className="flex-grow border-t border-gray-300" />
  </div>
</div>
<div className="px-6"> {/* adds space inside the container */}
  <Button onClick={()=>signIn("google",{callbackUrl:callbackUrl})} className="bg-white border font-inter text-md hover:bg-gray-100 text-gray-800 w-full gap-2 shadow-md">
    <FcGoogle size={20} />
    Google
  </Button>
</div>
<p className='font-light font-inter tracking-tight mt-2 text-gray-600 ml-8 text-tight text-[13px]'>By signing in, you agree to our Terms of Service and Privacy Policy</p>
  </div>

</div>


 
 </div>
 
 }

</>)}


        </div>
    )
}