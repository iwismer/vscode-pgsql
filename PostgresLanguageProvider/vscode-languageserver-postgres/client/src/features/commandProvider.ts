
import * as vscode from 'vscode';
import * as cp from 'child_process';

export default class PostgresqlCommandProvider  {
    
    private hostName:string;
    private username:string;
    private dbName :string;
    private executable :string;
    private currPath :string;
    
    public activate(subscriptions: vscode.Disposable[]) {
        this.executable = "psql";
		vscode.workspace.onDidChangeConfiguration(this.loadConfiguration, this, subscriptions);
		vscode.workspace.onDidOpenTextDocument(this.changeCurrFile, this, subscriptions);
		this.loadConfiguration();

	}
    
    public changeCurrFile(newDoc: vscode.TextDocument):void
    {
        this.currPath = newDoc.fileName;
    }
    public loadConfiguration():void
    {
        let section = vscode.workspace.getConfiguration('postgreSql');
		if (section) {
			this.hostName = section.get<string>('hostName', null);
			this.username = section.get<string>('username', null);
			this.dbName = section.get<string>('dbName', null);
		}
    }
    
    public execFile():void
    {
        if(false 
            && this.hostName != null 
            && this.username != null
            && this.dbName != null
        )
        {
            let args =[ "-d", this.dbName, "-U", this.username, "-h", this.hostName,"-f", this.currPath];
            let childProcess = cp.spawn(this.executable, args, null);
			childProcess.on('error', (error: Error) => {
				
				let message: string = null;
				if ((<any>error).code === 'ENOENT') {
					message = `Cannot run the pgsql file. The psql program was not found. Please ensure the psql program is in yourt Path`;
				} else {
					message = error.message ? error.message : `Failed to run psql using path: ${this.executable}. Reason is unknown.`;
				}
				vscode.window.showInformationMessage(message);
                
			});
			if (childProcess.pid) {
				
                
				childProcess.stdout.on('data', (data: Buffer) => {
					console.log(data);
				});
				childProcess.stdout.on('end', () => {
					
                    
				});
			} else {
                
			}
        }
    }
}