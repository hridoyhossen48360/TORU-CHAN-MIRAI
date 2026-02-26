module.exports.config = {
	name: "ndfb",
	version: "1.0.0",
	hasPermssion: 1,
	credits: "ProCoderMew",
	description: "Filter Facebook users",
	commandCategory: "Utility",
	usages: "",
	cooldowns: 10
};

module.exports.run = async function({ api, event }) {
    var { userInfo, adminIDs } = await api.getThreadInfo(event.threadID);    
    var success = 0, fail = 0;
    var arr = [];

    for (const e of userInfo) {
        if (e.gender == undefined) {
            arr.push(e.id);
        }
    };

    adminIDs = adminIDs.map(e => e.id).some(e => e == global.data.botID);

    if (arr.length == 0) {
        return api.sendMessage(
            "There are no 'Facebook Users' in your group.",
            event.threadID
        );
    } else {
        api.sendMessage(
            "Your group currently has " + arr.length + " 'Facebook Users'.",
            event.threadID,
            function () {
                if (!adminIDs) {
                    api.sendMessage(
                        "But the bot is not an admin, so it cannot filter them.",
                        event.threadID
                    );
                } else {
                    api.sendMessage(
                        "Starting filter process...",
                        event.threadID,
                        async function() {
                            for (const e of arr) {
                                try {
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                    await api.removeUserFromGroup(parseInt(e), event.threadID);   
                                    success++;
                                } catch {
                                    fail++;
                                }
                            }

                            api.sendMessage(
                                "Successfully filtered " + success + " users.",
                                event.threadID,
                                function() {
                                    if (fail != 0) {
                                        return api.sendMessage(
                                            "Failed to filter " + fail + " users.",
                                            event.threadID
                                        );
                                    }
                                }
                            );
                        }
                    );
                }
            }
        );
    }
};