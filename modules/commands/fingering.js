module.exports.config = {
    name: "fingering",
    version: "2.0.2",
    hasPermssion: 0,
    credits: "HRIDOY HOSSEN + GPT Secure Upgrade",
    description: "Funny fingering ship image generator",
    commandCategory: "Love",
    usages: "[tag someone]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"];
    const jimp = global.nodemodule["jimp"];

    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

    // 🔥 ONLINE TEMPLATE (no local file needed)
    const bg = await jimp.read(
        "https://i.imgur.com/fWayHa3.jpeg"
    );

    const avatarOnePath = path.join(cacheDir, `avt_${one}.png`);
    const avatarTwoPath = path.join(cacheDir, `avt_${two}.png`);
    const outPath = path.join(cacheDir, `fingering_${one}_${two}.png`);

    const avatarOne = (await axios.get(
        `https://graph.facebook.com/${one}/picture?width=512&height=512`,
        { responseType: "arraybuffer" }
    )).data;

    const avatarTwo = (await axios.get(
        `https://graph.facebook.com/${two}/picture?width=512&height=512`,
        { responseType: "arraybuffer" }
    )).data;

    fs.writeFileSync(avatarOnePath, avatarOne);
    fs.writeFileSync(avatarTwoPath, avatarTwo);

    const circleOne = await jimp.read(await circle(avatarOnePath));
    const circleTwo = await jimp.read(await circle(avatarTwoPath));

    bg.resize(1024, 712)
      .composite(circleOne.resize(200, 200), 527, 141)
      .composite(circleTwo.resize(200, 200), 389, 407);

    await bg.writeAsync(outPath);

    fs.unlinkSync(avatarOnePath);
    fs.unlinkSync(avatarTwoPath);

    return outPath;
}

async function circle(image) {
    const jimp = require("jimp");
    const img = await jimp.read(image);
    img.circle();
    return await img.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api }) {
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID } = event;

    const mention = Object.keys(event.mentions)[0];
    if (!mention)
        return api.sendMessage("⚠️ Please tag one person!", threadID, messageID);

    // 🛡️ Special ID Protection
    const specialIDs = [
        "61587127028066",
        "100001162111551"
    ];

    if (specialIDs.includes(mention)) {
        return api.sendMessage(
            "😏 ঐটা আমার Boss এর ID! ওর সাথে এমনটা করা যাবে না 😤💀",
            threadID,
            messageID
        );
    }

    const tag = event.mentions[mention].replace("@", "");
    const one = senderID;
    const two = mention;

    const imgPath = await makeImage({ one, two });

    return api.sendMessage(
        {
            body: `💞 ${tag} তুমি কিন্তু এখন আমার Boss HRIDOY এর স্পেশাল moment এ চলে গেছো 😏`,
            mentions: [{ tag, id: mention }],
            attachment: fs.createReadStream(imgPath)
        },
        threadID,
        () => fs.unlinkSync(imgPath),
        messageID
    );
};
