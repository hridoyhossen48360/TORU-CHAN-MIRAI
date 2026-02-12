
require('dotenv').config();
const login = require("facebook-chat-api");
const axios = require('axios');
const fs = require('fs-extra');  // better fs with promises
const path = require('path');
const Queue = require('queue');  // simple queue for handling multiple gen requests

const PREFIX = process.env.PREFIX || '!';
const API_URL = "https://midjanuarybyxnil.onrender.com/generate";  // Adjust if endpoint different
const TEMP_DIR = path.join(__dirname, 'temp_images');
fs.ensureDirSync(TEMP_DIR);  // Create temp dir if not exists

// Queue setup: concurrency 1 to avoid overloading free server
const genQueue = new Queue({ concurrency: 1, autostart: true });

// Parse args for advanced options
function parsePromptArgs(input) {
    let prompt = input;
    let negative_prompt = '';
    let aspect_ratio = '1:1';  // default square
    let width = 1024, height = 1024;

    const negMatch = input.match(/--negative\s+(.+?)(?=\s--|$)/i);
    if (negMatch) {
        negative_prompt = negMatch[1].trim();
        prompt = prompt.replace(negMatch[0], '');
    }

    const arMatch = input.match(/--ar\s+([\d:]+)/i);
    if (arMatch) {
        aspect_ratio = arMatch[1];
        prompt = prompt.replace(arMatch[0], '');
        const [w, h] = aspect_ratio.split(':').map(Number);
        width = 512 * w;  // scale up, but cap for free tier
        height = 512 * h;
        width = Math.min(width, 2048);
        height = Math.min(height, 2048);
    }

    return { prompt: prompt.trim(), negative_prompt, width, height };
}

// Generate image function
async function generateImage(options) {
    const { prompt, negative_prompt, width, height } = options;
    try {
        const response = await axios.post(API_URL, {
            prompt,
            negative_prompt,
            width,
            height,
            steps: 30,  // configurable if needed
            guidance_scale: 7.5,
            seed: -1
        }, {
            headers: { 'Content-Type': 'application/json' },
            responseType: 'arraybuffer'  // assuming binary image
        });

        const tempFile = path.join(TEMP_DIR, `img_${Date.now()}.png`);
        await fs.writeFile(tempFile, response.data);
        return tempFile;
    } catch (error) {
        console.error("Gen error:", error.message);
        if (error.response) console.log("Response:", error.response.status, error.response.data?.toString());
        throw new Error("Generation failed");
    }
}

// Bot login and listener
login({ email: process.env.FB_EMAIL, password: process.env.FB_PASS }, (err, api) => {
    if (err) return console.error("Login error:", err);

    console.log(`Bot online! Prefix: ${PREFIX}. Listening...`);

    api.listenMqtt(async (err, message) => {
        if (err || !message || !message.body) return;

        const body = message.body.trim();
        if (!body.startsWith(PREFIX)) return;

        const command = body.slice(PREFIX.length).trim();
        const [cmd, ...args] = command.split(/\s+/);
        const input = args.join(' ');

        if (['img', 'imagine'].includes(cmd.toLowerCase())) {
            if (!input) {
                return api.sendMessage(`Usage: ${PREFIX}img <prompt> [--negative <neg>] [--ar <ratio>]\nExample: ${PREFIX}img cyberpunk city --ar 16:9 --negative blurry`, message.threadID);
            }

            const options = parsePromptArgs(input);
            api.sendMessage(`🖼️ Generating: "${options.prompt}"\nNegative: ${options.negative_prompt || 'none'}\nAR: \( {options.width}x \){options.height}\nWait 20-90 sec...`, message.threadID);

            // Add to queue
            genQueue.add(async () => {
                try {
                    const filePath = await generateImage(options);
                    await api.sendMessage({
                        body: `✅ Generated!\nPrompt: ${options.prompt}`,
                        attachment: fs.createReadStream(filePath)
                    }, message.threadID);
                    await fs.unlink(filePath);  // cleanup
                } catch {
                    api.sendMessage("❌ Failed to generate. Server busy or invalid prompt. Try simpler one.", message.threadID);
                }
            });
        }

        if (cmd.toLowerCase() === 'help') {
            api.sendMessage(`Mirai Image Bot Help:\n\( {PREFIX}img <prompt> [--negative <neg_prompt>] [--ar <w:h>]\n \){PREFIX}help - This menu\nNote: Free server, may be slow.`, message.threadID);
        }
    });
});
