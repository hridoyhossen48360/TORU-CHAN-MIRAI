module.exports.config = {
 name: "follow",
 version: "1.0.0",
 hasPermssion: 2, // admin only, চাইলে 0 কর
 credits: "rX Abdullah",
 description: "Follow a Facebook user by UID",
 commandCategory: "Utility",
 usages: "!follow <uid>",
 cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
 try {
 if (!args[0]) {
 return api.sendMessage(
 "❌ UID dao\nUsage: !follow <uid>",
 event.threadID,
 event.messageID
 );
 }

 const uid = args[0];

 api.follow(uid, true, (err, res) => {
 if (err) {
 return api.sendMessage(
 "❌ Follow korte parlam na!\n" + err.error || err,
 event.threadID,
 event.messageID
 );
 }

 api.sendMessage(
 `✅ Successfully followed user\n🆔 UID: ${uid}`,
 event.threadID,
 event.messageID
 );
 });

 } catch (e) {
 api.sendMessage(
 "⚠️ Error: " + e.message,
 event.threadID,
 event.messageID
 );
 }
};