const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "leaderboard",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Kakashi",
    description: "Group message leaderboard",
    commandCategory: "Group",
    usages: "",
    cooldowns: 5
};

const dataPath = path.join(__dirname, "cache", "messageCount.json");

module.exports.onLoad = function () {
    const dir = path.join(__dirname, "cache");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify({}));
};

// 🔥 AUTO COUNT EVERY MESSAGE
module.exports.handleEvent = async function ({ event }) {
    if (!event.threadID || !event.senderID) return;
    if (event.isGroup == false) return;

    let data = JSON.parse(fs.readFileSync(dataPath));

    if (!data[event.threadID]) data[event.threadID] = {};
    if (!data[event.threadID][event.senderID])
        data[event.threadID][event.senderID] = 0;

    data[event.threadID][event.senderID] += 1;

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// 📊 SHOW LEADERBOARD
module.exports.run = async function ({ api, event, Users }) {
    const { threadID, messageID } = event;

    let data = JSON.parse(fs.readFileSync(dataPath));

    if (!data[threadID])
        return api.sendMessage("No message data found in this group.", threadID, messageID);

    let sorted = Object.entries(data[threadID])
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    let msg = "🏆 GROUP MESSAGE LEADERBOARD 🏆\n\n";

    for (let i = 0; i < sorted.length; i++) {
        const userName = await Users.getNameUser(sorted[i][0]);
        msg += `${i + 1}. ${userName}\n   💬 Messages: ${sorted[i][1]}\n\n`;
    }

    return api.sendMessage(msg, threadID, messageID);
};
