import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categories = ['ecosystems', 'protected_area', 'species', 'species_plants', 'marine_pages_rendering'];

const compressImages = async (category) => {
  const destFileName = path.join(
    __dirname,
    `../public/assets/${category}/raw/*.{jpg,png}`
  );
  const destPath = path.join(__dirname, `../public/assets/${category}/resized`);
  await imagemin([destFileName], {
    destination: destPath,
    plugins: [
      imageminMozjpeg({ quality: 80 }),
      imageminPngquant({
        quality: [0.6, 0.8]
      })
    ]
  });
  console.log(`✅ Successfully compressed images for => ${category} \n`);
};

(async () => {
  for (const category of categories) {
    try {
      console.log(` \n Compressing images for => ${category}`);
      await compressImages(category);
    } catch (err) {
      console.log(`❌ Failed to compress images for => ${category}`, err);
    }
  }
})();
