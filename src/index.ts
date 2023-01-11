// Client
import { DiscordClient } from './client/Discord';
import { TwitchClient } from './client/Twitch';

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
