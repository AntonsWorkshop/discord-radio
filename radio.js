// Shared
const translation = require('./translation.json');
// FiveM 
var radioChannel;
var identifier = {};
RegisterCommand('radio', (source, args, raw) => {
    var channelNumber = Number(args[0])
    radioChannel = channelNumber
    identifier = identifier[source] = GetPlayerIdentifierByType(source, 'discord')
    
    if(isNaN(channelNumber) ){
        emitNet('chat:addMessage', source, {
            args: [ translation['only-numbers'] ]
        })
    }else{
        DiscordConnect(radioChannel, identifier, source)
    }
    
    
})

// Discord bot

const { Client, Intents, MessageEmbed, Collection } = require('discord.js');
const { token, logchannelid, guildid } = require('./config.json')
const fs = require('node:fs')
const axios = require('axios')
const client = new Client({ intents: [ Intents.FLAGS.GUILDS ] });







client.once('ready', () => {
    const logChannel = client.channels.cache.get(logchannelid);
    console.log('BOT ONLINE. Logged in as:  ', client.user.tag);
    // logChannel.send('Bot is online')
    const readyEmbed = new MessageEmbed()
        .setTitle(translation['bot-ready-title'])
        .setDescription(translation['bot-ready'])
        .setColor("GREEN")
    logChannel.send({ embeds: [readyEmbed]});
})


async function DiscordConnect(radioChan, identifier, source){
        
        var dcIdentifier = identifier;
        var dcId = dcIdentifier.split(':')[1];
        var radioNum = radioChan.toString();
        const botServer = client.guilds.cache.get(guildid); 
        const member = await botServer.members.fetch(dcId);
    
        const logChannel = client.channels.cache.get(logchannelid);
                
                // logChannel.send('Bot is online')
                const readyEmbed = new MessageEmbed()
                    .setTitle(translation['connecting'])
                    .setDescription(translation['player'] + `<@${dcId}>` + translation['trying-to-connect'] + ` ${radioNum}`)
                    .setFooter(`Discord identifier: ${dcIdentifier}`)
                    .setColor("YELLOW")
                logChannel.send({ embeds: [readyEmbed]});

         if (member) {
        
        const voiceChannel = botServer.channels.cache.find(channel => channel.name === radioNum && channel.type === 'GUILD_VOICE');
        
        if (voiceChannel) {
            try {
                await member.voice.setChannel(botServer.channels.cache.find(channel => channel.name === radioNum))
                console.log(`Moved user ${member.user.tag} to channel ${voiceChannel.name}`);

                emitNet('chat:addMessage', source, {
                    args: [ translation['you-were-moved'] ]
                })

                const logChannel = client.channels.cache.get(logchannelid);
                
                
                const readyEmbed = new MessageEmbed()
                    .setTitle(translation['succes-moved-title'])
                    .setDescription(translation['player'] + `<@${dcId}>` + translation['succes-moved'] + ` ${radioNum}`)
                    .setFooter(`Discord identifier: ${dcIdentifier}`)
                    .setColor("GREEN")
                logChannel.send({ embeds: [readyEmbed]});

            } catch (error) {
                console.error('Error moving user:', error);
            }
        } else {
            console.log(`Voice channel '${radioChan}' not found.`);
        }
    } else {
        console.log('Member does not exist in the guild.');
    }
        
        
        
}
    


client.login(token)









// Version checker

