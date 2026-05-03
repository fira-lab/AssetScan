// app/actions/image.ts

"use server";

import { redirect } from "next/navigation"; // Keep this if you plan to use it for redirection after image upload, otherwise remove it.
import { v2 as cloudinary } from "cloudinary";
// import { nanoid } from "nanoid"; // Removed: 'nanoid' is defined but never used.
// import { currentUser } from "@clerk/nextjs/server"; // Removed: 'currentUser' is defined but never used.
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/types/db";
import Image from "@/models/Image"; // Assuming you still use this for other things

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a SINGLE image file and returns its Cloudinary URL.
 * This is optimized for the user creation form.
 */
export async function uploadImage(formData: FormData) {
  try {
    const { userId } = auth(); // Use auth() directly as currentUser is not needed here
    if (!userId) {
      throw new Error("Unauthorized: Please sign in first");
    }

    const file = formData.get("image") as File;
    if (!file || file.size === 0) {
      throw new Error("No image provided");
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error("Image too large (max 10MB)");
    }
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResponse: { secure_url: string } = await new Promise((resolve, reject) => { // Specified type for uploadResponse
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "user_profiles", // A specific folder for profile pictures
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string }); // Cast result to the expected type
        }
      );
      uploadStream.end(buffer);
    });

    return {
      success: true,
      url: uploadResponse.secure_url,
    };

  } catch (err: unknown) { // Use 'unknown' for catch block errors
    console.error("Error uploading single image:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to upload image";
    return {
      success: false,
      error: errorMessage,
    };
  }
}


/**
 * Get paginated images for the current user
 */
export const getUserImagesFromDb = async (page: number = 1, limit: number = 12) => {
  try {
    const { userId } = auth();
    if (!userId) {
      // You might want to handle this differently, e.g., return an empty array or throw a more specific error
      throw new Error("Unauthorized: User ID not found.");
    }
    await connectDB();
    const query = { userId }; // Directly use userId in the query
    const [images, totalCount] = await Promise.all([
      Image.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Image.countDocuments(query),
    ]);
    return {
      images: JSON.parse(JSON.stringify(images)),
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (err: unknown) { // Use 'unknown' for catch block errors
    console.error("Error in getUserImagesFromDb:", err);
    const errorMessage = err instanceof Error ? err.message : "Failed to fetch images";
    throw new Error(errorMessage);
  }
};


/**
 * Get all images from DB
 */
export const getAllImagesFromDb = async () => {
    try {
        const { userId } = auth();
        if (!userId) throw new Error("User not found");
        await connectDB();
        const images = await Image.find({ userId }).sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(images));
    } catch (err: unknown) { // Use 'unknown' for catch block errors
        console.error("Error in getAllImagesFromDb:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch images";
        throw new Error(errorMessage);
    }
};