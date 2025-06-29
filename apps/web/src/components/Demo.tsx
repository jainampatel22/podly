import { Globe } from "lucide-react";

export default function Demo(){
    return (
        <>
        <div className="text-center -mt-60 sm:-mt-60 lg:-mt-52 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-2xl md:text-4xl lg:text-6xl font-bold text-black mb-2 sm:mb-3 lg:mb-4">
              See <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Podler</span> in Action.
            </h2>
            <p className="text-slate-500 mb-4 sm:mb-6 lg:mb-8 max-w-2xl mx-auto text-xs sm:text-sm lg:text-base px-4">
              Watch how podler works and some amazing features.
            </p>
            
            <div className="relative max-w-4xl mx-auto rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
                <div className="text-center text-white">
                  <Globe className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-2 sm:mb-4 opacity-50" />
                  <p className="text-sm sm:text-base lg:text-lg">Demo video placeholder</p>
                  <p className="text-xs sm:text-sm opacity-75 mt-1 sm:mt-2">Your demo video would go here</p>
                </div>
              </div>
            </div>
        </div>
        </>
    )
}