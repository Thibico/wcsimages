// const axios = require("axios");
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config()

const fetchTableFromAirtable = async (tableName, maxRecords) => {
  const baseUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}`;
  const headers = { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` };

  try {
    let decHost = [];
    let offset = "";
    const url = `${baseUrl}/${tableName}?maxRecords=${maxRecords}`;
    const resp = await axios.get(url, { headers });
    offset = resp.data.offset ? resp.data.offset : "";
    decHost.push(...resp.data.records);
    while (offset !== "") {
      const resp = await axios.get(`${url}&offset=${offset}`, { headers });
      offset = resp.data.offset ? resp.data.offset : "";
      decHost.push(...resp.data.records);
      console.log(`\n ${tableName} offset :`, offset, decHost.length);
    }
    return decHost;
  } catch (err) {
    console.error(err);
  }
};

export default fetchTableFromAirtable;
