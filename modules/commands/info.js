module.exports.config = {
 name: "info",
 version: "1.0.0",
 hasPermssion: 0,
 credits: "HRIDOY",
 description: "Bot information command",
 commandCategory: "Admin",
 hide: true,
 usages: "",
 cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, Users, Threads }) {
 const { threadID } = event;
 const request = global.nodemodule["request"];
 const fs = global.nodemodule["fs-extra"];
 const moment = require("moment-timezone");

 const { configPath } = global.client;
 delete require.cache[require.resolve(configPath)];
 const config = require(configPath);

 const { commands } = global.client;
 const threadSetting = (await Threads.getData(String(threadID))).data || {};
 const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : config.PREFIX;

 const uptime = process.uptime();
 const hours = Math.floor(uptime / 3600);
 const minutes = Math.floor((uptime % 3600) / 60);
 const seconds = Math.floor(uptime % 60);

 const totalUsers = global.data.allUserID.length;
 const totalThreads = global.data.allThreadID.length;

 const msg = `
╭────────────────────╮
    🤖 BOT INFORMATION
╰────────────────────╯
➤ Name        : TORU CHAN
➤ Prefix      : ${config.PREFIX}
➤ Prefix Box  : ${prefix}
➤ Modules     : ${commands.size}
➤ Ping        : ${Date.now() - event.timestamp} ms

╭────────────────────╮
      👑 OWNER INFO
╰────────────────────╯
➤ Name        : Kakashi Hatake
➤ Facebook    : facebook.com/100061935903355
➤ Messenger   : m.me/100061935903355
➤ WhatsApp    : wa.me/+8801744-******

╭────────────────────╮
       📊ACTIVITIES
╰────────────────────╯
➤ Uptime      : ${hours}h ${minutes}m ${seconds}s
➤ Total Groups: ${totalThreads}
➤ Total Users : ${totalUsers}

──────────────────────
      KAKASHI HATAKE
──────────────────────
`;

 const imgLinks = [
 "https://i.imgur.com/oEh5VEx.jpeg"
 ];

 const imgLink = imgLinks[Math.floor(Math.random() * imgLinks.length)];

 const callback = () => {
 api.sendMessage({
 body: msg,
 attachment: fs.createReadStream(__dirname + "/cache/info.jpg")
 }, threadID, () => fs.unlinkSync(__dirname + "/cache/info.jpg"));
 };

 return request(encodeURI(imgLink)).pipe(fs.createWriteStream(__dirname + "/cache/info.jpg")).on("close", callback);
};
 
