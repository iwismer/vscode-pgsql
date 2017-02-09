# pgsql extension

This extension is fixed [clone](https://github.com/jptarqu/VSCodeExtension-PostgreSQL) of [postgresql by JPTarquino](https://marketplace.visualstudio.com/items?itemName=JPTarquino.postgresql)

## Features:
- Run current file into Postgres via psql
- Colorization
- Completion Lists for global postgres functions (copied from the Postgres official documentation)
- Snippets

![example](images/example.gif)


## Fixes
- use connection string with port and password
- add stderr output ( thanks for [khushboo shah](https://marketplace.visualstudio.com/items?itemName=JPTarquino.postgresql) )
- shorter command 

The extension recognizes the .sql,.ddl,.dml,.pgsql extension as sql files intended to be run in Postgres.

## Using
To run the current sql file through psql (Postgres native client) you must add the following settings to your workspace:

```javascript
{ "pgsql.connection": "postgres://username:password@host:port/database" }
```
You must also ensure that psql is in the OS executable path (it will be executed as simply "psql" from vscode).
The command to run the current file is "pgsql: run in postgres"