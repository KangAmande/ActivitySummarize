const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const activityFile = path.join(__dirname, 'vscode_activities.json');

// Activate the extension
function activate(context){
    console.log('Activity Monitor is now active!');

    // Monitor file edits
    vscode.workspace.onDidChangeTextDocument(event => {
        const activity = {
            type:'edit',
            file: event.document.uri.fsPath,
            timestamp: new Date().toISOString()
        };
        logActivity(activity);
    });
}

function deactivate(context){
}

function logActivity(activity){
    fs.appendFileSync(activityFile, JSON.stringify(activity) + '\n');
}
module.exports = {
    activate,
    deactivate
};