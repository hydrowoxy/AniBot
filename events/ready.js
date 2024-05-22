const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}`);
        client.user.setPresence({
            activities: [{ name: 'anime', type: 'WATCHING' }],
            status: 'online'
        });
    },
}