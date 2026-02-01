module.exports.config = {
    name: "addmoney",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Hridoy × Mirai Stable",
    description: "Give money to another user",
    commandCategory: "Economy",
    usages: "@tag <amount>",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Currencies }) {
    const { threadID, messageID, senderID, mentions } = event;

    /* ====== CHECK MENTION ====== */
    if (!Object.keys(mentions).length)
        return api.sendMessage("❌ কাউকে mention করো যাকে টাকা দিতে চাও", threadID, messageID);

    const receiverID = Object.keys(mentions)[0];

    /* ====== PREVENT SELF GIVE ====== */
    if (receiverID === senderID)
        return api.sendMessage("❌ নিজেকে নিজে টাকা দেওয়া যাবে না", threadID, messageID);

    /* ====== GET AMOUNT (Mirai Safe) ====== */
    const amount = args.find(a => !isNaN(a));

    if (!amount || parseInt(amount) <= 0)
        return api.sendMessage("❌ সঠিক amount দাও", threadID, messageID);

    const giveAmount = parseInt(amount);

    /* ====== CHECK SENDER BALANCE ====== */
    const senderData = await Currencies.getData(senderID);
    const senderMoney = senderData.money || 0;

    if (senderMoney < giveAmount)
        return api.sendMessage("❌ তোমার কাছে পর্যাপ্ত টাকা নেই", threadID, messageID);

    /* ====== TRANSFER ====== */
    await Currencies.decreaseMoney(senderID, giveAmount);
    await Currencies.increaseMoney(receiverID, giveAmount);

    const receiverName = mentions[receiverID].replace("@", "");

    return api.sendMessage(
`💸 𝗧𝗥𝗔𝗡𝗦𝗙𝗘𝗥 𝗦𝗨𝗖𝗖𝗘𝗦𝗦
━━━━━━━━━━━━━━━
👤 From: You
👥 To: ${receiverName}
💰 Amount: ${giveAmount}$
━━━━━━━━━━━━━━━`,
        threadID,
        messageID
    );
};
