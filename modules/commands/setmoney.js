module.exports.config = {
    name: "setmoney",
    version: "1.4.0",
    hasPermssion: 2,
    credits: "Hridoy × Mirai Ultra Fix",
    description: "Admin money control (FULL Mirai compatible)",
    commandCategory: "Game",
    usages: "@tag <amount> | me <amount> | uid <id> <amount> | del @tag",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Currencies, Users }) {
    const { threadID, messageID, senderID, mentions } = event;

    if (!args.length && Object.keys(mentions).length === 0)
        return api.sendMessage(
            "⚠️ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗨𝘀𝗮𝗴𝗲!\n━━━━━━━━━━━━━━━\n👉 Example: `.setmoney @user 5000`",
            threadID,
            messageID
        );

    /* ========= DELETE ========= */
    if (args[0] === "del") {
        if (!Object.keys(mentions).length)
            return api.sendMessage(
                "❌ 𝗧𝗮𝗿𝗴𝗲𝘁 𝗠𝗶𝘀𝘀𝗶𝗻𝗴!\n━━━━━━━━━━━━━━━\n🔖 Please tag a user to clear balance.",
                threadID,
                messageID
            );

        const uid = Object.keys(mentions)[0];
        const data = await Currencies.getData(uid);
        const money = data.money || 0;

        await Currencies.decreaseMoney(uid, money);
        return api.sendMessage(
            `🗑️ 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 𝗥𝗲𝘀𝗲𝘁 𝗦𝘂𝗰𝗰𝗲𝘀𝘀!\n━━━━━━━━━━━━━━━\n💰 Removed Amount: ${money}$`,
            threadID,
            messageID
        );
    }

    /* ========= UID ========= */
    if (args[0] === "uid") {
        const uid = args[1];
        const amount = args.find(a => !isNaN(a));

        if (!uid || !amount)
            return api.sendMessage(
                "⚠️ 𝗪𝗿𝗼𝗻𝗴 𝗙𝗼𝗿𝗺𝗮𝘁!\n━━━━━━━━━━━━━━━\n👉 Use: `.setmoney uid <id> <amount>`",
                threadID,
                messageID
            );

        await Currencies.increaseMoney(uid, parseInt(amount));

        let name = uid;
        try {
            const u = await Users.getData(uid);
            name = u.name || uid;
        } catch {}

        return api.sendMessage(
            `✅ 𝗠𝗼𝗻𝗲𝘆 𝗔𝗱𝗱𝗲𝗱!\n━━━━━━━━━━━━━━━\n👤 User: ${name}\n💸 Amount: ${amount}$`,
            threadID,
            messageID
        );
    }

    /* ========= MENTION ========= */
    if (Object.keys(mentions).length > 0) {
        const uid = Object.keys(mentions)[0];
        const amount = args.find(a => !isNaN(a));

        if (!amount)
            return api.sendMessage(
                "❌ 𝗔𝗺𝗼𝘂𝗻𝘁 𝗠𝗶𝘀𝘀𝗶𝗻𝗴!\n━━━━━━━━━━━━━━━\n💡 Please enter a valid amount.",
                threadID,
                messageID
            );

        await Currencies.increaseMoney(uid, parseInt(amount));
        const name = mentions[uid].replace("@", "");

        return api.sendMessage(
            `✨ 𝗦𝘂𝗰𝗰𝗲𝘀𝘀!\n━━━━━━━━━━━━━━━\n👤 ${name}\n💰 Received: ${amount}$`,
            threadID,
            messageID
        );
    }

    /* ========= ME ========= */
    if (args[0] === "me") {
        const amount = args.find(a => !isNaN(a));
        if (!amount)
            return api.sendMessage(
                "❌ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗔𝗺𝗼𝘂𝗻𝘁!\n━━━━━━━━━━━━━━━\n💡 Please enter numbers only.",
                threadID,
                messageID
            );

        await Currencies.increaseMoney(senderID, parseInt(amount));
        return api.sendMessage(
            `👑 𝗦𝗲𝗹𝗳 𝗕𝗮𝗹𝗮𝗻𝗰𝗲 𝗨𝗽𝗱𝗮𝘁𝗲𝗱!\n━━━━━━━━━━━━━━━\n💸 Added: ${amount}$`,
            threadID,
            messageID
        );
    }

    return api.sendMessage(
        "⚠️ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗖𝗼𝗺𝗺𝗮𝗻𝗱!\n━━━━━━━━━━━━━━━\n📖 Check usage and try again.",
        threadID,
        messageID
    );
};
