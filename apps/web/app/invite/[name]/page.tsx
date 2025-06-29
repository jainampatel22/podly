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
export const metadata = {
  title: 'Podler | Invites',
  description: 'Your online studio to record in high quality, edit in a flash, and go live with a bang. Not necessarily in that order. ',
};
