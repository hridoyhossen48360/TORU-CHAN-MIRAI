const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const FormData = require("form-data");

const BASE_URL = "https://midjanuarybyxnil.onrender.com";

module.exports = {
  config: {
    name: "mj",
    version: "3.0",
    credits: "Hridoy x Fixed",
    hasPermssion: 0,
    countDown: 5,
    commandCategory: "AI",
    usages: ".mj <prompt>"
  },

  run: async function ({ api, event, args }) {
    const { threadID } = event;
    const prompt = args.join(" ").trim();

    if (!prompt) {
      return api.sendMessage("❌ Provide a prompt!\nExample: .mj anime warrior", threadID);
    }

    const loading = await api.sendMessage("🎨 Generating via MidJanuary...", threadID);
    const imgPath = path.join(__dirname, "cache", `${Date.now()}.png`);

    try {

      // Form submission like browser
      const form = new FormData();
      form.append("prompt", prompt);

      const response = await axios.post(BASE_URL, form, {
        headers: form.getHeaders(),
        responseType: "arraybuffer",
        timeout: 180000
      });

      if (!response.data) throw new Error("No image returned");

      await fs.ensureDir(path.dirname(imgPath));
      await fs.writeFile(imgPath, response.data);

      await api.unsendMessage(loading.messageID);

      await api.sendMessage({
        body: `✨ MidJourney Generator ✨\n📝 Prompt: ${prompt}`,
        attachment: fs.createReadStream(imgPath)
      }, threadID);

    } catch (err) {
      console.log("MJ ERROR:", err.message);
      await api.unsendMessage(loading.messageID);
      api.sendMessage("❌ Failed. The server may use different POST route like /generate.", threadID);
    } finally {
      if (fs.existsSync(imgPath)) await fs.remove(imgPath);
    }
  }
};
