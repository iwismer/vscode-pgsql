const vscode = require('vscode')
const cmd = require('./commands').default()
const completion = require('./completion').default
const signature = require('./signature').default

exports.activate = context => {

    cmd.activate( context.subscriptions )

    let disposable = vscode.commands.registerCommand( 'pgsql.run', cmd.run )
    context.subscriptions.push( disposable )

    const doctype = 'pgsql'
    disposable = vscode.languages.registerCompletionItemProvider( doctype, completion, " " )
    context.subscriptions.push( disposable )

    disposable = vscode.languages.registerSignatureHelpProvider( doctype, signature, '(', ',' )
    context.subscriptions.push( disposable )

}

// when your extension is deactivated
exports.deactivate = () => {}