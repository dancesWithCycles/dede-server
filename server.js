/*
 * SPDX-FileCopyrightText: 2021 Stefan Begerad <stefan@begerad.de>
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

require('dotenv').config();
const helmet = require('helmet');
const compression = require('compression');
const debug = require('debug')('dedebe');
const bodyParser = require('body-parser')
const express = require("express");
const cors = require("cors");
const https = require('https');
const fs = require('fs');
const mongoose = require('./dede-mongo/connect')
const Location=require('./dede-mongo/models/vehicle.js')

// restrict origin list
let whitelist = [
    'https://localhost',
    'http://localhost:2222',
    'http://localhost'
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
}else{
    const PHRASE=process.env.PHRASE||'phrase';
    debug('PHRASE: '+PHRASE)
    https.createServer({
        key: fs.readFileSync('./p'),
        cert: fs.readFileSync('./f'),
        passphrase: PHRASE
    }, app)
    .listen(PORT, ()=>debug('listening on port '+PORT));
}

// create application/json parser
var jsonParser = bodyParser.json()

const db = mongoose.connection
db.once('open', _ => {
    debug('Database connected')
})
db.on('error', err => {
    console.error('connection error:', err)
})

//ALL CRUD HANDLERS HERE
//GET == READ
app.get('/', (req, res) => {
    db.collection('vehicles').find().toArray()
    //TODO: How can we change this to an generic call without using a collection name as argument?
//    db.collection('locations').find().toArray()
	.then(results => {
        res.json(results)//same as: res.end(JSON.stringify(results))
	})
	.catch(error => {
	    debug('GET / error:'+error)
	    console.error(error)
	})
})

function updateLocation(locA,locB){
    locA.lat=locB.lat
    locA.lon=locB.lon
    locA.ts=locB.ts
    locA.alias=locB.alias
    locA.vehicle=locB.vehicle
}    

function createLocation(reqPost){
    //create new Location instance based on request
    let loc = new Location()
    loc.uuid=reqPost.body.uuid
    loc.lat=reqPost.body.latitude
    loc.lon=reqPost.body.longitude
    loc.ts=reqPost.body.timestamp
    loc.alias=reqPost.body.alias
    loc.vehicle=reqPost.body.vehicle
    return loc
}

//POST == CREATE
app.post('/postdata', jsonParser, function(req, res) {
    var locNew=createLocation(req)
    
    //check database for existing locations
    var queryUuid=locNew.uuid
    Location.findOne({uuid:queryUuid}, function(err, location){
	if(err){
	    debug('find location error: '+err)
	}
	else if(location){
	    updateLocation(location,locNew)
	    saveLocation(location)
	}else{
	    saveLocation(locNew)
	}
    });

    res.end();
});

function saveLocation(loc){
    loc.save(function(err, location) {
        if(err){
	    debug('save error:'+err)
	}
    });
}
