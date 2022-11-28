import axios from "axios";

import { headers, baseUrl } from "./config.mjs";

const fetchImageTable = async (tableName, Params) => {
  try {
    let dataHost = [];
    let offset = "";
    const url = `${baseUrl}/${tableName}?${Params}`;
    const resp = await axios.get(url, { headers });
    offset = resp.data.offset ? resp.data.offset : "";
    dataHost.push(...resp.data.records);
    while (offset !== "") {
      const resp = await axios.get(`${url}&offset=${offset}`, { headers });
      offset = resp.data.offset ? resp.data.offset : "";
      dataHost.push(...resp.data.records);
      console.log(`${tableName} offset :`, offset, dataHost.length);
    }
    return dataHost;
  } catch (err) {
    console.error(err);
  }
};

export default fetchImageTable;
