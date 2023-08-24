require('dotenv').config();
const helmet = require('helmet');
const compression = require('compression');
const debug = require('debug')('dedebe');
const bodyParser = require('body-parser')
const express = require("express");
const cors = require("cors");
const https = require('https');
const fs = require('fs');

// restrict origin list
let whitelist = [
    'http://localhost:8080',
    'http://192.168.22.16',
    'http://srv-web-02.vbn-gmbh.local',
    'http://localhost:2222',
    'http://localhost',
    'https://www.dede.swingbe.de'
];

const app = express();
app.use(compression()); //Compress all routes
app.use(helmet());//protect against vulnerabilities
app.use(cors({
    origin: function(origin, callback){
        // allow requests with no origin
        debug('origin: '+origin)
        if(!origin){
            return callback(null, true);
        }
        if(whitelist.indexOf(origin) === -1){
            var message = 'The CORS policy for this origin does not allow access from the particular origin: '+origin;
            return callback(new Error(message), false);
        }
        debug('origin: '+origin+' allowed by cors');
        return callback(null, true);
    }
}));

const PORT=parseInt(process.env.PORT, 10)||55555;
debug('PORT: '+PORT)

// pass 'app' to 'https' server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT);
    debug('DEV: listening on port '+PORT);
}else{
    const PHRASE=process.env.PHRASE||'phrase';
    debug('PHRASE: '+PHRASE)
    https.createServer({
        key: fs.readFileSync('./p'),
        cert: fs.readFileSync('./f'),
        passphrase: PHRASE
    }, app)
    .listen(PORT, ()=>debug('PROD: listening on port '+PORT));
}

// create application/json parser
var jsonParser = bodyParser.json()

//ALL CRUD HANDLERS HERE
//GET == READ
app.get('/ivu-loc', (req, res) => {
    debug('get /ivu-loc: req: ' + JSON.stringify(req));

    res.end();
})

app.get('/', (req, res) => {
    debug('get /: req: ' + JSON.stringify(req));

    res.end();
})

app.post('/ivu-loc', jsonParser, function(req, res) {
    debug('post /ivu-loc: req: ' + JSON.stringify(req));

    res.end();
});

app.post('/postdata', jsonParser, function(req, res) {
    debug('post /postdata: req: ' + JSON.stringify(req));

    res.end();
});
