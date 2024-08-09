const CDP = require('chrome-remote-interface');
const fs = require('fs');
const path = require('path');

const activityFile = path.join(__dirname, 'chrome_activities.json');

async function monitorChrome() {
    let client;
    try {
        client = await CDP();
        console.log('Connected to Chrome');
    } catch (err) {
        console.error('Error connecting to Chrome:', err);
        return;
    }

    const { Network, Page } = client;

    // Enable events
    await Network.enable();
    await Page.enable();

    console.log('Monitoring Chrome activities...');

    // Monitor network requests
    Network.requestWillBeSent(params => {
        console.log('Network request:', params.request.url);
        const activity = {
            type: 'request',
            url: params.request.url,
            timestamp: new Date().toISOString()
        };
        logActivity(activity);
    });

    // Monitor page navigations
    Page.loadEventFired(() => {
        console.log('Page load event');
        const activity = {
            type: 'pageLoad',
            timestamp: new Date().toISOString()
        };
        logActivity(activity);
    });
}

function logActivity(activity) {
    fs.appendFile(activityFile, JSON.stringify(activity) + '\n', err => {
        if (err) {
            console.error('Error logging activity:', err);
        }
    });
}

monitorChrome();