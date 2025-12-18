const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
const config = require('../config/config');
const { createTicketPanelEmbed } = require('../utils/embedBuilder');

/**
 * Handle command /panelticket
 */
async function handlePanelTicket(interaction) {
    const embed = createTicketPanelEmbed(interaction.guild);

    const buttons = config.TICKET_BUTTONS.map(btn => 
        new ButtonBuilder()
            .setCustomId(btn.id)
            .setLabel(btn.label)
            .setStyle(btn.style)
            .setEmoji(btn.emoji)
    );

    const row = new ActionRowBuilder().addComponents(buttons);

    await interaction.reply({
        embeds: [embed],
        components: [row]
    });
}

module.exports = {
    handlePanelTicket
};