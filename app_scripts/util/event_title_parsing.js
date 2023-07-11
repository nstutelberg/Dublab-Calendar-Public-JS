function parseEventTitle(summary) {

    // Convert the summary to a string and trim out the extra spaces. This will be repeated on each step to remove potential extra spaces
    const summaryString = summary.toString().trim();

    // Regex pattern that matches based on `//` only and also accounts for white spaces on either side of the slashes 
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
    const dashesSplit = artistEventNameTrimmed.split(/(?<=\s)[-\u2013~](?=\s)/);

    // Same process as with parsing out eventType, except this time it is taking the artist and eventName string, parsing it, and extracting the correct values
    const artistTrimmed = (dashesSplit[0] || '').trim();
    const eventNameTrimmed = (dashesSplit[1] || '').trim();

    // This is what will show in the final JSON output
    const eventTitleMeta = {
        eventType: eventTypeTrimmed,
        artist: artistTrimmed,
        eventName: eventNameTrimmed
    };
    return eventTitleMeta;
};

module.exports = { parseEventTitle };