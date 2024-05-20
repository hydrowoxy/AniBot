/**
 * SLASH COMMAND INFO: /topten [category]
 *      -> Returns an embed containing the top ten anime of some category
 */

const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js'); 
const { fetchTopTen } = require('../utils/fetchTopTen'); // fetch rankings from MAL