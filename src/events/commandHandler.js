export function handleInteractions({ client }) {
    client.on('interactionCreate', async (interaction) => {
        if (!client.commands) {
            interaction.reply('Aun no se han cargado los comandos.');
            return;
        }
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (command) {
            try {
                await command(interaction);
            } catch (error) {
                console.error('❌ Error al ejecutar el comando:', error);
                await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
            }
        } else {
            console.warn(`⚠️ Comando no reconocido: ${interaction.commandName}`);
        }
    });
}