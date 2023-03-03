import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { SlashCommand } from "src/types";
import { OpenAIClient } from "../client/OpenAI";

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("chatgpt")
        .setDescription("Talk with chat GPT.")
        .addStringOption(option =>
            option.setName('input')
                .setRequired(true)
                .setDescription('Votre question pour chat GPT.')), // warn with "," at end

    execute: async interaction => {
        if (!interaction.options.get("input")) return await interaction.reply("🚫 Oops !")
        
        await interaction.deferReply()

        const question = `${interaction.options.get("input")?.value}`
        const gptResponse = await new OpenAIClient().searchByString(question)

        await interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: "Chat GPT:" })
                    .setDescription(`🔎 Question: ${question} \n📡 réponse: ${gptResponse.data.choices[0].text}`)
            ]
        })

    },
    cooldown: 10
}

export default command