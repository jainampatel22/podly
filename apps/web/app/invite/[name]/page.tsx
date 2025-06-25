import InviteUrl from "@/components/InviteUrl";
type Props = {
  params: Promise<{
    name: string;
  }>;
};
export default async function Invite({params}:Props){
 const { name} = await params
  return (
    <InviteUrl name={name}/>
  )
}