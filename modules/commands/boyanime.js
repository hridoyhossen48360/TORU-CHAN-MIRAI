const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "boyanime",
    version: "1.0.0",
    author: "Hridoy",
    countDown: 5,
    role: 0,
    shortDescription: "Random Anime Pic",
    longDescription: "Send random anime picture from list",
    category: "Image",
    guide: "{pn}"
  },

  onStart: async function ({ message }) {
    try {

      const imageLinks = [
        "https://i.imgur.com/x6Cc9n6.jpg",
        "https://i.imgur.com/Jmb7V7h.jpg",
        "https://i.imgur.com/5trZsRg.jpg",
        "https://i.imgur.com/IzwQVwj.jpg",
        "https://i.imgur.com/8AOyfUj.jpg",
        "https://i.imgur.com/hJGZwyj.jpg",
        "https://i.imgur.com/QU1MKQd.jpg",
        "https://i.imgur.com/0frgNtL.jpg",
        "https://i.imgur.com/6v29Hz8.jpg",
        "https://i.imgur.com/RFwkQMI.jpg",
        "https://i.imgur.com/5QnAGFH.jpg",
        "https://i.imgur.com/G7SGPWI.jpg",
        "https://i.imgur.com/NuEQzfl.jpg",
        "https://i.imgur.com/zw53mfy.jpg",
        "https://i.imgur.com/GjG1tBz.jpg",
        "https://i.imgur.com/Mu8Y0vR.jpg",
        "https://i.imgur.com/VxEFxz6.jpg",
        "https://i.imgur.com/s8lysbe.jpg",
        "https://i.imgur.com/UqDJlIu.png",
        "https://i.imgur.com/PxiKaff.jpg",
        "https://i.imgur.com/SpW8Eq0.jpg",
        "https://i.imgur.com/vQ104Wa.jpg",
        "https://i.imgur.com/S1vyler.jpg",
        "https://i.imgur.com/UvHNwPB.jpg",
        "https://i.imgur.com/DKUxCGa.jpg"
      ];

      const randomLink = imageLinks[Math.floor(Math.random() * imageLinks.length)];

      const filePath = path.join(__dirname, "cache", "randomanime.jpg");
      const writer = fs.createWriteStream(filePath);

      const response = await axios({
        url: randomLink,
        method: "GET",
        responseType: "stream"
      });

      response.data.pipe(writer);

      writer.on("finish", async () => {
        await message.reply({
          body: "🌸 𝗕𝗼𝘆 𝗔𝗻𝗶𝗺𝗲 𝗣𝗶𝗰 🌸",
          attachment: fs.createReadStream(filePath)
        });
        fs.unlinkSync(filePath);
      });

      writer.on("error", () => {
        message.reply("❌ Image send failed!");
      });

    } catch (error) {
      message.reply("❌ Something went wrong!");
    }
  }
};