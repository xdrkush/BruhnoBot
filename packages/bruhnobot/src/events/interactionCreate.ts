

import { Interaction } from "discord.js";
import { BotEvent } from "../types";

const event : BotEvent = {
    name: "interactionCreate",
    execute: async (interaction: Interaction) => {
        console.log('rooot', interaction.type)
        if (interaction.isChatInputCommand()) {
            let command = interaction.client.slashCommands.get(interaction.commandName)
            let cooldown = interaction.client.cooldowns.get(`${interaction.commandName}-${interaction.user.username}`)
            if (!command) return;
            if (command.cooldown && cooldown) {
                if (Date.now() < cooldown) {
                    interaction.reply(`You have to wait ${Math.floor(Math.abs(Date.now() - cooldown) / 1000)} second(s) to use this command again.`)
                    setTimeout(() => interaction.deleteReply(), 5000)
                    return
                }
                interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000)
                setTimeout(() => {
                    interaction.client.cooldowns.delete(`${interaction.commandName}-${interaction.user.username}`)
                }, command.cooldown * 1000)
            } else if (command.cooldown && !cooldown) {
                interaction.client.cooldowns.set(`${interaction.commandName}-${interaction.user.username}`, Date.now() + command.cooldown * 1000)
            }
            command.execute(interaction)

        } else if (interaction.isAutocomplete()) {
            const command = interaction.client.slashCommands.get(interaction.commandName);
            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                if(!command.autocomplete) return;
                command.autocomplete(interaction);
            } catch (error) {
                console.error(error);
            }

        } else if (interaction.isButton()) {
            console.log('rot', interaction)
            try {
                // console.log('interaction isButton', interaction)
                let command = interaction.client.slashCommands
                    .get(`${interaction.message.interaction?.commandName}`);
                    
                if (!command) return;
                await command.btn(interaction);
            
              } catch (e) {
                console.error(e);
                interaction.followUp({
                  content: e.message,
                  ephemeral: true
                });
              }
        }
    }
}

export default event;