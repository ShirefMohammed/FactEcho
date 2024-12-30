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
    const publicId = extractPublicId(fileUrl);
    if (!publicId) {
      console.warn(`Invalid or malformed file URL: ${fileUrl}`);
      return false;
    }

    // Query Cloudinary for the resource
    await cloudinary.api.resource(publicId);

    return true; // File exists
  } catch (error: any) {
    if (error?.error?.http_code === 404) {
      console.warn(`File not found in Cloudinary: ${fileUrl}`);
      return false; // File doesn't exist
    }

    // Log unexpected errors and rethrow them
    console.error(
      "Unexpected error checking file existence in Cloudinary:",
      JSON.stringify(error, null, 2),
    );
    throw new Error("Error from server: " + JSON.stringify(error.error));
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
