const { REST, Routes } = require('discord.js');
const config = require('./config/config');

const commands = [
    {
        name: 'panelticket',
        description: 'Membuat panel ticket untuk NAMA_DISCORD_LU',
    }
];

const rest = new REST({ version: '10' }).setToken(config.TOKEN);

(async () => {
    try {
        console.log('Mendaftarkan slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID),
            { body: commands }
        );

        console.log('Slash commands berhasil didaftarkan!');
    } catch (error) {
        console.error('Error:', error);
    }
})();