// app/actions/image.ts

"use server";

import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";
import { auth, currentUser } from "@clerk/nextjs/server";
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
    const { userId } = await auth();
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

    const uploadResponse: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "user_profiles", // A specific folder for profile pictures
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return {
      success: true,
      url: uploadResponse.secure_url,
    };

  } catch (err: any) {
    console.error("Error uploading single image:", err);
    return {
      success: false,
      error: err.message || "Failed to upload image",
    };
  }
}


/**
 * Get paginated images for the current user
 */
export const getUserImagesFromDb = async (page: number = 1, limit: number = 12) => {
  // ... This function remains unchanged ...
  try {
    const { userId } = await auth();
    await connectDB();
    const query = userId ? { userId } : {};
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
  } catch (err: any) {
    throw new Error(err.message || "Failed to fetch images");
  }
};


/**
 * Get all images from DB
 */
export const getAllImagesFromDb = async () => {
    // ... This function also remains unchanged ...
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("User not found");
        await connectDB();
        const images = await Image.find({ userId }).sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(images));
    } catch (err: any) {
        console.error("Error in getAllImagesFromDb:", err.message);
        throw new Error(err.message || "Failed to fetch images");
    }
};