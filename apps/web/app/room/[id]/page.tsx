
import { redirect } from "next/navigation"

import { getServerSession } from "next-auth"
import { authOptions } from "../../api/auth/[...nextauth]/route"
import RoomComponent from "@/components/RoomComponent"
export default async function Room({ params }: { params: { id: string } }){
   const session = await getServerSession(authOptions)
if(!session){
    redirect(`/sign-in?callbackUrl=/room/${params.id}`)
}
    // Join room when user is available
    return(<>
    
    <RoomComponent  />
    </>)}