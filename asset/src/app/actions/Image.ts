"use server";
import { v2 as cloudinary } from "cloudinary";
import { auth } from "@clerk/nextjs/server";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(formData: FormData) {
  try {
    // const { userId } = await auth(); // Await auth for Next.js 15
    // if (!userId) throw new Error("Unauthorized");

    const file = formData.get("image") as File;
    if (!file || file.size === 0) return { success: false, error: "No file" };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "user_profiles" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return { success: true, url: result.secure_url };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}