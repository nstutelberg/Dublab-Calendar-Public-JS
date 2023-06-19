// npx mocha app_scripts/test/
const { getCalendarEvents } = require('../util/api_call.js');
const assert = require('assert');
const moment = require('moment-timezone');

describe('api_call.js', function () {

    // Executing the api call only once so it is not executed through every test. The function output is the JSON string with all events from the calendar
    let apiCallExecution;
    before(async function () {
        apiCallExecution = await getCalendarEvents();
    });

    it('The API call should return at least one event', async function () {
        console.log('Number of events stored in the JSON:')
        console.log(apiCallExecution.length)
        assert(apiCallExecution.length > 0)
    });

    it('The date manipulations should return the intended result for date filtering, which is currently a 7 day period', function () {

        // Set the timezone to Pacific Time (Los Angeles)
        const timezone = 'America/Los_Angeles';
        const numDays = 7

        // Get the current date and time in Pacific Time (Los Angeles). The clone method creates a copy of the moment object so that the timezone stays in Los Angeles
        const now = moment().tz(timezone);

        // Get today's date in Pacific Time (Los Angeles) and set it at the beginning of the day
        const todayDate = now.clone().startOf('day');
        const todayDateRoundedISO = todayDate.format('YYYY-MM-DDTHH:mm:ssZ');

        // Get the date 7 days ahead in Pacific Time (Los Angeles) and set it at the beginning of the day
        const weekAheadDate = now.clone().startOf('day').add(numDays, 'days');
        const weekAheadDateRoundedISO = weekAheadDate.format('YYYY-MM-DDTHH:mm:ssZ');


        console.log(
            todayDateRoundedISO + '\n',
            weekAheadDateRoundedISO + '\n')

        // Assert that there should be exactly 7 days between these two dates. First create the date objects since these variables are stored as ISO strings
        const daysDiff = (new Date(weekAheadDateRoundedISO) - new Date(todayDateRoundedISO));

        // Converting milliseconds into days (1000 ms in a second, 60 seconds in a minute etc)
        const daysDiffRounded = daysDiff / 1000 / 60 / 60 / 24
        console.log('The amount of days that are being tested for events:')
        console.log(daysDiffRounded)

        assert(daysDiffRounded == 7);
    });

    it('Confirming that the attachments logic is correctly converting the attachments google drive link to an export link that the frontend can use', function () {

        // Making an array for the attachments that are not undefined. Going through all attachments in the output, since we shouldn't have too much data to test. If undefined, push to the array
        let attachments = [];
        apiCallExecution.forEach(event => {
            if (event.attachments != undefined)
                attachments.push(event.attachments);
        });
        console.log('Listing all the defined attachments. If there are no attachments in the JSON output, this test will default to pass:')
        console.log(attachments);
        console.log(`The first attachment is: ${attachments[1]}`)

        // Testing if the attachment link has an export=view string in it, because that is the indication that the url will work with HTML and show on the website
        if (attachments.length > 0) {
            assert(attachments[1].includes('export=view'))
        } else if (attachments.length == 0) {
            true
        };
    });

    it('The output data should be in JSON format, and the `JSON.parse()` function should work if the data is in the correct format', function () {

        // Defining function to try to parse the json data to prove that it is in fact in json format
        let isJson = false;
        function jsonTest(string) {
            try {
                JSON.parse(string);
                isJson = true;
                console.log(isJson);
            } catch (error) {
                isJson = false;
                console.log(isJson);
            }
            return isJson
        };

        // Defining test json data
        const testJson = '{"key": "value"}';
        const testJsonString = JSON.parse(JSON.stringify(testJson));
        const badJson = 'test'
        const badJsonString = JSON.parse(JSON.stringify(badJson));

        // Running the functions for each json example
        badStringResult = jsonTest(badJsonString);
        goodStringResult = jsonTest(testJsonString);
        apiCallResult = jsonTest(JSON.stringify(apiCallExecution));

        console.log('The first boolean with the test string should fail, but the following two booleans should be true as to show that they are both in JSON format')
        assert(apiCallResult == true && goodStringResult == true && badStringResult == false)
    })

    // Using return so that the api call doesn't execute twice. The combination of using an async await function here as well as an async await in api_call.js was leading to two executions
    return;
});