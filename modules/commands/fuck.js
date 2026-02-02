module.exports.config = {
    name: "fuck",
    version: "7.3.2",
    hasPermssion: 2,
    credits: "MrTomXxX",
    description: "Get fuck",
    commandCategory: "img",
    usages: "[@mention]",
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

    // 🔥 ONLINE TEMPLATE IMAGE
    const baseImage = await jimp.read(
        "https://i.imgur.com/Ee93Xjb.jpeg"
    );

    const avatarOnePath = path.join(cacheDir, `avt_${one}.png`);
    const avatarTwoPath = path.join(cacheDir, `avt_${two}.png`);
    const outPath = path.join(cacheDir, `fuck_${one}_${two}.png`);

    const avatar1 = (await axios.get(
        `https://graph.facebook.com/${one}/picture?width=512&height=512`,
        { responseType: "arraybuffer" }
    )).data;

    const avatar2 = (await axios.get(
        `https://graph.facebook.com/${two}/picture?width=512&height=512`,
        { responseType: "arraybuffer" }
    )).data;

    fs.writeFileSync(avatarOnePath, avatar1);
    fs.writeFileSync(avatarTwoPath, avatar2);

    const circleOne = await jimp.read(await circle(avatarOnePath));
    const circleTwo = await jimp.read(await circle(avatarTwoPath));

    baseImage
        .composite(circleOne.resize(180, 180), 190, 200)
        .composite(circleTwo.resize(180, 180), 390, 200);

    await baseImage.writeAsync(outPath);

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
    const mention = Object.keys(event.mentions);

    if (!mention[0])
        return api.sendMessage(
            "Please mention 1 person.",
            threadID,
            messageID
        );

    const one = senderID;
    const two = mention[0];

    const imgPath = await makeImage({ one, two });

    return api.sendMessage(
        {
            body: "",
            attachment: fs.createReadStream(imgPath)
        },
        threadID,
        () => fs.unlinkSync(imgPath),
        messageID
    );
};
