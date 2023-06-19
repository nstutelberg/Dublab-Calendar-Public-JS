// Loading in packages, the credentials file, and the token file
var dotenv = require('dotenv');
var myEnv = dotenv.config();
const credentials = require('../../app_scripts/config/credentials.json')
const token = require('../../app_scripts/config/token.json')


// Loading in the google object from googleapis, so we can access its methods
const { google } = require('googleapis');

// Creating the OAuth client
const oAuthClient = new google.auth.OAuth2(
    credentials.installed.client_id,
    credentials.installed.client_secret,
    credentials.installed.redirect_uris[0]);
oAuthClient.setCredentials(token);

// Loading in the calendar and instantiating the api call function
const calendar = google.calendar({ version: "v3", auth: oAuthClient });
const calendarId = process.env.CALENDAR_ID
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