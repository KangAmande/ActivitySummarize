const vscode = require('vscode'); // vscode is a module provided by Visual Studio Code that allows extensions to interact with the editor
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
            timestamp: new Date().toISOString()  // Current timestamp in ISO 8601 format
        };
        logActivity(activity);
    });

    // Monitor command executions
    vscode.commands.onDidExecuteCommand(command => {
        const activity = {
            type: 'command',
            command: command.command,
            timestamp: new Date().toISOString()  // Current timestamp in ISO 8601 format
        };
        logActivity(activity);
    });

    // Monitor active editor changes
    vscode.window.onDidChangeActiveTextEditor(editor => {
        if(editor){
            const activity = {
                type: 'activeEditorChange',
                file: editor.document.uri.fsPath,
                timestamp: new Date().toISOString()  // Current timestamp in ISO 8601 format
            };
            logActivity(activity);
        }
    });
}

function logActivity(activity){
    fs.appendFileSync(activityFile, JSON.stringify(activity) + '\n');
}

function deactivate(context){
}

module.exports = {
    activate,
    deactivate
};