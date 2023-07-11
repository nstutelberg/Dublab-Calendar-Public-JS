// npx mocha app_scripts/test/
const { convertDriveLinkToDirectImageLink } = require('../util/attachments_parsing.js');
const assert = require('assert');

describe('attachments_parsing.js', function () {

    it('Confirming the functionality of the function that changes the attachment url into a usable format', function () {
        console.log(`the link before the transformation is: "https://drive.google.com/open?id=1L6bLDUk0BccHcvHrfqxpeSHN7i6e5C7H&authuser=0"`)
        console.log(`The link after the transformation is: ${convertDriveLinkToDirectImageLink("https://drive.google.com/open?id=1L6bLDUk0BccHcvHrfqxpeSHN7i6e5C7H&authuser=0")}`)
        const testResult = convertDriveLinkToDirectImageLink("https://drive.google.com/open?id=1L6bLDUk0BccHcvHrfqxpeSHN7i6e5C7H&authuser=0")

        // Making sure that the final link is in export format, since this format can be read in html, whereas the `/open?` format cannot
        assert(testResult.includes('?export='))

    });
});