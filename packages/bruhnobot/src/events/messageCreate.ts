
import { ChannelType, Message } from "discord.js";
import { BotEvent } from "../types";
import { Twitch_Cli } from "../index";

const event: BotEvent = {
    name: "messageCreate",
    execute: async (message: Message) => {
        if (message.author.bot) return;
        
        // Instance Twitch
        if (message.channelId === process.env.DISCORD_CHANNEL)
            Twitch_Cli.client.say("hsukrd", `${message.author.username} > ${message.content}`)

        if (!message.member || message.member.user.bot) return;
        if (!message.guild) return;
        let prefix = process.env.PREFIX

        if (!message.content.startsWith(prefix)) return;
        if (message.channel.type !== ChannelType.GuildText) return;

        let args = message.content.substring(prefix.length).split(" ")
        let command = message.client.commands.get(args[0])

        if (!command) {
            let commandFromAlias = message.client.commands.find((command) => command.aliases.includes(args[0]))
            if (commandFromAlias) command = commandFromAlias
            else return;
        }

        command.execute(message, args)
    }
}

export default event