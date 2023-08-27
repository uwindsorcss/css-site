import { NextPage } from 'next';
import Link from 'next/link';

import './style.css'; // Import the CSS file

type Image = {
  url: string;
  event: string;
  width: number;
  height: number;
};

const images: Image[] = [
  { url: '/images/css-logo-shield.png', event: 'none', width: 200, height: 200 },
  { url: '/images/event1/image1.jpg', event: 'event1', width: 100, height: 200 },
  { url: '/images/event1/image2.jpg', event: 'event1', width: 200, height: 100 },
  { url: '/images/event2/image1.jpg', event: 'event2', width: 150, height: 150 },
  { url: '/images/event2/image2.jpg', event: 'event2', width: 250, height: 250 },
];

const GalleryPage: NextPage = () => {
  const events = Array.from(new Set(images.map(image => image.event)));

  return (
    <div className='flex flex-col items-center justify-center min-h-screen gap-4'>
      <h1 className='text-2xl md:text-4xl text-center font-bold'>Gallery</h1>
      <div className="cards-container">
        {events.map(event => {
          const eventData:any = images.find(image => image.event === event);
          const thumbnailUrl = event === 'none' ? '/images/css-logo-shield.png' : eventData.url;

          return (
            <Link key={event} className='card' href={`/gallery/${event}`} passHref>
              <div className='thumbnail-container'>
                <img src={thumbnailUrl} alt={`Thumbnail for ${event}`} />
              </div>
              <h2>{event}</h2>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default GalleryPage;