// Client
import { DiscordClient } from './client/Discord';
import { TwitchClient } from './client/Twitch';
import { MongoDB } from './client/MongoDB';
import { ServerClient } from './client/Server';

// Config
import { config } from "dotenv"
config() // .env

console.log("Bot is starting...");

// Instance
export const Discord_Cli = new DiscordClient()
Discord_Cli.initConfig()
Discord_Cli.run()

export const Twitch_Cli = new TwitchClient()
Twitch_Cli.initConfig()
Twitch_Cli.run()

const Mongo_Cli = new MongoDB()
Mongo_Cli.run()
// Mongo_Cli.test() // inject data

export const Server_Cli = new ServerClient()
Server_Cli.initConfig()
Server_Cli.run()