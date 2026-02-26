module.exports.config = {
  name: "fikfab",  // Command: !tikporn
  version: "1.0",
  hasPermssion: 0,
  credits: "Hridoy",
  description: "Random Tik.Porn video send করে..",
  commandCategory: "nsfw",
  usages: "",
  cooldowns: 10
};

module.exports.run = async function({ api, event }) {
  const axios = require('axios');
  const fs = require('fs-extra');

  try {
    // Random number generate: current max ~1.4 million, safe range 1000000 to 1400000
    // Adjust range as site grows (higher numbers = newer videos)
    const min = 1000000;
    const max = 1400000;  // Update this periodically if needed
    const randomId = Math.floor(Math.random() * (max - min + 1)) + min;

    const videoPageUrl = `https://tik.porn/video/${randomId}`;

    // Step 1: Page fetch করে video src extract করো (simple HTML parse)
    const response = await axios.get(videoPageUrl);
    const html = response.data;

    // Video src খুঁজে বের করো (tik.porn-এ সাধারণত <video src="https://...mp4" ...>)
    const srcMatch = html.match(/<video[^>]*src=["'](.*?)["']/i);
    let videoUrl = srcMatch ? srcMatch[1] : null;

    if (!videoUrl) {
      // Fallback: অন্য pattern যদি থাকে (data-src বা source tag)
      const sourceMatch = html.match(/<source[^>]*src=["'](.*?)["']/i);
      videoUrl = sourceMatch ? sourceMatch[1] : null;
    }

    if (!videoUrl) {
      // যদি না পাওয়া যায়, user-কে page link দাও
      return api.sendMessage(`Random video পাওয়া গেছে কিন্তু direct link extract হয়নি। এইটা চেক করো: ${videoPageUrl}\nNSFW warning!`, event.threadID, event.messageID);
    }

    // Video URL পেলে download
    const tempPath = __dirname + '/cache/tikporn.mp4';
    const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(tempPath, Buffer.from(videoResponse.data));

    // Send to chat
    api.sendMessage({
      body: `Random Tik.Porn clip 🔥 (ID: ${randomId})\nNSFW - careful in group!`,
      attachment: fs.createReadStream(tempPath)
    }, event.threadID, () => fs.unlinkSync(tempPath), event.messageID);

  } catch (error) {
    console.error(error.message);
    let msg = "কোনো সমস্যা হয়েছে (হয়তো invalid ID বা site block)। আবার চেষ্টা করো!";
    if (error.response && error.response.status === 404) {
      msg = "এই ID-তে video নেই। আবার !tikporn দাও।";
    }
    api.sendMessage(msg, event.threadID, event.messageID);
  }
};
