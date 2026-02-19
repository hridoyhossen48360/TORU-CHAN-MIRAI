const { createCanvas, loadImage } = require("canvas");
const fs = require("fs-extra");
const path = require("path");
const request = require("request");

module.exports.config = {
  name: "jail",
  version: "10.0",
  hasPermssion: 0,
  credits: "Hridoy",
  description: "Wanted poster (Square Avatar + Random Reason)",
  commandCategory: "Tag Fun",
  usages: "jail [@mention/reply/UID/link/name]",
  cooldowns: 10
};

// ===== Full Name Detection =====
async function getUIDByFullName(api, threadID, body) {
  if (!body.includes("@")) return null;
  const match = body.match(/@(.+)/);
  if (!match) return null;

  const targetName = match[1].trim().toLowerCase().replace(/\s+/g, " ");
  const threadInfo = await api.getThreadInfo(threadID);
  const users = threadInfo.userInfo || [];

  const user = users.find(u => {
    if (!u.name) return false;
    const fullName = u.name.trim().toLowerCase().replace(/\s+/g, " ");
    return fullName === targetName;
  });

  return user ? user.id : null;
}

// ===== Get Target User =====
async function getTargetUser(api, event, args) {
  let targetID;

  if (event.type === "message_reply") {
    targetID = event.messageReply.senderID;
  } else if (args[0]) {
    if (args[0].includes(".com/")) {
      targetID = await api.getUID(args[0]);
    } else if (args.join().includes("@")) {
      targetID = Object.keys(event.mentions || {})[0];
      if (!targetID) {
        targetID = await getUIDByFullName(api, event.threadID, args.join(" "));
      }
    } else {
      targetID = args[0];
    }
  } else {
    targetID = event.senderID;
  }

  return targetID;
}

// ===== Image Generator =====
async function generateImage(avatarPath, name, outPath) {
  const avatar = await loadImage(avatarPath);
  const width = 600;
  const height = 800;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, width, height);

  // WANTED
  ctx.font = "bold 100px Arial";
  ctx.fillStyle = "#ef4444";
  ctx.textAlign = "center";
  ctx.fillText("WANTED", width / 2, 120);

  // ===== Square Avatar =====
  const size = 400;
  const x = (width - size) / 2;
  const y = (height / 2 + 20) - size / 2;

  ctx.drawImage(avatar, x, y, size, size);

  // Border
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 10;
  ctx.strokeRect(x, y, size, size);

  // ===== Jail Bars =====
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 20;

  const barCount = 8;
  const space = width / (barCount + 1);

  for (let i = 1; i <= barCount; i++) {
    const bx = i * space;
    ctx.beginPath();
    ctx.moveTo(bx, 180);
    ctx.lineTo(bx, height - 180);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;

  // Locked Text
  ctx.font = "italic 50px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText("Locked Up!", width / 2, height - 100);

  // Name
  ctx.font = "bold 40px Arial";
  ctx.fillStyle = "#cbd5e1";
  ctx.fillText(name.toUpperCase(), width / 2, height - 50);

  fs.writeFileSync(outPath, canvas.toBuffer());
}

module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, messageID, senderID } = event;

  const targetID = await getTargetUser(api, event, args);

  if (!targetID) {
    return api.sendMessage(
      " বসকে ডাক দে🫩\nকীভাবে কমান্ড ব্যবহার করতে হয় শিখায় দিবো🥴",
      threadID,
      messageID
    );
  }

  const name = await Users.getNameUser(targetID);

  try {
    const cacheDir = path.join(__dirname, "cache");
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const avatarCache = path.join(cacheDir, `jail_avatar_${targetID}.jpg`);
    const wantedPath = path.join(cacheDir, `jail_${Date.now()}.png`);

    const fbPicUrl = `https://graph.facebook.com/${targetID}/picture?height=1500&width=1500&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;

    await new Promise((resolve, reject) => {
      request(encodeURI(fbPicUrl))
        .pipe(fs.createWriteStream(avatarCache))
        .on("close", resolve)
        .on("error", reject);
    });

    await generateImage(avatarCache, name, wantedPath);

    // ===== Random Funny Reasons =====
    const reasons = [
      "চায়ের দোকানে ৫ টাকার বাকি রেখে পালানোর অপরাধে 🚨",
      "বলেছিল ৫ মিনিটে আসবে, ৩ ঘন্টা গায়েব থাকার কারণে ⏳",
      "লুডু খেলায় চিটিং করতে গিয়ে ধরা পড়েছে 🎲",
      "অতিরিক্ত কিউটনেস ছড়ানোর অপরাধে 😌",
      "বন্ধুর ফ্রিজ থেকে শেষ আইসক্রিম খাওয়ার কারণে 🍦",
      "রাতে ৩টায় 'ঘুমাস?' মেসেজ পাঠানোর কারণে 📩",
      "অনলাইন ক্লাসে ক্যামেরা অফ রেখে ঘুমানোর জন্য 💤",
      "ক্রাশকে দেখে হার্টবিট বাড়ানোর দায়ে 💓",
      "ডায়েট শুরু করে ১০ মিনিট পর ভাত খাওয়ার কারণে 🍚",
      "গ্রুপে শুধু 😂 রিয়্যাক্ট দেওয়ার অপরাধে 🤣"
    ];

    const randomReason = reasons[Math.floor(Math.random() * reasons.length)];

    let jailMessage;
    if (targetID === senderID) {
      jailMessage = `নিজেই নিজেকে জেলে ভরলো 🤣\nকারণ: ${randomReason}`;
    } else {
      jailMessage = `@${name} ${randomReason}\nতাই তাকে জেলে ভরা হলো 🥹🙆`;
    }

    api.sendMessage(
      {
        body: jailMessage,
        mentions: [{ tag: name, id: targetID }],
        attachment: fs.createReadStream(wantedPath)
      },
      threadID,
      () => {
        [avatarCache, wantedPath].forEach(f => fs.existsSync(f) && fs.unlinkSync(f));
      },
      messageID
    );

  } catch (err) {
    console.error("Jail Error:", err);
    api.sendMessage("⚠️কমান্ড এর ফাইল নষ্ট হয়ে গেছে", threadID, messageID);
  }
};
