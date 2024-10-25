"use client";
import { useState, useEffect } from "react";

const ImageUploaderWithGallery: React.FC = () => {
  const [previewImages, setPreviewImages] = useState<string[]>([]); // For preview before uploading
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null); // Actual files to upload
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // Uploaded images from the server
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Handle image selection and preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Preview the images
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewImages((prevImages) => [...prevImages, ...newImages]);
      setSelectedFiles(files); // Store files for upload
    }
  };

  // Handle the actual image upload to the backend
  const handleUploadClick = async () => {
    if (!selectedFiles) {
      setMessage("No files selected for upload.");
      return;
    }

    setUploading(true);
    const formData = new FormData();

    // Append all selected files to FormData
    Array.from(selectedFiles).forEach((file) => {
      formData.append("uploaded_file", file); // The key must match the backend's expected field name
    });

    try {
      const response = await fetch("http://localhost:8000/upload-file/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("Files uploaded successfully!");
        console.log("Files uploaded successfully.");
        fetchImages(); // Re-fetch images after upload
      } else {
        setMessage("Failed to upload files.");
        console.error("Failed to upload files.");
      }
    } catch (error) {
      setMessage("Error uploading files.");
      console.error("Error uploading files:", error);
    } finally {
      setUploading(false);
    }
  };

  // Fetch the list of uploaded files from the server
  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:8000/list-files/");
      if (!response.ok) {
        throw new Error("Failed to fetch image list");
      }

      const data = await response.json();
      if (data.files.length === 0) {
        setError("No files found.");
      } else {
        const fileUrls = data.files.map(
          (file: string) => `http://localhost:3000/uploads/${file}`
        );
        setUploadedImages(fileUrls);
        setError(null); // Clear any previous errors
      }
    } catch (err) {
      console.error("Error fetching image list:", err);
      setError("Error fetching image list.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch images when the component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="flex flex-col items-center py-10 px-4 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Image Album</h1>

      {/* Image Upload Input */}
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Upload New Images
        </h2>
        <label className="block mb-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>

        {/* Upload Button */}
        <button
          onClick={handleUploadClick}
          disabled={uploading}
          className={`w-full py-2 px-4 rounded-md text-white transition-colors duration-300 ${
            uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          {uploading ? "Uploading..." : "Upload Images"}
        </button>

        {message && <p className="mt-4 text-gray-600 text-center">{message}</p>}
      </div>

      {/* Preview of Selected Images Before Upload */}
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Previews</h2>
        <div className="grid grid-cols-3 gap-4">
          {previewImages.length > 0 ? (
            previewImages.map((img, index) => (
              <div
                key={index}
                className="relative w-32 h-32 overflow-hidden rounded-lg border border-gray-300 shadow-md transition-transform transform hover:scale-105"
              >
                <img
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))
          ) : (
            <p className="col-span-3 text-gray-500 text-center">
              No images selected for upload
            </p>
          )}
        </div>
      </div>

      {/* Gallery of Uploaded Images */}
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Uploaded Images
        </h2>

        {/* Loading Spinner */}
        {loading && <p className="text-center">Loading images...</p>}

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Image Gallery */}
        <div className="grid grid-cols-3 gap-6">
          {uploadedImages.length > 0 ? (
            uploadedImages.map((img, index) => (
              <div
                key={index}
                className="relative w-full h-48 overflow-hidden rounded-lg border border-gray-300 shadow-md transition-transform transform hover:scale-105"
              >
                <img
                  src={img}
                  alt={`Uploaded ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))
          ) : (
            !loading && (
              <p className="col-span-3 text-gray-500 text-center">
                No images to display
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploaderWithGallery;
