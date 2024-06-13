'use strict';

/** @type {typeof URL | typeof import('url').URL | null} */
var $URL = typeof URL === 'undefined' ? null : URL;
if (!$URL) {
	try {
		// eslint-disable-next-line global-require
		$URL = require('url').URL;
	} catch (e) {
		$URL = null;
	}
}

module.exports = $URL;
