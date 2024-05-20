/**
 * UTILITY INFO:
 *      -> Queries MAL for anime based on a given title
 *      -> Returns an object containing anime info. fields (like title, synopsis, mean, status, etc.)
 */

const axios = require('axios'); // for HTTP requests
const config = require('../config.json');

const MAL_API_URL = 'https://api.myanimelist.net/v2/anime';

async function fetchAnime(title) {
    const MAL_CLIENT_ID = config.MALclientId;

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

        //Extract anime info. from the response (synax reasoning in GitHub issue #8)
        return response.data.data[0].node;

    } catch (error) {
        console.error('Error fetching anime data:', error.response ? error.response.data : error.message);
        throw new Error('Error fetching anime data');
    }
}

module.exports = { fetchAnime };
