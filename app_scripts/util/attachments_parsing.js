function convertDriveLinkToDirectImageLink(driveLink) {
    try {
        const fileId = new URL(driveLink).searchParams.get('id');
        const directLink = `https://drive.google.com/uc?export=view&id=${fileId}`;
        return directLink;
    } catch (error) {

        // If error is a URL error, it means that the event is undefined, and this is fine because it will just not be included in the result set because we only want actual events
        if (error instanceof TypeError && error.code === 'ERR_INVALID_URL') {
            // Placeholder to pass over this condition
        } else {

            // Log and throw an error
            console.log(`Error: ${error}`);
            throw new Error('The attachment was not able to be parsed in the convertDriveLinkToDirectImage method');
        }
    }
}
module.exports = { convertDriveLinkToDirectImageLink };