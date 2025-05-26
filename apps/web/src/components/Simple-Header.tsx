import Link from "next/link";

export default function SimpleHeader(){
    return (
        <>
         <div >
    <div className=" rounded-xl pt-5 mx-80 p-3">
  <div className="flex justify-between">
    <div>
      <h1 className="text-2xl text-blue-700 font-inter font-bold ml-3">Podly</h1>
    </div>
    <div className="flex font-inter font-semibold text-[#020202] text-xl gap-7">
      <h1><Link href='/pricing'>Pricing</Link></h1>
      <h1><Link href='/explore'>Explore</Link></h1>
    </div>
  </div>

  {/* Line below the navbar */}
  <div className="h-[1px] bg-gray-300 mt-3"></div>
</div>
</div>
        </>
    )
}