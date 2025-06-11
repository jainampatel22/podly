
interface RoomPageProps {
  params: {
    id: string;
  };
}
import RoomComponent from "@/components/RoomComponent"
export default  function Room({ params }: RoomPageProps){
    // Join room when user is available
    return(<>
    
    <RoomComponent  params={params.id} />
    </>)}