# Struktur File
```my
discord-ticket/
│
├── config/
│   └── config.js
│
├── handlers/
│   ├── interactionHandler.js
│   ├── commandHandler.js
│   └── buttonHandler.js
│
├── managers/
│   └── ticketManager.js
│
├── utils/
│   ├── permissions.js
│   └── embedBuilder.js
│
├── .env
├── index.js
├── register-commands.js
└── package.json
```
# Penjelasan Module

1. config/config.js
- Token dan ID Discord
- Konfigurasi ticket buttons
- Permission settings untuk commands

2. handlers/interactionHandler.js
Handler utama yang menangani:
- Slash commands
- Button interactions
- Validasi permission

3. handlers/commandHandler.js
Menangani logika setiap slash command, misalnya:
- /panelticket - Membuat panel ticket
- Command tambahan dapat ditambahkan di sini

4. handlers/buttonHandler.js
Menangani interaksi button, misalnya:
- Membuat ticket baru
- Menutup ticket

5. managers/ticketManager.js
Mengelola sistem ticket, termasuk:
- Membuat channel ticket
- Menutup ticket
- Melacak ticket aktif

6. utils/permissions.js
Sistem pengecekan permission:
- Validasi role developer/admin
- Memastikan user memiliki hak akses yang sesuai

7. utils/embedBuilder.js
Template embed untuk berbagai pesan:
- Panel ticket
- Ticket channel
- Pesan error

8. index.js
File utama yang menjalankan bot dan menghubungkan semua modul.

# Menambahkan Command Baru

1. Tambahkan permission di config/config.js
```py
COMMAND_PERMISSIONS: {
    'panelticket': 'both',
    'newcommand': 'admin'
}
```

2. Buat handler baru di handlers/commandHandler.js
```py
async function handleNewCommand(interaction) {
    // logic nya disini
}

module.exports = {
    handlePanelTicket,
    handleNewCommand
}
```

3. Daftarkan command di handlers/interactionHandler.js
```py
switch (commandName) {
    case 'panelticket':
        await handlePanelTicket(interaction);
        break;
    case 'newcommand':
        await handleNewCommand(interaction);
        break;
}
```

4. Register command di register-commands.js
```py
const commands = [
    {
        name: 'panelticket',
        description: 'Membuat panel ticket',
    },
    {
        name: 'newcommand',
        description: 'Deskripsi command baru',
    }
];
```

# Instalasi

1. Clone repository:
```py
git clone https://github.com/abysalfaqih/discord-ticket.git
```

2. Install dependencies:
`npm install`

4. Tambahkan konfigurasi .env:
```py
DISCORD_TOKEN=
CLIENT_ID=
GUILD_ID=
```

4. Jalankan bot:
`node index.js`
