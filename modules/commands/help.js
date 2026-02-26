const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "help",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "rX + Modified by KakashiXtoru",
  usePrefix: true,
  description: "Advanced Custom Category Help Menu",
  commandCategory: "System",
  usages: "[command name]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {

    // ==============================
    // ⚙️ CUSTOM CATEGORY CONTROL
    // ==============================

    // 👉 Only these categories will show (leave empty = show all)
    const VISIBLE_CATEGORIES = [
      "AI",
      "Game",
      "Group",
      "Media",
      "Image",
      "Utility",
      "Tag Fun",
      "img"
    ];

    // 👉 These categories will NEVER show
    const HIDDEN_CATEGORIES = [
      "Admin",
      "nsfw",
      "noprefix",
      "System",
      "Picture",
      "video Convert Audio",
    ];

    // ==============================
    // 🔄 LOADING ANIMATION
    // ==============================

    const frames = [
      "█░░░░░░░░░ 10%",
      "███░░░░░░░ 30%",
      "█████░░░░░ 50%",
      "███████░░░ 70%",
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

    // ==============================
    // 📂 LOAD COMMANDS
    // ==============================

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
          usages: cmd.config.usages || "",
          cooldowns: cmd.config.cooldowns || 0,
        });
      } catch {}
    }

    // ==============================
    // 📘 COMMAND DETAIL MODE
    // ==============================

    if (args[0] && isNaN(args[0])) {

      const find = args[0].toLowerCase();

      const cmd = commands.find(
        c =>
          c.name.toLowerCase() === find ||
          c.aliases.map(a => a.toLowerCase()).includes(find)
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
        if (!e) setTimeout(() => api.unsendMessage(i.messageID), 20000);
      }, event.messageID);
    }

    // ==============================
    // 📂 CATEGORY FILTER SYSTEM
    // ==============================

    const categories = {};

    for (let cmd of commands) {

      // ❌ Skip hidden
      if (HIDDEN_CATEGORIES.includes(cmd.category)) continue;

      // ✅ If visible list exists → only allow those
      if (VISIBLE_CATEGORIES.length &&
          !VISIBLE_CATEGORIES.includes(cmd.category)) continue;

      if (!categories[cmd.category])
        categories[cmd.category] = [];

      categories[cmd.category].push(cmd.name);
    }

    // ==============================
    // 📜 BUILD HELP MESSAGE
    // ==============================

    let msg = `╭──❏ 𝐂𝐮𝐬𝐭𝐨𝐦 𝐇𝐞𝐥𝐩 𝐌𝐞𝐧𝐮 ❏──╮\n`;
    msg += `│ ✧ Total Commands: ${commands.length}\n`;
    msg += `│ ✧ Prefix: ${global.config.PREFIX}\n`;
    msg += `╰─────────────────────⭓\n\n`;

    for (let [cat, cmds] of Object.entries(categories)) {

      msg += `╭─‣ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆 : ${cat}\n`;

      for (let i = 0; i < cmds.length; i += 2) {
        const row = [`「${cmds[i]}」`];
        if (cmds[i + 1])
          row.push(`✘ 「${cmds[i + 1]}」`);

        msg += `├‣ ${row.join(" ")}\n`;
      }

      msg += `╰────────────◊\n\n`;
    }

    msg += `⭔ Type ${global.config.PREFIX}help [command]\n`;
    msg += `╭─[⋆˚🦋k̶a̶k̶a̶s̶h̶i̶X̶t̶o̶r̶u̶🎀⋆˚]\n`;
    msg += `╰‣ Admin : Kakashi Hatake\n`;
    msg += `╰‣ Report : .callad (yourmsg)\n`;

    // ==============================
    // 🎞 RANDOM GIF
    // ==============================

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
      if (!e) setTimeout(() => api.unsendMessage(i.messageID), 20000);
    }, event.messageID);

  } catch (err) {
    api.sendMessage("❌ Error: " + err.message, event.threadID, event.messageID);
  }
};
