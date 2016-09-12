var expect = require('chai').expect;
var io = require('socket.io-client');
var should = require('should');

describe('Socket Tests', function() {

	var server,
	model,
	options ={
		transports: ['websocket'],
		'force new connection': true
	};

	beforeEach(function (done) {
        // start the server
        server = require('../server/main').server;
        model = require('../server/main').model;

        done();
    });

	afterEach(function (done) {
		model.remove({ip: 'toBeDeleted'}, function(){
			done();
		});
	});

	it('Connects client to server correctly', function(done) {
		var client = io.connect("http://localhost:8080", options); //make sure to adjust port and host in case of change

		client.once("connect", function () {
			client.once("connected", function (message) {
				message.should.equal("yes");

				client.disconnect();
				done();
			});
		});
	});

	it('Should insert donor in collection upon newpin emit', function(done) {
		var client = io.connect("http://localhost:8080", options); //make sure to adjust port and host in case of change

		client.once('connect', function () {
			client.emit('newpin', {
				firstName: 'test1',
				lastName: 'test2',
				telephone: 'test3',
				email: 'test4',
				bloodType: 'test5',
				latitude: 0,
				longitude: 0,
				ip: 'toBeDeleted',
				id: 'toBeDeleted'
			});

			expect(model.findOne({ip: 'toBeDeleted'})).to.not.equal(null);
			
			client.once('addedpin', function(){ //in order to make sure to remove the test doner
				client.disconnect();
				done();
			});
		});
	});

	it('Should delete donor in collection upon deletepin emit', function(done) {
		var client = io.connect("http://localhost:8080", options); //make sure to adjust port and host in case of change

		var m = new model({
			firstName: 'test1',
			lastName: 'test2',
			telephone: 'test3', //format is being validated on client side in the form
			email: 'test4', //format is being validated on client side in the form
			bloodType: 'test5',
			latitude: 0,
			longitude: 0,
			ip: 'toBeDeleted',
			id: 'toBeDeleted'
		});

		m.save(function(err){
			if(err) console.log(err);
		});

		client.once('connect', function () {

			client.emit('deletepin', {id: 'toBeDeleted'});
			
			client.disconnect();

		});
		model.findOne({id: 'toBeDeleted'}, function(err, item){
			expect(item).to.equal(null);
		});

		done();
	});
});