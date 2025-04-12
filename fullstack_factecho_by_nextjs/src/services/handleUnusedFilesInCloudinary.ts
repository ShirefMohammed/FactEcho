import cloudinary from "@/config/cloudinaryConfig";

import { deleteFileFromCloudinary } from "./deleteFileFromCloudinary";

// Not completed

/**
 * Handles unused files in Cloudinary by deleting them if they are not referenced in the database.
 * @returns Promise<void> - Resolves when unused files are handled.
 */
export const handleUnusedFilesInCloudinary = async (): Promise<void> => {
  try {
    // Fetch all uploaded resources from Cloudinary
    const resources = await cloudinary.api.resources({
      type: "upload",
      prefix: "", // Specify folder prefix if necessary
    });

    for (const resource of resources.resources) {
      const fileUrl = resource.secure_url;

      // Example placeholder for checking usage in a database.
      // Replace with actual DB queries.
      const isUsed = false; // Example condition for testing

      if (!isUsed && resource.public_id !== "defaultAvatar") {
        await deleteFileFromCloudinary(fileUrl);
        console.log("File deleted from Cloudinary:", fileUrl);
      }
    }
  } catch (error) {
    console.error("Error handling unused Cloudinary files:", error);
  }
};
