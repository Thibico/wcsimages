import { writeFileSync, createWriteStream } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import request from "request";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readJsonFile = async (filepath) =>
  JSON.parse(await readFile(new URL(filepath, import.meta.url)));

const jsonWriter = async (filename, rawdata) => {
  const data = JSON.stringify(rawdata);
  writeFileSync(path.join(__dirname, `../data/${filename}.json`), data, "utf8");
  console.log(`\n wrote ${filename}.json to data/ \n`);
};

const imageWriter = async (url, dest, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(createWriteStream(dest)).on("close", callback);
  });
};

export { readJsonFile, jsonWriter, imageWriter };
