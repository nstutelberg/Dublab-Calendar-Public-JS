function convertDriveLinkToDirectImageLink(driveLink) {
    try {

        // Get the file id from the url and append it to a generic drive.google link, but with the export attribute and the specific fileid of the current attachment
        const fileId = new URL(driveLink).searchParams.get('id');
        const directLink = `https://drive.google.com/uc?export=view&id=${fileId}`;
        return directLink;

    } catch (error) {

        // If error is a URL error, it means that the event is undefined, and this is fine because it will just not be included in the result set because we only want actual events. leave blank so code passes over this condition
        if (error instanceof TypeError && error.code === 'ERR_INVALID_URL') {

        } else {

            // Log and throw an error
            console.log(`Error: ${error}`);
            throw new Error('The attachment was not able to be parsed in the convertDriveLinkToDirectImage method');
        }
    }
}
module.exports = { convertDriveLinkToDirectImageLink };