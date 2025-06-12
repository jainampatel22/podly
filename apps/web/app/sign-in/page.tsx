
import AuthPage from "@/components/AuthPage";
import { Suspense } from "react";
export default function signIn(){
    return (<>
    <Suspense fallback={<div>Loading...</div>}>
    <div>
        <AuthPage/>
        </div>
        </Suspense>
        </>)
}