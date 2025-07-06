import { LingoDotDevEngine } from "lingo.dev/sdk";

const lingo = new LingoDotDevEngine({
  apiKey: process.env.LINGODOTDEV_API_KEY || "",
});

export {lingo}