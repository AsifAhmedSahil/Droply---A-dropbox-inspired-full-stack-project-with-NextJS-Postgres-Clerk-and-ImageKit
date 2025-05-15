import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ fileId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unautorized" }, { status: 401 });
    }

    const { fileId } = await props.params;

    if (!fileId) {
      return NextResponse.json(
        { error: "File Id not found!" },
        { status: 401 }
      );
    }

    const [file] = await db
      .select()
      .from(files)
      .where(and(eq(files.id, fileId), eq(files.userId, userId)));
    if (!file) {
      return NextResponse.json({ error: "File  not found!" }, { status: 401 });
    }

    // * Toggle the is trash status
    const [updatedFile] = await db
      .update(files)
      .set({ isTrashed: !file.isTrashed })
      .where(and(eq(files.id, fileId), eq(files.userId, userId)))
      .returning();

    const action = updatedFile.isTrashed ? "Move to Trash" : "Restore";
    return NextResponse.json({
      ...updatedFile,
      message: `File ${action} Successfully`,
    });
  } catch (error) {
    console.log("Error Updating Trash!", error);

    return NextResponse.json(
      { error: "Failed to update file trash status" },
      { status: 500 }
    );
  }
}
