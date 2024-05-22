/**
 * For utils related to fetching ANIME INFO from MAL API
*/

const axios = require('axios'); // For HTTP requests
const config = require('../config.json');

const ANI_BASE_URL = 'https://api.myanimelist.net/v2/anime'; // Base URL for anime-related stuff
const MAL_CLIENT_ID = config.MALclientId;

/**
 * Fetches information about an anime from MyAnimeList API based on the provided title.
 * @param {string} title - The title of the anime to search for.
 * @returns {Promise<object>} A promise that resolves to an object containing anime information.
 * @throws {Error} Throws an error if fetching anime data fails.
 */
async function fetchAnime(title) {
    
    try {
        // GET request to MAL API
        const response = await axios.get(`${ANI_BASE_URL}`, {
            params: {
                // Query parameter, title of the anime
                q: title,

                // Limiting the result to 1
                limit: 1,

                // Fields to retreive (by default the API doesn't return all fields)
                fields: 'id,title,main_picture,synopsis,mean,status,num_episodes'
            },
            headers: {
                'X-MAL-CLIENT-ID': MAL_CLIENT_ID // Provide MAL client ID in header
            }
        });

        //Extract anime info. from the response (synax reasoning in GitHub issue #8)
        return response.data.data[0].node;

    } catch (error) {
        console.error('Error fetching anime data:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching anime data');
    }
}

/**
 * Fetches the rankings for anime in a specified category from MyAnimeList API (max.100)
 * @param {string} category - The category of the anime to fetch.
 * @returns {Promise<object[]>} A promise that resolves to an array of objects containing anime information.
 * @throws {Error} Throws an error if fetching ranked anime data fails.
 */
async function fetchRanking(category) {
    try {
        const response = await axios.get(`${ANI_BASE_URL}/ranking`, {
            params: {
                ranking_type: category,
                limit: 100,
                fields: 'id,title,mean'
            },
            headers: {
                'X-MAL-CLIENT-ID': MAL_CLIENT_ID 
            }
        });

        return response.data.data.map(item => item.node);

    } catch (error) {
        console.error('Error fetching top ten anime:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching top ten anime');
    }
}

/**
 * Fetches the seasonal anime from MyAnimeList API for the specified season and year.
 * @param {string} season - The season (winter, spring, summer, fall).
 * @param {number} year - The year.
 * @returns {Promise<object[]>} A promise that resolves to an array of objects containing seasonal anime information.
 * @throws {Error} Throws an error if fetching seasonal anime data fails.
 */
async function fetchSeasonalAnime(season, year) {
    try {
        const response = await axios.get(`${ANI_BASE_URL}/season/${year}/${season}`, {
            params: {
                fields: 'id,title,mean'
            },
            headers: {
                'X-MAL-CLIENT-ID': MAL_CLIENT_ID
            }
        });

        return response.data.data.map(item => item.node);

    } catch (error) {
        console.error('Error fetching seasonal anime data:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching seasonal anime data');
    }
}

module.exports = { fetchAnime, fetchRanking, fetchSeasonalAnime };