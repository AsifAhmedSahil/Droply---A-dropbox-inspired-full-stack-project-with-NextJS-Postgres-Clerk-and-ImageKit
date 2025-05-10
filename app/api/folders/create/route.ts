import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
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
            return NextResponse.json({error:"Folder name is required!"},{status:400})
        }

        if(parentId){
           const [parentFolder] =  await db.select().from(files).where(
                and(
                    eq(files.id,parentId),
                    eq(files.userId,userId),
                    eq(files.isFolder,true)
                )
            )
            if(!parentFolder){
                return NextResponse.json({error:"Parent Folder not found!"},{status:401})
            }
        }

        // create a folder in database***

        const folderData = {
                id:uuid
        }

        const [newFolder] = await db.insert(files).values(folderData).returning()

        return NextResponse.json({
            success:true,
            mesage:"Folder created successfully!",
            folder:newFolder
        })

        
    } catch (error) {
        console.log(error)
        
    }

    
}