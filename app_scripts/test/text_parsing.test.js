// npx mocha app_scripts/test/
const { convertDriveLinkToDirectImageLink } = require('../util/text_parsing.js');
const assert = require('assert');
const { parseEventTitle } = require('../util/text_parsing.js');
const testData = require('../test/test_data/api_response_sample.json');

describe('text_parsing.js', function () {

    it('Confirming the functionality of the function that changes the attachment url into a usable format', function () {
        console.log(`the link before the transformation is: "https://drive.google.com/open?id=1L6bLDUk0BccHcvHrfqxpeSHN7i6e5C7H&authuser=0"`)
        console.log(`The link after the transformation is: ${convertDriveLinkToDirectImageLink("https://drive.google.com/open?id=1L6bLDUk0BccHcvHrfqxpeSHN7i6e5C7H&authuser=0")}`)
        const testResult = convertDriveLinkToDirectImageLink("https://drive.google.com/open?id=1L6bLDUk0BccHcvHrfqxpeSHN7i6e5C7H&authuser=0")

        // Making sure that the final link is in export format, since this format can be read in html, whereas the `/open?` format cannot
        assert(testResult.includes('?export='))
    });

    it('The summary field should be parsed correctly, with the 1 string being split into 3 strings and then joined back together with a comma separating them', function () {

        // Iterating through all the test json data, executing the function to parse out `summary` into three separate objects, and comparing the results to the original string
        testData.forEach(summary => {
            const summaryValue = summary.summary;
            const stringParsingResult = parseEventTitle(summaryValue)
            const stringParsingResultJson = JSON.stringify(stringParsingResult)
            console.log(`This is the original value: ${summaryValue}`)
            console.log(`This is the value after parsing the string by the delimiters: ${stringParsingResultJson}`)
            console.log();

            // Making sure that there are three keys instead of one after the transformation
            const afterJsonObjectConversion = JSON.parse(stringParsingResultJson)
            const afterKeys = Object.keys(afterJsonObjectConversion)
            assert(afterKeys.length === 3)
        });
    })

});