// Load in the api call to get the calendar events
const { getCalendarEvents } = require('../../app_scripts/util/api_call.js')

// Running netlify function
const handler = async (event, context) => {
    try {

        // Grabbing any parameters if they are supplied in the HTTP request, else using 7 as the default for the number of days to be returned
        const numDays = parseInt(event.queryStringParameters.days) || 7;
        const apiCallResult = await getCalendarEvents(numDays);
        return {
            statusCode: 200,
            body: JSON.stringify(apiCallResult)
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Error has occurred: ${error}` })
        }
    }
}
module.exports = { handler }