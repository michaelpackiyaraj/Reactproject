const LOG_PREFIX = "WEB: ";

var tgtutil = require('./server/lib/tgtutil');
var path = require('path');
var express = require('express');
var fs = require('fs');

var app = express();
var request = require('request');
var bodyParser = require('body-parser')

var psDomain = "dev";
if(!psDomain){
    psDomain = "http://partnersummit2016.target.com";
}


app.use(express.static(path.join(__dirname, 'public')));

var redirectCuralate = "";
var showUpload = "";

var google = require ('googleapis');
google.options ({ auth: "lllll"});
var youtube = google.youtube ('v3');

app.get('/js/config.js', function (req, res) {
    var body = "var productsURL = '"+psDomain+"/api/v1/awesome-products';\n" +
        "var curalateURL = 'http://api.curalate.com/v1/reels/TargetstyleOnsiteReel.jsonp';\n" +
        "var google_analytics_account_number = '';\n" +
        "var psDomain = '" + psDomain + "';\n" +
        "var upload_enabled = '" + showUpload + "';\n";
    res.set('Content-Type', 'application/javascript');
    res.send(body);
});

app.get('/awe-fonts/:fontFileName', function(req, res) {
    var fontFileName = req.params.fontFileName;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    var newurl = psDomain + '/fonts/'+fontFileName;
    request(newurl).pipe(res);
});

app.get('/getBeautyYoutubeData', function (req, res) {
    res.type('application/json');
    var pageToken = req.query.pageToken;
    var itemsPerPage = req.query.itemsPerPage;
    if(!(itemsPerPage && itemsPerPage !== '')){
        itemsPerPage = 5;
    }
    var playlistItems;
    var requestOptions = {
        playlistId: 'PL49VV18KYYOM8oIdvRWzhnYxjDO_vLAVN',
        part: 'contentDetails',
        maxResults: itemsPerPage,
        order: 'date'
    };
    if (pageToken && pageToken !== '') {
        requestOptions.pageToken = pageToken;
    }
    youtube.playlistItems.list(
        requestOptions,
        function (err, resp) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(resp);
        }
    );
});

app.get('/getTargetStyleYoutubeData', function (req, res) {
    res.type('application/json');
    var pageToken = req.query.pageToken;
    var itemsPerPage = req.query.itemsPerPage;
    if(!(itemsPerPage && itemsPerPage !== '')){
        itemsPerPage = 5;
    }
    var playlistItems;
    var requestOptions = {
        playlistId: 'PL49VV18KYYOOqthqX8WS31YGDXkAn6fD8',
        part: 'contentDetails',
        maxResults: itemsPerPage,
        order: 'date'
    };
    if (pageToken && pageToken !== '') {
        requestOptions.pageToken = pageToken;
    }
    youtube.playlistItems.list(
        requestOptions,
        function (err, resp) {
            if (err) {
                res.send(err);
                return;
            }
            res.send(resp);
        }
    );
});


var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

var useNginx = (/^(true|1)$/i).test(process.env['TGTRAD_USE_NGINX_PROXY']) | false;
if (useNginx) {
    // listen on the nginx socket
    app.listen('/tmp/nginx.socket', function() {
        console.log(LOG_PREFIX + "Listening on UNIX socket");
    });

    // write nginx app initialized and ready for traffic
    fs.writeFile("/tmp/app-initialized", "Ready to launch nginx", function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log(LOG_PREFIX + "Signaled NGINX to start");
        }
    });

} else {
    // listen on heroku port or use something local
    var port = process.env.PORT || 3000;
    app.listen(port, function() {
        console.log(LOG_PREFIX + "Listening on " + port);
    });
}