import 'dotenv/config';

import { Client, GatewayIntentBits } from 'discord.js';
import { loadModules } from './utils/moduleLoader.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', async () => {
  console.log(`✅ Iniciado sesión como ${client.user.tag}!`);

  await loadModules('/events', {
    client
  });
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
