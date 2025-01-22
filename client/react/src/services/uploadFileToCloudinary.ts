/**
 * Uploads a file to Cloudinary and returns its secure URL.
 * @param {Blob} file - The file to upload.
 * @returns {Promise<string>} - A promise resolving with the secure URL of the uploaded file.
 * @throws {Error} - Throws an error if the upload fails.
 */
export const uploadFileToCloudinary = async (file: Blob): Promise<string> => {
  try {
    // Prepare FormData for the file upload
    const formData = new FormData();
    formData.append("file", file);

    const upload_preset = import.meta.env.VITE_CLOUDINARY_MY_UPLOAD_PRESET;
    if (!upload_preset) {
      throw new Error("upload_preset is not configured.");
    }
    formData.append("upload_preset", upload_preset); // Replace with your Cloudinary upload preset

    const upload_folder = import.meta.env.VITE_CLOUDINARY_MY_UPLOAD_FOLDER;
    if (!upload_folder) {
      throw new Error("upload_folder is not configured.");
    }
    formData.append("folder", upload_folder); // Folder name in Cloudinary

    // API endpoint for file upload
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error("Cloudinary cloud name is not configured.");
    }
    const uploadURL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    // Send POST request to Cloudinary API
    const response = await fetch(uploadURL, {
      method: "POST",
      body: formData,
    });

    // Parse JSON response
    const data = await response.json();

    // Handle non-OK responses
    if (!response.ok) {
      throw new Error(data?.error?.message || "File upload failed.");
    }

    // Return the secure URL of the uploaded file
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw error; // Re-throw the error for caller handling
  }
};
