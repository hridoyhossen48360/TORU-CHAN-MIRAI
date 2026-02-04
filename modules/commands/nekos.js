const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports.config = {
  name: "nekos",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "nekosapi + Sabah",
  description: "Random image from NekosAPI",
  commandCategory: "Image",
  usages: "",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  try {
    const apiUrl = "https://api.nekosapi.com/v4/images/random";

    const res = await fetch(apiUrl);
    const data = await res.json();

    // API response check
    if (!data.url) {
      return api.sendMessage("❌ Image পাওয়া যায়নি API থেকে", event.threadID);
    }

    const imageUrl = data.url;

    return api.sendMessage(
      {
        body: "", // কোনো caption নাই
        attachment: await global.utils.getStreamFromURL(imageUrl)
      },
      event.threadID
    );

  } catch (err) {
    console.log(err);
    return api.sendMessage("⚠️ Image load করা যায়নি", event.threadID);
  }
};
