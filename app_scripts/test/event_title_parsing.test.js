// npx mocha app_scripts/test/
const { parseEventTitle } = require('../util/event_title_parsing.js')
const testData = require('../test_data/api_call_json_sample.json')
const assert = require('assert');

describe('event_title_parsing.js', function () {

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