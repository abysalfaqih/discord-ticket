const config = require('../config/config');

/**
 * Cek permission user untuk command tertentu
 * @param {Interaction} interaction - Discord interaction
 * @param {string} requiredPermission - Tipe permission yang diperlukan
 * @returns {Object} - Object berisi status permission
 */
function checkPermission(interaction, requiredPermission) {
    const userId = interaction.user.id;
    const member = interaction.member;
    
    if (requiredPermission === 'all') {
        return { hasPermission: true };
    }
    
    const isDeveloper = userId === config.DEVELOPER_ID;
    const isAdmin = member.roles.cache.has(config.ADMIN_ROLE_ID);
    
    let hasPermission = false;
    
    switch (requiredPermission) {
        case 'developer':
            hasPermission = isDeveloper;
            break;
        case 'admin':
            hasPermission = isAdmin;
            break;
        case 'both':
            hasPermission = isDeveloper || isAdmin;
            break;
    }
    
    return {
        hasPermission,
        isDeveloper,
        isAdmin
    };
}

/**
 * Mendapatkan teks deskripsi permission
 * @param {string} permission - Tipe permission
 * @returns {string} - Teks deskripsi
 */
function getPermissionText(permission) {
    switch (permission) {
        case 'developer':
            return 'Developer Only';
        case 'admin':
            return 'Admin Role Only';
        case 'both':
            return 'Developer atau Admin';
        case 'all':
            return 'emua User';
        default:
            return 'Unknown';
    }
}

module.exports = {
    checkPermission,
    getPermissionText
};