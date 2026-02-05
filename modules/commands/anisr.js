const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const TIKTOK_SEARCH_API = "https://lyric-search-neon.vercel.app/kshitiz?keyword=";
const CACHE_DIR = path.join(__dirname, "cache_tiktok");

module.exports.config = {
  name: "anisr",
  version: "1.0.1",
  credits: "Hridoy",
  hasPermssion: 0,
  description: "Reels",
  commandCategory: "Media",
  usages: "anisr <keyword>",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const query = args.join(" ");
  if (!query) {
    return api.sendMessage(
      "একটা keyword দাও 🙂",
      event.threadID,
      event.messageID
    );
  }

  try {
    const res = await axios.get(
      TIKTOK_SEARCH_API + encodeURIComponent(query),
      { timeout: 20000 }
    );

    if (!res.data || !res.data.length) {
      return api.sendMessage(
        "কিছুই পাওয়া যায়নি 😔",
        event.threadID,
        event.messageID
      );
    }

    // 🎲 Random video (ONLY CHANGE)
    const video = res.data[Math.floor(Math.random() * res.data.length)];

    await fs.ensureDir(CACHE_DIR);

    const safeName = (video.title || "video")
      .replace(/[^a-z0-9]/gi, "_")
      .substring(0, 20);

    const filePath = path.join(
      CACHE_DIR,
      `${Date.now()}_${safeName}.mp4`
    );

    api.sendMessage("⏳ একটু অপেক্ষা করো...", event.threadID);

    const stream = await axios({
      url: video.videoUrl,
      responseType: "stream",
      timeout: 300000
    });

    const writer = fs.createWriteStream(filePath);
    stream.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    api.sendMessage(
      {
        body: ``,
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => fs.unlinkSync(filePath),
      event.messageID
    );

  } catch (err) {
    console.error(err);
    api.sendMessage(
      "ভিডিও আনতে সমস্যা হয়েছে 😔",
      event.threadID,
      event.messageID
    );
  }
};
