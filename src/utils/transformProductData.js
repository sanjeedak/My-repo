// src/utils/transformProductData.js

/**
 * @param {object} apiProduct 
 * @returns {object} - formatted product data for frontend use
 */
export const transformProductData = (apiProduct) => {
  const mrp = parseFloat(apiProduct.mrp);
  const sellingPrice = parseFloat(apiProduct.selling_price);
  let discountPercent = 0;

  if (mrp > sellingPrice) {
    discountPercent = Math.round(((mrp - sellingPrice) / mrp) * 100);
  }

  const slug = apiProduct.slug || (apiProduct.name ? apiProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : apiProduct.id);

  const categoryWithSlug = apiProduct.category ? {
    ...apiProduct.category,
    slug: apiProduct.category.slug || apiProduct.category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  } : null;

  // --- THIS IS THE FIX ---
  // Handle cases where the API provides a full 'store' object or just a 'store_id'.
  let storeWithSlug = null;
  if (apiProduct.store) {
    storeWithSlug = {
      ...apiProduct.store,
      slug: apiProduct.store.slug || (apiProduct.store.name ? apiProduct.store.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : apiProduct.store.id)
    };
  } else if (apiProduct.store_id) {
    // If only store_id is available, create a minimal store object.
    // The 'id' is the crucial part for the cart functionality.
    storeWithSlug = {
      id: apiProduct.store_id,
      name: 'Seller', // Placeholder name as it's not available in the wishlist product data
      slug: apiProduct.store_id
    };
  }
  // --- END OF FIX ---

  const images = [];
  for (let i = 1; i <= 10; i++) {
    if (apiProduct[`image_${i}`]) {
      images.push(apiProduct[`image_${i}`]);
    }
  }
  if (apiProduct.productMedia && Array.isArray(apiProduct.productMedia)) {
    apiProduct.productMedia.forEach(media => {
      if (media.media_type === 'image' && media.media_url && !images.includes(media.media_url)) {
        images.push(media.media_url);
      }
    });
  }


  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: slug,
    price: sellingPrice,
    originalPrice: mrp,
    discount: discountPercent,
    image: apiProduct.image_1 || (images.length > 0 ? images[0] : null), // Improved image fallback
    images: images,
    rating: parseFloat(apiProduct.rating),
    totalReviews: apiProduct.total_reviews || 0,
    quantity: apiProduct.quantity,
    description: apiProduct.description,
	  store: storeWithSlug,
    store_id: apiProduct.store_id, // Also pass the raw store_id for robustness
    category: categoryWithSlug,
    specifications: [
      { name: 'Product Code', value: apiProduct.product_code },
      { name: 'SKU', value: apiProduct.sku_id },
      { name: 'Color', value: apiProduct.colour },
      { name: 'Size', value: apiProduct.size },
      { name: 'Return Policy', value: apiProduct.return_exchange_condition },
    ].filter(spec => spec.value)
  };
};