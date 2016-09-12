/*
This file contains the setups for the mongodb (via mongoose), socket.io and express server. 
This is mainly for the simplicity and readability purposes of this assignment.
*/

'use strict';
var chalk = require('chalk');
var io = require('socket.io');
var express = require('express');
var app = express();
var path = require('path');

//Mongodb setup: --------------------------------------------------
var mongoose = require('mongoose');
var db = mongoose.connection;
var donorSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    telephone: {type: String, required: true},
    email: {type: String, required: true},
    bloodType: {type: String, required: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    ip: {type: String, required: true},
    id: {type: String, required: true}
});

var Donors = mongoose.model('donors', donorSchema, 'donors');

mongoose.connect('mongodb://test:test@ds029106.mlab.com:29106/blood-donor-jramia');
mongoose.set('debug', true);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

// Static middleware: ---------------------------------------------
app.use(express.static(path.join(__dirname + '/../node_modules')));
app.use(express.static(path.join(__dirname + '/../browser')));

var server = app.listen(Number(process.env.PORT) || 8080, function () {
  console.log(chalk.blue('App listening on port ' + 8080));
});

/*
 This middleware will catch any URLs resembling a file extension
 for example: .js, .html, .css
 This allows for proper 404s instead of the wildcard '/*' catching
 URLs that bypass express.static because the given file does not exist.
 */
 app.use(function (req, res, next) {

    if (path.extname(req.path).length > 0) {
        res.status(404).end();
    } else {
        next(null);
    }

});

// Error catching endware.
app.use(function (err, req, res, next) {
    console.error(err, typeof next);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});

// Socket.io setup: -----------------------------------------------
io = io.listen(server);

var alldonors = [];

function updatePins(){
    alldonors = [];
    var allpins = db.collection('donors').find({});
    allpins.forEach(function (item){
        alldonors.push(item);
    });
}

io.on('connection', function (socket) {

    // get the ip address and send it to client, so if they post a donor they will have their ip:
    var clientIp = socket.request.connection.remoteAddress;

    socket.emit('getip', clientIp); //emit it back to client

    socket.emit('connected', 'yes'); //for unit tests (please see server_spec.js)

    updatePins();

    console.log("new socket: ", socket.id); //for control only

    socket.on('newpin', function (data) {
        var donor = new Donors(data);
        donor.save(function(err){
            if (err) {
                console.log(err);
            }
        });
        alldonors.push(donor);
        socket.emit('addedpin', 'yes');
    });

    socket.on('editpin', function (data) {
        db.collection('donors').findOneAndUpdate({id: data.id}, data);
        updatePins();
    });

    socket.on('deletepin', function (data) {
        db.collection('donors').remove(data);
        updatePins();
        io.emit('clearpins', {});
    });

    socket.on('getpins', function(){
        io.emit('loadpins', alldonors); //io instead of socket so that all users can receive the new info
    });
    socket.on('getnewpins', function(){
        io.emit('loadnewpins', alldonors);
    });

});

// Exports for unit testing: -----------------------------------------------


module.exports = {
    model: Donors,
    server: server
}