const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const Jimp = require("jimp");

module.exports.config = {
  name: "editpic",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Hridoy",
  description: "Edit picture with multiple filters",
  commandCategory: "Image",
  usages: "[filter] + reply image",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments[0].type !== "photo") {
      return api.sendMessage("❌ অনুগ্রহ করে একটি ছবিতে রিপ্লাই দিন!", event.threadID, event.messageID);
    }

    const filter = args[0] ? args[0].toLowerCase() : "default";
    const imgURL = event.messageReply.attachments[0].url;
    const imgPath = path.join(__dirname, `/cache/edit_${event.senderID}.jpg`);

    // Download image
    const response = await axios.get(imgURL, { responseType: "arraybuffer" });
    fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));

    // Edit with Jimp
    const image = await Jimp.read(imgPath);

    switch (filter) {
      case "blur":
        image.blur(5);
        break;
      case "gray":
        image.grayscale();
        break;
      case "sepia":
        image.sepia();
        break;
      case "bright":
        image.brightness(0.3);
        break;
      case "contrast":
        image.contrast(0.5);
        break;
      case "invert":
        image.invert();
        break;
      case "pixel":
        image.pixelate(10);
        break;
      case "cartoon":
        image.posterize(5).contrast(0.3);
        break;
      default:
        image.grayscale().blur(3); // Default effect
        break;
    }

    await image.writeAsync(imgPath);

    // Send back edited image
    api.sendMessage(
      { body: `✨ আপনার ছবিতে '${filter}' ফিল্টার এপ্লাই করা হলো!`, attachment: fs.createReadStream(imgPath) },
      event.threadID,
      () => fs.unlinkSync(imgPath),
      event.messageID
    );
  } catch (err) {
    console.error(err);
    api.sendMessage("⚠️ ছবিটি এডিট করতে সমস্যা হয়েছে!", event.threadID, event.messageID);
  }
};
