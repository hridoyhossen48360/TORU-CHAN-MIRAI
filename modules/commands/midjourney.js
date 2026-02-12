const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const FormData = require("form-data");

const BASE_URL = "https://midjanuarybyxnil.onrender.com";

module.exports = {
  config: {
    name: "mj",
    version: "3.1",
    credits: "Hridoy x Fixed by Grok",
    hasPermssion: 0,
    countDown: 10,          // barano karon server slow
    commandCategory: "AI",
    usages: ".mj <prompt>   or   .mj <prompt> --ar 16:9",
    cooldown: 15,
    dependencies: {
      "axios": "^1.7.2",
      "fs-extra": "^11.2.0",
      "form-data": "^4.0.0"
    }
  },

  run: async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    let prompt = args.join(" ").trim();

    if (!prompt) {
      return api.sendMessage(
        "❌ Prompt dite bhule gecho!\nExample:\n.mj cyberpunk samurai neon lights\n.mj beautiful landscape --ar 16:9",
        threadID,
        messageID
      );
    }

    // Optional simple arg parsing (ar / aspect ratio)
    let width = 1024;
    let height = 1024;
    const arMatch = prompt.match(/--ar\s+([\d:]+)/i);
    if (arMatch) {
      const ratio = arMatch[1];
      prompt = prompt.replace(arMatch[0], "").trim();
      const [w, h] = ratio.split(":").map(Number);
      if (w && h) {
        width = Math.round(1024 * (w / h));
        height = 1024;
        if (width > 1536 || height > 1536) { // cap for free server
          width = 1024;
          height = 1024;
        }
      }
    }

    const loadingMsg = await api.sendMessage("🎨 MidJanuary generating... (20-120 sec lagte pare)", threadID);

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);
    const imgPath = path.join(cacheDir, `\( {Date.now()}_ \){threadID}.png`);

    try {
      // ------------------ Try 1: multipart/form-data (browser-like) ------------------
      let response;
      try {
        const form = new FormData();
        form.append("prompt", prompt);
        // Optional: add more if site supports
        // form.append("width", width);
        // form.append("height", height);

        response = await axios.post(BASE_URL, form, {
          headers: {
            ...form.getHeaders(),
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          },
          responseType: "arraybuffer",
          timeout: 180000 // 3 minutes
        });
      } catch (multipartErr) {
        console.log("[Multipart failed]", multipartErr.message);
      }

      // ------------------ Try 2: JSON POST to /generate (common fallback) ------------------
      if (!response || !response.data || response.data.byteLength < 1000) {
        console.log("Trying JSON /generate...");
        response = await axios.post(`${BASE_URL}/generate`, {
          prompt: prompt,
          width: width,
          height: height,
          steps: 30,
          guidance_scale: 7.5
        }, {
          headers: { "Content-Type": "application/json" },
          responseType: "arraybuffer",
          timeout: 180000
        });
      }

      if (!response.data || response.data.byteLength < 5000) {
        throw new Error("Empty or invalid image response");
      }

      await fs.writeFile(imgPath, response.data);

      await api.unsendMessage(loadingMsg.messageID);

      await api.sendMessage({
        body: `✨ Generated Successfully!\n\nPrompt: \( {prompt} \){arMatch ? `\nAspect Ratio: ${arMatch[1]}` : ""}\n\nPowered by MidJanuary`,
        attachment: fs.createReadStream(imgPath)
      }, threadID);

    } catch (err) {
      console.error("MJ ERROR:", err.message, err?.response?.status);
      let errMsg = "❌ Generation failed.\nPossible reasons:\n• Server cold start (wait & retry)\n• Wrong endpoint (try inspect site)\n• Invalid prompt\n• Rate limit";
      if (err.code === "ECONNABORTED") errMsg += "\n• Timeout – server too slow";
      await api.unsendMessage(loadingMsg.messageID);
      api.sendMessage(errMsg, threadID);
    } finally {
      if (await fs.pathExists(imgPath)) {
        await fs.remove(imgPath);
      }
    }
  }
};
