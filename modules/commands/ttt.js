module.exports.config = {
  name: "ttt",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Mirai Team",
  description: "Play Tic Tac Toe with AI",
  commandCategory: "Game",
  cooldowns: 5,
  usages: "x/o/delete/continue"
};

var AIMove;
const fs = require("fs");
const { loadImage, createCanvas } = require("canvas");

function startBoard({ isX, data }) {
  data.board = new Array(3);
  data.isX = isX;
  data.gameOn = true;
  data.gameOver = false;
  data.available = [];
  for (var i = 0; i < 3; i++) data.board[i] = new Array(3).fill(0);
  return data;
}

async function displayBoard(data) {
  const path = __dirname + "/cache/ttt.png";
  let canvas = createCanvas(1200, 1200);
  let cc = canvas.getContext("2d");
  let background = await loadImage("https://i.postimg.cc/nhDWmj1h/background.png");
  cc.drawImage(background, 0, 0, 1200, 1200);
  var quanO = await loadImage("https://i.postimg.cc/rFP6xLXQ/O.png");
  var quanX = await loadImage("https://i.postimg.cc/HLbFqcJh/X.png");

  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 3; j++) {
      var temp = data.board[i][j].toString();
      var x = 54 + 366 * j;
      var y = 54 + 366 * i;
      if (temp == "1")
        data.isX ? cc.drawImage(quanO, x, y, 360, 360) : cc.drawImage(quanX, x, y, 360, 360);
      if (temp == "2")
        data.isX ? cc.drawImage(quanX, x, y, 360, 360) : cc.drawImage(quanO, x, y, 360, 360);
    }
  }

  fs.writeFileSync(path, canvas.toBuffer("image/png"));
  return [fs.createReadStream(path)];
}

function checkAIWon(data) {
  if (data.board[0][0] == 1 && data.board[0][0] == data.board[1][1] && data.board[0][0] == data.board[2][2]) return true;
  if (data.board[0][2] == 1 && data.board[0][2] == data.board[1][1] && data.board[0][2] == data.board[2][0]) return true;
  for (var i = 0; i < 3; i++) {
    if (data.board[i][0] == 1 && data.board[i][0] == data.board[i][1] && data.board[i][0] == data.board[i][2]) return true;
    if (data.board[0][i] == 1 && data.board[0][i] == data.board[1][i] && data.board[0][i] == data.board[2][i]) return true;
  }
  return false;
}

function checkPlayerWon(data) {
  if (data.board[0][0] == 2 && data.board[0][0] == data.board[1][1] && data.board[0][0] == data.board[2][2]) return true;
  if (data.board[0][2] == 2 && data.board[0][2] == data.board[1][1] && data.board[0][2] == data.board[2][0]) return true;
  for (var i = 0; i < 3; i++) {
    if (data.board[i][0] == 2 && data.board[i][0] == data.board[i][1] && data.board[i][0] == data.board[i][2]) return true;
    if (data.board[0][i] == 2 && data.board[0][i] == data.board[1][i] && data.board[0][i] == data.board[2][i]) return true;
  }
  return false;
}

function solveAIMove({ depth, turn, data }) {
  if (checkAIWon(data)) return 1;
  if (checkPlayerWon(data)) return -1;
  let availablePoint = getAvailable(data);
  if (availablePoint.length == 0) return 0;

  var min = Number.MAX_SAFE_INTEGER;
  var max = Number.MIN_SAFE_INTEGER;

  for (var i = 0; i < availablePoint.length; i++) {
    var point = availablePoint[i];
    if (turn == 1) {
      placeMove({ point, player: 1, data });
      var score = solveAIMove({ depth: depth + 1, turn: 2, data });
      max = Math.max(score, max);
      if (score >= 0 && depth == 0) AIMove = point;
      if (score == 1) {
        data.board[point[0]][point[1]] = 0;
        break;
      }
    } else {
      placeMove({ point, player: 2, data });
      var score = solveAIMove({ depth: depth + 1, turn: 1, data });
      min = Math.min(score, min);
      if (min == -1) {
        data.board[point[0]][point[1]] = 0;
        break;
      }
    }
    data.board[point[0]][point[1]] = 0;
  }
  return turn == 1 ? max : min;
}

function placeMove({ point, player, data }) {
  data.board[point[0]][point[1]] = player;
}

function getAvailable(data) {
  let arr = [];
  for (var i = 0; i < 3; i++)
    for (var j = 0; j < 3; j++)
      if (data.board[i][j] == 0) arr.push([i, j]);
  return arr;
}

function move(x, y, data) {
  let available = getAvailable(data);
  let playerMove = [x, y];
  if (!available.find(p => p.toString() == playerMove.toString()))
    return "This cell is already taken!";
  placeMove({ point: playerMove, player: 2, data });
  solveAIMove({ depth: 0, turn: 1, data });
  placeMove({ point: AIMove, player: 1, data });
}

function checkGameOver(data) {
  return getAvailable(data).length == 0 || checkAIWon(data) || checkPlayerWon(data);
}

function AIStart(data) {
  var point = [Math.round(Math.random()) * 2, Math.round(Math.random()) * 2];
  placeMove({ point, player: 1, data });
}

module.exports.handleReply = async function ({ event, api }) {
  let { body, threadID, messageID, senderID } = event;
  if (!global.moduleData.tictactoe) global.moduleData.tictactoe = new Map();
  let data = global.moduleData.tictactoe.get(threadID);
  if (!data || !data.gameOn) return;

  var number = parseInt(body);
  if (isNaN(number) || number < 1 || number > 9)
    return api.sendMessage("Invalid cell number!", threadID, messageID);

  var row = number < 4 ? 0 : number < 7 ? 1 : 2;
  var col = number % 3 == 1 ? 0 : number % 3 == 2 ? 1 : 2;

  var temp = move(row, col, data);
  var result = "";

  if (checkGameOver(data)) {
    if (checkAIWon(data)) result = "You lose!";
    else if (checkPlayerWon(data)) result = "You win!";
    else result = "Draw!";
    global.moduleData.tictactoe.delete(threadID);
  }

  api.sendMessage(
    { body: result || temp || "Reply with a cell number (1-9)", attachment: await displayBoard(data) },
    threadID,
    messageID
  );
};

module.exports.run = async function ({ event, api, args }) {
  if (!global.moduleData.tictactoe) global.moduleData.tictactoe = new Map();
  let { threadID, messageID, senderID } = event;

  let data = global.moduleData.tictactoe.get(threadID) || { gameOn: false };

  if (args.length == 0)
    return api.sendMessage("Please choose X or O", threadID, messageID);

  if (args[0].toLowerCase() == "delete") {
    global.moduleData.tictactoe.delete(threadID);
    return api.sendMessage("Game deleted.", threadID, messageID);
  }

  if (args[0].toLowerCase() == "continue") {
    if (!data.gameOn)
      return api.sendMessage("No active game.", threadID, messageID);
    return api.sendMessage(
      { body: "Reply with a cell number (1-9)", attachment: await displayBoard(data) },
      threadID,
      messageID
    );
  }

  if (!data.gameOn) {
    let choice = args[0].toLowerCase();
    if (choice !== "x" && choice !== "o")
      return api.sendMessage("Please choose X or O", threadID, messageID);

    let newData = startBoard({ isX: choice == "x", data });
    if (choice == "x") AIStart(newData);

    newData.player = senderID;
    global.moduleData.tictactoe.set(threadID, newData);

    return api.sendMessage(
      { body: "Reply with a cell number (1-9)", attachment: await displayBoard(newData) },
      threadID,
      messageID
    );
  }

  return api.sendMessage("A game is already running.", threadID, messageID);
};
