var assert = require('assert');
var utils = require('./utils.js');

require('../index.js');

describe('native module', function() {

	it('os.cpus without invalidable', function() {
		
		var mod = new utils.TmpModule(`
			module.exports = require('os');
		`);
		
		assert.equal(typeof mod.module.exports.cpus(), 'object');
	});

	it('os.cpus with invalidable', function() {
		
		var mod = new utils.TmpModule(`
			module.invalidable = true;
			module.exports = require('os');
		`);
		
		assert.equal(typeof mod.module.exports.cpus(), 'object');
	});


	it('lib ffi', function() {
		
		var ffi = require('ffi');
		var libm = new ffi.Library('msvcrt', {
			'ceil': [ 'double', [ 'double' ] ]
		});
		assert.equal(libm.ceil(1.1), 2);
	});
	

	it('Function::bind', function() {

		var mod = new utils.TmpModule(`
			module.invalidable = true;
			module.exports = function() { return this.foo }.bind(module.exports);
			module.exports.foo = 123;
		`);
		
		assert.equal(typeof mod.module.exports, 'function');
		assert.equal(mod.module.exports(), 123);
	});


	
	it('exports Promise::then', function() {

		var mod = new utils.TmpModule(`
			module.invalidable = true;
			module.exports = Promise.resolve(123);
		`);
		
		assert.equal(typeof mod.module.exports.then, 'function');
		
		return mod.module.exports.then(function(result) {
			
			assert.equal(result, 123);
		});
	});
	

});