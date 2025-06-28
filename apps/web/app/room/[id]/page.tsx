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