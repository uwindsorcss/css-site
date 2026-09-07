"use client";

import { useEffect, useState } from "react";
import { CldUploadWidget } from "next-cloudinary";
import { addEventImage, deleteEventImage, setEventThumbnail } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import ImageWithModal from "@/components/modals/ImageModal";
import { EventImage } from "@/types/models";

interface EventGalleryProps {
  eventId: number;
  initialImages: EventImage[];
  canEdit: boolean;
}

export default function EventGallery({ eventId, initialImages, canEdit }: EventGalleryProps) {
  const [eventImages, setEventImages] = useState<EventImage[]>(initialImages);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUploadSuccess = (result: any) => {
    setImageUrl(result.info.secure_url);
  };

  const handleSaveImage = async () => {
    if (!imageUrl) return;
    await addEventImage({ eventId, url: imageUrl });
    setImageUrl(null);
  };

  const handleDeletePreview = () => {
    setImageUrl(null);
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    await deleteEventImage(imageId);
    setEventImages(eventImages.filter((img) => img.id !== imageId));
  };

  const setAsThumbnail = (imageUrl: string) => {
    setEventThumbnail(eventId, imageUrl);
  };

  return (
    <div className="text-center">
      <h1 className="text-center text-2xl font-bold md:text-4xl">Gallery</h1>
      {loading ? (
        <p className="text-center text-2xl font-bold md:text-4xl">Loading event gallery...</p>
      ) : (
        <div className="mb-10 mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {eventImages.length === 0 && (
            <p className="text-lg font-semibold text-muted-foreground">No images to show</p>
          )}
          {eventImages.map((img) => (
            <div
              key={img.id}
              className="group relative rounded-md border border-border bg-card p-5 shadow-sm transition duration-300 ease-in-out hover:border-blue-950/50 hover:shadow-md hover:shadow-blue-950/20 dark:hover:border-yellow-600/50 dark:hover:shadow-yellow-600/20">
              <ImageWithModal src={img.url} alt="Event image" customClass="rounded shadow-md" />
              {canEdit && (
                <>
                  <button
                    onClick={() => handleDeleteImage(img.id)}
                    className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <X size={18} />
                  </button>
                  <Button
                    onClick={() => setAsThumbnail(img.url)}
                    className="absolute bottom-4 right-4 rounded px-3 py-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    variant={"ghost"}>
                    Set as Thumbnail
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {canEdit && (
        <CldUploadWidget
          uploadPreset="next_preset"
          onSuccess={(result) => handleUploadSuccess(result)}>
          {({ open }) => (
            <>
              {!imageUrl && (
                <Button size="full" className="mb-4 mt-6" variant="accent" onClick={() => open()}>
                  Upload an Image
                  <Upload size={18} className="ml-2" />
                </Button>
              )}
            </>
          )}
        </CldUploadWidget>
      )}

      {imageUrl && canEdit && (
        <div className="mt-10">
          <img
            src={imageUrl}
            alt="Uploaded preview"
            className="mx-auto w-full max-w-xs rounded shadow-lg"
          />
          <div className="mt-3 flex justify-center space-x-4">
            <button className="rounded bg-green-500 px-4 py-2 text-white" onClick={handleSaveImage}>
              Save to Event
            </button>
            <button
              className="rounded bg-red-500 px-4 py-2 text-white"
              onClick={handleDeletePreview}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
