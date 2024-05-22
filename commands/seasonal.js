/**
 * SLASH COMMAND INFO: /seasonal [season] [year]
 *      -> Returns a paginated embed containing the seasonal anime for the specified season and year
 */

const { SlashCommandBuilder } = require('discord.js');
const { fetchSeasonalAnime } = require('../utils/animeMAL');
const { paginatedEmbed } = require('../utils/embeds');

module.exports = {

    // Build the slash command
    data: new SlashCommandBuilder()
        .setName('seasonal')
        .setDescription('Fetches seasonal anime from MyAnimeList.')
        .addStringOption(option => 
            option.setName('season')
                .setDescription('The season (winter, spring, summer, fall)')
                .setRequired(true)
                .addChoices(
                    { name: 'Winter', value: 'winter' },
                    { name: 'Spring', value: 'spring' },
                    { name: 'Summer', value: 'summer' },
                    { name: 'Fall', value: 'fall' }
                ))
        .addIntegerOption(option => 
            option.setName('year')
                .setDescription('The year')
                .setRequired(true)),

    // Execute when the command is called
    async execute(interaction) {

        // Retreive season and year from the command
        const season = interaction.options.getString('season');
        const year = interaction.options.getInteger('year');

        try {
            // Get data from MAL
            const seasonalAnime = await fetchSeasonalAnime(season, year);

            // If no data / empty data
            //     -> Handle this error here where you have access to the interaction object
            if (!seasonalAnime || seasonalAnime.length === 0) {
                return interaction.reply('No seasonal anime found for that season and year.');
            }

            // Paginated embed to display the info.
            await paginatedEmbed(
                interaction,
                seasonalAnime,
                5,
                `Seasonal Anime - ${season.charAt(0).toUpperCase() + season.slice(1)} ${year}`,
                (anime, index) => ({
                    name: anime.title,
                    value: `https://myanimelist.net/anime/${anime.id}\n**Score:** ${anime.mean || 'N/A'}`
                })
            );

        } catch (error) {
            console.error('Error fetching seasonal anime:', error);
            return interaction.reply('Error fetching seasonal anime.');
        }
    },
};
