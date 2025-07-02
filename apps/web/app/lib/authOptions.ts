
import { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export const authOptions: NextAuthOptions = {

adapter:PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
 
  ],
  session:{
    strategy:"database"
  },
 
  secret: process.env.NEXTAUTH_SECRET,

}
