import InviteUrl from "@/components/InviteUrl";

export default function Invite({params}:{params:{name:string}}){
  const name = params.name
  return (
    <InviteUrl name={name}/>
  )
}