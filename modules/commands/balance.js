module.exports.config = {
name: "bal",
version: "1.0.2",
hasPermssion: 0,
credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
description: "Check the amount of yourself or the person tagged",
commandCategory: "Game",
usages: "[Tag]",
cooldowns: 5
};

module.exports.languages = {
"vi": {
"sotienbanthan": "Số tiền bạn đang có: %1$",
"sotiennguoikhac": "Số tiền của %1 hiện đang có là: %2$"
},
"en": {
"sotienbanthan":
"💰 𝗬𝗢𝗨𝗥 𝗕𝗔𝗟𝗔𝗡𝗖𝗘\n━━━━━━━━━━━━━━━\n💸 Available Money: %1$",

"sotiennguoikhac":  
		"👤 𝗨𝗦𝗘𝗥 𝗕𝗔𝗟𝗔𝗡𝗖𝗘\n━━━━━━━━━━━━━━━\n✨ %1\n💰 Current Balance: %2$"  
}

};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
const { threadID, messageID, senderID, mentions } = event;

if (!args[0]) {  
	const money = (await Currencies.getData(senderID)).money;  
	return api.sendMessage(  
		getText("sotienbanthan", money),  
		threadID,  
		messageID  
	);  
}  

else if (Object.keys(event.mentions).length == 1) {  
	var mention = Object.keys(mentions)[0];  
	var money = (await Currencies.getData(mention)).money;  
	if (!money) money = 0;  

	return api.sendMessage({  
		body: getText(  
			"sotiennguoikhac",  
			mentions[mention].replace(/\@/g, ""),  
			money  
		),  
		mentions: [{  
			tag: mentions[mention].replace(/\@/g, ""),  
			id: mention  
		}]  
	}, threadID, messageID);  
}  

else return global.utils.throwError(this.config.name, threadID, messageID);

};
