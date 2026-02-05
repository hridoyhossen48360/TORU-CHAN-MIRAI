module.exports.config = {
	name: "count", // Command name
	version: "1.0.0", // Module version
	hasPermssion: 0, // Permission: 0 = all members, 1 = admin+, 2 = owner/admin
	credits: "Raiden Ei", // Module author
	description:"Count everything in the chat box", // Command description
	commandCategory: "Group", // Category
	usages: "count message/admin/member/male/female/gei/allgroup/alluser", // Usage
	cooldowns: 5,  
	envConfig: {
		// Environment setup (APIKEY, etc.)
	}
};

module.exports.run = async function({ api,Threads,Users, event, args, client, __GLOBAL }) {
	var input = args.join();
    var maleMembers = [];
    var femaleMembers = [];
    var otherGender = [];
    
	let threadInfo = await api.getThreadInfo(event.threadID);
    for (let z in threadInfo.userInfo) {
     	var gender = threadInfo.userInfo[z].gender;
        if(gender == "MALE") maleMembers.push(gender);
        else if (gender=="FEMALE") femaleMembers.push(gender);
        else otherGender.push(gender);
    }

	var out = (msg) => api.sendMessage(msg, event.threadID, event.messageID);
	var allThreads = await Threads.getAll(['threadID']);
	var allUsers = await Users.getAll(['userID']);

	if (input=="") out(`You did not provide a tag. Use one of: message/admin/member/male/female/gei/allgroup/alluser`);
	if (input=="message") out(`This group has ${threadInfo.messageCount} messages`);
	if (input=="admin") out(`This group has ${threadInfo.adminIDs.length} admins`);
	if (input=="member") out(`This group has ${threadInfo.participantIDs.length} members`);
	if (input=="male") out(`This group has ${maleMembers.length} male members`);
	if (input=="female") out(`This group has ${femaleMembers.length} female members`);
	if (input=="gei") out(`This group has ${otherGender.length} members with other gender`);
	if (input=="allgroup") out(`There are ${allThreads.length} groups using the bot`);
	if (input=="alluser") out(`There are ${allUsers.length} users using the bot`);
}
