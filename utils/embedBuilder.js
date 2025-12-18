const { EmbedBuilder } = require('discord.js');

/**
 * Embed untuk Ticket Panel
 */
function createTicketPanelEmbed(guild) {
    return new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle('🎫 Support Ticket')
        .setDescription(
            '**Selamat datang di NAMA_DISCORD_LU!**\n\n' +
            'Silakan pilih kategori ticket sesuai kebutuhan Anda:\n\n' +
            '**Order** - Untuk melakukan pemesanan produk\n' +
            '**Ask Question** - Untuk bertanya atau konsultasi\n\n' +
            'Klik tombol di bawah untuk membuat ticket!'
        )
        .setThumbnail(guild.iconURL())
        .setFooter({ text: 'NAMA_DISCORD_LU' })
        .setTimestamp();
}

/**
 * Embed untuk Ticket Channel
 */
function createTicketChannelEmbed(member, ticketType) {
    return new EmbedBuilder()
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
}

/**
 * Embed untuk Error Permission
 */
function createPermissionErrorEmbed(commandName, requiredPermission) {
    const { getPermissionText } = require('./permissions');
    
    return new EmbedBuilder()
        .setColor('#ff0000')
        .setTitle('❌ Akses Ditolak')
        .setDescription(
            '**Anda tidak memiliki izin untuk menggunakan command ini!**\n\n' +
            `Command: \`/${commandName}\`\n` +
            `Diperlukan: ${getPermissionText(requiredPermission)}`
        )
        .setFooter({ text: 'NAMA_DISCORD_LU' })
        .setTimestamp();
}

module.exports = {
    createTicketPanelEmbed,
    createTicketChannelEmbed,
    createPermissionErrorEmbed
};