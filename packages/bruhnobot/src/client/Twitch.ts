import { TextChannel } from "discord.js";
import { Client } from "tmi.js";
import { Discord_Cli } from "../index"

export class TwitchClient {
    client: Client;

    constructor() {
        this.client = new Client({
            options: {
                debug: false
            },
            connection: {
                reconnect: true
            },
            identity: {
                username: `${process.env.TWITCH_NAME_CHANNEL}`,
                password: `${process.env.TWITCH_TOKEN_CHANNEL}`
            },
            channels: [
                "xdrkush"
            ]
        });
    }

    initConfig() {
        this.client.connect();

        this.client.on('connected', () => {
            console.log("Twitch bot ready");
        });
    }

    run() {
        // Fn listen chat live to discord
        this.client.on('message', async (channel, tags, message, isSelf) => {
            if (isSelf) return;
            const channelDiscord: TextChannel = await Discord_Cli.client.channels.fetch(`${process.env.DISCORD_CHANNEL}`) as TextChannel;
            channelDiscord.send(`**\`\`${tags.username}\`\`** : ${message}`)
        });
    }

}