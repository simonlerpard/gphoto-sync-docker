const { spawn } = require("child_process");
const express = require("express")
const app = express();
const validator = require('validator');
const fs = require('fs');

app.use(express.static(__dirname));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded({ extended: true })); // to support URL-encoded bodies

//var spw = spawn('php', ['test.php']);
var arguments = ['run','gphotos-sync','/target'];

const optionalArguments = [
	'album',				// String
	'favourites-only',		// Boolean
	'flush-index',			// Boolean
	'rescan',				// Boolean
	'retry-download',		// Boolean
	'skip-video',			// Boolean
	'skip-shared-albums',	// Boolean
	'start-date',			// String
	'end-date',				// String
	'log-level',			// String
	'use-flat-path',		// Boolean
	'new-token',			// Boolean
	'index-only',			// Boolean
	'skip-index',			// Boolean
	'do-delete',			// Boolean
	'skip-files',			// Boolean
	'skip-albums',			// Boolean
	'get-locations',		// Boolean
	'use-hardlinks',		// Boolean
	'no-album-index',		// Boolean
];

// Add optional arguments if specified
optionalArguments.forEach((arg) => {
	const env = arg.replace('-','_').toUpperCase();
	const value = process.env[env];
	if (value === 'true') {
		arguments.push('--' + arg);
	} else if (value !== undefined) {
		arguments.push('--' + arg);
		arguments.push(value);
	}
	console.log('start date:' + '--' + arg + " " + value);
});


var spw = spawn('pipenv', arguments);
var server = app.listen(4000);

// listen for an event
var stopServer = function() {
  server.close();
  process.exit(0)
};

var str = "";
var url = '';
var msg = '';

try {
	if (!fs.existsSync("/config/client_secret.json")) {
		var client_secret_template = {
			"installed":{
				"client_id":"",
				"project_id":"gphoto-sync",
				"auth_uri":"https://accounts.google.com/o/oauth2/auth",
				"token_uri":"https://oauth2.googleapis.com/token",
				"auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
				"client_secret":"",
				"redirect_uris":[
					"urn:ietf:wg:oauth:2.0:oob",
					"http://localhost"
				]
			}
		}
		if (process.env.PROJECT_ID !== undefined) {
			client_secret_template.installed.project_id = process.env.PROJECT_ID;
		}
		client_secret_template.installed.client_id = process.env.CLIENT_ID;
		client_secret_template.installed.client_secret = process.env.CLIENT_SECRET;
		client_secret_template.installed.redirect_uris = [process.env.WEBGUI + "/auth"];

		const jsonContent = JSON.stringify(client_secret_template);
		console.log(jsonContent);
		fs.writeFile("/config/client_secret.json", jsonContent, 'utf8', function (err) {
			if (err) {
				console.log("An error occured while writing JSON Object to File.");
				return console.log(err);
			}
			console.log("JSON client_secret file has been saved.");
		});
	}
} catch(err) {
	console.error(err)
}

spw.stdout.on('data', function (data) {
	str += data.toString();
	msg += data.toString();
	console.log(str);

	// Flush out line by line.
	var lines = str.split("\n");
	for(var i in lines) {
		if(i == lines.length - 1) {
			str = lines[i];
		} else{
			const searchLoginUrlString = 'Please go here and authorize, ';
			if (str.startsWith(searchLoginUrlString)) {
				url = str.substring(searchLoginUrlString.length, str.indexOf("\n")).trim();
				console.log('Found login request: ' + url);
			}
		}
	}
});

const stopSpawn = function (code, signal) {
	console.log('child process exited with ' +
			`code ${code} and signal ${signal}`);
	stopServer();
	process.exit(code);
}

spw.on('exit', stopSpawn);

spw.on('close', stopSpawn);

spw.stderr.on('data', function (data) {
	console.log(data.toString());
});

app.get('/', function(req, res){
	// Replace copy-paste to a redirect_uri (/send)
	// const redirect_uri = 'redirect_uri=' + req.protocol + '://' + req.get('host') + '/send';
	// url = url.replace('redirect_uri=urn:ietf:wg:oauth:2.0:oob', redirect_uri).replace('redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob', redirect_uri);
	if (validator.isURL(url)) {
		res.send('<a href="'+url+'">Login with Google account.</a>');
	} else {
	res.send('No authentication url available. Got this from the current log: <br>' + msg.replace('\n','<br>') + "\n\n\nURL:" + url);
	}
});

app.get('/auth', function(req, res){
	if (validator.isURL(url)) {
		 const key = req.query.code;
		 if (key !== undefined) {
			spw.stdin.write(key+ "\n");
			res.send('Authentication key is now sent to the gphoto-sync application.');
			console.log('Received: ' + key);
		 } else {
			 res.send('Failed to add key. Missing code value in the query.');
		 }
	} else {
		res.send("No authentication request has been triggered");
	}
});



/*
child.stdin.setEncoding('utf-8');
child.stdout.pipe(process.stdout);

child.stdin.write("yes\n");

/*


var cp = require("child_process");
var express = require("express");
var app = express();

 app.use(express.static(__dirname));

app.get('/msg', function(req, res){
    res.writeHead(200, { "Content-Type": "text/event-stream",
                         "Cache-control": "no-cache" });

    var spw = cp.spawn('ping', ['127.0.0.1']),
    str = "";

    spw.stdout.on('data', function (data) {
        str += data.toString();

        // just so we can see the server is doing something
        console.log("data");

        // Flush out line by line.
        var lines = str.split("\n");
        for(var i in lines) {
            if(i == lines.length - 1) {
                str = lines[i];
            } else{
                // Note: The double-newline is *required*
                res.write('data: ' + lines[i] + "\n\n");
            }
        }
    });

    spw.on('close', function (code) {
        res.end(str);
    });

    spw.stderr.on('data', function (data) {
        res.end('stderr: ' + data);
    });
});
*/