const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, VoiceChannel, GuildEmoji } = require('discord.js')
const client = require('../../index');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Display loop options.')
    .addStringOption(option => 
      option.setName('options')
        .setDescription('Loop options.')
        .addChoices(
          { name: 'off', value: 'off' },
          { name: 'song', value: 'song' },
          { name: 'queue', value: 'queue' },
        )
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options, member, guild } = interaction;

    const option = options.getString('options');
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
      const queue = await client.distube.getQueue(voiceChannel);

      if (!queue) {
          embed.setColor("Red").setDescription("There is no active queue.");
          return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      let mode = null;

      switch (option) {
        case 'off':
          mode = 0;
          break;
        case 'song':
          mode = 1;
          break;
        case 'queue':
          mode = 2;
          break;
      }

      mode = await queue.setRepeatMode(mode);

      mode = mode ? (mode === 2 ? 'Repeat queue' : 'Repeat song') : 'Off';

      embed.setColor('Orange').setDescription(`Set repeat mode to \`${mode}\`.`);
      return interaction.reply({ embeds: [embed] })
    } catch (err) {
      console.log(err);
      
      embed.setColor('Red').setDescription('Something went wrong...');
      return interaction.reply({ embeds: [embed] });
    }
  }
}
