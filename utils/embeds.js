/**
 * For utils related to making EMBEDS to display info.
*/

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

/**
 * Creates a standard embed with the provided format.
 * @param {string} title - The title of the embed.
 * @param {string} description - The description of the embed.
 * @param {string} thumbnail - URL of the thumbnail image.
 * @param {object[]} fields - Array of field objects {name, value, inline}.
 * @param {string} footerText - The text for the footer.
 */
function genericEmbed(title, description, thumbnail, fields, footerText) {
    const embed = new EmbedBuilder()
        .setColor('#2F52A2')
        .setTitle(title || 'Title not available')
        .setDescription(description || 'No description available')
        .setThumbnail(thumbnail || 'https://myanimelist.net/images/mal-logo-xsmall.png');

    if (fields && fields.length > 0) {
        fields.forEach(field => {
            embed.addFields(field);
        });
    }

    if (footerText) {
        embed.setFooter({ text: footerText });
    }

    return embed;
}

/**
 * Creates paginated embeds and manages pagination interaction.
 * @param {object} interaction - The interaction object.
 * @param {object[]} items - The items to be displayed in the embeds.
 * @param {number} itemsPerPage - The number of items per page.
 * @param {string} title - The title of the embed.
 * @param {function} formatItem - A function that formats each item into a field object.
 */
async function paginatedEmbed(interaction, items, itemsPerPage, title, formatItem) {

    const embeds = []; // To store embed pages
    const thumbnail = 'https://myanimelist.net/images/mal-logo-xsmall.png'; // MAL logo 

    // Loop through items, create embeds for each page
    for (let i = 0; i < items.length; i += itemsPerPage) { // Slice the items array to get items for the current page
        const currentItems = items.slice(i, i + itemsPerPage);
        const embed = new EmbedBuilder()
            .setColor('#2F52A2')
            .setTitle(title)
            .setFooter({ text: `Page ${i / itemsPerPage + 1} of ${Math.ceil(items.length / itemsPerPage)}` });

        // Add fields to the embed for each item on the current page
        currentItems.forEach((item, index) => {
            // Use provided function to format
            embed.addFields(formatItem(item, index + 1 + i));
        });

        // Set the MAL logo as the thumbnail for each page
        embed.setThumbnail(thumbnail);

        // Add the embed to the array
        embeds.push(embed);
    }

    let currentPage = 0; // Pg. index

    // Create an action row (row for interactive components) with page buttons
    const getRow = (page) => new ActionRowBuilder()

        .addComponents(

            // Previous button
            new ButtonBuilder()
                .setCustomId('prev')
                .setLabel('Previous')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 0),

            // Next button
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === embeds.length - 1)
        );

    // Send the first embed page with the pagination buttons and get the sent message
    const message = await interaction.reply({ embeds: [embeds[currentPage]], components: [getRow(currentPage)], fetchReply: true });

    // Define a filter function for the interaction collector
    //      -> Filter tells collector what to listen for
    //      -> True for interactions that should be handled and false otherwise
    const filter = i => i.user.id === interaction.user.id; // only listen to interactions from the user who sent the command

    const collector = message.createMessageComponentCollector({ filter, time: 300000 }); // Create interaction collector, listens for 5 min

    // Handle the collect event for the collector
    collector.on('collect', async i => {
        if (i.customId === 'prev') { // Prev button click
            currentPage--; // Decrement page number
        } else if (i.customId === 'next') { // Next button click
            currentPage++; // Increment page number
        }

        // Update the message with the new embed and button states
        await i.update({
            embeds: [embeds[currentPage]],
            components: [getRow(currentPage)]
        });

        // Reset the collector time
        collector.resetTimer();
    });

    // Handle the end event for the collector
    collector.on('end', () => {
        message.edit({ components: [] }); // Remove the buttons from the message when the collector ends
    });
}

module.exports = { genericEmbed, paginatedEmbed };
