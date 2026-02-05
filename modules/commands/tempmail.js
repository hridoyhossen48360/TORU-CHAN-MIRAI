const axios = require("axios");
const x = "xyz";

module.exports.config = {
    name: "tempmail",
    version: "1.2.0",
    hasPermssion: 0,
    credits: "S M Fahim × Mirai Upgrade by Hridoy",
    description: "Temporary email generate ও inbox check করে",
    commandCategory: "Utility",
    usages: "tempmail gen | tempmail inbox <email>",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const action = args[0];

    api.setMessageReaction("⏳", messageID, () => {}, true);

    try {
        // Generate temp mail
        if (action === "gen") {
            const res = await axios.get(`https://smfahim.${x}/tempmail`);
            const email = res.data.email;

            if (!email) {
                throw new Error("Email not generated");
            }

            api.sendMessage(
                `📧 Temporary Email Generated\n\n✉️ ${email}\n\n⚠️ এই email টি অস্থায়ী`,
                threadID,
                () => api.setMessageReaction("✅", messageID, () => {}, true)
            );
        }

        // Inbox check
        else if (action === "inbox") {
            const email = args[1];

            if (!email) {
                api.setMessageReaction("❌", messageID, () => {}, true);
                return api.sendMessage(
                    "❌ দয়া করে একটি valid email দিন\n\n📌 উদাহরণ:\n• tempmail inbox test@mail.com",
                    threadID,
                    messageID
                );
            }

            const res = await axios.get(
                `https://smfahim.${x}/tempmail/inbox?email=${encodeURIComponent(email)}`
            );

            const messages = res.data;

            if (!messages || messages.length === 0) {
                api.setMessageReaction("⚠️", messageID, () => {}, true);
                return api.sendMessage(
                    "📭 এই email এর inbox খালি আছে",
                    threadID,
                    messageID
                );
            }

            const inbox = messages.map((msg, i) =>
                `📨 Message ${i + 1}\n📝 Subject: ${msg.subject}\n📄 Body:\n${msg.body_text}`
            ).join("\n\n━━━━━━━━━━━━━━\n\n");

            api.sendMessage(
                `📬 Inbox Messages\n\n${inbox}`,
                threadID,
                () => api.setMessageReaction("✅", messageID, () => {}, true)
            );
        }

        // Wrong usage
        else {
            api.setMessageReaction("❌", messageID, () => {}, true);
            api.sendMessage(
                "❌ ভুল command\n\n✔ সঠিক ব্যবহার:\n• tempmail gen\n• tempmail inbox <email>",
                threadID,
                messageID
            );
        }

    } catch (err) {
        console.error(err);
        api.setMessageReaction("❌", messageID, () => {}, true);
        api.sendMessage(
            "⚠️ সমস্যা হয়েছে! পরে আবার চেষ্টা করুন।",
            threadID,
            messageID
        );
    }
};
