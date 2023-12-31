The client is a radio station named Dublab. The work in this repo is productionalized on this page: https://www.dublab.com/schedule, and the backend of what is populated on the website was made through a netlify function

- Goal is for the scheduling backend to be powered by google calendar api vs the wordpress system they have now. This code is meant to integrate with the calendar they produce and display events on this /schedule page
- This public version will not have the tokens or credentials for security purposes, but the prod output is still viewable even though this repo will not function
    
Business ask:

1.  They want to post calendar events, and they usually recur but not always
2.  They have an old wordpress plugin that creates new events and it is difficult to deal with
3.  We are only changing the Schedule functionality on this page: https://www.dublab.com/schedule
4. Ideally want to use google calendar to organize the schedule page.
5. Website should look exactly the same, but right now its on wordpress, want to migrate it to GCal.
6. End result want to have a google calendar weekly view of events coming up want to put all details that are currently in an event into google calendar (title, description, include picture in the attachments and have the time)

Steps taken to get an MVP:

1. Create a new google calendar
2. Create some recurring events just like the website to simulate what the final result would be
3. Create multiple events on one day to test it better
4. Took a random event from the website, and put all that data into google calendar

Site Url: https://dublab-calendar.netlify.app
Site Repo: https://github.com/nstutelberg/DublabCalendar

Design Information / Decisions
 1. When the app is in testing mode, a 7 day token is administered, and you have to manually refresh the token and create a new credentials.json file and then execute index.js whenever this happens. The solution is to promote the app to production where the token doesn't expire unless access is revoked

 2. I set the dates to be 00:00:00 of the current day and went out 7 days to decide which events to retrieve. The timezeone is always set to Los Angeles / Pacific since that is where Dublab is based. The timezone will have to be manually swapped if Dublab changes where they are based

3. The default timeframe of returned events is 7 days, but I made the amount of days a parameter so that the frontend can edit the url to specify the number of days

4. The function that is being used in the scheduled function is being stored under the netlify/functions folder

Guides:
Configure Google Calendar API with Node:
    - https://developers.google.com/calendar/api/quickstart/nodejs

Google API Developer Portal
    - https://console.cloud.google.com/apis/credentials?project=dublab-calendar
    
Dublab Calendar
    - https://calendar.google.com/calendar/u/0/embed?src=gk393c6gkjjth1eco0h7l794vk@group.calendar.google.com


Work in progress: 
1. Update the error handling to be more robust once I see some of the common errors that can be thrown
2. Implement a logging system if it is required down the line
3. Store the credentials in a safer way vs storing them in a token.json file
