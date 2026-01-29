const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "daily",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Hridoy",
  description: "Claim your daily reward",
  commandCategory: "Game",
  usages: ".daily",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const uid = event.senderID;
  const cachePath = path.join(__dirname, "../../cache/currencies.json");

  if (!fs.existsSync(cachePath)) fs.writeJSONSync(cachePath, {});

  let data = fs.readJSONSync(cachePath);
  if (!data[uid]) data[uid] = { balance: 0, daily: 0 };

  const lastDaily = data[uid].daily;
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  if (now - lastDaily < oneDay) {
    const remain = oneDay - (now - lastDaily);
    const hours = Math.floor(remain / (1000 * 60 * 60));
    const minutes = Math.floor((remain % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remain % (1000 * 60)) / 1000);
    return api.sendMessage(`⏰ Daily already claimed!\nTry again in ${hours}h ${minutes}m ${seconds}s`, event.threadID);
  }

  const reward = Math.floor(Math.random() * 500) + 100; // 100$-600$
  data[uid].balance += reward;
  data[uid].daily = now;

  fs.writeJSONSync(cachePath, data, { spaces: 2 });

  return api.sendMessage(`🎁 𝐃𝐚𝐢𝐥𝐲 𝐑𝐞𝐰𝐚𝐫𝐝 🎁\n━━━━━━━━━━\n🪙 You received: ${reward}$\n💰 New Balance: ${data[uid].balance}$`, event.threadID);
};
