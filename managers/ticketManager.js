const { ChannelType, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config/config');
const { createTicketChannelEmbed } = require('../utils/embedBuilder');
const activeTickets = new Map();

/**
 * Membuat ticket baru
 */
async function createTicket(interaction, ticketType) {
    const member = interaction.member;
    const guild = interaction.guild;
    const existingTicket = activeTickets.get(member.id);
    if (existingTicket) {
        return {
            success: false,
            message: `Anda sudah memiliki ticket aktif! <#${existingTicket}>!`
        };
    }

    try {
        const ticketName = `ticket-${ticketType}-${member.user.username}`.toLowerCase();

        const ticketChannel = await guild.channels.create({
            name: ticketName,
            type: ChannelType.GuildText,
            parent: config.TICKET_CATEGORY_ID,
            permissionOverwrites: [
                {
                    id: guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: member.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory
                    ]
                },
                {
                    id: interaction.client.user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.ManageChannels
                    ]
                }
            ]
        });

        activeTickets.set(member.id, ticketChannel.id);

        const ticketEmbed = createTicketChannelEmbed(member, ticketType);
        const closeButton = new ButtonBuilder()
            .setCustomId(`close_ticket_${ticketChannel.id}`)
            .setLabel('Close Ticket')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔒');

        const closeRow = new ActionRowBuilder().addComponents(closeButton);

        await ticketChannel.send({
            content: `${member}`,
            embeds: [ticketEmbed],
            components: [closeRow]
        });

        return {
            success: true,
            channel: ticketChannel
        };

    } catch (error) {
        console.error('Error creating ticket:', error);
        return {
            success: false,
            message: 'Terjadi kesalahan saat membuat ticket!'
        };
    }
}

/**
 * Menutup ticket
 */
async function closeTicket(interaction) {
    const channelId = interaction.customId.replace('close_ticket_', '');
    const channel = interaction.channel;

    if (channel.id !== channelId) {
        return {
            success: false,
            message: 'Terjadi kesalahan!'
        };
    }

    for (const [userId, ticketId] of activeTickets.entries()) {
        if (ticketId === channelId) {
            activeTickets.delete(userId);
            break;
        }
    }

    await interaction.reply({
        content: 'Menutup ticket dalam 5 detik...'
    });

    setTimeout(async () => {
        try {
            await channel.delete();
        } catch (error) {
            console.error('Error deleting ticket channel:', error);
        }
    }, 5000);

    return { success: true };
}

/**
 * Cek apakah user memiliki ticket aktif
 */
function hasActiveTicket(userId) {
    return activeTickets.has(userId);
}

/**
 * Mendapatkan ID ticket aktif user
 */
function getActiveTicket(userId) {
    return activeTickets.get(userId);
}

module.exports = {
    createTicket,
    closeTicket,
    hasActiveTicket,
    getActiveTicket,
    activeTickets
};