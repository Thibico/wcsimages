import { jsonWriter } from "./utils/fileWriter.mjs";
import fetchImageTable from "./utils/fetchImageTable.mjs";

const loadAll = async () => {
  console.log("\n\nFetching image data from Airtable ... \n\n");
  try {
    const ecosystemImages = await fetchImageTable(
      "ecosytems",
      "fields%5B%5D=name&fields%5B%5D=ecosystems_image&maxRecords=10000"
    );
    jsonWriter("ecosystemImages", ecosystemImages);

    const protectedareas = await fetchImageTable(
      "protected_areas",
      "fields%5B%5D=id&fields%5B%5D=protected_area_image&maxRecords=10000"
    );
    jsonWriter("protectedareasImages", protectedareas);

    const speciesImages = await fetchImageTable(
      "species",
      "fields%5B%5D=linked_name&fields%5B%5D=species_image&maxRecords=10000"
    );
    jsonWriter("speciesImages", speciesImages);

    const speciesPlantsImages = await fetchImageTable(
      "species_plants",
      "fields%5B%5D=index&fields%5B%5D=species_plants_image&maxRecords=10000"
    );
    jsonWriter("speciesPlantsImages", speciesPlantsImages);
  } catch (err) {
    console.error(`❌ Error (${err.code}): ${err.message}`);
  } finally {
    console.log(
      "\n Finished fetching and grouping species images, ecosystem images \n"
    );
  }
};

loadAll();
