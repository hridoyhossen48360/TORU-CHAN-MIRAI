const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports.config = {
  name: "waifu",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "waifu.im + Sabah",
  description: "Random Waifu image",
  commandCategory: "Image",
  usages: "",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  try {
    const apiUrl = 'https://api.waifu.im/search';
    const params = {
      included_tags: ['raiden-shogun', 'maid'],
      height: '>=2000'
    };

    const queryParams = new URLSearchParams();
    for (const key in params) {
      if (Array.isArray(params[key])) {
        params[key].forEach(v => queryParams.append(key, v));
      } else {
        queryParams.set(key, params[key]);
      }
    }

    const requestUrl = `${apiUrl}?${queryParams.toString()}`;

    const res = await fetch(requestUrl);
    const data = await res.json();

    if (!data.images || data.images.length === 0) {
      return api.sendMessage("❌ Waifu পাওয়া যায়নি", event.threadID);
    }

    const imageUrl = data.images[0].url;

    return api.sendMessage(
      {
        body: "✨ Random Waifu ✨",
        attachment: await global.utils.getStreamFromURL(imageUrl)
      },
      event.threadID
    );

  } catch (err) {
    console.log(err);
    return api.sendMessage("⚠️ Error: Waifu load করা যায়নি", event.threadID);
  }
};
