// Loading in packages, the credentials file, and the token file
var dotenv = require('dotenv');
var myEnv = dotenv.config();
const fs = require('fs');
const { convertDriveLinkToDirectImageLink, parseEventTitle } = require('../util/text_parsing')
const moment = require('moment-timezone');

// Loading in the google object from googleapis, so we can access its methods
const { google } = require('googleapis');
const { kMaxLength } = require("buffer");

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

module.exports = {
    dotenv,
    myEnv,
    fs,
    parseEventTitle,
    convertDriveLinkToDirectImageLink,
    moment,
    google,
    kMaxLength,
    credentials,
    token,
    oAuthClient,
    calendar,
    calendarId,
};
