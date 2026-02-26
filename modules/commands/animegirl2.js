// modules/commands/waifu.js  (অথবা nsfw.js যা খুশি নাম দে)

const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "animegirl2",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "Hridoy",
  description: "Random NSFW pic from waifu.pics (waifu/neko/trap/blowjob) - random if no type given",
  commandCategory: "nsfw",
  usages: "animegirl2[waifu | neko | shinobu | megumin | bully | cuddle | cry | hug | awoo | kiss | lick | pat | smug | bonk | yeet | blush | smile | wave | highfive | handhold | nom | bite | glomp | slap | kill | kick | happy | wink | poke | dance | cringe](no arg = random category)",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  const nsfwCategories = ["waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "hug", "awoo", "kiss", "lick", "pat", "smug", "bonk", "yeet", "blush", "smile", "wave", "highfive", "handhold", "nom", "bite", "glomp", "slap", "kill", "kick", "happy", "wink", "poke", "dance", "cringe"];  // All available NSFW categories

  let category = args[0] ? args[0].toLowerCase() : null;

  // If no category given or invalid, pick random
  if (!category || !nsfwCategories.includes(category)) {
    category = nsfwCategories[Math.floor(Math.random() * nsfwCategories.length)];
  }

  let messageBody = `Random ${category} pic! 😈🔥`;

  try {
    // Fetch from waifu.pics NSFW endpoint
    const res = await axios.get(`https://api.waifu.pics/sfw/${category}`);
    const imgUrl = res.data.url;

    if (!imgUrl) {
      throw new Error("No image URL received");
    }

    // Download image to temp file (unique name to avoid conflict)
    const imgPath = path.join(__dirname, 'cache', `sfw_\( {category}_ \){Date.now()}.jpg`);
    const writer = fs.createWriteStream(imgPath);
    const imgRes = await axios.get(imgUrl, { responseType: 'stream' });
    imgRes.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    // Send the image
    api.sendMessage({
      body: messageBody,
      attachment: fs.createReadStream(imgPath)
    }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);

  } catch (err) {
    console.error(err);  // Log for debug
    api.sendMessage(`Error: ${err.message || "API থেকে সমস্যা"}. আবার ট্রাই করো! 😅`, event.threadID, event.messageID);
  }
};
