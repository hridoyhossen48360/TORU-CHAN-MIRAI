module.exports.config = {
    name: "xl",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Team Calyx × Mirai Upgrade by Hridoy",
    description: "Text দিয়ে SDXL image generate করে",
    commandCategory: "image",
    usages: "xl <prompt> [--ar 1:1 | --ar=2:3]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;

    if (!args.length) {
        return api.sendMessage(
            `✨ দয়া করে একটি prompt দিন\n\n📌 উদাহরণ:\n• xl a cute cat\n• xl anime girl --ar 2:3`,
            threadID,
            messageID
        );
    }

    let ratio = "1:1";

    // --ar=2:3 support
    const arEqual = args.findIndex(a => a.startsWith("--ar="));
    if (arEqual !== -1) {
        ratio = args[arEqual].split("=")[1];
        args.splice(arEqual, 1);
    }

    // --ar 2:3 support
    const arSpace = args.findIndex(a => a === "--ar");
    if (arSpace !== -1 && args[arSpace + 1]) {
        ratio = args[arSpace + 1];
        args.splice(arSpace, 2);
    }

    const prompt = args.join(" ");

    api.setMessageReaction("⏳", messageID, () => {}, true);

    const start = Date.now();

    try {
        const apiUrl = `https://smfahim.onrender.com/xl31?prompt=${encodeURIComponent(prompt)}&ratio=${ratio}`;
        const stream = await global.utils.getStreamFromURL(apiUrl);

        const time = ((Date.now() - start) / 1000).toFixed(2);

        api.sendMessage(
            {
                body: `🖼️ XL Image Generated Successfully!\n\n⏱️ Time Taken: ${time}s\n📐 Ratio: ${ratio}`,
                attachment: stream
            },
            threadID,
            () => {
                api.setMessageReaction("✅", messageID, () => {}, true);
            }
        );

    } catch (err) {
        console.error(err);
        api.setMessageReaction("❌", messageID, () => {}, true);
        api.sendMessage(
            "⚠️ দুঃখিত! Image generate করা যায়নি। পরে আবার চেষ্টা করুন।",
            threadID,
            messageID
        );
    }
};
