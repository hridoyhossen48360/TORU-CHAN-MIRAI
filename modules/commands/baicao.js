module.exports.config = {
	name: "baicao",
	version: "2.6.1",
	hasPermssion: 0,
	credits: "Mirai Team and lzhoang2601 (Edited English)",
	description: "Multiplayer Bai Cao betting game",
	commandCategory: "Game",
	usages: "[create/join/start/info/leave] => deal / change / ready",
	cooldowns: 1
};

module.exports.handleEvent = async ({ event, api, Users, Currencies }) => {
	const { senderID, threadID, body, messageID } = event;

	if (!body) return;
	if (!global.moduleData.baicao) global.moduleData.baicao = new Map();
	if (!global.moduleData.baicao.has(threadID)) return;

	var data = global.moduleData.baicao.get(threadID);
	if (data.start != 1) return;

	/* DEAL CARDS */
	if (body.indexOf("deal") == 0) {
		if (data.chiabai == 1) return;

		for (const key in data.player) {
			const card1 = Math.floor(Math.random() * 9) + 1;
			const card2 = Math.floor(Math.random() * 9) + 1;
			const card3 = Math.floor(Math.random() * 9) + 1;

			var tong = card1 + card2 + card3;
			if (tong >= 20) tong -= 20;
			if (tong >= 10) tong -= 10;

			data.player[key].card1 = card1;
			data.player[key].card2 = card2;
			data.player[key].card3 = card3;
			data.player[key].tong = tong;

			api.sendMessage(
				`Your cards: ${card1} | ${card2} | ${card3}\n\nYour total: ${tong}`,
				data.player[key].id
			);
		}

		data.chiabai = 1;
		global.moduleData.baicao.set(threadID, data);

		return api.sendMessage(
			"Cards have been dealt!\n\nEach player has 2 card changes.\nIf your cards are low, type 'change'\nTo lock your cards, type 'ready'",
			threadID
		);
	}

	/* CHANGE CARD */
	if (body.indexOf("change") == 0) {
		if (data.chiabai != 1) return;

		var player = data.player.find(item => item.id == senderID);
		if (player.doibai == 0)
			return api.sendMessage("You have used all your change turns!", threadID, messageID);

		if (player.ready == true)
			return api.sendMessage("You already locked your cards!", threadID, messageID);

		const card = ["card1", "card2", "card3"];
		player[card[Math.floor(Math.random() * card.length)]] = Math.floor(Math.random() * 9) + 1;

		player.tong = player.card1 + player.card2 + player.card3;
		if (player.tong >= 20) player.tong -= 20;
		if (player.tong >= 10) player.tong -= 10;

		player.doibai -= 1;
		global.moduleData.baicao.set(threadID, data);

		return api.sendMessage(
			`Your new cards: ${player.card1} | ${player.card2} | ${player.card3}\n\nYour total: ${player.tong}`,
			player.id
		);
	}

	/* READY */
	if (body.indexOf("ready") == 0) {
		if (data.chiabai != 1) return;

		var player = data.player.find(item => item.id == senderID);
		if (player.ready == true) return;

		player.ready = true;
		data.ready += 1;

		if (data.player.length == data.ready) {

			const playerList = data.player;
			playerList.sort((a, b) => b.tong - a.tong);

			var ranking = [], num = 1;

			for (const info of playerList) {
				const name = await Users.getNameUser(info.id);
				ranking.push(
					`${num++}. ${name} : ${info.card1} | ${info.card2} | ${info.card3} => ${info.tong} points`
				);
			}

			const money = data.dCoin * playerList.length;
			await Currencies.increaseMoney(playerList[0].id, money);

			const winName = await Users.getNameUser(playerList[0].id);
			ranking.push(`\nWinner: ${winName} receives ${money}$`);

			global.moduleData.baicao.delete(threadID);

			return api.sendMessage(
				`Final Result:\n\n${ranking.join("\n")}`,
				threadID
			);
		}

		const name = await Users.getNameUser(senderID);
		return api.sendMessage(
			`${name} is ready.\nRemaining players: ${data.player.length - data.ready}`,
			threadID
		);
	}
};

module.exports.run = async ({ api, event, Currencies, args, Users }) => {

	var { senderID, threadID, messageID } = event;

	if (!global.moduleData.baicao) global.moduleData.baicao = new Map();
	var data = global.moduleData.baicao.get(threadID) || {};

	switch (args[0]) {

		case "join":
		case "-j": {

			if (data.start == 1)
				return api.sendMessage("The table has already started!", threadID, messageID);

			const senderCoin = (await Currencies.getData(senderID)).money;

			if (!data.player) {
				if (!senderCoin || senderCoin < 1000)
					return api.sendMessage("You are too poor to create a table!", threadID, messageID);

				global.moduleData.baicao.set(threadID, {
					author: senderID,
					maxCoin: senderCoin,
					dCoin: 0,
					start: 0,
					chiabai: 0,
					ready: 0,
					player: [{
						id: senderID,
						money: senderCoin,
						card1: 0,
						card2: 0,
						card3: 0,
						doibai: 2,
						ready: false
					}]
				});

				return api.sendMessage(
					"Table created!\nOthers type: >baicao join\nTo set bet: >baicao create <coins>",
					threadID,
					messageID
				);
			}

			if (data.player.find(p => p.id == senderID))
				return api.sendMessage("You already joined!", threadID, messageID);

			if (!senderCoin || senderCoin < 1000)
				return api.sendMessage("You are too poor to join!", threadID, messageID);

			data.player.push({
				id: senderID,
				money: senderCoin,
				card1: 0,
				card2: 0,
				card3: 0,
				doibai: 2,
				ready: false
			});

			if (senderCoin < data.maxCoin) data.maxCoin = senderCoin;

			global.moduleData.baicao.set(threadID, data);

			return api.sendMessage(
				`${await Users.getNameUser(senderID)} joined!\nMax bet allowed: ${data.maxCoin}$`,
				threadID,
				messageID
			);
		}

		case "leave":
		case "-l": {

			if (data.start == 1)
				return api.sendMessage("Game already started!", threadID, messageID);

			if (!data.player || !data.player.some(p => p.id == senderID))
				return api.sendMessage("You are not in this table!", threadID, messageID);

			if (data.author == senderID) {
				global.moduleData.baicao.delete(threadID);
				return api.sendMessage("Author cancelled the table!", threadID, messageID);
			}

			data.player.splice(data.player.findIndex(p => p.id === senderID), 1);
			global.moduleData.baicao.set(threadID, data);

			return api.sendMessage("You left the table!", threadID, messageID);
		}

		case "create":
		case "-c": {

			if (senderID != data.author)
				return api.sendMessage("Only the author can set the bet!", threadID, messageID);

			if (!data.player)
				return api.sendMessage("No active table!", threadID, messageID);

			if (data.player.length < 2)
				return api.sendMessage("Need at least 2 players!", threadID, messageID);

			if (!args[1] || parseInt(args[1]) < 1000)
				return api.sendMessage("Invalid bet amount!", threadID, messageID);

			if (data.maxCoin < parseInt(args[1]))
				return api.sendMessage(`Max bet allowed is ${data.maxCoin}$`, threadID, messageID);

			data.start = 1;
			data.dCoin = parseInt(args[1]);

			for (user of data.player)
				await Currencies.decreaseMoney(user.id, data.dCoin);

			return api.sendMessage(
				`Bet set to ${args[1]}$ successfully!\nType "deal" to start`,
				threadID,
				messageID
			);
		}

		case "cancel":
		case "-x": {
			global.moduleData.baicao.delete(threadID);
			return api.sendMessage("Table cancelled!", threadID, messageID);
		}

		case "info":
		case "-i": {

			if (!data.player)
				return api.sendMessage("No active table!", threadID, messageID);

			return api.sendMessage(
				"=== Bai Cao Table ===" +
				"\nAuthor: " + data.author +
				"\nPlayers: " + data.player.length +
				"\nMax Bet: " + data.maxCoin + "$",
				threadID,
				messageID
			);
		}

		default:
			return;
	}
};