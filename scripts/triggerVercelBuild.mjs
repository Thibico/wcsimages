import axios from "axios";

import { vercelWebHook } from "../utils/config.mjs";

const triggerVercelBuild = async () => {
  console.log('\n triggering vercel build ...')
  await axios.get(vercelWebHook);
};

triggerVercelBuild();
