const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');

const { DisTube } = require('distube')
const { SpotifyPlugin } = require('@distube/spotify')
const { YtDlpPlugin } = require('@distube/yt-dlp')

const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember, Channel } = Partials;

const { loadEvents } = require('./Handlers/eventHandler');
const { loadCommands } = require('./Handlers/commandHandler');

const client = new Client({
  intents: [Guilds, GuildMembers, GuildMessages, GuildVoiceStates],
  partials: [User, Message, GuildMember, ThreadMember]
});

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: false,
  leaveOnStop: false,
  emitAddSongWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin(),
    new YtDlpPlugin()
  ]
});

client.commands = new Collection();
client.config = require('./config.json');

module.exports = client;

client.login(client.config.token).then(() => {
  loadEvents(client);
  loadCommands(client);
});
