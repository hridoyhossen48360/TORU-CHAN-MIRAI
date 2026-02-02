module.exports.config = {
  name: "anemi",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "SHAHADAT SAHU",
  description: "Random Anime Video",
  commandCategory: "Media",
  usages: "anemi",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const axios = global.nodemodule["axios"];
  const fs = global.nodemodule["fs-extra"];

  const API_LIST_URL =
    "https://anime-api-by-sahu.vercel.app";

  try {
    const listRes = await axios.get(API_LIST_URL);
    const data = listRes.data;

    // ✅ SAFE API RESOLVE
    let API = null;

    if (Array.isArray(data.anime_video)) {
      API = data.anime_video[Math.floor(Math.random() * data.anime_video.length)];
    } else if (typeof data.anime_video === "string") {
      API = data.anime_video;
    } else if (data.anime && data.anime.video) {
      API = data.anime.video;
    }

    if (!API) {
      return api.sendMessage(
        "❌ Anime API পাওয়া যায়নি",
        event.threadID,
        event.messageID
      );
    }

    const cacheDir = __dirname + "/cache";
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const filePath = `${cacheDir}/anemi_${Date.now()}.mp4`;

    const response = await axios({
      url: API,
      method: "GET",
      responseType: "stream",
      timeout: 120000
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        {
          body: " ",
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );
    });

    writer.on("error", () => {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      api.sendMessage("❌ File error", event.threadID, event.messageID);
    });

  } catch (err) {
    console.log("ANEMI ERROR:", err.message);
    api.sendMessage(
      "❌ Server সমস্যা, পরে আবার চেষ্টা করো",
      event.threadID,
      event.messageID
    );
  }
};
