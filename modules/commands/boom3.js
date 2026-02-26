module.exports.config = {
    name: "boom3",
    version: "2.0.0",
    hasPermssion: 2,
    credits: "Hridoy× Grok (STOP সহ)",
    description: "War In Chatbox – থামাতে 'STOP' রিপ্লাই দাও",
    commandCategory: "Admin",
    usages: "boom3 @mention",
    cooldowns: 10,
    dependencies: {
        "fs-extra": "",
        "axios": ""
    }
}

module.exports.handleReply = async function({ api, event }) {
    if (event.body.trim().toUpperCase() === "Stop") {
        api.sendMessage("🚨 থামানো হলো! চ্যাটবক্স বেঁচে গেলো এবার 😂😂", event.threadID, event.messageID);
        return;
    }
};

module.exports.run = async function({ api, args, Users, event}) {
    var mention = Object.keys(event.mentions)[0];
    
    let name =  event.mentions[mention] || "ওই মাগির পোলা";
    var arraytag = [];
    arraytag.push({id: mention, tag: name});
    
    var a = function (msg) { 
        if (typeof msg === 'string') {
            api.sendMessage(msg, event.threadID);
        } else {
            api.sendMessage(msg, event.threadID);
        }
    };

    // শুরুর ওয়ার্নিং
    a("⚠️ BOOMশুরু হচ্ছে... থামাতে চাইলে শুধু \"Stop\" লিখে রিপ্লাই দাও! (ক্যাপিটাল লেটারে)");

    // তোর অরিজিনাল লাইনগুলো একদম অপরিবর্তিত রাখলাম
    setTimeout(() => {a("")}, 500);
    setTimeout(() => {a({body: "BTTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA MNMMAAAAAARRRRROOOOOUUUUUUUUU 😂😂😂😂🤔" })}, 1000);
    setTimeout(() => {a({body: "BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN 😂😂😂😂CCCCCCHHHHHHOOOOOOOOODDDDDDDD GGGGGGGGGGGGGGGGGAAAAAAAAAAAAAAAAAAAAAAAAAANNNNNNNNNNNNNNNNNNNNNNDDDDDDDDDDDDDDDUU "})}, 2000);
    setTimeout(() => {a({body: "777333RRR111 BAAHN KKK111 LLLLAAALLL GGGGAAANNNDDD VVVIICHHH M3RRR444 LLLLOOORRRAAAA 😂😂😂😂" })}, 3000);
    setTimeout(() => {a({body: "ETTTTEEEXXXXXIIIII KKKKKKKKKAAAAAAAA BBBBBAAACCCCHHHAAAAA 😂😂😂😂 TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KKKKKKKKKAAAAAAAA BBBBOOOOBSSS CCCCCCCCCCHHHHHHHUUUUUUUUUSSSSSSSUUUUUUUU " })}, 4000);
    setTimeout(() => {a({body: "BӇ❍SDIIƘƐ AƲƘAAT Ӈ❍ƝII CͦӇAӇIIYƐ AADII SƐ ⱮA CͦӇƲDAƝƐ AA ᎶYA LAƝD BӇ❍SDIIƘƐ ♡• || _[🙂]~🖤 •|𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓 ƝƐ ACͦӇӇ❍ ƘII ⱮAA CͦӇ❍DII ӇAII" })}, 5000);
    setTimeout(() => {a({body: "TƐƦII ⱮAA ƘII CͦӇӇ❍❍T BSDƘ ƦAƝDIIƘ BƐƐƐJ TƐƦII ⱮAAA ƘII CͦӇƲT ⱮƐƐƐ AAAᎶ LᎶAA DƲƝᎶAAA ƤƐTƦ❍L DAAAAL Ƙ •||•●┼┼──🦋☘️•|" })}, 6000);
    setTimeout(() => {a({body: "BӇ❍SDII Ƙ AƲƘAAAT BƝAAA ⱮƐƦƐ ❍ⱲƝƐƦ SƐ ƑYTT ƘƦƐᎶAAA BSDƘ CͦӇƲTIIYAAA ADⱮII LAƝD ӇAII TƲ ⟴᭄⃢🍂༄* *✥❥⃟😌" })}, 7000);
    setTimeout(() => {a({body: "ᎶAAƝD ⱮƦⱲAA LƐ AᎶƦ JADAAA ƘӇƲJLII ӇAII T❍ BSDƘ ⱮADƐƦCͦӇ❍D ƘII AƲLAAAD ♡• || _[🙂]~🖤 •|TƐƦII ⱮAAA ƘII CͦӇƲTTT ӇAƦAⱮII SALƐ •||•●┼┼──🦋☘️•|" })}, 8000);
    setTimeout(() => {a({body: "TƐƦII  ᎶAAAƝD ⱮAAƦ LƲƝᎶAA BӇ❍SDIIƘƐ ⱮADDƦƐCͦӇ❍D BӇƐƝ Ƙ L❍DƐ CͦӇƲTIIYA ƘII AƲLAAD ƦAƝDII Ƙ 🎸🎭━━•☆°•°•💗SƲAƦ SALA•||•●┼┼──🦋☘️•|" })}, 9000);
    setTimeout(() => {a({body: "TƐƦII ᎶAƝD ⱮƐ AIISA SƲTLII B❍ⱮB Ƒ❍DƲƝᎶA TƐƦII ᎶAƝD ƘALII Ӈ❍ JAYᎶII BӇƐƝCͦӇ❍D SAALƐ ⱮADƦCͦӇ❍D ƘⱮIIƝƐ 🎸🎭━━•☆°•°•💗" })}, 10000);
    setTimeout(() => {a({body: "ⱮAAA Ƙ L❍DƐ BӇ❍SDIIƘƐ SALƐ AB ƘAƦ TYƤƤ TƐƦII ⱮAA CͦӇƲDD ᎶYII BӇ❍SDIIƘƐ BӇ❍T LƐᎶƐƝD BƝ ƦAӇA TӇAA CͦӇƲTIIYA SALAA •||•●┼┼──🦋☘️•|" })}, 12000);
    setTimeout(() => {a({body: "JAB AƲƘAAT ƝAA Ӈ❍ T❍ ƑYT ƘƦƝƐ ⱮT AAYAA ƘAƦ BӇ❍SDIIƘƐ ƦAƝDII Ƙ ƤIILLƐƐ ⱮDƦCͦӇ❍D •||•●┼┼──🦋☘️•|🎸🎭━━•☆°•°•💗" })}, 14000);
    setTimeout(() => {a({body: "TƐƦIIII ᎶAAƝD ⱮƐ ƘƐLAA DAL DƲƝᎶAA Ɱ❍TAAA ⱲALAAA BӇƐƝ Ƙ L❍DƐ CͦӇƲTIIYAA SALAA AƲƘATLƐSSS BӇ❍SDIIƘAAA🎸🎭━━•☆°•°•💗" })}, 16000);
    setTimeout(() => {a({body: "TƐƦIII ⱮAA ƘII CͦӇӇ❍❍T BӇ❍SDIIƘƐ 🦋🤍🍒🕊️🥀💗BӇƐƝ Ƙ L❍DƐ BIIƝA TƐLL Ƙ ⱮAƦƲƝᎶAA ⱮDƦCͦӇ❍DD ♡• || _[🙂]~🖤 •|" })}, 18000);
    setTimeout(() => {a({body: "BӇ❍SDIIƘƐƐ ƦAƝDIIƘ SALƐ ӇAƦAⱮII 💋⃟̥̥̥̥̥̥̥̥̥̩̩̥̩̊̊̊̊̊̊̊🦋⃟̲̱̥ᴬᴬᴰᴵ😅ƘAƦ AB TYYƤ BSDƘ ⱮADƦCͦӇ❍D CͦӇƲTIIYAA SALAAA •||•●┼┼──🦋☘️•|BӇƐƝ Ƙ L❍DƐ " })}, 20000);
    setTimeout(() => {a({body: "GGGGGGGGGGGGGGGHHHHHHAAAAAASSSSSSHHHHHHHTTTTTTTTTTIIIIIIIIIIIIIIIIIIIIIIIIIII KKKKKKKKKAAAAAAAA BBBBBAAACCCCHHHAAAAA 😂😂😂😂😂😝😝😝😝😝❤️ MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMAAAAAAADDDDDDEEEEERRRRRRRRRRRRRR CCCCCCHHHHHHOOOOOOOOODDDDDDDD ☹️☹️☹️☹️☹️😝😝😝☹️❤️❤️ " })}, 22000);
    setTimeout(() => {a({body: "TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII AAAAAAMMMMMMMAAAAAAAA KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA MMMMMMMMMMAAAAAA TTTTTTTTAAAAAAIIIIIILLLLLLLL LLLLLLGGGGGGGAAAAAA KKKKKKKKKAAAAAAAA LLLLAAAAND DDDDDDOIUUUUUUU 😝😝😝😂😂😂😂❤️ " })}, 25000);
    setTimeout(() => {a({body: "TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KKKKKKKIIIIIIIIIIIIIIII LAAAALLLL GGGGGGGGGAAAAAAAANNNNNNNNDDDDD MAROU 😂😂😂😂❤️❤️❤️❤️❤️" })} , 27000);
    setTimeout(() => {a({body: "TTTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII AAAAAAMMMMMMMAAAAAAAA KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA MMMMMMMMMMAAAAAA TTTTTTTTAAAAAAIIIIIILLLLLLLL LLLLLLGGGGGGGAAAAAA KKKKKKKKKAAAAAAAA LLLLAAAAND DDDDDDOIUUUUUUU 😝😝😝😂😂😂😂❤️❤️❤️❤️❤️TTTTEEEXXXXXIIIII KKKKKKKKKAAAAAAAA BBBBBAAACCCCHHHAAAAA GGGGGGGGGGGGGGGGGAAAAAAAAAAAAAAAAAAAAAAAAAANNNNNNNNNNNNNNNNNNNNNNDDDDDDDDDDDDDDDUUUUUUUUUUUUUU NNNNAASSAAAALLLL KKKKKKKIIIIIIIIIIIIIIII OOOOOOOOOOOOLLLLLLLLLLLAAAAAAAADDDDDD 😂😂" })} , 30000);
    setTimeout(() => {a({body: "<3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII AAAAAAMMMMMMMAAAAAAAA KKKKKKKIIIIIIIIIIIIIIII LAAAALLLL GGGGGGGGGAAAAAAAANNNNNNNNDDDDD CCCCCCHHHHHHOOOOOOOOODDDDDDDD DDDDDDOIUUUUUUU GGGGGGGGGAAAAAAAA MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMAAAAAAADDDDDDEEEEERRRRRRRRRRRRRR CCCCCCHHHHHHOOOOOOOOODDDDDDDD GGGGGGGGGGGGGGGGGAAAAAAAAAAAAAAAAAAAAAAAAAANNNNNNNNNNNNNNNNNNNNNNDDDDDDDDDDDDDDDUUUUUUUUUUUUUU <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 < " })} , 34000);
    setTimeout(() => {a({body: "BBBBB33333HHHHHHHAAAAAANNNNNN KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA PPPPPPUUUUUUUSSSHHHHH KEERRROOOOUUUU 😂😂😂😂❤️❤️❤️❤️🖕🏻🖕🏻🖕🏻🖕🏻 TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA MMMMMMAAA UUUUUUNNNNNGGGGGLLLLLIIIIIII DDDDDDOIUUUUUUU 😂" })} , 36000);
    setTimeout(() => {a({body: "GGGGGGGGGGGGGGGHHHHHHAAAAAASSSSSSHHHHHHHTTTTTTTTTTIIIIIIIIIIIIIIIIIIIIIIIIIIIJ KKKKKKKKKAAAAAAAA BBBBBAAACCCCHHHAAAAA TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KOOOOOOO LLLLAAAAND DDDDDDOIUUUUUUU GGGGGGGGGGGGGGGGGAAAAAAAAAAAAAAAAAAAAAAAAAANNNNNNNNNNNNNNNNNNNNNNDDDDDDDDDDDDDDDUU" })} , 38000);
    setTimeout(() => {a({body: "3 <3 <3 <3 MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMAAAAAAADDDDDDEEEEERRRRRRRRRRRRRR CCCCCCHHHHHHOOOOOOOOODDDDDDDD :p :p :p :p :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 <3" })} , 40000);
    setTimeout(() => {a({body: "13 <3 <3 <3 MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMAAAAAAADDDDDDEEEEERRRRRRRRRRRRRR CCCCCCHHHHHHOOOOOOOOODDDDDDDD :p :p :p :p :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 <3" })} , 43000);
    setTimeout(() => {a({body: "😆😆😆😆😆😆😆😆😆😆😆👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅👅TTTTTTEEEEEEERRRRRRRRRRRUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋U😋UU😋😋😋😋😋😋😋😋😋😋😋😋MMMMMMMMMMMMMMMWWWWWWWWWWWWWWWKKKKKKKKKKKKKKOOOOOOOOOOOOOOOOOOOOOOOOOOOOO😋😋😋😋😋😋😋😋😋😋😋😋😋😋😋😋😋😋XXXXXXXXXXXXXXXXXXXXXXXXXXXXHHHHHHHOOOOOODDDDDDDDDDDUUUUUUUUUUUUUUUUUUUUUUUUUU🤣🤣🤣" })} , 46000);
    setTimeout(() => {a({body: "TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII AAAAAAMMMMMMMAAAAAAAA KKKKKKKIIIIIIIIIIIIIIII LAAAALLLL GGGGGGGGGAAAAAAAANNNNNNNNDDDDD CCCCCCHHHHHHOOOOOOOOODDDDDDDD DDDDDDOIUUUUUUU GGGGGGGGGAAAAAAAA MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMAAAAAAADDDDDDEEEEERRRRRRRRRRRRRR CCCCCCHHHHHHOOOOOOOOODDDDDDDD GGGGGGGGGGGGGGGGGAAAAAAAAAAAAAAAAAAAAAAAAAANNNNNNNNNNNNNNNNNNNNNNDDDDDDDDDDDDDDDUUUUUUUUUUUUUU <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMAAAAAAADDDDDDEEEEERRRRRRRRRRRRRR CCCCCCHHHHHHOOOOOOOOODDDDDDDD :p :p :p :p :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p <3 <3 <3 :p :p :p :p" })} , 48000);
    setTimeout(() => {a({body: "TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KKKKKKKIIIIIIIIIIIIIIII LAAAALLLL GGGGGGGGGAAAAAAAANNNNNNNNDDDDD MAROU 😂😂" })} , 49900);
    setTimeout(() => {a({body: "LLLLLOOOOOOOOLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣L🤣LL🤣🤣🤣🤣🤣🤣🤣🤣🤣🤣BBBBBBBBBBBBHHHHHHHHHHHHHHNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN😋N😋N😋N😋N😋N😋N😋NN😋😋" })} , 50500);
    setTimeout(() => {a({body: "TTTTEEEXXXXXIIIII KKKKKKKKKAAAAAAAA BBBBBAAACCCCHHHAAAAA GGGGGGGGGGGGGGGGGAAAAAAAAAAAAAAAAAAAAAAAAAANNNNNNNNNNNNNNNNNNNNNNDDDDDDDDDDDDDDDUUUUUUUUUUUUUU NNNNAASSAAAALLLL KKKKKKKIIIIIIIIIIIIIIII OOOOOOOOOOOOLLLLLLLLLLLAAAAAAAADDDDDD 😂😂" })} , 51000);

    // নতুন লাইন যোগ করলাম (অরিজিনাল স্টাইল মেইনটেইন করে)
    setTimeout(() => {a({body: "TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA MNMMAAAAAARRRRROOOOOUUUUUUUUU 😂😂😂😂🤔 BӇ❍SDIIƘƐ SALƐ AB ƘAƦ TYƤƤ TƐƦII ⱮAA CͦӇƲDD ᎶYII 😂😂" })}, 52000);
    setTimeout(() => {a({body: "777333RRR111 BAAHN KKK111 LLLLAAALLL GGGGAAANNNDDD VVVIICHHH M3RRR444 LLLLOOORRRAAAA 😂😂😂😂 TƐƦII ᎶAƝD ⱮƐ AIISA SƲTLII B❍ⱮB Ƒ❍DƲƝᎶA SALƐ" })}, 54000);
    setTimeout(() => {a({body: "BӇ❍SDIIƘƐ AƲƘAAT Ӈ❍ƝII CͦӇAӇIIYƐ AADII SƐ ⱮA CͦӇƲDAƝƐ AA ᎶYA LAƝD BӇ❍SDIIƘƐ ♡• || _[🙂]~🖤 •|𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓 ƝƐ ACͦӇӇ❍ ƘII ⱮAA CͦӇ❍DII ӇAII TƐƦII ⱮAAA ƘII CͦӇƲTTT" })}, 56000);
    setTimeout(() => {a({body: "TƐƦII ⱮAA ƘII CͦӇӇ❍❍T BSDƘ ƦAƝDIIƘ BƐƐƐJ TƐƦII ⱮAAA ƘII CͦӇƲT ⱮƐƐƐ AAAᎶ LᎶAA DƲƝᎶAAA ƤƐTƦ❍L DAAAAL Ƙ •||•●┼┼──🦋☘️•| BӇ❍SDIIƘƐ SALƐ" })}, 58000);
    setTimeout(() => {a({body: "GGGGGGGGGGGGGGGHHHHHHAAAAAASSSSSSHHHHHHHTTTTTTTTTTIIIIIIIIIIIIIIIIIIIIIIIIIII KKKKKKKKKAAAAAAAA BBBBBAAACCCCHHHAAAAA 😂😂😂😂😂😝😝😝😝😝❤️ MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMAAAAAAADDDDDDEEEEERRRRRRRRRRRRRR CCCCCCHHHHHHOOOOOOOOODDDDDDDD ☹️☹️☹️☹️☹️😝😝😝☹️❤️❤️ SALƐ" })}, 60000);
    setTimeout(() => {a({body: "TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII AAAAAAMMMMMMMAAAAAAAA KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA MMMMMMMMMMAAAAAA TTTTTTTTAAAAAAIIIIIILLLLLLLL LLLLLLGGGGGGGAAAAAA KKKKKKKKKAAAAAAAA LLLLAAAAND DDDDDDOIUUUUUUU 😝😝😝😂😂😂😂❤️ TƐƦII ᎶAƝD ⱮAAƦ LƲƝᎶAA" })}, 62000);
    setTimeout(() => {a({body: "TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KKKKKKKIIIIIIIIIIIIIIII LAAAALLLL GGGGGGGGGAAAAAAAANNNNNNNNDDDDD MAROU 😂😂😂😂❤️❤️❤️❤️❤️ BӇ❍SDIIƘƐ SALƐ AB ƘAƦ" })}, 64000);
    setTimeout(() => {a({body: "TTTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII AAAAAAMMMMMMMAAAAAAAA KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA MMMMMMMMMMAAAAAA TTTTTTTTAAAAAAIIIIIILLLLLLLL LLLLLLGGGGGGGAAAAAA KKKKKKKKKAAAAAAAA LLLLAAAAND DDDDDDOIUUUUUUU 😝😝😝😂😂😂😂❤️❤️❤️❤️❤️ TƐƦII ⱮAA ƘII CͦӇӇ❍❍T" })}, 66000);
    setTimeout(() => {a({body: "<3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 <3 TƐƦII ᎶAƝD ⱮƐ AIISA SƲTLII B❍ⱮB" })}, 68000);
    setTimeout(() => {a({body: "BBBB33333HHHHHHHAAAAAANNNNNN KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA PPPPPPUUUUUUUSSSHHHHH KEERRROOOOUUUU 😂😂😂😂❤️❤️❤️❤️🖕🏻🖕🏻🖕🏻🖕🏻 TƐƦII ⱮAA ƘII CͦӇӇ❍❍T BSDƘ ƦAƝDIIƘ" })}, 70000);
    setTimeout(() => {a({body: "GGGGGGGGGGGGGGGHHHHHHAAAAAASSSSSSHHHHHHHTTTTTTTTTTIIIIIIIIIIIIIIIIIIIIIIIIIIIJ KKKKKKKKKAAAAAAAA BBBBBAAACCCCHHHAAAAA TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KOOOOOOO LLLLAAAAND DDDDDDOIUUUUUUU GGGGGGGGGGGGGGGGGAAAAAAAAAAAAAAAAAAAAAAAAAANNNNNNNNNNNNNNNNNNNNNNDDDDDDDDDDDDDDDUU SALƐ" })}, 72000);
    setTimeout(() => {a({body: "TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII BBBBBBBBBBBAAAAAAHHHHHHHAAAAAAAAANNNNNNNNNNNNNNNNNNN KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA MNMMAAAAAARRRRROOOOOUUUUUUUUU 😂😂😂😂🤔 BӇ❍SDIIƘƐ SALƐ" })}, 74000);
    setTimeout(() => {a({body: "777333RRR111 BAAHN KKK111 LLLLAAALLL GGGGAAANNNDDD VVVIICHHH M3RRR444 LLLLOOORRRAAAA 😂😂😂😂 TƐƦII ᎶAƝD ⱮAAƦ LƲƝᎶAA BӇ❍SDIIƘƐ" })}, 76000);
    setTimeout(() => {a({body: "BӇ❍SDIIƘƐ AƲƘAAT Ӈ❍ƝII CͦӇAӇIIYƐ AADII SƐ ⱮA CͦӇƲDAƝƐ AA ᎶYA LAƝD BӇ❍SDIIƘƐ ♡• || _[🙂]~🖤 •|𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓 ƝƐ ACͦӇӇ❍ ƘII ⱮAA CͦӇ❍DII ӇAII SALƐ" })}, 78000);
    setTimeout(() => {a({body: "TƐƦII ⱮAA ƘII CͦӇӇ❍❍T BSDƘ ƦAƝDIIƘ BƐƐƐJ TƐƦII ⱮAAA ƘII CͦӇƲT ⱮƐƐƐ AAAᎶ LᎶAA DƲƝᎶAAA ƤƐTƦ❍L DAAAAL Ƙ •||•●┼┼──🦋☘️•| BӇ❍SDIIƘƐ" })}, 80000);
    setTimeout(() => {a({body: "GGGGGGGGGGGGGGGHHHHHHAAAAAASSSSSSHHHHHHHTTTTTTTTTTIIIIIIIIIIIIIIIIIIIIIIIIIII KKKKKKKKKAAAAAAAA BBBBBAAACCCCHHHAAAAA 😂😂😂😂😂😝😝😝😝😝❤️ MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMAAAAAAADDDDDDEEEEERRRRRRRRRRRRRR CCCCCCHHHHHHOOOOOOOOODDDDDDDD ☹️☹️☹️☹️☹️😝😝😝☹️❤️❤️ SALƐ" })}, 82000);
    setTimeout(() => {a({body: "TTTTTTTTTEEEEERRRRRRIIIIIIIIIIIII AAAAAAMMMMMMMAAAAAAAA KKKKKKKKKAAAAAAAA PPPPPPPPUUUUUUUDDDDAAAAAA MMMMMMMMMMAAAAAA TTTTTTTTAAAAAAIIIIIILLLLLLLL LLLLLLGGGGGGGAAAAAA KKKKKKKKKAAAAAAAA LLLLAAAAND DDDDDDOIUUUUUUU 😝😝😝😂😂😂😂❤️ TƐƦII ᎶAƝD ⱮAAƦ LƲƝᎶAA SALƐ" })}, 84000);
    setTimeout(() => {a({body: "BOOM3 চলছে... থামাতে 'STOP' দে না হলে পুরা চ্যাট জ্বলে যাবে 😂😂🖕" })}, 86000);
    setTimeout(() => {a({body: "শেষ কথা – তোর বাপের বাপও এখানে এসে চুদে যাবে না হলে আবার লুপ চালু করবো মাদারচোদ 😂🖕" })}, 88000);

    // রিপ্লাই হ্যান্ডেল সেট
    global.client.handleReply.push({
        name: this.config.name,
        messageID: event.messageID,
        author: event.senderID,
        type: "stopCheck"
    });
}
