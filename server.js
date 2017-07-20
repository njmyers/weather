var http = require('http'),
    https = require('https'),
    url = require('url'),
    fs = require('fs'),
    port = 4040,
    encoding = 'utf8',
    keys;

var options = {
    key: fs.readFileSync('ssl/privateKey.key'),
    cert: fs.readFileSync('ssl/certificate.crt')
};

var p = readJSON('keys/keys.json', encoding);

p.then(function(data) {
    keys = data;
})

https.createServer(options, function(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');

    var q = URLizer(req.url);
    console.log(JSON.stringify(q));

    var options = {
        hostname: '',
        path: '',
        port: 443,
        method: 'GET'
    };

    if (q.pathname === '/hello') {
        res.writeHead(200);
        res.end('hello world')
    } else if (q.pathname === '/api/weather') {

        var params = '?exclude=[minutely,hourly,daily]',
            units = '?units=[us]';

        options.path = '/forecast/' + keys.darksky + '/' + q.query.lat + ',' + q.query.lon + params + units;
        options.hostname = 'api.darksky.net';

    } else if (q.pathname === '/api/city') {

        options.hostname = 'maps.googleapis.com';
        options.path = '/maps/api/geocode/json?latlng=' + q.query.lat + ',' + q.query.lon + '&key=' + keys.google;

    } else {

        res.write('Please enter a valid URL');
        res.end();
    }

    if (options.hostname) {

        var p = proxyReqHTTPS.call(this, options);

        p.then(function(data) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(data);
                console.log(res.finished);
            })
            .catch(function(err) {
                console.log(err);
            })

    }


}).listen(port);

console.log('listening on port: ' + port)

// Helper Functions

function URLizer(input) {
    var q = url.parse(input, true);
    return q;
}

function proxyReqHTTPS(options) {

    console.log(options)

    return new Promise(function(resolve, reject) {

        var req = https.request(options, function(res) {
            console.log(options)
            console.log('STATUS: ' + res.statusCode);
            console.log('HEADERS: ' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            var body = '';
            res.on('data', function(d) {
                console.log('Body: ' + d)
                body += d;
            });
            res.on('end', function() {
                console.log(res.headersSent);
                req.write(body);
                resolve(body);
            });
        });

        req.on('error', function(err) {
            reject('problem with request ' + err.message);
        });

        req.end();

    })
}

function readJSON(file, encoding) {
    return new Promise(function (resolve, reject) {
        fs.readFile(file, encoding, function (err, fileContents) {
            if (err) reject(err);
            else {
                var obj = JSON.parse(fileContents);
                resolve(obj);
            }
        });
    })
}