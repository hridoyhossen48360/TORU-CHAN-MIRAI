module.exports.config = {
  name: "roast",
  version: "4.3.0",
  hasPermssion: 0,
  credits: "Hridoy,
  description: "এটা roast না, এটা তোর আত্মার GPS destroy করে দেয় 😈🪦",
  commandCategory: "Tag Fun",
  usages: "roast [@tag or name]",
  cooldowns: 8,
};

module.exports.run = async function ({ api, event, args }) {

  const bossIDs = ["61587127028066", "100061935903355"];

  const mentionIDs = Object.keys(event.mentions);
  const name = mentionIDs.length > 0
    ? Object.values(event.mentions)[0].replace(/@/g, '')
    : args.join(" ") || "তোর মতো walking disappointment";

  const targetID = mentionIDs[0] || null;

  if (bossIDs.includes(targetID)) {
    return api.sendMessage(
      "🛑 Boss ke roast korle amar server burn hoye jabe\nGod tier protection active — back off 😤🔥",
      event.threadID, event.messageID
    );
  }

  // 🔥 SOUL CRUSHER ROASTS — longer, meaner, funnier & more dangerous 🔥
  const soulCrusherRoasts = [
    `${name}, তোর মা তোকে রাতে ঘুম পাড়াতে গিয়ে lullaby গায় না, বরং quietly বলে “আমি কেন ৯ মাস ধরে এই ভুলটা বয়ে বেড়ালাম?” আর তুই ঘুমিয়ে পড়িস guilt trip খেয়ে 😭`,
    `${name}, তোকে দেখলে মনে হয় তোর বাবা delivery room-এ ঢুকে বলেছিল “এটা আমার না, এটা hospital-এর drainage pipe থেকে বের হয়েছে” আর doctor ও agree করেছিল nodding head দিয়ে 💀`,
    `${name}, তুই এমন যে তোর জন্মের দিন astrologer বলেছিল “এই child-এর জন্য world peace impossible” আর তোর মা শুনে silently cry করেছিল`,
    `${name}, তোর face এত cursed যে তোকে দেখে মিরর নিজে থেকে crack হয়ে যায়, আর ভাঙা টুকরোগুলো বলে “sorry আমরা আর দেখতে পারছি না” 🪞💔`,
    `${name}, তোর গন্ধ এত lethal যে perfume company তোকে patent করতে চায় “Eau de Death” নামে, আর যারা তোর কাছে আসে তারা পরের ৩ দিন খাবারের taste পায় না 🤢`,
    `${name}, তুই এমন failure যে তোর life goals দেখে motivational speaker-রা depression-এ চলে যায় আর বলে “ভাই আমরা হাল ছেড়ে দিলাম” 🎤😔`,
    `${name}, তোকে hug করতে গেলে মানুষের immune system auto-activate হয়ে বলে “abort mission, biohazard detected” আর পিছনে সরে যায় 🫂☣️`,
    `${name}, তোর personality এত toxic যে Chernobyl-এর tour guide তোকে দেখে বলে “এই level-এর radiation warning sign-ও লাগবে না, তুই নিজেই sign” ☢️`,
    `${name}, তোর দাঁত এত হলুদ আর crooked যে traffic police তোকে দেখে auto-matically stop করে আর বলে “license দেখা, এই দাঁত দিয়ে কাউকে হাসতে দেখলে fine দিতে হবে” 🚦🦷`,
    `${name}, তুই এমন যে তোর mom’s phone-এ তোর ছবি দেখলে auto-delete হয়ে যায়, কারণ storage বলে “nah bro, এটা মানসিক ট্রমা” আর recycle bin-ও reject করে 🗑️`,
    `${name}, তোর existence এত annoying যে universe-এর admin panel-এ তোর নামের পাশে “delete forever” button permanently highlighted থাকে 🌌🗑️`,
    `${name}, তোকে দেখে মনে হয় God coding করতে গিয়ে copy-paste mistake করেছিল আর debug না করে live-এ ছেড়ে দিয়েছে, তাই তুই এমন bugged version 😭`,
    `${name}, তোর জীবন এত boring যে Netflix recommendation তোকে দেখে “Are you still watching? … No? Good, neither are we” বলে auto-off হয়ে যায় 📺`,
    `${name}, তুই এমন low-budget human যে তোর shadow ও moonlight চায় না, আর রাতে তোর পাশে দাঁড়ালে street light ও flicker করে পালাতে চায় 💡🏃`,
    `${name}, তোর voice শুনলে autotune software নিজে থেকে uninstall হয়ে যায় আর error message দেয় “Sorry, আমি আর এই level-এর torture handle করতে পারছি না” 🎤💀`,
    `${name}, তোকে roast করতে গেলে আমার AI brain ও temporary shutdown নেয়, কারণ ethics module বলে “bro এটা মানুষ না, এটা walking war crime” 🤖⚠️`,
    `${name}, তোর life movie যদি বানানো হয় তাহলে tagline হবে “Rated R for Regret” আর audience warning থাকবে “watching this may cause permanent loss of hope” 🎬😭`,
    `${name}, তুই এমন যে তোর grandma তোকে দেখে বলে “আমি যদি জানতাম এই level-এর নাতি হবে তাহলে ১৯৬০-এই family planning করতাম” 👵💊`,
    `${name}, তোর face এত ভয়ংকর যে horror movie director তোকে দেখে বলে “ভাই তুই script-এর দরকার নাই, তুই নিজেই jump scare” 🎥👻`,
    `${name}, তোর জন্মের video যদি viral হয় তাহলে comment section-এ শুধু “abortion was an option” আর “nature really fumbled this one” টাইপের reply আসবে nonstop`,
    `${name}, তুই এমন যে তোর blood donate করতে গেলে blood bank বলে “sorry আমরা toxic waste accept করি না, please hospital-এর incinerator-এ ফেলে আয়” 🩸🔥`,
    `${name}, তোকে দেখলে মানুষের survival instinct auto-activate হয় আর brain বলে “fight? No. Flight? Yes. Better: teleport if possible” 🏃‍♂️💨`,
    `${name}, তোর aura এত negative যে solar panel তোর কাছে গেলে reverse charge করে আর বলে “nah bro, আমি darkness থেকে energy নিতে পারি না” ☀️➖`,
    `${name}, তুই এমন যে তোর mom pregnancy test positive হওয়ার পর Google search করেছিল “late term options in 2020s” আর doctor-কে ফোন করে confirm করেছিল 😭`,
    `${name}, তোর personality এত dark যে black hole তোকে দেখে বলে “ভাই তুই আমার থেকেও vacuum of joy” আর event horizon পার করে পালাতে চায় 🌑🏃`,
    `${name}, তোকে roast করার পর আমার karma meter auto +1000 পায়, কারণ universe বলে “thank you for cleaning this garbage from earth” ♻️😈`,
    `${name}, তুই এমন যে তোর clone বানালে clone নিজে থেকে suicide note লিখে ফেলবে “I can’t live knowing I look like this” আর আয়নার সামনে দাঁড়াবে না 🪞💀`,
    `${name}, তোর life এত trash যে landfill manager তোকে দেখে বলে “sorry bro, আমাদের capacity limit আছে, তুই অনেক বেশি” আর gate বন্ধ করে দেয় 🗑️🚪`
  ];

  const roast = soulCrusherRoasts[Math.floor(Math.random() * soulCrusherRoasts.length)];

  return api.sendMessage(
    `✦ 𝙏𝙊𝙍𝙐 𝘾𝙃𝘼𝙉 ✦\n\n${roast}\n\n`,
    event.threadID,
    event.messageID
  );
}
