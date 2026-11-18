import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const ALLOWED_PREFIXES = ["vehiculos/", "parcelas/", "cv/"] as const;

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function getClient() {
  return new S3Client({
    endpoint: required("S3_ENDPOINT"),
    region: process.env.S3_REGION || "auto",
    credentials: {
      accessKeyId: required("S3_ACCESS_KEY_ID"),
      secretAccessKey: required("S3_SECRET_ACCESS_KEY"),
    },
    forcePathStyle: true,
  });
}

export function publicUrlForKey(key: string): string {
  const base = required("S3_PUBLIC_URL").replace(/\/$/, "");
  return `${base}/${key}`;
}

export function isManagedStorageKey(key: string): boolean {
  return ALLOWED_PREFIXES.some((prefix) => key.startsWith(prefix));
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase()
    .slice(0, 120);
}

export async function createPresignedUpload(params: {
  key: string;
  contentType: string;
  expiresIn?: number;
}) {
  const bucket = required("S3_BUCKET_NAME");
  const client = getClient();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: params.key,
    ContentType: params.contentType,
  });
  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: params.expiresIn ?? 300,
  });
  return {
    uploadUrl,
    publicUrl: publicUrlForKey(params.key),
    key: params.key,
  };
}

export async function deleteObject(key: string): Promise<void> {
  if (!isManagedStorageKey(key)) return;
  const bucket = required("S3_BUCKET_NAME");
  const client = getClient();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
  );
}

export async function deleteObjects(keys: string[]): Promise<void> {
  await Promise.all(keys.map((key) => deleteObject(key)));
}
