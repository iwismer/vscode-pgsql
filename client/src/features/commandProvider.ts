
import * as vscode from 'vscode';
import * as ChPr from 'child_process';
import LineDecoder from './lineDecoder';


export default class pgsqlCommandProvider  {
    
    private executable :string = 'psql'
    private connection :string
    private outChannel : vscode.OutputChannel;
    
    public activate(subscriptions: vscode.Disposable[]) {
        let cp = this
        cp.outChannel = vscode.window.createOutputChannel("pgsql")
        vscode.workspace.onDidChangeConfiguration( cp.loadConfiguration, cp, subscriptions )
		cp.loadConfiguration()
	}
    
    public loadConfiguration():void  {
        let section = vscode.workspace.getConfiguration('pgsql')
		if (section) {
			this.connection = section.get<string>('connection', null)
		}
    }

    public run():void {

        let cpv = this // [c]ommand [p]ro[v]ider
        
        let editor = vscode.window.activeTextEditor
        
        if ( !editor ) return // No open text editor
        
        let args = [  
            "-d", cpv.connection,
            "-f", editor.document.fileName
        ]
        
        let childProcess = ChPr.spawn( cpv.executable, args )
        args.unshift( cpv.executable )
        console.log( args.join(" ") )
        
        childProcess.on('error', ( err: Error ) => {
            
            let ecode: string = (<any>err).code 
            let message: string = err.message || `Failed to run: ${cpv.executable} ${args.join(' ')}. ${ecode}.`
            
            if ((<any>err).code === 'ENOENT') {
                message = `The 'psql' program was not found. Please ensure the 'psql' is in your Path`
            } 
            vscode.window.showInformationMessage( message )
            
        });

        if (childProcess.pid) {
            
            let decoder = new LineDecoder()
            cpv.outChannel.show( vscode.ViewColumn.Two )
            
            childProcess.stdout.on('data', (data) => {
                decoder.write(data).forEach( function (line:string) {
                    cpv.outChannel.appendLine( line )
                })
            })
            
            childProcess.stderr.on('data', ( data ) => {
                decoder.write( data ).forEach( function (line:string) {
                    cpv.outChannel.appendLine( line )
                })
            })

            childProcess.stdout.on('end', () => {
                cpv.outChannel.appendLine('pgsql executed.')
            })

        } 
    }
}