"use client";
import { useState } from "react";

const ImageUpload: React.FC = () => {
  const [images, setImages] = useState<string[]>([]); // For preview
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null); // Actual files to upload
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Handle image selection and preview
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Preview the images
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages((prevImages) => [...prevImages, ...newImages]);
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

  return (
    <div className="flex flex-col items-center py-6">
      <div className="w-full max-w-md">
        {/* Image Upload Input */}
        <label className="block mb-4">
          <span className="sr-only">Choose an image</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </label>
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUploadClick}
        disabled={uploading}
        className={`mt-4 py-2 px-4 rounded-md text-white ${
          uploading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
        }`}
      >
        {uploading ? "Uploading..." : "Upload Images"}
      </button>

      {message && <p className="mt-4 text-gray-500">{message}</p>}

      {/* Image Gallery (Album-like) */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {images.length > 0 ? (
          images.map((img, index) => (
            <div
              key={index}
              className="relative w-32 h-32 overflow-hidden rounded-lg border border-gray-200 shadow-lg"
            >
              <img
                src={img}
                alt={`Uploaded ${index + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
          ))
        ) : (
          <p className="col-span-3 text-gray-500">No images uploaded yet</p>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
