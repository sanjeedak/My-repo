import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Zoom } from "swiper/modules";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/zoom";

// Custom styles
const swiperStyles = `
  .swiper-button-next, .swiper-button-prev {
    color: #0071DC;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    transition: all 0.3s;
  }
  .swiper-button-next:hover, .swiper-button-prev:hover {
    background-color: #0071DC;
    color: #fff;
  }
  .swiper-button-next::after, .swiper-button-prev::after {
    font-size: 16px;
    font-weight: bold;
  }
  .swiper-slide-thumb-active .thumb-container {
    border-color: #0071DC;
    opacity: 1;
    transform: scale(1.05);
  }
  .swiper-slide .thumb-container {
    opacity: 0.6;
    transition: opacity 0.3s, border-color 0.3s, transform 0.2s;
  }
  .swiper-slide:hover .thumb-container {
    opacity: 1;
  }
`;

const ProductImageGallery = ({ images, productName }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const imageList =
    images && images.length > 0
      ? images
      : ["https://placehold.co/600x600?text=No+Image"];
  const hasMultipleImages = imageList.length > 1;

  return (
    <div className="w-full">
      <style>{swiperStyles}</style>

      {/* Main Slider */}
      <Swiper
        style={{
          "--swiper-navigation-color": "#0071DC",
          "--swiper-pagination-color": "#0071DC",
        }}
        spaceBetween={10}
        navigation={hasMultipleImages}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[FreeMode, Navigation, Thumbs, Zoom]}
        zoom={true}
        className="mySwiper2 border rounded-lg shadow-md"
      >
        {imageList.map((img, index) => (
          <SwiperSlide
            key={index}
            className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-2 aspect-[4/5] sm:aspect-square"
          >
            <div className="swiper-zoom-container">
              <img
                src={img}
                alt={`${productName} - view ${index + 1}`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/400x400?text=No+Image";
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnails */}
      {hasMultipleImages && (
        <Swiper
          onSwiper={setThumbsSwiper}
          spaceBetween={8}
          slidesPerView={4}
          breakpoints={{
            640: { slidesPerView: 5 },
            1024: { slidesPerView: 6 },
          }}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Navigation, Thumbs]}
          className="mySwiper mt-3"
        >
          {imageList.map((img, index) => (
            <SwiperSlide key={index} className="cursor-pointer">
              <div className="thumb-container border-2 rounded-md p-1 aspect-square sm:aspect-[4/5] flex items-center justify-center bg-white">
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/64x64?text=Img";
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ProductImageGallery;
