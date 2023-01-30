import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js"
import { SlashCommand } from "../types";
import { Question, IQuestion } from "../client/MongoDB";

const arrEmojiNumber = ['⏪', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '⏩']

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


                const message = await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setAuthor({ name: `${interaction.user.tag}` })
                            // .setDescription(` ${question.name} - ${question.id}`)
                            .setDescription(`Page: **${pageN.toString()}** / **${nbrPages}** | Total: **${questions.length}** ${page.map((el, i) => {
                                return `\n ${arrEmojiNumber[i + 1]} - ${el.question.slice(0, 40)} : **${el.id}**`
                            })}`)
                            .setTimestamp()
                    ],
                    fetchReply: true
                })
                console.log('message', message)

                message.channel.messages.fetch(message.id)
                    .then((msg) => {
                        msg.react('👍')
                        const filter = (reaction: any, user: any) => {
                            return true;
                        };

                        message.awaitReactions({filter, time: 60000})
                            .then((collected) => {
                                console.log("collected",collected)
                                const reaction = collected.first();

                                if (reaction?.emoji.name === '👍') {
                                    console.log(`${reaction?.count} personnes ont réagi avec 👍.`);
                                } else {
                                    console.log(`${reaction?.count} personnes ont réagi avec 👎.`);
                                }
                            })
                            .catch(console.error);
                    })
                    .catch(console.error);





            // // message.react('1️⃣');
            // message.react('👍')
            //     .then(() => message.react('👎'))
            //     .then(() => {
            //         const filter = (reaction: any, user: any) => {
            //             return reaction.emoji.name === '👍' && user.id === message.author.id;
            //         };

            //         message.awaitReactions({ filter, max: 4, time: 60000, errors: ['time'] })
            //             .then(collected => console.log(collected.size))
            //             .catch(collected => {
            //                 console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
            //             });
            //     });


            // const filter = (reaction: any, user: any) => {
            //     return reaction.emoji.name === '👍' && user.id === message.author.id;
            // };

            // message.awaitReactions({ filter, max: 4, time: 60000, errors: ['time'] })
            //     .then(collected => console.log(collected.size))
            //     .catch(collected => {
            //         console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
            //     });

            // const message = await interaction.fetchReply();
            // console.log("message", message);
        }

    },

    async btn(interaction: any) {
        console.log('interaction', interaction.type, interaction)

        const questions = await Question.find();

        // try {
        const [commandName, action, pageN, idMessageParent] = interaction.customId.split('-')
        const tmpArray = [...questions]
        // const message = await interaction.fetchReply()
        console.log('btn', action, Number(pageN), commandName)
        const nbrParPage = 10 // nbr item par page
        const nbrPages = (tmpArray.length - 1) / nbrParPage // nbr de page au total
        // const pageN = 1 // le numero de la page que je veux
        const page = tmpArray
            .slice((Number(pageN) * nbrParPage) - nbrParPage, Number(pageN) * nbrParPage) // la page que l'on veux rendre (de l'item N à N)


        interaction.message.fetch(interaction.message.id)
            .then((msg: any) => {
                console.log('msg', msg)
                const receivedEmbed = msg.embeds[0];
                const embed = EmbedBuilder.from(receivedEmbed)
                    .setAuthor({ name: `${interaction.user.tag}` })
                    // .setDescription(` ${question.name} - ${question.id}`)
                    .setDescription(`Page: **${pageN.toString()}** / **${nbrPages}** | Total: **${questions.length}** ${page.map((el, i) => {
                        return `\n ${arrEmojiNumber[i]} - ${el.question.slice(0, 40)} : **${el.id}**`
                    })}`)

                msg.edit({ embeds: [embed] })
                    .catch(console.error);
            })
            .catch(console.error);
        // await interaction.deferReply()

        // const row: any = new ActionRowBuilder()
        //     .addComponents(
        //         new ButtonBuilder()
        //             .setCustomId(`question-prev-${Number(pageN) - 1}-${interaction.message.id}`)
        //             .setLabel("previous")
        //             .setStyle(ButtonStyle.Primary)
        //     ).addComponents(
        //         new ButtonBuilder()
        //             .setCustomId(`question-next-${Number(pageN) + 1}-${interaction.message.id}`)
        //             .setLabel("next")
        //             .setStyle(ButtonStyle.Primary)
        //     )

        // ré_intégrer le intéraction commands dans la commande button 
        // Pour qu'il soit détecter dans le event interaction button 
        // en relation avec cette commande
        // qui est la reponse de la reponse de cette commande

        // interaction = { ...interaction, message: { ...interaction.message, interaction: { ...interaction.message.interaction }}}


        // await interaction.followUp({
        //     embeds: [
        // new EmbedBuilder()
        // .setAuthor({ name: `${interaction.user.tag}` })
        // // .setDescription(` ${question.name} - ${question.id}`)
        // .setDescription(`Page: **${pageN.toString()}** / **${nbrPages}** | Total: **${questions.length}** ${page.map((el, i) => {
        //     return `\n ${arrEmojiNumber[i]} - ${el.question.slice(0, 40)} : **${el.id}**`
        // })}`)
        // .setTimestamp()
        //     .setTimestamp()
        //     ],
        //     components: [
        //         row
        //     ],
        //     ephemeral: true
        // })

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