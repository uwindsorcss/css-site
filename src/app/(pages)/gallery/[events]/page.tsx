'use client';
import { useEffect, useState } from 'react';
import { CldUploadWidget } from "next-cloudinary";
import { addEventImage, deleteEventImage } from "@/lib/actions";
import { getEventImages } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Trophy, Upload, X } from 'lucide-react';
import { EventImage } from '@/types/models';
import ImageWithModal from '@/components/modals/ImageModal';
interface PageProps {
  params: { events: string };
}

export default async function Event({ params }: PageProps) {
  const eventId = Number(params.events);
  const [eventImages, setEventImages] = useState<EventImage[]>([]);
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

  const handleDeleteImage = async (imageId: number) => {
    try{
      deleteEventImage(imageId);
      alert("Image deleted successfully!");
      setEventImages(eventImages.filter((img) => img.id !== imageId));
    } catch (error) {
      alert("Failed to delete image.");
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchEventImages = async () => {
      const images = await getEventImages(eventId);
      setEventImages(images? images : []);
    };
    fetchEventImages();
  }, []);

  // TODO Replace true with session can edit check.
  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold">Gallery</h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 mt-6 mb-6">
        {eventImages.length === 0 && (
          <p className="text-center text-lg font-semibold text-muted-foreground">No images to show</p>
        )}
        {eventImages.map((img, index) => (
          <div key={img.id} className='relative group'>
            <ImageWithModal key={index} src={img.url} alt={`Event image ${index + 1}`} customClass="rounded shadow-md object-cover"/>
            {true && (
              <button
              onClick={() => handleDeleteImage(img.id)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <X size={18} />
            </button>
            )}
          </div>
        ))}
      </div>
      { true && (
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
      )}
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
