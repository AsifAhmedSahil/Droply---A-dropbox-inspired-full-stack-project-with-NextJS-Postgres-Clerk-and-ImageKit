import { auth } from "@clerk/nextjs/server";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
 try {
   const { userId } = await auth();
   if (!userId) {
     return NextResponse.json({ error: "unauthorized" }, { status: 401 });
   }
 
   const body = request.json();
   const { imagekit, userId: bodyUserId } = body;
   if (bodyUserId !== userId) {
     return NextResponse.json({ error: "unauthorized" }, { status: 401 });
   }
 
   if (!imagekit || !imagekit.url) {
     return NextResponse.json({ error: "invalid file upload" }, { status: 401 });
   }
 
   const fileData = {
     name: imagekit.name || "Untitled",
     path: imagekit.filePath || `/droply/${userId}/${imagekit.name}`,
     size: imagekit.size || 0,
     type: imagekit.fileType || "image",
     fileUrl: imagekit.url,
     thumbnailUrl: imagekit.thumbnailUrl || null,
     userId: userId,
     parentId: null,
     isFolder: false,
     isStarred: false,
     isTrash: false,
   };

   
 } catch (error) {
  
 }
}
