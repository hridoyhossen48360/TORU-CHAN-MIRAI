module.exports.config = {
  name: "nekos",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "Hridoy x Sabah",
  description: "Random Anime Image (NekosAPI)",
  commandCategory: "Image",
  usages: "",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const axios = require("axios");
  const fs = require("fs");
  const path = require("path");

  try {
    const apiURL = "https://api.nekosapi.com/v4/images/random";

    const res = await axios.get(apiURL);

    if (!res.data.items || !res.data.items[0].image_url) {
      return api.sendMessage("⚠️ Image not found from API.", event.threadID, event.messageID);
    }

    const imageUrl = res.data.items[0].image_url;
    const ext = imageUrl.split(".").pop().split("?")[0] || "jpg";

    const filePath = path.join(__dirname, "cache", `anime.${ext}`);

    const img = await axios.get(imageUrl, { responseType: "arraybuffer" });

    fs.writeFileSync(filePath, Buffer.from(img.data, "binary"));

    api.sendMessage(
      {
        body: "🌸 Random Anime Image",
        attachment: fs.createReadStream(filePath)
      },
      event.threadID,
      () => fs.unlinkSync(filePath),
      event.messageID
    );

  } catch (err) {
    console.error(err.response?.data || err.message);
    api.sendMessage("❌ Failed to fetch anime image. Try again later.", event.threadID, event.messageID);
  }
};
