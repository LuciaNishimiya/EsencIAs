export function ping({ client }) {
    function execute(interaction) {
        interaction.reply('pong!');
    };
    return { description: 'Responde con pong!', name: 'ping', execute }
}
