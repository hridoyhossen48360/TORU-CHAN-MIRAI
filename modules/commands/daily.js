module.exports.config = {
    name: "daily",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Hridoy × Mirai",
    description: "Claim daily random coins",
    commandCategory: "Game",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, Currencies }) {
    const { threadID, messageID, senderID } = event;

    const cooldownTime = 24 * 60 * 60 * 1000; // 24 hours
    const minCoin = 1000;
    const maxCoin = 10000;

    const data = await Currencies.getData(senderID);
    const lastClaim = data.data?.dailyTime || 0;

    const now = Date.now();
    if (now - lastClaim < cooldownTime) {
        const timeLeft = cooldownTime - (now - lastClaim);
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);

        return api.sendMessage(
            `⏳ 𝗗𝗔𝗜𝗟𝗬 𝗔𝗟𝗥𝗘𝗔𝗗𝗬 𝗖𝗟𝗔𝗜𝗠𝗘𝗗!\n━━━━━━━━━━━━━━━\n🕒 Try again in ${hours}h ${minutes}m`,
            threadID,
            messageID
        );
    }

    const reward = Math.floor(Math.random() * (maxCoin - minCoin + 1)) + minCoin;

    await Currencies.increaseMoney(senderID, reward);
    await Currencies.setData(senderID, {
        data: {
            ...(data.data || {}),
            dailyTime: now
        }
    });

    return api.sendMessage(
        `🎁 𝗗𝗔𝗜𝗟𝗬 𝗥𝗘𝗪𝗔𝗥𝗗\n━━━━━━━━━━━━━━━\n💰 You received: ${reward}$\n🔥 Come back tomorrow!`,
        threadID,
        messageID
    );
};
