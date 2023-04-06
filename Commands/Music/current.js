const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, VoiceChannel, GuildEmoji } = require('discord.js')
const client = require('../../index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('current')
    .setDescription('Display current playing song.'),

  async execute(interaction) {
    const { options, member, guild } = interaction;

    const seconds = options.getInteger('seconds');
    const voiceChannel = member.voice.channel;

    const embed = new EmbedBuilder();

    const status = queue =>
      `Volume: \`${queue.volume}%\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
      }\``


    if (!voiceChannel) {
      embed.setColor('Red').setDescription('You must be in voice channel.');
      return interaction.reply({ embeds: [embed] });
    }

    if (!member.voice.channelId == guild.members.me.voice.channelId) {
      embed.setColor('Red').setDescription(`Player already active in <#${guild.members.me.voice.channelId}>`)
      return interaction.reply({ embeds: [embed] });
    }

    try {
      const queue = await client.distube.getQueue(voiceChannel);

      if (!queue) {
          embed.setColor("Red").setDescription("There is no active queue.");
          return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const song = queue.songs[0];

      embed.setColor('Blue').setDescription(`Currently play: \`${song.name}\` - \`${song.formattedDuration}\`.\nLink: ${song.url}\n${status(queue)}`).setThumbnail(song.thumbnail);
      return interaction.reply({ embeds: [embed] })
    } catch (err) {
      console.log(err);
      
      embed.setColor('Red').setDescription('Something went wrong...');
      return interaction.reply({ embeds: [embed] });
    }
  }
}
