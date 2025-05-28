import Image from "next/image"
import img from '../../public/recordIcon.svg'
export default function RecordButton(){
    return(
        <>
        <Image className="bg-red-500 rounded-full text-white" src={img} width={50} height={50} alt="hi"/>
       
        </>
    )
}