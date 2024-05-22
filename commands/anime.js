/**
 * SLASH COMMAND INFO: /anime [title]
 *      -> Returns an embed containing information about an anime
 *      -> Synopsis, Score, Status, and Episodes
 */

const { SlashCommandBuilder } = require('discord.js');
const { fetchAnime } = require('../utils/anime'); // Fetch anime from MAL
const { genericEmbed } = require('../utils/embeds');

module.exports = {  
    // Build the slash command
    data: new SlashCommandBuilder()
        .setName('anime')
        .setDescription('Fetches information about an anime from MyAnimeList.')
        .addStringOption(option => 
            option.setName('title')
                .setDescription('The title of the anime')
                .setRequired(true)),

    // Execute when the command is called
    async execute(interaction) {

        // Get the user-entered title of the anime
        const title = interaction.options.getString('title');
        console.log(`Fetching anime info for: ${title}`);

        try {
            // Get data from MAL
            const anime = await fetchAnime(title);

            // If no data / empty data
            //      -> Handle this error here where you have access to the interaction object
            if (!anime) {
                return interaction.reply('No anime found with that title.');
            }

            // Create the embed using the embed utility function
            const embed = genericEmbed(
                anime.title,
                anime.synopsis,
                anime.main_picture ? anime.main_picture.medium : 'https://myanimelist.net/images/mal-logo-xsmall.png',
                [
                    { name: 'Score', value: anime.mean ? anime.mean.toString() : 'N/A', inline: true },
                    { name: 'Status', value: anime.status || 'Unknown', inline: true },
                    { name: 'Episodes', value: anime.num_episodes ? anime.num_episodes.toString() : 'N/A', inline: true }
                ],
                'Data fetched from MyAnimeList'
            );

            // Set the URL of the title to link to the anime on MAL
            embed.setURL(`https://myanimelist.net/anime/${anime.id}`);

            // Reply with the embed
            return interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching anime data:', error);
            return interaction.reply('Error fetching anime data.');
        }
    },
};