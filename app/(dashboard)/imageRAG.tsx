"use client";
import { useState, useEffect } from 'react';

const ImageGallery: React.FC = () => {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                setImages(fileUrls);
            }
        } catch (err) {
            console.error("Error fetching image list:", err);
            setError("Error fetching image list.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch images when the component mounts
        fetchImages();
    }, []);

    return (
        <div className="flex flex-col items-center py-6">
            <h1 className="text-2xl font-bold mb-6">Uploaded Images</h1>

            {/* Loading Spinner */}
            {loading && <p>Loading images...</p>}

            {/* Error Message */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Image Gallery */}
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
                    !loading && <p className="col-span-3 text-gray-500">No images to display</p>
                )}
            </div>
        </div>
    );
};

export default ImageGallery;
