const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, VoiceChannel, GuildEmoji } = require('discord.js')
const client = require('../../index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song.')
      .addStringOption(option =>
        option.setName('query')
          .setDescription('Provide the name or url of the song.')
          .setRequired(true)
      ),
  async execute(interaction) {
    const { options, member, guild, channel } = interaction;

    const query = options.getString('query');
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
      client.distube.play(voiceChannel, query, { textChannel: channel, member: member });

      embed.setColor('Blue').setDescription('Request recieved')
      return interaction.reply({ embeds: [embed] })
    } catch (err) {
      console.log(err);
      
      embed.setColor('Red').setDescription('Something went wrong...');
      return interaction.reply({ embeds: [embed] });
    }
  }
}
