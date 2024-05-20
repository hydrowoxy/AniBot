/**
 * SLASH COMMAND INFO: /anime [title]
 *      -> Returns an embed containing information about an anime
 *      -> Synopsis, Score, Status, and Episodes
 */

const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js'); 
const { fetchAnime } = require('../utils/animeMAL'); // Fetch anime from MAL

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
            // Fetch anime data from MAL
            const anime = await fetchAnime(title);

            // If no data / empty data
            //     -> Handle this error here where you have access to the interaction object
            if (!anime) {
                return interaction.reply('No anime found with that title.');
            }

            // Embed to display the info.
            const embed = new EmbedBuilder()
                .setColor('#2C2F33')
                .setTitle(anime.title || 'Title not available')
                .setURL(`https://myanimelist.net/anime/${anime.id}`)
                .setDescription(anime.synopsis || 'No synopsis available')
                .setThumbnail(anime.main_picture ? anime.main_picture.medium : 'https://myanimelist.net/images/mal-logo-xsmall.png')
                .addFields(
                    { name: 'Score', value: anime.mean ? anime.mean.toString() : 'N/A', inline: true },
                    { name: 'Status', value: anime.status || 'Unknown', inline: true },
                    { name: 'Episodes', value: anime.num_episodes ? anime.num_episodes.toString() : 'N/A', inline: true },
                )
                .setFooter({ text: 'Data fetched from MyAnimeList' });

            // Reply with the embed
            return interaction.reply({ embeds: [embed] });

        } catch (error) {
            return interaction.reply('Error fetching anime data.');
        }
    },
};