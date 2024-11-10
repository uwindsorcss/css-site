'use client';
import { useEffect, useState } from 'react';
import { CldUploadWidget } from "next-cloudinary";
import { addEventImage, deleteEventImage, getEventImages, setEventThumbnail } from "@/lib/actions";
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { EventImage } from '@/types/models';
import ImageWithModal from '@/components/modals/ImageModal';

interface PageProps {
  params: { events: string };
}

export default function Event({ params }: PageProps) {
  const eventId = Number(params.events);
  const [eventImages, setEventImages] = useState<EventImage[]>([]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Loading state for gallery

  const handleUploadSuccess = (result: any) => {
    const imageUrl = result.info.secure_url;
    setImageUrl(imageUrl);
  };

  const handleSaveImage = async () => {
    if (!imageUrl) return;
    await addEventImage({ eventId, url: imageUrl });
  };

  const handleDeletePreview = () => {
    setImageUrl(null);
  };

  const handleDeleteImage = async (imageId: number) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this image?");
    if (!isConfirmed) return;

    await deleteEventImage(imageId);
  };

  const setAsThumbnail = (eventId: number, imageUrl: string) => {
    setEventThumbnail(eventId, imageUrl);
  };

  useEffect(() => {
    const fetchEventImages = async () => {
      setLoading(true); // Start loading
      const images = await getEventImages(eventId);
      setEventImages(images || []);
      setLoading(false); // End loading
    };
    fetchEventImages();
  }, [eventId]);

  return (
    <div className="text-center">
       <h1 className="text-center text-2xl font-bold md:text-4xl">Gallery</h1>
      {loading ? (
        <p className="text-center text-2xl font-bold md:text-4xl">Loading event gallery...</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 mt-10 mb-10">
          {eventImages.length === 0 && (
            <p className="text-lg font-semibold text-muted-foreground">No images to show</p>
          )}
          {eventImages.map((img) => (
            <div key={img.id} className="relative group rounded-md border border-border bg-card p-5 shadow-sm transition duration-300 ease-in-out hover:border-blue-950/50 hover:shadow-md hover:shadow-blue-950/20 dark:hover:border-yellow-600/50 dark:hover:shadow-yellow-600/20">
              <ImageWithModal src={img.url} alt="Event image" customClass="rounded shadow-md object-cover" />
              <button
                onClick={() => handleDeleteImage(img.id)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <X size={18} />
              </button>
              <Button
              onClick={() => setAsThumbnail(eventId, img.url)}
              className="absolute bottom-4 right-4 rounded px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              variant={"ghost"}
            >
              Set as Thumbnail
            </Button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Widget */}
      <CldUploadWidget
        uploadPreset="next_preset"
        onSuccess={(result) => handleUploadSuccess(result)}
      >
        {({ open }) => (
          <>
            {!imageUrl && (
              <Button
                size="full"
                className="mb-4 mt-6"
                variant="accent"
                onClick={() => open()}
              >
                Upload an Image
                <Upload size={18} className="ml-2" />
              </Button>
            )}
          </>
        )}
      </CldUploadWidget>

      {/* Preview & Save Image */}
      {imageUrl && (
        <div className="mt-10">
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
