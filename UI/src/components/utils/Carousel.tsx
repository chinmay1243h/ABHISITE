import React, { useState } from 'react';
import PosterCard from '../cards/PosterCard';
// import './Carousel.css';

interface CarouselItem {
  image: string;
  title: string;
  description: string;
}

interface CarouselProps {
  items: CarouselItem[];
}

const Carousel: React.FC<CarouselProps> = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  return (
    <div id="carousel">
      <button onClick={handlePrev} id="carousel-button prev">‹</button>

      <div id="carousel-items">
        {items.map((item, index) => (
          <div
            key={index}
            id={`carousel-item ${index === activeIndex ? 'active' : ''}`}
          >
            {/* <PosterCard
        title={item.title}
        description={item.description}
        image={item.image}
      /> */}
          </div>
        ))}
      </div>
      <button onClick={handleNext} id="carousel-button next">›</button>
    </div>
  );
};

export default Carousel;
