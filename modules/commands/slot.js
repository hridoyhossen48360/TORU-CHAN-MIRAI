module.exports.config = {
    name: "slot",
    version: "1.1.0",
    hasPermssion: 0,
    credits: "Mirai Team × Hridoy Fix",
    description: "Slot machine gambling game",
    commandCategory: "Game",
    usages: "[amount]",
    cooldowns: 5,
};

module.exports.languages = {
    "en": {
        "missingInput": "⚠️ 𝗜𝗻𝘃𝗮𝗹𝗶𝗱 𝗕𝗲𝘁!\n━━━━━━━━━━━━━━━\n💡 Enter a valid amount.",
        "moneyBetNotEnough": "❌ 𝗜𝗻𝘀𝘂𝗳𝗳𝗶𝗰𝗶𝗲𝗻𝘁 𝗕𝗮𝗹𝗮𝗻𝗰𝗲!",
        "limitBet": "⚠️ 𝗠𝗶𝗻𝗶𝗺𝘂𝗺 𝗕𝗲𝘁: 50$",
        "returnWin":
            "🎉 𝗦𝗟𝗢𝗧 𝗠𝗔𝗖𝗛𝗜𝗡𝗘\n━━━━━━━━━━━━━━━\n🎰 %1 | %2 | %3\n💎 YOU WON!\n💰 Prize: +%4$",
        "returnLose":
            "💔 𝗦𝗟𝗢𝗧 𝗠𝗔𝗖𝗛𝗜𝗡𝗘\n━━━━━━━━━━━━━━━\n🎰 %1 | %2 | %3\n📉 YOU LOST\n💸 Lost: -%4$"
    }
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
    const { threadID, messageID, senderID } = event;
    const { getData, increaseMoney, decreaseMoney } = Currencies;

    const slotItems = ["🍒", "🍋", "🍉", "🍇", "7️⃣"];
    const userData = await getData(senderID);
    const moneyUser = userData.money || 0;

    const bet = parseInt(args[0]);
    if (isNaN(bet) || bet <= 0)
        return api.sendMessage(getText("missingInput"), threadID, messageID);

    if (bet < 50)
        return api.sendMessage(getText("limitBet"), threadID, messageID);

    if (bet > moneyUser)
        return api.sendMessage(getText("moneyBetNotEnough"), threadID, messageID);

    // 🎰 Random slots
    let a = Math.floor(Math.random() * slotItems.length);
    let b = Math.floor(Math.random() * slotItems.length);
    let c = Math.floor(Math.random() * slotItems.length);

    let win = false;
    let reward = bet;

    // ✅ WIN LOGIC (balanced)
    if (a === b && b === c) {
        reward = bet * 5; // jackpot
        win = true;
    } else if (a === b || a === c || b === c) {
        reward = bet * 2; // small win
        win = true;
    }

    if (win) {
        await increaseMoney(senderID, reward);
        return api.sendMessage(
            getText("returnWin", slotItems[a], slotItems[b], slotItems[c], reward),
            threadID,
            messageID
        );
    } else {
        await decreaseMoney(senderID, bet);
        return api.sendMessage(
            getText("returnLose", slotItems[a], slotItems[b], slotItems[c], bet),
            threadID,
            messageID
        );
    }
};
