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
				"javascript": `console.log("{count}: Line {line}, {current} ", {current});`,
				"php": `echo "{count}: Line {line}, {current}\\r\\n"{current}\\r\\n;`,
				"plaintext": `[DEBUG] {count}: Line {line}, {current}`,
			};
		}
		if (!settings.hasOwnProperty('plaintext')) {
			settings["plaintext"] = `[] {count}: Line {line}, {current}`;
		}

		const activeEditor = vscode.window.activeTextEditor;

		if (activeEditor) {
			count++;

			const selection     = activeEditor.selection;
			let   line          = activeEditor.selection.active.line;
			const language      = activeEditor.document.languageId;
            const currentLineID = activeEditor.document.lineAt(line);
            
			let currentLine        = activeEditor.document.lineAt(line).text;
			let tabs               = currentLine.match(/^([ \t]+)/) || "";
			if  (tabs !== "") tabs = tabs[0];

			if (selection.start.character !== selection.end.character)
                currentLine = activeEditor.document.getText(selection);
                
			if (currentLine.replace(/[\t ]/g,"").length === 0) {
				currentLine = activeEditor.document.lineAt(line + 1).text;
				line = line + 2;
            }
            
			let current = currentLine.match(/(\w(\w+| ))+/) || currentLine;
			if (current != currentLine) current = current[0];
			currentLine = currentLine.trim();

			let text = settings[language] || settings["plaintext"];

			text = tabs + text;
			text = text.replace(/\{count\}/g, count);
			text = text.replace(/\{line\}/g, (line + 1));
			text = text.replace(/\{current\}/g, current);

			vscode.window.activeTextEditor.edit((editBuilder) => {
				editBuilder.insert(currentLineID.range.end, `\n${text}`);
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