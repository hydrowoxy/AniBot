const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js'); 
const axios = require('axios'); // for HTTP requests 
const config = require('../config.json');

const MAL_API_URL = 'https://api.myanimelist.net/v2/anime';

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

        // Get MAL client ID
        const MAL_CLIENT_ID = config.MALclientId;

        console.log(`Fetching anime info for: ${title}`);

        try {
            // GET request to MAL API
            const response = await axios.get(MAL_API_URL, {
                params: {
                    // Query parameter, title of the anime
                    q: title, 

                    // Limiting the result to 1
                    limit: 1, 

                    // Fields to retreive (by default the API doesn't return all fields)
                    fields: 'id,title,main_picture,synopsis,mean,status,num_episodes' 
                },
                headers: {
                    'X-MAL-CLIENT-ID': MAL_CLIENT_ID // provide MAL client ID in headers
                }
            });

            // If no data / empty data
            if (!response.data || !response.data.data || response.data.data.length === 0) {
                return interaction.reply('No anime found with that title.');
            }

            /**
             * Extract anime info. from the response
             *      response ==> object returned by axios GET request
             *      response.data ==> data property of response object, holds data returned by MAL API
             *      response.data.data ==> MAL response data has a data property containing main payload
             *      response.data.data[0] ==> first element of response.data.data (response limited to 1)
             *      .node ==> access specific details of the anime under response.data.data[0]
             */
            const anime = response.data.data[0].node;

            // Embed to display the info.
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
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
            // Error during fetching data
            console.error('Error fetching anime data:', error.response ? error.response.data : error.message);
            return interaction.reply('Error fetching anime data.');
        }
    },
};
