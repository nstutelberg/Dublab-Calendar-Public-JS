// Loading in packages, the credentials file, and the token file
var dotenv = require('dotenv');
var myEnv = dotenv.config();
const fs = require('fs');
const { convertDriveLinkToDirectImageLink } = require('./attachments_parsing.js')
const moment = require('moment-timezone');
const { parseEventTitle } = require('./event_title_parsing.js')

// Loading in the google object from googleapis, so we can access its methods
const { google } = require('googleapis');

// Functionality below is checking if credentials already exists, and if it does, don't load credentials again. this makes it so the credentials are only loaded once and are retained on subsequent calls
let credentials;
if (!credentials) {
    credentials = require('../config/credentials.json')
}

let token;
if (!token) {
    token = require('../config/token.json')
}

// Creating the OAuth client
const oAuthClient = new google.auth.OAuth2(
    credentials.installed.client_id,
    credentials.installed.client_secret,
    credentials.installed.redirect_uris[0]
);
oAuthClient.setCredentials(token);

// Loading in the calendar and the dotenv variables
const calendar = google.calendar({ version: "v3", auth: oAuthClient });
const calendarId = process.env.CALENDAR_ID

// Retrieving all events from the calendar
async function getCalendarEvents(numDays = 7) {
    try {

        // Get the current date and time in Pacific Time (Los Angeles). 
        const timezone = 'America/Los_Angeles';
        const now = moment().tz(timezone);

        // Get today's date and set it at the beginning of the day. The clone method creates a copy of the moment object so that the timezone stays in Los Angeles
        const todayDate = now.clone().startOf('day');
        const todayDateRoundedISO = todayDate.format('YYYY-MM-DDTHH:mm:ssZ');

        // Get the date 7 days ahead and set it at the beginning of the day
        const weekAheadDate = now.clone().startOf('day').add(numDays, 'days');
        const weekAheadDateRoundedISO = weekAheadDate.format('YYYY-MM-DDTHH:mm:ssZ');

        // Configuring the data to be returned, with respect to the timeMin and timeMax filters that we set up above
        const response = await calendar.events.list({
            calendarId: calendarId,
            singleEvents: true,
            orderBy: 'startTime',
            timeMin: todayDateRoundedISO,
            timeMax: weekAheadDateRoundedISO

        });

        // Getting the events creating an empty json array for the events to be written to
        const events = response.data.items;
        let jsonData = []

        if (events.length) {
            events.forEach(event => {
                const startTime = event.start.dateTime;
                const summary = event.summary
                const description = event.description

                // Specifying the case when there are no attachments. Return the attachment if it is present, else return undefined
                const attachments = event.attachments ? event.attachments.map(attachment => attachment.fileUrl) : '';

                // Functionality to make the url link accessible to the frontend
                const attachmentsDirectLink = convertDriveLinkToDirectImageLink(attachments);

                // Parsing out the summary field into its own object with 3 values contained within it
                const summaryParsed = parseEventTitle(summary)

                // Setting up the structure of the JSON so it can be pushed when the HTTP request is triggered
                const calendarOutput = {
                    startTime: startTime,
                    summary: summary,
                    eventTitleMeta: summaryParsed,
                    description: description,
                    attachments: attachmentsDirectLink
                };

                // Writing data in JSON format to be outputed
                jsonData.push(calendarOutput);
            });
        } else {
            // Placeholder to pass over this condition
        }

        // Converting jsonData to the final JSON format
        return jsonData;

    } catch (error) {

        // If an error occurs, log it and use `throw new Error` to make a custom message, vs `throw error`, which would just rethrow the error that was caught in the catch block
        console.log(`Error: ${error}`);
        throw new Error('Failed to fetch calendar events');
    }
}

module.exports = { getCalendarEvents };
