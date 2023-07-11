const { getCalendarEvents } = require('../util/api_call.js');

// Execute the main api call that returns data from google calendar API and stores it as JSON format
function main() {
    getCalendarEvents(numDays = 7);
}

main();
