/*
Copyright (C) 2021  Stefan Begerad

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

require('dotenv').config();
const MONGOOSE = require('mongoose')
const debug = require('debug')('mongoose');

// enable logging collection methods + arguments to the console/file
if (process.env.NODE_ENV !== 'production') {
    MONGOOSE.set('debug',true)
}else{
    MONGOOSE.set('debug',false)
    }

const DB=process.env.MONGOOSE_DB||'testtest';
const PORT=parseInt(process.env.MONGOOSE_PORT)||27017;
const HOST=process.env.MONGOOSE_HOST||'localhost';
const UP=process.env.MONGOOSE_UP||'';
const TYPE=process.env.MONGOOSE_TYPE||'mongodb://';
const URL=TYPE+UP+HOST+':'+PORT+'/'+DB
debug('URL: %s',URL)

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true, // use the new Server Discover and Monitoring engine
    useCreateIndex: true,
    useFindAndModify: false,
    autoIndex: false, // Don't build indexes
    poolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
};

// The format of the URL is type://username:password@host:port/database_name.
MONGOOSE.connect(URL,options).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */
        debug('Connected to db.')
    },
    err => { /** handle initial connection error */
        debug('err:'+err)
    }
);
module.exports=MONGOOSE;
