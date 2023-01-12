import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js"
import { SlashCommand } from "../types";

const questions = [
    {
        id: 1, name: "Postman", category: "back", question: "À quoi sert l'outil postman ?",
        reponse: "C'est un outils de requetage HTTP, \nexemple: il pourrait nous être utile pour tester les routes sur une API."
    },
    {
        id: 2, name: "Fetch", category: "front", question: "À quoi sert fetch ?",
        reponse: "C'est une fonction devenu native en Javascript, afin d'effectuer une recherche de document, par le biais de requete http, ... il fait suite au module XMLHTTPREQUEST."
    },
    {
        id: 3, name: "Sitemap", category: "uml", question: "À quoi sert un sitemap ?",
        reponse: "Un sitemap est un plan/structure/architecture de notre siteweb effectuer via un schéma, afin d'identifier les pages, leurs enfants, les realtions et interactions entre elles."
    }
]

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("kuizz")
        .setDescription("Evaluate your skills,")
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Category for this question,')
                .setRequired(true)
                .addChoices(
                    { name: 'Random', value: 'random' },
                    { name: 'Front', value: 'front' },
                    { name: 'Back', value: 'back' },
                    { name: 'UML', value: 'uml' },
                )),
    execute: async interaction => {

        if (!interaction.options.get("category"))
            return await interaction.reply("🚫 Oops ! Une erreur est survenue")

        let question: any, filterQuestions;
        const val = interaction.options.get("category")?.value;

        if (val === "random")
            question = questions[Math.floor(Math.random() * questions.length)]
        else {
            filterQuestions = questions.filter(el => el.category === val)
            question = filterQuestions[Math.floor(Math.random() * filterQuestions.length)]
        }

        const row: any = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`${question.id}-${interaction.user.id}`)
                .setLabel("Tu donnes ta langue aux chattes ?")
                .setStyle(ButtonStyle.Danger)
        )

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `📡 Category: ${question.category}` })
                    .setDescription(`❓ Question: ${question.question}`)
            ],
            components: [
                row
            ]
        })
    },
    btn: (interaction: any) => {
        const [customId, userId] = interaction.customId.split('-')
        const [getQuestion]: any = questions.filter(el => el.id.toString() === customId)

        if (interaction.user.id === userId)
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: `${interaction.user.tag}` })
                        .setDescription(`❓ Réponse: ${getQuestion.reponse}`)
                ]
            })
        else interaction.reply({
            content: "Vous ne pouvez pas faire cette interaction !",
            ephemeral: true
        });
    },
    cooldown: 10,
}

export default command