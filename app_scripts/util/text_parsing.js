function convertDriveLinkToDirectImageLink(driveLink) {
  try {

    // Get the file id from the url and append it to a generic drive.google link, but with the export attribute and the specific fileid of the current attachment
    const fileId = new URL(driveLink).searchParams.get('id');
    const directLink = `https://drive.google.com/uc?export=view&id=${fileId}`;
    return directLink;

  } catch (error) {

    // If error is a URL error, it means that the event is undefined, and this is fine because it will just not be included in the result set because we only want actual events. leave blank so code passes over this condition
    if (!(error instanceof TypeError || error.code === 'ERR_INVALID_URL')) {

      // Log and throw an error
      console.log(`Error: ${error}`);
      throw new Error('The attachment was not able to be parsed in the convertDriveLinkToDirectImage method');
    }
  }
}

function parseEventTitle(summary) {

  const summaryString = summary.toString().trim();

  /**
   * If string doesn't have the "//", then skip over the eventType field. And if there is dash or delimiter in the resulting string, then assume that there is an artist and event within the string.
   * Split based on the dash delimiter, and reverse the string such that the event is in the 0 index location, so if there is no dash, then all the text will be stored in the 0 index.
   * This means if there is no dash, then the entire string will be stored as the eventName, but if there is a dash, then the string will be split between the artist and the eventName.
   **/

  if (!summaryString.includes("//")) {

    const noEventTypeSplit = summaryString.split(/(?<=\s)[-\u2013~](?=\s)/).reverse();
    const eventTitleMeta = {
      eventType: "",
      artist: (noEventTypeSplit[1] || "").trim(),
      eventName: (noEventTypeSplit[0] || "").trim()
    };
    return eventTitleMeta;

  } else {

    const backslashSplit = summaryString.split(/\s*\/\/\s*/);

    /**
    * Below uses the backslash split to get the eventType and artist parameters. The first element in the `summary` string will always be classified as the eventType object, which is usually
    * either 'LIVE' or 'PRE-REC'. The second element will be classified as the artist. In all cases tested, there was a non-null eventType, but if eventType is null, then the artist would
    * be picked up as the eventType. There needs to be consistent formatting from dublab's end to avoid this issue.
    * 
    * The double pipe operator is setting undefined/null values to be an empty string, so the final JSON output will be empty if the value is not populated, and this is to keep consistency 
    * with the rest of the JSON where undefined values are empty strings.
    **/

    const eventTypeTrimmed = (backslashSplit[0] || '').trim();
    const artistEventNameTrimmed = (backslashSplit[1] || '').trim();

    // Regex pattern that matches - or ~, and it splits based on the last occurance of either of these delimeters, so if an artist has one of these delimiters in their name, their name is not parsed
    const dashesSplit = artistEventNameTrimmed.split(/(?<=\s)[-\u2013~](?=\s)/).reverse();

    // Same process as with parsing out eventType, except this time it is taking the artist and eventName string, parsing it, and extracting the correct values
    const artistTrimmed = (dashesSplit[1] || '').trim();
    const eventNameTrimmed = (dashesSplit[0] || '').trim();

    // This is what will show in the final JSON output
    const eventTitleMeta = {
      eventType: eventTypeTrimmed,
      artist: artistTrimmed,
      eventName: eventNameTrimmed
    };
    return eventTitleMeta;
  }
};

module.exports = { convertDriveLinkToDirectImageLink, parseEventTitle };
