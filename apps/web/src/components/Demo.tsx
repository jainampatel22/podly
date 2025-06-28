import { Globe } from "lucide-react";

export default function Demo(){
    return (
        <>
        <div
          className="text-center -mt-96"
        >
         
            <h2 className="text-2xl sm:text-6xl font-bold  text-black mb-3 sm:mb-4">
              See <span className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Podler</span> in Action.
            </h2>
            <p className="text-slate-500 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base">
              Watch how podler works and some amazing features
            </p>
            
            <div className="relative max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <Globe className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-base sm:text-lg">Demo video placeholder</p>
                  <p className="text-xs sm:text-sm opacity-75 mt-2">Your demo video would go here</p>
                </div>
             
            </div>
          </div>
        </div>
        </>
    )
}