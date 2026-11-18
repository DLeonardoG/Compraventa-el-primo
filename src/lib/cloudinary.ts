import { siteConfig } from "@/config/site.config";

export async function uploadToCloudinary(file: File): Promise<string> {
  const { cloudinaryCloudName, cloudinaryUploadPreset } = siteConfig.integrations;

  if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
    throw new Error(
      "Configura cloudinaryCloudName y cloudinaryUploadPreset en site.config.ts",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryUploadPreset);
  formData.append("transformation", "f_auto,q_auto");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || "Error al subir la imagen a Cloudinary");
  }

  const data = (await response.json()) as { secure_url?: string };
  if (!data.secure_url) {
    throw new Error("Cloudinary no devolvió una URL válida");
  }

  return data.secure_url;
}
