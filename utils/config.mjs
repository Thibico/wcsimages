import dotenv from "dotenv";
dotenv.config();

const baseUrl = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE}`;
const headers = { Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}` };
const webhookUrl = process.env.WEBHOOK_URL
const vercelWebHook = process.env.VERCEL_WEBHOOK

export { baseUrl, headers, webhookUrl, vercelWebHook };
