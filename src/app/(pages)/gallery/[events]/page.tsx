'use client';
import { useState } from 'react';
import { CldUploadWidget } from "next-cloudinary";
import { addEventImage } from "@/lib/actions";

interface PageProps {
  params: { events: string };
}

export default function Event({ params }: PageProps) {
  const eventId = Number(params.events);

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleUploadSuccess = (result: any) => {
    const imageUrl = result.info.secure_url;
    setImageUrl(imageUrl);
  };

  const handleSaveImage = async () => {
    if (!imageUrl) return;
    try {
      await addEventImage({ eventId, url: imageUrl });
      alert("Image added to event successfully!");
    } catch (error) {
      alert("Failed to add image to event.");
      console.error(error);
    }
  };

  const handleDeletePreview = () => {
    setImageUrl(null);
  };

  // TODO Replace true with session can edit check.
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-5">{params.events}</h1>
      { true && (
        <CldUploadWidget
        uploadPreset="next_preset"
        onSuccess={(result) => handleUploadSuccess(result)}
      >
        {({ open }) => (
          <>
            {!imageUrl && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => open()}
              >
                Upload an Image
              </button>
            )}
          </>
        )}
      </CldUploadWidget>
      )}
      {imageUrl && (
        <div className="mt-5">
          <img
            src={imageUrl}
            alt="Uploaded preview"
            className="w-full max-w-xs mx-auto rounded shadow-lg"
          />
          <div className="mt-3 flex justify-center space-x-4">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleSaveImage}
            >
              Save to Event
            </button>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded"
              onClick={handleDeletePreview}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
