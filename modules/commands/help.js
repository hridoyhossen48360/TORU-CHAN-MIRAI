const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "help",
  version: "4.6.0",
  hasPermssion: 0,
  credits: "rX",
  usePrefix: true,
  description: "Paged help menu with progress animation + GIF + auto unsend",
  commandCategory: "System",
  usages: "[command name]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {

    // ---------- PROGRESS BAR ANIMATION ----------
    const frames = [
      "█░░░░░░░░░ 10%",
      "██░░░░░░░░ 20%",
      "███░░░░░░░ 30%",
      "████░░░░░░ 40%",
      "█████░░░░░ 50%",
      "██████░░░░ 60%",
      "███████░░░ 70%",
      "████████░░ 80%",
      "█████████░ 90%",
      "██████████ 100% ✨"
    ];

    let loading = await api.sendMessage(
      `🔄 Initializing Help Menu...\n\n${frames[0]}`,
      event.threadID
    );

    for (let i = 1; i < frames.length; i++) {
      await new Promise(r => setTimeout(r, 300));
      await api.editMessage(
        `🔄 Initializing Help Menu...\n\n${frames[i]}`,
        loading.messageID
      );
    }

    // ---------- LOAD COMMANDS ----------
    const commandDir = __dirname;
    const files = fs.readdirSync(commandDir).filter(f => f.endsWith(".js"));

    let commands = [];
    for (let file of files) {
      try {
        const cmd = require(path.join(commandDir, file));
        if (!cmd.config) continue;
        commands.push({
          name: cmd.config.name || file.replace(".js", ""),
          aliases: cmd.config.aliases || [],
          category: cmd.config.commandCategory || "Other",
          description: cmd.config.description || "No description available.",
          author: cmd.config.credits || "Unknown",
          version: cmd.config.version || "N/A",
          usages: cmd.config.usages || "No usage info",
          cooldowns: cmd.config.cooldowns || "N/A",
        });
      } catch {}
    }

    // ---------- COMMAND DETAIL ----------
    if (args[0] && isNaN(args[0])) {
      const find = args[0].toLowerCase();
      const cmd = commands.find(
        c => c.name.toLowerCase() === find || c.aliases.includes(find)
      );

      await api.unsendMessage(loading.messageID);

      if (!cmd)
        return api.sendMessage(
          `❌ Command "${find}" not found.`,
          event.threadID,
          event.messageID
        );

      let msg = `╭──❏ 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗗𝗘𝗧𝗔𝗜𝗟 ❏──╮\n`;
      msg += `│ ✧ Name: ${cmd.name}\n`;
      if (cmd.aliases.length)
        msg += `│ ✧ Aliases: ${cmd.aliases.join(", ")}\n`;
      msg += `│ ✧ Category: ${cmd.category}\n`;
      msg += `│ ✧ Version: ${cmd.version}\n`;
      msg += `│ ✧ Author: ${cmd.author}\n`;
      msg += `│ ✧ Cooldowns: ${cmd.cooldowns}s\n`;
      msg += `╰─────────────────────⭓\n`;
      msg += `📘 Description: ${cmd.description}\n`;
      msg += `📗 Usage: ${global.config.PREFIX}${cmd.name} ${cmd.usages}`;

      return api.sendMessage(msg, event.threadID, (e, i) => {
        if (!e) setTimeout(() => api.unsendMessage(i.messageID), 15000);
      }, event.messageID);
    }

    // ---------- SHOW ALL CATEGORIES WITH ALL COMMANDS ----------
    const categories = {};
    for (let cmd of commands) {
      if (!categories[cmd.category]) categories[cmd.category] = [];
      categories[cmd.category].push(cmd.name);
    }

    let msg = `╭──❏ 𝐀𝐮𝐭𝐨 𝐃𝐞𝐭𝐞𝐜𝐭 𝐇𝐞𝐥𝐩 ❏──╮\n`;
    msg += `│ ✧ Total Commands: ${commands.length}\n`;
    msg += `│ ✧ Prefix: ${global.config.PREFIX}\n`;
    msg += `╰─────────────────────⭓\n\n`;

    for (let [cat, cmds] of Object.entries(categories)) {
      msg += `╭─‣ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆 : ${cat}\n`;
      for (let i = 0; i < cmds.length; i += 2) {
        const row = [`「${cmds[i]}」`];
        if (cmds[i + 1]) row.push(`✘ 「${cmds[i + 1]}」`);
        msg += `├‣ ${row.join(" ")}\n`;
      }
      msg += `╰────────────◊\n\n`;
    }

    msg += `⭔ Type ${global.config.PREFIX}help [command] to see details\n`;
    msg += `╭─[⋆˚🦋k̶a̶k̶a̶s̶h̶i̶X̶t̶o̶r̶u̶🎀⋆˚]\n`;
    msg += `╰‣ 𝐀𝐝𝐦𝐢𝐧 : 𝐊𝐚𝐤𝐚𝐬𝐡𝐢 𝐇𝐚𝐭𝐚𝐤𝐞\n`;
    msg += `╰‣ 𝐑𝐢𝐩𝐨𝐫𝐭 : .callad (yourmsg)\n`;

    // ---------- GIF ----------
    let attachment = null;
    const cache = path.join(__dirname, "noprefix");
    if (fs.existsSync(cache)) {
      const allow = [".gif", ".mp4", ".png", ".jpg", ".webp"];
      const list = fs.readdirSync(cache).filter(f =>
        allow.includes(path.extname(f).toLowerCase())
      );
      if (list.length)
        attachment = fs.createReadStream(
          path.join(cache, list[Math.floor(Math.random() * list.length)])
        );
    }

    await api.unsendMessage(loading.messageID);
    api.sendMessage({ body: msg, attachment }, event.threadID, (e, i) => {
      if (!e) setTimeout(() => api.unsendMessage(i.messageID), 15000);
    }, event.messageID);

  } catch (err) {
    api.sendMessage("❌ Error: " + err.message, event.threadID, event.messageID);
  }
};
