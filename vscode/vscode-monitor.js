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

    /**
    Register a command and monitor its execution
    const disposable = vscode.commands.registerCommand('extension.someCommand', () => {
        const activity = {
            type: 'command',
            command: 'extension.someCommand',
            timestamp: new Date().toISOString()  // Current timestamp in ISO 8601 format
        };
        logActivity(activity);
    });

    context.subscriptions.push(disposable);

    Make sure to replace 'extension.someCommand' with the actual command you want to monitor. Also, ensure that this command is defined in your package.json under the contributes.commands section.

    */ 

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
    fs.appendFile(activityFile, JSON.stringify(activity) + '\n', err => {
        if (err) {
            console.error('Failed to log activity:', err);
        }
    });
}

function deactivate(context){
}

module.exports = {
    activate,
    deactivate
};