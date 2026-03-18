"use server";
// app/actions/image.ts

import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";
import { auth, currentUser } from "@clerk/nextjs/server";
import connectDB from "@/types/db";
import Image from "@/models/Image";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload an image file from the user's local machine to Cloudinary
 * and save its details to the database
 */
// app/actions/image.ts

export async function uploadImage(formData: FormData) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      throw new Error("Unauthorized: Please sign in first");
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      throw new Error("User email not found");
    }

    await connectDB();

    // Get ALL files with name "image" (or "images[]")
    const files = formData.getAll("images") as File[];  // ← Important: use getAll + "images"

    if (files.length === 0 || files[0].size === 0) {
      throw new Error("No images provided");
    }

    const uploadResults = [];

    for (const file of files) {
      // Validation per file
      if (!file.type.startsWith("image/")) {
        uploadResults.push({
          success: false,
          fileName: file.name,
          error: "File must be an image",
        });
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        uploadResults.push({
          success: false,
          fileName: file.name,
          error: "Image too large (max 10MB)",
        });
        continue;
      }

      // Convert to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      const uploadResponse: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "users_CarADs",
            public_id: `upload_${nanoid()}`,
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      const cloudinaryUrl = uploadResponse.secure_url;

      // Save to DB
      const savedImage = await new Image({
        name: file.name || "finalYearProject",
        ImageUrl: cloudinaryUrl,
        userEmail,
        userId,
      }).save();

      uploadResults.push({
        success: true,
        _id: savedImage._id,
        url: cloudinaryUrl,
        fileName: file.name,
      });
    }

    return {
      success: true,
      message: `Uploaded ${uploadResults.filter(r => r.success).length} image(s) successfully!`,
      results: uploadResults,
    };
  } catch (err: any) {
    console.error("Error uploading images:", err);
    return {
      success: false,
      error: err.message || "Failed to upload images",
    };
  }
}

/**
 * Get paginated images for the current user (optional: filter by user)
 */
export const getUserImagesFromDb = async (page: number = 1, limit: number = 12) => {
  try {
    const { userId } = await auth();

    await connectDB();

    const query = userId ? { userId } : {}; // Only show user's own images if logged in

    const [images, totalCount] = await Promise.all([
      Image.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
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
 * Get a single image by ID (with ownership check optional)
 */
export const getAllImagesFromDb = async () => {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!user) {
      throw new Error("User not found");
    }

    const userEmail = user.primaryEmailAddress?.emailAddress;
    console.log("User email:", userEmail);

    if (!userEmail) {
      throw new Error("User email not found");
    }

    await connectDB();

    // Query exactly matches your database: userEmail and userId
    const images = await Image.find({  userId }).sort({ createdAt: -1 });

    console.log(`Found ${images.length} image(s) for ${userEmail}`);

    if (images.length === 0) {
      console.log("No images found for this user.");
      return []; // Return empty array instead of error — safer for frontend
    }

    // Log clearly what we found
    images.forEach((img, index) => {
      console.log(`${index + 1}. ${img.name} → ${img.ImageUrl}`);
    });

    // IMPORTANT: We do NOT change your database.
    // We only format the data for the frontend safely.
    // Keep ImageUrl exactly as it is, and also provide 'url' for compatibility.
    const formattedImages = images.map((img) => ({
      _id: img._id.toString(),
      name: img.name || "Untitled",
      ImageUrl: img.ImageUrl,           // ← Keep your original field
      url: img.ImageUrl,                // ← Add this so <Image src={img.url} /> works
      createdAt: img.createdAt,
      updatedAt: img.updatedAt,
    }));

    console.log("Sending formatted images to frontend:");
    console.table(formattedImages.map(i => ({ name: i.name, url: i.url })));

    return formattedImages;

  } catch (err: any) {
    console.error("Error in getAllImagesFromDb:", err.message);
    throw new Error(err.message || "Failed to fetch images");
  }
};