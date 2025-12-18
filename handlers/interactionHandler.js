const config = require('../config/config');
const { checkPermission } = require('../utils/permissions');
const { createPermissionErrorEmbed } = require('../utils/embedBuilder');
const { handlePanelTicket } = require('./commandHandler');
const { handleTicketButton, handleCloseButton } = require('./buttonHandler');

/**
 * Handle semua slash commands
 */
async function handleSlashCommand(interaction) {
    const commandName = interaction.commandName;
    const requiredPermission = config.COMMAND_PERMISSIONS[commandName];
    const permCheck = checkPermission(interaction, requiredPermission);
    
    if (!permCheck.hasPermission) {
        const errorEmbed = createPermissionErrorEmbed(commandName, requiredPermission);
        
        return interaction.reply({
            embeds: [errorEmbed],
            ephemeral: true
        });
    }
    
    switch (commandName) {
        case 'panelticket':
            await handlePanelTicket(interaction);
            break;
        default:
            await interaction.reply({
                content: 'Command tidak ditemukan!',
                ephemeral: true
            });
    }
}

/**
 * Handle semua button interactions
 */
async function handleButton(interaction) {
    const buttonId = interaction.customId;
    
    if (buttonId.endsWith('_ticket')) {
        await handleTicketButton(interaction);
    }
    else if (buttonId.startsWith('close_ticket_')) {
        await handleCloseButton(interaction);
    }
}

module.exports = {
    handleSlashCommand,
    handleButton
};