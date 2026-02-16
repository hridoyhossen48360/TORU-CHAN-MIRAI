const fs = require("fs-extra");
const axios = require("axios");

module.exports.config = {
  name: "banbaucua",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "D-Jukie (Fixed)",
  description: "Multiplayer Bau Cua Game",
  commandCategory: "Game",
  usages: "[create/join/leave/start/end]",
  cooldowns: 0
};

/* ================= HANDLE EVENT ================= */

module.exports.handleEvent = async function ({ api, event, Currencies }) {

  const { threadID, messageID, body, senderID } = event;
  if (!body) return;
  if (!global.baucua) return;

  const gameThread = global.baucua.get(threadID);
  if (!gameThread || gameThread.start !== true) return;

  const typ = ['bầu', 'cua', 'tôm', 'cá', 'nai', 'gà'];
  const choosee = body.split(" ");
  if (!typ.includes(choosee[0]?.toLowerCase())) return;

  async function checkMoney(uid, amount) {
    const data = (await Currencies.getData(uid)) || {};
    return (data.money || 0) >= parseInt(amount);
  }

  if (!choosee[1])
    return api.sendMessage("Please enter your bet amount!", threadID, messageID);

  if (!(await checkMoney(senderID, choosee[1])))
    return api.sendMessage("You do not have enough money!", threadID, messageID);

  const index = gameThread.player.findIndex(i => i.userID == senderID);
  if (index === -1) return;

  if (gameThread.player[index].choose.status)
    return api.sendMessage("⚠ You already chose!", threadID, messageID);

  gameThread.player[index].choose = {
    status: true,
    msg: choosee[0].toLowerCase(),
    money: parseInt(choosee[1])
  };

  api.sendMessage(
    `👤 ${gameThread.player[index].name} chose '${choosee[0]}' with ${choosee[1]}$`,
    threadID
  );

  const allChosen = gameThread.player.every(p => p.choose.status === true);
  if (!allChosen) return;

  const itemOne = typ[Math.floor(Math.random() * typ.length)];
  const itemTwo = typ[Math.floor(Math.random() * typ.length)];
  const itemThree = typ[Math.floor(Math.random() * typ.length)];
  const result = [itemOne, itemTwo, itemThree];

  /* Rolling GIF */
  const gifData = (await axios.get(
    "https://i.imgur.com/TdFtFCC.gif",
    { responseType: "arraybuffer" }
  )).data;

  fs.writeFileSync(__dirname + "/cache/roll.gif", Buffer.from(gifData));

  api.sendMessage({
    body: "» Rolling...",
    attachment: fs.createReadStream(__dirname + "/cache/roll.gif")
  }, threadID);

  await new Promise(r => setTimeout(r, 5000));

  /* Show Result */
  const map = {
    "bầu": { icon: "🍐", url: "https://i.imgur.com/1MZ2RUz.jpg", name: "bau" },
    "cua": { icon: "🦀", url: "https://i.imgur.com/OrzfTwg.jpg", name: "cua" },
    "tôm": { icon: "🦞", url: "https://i.imgur.com/8nTJyNK.jpg", name: "tom" },
    "cá": { icon: "🐟", url: "https://i.imgur.com/EOH26Am.jpg", name: "ca" },
    "nai": { icon: "🦌", url: "https://i.imgur.com/sPP6Glh.jpg", name: "nai" },
    "gà": { icon: "🐓", url: "https://i.imgur.com/uV4eyKs.jpg", name: "ga" }
  };

  let icons = [];
  let attachments = [];

  for (let item of result) {
    const data = map[item];
    icons.push(data.icon);
    const img = (await axios.get(data.url, { responseType: "arraybuffer" })).data;
    fs.writeFileSync(__dirname + `/cache/${data.name}.png`, Buffer.from(img));
    attachments.push(fs.createReadStream(__dirname + `/cache/${data.name}.png`));
  }

  api.sendMessage({
    body: `» Result: ${icons[0]} | ${icons[1]} | ${icons[2]}`,
    attachment: attachments
  }, threadID);

  /* Check Win */
  let msg = "";

  const winners = gameThread.player.filter(p => result.includes(p.choose.msg));
  const losers = gameThread.player.filter(p => !result.includes(p.choose.msg));

  if (winners.length) {
    msg += "[==== WINNERS ====]\n";
    for (let p of winners) {
      const count = result.filter(r => r == p.choose.msg).length;
      await Currencies.increaseMoney(p.userID, p.choose.money * count);
      msg += `${p.name} + ${p.choose.money * count}$\n`;
    }
  }

  if (losers.length) {
    msg += "\n[==== LOSERS ====]\n";
    for (let p of losers) {
      await Currencies.decreaseMoney(p.userID, p.choose.money);
      msg += `${p.name} - ${p.choose.money}$\n`;
    }
  }

  global.baucua.delete(threadID);
  api.sendMessage(msg, threadID);
};

/* ================= RUN COMMAND ================= */

module.exports.run = async function ({
  api,
  event,
  args,
  Users,
  Currencies
}) {

  if (!global.baucua) global.baucua = new Map();

  const { threadID, messageID, senderID } = event;
  const gameThread = global.baucua.get(threadID);

  async function checkMoney(uid, amount) {
    const data = (await Currencies.getData(uid)) || {};
    return (data.money || 0) >= parseInt(amount);
  }

  switch (args[0]) {

    case "create":
    case "new":
    case "-c":

      if (!(await checkMoney(senderID, 50)))
        return api.sendMessage("You need at least 50$ to create!", threadID, messageID);

      if (global.baucua.has(threadID))
        return api.sendMessage("A game is already active!", threadID, messageID);

      const name = await Users.getNameUser(senderID);

      global.baucua.set(threadID, {
        box: threadID,
        start: false,
        author: senderID,
        player: [{
          name,
          userID: senderID,
          choose: { status: false, msg: null, money: null }
        }]
      });

      return api.sendMessage(
        "Game created!\nUse:\njoin\nstart\nleave\nend",
        threadID,
        messageID
      );

    case "join":
    case "-j":

      if (!(await checkMoney(senderID, 50)))
        return api.sendMessage("You need at least 50$ to join!", threadID, messageID);

      if (!gameThread)
        return api.sendMessage("No active game found!", threadID, messageID);

      if (gameThread.start)
        return api.sendMessage("Game already started!", threadID, messageID);

      if (gameThread.player.find(p => p.userID == senderID))
        return api.sendMessage("You already joined!", threadID, messageID);

      const name2 = await Users.getNameUser(senderID);

      gameThread.player.push({
        name: name2,
        userID: senderID,
        choose: { status: false, msg: null, money: null }
      });

      global.baucua.set(threadID, gameThread);

      return api.sendMessage("Joined successfully!", threadID, messageID);

    case "leave":
    case "-l":

      if (!gameThread)
        return api.sendMessage("No active game!", threadID, messageID);

      if (gameThread.start)
        return api.sendMessage("Game already started!", threadID, messageID);

      gameThread.player.splice(gameThread.player.findIndex(p => p.userID == senderID), 1);
      global.baucua.set(threadID, gameThread);

      return api.sendMessage("Left successfully!", threadID, messageID);

    case "start":
    case "-s":

      if (!gameThread)
        return api.sendMessage("No active game!", threadID, messageID);

      if (gameThread.author != senderID)
        return api.sendMessage("Only creator can start!", threadID, messageID);

      if (gameThread.player.length <= 1)
        return api.sendMessage("Need at least 2 players!", threadID, messageID);

      gameThread.start = true;
      global.baucua.set(threadID, gameThread);

      return api.sendMessage(
        `Game started!\nPlayers: ${gameThread.player.length}\nEnter [bầu/cua/tôm/cá/nai/gà] [bet amount]`,
        threadID,
        messageID
      );

    case "end":
    case "-e":

      if (!gameThread)
        return api.sendMessage("No active game!", threadID, messageID);

      if (gameThread.author != senderID)
        return api.sendMessage("Only creator can end!", threadID, messageID);

      global.baucua.delete(threadID);
      return api.sendMessage("Game ended!", threadID, messageID);

    default:
      return api.sendMessage(
        "Commands:\ncreate\njoin\nleave\nstart\nend",
        threadID,
        messageID
      );
  }
};