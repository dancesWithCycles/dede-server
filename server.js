/*
 * SPDX-FileCopyrightText: 2021 Stefan Begerad <stefan@begerad.de>
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

require('dotenv').config();
//helmet protects against vulnerabilities
const helmet = require('helmet');
//compress all routes
const compression = require('compression');
//enable debug log output
const debug = require('debug')('dedebe');
//create back end web application framework
const express = require("express");
//handle CORS
const cors = require("cors");
//enable HTTPS protocol
const https = require('https');
//access filesystem
const fs = require('fs');
//access Mongoose data base
const mongoose = require('./dede-mongo/connect')
//access data model for Mongoose
const Obc=require('./dede-mongo/models/on-board-computer.js')
const Location=require('./dede-mongo/models/vehicle.js')

// restrict origin list
let whitelist = [
    'http://localhost:2222',
    'http://localhost'
];

const app = express();
//look at requests with 'Content-Type: application/json'
app.use(express.json());
//do the same for URL-encoded requests
app.use(express.urlencoded({ extended: true }));
//compress routes
app.use(compression());

app.use(helmet());

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
    let PHRASE=process.env.PHRASE||'phrase';
    debug('PHRASE: '+PHRASE)

    let ssl = {
	key: fs.readFileSync('./p'),
	cert: fs.readFileSync('./f'),
	ca: fs.readFileSync('./c'),
	passphrase: PHRASE
    }

    https.createServer(ssl, app)
    .listen(PORT, ()=>debug('listening on port '+PORT));
}

const db = mongoose.connection
db.once('open', _ => {
    debug('Database connected')
})
db.on('error', err => {
    console.error('connection error:', err)
})

//merge infinite number of arrays
//without removing duplicate elements
//accept any number of arrays using rest operator
//iterate through each array using forEach loop
function mergeArrays(...arrays) {
    let mergedArray = [];
    arrays.forEach(array =>{
	//push() with spread operator pushes elements of arrays into the existing array
        mergedArray.push(...array)
    });
    return mergedArray;
}

//ALL CRUD HANDLERS HERE
//GET == READ
app.get('/', async (req, res) => {
    try{
	let VEHICLES=process.env.DB_COLLECTION_VEHICLES||'vehicles';
	debug('VEHICLES: '+VEHICLES)

	//use toArray() to store MongoDB result into an array instead of an object
	//use async/await or callback function to use asynchronous toArray()
	let vehiclesArray=await db.collection(VEHICLES).find().toArray();
	debug('vehiclesArray length: '+vehiclesArray.length)

	let OBCS=process.env.DB_COLLECTION_ONBOARDCOMPUTERS||'onboardcomputers';
	debug('OBCS: '+OBCS)

	let obcsArray=await db.collection(OBCS).find().toArray();
	debug('obcsArray length: '+obcsArray.length);

	let allArray=mergeArrays(vehiclesArray,obcsArray);
	debug('allArray length: '+allArray.length);

	res.json(allArray);
    }catch(error){
	res.status(500).json({error});
    }
})
