
import { window, workspace, ViewColumn, OutputChannel, Disposable } from 'vscode';
import * as ChildProcess from 'child_process';
import LineDecoder from './lineDecoder';


export default class pgsqlCommandProvider  {
    
    private executable :string = 'psql'
    private connection :string
    private outChannel : OutputChannel;
    
    public activate(subscriptions: Disposable[]) {
        let cp = this
        cp.outChannel = window.createOutputChannel("pgsql")
        workspace.onDidChangeConfiguration( cp.loadConfiguration, cp, subscriptions )
		cp.loadConfiguration()
	}
    
    public loadConfiguration():void  {
        let section = workspace.getConfiguration('pgsql')
		if (section) {
			this.connection = section.get<string>('connection', null)
		}
    }

    public run():void {

        if ( !window.activeTextEditor ) return // No open text editor

        let doc = window.activeTextEditor.document

        // if doc never saved before
        // vscode change editor after save
        if ( doc.isUntitled ) { 
           
           window.showInformationMessage( 'pgsql: Please, save document and press Ctrl+F5 again' )
           return  
        } 

        let pgsql = this 
        
        // file already have real filename, just run it via psql
        if ( !doc.isDirty ) return pgsql.runFile( doc.fileName )
        
        // file was changed (dirty), save it andthen
        doc.save().then( ( saved: boolean ) => {
            if ( !saved ) return
            pgsql.runFile( doc.fileName )
        }, e => {
            console.log( 'pgsql: doc.save() rejected' )
        })
        
    }

    public runFile( fileName: string ): void {

        let pgsql = this,
            args = [  
                "-d", pgsql.connection,
                "-f", fileName
            ]
        
        let cp = ChildProcess.spawn( pgsql.executable, args )

        //args.unshift( pgsql.executable )
        //console.log( args.join(" ") )
        
        cp.on( 'error', ( err: Error ) => {
            
            let ecode: string = (<any>err).code 
            let defmsg = `Failed to run: ${pgsql.executable} ${args.join(' ')}. ${ecode}.`
            let message: string = err.message || defmsg
            
            if ((<any>err).code === 'ENOENT') {
                message = `The 'psql' program was not found. Please ensure the 'psql' is in your Path`
            } 
            window.showInformationMessage( message )
            
        });

        pgsql.outChannel.show( ViewColumn.Two )
        
        if ( !cp.pid ){
            return pgsql.outChannel.appendLine( 'pgsql: can\'t spawn child proceess' )    
        }
          
        let decoder = new LineDecoder()
        pgsql.outChannel.show( ViewColumn.Two )
        
        cp.stdout.on('data', (data) => {
            decoder.write(data).forEach( function (line:string) {
                pgsql.outChannel.appendLine( line )
            })
        })
        
        cp.stderr.on('data', ( data ) => {
            decoder.write( data ).forEach( function (line:string) {
                pgsql.outChannel.appendLine( line )
            })
        })

        cp.stdout.on('end', () => {
            pgsql.outChannel.appendLine('pgsql end.')
        })

    }
}