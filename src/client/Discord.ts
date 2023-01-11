import { Client, GatewayIntentBits, Collection, PermissionFlagsBits, TextChannel } from "discord.js";
const { Guilds, MessageContent, GuildMessages, GuildMembers } = GatewayIntentBits

import { Command, SlashCommand } from "../types";
import { readdirSync } from "fs";
import { join } from "path";

export class DiscordClient {
    client: Client

    constructor() {
        this.client = new Client({ intents: [Guilds, MessageContent, GuildMessages, GuildMembers] })
    }

    initConfig() {
        this.client.slashCommands = new Collection<string, SlashCommand>()
        this.client.commands = new Collection<string, Command>()
        this.client.cooldowns = new Collection<string, number>()

        const handlersDir = join(__dirname, "../handlers")
        readdirSync(handlersDir).forEach(handler => {
            require(`${handlersDir}/${handler}`)(this.client)
        })
    }

    run () {
        this.client.login(process.env.TOKEN_DISCORD);
    }
}
