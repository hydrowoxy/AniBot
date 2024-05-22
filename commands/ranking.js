/**
 * SLASH COMMAND INFO: /ranking [category]
 *      -> Returns a paginated embed containing ranked anime of some category
 *      -> max. 100 results
 */

const { SlashCommandBuilder } = require('discord.js');
const { fetchRanking } = require('../utils/animeMAL');
const { paginatedEmbed } = require('../utils/embeds');

module.exports = {

    // Build the slash command
    data: new SlashCommandBuilder()
        .setName('ranking')
        .setDescription('Fetches a ranked list of anime from MyAnimeList based on a category.')
        .addStringOption(option => 
            option.setName('category')
                .setDescription('The ranking category')
                .setRequired(true)
                .addChoices(
                    { name: 'Anime Series', value: 'all' },
                    { name: 'Airing Anime', value: 'airing' },
                    { name: 'Upcoming Anime', value: 'upcoming' },
                    { name: 'Anime TV Series', value: 'tv' },
                    { name: 'Anime OVA Series', value: 'ova' },
                    { name: 'Anime Movies', value: 'movie' },
                    { name: 'Anime Specials', value: 'special' },
                    { name: 'Anime by Popularity', value: 'bypopularity' },
                    { name: 'Favorited Anime', value: 'favorite' }
                )),

    // Execute when the command is called
    async execute(interaction) {
        const category = interaction.options.getString('category');
        console.log(`Fetching top anime for category: ${category}`);

        try {
            // Get data from MAL
            const rankedAnime = await fetchRanking(category);

            // If no data / empty data
            //     -> Handle this error here where you have access to the interaction object
            if (!rankedAnime || rankedAnime.length === 0) {
                return interaction.reply('No anime found for that category.');
            }

            // Paginated embed to display the info.
            await paginatedEmbed(
                interaction,
                rankedAnime,
                10,
                `Top Anime - ${category.charAt(0).toUpperCase() + category.slice(1)}`,
                (anime, index) => ({
                    name: `${index}. ${anime.title}`,
                    value: `https://myanimelist.net/anime/${anime.id}\n**Score:** ${anime.mean !== undefined ? anime.mean : 'N/A'}`
                })
            );

        } catch (error) {
            console.error('Error fetching ranked anime:', error);
            return interaction.reply('Error fetching ranked anime.');
        }
    },
};
