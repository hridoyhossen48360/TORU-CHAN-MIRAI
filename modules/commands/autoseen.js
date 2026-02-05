let autoSeen = true;

module.exports.config = {
  name: "autoseen",
  version: "1.0.1",
  hasPermssion: 2,
  credits: "rX + Simple Fix by Sabah",
  description: "Auto seen on/off",
  commandCategory: "Utility",
  usages: "on/off",
  cooldowns: 5
};

module.exports.handleEvent = async ({ api }) => {
  if (!autoSeen) return;
  api.markAsReadAll();
};

module.exports.run = async ({ api, args, event }) => {
  if (!args[0]) {
    return api.sendMessage(
      "❌ ব্যবহার: .autoseen on / off",
      event.threadID
    );
  }

  const input = args[0].toLowerCase();

  if (input === "on") {
    autoSeen = true;
    return api.sendMessage("✅ Auto Seen ON করা হয়েছে", event.threadID);
  }

  if (input === "off") {
    autoSeen = false;
    return api.sendMessage("🚫 Auto Seen OFF করা হয়েছে", event.threadID);
  }

  api.sendMessage("⚠️ শুধু on অথবা off ব্যবহার কর", event.threadID);
};
