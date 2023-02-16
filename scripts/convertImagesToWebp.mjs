import imagemin from "imagemin";
import imageminWebp from "imagemin-webp";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categories = [
  "ecosystems",
  "protected_area",
  "species",
  "species_plants",
  "marine_pages_rendering",
];

const convertImages = async (category) => {
  const destFileName = path.join(
    __dirname,
    `../public/assets/${category}/resized/*.{jpg,png}`
  );
  const destPath = path.join(__dirname, `../public/assets/${category}/images`);
  await imagemin([destFileName], {
    destination: destPath,
    plugins: [
      imageminWebp({
        quality: 80,
        resize: {
          width: 800,
          height: 0,
        },
      }),
    ],
  });
  console.log(`✅ Successfully optimized images for => ${category} \n`);
};

(async () => {
  for (const category of categories) {
    try {
      console.log(` \n Optimizing images for => ${category}`);
      await convertImages(category);
    } catch (err) {
      console.log(`❌ Failed to optimize images for => ${category}`, err);
    }
  }
})();
