import RoomComponent from "@/components/RoomComponent";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Room({ params }: Props) {
  
  const { id } = await params;
  

  return (
    <>
      <RoomComponent params={id} />
    </>
  );
}
export const metadata = {
  title: 'Podler | Meeting',
  description: 'Your online studio to record in high quality, edit in a flash, and go live with a bang. Not necessarily in that order. ',
};
