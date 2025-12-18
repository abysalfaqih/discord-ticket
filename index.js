const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

//Konfigurasi dari .env
const CONFIG = {
    TOKEN: process.env.BOT_TOKEN,
    GUILD_ID: process.env.GUILD_ID,
    CLIENT_ID: process.env.CLIENT_ID,
    TICKET_CATEGORY_ID: process.env.TICKET_CATEGORY_ID,

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
    ]
};

const activeTickets = new Map();

client.once('ready', () => {
    console.log(`Bot online ${client.user.tag}`);
    console.log(`Server: ${client.guilds.cache.size}`);
    console.log(`Users: ${client.users.cache.size}`);
});

client.on('interactionCreate', async interaction => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'panelticket') {
            await handlePanelTicket(interaction);
        }
    }
    
    if (interaction.isButton()) {
        const buttonId = interaction.customId;
        
        if (buttonId.endsWith('_ticket')) {
            await handleTicketCreation(interaction);
        } else if (buttonId.startsWith('close_ticket_')) {
            await handleTicketClose(interaction);
        }
    }
});

async function handlePanelTicket(interaction) {
    // Embed untuk Ticket Panel
    const embed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎫 Support Ticket')
        .setDescription(
            '**Selamat datang di NAMA_DISCORD_LU!**\n\n' +
            'Silakan pilih kategori ticket sesuai kebutuhan Anda:\n\n' +
            '**Order** - Untuk melakukan pemesanan produk\n' +
            '**Ask Question** - Untuk bertanya atau konsultasi\n\n' +
            'Klik tombol di bawah untuk membuat ticket!'
        )
        .setThumbnail(interaction.guild.iconURL())
        .setFooter({ text: 'NAMA_DISCORD_LU' })
        .setTimestamp();

    const buttons = CONFIG.TICKET_BUTTONS.map(btn => 
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

async function handleTicketCreation(interaction) {
    const buttonId = interaction.customId;
    const member = interaction.member;
    const guild = interaction.guild;

    const existingTicket = activeTickets.get(member.id);
    if (existingTicket) {
        return interaction.reply({
            content: `Anda sudah memiliki ticket aktif! <#${existingTicket}>!`,
            ephemeral: true
        });
    }

    await interaction.deferReply({ ephemeral: true });

    try {
        const ticketType = buttonId.replace('_ticket', '');
        const ticketName = `ticket-${ticketType}-${member.user.username}`.toLowerCase();

        // Buat channel ticket
        const ticketChannel = await guild.channels.create({
            name: ticketName,
            type: ChannelType.GuildText,
            parent: CONFIG.TICKET_CATEGORY_ID,
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
                    id: client.user.id,
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

        const ticketEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle(`🎫 Ticket ${ticketType.toUpperCase()}`)
            .setDescription(
                `**Halo ${member}!**\n\n` +
                `Terima kasih telah membuat ticket di **NAMA_DISCORD_LU**.\n\n` +
                `**Tipe Ticket:** ${ticketType.toUpperCase()}\n` +
                `**User:** ${member.user.tag}\n` +
                `**Dibuat:** <t:${Math.floor(Date.now() / 1000)}:R>\n\n` +
                `Staff kami akan segera membantu Anda. Mohon tunggu sebentar!\n\n` +
                `*Untuk menutup ticket, klik tombol di bawah.*`
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({ text: 'NAMA_DISCORD_LU' })
            .setTimestamp();

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

        await interaction.editReply({
            content: `Ticket berhasil dibuat! Silakan cek ${ticketChannel}`,
            ephemeral: true
        });

    } catch (error) {
        console.error('Error creating ticket:', error);
        await interaction.editReply({
            content: 'Terjadi kesalahan saat membuat ticket!',
            ephemeral: true
        });
    }
}

async function handleTicketClose(interaction) {
    const channelId = interaction.customId.replace('close_ticket_', '');
    const channel = interaction.channel;

    if (channel.id !== channelId) {
        return interaction.reply({
            content: 'Terjadi kesalahan!',
            ephemeral: true
        });
    }

    await interaction.reply({
        content: 'Menutup ticket dalam 5 detik...'
    });

    for (const [userId, ticketId] of activeTickets.entries()) {
        if (ticketId === channelId) {
            activeTickets.delete(userId);
            break;
        }
    }

    setTimeout(async () => {
        try {
            await channel.delete();
        } catch (error) {
            console.error('Error deleting ticket channel:', error);
        }
    }, 5000);
}

client.login(CONFIG.TOKEN);