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
const modelVehicle=require('./dede-mongo/models/vehicle.js')
const modelIvuLoc=require('./dede-mongo/models/ivu-location-msg.js')

// restrict origin list
let whitelist = [
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
app.get('/ivu-loc', (req, res) => {
    db.collection('ivulocmsgs').find().toArray()
    //TODO: How can we change this to an generic call without using a collection name as argument?
//    db.collection('locations').find().toArray()
	.then(results => {
        res.json(results)//same as: res.end(JSON.stringify(results))
	})
	.catch(error => {
	    debug('GET /ivu-loc error:'+error)
	    console.error(error)
	})
})

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

function updateVehicle(locA,locB){
    locA.lat=locB.lat
    locA.lon=locB.lon
    locA.ts=locB.ts
    locA.alias=locB.alias
    locA.vehicle=locB.vehicle
}    

function createIvuLoc(reqPost){
    //create new modelIvuLoc instance based on request
    let ivuLoc = new modelIvuLoc()
    ivuLoc.date=reqPost.body.date
    ivuLoc.time=reqPost.body.time
    ivuLoc.logLevel=reqPost.body.logLevel
    ivuLoc.addressPartA=reqPost.body.addressPartA
    ivuLoc.addressPartB=reqPost.body.addressPartB
    ivuLoc.peer=reqPost.body.peer
    ivuLoc.addressNext=reqPost.body.addressNext
    ivuLoc.direction=reqPost.body.direction
    return ivuLoc
}

function createVehicle(reqPost){
    //create new modelVehicle instance based on request
    let loc = new modelVehicle()
    loc.uuid=reqPost.body.uuid
    loc.lat=reqPost.body.latitude
    loc.lon=reqPost.body.longitude
    loc.ts=reqPost.body.timestamp
    loc.alias=reqPost.body.alias
    loc.vehicle=reqPost.body.vehicle
    return loc
}

//POST == CREATE
app.post('/ivu-loc', jsonParser, function(req, res) {
    var ivuLocNew=createIvuLoc(req)

    //check database for existing db.collection.document
    //TODO

    //save db.collection.document
    saveIvuLoc(ivuLocNew)

    res.end();
});

app.post('/postdata', jsonParser, function(req, res) {
    var locNew=createVehicle(req)
    
    //check database for existing locations
    var queryUuid=locNew.uuid
    modelVehicle.findOne({uuid:queryUuid}, function(err, location){
	if(err){
	    debug('find location error: '+err)
	}
	else if(location){
	    updateVehicle(location,locNew)
	    saveVehicle(location)
	}else{
	    saveVehicle(locNew)
	}
    });

    res.end();
});

function saveIvuLoc(ivuLoc){
    ivuLoc.save(function(err, location) {
        if(err){
	    debug('saveIvuLoc() save error:'+err)
	}
    });
}

function saveVehicle(loc){
    loc.save(function(err, location) {
        if(err){
	    debug('saveVehicle() save error:'+err)
	}
    });
}
