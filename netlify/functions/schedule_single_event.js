const { getSingleCalendarEvent } = require('../../app_scripts/util/cached_api_call.js');
const cacheControlMaxAge = process.env.CACHE_CONTROL_MAX_AGE

const handler = async (event, context) => {
  try {

    const id = event.queryStringParameters.id
    const apiCallResult = await getSingleCalendarEvent(id);

    // Add caching headers to the response. Headers tell the clients and caching servers how to cache and handle responses from the server. This is the configuration for how the client will cache
    let responseHeaders = {}
    if (parseInt(cacheControlMaxAge) > 0) {
      responseHeaders = {
        'Cache-Control': `public, max-age=${cacheControlMaxAge}`
      };
    }

    return {
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
module.exports = { handler };
