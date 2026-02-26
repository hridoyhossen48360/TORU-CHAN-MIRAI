module.exports.config = {
  name: "aviator",
  version: "1.0.3",
  credits: "Hridoy",
  description: "Aviator mini game for economy (batch animation)",
  commandCategory: "Game",
  usages: "aviator <bet amount>",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args, Currencies }) {
  const bet = parseInt(args[0]);
  if (!bet || bet <= 0) return api.sendMessage("💰 Bet amount দিন।", event.threadID);

  // 🔹 User balance check
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
    "──────────────✈️─  4.6km",
    "───────────────✈️  5.0km 🚀"
  ];

  // 🔹 Random crash index
  const crashIndex = Math.floor(Math.random() * frames.length);

  // 🔹 Split frames into batches (6 frames per batch)
  const batchSize = 6;
  const batches = [];
  for (let i = 0; i < frames.length; i += batchSize) {
    batches.push(frames.slice(i, i + batchSize));
  }

  let frameCounter = 0;

  // 🔹 Animate batch by batch
  for (const batch of batches) {
    let msg;
    for (let i = 0; i < batch.length; i++) {
      await new Promise(r => setTimeout(r, 400));

      let frameText = batch[i];

      // 💥 crash check
      if (frameCounter === crashIndex - 1) frameText = frameText.replace("✈️", "💥");

      const text = `🛫 Aviator Game\n\n${frameText}`;

      if (i === 0) {
        msg = await api.sendMessage(text, event.threadID);
      } else {
        await api.editMessage(text, msg.messageID);
      }

      frameCounter++;
      if (frameCounter > crashIndex) break; // plane crashed
    }

    // 🔹 Auto unsend batch message
    setTimeout(() => {
      if (msg) api.unsendMessage(msg.messageID);
    }, batch.length * 400 + 200);

    if (frameCounter > crashIndex) break; // stop after crash
  }

  // 🔹 Crash calculation
  const crashFrame = frames[crashIndex];
  const distanceMatch = crashFrame.match(/(\d+(\.\d+)?)/);
  const distance = distanceMatch ? distanceMatch[0] : "0";

  // 🔹 Dynamic multiplier
  const maxMultiplier = 5;
  const multiplier = ((crashIndex + 1) / frames.length * maxMultiplier).toFixed(2);
  const winAmount = Math.floor(bet * multiplier);

  // 🔹 Add balance
  await Currencies.increaseMoney(event.senderID, winAmount);

  // 🔹 Final crash message
  await api.sendMessage(
    `💥 Plane crashed at ${distance}!\n🎉 You won: ${winAmount} 💰 (x${multiplier})`,
    event.threadID
  );
};
