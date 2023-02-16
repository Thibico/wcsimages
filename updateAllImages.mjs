import fs from "fs";
import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";
const require = createRequire(import.meta.url);
import request from "request";
import { PrismaClient } from "@prisma/client";
import { jsonWriter } from "./utils/fileWriter.mjs";

const speciesPlantsImages = require("./data/speciesPlantsImages.json");
const speciesImages = require("./data/speciesImages.json");
const ecosystemImages = require("./data/ecosystemImages.json");
const protectedareasImages = require("./data/protectedareasImages.json");
const marinePagesImages = require("./data/marinePagesImages.json");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  let imageHost = [];

  const downloadImage = (url, dest, callback) => {
    request.head(url, (err, res, body) => {
      request(url).pipe(fs.createWriteStream(dest)).on("close", callback);
    });
  };

  const extractImages = async (data, name, id) => {
    for (const eachObj of data) {
      try {
        const uniqueid = eachObj.fields?.[id];
        const images = eachObj.fields?.[`${name}_image`];
        console.log("images", images);
        let imageIDHost = [];
        let imageUrlHost = [];
        let filenameHost = [];
        if (images && images.length > 0) {
          for (const eachImage of images) {
            imageIDHost.push(eachImage.id);
            imageUrlHost.push(eachImage["thumbnails"]["full"]["url"] ?? "");
            filenameHost.push(eachImage.filename);
          }
        }
        const image = {
          id: uniqueid,
          images: imageIDHost.join(),
          urls: imageUrlHost.join(),
          filenames: filenameHost.join(),
          category: name,
          changed: false,
        };
        if (
          image.images !== "" &&
          image.urls !== "" &&
          images.filename !== ""
        ) {
          imageHost.push(image);
        }
      } catch (err) {}
    }
  };

  await extractImages(speciesPlantsImages, "species_plants", "index");
  await extractImages(speciesImages, "species", "linked_name");
  await extractImages(ecosystemImages, "ecosystems", "name");
  await extractImages(protectedareasImages, "protected_area", "id");
  await extractImages(marinePagesImages, "marine_pages_rendering", "unique_id");
  await jsonWriter("images", imageHost);

  let imagesCount = 0;
  for (const image of imageHost) {
    const { id, category, filenames, urls, images } = image;
    const imageUrls = urls.split(",");
    const fileNames = filenames.split(",");

    for (const [index, imageUrl] of imageUrls.entries()) {
      console.log("index", fileNames[index]);
      downloadImage(
        imageUrl,
        path.join(
          __dirname,
          `./public/assets/${category}/raw/${fileNames[index].replace(" ", "")}`
        ),
        () => {
          console.log(
            `✅ Saved ${fileNames[index]} to assets/${category}/raw/`
          );
        }
      );
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
