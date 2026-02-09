const axios = require("axios");

module.exports.config = {
  name: "bot",
  version: "3.0.0",
  hasPermssion: 0,
  credits: "rX Abdullah",
  description: "Maria custom frame only first time, then normal AI chat",
  commandCategory: "Utility",
  usages: "ai",
  cooldowns: 3
};

// Invisible marker
const marker = "\u700B";
function withMarker(text) {
  return text + marker;
}

// Sessions
const sessions = {};

// Maria API endpoint
const MARIA_API_URL = "https://raw.githubusercontent.com/rxabdullah0007/rX-apis/main/xApis/rXallApi.json";

// Custom first message replies
const customReplies =[
];

module.exports.handleEvent = async function({ api, event, Users }) {
  const { threadID, messageID, body, senderID, messageReply } = event;
  if (!body) return;

  const name = await Users.getNameUser(senderID);

  // ---------------------------------------------------------------------
  // STEP 1: User types "ai" → First stylish message only
  // ---------------------------------------------------------------------
  if (body.trim().toLowerCase() === "bot") {
    sessions[senderID] = { history: "", allowAI: true };

    const rand = customReplies[Math.floor(Math.random() * customReplies.length)];

    const firstMessage =
``;

    try {
      await api.sendTypingIndicatorV2(true, threadID);
      await new Promise(r => setTimeout(r, 2500));
      await api.sendTypingIndicatorV2(false, threadID);
    } catch {}

    return api.sendMessage(withMarker(firstMessage), threadID, messageID);
  }

  // ---------------------------------------------------------------------
  // STEP 2: User replies to Maria → Normal AI message
  // ---------------------------------------------------------------------
  if (
    messageReply &&
    messageReply.senderID === api.getCurrentUserID() &&
    messageReply.body?.includes(marker) &&
    sessions[senderID]
  ) {
    const userMsg = body.trim();
    if (!userMsg) return;

    // Add ⏳ loading react
    api.setMessageReaction("⏳", messageID, () => {}, true);

    // If user asks about creator
    const creatorKeywords = [
      "creator", "developer ke"
    ];

    if (creatorKeywords.some(k => userMsg.toLowerCase().includes(k))) {

      // SUCCESS ✔ react
      api.setMessageReaction("✅", messageID, () => {}, true);

      return api.sendMessage(
        withMarker("👑 My creator Kakashi unhone muje banaya hai"),
        threadID,
        messageID
      );
    }

    // Add to session memory
    sessions[senderID].history += `User: ${userMsg}\nToru: `;

    try {
      await api.sendTypingIndicatorV2(true, threadID);
      await new Promise(r => setTimeout(r, 2000));
      await api.sendTypingIndicatorV2(false, threadID);
    } catch {}

    try {
      // Send to Maria API
      const resp = await axios.post(MARIA_API_URL, {
        user_id: senderID,
        query: sessions[senderID].history,
        meta: { need_realtime: true }
      });

      let reply = resp.data?.answer?.text || "🙂 I didn't understand.";

      // Replace OpenAI → rX Abdullah
      reply = reply.replace(/openai/gi, "kakashi");

      sessions[senderID].history += reply + "\n";

      // SUCCESS ✔ react
      api.setMessageReaction("✅", messageID, () => {}, true);

      // NORMAL plain answer
      return api.sendMessage(withMarker(reply), threadID, messageID);

    } catch (err) {

      // ERROR ❌ react
      api.setMessageReaction("❌", messageID, () => {}, true);

      console.log(err);
      return api.sendMessage("❌ Toru API error.", threadID, messageID);
    }
  }
};

module.exports.run = () => {};
