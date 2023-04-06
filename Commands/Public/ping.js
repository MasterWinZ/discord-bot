const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Pong')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute(interaction, client) {
    interaction.reply({ content: `BONK!! [${client.ws.ping} ms]` }) 
  }
}
