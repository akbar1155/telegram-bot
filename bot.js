// const { Telegraf } = require('telegraf')

// const bot = new Telegraf("7411328503:AAFg0z2oY4jPAa731q_DakzO56DMdJWiKoU")

// // bot.start((e) => {
// //     e.reply("Welcome " + e.from.first_name)

// // })
// // bot.command(["one", "two", "three"], (e) => {
// //     e.reply("Command  first team is activated")
// // })

// // bot.command(["six", "four", "five"], (e) => e.reply("Command second team is activated"))
// // bot.hears("help", (e) => {
// //     e.reply("Hey! I'm here to help you!")
// // })


// bot.on("sticker", (e) => e.reply("👍"))




// bot.launch()

// // bot.start((ctx) => {
// //     ctx.reply("Assalomu alaykum")
// // })
// // bot.help((ctx) => {
// //     ctx.reply("Sizga qanday yordam kerak.")
// // })
// // bot.settings((ctx) => {
// //     ctx.reply("Sozlamalar")
// // })

// // // Enable graceful stop
// // process.once('SIGINT', () => bot.stop('SIGINT'))
// // process.once('SIGTERM', () => bot.stop('SIGTERM'))


const TelegramBot = require('node-telegram-bot-api');
const ytdl = require('ytdl-core');
const fs = require('fs');

// Telegram bot tokeni
const token = '7411328503:AAFg0z2oY4jPAa731q_DakzO56DMdJWiKoU';
const bot = new TelegramBot(token, { polling: true });

// Botga kelgan har qanday xabarni qayta ishlash
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const url = msg.text;

    // Agar bu URL emas bo'lsa, foydalanuvchiga ko'rsatma yuborish
    if (!ytdl.validateURL(url)) {
        bot.sendMessage(chatId, 'Iltimos, YouTube video linkini yuboring.');
        return;
    }

    try {
        // Videoni yuklash
        bot.sendMessage(chatId, 'Videoni yuklamoqdaman, kuting...');

        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: '18' });

        const videoTitle = info.videoDetails.title;
        const outputPath = `${videoTitle}.mp4`;
        const videoStream = ytdl(url, { format });

        // Video faylni saqlash
        videoStream.pipe(fs.createWriteStream(outputPath));

        videoStream.on('end', () => {
            // Video yuklanganidan keyin uni foydalanuvchiga yuborish
            bot.sendVideo(chatId, outputPath).then(() => {
                // Yuborilganidan keyin vaqtincha faylni o'chirish
                fs.unlinkSync(outputPath);
            });
        });
    } catch (error) {
        console.error('Xato:', error);
        bot.sendMessage(chatId, 'Videoni yuklashda xatolik yuz berdi.');
    }
});
