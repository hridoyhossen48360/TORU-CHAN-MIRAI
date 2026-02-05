const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { alldown } = require("rx-dawonload");

module.exports.config = {
    name: "autolink",
    version: "2.4.0",
    credits: "MOHAMMAD AKASH",
    hasPermission: 0,
    description: "Auto download video with text + reaction",
    usePrefix: false,
    commandCategory: "Utility",
    cooldowns: 2
};

module.exports.run = async function () {};

module.exports.handleEvent = async function ({ api, event }) {
    try {
        const url = event.body?.trim();
        if (!url || !url.startsWith("http")) return;

        // ⏳ downloading reaction
        api.setMessageReaction("⏳", event.messageID, () => {}, true);

        // Detect Platform
        let site = "Unknown";
        if (url.includes("youtube.com") || url.includes("youtu.be")) site = "YouTube";
        else if (url.includes("tiktok.com")) site = "TikTok";
        else if (url.includes("instagram.com")) site = "Instagram";
        else if (url.includes("facebook.com")) site = "Facebook";

        // Fetch download info
        const data = await alldown(url);
        if (!data?.url) {
            api.setMessageReaction("❌", event.messageID, () => {}, true);
            return;
        }

        const title = data.title || "video";
        const dlUrl = data.url;

        const buffer = (
            await axios.get(dlUrl, { responseType: "arraybuffer" })
        ).data;

        const safeTitle = title.replace(/[^\w\s]/gi, "_");
        const filePath = path.join(__dirname, "cache", `${safeTitle}.mp4`);

        fs.writeFileSync(filePath, buffer);

        // ✅ done reaction
        api.setMessageReaction("✅", event.messageID, () => {}, true);

        // Send video + text
        const messageBody = `🎀 𝗗ᴏᴡɴʟᴏᴀᴅ 𝗖ᴏᴍᴘʟᴇᴛᴇ!\n📍 𝗣ʟᴀᴛғᴏʀᴍ: ${site}\n🎬 𝗧ɪᴛʟᴇ: ${title}`;
        api.sendMessage(
            { body: messageBody, attachment: fs.createReadStream(filePath) },
            event.threadID,
            () => fs.unlinkSync(filePath)
        );

    } catch (e) {
        console.log("autodl error:", e);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
    }
};
