/**
 * @author datoccho
 * @You may edit the credits freely — it’s your right.
 * As long as you are not human.
 * If you are human, do not change the credits.
 */

const fs = require("fs"),
      request = require("request"),
      pathFile = __dirname + "/cache/";

module.exports.config = {
    name: "dice",
    version: "1.0.2",
    hasPermssion: 0,
    creditss: "ken", // language changed to English
    description: "Dice gambling game",
    commandCategory: "Game",
    usages: "[small | big] [bet amount]",
    cooldowns: 5
};

module.exports.onLoad = () => {
    if (!fs.existsSync(pathFile + "cache"))
        fs.mkdirSync(pathFile, { recursive: true });

    if (!fs.existsSync(pathFile + this.config.name + ".gif"))
        request("https://i.imgur.com/cnoG4td.gif")
            .pipe(fs.createWriteStream(pathFile + this.config.name + ".gif"));
};

module.exports.run = async ({ api, event, args, Currencies }) => {
    const { getData, increaseMoney, decreaseMoney } = Currencies;
    const { createReadStream } = require("fs-extra");
    const { threadID, messageID, senderID } = event;

    const data = (await Currencies.getData(senderID)).data || {};

    const getRandomIntInclusive = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Dice result
    var diceResult = [
        `big ${getRandomIntInclusive(11, 17)}`,
        `small ${getRandomIntInclusive(4, 10)}`
    ];

    const result = diceResult[Math.floor(Math.random() * diceResult.length)];
    const money = (await getData(senderID)).money;

    // Bet amount (default = all money)
    var moneyBet = parseInt(args[1]) ? parseInt(args[1]) : money;
    var winMoney = moneyBet * 2;
    const tax = winMoney * 5 / 100;
    const finalMoney = winMoney - tax;

    if (args[0] !== "big" && args[0] !== "small")
        return api.sendMessage(
            "Wrong format.\nUse: big or small.",
            threadID,
            messageID
        );

    if (isNaN(moneyBet) || moneyBet < 50)
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

    api.sendMessage(
        {
            body: "🎲 Rolling the dice...",
            attachment: fs.createReadStream(
                __dirname + `/cache/${this.config.name}.gif`
            )
        },
        threadID,
        (err, info) => {
            if (err) console.log(err);

            setTimeout(() => {
                api.unsendMessage(info.messageID);

                if (args[0].toLowerCase() === result.slice(0, 3)) {
                    return api.sendMessage(
                        {
                            body:
                                `Dice result: ${result}\n` +
                                `You chose: ${args[0].toLowerCase()}\n` +
                                `You WIN and get ${winMoney}$\n` +
                                `5% tax deducted: ${tax}$\n` +
                                `Final amount received: ${finalMoney}$\n` +
                                `Your new balance: ${money + finalMoney}$`
                        },
                        threadID,
                        () => increaseMoney(senderID, finalMoney),
                        messageID
                    );
                } else {
                    return api.sendMessage(
                        {
                            body:
                                `Dice result: ${result}\n` +
                                `You chose: ${args[0].toLowerCase()}\n` +
                                `You LOSE and lost ${moneyBet}$\n` +
                                `Remaining balance: ${money - moneyBet}$`
                        },
                        threadID,
                        () => decreaseMoney(senderID, moneyBet),
                        messageID
                    );
                }
            }, 3000);
        },
        messageID
    );
};
