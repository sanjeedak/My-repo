// src/utils/transformProductData.js

/**
 * API se mile product data ko UI ke liye format karta hai.
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

  // Use the slug from the API if it exists, otherwise generate one.
  const slug = apiProduct.slug || (apiProduct.name ? apiProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : apiProduct.id);

  // Use the category object from the API directly.
  const categoryWithSlug = apiProduct.category ? {
    ...apiProduct.category,
    slug: apiProduct.category.slug || apiProduct.category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  } : null;

  // Use the store object from the API directly.
  const storeWithSlug = apiProduct.store ? {
    ...apiProduct.store,
    slug: apiProduct.store.slug || apiProduct.store.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  } : null;

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
    image: apiProduct.image_1,
    images: images,
    rating: parseFloat(apiProduct.rating),
    totalReviews: apiProduct.total_reviews || 0,
    quantity: apiProduct.quantity,
    description: apiProduct.description,
	  store: storeWithSlug,
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