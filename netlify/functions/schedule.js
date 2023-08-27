const { getCachedCalendarEvents } = require('../../app_scripts/util/cached_api_call.js');
const cacheControlMaxAge = process.env.CACHE_CONTROL_MAX_AGE

const handler = async (event, context) => {
  try {

    // Grabbing any parameters if they are supplied in the HTTP request, else using 7 as the default for the number of days to be returned
    const numDays = parseInt(event.queryStringParameters.days) || 8;
    const apiCallResult = await getCachedCalendarEvents(numDays);

    // Add caching headers to the response. Headers tell the clients and caching servers how to cache and handle responses from the server. This is the configuration for how the client will cache
    let responseHeaders = {}
    if (parseInt(cacheControlMaxAge) > 0) {
      responseHeaders = {
        'Cache-Control': `public, max-age=${cacheControlMaxAge}`
      };
    }

    return {

      //returning 200 as proof of a successful request. assigning the responseHeaders object which contains the caching information, giving this info to the server. entire chunk is returning an HTTP response object for the server to process and then return to the user
      statusCode: 200,
      headers: responseHeaders,
      body: JSON.stringify(apiCallResult),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: `Error has occurred: ${error}` }),
    };
  }
};

// Sets this function as the main function that should be invoked when the serverless function is triggered
module.exports = { handler }
