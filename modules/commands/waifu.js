const axios = require("axios");

module.exports.config = {
    name: "waifu",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "waifu.im × Mirai Fix by Hridoy",
    description: "Random waifu image দেয়",
    commandCategory: "anime",
    usages: "waifu",
    cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
        const res = await axios.get("https://api.waifu.im/search");

        // 🔑 MAIN FIX: image url extract
        const imageData = res.data.images?.[0];
        if (!imageData || !imageData.url) {
            throw new Error("Image URL not found");
        }

        const imageStream = await global.utils.getStreamFromURL(imageData.url);

        api.sendMessage(
            {
                body: `💖 Waifu Found!\n🎨 Artist: ${imageData.artist?.name || "Unknown"}\n🔗 Source: ${imageData.source || "N/A"}`,
                attachment: imageStream
            },
            threadID,
            () => api.setMessageReaction("✅", messageID, () => {}, true)
        );

    } catch (err) {
        console.error(err);
        api.setMessageReaction("❌", messageID, () => {}, true);
        api.sendMessage(
            "⚠️ Waifu image আনতে সমস্যা হয়েছে। পরে আবার চেষ্টা করো।",
            threadID,
            messageID
        );
    }
};
