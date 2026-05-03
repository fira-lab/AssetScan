"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  [key: string]: any; // for other possible fields
}

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("image") as File | null;

    if (!file || file.size === 0) {
      return { success: false, error: "No file provided" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: "user_profiles",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else if (result) resolve(result);
          else reject(new Error("Upload failed"));
        }
      );
      uploadStream.end(buffer);
    });

    return { 
      success: true, 
      url: result.secure_url 
    };

  } catch (err: unknown) {
    console.error("Image upload error:", err);
    const message = err instanceof Error ? err.message : "Unknown error occurred";
    return { success: false, error: message };
  }
}