/**
 * @fileoverview Tests for indentation rules
 * @author Alex Chapman <achap5dk@gmail.com>
 */

'use strict';

var Solium = require ('../../../../lib/solium'),
	wrappers = require ('../../../utils/wrappers');
var toContract = wrappers.toContract, toFunction = wrappers.toFunction;

var userConfig = {
	"custom-rules-filename": null,
	"rules": {
		"overflow-indentation": true,
	}
};

describe ('[RULE] indentation overflow: Rejections', function () {

	it ('should enforce the rule that excess element lists must go on individual lines', function (done) {
		var code = toContract ('function ArgumentOverflow(int one, int two, int three, int four) {}'),
			errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (1);
		errors[0].message.should.equal(
			'Function "ArgumentOverflow": in case of more than 3 parameters, drop each into its own line.');

		code = toFunction ('myFuncCall (10, "hello world", 20.67, 0x0);');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (1);
		errors [0].message.should.equal (
			'Function "myFuncCall": in case of more than 3 arguments, drop each into its own line.');

		code = toFunction ('uint[] x = [1,2,3,4];');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (1);
		errors [0].message.should.equal (
			'In case of more than 3 elements, array expression needs to be spread over multiple lines with 1 element per line.');

		code = toContract ('struct Sample {address a; uint b; string c; int d;}');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (1);
		errors [0].message.should.equal (
			'"Sample": In case of more than 3 properties, struct declaration needs to be spread over multiple lines with 1 property per line.');

		Solium.reset ();
		done ();
	});

});

describe ('[RULE] indentation overflow: Acceptances', function () {

	it ('should accept <= 3 arguments on single line', function (done) {
		var code = toContract ('function ArgumentOverflow(int one, int two, int three) {}'),
			errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (0);

		code = toFunction ('myFuncCall (10, "hello world", 20.67);');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (0);

		code = toFunction ('uint[] x = [1,2,3];');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (0);

		code = toContract ('struct Sample {address a; uint b; string c;}');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should accept > 3 arguments only when they are on their own lines', function (done) {
		var code = toContract ('function ArgumentOverflow(\nint one,\nint two,\nint three,\nint four) {}'),
			errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (0);

		code = toFunction ('myFuncCall (\n10,\n"hello world",\n20.67,\n0x0);');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (0);

		code = toFunction ('uint[] x = [\n1,\n2,\n3,\n4];');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (0);

		code = toContract ('struct Sample {\naddress a;\nuint b;\nstring c; \nuint d;}');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

});

describe ('[RULE] indentation overflow: Handling options', function () {

	it ('should accept <= N arguments in same line, N supplied through config', function (done) {
		var userConfig = {
			"rules": {
				"overflow-indentation": [1, 4]
			}
		};

		var code = toContract ('function ArgumentOverflow(int one, int two, int three, int four) {}'),
			errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (0);

		code = toFunction ('myFuncCall (10, "hello world", 20.67, 0x0);');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (0);

		code = toFunction ('uint[] x = [1,2,3,6];');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (0);

		code = toContract ('struct Sample {address a; uint b; string c; int d;}');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (0);


		code = toFunction ('myFuncCall (\n10,\n"hello world",\n20.67,\n0x0,\n100);');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (0);

		code = toFunction ('uint[] x = [\n1,\n2,\n3,\n4,\n10];');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (0);

		code = toContract ('struct Sample {\naddress a;\nuint b;\nstring c; \nuint d;\nstring x;}');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (0);

		Solium.reset ();
		done ();
	});

	it ('should reject > N arguments in same line, N supplied through config', function (done) {
		var userConfig = {
			"rules": {
				"overflow-indentation": [1, 4]
			}
		};

		var code = toContract ('function ArgumentOverflow(int one, int two, int three, int four, int five) {}'),
			errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (1);

		code = toFunction ('myFuncCall (10, "hello world", 20.67, 0x0, 100);');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (1);

		code = toFunction ('uint[] x = [1,2,3,6,18];');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (1);

		code = toContract ('struct Sample {address a; uint b; string c; int d; string f;}');
		errors = Solium.lint (code, userConfig);

		errors.should.be.Array ();
		errors.length.should.equal (1);

		Solium.reset ();
		done ();
	});

	it ('should reject invalid option values', function (done) {
		var config = {
			"rules": {
				"overflow-indentation": [1, 0]
			}
		};
		var code = toContract ('struct A { uint i; }');

		Solium.lint.bind (
			Solium, code, config).should.throw ('Invalid options were passed to rule "overflow-indentation".');

		config.rules ['overflow-indentation'] [1] = null;
		Solium.lint.bind (
			Solium, code, config).should.throw ('Invalid options were passed to rule "overflow-indentation".');

		config.rules ['overflow-indentation'] [1] = [];
		Solium.lint.bind (
			Solium, code, config).should.throw ('Invalid options were passed to rule "overflow-indentation".');

		config.rules ['overflow-indentation'] [1] = {};
		Solium.lint.bind (
			Solium, code, config).should.throw ('Invalid options were passed to rule "overflow-indentation".');

		config.rules ['overflow-indentation'] [1] = 9.2;
		Solium.lint.bind (
			Solium, code, config).should.throw ('Invalid options were passed to rule "overflow-indentation".');

		config.rules ['overflow-indentation'] [1] = -1;
		Solium.lint.bind (
			Solium, code, config).should.throw ('Invalid options were passed to rule "overflow-indentation".');

		config.rules ['overflow-indentation'] [1] = [2];
		Solium.lint.bind (
			Solium, code, config).should.throw ('Invalid options were passed to rule "overflow-indentation".');

		config.rules ['overflow-indentation'] [1] = 4.01;
		Solium.lint.bind (
			Solium, code, config).should.throw ('Invalid options were passed to rule "overflow-indentation".');

		config.rules ['overflow-indentation'] [1] = 'winniethepooh';
		Solium.lint.bind (
			Solium, code, config).should.throw ('Invalid options were passed to rule "overflow-indentation".');

		Solium.reset ();
		done ();
	});

});