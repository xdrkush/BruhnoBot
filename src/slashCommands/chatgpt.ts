import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import { SlashCommand } from "src/types";
import { OpenAIClient } from "../client/OpenAI";
import { Configuration, OpenAIApi } from "openai";

// const configuration = new Configuration({
//     apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// async function test() {
//     const gptResponsee: any = await openai.createCompletion({
//         model: "text-davinci-003",
//         prompt: "What is node js ?",
//         max_tokens: 60,
//         temperature: 0.3,
//         top_p: 0.3,
//         presence_penalty: 0,
//         frequency_penalty: 0.5,
//     });
//     const gptResponse = await new OpenAIClient().searchByString("What is node js ?")

//     console.log('gpt', gptResponse)
// }
// test()

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("chatgpt")
        .setDescription("Talk with chat GPT.")
        .addStringOption(option =>
            option.setName('input')
                .setRequired(true)
                .setDescription('Votre question pour chat GPT.')), // warn with "," at end

    execute: async interaction => {
        if (!interaction.options.get("input"))
            return await interaction.reply("🚫 Oops !")

        const question = `${interaction.options.get("input")?.value}`
        const gptResponse = await new OpenAIClient().searchByString(question)

        await interaction.reply({
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