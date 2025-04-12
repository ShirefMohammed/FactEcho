import cloudinary from "@/config/cloudinaryConfig";

/**
 * Deletes a file from Cloudinary using its URL.
 * @param fileUrl - The full URL of the file in Cloudinary.
 * @returns Promise<void> - Resolves when the file is successfully deleted.
 */
export const deleteFileFromCloudinary = async (fileUrl: string): Promise<void> => {
  try {
    const publicId = extractPublicId(fileUrl);
    if (!publicId) throw new Error("Invalid file URL");

    // Delete the file from Cloudinary using the extracted public ID
    await cloudinary.uploader.destroy(publicId);
    console.log("File deleted successfully from Cloudinary");
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
  }
};

/**
 * Extracts the public ID from a Cloudinary file URL, including folder structure.
 * @param fileUrl - The full URL of the file in Cloudinary.
 * @returns string | null - The extracted public ID with folder structure or `null` if invalid.
 */
const extractPublicId = (fileUrl: string): string | null => {
  const regex = /\/v\d+\/(.*)\.[a-zA-Z0-9]+$/; // Matches the part after `/v<version>/` and before the file extension
  const match = fileUrl.match(regex);
  return match ? match[1] : null;
};

// Example usage:
// const fileUrl = "https://res.cloudinary.com/democloud/v1617958472/my_folder/my_image.jpg";
// const publicId = extractPublicId(fileUrl); // Output: "my_folder/my_image"
