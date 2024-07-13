
# FiveM Discord Radio

Discord Radio is a different way to communicate. We all know the "build-in" voice chat, and all of the resources allowing us to communicate using the radio. This resource takes this outside of FiveM. Meaning? Well it's on Discord.. 




## Installation

Installation is quite simple. Simply drag and drop it in your resource folder.

But it also requires some setting up.

*Also, [enable Discord Developer Mode](https://support-dev.discord.com/hc/en-us/articles/360028717192-Where-can-I-find-my-Application-Team-Server-ID#:~:text=Head%20into%20User%20Settings%20%3E%20Appearance%20%3E%20Advanced%20%26%20enable%20Developer%20Mode.).*

#### MAKE SURE YOU HAVE YARN

Open `config.json`. You'll see the next content:

```json
{
    "token": "",
    "guildid": "",
    "logchannelid": "",
    "botPrefix": "!"
}
``` 

- `token` is the bot token, you'll need to [Create a bot](https://discordjs.guide/preparations/setting-up-a-bot-application). After that [add it to your server](https://discordjs.guide/preparations/adding-your-bot-to-servers).

- `guildid` is your server ID, this is your Discord server. You can find this ID by right clicking the server icon after enabling Discord Developer Mode.

- `logchannelid` is where the bot will log all of it's actions & requests. You can find this by right clicking the channel you want to log everything to.

- `botPrefix` is the prefix the commands will have. For example: `!` or `%`.

> ``📝`` Please note that these values are REQUIRED. Not filling one out will make the bot not work, or throw error's.



## Usage

When in-game use the command `/radio <channelnummer>`. The bot will look for any channels that have matching numbers. Please note that you'll need to set these channels up yourself.




## Support

For support, join our discord server. https://discord.com/antonsworkshop.




## Authors

- [@antonsworkshop](https://www.github.com/antonsworkshop)


## Used By

This project is currently being used & tested by [NLPDFR](https://nlpdfr.nl/). A Dutch FiveM server.

- https://discord.com/nlpdfr
- https://nlpdfr.nl/

