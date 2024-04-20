// Shared
const translation = require("./translation.json");
const { token, logchannelid, guildid, botPrefix } = require("./config.json");
const { Client, Intents, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const axios = require("axios");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.MESSAGE_CONTENT] });
// FiveM
var radioChannel;
var identifier = {};

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
  console.log("Bot is using prefix: " + botPrefix)
  const readyEmbed = new MessageEmbed()
    .setTitle(translation["bot-ready-title"])
    .setURL("https://discord.gg/W3ZPTYvg3g")
    .setDescription(translation["bot-ready"])
    .setColor("GREEN")
    .setFooter({ text: "System made by © Anton's Workshop" });
  logChannel.send({ embeds: [readyEmbed] });
  versionChecker();
});



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
        ` <@${dcIdentifier}> ` +
        translation["trying-to-connect"] +
        ` ${radioNum}`
    )
    .setFooter({
      text: `Discord identifier: ${dcIdentifier} | System made by © Anton's Workshop`,
    })
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

        emitNet("chat:addMessage", source, {
          args: [translation["you-were-moved"]],
        });

        const movedEmbed = new MessageEmbed()
          .setTitle(`${translation["succes-moved-title"]}`)
          
          .setDescription(translation["player"] + ` <@${dcIdentifier}> ` + translation["succes-moved"] +` ${radioNum}`
          )
          .setFooter({
            text: `Discord identifier: ${dcIdentifier} | System made by © Anton's Workshop`,
          })
          .setColor("GREEN");
        logChannel.send({ embeds: [movedEmbed] });
      } catch (error) {
        const row = new MessageActionRow()
          .addComponents(
            new MessageButton()
            .setLabel('Join Our Support Server!')
            .setStyle('LINK')
            .setURL('https://discord.gg/W3ZPTYvg3g')
          )
        
        const errorEmbed = new MessageEmbed()
          .setTitle("An error occurred!")
          .setURL("https://discord.gg/W3ZPTYvg3g")
          .setDescription('Please notify Anton\'s Workshop if this keeps happening!')
          .addFields({ name: "An error occurred!", value: `${error}` })
          .setFooter({ text: "System made by © Anton's Workshop" })
          .setColor("RED");
        logChannel.send({ embeds: [errorEmbed], components: [row] });
      }
    } else {
      console.log(
        `${translation["not-found"]} '${radioNum}' ${translation["not-found-1"]}`
      );
    }
  } else {
    console.log("Member does not exist in the guild.");
  }
}



client.login(token);

// Version checker
async function versionChecker() {
  try {
    const versionFile = require("./version.json");
    const response = await axios.get(
      "https://raw.githubusercontent.com/AntonsWorkshop/discord-radio/main/version.json"
    );
    const jsonData = response.data;

    if (versionFile.version === jsonData.version) {
      console.log("You're up to date!");
    } else {
      const logChannel = client.channels.cache.get(logchannelid);
      console.log("New Update Available!");
      const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
        .setLabel('Join Our Support Server!')
        .setStyle('LINK')
        .setURL('https://discord.gg/W3ZPTYvg3g')
      )
      const updateEmbed = new MessageEmbed()
        .setTitle("New Update Available!")
        .setURL("https://discord.gg/W3ZPTYvg3g")
        .setDescription(`**Changelog:**\n ${jsonData.changelog}`)
        .setColor("RED")
        .setFooter({ text: `System made by © Anton's Workshop` });

      logChannel.send({ embeds: [updateEmbed], components: [row] });
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
      console.log("System made by © Anton's Workshop");
      console.log("https://github.com/AntonsWorkshop/discord-radio/");
      console.log("================================");

      setInterval(function(){
        versionChecker()
      }, 1800000);
    }
  } catch (error) {
    console.error("Error fetching version:", error);
  }
}
