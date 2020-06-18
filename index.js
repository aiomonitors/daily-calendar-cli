/* eslint-disable no-console */
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const { mainPrompt } = require('./prompts');

const SCOPES = ['https://www.googleapis.com/auth/calendar'];
const TOKEN_PATH = 'token.json';

const getAccessToken = (oAuth2Client, callback) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            // eslint-disable-next-line consistent-return
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (writeError) => {
                if (writeError) return console.error(writeError);
                console.log('Token stored to', TOKEN_PATH);
            });
            return callback(oAuth2Client);
        });
    });
};

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
};

const authorize = (credentials, callback) => {
    /* eslint-disable camelcase */
    const {
        client_secret,
        client_id,
        redirect_uris,
    } = credentials.installed;
    /* eslint-enable camelcase */

    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0],
    );

    // eslint-disable-next-line consistent-return
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) {
            return getAccessToken(oAuth2Client, callback);
        }
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
};

const main = async (auth) => {
    const calendar = google.calendar({ version: 'v3', auth });
    const items = await mainPrompt();
    for (let i = 0; i < items.length; i += 1) {
        const {
            summary,
            start,
            end,
            calendarId,
            reminders,
        } = items[i];
        const body = {
            calendarId,
            requestBody: {
                summary,
                start,
                end,
                reminders,
            },
        };
        // eslint-disable-next-line consistent-return
        await wait(1000);
        calendar.events.insert(body, (err, res) => {
            if (err) return console.log(err);
            if (res.data.status === 'confirmed') {
                console.log(`Added ${body.requestBody.summary}`);
            }
        });
    }
};

// eslint-disable-next-line no-unused-vars
const listEvents = async (auth) => {
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
        // eslint-disable-next-line consistent-return
    }, (err, res) => {
        if (err) return console.log(`The API returned an error: ${err}`);
        const events = res.data.items;
        if (events.length) {
            console.log('Upcoming 10 events:');
            // eslint-disable-next-line consistent-return, array-callback-return, no-unused-vars
            events.map((event, _) => {
                console.log(event);
            });
        } else {
            console.log('No upcoming events found.');
        }
  });
};

const mainTest = async () => {
    const items = await mainPrompt();
    console.log(items);
};

// eslint-disable-next-line consistent-return
fs.readFile('credentials.json', (err, content) => {
    if (err) {
        return console.log('Error loading client secret file:', err);
    }
    authorize(JSON.parse(content), main);
});
