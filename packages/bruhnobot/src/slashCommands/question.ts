import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js"
import { SlashCommand } from "../types";
import { Question, IQuestion } from "../client/MongoDB";

const arrEmojiNumber = ['1️⃣','2️⃣', '3️⃣', '4️⃣','5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟']

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("question")
        .setDescription("Manage Question,")
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Tu veux créé/édité/supprimer une question ?')
                .setRequired(true)
                .addChoices(
                    { name: 'get', value: 'get' },
                    { name: 'create', value: 'create' },
                    { name: 'edit', value: 'edit' },
                    { name: 'delete', value: 'delete' },
                ))
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Category for this question,')
                .setRequired(false)
                .addChoices(
                    { name: 'Front', value: 'front' },
                    { name: 'Back', value: 'back' },
                    { name: 'System', value: 'system' },
                    { name: 'Database', value: 'database' },
                    { name: 'UML', value: 'uml' },
                    { name: 'Web', value: 'web' },
                ))
        .addStringOption(option =>
            option.setName('name')
                .setRequired(false)
                .setDescription('Définir la thématique en 1 mot'))
        .addStringOption(option =>
            option.setName('question')
                .setRequired(false)
                .setDescription('Écrivez votre question')),

    execute: async interaction => {
        const questions = await Question.find();
        const action = interaction.options.get("action")?.value;
        const category = interaction.options.get("category")?.value;
        const name = interaction.options.get("name")?.value;
        const question = interaction.options.get("question")?.value;

        switch (action) {
            case 'get':
                const tmpArray = [...questions]
                const nbrParPage = 10 // nbr item par page
                const nbrPages = (tmpArray.length - 1) / nbrParPage // nbr de page au total
                const pageN = 1 // le numero de la page que je veux
                const page = tmpArray.slice((pageN * nbrParPage) - nbrParPage, pageN * nbrParPage) // la page que l'on veux rendre (de l'item N à N)

                // page-1 = 0 - 19
                // page-2 = 20 - 39 
                // ..

                // console.log('pagination', questions.length, nbrPages, page)

                // await interaction.deferReply()

                const row: any = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`prev-${pageN - 1}`)
                            .setLabel("previous")
                            .setStyle(ButtonStyle.Primary)
                    ).addComponents(
                        new ButtonBuilder()
                            .setCustomId(`next-${pageN + 1}`)
                            .setLabel("next")
                            .setStyle(ButtonStyle.Primary)
                    )

                const message = await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: `${interaction.user.tag}` })
                            // .setDescription(` ${question.name} - ${question.id}`)
                            .setDescription(`Page: **${pageN.toString()}** / **${nbrPages}** | Total: **${questions.length}** ${page.map((el, i) => {
                                return `\n ${ arrEmojiNumber[i] } - ${el.question.slice(0, 40)} : **${el.id}**`
                            })}`)
                            .setTimestamp()
                    ],
                    components: [
                        row
                    ],
                    fetchReply: true
                })

                arrEmojiNumber.forEach(el => message.react(el))
                // message.react('1️⃣');
                // message.react('2️⃣');
                // message.react('3️⃣');
                // message.react('4️⃣');
                // message.react('5️⃣');
                // message.react('6️⃣');
                // message.react('7️⃣');
                // message.react('8️⃣');
                // message.react('9️⃣');
                // message.react('🔟');

                break;
            case 'create':
                await Question.create({ action, category, name, question })

                interaction.reply("Votre question à été crée avec succès !")
                break;

            case 'edit':

                interaction.reply("Votre question à été édité avec succès !")
                break;

            case 'delete':

                interaction.reply("Votre question à été delete avec succès !")
                break;

            default:
                interaction.reply("Une erreur de commande à été omise !")
                break;
        }

    },

    async btn(interaction: any) {
        console.log('interaction', interaction.type)
        const questions = await Question.find();
        // try {
        const [action, pageN] = interaction.customId.split('-')
        const tmpArray = [...questions]
        console.log('btn', Number(pageN))
        const nbrParPage = 10 // nbr item par page
        const nbrPages = (tmpArray.length - 1) / nbrParPage // nbr de page au total
        // const pageN = 1 // le numero de la page que je veux
        const page = tmpArray
            .slice((Number(pageN) * nbrParPage) - nbrParPage, Number(pageN) * nbrParPage) // la page que l'on veux rendre (de l'item N à N)

        await interaction.deferReply()

        const row: any = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`prev-${Number(pageN) - 1}`)
                    .setLabel("previous")
                    .setStyle(ButtonStyle.Primary)
            ).addComponents(
                new ButtonBuilder()
                    .setCustomId(`next-${Number(pageN) + 1}`)
                    .setLabel("next")
                    .setStyle(ButtonStyle.Secondary)
            )

        // ré_intégrer le intéraction commands dans la commande button 
        // Pour qu'il soit détecter dans le event interaction button 
        // en relation avec cette commande
        // qui est la reponse de la reponse de cette commande

        // interaction = { ...interaction, message: { ...interaction.message, interaction: { ...interaction.message.interaction }}}

        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.tag}` })
                    // .setDescription(` ${question.name} - ${question.id}`)
                    .setDescription(`Page: ${pageN.toString()} de ${((pageN * nbrParPage) - nbrParPage) + 1} / ${pageN * nbrParPage} ${page.map(el => {
                        return `\n- ${el.question.slice(0, 40)} : **${el.id}**`
                    })}`)
                    .setTimestamp()
            ],
            components: [
                row
            ],
            ephemeral: true
        })

        // } catch (error) {
        //     interaction.reply({
        //         content: "Une erreur est survenue !",
        //         ephemeral: true
        //     });
        // }
    },
    cooldown: 10,
}

export default command