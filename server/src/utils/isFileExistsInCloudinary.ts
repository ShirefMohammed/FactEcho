import cloudinary from "../config/cloudinaryConfig";

/**
 * Checks if a file exists in Cloudinary using its URL.
 * @param fileUrl - The full URL of the file in Cloudinary.
 * @returns Promise<boolean> - Resolves to `true` if the file exists, `false` otherwise.
 */
export const isFileExistsInCloudinary = async (
  fileUrl: string,
): Promise<boolean> => {
  try {
    const publicIdWithExtension = extractPublicIdWithExtension(fileUrl);
    if (!publicIdWithExtension) return false;

    const publicIdWithoutExtension = publicIdWithExtension.split(".")[0];
    await cloudinary.api.resource(publicIdWithoutExtension);

    return true; // File exists
  } catch (error: any) {
    if (error?.error?.http_code === 404) {
      console.warn(`File not found in Cloudinary: ${fileUrl}`);
      return false; // File doesn't exist
    }

    // Log and rethrow other errors to handle unexpected cases
    console.error("Error checking file existence in Cloudinary:", error);
    throw error;
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
