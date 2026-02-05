module.exports.config = {
  name: "aviator",
  version: "1.0.1",
  credits: "rX + Sabah",
  description: "Aviator mini game for economy",
  commandCategory: "Game",
  usages: "aviator <bet amount>",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Currencies }) {
  const bet = parseInt(args[0]);
  if (!bet || bet <= 0) return api.sendMessage("💰 Bet amount দিন।", event.threadID);

  // 🔹 Get user balance
  const userData = await Currencies.getData(event.senderID);
  const userMoney = userData.money || 0;
  if (bet > userMoney) return api.sendMessage("💸 আপনার কাছে এত টাকা নেই!", event.threadID);

  // 🔹 Deduct bet
  await Currencies.decreaseMoney(event.senderID, bet);

  // 🔹 Plane frames
  const frames = [
    "✈️───────────────  120m",
    "─✈️──────────────  260m",
    "──✈️─────────────  410m",
    "───✈️────────────  580m",
    "────✈️───────────  760m",
    "─────✈️──────────  940m",
    "──────✈️─────────  1.1km",
    "───────✈️────────  1.3km",
    "────────✈️───────  1.6km",
    "─────────✈️──────  1.9km",
    "──────────✈️─────  2.3km",
    "───────────✈️────  2.8km",
    "────────────✈️───  3.4km",
    "─────────────✈️──  4.1km",
    "──────────────✈️─  5.0km 🚀"
  ];

  // 🔹 Random crash index
  const crashIndex = Math.floor(Math.random() * frames.length);

  let msg;

  // 🔹 Animate plane
  for (let i = 0; i <= crashIndex; i++) {
    await new Promise(r => setTimeout(r, 400));
    const text = `🛫 Aviator Game\n\n${frames[i]}`;
    if (i === 0) {
      msg = await api.sendMessage(text, event.threadID);
    } else {
      await api.editMessage(text, msg.messageID);
    }
  }

  // 🔹 Plane crash
  const crashFrame = frames[crashIndex];
  const distanceMatch = crashFrame.match(/(\d+(\.\d+)?)/);
  const distance = distanceMatch ? distanceMatch[0] : "0";

  // 🔹 Dynamic multiplier: crashIndex / maxIndex * 5 (max 5x)
  const maxMultiplier = 5;
  const multiplier = ((crashIndex + 1) / frames.length * maxMultiplier).toFixed(2);

  const winAmount = Math.floor(bet * multiplier);

  // 🔹 Add balance
  await Currencies.increaseMoney(event.senderID, winAmount);

  // 🔹 Send final message
  await api.editMessage(
    `💥 Plane crashed at ${distance}!\n🎉 You won: ${winAmount} 💰 (x${multiplier})`,
    msg.messageID
  );
};
