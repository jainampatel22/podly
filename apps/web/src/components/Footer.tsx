import { Globe } from "lucide-react";
import Link from "next/link";

export default function Footer(){
    return (
        <div className="text-center mt-16 sm:mt-24 lg:mt-32 px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-10 shadow-xl sm:shadow-2xl">
            <h1 className="text-white text-lg sm:text-xl lg:text-2xl">
              Made with 💛 by  
              <Link href="https://x.com/Jainam___patel/"  className="ml-2 underline text-slate-500 hover:text-slate-400 transition-colors">
                Jainam Patel
              </Link>
            </h1>
          </div>
        </div>
    )
}