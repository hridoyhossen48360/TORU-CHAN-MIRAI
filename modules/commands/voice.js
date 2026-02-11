module.exports.config = {
  name: "voice",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "Kakashi Hatake + Modified by Hridoy",
  description: "Emoji to cute voice 😍 (Thread On/Off)",
  commandCategory: "System",
  usages: "voice on/off",
  cooldowns: 0
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "cache", "voice.json");

const emojiAudioMap = {
 "🥱": "https://files.catbox.moe/9pou40.mp3",
 "😁": "https://files.catbox.moe/60cwcg.mp3",
 "😌": "https://files.catbox.moe/epqwbx.mp3",
 "🥺": "https://files.catbox.moe/wc17iq.mp3",
 "🤭": "https://files.catbox.moe/cu0mpy.mp3",
 "😅": "https://files.catbox.moe/jl3pzb.mp3",
 "😏": "https://files.catbox.moe/z9e52r.mp3",
 "😞": "https://files.catbox.moe/tdimtx.mp3",
 "🤫": "https://files.catbox.moe/0uii99.mp3",
 "🍼": "https://files.catbox.moe/p6ht91.mp3",
 "🤔": "https://files.catbox.moe/hy6m6w.mp3",
 "🥰": "https://files.catbox.moe/dv9why.mp3",
 "🤦": "https://files.catbox.moe/ivlvoq.mp3",
 "😘": "https://files.catbox.moe/sbws0w.mp3",
 "😑": "https://files.catbox.moe/p78xfw.mp3",
 "😢": "https://files.catbox.moe/shxwj1.mp3",
 "🙊": "https://files.catbox.moe/3bejxv.mp3",
 "🤨": "https://files.catbox.moe/4aci0r.mp3",
 "😡": "https://files.catbox.moe/shxwj1.mp3",
 "🙈": "https://files.catbox.moe/3qc90y.mp3",
 "😍": "https://files.catbox.moe/qjfk1b.mp3",
 "😭": "https://files.catbox.moe/itm4g0.mp3",
 "😱": "https://files.catbox.moe/mu0kka.mp3",
 "😻": "https://files.catbox.moe/y8ul2j.mp3",
 "😿": "https://files.catbox.moe/tqxemm.mp3",
 "💔": "https://files.catbox.moe/6yanv3.mp3",
 "🤣": "https://files.catbox.moe/2sweut.mp3",
 "🥹": "https://files.catbox.moe/jf85xe.mp3",
 "😩": "https://files.catbox.moe/b4m5aj.mp3",
 "🫣": "https://files.catbox.moe/ttb6hi.mp3",
 "🐸": "https://files.catbox.moe/utl83s.mp3"
};

// ensure file exists
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, JSON.stringify({}));
}

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, messageID, body } = event;
  if (!body || body.length > 2) return;

  const data = JSON.parse(fs.readFileSync(dataPath));
  if (!data[threadID]) return; // if off, do nothing

  const emoji = body.trim();
  const audioUrl = emojiAudioMap[emoji];
  if (!audioUrl) return;

  const filePath = path.join(__dirname, "cache", `${Date.now()}.mp3`);

  try {
    const response = await axios({
      method: "GET",
      url: audioUrl,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        { attachment: fs.createReadStream(filePath) },
        threadID,
        () => fs.unlinkSync(filePath),
        messageID
      );
    });

  } catch (err) {
    console.log(err);
  }
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID } = event;
  const data = JSON.parse(fs.readFileSync(dataPath));

  if (args[0] === "on") {
    data[threadID] = true;
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return api.sendMessage("✅ Voice system ON in this thread", threadID);
  }

  if (args[0] === "off") {
    delete data[threadID];
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    return api.sendMessage("❌ Voice system OFF in this thread", threadID);
  }

  return api.sendMessage("Use:\nvoice on\nvoice off", threadID);
};
