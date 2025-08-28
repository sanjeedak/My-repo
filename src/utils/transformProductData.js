// src/utils/transformProductData.js

/**
 * API se mile product data ko UI ke liye a se format karta hai.
 * @param {object} apiProduct - API se mila product object.
 * @returns {object} - UI ke liye formatted product object.
 */
export const transformProductData = (apiProduct) => {
  const mrp = parseFloat(apiProduct.mrp);
  const sellingPrice = parseFloat(apiProduct.selling_price);
  let discountPercent = 0;

  if (mrp > sellingPrice) {
    discountPercent = Math.round(((mrp - sellingPrice) / mrp) * 100);
  }

  // FIX: Generate a slug from the product name if one doesn't exist, using product ID as a final fallback.
  const slug = apiProduct.slug || (apiProduct.name ? apiProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : apiProduct.id);

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    slug: slug, // Use the new slug
    price: sellingPrice,
    originalPrice: mrp,
    discount: discountPercent,
    image: apiProduct.image_1,
    rating: parseFloat(apiProduct.rating),
    totalReviews: apiProduct.total_reviews || 0,
    quantity: apiProduct.quantity,
    description: apiProduct.description,
  };
};