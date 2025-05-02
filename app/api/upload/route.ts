import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = request.json()
  const {imagekit,userId: bodyUserId} = body
  if(bodyUserId !== userId){
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if(!imagekit || !imagekit.url){
    return NextResponse.json({ error: "invalid file upload" }, { status: 401 });
  }

  



}
