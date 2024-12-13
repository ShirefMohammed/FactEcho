import cloudinary from "../config/cloudinaryConfig";

/**
 * Deletes a file from Cloudinary using its URL.
 * @param fileUrl - The full URL of the file in Cloudinary.
 * @returns Promise<void> - Resolves when the file is successfully deleted.
 */
export const deleteFileFromCloudinary = async (
  fileUrl: string,
): Promise<void> => {
  try {
    const publicIdWithExtension = extractPublicIdWithExtension(fileUrl);
    if (!publicIdWithExtension) throw new Error("Invalid file URL");

    const publicIdWithoutExtension = publicIdWithExtension.split(".")[0];
    await cloudinary.uploader.destroy(publicIdWithoutExtension);
    console.log("File deleted successfully from Cloudinary");
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error);
  }
};

/**
 * Extracts the public ID (with file extension) from a Cloudinary file URL.
 * @param fileUrl - The full URL of the file in Cloudinary.
 * @returns string | null - The extracted public ID with extension or `null` if not found.
 */
const extractPublicIdWithExtension = (fileUrl: string): string | null => {
  const regex = /\/([^/]+\.[a-zA-Z0-9]+)$/; // Matches the last part of the URL
  const match = fileUrl.match(regex);
  return match ? match[1] : null;
};
