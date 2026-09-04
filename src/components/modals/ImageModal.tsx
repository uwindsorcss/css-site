"use client";

import { useState } from "react";
import Image from "next/image";

type ImageProps = {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  customClass?: string;
};

const ImageWithModal: React.FC<ImageProps> = ({ src, alt, customClass }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="relative h-64 w-full cursor-pointer overflow-hidden"
        onClick={() => setIsModalOpen(true)}>
        <img
          src={src}
          alt={alt}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          className={customClass || ""}
        />
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setIsModalOpen(false)}>
          <div className="relative flex h-screen w-screen items-center justify-center p-4">
            <img src={src} alt={alt} className="h-full w-full object-contain" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 dark:bg-gray-800">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageWithModal;
