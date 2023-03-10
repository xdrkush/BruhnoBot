import {
    SlashCommandBuilder, CommandInteraction, Collection, PermissionResolvable,
    Message, AutocompleteInteraction, Channel
} from "discord.js"
import { OAuth2Namespace } from '@fastify/oauth2';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TOKEN_DISCORD: string,
            CLIENT_ID: string,
            PREFIX: string,
            OPENAI_API_KEY: string
        }
    }
}

declare module 'fastify' {
    interface FastifyInstance {
        discordOAuth2: OAuth2Namespace;
    }
}
declare module '@fastify/secure-session' {
    interface SessionData {
        foo: string;
    }
}


export interface BotEvent {
    name: string,
    once?: boolean | false,
    execute: (...args?) => void
}

export interface SlashCommand {
    command: SlashCommandBuilder | any,
    execute: (interaction: CommandInteraction) => void,
    autocomplete?: (interaction: AutocompleteInteraction) => void,
    cooldown?: number, // in seconds
    btn?: any,
    modal?: any
}

export interface Command {
    name: string,
    execute: (message: Message, args: Array<string>) => void,
    permissions: Array<PermissionResolvable>,
    aliases: Array<string>,
    cooldown?: number,
    btn?: any
}

declare module "discord.js" {
    export interface Client {
        slashCommands: Collection<string, SlashCommand>
        commands: Collection<string, Command>,
        cooldowns: Collection<string, number>
    }
}
