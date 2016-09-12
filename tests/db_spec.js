var expect = require('chai').expect;

var Donor = require('../server/main').model;

describe('Donor Model', function() {
	
	afterEach(function(done){
		Donor.remove({ip: 'toBeDeleted'}, function(){
			done();
		});
	});

	it('should be invalid if any model property is empty (they are all required)', function(done) {
		var m = new Donor();
		m.validate(function(err) {
			expect(err.errors.firstName).to.exist;
			expect(err.errors.lastName).to.exist;
			expect(err.errors.telephone).to.exist;
			expect(err.errors.email).to.exist;
			expect(err.errors.bloodType).to.exist;
			expect(err.errors.latitude).to.exist;
			expect(err.errors.longitude).to.exist;
			expect(err.errors.ip).to.exist;
			done();
		});
	});

	it('should create new donor if all inputs are present', function(done) {
		var m = new Donor({
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
		})

		expect(Donor.findOne({ip: 'toBeDeleted'})).to.not.equal(null);

		done();
	});

});