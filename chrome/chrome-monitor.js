const CDP = require('chrome-remote-interface');
const fs = require('fs');
const path = require('path');

const activityFile = path.join(__dirname, 'chrome_activities.json');

async function monitorChrome() {
    const client = await CDP();
    const { Network, Page } = client;

    // Enable events
    await Network.enable();
    await Page.enable();

    // Monitor network requests
    Network.requestWillBeSent(params => {
        const activity = {
            type: 'request',
            url: params.request.url,
            timestamp: new Date().toISOString()
        };
        logActivity(activity);
    });

    // Monitor page navigations
    Page.loadEventFired(() => {
        const activity = {
            type: 'pageLoad',
            timestamp: new Date().toISOString()
        };
        logActivity(activity);
    });

    // Close the client when done
    await client.close();
}

function logActivity(activity) {
    fs.appendFileSync(activityFile, JSON.stringify(activity) + '\n');
}

monitorChrome().catch(err => {
    console.error(err);
});