module.exports.config = {
  name: "anti",
  version: "4.1.5",
  hasPermssion: 1,
  credits: "rX",
  description: "Anti change Group info system",
  commandCategory: "Admin",
  usages: "anti [reply number]",
  cooldowns: 5,
  images: [],
  dependencies: {
    "fs-extra": "",
  },
};

const { readdirSync, readFileSync, writeFileSync, existsSync, unlinkSync } = require("fs-extra");
const path = require('path');
const fs = require('fs');
const axios = require('axios');

module.exports.handleReply = async function ({ api, event, args, handleReply, Threads }) {
  const { senderID, threadID, messageID } = event;
  const { author, permssion } = handleReply;
  const timeDhaka = (require('moment-timezone')).tz('Asia/Dhaka').format('HH:mm:ss || DD/MM/YYYY');
  const pathData = global.anti;
  const dataAnti = JSON.parse(readFileSync(pathData, "utf8"));

  if (author !== senderID) return api.sendMessage(`❎ You are not the user who called this command.`, threadID);

  var number = event.args.filter(i => !isNaN(i));
  for (const num of number) {
    switch (num) {
      case "1": {
        if (permssion < 1) return api.sendMessage("⚠️ You don't have enough permission to use this mode.", threadID, messageID);
        var NameBox = dataAnti.boxname;
        const antiName = NameBox.find((item) => item.threadID === threadID);
        if (antiName) {
          dataAnti.boxname = dataAnti.boxname.filter((item) => item.threadID !== threadID);
          api.sendMessage("☑️ Successfully DISABLED Anti-Group Name change.", threadID, messageID);
        } else {
          var threadName = (await api.getThreadInfo(event.threadID)).threadName;
          dataAnti.boxname.push({ threadID, name: threadName });
          api.sendMessage("☑️ Successfully ENABLED Anti-Group Name change.", threadID, messageID);
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
        break;
      }
      case "2": {
        if (permssion < 1) return api.sendMessage("⚠️ You don't have enough permission to use this mode.", threadID, messageID);
        const antiImage = dataAnti.boximage.find((item) => item.threadID === threadID);
        if (antiImage) {
          dataAnti.boximage = dataAnti.boximage.filter((item) => item.threadID !== threadID);
          api.sendMessage("☑️ Successfully DISABLED Anti-Group Image change.", threadID, messageID);
        } else {
          var threadInfo = await api.getThreadInfo(event.threadID);
          let url = threadInfo.imageSrc;
          let response = await global.api.imgur(url);
          let img = response.link;
          dataAnti.boximage.push({ threadID, url: img });
          api.sendMessage("☑️ Successfully ENABLED Anti-Group Image change.", threadID, messageID);
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
        break;
      }
      case "3": {
        if (permssion < 1) return api.sendMessage("⚠️ You don't have enough permission to use this mode.", threadID, messageID);
        const NickName = dataAnti.antiNickname.find((item) => item.threadID === threadID);
        if (NickName) {
          dataAnti.antiNickname = dataAnti.antiNickname.filter((item) => item.threadID !== threadID);
          api.sendMessage("☑️ Successfully DISABLED Anti-Nickname change.", threadID, messageID);
        } else {
          const nickNames = (await api.getThreadInfo(event.threadID)).nicknames;
          dataAnti.antiNickname.push({ threadID, data: nickNames });
          api.sendMessage("☑️ Successfully ENABLED Anti-Nickname change.", threadID, messageID);
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
        break;
      }
      case "4": {
        if (permssion < 1) return api.sendMessage("⚠️ You don't have enough permission to use this mode.", threadID, messageID);
        const antiout = dataAnti.antiout;
        if (antiout[threadID] == true) {
          antiout[threadID] = false;
          api.sendMessage("☑️ Successfully DISABLED Anti-Out (Auto Re-add).", threadID, messageID);
        } else {
          antiout[threadID] = true;
          api.sendMessage("☑️ Successfully ENABLED Anti-Out (Auto Re-add).", threadID, messageID);
        }
        writeFileSync(pathData, JSON.stringify(dataAnti, null, 4));
        break;
      }
      case "5": {
        const filepath = path.join(process.cwd(), 'systemdata', 'data', 'antiemoji.json');
        if (!fs.existsSync(filepath)) fs.writeFileSync(filepath, "{}", "utf8");
        let data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        let emoji = "";
        try {
          let threadInfo = await api.getThreadInfo(threadID);
          emoji = threadInfo.emoji;
        } catch (e) {}
        if (!data.hasOwnProperty(threadID)) {
          data[threadID] = { emoji: emoji, emojiEnabled: true };
        } else {
          data[threadID].emojiEnabled = !data[threadID].emojiEnabled;
          if (data[threadID].emojiEnabled) data[threadID].emoji = emoji;
        }
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
        api.sendMessage(`☑️ Successfully ${data[threadID].emojiEnabled ? "ENABLED" : "DISABLED"} Anti-Emoji change.`, threadID, messageID);
        break;
      }
      case "6": {
        const filepath = path.join(process.cwd(), 'systemdata', 'data', 'antitheme.json');
        if (!fs.existsSync(filepath)) fs.writeFileSync(filepath, "{}", "utf8");
        let data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        let theme = "";
        try {
          const threadInfo = await Threads.getInfo(threadID);
          theme = threadInfo.threadTheme.id;
        } catch (e) {}
        if (!data.hasOwnProperty(threadID)) {
          data[threadID] = { themeid: theme || "", themeEnabled: true };
        } else {
          data[threadID].themeEnabled = !data[threadID].themeEnabled;
          if (data[threadID].themeEnabled) data[threadID].themeid = theme || "";
        }
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
        api.sendMessage(`☑️ Successfully ${data[threadID].themeEnabled ? "ENABLED" : "DISABLED"} Anti-Theme change.`, threadID, messageID);
        break;
      }
      case "7": {
        const dataAntiPath = __dirname + '/data/antiqtv.json';
        const info = await api.getThreadInfo(event.threadID);
        if (!info.adminIDs.some(item => item.id == api.getCurrentUserID()))
          return api.sendMessage('❎ Bot needs Admin privileges to execute this.', event.threadID, event.messageID);
        let data = JSON.parse(fs.readFileSync(dataAntiPath));
        if (!data[threadID]) {
          data[threadID] = true;
          api.sendMessage(`☑️ Successfully ENABLED Anti-Admin change (Prevents box theft).`, threadID, messageID);
        } else {
          data[threadID] = false;
          api.sendMessage(`☑️ Successfully DISABLED Anti-Admin change.`, threadID, messageID);
        }
        fs.writeFileSync(dataAntiPath, JSON.stringify(data, null, 4));
        break;
      }
      case "8": {
        const antiJoinPath = path.join(__dirname, 'data', 'threadData.json');
        let antiJoinData = JSON.parse(fs.readFileSync(antiJoinPath, 'utf8'));
        if (!antiJoinData.hasOwnProperty(threadID) || antiJoinData[threadID] === false) {
          antiJoinData[threadID] = true;
          api.sendMessage(`☑️ Successfully ENABLED Anti-Join (Prevents adding new members).`, threadID, messageID);
        } else {
          antiJoinData[threadID] = false;
          api.sendMessage(`☑️ Successfully DISABLED Anti-Join.`, threadID, messageID);
        }
        fs.writeFileSync(antiJoinPath, JSON.stringify(antiJoinData, null, 2), 'utf8');
        break;
      }
      case "9": {
        const antiImage = dataAnti.boximage.find(item => item.threadID === threadID);
        const antiBoxname = dataAnti.boxname.find(item => item.threadID === threadID);
        const antiNickname = dataAnti.antiNickname.find(item => item.threadID === threadID);
        const status = (bool) => bool ? "ON" : "OFF";
        return api.sendMessage(`[ ANTI SYSTEM STATUS ]\n────────────────────\n|› 1. Anti Namebox: ${status(antiBoxname)}\n|› 2. Anti Imagebox: ${status(antiImage)}\n|› 3. Anti Nickname: ${status(antiNickname)}\n|› 4. Anti Out: ${status(dataAnti.antiout[threadID])}\n────────────────────\n|› Toru Anti System - Protect your group!`, threadID);
      }
      default: {
        return api.sendMessage(`❎ The number you chose is not in the list.`, threadID);
      }
    }
  }
};

module.exports.run = async ({ api, event, args, permssion, Threads }) => {
  const { threadID, messageID, senderID } = event;
  const threadSetting = (await Threads.getData(String(threadID))).data || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : global.config.PREFIX;
  return api.sendMessage(`╭─────────────⭓\n│ Toru Anti-Change Group\n├─────⭔\n│ 1. anti namebox: Lock group name\n│ 2. anti boximage: Lock group image\n│ 3. anti nickname: Lock member nicknames\n│ 4. anti out: Prevent leaving group\n│ 5. anti emoji: Lock group emoji\n│ 6. anti theme: Lock group theme\n│ 7. anti qtv: Protect admin list\n│ 8. anti join: Prevent adding members\n│ 9. Check group anti status\n├────────⭔\n│ 📌 Reply with a number to toggle the mode status\n╰─────────────⭓`,
    threadID, (error, info) => {
      if (error) {
        return api.sendMessage("❎ An error occurred!", threadID);
      } else {
        global.client.handleReply.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          permssion
        });
      }
    }, messageID);
};
