import React, { useState } from 'react';

const ProductImageGallery = ({ images, productName }) => {
    // Use the first image as the initial main image, or a placeholder if no images exist.
    const imageList = images && images.length > 0 ? images : ['https://placehold.co/600x600?text=No+Image'];
    const [mainImage, setMainImage] = useState(imageList[0]);

    return (
        <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Vertical Thumbnails */}
            <div className="flex md:flex-col gap-3 justify-center md:justify-start">
                {imageList.map((img, index) => (
                    <div
                        key={index}
                        onMouseOver={() => setMainImage(img)}
                        className={`w-16 h-16 border rounded-md p-1 cursor-pointer transition-all ${
                            mainImage === img ? 'border-blue-600' : 'border-gray-200'
                        }`}
                    >
                        <img 
                            src={img} 
                            alt={`Thumbnail ${index + 1}`} 
                            className="w-full h-full object-contain"
                            onError={(e) => { e.target.src = 'https://placehold.co/64x64?text=Img'; }}
                        />
                    </div>
                ))}
            </div>
            
            {/* Main Image */}
            <div className="flex-1 border rounded-md p-2 flex items-center justify-center">
                <img 
                    src={mainImage} 
                    alt={productName} 
                    className="w-full h-auto max-h-[400px] object-contain" 
                    onError={(e) => { e.target.src = 'https://placehold.co/400x400?text=No+Image'; }}
                />
            </div>
        </div>
    );
};

export default ProductImageGallery;