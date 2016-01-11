# README

Add psql task:

{
	"version": "0.1.0",

	"command": "psql",

	"isShellCommand": true,

	"showOutput": "always",

	"args": ["-d", "postgres", "-U", "USERNAME", "-h", "SERVERNAME","-f", "${file}"]

}
