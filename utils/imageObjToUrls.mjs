const imageObjectsToUrls = (images) => {
  let imageUrls = "";
  try {
    // const images = species_image;
    if (images && images.length > 0) {
      for (const eachImage of images) {
        const imageUrl = eachImage["filename"] ?? "";
        imageUrls += `,${imageUrl}`;
      }
    }
  } catch (err) {}

  return imageUrls.substring(1);
};

export default imageObjectsToUrls;