import { REST, Routes } from 'discord.js';
import { loadModules } from "../utils/moduleLoader.js";

export function registerCommands({ client }) {
  (async () => {
    try {
      const loadedCommands = await loadModules('/commands', { client });
      const slashCommands = loadedCommands.map(({ name, result }) => {
        if (!result?.name || !result?.description) {
          console.warn(`⚠️ Comando "${name}" inválido.`);
          return null;
        }
        return {
          name: result.name,
          description: result.description,
          options: result.options || [],
        };
      }).filter(Boolean);

      if (!slashCommands.length) {
        console.warn('⚠️ No hay comandos válidos para registrar.');
        return;
      }

      const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);
      const clientId = client.user.id;

      console.log(`🚀 Registrando ${slashCommands.length} comandos...`);
      await rest.put(Routes.applicationCommands(clientId), { body: slashCommands });
      console.log('✅ Comandos registrados correctamente.');
      client.commands = new Map();
      loadedCommands.forEach(({ name, result }) => {
          client.commands.set(name, result.execute);
      });

    } catch (err) {
      console.error('❌ Error al registrar comandos:', err);
    }
  })();
}