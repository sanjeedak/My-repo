export const transformProductData = (apiProduct) => {
  const mrp = parseFloat(apiProduct.mrp);
  const sellingPrice = parseFloat(apiProduct.selling_price);
  let discount = 0;
  if (mrp > sellingPrice) {
    discount = Math.round(((mrp - sellingPrice) / mrp) * 100);
  }
  return {
    id: apiProduct.id,
    title: apiProduct.name, // Changed from name to title for consistency if needed elsewhere
    name: apiProduct.name, // Kept name for direct use
    price: sellingPrice,
    originalPrice: mrp,
    discountAmount: (mrp - sellingPrice).toFixed(2),
    discount: discount,
    image: apiProduct.image_1,
    rating: parseFloat(apiProduct.rating),
    total_reviews: apiProduct.total_reviews || 0,
  };
};