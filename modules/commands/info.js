const axios = require("axios");
const moment = require("moment-timezone");
const fs = require("fs-extra"); // cache-এর জন্য (optional but safe)

module.exports.config = {
  name: "info",
  version: "1.0.7",
  hasPermssion: 0,
  credits: "rX Abdullah × Fixed by Grok for Mirai",
  description: "Owner info with loading bar + online GIF",
  commandCategory: "System",
  cooldowns: 3
};

module.exports.run = async function ({ api, event }) {
  // Progress bar frames
  const progress = [
    "█░░░░░░░░░ 10%",
    "██░░░░░░░░ 20%",
    "███░░░░░░░ 30%",
    "████░░░░░░ 40%",
    "█████░░░░░ 50%",
    "██████░░░░ 60%",
    "███████░░░ 70%",
    "████████░░ 80%",
    "█████████░ 90%",
    "██████████ 100% ✨"
  ];

  let loadingMsg;

  try {
    // Send initial loading
    loadingMsg = await api.sendMessage(`⏳ Loading owner info...\n${progress[0]}`, event.threadID, event.messageID);

    // Animate progress bar
    for (let i = 1; i < progress.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      api.editMessage(`⏳ Loading owner info...\n${progress[i]}`, loadingMsg.messageID);
    }

    // Uptime calculate
    const time = process.uptime();
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    const currentTime = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【HH:mm:ss】");

    const message = `𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢𝗥𝗠𝗔𝗧𝗜𝗢𝗡
━━━━━━━━━━━━━━━━━━━━━━━
▶ 𝗡𝗮𝗺𝗲: 𝗞𝗮𝗸𝗮𝘀𝗵𝗶 𝗛𝗮𝘁𝗮𝗸𝗲
▶ 𝗣𝗼𝘀𝗶𝘁𝗶𝗼𝗻: 𝗢𝘄𝗻𝗲𝗿
▶ 𝗟𝗼𝗰𝗮𝗶𝗼𝗻: 𝗝𝗮𝘀𝗵𝗼𝗿𝗲
▶ 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: https://m.me/61587127028066
▶ 𝗜𝗻𝘀𝘁𝗮𝗴𝗿𝗮𝗺: @dukkho____bilash
▶ 𝗪𝗵𝗮𝘁𝘀𝗮𝗽𝗽: 014**-******
▶ 𝗧𝗶𝗺𝗲: ${currentTime}
▶ 𝗨𝗽𝘁𝗶𝗺𝗲: ${hours}h ${minutes}m ${seconds}s
━━━━━━━━━━━━━━━━━━━━━━━
`;

    // Stable direct GIF (online indicator animated, working in bots)
    const gifUrl = "https://i.imgur.com/3o7btI.gif"; // Classic green online GIF (tested working)
    // Alternative if above fail: "https://i.imgur.com/OKSaz.gif" (another online wave)

    // Download as buffer (safer for Mirai/FCA)
    const response = await axios.get(gifUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    // Unsend loader
    api.unsendMessage(loadingMsg.messageID);

    // Send final with attachment
    const sentMsg = await api.sendMessage({
      body: message,
      attachment: buffer // direct buffer instead of stream (more reliable in some hosts)
    }, event.threadID);

    // Auto unsend after 10 seconds
    setTimeout(() => {
      api.unsendMessage(sentMsg.messageID);
    }, 10000);

  } catch (err) {
    console.error("Info command error:", err.message || err);
    if (loadingMsg) api.unsendMessage(loadingMsg.messageID);
    api.sendMessage("❌ GIF লোড বা attachment পাঠাতে সমস্যা হয়েছে। দয়া করে পরে আবার চেষ্টা করুন!", event.threadID, event.messageID);
  }
};
