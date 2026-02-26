module.exports.config = {
    name: "blanime",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Hridoy",
    description: "anime profile",
    commandCategory: "Image",
    usages: "send message",
    cooldowns: 5
};

module.exports.onStart = async function({ api, event, args, Users, Threads }) {
    const fs = require("fs-extra");
    const request = require("request");

    const links = [
      "https://i.postimg.cc/QdzSzcM1/image.jpg",
      "https://i.postimg.cc/QCSJJTPB/ros.jpg",
      "https://i.postimg.cc/3xkF2WZR/Cybergot-Cute-anime-pics-Dark-anime-Anime-monochrome.jpg",
      "https://i.postimg.cc/63XVscx2/Icon.jpg",
      "https://i.postimg.cc/D0YbzdHc/11.jpg",
      "https://i.postimg.cc/nLt9MLRN/12.jpg",
      "https://i.postimg.cc/2601H7kf/zod-ac.jpg",
      "https://i.postimg.cc/g0drmTrW/13.jpg",
      "https://i.postimg.cc/CKN51sff/Pin-on-icons.jpg",
      "https://i.postimg.cc/pr9LsNcD/14.jpg",
      "https://i.postimg.cc/VLCNM8Cw/anime-avatar.jpg",
      "https://i.postimg.cc/Z5my5RD2/15.jpg",
      "https://i.postimg.cc/XqFpVSKn/https-youtube-com-channel-UC3l3cgr-BNj-W5n7de68os-Fnw.jpg",
      "https://i.postimg.cc/dQd1ZFdY/Draincore-Icon-Aesthetic.jpg",
      "https://i.postimg.cc/zXFGpk02/B-L-A-C-K-P-I-N-K-balasultan-krulus-anime-gothic-edits-dp-profile-insta.jpg",
      "https://i.postimg.cc/MGvZ6Jxg/16.jpg",
      "https://i.postimg.cc/76zxz15V/Bbbb.jpg",
      "https://i.postimg.cc/Wp6VP1gh/image.jpg",
      "https://i.postimg.cc/pTfwxs9g/17.jpg",
      "https://i.postimg.cc/ZnjXv0xH/18.jpg",
      "https://i.postimg.cc/vZ4CDYg7/image.jpg",
      "https://i.postimg.cc/PfK74p1z/19.jpg",
      "https://i.postimg.cc/mrQXFtb9/Icon.jpg",
      "https://i.postimg.cc/9MbLJKwF/20.jpg",
      "https://i.postimg.cc/v8PP9Rd0/distorted.jpg"
    ];

    const randomImage = links[Math.floor(Math.random() * links.length)];
    const path = __dirname + "/cache/temp.jpg";

    request(randomImage).pipe(fs.createWriteStream(path)).on("close", () => {
        api.sendMessage(
            { body: "Anime profile for you\nTag: Anime Blur", attachment: fs.createReadStream(path) },
            event.threadID,
            () => fs.unlinkSync(path)
        );
    });
};
