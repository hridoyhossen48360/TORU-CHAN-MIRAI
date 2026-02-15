module.exports.config = {
  name: "lesbian",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "rX Abdullah",
  description: "Lesbian Wedding Pairing 💍",
  commandCategory: "Tag Fun",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "fs-extra": "",
    "jimp": ""
  }
};

module.exports.onLoad = async () => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;

  const dirMaterial = __dirname + `/cache/canvas/`;
  const path = resolve(__dirname, "cache/canvas", "Lesbian.png");

  if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });

  if (!existsSync(path)) {
    await downloadFile(
      "https://i.imgur.com/qEKylUC.jpeg",
      path
    );
  }
};

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const path = global.nodemodule["path"];
  const axios = global.nodemodule["axios"];
  const jimp = global.nodemodule["jimp"];

  const __root = path.resolve(__dirname, "cache", "canvas");

  let background = await jimp.read(__root + "/Lesbian.png");

  let avatarOnePath = __root + `/avt_${one}.png`;
  let avatarTwoPath = __root + `/avt_${two}.png`;
  let finalPath = __root + `/lesbian_${one}_${two}.png`;

  // Download avatar 1
  let avt1 = (await axios.get(
    `https://graph.facebook.com/${one}/picture?width=512&height=512`,
    { responseType: "arraybuffer" }
  )).data;
  fs.writeFileSync(avatarOnePath, Buffer.from(avt1));

  // Download avatar 2
  let avt2 = (await axios.get(
    `https://graph.facebook.com/${two}/picture?width=512&height=512`,
    { responseType: "arraybuffer" }
  )).data;
  fs.writeFileSync(avatarTwoPath, Buffer.from(avt2));

  let avatarOne = await jimp.read(avatarOnePath);
  let avatarTwo = await jimp.read(avatarTwoPath);

  avatarOne.circle();
  avatarTwo.circle();

  avatarOne.resize(320, 320);
  avatarTwo.resize(340, 340);

  // Face positions (adjust if needed)
  background
    .composite(avatarOne, 380, 320)
    .composite(avatarTwo, 1220, 250);

  await background.writeAsync(finalPath);

  fs.unlinkSync(avatarOnePath);
  fs.unlinkSync(avatarTwoPath);

  return finalPath;
}

module.exports.run = async function ({ api, event }) {
  const fs = require("fs-extra");
  const { threadID, messageID, senderID, mentions, type, messageReply } = event;

  let partnerID, partnerName;

  // Mention support
  if (mentions && Object.keys(mentions).length > 0) {
    partnerID = Object.keys(mentions)[0];
    let partnerInfo = await api.getUserInfo(partnerID);
    partnerName = partnerInfo[partnerID].name;
  }

  // Reply support
  else if (type === "message_reply" && messageReply.senderID) {
    partnerID = messageReply.senderID;
    let partnerInfo = await api.getUserInfo(partnerID);
    partnerName = partnerInfo[partnerID].name;
  }

  // Random participant
  else {
    let threadInfo = await api.getThreadInfo(threadID);
    let participants = threadInfo.participantIDs.filter(id => id !== senderID);
    partnerID = participants[Math.floor(Math.random() * participants.length)];
    let partnerInfo = await api.getUserInfo(partnerID);
    partnerName = partnerInfo[partnerID].name;
  }

  let senderInfo = await api.getUserInfo(senderID);
  let senderName = senderInfo[senderID].name;

  const percentages = [
    "100%", "99%", "95%", "87%", "76%",
    "69%", "58%", "47%", "32%", "12%"
  ];

  const matchRate =
    percentages[Math.floor(Math.random() * percentages.length)];

  let mentionsArr = [
    { id: senderID, tag: senderName },
    { id: partnerID, tag: partnerName }
  ];

  return makeImage({ one: senderID, two: partnerID }).then(path => {
    api.sendMessage({
      body:
        `💍 𝙇𝙚𝙨𝙗𝙞𝙖𝙣 𝙒𝙚𝙙𝙙𝙞𝙣𝙜 💕\n` +
        `👰 ${senderName}\n👰 ${partnerName}\n\n` +
        `💖 Love Compatibility: ${matchRate}\n` +
        `🌸 Forever Together 🌸`,
      mentions: mentionsArr,
      attachment: fs.createReadStream(path)
    }, threadID, () => fs.unlinkSync(path), messageID);
  });
};
