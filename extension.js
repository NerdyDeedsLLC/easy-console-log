// @ts-nocheck
const vscode = require('vscode');
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let count = 0;
	let disposable = vscode.commands.registerCommand('extension.addConsoleLog', function() {

		settings = vscode.workspace.getConfiguration().get('consoleLog.config');
		if (!settings) {
			settings = {
				"javascript": `console.log("{count}: Line {line}, {current} ");`,
				"php": `echo "{count}: Line {line}, {current}\\r\\n";`,
				//"plaintext": `[DEBUG] {count}: Line {line}, {current}`,
			};
		}
		if (!settings.hasOwnProperty('plaintext')) {
			settings["plaintext"] = `[] {count}: Line {line}, {current}`;
        }
        
        const activeEditor = vscode.window.activeTextEditor;
        
		if (activeEditor) {
            count++;
            
			let line = activeEditor.selection.active.line;
			const language = activeEditor.document.languageId;
			const currentLineID = activeEditor.document.lineAt(line);
			let currentLine = activeEditor.document.lineAt(line).text;
            
			if (!currentLine) {
                currentLine = activeEditor.document.lineAt(line+1).text;
                line = line + 2;
			}

			let current = currentLine.match(/(\w+)/) || currentLine;
			if (current != currentLine) current = current[0];

			let tabs = currentLine.match(/^([ \t]+)/) || "";
			if (tabs !== "") tabs = tabs[0];
			let text = settings[language] || settings["plaintext"];
			text = tabs + text;
			text = text.replace(/\{count\}/g, count);
			text = text.replace(/\{line\}/g, (line + 1));
			text = text.replace(/\{current\}/g, current);
			vscode.window.activeTextEditor.edit((editBuilder) => {
				editBuilder.insert(currentLineID.range.end, `\r\n${text}`);
			});
		}
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}