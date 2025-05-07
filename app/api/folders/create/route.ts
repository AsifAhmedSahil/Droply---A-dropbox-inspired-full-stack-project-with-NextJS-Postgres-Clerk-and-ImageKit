import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request:NextRequest) {
    try {
        const {userId} = await auth()
        if(!userId){
            return NextResponse.json({error:"unauthorized"},{status:401})
        }
        const body = await request.json()
        const {name,userId:bodyUserId, parentId=null} = body
        if(bodyUserId !== userId){
            return NextResponse.json({error:"unauthorized"},{status:401})
        }

        if(!name || typeof name !== "string" || name.trim() === ""){
            return NextResponse.json({error:"Folder name is required!"},{status:401})
        }

        
    } catch (error) {
        console.log(error)
        
    }

    
}