import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageSlider = () => {
  const images = [
    { url: 'graduates.jpg', alt: 'Slide 1' },
    { url: 'person.jpg', alt: 'Slide 2' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex >= images.length) newIndex = 0;
      if (newIndex < 0) newIndex = images.length - 1;
      return newIndex;
    });
  };

  React.useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute w-full h-full"
        >
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <button
          onClick={() => paginate(-1)}
          className="p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => paginate(1)}
          className="p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default ImageSlider;