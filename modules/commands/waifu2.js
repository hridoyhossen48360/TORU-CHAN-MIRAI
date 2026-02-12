// modules/commands/waifu.js  (অথবা hentai.js)

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "waifu2",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Kakashi",
  description: "Random waifu/neko/hentai pic (NSFW) from waifu.im",
  commandCategory: "nsfw",
  usages: "[waifu | neko | hentai | mix]  (default: waifu)",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  let tag = args[0] ? args[0].toLowerCase() : "waifu";

  let includedTags = "waifu";  // default
  let messageBody = "Random waifu pic! 😏";

  if (tag === "neko") {
    includedTags = "neko";
    messageBody = "Random neko pic! 🐱🔞";
  } else if (tag === "hentai") {
    includedTags = "hentai";
    messageBody = "Random hentai pic! 🔥😈";
  } else if (tag === "mix" || tag === "all") {
    // Mix: waifu + neko + hentai tags
    includedTags = "waifu,neko,hentai";  // multiple tags দিলে random from any
    messageBody = "Random mix waifu/neko/hentai pic! 🌶️";
  } // else default waifu

  try {
    // waifu.im API call
    const apiUrl = `https://api.waifu.im/search?included_tags=${includedTags}&is_nsfw=true&gif=false`;
    const res = await axios.get(apiUrl);
    
    if (!res.data.images || res.data.images.length === 0) {
      throw new Error("No images found");
    }

    const imgUrl = res.data.images[0].url;  // first image

    // Download to temp
    const imgPath = path.join(__dirname, 'cache', `waifu_${Date.now()}.jpg`);
    const writer = fs.createWriteStream(imgPath);
    const imgRes = await axios.get(imgUrl, { responseType: 'stream' });
    imgRes.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Send
    api.sendMessage({
      body: messageBody,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);

  } catch (err) {
    api.sendMessage(`Error: ${err.message || "API issue"}. Try again later! 😅`, event.threadID, event.messageID);
  }
};
