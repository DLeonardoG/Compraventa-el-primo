import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { deleteObject, isManagedStorageKey } from "@/lib/storage";

export async function DELETE(request: Request) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { key?: string };
    const key = body.key?.trim();
    if (!key) {
      return NextResponse.json({ error: "Missing key" }, { status: 400 });
    }
    if (!isManagedStorageKey(key)) {
      return NextResponse.json({ error: "Key not allowed" }, { status: 400 });
    }

    await deleteObject(key);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not delete object";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
