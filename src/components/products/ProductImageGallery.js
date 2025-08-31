import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Zoom } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/zoom';

// A custom CSS style for better arrow visibility and effects
const swiperStyles = `
  .swiper-button-next, .swiper-button-prev {
    color: #0071DC;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: opacity 0.2s;
  }
  .swiper-button-next::after, .swiper-button-prev::after {
    font-size: 16px;
    font-weight: bold;
  }
  .swiper-slide-thumb-active .thumb-container {
    border-color: #0071DC;
    opacity: 1;
  }
  .swiper-slide .thumb-container {
    opacity: 0.6;
    transition: opacity 0.3s, border-color 0.3s;
  }
  .swiper-slide:hover .thumb-container {
    opacity: 1;
  }
  .swiper-zoom-container > img {
    transition: transform 0.3s ease-out;
  }
  .swiper-zoom-container:hover > img {
    transform: scale(1.1);
  }
`;

const ProductImageGallery = ({ images, productName }) => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const imageList = images && images.length > 0 ? images : ['https://placehold.co/600x600?text=No+Image'];
    const hasMultipleImages = imageList.length > 1;

    return (
        <div>
            <style>{swiperStyles}</style>
            {/* Main Image Slider */}
            <Swiper
                style={{
                    '--swiper-navigation-color': '#0071DC',
                    '--swiper-pagination-color': '#0071DC',
                }}
                spaceBetween={10}
                navigation={hasMultipleImages}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs, Zoom]}
                zoom={true}
                className="mySwiper2 border rounded-lg shadow-sm"
            >
                {imageList.map((img, index) => (
                    <SwiperSlide key={index} className="flex items-center justify-center bg-white p-2">
                        <div className="swiper-zoom-container">
                            <img 
                                src={img} 
                                alt={`${productName} - view ${index + 1}`} 
                                className="w-full h-auto max-h-96 object-contain"
                                onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Thumbnails Slider - only render if there are multiple images */}
            {hasMultipleImages && (
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper mt-3"
                     breakpoints={{
                        320: { slidesPerView: 3, spaceBetween: 8 },
                        640: { slidesPerView: 4, spaceBetween: 10 },
                        1024: { slidesPerView: 5, spaceBetween: 12 },
                    }}
                >
                    {imageList.map((img, index) => (
                        <SwiperSlide key={index} className="cursor-pointer">
                            <div className="thumb-container border-2 rounded-md p-1 transition-all">
                                <img 
                                    src={img} 
                                    alt={`Thumbnail ${index + 1}`} 
                                    className="w-full h-20 object-contain"
                                    onError={(e) => { e.target.src = 'https://placehold.co/64x64?text=Img'; }}
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

