// Loading in packages, the credentials file, and the token file
var dotenv = require('dotenv');
var myEnv = dotenv.config();
const { convertDriveLinkToDirectImageLink, parseEventTitle } = require('../util/text_parsing')
const moment = require('moment-timezone');
const memoryCache = require('memory-cache');
const { google } = require('googleapis');
token = require('../config/token.json')
credentials = require('../config/credentials.json')

// Creating the OAuth client
const oAuthClient = new google.auth.OAuth2(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  credentials.installed.redirect_uris[0]
);
oAuthClient.setCredentials(token);
const calendar = google.calendar({ version: "v3", auth: oAuthClient });
const calendarId = process.env.CALENDAR_ID

// Function to fetch data for all schedule events
async function getCalendarEvents(numDays = 7, tz = 'America/Los_Angeles') {
  try {

    // Get the current date and time
    const now = moment().tz(tz);

    // Get today's date and set it at the beginning of the day. The clone method creates a copy of the moment object so that the timezone stays in Los Angeles
    const yesterdayDateRoundedISO = now.clone().startOf('day').add(-1, 'days').format('YYYY-MM-DDTHH:mm:ssZ');

    // Get the date 7 days ahead and set it at the beginning of the day
    const weekAheadDate = now.clone().startOf('day').add(numDays, 'days');
    const weekAheadDateRoundedISO = weekAheadDate.format('YYYY-MM-DDTHH:mm:ssZ');

    // Configuring the data to be returned

    const response = await calendar.events.list({
      calendarId: calendarId,
      singleEvents: true,
      orderBy: "startTime",
      timeMin: yesterdayDateRoundedISO,
      timeMax: weekAheadDateRoundedISO,
    });

    // Getting the events creating an empty json array for the events to be written to

    const events = response.data.items;
    let jsonData = [];

    if (events.length) {
      console.log("Returning Events...");
      events.forEach((event) => {
        const startTime = event.start.dateTime;
        const endTime = event.end.dateTime;
        const summary = event.summary;
        const description = event.description;
        const id = event.id

        // Use an if else ternary condition, where if event.attachments is true, everything after the `?` is executed, and if event.attachments is false, everything after the `:` is executed
        // If the `?` block is exeucted, then for every event attachment, get the fileUrl from that attachment, If the `:` block is executed, return undefined to skip over that attachment

        const attachments = event.attachments
          ? event.attachments.map((attachment) => attachment.fileUrl)
          : undefined;
        const attachmentsDirectLink =
          convertDriveLinkToDirectImageLink(attachments);

        const calendarOutput = {
          startTime: startTime,
          endTime: endTime,
          summary: summary,
          description: description,
          attachments: attachmentsDirectLink,
          id: id,
          eventTitleMeta: parseEventTitle(summary)
        };

        // Push the calendarOutput to the jsonData object for every loop iteration, then return the final jsonData output after the loop is exited
        jsonData.push(calendarOutput);
      });
    }

    return jsonData;

  } catch (error) {

    // If an error occurs, log it and use `throw new Error` to make a custom message, vs `throw error`, which would just rethrow the error that was caught in the catch block
    console.log(`Error: ${error}`);
    throw new Error('Failed to fetch calendar events');
  }
}


// Function to fetch data for a single event by ID
async function getSingleCalendarEvent(id, ignoreCache = false) {
  try {

    // Executing the cached api call function, and either return the cached events (if fresh data is in the cache) or make an entirely new api call if there is no data in the cache
    // Then search through the JSON in `cachedData`, and iterate through each event in this array and return the id where the event id is equal to the `id` parameter
    if (!ignoreCache) {
      const cachedData = await getCachedCalendarEvents();
      const cachedEvent = cachedData.find((event) => event.id === id)
      if (cachedEvent) {
        console.log('Single event data retrieved from cache');
        return cachedEvent;
      }
    } else {
        console.log("Single event cache bypassed.")
    }

    const response = await calendar.events.get({
      eventId: id,
      calendarId: calendarId,
    });

    const event = response.data;
    let jsonData = {}

    if (event) {
      const attachments = event.attachments
        ? event.attachments.map((attachment) => attachment.fileUrl)
        : undefined;
      const attachmentsDirectLink =
        convertDriveLinkToDirectImageLink(attachments);

      const calendarOutput = {
        startTime: event.start.dateTime,
        endTime: event.end.dateTime,
        summary: event.summary,
        description: event.description,
        attachments: attachmentsDirectLink,
        id: event.id
      }

      // Writing data in JSON format to be outputed via the netlify function
      jsonData = calendarOutput;

    } else {

      console.log("No Upcoming Events");

    }
    return jsonData
  } catch (error) {

    // If an error occurs, log it and use `throw new Error` to make a custom message, vs `throw error`, which would just rethrow the error that was caught in the catch block
    console.log(`Error: ${error}`);
    throw new Error('Failed to fetch calendar events');
  }
}

// Function to fetch data for all schedule events and cache it
async function getCachedCalendarEvents(numDays = 7, tz = 'America/Los_Angeles', ignoreCache = false) {
  const cacheKey = `calendarEvents-${tz}-${numDays}`
  if (!ignoreCache) {
    const cachedData = memoryCache.get(cacheKey);

    if (cachedData) {
      console.log('Schedule data retrieved from cache');
      return cachedData;
    }
  } else {
    console.log("'ignoreCache' present. Skipping cache check.")
  }

  const jsonData = await getCalendarEvents(numDays, tz);
  memoryCache.put(cacheKey, jsonData, 3600000); // Cache for 1 hour (3600000 milliseconds)
  return jsonData;
}

module.exports = {
  getCalendarEvents,
  getSingleCalendarEvent,
  getCachedCalendarEvents,
};
