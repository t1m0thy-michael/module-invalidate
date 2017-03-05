var assert = require('assert');
var utils = require('./utils.js');

require('../index.js');

describe('exports', function() {

	
	it('non-invalidable exports type', function() {
		
		var mod = new utils.TmpModule(`
			module.exports = {}
		`);
		assert.equal(typeof mod.module.exports, 'object');
	});


	it('invalidable exports type', function() {
		
		var mod = new utils.TmpModule(`
			module.invalidable = true;
			module.exports = {}
		`);
		assert.equal(typeof mod.module.exports, 'function');
	});


	it('exports type Object', function() {
		
		var mod = new utils.TmpModule(`
			module.invalidable = true;
			module.exports = {
				foo: 'bar'
			}
		`);
		assert.equal(mod.module.exports.foo, 'bar');
	});


	it('exports type Function', function() {
		
		var mod = new utils.TmpModule(`
			module.invalidable = true;
			module.exports = function() { return 'foo' }
		`);
		assert.equal(mod.module.exports(), 'foo');
	});
	
	
	it('exports type Array', function() {
		
		var mod = new utils.TmpModule(`
			module.invalidable = true;
			module.exports = [1,2,3];
		`);
		assert.equal(mod.module.exports[1], 2);
		assert.equal(mod.module.exports.length, 3);
		assert.equal(typeof mod.module.exports.map, 'function');
	});


	it('exports type primitive', function() {
		
		var mod = new utils.TmpModule(`
			module.invalidable = true;
			module.exports = 'foo';
		`);
		
		assert.throws(function() { mod.module.exports.length }, /TypeError/);
	});


	it('exports Object.keys', function() {
		
		var mod = new utils.TmpModule(`
			module.invalidable = true;
			module.exports = { a:1, b:2 };
		`);

		assert.equal(Object.keys(mod.module.exports).join(), 'a,b');
	});


	it('exports for-in', function() {
		
		var mod = new utils.TmpModule(`
			module.invalidable = true;
			module.exports = { a:1, b:2 };
		`);
		
		var res = '';
		for ( var prop in mod.module.exports )
			res += prop + mod.module.exports[prop];
		assert.equal(res, 'a1b2');
	});


	it('exports for-of', function() {
		
		var mod = new utils.TmpModule(`
			module.invalidable = true;
			module.exports = [1,2,3];
		`);
		
		var val = 0;
		for ( var v of mod.module.exports )
			val += v;

		assert.equal(val, 6);
	});


	it('exports this', function() {
		
		var mod = new utils.TmpModule(`
			module.invalidable = true;
			function ctor() {
				
				this.bar = 123;
				this.foo = function() {
					
					return this.bar;
					
				}
				
			}
			module.exports = new ctor;
		`);
		
		//assert.equal(mod.module.exports.constructor.name, 'ctor');
		assert.equal(mod.module.exports.foo(), 123);
	});
	
	
	it('property on function', function() {

		var mod = new utils.TmpModule(`
			module.invalidable = true;
			
			var fct = function() { return 123 };
			fct.bar = 456;
			module.exports.foo = fct
		`);
		
		assert.equal(typeof mod.module.exports.foo, 'function');
		assert.equal(mod.module.exports.foo(), 123);
		assert.equal(mod.module.exports.foo.bar, 456);
	});
	
	
	it('property on function through the proxy (v1)', function() {

		var mod = new utils.TmpModule(`
			module.invalidable = true;
			module.exports.foo = function() { return 123 };
			module.exports.foo.bar = 456;
		`);
		
		assert.equal(typeof mod.module.exports.foo, 'function');
		assert.equal(mod.module.exports.foo(), 123);
		assert.equal(mod.module.exports.foo.bar, 456);
	});
	
	
	it('property on function through the proxy (v2)', function() {

		var mod = new utils.TmpModule(`
			module.invalidable = true;
			module.exports.foo = function() { return 123 };
			module.exports.foo.bar = 456;
		`);
		
		assert.equal(typeof mod.module.exports.foo, 'function');

		assert.equal(mod.module.exports.foo.bar, 456);
		assert.equal(mod.module.exports.foo(), 123);
	});
	
	
});