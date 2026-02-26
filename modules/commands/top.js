module.exports.config = {
    name: "top",
    version: "1.1.1",
    credits: "Yae Miko",
    hasPermssion: 0,
    description: "View top money or level in group or server",
    usages: "[boxmoney|boxlevel|svmoney|svlevel] + list length (default 10)",
    commandCategory: "Game",
    cooldowns: 5
};

module.exports.run = async function({
    api: a,
    event: e,
    args: g,
    Currencies,
    Users
}) {
    const {
        threadID: t,
        messageID: m,
        senderID: s,
        participantIDs: pI
    } = e;

    var arr = [],
        newArr = [],
        msg = "",
        type = g[0],
        leng = parseInt(g[1]) - 1;

    const allType = ["boxmoney", "boxlevel", "svmoney", "svlevel"];

    if (!allType.includes(type))
        return a.sendMessage(
            `➝ Enter the TOP you want to view:\n━━━━━━━━━━━━━━━\n${allType.join(", ")}`,
            t,
            m
        );

    if (isNaN(leng) && leng)
        return a.sendMessage(
            `➝ List length must be a number`,
            t,
            m
        );

    switch (type) {

        case "boxmoney": {
            for (const id of pI) {
                let money = (await Currencies.getData(id)).money || 0;
                arr.push({ id, money });
            }

            arr.sort(S("money"));

            for (const i in arr) {
                newArr.push({
                    stt: i,
                    id: arr[i].id,
                    money: arr[i].money
                });
            }

            msg = `==== [ TOP 10 RICHEST USERS ] ====\n━━━━━━━━━━━━━━━\n`.toUpperCase();

            for (const i in newArr) {
                let name = (await Users.getData(newArr[i].id)).name || "";
                msg += `${i < 5 ? ICON(i) : `${i}.`} ${name}\n➝ MONEY: ${CC(newArr[i].money)}$\n`;
                if (i == leng && i < newArr.length || i == 10) break;
            }

            let find = newArr.find(i => i.id == s);
            msg += TX("money", find.stt, find.money);
            a.sendMessage(msg, t, m);
        }
        break;

        case "boxlevel": {
            for (const id of pI) {
                let exp = (await Currencies.getData(id)).exp || 0;
                arr.push({ id, exp });
            }

            arr.sort(S("exp"));

            for (const i in arr) {
                newArr.push({
                    stt: i,
                    id: arr[i].id,
                    exp: arr[i].exp
                });
            }

            msg = `== [ TOP 10 GROUP LEVEL ] ==\n━━━━━━━━━━━━━━━\n`.toUpperCase();

            for (const i in newArr) {
                let name = (await Users.getData(newArr[i].id)).name || "";
                msg += `${i < 5 ? ICON(i) : `${i}.`} ${name}\n• LEVEL: ${LV(newArr[i].exp)}\n`;
                if (i == leng && i < newArr.length || i == 10) break;
            }

            let find = newArr.find(i => i.id == s);
            msg += TX("level", find.stt, find.exp);
            a.sendMessage(msg, t, m);
        }
        break;

        case "svlevel": {
            let get = await Currencies.getAll(['userID', 'exp']);
            get.sort(S("exp"));

            for (const i in get) {
                arr.push({
                    stt: i,
                    id: get[i].userID,
                    exp: get[i].exp
                });
            }

            msg = `= [ TOP 10 SERVER LEVEL ] =\n━━━━━━━━━━━━━━━\n`.toUpperCase();

            for (const i in arr) {
                let name = (await Users.getData(arr[i].id)).name || "";
                msg += `${i < 5 ? ICON(i) : `${i}.`} ${name}\n• LEVEL: ${LV(arr[i].exp)}\n`;
                if (i == leng && i < arr.length || i == 10) break;
            }

            let find = arr.find(i => i.id == s);
            msg += TX("level", find.stt, find.exp);
            a.sendMessage(msg, t, m);
        }
        break;

        case "svmoney": {
            let get = await Currencies.getAll(['userID', 'money']);
            get.sort(S("money"));

            for (const i in get) {
                arr.push({
                    stt: i,
                    id: get[i].userID,
                    money: get[i].money
                });
            }

            msg = `==== [ TOP 10 RICHEST USERS ] ====\n━━━━━━━━━━━━━━━\n`.toUpperCase();

            for (const i in arr) {
                let name = (await Users.getData(arr[i].id)).name || "";
                msg += `${i < 5 ? ICON(i) : `${i}.`} ${name}\n• MONEY: ${CC(arr[i].money)}$\n`;
                if (i == leng && i < arr.length || i == 10) break;
            }

            let find = arr.find(i => i.id == s);
            msg += TX("money", find.stt, find.money);
            a.sendMessage(msg, t, m);
        }
        break;
    }
};

/* ================= HELPERS ================= */

function LV(x) {
    return Math.floor((Math.sqrt(1 + (4 * x) / 3) + 1) / 2);
}

function CC(n) {
    return n.toLocaleString('en-US', {
        minimumFractionDigits: 2
    });
}

function ICON(i) {
    return i == 0 ? "🏆" :
           i == 1 ? "🥇" :
           i == 2 ? "🥈" :
           i == 3 ? "🥉" :
           i == 4 ? "💎" : "";
}

function S(k) {
    return function(a, b) {
        let i = 0;
        if (a[k] > b[k]) i = 1;
        else if (a[k] < b[k]) i = -1;
        return i * -1;
    };
}

function TX(tx, i, x) {
    return `━━━━━━━━━━━━━━━\n${
        i >= 11
            ? `➝ Your current rank: ${i}\n➝ ${tx == "money" ? `MONEY: ${CC(x)}$` : `LEVEL: ${LV(x)}`}`
            : i >= 1 && i <= 4
            ? "➝ You are currently in the TOP 10"
            : i == 0
            ? "➝ You are currently TOP 1"
            : "➝ You are currently in the TOP 10"
    }`;
                            }
