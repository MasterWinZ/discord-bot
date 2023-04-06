const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, VoiceChannel, GuildEmoji } = require('discord.js')
const client = require('../../index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('Adjust volume.')
    .addIntegerOption(option =>
      option.setName('percent')
        .setDescription('Volumn percentage.')
        .setMinValue(0)
        .setMaxValue(100)
        .setRequired(true)
    ),
  async execute(interaction) {
    const { options, member, guild } = interaction;

    const percent = options.getInteger('percent');
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    if (!voiceChannel) {
      embed.setColor('Red').setDescription('You must be in voice channel.');
      return interaction.reply({ embeds: [embed] });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed.setColor('Red').setDescription(`Player already active in <#${guild.members.me.voice.channelId}>`)
      return interaction.reply({ embeds: [embed] });
    }

    try {
      client.distube.setVolume(voiceChannel, percent);

      embed.setColor('Green').setDescription(`Volume has been set to ${percent}%.`)
      return interaction.reply({ embeds: [embed] })
    } catch (err) {
      console.log(err);
      
      embed.setColor('Red').setDescription('Something went wrong...');
      return interaction.reply({ embeds: [embed] });
    }
  }
}
