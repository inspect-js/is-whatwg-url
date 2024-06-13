'use strict';

var forEach = require('for-each');
var inspect = require('object-inspect');
var satisfies = require('semver').satisfies;
var test = require('tape');
var v = require('es-value-fixtures');

var isURL = require('../');
var maybeURL = require('../url');

test('isURL', function (t) {
	// @ts-expect-error concat fail
	// eslint-disable-next-line no-extra-parens
	forEach((/** @type {unknown[]} */ [].concat(v.primitives, v.objects)), function (/** @type {unknown} */ nonURL) {
		t.equal(isURL(nonURL), false, inspect(nonURL) + ' is not a URL');
	});

	t.test('URL exists', { skip: satisfies(process.version, '< 6') || typeof URL !== 'function' }, function (st) {
		// node added required URL bw 6.6 and 6.17

		var $URL = /** @type {NonNullable<typeof maybeURL>} */ (maybeURL); // eslint-disable-line no-extra-parens

		/* eslint-env browser */
		var basicURL = typeof window === 'undefined' ? 'about:blank' : window.location.href;
		var basicURLInstance = new $URL(basicURL);

		var fakeURL = {
			__proto__: $URL.prototype,
			constructor: $URL,
			hash: '',
			host: '',
			hostname: '',
			href: 'about:blank',
			origin: 'null',
			password: '',
			pathname: 'blank',
			port: '',
			protocol: 'about:',
			search: '',
			searchParams: basicURLInstance.searchParams,
			username: ''
		};

		st.equal(isURL(new $URL('http://example.com')), true, 'http URL is a URL');
		st.equal(isURL(new $URL('https://example.com')), true, 'https URL is a URL');
		st.equal(isURL(new $URL('ftp://example.com')), true, 'ftp URL is a URL');

		st.equal(isURL(new $URL(basicURL)), true, basicURL + ' is a URL');

		st.equal(isURL(fakeURL), false, 'fake URL is not a URL');

		var urlSymbols = (Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(basicURLInstance)) || [];
		var symbolContext = urlSymbols[0];
		var symbolQuery = urlSymbols[1];
		st.test('broken node URL implementation', { skip: urlSymbols.length === 0 }, function (s2t) {
			s2t.equal(typeof symbolContext, 'symbol', inspect(symbolContext) + ' is a Symbol');
			s2t.equal(
				typeof symbolQuery,
				'symbol',
				inspect(symbolQuery) + ' is a Symbol',
				{ skip: urlSymbols.length < 2 }
			);

			var fakeNodeURL = { __proto__: $URL.prototype };

			// @ts-expect-error symbol indexing fail
			fakeNodeURL[symbolContext] = basicURLInstance[symbolContext];
			if (symbolQuery) {
				// @ts-expect-error symbol indexing fail
				fakeNodeURL[symbolQuery] = basicURLInstance.searchParams;
			}
			// assign(fakeNodeURL, fakeURL);

			s2t.equal(isURL(fakeNodeURL), true, 'fake URL, in broken node implementations, with a URLContext instance, is a URL');

			s2t.end();
		});

		st.end();
	});

	t.end();
});
