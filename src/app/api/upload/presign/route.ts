import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import {
  createPresignedUpload,
  sanitizeFileName,
} from "@/lib/storage";

const ALLOWED_FOLDERS = new Set(["vehiculos", "parcelas", "cv"]);
const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "application/pdf",
]);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fileName?: string;
      fileType?: string;
      folder?: string;
    };

    const fileName = body.fileName?.trim();
    const fileType = body.fileType?.trim();
    const folder = body.folder?.trim();

    if (!fileName || !fileType || !folder || !ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ error: "Invalid upload request" }, { status: 400 });
    }

    if (folder !== "cv" && !(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (folder === "cv" && fileType !== "application/pdf") {
      return NextResponse.json({ error: "CV must be a PDF" }, { status: 400 });
    }

    if (!ALLOWED_MIME.has(fileType)) {
      return NextResponse.json({ error: "MIME type not allowed" }, { status: 400 });
    }

    const sanitized = sanitizeFileName(fileName) || "file";
    const key = `${folder}/${Date.now()}-${sanitized}`;
    const result = await createPresignedUpload({
      key,
      contentType: fileType,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not create upload URL";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
