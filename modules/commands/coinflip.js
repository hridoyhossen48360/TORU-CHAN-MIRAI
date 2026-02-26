const fs = require("fs"),
      request = require("request"),
      pathFile = __dirname + "/cache/";

module.exports.config = {
    name: "coinflip",
    version: "1.0.3",
    hasPermssion: 0,
    credits: "Kakashi",
    description: "Coin gambling game",
    commandCategory: "Game",
    usages: "[head|tail] [bet amount]",
    cooldowns: 5
};

module.exports.onLoad = function () {
    if (!fs.existsSync(pathFile))
        fs.mkdirSync(pathFile, { recursive: true });

    if (!fs.existsSync(pathFile + "coinflip.gif"))
        request("https://i.imgur.com/sBUJ1gN.gif")
            .pipe(fs.createWriteStream(pathFile + "coinflip.gif"));
};

module.exports.run = async ({ api, event, args, Currencies }) => {
    const { getData, increaseMoney, decreaseMoney } = Currencies;
    const { threadID, messageID, senderID } = event;

    if (!args[0])
        return api.sendMessage(
            "Use format:\ncoinflip head 100\ncoinflip tail 100",
            threadID,
            messageID
        );

    const choice = args[0].toLowerCase();

    if (choice !== "head" && choice !== "tail")
        return api.sendMessage(
            "Please choose head or tail.",
            threadID,
            messageID
        );

    const userData = await getData(senderID);
    const money = userData.money;

    let moneyBet = parseInt(args[1]);
    if (isNaN(moneyBet)) moneyBet = money;

    if (moneyBet < 50)
        return api.sendMessage(
            "Minimum bet amount is $50.",
            threadID,
            messageID
        );

    if (moneyBet > money)
        return api.sendMessage(
            "Your balance is not enough.",
            threadID,
            messageID
        );

    // 🔥 TRUE 50/50 RANDOM
    const randomSide = Math.random() < 0.5 ? "head" : "tail";

    const winMoney = moneyBet * 2;
    const tax = winMoney * 5 / 100;
    const finalMoney = winMoney - tax;

    api.sendMessage(
        {
            body: "🪙 Flipping the coin...",
            attachment: fs.createReadStream(pathFile + "coinflip.gif")
        },
        threadID,
        (err, info) => {

            setTimeout(async () => {

                api.unsendMessage(info.messageID);

                if (choice === randomSide) {

                    await increaseMoney(senderID, finalMoney);

                    return api.sendMessage(
                        `🪙 Result: ${randomSide}\n` +
                        `You chose: ${choice}\n\n` +
                        `🎉 You WIN!\n` +
                        `Bet: ${moneyBet}$\n` +
                        `Win Amount: ${winMoney}$\n` +
                        `Tax (5%): ${tax}$\n` +
                        `Received: ${finalMoney}$\n` +
                        `💰 New Balance: ${money + finalMoney}$`,
                        threadID,
                        messageID
                    );

                } else {

                    await decreaseMoney(senderID, moneyBet);

                    return api.sendMessage(
                        `🪙 Result: ${randomSide}\n` +
                        `You chose: ${choice}\n\n` +
                        `❌ You LOSE!\n` +
                        `Lost: ${moneyBet}$\n` +
                        `💰 Remaining Balance: ${money - moneyBet}$`,
                        threadID,
                        messageID
                    );
                }

            }, 3000);

        },
        messageID
    );
};
