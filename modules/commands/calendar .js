module.exports.config = {
  name: "calendar",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Hridoy + GPT",
  description: "Bangladesh Timezone Calendar",
  commandCategory: "Utility",
  usages: "",
  cooldowns: 3
};

module.exports.run = ({ api, event }) => {
  // Bangladesh timezone (+6)
  const now = new Date(Date.now() + 6 * 60 * 60 * 1000);

  const days = [
    "Sunday", "Monday", "Tuesday",
    "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayName = days[now.getUTCDay()];
  const monthName = months[now.getUTCMonth()];
  const date = now.getUTCDate();
  const year = now.getUTCFullYear();

  let hour = now.getUTCHours();
  const minute = now.getUTCMinutes().toString().padStart(2, "0");
  const second = now.getUTCSeconds().toString().padStart(2, "0");

  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;

  const msg =
`📅 𝗖𝗔𝗟𝗘𝗡𝗗𝗔𝗥 (BD Time 🇧🇩)

🗓 Date : ${date} ${monthName} ${year}
📆 Day  : ${dayName}

⏰ Time (12h) : ${hour12}:${minute}:${second} ${ampm}
⏱ Time (24h) : ${hour}:${minute}:${second}

🌍 Timezone : GMT +6 (Bangladesh)`;

  api.sendMessage(msg, event.threadID);
};
