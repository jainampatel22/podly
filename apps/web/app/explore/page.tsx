import { redirect    } from 'next/navigation'
import {authOptions} from '../api/auth/[...nextauth]/route'

import { getServerSession } from 'next-auth'

export default async function  Explore(){

const session = await getServerSession(authOptions)
if(!session){
    redirect('/sign-in')
}

return (<>
<p>{session.user?.email}</p>
</>)
}