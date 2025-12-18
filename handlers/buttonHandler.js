const { createTicket, closeTicket } = require('../managers/ticketManager');

/**
 * Handle button untuk membuat ticket
 */
async function handleTicketButton(interaction) {
    const buttonId = interaction.customId;
    const ticketType = buttonId.replace('_ticket', '');

    await interaction.deferReply({ ephemeral: true });

    const result = await createTicket(interaction, ticketType);

    if (result.success) {
        await interaction.editReply({
            content: `Ticket berhasil dibuat! ${result.channel}`,
            ephemeral: true
        });
    } else {
        await interaction.editReply({
            content: result.message,
            ephemeral: true
        });
    }
}

/**
 * Handle button untuk menutup ticket
 */
async function handleCloseButton(interaction) {
    const result = await closeTicket(interaction);

    if (!result.success && result.message) {
        await interaction.reply({
            content: result.message,
            ephemeral: true
        });
    }
}

module.exports = {
    handleTicketButton,
    handleCloseButton
};