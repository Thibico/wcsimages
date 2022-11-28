const fs = require('fs').promises;
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const headers = { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` };

const fileWriter = async (filename, rawdata) => {
  const data = JSON.stringify(rawdata);
  await fs.writeFile(
    path.join(__dirname, `../data/${filename}.json`),
    data,
    'utf8'
  );
  console.log(`\n wrote ${filename}.json to data/ \n`);
};

const fetchTable = async (tableName, Params) => {
  try {
    let dataHost = [];
    let offset = '';
    const url = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}/${tableName}?${Params}`;
    console.log('url', url);
    const resp = await axios.get(url, { headers });
    offset = resp.data.offset ? resp.data.offset : '';
    dataHost.push(...resp.data.records);
    while (offset !== '') {
      const resp = await axios.get(`${url}&offset=${offset}`, { headers });
      offset = resp.data.offset ? resp.data.offset : '';
      dataHost.push(...resp.data.records);
      console.log(`${tableName} offset :`, offset, dataHost.length);
    }
    return dataHost;
  } catch (err) {
    console.error(err);
  }
};

async function loadAll() {
  try {
    const ecosystemRaw = await fetchTable(
      'ecosytems',
      'fields%5B%5D=ecosystems_image&maxRecords=10000'
    );
    fileWriter('ecosystemRaw', ecosystemRaw);

    const protectedareas = await fetchTable(
      'protected_areas',
      'fields%5B%5D=protected_area_image&maxRecords=10000'
    );
    fileWriter('protectedareasRaw', protectedareas);

    const speciesRaw = await fetchTable(
      'species',
      'fields%5B%5D=species_image&maxRecords=10000'
    );
    fileWriter('speciesRaw', speciesRaw);

    const speciesPlantsRaw = await fetchTable(
      'species_plants',
      'fields%5B%5D=species_plants_image&maxRecords=10000'
    );
    fileWriter('speciesPlantsRaw', speciesPlantsRaw);

  } catch (err) {
    console.error(`❌ Error (${err.code}): ${err.message}`);
  } finally {
    console.log(
      '\n Finished fetching and grouping species images, ecosystem images \n'
    );
  }
}
loadAll();
