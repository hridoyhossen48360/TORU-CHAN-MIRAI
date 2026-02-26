module.exports.config = {
  name: "imganime",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Hridoy",
  description: "Random Anime Image (Stable)",
  commandCategory: "Image",
  usages: "",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const axios = require("axios");
  const fs = require("fs");
  const path = require("path");

  try {
    const apiURL = "https://api.waifu.pics/sfw/waifu";

    const res = await axios.get(apiURL);

    if (!res.data.url) {
      return api.sendMessage("⚠️ Image not found from API.", event.threadID, event.messageID);
    }

    const imageUrl = res.data.url;
    const ext = imageUrl.split(".").pop().split("?")[0];

    const filePath = path.join(__dirname, "cache", `anime.${ext}`);

    const img = await axios.get(imageUrl, { responseType: "arraybuffer" });

    fs.writeFileSync(filePath, Buffer.from(img.data, "binary"));

    api.sendMessage(
      {
        body: "🌸 Random Anime Image 🌸",
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => fs.unlinkSync(filePath),
      event.messageID
    );

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Failed to fetch anime image. Try again later.", event.threadID, event.messageID);
  }
};
