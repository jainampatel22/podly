import { Globe } from "lucide-react";
import Link from "next/link";

export default function Footer(){
    return (
        <div 
         
          className="text-center mt-32"
        >
          <div className="bg-gradient-to-r  from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-10 shadow-2xl">

         <h1 className="text-white text-2xl">Made with 💛 by  <Link href="/" className="ml-2 underline text-slate-500">Jainam Patel</Link></h1>
          </div>
      </div>
    )
}