const axios = require("axios");
const request = require("request");
const fs = require("fs-extra");
const moment = require("moment-timezone");

module.exports.config = {
    name: "owner",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "rX Abdullah", //don't change my credit 
    description: "Show Owner Info",
    commandCategory: "Admin",
    usages: "",
    cooldowns: 5
};

module.exports.run = async function({ api, event }) {
    var time = moment().tz("Asia/Dhaka").format("DD/MM/YYYY hh:mm:ss A");

    var callback = () => api.sendMessage({
        body: `
┏━━━━━━━━━━━━━━━━━━━━━┓
┃      🌟 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 🌟      
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 👤 𝐍𝐚𝐦𝐞  :𝐊𝐚𝐤𝐚𝐬𝐡𝐢 𝐇𝐚𝐭𝐚𝐤𝐞
┃ 🚹 𝐆𝐞𝐧𝐝𝐞𝐫  : 𝐌𝐚𝐥𝐞
┃ ❤️ 𝐑𝐞𝐥𝐚𝐭𝐢𝐨𝐧  : ??
┃ 🎂 𝐀𝐠𝐞      : 20+
┃ 🕌 𝐑𝐞𝐥𝐢𝐠𝐢𝐨𝐧  : 𝐈𝐬𝐥𝐚𝐦
┃ 🏫 𝐄𝐝𝐮𝐜𝐚𝐭𝐢𝐨𝐧 : 𝐢𝐧𝐭𝐞𝐫 𝟐𝐧𝐝 𝐲𝐞𝐚𝐫
┃ 🏡 𝐀𝐝𝐝𝐫𝐞𝐬𝐬  : 𝐁𝐚𝐧𝐠𝐥𝐚𝐝𝐞𝐬𝐡
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 🎭 𝐓𝐢𝐤𝐭𝐨𝐤  : এইসব চালায় না ।
┃ 📢 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦 : dukkho____bilash
┃ 🌐 𝐅𝐚𝐜𝐞𝐛𝐨𝐨𝐤 : m.me/61587127028066
┣━━━━━━━━━━━━━━━━━━━━━┫
┃ 🕒 𝐔𝐩𝐝𝐚𝐭𝐞𝐝 𝐓𝐢𝐦𝐞:  ${time}
┗━━━━━━━━━━━━━━━━━━━━━┛
        `,
        attachment: fs.createReadStream(__dirname + "/cache/1.png")
    }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
  
    return request(encodeURI(`https://i.imgur.com/oEh5VEx.jpeg`))
        .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
        .on('close', () => callback());
};
