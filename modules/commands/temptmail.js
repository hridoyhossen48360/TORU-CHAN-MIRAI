const x = "xyz";
const axios = require("axios");

module.exports = {
  config: {
    name: "tempmail",
    version: "1.1",
    author: "S M Fahim",
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "generate temporary emails and retrieve inbox messages",
      vi: "generate temporary emails and retrieve inbox messages",
    },
    longDescription: {
      en: "generate temporary emails and retrieve inbox messages",
      vi: "generate temporary emails and retrieve inbox messages",
    },
    category: "Utility",
    guide: {
      en: "{pn} gen\n{pn} inbox (email)",
      vi: "{pn} gen\n{pn} inbox (email)",
    },
  },

  onStart: async function ({ api, args, event }) {
    const command = args[0];

    try {
      if (command === "gen") {
        const tempMailResponse = await axios.get(`https://smfahim.${x}/tempmail`);
        const email = tempMailResponse.data.email;
        api.sendMessage(email, event.threadID, event.messageID);
      } else if (command === "inbox") {
        const email = args[1];

        if (!email) {
          return api.sendMessage("Please provide a valid email address.", event.threadID, event.messageID);
        }

        const messageResponse = await axios.get(`https://smfahim.${x}/tempmail/inbox?email=${email}`);
        const messages = messageResponse.data;

        if (!messages || messages.length === 0) {
          return api.sendMessage("No messages found for this email.", event.threadID, event.messageID);
        }

        const formattedMessages = messages.map((msg) => {
          return `Title: ${msg.subject}\n\nBody: ${msg.body_text}`;
        }).join("\n\n-------------------------\n\n");

        api.sendMessage(`Inbox Messages:\n\n${formattedMessages}`, event.threadID, event.messageID);
      } else {
        api.sendMessage("Invalid command. Please use 'gen' to generate email or 'inbox' to retrieve messages.", event.threadID, event.messageID);
      }
    } catch (error) {
      console.error("Error:", error);
      api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
    }
  }
};
