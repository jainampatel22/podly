import RoomComponent from "@/components/RoomComponent";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Room({ params }: Props) {
  // Await the params to get the actual values
  const { id } = await params;
  
  // Join room when user is available
  return (
    <>
      <RoomComponent params={id} />
    </>
  );
}