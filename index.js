const fs = require('fs');
const path = require('path');
const request = require('request');
const axios = require('axios');
require('dotenv').config()

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('\n\nDownloading Images from Airtable ... \n\n');

    const downloadImage = (url, dest, callback) => {
        request.head(url, (err, res, body) => {
            request(url).pipe(fs.createWriteStream(dest)).on('close', callback);
        });
    };

    const dbImages = await prisma.images.findMany({
        where: {
            changed: true
        }
    });

    console.log(`\n New Images: ${dbImages.length} \n`)
    for (const image of dbImages) {
        const { id, category, filenames, urls, images } = image;
        const imageUrls = urls.split(',');
        const fileNames = filenames.split(',');

        for (const [index, imageUrl] of imageUrls.entries()) {
            console.log("index", fileNames[index])
            downloadImage(
                imageUrl,
                path.join(
                    __dirname,
                    `./public/assets/${category}/raw/${fileNames[index].replace(
                        ' ',
                        ''
                    )}`
                ),
                () => {
                    console.log(
                        `✅ Saved ${fileNames[index]} to assets/${category}/raw/`
                    );
                }
            );
        }

        const data = {
            images,
            urls,
            filenames,
            category,
            changed: false
        };
        await prisma.images.update({
            where: {
                id: id
            },
            data
        });
    }
    let updatedDate = `Updated on ${new Date().toISOString()}`;
    try {
        fs.writeFileSync("log.txt", updatedDate);
    } catch (err) {
        console.error(err);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
        await axios.get(process.env.VERCEL_WEBHOOK)
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
