module.exports.config = {
  name: "bal",
  aliases: ["balance","money"],
  description: "Check your balance",
  cooldown: 3,
  hasPermssion: 0
};

module.exports.run = async function({ api, event, args }) {
  const econ = require("./economy.js");
  const userID = event.senderID;
  await econ.init();
  const balance = await econ.getBalance(userID);

  const message = `
╭───💰 TORU-CHAN BALANCE ───╮
│ User: ${event.senderName}
│ Balance: ${balance.toLocaleString()}$
╰───────────────────────────╯
`;

  return api.sendMessage(message, event.threadID, event.messageID);
};
