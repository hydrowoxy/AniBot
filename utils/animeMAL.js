/**
 * FOR ALL UTILS RELATED TO FETCHING ANIME INFO FROM MAL API
*/

const axios = require('axios'); // for HTTP requests
const config = require('../config.json');

const MAL_API_BASE_URL = 'https://api.myanimelist.net/v2';
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
        const response = await axios.get(`${MAL_API_BASE_URL}/anime`, {
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

        //Extract anime info. from the response (synax reasoning in GitHub issue #8)
        return response.data.data[0].node;

    } catch (error) {
        console.error('Error fetching anime data:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching anime data');
    }
}

/**
 * Fetches the top ten anime in a specified category from MyAnimeList API.
 * @param {string} category - The category of the top ten anime to fetch.
 * @returns {Promise<object[]>} A promise that resolves to an array of objects containing top ten anime information.
 * @throws {Error} Throws an error if fetching top ten anime data fails.
 */
async function fetchTopTen(category) {
    try {
        // GET request to MAL API for top ten anime in the given category
        const response = await axios.get(`${MAL_API_BASE_URL}/anime/ranking`, {
            params: {
                // Ranking type parameter
                ranking_type: category,

                // Limiting the result to 10
                limit: 10,

                // Fields to retrieve
                fields: 'id,title,mean'
            },
            headers: {
                'X-MAL-CLIENT-ID': MAL_CLIENT_ID // provide MAL client ID in headers
            }
        });

        // Extract the list of top ten anime from the response
        return response.data.data.map(item => item.node);

    } catch (error) {
        console.error('Error fetching top ten anime:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching top ten anime');
    }
}

module.exports = { fetchAnime, fetchTopTen };

