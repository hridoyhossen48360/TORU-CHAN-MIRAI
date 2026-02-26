module.exports.config = {
    name: "boyanime",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Hridoy",
    description: "random dp",
    commandCategory: "Image",
    usages: "send message",
    cooldowns: 5
};

module.exports.onStart = async function({ api, event }) {
    const fs = require("fs-extra");
    const request = require("request");

    const links = [
        "https://i.imgur.com/x6Cc9n6.jpg",
        "https://i.imgur.com/Jmb7V7h.jpg",
        "https://i.imgur.com/5trZsRg.jpg",
        "https://i.imgur.com/IzwQVwj.jpg",
        "https://i.imgur.com/8AOyfUj.jpg",
        "https://i.imgur.com/hJGZwyj.jpg",
        "https://i.imgur.com/QU1MKQd.jpg",
        "https://i.imgur.com/0frgNtL.jpg",
        "https://i.imgur.com/6v29Hz8.jpg",
        "https://i.imgur.com/RFwkQMI.jpg",
        "https://i.imgur.com/5QnAGFH.jpg",
        "https://i.imgur.com/G7SGPWI.jpg",
        "https://i.imgur.com/NuEQzfl.jpg",
        "https://i.imgur.com/zw53mfy.jpg",
        "https://i.imgur.com/GjG1tBz.jpg",
        "https://i.imgur.com/Mu8Y0vR.jpg",
        "https://i.imgur.com/VxEFxz6.jpg",
        "https://i.imgur.com/s8lysbe.jpg",
        "https://i.imgur.com/UqDJlIu.png",
        "https://i.imgur.com/PxiKaff.jpg",
        "https://i.imgur.com/SpW8Eq0.jpg",
        "https://i.imgur.com/vQ104Wa.jpg",
        "https://i.imgur.com/S1vyler.jpg",
        "https://i.imgur.com/UvHNwPB.jpg",
        "https://i.imgur.com/DKUxCGa.jpg"
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
