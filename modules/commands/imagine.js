module.exports.config = {
  name: "imagine",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ × Fixed by Hridoy",
  description: "Generate image using Pollinations AI",
  commandCategory: "AI",
  usages: "imagine <text>",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require("axios");
  const fs = require("fs-extra");
  const path = require("path");

  const { threadID, messageID } = event;
  const query = args.join(" ");

  if (!query)
    return api.sendMessage("❌ Please provide a prompt.\nExample: imagine anime boy", threadID, messageID);

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

  const imgPath = path.join(cacheDir, `imagine_${Date.now()}.png`);

  try {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(query)}`;

    const res = await axios.get(url, { responseType: "arraybuffer" });

    // Check if image data is returned
    if (!res.data || res.data.length < 1000) {
      return api.sendMessage("❌ Failed to generate image. The AI server may not have returned an image.", threadID, messageID);
    }

    fs.writeFileSync(imgPath, res.data);

    // Send the image
    await api.sendMessage(
      {
        body: `🖼️ Image generated for:\n“${query}”`,
        attachment: fs.createReadStream(imgPath)
      },
      threadID
    );

    // Delete cached image after sending
    fs.unlinkSync(imgPath);

  } catch (err) {
    console.error(err); // Dekhar jonno console e error
    return api.sendMessage("❌ Failed to generate image. Please try again later.", threadID, messageID);
  }
};
