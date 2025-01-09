import { Telegraf } from "telegraf";
export function POST() {
  const bot = new Telegraf("7402273491:AAE8mg6FKswdRMz0mSBPwTZrK04S9nNh_Tg");
  bot.start((ctx) => ctx.reply("Welcome"));
}
