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
      <div className="relative w-full h-64 cursor-pointer overflow-hidden" onClick={() => setIsModalOpen(true)}>
        <img
          src={src}
          alt={alt}
          style={{ objectFit: "cover", width: "100%", height: "100%" }}
          className={customClass || ""}
        />
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative w-screen h-screen p-4 flex justify-center items-center">
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-contain"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
              className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full p-2 z-10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageWithModal;