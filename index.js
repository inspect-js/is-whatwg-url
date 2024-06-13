'use strict';

var $URL = require('./url');

var callBind = require('call-bind');
var gOPD = require('gopd');

/** @satisfies {import('./')} */
var result;

if ($URL) {
	if (Object.getOwnPropertySymbols) {
		/* eslint-env browser */
		var basicURL = typeof window === 'undefined' ? 'about:blank' : window.location.href;
		var basicURLinstance = new $URL(basicURL);
		var urlSymbols = Object.getOwnPropertySymbols(basicURLinstance);
		if (urlSymbols && urlSymbols.length > 0) {
			// this is node 6 - 19
			var getProto = Object.getPrototypeOf;
			var ownKeys = Reflect.ownKeys;

			result = /** @type {import('./')} */ function isURL(value) {
				if (!value || typeof value !== 'object' || !getProto || !ownKeys) {
					return false;
				}

				// @ts-expect-error
				if (getProto(value) !== $URL.prototype) {
					return false;
				}

				var owns = ownKeys(value);
				if (
					owns.length !== 2 // node 6 - 18.16
					&& owns.length !== 1 // node 18.17 - 19
				) {
					return false;
				}

				var symbolContext = urlSymbols[0];
				var symbolQuery = urlSymbols[1];

				if (
					owns[0] !== symbolContext
					// @ts-expect-error symbol indexing fail
					|| !value[owns[0]]
					|| (owns.length === 2 && symbolQuery in value && owns[1] !== symbolQuery)
				) {
					return false;
				}

				if (
					symbolQuery
					&& (
						!('searchParams' in value)
						|| !(symbolQuery in value)
						// @ts-expect-error symbol indexing fail
						|| value.searchParams !== value[symbolQuery]
					)
				) {
					return false;
				}

				// @ts-expect-error symbol indexing fail
				var context = symbolContext in value && value[symbolContext];
				if (
					!context
					|| !('protocol' in value)
					|| value.protocol !== (
						context.protocol // node 19
						|| (
							'protocol_end' in context
							&& context.href.slice(0, context.protocol_end)
						) // node 18
						|| context.scheme // node 6
					)
					|| !('username' in value)
					|| ('username' in context && value.username !== context.username) // username_start in node 18
					|| !('password' in value)
					|| ('password' in context && value.password !== context.password) // no password in node 18
					|| !('host' in value)
					|| value.host !== (
						context.hostname // node 19
						|| (
							'host_start' in context
							&& 'host_end' in context
							&& context.href.slice(context.host_start, context.host_end)
						)
						|| context.host // node 6
						|| ''
					)
					|| !('port' in value)
					|| (
						typeof context.port === 'string' // a number in node 18
						&& value.port !== (context.port || '')
					)
					|| !('hash' in value)
					|| value.hash !== (
						context.hash // node 19
						|| (
							'hash_start' in context
							&& context.href.slice(context.hash_start)
						) // node 18
						|| context.fragment // node 6
						|| ''
					)
					|| !('search' in value)
					|| value.search !== (
						context.search // node 19
						|| (
							'search_start' in context
							&& context.href.slice(context.search_start)
						) // node 18
						|| context.query // node 6
						|| ''
					)
				) {
					return false;
				}

				return true;
			};
		}
	}

	if (!result && $URL && $URL.prototype) {
		var accessorDesc = gOPD && gOPD($URL.prototype, 'href');
		var accessor = accessorDesc && accessorDesc.get && callBind(accessorDesc.get);

		result = /** @type {import('./')} */ function isURL(value) {
			if (!value || typeof value !== 'object' || !accessor) {
				return false;
			}

			try {
				accessor(value);
				return true;
			} catch (e) {
				return false;
			}
		};
	}
}
if (!result) {
	// @ts-expect-error
	// eslint-disable-next-line no-unused-vars
	result = function isURL(value) {
		return false;
	};
}

module.exports = result;
