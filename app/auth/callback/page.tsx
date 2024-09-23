'use client'

import useSuperbase from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSessionStorage } from "usehooks-ts";
import { get } from "lodash";

export default function AuthCallback() {
    const superbase = useSuperbase();
    const router = useRouter();

    const [answers, _] = useSessionStorage('answers', {}) 

    // TODO: move superbase to server side component

    useEffect(() => {
        async function updateUser(){
            const { data: user } = await superbase.auth.getUser()
            if(!get(user?.user?.user_metadata, 'answers')){
                const {data, error} = await superbase.auth.updateUser({
                    data: {
                        answers
                    }
                })
                if(error){
                    console.log(error)
                    return
                }
            }
            router.push("/homepage")
        }
        updateUser()
    }, [])

    return <div className="flex justify-center items-center h-screen">Please wait while we set up your account...</div>
}