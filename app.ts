import express from "express";
import dotenv from "dotenv";

import { Context, Telegraf, Markup } from "telegraf";
import { Update } from "typegram";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const bot: Telegraf<Context<Update>> = new Telegraf(
  process.env.BOT_TOKEN as string
);

bot.start(async (ctx) => {
  const member = await ctx.telegram.getChatMember("@ktagirova", ctx.chat.id);
  if (member.status === "left") {
    ctx.telegram.sendMessage(
      ctx.chat.id,
      "You are not a member of the channel"
    );
  } else {
    ctx.reply("Hello");
  }
});
bot.help((ctx) => {
  ctx.reply("Send /start to receive a greeting");
  ctx.reply("Send /keyboard to receive a message with a keyboard");
  ctx.reply("Send /quit to stop the bot");
});
bot.command("quit", (ctx) => {
  // Explicit usage
  ctx.telegram.leaveChat(ctx.message.chat.id);
  // Context shortcut
  ctx.leaveChat();
});
bot.command("keyboard", (ctx) => {
  ctx.reply(
    "Keyboard",
    Markup.inlineKeyboard([
      Markup.button.callback("First option", "first"),
      Markup.button.callback("Second option", "second"),
    ])
  );
});
bot.on("text", (ctx) => {
  ctx.reply(
    "You choose the " +
      (ctx.message.text === "first" ? "First" : "Second") +
      " Option!"
  );
});

bot.launch();

app.get("/", (req, res) => {
  res.send("Hello from tgbot!");
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

app.listen(port, () => {
  console.log(`tgbot listening at http://localhost:${port}`);
});
