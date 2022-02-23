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
    'http://192.168.22.16',
    'http://srv-web-02.vbn-gmbh.local',
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
    db.collection('ivulocationmsgs').find().toArray()
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

function updateIvuLoc(ivuLocA,ivuLocB){
    ivuLocA.date=ivuLocB.date
    ivuLocA.time=ivuLocB.time
    ivuLocA.logLevel=ivuLocB.logLevel
    ivuLocA.addressPartA=ivuLocB.addressPartA
    ivuLocA.addressPartB=ivuLocB.addressPartB
    ivuLocA.peer=ivuLocB.peer
    ivuLocA.addressNext=ivuLocB.addressNext
    ivuLocA.direction=ivuLocB.direction
    ivuLocA.senderType=ivuLocB.senderType
    ivuLocA.senderId=ivuLocB.senderId
    ivuLocA.receiverType=ivuLocB.receiverType
    ivuLocA.receiverId=ivuLocB.receiverId
    ivuLocA.teleType=ivuLocB.teleType
    ivuLocA.teleVersion=ivuLocB.teleVersion
    ivuLocA.teleId=ivuLocB.teleId
    ivuLocA.netPoint=ivuLocB.netPoint
    ivuLocA.relPosition=ivuLocB.relPosition
    ivuLocA.longitude=ivuLocB.longitude
    ivuLocA.latitude=ivuLocB.latitude
    ivuLocA.offRoute=ivuLocB.offRoute
    ivuLocA.velocity=ivuLocB.velocity
    ivuLocA.heading=ivuLocB.heading
    ivuLocA.driverNumber=ivuLocB.driverNumber
    ivuLocA.blockNo=ivuLocB.blockNo
    ivuLocA.lineNo=ivuLocB.lineNo
    ivuLocA.tripNo=ivuLocB.tripNo
    ivuLocA.routeNo=ivuLocB.routeNo
    ivuLocA.deviation=ivuLocB.deviation
    ivuLocA.loadDegree=ivuLocB.loadDegree
    ivuLocA.destinationNo=ivuLocB.destinationNo
    ivuLocA.tripType=ivuLocB.tripType
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
    ivuLoc.senderType=reqPost.body.senderType
    ivuLoc.senderId=reqPost.body.senderId
    ivuLoc.receiverType=reqPost.body.receiverType
    ivuLoc.receiverId=reqPost.body.receiverId
    ivuLoc.teleType=reqPost.body.teleType
    ivuLoc.teleVersion=reqPost.body.teleVersion
    ivuLoc.teleId=reqPost.body.teleId
    ivuLoc.netPoint=reqPost.body.netPoint
    ivuLoc.relPosition=reqPost.body.relPosition
    ivuLoc.longitude=reqPost.body.longitude
    ivuLoc.latitude=reqPost.body.latitude
    ivuLoc.offRoute=reqPost.body.offRoute
    ivuLoc.velocity=reqPost.body.velocity
    ivuLoc.heading=reqPost.body.heading
    ivuLoc.driverNumber=reqPost.body.driverNumber
    ivuLoc.blockNo=reqPost.body.blockNo
    ivuLoc.lineNo=reqPost.body.lineNo
    ivuLoc.tripNo=reqPost.body.tripNo
    ivuLoc.routeNo=reqPost.body.routeNo
    ivuLoc.deviation=reqPost.body.deviation
    ivuLoc.loadDegree=reqPost.body.loadDegree
    ivuLoc.destinationNo=reqPost.body.destinationNo
    ivuLoc.tripType=reqPost.body.tripType
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
    //create new document based on request data
    var ivuLocNew=createIvuLoc(req)

    //check database if document already exists
    var querySender=ivuLocNew.sender

    //find data from database
    modelIvuLoc.findOne({sender:querySender}, function(err, doc){
	if(err){
	    debug('find ivu location msg error: '+err)
	}else if(doc){
	    //update document
	    updateIvuLoc(doc,ivuLocNew)

	    //save document
	    doc.save(function(err, location) {
		if(err){
		    debug('find():save() ivu loc msg error: '+err)
		}
	    });
	}else{
	    //save document
	    ivuLocNew.save(function(err, location) {
		if(err){
		    debug('find():save() ivu loc msg error: '+err)
		}
	    });
	}
    });
    res.end();
});

app.post('/postdata', jsonParser, function(req, res) {
    //create new document based on request data
    var locNew=createVehicle(req)
    
    //check database if document already exists
    var queryUuid=locNew.uuid
    modelVehicle.findOne({uuid:queryUuid}, function(err, doc){
	if(err){
	    debug('find vehicle msg error: '+err)
	}
	else if(doc){
	    //update document
	    updateVehicle(doc,locNew)

	    //save document
	    doc.save(function(err, location) {
		if(err){
		    debug('find():save() obu msg error: '+err)
		}
	    });
	}else{
	    //save document
	    locNew.save(function(err, location) {
		if(err){
		    debug('find():save() obu msg error: '+err)
		}
	    });
	}
    });
    res.end();
});
