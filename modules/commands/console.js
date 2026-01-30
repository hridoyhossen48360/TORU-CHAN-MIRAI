module.exports.config = {
    name: "code",
    version: "2.1.9",
    hasPermssion: 3,
    credits: "rX",
    description: "Do something inside commands",
    commandCategory: "Admin",
    usages: "",
    hide: true,
    cooldowns: 5,
    usePrefix: false,
};

module.exports.run = async ({ api, event, args, Users }) => {
    const moment = require("moment-timezone");
    var timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss");
    const axios = require("axios");
    const fs = require("fs-extra");
    const permission = ["61587127028066"];

    if (!permission.includes(event.senderID))
        return api.sendMessage("Nice try, code thief 😏", event.threadID, event.messageID);

    const cheerio = global.nodemodule["cheerio"];

    if (!args[0])
        return api.sendMessage(
            `====〈 CODE 〉====\n🔱 Usage Guide 🔱\n\n` +
            `[🌟] ➜ CODE link/up: Upload code to buildtool.dev or reply with a buildtool.dev link to apply code to a file.\n\n` +
            `[🌟] ➜ CODE file: Send the bot file you want.\n\n` +
            `[🌟] ➜ CODE -c/create: Create a file in commands.\n\n` +
            `[🌟] ➜ CODE -d/del: Delete a file in commands.\n\n` +
            `[🌟] ➜ CODE re/rename: Rename a file in commands.\n\n` +
            `====「${timeNow}」====`,
            event.threadID
        );

    var path = __dirname + '/';

    switch (args[0]) {
        case '-c':
        case 'create': {
            if (args[1].length == 0)
                return api.sendMessage("Please enter a file name", event.threadID);

            if (fs.existsSync(`${__dirname}/${args[1]}.js`))
                return api.sendMessage(
                    `File ${args[1]}.js already exists.`,
                    event.threadID,
                    event.messageID
                );

            fs.copySync(__dirname + "/example.js", __dirname + "/" + args[1] + ".js");
            return api.sendMessage(
                `Successfully created file "${args[1]}.js".`,
                event.threadID,
                event.messageID
            );
        }

        case "-d":
        case 'del': {
            fs.unlink(`${__dirname}/${args[1]}.js`);
            return api.sendMessage(`Deleted file ${args[1]}.js`, event.threadID, event.messageID);
        }

        case "rename":
        case 're': {
            fs.rename(`${__dirname}/${args[1]}.js`, `${__dirname}/${args[2]}.js`, function (err) {
                if (err) throw err;
                return api.sendMessage(
                    `Renamed file ${args[1]}.js to ${args[2]}.js`,
                    event.threadID,
                    event.messageID
                );
            });
            break;
        }

        case 'up':
        case 'link': {
            const request = require('request');
            const cheerio = require('cheerio');
            const fs = require('fs');
            const { threadID, messageID } = event;
            const content = args[1];

            if (!content)
                return api.sendMessage('Missing data!', threadID, messageID);

            if (content.endsWith(".js") || content.endsWith(".json")) {
                await fs.readFile(`${__dirname}/${content}`, "utf-8", async function (err, data) {
                    if (err)
                        return api.sendMessage(`File "${content}" not found.`, threadID, messageID);
                    await buildtooldev(data);
                });
            }
            else if (
                event.type == "message_reply" &&
                (event.messageReply.body.includes('https://buildtool.') ||
                 event.messageReply.body.includes('https://tinyurl.com'))
            ) {
                if (!args[1])
                    return api.sendMessage('Please enter the file name to apply new code!', threadID, messageID);

                const options = {
                    method: 'GET',
                    url: event.messageReply.body
                };

                request(options, function (error, response, body) {
                    if (error)
                        return api.sendMessage(
                            'Please reply with link only (no extra text)',
                            threadID,
                            messageID
                        );

                    const load = cheerio.load(body);
                    load('.language-js').each((index, el) => {
                        if (index !== 0) return;
                        var code = el.children[0].data;
                        fs.writeFile(`${__dirname}/${args[1]}.js`, code, "utf-8", function (err) {
                            if (err)
                                return api.sendMessage(
                                    `Error applying new code to "${args[1]}.js".`
                                );
                            return api.sendMessage(
                                `Code has been applied to "${args[1]}.js".`,
                                threadID,
                                messageID
                            );
                        });
                    });
                });
            }
            else {
                await buildtooldev(content);
            }

            async function buildtooldev(content) {
                const options = {
                    method: 'POST',
                    url: 'https://buildtool.dev/verification',
                    headers: {
                        'cookie': 'paste_submitted=yes; last_code_class=language-js'
                    },
                    form: {
                        'content': content,
                        'code_class': 'language-js'
                    }
                };

                request(options, function (error, response, body) {
                    if (error)
                        return api.sendMessage('An error occurred!', threadID, messageID);

                    const $ = cheerio.load(body);
                    $('a').each((index, el) => {
                        if (index !== 0) return;
                        return api.sendMessage(
                            `Here is your link: https://buildtool.dev/${el.attribs.href}`,
                            threadID,
                            async function (error) {
                                if (error) return await shortLink(el.attribs.href);
                            },
                            messageID
                        );
                    });
                });
            }

            async function shortLink(link) {
                const turl = require('turl');
                turl.shorten('https://buildtool.dev/' + link)
                    .then(res => {
                        return api.sendMessage(
                            `Due to restrictions, shortened link: ${res}`,
                            threadID,
                            messageID
                        );
                    })
                    .catch(() => {
                        return api.sendMessage(
                            `Remove the space: https://buildtool. dev/${link}`,
                            threadID,
                            messageID
                        );
                    });
            }
            break;
        }

        default: {
            const fs = require("fs-extra");
            const stringSimilarity = require('string-similarity');
            const file = args.join(" ");

            if (!file)
                return api.sendMessage('File name cannot be empty', event.threadID, event.messageID);

            if (!file.endsWith('.js'))
                return api.sendMessage('File extension must be .js', event.threadID, event.messageID);

            if (event.type == "message_reply") {
                var uid = event.messageReply.senderID;
                var name = (await Users.getData(uid)).name;

                if (!fs.existsSync(__dirname + "/" + file)) {
                    var mdl = fs.readdirSync(__dirname)
                        .filter(f => f.endsWith(".js"))
                        .map(item => item.replace(/\.js/g, ""));

                    var checker = stringSimilarity.findBestMatch(file, mdl);
                    var search = checker.bestMatch.rating >= 1 ? checker.bestMatch.target : undefined;

                    if (search == undefined)
                        return api.sendMessage(
                            '🔎 File not found: ' + args.join(" "),
                            event.threadID,
                            event.messageID
                        );

                    return api.sendMessage(
                        'File not found: ' + file +
                        '\nBut a similar file exists: ' + search + '.js\n\nReact to this message to get it.',
                        event.threadID,
                        (error, info) => {
                            global.client.handleReaction.push({
                                type: 'user',
                                name: this.config.name,
                                author: event.senderID,
                                messageID: info.messageID,
                                file: search,
                                uid: uid,
                                namee: name
                            });
                        },
                        event.messageID
                    );
                }

                fs.copyFile(
                    __dirname + '/' + file,
                    __dirname + '/' + file.replace(".js", ".txt")
                );

                return api.sendMessage(
                    {
                        body: 'Here is your file ' + args.join(' '),
                        attachment: fs.createReadStream(
                            __dirname + '/' + file.replace('.js', '.txt')
                        )
                    },
                    uid,
                    () => fs.unlinkSync(
                        __dirname + '/' + file.replace('.js', '.txt')
                    )
                ).then(
                    api.sendMessage(
                        'Check your inbox ' + name,
                        event.threadID,
                        () => {},
                        event.messageID
                    )
                );
            }
            else {
                if (!fs.existsSync(__dirname + "/" + file)) {
                    var mdl = fs.readdirSync(__dirname)
                        .filter(f => f.endsWith(".js"))
                        .map(item => item.replace(/\.js/g, ""));

                    var checker = stringSimilarity.findBestMatch(file, mdl);
                    var search = checker.bestMatch.rating >= 0.5 ? checker.bestMatch.target : undefined;

                    if (search == undefined)
                        return api.sendMessage(
                            '🔎 File not found: ' + args.join(" "),
                            event.threadID,
                            event.messageID
                        );

                    return api.sendMessage(
                        'File not found: ' + file +
                        '\nBut a similar file exists: ' + search + '.js\n\nReact to this message to get it.',
                        event.threadID,
                        (error, info) => {
                            global.client.handleReaction.push({
                                type: 'thread',
                                name: this.config.name,
                                author: event.senderID,
                                messageID: info.messageID,
                                file: search
                            });
                        },
                        event.messageID
                    );
                }

                fs.copyFile(
                    __dirname + '/' + file,
                    __dirname + '/' + file.replace(".js", ".txt")
                );

                return api.sendMessage(
                    {
                        body: 'Here is your file ' + args.join(' '),
                        attachment: fs.createReadStream(
                            __dirname + '/' + file.replace('.js', '.txt')
                        )
                    },
                    event.threadID,
                    () => fs.unlinkSync(
                        __dirname + '/' + file.replace('.js', '.txt')
                    ),
                    event.messageID
                );
            }
        }
    }
};

module.exports.handleReaction = ({ Users, api, event, handleReaction }) => {
    var { file, author, type, uid, namee } = handleReaction;
    if (event.userID != handleReaction.author) return;

    const fs = require("fs-extra");
    var fileSend = file + '.js';

    switch (type) {
        case "user": {
            fs.copyFile(
                __dirname + '/' + fileSend,
                __dirname + '/' + fileSend.replace(".js", ".txt")
            );
            api.unsendMessage(handleReaction.messageID);
            return api.sendMessage(
                {
                    body: '» Here is your file ' + file,
                    attachment: fs.createReadStream(
                        __dirname + '/' + fileSend.replace('.js', '.txt')
                    )
                },
                uid,
                () => fs.unlinkSync(
                    __dirname + '/' + fileSend.replace('.js', '.txt')
                )
            ).then(
                api.sendMessage(
                    '» Check your inbox ' + namee,
                    event.threadID,
                    () => {},
                    event.messageID
                )
            );
        }

        case "thread": {
            fs.copyFile(
                __dirname + '/' + fileSend,
                __dirname + '/' + fileSend.replace(".js", ".txt")
            );
            api.unsendMessage(handleReaction.messageID);
            return api.sendMessage(
                {
                    body: '» Here is your file ' + file,
                    attachment: fs.createReadStream(
                        __dirname + '/' + fileSend.replace('.js', '.txt')
                    )
                },
                event.threadID,
                () => fs.unlinkSync(
                    __dirname + '/' + fileSend.replace('.js', '.txt')
                ),
                event.messageID
            );
        }
    }
};
