import 'dotenv/config';
import { REST, Routes } from 'discord.js';
import { Client, GatewayIntentBits } from 'discord.js';

const GUILD_ID = '501257744364601345';
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once('ready', async () => {
  await client.application.fetch();

  const applicationId = client.application.id;
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN);

  try {
    console.log(`🧼 Borrando comandos globales del bot con ID ${applicationId}...`);
    await rest.put(Routes.applicationCommands(applicationId), { body: [] });
    console.log('✅ Comandos globales borrados correctamente.');

    if (GUILD_ID) {
      console.log(`🧼 Borrando comandos de servidor (${GUILD_ID})...`);
      await rest.put(Routes.applicationGuildCommands(applicationId, GUILD_ID), { body: [] });
      console.log('✅ Comandos del servidor borrados correctamente.');
    }
  } catch (error) {
    console.error('❌ Error al borrar comandos:', error);
  } finally {
    client.destroy();
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);  