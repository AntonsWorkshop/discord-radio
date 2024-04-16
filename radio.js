// Shared
const translation = require("./translation.json");
const { token, logchannelid, guildid } = require("./config.json");
const { Client, Intents, MessageEmbed } = require("discord.js");
const axios = require("axios");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
// FiveM
let radioChannel;
const identifier = {};

RegisterCommand("radio", (source, args) => {
  const channelNumber = Number(args[0]);
  radioChannel = channelNumber;
  identifier[source] = GetPlayerIdentifierByType(source, "discord");

  if (isNaN(channelNumber)) {
    emitNet("chat:addMessage", source, { args: [translation["only-numbers"]] });
  } else {
    DiscordConnect(radioChannel, identifier[source], source);
  }
});

// Discord bot


client.once("ready", () => {
  const logChannel = client.channels.cache.get(logchannelid);
  console.log("BOT ONLINE. Logged in as:", client.user.tag);

  const readyEmbed = new MessageEmbed()
    .setTitle(translation["bot-ready-title"])
    .setDescription(translation["bot-ready"])
    .setColor("GREEN")
    .setFooter('System made by © Anton\'s Workshop');
  logChannel.send({ embeds: [readyEmbed] });
  
});
function fiveReady() {
  const readyEmbed = new MessageEmbed()
    .setTitle(translation["system-ready"])
    .setDescription(translation["bot-ready"])
    .setColor("GREEN")
    .setFooter({ text: 'System made by © Anton\'s Workshop'});
  logChannel.send({ embeds: [readyEmbed] });
}
async function DiscordConnect(radioChan, identifier, source) {
  const dcIdentifier = identifier.split(":")[1];
  const radioNum = radioChan.toString();
  const botServer = client.guilds.cache.get(guildid);
  const member = await botServer.members.fetch(dcIdentifier);
  const logChannel = client.channels.cache.get(logchannelid);

  const connectingEmbed = new MessageEmbed()
    .setTitle(translation["connecting"])
    .setDescription(
      translation["player"] +
      `<@${dcIdentifier}>` +
      translation["trying-to-connect"] +
      ` ${radioNum}`
    )
    .setFooter({text: `Discord identifier: ${dcIdentifier} | System made by © Anton's Workshop`})
    .setColor("YELLOW");
  logChannel.send({ embeds: [connectingEmbed] });

  if (member) {
    const voiceChannel = botServer.channels.cache.find(
      (channel) => channel.name === radioNum && channel.type === "GUILD_VOICE"
    );

    if (voiceChannel) {
      try {
        await member.voice.setChannel(voiceChannel);
        console.log(
          `Moved user ${member.user.tag} to channel ${voiceChannel.name} | Identifier: ${dcIdentifier}`
        );

        emitNet("chat:addMessage", source, { args: [translation["you-were-moved"]] });

        const movedEmbed = new MessageEmbed()
          .setTitle(translation["success-moved-title"])
          .setDescription(
            translation["player"] +
            `<@${dcIdentifier}> ` +
            translation["success-moved"] +
            ` ${radioNum}`
          )
          .setFooter({text: `Discord identifier: ${dcIdentifier} | System made by © Anton's Workshop`})
          .setColor("GREEN");
        logChannel.send({ embeds: [movedEmbed] });
      } catch (error) {
        console.error("Error moving user:", error);

        const errorEmbed = new MessageEmbed()
          .setTitle("An error occurred!")
          .setDescription(error)
          .setFooter({text: 'System made by © Anton\'s Workshop'})
          .setColor("RED");
        logChannel.send({ embeds: [errorEmbed] });
      }
    } else {
      console.log(`${translation["not-found"]} '${voiceChannel}' ${translation["not-found-1"]}`);
      
    }
  } else {
    console.log("Member does not exist in the guild.");
  }
  versionChecker();
}

client.login(token);

// Version checker
async function versionChecker() {
  try {
    const versionFile = require("./version.json");
    const response = await axios.get("https://raw.githubusercontent.com/AntonsWorkshop/discord-radio/main/version.json");
    const jsonData = response.data;

    if (versionFile.version === jsonData.version) {
      console.log("You're up to date!");
    } else {
      const logChannel = client.channels.cache.get(logchannelid);
      console.log("New Update Available!");

      const updateEmbed = new MessageEmbed()
        .setTitle("New Update Available!")
        .setDescription(`Changelog: ${jsonData.changelog}`)
        .setColor("RED")
        .setFooter({text: 'System made by © Anton\'s Workshop'})

      logChannel.send({ embeds: [updateEmbed] });
      console.log("================================");
        console.log("");
        console.log("");
        console.log("");
        console.log("UPDATE AVAILABLE!");
        console.log(`Update ${jsonData.version} is out!`);
        console.log("Changelog:");
        console.log(`${jsonData.changelog}`);
        console.log(`^8${versionFile.version} ^0-> ^7${jsonData.version}^0`);
        console.log("");
        console.log("");
        console.log("System made by © Anton\'s Workshop");
        console.log("https://github.com/AntonsWorkshop/discord-radio/");
        console.log("================================");

      setInterval(versionChecker(), 3600000) // Check every hour.
    }
  } catch (error) {
    console.error("Error fetching version:", error);
  }
}
