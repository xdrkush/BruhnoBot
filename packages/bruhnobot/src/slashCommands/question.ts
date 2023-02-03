import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, TextInputBuilder, ModalBuilder, TextInputStyle } from "discord.js"
import { SlashCommand } from "../types";
import { Question, IQuestion } from "../client/MongoDB";
import { OpenAIClient } from "../client/OpenAI";

const arrEmojiNumber = ['⏪', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '⏩']

// Quand je delete il ne remet pas le embed de la commande précédente à jour

const command: SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("question")
        .setDescription("Manage Question,")
    ,
    execute: async interaction => {
        const questions = await Question.find();

        let tmpArray = [...await Question.find()]
        let pageN = 1 // le numero de la page que je veux
        const nbrParPage = 10 // nbr item par page
        const nbrPages = Math.floor((tmpArray.length - 1) / nbrParPage) + 1 // nbr de page au total
        let page = tmpArray.slice((pageN * nbrParPage) - nbrParPage, pageN * nbrParPage) // la page que l'on veux rendre (de l'item N à N)

        // page-1 = 0 - 19
        // page-2 = 20 - 39 
        // ..
        // console.log('pagination', questions.length, nbrPages, page)

        const row: any = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`question-create`)
                .setLabel("Créé une nouvelle question ?")
                .setStyle(ButtonStyle.Secondary)
        )

        const message = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: `${interaction.user.tag}` })
                    .setDescription(`
                                Page: **${pageN}** / **${nbrPages}** **|** Total: **${questions.length}** questions
                                ${page.map((el, i) => {
                        return `\n ${arrEmojiNumber[i + 1]} - ${el.question.slice(0, 70)}`
                    })}
                            `)
                    .setFooter({ text: "Vous avez 5 minutes pour répondre" })
                    .setTimestamp()
            ],
            components: [row],
            fetchReply: true
        })
        console.log('message', message)

        const filter = (reaction: any, user: any) => {
            return user.id !== message.author.id; // for collected reaction if not bot (message by bot)
        };

        arrEmojiNumber.forEach(el => message.react(el))

        const collector = message.createReactionCollector({ filter, time: 5 * 60 * 1000 });

        collector.on('collect', async (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
            // await interaction.followUp(`${reaction.emoji.name} from ${user.tag}`)

            if (reaction?.emoji.name === "⏪") {
                if (pageN === 1) return;
                pageN--
                tmpArray = [...await Question.find()]
                page = tmpArray.slice((pageN * nbrParPage) - nbrParPage, pageN * nbrParPage)

                console.log('Previous', pageN, page)

                const receivedEmbed = message.embeds[0];
                const embed = EmbedBuilder.from(receivedEmbed)
                    .setDescription(`
                            Page: **${pageN}** / **${nbrPages}** **|** Total: **${questions.length}** questions
                            ${page.map((el, i) => {
                        return `\n ${arrEmojiNumber[i + 1]} - ${el.question.slice(0, 70)}`
                    })}
                        `)

                message.edit({ embeds: [embed] })
                    .catch(console.error);
            } else if (reaction?.emoji.name === "⏩") {
                if (pageN === nbrPages) return;
                pageN++
                tmpArray = [...await Question.find()]
                page = tmpArray.slice((pageN * nbrParPage) - nbrParPage, pageN * nbrParPage)

                console.log('Next', pageN, page)

                const receivedEmbed = message.embeds[0];
                const embed = EmbedBuilder.from(receivedEmbed)
                    .setDescription(`
                            Page: **${pageN}** / **${nbrPages}** **|** Total: **${questions.length}** questions
                            ${page.map((el, i) => {
                        return `\n ${arrEmojiNumber[i + 1]} - ${el.question.slice(0, 70)}`
                    })}
                        `)

                message.edit({ embeds: [embed] })
                    .catch(console.error);
            } else {
                arrEmojiNumber.forEach(async (icon, i) => {
                    if (icon === reaction?.emoji.name) {
                        const quest = await Question.findById(page[i - 1]._id)
                        console.log('icon', icon, i, quest)

                        if (!quest || quest === null) return await interaction.followUp({
                            content: "Aucune question à été trouver !",
                            ephemeral: true
                        });

                        const row2: any = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                                .setCustomId(`question-edit-${quest._id}`)
                                .setLabel("Editer ?")
                                .setStyle(ButtonStyle.Success)
                        ).addComponents(
                            new ButtonBuilder()
                                .setCustomId(`question-delete-${quest._id}`)
                                .setLabel("Supprimer ?")
                                .setStyle(ButtonStyle.Danger)
                        ).addComponents(
                            new ButtonBuilder()
                                .setCustomId(`question-generate-${quest._id}`)
                                .setLabel("Générer une réponse ?")
                                .setStyle(ButtonStyle.Primary)
                        )

                        await interaction.followUp({
                            embeds: [
                                new EmbedBuilder()
                                    .setAuthor({ name: `${interaction.user.tag}` })
                                    .setDescription(`
                                        **Name**: ${quest?.name} \n**Category**: ${quest?.category} \n**Question**: ${quest?.question} \n**Réponse**: ${quest?.reponse}
                                    `)
                                    .setFooter({ text: "Vous avez 5 minutes pour répondre" })
                                    .setTimestamp()
                            ],
                            components: [row2],
                            fetchReply: true,
                            ephemeral: true
                        })
                    }

                })
            }

        });

        collector.on('end', async collected => {
            console.log(`Collected ${collected.size} items`);
            await interaction.followUp(`Interaction Terminé ! Collected ${collected.size} items`)
        });


    },

    async btn(interaction: any) {
        console.log('btn', interaction.type)
        // const questions = await Question.find();

        // // try {
        const [commandName, action, idQuestion, params] = interaction.customId.split('-')
        const question = await Question.findById(idQuestion)

        if (action === "create") {
            // Create the modal
            const modal = new ModalBuilder()
                .setCustomId(`question-create`)
                .setTitle('Modal Create');

            // Create the text input components
            const nameInput = new TextInputBuilder()
                .setCustomId('question-nameInput')
                // The label is the prompt the user sees for this input
                .setLabel("Définir la question en 1 mot,")
                .setValue("")
                // Short means only a single line of text
                .setStyle(TextInputStyle.Short);

            const categoryInput = new TextInputBuilder()
                .setCustomId('question-categoryInput')
                // The label is the prompt the user sees for this input
                .setLabel("Définir la catégory,")
                .setValue("")
                // Short means only a single line of text
                .setStyle(TextInputStyle.Short);

            const questionInput = new TextInputBuilder()
                .setCustomId('question-questionInput')
                .setLabel("Définir une question,")
                .setValue("")
                // Paragraph means multiple lines of text.
                .setStyle(TextInputStyle.Paragraph);

            const reponseInput = new TextInputBuilder()
                .setCustomId('question-reponseInput')
                .setLabel("Définir ou corriger la réponse,")
                .setValue("")
                // Paragraph means multiple lines of text.
                .setStyle(TextInputStyle.Paragraph);

            // so you need one action row per text input.
            const actionRowName: any = new ActionRowBuilder().addComponents(nameInput)
            const actionRowCategory: any = new ActionRowBuilder().addComponents(categoryInput)
            const actionRowQuestion: any = new ActionRowBuilder().addComponents(questionInput)
            const actionRowReponse: any = new ActionRowBuilder().addComponents(reponseInput)

            modal.addComponents(actionRowName, actionRowCategory, actionRowQuestion, actionRowReponse);

            // Show the modal to the user
            await interaction.showModal(modal);

        } else if (!question) return await interaction.reply({
            content: "Une erreur avec le boutton !",
            ephemeral: true
        })

        else if (action === "edit") {
            // Create the modal
            const modal = new ModalBuilder()
                .setCustomId(`question-edit-${question._id}`)
                .setTitle('Modal Edit');


            // Create the text input components
            const nameInput = new TextInputBuilder()
                .setCustomId('question-nameInput')
                // The label is the prompt the user sees for this input
                .setLabel("Définir la question en 1 mot,")
                .setValue(question.name || "")
                // Short means only a single line of text
                .setStyle(TextInputStyle.Short);

            const categoryInput = new TextInputBuilder()
                .setCustomId('question-categoryInput')
                // The label is the prompt the user sees for this input
                .setLabel("Définir la catégory,")
                .setValue(question.category || "")
                // Short means only a single line of text
                .setStyle(TextInputStyle.Short);

            const questionInput = new TextInputBuilder()
                .setCustomId('question-questionInput')
                .setLabel("Définir une question,")
                .setValue(question.question || "")
                // Paragraph means multiple lines of text.
                .setStyle(TextInputStyle.Paragraph);

            const reponseInput = new TextInputBuilder()
                .setCustomId('question-reponseInput')
                .setLabel("Définir ou corriger la réponse,")
                .setValue(question.reponse || "")
                // Paragraph means multiple lines of text.
                .setStyle(TextInputStyle.Paragraph);

            // so you need one action row per text input.
            const actionRowName: any = new ActionRowBuilder().addComponents(nameInput)
            const actionRowCategory: any = new ActionRowBuilder().addComponents(categoryInput)
            const actionRowQuestion: any = new ActionRowBuilder().addComponents(questionInput)
            const actionRowReponse: any = new ActionRowBuilder().addComponents(reponseInput)

            // Add inputs to the modal
            modal.addComponents(actionRowName, actionRowCategory, actionRowQuestion, actionRowReponse);

            // Show the modal to the user
            await interaction.showModal(modal);
        } else if (action === "delete") {
            // Create the modal
            const modal = new ModalBuilder()
                .setCustomId(`question-delete-${question._id}`)
                .setTitle('Modal Delete');

            const questionInput = new TextInputBuilder()
                .setCustomId('question-questionInput')
                .setLabel("Définir une question,")
                .setValue(question.question || "")
                // Paragraph means multiple lines of text.
                .setStyle(TextInputStyle.Paragraph);

            const actionRowQuestion: any = new ActionRowBuilder().addComponents(questionInput)
            modal.addComponents(actionRowQuestion);

            // Show the modal to the user
            await interaction.showModal(modal);
        } else if (action === "generate") {
            await interaction.deferReply()

            const gptResponse = await new OpenAIClient().searchByString(`${question.question}`)
            console.log('generate', interaction, gptResponse)

            const messageG = await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: "Generate reponse with Open AI:" })
                        .setDescription(`🔎 Question: ${question.question} \n📡 réponse: ${gptResponse.data.choices[0].text}`)
                ],
                ephemeral: true
            })

            messageG.react("✅")

            const filter = (reaction: any, user: any) => {
                return user.id !== messageG.author.id; // for collected reaction if not bot (message by bot)
            };

            const collector = messageG.createReactionCollector({ filter, time: 5 * 60 * 1000 });

            collector.on('collect', async (reaction: any, user: any) => {
                console.log(`Collected ${reaction.emoji.name} from ${user.tag}`); 0
                if (reaction?.emoji.name === "✅") {
                    await Question.findByIdAndUpdate(idQuestion, { reponse: gptResponse.data.choices[0].text })
                }
            })

            collector.on('end', async (collected: any) => {
                console.log(`Collected ${collected.size} items`);
                await interaction.followUp(`Interaction Terminé ! Collected ${collected.size} items`)
            });

        }
    },

    async modal(interaction: any) {
        const [commandName, action, idQuestion] = interaction.customId.split('-')
        const question = await Question.findById(idQuestion)
        console.log('modal', interaction.type)

        if (action === "create") {
            const input = {
                name: interaction?.fields.fields.get('question-nameInput').value,
                category: interaction?.fields.fields.get('question-categoryInput').value,
                question: interaction?.fields.fields.get('question-questionInput').value,
                reponse: interaction?.fields.fields.get('question-reponseInput').value
            }

            const quest = await Question.create({ ...input })
            // console.log('submit modal create question', quest)
            await interaction.reply({
                content: quest.question + "\nà bien été créer !",
                ephemeral: true
            });

        } else if (!question) return await interaction.reply({
            content: "Une erreur avec la question !",
            ephemeral: true
        })

        else if (action === "edit") {
            const input = {
                name: interaction?.fields.fields.get('question-nameInput').value,
                category: interaction?.fields.fields.get('question-categoryInput').value,
                question: interaction?.fields.fields.get('question-questionInput').value,
                reponse: interaction?.fields.fields.get('question-reponseInput').value
            }

            await Question.findByIdAndUpdate(idQuestion, { ...input })
            // console.log('submit modal edit question')
            await interaction.reply({
                content: question.question + "\nà bien été éditer !",
                ephemeral: true
            });

        } else if (action === "delete") {

            console.log('delete', idQuestion, question)

            await Question.findByIdAndRemove({ _id: idQuestion })
            console.log('submit modal delete question')
            await interaction.reply({
                content: question.question + "\nà bien été Supprimer !",
                ephemeral: true
            });
            // await interaction.reply({
            //     content: question.question + "\nà bien été supprimer !",
            //     ephemeral: true
            // });

        }
    },

    cooldown: 10,
}

export default command