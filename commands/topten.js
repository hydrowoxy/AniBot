/**
 * SLASH COMMAND INFO: /topten [category]
 *      -> Returns an embed containing the top ten anime of some category
 */

const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js'); 
const { fetchTopTen } = require('../utils/animeMAL'); // fetch rankings from MAL

module.exports = {

    // Build the slash command
    data: new SlashCommandBuilder()
        .setName('topten')
        .setDescription('Fetches the top ten anime from MyAnimeList based on a category.')
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

        // Get the user-entered category
        const category = interaction.options.getString('category');
        console.log(`Fetching top ten anime for category: ${category}`);

        try {
            // Fetch top ten anime data from MAL
            const topTenAnime = await fetchTopTen(category);

            // If no data / empty data
            //     -> Handle this error here where you have access to the interaction object
            if (!topTenAnime || topTenAnime.length === 0) {
                return interaction.reply('No top ten anime found for that category.');
            }

            // Create an embed to display the top ten anime
            const embed = new EmbedBuilder()
                .setColor('#2C2F33')
                .setTitle(`Top Ten Anime - ${category.charAt(0).toUpperCase() + category.slice(1)}`)
                .setDescription(`Here are the top ten anime for the "${category}" category:`)
                .setFooter({ text: 'Data fetched from MyAnimeList' });

            // Add each anime to the embed with detailed info and links
            topTenAnime.forEach((anime, index) => {
                embed.addFields(
                    {
                        name: `${index + 1}. ${anime.title}`,
                        value: `https://myanimelist.net/anime/${anime.id}\n **Score:** ${anime.mean || 'N/A'}`,
                        inline: false
                    }
                );
            });

            // Reply with the embed
            return interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error fetching top ten anime:', error);
            return interaction.reply('Error fetching top ten anime.');
        }
    },
};
