const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports.config = {
  name: "waifu",
  version: "1.0.3",
  hasPermssion: 0,
  credits: "HRIDOY",
  description: "Random Waifu image (no tag needed)",
  commandCategory: "Image",
  usages: "",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  try {
    const apiUrl = 'https://api.waifu.im/search';

    const res = await fetch(apiUrl);
    const data = await res.json();

    if (!data.images || data.images.length === 0) {
      return api.sendMessage("❌ Waifu পাওয়া যায়নি", event.threadID);
    }

    // Random pick
    const imageData = data.images[Math.floor(Math.random() * data.images.length)];
    const imageUrl = imageData.url;

    let caption = "✨ Your Waifu ✨";
    if (imageData.artist) caption += `\n🎨 Artist: ${imageData.artist}`;

    return api.sendMessage(
      {
        body: caption,
        attachment: await global.utils.getStreamFromURL(imageUrl)
      },
      event.threadID
    );

  } catch (err) {
    console.log(err);
    return api.sendMessage("⚠️ Waifu load করা যায়নি", event.threadID);
  }
};
