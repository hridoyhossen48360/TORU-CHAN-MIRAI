// modules/commands/waifu.js (or hentai.js - name it as you want, the 'name' in config will be the command)

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "waifu",  // Command: !waifu (or your prefix)
  version: "1.0.0",
  hasPermssion: 0,  // 0: anyone, 1: group admin, 2: bot admin
  credits: "Hridoy",  // Your credit
  description: "Random NSFW waifu or hentai pic from API",
  commandCategory: "nsfw",
  usages: "[waifu/hentai/neko]",  // Example: !waifu hentai
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const type = args[0] || "waifu";  // Default to waifu, or pass hentai, neko etc.
  
  // Check if NSFW allowed? (Optional, Mirai doesn't have built-in NSFW check, add if needed)
  // For now, assume it's okay.

  try {
    // Use waifu.pics API (simple)
    const res = await axios.get(`https://api.waifu.pics/nsfw/${type}`);
    const imgUrl = res.data.url;

    // Download image to temp file
    const imgPath = path.join(__dirname, 'cache', `${type}.jpg`);
    const writer = fs.createWriteStream(imgPath);
    const imgRes = await axios.get(imgUrl, { responseType: 'stream' });
    imgRes.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Send image
    api.sendMessage({
      body: `Random ${type} pic! 😏`,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);  // Delete after send

  } catch (err) {
    api.sendMessage(`Error: ${err.message}. Try again!`, event.threadID, event.messageID);
  }
};
