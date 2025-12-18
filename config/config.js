const { ButtonStyle } = require('discord.js');
require('dotenv').config();

module.exports = {
    TOKEN: process.env.BOT_TOKEN,
    GUILD_ID: process.env.GUILD_ID,
    CLIENT_ID: process.env.CLIENT_ID,
    
    TICKET_CATEGORY_ID: process.env.TICKET_CATEGORY_ID,
    
    DEVELOPER_ID: process.env.DEVELOPER_ID,
    ADMIN_ROLE_ID: process.env.ADMIN_ROLE_ID,
    
    TICKET_BUTTONS: [
        {
            id: 'order_ticket',
            label: '🛒 Order',
            style: ButtonStyle.Success,
            emoji: '🛒'
        },
        {
            id: 'ask_ticket',
            label: '❓ Ask Question',
            style: ButtonStyle.Primary,
            emoji: '❓'
        }
    ],

    COMMAND_PERMISSIONS: {
        'panelticket': 'both'
    }
};