import { d as defineCommand, c as consola, a as colors } from '../shared/nuxi.b4d08588.mjs';
import { s as sharedArgs, r as resolve } from '../shared/nuxi.610c92ff.mjs';
import { promises, existsSync } from 'node:fs';
import 'fs';
import 'node:util';
import 'node:path';
import 'node:process';
import 'node:tty';
import { a as addDependency } from '../shared/nuxi.0f575f79.mjs';
import { g as getProjectPackage, f as fetchModules, a as getNuxtVersion, c as checkNuxtCompatibility, s as semver, $ as $fetch } from '../shared/nuxi.ec1423ac.mjs';
import 'node:url';
import 'node:fs/promises';
import 'node:module';
import 'node:http';
import 'node:https';
import 'node:zlib';
import 'node:stream';
import 'node:buffer';
import 'node:net';
import '../shared/nuxi.4ac76f59.mjs';
import '../shared/nuxi.a6273a0c.mjs';
import './satisfies.mjs';
import '../shared/nuxi.2155838d.mjs';
import '../shared/nuxi.cc8dd4a9.mjs';
import '../shared/nuxi.5aaa4630.mjs';

var sourceMap = {};

var sourceMapGenerator = {};

var base64Vlq = {};

var base64$1 = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

/**
 * Encode an integer in the range of 0 to 63 to a single base 64 digit.
 */
base64$1.encode = function (number) {
  if (0 <= number && number < intToCharMap.length) {
    return intToCharMap[number];
  }
  throw new TypeError("Must be between 0 and 63: " + number);
};

/**
 * Decode a single base 64 character code digit to an integer. Returns -1 on
 * failure.
 */
base64$1.decode = function (charCode) {
  var bigA = 65;     // 'A'
  var bigZ = 90;     // 'Z'

  var littleA = 97;  // 'a'
  var littleZ = 122; // 'z'

  var zero = 48;     // '0'
  var nine = 57;     // '9'

  var plus = 43;     // '+'
  var slash = 47;    // '/'

  var littleOffset = 26;
  var numberOffset = 52;

  // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
  if (bigA <= charCode && charCode <= bigZ) {
    return (charCode - bigA);
  }

  // 26 - 51: abcdefghijklmnopqrstuvwxyz
  if (littleA <= charCode && charCode <= littleZ) {
    return (charCode - littleA + littleOffset);
  }

  // 52 - 61: 0123456789
  if (zero <= charCode && charCode <= nine) {
    return (charCode - zero + numberOffset);
  }

  // 62: +
  if (charCode == plus) {
    return 62;
  }

  // 63: /
  if (charCode == slash) {
    return 63;
  }

  // Invalid base64 digit.
  return -1;
};

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var base64 = base64$1;

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

var VLQ_BASE_SHIFT = 5;

// binary: 100000
var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
var VLQ_CONTINUATION_BIT = VLQ_BASE;

/**
 * Converts from a two-complement value to a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
 *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
 */
function toVLQSigned(aValue) {
  return aValue < 0
    ? ((-aValue) << 1) + 1
    : (aValue << 1) + 0;
}

/**
 * Converts to a two-complement value from a value where the sign bit is
 * placed in the least significant bit.  For example, as decimals:
 *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
 *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
 */
function fromVLQSigned(aValue) {
  var isNegative = (aValue & 1) === 1;
  var shifted = aValue >> 1;
  return isNegative
    ? -shifted
    : shifted;
}

/**
 * Returns the base 64 VLQ encoded value.
 */
base64Vlq.encode = function base64VLQ_encode(aValue) {
  var encoded = "";
  var digit;

  var vlq = toVLQSigned(aValue);

  do {
    digit = vlq & VLQ_BASE_MASK;
    vlq >>>= VLQ_BASE_SHIFT;
    if (vlq > 0) {
      // There are still more digits in this value, so we must make sure the
      // continuation bit is marked.
      digit |= VLQ_CONTINUATION_BIT;
    }
    encoded += base64.encode(digit);
  } while (vlq > 0);

  return encoded;
};

/**
 * Decodes the next base 64 VLQ value from the given string and returns the
 * value and the rest of the string via the out parameter.
 */
base64Vlq.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
  var strLen = aStr.length;
  var result = 0;
  var shift = 0;
  var continuation, digit;

  do {
    if (aIndex >= strLen) {
      throw new Error("Expected more digits in base 64 VLQ value.");
    }

    digit = base64.decode(aStr.charCodeAt(aIndex++));
    if (digit === -1) {
      throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
    }

    continuation = !!(digit & VLQ_CONTINUATION_BIT);
    digit &= VLQ_BASE_MASK;
    result = result + (digit << shift);
    shift += VLQ_BASE_SHIFT;
  } while (continuation);

  aOutParam.value = fromVLQSigned(result);
  aOutParam.rest = aIndex;
};

var util$5 = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

(function (exports) {
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */

	/**
	 * This is a helper function for getting values from parameter/options
	 * objects.
	 *
	 * @param args The object we are extracting values from
	 * @param name The name of the property we are getting.
	 * @param defaultValue An optional value to return if the property is missing
	 * from the object. If this is not specified and the property is missing, an
	 * error will be thrown.
	 */
	function getArg(aArgs, aName, aDefaultValue) {
	  if (aName in aArgs) {
	    return aArgs[aName];
	  } else if (arguments.length === 3) {
	    return aDefaultValue;
	  } else {
	    throw new Error('"' + aName + '" is a required argument.');
	  }
	}
	exports.getArg = getArg;

	var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
	var dataUrlRegexp = /^data:.+\,.+$/;

	function urlParse(aUrl) {
	  var match = aUrl.match(urlRegexp);
	  if (!match) {
	    return null;
	  }
	  return {
	    scheme: match[1],
	    auth: match[2],
	    host: match[3],
	    port: match[4],
	    path: match[5]
	  };
	}
	exports.urlParse = urlParse;

	function urlGenerate(aParsedUrl) {
	  var url = '';
	  if (aParsedUrl.scheme) {
	    url += aParsedUrl.scheme + ':';
	  }
	  url += '//';
	  if (aParsedUrl.auth) {
	    url += aParsedUrl.auth + '@';
	  }
	  if (aParsedUrl.host) {
	    url += aParsedUrl.host;
	  }
	  if (aParsedUrl.port) {
	    url += ":" + aParsedUrl.port;
	  }
	  if (aParsedUrl.path) {
	    url += aParsedUrl.path;
	  }
	  return url;
	}
	exports.urlGenerate = urlGenerate;

	var MAX_CACHED_INPUTS = 32;

	/**
	 * Takes some function `f(input) -> result` and returns a memoized version of
	 * `f`.
	 *
	 * We keep at most `MAX_CACHED_INPUTS` memoized results of `f` alive. The
	 * memoization is a dumb-simple, linear least-recently-used cache.
	 */
	function lruMemoize(f) {
	  var cache = [];

	  return function(input) {
	    for (var i = 0; i < cache.length; i++) {
	      if (cache[i].input === input) {
	        var temp = cache[0];
	        cache[0] = cache[i];
	        cache[i] = temp;
	        return cache[0].result;
	      }
	    }

	    var result = f(input);

	    cache.unshift({
	      input,
	      result,
	    });

	    if (cache.length > MAX_CACHED_INPUTS) {
	      cache.pop();
	    }

	    return result;
	  };
	}

	/**
	 * Normalizes a path, or the path portion of a URL:
	 *
	 * - Replaces consecutive slashes with one slash.
	 * - Removes unnecessary '.' parts.
	 * - Removes unnecessary '<dir>/..' parts.
	 *
	 * Based on code in the Node.js 'path' core module.
	 *
	 * @param aPath The path or url to normalize.
	 */
	var normalize = lruMemoize(function normalize(aPath) {
	  var path = aPath;
	  var url = urlParse(aPath);
	  if (url) {
	    if (!url.path) {
	      return aPath;
	    }
	    path = url.path;
	  }
	  var isAbsolute = exports.isAbsolute(path);
	  // Split the path into parts between `/` characters. This is much faster than
	  // using `.split(/\/+/g)`.
	  var parts = [];
	  var start = 0;
	  var i = 0;
	  while (true) {
	    start = i;
	    i = path.indexOf("/", start);
	    if (i === -1) {
	      parts.push(path.slice(start));
	      break;
	    } else {
	      parts.push(path.slice(start, i));
	      while (i < path.length && path[i] === "/") {
	        i++;
	      }
	    }
	  }

	  for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
	    part = parts[i];
	    if (part === '.') {
	      parts.splice(i, 1);
	    } else if (part === '..') {
	      up++;
	    } else if (up > 0) {
	      if (part === '') {
	        // The first part is blank if the path is absolute. Trying to go
	        // above the root is a no-op. Therefore we can remove all '..' parts
	        // directly after the root.
	        parts.splice(i + 1, up);
	        up = 0;
	      } else {
	        parts.splice(i, 2);
	        up--;
	      }
	    }
	  }
	  path = parts.join('/');

	  if (path === '') {
	    path = isAbsolute ? '/' : '.';
	  }

	  if (url) {
	    url.path = path;
	    return urlGenerate(url);
	  }
	  return path;
	});
	exports.normalize = normalize;

	/**
	 * Joins two paths/URLs.
	 *
	 * @param aRoot The root path or URL.
	 * @param aPath The path or URL to be joined with the root.
	 *
	 * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
	 *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
	 *   first.
	 * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
	 *   is updated with the result and aRoot is returned. Otherwise the result
	 *   is returned.
	 *   - If aPath is absolute, the result is aPath.
	 *   - Otherwise the two paths are joined with a slash.
	 * - Joining for example 'http://' and 'www.example.com' is also supported.
	 */
	function join(aRoot, aPath) {
	  if (aRoot === "") {
	    aRoot = ".";
	  }
	  if (aPath === "") {
	    aPath = ".";
	  }
	  var aPathUrl = urlParse(aPath);
	  var aRootUrl = urlParse(aRoot);
	  if (aRootUrl) {
	    aRoot = aRootUrl.path || '/';
	  }

	  // `join(foo, '//www.example.org')`
	  if (aPathUrl && !aPathUrl.scheme) {
	    if (aRootUrl) {
	      aPathUrl.scheme = aRootUrl.scheme;
	    }
	    return urlGenerate(aPathUrl);
	  }

	  if (aPathUrl || aPath.match(dataUrlRegexp)) {
	    return aPath;
	  }

	  // `join('http://', 'www.example.com')`
	  if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
	    aRootUrl.host = aPath;
	    return urlGenerate(aRootUrl);
	  }

	  var joined = aPath.charAt(0) === '/'
	    ? aPath
	    : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

	  if (aRootUrl) {
	    aRootUrl.path = joined;
	    return urlGenerate(aRootUrl);
	  }
	  return joined;
	}
	exports.join = join;

	exports.isAbsolute = function (aPath) {
	  return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
	};

	/**
	 * Make a path relative to a URL or another path.
	 *
	 * @param aRoot The root path or URL.
	 * @param aPath The path or URL to be made relative to aRoot.
	 */
	function relative(aRoot, aPath) {
	  if (aRoot === "") {
	    aRoot = ".";
	  }

	  aRoot = aRoot.replace(/\/$/, '');

	  // It is possible for the path to be above the root. In this case, simply
	  // checking whether the root is a prefix of the path won't work. Instead, we
	  // need to remove components from the root one by one, until either we find
	  // a prefix that fits, or we run out of components to remove.
	  var level = 0;
	  while (aPath.indexOf(aRoot + '/') !== 0) {
	    var index = aRoot.lastIndexOf("/");
	    if (index < 0) {
	      return aPath;
	    }

	    // If the only part of the root that is left is the scheme (i.e. http://,
	    // file:///, etc.), one or more slashes (/), or simply nothing at all, we
	    // have exhausted all components, so the path is not relative to the root.
	    aRoot = aRoot.slice(0, index);
	    if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
	      return aPath;
	    }

	    ++level;
	  }

	  // Make sure we add a "../" for each component we removed from the root.
	  return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
	}
	exports.relative = relative;

	var supportsNullProto = (function () {
	  var obj = Object.create(null);
	  return !('__proto__' in obj);
	}());

	function identity (s) {
	  return s;
	}

	/**
	 * Because behavior goes wacky when you set `__proto__` on objects, we
	 * have to prefix all the strings in our set with an arbitrary character.
	 *
	 * See https://github.com/mozilla/source-map/pull/31 and
	 * https://github.com/mozilla/source-map/issues/30
	 *
	 * @param String aStr
	 */
	function toSetString(aStr) {
	  if (isProtoString(aStr)) {
	    return '$' + aStr;
	  }

	  return aStr;
	}
	exports.toSetString = supportsNullProto ? identity : toSetString;

	function fromSetString(aStr) {
	  if (isProtoString(aStr)) {
	    return aStr.slice(1);
	  }

	  return aStr;
	}
	exports.fromSetString = supportsNullProto ? identity : fromSetString;

	function isProtoString(s) {
	  if (!s) {
	    return false;
	  }

	  var length = s.length;

	  if (length < 9 /* "__proto__".length */) {
	    return false;
	  }

	  if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
	      s.charCodeAt(length - 2) !== 95  /* '_' */ ||
	      s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
	      s.charCodeAt(length - 4) !== 116 /* 't' */ ||
	      s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
	      s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
	      s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
	      s.charCodeAt(length - 8) !== 95  /* '_' */ ||
	      s.charCodeAt(length - 9) !== 95  /* '_' */) {
	    return false;
	  }

	  for (var i = length - 10; i >= 0; i--) {
	    if (s.charCodeAt(i) !== 36 /* '$' */) {
	      return false;
	    }
	  }

	  return true;
	}

	/**
	 * Comparator between two mappings where the original positions are compared.
	 *
	 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	 * mappings with the same original source/line/column, but different generated
	 * line and column the same. Useful when searching for a mapping with a
	 * stubbed out mapping.
	 */
	function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
	  var cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }

	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0 || onlyCompareOriginal) {
	    return cmp;
	  }

	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByOriginalPositions = compareByOriginalPositions;

	function compareByOriginalPositionsNoSource(mappingA, mappingB, onlyCompareOriginal) {
	  var cmp;

	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0 || onlyCompareOriginal) {
	    return cmp;
	  }

	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByOriginalPositionsNoSource = compareByOriginalPositionsNoSource;

	/**
	 * Comparator between two mappings with deflated source and name indices where
	 * the generated positions are compared.
	 *
	 * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	 * mappings with the same generated line and column, but different
	 * source/name/original line and column the same. Useful when searching for a
	 * mapping with a stubbed out mapping.
	 */
	function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0 || onlyCompareGenerated) {
	    return cmp;
	  }

	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }

	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

	function compareByGeneratedPositionsDeflatedNoLine(mappingA, mappingB, onlyCompareGenerated) {
	  var cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0 || onlyCompareGenerated) {
	    return cmp;
	  }

	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }

	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsDeflatedNoLine = compareByGeneratedPositionsDeflatedNoLine;

	function strcmp(aStr1, aStr2) {
	  if (aStr1 === aStr2) {
	    return 0;
	  }

	  if (aStr1 === null) {
	    return 1; // aStr2 !== null
	  }

	  if (aStr2 === null) {
	    return -1; // aStr1 !== null
	  }

	  if (aStr1 > aStr2) {
	    return 1;
	  }

	  return -1;
	}

	/**
	 * Comparator between two mappings with inflated source and name strings where
	 * the generated positions are compared.
	 */
	function compareByGeneratedPositionsInflated(mappingA, mappingB) {
	  var cmp = mappingA.generatedLine - mappingB.generatedLine;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  cmp = strcmp(mappingA.source, mappingB.source);
	  if (cmp !== 0) {
	    return cmp;
	  }

	  cmp = mappingA.originalLine - mappingB.originalLine;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  cmp = mappingA.originalColumn - mappingB.originalColumn;
	  if (cmp !== 0) {
	    return cmp;
	  }

	  return strcmp(mappingA.name, mappingB.name);
	}
	exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

	/**
	 * Strip any JSON XSSI avoidance prefix from the string (as documented
	 * in the source maps specification), and then parse the string as
	 * JSON.
	 */
	function parseSourceMapInput(str) {
	  return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
	}
	exports.parseSourceMapInput = parseSourceMapInput;

	/**
	 * Compute the URL of a source given the the source root, the source's
	 * URL, and the source map's URL.
	 */
	function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
	  sourceURL = sourceURL || '';

	  if (sourceRoot) {
	    // This follows what Chrome does.
	    if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
	      sourceRoot += '/';
	    }
	    // The spec says:
	    //   Line 4: An optional source root, useful for relocating source
	    //   files on a server or removing repeated values in the
	    //   “sources” entry.  This value is prepended to the individual
	    //   entries in the “source” field.
	    sourceURL = sourceRoot + sourceURL;
	  }

	  // Historically, SourceMapConsumer did not take the sourceMapURL as
	  // a parameter.  This mode is still somewhat supported, which is why
	  // this code block is conditional.  However, it's preferable to pass
	  // the source map URL to SourceMapConsumer, so that this function
	  // can implement the source URL resolution algorithm as outlined in
	  // the spec.  This block is basically the equivalent of:
	  //    new URL(sourceURL, sourceMapURL).toString()
	  // ... except it avoids using URL, which wasn't available in the
	  // older releases of node still supported by this library.
	  //
	  // The spec says:
	  //   If the sources are not absolute URLs after prepending of the
	  //   “sourceRoot”, the sources are resolved relative to the
	  //   SourceMap (like resolving script src in a html document).
	  if (sourceMapURL) {
	    var parsed = urlParse(sourceMapURL);
	    if (!parsed) {
	      throw new Error("sourceMapURL could not be parsed");
	    }
	    if (parsed.path) {
	      // Strip the last path component, but keep the "/".
	      var index = parsed.path.lastIndexOf('/');
	      if (index >= 0) {
	        parsed.path = parsed.path.substring(0, index + 1);
	      }
	    }
	    sourceURL = join(urlGenerate(parsed), sourceURL);
	  }

	  return normalize(sourceURL);
	}
	exports.computeSourceURL = computeSourceURL; 
} (util$5));

var arraySet = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util$4 = util$5;
var has = Object.prototype.hasOwnProperty;
var hasNativeMap = typeof Map !== "undefined";

/**
 * A data structure which is a combination of an array and a set. Adding a new
 * member is O(1), testing for membership is O(1), and finding the index of an
 * element is O(1). Removing elements from the set is not supported. Only
 * strings are supported for membership.
 */
function ArraySet$2() {
  this._array = [];
  this._set = hasNativeMap ? new Map() : Object.create(null);
}

/**
 * Static method for creating ArraySet instances from an existing array.
 */
ArraySet$2.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
  var set = new ArraySet$2();
  for (var i = 0, len = aArray.length; i < len; i++) {
    set.add(aArray[i], aAllowDuplicates);
  }
  return set;
};

/**
 * Return how many unique items are in this ArraySet. If duplicates have been
 * added, than those do not count towards the size.
 *
 * @returns Number
 */
ArraySet$2.prototype.size = function ArraySet_size() {
  return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
};

/**
 * Add the given string to this set.
 *
 * @param String aStr
 */
ArraySet$2.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
  var sStr = hasNativeMap ? aStr : util$4.toSetString(aStr);
  var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
  var idx = this._array.length;
  if (!isDuplicate || aAllowDuplicates) {
    this._array.push(aStr);
  }
  if (!isDuplicate) {
    if (hasNativeMap) {
      this._set.set(aStr, idx);
    } else {
      this._set[sStr] = idx;
    }
  }
};

/**
 * Is the given string a member of this set?
 *
 * @param String aStr
 */
ArraySet$2.prototype.has = function ArraySet_has(aStr) {
  if (hasNativeMap) {
    return this._set.has(aStr);
  } else {
    var sStr = util$4.toSetString(aStr);
    return has.call(this._set, sStr);
  }
};

/**
 * What is the index of the given string in the array?
 *
 * @param String aStr
 */
ArraySet$2.prototype.indexOf = function ArraySet_indexOf(aStr) {
  if (hasNativeMap) {
    var idx = this._set.get(aStr);
    if (idx >= 0) {
        return idx;
    }
  } else {
    var sStr = util$4.toSetString(aStr);
    if (has.call(this._set, sStr)) {
      return this._set[sStr];
    }
  }

  throw new Error('"' + aStr + '" is not in the set.');
};

/**
 * What is the element at the given index?
 *
 * @param Number aIdx
 */
ArraySet$2.prototype.at = function ArraySet_at(aIdx) {
  if (aIdx >= 0 && aIdx < this._array.length) {
    return this._array[aIdx];
  }
  throw new Error('No element indexed by ' + aIdx);
};

/**
 * Returns the array representation of this set (which has the proper indices
 * indicated by indexOf). Note that this is a copy of the internal array used
 * for storing the members so that no one can mess with internal state.
 */
ArraySet$2.prototype.toArray = function ArraySet_toArray() {
  return this._array.slice();
};

arraySet.ArraySet = ArraySet$2;

var mappingList = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util$3 = util$5;

/**
 * Determine whether mappingB is after mappingA with respect to generated
 * position.
 */
function generatedPositionAfter(mappingA, mappingB) {
  // Optimized for most common case
  var lineA = mappingA.generatedLine;
  var lineB = mappingB.generatedLine;
  var columnA = mappingA.generatedColumn;
  var columnB = mappingB.generatedColumn;
  return lineB > lineA || lineB == lineA && columnB >= columnA ||
         util$3.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
}

/**
 * A data structure to provide a sorted view of accumulated mappings in a
 * performance conscious manner. It trades a neglibable overhead in general
 * case for a large speedup in case of mappings being added in order.
 */
function MappingList$1() {
  this._array = [];
  this._sorted = true;
  // Serves as infimum
  this._last = {generatedLine: -1, generatedColumn: 0};
}

/**
 * Iterate through internal items. This method takes the same arguments that
 * `Array.prototype.forEach` takes.
 *
 * NOTE: The order of the mappings is NOT guaranteed.
 */
MappingList$1.prototype.unsortedForEach =
  function MappingList_forEach(aCallback, aThisArg) {
    this._array.forEach(aCallback, aThisArg);
  };

/**
 * Add the given source mapping.
 *
 * @param Object aMapping
 */
MappingList$1.prototype.add = function MappingList_add(aMapping) {
  if (generatedPositionAfter(this._last, aMapping)) {
    this._last = aMapping;
    this._array.push(aMapping);
  } else {
    this._sorted = false;
    this._array.push(aMapping);
  }
};

/**
 * Returns the flat, sorted array of mappings. The mappings are sorted by
 * generated position.
 *
 * WARNING: This method returns internal data without copying, for
 * performance. The return value must NOT be mutated, and should be treated as
 * an immutable borrow. If you want to take ownership, you must make your own
 * copy.
 */
MappingList$1.prototype.toArray = function MappingList_toArray() {
  if (!this._sorted) {
    this._array.sort(util$3.compareByGeneratedPositionsInflated);
    this._sorted = true;
  }
  return this._array;
};

mappingList.MappingList = MappingList$1;

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var base64VLQ$1 = base64Vlq;
var util$2 = util$5;
var ArraySet$1 = arraySet.ArraySet;
var MappingList = mappingList.MappingList;

/**
 * An instance of the SourceMapGenerator represents a source map which is
 * being built incrementally. You may pass an object with the following
 * properties:
 *
 *   - file: The filename of the generated source.
 *   - sourceRoot: A root for all relative URLs in this source map.
 */
function SourceMapGenerator$2(aArgs) {
  if (!aArgs) {
    aArgs = {};
  }
  this._file = util$2.getArg(aArgs, 'file', null);
  this._sourceRoot = util$2.getArg(aArgs, 'sourceRoot', null);
  this._skipValidation = util$2.getArg(aArgs, 'skipValidation', false);
  this._ignoreInvalidMapping = util$2.getArg(aArgs, 'ignoreInvalidMapping', false);
  this._sources = new ArraySet$1();
  this._names = new ArraySet$1();
  this._mappings = new MappingList();
  this._sourcesContents = null;
}

SourceMapGenerator$2.prototype._version = 3;

/**
 * Creates a new SourceMapGenerator based on a SourceMapConsumer
 *
 * @param aSourceMapConsumer The SourceMap.
 */
SourceMapGenerator$2.fromSourceMap =
  function SourceMapGenerator_fromSourceMap(aSourceMapConsumer, generatorOps) {
    var sourceRoot = aSourceMapConsumer.sourceRoot;
    var generator = new SourceMapGenerator$2(Object.assign(generatorOps || {}, {
      file: aSourceMapConsumer.file,
      sourceRoot: sourceRoot
    }));
    aSourceMapConsumer.eachMapping(function (mapping) {
      var newMapping = {
        generated: {
          line: mapping.generatedLine,
          column: mapping.generatedColumn
        }
      };

      if (mapping.source != null) {
        newMapping.source = mapping.source;
        if (sourceRoot != null) {
          newMapping.source = util$2.relative(sourceRoot, newMapping.source);
        }

        newMapping.original = {
          line: mapping.originalLine,
          column: mapping.originalColumn
        };

        if (mapping.name != null) {
          newMapping.name = mapping.name;
        }
      }

      generator.addMapping(newMapping);
    });
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var sourceRelative = sourceFile;
      if (sourceRoot !== null) {
        sourceRelative = util$2.relative(sourceRoot, sourceFile);
      }

      if (!generator._sources.has(sourceRelative)) {
        generator._sources.add(sourceRelative);
      }

      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        generator.setSourceContent(sourceFile, content);
      }
    });
    return generator;
  };

/**
 * Add a single mapping from original source line and column to the generated
 * source's line and column for this source map being created. The mapping
 * object should have the following properties:
 *
 *   - generated: An object with the generated line and column positions.
 *   - original: An object with the original line and column positions.
 *   - source: The original source file (relative to the sourceRoot).
 *   - name: An optional original token name for this mapping.
 */
SourceMapGenerator$2.prototype.addMapping =
  function SourceMapGenerator_addMapping(aArgs) {
    var generated = util$2.getArg(aArgs, 'generated');
    var original = util$2.getArg(aArgs, 'original', null);
    var source = util$2.getArg(aArgs, 'source', null);
    var name = util$2.getArg(aArgs, 'name', null);

    if (!this._skipValidation) {
      if (this._validateMapping(generated, original, source, name) === false) {
        return;
      }
    }

    if (source != null) {
      source = String(source);
      if (!this._sources.has(source)) {
        this._sources.add(source);
      }
    }

    if (name != null) {
      name = String(name);
      if (!this._names.has(name)) {
        this._names.add(name);
      }
    }

    this._mappings.add({
      generatedLine: generated.line,
      generatedColumn: generated.column,
      originalLine: original != null && original.line,
      originalColumn: original != null && original.column,
      source: source,
      name: name
    });
  };

/**
 * Set the source content for a source file.
 */
SourceMapGenerator$2.prototype.setSourceContent =
  function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
    var source = aSourceFile;
    if (this._sourceRoot != null) {
      source = util$2.relative(this._sourceRoot, source);
    }

    if (aSourceContent != null) {
      // Add the source content to the _sourcesContents map.
      // Create a new _sourcesContents map if the property is null.
      if (!this._sourcesContents) {
        this._sourcesContents = Object.create(null);
      }
      this._sourcesContents[util$2.toSetString(source)] = aSourceContent;
    } else if (this._sourcesContents) {
      // Remove the source file from the _sourcesContents map.
      // If the _sourcesContents map is empty, set the property to null.
      delete this._sourcesContents[util$2.toSetString(source)];
      if (Object.keys(this._sourcesContents).length === 0) {
        this._sourcesContents = null;
      }
    }
  };

/**
 * Applies the mappings of a sub-source-map for a specific source file to the
 * source map being generated. Each mapping to the supplied source file is
 * rewritten using the supplied source map. Note: The resolution for the
 * resulting mappings is the minimium of this map and the supplied map.
 *
 * @param aSourceMapConsumer The source map to be applied.
 * @param aSourceFile Optional. The filename of the source file.
 *        If omitted, SourceMapConsumer's file property will be used.
 * @param aSourceMapPath Optional. The dirname of the path to the source map
 *        to be applied. If relative, it is relative to the SourceMapConsumer.
 *        This parameter is needed when the two source maps aren't in the same
 *        directory, and the source map to be applied contains relative source
 *        paths. If so, those relative source paths need to be rewritten
 *        relative to the SourceMapGenerator.
 */
SourceMapGenerator$2.prototype.applySourceMap =
  function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
    var sourceFile = aSourceFile;
    // If aSourceFile is omitted, we will use the file property of the SourceMap
    if (aSourceFile == null) {
      if (aSourceMapConsumer.file == null) {
        throw new Error(
          'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
          'or the source map\'s "file" property. Both were omitted.'
        );
      }
      sourceFile = aSourceMapConsumer.file;
    }
    var sourceRoot = this._sourceRoot;
    // Make "sourceFile" relative if an absolute Url is passed.
    if (sourceRoot != null) {
      sourceFile = util$2.relative(sourceRoot, sourceFile);
    }
    // Applying the SourceMap can add and remove items from the sources and
    // the names array.
    var newSources = new ArraySet$1();
    var newNames = new ArraySet$1();

    // Find mappings for the "sourceFile"
    this._mappings.unsortedForEach(function (mapping) {
      if (mapping.source === sourceFile && mapping.originalLine != null) {
        // Check if it can be mapped by the source map, then update the mapping.
        var original = aSourceMapConsumer.originalPositionFor({
          line: mapping.originalLine,
          column: mapping.originalColumn
        });
        if (original.source != null) {
          // Copy mapping
          mapping.source = original.source;
          if (aSourceMapPath != null) {
            mapping.source = util$2.join(aSourceMapPath, mapping.source);
          }
          if (sourceRoot != null) {
            mapping.source = util$2.relative(sourceRoot, mapping.source);
          }
          mapping.originalLine = original.line;
          mapping.originalColumn = original.column;
          if (original.name != null) {
            mapping.name = original.name;
          }
        }
      }

      var source = mapping.source;
      if (source != null && !newSources.has(source)) {
        newSources.add(source);
      }

      var name = mapping.name;
      if (name != null && !newNames.has(name)) {
        newNames.add(name);
      }

    }, this);
    this._sources = newSources;
    this._names = newNames;

    // Copy sourcesContents of applied map.
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aSourceMapPath != null) {
          sourceFile = util$2.join(aSourceMapPath, sourceFile);
        }
        if (sourceRoot != null) {
          sourceFile = util$2.relative(sourceRoot, sourceFile);
        }
        this.setSourceContent(sourceFile, content);
      }
    }, this);
  };

/**
 * A mapping can have one of the three levels of data:
 *
 *   1. Just the generated position.
 *   2. The Generated position, original position, and original source.
 *   3. Generated and original position, original source, as well as a name
 *      token.
 *
 * To maintain consistency, we validate that any new mapping being added falls
 * in to one of these categories.
 */
SourceMapGenerator$2.prototype._validateMapping =
  function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                              aName) {
    // When aOriginal is truthy but has empty values for .line and .column,
    // it is most likely a programmer error. In this case we throw a very
    // specific error message to try to guide them the right way.
    // For example: https://github.com/Polymer/polymer-bundler/pull/519
    if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
      var message = 'original.line and original.column are not numbers -- you probably meant to omit ' +
      'the original mapping entirely and only map the generated position. If so, pass ' +
      'null for the original mapping instead of an object with empty or null values.';

      if (this._ignoreInvalidMapping) {
        if (typeof console !== 'undefined' && console.warn) {
          console.warn(message);
        }
        return false;
      } else {
        throw new Error(message);
      }
    }

    if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
        && aGenerated.line > 0 && aGenerated.column >= 0
        && !aOriginal && !aSource && !aName) {
      // Case 1.
      return;
    }
    else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
             && aOriginal && 'line' in aOriginal && 'column' in aOriginal
             && aGenerated.line > 0 && aGenerated.column >= 0
             && aOriginal.line > 0 && aOriginal.column >= 0
             && aSource) {
      // Cases 2 and 3.
      return;
    }
    else {
      var message = 'Invalid mapping: ' + JSON.stringify({
        generated: aGenerated,
        source: aSource,
        original: aOriginal,
        name: aName
      });

      if (this._ignoreInvalidMapping) {
        if (typeof console !== 'undefined' && console.warn) {
          console.warn(message);
        }
        return false;
      } else {
        throw new Error(message)
      }
    }
  };

/**
 * Serialize the accumulated mappings in to the stream of base 64 VLQs
 * specified by the source map format.
 */
SourceMapGenerator$2.prototype._serializeMappings =
  function SourceMapGenerator_serializeMappings() {
    var previousGeneratedColumn = 0;
    var previousGeneratedLine = 1;
    var previousOriginalColumn = 0;
    var previousOriginalLine = 0;
    var previousName = 0;
    var previousSource = 0;
    var result = '';
    var next;
    var mapping;
    var nameIdx;
    var sourceIdx;

    var mappings = this._mappings.toArray();
    for (var i = 0, len = mappings.length; i < len; i++) {
      mapping = mappings[i];
      next = '';

      if (mapping.generatedLine !== previousGeneratedLine) {
        previousGeneratedColumn = 0;
        while (mapping.generatedLine !== previousGeneratedLine) {
          next += ';';
          previousGeneratedLine++;
        }
      }
      else {
        if (i > 0) {
          if (!util$2.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
            continue;
          }
          next += ',';
        }
      }

      next += base64VLQ$1.encode(mapping.generatedColumn
                                 - previousGeneratedColumn);
      previousGeneratedColumn = mapping.generatedColumn;

      if (mapping.source != null) {
        sourceIdx = this._sources.indexOf(mapping.source);
        next += base64VLQ$1.encode(sourceIdx - previousSource);
        previousSource = sourceIdx;

        // lines are stored 0-based in SourceMap spec version 3
        next += base64VLQ$1.encode(mapping.originalLine - 1
                                   - previousOriginalLine);
        previousOriginalLine = mapping.originalLine - 1;

        next += base64VLQ$1.encode(mapping.originalColumn
                                   - previousOriginalColumn);
        previousOriginalColumn = mapping.originalColumn;

        if (mapping.name != null) {
          nameIdx = this._names.indexOf(mapping.name);
          next += base64VLQ$1.encode(nameIdx - previousName);
          previousName = nameIdx;
        }
      }

      result += next;
    }

    return result;
  };

SourceMapGenerator$2.prototype._generateSourcesContent =
  function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
    return aSources.map(function (source) {
      if (!this._sourcesContents) {
        return null;
      }
      if (aSourceRoot != null) {
        source = util$2.relative(aSourceRoot, source);
      }
      var key = util$2.toSetString(source);
      return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
        ? this._sourcesContents[key]
        : null;
    }, this);
  };

/**
 * Externalize the source map.
 */
SourceMapGenerator$2.prototype.toJSON =
  function SourceMapGenerator_toJSON() {
    var map = {
      version: this._version,
      sources: this._sources.toArray(),
      names: this._names.toArray(),
      mappings: this._serializeMappings()
    };
    if (this._file != null) {
      map.file = this._file;
    }
    if (this._sourceRoot != null) {
      map.sourceRoot = this._sourceRoot;
    }
    if (this._sourcesContents) {
      map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
    }

    return map;
  };

/**
 * Render the source map being generated to a string.
 */
SourceMapGenerator$2.prototype.toString =
  function SourceMapGenerator_toString() {
    return JSON.stringify(this.toJSON());
  };

sourceMapGenerator.SourceMapGenerator = SourceMapGenerator$2;

var sourceMapConsumer = {};

var binarySearch$1 = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

(function (exports) {
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */

	exports.GREATEST_LOWER_BOUND = 1;
	exports.LEAST_UPPER_BOUND = 2;

	/**
	 * Recursive implementation of binary search.
	 *
	 * @param aLow Indices here and lower do not contain the needle.
	 * @param aHigh Indices here and higher do not contain the needle.
	 * @param aNeedle The element being searched for.
	 * @param aHaystack The non-empty array being searched.
	 * @param aCompare Function which takes two elements and returns -1, 0, or 1.
	 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 */
	function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
	  // This function terminates when one of the following is true:
	  //
	  //   1. We find the exact element we are looking for.
	  //
	  //   2. We did not find the exact element, but we can return the index of
	  //      the next-closest element.
	  //
	  //   3. We did not find the exact element, and there is no next-closest
	  //      element than the one we are searching for, so we return -1.
	  var mid = Math.floor((aHigh - aLow) / 2) + aLow;
	  var cmp = aCompare(aNeedle, aHaystack[mid], true);
	  if (cmp === 0) {
	    // Found the element we are looking for.
	    return mid;
	  }
	  else if (cmp > 0) {
	    // Our needle is greater than aHaystack[mid].
	    if (aHigh - mid > 1) {
	      // The element is in the upper half.
	      return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
	    }

	    // The exact needle element was not found in this haystack. Determine if
	    // we are in termination case (3) or (2) and return the appropriate thing.
	    if (aBias == exports.LEAST_UPPER_BOUND) {
	      return aHigh < aHaystack.length ? aHigh : -1;
	    } else {
	      return mid;
	    }
	  }
	  else {
	    // Our needle is less than aHaystack[mid].
	    if (mid - aLow > 1) {
	      // The element is in the lower half.
	      return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
	    }

	    // we are in termination case (3) or (2) and return the appropriate thing.
	    if (aBias == exports.LEAST_UPPER_BOUND) {
	      return mid;
	    } else {
	      return aLow < 0 ? -1 : aLow;
	    }
	  }
	}

	/**
	 * This is an implementation of binary search which will always try and return
	 * the index of the closest element if there is no exact hit. This is because
	 * mappings between original and generated line/col pairs are single points,
	 * and there is an implicit region between each of them, so a miss just means
	 * that you aren't on the very start of a region.
	 *
	 * @param aNeedle The element you are looking for.
	 * @param aHaystack The array that is being searched.
	 * @param aCompare A function which takes the needle and an element in the
	 *     array and returns -1, 0, or 1 depending on whether the needle is less
	 *     than, equal to, or greater than the element, respectively.
	 * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
	 *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
	 *     closest element that is smaller than or greater than the one we are
	 *     searching for, respectively, if the exact element cannot be found.
	 *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
	 */
	exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
	  if (aHaystack.length === 0) {
	    return -1;
	  }

	  var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
	                              aCompare, aBias || exports.GREATEST_LOWER_BOUND);
	  if (index < 0) {
	    return -1;
	  }

	  // We have found either the exact element, or the next-closest element than
	  // the one we are searching for. However, there may be more than one such
	  // element. Make sure we always return the smallest of these.
	  while (index - 1 >= 0) {
	    if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
	      break;
	    }
	    --index;
	  }

	  return index;
	}; 
} (binarySearch$1));

var quickSort$1 = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

function SortTemplate(comparator) {

/**
 * Swap the elements indexed by `x` and `y` in the array `ary`.
 *
 * @param {Array} ary
 *        The array.
 * @param {Number} x
 *        The index of the first item.
 * @param {Number} y
 *        The index of the second item.
 */
function swap(ary, x, y) {
  var temp = ary[x];
  ary[x] = ary[y];
  ary[y] = temp;
}

/**
 * Returns a random integer within the range `low .. high` inclusive.
 *
 * @param {Number} low
 *        The lower bound on the range.
 * @param {Number} high
 *        The upper bound on the range.
 */
function randomIntInRange(low, high) {
  return Math.round(low + (Math.random() * (high - low)));
}

/**
 * The Quick Sort algorithm.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 * @param {Number} p
 *        Start index of the array
 * @param {Number} r
 *        End index of the array
 */
function doQuickSort(ary, comparator, p, r) {
  // If our lower bound is less than our upper bound, we (1) partition the
  // array into two pieces and (2) recurse on each half. If it is not, this is
  // the empty array and our base case.

  if (p < r) {
    // (1) Partitioning.
    //
    // The partitioning chooses a pivot between `p` and `r` and moves all
    // elements that are less than or equal to the pivot to the before it, and
    // all the elements that are greater than it after it. The effect is that
    // once partition is done, the pivot is in the exact place it will be when
    // the array is put in sorted order, and it will not need to be moved
    // again. This runs in O(n) time.

    // Always choose a random pivot so that an input array which is reverse
    // sorted does not cause O(n^2) running time.
    var pivotIndex = randomIntInRange(p, r);
    var i = p - 1;

    swap(ary, pivotIndex, r);
    var pivot = ary[r];

    // Immediately after `j` is incremented in this loop, the following hold
    // true:
    //
    //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
    //
    //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
    for (var j = p; j < r; j++) {
      if (comparator(ary[j], pivot, false) <= 0) {
        i += 1;
        swap(ary, i, j);
      }
    }

    swap(ary, i + 1, j);
    var q = i + 1;

    // (2) Recurse on each half.

    doQuickSort(ary, comparator, p, q - 1);
    doQuickSort(ary, comparator, q + 1, r);
  }
}

  return doQuickSort;
}

function cloneSort(comparator) {
  let template = SortTemplate.toString();
  let templateFn = new Function(`return ${template}`)();
  return templateFn(comparator);
}

/**
 * Sort the given array in-place with the given comparator function.
 *
 * @param {Array} ary
 *        An array to sort.
 * @param {function} comparator
 *        Function to use to compare two items.
 */

let sortCache = new WeakMap();
quickSort$1.quickSort = function (ary, comparator, start = 0) {
  let doQuickSort = sortCache.get(comparator);
  if (doQuickSort === void 0) {
    doQuickSort = cloneSort(comparator);
    sortCache.set(comparator, doQuickSort);
  }
  doQuickSort(ary, comparator, start, ary.length - 1);
};

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var util$1 = util$5;
var binarySearch = binarySearch$1;
var ArraySet = arraySet.ArraySet;
var base64VLQ = base64Vlq;
var quickSort = quickSort$1.quickSort;

function SourceMapConsumer$1(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util$1.parseSourceMapInput(aSourceMap);
  }

  return sourceMap.sections != null
    ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
    : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
}

SourceMapConsumer$1.fromSourceMap = function(aSourceMap, aSourceMapURL) {
  return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
};

/**
 * The version of the source mapping spec that we are consuming.
 */
SourceMapConsumer$1.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

SourceMapConsumer$1.prototype.__generatedMappings = null;
Object.defineProperty(SourceMapConsumer$1.prototype, '_generatedMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__generatedMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__generatedMappings;
  }
});

SourceMapConsumer$1.prototype.__originalMappings = null;
Object.defineProperty(SourceMapConsumer$1.prototype, '_originalMappings', {
  configurable: true,
  enumerable: true,
  get: function () {
    if (!this.__originalMappings) {
      this._parseMappings(this._mappings, this.sourceRoot);
    }

    return this.__originalMappings;
  }
});

SourceMapConsumer$1.prototype._charIsMappingSeparator =
  function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
    var c = aStr.charAt(index);
    return c === ";" || c === ",";
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
SourceMapConsumer$1.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    throw new Error("Subclasses must implement _parseMappings");
  };

SourceMapConsumer$1.GENERATED_ORDER = 1;
SourceMapConsumer$1.ORIGINAL_ORDER = 2;

SourceMapConsumer$1.GREATEST_LOWER_BOUND = 1;
SourceMapConsumer$1.LEAST_UPPER_BOUND = 2;

/**
 * Iterate over each mapping between an original source/line/column and a
 * generated line/column in this source map.
 *
 * @param Function aCallback
 *        The function that is called with each mapping.
 * @param Object aContext
 *        Optional. If specified, this object will be the value of `this` every
 *        time that `aCallback` is called.
 * @param aOrder
 *        Either `SourceMapConsumer.GENERATED_ORDER` or
 *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
 *        iterate over the mappings sorted by the generated file's line/column
 *        order or the original's source/line/column order, respectively. Defaults to
 *        `SourceMapConsumer.GENERATED_ORDER`.
 */
SourceMapConsumer$1.prototype.eachMapping =
  function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
    var context = aContext || null;
    var order = aOrder || SourceMapConsumer$1.GENERATED_ORDER;

    var mappings;
    switch (order) {
    case SourceMapConsumer$1.GENERATED_ORDER:
      mappings = this._generatedMappings;
      break;
    case SourceMapConsumer$1.ORIGINAL_ORDER:
      mappings = this._originalMappings;
      break;
    default:
      throw new Error("Unknown order of iteration.");
    }

    var sourceRoot = this.sourceRoot;
    var boundCallback = aCallback.bind(context);
    var names = this._names;
    var sources = this._sources;
    var sourceMapURL = this._sourceMapURL;

    for (var i = 0, n = mappings.length; i < n; i++) {
      var mapping = mappings[i];
      var source = mapping.source === null ? null : sources.at(mapping.source);
      source = util$1.computeSourceURL(sourceRoot, source, sourceMapURL);
      boundCallback({
        source: source,
        generatedLine: mapping.generatedLine,
        generatedColumn: mapping.generatedColumn,
        originalLine: mapping.originalLine,
        originalColumn: mapping.originalColumn,
        name: mapping.name === null ? null : names.at(mapping.name)
      });
    }
  };

/**
 * Returns all generated line and column information for the original source,
 * line, and column provided. If no column is provided, returns all mappings
 * corresponding to a either the line we are searching for or the next
 * closest line that has any mappings. Otherwise, returns all mappings
 * corresponding to the given line and either the column we are searching for
 * or the next closest column that has any offsets.
 *
 * The only argument is an object with the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number is 1-based.
 *   - column: Optional. the column number in the original source.
 *    The column number is 0-based.
 *
 * and an array of objects is returned, each with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *    line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *    The column number is 0-based.
 */
SourceMapConsumer$1.prototype.allGeneratedPositionsFor =
  function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
    var line = util$1.getArg(aArgs, 'line');

    // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
    // returns the index of the closest mapping less than the needle. By
    // setting needle.originalColumn to 0, we thus find the last mapping for
    // the given line, provided such a mapping exists.
    var needle = {
      source: util$1.getArg(aArgs, 'source'),
      originalLine: line,
      originalColumn: util$1.getArg(aArgs, 'column', 0)
    };

    needle.source = this._findSourceIndex(needle.source);
    if (needle.source < 0) {
      return [];
    }

    var mappings = [];

    var index = this._findMapping(needle,
                                  this._originalMappings,
                                  "originalLine",
                                  "originalColumn",
                                  util$1.compareByOriginalPositions,
                                  binarySearch.LEAST_UPPER_BOUND);
    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (aArgs.column === undefined) {
        var originalLine = mapping.originalLine;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we found. Since
        // mappings are sorted, this is guaranteed to find all mappings for
        // the line we found.
        while (mapping && mapping.originalLine === originalLine) {
          mappings.push({
            line: util$1.getArg(mapping, 'generatedLine', null),
            column: util$1.getArg(mapping, 'generatedColumn', null),
            lastColumn: util$1.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      } else {
        var originalColumn = mapping.originalColumn;

        // Iterate until either we run out of mappings, or we run into
        // a mapping for a different line than the one we were searching for.
        // Since mappings are sorted, this is guaranteed to find all mappings for
        // the line we are searching for.
        while (mapping &&
               mapping.originalLine === line &&
               mapping.originalColumn == originalColumn) {
          mappings.push({
            line: util$1.getArg(mapping, 'generatedLine', null),
            column: util$1.getArg(mapping, 'generatedColumn', null),
            lastColumn: util$1.getArg(mapping, 'lastGeneratedColumn', null)
          });

          mapping = this._originalMappings[++index];
        }
      }
    }

    return mappings;
  };

sourceMapConsumer.SourceMapConsumer = SourceMapConsumer$1;

/**
 * A BasicSourceMapConsumer instance represents a parsed source map which we can
 * query for information about the original file positions by giving it a file
 * position in the generated source.
 *
 * The first parameter is the raw source map (either as a JSON string, or
 * already parsed to an object). According to the spec, source maps have the
 * following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - sources: An array of URLs to the original source files.
 *   - names: An array of identifiers which can be referrenced by individual mappings.
 *   - sourceRoot: Optional. The URL root from which all sources are relative.
 *   - sourcesContent: Optional. An array of contents of the original source files.
 *   - mappings: A string of base64 VLQs which contain the actual mappings.
 *   - file: Optional. The generated file this source map is associated with.
 *
 * Here is an example source map, taken from the source map spec[0]:
 *
 *     {
 *       version : 3,
 *       file: "out.js",
 *       sourceRoot : "",
 *       sources: ["foo.js", "bar.js"],
 *       names: ["src", "maps", "are", "fun"],
 *       mappings: "AA,AB;;ABCDE;"
 *     }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
 */
function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util$1.parseSourceMapInput(aSourceMap);
  }

  var version = util$1.getArg(sourceMap, 'version');
  var sources = util$1.getArg(sourceMap, 'sources');
  // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
  // requires the array) to play nice here.
  var names = util$1.getArg(sourceMap, 'names', []);
  var sourceRoot = util$1.getArg(sourceMap, 'sourceRoot', null);
  var sourcesContent = util$1.getArg(sourceMap, 'sourcesContent', null);
  var mappings = util$1.getArg(sourceMap, 'mappings');
  var file = util$1.getArg(sourceMap, 'file', null);

  // Once again, Sass deviates from the spec and supplies the version as a
  // string rather than a number, so we use loose equality checking here.
  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  if (sourceRoot) {
    sourceRoot = util$1.normalize(sourceRoot);
  }

  sources = sources
    .map(String)
    // Some source maps produce relative source paths like "./foo.js" instead of
    // "foo.js".  Normalize these first so that future comparisons will succeed.
    // See bugzil.la/1090768.
    .map(util$1.normalize)
    // Always ensure that absolute sources are internally stored relative to
    // the source root, if the source root is absolute. Not doing this would
    // be particularly problematic when the source root is a prefix of the
    // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
    .map(function (source) {
      return sourceRoot && util$1.isAbsolute(sourceRoot) && util$1.isAbsolute(source)
        ? util$1.relative(sourceRoot, source)
        : source;
    });

  // Pass `true` below to allow duplicate names and sources. While source maps
  // are intended to be compressed and deduplicated, the TypeScript compiler
  // sometimes generates source maps with duplicates in them. See Github issue
  // #72 and bugzil.la/889492.
  this._names = ArraySet.fromArray(names.map(String), true);
  this._sources = ArraySet.fromArray(sources, true);

  this._absoluteSources = this._sources.toArray().map(function (s) {
    return util$1.computeSourceURL(sourceRoot, s, aSourceMapURL);
  });

  this.sourceRoot = sourceRoot;
  this.sourcesContent = sourcesContent;
  this._mappings = mappings;
  this._sourceMapURL = aSourceMapURL;
  this.file = file;
}

BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer$1.prototype);
BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer$1;

/**
 * Utility function to find the index of a source.  Returns -1 if not
 * found.
 */
BasicSourceMapConsumer.prototype._findSourceIndex = function(aSource) {
  var relativeSource = aSource;
  if (this.sourceRoot != null) {
    relativeSource = util$1.relative(this.sourceRoot, relativeSource);
  }

  if (this._sources.has(relativeSource)) {
    return this._sources.indexOf(relativeSource);
  }

  // Maybe aSource is an absolute URL as returned by |sources|.  In
  // this case we can't simply undo the transform.
  var i;
  for (i = 0; i < this._absoluteSources.length; ++i) {
    if (this._absoluteSources[i] == aSource) {
      return i;
    }
  }

  return -1;
};

/**
 * Create a BasicSourceMapConsumer from a SourceMapGenerator.
 *
 * @param SourceMapGenerator aSourceMap
 *        The source map that will be consumed.
 * @param String aSourceMapURL
 *        The URL at which the source map can be found (optional)
 * @returns BasicSourceMapConsumer
 */
BasicSourceMapConsumer.fromSourceMap =
  function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
    var smc = Object.create(BasicSourceMapConsumer.prototype);

    var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
    var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
    smc.sourceRoot = aSourceMap._sourceRoot;
    smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
                                                            smc.sourceRoot);
    smc.file = aSourceMap._file;
    smc._sourceMapURL = aSourceMapURL;
    smc._absoluteSources = smc._sources.toArray().map(function (s) {
      return util$1.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
    });

    // Because we are modifying the entries (by converting string sources and
    // names to indices into the sources and names ArraySets), we have to make
    // a copy of the entry or else bad things happen. Shared mutable state
    // strikes again! See github issue #191.

    var generatedMappings = aSourceMap._mappings.toArray().slice();
    var destGeneratedMappings = smc.__generatedMappings = [];
    var destOriginalMappings = smc.__originalMappings = [];

    for (var i = 0, length = generatedMappings.length; i < length; i++) {
      var srcMapping = generatedMappings[i];
      var destMapping = new Mapping$1;
      destMapping.generatedLine = srcMapping.generatedLine;
      destMapping.generatedColumn = srcMapping.generatedColumn;

      if (srcMapping.source) {
        destMapping.source = sources.indexOf(srcMapping.source);
        destMapping.originalLine = srcMapping.originalLine;
        destMapping.originalColumn = srcMapping.originalColumn;

        if (srcMapping.name) {
          destMapping.name = names.indexOf(srcMapping.name);
        }

        destOriginalMappings.push(destMapping);
      }

      destGeneratedMappings.push(destMapping);
    }

    quickSort(smc.__originalMappings, util$1.compareByOriginalPositions);

    return smc;
  };

/**
 * The version of the source mapping spec that we are consuming.
 */
BasicSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
  get: function () {
    return this._absoluteSources.slice();
  }
});

/**
 * Provide the JIT with a nice shape / hidden class.
 */
function Mapping$1() {
  this.generatedLine = 0;
  this.generatedColumn = 0;
  this.source = null;
  this.originalLine = null;
  this.originalColumn = null;
  this.name = null;
}

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */

const compareGenerated = util$1.compareByGeneratedPositionsDeflatedNoLine;
function sortGenerated(array, start) {
  let l = array.length;
  let n = array.length - start;
  if (n <= 1) {
    return;
  } else if (n == 2) {
    let a = array[start];
    let b = array[start + 1];
    if (compareGenerated(a, b) > 0) {
      array[start] = b;
      array[start + 1] = a;
    }
  } else if (n < 20) {
    for (let i = start; i < l; i++) {
      for (let j = i; j > start; j--) {
        let a = array[j - 1];
        let b = array[j];
        if (compareGenerated(a, b) <= 0) {
          break;
        }
        array[j - 1] = b;
        array[j] = a;
      }
    }
  } else {
    quickSort(array, compareGenerated, start);
  }
}
BasicSourceMapConsumer.prototype._parseMappings =
  function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    var generatedLine = 1;
    var previousGeneratedColumn = 0;
    var previousOriginalLine = 0;
    var previousOriginalColumn = 0;
    var previousSource = 0;
    var previousName = 0;
    var length = aStr.length;
    var index = 0;
    var temp = {};
    var originalMappings = [];
    var generatedMappings = [];
    var mapping, segment, end, value;

    let subarrayStart = 0;
    while (index < length) {
      if (aStr.charAt(index) === ';') {
        generatedLine++;
        index++;
        previousGeneratedColumn = 0;

        sortGenerated(generatedMappings, subarrayStart);
        subarrayStart = generatedMappings.length;
      }
      else if (aStr.charAt(index) === ',') {
        index++;
      }
      else {
        mapping = new Mapping$1();
        mapping.generatedLine = generatedLine;

        for (end = index; end < length; end++) {
          if (this._charIsMappingSeparator(aStr, end)) {
            break;
          }
        }
        aStr.slice(index, end);

        segment = [];
        while (index < end) {
          base64VLQ.decode(aStr, index, temp);
          value = temp.value;
          index = temp.rest;
          segment.push(value);
        }

        if (segment.length === 2) {
          throw new Error('Found a source, but no line and column');
        }

        if (segment.length === 3) {
          throw new Error('Found a source and line, but no column');
        }

        // Generated column.
        mapping.generatedColumn = previousGeneratedColumn + segment[0];
        previousGeneratedColumn = mapping.generatedColumn;

        if (segment.length > 1) {
          // Original source.
          mapping.source = previousSource + segment[1];
          previousSource += segment[1];

          // Original line.
          mapping.originalLine = previousOriginalLine + segment[2];
          previousOriginalLine = mapping.originalLine;
          // Lines are stored 0-based
          mapping.originalLine += 1;

          // Original column.
          mapping.originalColumn = previousOriginalColumn + segment[3];
          previousOriginalColumn = mapping.originalColumn;

          if (segment.length > 4) {
            // Original name.
            mapping.name = previousName + segment[4];
            previousName += segment[4];
          }
        }

        generatedMappings.push(mapping);
        if (typeof mapping.originalLine === 'number') {
          let currentSource = mapping.source;
          while (originalMappings.length <= currentSource) {
            originalMappings.push(null);
          }
          if (originalMappings[currentSource] === null) {
            originalMappings[currentSource] = [];
          }
          originalMappings[currentSource].push(mapping);
        }
      }
    }

    sortGenerated(generatedMappings, subarrayStart);
    this.__generatedMappings = generatedMappings;

    for (var i = 0; i < originalMappings.length; i++) {
      if (originalMappings[i] != null) {
        quickSort(originalMappings[i], util$1.compareByOriginalPositionsNoSource);
      }
    }
    this.__originalMappings = [].concat(...originalMappings);
  };

/**
 * Find the mapping that best matches the hypothetical "needle" mapping that
 * we are searching for in the given "haystack" of mappings.
 */
BasicSourceMapConsumer.prototype._findMapping =
  function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                         aColumnName, aComparator, aBias) {
    // To return the position we are searching for, we must first find the
    // mapping for the given position and then return the opposite position it
    // points to. Because the mappings are sorted, we can use binary search to
    // find the best mapping.

    if (aNeedle[aLineName] <= 0) {
      throw new TypeError('Line must be greater than or equal to 1, got '
                          + aNeedle[aLineName]);
    }
    if (aNeedle[aColumnName] < 0) {
      throw new TypeError('Column must be greater than or equal to 0, got '
                          + aNeedle[aColumnName]);
    }

    return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
  };

/**
 * Compute the last column for each generated mapping. The last column is
 * inclusive.
 */
BasicSourceMapConsumer.prototype.computeColumnSpans =
  function SourceMapConsumer_computeColumnSpans() {
    for (var index = 0; index < this._generatedMappings.length; ++index) {
      var mapping = this._generatedMappings[index];

      // Mappings do not contain a field for the last generated columnt. We
      // can come up with an optimistic estimate, however, by assuming that
      // mappings are contiguous (i.e. given two consecutive mappings, the
      // first mapping ends where the second one starts).
      if (index + 1 < this._generatedMappings.length) {
        var nextMapping = this._generatedMappings[index + 1];

        if (mapping.generatedLine === nextMapping.generatedLine) {
          mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
          continue;
        }
      }

      // The last mapping for each line spans the entire line.
      mapping.lastGeneratedColumn = Infinity;
    }
  };

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
BasicSourceMapConsumer.prototype.originalPositionFor =
  function SourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util$1.getArg(aArgs, 'line'),
      generatedColumn: util$1.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._generatedMappings,
      "generatedLine",
      "generatedColumn",
      util$1.compareByGeneratedPositionsDeflated,
      util$1.getArg(aArgs, 'bias', SourceMapConsumer$1.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._generatedMappings[index];

      if (mapping.generatedLine === needle.generatedLine) {
        var source = util$1.getArg(mapping, 'source', null);
        if (source !== null) {
          source = this._sources.at(source);
          source = util$1.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
        }
        var name = util$1.getArg(mapping, 'name', null);
        if (name !== null) {
          name = this._names.at(name);
        }
        return {
          source: source,
          line: util$1.getArg(mapping, 'originalLine', null),
          column: util$1.getArg(mapping, 'originalColumn', null),
          name: name
        };
      }
    }

    return {
      source: null,
      line: null,
      column: null,
      name: null
    };
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
  function BasicSourceMapConsumer_hasContentsOfAllSources() {
    if (!this.sourcesContent) {
      return false;
    }
    return this.sourcesContent.length >= this._sources.size() &&
      !this.sourcesContent.some(function (sc) { return sc == null; });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
BasicSourceMapConsumer.prototype.sourceContentFor =
  function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    if (!this.sourcesContent) {
      return null;
    }

    var index = this._findSourceIndex(aSource);
    if (index >= 0) {
      return this.sourcesContent[index];
    }

    var relativeSource = aSource;
    if (this.sourceRoot != null) {
      relativeSource = util$1.relative(this.sourceRoot, relativeSource);
    }

    var url;
    if (this.sourceRoot != null
        && (url = util$1.urlParse(this.sourceRoot))) {
      // XXX: file:// URIs and absolute paths lead to unexpected behavior for
      // many users. We can help them out when they expect file:// URIs to
      // behave like it would if they were running a local HTTP server. See
      // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
      var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
      if (url.scheme == "file"
          && this._sources.has(fileUriAbsPath)) {
        return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
      }

      if ((!url.path || url.path == "/")
          && this._sources.has("/" + relativeSource)) {
        return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
      }
    }

    // This function is used recursively from
    // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
    // don't want to throw if we can't find the source - we just want to
    // return null, so we provide a flag to exit gracefully.
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + relativeSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
 *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
 *     closest element that is smaller than or greater than the one we are
 *     searching for, respectively, if the exact element cannot be found.
 *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
BasicSourceMapConsumer.prototype.generatedPositionFor =
  function SourceMapConsumer_generatedPositionFor(aArgs) {
    var source = util$1.getArg(aArgs, 'source');
    source = this._findSourceIndex(source);
    if (source < 0) {
      return {
        line: null,
        column: null,
        lastColumn: null
      };
    }

    var needle = {
      source: source,
      originalLine: util$1.getArg(aArgs, 'line'),
      originalColumn: util$1.getArg(aArgs, 'column')
    };

    var index = this._findMapping(
      needle,
      this._originalMappings,
      "originalLine",
      "originalColumn",
      util$1.compareByOriginalPositions,
      util$1.getArg(aArgs, 'bias', SourceMapConsumer$1.GREATEST_LOWER_BOUND)
    );

    if (index >= 0) {
      var mapping = this._originalMappings[index];

      if (mapping.source === needle.source) {
        return {
          line: util$1.getArg(mapping, 'generatedLine', null),
          column: util$1.getArg(mapping, 'generatedColumn', null),
          lastColumn: util$1.getArg(mapping, 'lastGeneratedColumn', null)
        };
      }
    }

    return {
      line: null,
      column: null,
      lastColumn: null
    };
  };

sourceMapConsumer.BasicSourceMapConsumer = BasicSourceMapConsumer;

/**
 * An IndexedSourceMapConsumer instance represents a parsed source map which
 * we can query for information. It differs from BasicSourceMapConsumer in
 * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
 * input.
 *
 * The first parameter is a raw source map (either as a JSON string, or already
 * parsed to an object). According to the spec for indexed source maps, they
 * have the following attributes:
 *
 *   - version: Which version of the source map spec this map is following.
 *   - file: Optional. The generated file this source map is associated with.
 *   - sections: A list of section definitions.
 *
 * Each value under the "sections" field has two fields:
 *   - offset: The offset into the original specified at which this section
 *       begins to apply, defined as an object with a "line" and "column"
 *       field.
 *   - map: A source map definition. This source map could also be indexed,
 *       but doesn't have to be.
 *
 * Instead of the "map" field, it's also possible to have a "url" field
 * specifying a URL to retrieve a source map from, but that's currently
 * unsupported.
 *
 * Here's an example source map, taken from the source map spec[0], but
 * modified to omit a section which uses the "url" field.
 *
 *  {
 *    version : 3,
 *    file: "app.js",
 *    sections: [{
 *      offset: {line:100, column:10},
 *      map: {
 *        version : 3,
 *        file: "section.js",
 *        sources: ["foo.js", "bar.js"],
 *        names: ["src", "maps", "are", "fun"],
 *        mappings: "AAAA,E;;ABCDE;"
 *      }
 *    }],
 *  }
 *
 * The second parameter, if given, is a string whose value is the URL
 * at which the source map was found.  This URL is used to compute the
 * sources array.
 *
 * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
 */
function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
  var sourceMap = aSourceMap;
  if (typeof aSourceMap === 'string') {
    sourceMap = util$1.parseSourceMapInput(aSourceMap);
  }

  var version = util$1.getArg(sourceMap, 'version');
  var sections = util$1.getArg(sourceMap, 'sections');

  if (version != this._version) {
    throw new Error('Unsupported version: ' + version);
  }

  this._sources = new ArraySet();
  this._names = new ArraySet();

  var lastOffset = {
    line: -1,
    column: 0
  };
  this._sections = sections.map(function (s) {
    if (s.url) {
      // The url field will require support for asynchronicity.
      // See https://github.com/mozilla/source-map/issues/16
      throw new Error('Support for url field in sections not implemented.');
    }
    var offset = util$1.getArg(s, 'offset');
    var offsetLine = util$1.getArg(offset, 'line');
    var offsetColumn = util$1.getArg(offset, 'column');

    if (offsetLine < lastOffset.line ||
        (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
      throw new Error('Section offsets must be ordered and non-overlapping.');
    }
    lastOffset = offset;

    return {
      generatedOffset: {
        // The offset fields are 0-based, but we use 1-based indices when
        // encoding/decoding from VLQ.
        generatedLine: offsetLine + 1,
        generatedColumn: offsetColumn + 1
      },
      consumer: new SourceMapConsumer$1(util$1.getArg(s, 'map'), aSourceMapURL)
    }
  });
}

IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer$1.prototype);
IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer$1;

/**
 * The version of the source mapping spec that we are consuming.
 */
IndexedSourceMapConsumer.prototype._version = 3;

/**
 * The list of original sources.
 */
Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
  get: function () {
    var sources = [];
    for (var i = 0; i < this._sections.length; i++) {
      for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
        sources.push(this._sections[i].consumer.sources[j]);
      }
    }
    return sources;
  }
});

/**
 * Returns the original source, line, and column information for the generated
 * source's line and column positions provided. The only argument is an object
 * with the following properties:
 *
 *   - line: The line number in the generated source.  The line number
 *     is 1-based.
 *   - column: The column number in the generated source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - source: The original source file, or null.
 *   - line: The line number in the original source, or null.  The
 *     line number is 1-based.
 *   - column: The column number in the original source, or null.  The
 *     column number is 0-based.
 *   - name: The original identifier, or null.
 */
IndexedSourceMapConsumer.prototype.originalPositionFor =
  function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
    var needle = {
      generatedLine: util$1.getArg(aArgs, 'line'),
      generatedColumn: util$1.getArg(aArgs, 'column')
    };

    // Find the section containing the generated position we're trying to map
    // to an original position.
    var sectionIndex = binarySearch.search(needle, this._sections,
      function(needle, section) {
        var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
        if (cmp) {
          return cmp;
        }

        return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
      });
    var section = this._sections[sectionIndex];

    if (!section) {
      return {
        source: null,
        line: null,
        column: null,
        name: null
      };
    }

    return section.consumer.originalPositionFor({
      line: needle.generatedLine -
        (section.generatedOffset.generatedLine - 1),
      column: needle.generatedColumn -
        (section.generatedOffset.generatedLine === needle.generatedLine
         ? section.generatedOffset.generatedColumn - 1
         : 0),
      bias: aArgs.bias
    });
  };

/**
 * Return true if we have the source content for every source in the source
 * map, false otherwise.
 */
IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
  function IndexedSourceMapConsumer_hasContentsOfAllSources() {
    return this._sections.every(function (s) {
      return s.consumer.hasContentsOfAllSources();
    });
  };

/**
 * Returns the original source content. The only argument is the url of the
 * original source file. Returns null if no original source content is
 * available.
 */
IndexedSourceMapConsumer.prototype.sourceContentFor =
  function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      var content = section.consumer.sourceContentFor(aSource, true);
      if (content || content === '') {
        return content;
      }
    }
    if (nullOnMissing) {
      return null;
    }
    else {
      throw new Error('"' + aSource + '" is not in the SourceMap.');
    }
  };

/**
 * Returns the generated line and column information for the original source,
 * line, and column positions provided. The only argument is an object with
 * the following properties:
 *
 *   - source: The filename of the original source.
 *   - line: The line number in the original source.  The line number
 *     is 1-based.
 *   - column: The column number in the original source.  The column
 *     number is 0-based.
 *
 * and an object is returned with the following properties:
 *
 *   - line: The line number in the generated source, or null.  The
 *     line number is 1-based. 
 *   - column: The column number in the generated source, or null.
 *     The column number is 0-based.
 */
IndexedSourceMapConsumer.prototype.generatedPositionFor =
  function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];

      // Only consider this section if the requested source is in the list of
      // sources of the consumer.
      if (section.consumer._findSourceIndex(util$1.getArg(aArgs, 'source')) === -1) {
        continue;
      }
      var generatedPosition = section.consumer.generatedPositionFor(aArgs);
      if (generatedPosition) {
        var ret = {
          line: generatedPosition.line +
            (section.generatedOffset.generatedLine - 1),
          column: generatedPosition.column +
            (section.generatedOffset.generatedLine === generatedPosition.line
             ? section.generatedOffset.generatedColumn - 1
             : 0)
        };
        return ret;
      }
    }

    return {
      line: null,
      column: null
    };
  };

/**
 * Parse the mappings in a string in to a data structure which we can easily
 * query (the ordered arrays in the `this.__generatedMappings` and
 * `this.__originalMappings` properties).
 */
IndexedSourceMapConsumer.prototype._parseMappings =
  function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
    this.__generatedMappings = [];
    this.__originalMappings = [];
    for (var i = 0; i < this._sections.length; i++) {
      var section = this._sections[i];
      var sectionMappings = section.consumer._generatedMappings;
      for (var j = 0; j < sectionMappings.length; j++) {
        var mapping = sectionMappings[j];

        var source = section.consumer._sources.at(mapping.source);
        source = util$1.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
        this._sources.add(source);
        source = this._sources.indexOf(source);

        var name = null;
        if (mapping.name) {
          name = section.consumer._names.at(mapping.name);
          this._names.add(name);
          name = this._names.indexOf(name);
        }

        // The mappings coming from the consumer for the section have
        // generated positions relative to the start of the section, so we
        // need to offset them to be relative to the start of the concatenated
        // generated file.
        var adjustedMapping = {
          source: source,
          generatedLine: mapping.generatedLine +
            (section.generatedOffset.generatedLine - 1),
          generatedColumn: mapping.generatedColumn +
            (section.generatedOffset.generatedLine === mapping.generatedLine
            ? section.generatedOffset.generatedColumn - 1
            : 0),
          originalLine: mapping.originalLine,
          originalColumn: mapping.originalColumn,
          name: name
        };

        this.__generatedMappings.push(adjustedMapping);
        if (typeof adjustedMapping.originalLine === 'number') {
          this.__originalMappings.push(adjustedMapping);
        }
      }
    }

    quickSort(this.__generatedMappings, util$1.compareByGeneratedPositionsDeflated);
    quickSort(this.__originalMappings, util$1.compareByOriginalPositions);
  };

sourceMapConsumer.IndexedSourceMapConsumer = IndexedSourceMapConsumer;

var sourceNode = {};

/* -*- Mode: js; js-indent-level: 2; -*- */

/*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

var SourceMapGenerator$1 = sourceMapGenerator.SourceMapGenerator;
var util = util$5;

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
var isSourceNode = "$$$isSourceNode$$$";

/**
 * SourceNodes provide a way to abstract over interpolating/concatenating
 * snippets of generated JavaScript source code while maintaining the line and
 * column information associated with the original source code.
 *
 * @param aLine The original line number.
 * @param aColumn The original column number.
 * @param aSource The original source's filename.
 * @param aChunks Optional. An array of strings which are snippets of
 *        generated JS, or other SourceNodes.
 * @param aName The original identifier.
 */
function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
  this.children = [];
  this.sourceContents = {};
  this.line = aLine == null ? null : aLine;
  this.column = aColumn == null ? null : aColumn;
  this.source = aSource == null ? null : aSource;
  this.name = aName == null ? null : aName;
  this[isSourceNode] = true;
  if (aChunks != null) this.add(aChunks);
}

/**
 * Creates a SourceNode from generated code and a SourceMapConsumer.
 *
 * @param aGeneratedCode The generated code
 * @param aSourceMapConsumer The SourceMap for the generated code
 * @param aRelativePath Optional. The path that relative sources in the
 *        SourceMapConsumer should be relative to.
 */
SourceNode.fromStringWithSourceMap =
  function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
    // The SourceNode we want to fill with the generated code
    // and the SourceMap
    var node = new SourceNode();

    // All even indices of this array are one line of the generated code,
    // while all odd indices are the newlines between two adjacent lines
    // (since `REGEX_NEWLINE` captures its match).
    // Processed fragments are accessed by calling `shiftNextLine`.
    var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
    var remainingLinesIndex = 0;
    var shiftNextLine = function() {
      var lineContents = getNextLine();
      // The last line of a file might not have a newline.
      var newLine = getNextLine() || "";
      return lineContents + newLine;

      function getNextLine() {
        return remainingLinesIndex < remainingLines.length ?
            remainingLines[remainingLinesIndex++] : undefined;
      }
    };

    // We need to remember the position of "remainingLines"
    var lastGeneratedLine = 1, lastGeneratedColumn = 0;

    // The generate SourceNodes we need a code range.
    // To extract it current and last mapping is used.
    // Here we store the last mapping.
    var lastMapping = null;

    aSourceMapConsumer.eachMapping(function (mapping) {
      if (lastMapping !== null) {
        // We add the code from "lastMapping" to "mapping":
        // First check if there is a new line in between.
        if (lastGeneratedLine < mapping.generatedLine) {
          // Associate first line with "lastMapping"
          addMappingWithCode(lastMapping, shiftNextLine());
          lastGeneratedLine++;
          lastGeneratedColumn = 0;
          // The remaining code is added without mapping
        } else {
          // There is no new line in between.
          // Associate the code between "lastGeneratedColumn" and
          // "mapping.generatedColumn" with "lastMapping"
          var nextLine = remainingLines[remainingLinesIndex] || '';
          var code = nextLine.substr(0, mapping.generatedColumn -
                                        lastGeneratedColumn);
          remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
                                              lastGeneratedColumn);
          lastGeneratedColumn = mapping.generatedColumn;
          addMappingWithCode(lastMapping, code);
          // No more remaining code, continue
          lastMapping = mapping;
          return;
        }
      }
      // We add the generated code until the first mapping
      // to the SourceNode without any mapping.
      // Each line is added as separate string.
      while (lastGeneratedLine < mapping.generatedLine) {
        node.add(shiftNextLine());
        lastGeneratedLine++;
      }
      if (lastGeneratedColumn < mapping.generatedColumn) {
        var nextLine = remainingLines[remainingLinesIndex] || '';
        node.add(nextLine.substr(0, mapping.generatedColumn));
        remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
        lastGeneratedColumn = mapping.generatedColumn;
      }
      lastMapping = mapping;
    }, this);
    // We have processed all mappings.
    if (remainingLinesIndex < remainingLines.length) {
      if (lastMapping) {
        // Associate the remaining code in the current line with "lastMapping"
        addMappingWithCode(lastMapping, shiftNextLine());
      }
      // and add the remaining lines without any mapping
      node.add(remainingLines.splice(remainingLinesIndex).join(""));
    }

    // Copy sourcesContent into SourceNode
    aSourceMapConsumer.sources.forEach(function (sourceFile) {
      var content = aSourceMapConsumer.sourceContentFor(sourceFile);
      if (content != null) {
        if (aRelativePath != null) {
          sourceFile = util.join(aRelativePath, sourceFile);
        }
        node.setSourceContent(sourceFile, content);
      }
    });

    return node;

    function addMappingWithCode(mapping, code) {
      if (mapping === null || mapping.source === undefined) {
        node.add(code);
      } else {
        var source = aRelativePath
          ? util.join(aRelativePath, mapping.source)
          : mapping.source;
        node.add(new SourceNode(mapping.originalLine,
                                mapping.originalColumn,
                                source,
                                code,
                                mapping.name));
      }
    }
  };

/**
 * Add a chunk of generated JS to this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.add = function SourceNode_add(aChunk) {
  if (Array.isArray(aChunk)) {
    aChunk.forEach(function (chunk) {
      this.add(chunk);
    }, this);
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    if (aChunk) {
      this.children.push(aChunk);
    }
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Add a chunk of generated JS to the beginning of this source node.
 *
 * @param aChunk A string snippet of generated JS code, another instance of
 *        SourceNode, or an array where each member is one of those things.
 */
SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
  if (Array.isArray(aChunk)) {
    for (var i = aChunk.length-1; i >= 0; i--) {
      this.prepend(aChunk[i]);
    }
  }
  else if (aChunk[isSourceNode] || typeof aChunk === "string") {
    this.children.unshift(aChunk);
  }
  else {
    throw new TypeError(
      "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
    );
  }
  return this;
};

/**
 * Walk over the tree of JS snippets in this node and its children. The
 * walking function is called once for each snippet of JS and is passed that
 * snippet and the its original associated source's line/column location.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walk = function SourceNode_walk(aFn) {
  var chunk;
  for (var i = 0, len = this.children.length; i < len; i++) {
    chunk = this.children[i];
    if (chunk[isSourceNode]) {
      chunk.walk(aFn);
    }
    else {
      if (chunk !== '') {
        aFn(chunk, { source: this.source,
                     line: this.line,
                     column: this.column,
                     name: this.name });
      }
    }
  }
};

/**
 * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
 * each of `this.children`.
 *
 * @param aSep The separator.
 */
SourceNode.prototype.join = function SourceNode_join(aSep) {
  var newChildren;
  var i;
  var len = this.children.length;
  if (len > 0) {
    newChildren = [];
    for (i = 0; i < len-1; i++) {
      newChildren.push(this.children[i]);
      newChildren.push(aSep);
    }
    newChildren.push(this.children[i]);
    this.children = newChildren;
  }
  return this;
};

/**
 * Call String.prototype.replace on the very right-most source snippet. Useful
 * for trimming whitespace from the end of a source node, etc.
 *
 * @param aPattern The pattern to replace.
 * @param aReplacement The thing to replace the pattern with.
 */
SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
  var lastChild = this.children[this.children.length - 1];
  if (lastChild[isSourceNode]) {
    lastChild.replaceRight(aPattern, aReplacement);
  }
  else if (typeof lastChild === 'string') {
    this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
  }
  else {
    this.children.push(''.replace(aPattern, aReplacement));
  }
  return this;
};

/**
 * Set the source content for a source file. This will be added to the SourceMapGenerator
 * in the sourcesContent field.
 *
 * @param aSourceFile The filename of the source file
 * @param aSourceContent The content of the source file
 */
SourceNode.prototype.setSourceContent =
  function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
    this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
  };

/**
 * Walk over the tree of SourceNodes. The walking function is called for each
 * source file content and is passed the filename and source content.
 *
 * @param aFn The traversal function.
 */
SourceNode.prototype.walkSourceContents =
  function SourceNode_walkSourceContents(aFn) {
    for (var i = 0, len = this.children.length; i < len; i++) {
      if (this.children[i][isSourceNode]) {
        this.children[i].walkSourceContents(aFn);
      }
    }

    var sources = Object.keys(this.sourceContents);
    for (var i = 0, len = sources.length; i < len; i++) {
      aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
    }
  };

/**
 * Return the string representation of this source node. Walks over the tree
 * and concatenates all the various snippets together to one string.
 */
SourceNode.prototype.toString = function SourceNode_toString() {
  var str = "";
  this.walk(function (chunk) {
    str += chunk;
  });
  return str;
};

/**
 * Returns the string representation of this source node along with a source
 * map.
 */
SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
  var generated = {
    code: "",
    line: 1,
    column: 0
  };
  var map = new SourceMapGenerator$1(aArgs);
  var sourceMappingActive = false;
  var lastOriginalSource = null;
  var lastOriginalLine = null;
  var lastOriginalColumn = null;
  var lastOriginalName = null;
  this.walk(function (chunk, original) {
    generated.code += chunk;
    if (original.source !== null
        && original.line !== null
        && original.column !== null) {
      if(lastOriginalSource !== original.source
         || lastOriginalLine !== original.line
         || lastOriginalColumn !== original.column
         || lastOriginalName !== original.name) {
        map.addMapping({
          source: original.source,
          original: {
            line: original.line,
            column: original.column
          },
          generated: {
            line: generated.line,
            column: generated.column
          },
          name: original.name
        });
      }
      lastOriginalSource = original.source;
      lastOriginalLine = original.line;
      lastOriginalColumn = original.column;
      lastOriginalName = original.name;
      sourceMappingActive = true;
    } else if (sourceMappingActive) {
      map.addMapping({
        generated: {
          line: generated.line,
          column: generated.column
        }
      });
      lastOriginalSource = null;
      sourceMappingActive = false;
    }
    for (var idx = 0, length = chunk.length; idx < length; idx++) {
      if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
        generated.line++;
        generated.column = 0;
        // Mappings end at eol
        if (idx + 1 === length) {
          lastOriginalSource = null;
          sourceMappingActive = false;
        } else if (sourceMappingActive) {
          map.addMapping({
            source: original.source,
            original: {
              line: original.line,
              column: original.column
            },
            generated: {
              line: generated.line,
              column: generated.column
            },
            name: original.name
          });
        }
      } else {
        generated.column++;
      }
    }
  });
  this.walkSourceContents(function (sourceFile, sourceContent) {
    map.setSourceContent(sourceFile, sourceContent);
  });

  return { code: generated.code, map: map };
};

sourceNode.SourceNode = SourceNode;

/*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

sourceMap.SourceMapGenerator = sourceMapGenerator.SourceMapGenerator;
sourceMap.SourceMapConsumer = sourceMapConsumer.SourceMapConsumer;
sourceMap.SourceNode = sourceNode.SourceNode;

var lib = {};

Object.defineProperty(lib, '__esModule', {
  value: true
});
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
class Position {
  constructor(line, col, index) {
    this.line = void 0;
    this.column = void 0;
    this.index = void 0;
    this.line = line;
    this.column = col;
    this.index = index;
  }
}
let SourceLocation$1 = class SourceLocation {
  constructor(start, end) {
    this.start = void 0;
    this.end = void 0;
    this.filename = void 0;
    this.identifierName = void 0;
    this.start = start;
    this.end = end;
  }
};
function createPositionWithColumnOffset(position, columnOffset) {
  const {
    line,
    column,
    index
  } = position;
  return new Position(line, column + columnOffset, index + columnOffset);
}
const code = "BABEL_PARSER_SOURCETYPE_MODULE_REQUIRED";
var ModuleErrors = {
  ImportMetaOutsideModule: {
    message: `import.meta may appear only with 'sourceType: "module"'`,
    code
  },
  ImportOutsideModule: {
    message: `'import' and 'export' may appear only with 'sourceType: "module"'`,
    code
  }
};
const NodeDescriptions = {
  ArrayPattern: "array destructuring pattern",
  AssignmentExpression: "assignment expression",
  AssignmentPattern: "assignment expression",
  ArrowFunctionExpression: "arrow function expression",
  ConditionalExpression: "conditional expression",
  CatchClause: "catch clause",
  ForOfStatement: "for-of statement",
  ForInStatement: "for-in statement",
  ForStatement: "for-loop",
  FormalParameters: "function parameter list",
  Identifier: "identifier",
  ImportSpecifier: "import specifier",
  ImportDefaultSpecifier: "import default specifier",
  ImportNamespaceSpecifier: "import namespace specifier",
  ObjectPattern: "object destructuring pattern",
  ParenthesizedExpression: "parenthesized expression",
  RestElement: "rest element",
  UpdateExpression: {
    true: "prefix operation",
    false: "postfix operation"
  },
  VariableDeclarator: "variable declaration",
  YieldExpression: "yield expression"
};
const toNodeDescription = ({
  type,
  prefix
}) => type === "UpdateExpression" ? NodeDescriptions.UpdateExpression[String(prefix)] : NodeDescriptions[type];
var StandardErrors = {
  AccessorIsGenerator: ({
    kind
  }) => `A ${kind}ter cannot be a generator.`,
  ArgumentsInClass: "'arguments' is only allowed in functions and class methods.",
  AsyncFunctionInSingleStatementContext: "Async functions can only be declared at the top level or inside a block.",
  AwaitBindingIdentifier: "Can not use 'await' as identifier inside an async function.",
  AwaitBindingIdentifierInStaticBlock: "Can not use 'await' as identifier inside a static block.",
  AwaitExpressionFormalParameter: "'await' is not allowed in async function parameters.",
  AwaitUsingNotInAsyncContext: "'await using' is only allowed within async functions and at the top levels of modules.",
  AwaitNotInAsyncContext: "'await' is only allowed within async functions and at the top levels of modules.",
  AwaitNotInAsyncFunction: "'await' is only allowed within async functions.",
  BadGetterArity: "A 'get' accessor must not have any formal parameters.",
  BadSetterArity: "A 'set' accessor must have exactly one formal parameter.",
  BadSetterRestParameter: "A 'set' accessor function argument must not be a rest parameter.",
  ConstructorClassField: "Classes may not have a field named 'constructor'.",
  ConstructorClassPrivateField: "Classes may not have a private field named '#constructor'.",
  ConstructorIsAccessor: "Class constructor may not be an accessor.",
  ConstructorIsAsync: "Constructor can't be an async function.",
  ConstructorIsGenerator: "Constructor can't be a generator.",
  DeclarationMissingInitializer: ({
    kind
  }) => `Missing initializer in ${kind} declaration.`,
  DecoratorArgumentsOutsideParentheses: "Decorator arguments must be moved inside parentheses: use '@(decorator(args))' instead of '@(decorator)(args)'.",
  DecoratorBeforeExport: "Decorators must be placed *before* the 'export' keyword. Remove the 'decoratorsBeforeExport: true' option to use the 'export @decorator class {}' syntax.",
  DecoratorsBeforeAfterExport: "Decorators can be placed *either* before or after the 'export' keyword, but not in both locations at the same time.",
  DecoratorConstructor: "Decorators can't be used with a constructor. Did you mean '@dec class { ... }'?",
  DecoratorExportClass: "Decorators must be placed *after* the 'export' keyword. Remove the 'decoratorsBeforeExport: false' option to use the '@decorator export class {}' syntax.",
  DecoratorSemicolon: "Decorators must not be followed by a semicolon.",
  DecoratorStaticBlock: "Decorators can't be used with a static block.",
  DeferImportRequiresNamespace: 'Only `import defer * as x from "./module"` is valid.',
  DeletePrivateField: "Deleting a private field is not allowed.",
  DestructureNamedImport: "ES2015 named imports do not destructure. Use another statement for destructuring after the import.",
  DuplicateConstructor: "Duplicate constructor in the same class.",
  DuplicateDefaultExport: "Only one default export allowed per module.",
  DuplicateExport: ({
    exportName
  }) => `\`${exportName}\` has already been exported. Exported identifiers must be unique.`,
  DuplicateProto: "Redefinition of __proto__ property.",
  DuplicateRegExpFlags: "Duplicate regular expression flag.",
  DynamicImportPhaseRequiresImportExpressions: ({
    phase
  }) => `'import.${phase}(...)' can only be parsed when using the 'createImportExpressions' option.`,
  ElementAfterRest: "Rest element must be last element.",
  EscapedCharNotAnIdentifier: "Invalid Unicode escape.",
  ExportBindingIsString: ({
    localName,
    exportName
  }) => `A string literal cannot be used as an exported binding without \`from\`.\n- Did you mean \`export { '${localName}' as '${exportName}' } from 'some-module'\`?`,
  ExportDefaultFromAsIdentifier: "'from' is not allowed as an identifier after 'export default'.",
  ForInOfLoopInitializer: ({
    type
  }) => `'${type === "ForInStatement" ? "for-in" : "for-of"}' loop variable declaration may not have an initializer.`,
  ForInUsing: "For-in loop may not start with 'using' declaration.",
  ForOfAsync: "The left-hand side of a for-of loop may not be 'async'.",
  ForOfLet: "The left-hand side of a for-of loop may not start with 'let'.",
  GeneratorInSingleStatementContext: "Generators can only be declared at the top level or inside a block.",
  IllegalBreakContinue: ({
    type
  }) => `Unsyntactic ${type === "BreakStatement" ? "break" : "continue"}.`,
  IllegalLanguageModeDirective: "Illegal 'use strict' directive in function with non-simple parameter list.",
  IllegalReturn: "'return' outside of function.",
  ImportAttributesUseAssert: "The `assert` keyword in import attributes is deprecated and it has been replaced by the `with` keyword. You can enable the `deprecatedAssertSyntax: true` option in the import attributes plugin to suppress this error.",
  ImportBindingIsString: ({
    importName
  }) => `A string literal cannot be used as an imported binding.\n- Did you mean \`import { "${importName}" as foo }\`?`,
  ImportCallArgumentTrailingComma: "Trailing comma is disallowed inside import(...) arguments.",
  ImportCallArity: ({
    maxArgumentCount
  }) => `\`import()\` requires exactly ${maxArgumentCount === 1 ? "one argument" : "one or two arguments"}.`,
  ImportCallNotNewExpression: "Cannot use new with import(...).",
  ImportCallSpreadArgument: "`...` is not allowed in `import()`.",
  ImportJSONBindingNotDefault: "A JSON module can only be imported with `default`.",
  ImportReflectionHasAssertion: "`import module x` cannot have assertions.",
  ImportReflectionNotBinding: 'Only `import module x from "./module"` is valid.',
  IncompatibleRegExpUVFlags: "The 'u' and 'v' regular expression flags cannot be enabled at the same time.",
  InvalidBigIntLiteral: "Invalid BigIntLiteral.",
  InvalidCodePoint: "Code point out of bounds.",
  InvalidCoverInitializedName: "Invalid shorthand property initializer.",
  InvalidDecimal: "Invalid decimal.",
  InvalidDigit: ({
    radix
  }) => `Expected number in radix ${radix}.`,
  InvalidEscapeSequence: "Bad character escape sequence.",
  InvalidEscapeSequenceTemplate: "Invalid escape sequence in template.",
  InvalidEscapedReservedWord: ({
    reservedWord
  }) => `Escape sequence in keyword ${reservedWord}.`,
  InvalidIdentifier: ({
    identifierName
  }) => `Invalid identifier ${identifierName}.`,
  InvalidLhs: ({
    ancestor
  }) => `Invalid left-hand side in ${toNodeDescription(ancestor)}.`,
  InvalidLhsBinding: ({
    ancestor
  }) => `Binding invalid left-hand side in ${toNodeDescription(ancestor)}.`,
  InvalidLhsOptionalChaining: ({
    ancestor
  }) => `Invalid optional chaining in the left-hand side of ${toNodeDescription(ancestor)}.`,
  InvalidNumber: "Invalid number.",
  InvalidOrMissingExponent: "Floating-point numbers require a valid exponent after the 'e'.",
  InvalidOrUnexpectedToken: ({
    unexpected
  }) => `Unexpected character '${unexpected}'.`,
  InvalidParenthesizedAssignment: "Invalid parenthesized assignment pattern.",
  InvalidPrivateFieldResolution: ({
    identifierName
  }) => `Private name #${identifierName} is not defined.`,
  InvalidPropertyBindingPattern: "Binding member expression.",
  InvalidRecordProperty: "Only properties and spread elements are allowed in record definitions.",
  InvalidRestAssignmentPattern: "Invalid rest operator's argument.",
  LabelRedeclaration: ({
    labelName
  }) => `Label '${labelName}' is already declared.`,
  LetInLexicalBinding: "'let' is disallowed as a lexically bound name.",
  LineTerminatorBeforeArrow: "No line break is allowed before '=>'.",
  MalformedRegExpFlags: "Invalid regular expression flag.",
  MissingClassName: "A class name is required.",
  MissingEqInAssignment: "Only '=' operator can be used for specifying default value.",
  MissingSemicolon: "Missing semicolon.",
  MissingPlugin: ({
    missingPlugin
  }) => `This experimental syntax requires enabling the parser plugin: ${missingPlugin.map(name => JSON.stringify(name)).join(", ")}.`,
  MissingOneOfPlugins: ({
    missingPlugin
  }) => `This experimental syntax requires enabling one of the following parser plugin(s): ${missingPlugin.map(name => JSON.stringify(name)).join(", ")}.`,
  MissingUnicodeEscape: "Expecting Unicode escape sequence \\uXXXX.",
  MixingCoalesceWithLogical: "Nullish coalescing operator(??) requires parens when mixing with logical operators.",
  ModuleAttributeDifferentFromType: "The only accepted module attribute is `type`.",
  ModuleAttributeInvalidValue: "Only string literals are allowed as module attribute values.",
  ModuleAttributesWithDuplicateKeys: ({
    key
  }) => `Duplicate key "${key}" is not allowed in module attributes.`,
  ModuleExportNameHasLoneSurrogate: ({
    surrogateCharCode
  }) => `An export name cannot include a lone surrogate, found '\\u${surrogateCharCode.toString(16)}'.`,
  ModuleExportUndefined: ({
    localName
  }) => `Export '${localName}' is not defined.`,
  MultipleDefaultsInSwitch: "Multiple default clauses.",
  NewlineAfterThrow: "Illegal newline after throw.",
  NoCatchOrFinally: "Missing catch or finally clause.",
  NumberIdentifier: "Identifier directly after number.",
  NumericSeparatorInEscapeSequence: "Numeric separators are not allowed inside unicode escape sequences or hex escape sequences.",
  ObsoleteAwaitStar: "'await*' has been removed from the async functions proposal. Use Promise.all() instead.",
  OptionalChainingNoNew: "Constructors in/after an Optional Chain are not allowed.",
  OptionalChainingNoTemplate: "Tagged Template Literals are not allowed in optionalChain.",
  OverrideOnConstructor: "'override' modifier cannot appear on a constructor declaration.",
  ParamDupe: "Argument name clash.",
  PatternHasAccessor: "Object pattern can't contain getter or setter.",
  PatternHasMethod: "Object pattern can't contain methods.",
  PrivateInExpectedIn: ({
    identifierName
  }) => `Private names are only allowed in property accesses (\`obj.#${identifierName}\`) or in \`in\` expressions (\`#${identifierName} in obj\`).`,
  PrivateNameRedeclaration: ({
    identifierName
  }) => `Duplicate private name #${identifierName}.`,
  RecordExpressionBarIncorrectEndSyntaxType: "Record expressions ending with '|}' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'bar'.",
  RecordExpressionBarIncorrectStartSyntaxType: "Record expressions starting with '{|' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'bar'.",
  RecordExpressionHashIncorrectStartSyntaxType: "Record expressions starting with '#{' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'hash'.",
  RecordNoProto: "'__proto__' is not allowed in Record expressions.",
  RestTrailingComma: "Unexpected trailing comma after rest element.",
  SloppyFunction: "In non-strict mode code, functions can only be declared at top level or inside a block.",
  SloppyFunctionAnnexB: "In non-strict mode code, functions can only be declared at top level, inside a block, or as the body of an if statement.",
  SourcePhaseImportRequiresDefault: 'Only `import source x from "./module"` is valid.',
  StaticPrototype: "Classes may not have static property named prototype.",
  SuperNotAllowed: "`super()` is only valid inside a class constructor of a subclass. Maybe a typo in the method name ('constructor') or not extending another class?",
  SuperPrivateField: "Private fields can't be accessed on super.",
  TrailingDecorator: "Decorators must be attached to a class element.",
  TupleExpressionBarIncorrectEndSyntaxType: "Tuple expressions ending with '|]' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'bar'.",
  TupleExpressionBarIncorrectStartSyntaxType: "Tuple expressions starting with '[|' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'bar'.",
  TupleExpressionHashIncorrectStartSyntaxType: "Tuple expressions starting with '#[' are only allowed when the 'syntaxType' option of the 'recordAndTuple' plugin is set to 'hash'.",
  UnexpectedArgumentPlaceholder: "Unexpected argument placeholder.",
  UnexpectedAwaitAfterPipelineBody: 'Unexpected "await" after pipeline body; await must have parentheses in minimal proposal.',
  UnexpectedDigitAfterHash: "Unexpected digit after hash token.",
  UnexpectedImportExport: "'import' and 'export' may only appear at the top level.",
  UnexpectedKeyword: ({
    keyword
  }) => `Unexpected keyword '${keyword}'.`,
  UnexpectedLeadingDecorator: "Leading decorators must be attached to a class declaration.",
  UnexpectedLexicalDeclaration: "Lexical declaration cannot appear in a single-statement context.",
  UnexpectedNewTarget: "`new.target` can only be used in functions or class properties.",
  UnexpectedNumericSeparator: "A numeric separator is only allowed between two digits.",
  UnexpectedPrivateField: "Unexpected private name.",
  UnexpectedReservedWord: ({
    reservedWord
  }) => `Unexpected reserved word '${reservedWord}'.`,
  UnexpectedSuper: "'super' is only allowed in object methods and classes.",
  UnexpectedToken: ({
    expected,
    unexpected
  }) => `Unexpected token${unexpected ? ` '${unexpected}'.` : ""}${expected ? `, expected "${expected}"` : ""}`,
  UnexpectedTokenUnaryExponentiation: "Illegal expression. Wrap left hand side or entire exponentiation in parentheses.",
  UnexpectedUsingDeclaration: "Using declaration cannot appear in the top level when source type is `script`.",
  UnsupportedBind: "Binding should be performed on object property.",
  UnsupportedDecoratorExport: "A decorated export must export a class declaration.",
  UnsupportedDefaultExport: "Only expressions, functions or classes are allowed as the `default` export.",
  UnsupportedImport: "`import` can only be used in `import()` or `import.meta`.",
  UnsupportedMetaProperty: ({
    target,
    onlyValidPropertyName
  }) => `The only valid meta property for ${target} is ${target}.${onlyValidPropertyName}.`,
  UnsupportedParameterDecorator: "Decorators cannot be used to decorate parameters.",
  UnsupportedPropertyDecorator: "Decorators cannot be used to decorate object literal properties.",
  UnsupportedSuper: "'super' can only be used with function calls (i.e. super()) or in property accesses (i.e. super.prop or super[prop]).",
  UnterminatedComment: "Unterminated comment.",
  UnterminatedRegExp: "Unterminated regular expression.",
  UnterminatedString: "Unterminated string constant.",
  UnterminatedTemplate: "Unterminated template.",
  UsingDeclarationHasBindingPattern: "Using declaration cannot have destructuring patterns.",
  VarRedeclaration: ({
    identifierName
  }) => `Identifier '${identifierName}' has already been declared.`,
  YieldBindingIdentifier: "Can not use 'yield' as identifier inside a generator.",
  YieldInParameter: "Yield expression is not allowed in formal parameters.",
  ZeroDigitNumericSeparator: "Numeric separator can not be used after leading 0."
};
var StrictModeErrors = {
  StrictDelete: "Deleting local variable in strict mode.",
  StrictEvalArguments: ({
    referenceName
  }) => `Assigning to '${referenceName}' in strict mode.`,
  StrictEvalArgumentsBinding: ({
    bindingName
  }) => `Binding '${bindingName}' in strict mode.`,
  StrictFunction: "In strict mode code, functions can only be declared at top level or inside a block.",
  StrictNumericEscape: "The only valid numeric escape in strict mode is '\\0'.",
  StrictOctalLiteral: "Legacy octal literals are not allowed in strict mode.",
  StrictWith: "'with' in strict mode."
};
const UnparenthesizedPipeBodyDescriptions = new Set(["ArrowFunctionExpression", "AssignmentExpression", "ConditionalExpression", "YieldExpression"]);
var PipelineOperatorErrors = {
  PipeBodyIsTighter: "Unexpected yield after pipeline body; any yield expression acting as Hack-style pipe body must be parenthesized due to its loose operator precedence.",
  PipeTopicRequiresHackPipes: 'Topic reference is used, but the pipelineOperator plugin was not passed a "proposal": "hack" or "smart" option.',
  PipeTopicUnbound: "Topic reference is unbound; it must be inside a pipe body.",
  PipeTopicUnconfiguredToken: ({
    token
  }) => `Invalid topic token ${token}. In order to use ${token} as a topic reference, the pipelineOperator plugin must be configured with { "proposal": "hack", "topicToken": "${token}" }.`,
  PipeTopicUnused: "Hack-style pipe body does not contain a topic reference; Hack-style pipes must use topic at least once.",
  PipeUnparenthesizedBody: ({
    type
  }) => `Hack-style pipe body cannot be an unparenthesized ${toNodeDescription({
    type
  })}; please wrap it in parentheses.`,
  PipelineBodyNoArrow: 'Unexpected arrow "=>" after pipeline body; arrow function in pipeline body must be parenthesized.',
  PipelineBodySequenceExpression: "Pipeline body may not be a comma-separated sequence expression.",
  PipelineHeadSequenceExpression: "Pipeline head should not be a comma-separated sequence expression.",
  PipelineTopicUnused: "Pipeline is in topic style but does not use topic reference.",
  PrimaryTopicNotAllowed: "Topic reference was used in a lexical context without topic binding.",
  PrimaryTopicRequiresSmartPipeline: 'Topic reference is used, but the pipelineOperator plugin was not passed a "proposal": "hack" or "smart" option.'
};
const _excluded = ["toMessage"],
  _excluded2 = ["message"];
function defineHidden(obj, key, value) {
  Object.defineProperty(obj, key, {
    enumerable: false,
    configurable: true,
    value
  });
}
function toParseErrorConstructor(_ref) {
  let {
      toMessage
    } = _ref,
    properties = _objectWithoutPropertiesLoose(_ref, _excluded);
  return function constructor(loc, details) {
    const error = new SyntaxError();
    Object.assign(error, properties, {
      loc,
      pos: loc.index
    });
    if ("missingPlugin" in details) {
      Object.assign(error, {
        missingPlugin: details.missingPlugin
      });
    }
    defineHidden(error, "clone", function clone(overrides = {}) {
      var _overrides$loc;
      const {
        line,
        column,
        index
      } = (_overrides$loc = overrides.loc) != null ? _overrides$loc : loc;
      return constructor(new Position(line, column, index), Object.assign({}, details, overrides.details));
    });
    defineHidden(error, "details", details);
    Object.defineProperty(error, "message", {
      configurable: true,
      get() {
        const message = `${toMessage(details)} (${loc.line}:${loc.column})`;
        this.message = message;
        return message;
      },
      set(value) {
        Object.defineProperty(this, "message", {
          value,
          writable: true
        });
      }
    });
    return error;
  };
}
function ParseErrorEnum(argument, syntaxPlugin) {
  if (Array.isArray(argument)) {
    return parseErrorTemplates => ParseErrorEnum(parseErrorTemplates, argument[0]);
  }
  const ParseErrorConstructors = {};
  for (const reasonCode of Object.keys(argument)) {
    const template = argument[reasonCode];
    const _ref2 = typeof template === "string" ? {
        message: () => template
      } : typeof template === "function" ? {
        message: template
      } : template,
      {
        message
      } = _ref2,
      rest = _objectWithoutPropertiesLoose(_ref2, _excluded2);
    const toMessage = typeof message === "string" ? () => message : message;
    ParseErrorConstructors[reasonCode] = toParseErrorConstructor(Object.assign({
      code: "BABEL_PARSER_SYNTAX_ERROR",
      reasonCode,
      toMessage
    }, syntaxPlugin ? {
      syntaxPlugin
    } : {}, rest));
  }
  return ParseErrorConstructors;
}
const Errors = Object.assign({}, ParseErrorEnum(ModuleErrors), ParseErrorEnum(StandardErrors), ParseErrorEnum(StrictModeErrors), ParseErrorEnum`pipelineOperator`(PipelineOperatorErrors));
const {
  defineProperty
} = Object;
const toUnenumerable = (object, key) => defineProperty(object, key, {
  enumerable: false,
  value: object[key]
});
function toESTreeLocation(node) {
  node.loc.start && toUnenumerable(node.loc.start, "index");
  node.loc.end && toUnenumerable(node.loc.end, "index");
  return node;
}
var estree = superClass => class ESTreeParserMixin extends superClass {
  parse() {
    const file = toESTreeLocation(super.parse());
    if (this.options.tokens) {
      file.tokens = file.tokens.map(toESTreeLocation);
    }
    return file;
  }
  parseRegExpLiteral({
    pattern,
    flags
  }) {
    let regex = null;
    try {
      regex = new RegExp(pattern, flags);
    } catch (e) {}
    const node = this.estreeParseLiteral(regex);
    node.regex = {
      pattern,
      flags
    };
    return node;
  }
  parseBigIntLiteral(value) {
    let bigInt;
    try {
      bigInt = BigInt(value);
    } catch (_unused) {
      bigInt = null;
    }
    const node = this.estreeParseLiteral(bigInt);
    node.bigint = String(node.value || value);
    return node;
  }
  parseDecimalLiteral(value) {
    const decimal = null;
    const node = this.estreeParseLiteral(decimal);
    node.decimal = String(node.value || value);
    return node;
  }
  estreeParseLiteral(value) {
    return this.parseLiteral(value, "Literal");
  }
  parseStringLiteral(value) {
    return this.estreeParseLiteral(value);
  }
  parseNumericLiteral(value) {
    return this.estreeParseLiteral(value);
  }
  parseNullLiteral() {
    return this.estreeParseLiteral(null);
  }
  parseBooleanLiteral(value) {
    return this.estreeParseLiteral(value);
  }
  directiveToStmt(directive) {
    const expression = directive.value;
    delete directive.value;
    expression.type = "Literal";
    expression.raw = expression.extra.raw;
    expression.value = expression.extra.expressionValue;
    const stmt = directive;
    stmt.type = "ExpressionStatement";
    stmt.expression = expression;
    stmt.directive = expression.extra.rawValue;
    delete expression.extra;
    return stmt;
  }
  initFunction(node, isAsync) {
    super.initFunction(node, isAsync);
    node.expression = false;
  }
  checkDeclaration(node) {
    if (node != null && this.isObjectProperty(node)) {
      this.checkDeclaration(node.value);
    } else {
      super.checkDeclaration(node);
    }
  }
  getObjectOrClassMethodParams(method) {
    return method.value.params;
  }
  isValidDirective(stmt) {
    var _stmt$expression$extr;
    return stmt.type === "ExpressionStatement" && stmt.expression.type === "Literal" && typeof stmt.expression.value === "string" && !((_stmt$expression$extr = stmt.expression.extra) != null && _stmt$expression$extr.parenthesized);
  }
  parseBlockBody(node, allowDirectives, topLevel, end, afterBlockParse) {
    super.parseBlockBody(node, allowDirectives, topLevel, end, afterBlockParse);
    const directiveStatements = node.directives.map(d => this.directiveToStmt(d));
    node.body = directiveStatements.concat(node.body);
    delete node.directives;
  }
  pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper) {
    this.parseMethod(method, isGenerator, isAsync, isConstructor, allowsDirectSuper, "ClassMethod", true);
    if (method.typeParameters) {
      method.value.typeParameters = method.typeParameters;
      delete method.typeParameters;
    }
    classBody.body.push(method);
  }
  parsePrivateName() {
    const node = super.parsePrivateName();
    {
      if (!this.getPluginOption("estree", "classFeatures")) {
        return node;
      }
    }
    return this.convertPrivateNameToPrivateIdentifier(node);
  }
  convertPrivateNameToPrivateIdentifier(node) {
    const name = super.getPrivateNameSV(node);
    node = node;
    delete node.id;
    node.name = name;
    node.type = "PrivateIdentifier";
    return node;
  }
  isPrivateName(node) {
    {
      if (!this.getPluginOption("estree", "classFeatures")) {
        return super.isPrivateName(node);
      }
    }
    return node.type === "PrivateIdentifier";
  }
  getPrivateNameSV(node) {
    {
      if (!this.getPluginOption("estree", "classFeatures")) {
        return super.getPrivateNameSV(node);
      }
    }
    return node.name;
  }
  parseLiteral(value, type) {
    const node = super.parseLiteral(value, type);
    node.raw = node.extra.raw;
    delete node.extra;
    return node;
  }
  parseFunctionBody(node, allowExpression, isMethod = false) {
    super.parseFunctionBody(node, allowExpression, isMethod);
    node.expression = node.body.type !== "BlockStatement";
  }
  parseMethod(node, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope = false) {
    let funcNode = this.startNode();
    funcNode.kind = node.kind;
    funcNode = super.parseMethod(funcNode, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope);
    funcNode.type = "FunctionExpression";
    delete funcNode.kind;
    node.value = funcNode;
    if (type === "ClassPrivateMethod") {
      node.computed = false;
    }
    return this.finishNode(node, "MethodDefinition");
  }
  parseClassProperty(...args) {
    const propertyNode = super.parseClassProperty(...args);
    {
      if (!this.getPluginOption("estree", "classFeatures")) {
        return propertyNode;
      }
    }
    propertyNode.type = "PropertyDefinition";
    return propertyNode;
  }
  parseClassPrivateProperty(...args) {
    const propertyNode = super.parseClassPrivateProperty(...args);
    {
      if (!this.getPluginOption("estree", "classFeatures")) {
        return propertyNode;
      }
    }
    propertyNode.type = "PropertyDefinition";
    propertyNode.computed = false;
    return propertyNode;
  }
  parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor) {
    const node = super.parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor);
    if (node) {
      node.type = "Property";
      if (node.kind === "method") {
        node.kind = "init";
      }
      node.shorthand = false;
    }
    return node;
  }
  parseObjectProperty(prop, startLoc, isPattern, refExpressionErrors) {
    const node = super.parseObjectProperty(prop, startLoc, isPattern, refExpressionErrors);
    if (node) {
      node.kind = "init";
      node.type = "Property";
    }
    return node;
  }
  isValidLVal(type, isUnparenthesizedInAssign, binding) {
    return type === "Property" ? "value" : super.isValidLVal(type, isUnparenthesizedInAssign, binding);
  }
  isAssignable(node, isBinding) {
    if (node != null && this.isObjectProperty(node)) {
      return this.isAssignable(node.value, isBinding);
    }
    return super.isAssignable(node, isBinding);
  }
  toAssignable(node, isLHS = false) {
    if (node != null && this.isObjectProperty(node)) {
      const {
        key,
        value
      } = node;
      if (this.isPrivateName(key)) {
        this.classScope.usePrivateName(this.getPrivateNameSV(key), key.loc.start);
      }
      this.toAssignable(value, isLHS);
    } else {
      super.toAssignable(node, isLHS);
    }
  }
  toAssignableObjectExpressionProp(prop, isLast, isLHS) {
    if (prop.kind === "get" || prop.kind === "set") {
      this.raise(Errors.PatternHasAccessor, prop.key);
    } else if (prop.method) {
      this.raise(Errors.PatternHasMethod, prop.key);
    } else {
      super.toAssignableObjectExpressionProp(prop, isLast, isLHS);
    }
  }
  finishCallExpression(unfinished, optional) {
    const node = super.finishCallExpression(unfinished, optional);
    if (node.callee.type === "Import") {
      node.type = "ImportExpression";
      node.source = node.arguments[0];
      if (this.hasPlugin("importAttributes") || this.hasPlugin("importAssertions")) {
        var _node$arguments$, _node$arguments$2;
        node.options = (_node$arguments$ = node.arguments[1]) != null ? _node$arguments$ : null;
        node.attributes = (_node$arguments$2 = node.arguments[1]) != null ? _node$arguments$2 : null;
      }
      delete node.arguments;
      delete node.callee;
    }
    return node;
  }
  toReferencedArguments(node) {
    if (node.type === "ImportExpression") {
      return;
    }
    super.toReferencedArguments(node);
  }
  parseExport(unfinished, decorators) {
    const exportStartLoc = this.state.lastTokStartLoc;
    const node = super.parseExport(unfinished, decorators);
    switch (node.type) {
      case "ExportAllDeclaration":
        node.exported = null;
        break;
      case "ExportNamedDeclaration":
        if (node.specifiers.length === 1 && node.specifiers[0].type === "ExportNamespaceSpecifier") {
          node.type = "ExportAllDeclaration";
          node.exported = node.specifiers[0].exported;
          delete node.specifiers;
        }
      case "ExportDefaultDeclaration":
        {
          var _declaration$decorato;
          const {
            declaration
          } = node;
          if ((declaration == null ? void 0 : declaration.type) === "ClassDeclaration" && ((_declaration$decorato = declaration.decorators) == null ? void 0 : _declaration$decorato.length) > 0 && declaration.start === node.start) {
            this.resetStartLocation(node, exportStartLoc);
          }
        }
        break;
    }
    return node;
  }
  parseSubscript(base, startLoc, noCalls, state) {
    const node = super.parseSubscript(base, startLoc, noCalls, state);
    if (state.optionalChainMember) {
      if (node.type === "OptionalMemberExpression" || node.type === "OptionalCallExpression") {
        node.type = node.type.substring(8);
      }
      if (state.stop) {
        const chain = this.startNodeAtNode(node);
        chain.expression = node;
        return this.finishNode(chain, "ChainExpression");
      }
    } else if (node.type === "MemberExpression" || node.type === "CallExpression") {
      node.optional = false;
    }
    return node;
  }
  isOptionalMemberExpression(node) {
    if (node.type === "ChainExpression") {
      return node.expression.type === "MemberExpression";
    }
    return super.isOptionalMemberExpression(node);
  }
  hasPropertyAsPrivateName(node) {
    if (node.type === "ChainExpression") {
      node = node.expression;
    }
    return super.hasPropertyAsPrivateName(node);
  }
  isObjectProperty(node) {
    return node.type === "Property" && node.kind === "init" && !node.method;
  }
  isObjectMethod(node) {
    return node.method || node.kind === "get" || node.kind === "set";
  }
  finishNodeAt(node, type, endLoc) {
    return toESTreeLocation(super.finishNodeAt(node, type, endLoc));
  }
  resetStartLocation(node, startLoc) {
    super.resetStartLocation(node, startLoc);
    toESTreeLocation(node);
  }
  resetEndLocation(node, endLoc = this.state.lastTokEndLoc) {
    super.resetEndLocation(node, endLoc);
    toESTreeLocation(node);
  }
};
class TokContext {
  constructor(token, preserveSpace) {
    this.token = void 0;
    this.preserveSpace = void 0;
    this.token = token;
    this.preserveSpace = !!preserveSpace;
  }
}
const types = {
  brace: new TokContext("{"),
  j_oTag: new TokContext("<tag"),
  j_cTag: new TokContext("</tag"),
  j_expr: new TokContext("<tag>...</tag>", true)
};
{
  types.template = new TokContext("`", true);
}
const beforeExpr = true;
const startsExpr = true;
const isLoop = true;
const isAssign = true;
const prefix = true;
const postfix = true;
class ExportedTokenType {
  constructor(label, conf = {}) {
    this.label = void 0;
    this.keyword = void 0;
    this.beforeExpr = void 0;
    this.startsExpr = void 0;
    this.rightAssociative = void 0;
    this.isLoop = void 0;
    this.isAssign = void 0;
    this.prefix = void 0;
    this.postfix = void 0;
    this.binop = void 0;
    this.label = label;
    this.keyword = conf.keyword;
    this.beforeExpr = !!conf.beforeExpr;
    this.startsExpr = !!conf.startsExpr;
    this.rightAssociative = !!conf.rightAssociative;
    this.isLoop = !!conf.isLoop;
    this.isAssign = !!conf.isAssign;
    this.prefix = !!conf.prefix;
    this.postfix = !!conf.postfix;
    this.binop = conf.binop != null ? conf.binop : null;
    {
      this.updateContext = null;
    }
  }
}
const keywords$1 = new Map();
function createKeyword(name, options = {}) {
  options.keyword = name;
  const token = createToken(name, options);
  keywords$1.set(name, token);
  return token;
}
function createBinop(name, binop) {
  return createToken(name, {
    beforeExpr,
    binop
  });
}
let tokenTypeCounter = -1;
const tokenTypes = [];
const tokenLabels = [];
const tokenBinops = [];
const tokenBeforeExprs = [];
const tokenStartsExprs = [];
const tokenPrefixes = [];
function createToken(name, options = {}) {
  var _options$binop, _options$beforeExpr, _options$startsExpr, _options$prefix;
  ++tokenTypeCounter;
  tokenLabels.push(name);
  tokenBinops.push((_options$binop = options.binop) != null ? _options$binop : -1);
  tokenBeforeExprs.push((_options$beforeExpr = options.beforeExpr) != null ? _options$beforeExpr : false);
  tokenStartsExprs.push((_options$startsExpr = options.startsExpr) != null ? _options$startsExpr : false);
  tokenPrefixes.push((_options$prefix = options.prefix) != null ? _options$prefix : false);
  tokenTypes.push(new ExportedTokenType(name, options));
  return tokenTypeCounter;
}
function createKeywordLike(name, options = {}) {
  var _options$binop2, _options$beforeExpr2, _options$startsExpr2, _options$prefix2;
  ++tokenTypeCounter;
  keywords$1.set(name, tokenTypeCounter);
  tokenLabels.push(name);
  tokenBinops.push((_options$binop2 = options.binop) != null ? _options$binop2 : -1);
  tokenBeforeExprs.push((_options$beforeExpr2 = options.beforeExpr) != null ? _options$beforeExpr2 : false);
  tokenStartsExprs.push((_options$startsExpr2 = options.startsExpr) != null ? _options$startsExpr2 : false);
  tokenPrefixes.push((_options$prefix2 = options.prefix) != null ? _options$prefix2 : false);
  tokenTypes.push(new ExportedTokenType("name", options));
  return tokenTypeCounter;
}
const tt = {
  bracketL: createToken("[", {
    beforeExpr,
    startsExpr
  }),
  bracketHashL: createToken("#[", {
    beforeExpr,
    startsExpr
  }),
  bracketBarL: createToken("[|", {
    beforeExpr,
    startsExpr
  }),
  bracketR: createToken("]"),
  bracketBarR: createToken("|]"),
  braceL: createToken("{", {
    beforeExpr,
    startsExpr
  }),
  braceBarL: createToken("{|", {
    beforeExpr,
    startsExpr
  }),
  braceHashL: createToken("#{", {
    beforeExpr,
    startsExpr
  }),
  braceR: createToken("}"),
  braceBarR: createToken("|}"),
  parenL: createToken("(", {
    beforeExpr,
    startsExpr
  }),
  parenR: createToken(")"),
  comma: createToken(",", {
    beforeExpr
  }),
  semi: createToken(";", {
    beforeExpr
  }),
  colon: createToken(":", {
    beforeExpr
  }),
  doubleColon: createToken("::", {
    beforeExpr
  }),
  dot: createToken("."),
  question: createToken("?", {
    beforeExpr
  }),
  questionDot: createToken("?."),
  arrow: createToken("=>", {
    beforeExpr
  }),
  template: createToken("template"),
  ellipsis: createToken("...", {
    beforeExpr
  }),
  backQuote: createToken("`", {
    startsExpr
  }),
  dollarBraceL: createToken("${", {
    beforeExpr,
    startsExpr
  }),
  templateTail: createToken("...`", {
    startsExpr
  }),
  templateNonTail: createToken("...${", {
    beforeExpr,
    startsExpr
  }),
  at: createToken("@"),
  hash: createToken("#", {
    startsExpr
  }),
  interpreterDirective: createToken("#!..."),
  eq: createToken("=", {
    beforeExpr,
    isAssign
  }),
  assign: createToken("_=", {
    beforeExpr,
    isAssign
  }),
  slashAssign: createToken("_=", {
    beforeExpr,
    isAssign
  }),
  xorAssign: createToken("_=", {
    beforeExpr,
    isAssign
  }),
  moduloAssign: createToken("_=", {
    beforeExpr,
    isAssign
  }),
  incDec: createToken("++/--", {
    prefix,
    postfix,
    startsExpr
  }),
  bang: createToken("!", {
    beforeExpr,
    prefix,
    startsExpr
  }),
  tilde: createToken("~", {
    beforeExpr,
    prefix,
    startsExpr
  }),
  doubleCaret: createToken("^^", {
    startsExpr
  }),
  doubleAt: createToken("@@", {
    startsExpr
  }),
  pipeline: createBinop("|>", 0),
  nullishCoalescing: createBinop("??", 1),
  logicalOR: createBinop("||", 1),
  logicalAND: createBinop("&&", 2),
  bitwiseOR: createBinop("|", 3),
  bitwiseXOR: createBinop("^", 4),
  bitwiseAND: createBinop("&", 5),
  equality: createBinop("==/!=/===/!==", 6),
  lt: createBinop("</>/<=/>=", 7),
  gt: createBinop("</>/<=/>=", 7),
  relational: createBinop("</>/<=/>=", 7),
  bitShift: createBinop("<</>>/>>>", 8),
  bitShiftL: createBinop("<</>>/>>>", 8),
  bitShiftR: createBinop("<</>>/>>>", 8),
  plusMin: createToken("+/-", {
    beforeExpr,
    binop: 9,
    prefix,
    startsExpr
  }),
  modulo: createToken("%", {
    binop: 10,
    startsExpr
  }),
  star: createToken("*", {
    binop: 10
  }),
  slash: createBinop("/", 10),
  exponent: createToken("**", {
    beforeExpr,
    binop: 11,
    rightAssociative: true
  }),
  _in: createKeyword("in", {
    beforeExpr,
    binop: 7
  }),
  _instanceof: createKeyword("instanceof", {
    beforeExpr,
    binop: 7
  }),
  _break: createKeyword("break"),
  _case: createKeyword("case", {
    beforeExpr
  }),
  _catch: createKeyword("catch"),
  _continue: createKeyword("continue"),
  _debugger: createKeyword("debugger"),
  _default: createKeyword("default", {
    beforeExpr
  }),
  _else: createKeyword("else", {
    beforeExpr
  }),
  _finally: createKeyword("finally"),
  _function: createKeyword("function", {
    startsExpr
  }),
  _if: createKeyword("if"),
  _return: createKeyword("return", {
    beforeExpr
  }),
  _switch: createKeyword("switch"),
  _throw: createKeyword("throw", {
    beforeExpr,
    prefix,
    startsExpr
  }),
  _try: createKeyword("try"),
  _var: createKeyword("var"),
  _const: createKeyword("const"),
  _with: createKeyword("with"),
  _new: createKeyword("new", {
    beforeExpr,
    startsExpr
  }),
  _this: createKeyword("this", {
    startsExpr
  }),
  _super: createKeyword("super", {
    startsExpr
  }),
  _class: createKeyword("class", {
    startsExpr
  }),
  _extends: createKeyword("extends", {
    beforeExpr
  }),
  _export: createKeyword("export"),
  _import: createKeyword("import", {
    startsExpr
  }),
  _null: createKeyword("null", {
    startsExpr
  }),
  _true: createKeyword("true", {
    startsExpr
  }),
  _false: createKeyword("false", {
    startsExpr
  }),
  _typeof: createKeyword("typeof", {
    beforeExpr,
    prefix,
    startsExpr
  }),
  _void: createKeyword("void", {
    beforeExpr,
    prefix,
    startsExpr
  }),
  _delete: createKeyword("delete", {
    beforeExpr,
    prefix,
    startsExpr
  }),
  _do: createKeyword("do", {
    isLoop,
    beforeExpr
  }),
  _for: createKeyword("for", {
    isLoop
  }),
  _while: createKeyword("while", {
    isLoop
  }),
  _as: createKeywordLike("as", {
    startsExpr
  }),
  _assert: createKeywordLike("assert", {
    startsExpr
  }),
  _async: createKeywordLike("async", {
    startsExpr
  }),
  _await: createKeywordLike("await", {
    startsExpr
  }),
  _defer: createKeywordLike("defer", {
    startsExpr
  }),
  _from: createKeywordLike("from", {
    startsExpr
  }),
  _get: createKeywordLike("get", {
    startsExpr
  }),
  _let: createKeywordLike("let", {
    startsExpr
  }),
  _meta: createKeywordLike("meta", {
    startsExpr
  }),
  _of: createKeywordLike("of", {
    startsExpr
  }),
  _sent: createKeywordLike("sent", {
    startsExpr
  }),
  _set: createKeywordLike("set", {
    startsExpr
  }),
  _source: createKeywordLike("source", {
    startsExpr
  }),
  _static: createKeywordLike("static", {
    startsExpr
  }),
  _using: createKeywordLike("using", {
    startsExpr
  }),
  _yield: createKeywordLike("yield", {
    startsExpr
  }),
  _asserts: createKeywordLike("asserts", {
    startsExpr
  }),
  _checks: createKeywordLike("checks", {
    startsExpr
  }),
  _exports: createKeywordLike("exports", {
    startsExpr
  }),
  _global: createKeywordLike("global", {
    startsExpr
  }),
  _implements: createKeywordLike("implements", {
    startsExpr
  }),
  _intrinsic: createKeywordLike("intrinsic", {
    startsExpr
  }),
  _infer: createKeywordLike("infer", {
    startsExpr
  }),
  _is: createKeywordLike("is", {
    startsExpr
  }),
  _mixins: createKeywordLike("mixins", {
    startsExpr
  }),
  _proto: createKeywordLike("proto", {
    startsExpr
  }),
  _require: createKeywordLike("require", {
    startsExpr
  }),
  _satisfies: createKeywordLike("satisfies", {
    startsExpr
  }),
  _keyof: createKeywordLike("keyof", {
    startsExpr
  }),
  _readonly: createKeywordLike("readonly", {
    startsExpr
  }),
  _unique: createKeywordLike("unique", {
    startsExpr
  }),
  _abstract: createKeywordLike("abstract", {
    startsExpr
  }),
  _declare: createKeywordLike("declare", {
    startsExpr
  }),
  _enum: createKeywordLike("enum", {
    startsExpr
  }),
  _module: createKeywordLike("module", {
    startsExpr
  }),
  _namespace: createKeywordLike("namespace", {
    startsExpr
  }),
  _interface: createKeywordLike("interface", {
    startsExpr
  }),
  _type: createKeywordLike("type", {
    startsExpr
  }),
  _opaque: createKeywordLike("opaque", {
    startsExpr
  }),
  name: createToken("name", {
    startsExpr
  }),
  string: createToken("string", {
    startsExpr
  }),
  num: createToken("num", {
    startsExpr
  }),
  bigint: createToken("bigint", {
    startsExpr
  }),
  decimal: createToken("decimal", {
    startsExpr
  }),
  regexp: createToken("regexp", {
    startsExpr
  }),
  privateName: createToken("#name", {
    startsExpr
  }),
  eof: createToken("eof"),
  jsxName: createToken("jsxName"),
  jsxText: createToken("jsxText", {
    beforeExpr: true
  }),
  jsxTagStart: createToken("jsxTagStart", {
    startsExpr: true
  }),
  jsxTagEnd: createToken("jsxTagEnd"),
  placeholder: createToken("%%", {
    startsExpr: true
  })
};
function tokenIsIdentifier(token) {
  return token >= 93 && token <= 132;
}
function tokenKeywordOrIdentifierIsKeyword(token) {
  return token <= 92;
}
function tokenIsKeywordOrIdentifier(token) {
  return token >= 58 && token <= 132;
}
function tokenIsLiteralPropertyName(token) {
  return token >= 58 && token <= 136;
}
function tokenComesBeforeExpression(token) {
  return tokenBeforeExprs[token];
}
function tokenCanStartExpression(token) {
  return tokenStartsExprs[token];
}
function tokenIsAssignment(token) {
  return token >= 29 && token <= 33;
}
function tokenIsFlowInterfaceOrTypeOrOpaque(token) {
  return token >= 129 && token <= 131;
}
function tokenIsLoop(token) {
  return token >= 90 && token <= 92;
}
function tokenIsKeyword(token) {
  return token >= 58 && token <= 92;
}
function tokenIsOperator(token) {
  return token >= 39 && token <= 59;
}
function tokenIsPostfix(token) {
  return token === 34;
}
function tokenIsPrefix(token) {
  return tokenPrefixes[token];
}
function tokenIsTSTypeOperator(token) {
  return token >= 121 && token <= 123;
}
function tokenIsTSDeclarationStart(token) {
  return token >= 124 && token <= 130;
}
function tokenLabelName(token) {
  return tokenLabels[token];
}
function tokenOperatorPrecedence(token) {
  return tokenBinops[token];
}
function tokenIsRightAssociative(token) {
  return token === 57;
}
function tokenIsTemplate(token) {
  return token >= 24 && token <= 25;
}
function getExportedToken(token) {
  return tokenTypes[token];
}
{
  tokenTypes[8].updateContext = context => {
    context.pop();
  };
  tokenTypes[5].updateContext = tokenTypes[7].updateContext = tokenTypes[23].updateContext = context => {
    context.push(types.brace);
  };
  tokenTypes[22].updateContext = context => {
    if (context[context.length - 1] === types.template) {
      context.pop();
    } else {
      context.push(types.template);
    }
  };
  tokenTypes[142].updateContext = context => {
    context.push(types.j_expr, types.j_oTag);
  };
}
let nonASCIIidentifierStartChars = "\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u052f\u0531-\u0556\u0559\u0560-\u0588\u05d0-\u05ea\u05ef-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u0860-\u086a\u0870-\u0887\u0889-\u088e\u08a0-\u08c9\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u09fc\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0af9\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d\u0c58-\u0c5a\u0c5d\u0c60\u0c61\u0c80\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cdd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d04-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d54-\u0d56\u0d5f-\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e86-\u0e8a\u0e8c-\u0ea3\u0ea5\u0ea7-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f5\u13f8-\u13fd\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f8\u1700-\u1711\u171f-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1878\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191e\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4c\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1c80-\u1c88\u1c90-\u1cba\u1cbd-\u1cbf\u1ce9-\u1cec\u1cee-\u1cf3\u1cf5\u1cf6\u1cfa\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2118-\u211d\u2124\u2126\u2128\u212a-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309b-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312f\u3131-\u318e\u31a0-\u31bf\u31f0-\u31ff\u3400-\u4dbf\u4e00-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua69d\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua7ca\ua7d0\ua7d1\ua7d3\ua7d5-\ua7d9\ua7f2-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua8fd\ua8fe\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\ua9e0-\ua9e4\ua9e6-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa7e-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab69\uab70-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc";
let nonASCIIidentifierChars = "\u200c\u200d\xb7\u0300-\u036f\u0387\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u0669\u0670\u06d6-\u06dc\u06df-\u06e4\u06e7\u06e8\u06ea-\u06ed\u06f0-\u06f9\u0711\u0730-\u074a\u07a6-\u07b0\u07c0-\u07c9\u07eb-\u07f3\u07fd\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0859-\u085b\u0898-\u089f\u08ca-\u08e1\u08e3-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09cb-\u09cd\u09d7\u09e2\u09e3\u09e6-\u09ef\u09fe\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2\u0ae3\u0ae6-\u0aef\u0afa-\u0aff\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b55-\u0b57\u0b62\u0b63\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c00-\u0c04\u0c3c\u0c3e-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0c66-\u0c6f\u0c81-\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0ce6-\u0cef\u0cf3\u0d00-\u0d03\u0d3b\u0d3c\u0d3e-\u0d44\u0d46-\u0d48\u0d4a-\u0d4d\u0d57\u0d62\u0d63\u0d66-\u0d6f\u0d81-\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0de6-\u0def\u0df2\u0df3\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0e50-\u0e59\u0eb1\u0eb4-\u0ebc\u0ec8-\u0ece\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f3e\u0f3f\u0f71-\u0f84\u0f86\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u102b-\u103e\u1040-\u1049\u1056-\u1059\u105e-\u1060\u1062-\u1064\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u1369-\u1371\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17b4-\u17d3\u17dd\u17e0-\u17e9\u180b-\u180d\u180f-\u1819\u18a9\u1920-\u192b\u1930-\u193b\u1946-\u194f\u19d0-\u19da\u1a17-\u1a1b\u1a55-\u1a5e\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1ab0-\u1abd\u1abf-\u1ace\u1b00-\u1b04\u1b34-\u1b44\u1b50-\u1b59\u1b6b-\u1b73\u1b80-\u1b82\u1ba1-\u1bad\u1bb0-\u1bb9\u1be6-\u1bf3\u1c24-\u1c37\u1c40-\u1c49\u1c50-\u1c59\u1cd0-\u1cd2\u1cd4-\u1ce8\u1ced\u1cf4\u1cf7-\u1cf9\u1dc0-\u1dff\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2cef-\u2cf1\u2d7f\u2de0-\u2dff\u302a-\u302f\u3099\u309a\u30fb\ua620-\ua629\ua66f\ua674-\ua67d\ua69e\ua69f\ua6f0\ua6f1\ua802\ua806\ua80b\ua823-\ua827\ua82c\ua880\ua881\ua8b4-\ua8c5\ua8d0-\ua8d9\ua8e0-\ua8f1\ua8ff-\ua909\ua926-\ua92d\ua947-\ua953\ua980-\ua983\ua9b3-\ua9c0\ua9d0-\ua9d9\ua9e5\ua9f0-\ua9f9\uaa29-\uaa36\uaa43\uaa4c\uaa4d\uaa50-\uaa59\uaa7b-\uaa7d\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uaaeb-\uaaef\uaaf5\uaaf6\uabe3-\uabea\uabec\uabed\uabf0-\uabf9\ufb1e\ufe00-\ufe0f\ufe20-\ufe2f\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f\uff65";
const nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
const nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;
const astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 13, 10, 2, 14, 2, 6, 2, 1, 2, 10, 2, 14, 2, 6, 2, 1, 68, 310, 10, 21, 11, 7, 25, 5, 2, 41, 2, 8, 70, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 43, 17, 47, 20, 28, 22, 13, 52, 58, 1, 3, 0, 14, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 20, 1, 64, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 38, 6, 186, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 19, 72, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 16, 0, 2, 12, 2, 33, 125, 0, 80, 921, 103, 110, 18, 195, 2637, 96, 16, 1071, 18, 5, 4026, 582, 8634, 568, 8, 30, 18, 78, 18, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8936, 3, 2, 6, 2, 1, 2, 290, 16, 0, 30, 2, 3, 0, 15, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 1845, 30, 7, 5, 262, 61, 147, 44, 11, 6, 17, 0, 322, 29, 19, 43, 485, 27, 757, 6, 2, 3, 2, 1, 2, 14, 2, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42719, 33, 4153, 7, 221, 3, 5761, 15, 7472, 16, 621, 2467, 541, 1507, 4938, 6, 4191];
const astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 81, 2, 71, 10, 50, 3, 123, 2, 54, 14, 32, 10, 3, 1, 11, 3, 46, 10, 8, 0, 46, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 3, 0, 158, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 10, 1, 2, 0, 49, 6, 4, 4, 14, 9, 5351, 0, 7, 14, 13835, 9, 87, 9, 39, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 4706, 45, 3, 22, 543, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 101, 0, 161, 6, 10, 9, 357, 0, 62, 13, 499, 13, 983, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];
function isInAstralSet(code, set) {
  let pos = 0x10000;
  for (let i = 0, length = set.length; i < length; i += 2) {
    pos += set[i];
    if (pos > code) return false;
    pos += set[i + 1];
    if (pos >= code) return true;
  }
  return false;
}
function isIdentifierStart(code) {
  if (code < 65) return code === 36;
  if (code <= 90) return true;
  if (code < 97) return code === 95;
  if (code <= 122) return true;
  if (code <= 0xffff) {
    return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
  }
  return isInAstralSet(code, astralIdentifierStartCodes);
}
function isIdentifierChar(code) {
  if (code < 48) return code === 36;
  if (code < 58) return true;
  if (code < 65) return false;
  if (code <= 90) return true;
  if (code < 97) return code === 95;
  if (code <= 122) return true;
  if (code <= 0xffff) {
    return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
  }
  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
}
const reservedWords = {
  keyword: ["break", "case", "catch", "continue", "debugger", "default", "do", "else", "finally", "for", "function", "if", "return", "switch", "throw", "try", "var", "const", "while", "with", "new", "this", "super", "class", "extends", "export", "import", "null", "true", "false", "in", "instanceof", "typeof", "void", "delete"],
  strict: ["implements", "interface", "let", "package", "private", "protected", "public", "static", "yield"],
  strictBind: ["eval", "arguments"]
};
const keywords = new Set(reservedWords.keyword);
const reservedWordsStrictSet = new Set(reservedWords.strict);
const reservedWordsStrictBindSet = new Set(reservedWords.strictBind);
function isReservedWord(word, inModule) {
  return inModule && word === "await" || word === "enum";
}
function isStrictReservedWord(word, inModule) {
  return isReservedWord(word, inModule) || reservedWordsStrictSet.has(word);
}
function isStrictBindOnlyReservedWord(word) {
  return reservedWordsStrictBindSet.has(word);
}
function isStrictBindReservedWord(word, inModule) {
  return isStrictReservedWord(word, inModule) || isStrictBindOnlyReservedWord(word);
}
function isKeyword(word) {
  return keywords.has(word);
}
function isIteratorStart(current, next, next2) {
  return current === 64 && next === 64 && isIdentifierStart(next2);
}
const reservedWordLikeSet = new Set(["break", "case", "catch", "continue", "debugger", "default", "do", "else", "finally", "for", "function", "if", "return", "switch", "throw", "try", "var", "const", "while", "with", "new", "this", "super", "class", "extends", "export", "import", "null", "true", "false", "in", "instanceof", "typeof", "void", "delete", "implements", "interface", "let", "package", "private", "protected", "public", "static", "yield", "eval", "arguments", "enum", "await"]);
function canBeReservedWord(word) {
  return reservedWordLikeSet.has(word);
}
class Scope {
  constructor(flags) {
    this.flags = 0;
    this.names = new Map();
    this.firstLexicalName = "";
    this.flags = flags;
  }
}
class ScopeHandler {
  constructor(parser, inModule) {
    this.parser = void 0;
    this.scopeStack = [];
    this.inModule = void 0;
    this.undefinedExports = new Map();
    this.parser = parser;
    this.inModule = inModule;
  }
  get inTopLevel() {
    return (this.currentScope().flags & 1) > 0;
  }
  get inFunction() {
    return (this.currentVarScopeFlags() & 2) > 0;
  }
  get allowSuper() {
    return (this.currentThisScopeFlags() & 16) > 0;
  }
  get allowDirectSuper() {
    return (this.currentThisScopeFlags() & 32) > 0;
  }
  get inClass() {
    return (this.currentThisScopeFlags() & 64) > 0;
  }
  get inClassAndNotInNonArrowFunction() {
    const flags = this.currentThisScopeFlags();
    return (flags & 64) > 0 && (flags & 2) === 0;
  }
  get inStaticBlock() {
    for (let i = this.scopeStack.length - 1;; i--) {
      const {
        flags
      } = this.scopeStack[i];
      if (flags & 128) {
        return true;
      }
      if (flags & (387 | 64)) {
        return false;
      }
    }
  }
  get inNonArrowFunction() {
    return (this.currentThisScopeFlags() & 2) > 0;
  }
  get treatFunctionsAsVar() {
    return this.treatFunctionsAsVarInScope(this.currentScope());
  }
  createScope(flags) {
    return new Scope(flags);
  }
  enter(flags) {
    this.scopeStack.push(this.createScope(flags));
  }
  exit() {
    const scope = this.scopeStack.pop();
    return scope.flags;
  }
  treatFunctionsAsVarInScope(scope) {
    return !!(scope.flags & (2 | 128) || !this.parser.inModule && scope.flags & 1);
  }
  declareName(name, bindingType, loc) {
    let scope = this.currentScope();
    if (bindingType & 8 || bindingType & 16) {
      this.checkRedeclarationInScope(scope, name, bindingType, loc);
      let type = scope.names.get(name) || 0;
      if (bindingType & 16) {
        type = type | 4;
      } else {
        if (!scope.firstLexicalName) {
          scope.firstLexicalName = name;
        }
        type = type | 2;
      }
      scope.names.set(name, type);
      if (bindingType & 8) {
        this.maybeExportDefined(scope, name);
      }
    } else if (bindingType & 4) {
      for (let i = this.scopeStack.length - 1; i >= 0; --i) {
        scope = this.scopeStack[i];
        this.checkRedeclarationInScope(scope, name, bindingType, loc);
        scope.names.set(name, (scope.names.get(name) || 0) | 1);
        this.maybeExportDefined(scope, name);
        if (scope.flags & 387) break;
      }
    }
    if (this.parser.inModule && scope.flags & 1) {
      this.undefinedExports.delete(name);
    }
  }
  maybeExportDefined(scope, name) {
    if (this.parser.inModule && scope.flags & 1) {
      this.undefinedExports.delete(name);
    }
  }
  checkRedeclarationInScope(scope, name, bindingType, loc) {
    if (this.isRedeclaredInScope(scope, name, bindingType)) {
      this.parser.raise(Errors.VarRedeclaration, loc, {
        identifierName: name
      });
    }
  }
  isRedeclaredInScope(scope, name, bindingType) {
    if (!(bindingType & 1)) return false;
    if (bindingType & 8) {
      return scope.names.has(name);
    }
    const type = scope.names.get(name);
    if (bindingType & 16) {
      return (type & 2) > 0 || !this.treatFunctionsAsVarInScope(scope) && (type & 1) > 0;
    }
    return (type & 2) > 0 && !(scope.flags & 8 && scope.firstLexicalName === name) || !this.treatFunctionsAsVarInScope(scope) && (type & 4) > 0;
  }
  checkLocalExport(id) {
    const {
      name
    } = id;
    const topLevelScope = this.scopeStack[0];
    if (!topLevelScope.names.has(name)) {
      this.undefinedExports.set(name, id.loc.start);
    }
  }
  currentScope() {
    return this.scopeStack[this.scopeStack.length - 1];
  }
  currentVarScopeFlags() {
    for (let i = this.scopeStack.length - 1;; i--) {
      const {
        flags
      } = this.scopeStack[i];
      if (flags & 387) {
        return flags;
      }
    }
  }
  currentThisScopeFlags() {
    for (let i = this.scopeStack.length - 1;; i--) {
      const {
        flags
      } = this.scopeStack[i];
      if (flags & (387 | 64) && !(flags & 4)) {
        return flags;
      }
    }
  }
}
class FlowScope extends Scope {
  constructor(...args) {
    super(...args);
    this.declareFunctions = new Set();
  }
}
class FlowScopeHandler extends ScopeHandler {
  createScope(flags) {
    return new FlowScope(flags);
  }
  declareName(name, bindingType, loc) {
    const scope = this.currentScope();
    if (bindingType & 2048) {
      this.checkRedeclarationInScope(scope, name, bindingType, loc);
      this.maybeExportDefined(scope, name);
      scope.declareFunctions.add(name);
      return;
    }
    super.declareName(name, bindingType, loc);
  }
  isRedeclaredInScope(scope, name, bindingType) {
    if (super.isRedeclaredInScope(scope, name, bindingType)) return true;
    if (bindingType & 2048 && !scope.declareFunctions.has(name)) {
      const type = scope.names.get(name);
      return (type & 4) > 0 || (type & 2) > 0;
    }
    return false;
  }
  checkLocalExport(id) {
    if (!this.scopeStack[0].declareFunctions.has(id.name)) {
      super.checkLocalExport(id);
    }
  }
}
class BaseParser {
  constructor() {
    this.sawUnambiguousESM = false;
    this.ambiguousScriptDifferentAst = false;
  }
  hasPlugin(pluginConfig) {
    if (typeof pluginConfig === "string") {
      return this.plugins.has(pluginConfig);
    } else {
      const [pluginName, pluginOptions] = pluginConfig;
      if (!this.hasPlugin(pluginName)) {
        return false;
      }
      const actualOptions = this.plugins.get(pluginName);
      for (const key of Object.keys(pluginOptions)) {
        if ((actualOptions == null ? void 0 : actualOptions[key]) !== pluginOptions[key]) {
          return false;
        }
      }
      return true;
    }
  }
  getPluginOption(plugin, name) {
    var _this$plugins$get;
    return (_this$plugins$get = this.plugins.get(plugin)) == null ? void 0 : _this$plugins$get[name];
  }
}
function setTrailingComments(node, comments) {
  if (node.trailingComments === undefined) {
    node.trailingComments = comments;
  } else {
    node.trailingComments.unshift(...comments);
  }
}
function setLeadingComments(node, comments) {
  if (node.leadingComments === undefined) {
    node.leadingComments = comments;
  } else {
    node.leadingComments.unshift(...comments);
  }
}
function setInnerComments(node, comments) {
  if (node.innerComments === undefined) {
    node.innerComments = comments;
  } else {
    node.innerComments.unshift(...comments);
  }
}
function adjustInnerComments(node, elements, commentWS) {
  let lastElement = null;
  let i = elements.length;
  while (lastElement === null && i > 0) {
    lastElement = elements[--i];
  }
  if (lastElement === null || lastElement.start > commentWS.start) {
    setInnerComments(node, commentWS.comments);
  } else {
    setTrailingComments(lastElement, commentWS.comments);
  }
}
class CommentsParser extends BaseParser {
  addComment(comment) {
    if (this.filename) comment.loc.filename = this.filename;
    const {
      commentsLen
    } = this.state;
    if (this.comments.length != commentsLen) this.comments.length = commentsLen;
    this.comments.push(comment);
    this.state.commentsLen++;
  }
  processComment(node) {
    const {
      commentStack
    } = this.state;
    const commentStackLength = commentStack.length;
    if (commentStackLength === 0) return;
    let i = commentStackLength - 1;
    const lastCommentWS = commentStack[i];
    if (lastCommentWS.start === node.end) {
      lastCommentWS.leadingNode = node;
      i--;
    }
    const {
      start: nodeStart
    } = node;
    for (; i >= 0; i--) {
      const commentWS = commentStack[i];
      const commentEnd = commentWS.end;
      if (commentEnd > nodeStart) {
        commentWS.containingNode = node;
        this.finalizeComment(commentWS);
        commentStack.splice(i, 1);
      } else {
        if (commentEnd === nodeStart) {
          commentWS.trailingNode = node;
        }
        break;
      }
    }
  }
  finalizeComment(commentWS) {
    const {
      comments
    } = commentWS;
    if (commentWS.leadingNode !== null || commentWS.trailingNode !== null) {
      if (commentWS.leadingNode !== null) {
        setTrailingComments(commentWS.leadingNode, comments);
      }
      if (commentWS.trailingNode !== null) {
        setLeadingComments(commentWS.trailingNode, comments);
      }
    } else {
      const {
        containingNode: node,
        start: commentStart
      } = commentWS;
      if (this.input.charCodeAt(commentStart - 1) === 44) {
        switch (node.type) {
          case "ObjectExpression":
          case "ObjectPattern":
          case "RecordExpression":
            adjustInnerComments(node, node.properties, commentWS);
            break;
          case "CallExpression":
          case "OptionalCallExpression":
            adjustInnerComments(node, node.arguments, commentWS);
            break;
          case "FunctionDeclaration":
          case "FunctionExpression":
          case "ArrowFunctionExpression":
          case "ObjectMethod":
          case "ClassMethod":
          case "ClassPrivateMethod":
            adjustInnerComments(node, node.params, commentWS);
            break;
          case "ArrayExpression":
          case "ArrayPattern":
          case "TupleExpression":
            adjustInnerComments(node, node.elements, commentWS);
            break;
          case "ExportNamedDeclaration":
          case "ImportDeclaration":
            adjustInnerComments(node, node.specifiers, commentWS);
            break;
          default:
            {
              setInnerComments(node, comments);
            }
        }
      } else {
        setInnerComments(node, comments);
      }
    }
  }
  finalizeRemainingComments() {
    const {
      commentStack
    } = this.state;
    for (let i = commentStack.length - 1; i >= 0; i--) {
      this.finalizeComment(commentStack[i]);
    }
    this.state.commentStack = [];
  }
  resetPreviousNodeTrailingComments(node) {
    const {
      commentStack
    } = this.state;
    const {
      length
    } = commentStack;
    if (length === 0) return;
    const commentWS = commentStack[length - 1];
    if (commentWS.leadingNode === node) {
      commentWS.leadingNode = null;
    }
  }
  resetPreviousIdentifierLeadingComments(node) {
    const {
      commentStack
    } = this.state;
    const {
      length
    } = commentStack;
    if (length === 0) return;
    if (commentStack[length - 1].trailingNode === node) {
      commentStack[length - 1].trailingNode = null;
    } else if (length >= 2 && commentStack[length - 2].trailingNode === node) {
      commentStack[length - 2].trailingNode = null;
    }
  }
  takeSurroundingComments(node, start, end) {
    const {
      commentStack
    } = this.state;
    const commentStackLength = commentStack.length;
    if (commentStackLength === 0) return;
    let i = commentStackLength - 1;
    for (; i >= 0; i--) {
      const commentWS = commentStack[i];
      const commentEnd = commentWS.end;
      const commentStart = commentWS.start;
      if (commentStart === end) {
        commentWS.leadingNode = node;
      } else if (commentEnd === start) {
        commentWS.trailingNode = node;
      } else if (commentEnd < start) {
        break;
      }
    }
  }
}
const lineBreak = /\r\n?|[\n\u2028\u2029]/;
const lineBreakG = new RegExp(lineBreak.source, "g");
function isNewLine(code) {
  switch (code) {
    case 10:
    case 13:
    case 8232:
    case 8233:
      return true;
    default:
      return false;
  }
}
const skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
const skipWhiteSpaceInLine = /(?:[^\S\n\r\u2028\u2029]|\/\/.*|\/\*.*?\*\/)*/g;
const skipWhiteSpaceToLineBreak = new RegExp("(?=(" + skipWhiteSpaceInLine.source + "))\\1" + /(?=[\n\r\u2028\u2029]|\/\*(?!.*?\*\/)|$)/.source, "y");
function isWhitespace(code) {
  switch (code) {
    case 0x0009:
    case 0x000b:
    case 0x000c:
    case 32:
    case 160:
    case 5760:
    case 0x2000:
    case 0x2001:
    case 0x2002:
    case 0x2003:
    case 0x2004:
    case 0x2005:
    case 0x2006:
    case 0x2007:
    case 0x2008:
    case 0x2009:
    case 0x200a:
    case 0x202f:
    case 0x205f:
    case 0x3000:
    case 0xfeff:
      return true;
    default:
      return false;
  }
}
class State {
  constructor() {
    this.flags = 1024;
    this.curLine = void 0;
    this.lineStart = void 0;
    this.startLoc = void 0;
    this.endLoc = void 0;
    this.errors = [];
    this.potentialArrowAt = -1;
    this.noArrowAt = [];
    this.noArrowParamsConversionAt = [];
    this.topicContext = {
      maxNumOfResolvableTopics: 0,
      maxTopicIndex: null
    };
    this.labels = [];
    this.commentsLen = 0;
    this.commentStack = [];
    this.pos = 0;
    this.type = 139;
    this.value = null;
    this.start = 0;
    this.end = 0;
    this.lastTokEndLoc = null;
    this.lastTokStartLoc = null;
    this.context = [types.brace];
    this.firstInvalidTemplateEscapePos = null;
    this.strictErrors = new Map();
    this.tokensLength = 0;
  }
  get strict() {
    return (this.flags & 1) > 0;
  }
  set strict(value) {
    if (value) {
      this.flags |= 1;
    } else {
      this.flags &= ~1;
    }
  }
  init({
    strictMode,
    sourceType,
    startLine,
    startColumn
  }) {
    this.strict = strictMode === false ? false : strictMode === true ? true : sourceType === "module";
    this.curLine = startLine;
    this.lineStart = -startColumn;
    this.startLoc = this.endLoc = new Position(startLine, startColumn, 0);
  }
  get maybeInArrowParameters() {
    return (this.flags & 2) > 0;
  }
  set maybeInArrowParameters(value) {
    if (value) {
      this.flags |= 2;
    } else {
      this.flags &= ~2;
    }
  }
  get inType() {
    return (this.flags & 4) > 0;
  }
  set inType(value) {
    if (value) {
      this.flags |= 4;
    } else {
      this.flags &= ~4;
    }
  }
  get noAnonFunctionType() {
    return (this.flags & 8) > 0;
  }
  set noAnonFunctionType(value) {
    if (value) {
      this.flags |= 8;
    } else {
      this.flags &= ~8;
    }
  }
  get hasFlowComment() {
    return (this.flags & 16) > 0;
  }
  set hasFlowComment(value) {
    if (value) {
      this.flags |= 16;
    } else {
      this.flags &= ~16;
    }
  }
  get isAmbientContext() {
    return (this.flags & 32) > 0;
  }
  set isAmbientContext(value) {
    if (value) {
      this.flags |= 32;
    } else {
      this.flags &= ~32;
    }
  }
  get inAbstractClass() {
    return (this.flags & 64) > 0;
  }
  set inAbstractClass(value) {
    if (value) {
      this.flags |= 64;
    } else {
      this.flags &= ~64;
    }
  }
  get inDisallowConditionalTypesContext() {
    return (this.flags & 128) > 0;
  }
  set inDisallowConditionalTypesContext(value) {
    if (value) {
      this.flags |= 128;
    } else {
      this.flags &= ~128;
    }
  }
  get soloAwait() {
    return (this.flags & 256) > 0;
  }
  set soloAwait(value) {
    if (value) {
      this.flags |= 256;
    } else {
      this.flags &= ~256;
    }
  }
  get inFSharpPipelineDirectBody() {
    return (this.flags & 512) > 0;
  }
  set inFSharpPipelineDirectBody(value) {
    if (value) {
      this.flags |= 512;
    } else {
      this.flags &= ~512;
    }
  }
  get canStartJSXElement() {
    return (this.flags & 1024) > 0;
  }
  set canStartJSXElement(value) {
    if (value) {
      this.flags |= 1024;
    } else {
      this.flags &= ~1024;
    }
  }
  get containsEsc() {
    return (this.flags & 2048) > 0;
  }
  set containsEsc(value) {
    if (value) {
      this.flags |= 2048;
    } else {
      this.flags &= ~2048;
    }
  }
  curPosition() {
    return new Position(this.curLine, this.pos - this.lineStart, this.pos);
  }
  clone() {
    const state = new State();
    state.flags = this.flags;
    state.curLine = this.curLine;
    state.lineStart = this.lineStart;
    state.startLoc = this.startLoc;
    state.endLoc = this.endLoc;
    state.errors = this.errors.slice();
    state.potentialArrowAt = this.potentialArrowAt;
    state.noArrowAt = this.noArrowAt.slice();
    state.noArrowParamsConversionAt = this.noArrowParamsConversionAt.slice();
    state.topicContext = this.topicContext;
    state.labels = this.labels.slice();
    state.commentsLen = this.commentsLen;
    state.commentStack = this.commentStack.slice();
    state.pos = this.pos;
    state.type = this.type;
    state.value = this.value;
    state.start = this.start;
    state.end = this.end;
    state.lastTokEndLoc = this.lastTokEndLoc;
    state.lastTokStartLoc = this.lastTokStartLoc;
    state.context = this.context.slice();
    state.firstInvalidTemplateEscapePos = this.firstInvalidTemplateEscapePos;
    state.strictErrors = this.strictErrors;
    state.tokensLength = this.tokensLength;
    return state;
  }
}
var _isDigit = function isDigit(code) {
  return code >= 48 && code <= 57;
};
const forbiddenNumericSeparatorSiblings = {
  decBinOct: new Set([46, 66, 69, 79, 95, 98, 101, 111]),
  hex: new Set([46, 88, 95, 120])
};
const isAllowedNumericSeparatorSibling = {
  bin: ch => ch === 48 || ch === 49,
  oct: ch => ch >= 48 && ch <= 55,
  dec: ch => ch >= 48 && ch <= 57,
  hex: ch => ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102
};
function readStringContents(type, input, pos, lineStart, curLine, errors) {
  const initialPos = pos;
  const initialLineStart = lineStart;
  const initialCurLine = curLine;
  let out = "";
  let firstInvalidLoc = null;
  let chunkStart = pos;
  const {
    length
  } = input;
  for (;;) {
    if (pos >= length) {
      errors.unterminated(initialPos, initialLineStart, initialCurLine);
      out += input.slice(chunkStart, pos);
      break;
    }
    const ch = input.charCodeAt(pos);
    if (isStringEnd(type, ch, input, pos)) {
      out += input.slice(chunkStart, pos);
      break;
    }
    if (ch === 92) {
      out += input.slice(chunkStart, pos);
      const res = readEscapedChar(input, pos, lineStart, curLine, type === "template", errors);
      if (res.ch === null && !firstInvalidLoc) {
        firstInvalidLoc = {
          pos,
          lineStart,
          curLine
        };
      } else {
        out += res.ch;
      }
      ({
        pos,
        lineStart,
        curLine
      } = res);
      chunkStart = pos;
    } else if (ch === 8232 || ch === 8233) {
      ++pos;
      ++curLine;
      lineStart = pos;
    } else if (ch === 10 || ch === 13) {
      if (type === "template") {
        out += input.slice(chunkStart, pos) + "\n";
        ++pos;
        if (ch === 13 && input.charCodeAt(pos) === 10) {
          ++pos;
        }
        ++curLine;
        chunkStart = lineStart = pos;
      } else {
        errors.unterminated(initialPos, initialLineStart, initialCurLine);
      }
    } else {
      ++pos;
    }
  }
  return {
    pos,
    str: out,
    firstInvalidLoc,
    lineStart,
    curLine,
    containsInvalid: !!firstInvalidLoc
  };
}
function isStringEnd(type, ch, input, pos) {
  if (type === "template") {
    return ch === 96 || ch === 36 && input.charCodeAt(pos + 1) === 123;
  }
  return ch === (type === "double" ? 34 : 39);
}
function readEscapedChar(input, pos, lineStart, curLine, inTemplate, errors) {
  const throwOnInvalid = !inTemplate;
  pos++;
  const res = ch => ({
    pos,
    ch,
    lineStart,
    curLine
  });
  const ch = input.charCodeAt(pos++);
  switch (ch) {
    case 110:
      return res("\n");
    case 114:
      return res("\r");
    case 120:
      {
        let code;
        ({
          code,
          pos
        } = readHexChar(input, pos, lineStart, curLine, 2, false, throwOnInvalid, errors));
        return res(code === null ? null : String.fromCharCode(code));
      }
    case 117:
      {
        let code;
        ({
          code,
          pos
        } = readCodePoint(input, pos, lineStart, curLine, throwOnInvalid, errors));
        return res(code === null ? null : String.fromCodePoint(code));
      }
    case 116:
      return res("\t");
    case 98:
      return res("\b");
    case 118:
      return res("\u000b");
    case 102:
      return res("\f");
    case 13:
      if (input.charCodeAt(pos) === 10) {
        ++pos;
      }
    case 10:
      lineStart = pos;
      ++curLine;
    case 8232:
    case 8233:
      return res("");
    case 56:
    case 57:
      if (inTemplate) {
        return res(null);
      } else {
        errors.strictNumericEscape(pos - 1, lineStart, curLine);
      }
    default:
      if (ch >= 48 && ch <= 55) {
        const startPos = pos - 1;
        const match = input.slice(startPos, pos + 2).match(/^[0-7]+/);
        let octalStr = match[0];
        let octal = parseInt(octalStr, 8);
        if (octal > 255) {
          octalStr = octalStr.slice(0, -1);
          octal = parseInt(octalStr, 8);
        }
        pos += octalStr.length - 1;
        const next = input.charCodeAt(pos);
        if (octalStr !== "0" || next === 56 || next === 57) {
          if (inTemplate) {
            return res(null);
          } else {
            errors.strictNumericEscape(startPos, lineStart, curLine);
          }
        }
        return res(String.fromCharCode(octal));
      }
      return res(String.fromCharCode(ch));
  }
}
function readHexChar(input, pos, lineStart, curLine, len, forceLen, throwOnInvalid, errors) {
  const initialPos = pos;
  let n;
  ({
    n,
    pos
  } = readInt(input, pos, lineStart, curLine, 16, len, forceLen, false, errors, !throwOnInvalid));
  if (n === null) {
    if (throwOnInvalid) {
      errors.invalidEscapeSequence(initialPos, lineStart, curLine);
    } else {
      pos = initialPos - 1;
    }
  }
  return {
    code: n,
    pos
  };
}
function readInt(input, pos, lineStart, curLine, radix, len, forceLen, allowNumSeparator, errors, bailOnError) {
  const start = pos;
  const forbiddenSiblings = radix === 16 ? forbiddenNumericSeparatorSiblings.hex : forbiddenNumericSeparatorSiblings.decBinOct;
  const isAllowedSibling = radix === 16 ? isAllowedNumericSeparatorSibling.hex : radix === 10 ? isAllowedNumericSeparatorSibling.dec : radix === 8 ? isAllowedNumericSeparatorSibling.oct : isAllowedNumericSeparatorSibling.bin;
  let invalid = false;
  let total = 0;
  for (let i = 0, e = len == null ? Infinity : len; i < e; ++i) {
    const code = input.charCodeAt(pos);
    let val;
    if (code === 95 && allowNumSeparator !== "bail") {
      const prev = input.charCodeAt(pos - 1);
      const next = input.charCodeAt(pos + 1);
      if (!allowNumSeparator) {
        if (bailOnError) return {
          n: null,
          pos
        };
        errors.numericSeparatorInEscapeSequence(pos, lineStart, curLine);
      } else if (Number.isNaN(next) || !isAllowedSibling(next) || forbiddenSiblings.has(prev) || forbiddenSiblings.has(next)) {
        if (bailOnError) return {
          n: null,
          pos
        };
        errors.unexpectedNumericSeparator(pos, lineStart, curLine);
      }
      ++pos;
      continue;
    }
    if (code >= 97) {
      val = code - 97 + 10;
    } else if (code >= 65) {
      val = code - 65 + 10;
    } else if (_isDigit(code)) {
      val = code - 48;
    } else {
      val = Infinity;
    }
    if (val >= radix) {
      if (val <= 9 && bailOnError) {
        return {
          n: null,
          pos
        };
      } else if (val <= 9 && errors.invalidDigit(pos, lineStart, curLine, radix)) {
        val = 0;
      } else if (forceLen) {
        val = 0;
        invalid = true;
      } else {
        break;
      }
    }
    ++pos;
    total = total * radix + val;
  }
  if (pos === start || len != null && pos - start !== len || invalid) {
    return {
      n: null,
      pos
    };
  }
  return {
    n: total,
    pos
  };
}
function readCodePoint(input, pos, lineStart, curLine, throwOnInvalid, errors) {
  const ch = input.charCodeAt(pos);
  let code;
  if (ch === 123) {
    ++pos;
    ({
      code,
      pos
    } = readHexChar(input, pos, lineStart, curLine, input.indexOf("}", pos) - pos, true, throwOnInvalid, errors));
    ++pos;
    if (code !== null && code > 0x10ffff) {
      if (throwOnInvalid) {
        errors.invalidCodePoint(pos, lineStart, curLine);
      } else {
        return {
          code: null,
          pos
        };
      }
    }
  } else {
    ({
      code,
      pos
    } = readHexChar(input, pos, lineStart, curLine, 4, false, throwOnInvalid, errors));
  }
  return {
    code,
    pos
  };
}
function buildPosition(pos, lineStart, curLine) {
  return new Position(curLine, pos - lineStart, pos);
}
const VALID_REGEX_FLAGS = new Set([103, 109, 115, 105, 121, 117, 100, 118]);
class Token {
  constructor(state) {
    this.type = state.type;
    this.value = state.value;
    this.start = state.start;
    this.end = state.end;
    this.loc = new SourceLocation$1(state.startLoc, state.endLoc);
  }
}
class Tokenizer extends CommentsParser {
  constructor(options, input) {
    super();
    this.isLookahead = void 0;
    this.tokens = [];
    this.errorHandlers_readInt = {
      invalidDigit: (pos, lineStart, curLine, radix) => {
        if (!this.options.errorRecovery) return false;
        this.raise(Errors.InvalidDigit, buildPosition(pos, lineStart, curLine), {
          radix
        });
        return true;
      },
      numericSeparatorInEscapeSequence: this.errorBuilder(Errors.NumericSeparatorInEscapeSequence),
      unexpectedNumericSeparator: this.errorBuilder(Errors.UnexpectedNumericSeparator)
    };
    this.errorHandlers_readCodePoint = Object.assign({}, this.errorHandlers_readInt, {
      invalidEscapeSequence: this.errorBuilder(Errors.InvalidEscapeSequence),
      invalidCodePoint: this.errorBuilder(Errors.InvalidCodePoint)
    });
    this.errorHandlers_readStringContents_string = Object.assign({}, this.errorHandlers_readCodePoint, {
      strictNumericEscape: (pos, lineStart, curLine) => {
        this.recordStrictModeErrors(Errors.StrictNumericEscape, buildPosition(pos, lineStart, curLine));
      },
      unterminated: (pos, lineStart, curLine) => {
        throw this.raise(Errors.UnterminatedString, buildPosition(pos - 1, lineStart, curLine));
      }
    });
    this.errorHandlers_readStringContents_template = Object.assign({}, this.errorHandlers_readCodePoint, {
      strictNumericEscape: this.errorBuilder(Errors.StrictNumericEscape),
      unterminated: (pos, lineStart, curLine) => {
        throw this.raise(Errors.UnterminatedTemplate, buildPosition(pos, lineStart, curLine));
      }
    });
    this.state = new State();
    this.state.init(options);
    this.input = input;
    this.length = input.length;
    this.comments = [];
    this.isLookahead = false;
  }
  pushToken(token) {
    this.tokens.length = this.state.tokensLength;
    this.tokens.push(token);
    ++this.state.tokensLength;
  }
  next() {
    this.checkKeywordEscapes();
    if (this.options.tokens) {
      this.pushToken(new Token(this.state));
    }
    this.state.lastTokEndLoc = this.state.endLoc;
    this.state.lastTokStartLoc = this.state.startLoc;
    this.nextToken();
  }
  eat(type) {
    if (this.match(type)) {
      this.next();
      return true;
    } else {
      return false;
    }
  }
  match(type) {
    return this.state.type === type;
  }
  createLookaheadState(state) {
    return {
      pos: state.pos,
      value: null,
      type: state.type,
      start: state.start,
      end: state.end,
      context: [this.curContext()],
      inType: state.inType,
      startLoc: state.startLoc,
      lastTokEndLoc: state.lastTokEndLoc,
      curLine: state.curLine,
      lineStart: state.lineStart,
      curPosition: state.curPosition
    };
  }
  lookahead() {
    const old = this.state;
    this.state = this.createLookaheadState(old);
    this.isLookahead = true;
    this.nextToken();
    this.isLookahead = false;
    const curr = this.state;
    this.state = old;
    return curr;
  }
  nextTokenStart() {
    return this.nextTokenStartSince(this.state.pos);
  }
  nextTokenStartSince(pos) {
    skipWhiteSpace.lastIndex = pos;
    return skipWhiteSpace.test(this.input) ? skipWhiteSpace.lastIndex : pos;
  }
  lookaheadCharCode() {
    return this.input.charCodeAt(this.nextTokenStart());
  }
  nextTokenInLineStart() {
    return this.nextTokenInLineStartSince(this.state.pos);
  }
  nextTokenInLineStartSince(pos) {
    skipWhiteSpaceInLine.lastIndex = pos;
    return skipWhiteSpaceInLine.test(this.input) ? skipWhiteSpaceInLine.lastIndex : pos;
  }
  lookaheadInLineCharCode() {
    return this.input.charCodeAt(this.nextTokenInLineStart());
  }
  codePointAtPos(pos) {
    let cp = this.input.charCodeAt(pos);
    if ((cp & 0xfc00) === 0xd800 && ++pos < this.input.length) {
      const trail = this.input.charCodeAt(pos);
      if ((trail & 0xfc00) === 0xdc00) {
        cp = 0x10000 + ((cp & 0x3ff) << 10) + (trail & 0x3ff);
      }
    }
    return cp;
  }
  setStrict(strict) {
    this.state.strict = strict;
    if (strict) {
      this.state.strictErrors.forEach(([toParseError, at]) => this.raise(toParseError, at));
      this.state.strictErrors.clear();
    }
  }
  curContext() {
    return this.state.context[this.state.context.length - 1];
  }
  nextToken() {
    this.skipSpace();
    this.state.start = this.state.pos;
    if (!this.isLookahead) this.state.startLoc = this.state.curPosition();
    if (this.state.pos >= this.length) {
      this.finishToken(139);
      return;
    }
    this.getTokenFromCode(this.codePointAtPos(this.state.pos));
  }
  skipBlockComment(commentEnd) {
    let startLoc;
    if (!this.isLookahead) startLoc = this.state.curPosition();
    const start = this.state.pos;
    const end = this.input.indexOf(commentEnd, start + 2);
    if (end === -1) {
      throw this.raise(Errors.UnterminatedComment, this.state.curPosition());
    }
    this.state.pos = end + commentEnd.length;
    lineBreakG.lastIndex = start + 2;
    while (lineBreakG.test(this.input) && lineBreakG.lastIndex <= end) {
      ++this.state.curLine;
      this.state.lineStart = lineBreakG.lastIndex;
    }
    if (this.isLookahead) return;
    const comment = {
      type: "CommentBlock",
      value: this.input.slice(start + 2, end),
      start,
      end: end + commentEnd.length,
      loc: new SourceLocation$1(startLoc, this.state.curPosition())
    };
    if (this.options.tokens) this.pushToken(comment);
    return comment;
  }
  skipLineComment(startSkip) {
    const start = this.state.pos;
    let startLoc;
    if (!this.isLookahead) startLoc = this.state.curPosition();
    let ch = this.input.charCodeAt(this.state.pos += startSkip);
    if (this.state.pos < this.length) {
      while (!isNewLine(ch) && ++this.state.pos < this.length) {
        ch = this.input.charCodeAt(this.state.pos);
      }
    }
    if (this.isLookahead) return;
    const end = this.state.pos;
    const value = this.input.slice(start + startSkip, end);
    const comment = {
      type: "CommentLine",
      value,
      start,
      end,
      loc: new SourceLocation$1(startLoc, this.state.curPosition())
    };
    if (this.options.tokens) this.pushToken(comment);
    return comment;
  }
  skipSpace() {
    const spaceStart = this.state.pos;
    const comments = [];
    loop: while (this.state.pos < this.length) {
      const ch = this.input.charCodeAt(this.state.pos);
      switch (ch) {
        case 32:
        case 160:
        case 9:
          ++this.state.pos;
          break;
        case 13:
          if (this.input.charCodeAt(this.state.pos + 1) === 10) {
            ++this.state.pos;
          }
        case 10:
        case 8232:
        case 8233:
          ++this.state.pos;
          ++this.state.curLine;
          this.state.lineStart = this.state.pos;
          break;
        case 47:
          switch (this.input.charCodeAt(this.state.pos + 1)) {
            case 42:
              {
                const comment = this.skipBlockComment("*/");
                if (comment !== undefined) {
                  this.addComment(comment);
                  if (this.options.attachComment) comments.push(comment);
                }
                break;
              }
            case 47:
              {
                const comment = this.skipLineComment(2);
                if (comment !== undefined) {
                  this.addComment(comment);
                  if (this.options.attachComment) comments.push(comment);
                }
                break;
              }
            default:
              break loop;
          }
          break;
        default:
          if (isWhitespace(ch)) {
            ++this.state.pos;
          } else if (ch === 45 && !this.inModule && this.options.annexB) {
            const pos = this.state.pos;
            if (this.input.charCodeAt(pos + 1) === 45 && this.input.charCodeAt(pos + 2) === 62 && (spaceStart === 0 || this.state.lineStart > spaceStart)) {
              const comment = this.skipLineComment(3);
              if (comment !== undefined) {
                this.addComment(comment);
                if (this.options.attachComment) comments.push(comment);
              }
            } else {
              break loop;
            }
          } else if (ch === 60 && !this.inModule && this.options.annexB) {
            const pos = this.state.pos;
            if (this.input.charCodeAt(pos + 1) === 33 && this.input.charCodeAt(pos + 2) === 45 && this.input.charCodeAt(pos + 3) === 45) {
              const comment = this.skipLineComment(4);
              if (comment !== undefined) {
                this.addComment(comment);
                if (this.options.attachComment) comments.push(comment);
              }
            } else {
              break loop;
            }
          } else {
            break loop;
          }
      }
    }
    if (comments.length > 0) {
      const end = this.state.pos;
      const commentWhitespace = {
        start: spaceStart,
        end,
        comments,
        leadingNode: null,
        trailingNode: null,
        containingNode: null
      };
      this.state.commentStack.push(commentWhitespace);
    }
  }
  finishToken(type, val) {
    this.state.end = this.state.pos;
    this.state.endLoc = this.state.curPosition();
    const prevType = this.state.type;
    this.state.type = type;
    this.state.value = val;
    if (!this.isLookahead) {
      this.updateContext(prevType);
    }
  }
  replaceToken(type) {
    this.state.type = type;
    this.updateContext();
  }
  readToken_numberSign() {
    if (this.state.pos === 0 && this.readToken_interpreter()) {
      return;
    }
    const nextPos = this.state.pos + 1;
    const next = this.codePointAtPos(nextPos);
    if (next >= 48 && next <= 57) {
      throw this.raise(Errors.UnexpectedDigitAfterHash, this.state.curPosition());
    }
    if (next === 123 || next === 91 && this.hasPlugin("recordAndTuple")) {
      this.expectPlugin("recordAndTuple");
      if (this.getPluginOption("recordAndTuple", "syntaxType") === "bar") {
        throw this.raise(next === 123 ? Errors.RecordExpressionHashIncorrectStartSyntaxType : Errors.TupleExpressionHashIncorrectStartSyntaxType, this.state.curPosition());
      }
      this.state.pos += 2;
      if (next === 123) {
        this.finishToken(7);
      } else {
        this.finishToken(1);
      }
    } else if (isIdentifierStart(next)) {
      ++this.state.pos;
      this.finishToken(138, this.readWord1(next));
    } else if (next === 92) {
      ++this.state.pos;
      this.finishToken(138, this.readWord1());
    } else {
      this.finishOp(27, 1);
    }
  }
  readToken_dot() {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next >= 48 && next <= 57) {
      this.readNumber(true);
      return;
    }
    if (next === 46 && this.input.charCodeAt(this.state.pos + 2) === 46) {
      this.state.pos += 3;
      this.finishToken(21);
    } else {
      ++this.state.pos;
      this.finishToken(16);
    }
  }
  readToken_slash() {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === 61) {
      this.finishOp(31, 2);
    } else {
      this.finishOp(56, 1);
    }
  }
  readToken_interpreter() {
    if (this.state.pos !== 0 || this.length < 2) return false;
    let ch = this.input.charCodeAt(this.state.pos + 1);
    if (ch !== 33) return false;
    const start = this.state.pos;
    this.state.pos += 1;
    while (!isNewLine(ch) && ++this.state.pos < this.length) {
      ch = this.input.charCodeAt(this.state.pos);
    }
    const value = this.input.slice(start + 2, this.state.pos);
    this.finishToken(28, value);
    return true;
  }
  readToken_mult_modulo(code) {
    let type = code === 42 ? 55 : 54;
    let width = 1;
    let next = this.input.charCodeAt(this.state.pos + 1);
    if (code === 42 && next === 42) {
      width++;
      next = this.input.charCodeAt(this.state.pos + 2);
      type = 57;
    }
    if (next === 61 && !this.state.inType) {
      width++;
      type = code === 37 ? 33 : 30;
    }
    this.finishOp(type, width);
  }
  readToken_pipe_amp(code) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === code) {
      if (this.input.charCodeAt(this.state.pos + 2) === 61) {
        this.finishOp(30, 3);
      } else {
        this.finishOp(code === 124 ? 41 : 42, 2);
      }
      return;
    }
    if (code === 124) {
      if (next === 62) {
        this.finishOp(39, 2);
        return;
      }
      if (this.hasPlugin("recordAndTuple") && next === 125) {
        if (this.getPluginOption("recordAndTuple", "syntaxType") !== "bar") {
          throw this.raise(Errors.RecordExpressionBarIncorrectEndSyntaxType, this.state.curPosition());
        }
        this.state.pos += 2;
        this.finishToken(9);
        return;
      }
      if (this.hasPlugin("recordAndTuple") && next === 93) {
        if (this.getPluginOption("recordAndTuple", "syntaxType") !== "bar") {
          throw this.raise(Errors.TupleExpressionBarIncorrectEndSyntaxType, this.state.curPosition());
        }
        this.state.pos += 2;
        this.finishToken(4);
        return;
      }
    }
    if (next === 61) {
      this.finishOp(30, 2);
      return;
    }
    this.finishOp(code === 124 ? 43 : 45, 1);
  }
  readToken_caret() {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === 61 && !this.state.inType) {
      this.finishOp(32, 2);
    } else if (next === 94 && this.hasPlugin(["pipelineOperator", {
      proposal: "hack",
      topicToken: "^^"
    }])) {
      this.finishOp(37, 2);
      const lookaheadCh = this.input.codePointAt(this.state.pos);
      if (lookaheadCh === 94) {
        this.unexpected();
      }
    } else {
      this.finishOp(44, 1);
    }
  }
  readToken_atSign() {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === 64 && this.hasPlugin(["pipelineOperator", {
      proposal: "hack",
      topicToken: "@@"
    }])) {
      this.finishOp(38, 2);
    } else {
      this.finishOp(26, 1);
    }
  }
  readToken_plus_min(code) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === code) {
      this.finishOp(34, 2);
      return;
    }
    if (next === 61) {
      this.finishOp(30, 2);
    } else {
      this.finishOp(53, 1);
    }
  }
  readToken_lt() {
    const {
      pos
    } = this.state;
    const next = this.input.charCodeAt(pos + 1);
    if (next === 60) {
      if (this.input.charCodeAt(pos + 2) === 61) {
        this.finishOp(30, 3);
        return;
      }
      this.finishOp(51, 2);
      return;
    }
    if (next === 61) {
      this.finishOp(49, 2);
      return;
    }
    this.finishOp(47, 1);
  }
  readToken_gt() {
    const {
      pos
    } = this.state;
    const next = this.input.charCodeAt(pos + 1);
    if (next === 62) {
      const size = this.input.charCodeAt(pos + 2) === 62 ? 3 : 2;
      if (this.input.charCodeAt(pos + size) === 61) {
        this.finishOp(30, size + 1);
        return;
      }
      this.finishOp(52, size);
      return;
    }
    if (next === 61) {
      this.finishOp(49, 2);
      return;
    }
    this.finishOp(48, 1);
  }
  readToken_eq_excl(code) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (next === 61) {
      this.finishOp(46, this.input.charCodeAt(this.state.pos + 2) === 61 ? 3 : 2);
      return;
    }
    if (code === 61 && next === 62) {
      this.state.pos += 2;
      this.finishToken(19);
      return;
    }
    this.finishOp(code === 61 ? 29 : 35, 1);
  }
  readToken_question() {
    const next = this.input.charCodeAt(this.state.pos + 1);
    const next2 = this.input.charCodeAt(this.state.pos + 2);
    if (next === 63) {
      if (next2 === 61) {
        this.finishOp(30, 3);
      } else {
        this.finishOp(40, 2);
      }
    } else if (next === 46 && !(next2 >= 48 && next2 <= 57)) {
      this.state.pos += 2;
      this.finishToken(18);
    } else {
      ++this.state.pos;
      this.finishToken(17);
    }
  }
  getTokenFromCode(code) {
    switch (code) {
      case 46:
        this.readToken_dot();
        return;
      case 40:
        ++this.state.pos;
        this.finishToken(10);
        return;
      case 41:
        ++this.state.pos;
        this.finishToken(11);
        return;
      case 59:
        ++this.state.pos;
        this.finishToken(13);
        return;
      case 44:
        ++this.state.pos;
        this.finishToken(12);
        return;
      case 91:
        if (this.hasPlugin("recordAndTuple") && this.input.charCodeAt(this.state.pos + 1) === 124) {
          if (this.getPluginOption("recordAndTuple", "syntaxType") !== "bar") {
            throw this.raise(Errors.TupleExpressionBarIncorrectStartSyntaxType, this.state.curPosition());
          }
          this.state.pos += 2;
          this.finishToken(2);
        } else {
          ++this.state.pos;
          this.finishToken(0);
        }
        return;
      case 93:
        ++this.state.pos;
        this.finishToken(3);
        return;
      case 123:
        if (this.hasPlugin("recordAndTuple") && this.input.charCodeAt(this.state.pos + 1) === 124) {
          if (this.getPluginOption("recordAndTuple", "syntaxType") !== "bar") {
            throw this.raise(Errors.RecordExpressionBarIncorrectStartSyntaxType, this.state.curPosition());
          }
          this.state.pos += 2;
          this.finishToken(6);
        } else {
          ++this.state.pos;
          this.finishToken(5);
        }
        return;
      case 125:
        ++this.state.pos;
        this.finishToken(8);
        return;
      case 58:
        if (this.hasPlugin("functionBind") && this.input.charCodeAt(this.state.pos + 1) === 58) {
          this.finishOp(15, 2);
        } else {
          ++this.state.pos;
          this.finishToken(14);
        }
        return;
      case 63:
        this.readToken_question();
        return;
      case 96:
        this.readTemplateToken();
        return;
      case 48:
        {
          const next = this.input.charCodeAt(this.state.pos + 1);
          if (next === 120 || next === 88) {
            this.readRadixNumber(16);
            return;
          }
          if (next === 111 || next === 79) {
            this.readRadixNumber(8);
            return;
          }
          if (next === 98 || next === 66) {
            this.readRadixNumber(2);
            return;
          }
        }
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        this.readNumber(false);
        return;
      case 34:
      case 39:
        this.readString(code);
        return;
      case 47:
        this.readToken_slash();
        return;
      case 37:
      case 42:
        this.readToken_mult_modulo(code);
        return;
      case 124:
      case 38:
        this.readToken_pipe_amp(code);
        return;
      case 94:
        this.readToken_caret();
        return;
      case 43:
      case 45:
        this.readToken_plus_min(code);
        return;
      case 60:
        this.readToken_lt();
        return;
      case 62:
        this.readToken_gt();
        return;
      case 61:
      case 33:
        this.readToken_eq_excl(code);
        return;
      case 126:
        this.finishOp(36, 1);
        return;
      case 64:
        this.readToken_atSign();
        return;
      case 35:
        this.readToken_numberSign();
        return;
      case 92:
        this.readWord();
        return;
      default:
        if (isIdentifierStart(code)) {
          this.readWord(code);
          return;
        }
    }
    throw this.raise(Errors.InvalidOrUnexpectedToken, this.state.curPosition(), {
      unexpected: String.fromCodePoint(code)
    });
  }
  finishOp(type, size) {
    const str = this.input.slice(this.state.pos, this.state.pos + size);
    this.state.pos += size;
    this.finishToken(type, str);
  }
  readRegexp() {
    const startLoc = this.state.startLoc;
    const start = this.state.start + 1;
    let escaped, inClass;
    let {
      pos
    } = this.state;
    for (;; ++pos) {
      if (pos >= this.length) {
        throw this.raise(Errors.UnterminatedRegExp, createPositionWithColumnOffset(startLoc, 1));
      }
      const ch = this.input.charCodeAt(pos);
      if (isNewLine(ch)) {
        throw this.raise(Errors.UnterminatedRegExp, createPositionWithColumnOffset(startLoc, 1));
      }
      if (escaped) {
        escaped = false;
      } else {
        if (ch === 91) {
          inClass = true;
        } else if (ch === 93 && inClass) {
          inClass = false;
        } else if (ch === 47 && !inClass) {
          break;
        }
        escaped = ch === 92;
      }
    }
    const content = this.input.slice(start, pos);
    ++pos;
    let mods = "";
    const nextPos = () => createPositionWithColumnOffset(startLoc, pos + 2 - start);
    while (pos < this.length) {
      const cp = this.codePointAtPos(pos);
      const char = String.fromCharCode(cp);
      if (VALID_REGEX_FLAGS.has(cp)) {
        if (cp === 118) {
          if (mods.includes("u")) {
            this.raise(Errors.IncompatibleRegExpUVFlags, nextPos());
          }
        } else if (cp === 117) {
          if (mods.includes("v")) {
            this.raise(Errors.IncompatibleRegExpUVFlags, nextPos());
          }
        }
        if (mods.includes(char)) {
          this.raise(Errors.DuplicateRegExpFlags, nextPos());
        }
      } else if (isIdentifierChar(cp) || cp === 92) {
        this.raise(Errors.MalformedRegExpFlags, nextPos());
      } else {
        break;
      }
      ++pos;
      mods += char;
    }
    this.state.pos = pos;
    this.finishToken(137, {
      pattern: content,
      flags: mods
    });
  }
  readInt(radix, len, forceLen = false, allowNumSeparator = true) {
    const {
      n,
      pos
    } = readInt(this.input, this.state.pos, this.state.lineStart, this.state.curLine, radix, len, forceLen, allowNumSeparator, this.errorHandlers_readInt, false);
    this.state.pos = pos;
    return n;
  }
  readRadixNumber(radix) {
    const startLoc = this.state.curPosition();
    let isBigInt = false;
    this.state.pos += 2;
    const val = this.readInt(radix);
    if (val == null) {
      this.raise(Errors.InvalidDigit, createPositionWithColumnOffset(startLoc, 2), {
        radix
      });
    }
    const next = this.input.charCodeAt(this.state.pos);
    if (next === 110) {
      ++this.state.pos;
      isBigInt = true;
    } else if (next === 109) {
      throw this.raise(Errors.InvalidDecimal, startLoc);
    }
    if (isIdentifierStart(this.codePointAtPos(this.state.pos))) {
      throw this.raise(Errors.NumberIdentifier, this.state.curPosition());
    }
    if (isBigInt) {
      const str = this.input.slice(startLoc.index, this.state.pos).replace(/[_n]/g, "");
      this.finishToken(135, str);
      return;
    }
    this.finishToken(134, val);
  }
  readNumber(startsWithDot) {
    const start = this.state.pos;
    const startLoc = this.state.curPosition();
    let isFloat = false;
    let isBigInt = false;
    let isDecimal = false;
    let hasExponent = false;
    let isOctal = false;
    if (!startsWithDot && this.readInt(10) === null) {
      this.raise(Errors.InvalidNumber, this.state.curPosition());
    }
    const hasLeadingZero = this.state.pos - start >= 2 && this.input.charCodeAt(start) === 48;
    if (hasLeadingZero) {
      const integer = this.input.slice(start, this.state.pos);
      this.recordStrictModeErrors(Errors.StrictOctalLiteral, startLoc);
      if (!this.state.strict) {
        const underscorePos = integer.indexOf("_");
        if (underscorePos > 0) {
          this.raise(Errors.ZeroDigitNumericSeparator, createPositionWithColumnOffset(startLoc, underscorePos));
        }
      }
      isOctal = hasLeadingZero && !/[89]/.test(integer);
    }
    let next = this.input.charCodeAt(this.state.pos);
    if (next === 46 && !isOctal) {
      ++this.state.pos;
      this.readInt(10);
      isFloat = true;
      next = this.input.charCodeAt(this.state.pos);
    }
    if ((next === 69 || next === 101) && !isOctal) {
      next = this.input.charCodeAt(++this.state.pos);
      if (next === 43 || next === 45) {
        ++this.state.pos;
      }
      if (this.readInt(10) === null) {
        this.raise(Errors.InvalidOrMissingExponent, startLoc);
      }
      isFloat = true;
      hasExponent = true;
      next = this.input.charCodeAt(this.state.pos);
    }
    if (next === 110) {
      if (isFloat || hasLeadingZero) {
        this.raise(Errors.InvalidBigIntLiteral, startLoc);
      }
      ++this.state.pos;
      isBigInt = true;
    }
    if (next === 109) {
      this.expectPlugin("decimal", this.state.curPosition());
      if (hasExponent || hasLeadingZero) {
        this.raise(Errors.InvalidDecimal, startLoc);
      }
      ++this.state.pos;
      isDecimal = true;
    }
    if (isIdentifierStart(this.codePointAtPos(this.state.pos))) {
      throw this.raise(Errors.NumberIdentifier, this.state.curPosition());
    }
    const str = this.input.slice(start, this.state.pos).replace(/[_mn]/g, "");
    if (isBigInt) {
      this.finishToken(135, str);
      return;
    }
    if (isDecimal) {
      this.finishToken(136, str);
      return;
    }
    const val = isOctal ? parseInt(str, 8) : parseFloat(str);
    this.finishToken(134, val);
  }
  readCodePoint(throwOnInvalid) {
    const {
      code,
      pos
    } = readCodePoint(this.input, this.state.pos, this.state.lineStart, this.state.curLine, throwOnInvalid, this.errorHandlers_readCodePoint);
    this.state.pos = pos;
    return code;
  }
  readString(quote) {
    const {
      str,
      pos,
      curLine,
      lineStart
    } = readStringContents(quote === 34 ? "double" : "single", this.input, this.state.pos + 1, this.state.lineStart, this.state.curLine, this.errorHandlers_readStringContents_string);
    this.state.pos = pos + 1;
    this.state.lineStart = lineStart;
    this.state.curLine = curLine;
    this.finishToken(133, str);
  }
  readTemplateContinuation() {
    if (!this.match(8)) {
      this.unexpected(null, 8);
    }
    this.state.pos--;
    this.readTemplateToken();
  }
  readTemplateToken() {
    const opening = this.input[this.state.pos];
    const {
      str,
      firstInvalidLoc,
      pos,
      curLine,
      lineStart
    } = readStringContents("template", this.input, this.state.pos + 1, this.state.lineStart, this.state.curLine, this.errorHandlers_readStringContents_template);
    this.state.pos = pos + 1;
    this.state.lineStart = lineStart;
    this.state.curLine = curLine;
    if (firstInvalidLoc) {
      this.state.firstInvalidTemplateEscapePos = new Position(firstInvalidLoc.curLine, firstInvalidLoc.pos - firstInvalidLoc.lineStart, firstInvalidLoc.pos);
    }
    if (this.input.codePointAt(pos) === 96) {
      this.finishToken(24, firstInvalidLoc ? null : opening + str + "`");
    } else {
      this.state.pos++;
      this.finishToken(25, firstInvalidLoc ? null : opening + str + "${");
    }
  }
  recordStrictModeErrors(toParseError, at) {
    const index = at.index;
    if (this.state.strict && !this.state.strictErrors.has(index)) {
      this.raise(toParseError, at);
    } else {
      this.state.strictErrors.set(index, [toParseError, at]);
    }
  }
  readWord1(firstCode) {
    this.state.containsEsc = false;
    let word = "";
    const start = this.state.pos;
    let chunkStart = this.state.pos;
    if (firstCode !== undefined) {
      this.state.pos += firstCode <= 0xffff ? 1 : 2;
    }
    while (this.state.pos < this.length) {
      const ch = this.codePointAtPos(this.state.pos);
      if (isIdentifierChar(ch)) {
        this.state.pos += ch <= 0xffff ? 1 : 2;
      } else if (ch === 92) {
        this.state.containsEsc = true;
        word += this.input.slice(chunkStart, this.state.pos);
        const escStart = this.state.curPosition();
        const identifierCheck = this.state.pos === start ? isIdentifierStart : isIdentifierChar;
        if (this.input.charCodeAt(++this.state.pos) !== 117) {
          this.raise(Errors.MissingUnicodeEscape, this.state.curPosition());
          chunkStart = this.state.pos - 1;
          continue;
        }
        ++this.state.pos;
        const esc = this.readCodePoint(true);
        if (esc !== null) {
          if (!identifierCheck(esc)) {
            this.raise(Errors.EscapedCharNotAnIdentifier, escStart);
          }
          word += String.fromCodePoint(esc);
        }
        chunkStart = this.state.pos;
      } else {
        break;
      }
    }
    return word + this.input.slice(chunkStart, this.state.pos);
  }
  readWord(firstCode) {
    const word = this.readWord1(firstCode);
    const type = keywords$1.get(word);
    if (type !== undefined) {
      this.finishToken(type, tokenLabelName(type));
    } else {
      this.finishToken(132, word);
    }
  }
  checkKeywordEscapes() {
    const {
      type
    } = this.state;
    if (tokenIsKeyword(type) && this.state.containsEsc) {
      this.raise(Errors.InvalidEscapedReservedWord, this.state.startLoc, {
        reservedWord: tokenLabelName(type)
      });
    }
  }
  raise(toParseError, at, details = {}) {
    const loc = at instanceof Position ? at : at.loc.start;
    const error = toParseError(loc, details);
    if (!this.options.errorRecovery) throw error;
    if (!this.isLookahead) this.state.errors.push(error);
    return error;
  }
  raiseOverwrite(toParseError, at, details = {}) {
    const loc = at instanceof Position ? at : at.loc.start;
    const pos = loc.index;
    const errors = this.state.errors;
    for (let i = errors.length - 1; i >= 0; i--) {
      const error = errors[i];
      if (error.loc.index === pos) {
        return errors[i] = toParseError(loc, details);
      }
      if (error.loc.index < pos) break;
    }
    return this.raise(toParseError, at, details);
  }
  updateContext(prevType) {}
  unexpected(loc, type) {
    throw this.raise(Errors.UnexpectedToken, loc != null ? loc : this.state.startLoc, {
      expected: type ? tokenLabelName(type) : null
    });
  }
  expectPlugin(pluginName, loc) {
    if (this.hasPlugin(pluginName)) {
      return true;
    }
    throw this.raise(Errors.MissingPlugin, loc != null ? loc : this.state.startLoc, {
      missingPlugin: [pluginName]
    });
  }
  expectOnePlugin(pluginNames) {
    if (!pluginNames.some(name => this.hasPlugin(name))) {
      throw this.raise(Errors.MissingOneOfPlugins, this.state.startLoc, {
        missingPlugin: pluginNames
      });
    }
  }
  errorBuilder(error) {
    return (pos, lineStart, curLine) => {
      this.raise(error, buildPosition(pos, lineStart, curLine));
    };
  }
}
class ClassScope {
  constructor() {
    this.privateNames = new Set();
    this.loneAccessors = new Map();
    this.undefinedPrivateNames = new Map();
  }
}
class ClassScopeHandler {
  constructor(parser) {
    this.parser = void 0;
    this.stack = [];
    this.undefinedPrivateNames = new Map();
    this.parser = parser;
  }
  current() {
    return this.stack[this.stack.length - 1];
  }
  enter() {
    this.stack.push(new ClassScope());
  }
  exit() {
    const oldClassScope = this.stack.pop();
    const current = this.current();
    for (const [name, loc] of Array.from(oldClassScope.undefinedPrivateNames)) {
      if (current) {
        if (!current.undefinedPrivateNames.has(name)) {
          current.undefinedPrivateNames.set(name, loc);
        }
      } else {
        this.parser.raise(Errors.InvalidPrivateFieldResolution, loc, {
          identifierName: name
        });
      }
    }
  }
  declarePrivateName(name, elementType, loc) {
    const {
      privateNames,
      loneAccessors,
      undefinedPrivateNames
    } = this.current();
    let redefined = privateNames.has(name);
    if (elementType & 3) {
      const accessor = redefined && loneAccessors.get(name);
      if (accessor) {
        const oldStatic = accessor & 4;
        const newStatic = elementType & 4;
        const oldKind = accessor & 3;
        const newKind = elementType & 3;
        redefined = oldKind === newKind || oldStatic !== newStatic;
        if (!redefined) loneAccessors.delete(name);
      } else if (!redefined) {
        loneAccessors.set(name, elementType);
      }
    }
    if (redefined) {
      this.parser.raise(Errors.PrivateNameRedeclaration, loc, {
        identifierName: name
      });
    }
    privateNames.add(name);
    undefinedPrivateNames.delete(name);
  }
  usePrivateName(name, loc) {
    let classScope;
    for (classScope of this.stack) {
      if (classScope.privateNames.has(name)) return;
    }
    if (classScope) {
      classScope.undefinedPrivateNames.set(name, loc);
    } else {
      this.parser.raise(Errors.InvalidPrivateFieldResolution, loc, {
        identifierName: name
      });
    }
  }
}
class ExpressionScope {
  constructor(type = 0) {
    this.type = type;
  }
  canBeArrowParameterDeclaration() {
    return this.type === 2 || this.type === 1;
  }
  isCertainlyParameterDeclaration() {
    return this.type === 3;
  }
}
class ArrowHeadParsingScope extends ExpressionScope {
  constructor(type) {
    super(type);
    this.declarationErrors = new Map();
  }
  recordDeclarationError(ParsingErrorClass, at) {
    const index = at.index;
    this.declarationErrors.set(index, [ParsingErrorClass, at]);
  }
  clearDeclarationError(index) {
    this.declarationErrors.delete(index);
  }
  iterateErrors(iterator) {
    this.declarationErrors.forEach(iterator);
  }
}
class ExpressionScopeHandler {
  constructor(parser) {
    this.parser = void 0;
    this.stack = [new ExpressionScope()];
    this.parser = parser;
  }
  enter(scope) {
    this.stack.push(scope);
  }
  exit() {
    this.stack.pop();
  }
  recordParameterInitializerError(toParseError, node) {
    const origin = node.loc.start;
    const {
      stack
    } = this;
    let i = stack.length - 1;
    let scope = stack[i];
    while (!scope.isCertainlyParameterDeclaration()) {
      if (scope.canBeArrowParameterDeclaration()) {
        scope.recordDeclarationError(toParseError, origin);
      } else {
        return;
      }
      scope = stack[--i];
    }
    this.parser.raise(toParseError, origin);
  }
  recordArrowParameterBindingError(error, node) {
    const {
      stack
    } = this;
    const scope = stack[stack.length - 1];
    const origin = node.loc.start;
    if (scope.isCertainlyParameterDeclaration()) {
      this.parser.raise(error, origin);
    } else if (scope.canBeArrowParameterDeclaration()) {
      scope.recordDeclarationError(error, origin);
    } else {
      return;
    }
  }
  recordAsyncArrowParametersError(at) {
    const {
      stack
    } = this;
    let i = stack.length - 1;
    let scope = stack[i];
    while (scope.canBeArrowParameterDeclaration()) {
      if (scope.type === 2) {
        scope.recordDeclarationError(Errors.AwaitBindingIdentifier, at);
      }
      scope = stack[--i];
    }
  }
  validateAsPattern() {
    const {
      stack
    } = this;
    const currentScope = stack[stack.length - 1];
    if (!currentScope.canBeArrowParameterDeclaration()) return;
    currentScope.iterateErrors(([toParseError, loc]) => {
      this.parser.raise(toParseError, loc);
      let i = stack.length - 2;
      let scope = stack[i];
      while (scope.canBeArrowParameterDeclaration()) {
        scope.clearDeclarationError(loc.index);
        scope = stack[--i];
      }
    });
  }
}
function newParameterDeclarationScope() {
  return new ExpressionScope(3);
}
function newArrowHeadScope() {
  return new ArrowHeadParsingScope(1);
}
function newAsyncArrowScope() {
  return new ArrowHeadParsingScope(2);
}
function newExpressionScope() {
  return new ExpressionScope();
}
class ProductionParameterHandler {
  constructor() {
    this.stacks = [];
  }
  enter(flags) {
    this.stacks.push(flags);
  }
  exit() {
    this.stacks.pop();
  }
  currentFlags() {
    return this.stacks[this.stacks.length - 1];
  }
  get hasAwait() {
    return (this.currentFlags() & 2) > 0;
  }
  get hasYield() {
    return (this.currentFlags() & 1) > 0;
  }
  get hasReturn() {
    return (this.currentFlags() & 4) > 0;
  }
  get hasIn() {
    return (this.currentFlags() & 8) > 0;
  }
}
function functionFlags(isAsync, isGenerator) {
  return (isAsync ? 2 : 0) | (isGenerator ? 1 : 0);
}
class UtilParser extends Tokenizer {
  addExtra(node, key, value, enumerable = true) {
    if (!node) return;
    const extra = node.extra = node.extra || {};
    if (enumerable) {
      extra[key] = value;
    } else {
      Object.defineProperty(extra, key, {
        enumerable,
        value
      });
    }
  }
  isContextual(token) {
    return this.state.type === token && !this.state.containsEsc;
  }
  isUnparsedContextual(nameStart, name) {
    const nameEnd = nameStart + name.length;
    if (this.input.slice(nameStart, nameEnd) === name) {
      const nextCh = this.input.charCodeAt(nameEnd);
      return !(isIdentifierChar(nextCh) || (nextCh & 0xfc00) === 0xd800);
    }
    return false;
  }
  isLookaheadContextual(name) {
    const next = this.nextTokenStart();
    return this.isUnparsedContextual(next, name);
  }
  eatContextual(token) {
    if (this.isContextual(token)) {
      this.next();
      return true;
    }
    return false;
  }
  expectContextual(token, toParseError) {
    if (!this.eatContextual(token)) {
      if (toParseError != null) {
        throw this.raise(toParseError, this.state.startLoc);
      }
      this.unexpected(null, token);
    }
  }
  canInsertSemicolon() {
    return this.match(139) || this.match(8) || this.hasPrecedingLineBreak();
  }
  hasPrecedingLineBreak() {
    return lineBreak.test(this.input.slice(this.state.lastTokEndLoc.index, this.state.start));
  }
  hasFollowingLineBreak() {
    skipWhiteSpaceToLineBreak.lastIndex = this.state.end;
    return skipWhiteSpaceToLineBreak.test(this.input);
  }
  isLineTerminator() {
    return this.eat(13) || this.canInsertSemicolon();
  }
  semicolon(allowAsi = true) {
    if (allowAsi ? this.isLineTerminator() : this.eat(13)) return;
    this.raise(Errors.MissingSemicolon, this.state.lastTokEndLoc);
  }
  expect(type, loc) {
    this.eat(type) || this.unexpected(loc, type);
  }
  tryParse(fn, oldState = this.state.clone()) {
    const abortSignal = {
      node: null
    };
    try {
      const node = fn((node = null) => {
        abortSignal.node = node;
        throw abortSignal;
      });
      if (this.state.errors.length > oldState.errors.length) {
        const failState = this.state;
        this.state = oldState;
        this.state.tokensLength = failState.tokensLength;
        return {
          node,
          error: failState.errors[oldState.errors.length],
          thrown: false,
          aborted: false,
          failState
        };
      }
      return {
        node,
        error: null,
        thrown: false,
        aborted: false,
        failState: null
      };
    } catch (error) {
      const failState = this.state;
      this.state = oldState;
      if (error instanceof SyntaxError) {
        return {
          node: null,
          error,
          thrown: true,
          aborted: false,
          failState
        };
      }
      if (error === abortSignal) {
        return {
          node: abortSignal.node,
          error: null,
          thrown: false,
          aborted: true,
          failState
        };
      }
      throw error;
    }
  }
  checkExpressionErrors(refExpressionErrors, andThrow) {
    if (!refExpressionErrors) return false;
    const {
      shorthandAssignLoc,
      doubleProtoLoc,
      privateKeyLoc,
      optionalParametersLoc
    } = refExpressionErrors;
    const hasErrors = !!shorthandAssignLoc || !!doubleProtoLoc || !!optionalParametersLoc || !!privateKeyLoc;
    if (!andThrow) {
      return hasErrors;
    }
    if (shorthandAssignLoc != null) {
      this.raise(Errors.InvalidCoverInitializedName, shorthandAssignLoc);
    }
    if (doubleProtoLoc != null) {
      this.raise(Errors.DuplicateProto, doubleProtoLoc);
    }
    if (privateKeyLoc != null) {
      this.raise(Errors.UnexpectedPrivateField, privateKeyLoc);
    }
    if (optionalParametersLoc != null) {
      this.unexpected(optionalParametersLoc);
    }
  }
  isLiteralPropertyName() {
    return tokenIsLiteralPropertyName(this.state.type);
  }
  isPrivateName(node) {
    return node.type === "PrivateName";
  }
  getPrivateNameSV(node) {
    return node.id.name;
  }
  hasPropertyAsPrivateName(node) {
    return (node.type === "MemberExpression" || node.type === "OptionalMemberExpression") && this.isPrivateName(node.property);
  }
  isObjectProperty(node) {
    return node.type === "ObjectProperty";
  }
  isObjectMethod(node) {
    return node.type === "ObjectMethod";
  }
  initializeScopes(inModule = this.options.sourceType === "module") {
    const oldLabels = this.state.labels;
    this.state.labels = [];
    const oldExportedIdentifiers = this.exportedIdentifiers;
    this.exportedIdentifiers = new Set();
    const oldInModule = this.inModule;
    this.inModule = inModule;
    const oldScope = this.scope;
    const ScopeHandler = this.getScopeHandler();
    this.scope = new ScopeHandler(this, inModule);
    const oldProdParam = this.prodParam;
    this.prodParam = new ProductionParameterHandler();
    const oldClassScope = this.classScope;
    this.classScope = new ClassScopeHandler(this);
    const oldExpressionScope = this.expressionScope;
    this.expressionScope = new ExpressionScopeHandler(this);
    return () => {
      this.state.labels = oldLabels;
      this.exportedIdentifiers = oldExportedIdentifiers;
      this.inModule = oldInModule;
      this.scope = oldScope;
      this.prodParam = oldProdParam;
      this.classScope = oldClassScope;
      this.expressionScope = oldExpressionScope;
    };
  }
  enterInitialScopes() {
    let paramFlags = 0;
    if (this.inModule) {
      paramFlags |= 2;
    }
    this.scope.enter(1);
    this.prodParam.enter(paramFlags);
  }
  checkDestructuringPrivate(refExpressionErrors) {
    const {
      privateKeyLoc
    } = refExpressionErrors;
    if (privateKeyLoc !== null) {
      this.expectPlugin("destructuringPrivate", privateKeyLoc);
    }
  }
}
class ExpressionErrors {
  constructor() {
    this.shorthandAssignLoc = null;
    this.doubleProtoLoc = null;
    this.privateKeyLoc = null;
    this.optionalParametersLoc = null;
  }
}
class Node {
  constructor(parser, pos, loc) {
    this.type = "";
    this.start = pos;
    this.end = 0;
    this.loc = new SourceLocation$1(loc);
    if (parser != null && parser.options.ranges) this.range = [pos, 0];
    if (parser != null && parser.filename) this.loc.filename = parser.filename;
  }
}
const NodePrototype = Node.prototype;
{
  NodePrototype.__clone = function () {
    const newNode = new Node(undefined, this.start, this.loc.start);
    const keys = Object.keys(this);
    for (let i = 0, length = keys.length; i < length; i++) {
      const key = keys[i];
      if (key !== "leadingComments" && key !== "trailingComments" && key !== "innerComments") {
        newNode[key] = this[key];
      }
    }
    return newNode;
  };
}
function clonePlaceholder(node) {
  return cloneIdentifier(node);
}
function cloneIdentifier(node) {
  const {
    type,
    start,
    end,
    loc,
    range,
    extra,
    name
  } = node;
  const cloned = Object.create(NodePrototype);
  cloned.type = type;
  cloned.start = start;
  cloned.end = end;
  cloned.loc = loc;
  cloned.range = range;
  cloned.extra = extra;
  cloned.name = name;
  if (type === "Placeholder") {
    cloned.expectedNode = node.expectedNode;
  }
  return cloned;
}
function cloneStringLiteral(node) {
  const {
    type,
    start,
    end,
    loc,
    range,
    extra
  } = node;
  if (type === "Placeholder") {
    return clonePlaceholder(node);
  }
  const cloned = Object.create(NodePrototype);
  cloned.type = type;
  cloned.start = start;
  cloned.end = end;
  cloned.loc = loc;
  cloned.range = range;
  if (node.raw !== undefined) {
    cloned.raw = node.raw;
  } else {
    cloned.extra = extra;
  }
  cloned.value = node.value;
  return cloned;
}
class NodeUtils extends UtilParser {
  startNode() {
    const loc = this.state.startLoc;
    return new Node(this, loc.index, loc);
  }
  startNodeAt(loc) {
    return new Node(this, loc.index, loc);
  }
  startNodeAtNode(type) {
    return this.startNodeAt(type.loc.start);
  }
  finishNode(node, type) {
    return this.finishNodeAt(node, type, this.state.lastTokEndLoc);
  }
  finishNodeAt(node, type, endLoc) {
    node.type = type;
    node.end = endLoc.index;
    node.loc.end = endLoc;
    if (this.options.ranges) node.range[1] = endLoc.index;
    if (this.options.attachComment) this.processComment(node);
    return node;
  }
  resetStartLocation(node, startLoc) {
    node.start = startLoc.index;
    node.loc.start = startLoc;
    if (this.options.ranges) node.range[0] = startLoc.index;
  }
  resetEndLocation(node, endLoc = this.state.lastTokEndLoc) {
    node.end = endLoc.index;
    node.loc.end = endLoc;
    if (this.options.ranges) node.range[1] = endLoc.index;
  }
  resetStartLocationFromNode(node, locationNode) {
    this.resetStartLocation(node, locationNode.loc.start);
  }
}
const reservedTypes = new Set(["_", "any", "bool", "boolean", "empty", "extends", "false", "interface", "mixed", "null", "number", "static", "string", "true", "typeof", "void"]);
const FlowErrors = ParseErrorEnum`flow`({
  AmbiguousConditionalArrow: "Ambiguous expression: wrap the arrow functions in parentheses to disambiguate.",
  AmbiguousDeclareModuleKind: "Found both `declare module.exports` and `declare export` in the same module. Modules can only have 1 since they are either an ES module or they are a CommonJS module.",
  AssignReservedType: ({
    reservedType
  }) => `Cannot overwrite reserved type ${reservedType}.`,
  DeclareClassElement: "The `declare` modifier can only appear on class fields.",
  DeclareClassFieldInitializer: "Initializers are not allowed in fields with the `declare` modifier.",
  DuplicateDeclareModuleExports: "Duplicate `declare module.exports` statement.",
  EnumBooleanMemberNotInitialized: ({
    memberName,
    enumName
  }) => `Boolean enum members need to be initialized. Use either \`${memberName} = true,\` or \`${memberName} = false,\` in enum \`${enumName}\`.`,
  EnumDuplicateMemberName: ({
    memberName,
    enumName
  }) => `Enum member names need to be unique, but the name \`${memberName}\` has already been used before in enum \`${enumName}\`.`,
  EnumInconsistentMemberValues: ({
    enumName
  }) => `Enum \`${enumName}\` has inconsistent member initializers. Either use no initializers, or consistently use literals (either booleans, numbers, or strings) for all member initializers.`,
  EnumInvalidExplicitType: ({
    invalidEnumType,
    enumName
  }) => `Enum type \`${invalidEnumType}\` is not valid. Use one of \`boolean\`, \`number\`, \`string\`, or \`symbol\` in enum \`${enumName}\`.`,
  EnumInvalidExplicitTypeUnknownSupplied: ({
    enumName
  }) => `Supplied enum type is not valid. Use one of \`boolean\`, \`number\`, \`string\`, or \`symbol\` in enum \`${enumName}\`.`,
  EnumInvalidMemberInitializerPrimaryType: ({
    enumName,
    memberName,
    explicitType
  }) => `Enum \`${enumName}\` has type \`${explicitType}\`, so the initializer of \`${memberName}\` needs to be a ${explicitType} literal.`,
  EnumInvalidMemberInitializerSymbolType: ({
    enumName,
    memberName
  }) => `Symbol enum members cannot be initialized. Use \`${memberName},\` in enum \`${enumName}\`.`,
  EnumInvalidMemberInitializerUnknownType: ({
    enumName,
    memberName
  }) => `The enum member initializer for \`${memberName}\` needs to be a literal (either a boolean, number, or string) in enum \`${enumName}\`.`,
  EnumInvalidMemberName: ({
    enumName,
    memberName,
    suggestion
  }) => `Enum member names cannot start with lowercase 'a' through 'z'. Instead of using \`${memberName}\`, consider using \`${suggestion}\`, in enum \`${enumName}\`.`,
  EnumNumberMemberNotInitialized: ({
    enumName,
    memberName
  }) => `Number enum members need to be initialized, e.g. \`${memberName} = 1\` in enum \`${enumName}\`.`,
  EnumStringMemberInconsistentlyInitialized: ({
    enumName
  }) => `String enum members need to consistently either all use initializers, or use no initializers, in enum \`${enumName}\`.`,
  GetterMayNotHaveThisParam: "A getter cannot have a `this` parameter.",
  ImportReflectionHasImportType: "An `import module` declaration can not use `type` or `typeof` keyword.",
  ImportTypeShorthandOnlyInPureImport: "The `type` and `typeof` keywords on named imports can only be used on regular `import` statements. It cannot be used with `import type` or `import typeof` statements.",
  InexactInsideExact: "Explicit inexact syntax cannot appear inside an explicit exact object type.",
  InexactInsideNonObject: "Explicit inexact syntax cannot appear in class or interface definitions.",
  InexactVariance: "Explicit inexact syntax cannot have variance.",
  InvalidNonTypeImportInDeclareModule: "Imports within a `declare module` body must always be `import type` or `import typeof`.",
  MissingTypeParamDefault: "Type parameter declaration needs a default, since a preceding type parameter declaration has a default.",
  NestedDeclareModule: "`declare module` cannot be used inside another `declare module`.",
  NestedFlowComment: "Cannot have a flow comment inside another flow comment.",
  PatternIsOptional: Object.assign({
    message: "A binding pattern parameter cannot be optional in an implementation signature."
  }, {
    reasonCode: "OptionalBindingPattern"
  }),
  SetterMayNotHaveThisParam: "A setter cannot have a `this` parameter.",
  SpreadVariance: "Spread properties cannot have variance.",
  ThisParamAnnotationRequired: "A type annotation is required for the `this` parameter.",
  ThisParamBannedInConstructor: "Constructors cannot have a `this` parameter; constructors don't bind `this` like other functions.",
  ThisParamMayNotBeOptional: "The `this` parameter cannot be optional.",
  ThisParamMustBeFirst: "The `this` parameter must be the first function parameter.",
  ThisParamNoDefault: "The `this` parameter may not have a default value.",
  TypeBeforeInitializer: "Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`.",
  TypeCastInPattern: "The type cast expression is expected to be wrapped with parenthesis.",
  UnexpectedExplicitInexactInObject: "Explicit inexact syntax must appear at the end of an inexact object.",
  UnexpectedReservedType: ({
    reservedType
  }) => `Unexpected reserved type ${reservedType}.`,
  UnexpectedReservedUnderscore: "`_` is only allowed as a type argument to call or new.",
  UnexpectedSpaceBetweenModuloChecks: "Spaces between `%` and `checks` are not allowed here.",
  UnexpectedSpreadType: "Spread operator cannot appear in class or interface definitions.",
  UnexpectedSubtractionOperand: 'Unexpected token, expected "number" or "bigint".',
  UnexpectedTokenAfterTypeParameter: "Expected an arrow function after this type parameter declaration.",
  UnexpectedTypeParameterBeforeAsyncArrowFunction: "Type parameters must come after the async keyword, e.g. instead of `<T> async () => {}`, use `async <T>() => {}`.",
  UnsupportedDeclareExportKind: ({
    unsupportedExportKind,
    suggestion
  }) => `\`declare export ${unsupportedExportKind}\` is not supported. Use \`${suggestion}\` instead.`,
  UnsupportedStatementInDeclareModule: "Only declares and type imports are allowed inside declare module.",
  UnterminatedFlowComment: "Unterminated flow-comment."
});
function isEsModuleType(bodyElement) {
  return bodyElement.type === "DeclareExportAllDeclaration" || bodyElement.type === "DeclareExportDeclaration" && (!bodyElement.declaration || bodyElement.declaration.type !== "TypeAlias" && bodyElement.declaration.type !== "InterfaceDeclaration");
}
function hasTypeImportKind(node) {
  return node.importKind === "type" || node.importKind === "typeof";
}
const exportSuggestions = {
  const: "declare export var",
  let: "declare export var",
  type: "export type",
  interface: "export interface"
};
function partition(list, test) {
  const list1 = [];
  const list2 = [];
  for (let i = 0; i < list.length; i++) {
    (test(list[i], i, list) ? list1 : list2).push(list[i]);
  }
  return [list1, list2];
}
const FLOW_PRAGMA_REGEX = /\*?\s*@((?:no)?flow)\b/;
var flow = superClass => class FlowParserMixin extends superClass {
  constructor(...args) {
    super(...args);
    this.flowPragma = undefined;
  }
  getScopeHandler() {
    return FlowScopeHandler;
  }
  shouldParseTypes() {
    return this.getPluginOption("flow", "all") || this.flowPragma === "flow";
  }
  shouldParseEnums() {
    return !!this.getPluginOption("flow", "enums");
  }
  finishToken(type, val) {
    if (type !== 133 && type !== 13 && type !== 28) {
      if (this.flowPragma === undefined) {
        this.flowPragma = null;
      }
    }
    super.finishToken(type, val);
  }
  addComment(comment) {
    if (this.flowPragma === undefined) {
      const matches = FLOW_PRAGMA_REGEX.exec(comment.value);
      if (!matches) ;else if (matches[1] === "flow") {
        this.flowPragma = "flow";
      } else if (matches[1] === "noflow") {
        this.flowPragma = "noflow";
      } else {
        throw new Error("Unexpected flow pragma");
      }
    }
    super.addComment(comment);
  }
  flowParseTypeInitialiser(tok) {
    const oldInType = this.state.inType;
    this.state.inType = true;
    this.expect(tok || 14);
    const type = this.flowParseType();
    this.state.inType = oldInType;
    return type;
  }
  flowParsePredicate() {
    const node = this.startNode();
    const moduloLoc = this.state.startLoc;
    this.next();
    this.expectContextual(110);
    if (this.state.lastTokStartLoc.index > moduloLoc.index + 1) {
      this.raise(FlowErrors.UnexpectedSpaceBetweenModuloChecks, moduloLoc);
    }
    if (this.eat(10)) {
      node.value = super.parseExpression();
      this.expect(11);
      return this.finishNode(node, "DeclaredPredicate");
    } else {
      return this.finishNode(node, "InferredPredicate");
    }
  }
  flowParseTypeAndPredicateInitialiser() {
    const oldInType = this.state.inType;
    this.state.inType = true;
    this.expect(14);
    let type = null;
    let predicate = null;
    if (this.match(54)) {
      this.state.inType = oldInType;
      predicate = this.flowParsePredicate();
    } else {
      type = this.flowParseType();
      this.state.inType = oldInType;
      if (this.match(54)) {
        predicate = this.flowParsePredicate();
      }
    }
    return [type, predicate];
  }
  flowParseDeclareClass(node) {
    this.next();
    this.flowParseInterfaceish(node, true);
    return this.finishNode(node, "DeclareClass");
  }
  flowParseDeclareFunction(node) {
    this.next();
    const id = node.id = this.parseIdentifier();
    const typeNode = this.startNode();
    const typeContainer = this.startNode();
    if (this.match(47)) {
      typeNode.typeParameters = this.flowParseTypeParameterDeclaration();
    } else {
      typeNode.typeParameters = null;
    }
    this.expect(10);
    const tmp = this.flowParseFunctionTypeParams();
    typeNode.params = tmp.params;
    typeNode.rest = tmp.rest;
    typeNode.this = tmp._this;
    this.expect(11);
    [typeNode.returnType, node.predicate] = this.flowParseTypeAndPredicateInitialiser();
    typeContainer.typeAnnotation = this.finishNode(typeNode, "FunctionTypeAnnotation");
    id.typeAnnotation = this.finishNode(typeContainer, "TypeAnnotation");
    this.resetEndLocation(id);
    this.semicolon();
    this.scope.declareName(node.id.name, 2048, node.id.loc.start);
    return this.finishNode(node, "DeclareFunction");
  }
  flowParseDeclare(node, insideModule) {
    if (this.match(80)) {
      return this.flowParseDeclareClass(node);
    } else if (this.match(68)) {
      return this.flowParseDeclareFunction(node);
    } else if (this.match(74)) {
      return this.flowParseDeclareVariable(node);
    } else if (this.eatContextual(127)) {
      if (this.match(16)) {
        return this.flowParseDeclareModuleExports(node);
      } else {
        if (insideModule) {
          this.raise(FlowErrors.NestedDeclareModule, this.state.lastTokStartLoc);
        }
        return this.flowParseDeclareModule(node);
      }
    } else if (this.isContextual(130)) {
      return this.flowParseDeclareTypeAlias(node);
    } else if (this.isContextual(131)) {
      return this.flowParseDeclareOpaqueType(node);
    } else if (this.isContextual(129)) {
      return this.flowParseDeclareInterface(node);
    } else if (this.match(82)) {
      return this.flowParseDeclareExportDeclaration(node, insideModule);
    } else {
      this.unexpected();
    }
  }
  flowParseDeclareVariable(node) {
    this.next();
    node.id = this.flowParseTypeAnnotatableIdentifier(true);
    this.scope.declareName(node.id.name, 5, node.id.loc.start);
    this.semicolon();
    return this.finishNode(node, "DeclareVariable");
  }
  flowParseDeclareModule(node) {
    this.scope.enter(0);
    if (this.match(133)) {
      node.id = super.parseExprAtom();
    } else {
      node.id = this.parseIdentifier();
    }
    const bodyNode = node.body = this.startNode();
    const body = bodyNode.body = [];
    this.expect(5);
    while (!this.match(8)) {
      let bodyNode = this.startNode();
      if (this.match(83)) {
        this.next();
        if (!this.isContextual(130) && !this.match(87)) {
          this.raise(FlowErrors.InvalidNonTypeImportInDeclareModule, this.state.lastTokStartLoc);
        }
        super.parseImport(bodyNode);
      } else {
        this.expectContextual(125, FlowErrors.UnsupportedStatementInDeclareModule);
        bodyNode = this.flowParseDeclare(bodyNode, true);
      }
      body.push(bodyNode);
    }
    this.scope.exit();
    this.expect(8);
    this.finishNode(bodyNode, "BlockStatement");
    let kind = null;
    let hasModuleExport = false;
    body.forEach(bodyElement => {
      if (isEsModuleType(bodyElement)) {
        if (kind === "CommonJS") {
          this.raise(FlowErrors.AmbiguousDeclareModuleKind, bodyElement);
        }
        kind = "ES";
      } else if (bodyElement.type === "DeclareModuleExports") {
        if (hasModuleExport) {
          this.raise(FlowErrors.DuplicateDeclareModuleExports, bodyElement);
        }
        if (kind === "ES") {
          this.raise(FlowErrors.AmbiguousDeclareModuleKind, bodyElement);
        }
        kind = "CommonJS";
        hasModuleExport = true;
      }
    });
    node.kind = kind || "CommonJS";
    return this.finishNode(node, "DeclareModule");
  }
  flowParseDeclareExportDeclaration(node, insideModule) {
    this.expect(82);
    if (this.eat(65)) {
      if (this.match(68) || this.match(80)) {
        node.declaration = this.flowParseDeclare(this.startNode());
      } else {
        node.declaration = this.flowParseType();
        this.semicolon();
      }
      node.default = true;
      return this.finishNode(node, "DeclareExportDeclaration");
    } else {
      if (this.match(75) || this.isLet() || (this.isContextual(130) || this.isContextual(129)) && !insideModule) {
        const label = this.state.value;
        throw this.raise(FlowErrors.UnsupportedDeclareExportKind, this.state.startLoc, {
          unsupportedExportKind: label,
          suggestion: exportSuggestions[label]
        });
      }
      if (this.match(74) || this.match(68) || this.match(80) || this.isContextual(131)) {
        node.declaration = this.flowParseDeclare(this.startNode());
        node.default = false;
        return this.finishNode(node, "DeclareExportDeclaration");
      } else if (this.match(55) || this.match(5) || this.isContextual(129) || this.isContextual(130) || this.isContextual(131)) {
        node = this.parseExport(node, null);
        if (node.type === "ExportNamedDeclaration") {
          node.type = "ExportDeclaration";
          node.default = false;
          delete node.exportKind;
        }
        node.type = "Declare" + node.type;
        return node;
      }
    }
    this.unexpected();
  }
  flowParseDeclareModuleExports(node) {
    this.next();
    this.expectContextual(111);
    node.typeAnnotation = this.flowParseTypeAnnotation();
    this.semicolon();
    return this.finishNode(node, "DeclareModuleExports");
  }
  flowParseDeclareTypeAlias(node) {
    this.next();
    const finished = this.flowParseTypeAlias(node);
    finished.type = "DeclareTypeAlias";
    return finished;
  }
  flowParseDeclareOpaqueType(node) {
    this.next();
    const finished = this.flowParseOpaqueType(node, true);
    finished.type = "DeclareOpaqueType";
    return finished;
  }
  flowParseDeclareInterface(node) {
    this.next();
    this.flowParseInterfaceish(node, false);
    return this.finishNode(node, "DeclareInterface");
  }
  flowParseInterfaceish(node, isClass) {
    node.id = this.flowParseRestrictedIdentifier(!isClass, true);
    this.scope.declareName(node.id.name, isClass ? 17 : 8201, node.id.loc.start);
    if (this.match(47)) {
      node.typeParameters = this.flowParseTypeParameterDeclaration();
    } else {
      node.typeParameters = null;
    }
    node.extends = [];
    if (this.eat(81)) {
      do {
        node.extends.push(this.flowParseInterfaceExtends());
      } while (!isClass && this.eat(12));
    }
    if (isClass) {
      node.implements = [];
      node.mixins = [];
      if (this.eatContextual(117)) {
        do {
          node.mixins.push(this.flowParseInterfaceExtends());
        } while (this.eat(12));
      }
      if (this.eatContextual(113)) {
        do {
          node.implements.push(this.flowParseInterfaceExtends());
        } while (this.eat(12));
      }
    }
    node.body = this.flowParseObjectType({
      allowStatic: isClass,
      allowExact: false,
      allowSpread: false,
      allowProto: isClass,
      allowInexact: false
    });
  }
  flowParseInterfaceExtends() {
    const node = this.startNode();
    node.id = this.flowParseQualifiedTypeIdentifier();
    if (this.match(47)) {
      node.typeParameters = this.flowParseTypeParameterInstantiation();
    } else {
      node.typeParameters = null;
    }
    return this.finishNode(node, "InterfaceExtends");
  }
  flowParseInterface(node) {
    this.flowParseInterfaceish(node, false);
    return this.finishNode(node, "InterfaceDeclaration");
  }
  checkNotUnderscore(word) {
    if (word === "_") {
      this.raise(FlowErrors.UnexpectedReservedUnderscore, this.state.startLoc);
    }
  }
  checkReservedType(word, startLoc, declaration) {
    if (!reservedTypes.has(word)) return;
    this.raise(declaration ? FlowErrors.AssignReservedType : FlowErrors.UnexpectedReservedType, startLoc, {
      reservedType: word
    });
  }
  flowParseRestrictedIdentifier(liberal, declaration) {
    this.checkReservedType(this.state.value, this.state.startLoc, declaration);
    return this.parseIdentifier(liberal);
  }
  flowParseTypeAlias(node) {
    node.id = this.flowParseRestrictedIdentifier(false, true);
    this.scope.declareName(node.id.name, 8201, node.id.loc.start);
    if (this.match(47)) {
      node.typeParameters = this.flowParseTypeParameterDeclaration();
    } else {
      node.typeParameters = null;
    }
    node.right = this.flowParseTypeInitialiser(29);
    this.semicolon();
    return this.finishNode(node, "TypeAlias");
  }
  flowParseOpaqueType(node, declare) {
    this.expectContextual(130);
    node.id = this.flowParseRestrictedIdentifier(true, true);
    this.scope.declareName(node.id.name, 8201, node.id.loc.start);
    if (this.match(47)) {
      node.typeParameters = this.flowParseTypeParameterDeclaration();
    } else {
      node.typeParameters = null;
    }
    node.supertype = null;
    if (this.match(14)) {
      node.supertype = this.flowParseTypeInitialiser(14);
    }
    node.impltype = null;
    if (!declare) {
      node.impltype = this.flowParseTypeInitialiser(29);
    }
    this.semicolon();
    return this.finishNode(node, "OpaqueType");
  }
  flowParseTypeParameter(requireDefault = false) {
    const nodeStartLoc = this.state.startLoc;
    const node = this.startNode();
    const variance = this.flowParseVariance();
    const ident = this.flowParseTypeAnnotatableIdentifier();
    node.name = ident.name;
    node.variance = variance;
    node.bound = ident.typeAnnotation;
    if (this.match(29)) {
      this.eat(29);
      node.default = this.flowParseType();
    } else {
      if (requireDefault) {
        this.raise(FlowErrors.MissingTypeParamDefault, nodeStartLoc);
      }
    }
    return this.finishNode(node, "TypeParameter");
  }
  flowParseTypeParameterDeclaration() {
    const oldInType = this.state.inType;
    const node = this.startNode();
    node.params = [];
    this.state.inType = true;
    if (this.match(47) || this.match(142)) {
      this.next();
    } else {
      this.unexpected();
    }
    let defaultRequired = false;
    do {
      const typeParameter = this.flowParseTypeParameter(defaultRequired);
      node.params.push(typeParameter);
      if (typeParameter.default) {
        defaultRequired = true;
      }
      if (!this.match(48)) {
        this.expect(12);
      }
    } while (!this.match(48));
    this.expect(48);
    this.state.inType = oldInType;
    return this.finishNode(node, "TypeParameterDeclaration");
  }
  flowParseTypeParameterInstantiation() {
    const node = this.startNode();
    const oldInType = this.state.inType;
    node.params = [];
    this.state.inType = true;
    this.expect(47);
    const oldNoAnonFunctionType = this.state.noAnonFunctionType;
    this.state.noAnonFunctionType = false;
    while (!this.match(48)) {
      node.params.push(this.flowParseType());
      if (!this.match(48)) {
        this.expect(12);
      }
    }
    this.state.noAnonFunctionType = oldNoAnonFunctionType;
    this.expect(48);
    this.state.inType = oldInType;
    return this.finishNode(node, "TypeParameterInstantiation");
  }
  flowParseTypeParameterInstantiationCallOrNew() {
    const node = this.startNode();
    const oldInType = this.state.inType;
    node.params = [];
    this.state.inType = true;
    this.expect(47);
    while (!this.match(48)) {
      node.params.push(this.flowParseTypeOrImplicitInstantiation());
      if (!this.match(48)) {
        this.expect(12);
      }
    }
    this.expect(48);
    this.state.inType = oldInType;
    return this.finishNode(node, "TypeParameterInstantiation");
  }
  flowParseInterfaceType() {
    const node = this.startNode();
    this.expectContextual(129);
    node.extends = [];
    if (this.eat(81)) {
      do {
        node.extends.push(this.flowParseInterfaceExtends());
      } while (this.eat(12));
    }
    node.body = this.flowParseObjectType({
      allowStatic: false,
      allowExact: false,
      allowSpread: false,
      allowProto: false,
      allowInexact: false
    });
    return this.finishNode(node, "InterfaceTypeAnnotation");
  }
  flowParseObjectPropertyKey() {
    return this.match(134) || this.match(133) ? super.parseExprAtom() : this.parseIdentifier(true);
  }
  flowParseObjectTypeIndexer(node, isStatic, variance) {
    node.static = isStatic;
    if (this.lookahead().type === 14) {
      node.id = this.flowParseObjectPropertyKey();
      node.key = this.flowParseTypeInitialiser();
    } else {
      node.id = null;
      node.key = this.flowParseType();
    }
    this.expect(3);
    node.value = this.flowParseTypeInitialiser();
    node.variance = variance;
    return this.finishNode(node, "ObjectTypeIndexer");
  }
  flowParseObjectTypeInternalSlot(node, isStatic) {
    node.static = isStatic;
    node.id = this.flowParseObjectPropertyKey();
    this.expect(3);
    this.expect(3);
    if (this.match(47) || this.match(10)) {
      node.method = true;
      node.optional = false;
      node.value = this.flowParseObjectTypeMethodish(this.startNodeAt(node.loc.start));
    } else {
      node.method = false;
      if (this.eat(17)) {
        node.optional = true;
      }
      node.value = this.flowParseTypeInitialiser();
    }
    return this.finishNode(node, "ObjectTypeInternalSlot");
  }
  flowParseObjectTypeMethodish(node) {
    node.params = [];
    node.rest = null;
    node.typeParameters = null;
    node.this = null;
    if (this.match(47)) {
      node.typeParameters = this.flowParseTypeParameterDeclaration();
    }
    this.expect(10);
    if (this.match(78)) {
      node.this = this.flowParseFunctionTypeParam(true);
      node.this.name = null;
      if (!this.match(11)) {
        this.expect(12);
      }
    }
    while (!this.match(11) && !this.match(21)) {
      node.params.push(this.flowParseFunctionTypeParam(false));
      if (!this.match(11)) {
        this.expect(12);
      }
    }
    if (this.eat(21)) {
      node.rest = this.flowParseFunctionTypeParam(false);
    }
    this.expect(11);
    node.returnType = this.flowParseTypeInitialiser();
    return this.finishNode(node, "FunctionTypeAnnotation");
  }
  flowParseObjectTypeCallProperty(node, isStatic) {
    const valueNode = this.startNode();
    node.static = isStatic;
    node.value = this.flowParseObjectTypeMethodish(valueNode);
    return this.finishNode(node, "ObjectTypeCallProperty");
  }
  flowParseObjectType({
    allowStatic,
    allowExact,
    allowSpread,
    allowProto,
    allowInexact
  }) {
    const oldInType = this.state.inType;
    this.state.inType = true;
    const nodeStart = this.startNode();
    nodeStart.callProperties = [];
    nodeStart.properties = [];
    nodeStart.indexers = [];
    nodeStart.internalSlots = [];
    let endDelim;
    let exact;
    let inexact = false;
    if (allowExact && this.match(6)) {
      this.expect(6);
      endDelim = 9;
      exact = true;
    } else {
      this.expect(5);
      endDelim = 8;
      exact = false;
    }
    nodeStart.exact = exact;
    while (!this.match(endDelim)) {
      let isStatic = false;
      let protoStartLoc = null;
      let inexactStartLoc = null;
      const node = this.startNode();
      if (allowProto && this.isContextual(118)) {
        const lookahead = this.lookahead();
        if (lookahead.type !== 14 && lookahead.type !== 17) {
          this.next();
          protoStartLoc = this.state.startLoc;
          allowStatic = false;
        }
      }
      if (allowStatic && this.isContextual(106)) {
        const lookahead = this.lookahead();
        if (lookahead.type !== 14 && lookahead.type !== 17) {
          this.next();
          isStatic = true;
        }
      }
      const variance = this.flowParseVariance();
      if (this.eat(0)) {
        if (protoStartLoc != null) {
          this.unexpected(protoStartLoc);
        }
        if (this.eat(0)) {
          if (variance) {
            this.unexpected(variance.loc.start);
          }
          nodeStart.internalSlots.push(this.flowParseObjectTypeInternalSlot(node, isStatic));
        } else {
          nodeStart.indexers.push(this.flowParseObjectTypeIndexer(node, isStatic, variance));
        }
      } else if (this.match(10) || this.match(47)) {
        if (protoStartLoc != null) {
          this.unexpected(protoStartLoc);
        }
        if (variance) {
          this.unexpected(variance.loc.start);
        }
        nodeStart.callProperties.push(this.flowParseObjectTypeCallProperty(node, isStatic));
      } else {
        let kind = "init";
        if (this.isContextual(99) || this.isContextual(104)) {
          const lookahead = this.lookahead();
          if (tokenIsLiteralPropertyName(lookahead.type)) {
            kind = this.state.value;
            this.next();
          }
        }
        const propOrInexact = this.flowParseObjectTypeProperty(node, isStatic, protoStartLoc, variance, kind, allowSpread, allowInexact != null ? allowInexact : !exact);
        if (propOrInexact === null) {
          inexact = true;
          inexactStartLoc = this.state.lastTokStartLoc;
        } else {
          nodeStart.properties.push(propOrInexact);
        }
      }
      this.flowObjectTypeSemicolon();
      if (inexactStartLoc && !this.match(8) && !this.match(9)) {
        this.raise(FlowErrors.UnexpectedExplicitInexactInObject, inexactStartLoc);
      }
    }
    this.expect(endDelim);
    if (allowSpread) {
      nodeStart.inexact = inexact;
    }
    const out = this.finishNode(nodeStart, "ObjectTypeAnnotation");
    this.state.inType = oldInType;
    return out;
  }
  flowParseObjectTypeProperty(node, isStatic, protoStartLoc, variance, kind, allowSpread, allowInexact) {
    if (this.eat(21)) {
      const isInexactToken = this.match(12) || this.match(13) || this.match(8) || this.match(9);
      if (isInexactToken) {
        if (!allowSpread) {
          this.raise(FlowErrors.InexactInsideNonObject, this.state.lastTokStartLoc);
        } else if (!allowInexact) {
          this.raise(FlowErrors.InexactInsideExact, this.state.lastTokStartLoc);
        }
        if (variance) {
          this.raise(FlowErrors.InexactVariance, variance);
        }
        return null;
      }
      if (!allowSpread) {
        this.raise(FlowErrors.UnexpectedSpreadType, this.state.lastTokStartLoc);
      }
      if (protoStartLoc != null) {
        this.unexpected(protoStartLoc);
      }
      if (variance) {
        this.raise(FlowErrors.SpreadVariance, variance);
      }
      node.argument = this.flowParseType();
      return this.finishNode(node, "ObjectTypeSpreadProperty");
    } else {
      node.key = this.flowParseObjectPropertyKey();
      node.static = isStatic;
      node.proto = protoStartLoc != null;
      node.kind = kind;
      let optional = false;
      if (this.match(47) || this.match(10)) {
        node.method = true;
        if (protoStartLoc != null) {
          this.unexpected(protoStartLoc);
        }
        if (variance) {
          this.unexpected(variance.loc.start);
        }
        node.value = this.flowParseObjectTypeMethodish(this.startNodeAt(node.loc.start));
        if (kind === "get" || kind === "set") {
          this.flowCheckGetterSetterParams(node);
        }
        if (!allowSpread && node.key.name === "constructor" && node.value.this) {
          this.raise(FlowErrors.ThisParamBannedInConstructor, node.value.this);
        }
      } else {
        if (kind !== "init") this.unexpected();
        node.method = false;
        if (this.eat(17)) {
          optional = true;
        }
        node.value = this.flowParseTypeInitialiser();
        node.variance = variance;
      }
      node.optional = optional;
      return this.finishNode(node, "ObjectTypeProperty");
    }
  }
  flowCheckGetterSetterParams(property) {
    const paramCount = property.kind === "get" ? 0 : 1;
    const length = property.value.params.length + (property.value.rest ? 1 : 0);
    if (property.value.this) {
      this.raise(property.kind === "get" ? FlowErrors.GetterMayNotHaveThisParam : FlowErrors.SetterMayNotHaveThisParam, property.value.this);
    }
    if (length !== paramCount) {
      this.raise(property.kind === "get" ? Errors.BadGetterArity : Errors.BadSetterArity, property);
    }
    if (property.kind === "set" && property.value.rest) {
      this.raise(Errors.BadSetterRestParameter, property);
    }
  }
  flowObjectTypeSemicolon() {
    if (!this.eat(13) && !this.eat(12) && !this.match(8) && !this.match(9)) {
      this.unexpected();
    }
  }
  flowParseQualifiedTypeIdentifier(startLoc, id) {
    var _startLoc;
    (_startLoc = startLoc) != null ? _startLoc : startLoc = this.state.startLoc;
    let node = id || this.flowParseRestrictedIdentifier(true);
    while (this.eat(16)) {
      const node2 = this.startNodeAt(startLoc);
      node2.qualification = node;
      node2.id = this.flowParseRestrictedIdentifier(true);
      node = this.finishNode(node2, "QualifiedTypeIdentifier");
    }
    return node;
  }
  flowParseGenericType(startLoc, id) {
    const node = this.startNodeAt(startLoc);
    node.typeParameters = null;
    node.id = this.flowParseQualifiedTypeIdentifier(startLoc, id);
    if (this.match(47)) {
      node.typeParameters = this.flowParseTypeParameterInstantiation();
    }
    return this.finishNode(node, "GenericTypeAnnotation");
  }
  flowParseTypeofType() {
    const node = this.startNode();
    this.expect(87);
    node.argument = this.flowParsePrimaryType();
    return this.finishNode(node, "TypeofTypeAnnotation");
  }
  flowParseTupleType() {
    const node = this.startNode();
    node.types = [];
    this.expect(0);
    while (this.state.pos < this.length && !this.match(3)) {
      node.types.push(this.flowParseType());
      if (this.match(3)) break;
      this.expect(12);
    }
    this.expect(3);
    return this.finishNode(node, "TupleTypeAnnotation");
  }
  flowParseFunctionTypeParam(first) {
    let name = null;
    let optional = false;
    let typeAnnotation = null;
    const node = this.startNode();
    const lh = this.lookahead();
    const isThis = this.state.type === 78;
    if (lh.type === 14 || lh.type === 17) {
      if (isThis && !first) {
        this.raise(FlowErrors.ThisParamMustBeFirst, node);
      }
      name = this.parseIdentifier(isThis);
      if (this.eat(17)) {
        optional = true;
        if (isThis) {
          this.raise(FlowErrors.ThisParamMayNotBeOptional, node);
        }
      }
      typeAnnotation = this.flowParseTypeInitialiser();
    } else {
      typeAnnotation = this.flowParseType();
    }
    node.name = name;
    node.optional = optional;
    node.typeAnnotation = typeAnnotation;
    return this.finishNode(node, "FunctionTypeParam");
  }
  reinterpretTypeAsFunctionTypeParam(type) {
    const node = this.startNodeAt(type.loc.start);
    node.name = null;
    node.optional = false;
    node.typeAnnotation = type;
    return this.finishNode(node, "FunctionTypeParam");
  }
  flowParseFunctionTypeParams(params = []) {
    let rest = null;
    let _this = null;
    if (this.match(78)) {
      _this = this.flowParseFunctionTypeParam(true);
      _this.name = null;
      if (!this.match(11)) {
        this.expect(12);
      }
    }
    while (!this.match(11) && !this.match(21)) {
      params.push(this.flowParseFunctionTypeParam(false));
      if (!this.match(11)) {
        this.expect(12);
      }
    }
    if (this.eat(21)) {
      rest = this.flowParseFunctionTypeParam(false);
    }
    return {
      params,
      rest,
      _this
    };
  }
  flowIdentToTypeAnnotation(startLoc, node, id) {
    switch (id.name) {
      case "any":
        return this.finishNode(node, "AnyTypeAnnotation");
      case "bool":
      case "boolean":
        return this.finishNode(node, "BooleanTypeAnnotation");
      case "mixed":
        return this.finishNode(node, "MixedTypeAnnotation");
      case "empty":
        return this.finishNode(node, "EmptyTypeAnnotation");
      case "number":
        return this.finishNode(node, "NumberTypeAnnotation");
      case "string":
        return this.finishNode(node, "StringTypeAnnotation");
      case "symbol":
        return this.finishNode(node, "SymbolTypeAnnotation");
      default:
        this.checkNotUnderscore(id.name);
        return this.flowParseGenericType(startLoc, id);
    }
  }
  flowParsePrimaryType() {
    const startLoc = this.state.startLoc;
    const node = this.startNode();
    let tmp;
    let type;
    let isGroupedType = false;
    const oldNoAnonFunctionType = this.state.noAnonFunctionType;
    switch (this.state.type) {
      case 5:
        return this.flowParseObjectType({
          allowStatic: false,
          allowExact: false,
          allowSpread: true,
          allowProto: false,
          allowInexact: true
        });
      case 6:
        return this.flowParseObjectType({
          allowStatic: false,
          allowExact: true,
          allowSpread: true,
          allowProto: false,
          allowInexact: false
        });
      case 0:
        this.state.noAnonFunctionType = false;
        type = this.flowParseTupleType();
        this.state.noAnonFunctionType = oldNoAnonFunctionType;
        return type;
      case 47:
        node.typeParameters = this.flowParseTypeParameterDeclaration();
        this.expect(10);
        tmp = this.flowParseFunctionTypeParams();
        node.params = tmp.params;
        node.rest = tmp.rest;
        node.this = tmp._this;
        this.expect(11);
        this.expect(19);
        node.returnType = this.flowParseType();
        return this.finishNode(node, "FunctionTypeAnnotation");
      case 10:
        this.next();
        if (!this.match(11) && !this.match(21)) {
          if (tokenIsIdentifier(this.state.type) || this.match(78)) {
            const token = this.lookahead().type;
            isGroupedType = token !== 17 && token !== 14;
          } else {
            isGroupedType = true;
          }
        }
        if (isGroupedType) {
          this.state.noAnonFunctionType = false;
          type = this.flowParseType();
          this.state.noAnonFunctionType = oldNoAnonFunctionType;
          if (this.state.noAnonFunctionType || !(this.match(12) || this.match(11) && this.lookahead().type === 19)) {
            this.expect(11);
            return type;
          } else {
            this.eat(12);
          }
        }
        if (type) {
          tmp = this.flowParseFunctionTypeParams([this.reinterpretTypeAsFunctionTypeParam(type)]);
        } else {
          tmp = this.flowParseFunctionTypeParams();
        }
        node.params = tmp.params;
        node.rest = tmp.rest;
        node.this = tmp._this;
        this.expect(11);
        this.expect(19);
        node.returnType = this.flowParseType();
        node.typeParameters = null;
        return this.finishNode(node, "FunctionTypeAnnotation");
      case 133:
        return this.parseLiteral(this.state.value, "StringLiteralTypeAnnotation");
      case 85:
      case 86:
        node.value = this.match(85);
        this.next();
        return this.finishNode(node, "BooleanLiteralTypeAnnotation");
      case 53:
        if (this.state.value === "-") {
          this.next();
          if (this.match(134)) {
            return this.parseLiteralAtNode(-this.state.value, "NumberLiteralTypeAnnotation", node);
          }
          if (this.match(135)) {
            return this.parseLiteralAtNode(-this.state.value, "BigIntLiteralTypeAnnotation", node);
          }
          throw this.raise(FlowErrors.UnexpectedSubtractionOperand, this.state.startLoc);
        }
        this.unexpected();
        return;
      case 134:
        return this.parseLiteral(this.state.value, "NumberLiteralTypeAnnotation");
      case 135:
        return this.parseLiteral(this.state.value, "BigIntLiteralTypeAnnotation");
      case 88:
        this.next();
        return this.finishNode(node, "VoidTypeAnnotation");
      case 84:
        this.next();
        return this.finishNode(node, "NullLiteralTypeAnnotation");
      case 78:
        this.next();
        return this.finishNode(node, "ThisTypeAnnotation");
      case 55:
        this.next();
        return this.finishNode(node, "ExistsTypeAnnotation");
      case 87:
        return this.flowParseTypeofType();
      default:
        if (tokenIsKeyword(this.state.type)) {
          const label = tokenLabelName(this.state.type);
          this.next();
          return super.createIdentifier(node, label);
        } else if (tokenIsIdentifier(this.state.type)) {
          if (this.isContextual(129)) {
            return this.flowParseInterfaceType();
          }
          return this.flowIdentToTypeAnnotation(startLoc, node, this.parseIdentifier());
        }
    }
    this.unexpected();
  }
  flowParsePostfixType() {
    const startLoc = this.state.startLoc;
    let type = this.flowParsePrimaryType();
    let seenOptionalIndexedAccess = false;
    while ((this.match(0) || this.match(18)) && !this.canInsertSemicolon()) {
      const node = this.startNodeAt(startLoc);
      const optional = this.eat(18);
      seenOptionalIndexedAccess = seenOptionalIndexedAccess || optional;
      this.expect(0);
      if (!optional && this.match(3)) {
        node.elementType = type;
        this.next();
        type = this.finishNode(node, "ArrayTypeAnnotation");
      } else {
        node.objectType = type;
        node.indexType = this.flowParseType();
        this.expect(3);
        if (seenOptionalIndexedAccess) {
          node.optional = optional;
          type = this.finishNode(node, "OptionalIndexedAccessType");
        } else {
          type = this.finishNode(node, "IndexedAccessType");
        }
      }
    }
    return type;
  }
  flowParsePrefixType() {
    const node = this.startNode();
    if (this.eat(17)) {
      node.typeAnnotation = this.flowParsePrefixType();
      return this.finishNode(node, "NullableTypeAnnotation");
    } else {
      return this.flowParsePostfixType();
    }
  }
  flowParseAnonFunctionWithoutParens() {
    const param = this.flowParsePrefixType();
    if (!this.state.noAnonFunctionType && this.eat(19)) {
      const node = this.startNodeAt(param.loc.start);
      node.params = [this.reinterpretTypeAsFunctionTypeParam(param)];
      node.rest = null;
      node.this = null;
      node.returnType = this.flowParseType();
      node.typeParameters = null;
      return this.finishNode(node, "FunctionTypeAnnotation");
    }
    return param;
  }
  flowParseIntersectionType() {
    const node = this.startNode();
    this.eat(45);
    const type = this.flowParseAnonFunctionWithoutParens();
    node.types = [type];
    while (this.eat(45)) {
      node.types.push(this.flowParseAnonFunctionWithoutParens());
    }
    return node.types.length === 1 ? type : this.finishNode(node, "IntersectionTypeAnnotation");
  }
  flowParseUnionType() {
    const node = this.startNode();
    this.eat(43);
    const type = this.flowParseIntersectionType();
    node.types = [type];
    while (this.eat(43)) {
      node.types.push(this.flowParseIntersectionType());
    }
    return node.types.length === 1 ? type : this.finishNode(node, "UnionTypeAnnotation");
  }
  flowParseType() {
    const oldInType = this.state.inType;
    this.state.inType = true;
    const type = this.flowParseUnionType();
    this.state.inType = oldInType;
    return type;
  }
  flowParseTypeOrImplicitInstantiation() {
    if (this.state.type === 132 && this.state.value === "_") {
      const startLoc = this.state.startLoc;
      const node = this.parseIdentifier();
      return this.flowParseGenericType(startLoc, node);
    } else {
      return this.flowParseType();
    }
  }
  flowParseTypeAnnotation() {
    const node = this.startNode();
    node.typeAnnotation = this.flowParseTypeInitialiser();
    return this.finishNode(node, "TypeAnnotation");
  }
  flowParseTypeAnnotatableIdentifier(allowPrimitiveOverride) {
    const ident = allowPrimitiveOverride ? this.parseIdentifier() : this.flowParseRestrictedIdentifier();
    if (this.match(14)) {
      ident.typeAnnotation = this.flowParseTypeAnnotation();
      this.resetEndLocation(ident);
    }
    return ident;
  }
  typeCastToParameter(node) {
    node.expression.typeAnnotation = node.typeAnnotation;
    this.resetEndLocation(node.expression, node.typeAnnotation.loc.end);
    return node.expression;
  }
  flowParseVariance() {
    let variance = null;
    if (this.match(53)) {
      variance = this.startNode();
      if (this.state.value === "+") {
        variance.kind = "plus";
      } else {
        variance.kind = "minus";
      }
      this.next();
      return this.finishNode(variance, "Variance");
    }
    return variance;
  }
  parseFunctionBody(node, allowExpressionBody, isMethod = false) {
    if (allowExpressionBody) {
      this.forwardNoArrowParamsConversionAt(node, () => super.parseFunctionBody(node, true, isMethod));
      return;
    }
    super.parseFunctionBody(node, false, isMethod);
  }
  parseFunctionBodyAndFinish(node, type, isMethod = false) {
    if (this.match(14)) {
      const typeNode = this.startNode();
      [typeNode.typeAnnotation, node.predicate] = this.flowParseTypeAndPredicateInitialiser();
      node.returnType = typeNode.typeAnnotation ? this.finishNode(typeNode, "TypeAnnotation") : null;
    }
    return super.parseFunctionBodyAndFinish(node, type, isMethod);
  }
  parseStatementLike(flags) {
    if (this.state.strict && this.isContextual(129)) {
      const lookahead = this.lookahead();
      if (tokenIsKeywordOrIdentifier(lookahead.type)) {
        const node = this.startNode();
        this.next();
        return this.flowParseInterface(node);
      }
    } else if (this.shouldParseEnums() && this.isContextual(126)) {
      const node = this.startNode();
      this.next();
      return this.flowParseEnumDeclaration(node);
    }
    const stmt = super.parseStatementLike(flags);
    if (this.flowPragma === undefined && !this.isValidDirective(stmt)) {
      this.flowPragma = null;
    }
    return stmt;
  }
  parseExpressionStatement(node, expr, decorators) {
    if (expr.type === "Identifier") {
      if (expr.name === "declare") {
        if (this.match(80) || tokenIsIdentifier(this.state.type) || this.match(68) || this.match(74) || this.match(82)) {
          return this.flowParseDeclare(node);
        }
      } else if (tokenIsIdentifier(this.state.type)) {
        if (expr.name === "interface") {
          return this.flowParseInterface(node);
        } else if (expr.name === "type") {
          return this.flowParseTypeAlias(node);
        } else if (expr.name === "opaque") {
          return this.flowParseOpaqueType(node, false);
        }
      }
    }
    return super.parseExpressionStatement(node, expr, decorators);
  }
  shouldParseExportDeclaration() {
    const {
      type
    } = this.state;
    if (tokenIsFlowInterfaceOrTypeOrOpaque(type) || this.shouldParseEnums() && type === 126) {
      return !this.state.containsEsc;
    }
    return super.shouldParseExportDeclaration();
  }
  isExportDefaultSpecifier() {
    const {
      type
    } = this.state;
    if (tokenIsFlowInterfaceOrTypeOrOpaque(type) || this.shouldParseEnums() && type === 126) {
      return this.state.containsEsc;
    }
    return super.isExportDefaultSpecifier();
  }
  parseExportDefaultExpression() {
    if (this.shouldParseEnums() && this.isContextual(126)) {
      const node = this.startNode();
      this.next();
      return this.flowParseEnumDeclaration(node);
    }
    return super.parseExportDefaultExpression();
  }
  parseConditional(expr, startLoc, refExpressionErrors) {
    if (!this.match(17)) return expr;
    if (this.state.maybeInArrowParameters) {
      const nextCh = this.lookaheadCharCode();
      if (nextCh === 44 || nextCh === 61 || nextCh === 58 || nextCh === 41) {
        this.setOptionalParametersError(refExpressionErrors);
        return expr;
      }
    }
    this.expect(17);
    const state = this.state.clone();
    const originalNoArrowAt = this.state.noArrowAt;
    const node = this.startNodeAt(startLoc);
    let {
      consequent,
      failed
    } = this.tryParseConditionalConsequent();
    let [valid, invalid] = this.getArrowLikeExpressions(consequent);
    if (failed || invalid.length > 0) {
      const noArrowAt = [...originalNoArrowAt];
      if (invalid.length > 0) {
        this.state = state;
        this.state.noArrowAt = noArrowAt;
        for (let i = 0; i < invalid.length; i++) {
          noArrowAt.push(invalid[i].start);
        }
        ({
          consequent,
          failed
        } = this.tryParseConditionalConsequent());
        [valid, invalid] = this.getArrowLikeExpressions(consequent);
      }
      if (failed && valid.length > 1) {
        this.raise(FlowErrors.AmbiguousConditionalArrow, state.startLoc);
      }
      if (failed && valid.length === 1) {
        this.state = state;
        noArrowAt.push(valid[0].start);
        this.state.noArrowAt = noArrowAt;
        ({
          consequent,
          failed
        } = this.tryParseConditionalConsequent());
      }
    }
    this.getArrowLikeExpressions(consequent, true);
    this.state.noArrowAt = originalNoArrowAt;
    this.expect(14);
    node.test = expr;
    node.consequent = consequent;
    node.alternate = this.forwardNoArrowParamsConversionAt(node, () => this.parseMaybeAssign(undefined, undefined));
    return this.finishNode(node, "ConditionalExpression");
  }
  tryParseConditionalConsequent() {
    this.state.noArrowParamsConversionAt.push(this.state.start);
    const consequent = this.parseMaybeAssignAllowIn();
    const failed = !this.match(14);
    this.state.noArrowParamsConversionAt.pop();
    return {
      consequent,
      failed
    };
  }
  getArrowLikeExpressions(node, disallowInvalid) {
    const stack = [node];
    const arrows = [];
    while (stack.length !== 0) {
      const node = stack.pop();
      if (node.type === "ArrowFunctionExpression") {
        if (node.typeParameters || !node.returnType) {
          this.finishArrowValidation(node);
        } else {
          arrows.push(node);
        }
        stack.push(node.body);
      } else if (node.type === "ConditionalExpression") {
        stack.push(node.consequent);
        stack.push(node.alternate);
      }
    }
    if (disallowInvalid) {
      arrows.forEach(node => this.finishArrowValidation(node));
      return [arrows, []];
    }
    return partition(arrows, node => node.params.every(param => this.isAssignable(param, true)));
  }
  finishArrowValidation(node) {
    var _node$extra;
    this.toAssignableList(node.params, (_node$extra = node.extra) == null ? void 0 : _node$extra.trailingCommaLoc, false);
    this.scope.enter(2 | 4);
    super.checkParams(node, false, true);
    this.scope.exit();
  }
  forwardNoArrowParamsConversionAt(node, parse) {
    let result;
    if (this.state.noArrowParamsConversionAt.indexOf(node.start) !== -1) {
      this.state.noArrowParamsConversionAt.push(this.state.start);
      result = parse();
      this.state.noArrowParamsConversionAt.pop();
    } else {
      result = parse();
    }
    return result;
  }
  parseParenItem(node, startLoc) {
    node = super.parseParenItem(node, startLoc);
    if (this.eat(17)) {
      node.optional = true;
      this.resetEndLocation(node);
    }
    if (this.match(14)) {
      const typeCastNode = this.startNodeAt(startLoc);
      typeCastNode.expression = node;
      typeCastNode.typeAnnotation = this.flowParseTypeAnnotation();
      return this.finishNode(typeCastNode, "TypeCastExpression");
    }
    return node;
  }
  assertModuleNodeAllowed(node) {
    if (node.type === "ImportDeclaration" && (node.importKind === "type" || node.importKind === "typeof") || node.type === "ExportNamedDeclaration" && node.exportKind === "type" || node.type === "ExportAllDeclaration" && node.exportKind === "type") {
      return;
    }
    super.assertModuleNodeAllowed(node);
  }
  parseExportDeclaration(node) {
    if (this.isContextual(130)) {
      node.exportKind = "type";
      const declarationNode = this.startNode();
      this.next();
      if (this.match(5)) {
        node.specifiers = this.parseExportSpecifiers(true);
        super.parseExportFrom(node);
        return null;
      } else {
        return this.flowParseTypeAlias(declarationNode);
      }
    } else if (this.isContextual(131)) {
      node.exportKind = "type";
      const declarationNode = this.startNode();
      this.next();
      return this.flowParseOpaqueType(declarationNode, false);
    } else if (this.isContextual(129)) {
      node.exportKind = "type";
      const declarationNode = this.startNode();
      this.next();
      return this.flowParseInterface(declarationNode);
    } else if (this.shouldParseEnums() && this.isContextual(126)) {
      node.exportKind = "value";
      const declarationNode = this.startNode();
      this.next();
      return this.flowParseEnumDeclaration(declarationNode);
    } else {
      return super.parseExportDeclaration(node);
    }
  }
  eatExportStar(node) {
    if (super.eatExportStar(node)) return true;
    if (this.isContextual(130) && this.lookahead().type === 55) {
      node.exportKind = "type";
      this.next();
      this.next();
      return true;
    }
    return false;
  }
  maybeParseExportNamespaceSpecifier(node) {
    const {
      startLoc
    } = this.state;
    const hasNamespace = super.maybeParseExportNamespaceSpecifier(node);
    if (hasNamespace && node.exportKind === "type") {
      this.unexpected(startLoc);
    }
    return hasNamespace;
  }
  parseClassId(node, isStatement, optionalId) {
    super.parseClassId(node, isStatement, optionalId);
    if (this.match(47)) {
      node.typeParameters = this.flowParseTypeParameterDeclaration();
    }
  }
  parseClassMember(classBody, member, state) {
    const {
      startLoc
    } = this.state;
    if (this.isContextual(125)) {
      if (super.parseClassMemberFromModifier(classBody, member)) {
        return;
      }
      member.declare = true;
    }
    super.parseClassMember(classBody, member, state);
    if (member.declare) {
      if (member.type !== "ClassProperty" && member.type !== "ClassPrivateProperty" && member.type !== "PropertyDefinition") {
        this.raise(FlowErrors.DeclareClassElement, startLoc);
      } else if (member.value) {
        this.raise(FlowErrors.DeclareClassFieldInitializer, member.value);
      }
    }
  }
  isIterator(word) {
    return word === "iterator" || word === "asyncIterator";
  }
  readIterator() {
    const word = super.readWord1();
    const fullWord = "@@" + word;
    if (!this.isIterator(word) || !this.state.inType) {
      this.raise(Errors.InvalidIdentifier, this.state.curPosition(), {
        identifierName: fullWord
      });
    }
    this.finishToken(132, fullWord);
  }
  getTokenFromCode(code) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (code === 123 && next === 124) {
      this.finishOp(6, 2);
    } else if (this.state.inType && (code === 62 || code === 60)) {
      this.finishOp(code === 62 ? 48 : 47, 1);
    } else if (this.state.inType && code === 63) {
      if (next === 46) {
        this.finishOp(18, 2);
      } else {
        this.finishOp(17, 1);
      }
    } else if (isIteratorStart(code, next, this.input.charCodeAt(this.state.pos + 2))) {
      this.state.pos += 2;
      this.readIterator();
    } else {
      super.getTokenFromCode(code);
    }
  }
  isAssignable(node, isBinding) {
    if (node.type === "TypeCastExpression") {
      return this.isAssignable(node.expression, isBinding);
    } else {
      return super.isAssignable(node, isBinding);
    }
  }
  toAssignable(node, isLHS = false) {
    if (!isLHS && node.type === "AssignmentExpression" && node.left.type === "TypeCastExpression") {
      node.left = this.typeCastToParameter(node.left);
    }
    super.toAssignable(node, isLHS);
  }
  toAssignableList(exprList, trailingCommaLoc, isLHS) {
    for (let i = 0; i < exprList.length; i++) {
      const expr = exprList[i];
      if ((expr == null ? void 0 : expr.type) === "TypeCastExpression") {
        exprList[i] = this.typeCastToParameter(expr);
      }
    }
    super.toAssignableList(exprList, trailingCommaLoc, isLHS);
  }
  toReferencedList(exprList, isParenthesizedExpr) {
    for (let i = 0; i < exprList.length; i++) {
      var _expr$extra;
      const expr = exprList[i];
      if (expr && expr.type === "TypeCastExpression" && !((_expr$extra = expr.extra) != null && _expr$extra.parenthesized) && (exprList.length > 1 || !isParenthesizedExpr)) {
        this.raise(FlowErrors.TypeCastInPattern, expr.typeAnnotation);
      }
    }
    return exprList;
  }
  parseArrayLike(close, canBePattern, isTuple, refExpressionErrors) {
    const node = super.parseArrayLike(close, canBePattern, isTuple, refExpressionErrors);
    if (canBePattern && !this.state.maybeInArrowParameters) {
      this.toReferencedList(node.elements);
    }
    return node;
  }
  isValidLVal(type, isParenthesized, binding) {
    return type === "TypeCastExpression" || super.isValidLVal(type, isParenthesized, binding);
  }
  parseClassProperty(node) {
    if (this.match(14)) {
      node.typeAnnotation = this.flowParseTypeAnnotation();
    }
    return super.parseClassProperty(node);
  }
  parseClassPrivateProperty(node) {
    if (this.match(14)) {
      node.typeAnnotation = this.flowParseTypeAnnotation();
    }
    return super.parseClassPrivateProperty(node);
  }
  isClassMethod() {
    return this.match(47) || super.isClassMethod();
  }
  isClassProperty() {
    return this.match(14) || super.isClassProperty();
  }
  isNonstaticConstructor(method) {
    return !this.match(14) && super.isNonstaticConstructor(method);
  }
  pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper) {
    if (method.variance) {
      this.unexpected(method.variance.loc.start);
    }
    delete method.variance;
    if (this.match(47)) {
      method.typeParameters = this.flowParseTypeParameterDeclaration();
    }
    super.pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper);
    if (method.params && isConstructor) {
      const params = method.params;
      if (params.length > 0 && this.isThisParam(params[0])) {
        this.raise(FlowErrors.ThisParamBannedInConstructor, method);
      }
    } else if (method.type === "MethodDefinition" && isConstructor && method.value.params) {
      const params = method.value.params;
      if (params.length > 0 && this.isThisParam(params[0])) {
        this.raise(FlowErrors.ThisParamBannedInConstructor, method);
      }
    }
  }
  pushClassPrivateMethod(classBody, method, isGenerator, isAsync) {
    if (method.variance) {
      this.unexpected(method.variance.loc.start);
    }
    delete method.variance;
    if (this.match(47)) {
      method.typeParameters = this.flowParseTypeParameterDeclaration();
    }
    super.pushClassPrivateMethod(classBody, method, isGenerator, isAsync);
  }
  parseClassSuper(node) {
    super.parseClassSuper(node);
    if (node.superClass && this.match(47)) {
      node.superTypeParameters = this.flowParseTypeParameterInstantiation();
    }
    if (this.isContextual(113)) {
      this.next();
      const implemented = node.implements = [];
      do {
        const node = this.startNode();
        node.id = this.flowParseRestrictedIdentifier(true);
        if (this.match(47)) {
          node.typeParameters = this.flowParseTypeParameterInstantiation();
        } else {
          node.typeParameters = null;
        }
        implemented.push(this.finishNode(node, "ClassImplements"));
      } while (this.eat(12));
    }
  }
  checkGetterSetterParams(method) {
    super.checkGetterSetterParams(method);
    const params = this.getObjectOrClassMethodParams(method);
    if (params.length > 0) {
      const param = params[0];
      if (this.isThisParam(param) && method.kind === "get") {
        this.raise(FlowErrors.GetterMayNotHaveThisParam, param);
      } else if (this.isThisParam(param)) {
        this.raise(FlowErrors.SetterMayNotHaveThisParam, param);
      }
    }
  }
  parsePropertyNamePrefixOperator(node) {
    node.variance = this.flowParseVariance();
  }
  parseObjPropValue(prop, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors) {
    if (prop.variance) {
      this.unexpected(prop.variance.loc.start);
    }
    delete prop.variance;
    let typeParameters;
    if (this.match(47) && !isAccessor) {
      typeParameters = this.flowParseTypeParameterDeclaration();
      if (!this.match(10)) this.unexpected();
    }
    const result = super.parseObjPropValue(prop, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors);
    if (typeParameters) {
      (result.value || result).typeParameters = typeParameters;
    }
    return result;
  }
  parseAssignableListItemTypes(param) {
    if (this.eat(17)) {
      if (param.type !== "Identifier") {
        this.raise(FlowErrors.PatternIsOptional, param);
      }
      if (this.isThisParam(param)) {
        this.raise(FlowErrors.ThisParamMayNotBeOptional, param);
      }
      param.optional = true;
    }
    if (this.match(14)) {
      param.typeAnnotation = this.flowParseTypeAnnotation();
    } else if (this.isThisParam(param)) {
      this.raise(FlowErrors.ThisParamAnnotationRequired, param);
    }
    if (this.match(29) && this.isThisParam(param)) {
      this.raise(FlowErrors.ThisParamNoDefault, param);
    }
    this.resetEndLocation(param);
    return param;
  }
  parseMaybeDefault(startLoc, left) {
    const node = super.parseMaybeDefault(startLoc, left);
    if (node.type === "AssignmentPattern" && node.typeAnnotation && node.right.start < node.typeAnnotation.start) {
      this.raise(FlowErrors.TypeBeforeInitializer, node.typeAnnotation);
    }
    return node;
  }
  checkImportReflection(node) {
    super.checkImportReflection(node);
    if (node.module && node.importKind !== "value") {
      this.raise(FlowErrors.ImportReflectionHasImportType, node.specifiers[0].loc.start);
    }
  }
  parseImportSpecifierLocal(node, specifier, type) {
    specifier.local = hasTypeImportKind(node) ? this.flowParseRestrictedIdentifier(true, true) : this.parseIdentifier();
    node.specifiers.push(this.finishImportSpecifier(specifier, type));
  }
  isPotentialImportPhase(isExport) {
    if (super.isPotentialImportPhase(isExport)) return true;
    if (this.isContextual(130)) {
      if (!isExport) return true;
      const ch = this.lookaheadCharCode();
      return ch === 123 || ch === 42;
    }
    return !isExport && this.isContextual(87);
  }
  applyImportPhase(node, isExport, phase, loc) {
    super.applyImportPhase(node, isExport, phase, loc);
    if (isExport) {
      if (!phase && this.match(65)) {
        return;
      }
      node.exportKind = phase === "type" ? phase : "value";
    } else {
      if (phase === "type" && this.match(55)) this.unexpected();
      node.importKind = phase === "type" || phase === "typeof" ? phase : "value";
    }
  }
  parseImportSpecifier(specifier, importedIsString, isInTypeOnlyImport, isMaybeTypeOnly, bindingType) {
    const firstIdent = specifier.imported;
    let specifierTypeKind = null;
    if (firstIdent.type === "Identifier") {
      if (firstIdent.name === "type") {
        specifierTypeKind = "type";
      } else if (firstIdent.name === "typeof") {
        specifierTypeKind = "typeof";
      }
    }
    let isBinding = false;
    if (this.isContextual(93) && !this.isLookaheadContextual("as")) {
      const as_ident = this.parseIdentifier(true);
      if (specifierTypeKind !== null && !tokenIsKeywordOrIdentifier(this.state.type)) {
        specifier.imported = as_ident;
        specifier.importKind = specifierTypeKind;
        specifier.local = cloneIdentifier(as_ident);
      } else {
        specifier.imported = firstIdent;
        specifier.importKind = null;
        specifier.local = this.parseIdentifier();
      }
    } else {
      if (specifierTypeKind !== null && tokenIsKeywordOrIdentifier(this.state.type)) {
        specifier.imported = this.parseIdentifier(true);
        specifier.importKind = specifierTypeKind;
      } else {
        if (importedIsString) {
          throw this.raise(Errors.ImportBindingIsString, specifier, {
            importName: firstIdent.value
          });
        }
        specifier.imported = firstIdent;
        specifier.importKind = null;
      }
      if (this.eatContextual(93)) {
        specifier.local = this.parseIdentifier();
      } else {
        isBinding = true;
        specifier.local = cloneIdentifier(specifier.imported);
      }
    }
    const specifierIsTypeImport = hasTypeImportKind(specifier);
    if (isInTypeOnlyImport && specifierIsTypeImport) {
      this.raise(FlowErrors.ImportTypeShorthandOnlyInPureImport, specifier);
    }
    if (isInTypeOnlyImport || specifierIsTypeImport) {
      this.checkReservedType(specifier.local.name, specifier.local.loc.start, true);
    }
    if (isBinding && !isInTypeOnlyImport && !specifierIsTypeImport) {
      this.checkReservedWord(specifier.local.name, specifier.loc.start, true, true);
    }
    return this.finishImportSpecifier(specifier, "ImportSpecifier");
  }
  parseBindingAtom() {
    switch (this.state.type) {
      case 78:
        return this.parseIdentifier(true);
      default:
        return super.parseBindingAtom();
    }
  }
  parseFunctionParams(node, isConstructor) {
    const kind = node.kind;
    if (kind !== "get" && kind !== "set" && this.match(47)) {
      node.typeParameters = this.flowParseTypeParameterDeclaration();
    }
    super.parseFunctionParams(node, isConstructor);
  }
  parseVarId(decl, kind) {
    super.parseVarId(decl, kind);
    if (this.match(14)) {
      decl.id.typeAnnotation = this.flowParseTypeAnnotation();
      this.resetEndLocation(decl.id);
    }
  }
  parseAsyncArrowFromCallExpression(node, call) {
    if (this.match(14)) {
      const oldNoAnonFunctionType = this.state.noAnonFunctionType;
      this.state.noAnonFunctionType = true;
      node.returnType = this.flowParseTypeAnnotation();
      this.state.noAnonFunctionType = oldNoAnonFunctionType;
    }
    return super.parseAsyncArrowFromCallExpression(node, call);
  }
  shouldParseAsyncArrow() {
    return this.match(14) || super.shouldParseAsyncArrow();
  }
  parseMaybeAssign(refExpressionErrors, afterLeftParse) {
    var _jsx;
    let state = null;
    let jsx;
    if (this.hasPlugin("jsx") && (this.match(142) || this.match(47))) {
      state = this.state.clone();
      jsx = this.tryParse(() => super.parseMaybeAssign(refExpressionErrors, afterLeftParse), state);
      if (!jsx.error) return jsx.node;
      const {
        context
      } = this.state;
      const currentContext = context[context.length - 1];
      if (currentContext === types.j_oTag || currentContext === types.j_expr) {
        context.pop();
      }
    }
    if ((_jsx = jsx) != null && _jsx.error || this.match(47)) {
      var _jsx2, _jsx3;
      state = state || this.state.clone();
      let typeParameters;
      const arrow = this.tryParse(abort => {
        var _arrowExpression$extr;
        typeParameters = this.flowParseTypeParameterDeclaration();
        const arrowExpression = this.forwardNoArrowParamsConversionAt(typeParameters, () => {
          const result = super.parseMaybeAssign(refExpressionErrors, afterLeftParse);
          this.resetStartLocationFromNode(result, typeParameters);
          return result;
        });
        if ((_arrowExpression$extr = arrowExpression.extra) != null && _arrowExpression$extr.parenthesized) abort();
        const expr = this.maybeUnwrapTypeCastExpression(arrowExpression);
        if (expr.type !== "ArrowFunctionExpression") abort();
        expr.typeParameters = typeParameters;
        this.resetStartLocationFromNode(expr, typeParameters);
        return arrowExpression;
      }, state);
      let arrowExpression = null;
      if (arrow.node && this.maybeUnwrapTypeCastExpression(arrow.node).type === "ArrowFunctionExpression") {
        if (!arrow.error && !arrow.aborted) {
          if (arrow.node.async) {
            this.raise(FlowErrors.UnexpectedTypeParameterBeforeAsyncArrowFunction, typeParameters);
          }
          return arrow.node;
        }
        arrowExpression = arrow.node;
      }
      if ((_jsx2 = jsx) != null && _jsx2.node) {
        this.state = jsx.failState;
        return jsx.node;
      }
      if (arrowExpression) {
        this.state = arrow.failState;
        return arrowExpression;
      }
      if ((_jsx3 = jsx) != null && _jsx3.thrown) throw jsx.error;
      if (arrow.thrown) throw arrow.error;
      throw this.raise(FlowErrors.UnexpectedTokenAfterTypeParameter, typeParameters);
    }
    return super.parseMaybeAssign(refExpressionErrors, afterLeftParse);
  }
  parseArrow(node) {
    if (this.match(14)) {
      const result = this.tryParse(() => {
        const oldNoAnonFunctionType = this.state.noAnonFunctionType;
        this.state.noAnonFunctionType = true;
        const typeNode = this.startNode();
        [typeNode.typeAnnotation, node.predicate] = this.flowParseTypeAndPredicateInitialiser();
        this.state.noAnonFunctionType = oldNoAnonFunctionType;
        if (this.canInsertSemicolon()) this.unexpected();
        if (!this.match(19)) this.unexpected();
        return typeNode;
      });
      if (result.thrown) return null;
      if (result.error) this.state = result.failState;
      node.returnType = result.node.typeAnnotation ? this.finishNode(result.node, "TypeAnnotation") : null;
    }
    return super.parseArrow(node);
  }
  shouldParseArrow(params) {
    return this.match(14) || super.shouldParseArrow(params);
  }
  setArrowFunctionParameters(node, params) {
    if (this.state.noArrowParamsConversionAt.indexOf(node.start) !== -1) {
      node.params = params;
    } else {
      super.setArrowFunctionParameters(node, params);
    }
  }
  checkParams(node, allowDuplicates, isArrowFunction, strictModeChanged = true) {
    if (isArrowFunction && this.state.noArrowParamsConversionAt.indexOf(node.start) !== -1) {
      return;
    }
    for (let i = 0; i < node.params.length; i++) {
      if (this.isThisParam(node.params[i]) && i > 0) {
        this.raise(FlowErrors.ThisParamMustBeFirst, node.params[i]);
      }
    }
    super.checkParams(node, allowDuplicates, isArrowFunction, strictModeChanged);
  }
  parseParenAndDistinguishExpression(canBeArrow) {
    return super.parseParenAndDistinguishExpression(canBeArrow && this.state.noArrowAt.indexOf(this.state.start) === -1);
  }
  parseSubscripts(base, startLoc, noCalls) {
    if (base.type === "Identifier" && base.name === "async" && this.state.noArrowAt.indexOf(startLoc.index) !== -1) {
      this.next();
      const node = this.startNodeAt(startLoc);
      node.callee = base;
      node.arguments = super.parseCallExpressionArguments(11, false);
      base = this.finishNode(node, "CallExpression");
    } else if (base.type === "Identifier" && base.name === "async" && this.match(47)) {
      const state = this.state.clone();
      const arrow = this.tryParse(abort => this.parseAsyncArrowWithTypeParameters(startLoc) || abort(), state);
      if (!arrow.error && !arrow.aborted) return arrow.node;
      const result = this.tryParse(() => super.parseSubscripts(base, startLoc, noCalls), state);
      if (result.node && !result.error) return result.node;
      if (arrow.node) {
        this.state = arrow.failState;
        return arrow.node;
      }
      if (result.node) {
        this.state = result.failState;
        return result.node;
      }
      throw arrow.error || result.error;
    }
    return super.parseSubscripts(base, startLoc, noCalls);
  }
  parseSubscript(base, startLoc, noCalls, subscriptState) {
    if (this.match(18) && this.isLookaheadToken_lt()) {
      subscriptState.optionalChainMember = true;
      if (noCalls) {
        subscriptState.stop = true;
        return base;
      }
      this.next();
      const node = this.startNodeAt(startLoc);
      node.callee = base;
      node.typeArguments = this.flowParseTypeParameterInstantiation();
      this.expect(10);
      node.arguments = this.parseCallExpressionArguments(11, false);
      node.optional = true;
      return this.finishCallExpression(node, true);
    } else if (!noCalls && this.shouldParseTypes() && this.match(47)) {
      const node = this.startNodeAt(startLoc);
      node.callee = base;
      const result = this.tryParse(() => {
        node.typeArguments = this.flowParseTypeParameterInstantiationCallOrNew();
        this.expect(10);
        node.arguments = super.parseCallExpressionArguments(11, false);
        if (subscriptState.optionalChainMember) {
          node.optional = false;
        }
        return this.finishCallExpression(node, subscriptState.optionalChainMember);
      });
      if (result.node) {
        if (result.error) this.state = result.failState;
        return result.node;
      }
    }
    return super.parseSubscript(base, startLoc, noCalls, subscriptState);
  }
  parseNewCallee(node) {
    super.parseNewCallee(node);
    let targs = null;
    if (this.shouldParseTypes() && this.match(47)) {
      targs = this.tryParse(() => this.flowParseTypeParameterInstantiationCallOrNew()).node;
    }
    node.typeArguments = targs;
  }
  parseAsyncArrowWithTypeParameters(startLoc) {
    const node = this.startNodeAt(startLoc);
    this.parseFunctionParams(node, false);
    if (!this.parseArrow(node)) return;
    return super.parseArrowExpression(node, undefined, true);
  }
  readToken_mult_modulo(code) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (code === 42 && next === 47 && this.state.hasFlowComment) {
      this.state.hasFlowComment = false;
      this.state.pos += 2;
      this.nextToken();
      return;
    }
    super.readToken_mult_modulo(code);
  }
  readToken_pipe_amp(code) {
    const next = this.input.charCodeAt(this.state.pos + 1);
    if (code === 124 && next === 125) {
      this.finishOp(9, 2);
      return;
    }
    super.readToken_pipe_amp(code);
  }
  parseTopLevel(file, program) {
    const fileNode = super.parseTopLevel(file, program);
    if (this.state.hasFlowComment) {
      this.raise(FlowErrors.UnterminatedFlowComment, this.state.curPosition());
    }
    return fileNode;
  }
  skipBlockComment() {
    if (this.hasPlugin("flowComments") && this.skipFlowComment()) {
      if (this.state.hasFlowComment) {
        throw this.raise(FlowErrors.NestedFlowComment, this.state.startLoc);
      }
      this.hasFlowCommentCompletion();
      const commentSkip = this.skipFlowComment();
      if (commentSkip) {
        this.state.pos += commentSkip;
        this.state.hasFlowComment = true;
      }
      return;
    }
    return super.skipBlockComment(this.state.hasFlowComment ? "*-/" : "*/");
  }
  skipFlowComment() {
    const {
      pos
    } = this.state;
    let shiftToFirstNonWhiteSpace = 2;
    while ([32, 9].includes(this.input.charCodeAt(pos + shiftToFirstNonWhiteSpace))) {
      shiftToFirstNonWhiteSpace++;
    }
    const ch2 = this.input.charCodeAt(shiftToFirstNonWhiteSpace + pos);
    const ch3 = this.input.charCodeAt(shiftToFirstNonWhiteSpace + pos + 1);
    if (ch2 === 58 && ch3 === 58) {
      return shiftToFirstNonWhiteSpace + 2;
    }
    if (this.input.slice(shiftToFirstNonWhiteSpace + pos, shiftToFirstNonWhiteSpace + pos + 12) === "flow-include") {
      return shiftToFirstNonWhiteSpace + 12;
    }
    if (ch2 === 58 && ch3 !== 58) {
      return shiftToFirstNonWhiteSpace;
    }
    return false;
  }
  hasFlowCommentCompletion() {
    const end = this.input.indexOf("*/", this.state.pos);
    if (end === -1) {
      throw this.raise(Errors.UnterminatedComment, this.state.curPosition());
    }
  }
  flowEnumErrorBooleanMemberNotInitialized(loc, {
    enumName,
    memberName
  }) {
    this.raise(FlowErrors.EnumBooleanMemberNotInitialized, loc, {
      memberName,
      enumName
    });
  }
  flowEnumErrorInvalidMemberInitializer(loc, enumContext) {
    return this.raise(!enumContext.explicitType ? FlowErrors.EnumInvalidMemberInitializerUnknownType : enumContext.explicitType === "symbol" ? FlowErrors.EnumInvalidMemberInitializerSymbolType : FlowErrors.EnumInvalidMemberInitializerPrimaryType, loc, enumContext);
  }
  flowEnumErrorNumberMemberNotInitialized(loc, details) {
    this.raise(FlowErrors.EnumNumberMemberNotInitialized, loc, details);
  }
  flowEnumErrorStringMemberInconsistentlyInitialized(node, details) {
    this.raise(FlowErrors.EnumStringMemberInconsistentlyInitialized, node, details);
  }
  flowEnumMemberInit() {
    const startLoc = this.state.startLoc;
    const endOfInit = () => this.match(12) || this.match(8);
    switch (this.state.type) {
      case 134:
        {
          const literal = this.parseNumericLiteral(this.state.value);
          if (endOfInit()) {
            return {
              type: "number",
              loc: literal.loc.start,
              value: literal
            };
          }
          return {
            type: "invalid",
            loc: startLoc
          };
        }
      case 133:
        {
          const literal = this.parseStringLiteral(this.state.value);
          if (endOfInit()) {
            return {
              type: "string",
              loc: literal.loc.start,
              value: literal
            };
          }
          return {
            type: "invalid",
            loc: startLoc
          };
        }
      case 85:
      case 86:
        {
          const literal = this.parseBooleanLiteral(this.match(85));
          if (endOfInit()) {
            return {
              type: "boolean",
              loc: literal.loc.start,
              value: literal
            };
          }
          return {
            type: "invalid",
            loc: startLoc
          };
        }
      default:
        return {
          type: "invalid",
          loc: startLoc
        };
    }
  }
  flowEnumMemberRaw() {
    const loc = this.state.startLoc;
    const id = this.parseIdentifier(true);
    const init = this.eat(29) ? this.flowEnumMemberInit() : {
      type: "none",
      loc
    };
    return {
      id,
      init
    };
  }
  flowEnumCheckExplicitTypeMismatch(loc, context, expectedType) {
    const {
      explicitType
    } = context;
    if (explicitType === null) {
      return;
    }
    if (explicitType !== expectedType) {
      this.flowEnumErrorInvalidMemberInitializer(loc, context);
    }
  }
  flowEnumMembers({
    enumName,
    explicitType
  }) {
    const seenNames = new Set();
    const members = {
      booleanMembers: [],
      numberMembers: [],
      stringMembers: [],
      defaultedMembers: []
    };
    let hasUnknownMembers = false;
    while (!this.match(8)) {
      if (this.eat(21)) {
        hasUnknownMembers = true;
        break;
      }
      const memberNode = this.startNode();
      const {
        id,
        init
      } = this.flowEnumMemberRaw();
      const memberName = id.name;
      if (memberName === "") {
        continue;
      }
      if (/^[a-z]/.test(memberName)) {
        this.raise(FlowErrors.EnumInvalidMemberName, id, {
          memberName,
          suggestion: memberName[0].toUpperCase() + memberName.slice(1),
          enumName
        });
      }
      if (seenNames.has(memberName)) {
        this.raise(FlowErrors.EnumDuplicateMemberName, id, {
          memberName,
          enumName
        });
      }
      seenNames.add(memberName);
      const context = {
        enumName,
        explicitType,
        memberName
      };
      memberNode.id = id;
      switch (init.type) {
        case "boolean":
          {
            this.flowEnumCheckExplicitTypeMismatch(init.loc, context, "boolean");
            memberNode.init = init.value;
            members.booleanMembers.push(this.finishNode(memberNode, "EnumBooleanMember"));
            break;
          }
        case "number":
          {
            this.flowEnumCheckExplicitTypeMismatch(init.loc, context, "number");
            memberNode.init = init.value;
            members.numberMembers.push(this.finishNode(memberNode, "EnumNumberMember"));
            break;
          }
        case "string":
          {
            this.flowEnumCheckExplicitTypeMismatch(init.loc, context, "string");
            memberNode.init = init.value;
            members.stringMembers.push(this.finishNode(memberNode, "EnumStringMember"));
            break;
          }
        case "invalid":
          {
            throw this.flowEnumErrorInvalidMemberInitializer(init.loc, context);
          }
        case "none":
          {
            switch (explicitType) {
              case "boolean":
                this.flowEnumErrorBooleanMemberNotInitialized(init.loc, context);
                break;
              case "number":
                this.flowEnumErrorNumberMemberNotInitialized(init.loc, context);
                break;
              default:
                members.defaultedMembers.push(this.finishNode(memberNode, "EnumDefaultedMember"));
            }
          }
      }
      if (!this.match(8)) {
        this.expect(12);
      }
    }
    return {
      members,
      hasUnknownMembers
    };
  }
  flowEnumStringMembers(initializedMembers, defaultedMembers, {
    enumName
  }) {
    if (initializedMembers.length === 0) {
      return defaultedMembers;
    } else if (defaultedMembers.length === 0) {
      return initializedMembers;
    } else if (defaultedMembers.length > initializedMembers.length) {
      for (const member of initializedMembers) {
        this.flowEnumErrorStringMemberInconsistentlyInitialized(member, {
          enumName
        });
      }
      return defaultedMembers;
    } else {
      for (const member of defaultedMembers) {
        this.flowEnumErrorStringMemberInconsistentlyInitialized(member, {
          enumName
        });
      }
      return initializedMembers;
    }
  }
  flowEnumParseExplicitType({
    enumName
  }) {
    if (!this.eatContextual(102)) return null;
    if (!tokenIsIdentifier(this.state.type)) {
      throw this.raise(FlowErrors.EnumInvalidExplicitTypeUnknownSupplied, this.state.startLoc, {
        enumName
      });
    }
    const {
      value
    } = this.state;
    this.next();
    if (value !== "boolean" && value !== "number" && value !== "string" && value !== "symbol") {
      this.raise(FlowErrors.EnumInvalidExplicitType, this.state.startLoc, {
        enumName,
        invalidEnumType: value
      });
    }
    return value;
  }
  flowEnumBody(node, id) {
    const enumName = id.name;
    const nameLoc = id.loc.start;
    const explicitType = this.flowEnumParseExplicitType({
      enumName
    });
    this.expect(5);
    const {
      members,
      hasUnknownMembers
    } = this.flowEnumMembers({
      enumName,
      explicitType
    });
    node.hasUnknownMembers = hasUnknownMembers;
    switch (explicitType) {
      case "boolean":
        node.explicitType = true;
        node.members = members.booleanMembers;
        this.expect(8);
        return this.finishNode(node, "EnumBooleanBody");
      case "number":
        node.explicitType = true;
        node.members = members.numberMembers;
        this.expect(8);
        return this.finishNode(node, "EnumNumberBody");
      case "string":
        node.explicitType = true;
        node.members = this.flowEnumStringMembers(members.stringMembers, members.defaultedMembers, {
          enumName
        });
        this.expect(8);
        return this.finishNode(node, "EnumStringBody");
      case "symbol":
        node.members = members.defaultedMembers;
        this.expect(8);
        return this.finishNode(node, "EnumSymbolBody");
      default:
        {
          const empty = () => {
            node.members = [];
            this.expect(8);
            return this.finishNode(node, "EnumStringBody");
          };
          node.explicitType = false;
          const boolsLen = members.booleanMembers.length;
          const numsLen = members.numberMembers.length;
          const strsLen = members.stringMembers.length;
          const defaultedLen = members.defaultedMembers.length;
          if (!boolsLen && !numsLen && !strsLen && !defaultedLen) {
            return empty();
          } else if (!boolsLen && !numsLen) {
            node.members = this.flowEnumStringMembers(members.stringMembers, members.defaultedMembers, {
              enumName
            });
            this.expect(8);
            return this.finishNode(node, "EnumStringBody");
          } else if (!numsLen && !strsLen && boolsLen >= defaultedLen) {
            for (const member of members.defaultedMembers) {
              this.flowEnumErrorBooleanMemberNotInitialized(member.loc.start, {
                enumName,
                memberName: member.id.name
              });
            }
            node.members = members.booleanMembers;
            this.expect(8);
            return this.finishNode(node, "EnumBooleanBody");
          } else if (!boolsLen && !strsLen && numsLen >= defaultedLen) {
            for (const member of members.defaultedMembers) {
              this.flowEnumErrorNumberMemberNotInitialized(member.loc.start, {
                enumName,
                memberName: member.id.name
              });
            }
            node.members = members.numberMembers;
            this.expect(8);
            return this.finishNode(node, "EnumNumberBody");
          } else {
            this.raise(FlowErrors.EnumInconsistentMemberValues, nameLoc, {
              enumName
            });
            return empty();
          }
        }
    }
  }
  flowParseEnumDeclaration(node) {
    const id = this.parseIdentifier();
    node.id = id;
    node.body = this.flowEnumBody(this.startNode(), id);
    return this.finishNode(node, "EnumDeclaration");
  }
  isLookaheadToken_lt() {
    const next = this.nextTokenStart();
    if (this.input.charCodeAt(next) === 60) {
      const afterNext = this.input.charCodeAt(next + 1);
      return afterNext !== 60 && afterNext !== 61;
    }
    return false;
  }
  maybeUnwrapTypeCastExpression(node) {
    return node.type === "TypeCastExpression" ? node.expression : node;
  }
};
const entities = {
  __proto__: null,
  quot: "\u0022",
  amp: "&",
  apos: "\u0027",
  lt: "<",
  gt: ">",
  nbsp: "\u00A0",
  iexcl: "\u00A1",
  cent: "\u00A2",
  pound: "\u00A3",
  curren: "\u00A4",
  yen: "\u00A5",
  brvbar: "\u00A6",
  sect: "\u00A7",
  uml: "\u00A8",
  copy: "\u00A9",
  ordf: "\u00AA",
  laquo: "\u00AB",
  not: "\u00AC",
  shy: "\u00AD",
  reg: "\u00AE",
  macr: "\u00AF",
  deg: "\u00B0",
  plusmn: "\u00B1",
  sup2: "\u00B2",
  sup3: "\u00B3",
  acute: "\u00B4",
  micro: "\u00B5",
  para: "\u00B6",
  middot: "\u00B7",
  cedil: "\u00B8",
  sup1: "\u00B9",
  ordm: "\u00BA",
  raquo: "\u00BB",
  frac14: "\u00BC",
  frac12: "\u00BD",
  frac34: "\u00BE",
  iquest: "\u00BF",
  Agrave: "\u00C0",
  Aacute: "\u00C1",
  Acirc: "\u00C2",
  Atilde: "\u00C3",
  Auml: "\u00C4",
  Aring: "\u00C5",
  AElig: "\u00C6",
  Ccedil: "\u00C7",
  Egrave: "\u00C8",
  Eacute: "\u00C9",
  Ecirc: "\u00CA",
  Euml: "\u00CB",
  Igrave: "\u00CC",
  Iacute: "\u00CD",
  Icirc: "\u00CE",
  Iuml: "\u00CF",
  ETH: "\u00D0",
  Ntilde: "\u00D1",
  Ograve: "\u00D2",
  Oacute: "\u00D3",
  Ocirc: "\u00D4",
  Otilde: "\u00D5",
  Ouml: "\u00D6",
  times: "\u00D7",
  Oslash: "\u00D8",
  Ugrave: "\u00D9",
  Uacute: "\u00DA",
  Ucirc: "\u00DB",
  Uuml: "\u00DC",
  Yacute: "\u00DD",
  THORN: "\u00DE",
  szlig: "\u00DF",
  agrave: "\u00E0",
  aacute: "\u00E1",
  acirc: "\u00E2",
  atilde: "\u00E3",
  auml: "\u00E4",
  aring: "\u00E5",
  aelig: "\u00E6",
  ccedil: "\u00E7",
  egrave: "\u00E8",
  eacute: "\u00E9",
  ecirc: "\u00EA",
  euml: "\u00EB",
  igrave: "\u00EC",
  iacute: "\u00ED",
  icirc: "\u00EE",
  iuml: "\u00EF",
  eth: "\u00F0",
  ntilde: "\u00F1",
  ograve: "\u00F2",
  oacute: "\u00F3",
  ocirc: "\u00F4",
  otilde: "\u00F5",
  ouml: "\u00F6",
  divide: "\u00F7",
  oslash: "\u00F8",
  ugrave: "\u00F9",
  uacute: "\u00FA",
  ucirc: "\u00FB",
  uuml: "\u00FC",
  yacute: "\u00FD",
  thorn: "\u00FE",
  yuml: "\u00FF",
  OElig: "\u0152",
  oelig: "\u0153",
  Scaron: "\u0160",
  scaron: "\u0161",
  Yuml: "\u0178",
  fnof: "\u0192",
  circ: "\u02C6",
  tilde: "\u02DC",
  Alpha: "\u0391",
  Beta: "\u0392",
  Gamma: "\u0393",
  Delta: "\u0394",
  Epsilon: "\u0395",
  Zeta: "\u0396",
  Eta: "\u0397",
  Theta: "\u0398",
  Iota: "\u0399",
  Kappa: "\u039A",
  Lambda: "\u039B",
  Mu: "\u039C",
  Nu: "\u039D",
  Xi: "\u039E",
  Omicron: "\u039F",
  Pi: "\u03A0",
  Rho: "\u03A1",
  Sigma: "\u03A3",
  Tau: "\u03A4",
  Upsilon: "\u03A5",
  Phi: "\u03A6",
  Chi: "\u03A7",
  Psi: "\u03A8",
  Omega: "\u03A9",
  alpha: "\u03B1",
  beta: "\u03B2",
  gamma: "\u03B3",
  delta: "\u03B4",
  epsilon: "\u03B5",
  zeta: "\u03B6",
  eta: "\u03B7",
  theta: "\u03B8",
  iota: "\u03B9",
  kappa: "\u03BA",
  lambda: "\u03BB",
  mu: "\u03BC",
  nu: "\u03BD",
  xi: "\u03BE",
  omicron: "\u03BF",
  pi: "\u03C0",
  rho: "\u03C1",
  sigmaf: "\u03C2",
  sigma: "\u03C3",
  tau: "\u03C4",
  upsilon: "\u03C5",
  phi: "\u03C6",
  chi: "\u03C7",
  psi: "\u03C8",
  omega: "\u03C9",
  thetasym: "\u03D1",
  upsih: "\u03D2",
  piv: "\u03D6",
  ensp: "\u2002",
  emsp: "\u2003",
  thinsp: "\u2009",
  zwnj: "\u200C",
  zwj: "\u200D",
  lrm: "\u200E",
  rlm: "\u200F",
  ndash: "\u2013",
  mdash: "\u2014",
  lsquo: "\u2018",
  rsquo: "\u2019",
  sbquo: "\u201A",
  ldquo: "\u201C",
  rdquo: "\u201D",
  bdquo: "\u201E",
  dagger: "\u2020",
  Dagger: "\u2021",
  bull: "\u2022",
  hellip: "\u2026",
  permil: "\u2030",
  prime: "\u2032",
  Prime: "\u2033",
  lsaquo: "\u2039",
  rsaquo: "\u203A",
  oline: "\u203E",
  frasl: "\u2044",
  euro: "\u20AC",
  image: "\u2111",
  weierp: "\u2118",
  real: "\u211C",
  trade: "\u2122",
  alefsym: "\u2135",
  larr: "\u2190",
  uarr: "\u2191",
  rarr: "\u2192",
  darr: "\u2193",
  harr: "\u2194",
  crarr: "\u21B5",
  lArr: "\u21D0",
  uArr: "\u21D1",
  rArr: "\u21D2",
  dArr: "\u21D3",
  hArr: "\u21D4",
  forall: "\u2200",
  part: "\u2202",
  exist: "\u2203",
  empty: "\u2205",
  nabla: "\u2207",
  isin: "\u2208",
  notin: "\u2209",
  ni: "\u220B",
  prod: "\u220F",
  sum: "\u2211",
  minus: "\u2212",
  lowast: "\u2217",
  radic: "\u221A",
  prop: "\u221D",
  infin: "\u221E",
  ang: "\u2220",
  and: "\u2227",
  or: "\u2228",
  cap: "\u2229",
  cup: "\u222A",
  int: "\u222B",
  there4: "\u2234",
  sim: "\u223C",
  cong: "\u2245",
  asymp: "\u2248",
  ne: "\u2260",
  equiv: "\u2261",
  le: "\u2264",
  ge: "\u2265",
  sub: "\u2282",
  sup: "\u2283",
  nsub: "\u2284",
  sube: "\u2286",
  supe: "\u2287",
  oplus: "\u2295",
  otimes: "\u2297",
  perp: "\u22A5",
  sdot: "\u22C5",
  lceil: "\u2308",
  rceil: "\u2309",
  lfloor: "\u230A",
  rfloor: "\u230B",
  lang: "\u2329",
  rang: "\u232A",
  loz: "\u25CA",
  spades: "\u2660",
  clubs: "\u2663",
  hearts: "\u2665",
  diams: "\u2666"
};
const JsxErrors = ParseErrorEnum`jsx`({
  AttributeIsEmpty: "JSX attributes must only be assigned a non-empty expression.",
  MissingClosingTagElement: ({
    openingTagName
  }) => `Expected corresponding JSX closing tag for <${openingTagName}>.`,
  MissingClosingTagFragment: "Expected corresponding JSX closing tag for <>.",
  UnexpectedSequenceExpression: "Sequence expressions cannot be directly nested inside JSX. Did you mean to wrap it in parentheses (...)?",
  UnexpectedToken: ({
    unexpected,
    HTMLEntity
  }) => `Unexpected token \`${unexpected}\`. Did you mean \`${HTMLEntity}\` or \`{'${unexpected}'}\`?`,
  UnsupportedJsxValue: "JSX value should be either an expression or a quoted JSX text.",
  UnterminatedJsxContent: "Unterminated JSX contents.",
  UnwrappedAdjacentJSXElements: "Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment <>...</>?"
});
function isFragment(object) {
  return object ? object.type === "JSXOpeningFragment" || object.type === "JSXClosingFragment" : false;
}
function getQualifiedJSXName(object) {
  if (object.type === "JSXIdentifier") {
    return object.name;
  }
  if (object.type === "JSXNamespacedName") {
    return object.namespace.name + ":" + object.name.name;
  }
  if (object.type === "JSXMemberExpression") {
    return getQualifiedJSXName(object.object) + "." + getQualifiedJSXName(object.property);
  }
  throw new Error("Node had unexpected type: " + object.type);
}
var jsx = superClass => class JSXParserMixin extends superClass {
  jsxReadToken() {
    let out = "";
    let chunkStart = this.state.pos;
    for (;;) {
      if (this.state.pos >= this.length) {
        throw this.raise(JsxErrors.UnterminatedJsxContent, this.state.startLoc);
      }
      const ch = this.input.charCodeAt(this.state.pos);
      switch (ch) {
        case 60:
        case 123:
          if (this.state.pos === this.state.start) {
            if (ch === 60 && this.state.canStartJSXElement) {
              ++this.state.pos;
              this.finishToken(142);
            } else {
              super.getTokenFromCode(ch);
            }
            return;
          }
          out += this.input.slice(chunkStart, this.state.pos);
          this.finishToken(141, out);
          return;
        case 38:
          out += this.input.slice(chunkStart, this.state.pos);
          out += this.jsxReadEntity();
          chunkStart = this.state.pos;
          break;
        case 62:
        case 125:
        default:
          if (isNewLine(ch)) {
            out += this.input.slice(chunkStart, this.state.pos);
            out += this.jsxReadNewLine(true);
            chunkStart = this.state.pos;
          } else {
            ++this.state.pos;
          }
      }
    }
  }
  jsxReadNewLine(normalizeCRLF) {
    const ch = this.input.charCodeAt(this.state.pos);
    let out;
    ++this.state.pos;
    if (ch === 13 && this.input.charCodeAt(this.state.pos) === 10) {
      ++this.state.pos;
      out = normalizeCRLF ? "\n" : "\r\n";
    } else {
      out = String.fromCharCode(ch);
    }
    ++this.state.curLine;
    this.state.lineStart = this.state.pos;
    return out;
  }
  jsxReadString(quote) {
    let out = "";
    let chunkStart = ++this.state.pos;
    for (;;) {
      if (this.state.pos >= this.length) {
        throw this.raise(Errors.UnterminatedString, this.state.startLoc);
      }
      const ch = this.input.charCodeAt(this.state.pos);
      if (ch === quote) break;
      if (ch === 38) {
        out += this.input.slice(chunkStart, this.state.pos);
        out += this.jsxReadEntity();
        chunkStart = this.state.pos;
      } else if (isNewLine(ch)) {
        out += this.input.slice(chunkStart, this.state.pos);
        out += this.jsxReadNewLine(false);
        chunkStart = this.state.pos;
      } else {
        ++this.state.pos;
      }
    }
    out += this.input.slice(chunkStart, this.state.pos++);
    this.finishToken(133, out);
  }
  jsxReadEntity() {
    const startPos = ++this.state.pos;
    if (this.codePointAtPos(this.state.pos) === 35) {
      ++this.state.pos;
      let radix = 10;
      if (this.codePointAtPos(this.state.pos) === 120) {
        radix = 16;
        ++this.state.pos;
      }
      const codePoint = this.readInt(radix, undefined, false, "bail");
      if (codePoint !== null && this.codePointAtPos(this.state.pos) === 59) {
        ++this.state.pos;
        return String.fromCodePoint(codePoint);
      }
    } else {
      let count = 0;
      let semi = false;
      while (count++ < 10 && this.state.pos < this.length && !(semi = this.codePointAtPos(this.state.pos) == 59)) {
        ++this.state.pos;
      }
      if (semi) {
        const desc = this.input.slice(startPos, this.state.pos);
        const entity = entities[desc];
        ++this.state.pos;
        if (entity) {
          return entity;
        }
      }
    }
    this.state.pos = startPos;
    return "&";
  }
  jsxReadWord() {
    let ch;
    const start = this.state.pos;
    do {
      ch = this.input.charCodeAt(++this.state.pos);
    } while (isIdentifierChar(ch) || ch === 45);
    this.finishToken(140, this.input.slice(start, this.state.pos));
  }
  jsxParseIdentifier() {
    const node = this.startNode();
    if (this.match(140)) {
      node.name = this.state.value;
    } else if (tokenIsKeyword(this.state.type)) {
      node.name = tokenLabelName(this.state.type);
    } else {
      this.unexpected();
    }
    this.next();
    return this.finishNode(node, "JSXIdentifier");
  }
  jsxParseNamespacedName() {
    const startLoc = this.state.startLoc;
    const name = this.jsxParseIdentifier();
    if (!this.eat(14)) return name;
    const node = this.startNodeAt(startLoc);
    node.namespace = name;
    node.name = this.jsxParseIdentifier();
    return this.finishNode(node, "JSXNamespacedName");
  }
  jsxParseElementName() {
    const startLoc = this.state.startLoc;
    let node = this.jsxParseNamespacedName();
    if (node.type === "JSXNamespacedName") {
      return node;
    }
    while (this.eat(16)) {
      const newNode = this.startNodeAt(startLoc);
      newNode.object = node;
      newNode.property = this.jsxParseIdentifier();
      node = this.finishNode(newNode, "JSXMemberExpression");
    }
    return node;
  }
  jsxParseAttributeValue() {
    let node;
    switch (this.state.type) {
      case 5:
        node = this.startNode();
        this.setContext(types.brace);
        this.next();
        node = this.jsxParseExpressionContainer(node, types.j_oTag);
        if (node.expression.type === "JSXEmptyExpression") {
          this.raise(JsxErrors.AttributeIsEmpty, node);
        }
        return node;
      case 142:
      case 133:
        return this.parseExprAtom();
      default:
        throw this.raise(JsxErrors.UnsupportedJsxValue, this.state.startLoc);
    }
  }
  jsxParseEmptyExpression() {
    const node = this.startNodeAt(this.state.lastTokEndLoc);
    return this.finishNodeAt(node, "JSXEmptyExpression", this.state.startLoc);
  }
  jsxParseSpreadChild(node) {
    this.next();
    node.expression = this.parseExpression();
    this.setContext(types.j_expr);
    this.state.canStartJSXElement = true;
    this.expect(8);
    return this.finishNode(node, "JSXSpreadChild");
  }
  jsxParseExpressionContainer(node, previousContext) {
    if (this.match(8)) {
      node.expression = this.jsxParseEmptyExpression();
    } else {
      const expression = this.parseExpression();
      node.expression = expression;
    }
    this.setContext(previousContext);
    this.state.canStartJSXElement = true;
    this.expect(8);
    return this.finishNode(node, "JSXExpressionContainer");
  }
  jsxParseAttribute() {
    const node = this.startNode();
    if (this.match(5)) {
      this.setContext(types.brace);
      this.next();
      this.expect(21);
      node.argument = this.parseMaybeAssignAllowIn();
      this.setContext(types.j_oTag);
      this.state.canStartJSXElement = true;
      this.expect(8);
      return this.finishNode(node, "JSXSpreadAttribute");
    }
    node.name = this.jsxParseNamespacedName();
    node.value = this.eat(29) ? this.jsxParseAttributeValue() : null;
    return this.finishNode(node, "JSXAttribute");
  }
  jsxParseOpeningElementAt(startLoc) {
    const node = this.startNodeAt(startLoc);
    if (this.eat(143)) {
      return this.finishNode(node, "JSXOpeningFragment");
    }
    node.name = this.jsxParseElementName();
    return this.jsxParseOpeningElementAfterName(node);
  }
  jsxParseOpeningElementAfterName(node) {
    const attributes = [];
    while (!this.match(56) && !this.match(143)) {
      attributes.push(this.jsxParseAttribute());
    }
    node.attributes = attributes;
    node.selfClosing = this.eat(56);
    this.expect(143);
    return this.finishNode(node, "JSXOpeningElement");
  }
  jsxParseClosingElementAt(startLoc) {
    const node = this.startNodeAt(startLoc);
    if (this.eat(143)) {
      return this.finishNode(node, "JSXClosingFragment");
    }
    node.name = this.jsxParseElementName();
    this.expect(143);
    return this.finishNode(node, "JSXClosingElement");
  }
  jsxParseElementAt(startLoc) {
    const node = this.startNodeAt(startLoc);
    const children = [];
    const openingElement = this.jsxParseOpeningElementAt(startLoc);
    let closingElement = null;
    if (!openingElement.selfClosing) {
      contents: for (;;) {
        switch (this.state.type) {
          case 142:
            startLoc = this.state.startLoc;
            this.next();
            if (this.eat(56)) {
              closingElement = this.jsxParseClosingElementAt(startLoc);
              break contents;
            }
            children.push(this.jsxParseElementAt(startLoc));
            break;
          case 141:
            children.push(this.parseExprAtom());
            break;
          case 5:
            {
              const node = this.startNode();
              this.setContext(types.brace);
              this.next();
              if (this.match(21)) {
                children.push(this.jsxParseSpreadChild(node));
              } else {
                children.push(this.jsxParseExpressionContainer(node, types.j_expr));
              }
              break;
            }
          default:
            this.unexpected();
        }
      }
      if (isFragment(openingElement) && !isFragment(closingElement) && closingElement !== null) {
        this.raise(JsxErrors.MissingClosingTagFragment, closingElement);
      } else if (!isFragment(openingElement) && isFragment(closingElement)) {
        this.raise(JsxErrors.MissingClosingTagElement, closingElement, {
          openingTagName: getQualifiedJSXName(openingElement.name)
        });
      } else if (!isFragment(openingElement) && !isFragment(closingElement)) {
        if (getQualifiedJSXName(closingElement.name) !== getQualifiedJSXName(openingElement.name)) {
          this.raise(JsxErrors.MissingClosingTagElement, closingElement, {
            openingTagName: getQualifiedJSXName(openingElement.name)
          });
        }
      }
    }
    if (isFragment(openingElement)) {
      node.openingFragment = openingElement;
      node.closingFragment = closingElement;
    } else {
      node.openingElement = openingElement;
      node.closingElement = closingElement;
    }
    node.children = children;
    if (this.match(47)) {
      throw this.raise(JsxErrors.UnwrappedAdjacentJSXElements, this.state.startLoc);
    }
    return isFragment(openingElement) ? this.finishNode(node, "JSXFragment") : this.finishNode(node, "JSXElement");
  }
  jsxParseElement() {
    const startLoc = this.state.startLoc;
    this.next();
    return this.jsxParseElementAt(startLoc);
  }
  setContext(newContext) {
    const {
      context
    } = this.state;
    context[context.length - 1] = newContext;
  }
  parseExprAtom(refExpressionErrors) {
    if (this.match(141)) {
      return this.parseLiteral(this.state.value, "JSXText");
    } else if (this.match(142)) {
      return this.jsxParseElement();
    } else if (this.match(47) && this.input.charCodeAt(this.state.pos) !== 33) {
      this.replaceToken(142);
      return this.jsxParseElement();
    } else {
      return super.parseExprAtom(refExpressionErrors);
    }
  }
  skipSpace() {
    const curContext = this.curContext();
    if (!curContext.preserveSpace) super.skipSpace();
  }
  getTokenFromCode(code) {
    const context = this.curContext();
    if (context === types.j_expr) {
      this.jsxReadToken();
      return;
    }
    if (context === types.j_oTag || context === types.j_cTag) {
      if (isIdentifierStart(code)) {
        this.jsxReadWord();
        return;
      }
      if (code === 62) {
        ++this.state.pos;
        this.finishToken(143);
        return;
      }
      if ((code === 34 || code === 39) && context === types.j_oTag) {
        this.jsxReadString(code);
        return;
      }
    }
    if (code === 60 && this.state.canStartJSXElement && this.input.charCodeAt(this.state.pos + 1) !== 33) {
      ++this.state.pos;
      this.finishToken(142);
      return;
    }
    super.getTokenFromCode(code);
  }
  updateContext(prevType) {
    const {
      context,
      type
    } = this.state;
    if (type === 56 && prevType === 142) {
      context.splice(-2, 2, types.j_cTag);
      this.state.canStartJSXElement = false;
    } else if (type === 142) {
      context.push(types.j_oTag);
    } else if (type === 143) {
      const out = context[context.length - 1];
      if (out === types.j_oTag && prevType === 56 || out === types.j_cTag) {
        context.pop();
        this.state.canStartJSXElement = context[context.length - 1] === types.j_expr;
      } else {
        this.setContext(types.j_expr);
        this.state.canStartJSXElement = true;
      }
    } else {
      this.state.canStartJSXElement = tokenComesBeforeExpression(type);
    }
  }
};
class TypeScriptScope extends Scope {
  constructor(...args) {
    super(...args);
    this.tsNames = new Map();
  }
}
class TypeScriptScopeHandler extends ScopeHandler {
  constructor(...args) {
    super(...args);
    this.importsStack = [];
  }
  createScope(flags) {
    this.importsStack.push(new Set());
    return new TypeScriptScope(flags);
  }
  enter(flags) {
    if (flags == 256) {
      this.importsStack.push(new Set());
    }
    super.enter(flags);
  }
  exit() {
    const flags = super.exit();
    if (flags == 256) {
      this.importsStack.pop();
    }
    return flags;
  }
  hasImport(name, allowShadow) {
    const len = this.importsStack.length;
    if (this.importsStack[len - 1].has(name)) {
      return true;
    }
    if (!allowShadow && len > 1) {
      for (let i = 0; i < len - 1; i++) {
        if (this.importsStack[i].has(name)) return true;
      }
    }
    return false;
  }
  declareName(name, bindingType, loc) {
    if (bindingType & 4096) {
      if (this.hasImport(name, true)) {
        this.parser.raise(Errors.VarRedeclaration, loc, {
          identifierName: name
        });
      }
      this.importsStack[this.importsStack.length - 1].add(name);
      return;
    }
    const scope = this.currentScope();
    let type = scope.tsNames.get(name) || 0;
    if (bindingType & 1024) {
      this.maybeExportDefined(scope, name);
      scope.tsNames.set(name, type | 16);
      return;
    }
    super.declareName(name, bindingType, loc);
    if (bindingType & 2) {
      if (!(bindingType & 1)) {
        this.checkRedeclarationInScope(scope, name, bindingType, loc);
        this.maybeExportDefined(scope, name);
      }
      type = type | 1;
    }
    if (bindingType & 256) {
      type = type | 2;
    }
    if (bindingType & 512) {
      type = type | 4;
    }
    if (bindingType & 128) {
      type = type | 8;
    }
    if (type) scope.tsNames.set(name, type);
  }
  isRedeclaredInScope(scope, name, bindingType) {
    const type = scope.tsNames.get(name);
    if ((type & 2) > 0) {
      if (bindingType & 256) {
        const isConst = !!(bindingType & 512);
        const wasConst = (type & 4) > 0;
        return isConst !== wasConst;
      }
      return true;
    }
    if (bindingType & 128 && (type & 8) > 0) {
      if (scope.names.get(name) & 2) {
        return !!(bindingType & 1);
      } else {
        return false;
      }
    }
    if (bindingType & 2 && (type & 1) > 0) {
      return true;
    }
    return super.isRedeclaredInScope(scope, name, bindingType);
  }
  checkLocalExport(id) {
    const {
      name
    } = id;
    if (this.hasImport(name)) return;
    const len = this.scopeStack.length;
    for (let i = len - 1; i >= 0; i--) {
      const scope = this.scopeStack[i];
      const type = scope.tsNames.get(name);
      if ((type & 1) > 0 || (type & 16) > 0) {
        return;
      }
    }
    super.checkLocalExport(id);
  }
}
const getOwn$1 = (object, key) => hasOwnProperty.call(object, key) && object[key];
const unwrapParenthesizedExpression = node => {
  return node.type === "ParenthesizedExpression" ? unwrapParenthesizedExpression(node.expression) : node;
};
class LValParser extends NodeUtils {
  toAssignable(node, isLHS = false) {
    var _node$extra, _node$extra3;
    let parenthesized = undefined;
    if (node.type === "ParenthesizedExpression" || (_node$extra = node.extra) != null && _node$extra.parenthesized) {
      parenthesized = unwrapParenthesizedExpression(node);
      if (isLHS) {
        if (parenthesized.type === "Identifier") {
          this.expressionScope.recordArrowParameterBindingError(Errors.InvalidParenthesizedAssignment, node);
        } else if (parenthesized.type !== "MemberExpression" && !this.isOptionalMemberExpression(parenthesized)) {
          this.raise(Errors.InvalidParenthesizedAssignment, node);
        }
      } else {
        this.raise(Errors.InvalidParenthesizedAssignment, node);
      }
    }
    switch (node.type) {
      case "Identifier":
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        break;
      case "ObjectExpression":
        node.type = "ObjectPattern";
        for (let i = 0, length = node.properties.length, last = length - 1; i < length; i++) {
          var _node$extra2;
          const prop = node.properties[i];
          const isLast = i === last;
          this.toAssignableObjectExpressionProp(prop, isLast, isLHS);
          if (isLast && prop.type === "RestElement" && (_node$extra2 = node.extra) != null && _node$extra2.trailingCommaLoc) {
            this.raise(Errors.RestTrailingComma, node.extra.trailingCommaLoc);
          }
        }
        break;
      case "ObjectProperty":
        {
          const {
            key,
            value
          } = node;
          if (this.isPrivateName(key)) {
            this.classScope.usePrivateName(this.getPrivateNameSV(key), key.loc.start);
          }
          this.toAssignable(value, isLHS);
          break;
        }
      case "SpreadElement":
        {
          throw new Error("Internal @babel/parser error (this is a bug, please report it)." + " SpreadElement should be converted by .toAssignable's caller.");
        }
      case "ArrayExpression":
        node.type = "ArrayPattern";
        this.toAssignableList(node.elements, (_node$extra3 = node.extra) == null ? void 0 : _node$extra3.trailingCommaLoc, isLHS);
        break;
      case "AssignmentExpression":
        if (node.operator !== "=") {
          this.raise(Errors.MissingEqInAssignment, node.left.loc.end);
        }
        node.type = "AssignmentPattern";
        delete node.operator;
        this.toAssignable(node.left, isLHS);
        break;
      case "ParenthesizedExpression":
        this.toAssignable(parenthesized, isLHS);
        break;
    }
  }
  toAssignableObjectExpressionProp(prop, isLast, isLHS) {
    if (prop.type === "ObjectMethod") {
      this.raise(prop.kind === "get" || prop.kind === "set" ? Errors.PatternHasAccessor : Errors.PatternHasMethod, prop.key);
    } else if (prop.type === "SpreadElement") {
      prop.type = "RestElement";
      const arg = prop.argument;
      this.checkToRestConversion(arg, false);
      this.toAssignable(arg, isLHS);
      if (!isLast) {
        this.raise(Errors.RestTrailingComma, prop);
      }
    } else {
      this.toAssignable(prop, isLHS);
    }
  }
  toAssignableList(exprList, trailingCommaLoc, isLHS) {
    const end = exprList.length - 1;
    for (let i = 0; i <= end; i++) {
      const elt = exprList[i];
      if (!elt) continue;
      if (elt.type === "SpreadElement") {
        elt.type = "RestElement";
        const arg = elt.argument;
        this.checkToRestConversion(arg, true);
        this.toAssignable(arg, isLHS);
      } else {
        this.toAssignable(elt, isLHS);
      }
      if (elt.type === "RestElement") {
        if (i < end) {
          this.raise(Errors.RestTrailingComma, elt);
        } else if (trailingCommaLoc) {
          this.raise(Errors.RestTrailingComma, trailingCommaLoc);
        }
      }
    }
  }
  isAssignable(node, isBinding) {
    switch (node.type) {
      case "Identifier":
      case "ObjectPattern":
      case "ArrayPattern":
      case "AssignmentPattern":
      case "RestElement":
        return true;
      case "ObjectExpression":
        {
          const last = node.properties.length - 1;
          return node.properties.every((prop, i) => {
            return prop.type !== "ObjectMethod" && (i === last || prop.type !== "SpreadElement") && this.isAssignable(prop);
          });
        }
      case "ObjectProperty":
        return this.isAssignable(node.value);
      case "SpreadElement":
        return this.isAssignable(node.argument);
      case "ArrayExpression":
        return node.elements.every(element => element === null || this.isAssignable(element));
      case "AssignmentExpression":
        return node.operator === "=";
      case "ParenthesizedExpression":
        return this.isAssignable(node.expression);
      case "MemberExpression":
      case "OptionalMemberExpression":
        return !isBinding;
      default:
        return false;
    }
  }
  toReferencedList(exprList, isParenthesizedExpr) {
    return exprList;
  }
  toReferencedListDeep(exprList, isParenthesizedExpr) {
    this.toReferencedList(exprList, isParenthesizedExpr);
    for (const expr of exprList) {
      if ((expr == null ? void 0 : expr.type) === "ArrayExpression") {
        this.toReferencedListDeep(expr.elements);
      }
    }
  }
  parseSpread(refExpressionErrors) {
    const node = this.startNode();
    this.next();
    node.argument = this.parseMaybeAssignAllowIn(refExpressionErrors, undefined);
    return this.finishNode(node, "SpreadElement");
  }
  parseRestBinding() {
    const node = this.startNode();
    this.next();
    node.argument = this.parseBindingAtom();
    return this.finishNode(node, "RestElement");
  }
  parseBindingAtom() {
    switch (this.state.type) {
      case 0:
        {
          const node = this.startNode();
          this.next();
          node.elements = this.parseBindingList(3, 93, 1);
          return this.finishNode(node, "ArrayPattern");
        }
      case 5:
        return this.parseObjectLike(8, true);
    }
    return this.parseIdentifier();
  }
  parseBindingList(close, closeCharCode, flags) {
    const allowEmpty = flags & 1;
    const elts = [];
    let first = true;
    while (!this.eat(close)) {
      if (first) {
        first = false;
      } else {
        this.expect(12);
      }
      if (allowEmpty && this.match(12)) {
        elts.push(null);
      } else if (this.eat(close)) {
        break;
      } else if (this.match(21)) {
        elts.push(this.parseAssignableListItemTypes(this.parseRestBinding(), flags));
        if (!this.checkCommaAfterRest(closeCharCode)) {
          this.expect(close);
          break;
        }
      } else {
        const decorators = [];
        if (this.match(26) && this.hasPlugin("decorators")) {
          this.raise(Errors.UnsupportedParameterDecorator, this.state.startLoc);
        }
        while (this.match(26)) {
          decorators.push(this.parseDecorator());
        }
        elts.push(this.parseAssignableListItem(flags, decorators));
      }
    }
    return elts;
  }
  parseBindingRestProperty(prop) {
    this.next();
    prop.argument = this.parseIdentifier();
    this.checkCommaAfterRest(125);
    return this.finishNode(prop, "RestElement");
  }
  parseBindingProperty() {
    const prop = this.startNode();
    const {
      type,
      startLoc
    } = this.state;
    if (type === 21) {
      return this.parseBindingRestProperty(prop);
    } else if (type === 138) {
      this.expectPlugin("destructuringPrivate", startLoc);
      this.classScope.usePrivateName(this.state.value, startLoc);
      prop.key = this.parsePrivateName();
    } else {
      this.parsePropertyName(prop);
    }
    prop.method = false;
    return this.parseObjPropValue(prop, startLoc, false, false, true, false);
  }
  parseAssignableListItem(flags, decorators) {
    const left = this.parseMaybeDefault();
    this.parseAssignableListItemTypes(left, flags);
    const elt = this.parseMaybeDefault(left.loc.start, left);
    if (decorators.length) {
      left.decorators = decorators;
    }
    return elt;
  }
  parseAssignableListItemTypes(param, flags) {
    return param;
  }
  parseMaybeDefault(startLoc, left) {
    var _startLoc, _left;
    (_startLoc = startLoc) != null ? _startLoc : startLoc = this.state.startLoc;
    left = (_left = left) != null ? _left : this.parseBindingAtom();
    if (!this.eat(29)) return left;
    const node = this.startNodeAt(startLoc);
    node.left = left;
    node.right = this.parseMaybeAssignAllowIn();
    return this.finishNode(node, "AssignmentPattern");
  }
  isValidLVal(type, isUnparenthesizedInAssign, binding) {
    return getOwn$1({
      AssignmentPattern: "left",
      RestElement: "argument",
      ObjectProperty: "value",
      ParenthesizedExpression: "expression",
      ArrayPattern: "elements",
      ObjectPattern: "properties"
    }, type);
  }
  isOptionalMemberExpression(expression) {
    return expression.type === "OptionalMemberExpression";
  }
  checkLVal(expression, {
    in: ancestor,
    binding = 64,
    checkClashes = false,
    strictModeChanged = false,
    hasParenthesizedAncestor = false
  }) {
    var _expression$extra;
    const type = expression.type;
    if (this.isObjectMethod(expression)) return;
    const isOptionalMemberExpression = this.isOptionalMemberExpression(expression);
    if (isOptionalMemberExpression || type === "MemberExpression") {
      if (isOptionalMemberExpression) {
        this.expectPlugin("optionalChainingAssign", expression.loc.start);
        if (ancestor.type !== "AssignmentExpression") {
          this.raise(Errors.InvalidLhsOptionalChaining, expression, {
            ancestor
          });
        }
      }
      if (binding !== 64) {
        this.raise(Errors.InvalidPropertyBindingPattern, expression);
      }
      return;
    }
    if (type === "Identifier") {
      this.checkIdentifier(expression, binding, strictModeChanged);
      const {
        name
      } = expression;
      if (checkClashes) {
        if (checkClashes.has(name)) {
          this.raise(Errors.ParamDupe, expression);
        } else {
          checkClashes.add(name);
        }
      }
      return;
    }
    const validity = this.isValidLVal(type, !(hasParenthesizedAncestor || (_expression$extra = expression.extra) != null && _expression$extra.parenthesized) && ancestor.type === "AssignmentExpression", binding);
    if (validity === true) return;
    if (validity === false) {
      const ParseErrorClass = binding === 64 ? Errors.InvalidLhs : Errors.InvalidLhsBinding;
      this.raise(ParseErrorClass, expression, {
        ancestor
      });
      return;
    }
    const [key, isParenthesizedExpression] = Array.isArray(validity) ? validity : [validity, type === "ParenthesizedExpression"];
    const nextAncestor = type === "ArrayPattern" || type === "ObjectPattern" ? {
      type
    } : ancestor;
    for (const child of [].concat(expression[key])) {
      if (child) {
        this.checkLVal(child, {
          in: nextAncestor,
          binding,
          checkClashes,
          strictModeChanged,
          hasParenthesizedAncestor: isParenthesizedExpression
        });
      }
    }
  }
  checkIdentifier(at, bindingType, strictModeChanged = false) {
    if (this.state.strict && (strictModeChanged ? isStrictBindReservedWord(at.name, this.inModule) : isStrictBindOnlyReservedWord(at.name))) {
      if (bindingType === 64) {
        this.raise(Errors.StrictEvalArguments, at, {
          referenceName: at.name
        });
      } else {
        this.raise(Errors.StrictEvalArgumentsBinding, at, {
          bindingName: at.name
        });
      }
    }
    if (bindingType & 8192 && at.name === "let") {
      this.raise(Errors.LetInLexicalBinding, at);
    }
    if (!(bindingType & 64)) {
      this.declareNameFromIdentifier(at, bindingType);
    }
  }
  declareNameFromIdentifier(identifier, binding) {
    this.scope.declareName(identifier.name, binding, identifier.loc.start);
  }
  checkToRestConversion(node, allowPattern) {
    switch (node.type) {
      case "ParenthesizedExpression":
        this.checkToRestConversion(node.expression, allowPattern);
        break;
      case "Identifier":
      case "MemberExpression":
        break;
      case "ArrayExpression":
      case "ObjectExpression":
        if (allowPattern) break;
      default:
        this.raise(Errors.InvalidRestAssignmentPattern, node);
    }
  }
  checkCommaAfterRest(close) {
    if (!this.match(12)) {
      return false;
    }
    this.raise(this.lookaheadCharCode() === close ? Errors.RestTrailingComma : Errors.ElementAfterRest, this.state.startLoc);
    return true;
  }
}
const getOwn = (object, key) => hasOwnProperty.call(object, key) && object[key];
function nonNull(x) {
  if (x == null) {
    throw new Error(`Unexpected ${x} value.`);
  }
  return x;
}
function assert(x) {
  if (!x) {
    throw new Error("Assert fail");
  }
}
const TSErrors = ParseErrorEnum`typescript`({
  AbstractMethodHasImplementation: ({
    methodName
  }) => `Method '${methodName}' cannot have an implementation because it is marked abstract.`,
  AbstractPropertyHasInitializer: ({
    propertyName
  }) => `Property '${propertyName}' cannot have an initializer because it is marked abstract.`,
  AccesorCannotDeclareThisParameter: "'get' and 'set' accessors cannot declare 'this' parameters.",
  AccesorCannotHaveTypeParameters: "An accessor cannot have type parameters.",
  AccessorCannotBeOptional: "An 'accessor' property cannot be declared optional.",
  ClassMethodHasDeclare: "Class methods cannot have the 'declare' modifier.",
  ClassMethodHasReadonly: "Class methods cannot have the 'readonly' modifier.",
  ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference: "A 'const' initializer in an ambient context must be a string or numeric literal or literal enum reference.",
  ConstructorHasTypeParameters: "Type parameters cannot appear on a constructor declaration.",
  DeclareAccessor: ({
    kind
  }) => `'declare' is not allowed in ${kind}ters.`,
  DeclareClassFieldHasInitializer: "Initializers are not allowed in ambient contexts.",
  DeclareFunctionHasImplementation: "An implementation cannot be declared in ambient contexts.",
  DuplicateAccessibilityModifier: ({
    modifier
  }) => `Accessibility modifier already seen.`,
  DuplicateModifier: ({
    modifier
  }) => `Duplicate modifier: '${modifier}'.`,
  EmptyHeritageClauseType: ({
    token
  }) => `'${token}' list cannot be empty.`,
  EmptyTypeArguments: "Type argument list cannot be empty.",
  EmptyTypeParameters: "Type parameter list cannot be empty.",
  ExpectedAmbientAfterExportDeclare: "'export declare' must be followed by an ambient declaration.",
  ImportAliasHasImportType: "An import alias can not use 'import type'.",
  ImportReflectionHasImportType: "An `import module` declaration can not use `type` modifier",
  IncompatibleModifiers: ({
    modifiers
  }) => `'${modifiers[0]}' modifier cannot be used with '${modifiers[1]}' modifier.`,
  IndexSignatureHasAbstract: "Index signatures cannot have the 'abstract' modifier.",
  IndexSignatureHasAccessibility: ({
    modifier
  }) => `Index signatures cannot have an accessibility modifier ('${modifier}').`,
  IndexSignatureHasDeclare: "Index signatures cannot have the 'declare' modifier.",
  IndexSignatureHasOverride: "'override' modifier cannot appear on an index signature.",
  IndexSignatureHasStatic: "Index signatures cannot have the 'static' modifier.",
  InitializerNotAllowedInAmbientContext: "Initializers are not allowed in ambient contexts.",
  InvalidModifierOnTypeMember: ({
    modifier
  }) => `'${modifier}' modifier cannot appear on a type member.`,
  InvalidModifierOnTypeParameter: ({
    modifier
  }) => `'${modifier}' modifier cannot appear on a type parameter.`,
  InvalidModifierOnTypeParameterPositions: ({
    modifier
  }) => `'${modifier}' modifier can only appear on a type parameter of a class, interface or type alias.`,
  InvalidModifiersOrder: ({
    orderedModifiers
  }) => `'${orderedModifiers[0]}' modifier must precede '${orderedModifiers[1]}' modifier.`,
  InvalidPropertyAccessAfterInstantiationExpression: "Invalid property access after an instantiation expression. " + "You can either wrap the instantiation expression in parentheses, or delete the type arguments.",
  InvalidTupleMemberLabel: "Tuple members must be labeled with a simple identifier.",
  MissingInterfaceName: "'interface' declarations must be followed by an identifier.",
  NonAbstractClassHasAbstractMethod: "Abstract methods can only appear within an abstract class.",
  NonClassMethodPropertyHasAbstractModifer: "'abstract' modifier can only appear on a class, method, or property declaration.",
  OptionalTypeBeforeRequired: "A required element cannot follow an optional element.",
  OverrideNotInSubClass: "This member cannot have an 'override' modifier because its containing class does not extend another class.",
  PatternIsOptional: "A binding pattern parameter cannot be optional in an implementation signature.",
  PrivateElementHasAbstract: "Private elements cannot have the 'abstract' modifier.",
  PrivateElementHasAccessibility: ({
    modifier
  }) => `Private elements cannot have an accessibility modifier ('${modifier}').`,
  ReadonlyForMethodSignature: "'readonly' modifier can only appear on a property declaration or index signature.",
  ReservedArrowTypeParam: "This syntax is reserved in files with the .mts or .cts extension. Add a trailing comma, as in `<T,>() => ...`.",
  ReservedTypeAssertion: "This syntax is reserved in files with the .mts or .cts extension. Use an `as` expression instead.",
  SetAccesorCannotHaveOptionalParameter: "A 'set' accessor cannot have an optional parameter.",
  SetAccesorCannotHaveRestParameter: "A 'set' accessor cannot have rest parameter.",
  SetAccesorCannotHaveReturnType: "A 'set' accessor cannot have a return type annotation.",
  SingleTypeParameterWithoutTrailingComma: ({
    typeParameterName
  }) => `Single type parameter ${typeParameterName} should have a trailing comma. Example usage: <${typeParameterName},>.`,
  StaticBlockCannotHaveModifier: "Static class blocks cannot have any modifier.",
  TupleOptionalAfterType: "A labeled tuple optional element must be declared using a question mark after the name and before the colon (`name?: type`), rather than after the type (`name: type?`).",
  TypeAnnotationAfterAssign: "Type annotations must come before default assignments, e.g. instead of `age = 25: number` use `age: number = 25`.",
  TypeImportCannotSpecifyDefaultAndNamed: "A type-only import can specify a default import or named bindings, but not both.",
  TypeModifierIsUsedInTypeExports: "The 'type' modifier cannot be used on a named export when 'export type' is used on its export statement.",
  TypeModifierIsUsedInTypeImports: "The 'type' modifier cannot be used on a named import when 'import type' is used on its import statement.",
  UnexpectedParameterModifier: "A parameter property is only allowed in a constructor implementation.",
  UnexpectedReadonly: "'readonly' type modifier is only permitted on array and tuple literal types.",
  UnexpectedTypeAnnotation: "Did not expect a type annotation here.",
  UnexpectedTypeCastInParameter: "Unexpected type cast in parameter position.",
  UnsupportedImportTypeArgument: "Argument in a type import must be a string literal.",
  UnsupportedParameterPropertyKind: "A parameter property may not be declared using a binding pattern.",
  UnsupportedSignatureParameterKind: ({
    type
  }) => `Name in a signature must be an Identifier, ObjectPattern or ArrayPattern, instead got ${type}.`
});
function keywordTypeFromName(value) {
  switch (value) {
    case "any":
      return "TSAnyKeyword";
    case "boolean":
      return "TSBooleanKeyword";
    case "bigint":
      return "TSBigIntKeyword";
    case "never":
      return "TSNeverKeyword";
    case "number":
      return "TSNumberKeyword";
    case "object":
      return "TSObjectKeyword";
    case "string":
      return "TSStringKeyword";
    case "symbol":
      return "TSSymbolKeyword";
    case "undefined":
      return "TSUndefinedKeyword";
    case "unknown":
      return "TSUnknownKeyword";
    default:
      return undefined;
  }
}
function tsIsAccessModifier(modifier) {
  return modifier === "private" || modifier === "public" || modifier === "protected";
}
function tsIsVarianceAnnotations(modifier) {
  return modifier === "in" || modifier === "out";
}
var typescript = superClass => class TypeScriptParserMixin extends superClass {
  constructor(...args) {
    super(...args);
    this.tsParseInOutModifiers = this.tsParseModifiers.bind(this, {
      allowedModifiers: ["in", "out"],
      disallowedModifiers: ["const", "public", "private", "protected", "readonly", "declare", "abstract", "override"],
      errorTemplate: TSErrors.InvalidModifierOnTypeParameter
    });
    this.tsParseConstModifier = this.tsParseModifiers.bind(this, {
      allowedModifiers: ["const"],
      disallowedModifiers: ["in", "out"],
      errorTemplate: TSErrors.InvalidModifierOnTypeParameterPositions
    });
    this.tsParseInOutConstModifiers = this.tsParseModifiers.bind(this, {
      allowedModifiers: ["in", "out", "const"],
      disallowedModifiers: ["public", "private", "protected", "readonly", "declare", "abstract", "override"],
      errorTemplate: TSErrors.InvalidModifierOnTypeParameter
    });
  }
  getScopeHandler() {
    return TypeScriptScopeHandler;
  }
  tsIsIdentifier() {
    return tokenIsIdentifier(this.state.type);
  }
  tsTokenCanFollowModifier() {
    return (this.match(0) || this.match(5) || this.match(55) || this.match(21) || this.match(138) || this.isLiteralPropertyName()) && !this.hasPrecedingLineBreak();
  }
  tsNextTokenCanFollowModifier() {
    this.next();
    return this.tsTokenCanFollowModifier();
  }
  tsParseModifier(allowedModifiers, stopOnStartOfClassStaticBlock) {
    if (!tokenIsIdentifier(this.state.type) && this.state.type !== 58 && this.state.type !== 75) {
      return undefined;
    }
    const modifier = this.state.value;
    if (allowedModifiers.indexOf(modifier) !== -1) {
      if (stopOnStartOfClassStaticBlock && this.tsIsStartOfStaticBlocks()) {
        return undefined;
      }
      if (this.tsTryParse(this.tsNextTokenCanFollowModifier.bind(this))) {
        return modifier;
      }
    }
    return undefined;
  }
  tsParseModifiers({
    allowedModifiers,
    disallowedModifiers,
    stopOnStartOfClassStaticBlock,
    errorTemplate = TSErrors.InvalidModifierOnTypeMember
  }, modified) {
    const enforceOrder = (loc, modifier, before, after) => {
      if (modifier === before && modified[after]) {
        this.raise(TSErrors.InvalidModifiersOrder, loc, {
          orderedModifiers: [before, after]
        });
      }
    };
    const incompatible = (loc, modifier, mod1, mod2) => {
      if (modified[mod1] && modifier === mod2 || modified[mod2] && modifier === mod1) {
        this.raise(TSErrors.IncompatibleModifiers, loc, {
          modifiers: [mod1, mod2]
        });
      }
    };
    for (;;) {
      const {
        startLoc
      } = this.state;
      const modifier = this.tsParseModifier(allowedModifiers.concat(disallowedModifiers != null ? disallowedModifiers : []), stopOnStartOfClassStaticBlock);
      if (!modifier) break;
      if (tsIsAccessModifier(modifier)) {
        if (modified.accessibility) {
          this.raise(TSErrors.DuplicateAccessibilityModifier, startLoc, {
            modifier
          });
        } else {
          enforceOrder(startLoc, modifier, modifier, "override");
          enforceOrder(startLoc, modifier, modifier, "static");
          enforceOrder(startLoc, modifier, modifier, "readonly");
          modified.accessibility = modifier;
        }
      } else if (tsIsVarianceAnnotations(modifier)) {
        if (modified[modifier]) {
          this.raise(TSErrors.DuplicateModifier, startLoc, {
            modifier
          });
        }
        modified[modifier] = true;
        enforceOrder(startLoc, modifier, "in", "out");
      } else {
        if (hasOwnProperty.call(modified, modifier)) {
          this.raise(TSErrors.DuplicateModifier, startLoc, {
            modifier
          });
        } else {
          enforceOrder(startLoc, modifier, "static", "readonly");
          enforceOrder(startLoc, modifier, "static", "override");
          enforceOrder(startLoc, modifier, "override", "readonly");
          enforceOrder(startLoc, modifier, "abstract", "override");
          incompatible(startLoc, modifier, "declare", "override");
          incompatible(startLoc, modifier, "static", "abstract");
        }
        modified[modifier] = true;
      }
      if (disallowedModifiers != null && disallowedModifiers.includes(modifier)) {
        this.raise(errorTemplate, startLoc, {
          modifier
        });
      }
    }
  }
  tsIsListTerminator(kind) {
    switch (kind) {
      case "EnumMembers":
      case "TypeMembers":
        return this.match(8);
      case "HeritageClauseElement":
        return this.match(5);
      case "TupleElementTypes":
        return this.match(3);
      case "TypeParametersOrArguments":
        return this.match(48);
    }
  }
  tsParseList(kind, parseElement) {
    const result = [];
    while (!this.tsIsListTerminator(kind)) {
      result.push(parseElement());
    }
    return result;
  }
  tsParseDelimitedList(kind, parseElement, refTrailingCommaPos) {
    return nonNull(this.tsParseDelimitedListWorker(kind, parseElement, true, refTrailingCommaPos));
  }
  tsParseDelimitedListWorker(kind, parseElement, expectSuccess, refTrailingCommaPos) {
    const result = [];
    let trailingCommaPos = -1;
    for (;;) {
      if (this.tsIsListTerminator(kind)) {
        break;
      }
      trailingCommaPos = -1;
      const element = parseElement();
      if (element == null) {
        return undefined;
      }
      result.push(element);
      if (this.eat(12)) {
        trailingCommaPos = this.state.lastTokStartLoc.index;
        continue;
      }
      if (this.tsIsListTerminator(kind)) {
        break;
      }
      if (expectSuccess) {
        this.expect(12);
      }
      return undefined;
    }
    if (refTrailingCommaPos) {
      refTrailingCommaPos.value = trailingCommaPos;
    }
    return result;
  }
  tsParseBracketedList(kind, parseElement, bracket, skipFirstToken, refTrailingCommaPos) {
    if (!skipFirstToken) {
      if (bracket) {
        this.expect(0);
      } else {
        this.expect(47);
      }
    }
    const result = this.tsParseDelimitedList(kind, parseElement, refTrailingCommaPos);
    if (bracket) {
      this.expect(3);
    } else {
      this.expect(48);
    }
    return result;
  }
  tsParseImportType() {
    const node = this.startNode();
    this.expect(83);
    this.expect(10);
    if (!this.match(133)) {
      this.raise(TSErrors.UnsupportedImportTypeArgument, this.state.startLoc);
    }
    node.argument = super.parseExprAtom();
    if (this.hasPlugin("importAttributes") || this.hasPlugin("importAssertions")) {
      node.options = null;
    }
    if (this.eat(12)) {
      this.expectImportAttributesPlugin();
      if (!this.match(11)) {
        node.options = super.parseMaybeAssignAllowIn();
        this.eat(12);
      }
    }
    this.expect(11);
    if (this.eat(16)) {
      node.qualifier = this.tsParseEntityName();
    }
    if (this.match(47)) {
      node.typeParameters = this.tsParseTypeArguments();
    }
    return this.finishNode(node, "TSImportType");
  }
  tsParseEntityName(allowReservedWords = true) {
    let entity = this.parseIdentifier(allowReservedWords);
    while (this.eat(16)) {
      const node = this.startNodeAtNode(entity);
      node.left = entity;
      node.right = this.parseIdentifier(allowReservedWords);
      entity = this.finishNode(node, "TSQualifiedName");
    }
    return entity;
  }
  tsParseTypeReference() {
    const node = this.startNode();
    node.typeName = this.tsParseEntityName();
    if (!this.hasPrecedingLineBreak() && this.match(47)) {
      node.typeParameters = this.tsParseTypeArguments();
    }
    return this.finishNode(node, "TSTypeReference");
  }
  tsParseThisTypePredicate(lhs) {
    this.next();
    const node = this.startNodeAtNode(lhs);
    node.parameterName = lhs;
    node.typeAnnotation = this.tsParseTypeAnnotation(false);
    node.asserts = false;
    return this.finishNode(node, "TSTypePredicate");
  }
  tsParseThisTypeNode() {
    const node = this.startNode();
    this.next();
    return this.finishNode(node, "TSThisType");
  }
  tsParseTypeQuery() {
    const node = this.startNode();
    this.expect(87);
    if (this.match(83)) {
      node.exprName = this.tsParseImportType();
    } else {
      node.exprName = this.tsParseEntityName();
    }
    if (!this.hasPrecedingLineBreak() && this.match(47)) {
      node.typeParameters = this.tsParseTypeArguments();
    }
    return this.finishNode(node, "TSTypeQuery");
  }
  tsParseTypeParameter(parseModifiers) {
    const node = this.startNode();
    parseModifiers(node);
    node.name = this.tsParseTypeParameterName();
    node.constraint = this.tsEatThenParseType(81);
    node.default = this.tsEatThenParseType(29);
    return this.finishNode(node, "TSTypeParameter");
  }
  tsTryParseTypeParameters(parseModifiers) {
    if (this.match(47)) {
      return this.tsParseTypeParameters(parseModifiers);
    }
  }
  tsParseTypeParameters(parseModifiers) {
    const node = this.startNode();
    if (this.match(47) || this.match(142)) {
      this.next();
    } else {
      this.unexpected();
    }
    const refTrailingCommaPos = {
      value: -1
    };
    node.params = this.tsParseBracketedList("TypeParametersOrArguments", this.tsParseTypeParameter.bind(this, parseModifiers), false, true, refTrailingCommaPos);
    if (node.params.length === 0) {
      this.raise(TSErrors.EmptyTypeParameters, node);
    }
    if (refTrailingCommaPos.value !== -1) {
      this.addExtra(node, "trailingComma", refTrailingCommaPos.value);
    }
    return this.finishNode(node, "TSTypeParameterDeclaration");
  }
  tsFillSignature(returnToken, signature) {
    const returnTokenRequired = returnToken === 19;
    const paramsKey = "parameters";
    const returnTypeKey = "typeAnnotation";
    signature.typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
    this.expect(10);
    signature[paramsKey] = this.tsParseBindingListForSignature();
    if (returnTokenRequired) {
      signature[returnTypeKey] = this.tsParseTypeOrTypePredicateAnnotation(returnToken);
    } else if (this.match(returnToken)) {
      signature[returnTypeKey] = this.tsParseTypeOrTypePredicateAnnotation(returnToken);
    }
  }
  tsParseBindingListForSignature() {
    const list = super.parseBindingList(11, 41, 2);
    for (const pattern of list) {
      const {
        type
      } = pattern;
      if (type === "AssignmentPattern" || type === "TSParameterProperty") {
        this.raise(TSErrors.UnsupportedSignatureParameterKind, pattern, {
          type
        });
      }
    }
    return list;
  }
  tsParseTypeMemberSemicolon() {
    if (!this.eat(12) && !this.isLineTerminator()) {
      this.expect(13);
    }
  }
  tsParseSignatureMember(kind, node) {
    this.tsFillSignature(14, node);
    this.tsParseTypeMemberSemicolon();
    return this.finishNode(node, kind);
  }
  tsIsUnambiguouslyIndexSignature() {
    this.next();
    if (tokenIsIdentifier(this.state.type)) {
      this.next();
      return this.match(14);
    }
    return false;
  }
  tsTryParseIndexSignature(node) {
    if (!(this.match(0) && this.tsLookAhead(this.tsIsUnambiguouslyIndexSignature.bind(this)))) {
      return;
    }
    this.expect(0);
    const id = this.parseIdentifier();
    id.typeAnnotation = this.tsParseTypeAnnotation();
    this.resetEndLocation(id);
    this.expect(3);
    node.parameters = [id];
    const type = this.tsTryParseTypeAnnotation();
    if (type) node.typeAnnotation = type;
    this.tsParseTypeMemberSemicolon();
    return this.finishNode(node, "TSIndexSignature");
  }
  tsParsePropertyOrMethodSignature(node, readonly) {
    if (this.eat(17)) node.optional = true;
    const nodeAny = node;
    if (this.match(10) || this.match(47)) {
      if (readonly) {
        this.raise(TSErrors.ReadonlyForMethodSignature, node);
      }
      const method = nodeAny;
      if (method.kind && this.match(47)) {
        this.raise(TSErrors.AccesorCannotHaveTypeParameters, this.state.curPosition());
      }
      this.tsFillSignature(14, method);
      this.tsParseTypeMemberSemicolon();
      const paramsKey = "parameters";
      const returnTypeKey = "typeAnnotation";
      if (method.kind === "get") {
        if (method[paramsKey].length > 0) {
          this.raise(Errors.BadGetterArity, this.state.curPosition());
          if (this.isThisParam(method[paramsKey][0])) {
            this.raise(TSErrors.AccesorCannotDeclareThisParameter, this.state.curPosition());
          }
        }
      } else if (method.kind === "set") {
        if (method[paramsKey].length !== 1) {
          this.raise(Errors.BadSetterArity, this.state.curPosition());
        } else {
          const firstParameter = method[paramsKey][0];
          if (this.isThisParam(firstParameter)) {
            this.raise(TSErrors.AccesorCannotDeclareThisParameter, this.state.curPosition());
          }
          if (firstParameter.type === "Identifier" && firstParameter.optional) {
            this.raise(TSErrors.SetAccesorCannotHaveOptionalParameter, this.state.curPosition());
          }
          if (firstParameter.type === "RestElement") {
            this.raise(TSErrors.SetAccesorCannotHaveRestParameter, this.state.curPosition());
          }
        }
        if (method[returnTypeKey]) {
          this.raise(TSErrors.SetAccesorCannotHaveReturnType, method[returnTypeKey]);
        }
      } else {
        method.kind = "method";
      }
      return this.finishNode(method, "TSMethodSignature");
    } else {
      const property = nodeAny;
      if (readonly) property.readonly = true;
      const type = this.tsTryParseTypeAnnotation();
      if (type) property.typeAnnotation = type;
      this.tsParseTypeMemberSemicolon();
      return this.finishNode(property, "TSPropertySignature");
    }
  }
  tsParseTypeMember() {
    const node = this.startNode();
    if (this.match(10) || this.match(47)) {
      return this.tsParseSignatureMember("TSCallSignatureDeclaration", node);
    }
    if (this.match(77)) {
      const id = this.startNode();
      this.next();
      if (this.match(10) || this.match(47)) {
        return this.tsParseSignatureMember("TSConstructSignatureDeclaration", node);
      } else {
        node.key = this.createIdentifier(id, "new");
        return this.tsParsePropertyOrMethodSignature(node, false);
      }
    }
    this.tsParseModifiers({
      allowedModifiers: ["readonly"],
      disallowedModifiers: ["declare", "abstract", "private", "protected", "public", "static", "override"]
    }, node);
    const idx = this.tsTryParseIndexSignature(node);
    if (idx) {
      return idx;
    }
    super.parsePropertyName(node);
    if (!node.computed && node.key.type === "Identifier" && (node.key.name === "get" || node.key.name === "set") && this.tsTokenCanFollowModifier()) {
      node.kind = node.key.name;
      super.parsePropertyName(node);
    }
    return this.tsParsePropertyOrMethodSignature(node, !!node.readonly);
  }
  tsParseTypeLiteral() {
    const node = this.startNode();
    node.members = this.tsParseObjectTypeMembers();
    return this.finishNode(node, "TSTypeLiteral");
  }
  tsParseObjectTypeMembers() {
    this.expect(5);
    const members = this.tsParseList("TypeMembers", this.tsParseTypeMember.bind(this));
    this.expect(8);
    return members;
  }
  tsIsStartOfMappedType() {
    this.next();
    if (this.eat(53)) {
      return this.isContextual(122);
    }
    if (this.isContextual(122)) {
      this.next();
    }
    if (!this.match(0)) {
      return false;
    }
    this.next();
    if (!this.tsIsIdentifier()) {
      return false;
    }
    this.next();
    return this.match(58);
  }
  tsParseMappedTypeParameter() {
    const node = this.startNode();
    node.name = this.tsParseTypeParameterName();
    node.constraint = this.tsExpectThenParseType(58);
    return this.finishNode(node, "TSTypeParameter");
  }
  tsParseMappedType() {
    const node = this.startNode();
    this.expect(5);
    if (this.match(53)) {
      node.readonly = this.state.value;
      this.next();
      this.expectContextual(122);
    } else if (this.eatContextual(122)) {
      node.readonly = true;
    }
    this.expect(0);
    node.typeParameter = this.tsParseMappedTypeParameter();
    node.nameType = this.eatContextual(93) ? this.tsParseType() : null;
    this.expect(3);
    if (this.match(53)) {
      node.optional = this.state.value;
      this.next();
      this.expect(17);
    } else if (this.eat(17)) {
      node.optional = true;
    }
    node.typeAnnotation = this.tsTryParseType();
    this.semicolon();
    this.expect(8);
    return this.finishNode(node, "TSMappedType");
  }
  tsParseTupleType() {
    const node = this.startNode();
    node.elementTypes = this.tsParseBracketedList("TupleElementTypes", this.tsParseTupleElementType.bind(this), true, false);
    let seenOptionalElement = false;
    node.elementTypes.forEach(elementNode => {
      const {
        type
      } = elementNode;
      if (seenOptionalElement && type !== "TSRestType" && type !== "TSOptionalType" && !(type === "TSNamedTupleMember" && elementNode.optional)) {
        this.raise(TSErrors.OptionalTypeBeforeRequired, elementNode);
      }
      seenOptionalElement || (seenOptionalElement = type === "TSNamedTupleMember" && elementNode.optional || type === "TSOptionalType");
    });
    return this.finishNode(node, "TSTupleType");
  }
  tsParseTupleElementType() {
    const {
      startLoc
    } = this.state;
    const rest = this.eat(21);
    let labeled;
    let label;
    let optional;
    let type;
    const isWord = tokenIsKeywordOrIdentifier(this.state.type);
    const chAfterWord = isWord ? this.lookaheadCharCode() : null;
    if (chAfterWord === 58) {
      labeled = true;
      optional = false;
      label = this.parseIdentifier(true);
      this.expect(14);
      type = this.tsParseType();
    } else if (chAfterWord === 63) {
      optional = true;
      const startLoc = this.state.startLoc;
      const wordName = this.state.value;
      const typeOrLabel = this.tsParseNonArrayType();
      if (this.lookaheadCharCode() === 58) {
        labeled = true;
        label = this.createIdentifier(this.startNodeAt(startLoc), wordName);
        this.expect(17);
        this.expect(14);
        type = this.tsParseType();
      } else {
        labeled = false;
        type = typeOrLabel;
        this.expect(17);
      }
    } else {
      type = this.tsParseType();
      optional = this.eat(17);
      labeled = this.eat(14);
    }
    if (labeled) {
      let labeledNode;
      if (label) {
        labeledNode = this.startNodeAtNode(label);
        labeledNode.optional = optional;
        labeledNode.label = label;
        labeledNode.elementType = type;
        if (this.eat(17)) {
          labeledNode.optional = true;
          this.raise(TSErrors.TupleOptionalAfterType, this.state.lastTokStartLoc);
        }
      } else {
        labeledNode = this.startNodeAtNode(type);
        labeledNode.optional = optional;
        this.raise(TSErrors.InvalidTupleMemberLabel, type);
        labeledNode.label = type;
        labeledNode.elementType = this.tsParseType();
      }
      type = this.finishNode(labeledNode, "TSNamedTupleMember");
    } else if (optional) {
      const optionalTypeNode = this.startNodeAtNode(type);
      optionalTypeNode.typeAnnotation = type;
      type = this.finishNode(optionalTypeNode, "TSOptionalType");
    }
    if (rest) {
      const restNode = this.startNodeAt(startLoc);
      restNode.typeAnnotation = type;
      type = this.finishNode(restNode, "TSRestType");
    }
    return type;
  }
  tsParseParenthesizedType() {
    const node = this.startNode();
    this.expect(10);
    node.typeAnnotation = this.tsParseType();
    this.expect(11);
    return this.finishNode(node, "TSParenthesizedType");
  }
  tsParseFunctionOrConstructorType(type, abstract) {
    const node = this.startNode();
    if (type === "TSConstructorType") {
      node.abstract = !!abstract;
      if (abstract) this.next();
      this.next();
    }
    this.tsInAllowConditionalTypesContext(() => this.tsFillSignature(19, node));
    return this.finishNode(node, type);
  }
  tsParseLiteralTypeNode() {
    const node = this.startNode();
    switch (this.state.type) {
      case 134:
      case 135:
      case 133:
      case 85:
      case 86:
        node.literal = super.parseExprAtom();
        break;
      default:
        this.unexpected();
    }
    return this.finishNode(node, "TSLiteralType");
  }
  tsParseTemplateLiteralType() {
    const node = this.startNode();
    node.literal = super.parseTemplate(false);
    return this.finishNode(node, "TSLiteralType");
  }
  parseTemplateSubstitution() {
    if (this.state.inType) return this.tsParseType();
    return super.parseTemplateSubstitution();
  }
  tsParseThisTypeOrThisTypePredicate() {
    const thisKeyword = this.tsParseThisTypeNode();
    if (this.isContextual(116) && !this.hasPrecedingLineBreak()) {
      return this.tsParseThisTypePredicate(thisKeyword);
    } else {
      return thisKeyword;
    }
  }
  tsParseNonArrayType() {
    switch (this.state.type) {
      case 133:
      case 134:
      case 135:
      case 85:
      case 86:
        return this.tsParseLiteralTypeNode();
      case 53:
        if (this.state.value === "-") {
          const node = this.startNode();
          const nextToken = this.lookahead();
          if (nextToken.type !== 134 && nextToken.type !== 135) {
            this.unexpected();
          }
          node.literal = this.parseMaybeUnary();
          return this.finishNode(node, "TSLiteralType");
        }
        break;
      case 78:
        return this.tsParseThisTypeOrThisTypePredicate();
      case 87:
        return this.tsParseTypeQuery();
      case 83:
        return this.tsParseImportType();
      case 5:
        return this.tsLookAhead(this.tsIsStartOfMappedType.bind(this)) ? this.tsParseMappedType() : this.tsParseTypeLiteral();
      case 0:
        return this.tsParseTupleType();
      case 10:
        return this.tsParseParenthesizedType();
      case 25:
      case 24:
        return this.tsParseTemplateLiteralType();
      default:
        {
          const {
            type
          } = this.state;
          if (tokenIsIdentifier(type) || type === 88 || type === 84) {
            const nodeType = type === 88 ? "TSVoidKeyword" : type === 84 ? "TSNullKeyword" : keywordTypeFromName(this.state.value);
            if (nodeType !== undefined && this.lookaheadCharCode() !== 46) {
              const node = this.startNode();
              this.next();
              return this.finishNode(node, nodeType);
            }
            return this.tsParseTypeReference();
          }
        }
    }
    this.unexpected();
  }
  tsParseArrayTypeOrHigher() {
    let type = this.tsParseNonArrayType();
    while (!this.hasPrecedingLineBreak() && this.eat(0)) {
      if (this.match(3)) {
        const node = this.startNodeAtNode(type);
        node.elementType = type;
        this.expect(3);
        type = this.finishNode(node, "TSArrayType");
      } else {
        const node = this.startNodeAtNode(type);
        node.objectType = type;
        node.indexType = this.tsParseType();
        this.expect(3);
        type = this.finishNode(node, "TSIndexedAccessType");
      }
    }
    return type;
  }
  tsParseTypeOperator() {
    const node = this.startNode();
    const operator = this.state.value;
    this.next();
    node.operator = operator;
    node.typeAnnotation = this.tsParseTypeOperatorOrHigher();
    if (operator === "readonly") {
      this.tsCheckTypeAnnotationForReadOnly(node);
    }
    return this.finishNode(node, "TSTypeOperator");
  }
  tsCheckTypeAnnotationForReadOnly(node) {
    switch (node.typeAnnotation.type) {
      case "TSTupleType":
      case "TSArrayType":
        return;
      default:
        this.raise(TSErrors.UnexpectedReadonly, node);
    }
  }
  tsParseInferType() {
    const node = this.startNode();
    this.expectContextual(115);
    const typeParameter = this.startNode();
    typeParameter.name = this.tsParseTypeParameterName();
    typeParameter.constraint = this.tsTryParse(() => this.tsParseConstraintForInferType());
    node.typeParameter = this.finishNode(typeParameter, "TSTypeParameter");
    return this.finishNode(node, "TSInferType");
  }
  tsParseConstraintForInferType() {
    if (this.eat(81)) {
      const constraint = this.tsInDisallowConditionalTypesContext(() => this.tsParseType());
      if (this.state.inDisallowConditionalTypesContext || !this.match(17)) {
        return constraint;
      }
    }
  }
  tsParseTypeOperatorOrHigher() {
    const isTypeOperator = tokenIsTSTypeOperator(this.state.type) && !this.state.containsEsc;
    return isTypeOperator ? this.tsParseTypeOperator() : this.isContextual(115) ? this.tsParseInferType() : this.tsInAllowConditionalTypesContext(() => this.tsParseArrayTypeOrHigher());
  }
  tsParseUnionOrIntersectionType(kind, parseConstituentType, operator) {
    const node = this.startNode();
    const hasLeadingOperator = this.eat(operator);
    const types = [];
    do {
      types.push(parseConstituentType());
    } while (this.eat(operator));
    if (types.length === 1 && !hasLeadingOperator) {
      return types[0];
    }
    node.types = types;
    return this.finishNode(node, kind);
  }
  tsParseIntersectionTypeOrHigher() {
    return this.tsParseUnionOrIntersectionType("TSIntersectionType", this.tsParseTypeOperatorOrHigher.bind(this), 45);
  }
  tsParseUnionTypeOrHigher() {
    return this.tsParseUnionOrIntersectionType("TSUnionType", this.tsParseIntersectionTypeOrHigher.bind(this), 43);
  }
  tsIsStartOfFunctionType() {
    if (this.match(47)) {
      return true;
    }
    return this.match(10) && this.tsLookAhead(this.tsIsUnambiguouslyStartOfFunctionType.bind(this));
  }
  tsSkipParameterStart() {
    if (tokenIsIdentifier(this.state.type) || this.match(78)) {
      this.next();
      return true;
    }
    if (this.match(5)) {
      const {
        errors
      } = this.state;
      const previousErrorCount = errors.length;
      try {
        this.parseObjectLike(8, true);
        return errors.length === previousErrorCount;
      } catch (_unused) {
        return false;
      }
    }
    if (this.match(0)) {
      this.next();
      const {
        errors
      } = this.state;
      const previousErrorCount = errors.length;
      try {
        super.parseBindingList(3, 93, 1);
        return errors.length === previousErrorCount;
      } catch (_unused2) {
        return false;
      }
    }
    return false;
  }
  tsIsUnambiguouslyStartOfFunctionType() {
    this.next();
    if (this.match(11) || this.match(21)) {
      return true;
    }
    if (this.tsSkipParameterStart()) {
      if (this.match(14) || this.match(12) || this.match(17) || this.match(29)) {
        return true;
      }
      if (this.match(11)) {
        this.next();
        if (this.match(19)) {
          return true;
        }
      }
    }
    return false;
  }
  tsParseTypeOrTypePredicateAnnotation(returnToken) {
    return this.tsInType(() => {
      const t = this.startNode();
      this.expect(returnToken);
      const node = this.startNode();
      const asserts = !!this.tsTryParse(this.tsParseTypePredicateAsserts.bind(this));
      if (asserts && this.match(78)) {
        let thisTypePredicate = this.tsParseThisTypeOrThisTypePredicate();
        if (thisTypePredicate.type === "TSThisType") {
          node.parameterName = thisTypePredicate;
          node.asserts = true;
          node.typeAnnotation = null;
          thisTypePredicate = this.finishNode(node, "TSTypePredicate");
        } else {
          this.resetStartLocationFromNode(thisTypePredicate, node);
          thisTypePredicate.asserts = true;
        }
        t.typeAnnotation = thisTypePredicate;
        return this.finishNode(t, "TSTypeAnnotation");
      }
      const typePredicateVariable = this.tsIsIdentifier() && this.tsTryParse(this.tsParseTypePredicatePrefix.bind(this));
      if (!typePredicateVariable) {
        if (!asserts) {
          return this.tsParseTypeAnnotation(false, t);
        }
        node.parameterName = this.parseIdentifier();
        node.asserts = asserts;
        node.typeAnnotation = null;
        t.typeAnnotation = this.finishNode(node, "TSTypePredicate");
        return this.finishNode(t, "TSTypeAnnotation");
      }
      const type = this.tsParseTypeAnnotation(false);
      node.parameterName = typePredicateVariable;
      node.typeAnnotation = type;
      node.asserts = asserts;
      t.typeAnnotation = this.finishNode(node, "TSTypePredicate");
      return this.finishNode(t, "TSTypeAnnotation");
    });
  }
  tsTryParseTypeOrTypePredicateAnnotation() {
    if (this.match(14)) {
      return this.tsParseTypeOrTypePredicateAnnotation(14);
    }
  }
  tsTryParseTypeAnnotation() {
    if (this.match(14)) {
      return this.tsParseTypeAnnotation();
    }
  }
  tsTryParseType() {
    return this.tsEatThenParseType(14);
  }
  tsParseTypePredicatePrefix() {
    const id = this.parseIdentifier();
    if (this.isContextual(116) && !this.hasPrecedingLineBreak()) {
      this.next();
      return id;
    }
  }
  tsParseTypePredicateAsserts() {
    if (this.state.type !== 109) {
      return false;
    }
    const containsEsc = this.state.containsEsc;
    this.next();
    if (!tokenIsIdentifier(this.state.type) && !this.match(78)) {
      return false;
    }
    if (containsEsc) {
      this.raise(Errors.InvalidEscapedReservedWord, this.state.lastTokStartLoc, {
        reservedWord: "asserts"
      });
    }
    return true;
  }
  tsParseTypeAnnotation(eatColon = true, t = this.startNode()) {
    this.tsInType(() => {
      if (eatColon) this.expect(14);
      t.typeAnnotation = this.tsParseType();
    });
    return this.finishNode(t, "TSTypeAnnotation");
  }
  tsParseType() {
    assert(this.state.inType);
    const type = this.tsParseNonConditionalType();
    if (this.state.inDisallowConditionalTypesContext || this.hasPrecedingLineBreak() || !this.eat(81)) {
      return type;
    }
    const node = this.startNodeAtNode(type);
    node.checkType = type;
    node.extendsType = this.tsInDisallowConditionalTypesContext(() => this.tsParseNonConditionalType());
    this.expect(17);
    node.trueType = this.tsInAllowConditionalTypesContext(() => this.tsParseType());
    this.expect(14);
    node.falseType = this.tsInAllowConditionalTypesContext(() => this.tsParseType());
    return this.finishNode(node, "TSConditionalType");
  }
  isAbstractConstructorSignature() {
    return this.isContextual(124) && this.lookahead().type === 77;
  }
  tsParseNonConditionalType() {
    if (this.tsIsStartOfFunctionType()) {
      return this.tsParseFunctionOrConstructorType("TSFunctionType");
    }
    if (this.match(77)) {
      return this.tsParseFunctionOrConstructorType("TSConstructorType");
    } else if (this.isAbstractConstructorSignature()) {
      return this.tsParseFunctionOrConstructorType("TSConstructorType", true);
    }
    return this.tsParseUnionTypeOrHigher();
  }
  tsParseTypeAssertion() {
    if (this.getPluginOption("typescript", "disallowAmbiguousJSXLike")) {
      this.raise(TSErrors.ReservedTypeAssertion, this.state.startLoc);
    }
    const node = this.startNode();
    node.typeAnnotation = this.tsInType(() => {
      this.next();
      return this.match(75) ? this.tsParseTypeReference() : this.tsParseType();
    });
    this.expect(48);
    node.expression = this.parseMaybeUnary();
    return this.finishNode(node, "TSTypeAssertion");
  }
  tsParseHeritageClause(token) {
    const originalStartLoc = this.state.startLoc;
    const delimitedList = this.tsParseDelimitedList("HeritageClauseElement", () => {
      const node = this.startNode();
      node.expression = this.tsParseEntityName();
      if (this.match(47)) {
        node.typeParameters = this.tsParseTypeArguments();
      }
      return this.finishNode(node, "TSExpressionWithTypeArguments");
    });
    if (!delimitedList.length) {
      this.raise(TSErrors.EmptyHeritageClauseType, originalStartLoc, {
        token
      });
    }
    return delimitedList;
  }
  tsParseInterfaceDeclaration(node, properties = {}) {
    if (this.hasFollowingLineBreak()) return null;
    this.expectContextual(129);
    if (properties.declare) node.declare = true;
    if (tokenIsIdentifier(this.state.type)) {
      node.id = this.parseIdentifier();
      this.checkIdentifier(node.id, 130);
    } else {
      node.id = null;
      this.raise(TSErrors.MissingInterfaceName, this.state.startLoc);
    }
    node.typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutConstModifiers);
    if (this.eat(81)) {
      node.extends = this.tsParseHeritageClause("extends");
    }
    const body = this.startNode();
    body.body = this.tsInType(this.tsParseObjectTypeMembers.bind(this));
    node.body = this.finishNode(body, "TSInterfaceBody");
    return this.finishNode(node, "TSInterfaceDeclaration");
  }
  tsParseTypeAliasDeclaration(node) {
    node.id = this.parseIdentifier();
    this.checkIdentifier(node.id, 2);
    node.typeAnnotation = this.tsInType(() => {
      node.typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutModifiers);
      this.expect(29);
      if (this.isContextual(114) && this.lookahead().type !== 16) {
        const node = this.startNode();
        this.next();
        return this.finishNode(node, "TSIntrinsicKeyword");
      }
      return this.tsParseType();
    });
    this.semicolon();
    return this.finishNode(node, "TSTypeAliasDeclaration");
  }
  tsInNoContext(cb) {
    const oldContext = this.state.context;
    this.state.context = [oldContext[0]];
    try {
      return cb();
    } finally {
      this.state.context = oldContext;
    }
  }
  tsInType(cb) {
    const oldInType = this.state.inType;
    this.state.inType = true;
    try {
      return cb();
    } finally {
      this.state.inType = oldInType;
    }
  }
  tsInDisallowConditionalTypesContext(cb) {
    const oldInDisallowConditionalTypesContext = this.state.inDisallowConditionalTypesContext;
    this.state.inDisallowConditionalTypesContext = true;
    try {
      return cb();
    } finally {
      this.state.inDisallowConditionalTypesContext = oldInDisallowConditionalTypesContext;
    }
  }
  tsInAllowConditionalTypesContext(cb) {
    const oldInDisallowConditionalTypesContext = this.state.inDisallowConditionalTypesContext;
    this.state.inDisallowConditionalTypesContext = false;
    try {
      return cb();
    } finally {
      this.state.inDisallowConditionalTypesContext = oldInDisallowConditionalTypesContext;
    }
  }
  tsEatThenParseType(token) {
    if (this.match(token)) {
      return this.tsNextThenParseType();
    }
  }
  tsExpectThenParseType(token) {
    return this.tsInType(() => {
      this.expect(token);
      return this.tsParseType();
    });
  }
  tsNextThenParseType() {
    return this.tsInType(() => {
      this.next();
      return this.tsParseType();
    });
  }
  tsParseEnumMember() {
    const node = this.startNode();
    node.id = this.match(133) ? super.parseStringLiteral(this.state.value) : this.parseIdentifier(true);
    if (this.eat(29)) {
      node.initializer = super.parseMaybeAssignAllowIn();
    }
    return this.finishNode(node, "TSEnumMember");
  }
  tsParseEnumDeclaration(node, properties = {}) {
    if (properties.const) node.const = true;
    if (properties.declare) node.declare = true;
    this.expectContextual(126);
    node.id = this.parseIdentifier();
    this.checkIdentifier(node.id, node.const ? 8971 : 8459);
    this.expect(5);
    node.members = this.tsParseDelimitedList("EnumMembers", this.tsParseEnumMember.bind(this));
    this.expect(8);
    return this.finishNode(node, "TSEnumDeclaration");
  }
  tsParseModuleBlock() {
    const node = this.startNode();
    this.scope.enter(0);
    this.expect(5);
    super.parseBlockOrModuleBlockBody(node.body = [], undefined, true, 8);
    this.scope.exit();
    return this.finishNode(node, "TSModuleBlock");
  }
  tsParseModuleOrNamespaceDeclaration(node, nested = false) {
    node.id = this.parseIdentifier();
    if (!nested) {
      this.checkIdentifier(node.id, 1024);
    }
    if (this.eat(16)) {
      const inner = this.startNode();
      this.tsParseModuleOrNamespaceDeclaration(inner, true);
      node.body = inner;
    } else {
      this.scope.enter(256);
      this.prodParam.enter(0);
      node.body = this.tsParseModuleBlock();
      this.prodParam.exit();
      this.scope.exit();
    }
    return this.finishNode(node, "TSModuleDeclaration");
  }
  tsParseAmbientExternalModuleDeclaration(node) {
    if (this.isContextual(112)) {
      node.global = true;
      node.id = this.parseIdentifier();
    } else if (this.match(133)) {
      node.id = super.parseStringLiteral(this.state.value);
    } else {
      this.unexpected();
    }
    if (this.match(5)) {
      this.scope.enter(256);
      this.prodParam.enter(0);
      node.body = this.tsParseModuleBlock();
      this.prodParam.exit();
      this.scope.exit();
    } else {
      this.semicolon();
    }
    return this.finishNode(node, "TSModuleDeclaration");
  }
  tsParseImportEqualsDeclaration(node, maybeDefaultIdentifier, isExport) {
    node.isExport = isExport || false;
    node.id = maybeDefaultIdentifier || this.parseIdentifier();
    this.checkIdentifier(node.id, 4096);
    this.expect(29);
    const moduleReference = this.tsParseModuleReference();
    if (node.importKind === "type" && moduleReference.type !== "TSExternalModuleReference") {
      this.raise(TSErrors.ImportAliasHasImportType, moduleReference);
    }
    node.moduleReference = moduleReference;
    this.semicolon();
    return this.finishNode(node, "TSImportEqualsDeclaration");
  }
  tsIsExternalModuleReference() {
    return this.isContextual(119) && this.lookaheadCharCode() === 40;
  }
  tsParseModuleReference() {
    return this.tsIsExternalModuleReference() ? this.tsParseExternalModuleReference() : this.tsParseEntityName(false);
  }
  tsParseExternalModuleReference() {
    const node = this.startNode();
    this.expectContextual(119);
    this.expect(10);
    if (!this.match(133)) {
      this.unexpected();
    }
    node.expression = super.parseExprAtom();
    this.expect(11);
    this.sawUnambiguousESM = true;
    return this.finishNode(node, "TSExternalModuleReference");
  }
  tsLookAhead(f) {
    const state = this.state.clone();
    const res = f();
    this.state = state;
    return res;
  }
  tsTryParseAndCatch(f) {
    const result = this.tryParse(abort => f() || abort());
    if (result.aborted || !result.node) return;
    if (result.error) this.state = result.failState;
    return result.node;
  }
  tsTryParse(f) {
    const state = this.state.clone();
    const result = f();
    if (result !== undefined && result !== false) {
      return result;
    }
    this.state = state;
  }
  tsTryParseDeclare(nany) {
    if (this.isLineTerminator()) {
      return;
    }
    let startType = this.state.type;
    let kind;
    if (this.isContextual(100)) {
      startType = 74;
      kind = "let";
    }
    return this.tsInAmbientContext(() => {
      switch (startType) {
        case 68:
          nany.declare = true;
          return super.parseFunctionStatement(nany, false, false);
        case 80:
          nany.declare = true;
          return this.parseClass(nany, true, false);
        case 126:
          return this.tsParseEnumDeclaration(nany, {
            declare: true
          });
        case 112:
          return this.tsParseAmbientExternalModuleDeclaration(nany);
        case 75:
        case 74:
          if (!this.match(75) || !this.isLookaheadContextual("enum")) {
            nany.declare = true;
            return this.parseVarStatement(nany, kind || this.state.value, true);
          }
          this.expect(75);
          return this.tsParseEnumDeclaration(nany, {
            const: true,
            declare: true
          });
        case 129:
          {
            const result = this.tsParseInterfaceDeclaration(nany, {
              declare: true
            });
            if (result) return result;
          }
        default:
          if (tokenIsIdentifier(startType)) {
            return this.tsParseDeclaration(nany, this.state.value, true, null);
          }
      }
    });
  }
  tsTryParseExportDeclaration() {
    return this.tsParseDeclaration(this.startNode(), this.state.value, true, null);
  }
  tsParseExpressionStatement(node, expr, decorators) {
    switch (expr.name) {
      case "declare":
        {
          const declaration = this.tsTryParseDeclare(node);
          if (declaration) {
            declaration.declare = true;
          }
          return declaration;
        }
      case "global":
        if (this.match(5)) {
          this.scope.enter(256);
          this.prodParam.enter(0);
          const mod = node;
          mod.global = true;
          mod.id = expr;
          mod.body = this.tsParseModuleBlock();
          this.scope.exit();
          this.prodParam.exit();
          return this.finishNode(mod, "TSModuleDeclaration");
        }
        break;
      default:
        return this.tsParseDeclaration(node, expr.name, false, decorators);
    }
  }
  tsParseDeclaration(node, value, next, decorators) {
    switch (value) {
      case "abstract":
        if (this.tsCheckLineTerminator(next) && (this.match(80) || tokenIsIdentifier(this.state.type))) {
          return this.tsParseAbstractDeclaration(node, decorators);
        }
        break;
      case "module":
        if (this.tsCheckLineTerminator(next)) {
          if (this.match(133)) {
            return this.tsParseAmbientExternalModuleDeclaration(node);
          } else if (tokenIsIdentifier(this.state.type)) {
            return this.tsParseModuleOrNamespaceDeclaration(node);
          }
        }
        break;
      case "namespace":
        if (this.tsCheckLineTerminator(next) && tokenIsIdentifier(this.state.type)) {
          return this.tsParseModuleOrNamespaceDeclaration(node);
        }
        break;
      case "type":
        if (this.tsCheckLineTerminator(next) && tokenIsIdentifier(this.state.type)) {
          return this.tsParseTypeAliasDeclaration(node);
        }
        break;
    }
  }
  tsCheckLineTerminator(next) {
    if (next) {
      if (this.hasFollowingLineBreak()) return false;
      this.next();
      return true;
    }
    return !this.isLineTerminator();
  }
  tsTryParseGenericAsyncArrowFunction(startLoc) {
    if (!this.match(47)) return;
    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
    this.state.maybeInArrowParameters = true;
    const res = this.tsTryParseAndCatch(() => {
      const node = this.startNodeAt(startLoc);
      node.typeParameters = this.tsParseTypeParameters(this.tsParseConstModifier);
      super.parseFunctionParams(node);
      node.returnType = this.tsTryParseTypeOrTypePredicateAnnotation();
      this.expect(19);
      return node;
    });
    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
    if (!res) return;
    return super.parseArrowExpression(res, null, true);
  }
  tsParseTypeArgumentsInExpression() {
    if (this.reScan_lt() !== 47) return;
    return this.tsParseTypeArguments();
  }
  tsParseTypeArguments() {
    const node = this.startNode();
    node.params = this.tsInType(() => this.tsInNoContext(() => {
      this.expect(47);
      return this.tsParseDelimitedList("TypeParametersOrArguments", this.tsParseType.bind(this));
    }));
    if (node.params.length === 0) {
      this.raise(TSErrors.EmptyTypeArguments, node);
    } else if (!this.state.inType && this.curContext() === types.brace) {
      this.reScan_lt_gt();
    }
    this.expect(48);
    return this.finishNode(node, "TSTypeParameterInstantiation");
  }
  tsIsDeclarationStart() {
    return tokenIsTSDeclarationStart(this.state.type);
  }
  isExportDefaultSpecifier() {
    if (this.tsIsDeclarationStart()) return false;
    return super.isExportDefaultSpecifier();
  }
  parseAssignableListItem(flags, decorators) {
    const startLoc = this.state.startLoc;
    const modified = {};
    this.tsParseModifiers({
      allowedModifiers: ["public", "private", "protected", "override", "readonly"]
    }, modified);
    const accessibility = modified.accessibility;
    const override = modified.override;
    const readonly = modified.readonly;
    if (!(flags & 4) && (accessibility || readonly || override)) {
      this.raise(TSErrors.UnexpectedParameterModifier, startLoc);
    }
    const left = this.parseMaybeDefault();
    this.parseAssignableListItemTypes(left, flags);
    const elt = this.parseMaybeDefault(left.loc.start, left);
    if (accessibility || readonly || override) {
      const pp = this.startNodeAt(startLoc);
      if (decorators.length) {
        pp.decorators = decorators;
      }
      if (accessibility) pp.accessibility = accessibility;
      if (readonly) pp.readonly = readonly;
      if (override) pp.override = override;
      if (elt.type !== "Identifier" && elt.type !== "AssignmentPattern") {
        this.raise(TSErrors.UnsupportedParameterPropertyKind, pp);
      }
      pp.parameter = elt;
      return this.finishNode(pp, "TSParameterProperty");
    }
    if (decorators.length) {
      left.decorators = decorators;
    }
    return elt;
  }
  isSimpleParameter(node) {
    return node.type === "TSParameterProperty" && super.isSimpleParameter(node.parameter) || super.isSimpleParameter(node);
  }
  tsDisallowOptionalPattern(node) {
    for (const param of node.params) {
      if (param.type !== "Identifier" && param.optional && !this.state.isAmbientContext) {
        this.raise(TSErrors.PatternIsOptional, param);
      }
    }
  }
  setArrowFunctionParameters(node, params, trailingCommaLoc) {
    super.setArrowFunctionParameters(node, params, trailingCommaLoc);
    this.tsDisallowOptionalPattern(node);
  }
  parseFunctionBodyAndFinish(node, type, isMethod = false) {
    if (this.match(14)) {
      node.returnType = this.tsParseTypeOrTypePredicateAnnotation(14);
    }
    const bodilessType = type === "FunctionDeclaration" ? "TSDeclareFunction" : type === "ClassMethod" || type === "ClassPrivateMethod" ? "TSDeclareMethod" : undefined;
    if (bodilessType && !this.match(5) && this.isLineTerminator()) {
      return this.finishNode(node, bodilessType);
    }
    if (bodilessType === "TSDeclareFunction" && this.state.isAmbientContext) {
      this.raise(TSErrors.DeclareFunctionHasImplementation, node);
      if (node.declare) {
        return super.parseFunctionBodyAndFinish(node, bodilessType, isMethod);
      }
    }
    this.tsDisallowOptionalPattern(node);
    return super.parseFunctionBodyAndFinish(node, type, isMethod);
  }
  registerFunctionStatementId(node) {
    if (!node.body && node.id) {
      this.checkIdentifier(node.id, 1024);
    } else {
      super.registerFunctionStatementId(node);
    }
  }
  tsCheckForInvalidTypeCasts(items) {
    items.forEach(node => {
      if ((node == null ? void 0 : node.type) === "TSTypeCastExpression") {
        this.raise(TSErrors.UnexpectedTypeAnnotation, node.typeAnnotation);
      }
    });
  }
  toReferencedList(exprList, isInParens) {
    this.tsCheckForInvalidTypeCasts(exprList);
    return exprList;
  }
  parseArrayLike(close, canBePattern, isTuple, refExpressionErrors) {
    const node = super.parseArrayLike(close, canBePattern, isTuple, refExpressionErrors);
    if (node.type === "ArrayExpression") {
      this.tsCheckForInvalidTypeCasts(node.elements);
    }
    return node;
  }
  parseSubscript(base, startLoc, noCalls, state) {
    if (!this.hasPrecedingLineBreak() && this.match(35)) {
      this.state.canStartJSXElement = false;
      this.next();
      const nonNullExpression = this.startNodeAt(startLoc);
      nonNullExpression.expression = base;
      return this.finishNode(nonNullExpression, "TSNonNullExpression");
    }
    let isOptionalCall = false;
    if (this.match(18) && this.lookaheadCharCode() === 60) {
      if (noCalls) {
        state.stop = true;
        return base;
      }
      state.optionalChainMember = isOptionalCall = true;
      this.next();
    }
    if (this.match(47) || this.match(51)) {
      let missingParenErrorLoc;
      const result = this.tsTryParseAndCatch(() => {
        if (!noCalls && this.atPossibleAsyncArrow(base)) {
          const asyncArrowFn = this.tsTryParseGenericAsyncArrowFunction(startLoc);
          if (asyncArrowFn) {
            return asyncArrowFn;
          }
        }
        const typeArguments = this.tsParseTypeArgumentsInExpression();
        if (!typeArguments) return;
        if (isOptionalCall && !this.match(10)) {
          missingParenErrorLoc = this.state.curPosition();
          return;
        }
        if (tokenIsTemplate(this.state.type)) {
          const result = super.parseTaggedTemplateExpression(base, startLoc, state);
          result.typeParameters = typeArguments;
          return result;
        }
        if (!noCalls && this.eat(10)) {
          const node = this.startNodeAt(startLoc);
          node.callee = base;
          node.arguments = this.parseCallExpressionArguments(11, false);
          this.tsCheckForInvalidTypeCasts(node.arguments);
          node.typeParameters = typeArguments;
          if (state.optionalChainMember) {
            node.optional = isOptionalCall;
          }
          return this.finishCallExpression(node, state.optionalChainMember);
        }
        const tokenType = this.state.type;
        if (tokenType === 48 || tokenType === 52 || tokenType !== 10 && tokenCanStartExpression(tokenType) && !this.hasPrecedingLineBreak()) {
          return;
        }
        const node = this.startNodeAt(startLoc);
        node.expression = base;
        node.typeParameters = typeArguments;
        return this.finishNode(node, "TSInstantiationExpression");
      });
      if (missingParenErrorLoc) {
        this.unexpected(missingParenErrorLoc, 10);
      }
      if (result) {
        if (result.type === "TSInstantiationExpression" && (this.match(16) || this.match(18) && this.lookaheadCharCode() !== 40)) {
          this.raise(TSErrors.InvalidPropertyAccessAfterInstantiationExpression, this.state.startLoc);
        }
        return result;
      }
    }
    return super.parseSubscript(base, startLoc, noCalls, state);
  }
  parseNewCallee(node) {
    var _callee$extra;
    super.parseNewCallee(node);
    const {
      callee
    } = node;
    if (callee.type === "TSInstantiationExpression" && !((_callee$extra = callee.extra) != null && _callee$extra.parenthesized)) {
      node.typeParameters = callee.typeParameters;
      node.callee = callee.expression;
    }
  }
  parseExprOp(left, leftStartLoc, minPrec) {
    let isSatisfies;
    if (tokenOperatorPrecedence(58) > minPrec && !this.hasPrecedingLineBreak() && (this.isContextual(93) || (isSatisfies = this.isContextual(120)))) {
      const node = this.startNodeAt(leftStartLoc);
      node.expression = left;
      node.typeAnnotation = this.tsInType(() => {
        this.next();
        if (this.match(75)) {
          if (isSatisfies) {
            this.raise(Errors.UnexpectedKeyword, this.state.startLoc, {
              keyword: "const"
            });
          }
          return this.tsParseTypeReference();
        }
        return this.tsParseType();
      });
      this.finishNode(node, isSatisfies ? "TSSatisfiesExpression" : "TSAsExpression");
      this.reScan_lt_gt();
      return this.parseExprOp(node, leftStartLoc, minPrec);
    }
    return super.parseExprOp(left, leftStartLoc, minPrec);
  }
  checkReservedWord(word, startLoc, checkKeywords, isBinding) {
    if (!this.state.isAmbientContext) {
      super.checkReservedWord(word, startLoc, checkKeywords, isBinding);
    }
  }
  checkImportReflection(node) {
    super.checkImportReflection(node);
    if (node.module && node.importKind !== "value") {
      this.raise(TSErrors.ImportReflectionHasImportType, node.specifiers[0].loc.start);
    }
  }
  checkDuplicateExports() {}
  isPotentialImportPhase(isExport) {
    if (super.isPotentialImportPhase(isExport)) return true;
    if (this.isContextual(130)) {
      const ch = this.lookaheadCharCode();
      return isExport ? ch === 123 || ch === 42 : ch !== 61;
    }
    return !isExport && this.isContextual(87);
  }
  applyImportPhase(node, isExport, phase, loc) {
    super.applyImportPhase(node, isExport, phase, loc);
    if (isExport) {
      node.exportKind = phase === "type" ? "type" : "value";
    } else {
      node.importKind = phase === "type" || phase === "typeof" ? phase : "value";
    }
  }
  parseImport(node) {
    if (this.match(133)) {
      node.importKind = "value";
      return super.parseImport(node);
    }
    let importNode;
    if (tokenIsIdentifier(this.state.type) && this.lookaheadCharCode() === 61) {
      node.importKind = "value";
      return this.tsParseImportEqualsDeclaration(node);
    } else if (this.isContextual(130)) {
      const maybeDefaultIdentifier = this.parseMaybeImportPhase(node, false);
      if (this.lookaheadCharCode() === 61) {
        return this.tsParseImportEqualsDeclaration(node, maybeDefaultIdentifier);
      } else {
        importNode = super.parseImportSpecifiersAndAfter(node, maybeDefaultIdentifier);
      }
    } else {
      importNode = super.parseImport(node);
    }
    if (importNode.importKind === "type" && importNode.specifiers.length > 1 && importNode.specifiers[0].type === "ImportDefaultSpecifier") {
      this.raise(TSErrors.TypeImportCannotSpecifyDefaultAndNamed, importNode);
    }
    return importNode;
  }
  parseExport(node, decorators) {
    if (this.match(83)) {
      this.next();
      let maybeDefaultIdentifier = null;
      if (this.isContextual(130) && this.isPotentialImportPhase(false)) {
        maybeDefaultIdentifier = this.parseMaybeImportPhase(node, false);
      } else {
        node.importKind = "value";
      }
      return this.tsParseImportEqualsDeclaration(node, maybeDefaultIdentifier, true);
    } else if (this.eat(29)) {
      const assign = node;
      assign.expression = super.parseExpression();
      this.semicolon();
      this.sawUnambiguousESM = true;
      return this.finishNode(assign, "TSExportAssignment");
    } else if (this.eatContextual(93)) {
      const decl = node;
      this.expectContextual(128);
      decl.id = this.parseIdentifier();
      this.semicolon();
      return this.finishNode(decl, "TSNamespaceExportDeclaration");
    } else {
      return super.parseExport(node, decorators);
    }
  }
  isAbstractClass() {
    return this.isContextual(124) && this.lookahead().type === 80;
  }
  parseExportDefaultExpression() {
    if (this.isAbstractClass()) {
      const cls = this.startNode();
      this.next();
      cls.abstract = true;
      return this.parseClass(cls, true, true);
    }
    if (this.match(129)) {
      const result = this.tsParseInterfaceDeclaration(this.startNode());
      if (result) return result;
    }
    return super.parseExportDefaultExpression();
  }
  parseVarStatement(node, kind, allowMissingInitializer = false) {
    const {
      isAmbientContext
    } = this.state;
    const declaration = super.parseVarStatement(node, kind, allowMissingInitializer || isAmbientContext);
    if (!isAmbientContext) return declaration;
    for (const {
      id,
      init
    } of declaration.declarations) {
      if (!init) continue;
      if (kind !== "const" || !!id.typeAnnotation) {
        this.raise(TSErrors.InitializerNotAllowedInAmbientContext, init);
      } else if (!isValidAmbientConstInitializer(init, this.hasPlugin("estree"))) {
        this.raise(TSErrors.ConstInitiailizerMustBeStringOrNumericLiteralOrLiteralEnumReference, init);
      }
    }
    return declaration;
  }
  parseStatementContent(flags, decorators) {
    if (this.match(75) && this.isLookaheadContextual("enum")) {
      const node = this.startNode();
      this.expect(75);
      return this.tsParseEnumDeclaration(node, {
        const: true
      });
    }
    if (this.isContextual(126)) {
      return this.tsParseEnumDeclaration(this.startNode());
    }
    if (this.isContextual(129)) {
      const result = this.tsParseInterfaceDeclaration(this.startNode());
      if (result) return result;
    }
    return super.parseStatementContent(flags, decorators);
  }
  parseAccessModifier() {
    return this.tsParseModifier(["public", "protected", "private"]);
  }
  tsHasSomeModifiers(member, modifiers) {
    return modifiers.some(modifier => {
      if (tsIsAccessModifier(modifier)) {
        return member.accessibility === modifier;
      }
      return !!member[modifier];
    });
  }
  tsIsStartOfStaticBlocks() {
    return this.isContextual(106) && this.lookaheadCharCode() === 123;
  }
  parseClassMember(classBody, member, state) {
    const modifiers = ["declare", "private", "public", "protected", "override", "abstract", "readonly", "static"];
    this.tsParseModifiers({
      allowedModifiers: modifiers,
      disallowedModifiers: ["in", "out"],
      stopOnStartOfClassStaticBlock: true,
      errorTemplate: TSErrors.InvalidModifierOnTypeParameterPositions
    }, member);
    const callParseClassMemberWithIsStatic = () => {
      if (this.tsIsStartOfStaticBlocks()) {
        this.next();
        this.next();
        if (this.tsHasSomeModifiers(member, modifiers)) {
          this.raise(TSErrors.StaticBlockCannotHaveModifier, this.state.curPosition());
        }
        super.parseClassStaticBlock(classBody, member);
      } else {
        this.parseClassMemberWithIsStatic(classBody, member, state, !!member.static);
      }
    };
    if (member.declare) {
      this.tsInAmbientContext(callParseClassMemberWithIsStatic);
    } else {
      callParseClassMemberWithIsStatic();
    }
  }
  parseClassMemberWithIsStatic(classBody, member, state, isStatic) {
    const idx = this.tsTryParseIndexSignature(member);
    if (idx) {
      classBody.body.push(idx);
      if (member.abstract) {
        this.raise(TSErrors.IndexSignatureHasAbstract, member);
      }
      if (member.accessibility) {
        this.raise(TSErrors.IndexSignatureHasAccessibility, member, {
          modifier: member.accessibility
        });
      }
      if (member.declare) {
        this.raise(TSErrors.IndexSignatureHasDeclare, member);
      }
      if (member.override) {
        this.raise(TSErrors.IndexSignatureHasOverride, member);
      }
      return;
    }
    if (!this.state.inAbstractClass && member.abstract) {
      this.raise(TSErrors.NonAbstractClassHasAbstractMethod, member);
    }
    if (member.override) {
      if (!state.hadSuperClass) {
        this.raise(TSErrors.OverrideNotInSubClass, member);
      }
    }
    super.parseClassMemberWithIsStatic(classBody, member, state, isStatic);
  }
  parsePostMemberNameModifiers(methodOrProp) {
    const optional = this.eat(17);
    if (optional) methodOrProp.optional = true;
    if (methodOrProp.readonly && this.match(10)) {
      this.raise(TSErrors.ClassMethodHasReadonly, methodOrProp);
    }
    if (methodOrProp.declare && this.match(10)) {
      this.raise(TSErrors.ClassMethodHasDeclare, methodOrProp);
    }
  }
  parseExpressionStatement(node, expr, decorators) {
    const decl = expr.type === "Identifier" ? this.tsParseExpressionStatement(node, expr, decorators) : undefined;
    return decl || super.parseExpressionStatement(node, expr, decorators);
  }
  shouldParseExportDeclaration() {
    if (this.tsIsDeclarationStart()) return true;
    return super.shouldParseExportDeclaration();
  }
  parseConditional(expr, startLoc, refExpressionErrors) {
    if (!this.state.maybeInArrowParameters || !this.match(17)) {
      return super.parseConditional(expr, startLoc, refExpressionErrors);
    }
    const result = this.tryParse(() => super.parseConditional(expr, startLoc));
    if (!result.node) {
      if (result.error) {
        super.setOptionalParametersError(refExpressionErrors, result.error);
      }
      return expr;
    }
    if (result.error) this.state = result.failState;
    return result.node;
  }
  parseParenItem(node, startLoc) {
    node = super.parseParenItem(node, startLoc);
    if (this.eat(17)) {
      node.optional = true;
      this.resetEndLocation(node);
    }
    if (this.match(14)) {
      const typeCastNode = this.startNodeAt(startLoc);
      typeCastNode.expression = node;
      typeCastNode.typeAnnotation = this.tsParseTypeAnnotation();
      return this.finishNode(typeCastNode, "TSTypeCastExpression");
    }
    return node;
  }
  parseExportDeclaration(node) {
    if (!this.state.isAmbientContext && this.isContextual(125)) {
      return this.tsInAmbientContext(() => this.parseExportDeclaration(node));
    }
    const startLoc = this.state.startLoc;
    const isDeclare = this.eatContextual(125);
    if (isDeclare && (this.isContextual(125) || !this.shouldParseExportDeclaration())) {
      throw this.raise(TSErrors.ExpectedAmbientAfterExportDeclare, this.state.startLoc);
    }
    const isIdentifier = tokenIsIdentifier(this.state.type);
    const declaration = isIdentifier && this.tsTryParseExportDeclaration() || super.parseExportDeclaration(node);
    if (!declaration) return null;
    if (declaration.type === "TSInterfaceDeclaration" || declaration.type === "TSTypeAliasDeclaration" || isDeclare) {
      node.exportKind = "type";
    }
    if (isDeclare) {
      this.resetStartLocation(declaration, startLoc);
      declaration.declare = true;
    }
    return declaration;
  }
  parseClassId(node, isStatement, optionalId, bindingType) {
    if ((!isStatement || optionalId) && this.isContextual(113)) {
      return;
    }
    super.parseClassId(node, isStatement, optionalId, node.declare ? 1024 : 8331);
    const typeParameters = this.tsTryParseTypeParameters(this.tsParseInOutConstModifiers);
    if (typeParameters) node.typeParameters = typeParameters;
  }
  parseClassPropertyAnnotation(node) {
    if (!node.optional) {
      if (this.eat(35)) {
        node.definite = true;
      } else if (this.eat(17)) {
        node.optional = true;
      }
    }
    const type = this.tsTryParseTypeAnnotation();
    if (type) node.typeAnnotation = type;
  }
  parseClassProperty(node) {
    this.parseClassPropertyAnnotation(node);
    if (this.state.isAmbientContext && !(node.readonly && !node.typeAnnotation) && this.match(29)) {
      this.raise(TSErrors.DeclareClassFieldHasInitializer, this.state.startLoc);
    }
    if (node.abstract && this.match(29)) {
      const {
        key
      } = node;
      this.raise(TSErrors.AbstractPropertyHasInitializer, this.state.startLoc, {
        propertyName: key.type === "Identifier" && !node.computed ? key.name : `[${this.input.slice(key.start, key.end)}]`
      });
    }
    return super.parseClassProperty(node);
  }
  parseClassPrivateProperty(node) {
    if (node.abstract) {
      this.raise(TSErrors.PrivateElementHasAbstract, node);
    }
    if (node.accessibility) {
      this.raise(TSErrors.PrivateElementHasAccessibility, node, {
        modifier: node.accessibility
      });
    }
    this.parseClassPropertyAnnotation(node);
    return super.parseClassPrivateProperty(node);
  }
  parseClassAccessorProperty(node) {
    this.parseClassPropertyAnnotation(node);
    if (node.optional) {
      this.raise(TSErrors.AccessorCannotBeOptional, node);
    }
    return super.parseClassAccessorProperty(node);
  }
  pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper) {
    const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
    if (typeParameters && isConstructor) {
      this.raise(TSErrors.ConstructorHasTypeParameters, typeParameters);
    }
    const {
      declare = false,
      kind
    } = method;
    if (declare && (kind === "get" || kind === "set")) {
      this.raise(TSErrors.DeclareAccessor, method, {
        kind
      });
    }
    if (typeParameters) method.typeParameters = typeParameters;
    super.pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper);
  }
  pushClassPrivateMethod(classBody, method, isGenerator, isAsync) {
    const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
    if (typeParameters) method.typeParameters = typeParameters;
    super.pushClassPrivateMethod(classBody, method, isGenerator, isAsync);
  }
  declareClassPrivateMethodInScope(node, kind) {
    if (node.type === "TSDeclareMethod") return;
    if (node.type === "MethodDefinition" && !node.value.body) return;
    super.declareClassPrivateMethodInScope(node, kind);
  }
  parseClassSuper(node) {
    super.parseClassSuper(node);
    if (node.superClass && (this.match(47) || this.match(51))) {
      node.superTypeParameters = this.tsParseTypeArgumentsInExpression();
    }
    if (this.eatContextual(113)) {
      node.implements = this.tsParseHeritageClause("implements");
    }
  }
  parseObjPropValue(prop, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors) {
    const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
    if (typeParameters) prop.typeParameters = typeParameters;
    return super.parseObjPropValue(prop, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors);
  }
  parseFunctionParams(node, isConstructor) {
    const typeParameters = this.tsTryParseTypeParameters(this.tsParseConstModifier);
    if (typeParameters) node.typeParameters = typeParameters;
    super.parseFunctionParams(node, isConstructor);
  }
  parseVarId(decl, kind) {
    super.parseVarId(decl, kind);
    if (decl.id.type === "Identifier" && !this.hasPrecedingLineBreak() && this.eat(35)) {
      decl.definite = true;
    }
    const type = this.tsTryParseTypeAnnotation();
    if (type) {
      decl.id.typeAnnotation = type;
      this.resetEndLocation(decl.id);
    }
  }
  parseAsyncArrowFromCallExpression(node, call) {
    if (this.match(14)) {
      node.returnType = this.tsParseTypeAnnotation();
    }
    return super.parseAsyncArrowFromCallExpression(node, call);
  }
  parseMaybeAssign(refExpressionErrors, afterLeftParse) {
    var _jsx, _jsx2, _typeCast, _jsx3, _typeCast2;
    let state;
    let jsx;
    let typeCast;
    if (this.hasPlugin("jsx") && (this.match(142) || this.match(47))) {
      state = this.state.clone();
      jsx = this.tryParse(() => super.parseMaybeAssign(refExpressionErrors, afterLeftParse), state);
      if (!jsx.error) return jsx.node;
      const {
        context
      } = this.state;
      const currentContext = context[context.length - 1];
      if (currentContext === types.j_oTag || currentContext === types.j_expr) {
        context.pop();
      }
    }
    if (!((_jsx = jsx) != null && _jsx.error) && !this.match(47)) {
      return super.parseMaybeAssign(refExpressionErrors, afterLeftParse);
    }
    if (!state || state === this.state) state = this.state.clone();
    let typeParameters;
    const arrow = this.tryParse(abort => {
      var _expr$extra, _typeParameters;
      typeParameters = this.tsParseTypeParameters(this.tsParseConstModifier);
      const expr = super.parseMaybeAssign(refExpressionErrors, afterLeftParse);
      if (expr.type !== "ArrowFunctionExpression" || (_expr$extra = expr.extra) != null && _expr$extra.parenthesized) {
        abort();
      }
      if (((_typeParameters = typeParameters) == null ? void 0 : _typeParameters.params.length) !== 0) {
        this.resetStartLocationFromNode(expr, typeParameters);
      }
      expr.typeParameters = typeParameters;
      return expr;
    }, state);
    if (!arrow.error && !arrow.aborted) {
      if (typeParameters) this.reportReservedArrowTypeParam(typeParameters);
      return arrow.node;
    }
    if (!jsx) {
      assert(!this.hasPlugin("jsx"));
      typeCast = this.tryParse(() => super.parseMaybeAssign(refExpressionErrors, afterLeftParse), state);
      if (!typeCast.error) return typeCast.node;
    }
    if ((_jsx2 = jsx) != null && _jsx2.node) {
      this.state = jsx.failState;
      return jsx.node;
    }
    if (arrow.node) {
      this.state = arrow.failState;
      if (typeParameters) this.reportReservedArrowTypeParam(typeParameters);
      return arrow.node;
    }
    if ((_typeCast = typeCast) != null && _typeCast.node) {
      this.state = typeCast.failState;
      return typeCast.node;
    }
    throw ((_jsx3 = jsx) == null ? void 0 : _jsx3.error) || arrow.error || ((_typeCast2 = typeCast) == null ? void 0 : _typeCast2.error);
  }
  reportReservedArrowTypeParam(node) {
    var _node$extra;
    if (node.params.length === 1 && !node.params[0].constraint && !((_node$extra = node.extra) != null && _node$extra.trailingComma) && this.getPluginOption("typescript", "disallowAmbiguousJSXLike")) {
      this.raise(TSErrors.ReservedArrowTypeParam, node);
    }
  }
  parseMaybeUnary(refExpressionErrors, sawUnary) {
    if (!this.hasPlugin("jsx") && this.match(47)) {
      return this.tsParseTypeAssertion();
    }
    return super.parseMaybeUnary(refExpressionErrors, sawUnary);
  }
  parseArrow(node) {
    if (this.match(14)) {
      const result = this.tryParse(abort => {
        const returnType = this.tsParseTypeOrTypePredicateAnnotation(14);
        if (this.canInsertSemicolon() || !this.match(19)) abort();
        return returnType;
      });
      if (result.aborted) return;
      if (!result.thrown) {
        if (result.error) this.state = result.failState;
        node.returnType = result.node;
      }
    }
    return super.parseArrow(node);
  }
  parseAssignableListItemTypes(param, flags) {
    if (!(flags & 2)) return param;
    if (this.eat(17)) {
      param.optional = true;
    }
    const type = this.tsTryParseTypeAnnotation();
    if (type) param.typeAnnotation = type;
    this.resetEndLocation(param);
    return param;
  }
  isAssignable(node, isBinding) {
    switch (node.type) {
      case "TSTypeCastExpression":
        return this.isAssignable(node.expression, isBinding);
      case "TSParameterProperty":
        return true;
      default:
        return super.isAssignable(node, isBinding);
    }
  }
  toAssignable(node, isLHS = false) {
    switch (node.type) {
      case "ParenthesizedExpression":
        this.toAssignableParenthesizedExpression(node, isLHS);
        break;
      case "TSAsExpression":
      case "TSSatisfiesExpression":
      case "TSNonNullExpression":
      case "TSTypeAssertion":
        if (isLHS) {
          this.expressionScope.recordArrowParameterBindingError(TSErrors.UnexpectedTypeCastInParameter, node);
        } else {
          this.raise(TSErrors.UnexpectedTypeCastInParameter, node);
        }
        this.toAssignable(node.expression, isLHS);
        break;
      case "AssignmentExpression":
        if (!isLHS && node.left.type === "TSTypeCastExpression") {
          node.left = this.typeCastToParameter(node.left);
        }
      default:
        super.toAssignable(node, isLHS);
    }
  }
  toAssignableParenthesizedExpression(node, isLHS) {
    switch (node.expression.type) {
      case "TSAsExpression":
      case "TSSatisfiesExpression":
      case "TSNonNullExpression":
      case "TSTypeAssertion":
      case "ParenthesizedExpression":
        this.toAssignable(node.expression, isLHS);
        break;
      default:
        super.toAssignable(node, isLHS);
    }
  }
  checkToRestConversion(node, allowPattern) {
    switch (node.type) {
      case "TSAsExpression":
      case "TSSatisfiesExpression":
      case "TSTypeAssertion":
      case "TSNonNullExpression":
        this.checkToRestConversion(node.expression, false);
        break;
      default:
        super.checkToRestConversion(node, allowPattern);
    }
  }
  isValidLVal(type, isUnparenthesizedInAssign, binding) {
    return getOwn({
      TSTypeCastExpression: true,
      TSParameterProperty: "parameter",
      TSNonNullExpression: "expression",
      TSAsExpression: (binding !== 64 || !isUnparenthesizedInAssign) && ["expression", true],
      TSSatisfiesExpression: (binding !== 64 || !isUnparenthesizedInAssign) && ["expression", true],
      TSTypeAssertion: (binding !== 64 || !isUnparenthesizedInAssign) && ["expression", true]
    }, type) || super.isValidLVal(type, isUnparenthesizedInAssign, binding);
  }
  parseBindingAtom() {
    if (this.state.type === 78) {
      return this.parseIdentifier(true);
    }
    return super.parseBindingAtom();
  }
  parseMaybeDecoratorArguments(expr) {
    if (this.match(47) || this.match(51)) {
      const typeArguments = this.tsParseTypeArgumentsInExpression();
      if (this.match(10)) {
        const call = super.parseMaybeDecoratorArguments(expr);
        call.typeParameters = typeArguments;
        return call;
      }
      this.unexpected(null, 10);
    }
    return super.parseMaybeDecoratorArguments(expr);
  }
  checkCommaAfterRest(close) {
    if (this.state.isAmbientContext && this.match(12) && this.lookaheadCharCode() === close) {
      this.next();
      return false;
    }
    return super.checkCommaAfterRest(close);
  }
  isClassMethod() {
    return this.match(47) || super.isClassMethod();
  }
  isClassProperty() {
    return this.match(35) || this.match(14) || super.isClassProperty();
  }
  parseMaybeDefault(startLoc, left) {
    const node = super.parseMaybeDefault(startLoc, left);
    if (node.type === "AssignmentPattern" && node.typeAnnotation && node.right.start < node.typeAnnotation.start) {
      this.raise(TSErrors.TypeAnnotationAfterAssign, node.typeAnnotation);
    }
    return node;
  }
  getTokenFromCode(code) {
    if (this.state.inType) {
      if (code === 62) {
        this.finishOp(48, 1);
        return;
      }
      if (code === 60) {
        this.finishOp(47, 1);
        return;
      }
    }
    super.getTokenFromCode(code);
  }
  reScan_lt_gt() {
    const {
      type
    } = this.state;
    if (type === 47) {
      this.state.pos -= 1;
      this.readToken_lt();
    } else if (type === 48) {
      this.state.pos -= 1;
      this.readToken_gt();
    }
  }
  reScan_lt() {
    const {
      type
    } = this.state;
    if (type === 51) {
      this.state.pos -= 2;
      this.finishOp(47, 1);
      return 47;
    }
    return type;
  }
  toAssignableList(exprList, trailingCommaLoc, isLHS) {
    for (let i = 0; i < exprList.length; i++) {
      const expr = exprList[i];
      if ((expr == null ? void 0 : expr.type) === "TSTypeCastExpression") {
        exprList[i] = this.typeCastToParameter(expr);
      }
    }
    super.toAssignableList(exprList, trailingCommaLoc, isLHS);
  }
  typeCastToParameter(node) {
    node.expression.typeAnnotation = node.typeAnnotation;
    this.resetEndLocation(node.expression, node.typeAnnotation.loc.end);
    return node.expression;
  }
  shouldParseArrow(params) {
    if (this.match(14)) {
      return params.every(expr => this.isAssignable(expr, true));
    }
    return super.shouldParseArrow(params);
  }
  shouldParseAsyncArrow() {
    return this.match(14) || super.shouldParseAsyncArrow();
  }
  canHaveLeadingDecorator() {
    return super.canHaveLeadingDecorator() || this.isAbstractClass();
  }
  jsxParseOpeningElementAfterName(node) {
    if (this.match(47) || this.match(51)) {
      const typeArguments = this.tsTryParseAndCatch(() => this.tsParseTypeArgumentsInExpression());
      if (typeArguments) node.typeParameters = typeArguments;
    }
    return super.jsxParseOpeningElementAfterName(node);
  }
  getGetterSetterExpectedParamCount(method) {
    const baseCount = super.getGetterSetterExpectedParamCount(method);
    const params = this.getObjectOrClassMethodParams(method);
    const firstParam = params[0];
    const hasContextParam = firstParam && this.isThisParam(firstParam);
    return hasContextParam ? baseCount + 1 : baseCount;
  }
  parseCatchClauseParam() {
    const param = super.parseCatchClauseParam();
    const type = this.tsTryParseTypeAnnotation();
    if (type) {
      param.typeAnnotation = type;
      this.resetEndLocation(param);
    }
    return param;
  }
  tsInAmbientContext(cb) {
    const oldIsAmbientContext = this.state.isAmbientContext;
    this.state.isAmbientContext = true;
    try {
      return cb();
    } finally {
      this.state.isAmbientContext = oldIsAmbientContext;
    }
  }
  parseClass(node, isStatement, optionalId) {
    const oldInAbstractClass = this.state.inAbstractClass;
    this.state.inAbstractClass = !!node.abstract;
    try {
      return super.parseClass(node, isStatement, optionalId);
    } finally {
      this.state.inAbstractClass = oldInAbstractClass;
    }
  }
  tsParseAbstractDeclaration(node, decorators) {
    if (this.match(80)) {
      node.abstract = true;
      return this.maybeTakeDecorators(decorators, this.parseClass(node, true, false));
    } else if (this.isContextual(129)) {
      if (!this.hasFollowingLineBreak()) {
        node.abstract = true;
        this.raise(TSErrors.NonClassMethodPropertyHasAbstractModifer, node);
        return this.tsParseInterfaceDeclaration(node);
      }
    } else {
      this.unexpected(null, 80);
    }
  }
  parseMethod(node, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope) {
    const method = super.parseMethod(node, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope);
    if (method.abstract) {
      const hasBody = this.hasPlugin("estree") ? !!method.value.body : !!method.body;
      if (hasBody) {
        const {
          key
        } = method;
        this.raise(TSErrors.AbstractMethodHasImplementation, method, {
          methodName: key.type === "Identifier" && !method.computed ? key.name : `[${this.input.slice(key.start, key.end)}]`
        });
      }
    }
    return method;
  }
  tsParseTypeParameterName() {
    const typeName = this.parseIdentifier();
    return typeName.name;
  }
  shouldParseAsAmbientContext() {
    return !!this.getPluginOption("typescript", "dts");
  }
  parse() {
    if (this.shouldParseAsAmbientContext()) {
      this.state.isAmbientContext = true;
    }
    return super.parse();
  }
  getExpression() {
    if (this.shouldParseAsAmbientContext()) {
      this.state.isAmbientContext = true;
    }
    return super.getExpression();
  }
  parseExportSpecifier(node, isString, isInTypeExport, isMaybeTypeOnly) {
    if (!isString && isMaybeTypeOnly) {
      this.parseTypeOnlyImportExportSpecifier(node, false, isInTypeExport);
      return this.finishNode(node, "ExportSpecifier");
    }
    node.exportKind = "value";
    return super.parseExportSpecifier(node, isString, isInTypeExport, isMaybeTypeOnly);
  }
  parseImportSpecifier(specifier, importedIsString, isInTypeOnlyImport, isMaybeTypeOnly, bindingType) {
    if (!importedIsString && isMaybeTypeOnly) {
      this.parseTypeOnlyImportExportSpecifier(specifier, true, isInTypeOnlyImport);
      return this.finishNode(specifier, "ImportSpecifier");
    }
    specifier.importKind = "value";
    return super.parseImportSpecifier(specifier, importedIsString, isInTypeOnlyImport, isMaybeTypeOnly, isInTypeOnlyImport ? 4098 : 4096);
  }
  parseTypeOnlyImportExportSpecifier(node, isImport, isInTypeOnlyImportExport) {
    const leftOfAsKey = isImport ? "imported" : "local";
    const rightOfAsKey = isImport ? "local" : "exported";
    let leftOfAs = node[leftOfAsKey];
    let rightOfAs;
    let hasTypeSpecifier = false;
    let canParseAsKeyword = true;
    const loc = leftOfAs.loc.start;
    if (this.isContextual(93)) {
      const firstAs = this.parseIdentifier();
      if (this.isContextual(93)) {
        const secondAs = this.parseIdentifier();
        if (tokenIsKeywordOrIdentifier(this.state.type)) {
          hasTypeSpecifier = true;
          leftOfAs = firstAs;
          rightOfAs = isImport ? this.parseIdentifier() : this.parseModuleExportName();
          canParseAsKeyword = false;
        } else {
          rightOfAs = secondAs;
          canParseAsKeyword = false;
        }
      } else if (tokenIsKeywordOrIdentifier(this.state.type)) {
        canParseAsKeyword = false;
        rightOfAs = isImport ? this.parseIdentifier() : this.parseModuleExportName();
      } else {
        hasTypeSpecifier = true;
        leftOfAs = firstAs;
      }
    } else if (tokenIsKeywordOrIdentifier(this.state.type)) {
      hasTypeSpecifier = true;
      if (isImport) {
        leftOfAs = this.parseIdentifier(true);
        if (!this.isContextual(93)) {
          this.checkReservedWord(leftOfAs.name, leftOfAs.loc.start, true, true);
        }
      } else {
        leftOfAs = this.parseModuleExportName();
      }
    }
    if (hasTypeSpecifier && isInTypeOnlyImportExport) {
      this.raise(isImport ? TSErrors.TypeModifierIsUsedInTypeImports : TSErrors.TypeModifierIsUsedInTypeExports, loc);
    }
    node[leftOfAsKey] = leftOfAs;
    node[rightOfAsKey] = rightOfAs;
    const kindKey = isImport ? "importKind" : "exportKind";
    node[kindKey] = hasTypeSpecifier ? "type" : "value";
    if (canParseAsKeyword && this.eatContextual(93)) {
      node[rightOfAsKey] = isImport ? this.parseIdentifier() : this.parseModuleExportName();
    }
    if (!node[rightOfAsKey]) {
      node[rightOfAsKey] = cloneIdentifier(node[leftOfAsKey]);
    }
    if (isImport) {
      this.checkIdentifier(node[rightOfAsKey], hasTypeSpecifier ? 4098 : 4096);
    }
  }
};
function isPossiblyLiteralEnum(expression) {
  if (expression.type !== "MemberExpression") return false;
  const {
    computed,
    property
  } = expression;
  if (computed && property.type !== "StringLiteral" && (property.type !== "TemplateLiteral" || property.expressions.length > 0)) {
    return false;
  }
  return isUncomputedMemberExpressionChain(expression.object);
}
function isValidAmbientConstInitializer(expression, estree) {
  var _expression$extra;
  const {
    type
  } = expression;
  if ((_expression$extra = expression.extra) != null && _expression$extra.parenthesized) {
    return false;
  }
  if (estree) {
    if (type === "Literal") {
      const {
        value
      } = expression;
      if (typeof value === "string" || typeof value === "boolean") {
        return true;
      }
    }
  } else {
    if (type === "StringLiteral" || type === "BooleanLiteral") {
      return true;
    }
  }
  if (isNumber$1(expression, estree) || isNegativeNumber(expression, estree)) {
    return true;
  }
  if (type === "TemplateLiteral" && expression.expressions.length === 0) {
    return true;
  }
  if (isPossiblyLiteralEnum(expression)) {
    return true;
  }
  return false;
}
function isNumber$1(expression, estree) {
  if (estree) {
    return expression.type === "Literal" && (typeof expression.value === "number" || "bigint" in expression);
  }
  return expression.type === "NumericLiteral" || expression.type === "BigIntLiteral";
}
function isNegativeNumber(expression, estree) {
  if (expression.type === "UnaryExpression") {
    const {
      operator,
      argument
    } = expression;
    if (operator === "-" && isNumber$1(argument, estree)) {
      return true;
    }
  }
  return false;
}
function isUncomputedMemberExpressionChain(expression) {
  if (expression.type === "Identifier") return true;
  if (expression.type !== "MemberExpression" || expression.computed) {
    return false;
  }
  return isUncomputedMemberExpressionChain(expression.object);
}
const PlaceholderErrors = ParseErrorEnum`placeholders`({
  ClassNameIsRequired: "A class name is required.",
  UnexpectedSpace: "Unexpected space in placeholder."
});
var placeholders = superClass => class PlaceholdersParserMixin extends superClass {
  parsePlaceholder(expectedNode) {
    if (this.match(144)) {
      const node = this.startNode();
      this.next();
      this.assertNoSpace();
      node.name = super.parseIdentifier(true);
      this.assertNoSpace();
      this.expect(144);
      return this.finishPlaceholder(node, expectedNode);
    }
  }
  finishPlaceholder(node, expectedNode) {
    const isFinished = !!(node.expectedNode && node.type === "Placeholder");
    node.expectedNode = expectedNode;
    return isFinished ? node : this.finishNode(node, "Placeholder");
  }
  getTokenFromCode(code) {
    if (code === 37 && this.input.charCodeAt(this.state.pos + 1) === 37) {
      this.finishOp(144, 2);
    } else {
      super.getTokenFromCode(code);
    }
  }
  parseExprAtom(refExpressionErrors) {
    return this.parsePlaceholder("Expression") || super.parseExprAtom(refExpressionErrors);
  }
  parseIdentifier(liberal) {
    return this.parsePlaceholder("Identifier") || super.parseIdentifier(liberal);
  }
  checkReservedWord(word, startLoc, checkKeywords, isBinding) {
    if (word !== undefined) {
      super.checkReservedWord(word, startLoc, checkKeywords, isBinding);
    }
  }
  parseBindingAtom() {
    return this.parsePlaceholder("Pattern") || super.parseBindingAtom();
  }
  isValidLVal(type, isParenthesized, binding) {
    return type === "Placeholder" || super.isValidLVal(type, isParenthesized, binding);
  }
  toAssignable(node, isLHS) {
    if (node && node.type === "Placeholder" && node.expectedNode === "Expression") {
      node.expectedNode = "Pattern";
    } else {
      super.toAssignable(node, isLHS);
    }
  }
  chStartsBindingIdentifier(ch, pos) {
    if (super.chStartsBindingIdentifier(ch, pos)) {
      return true;
    }
    const nextToken = this.lookahead();
    if (nextToken.type === 144) {
      return true;
    }
    return false;
  }
  verifyBreakContinue(node, isBreak) {
    if (node.label && node.label.type === "Placeholder") return;
    super.verifyBreakContinue(node, isBreak);
  }
  parseExpressionStatement(node, expr) {
    var _expr$extra;
    if (expr.type !== "Placeholder" || (_expr$extra = expr.extra) != null && _expr$extra.parenthesized) {
      return super.parseExpressionStatement(node, expr);
    }
    if (this.match(14)) {
      const stmt = node;
      stmt.label = this.finishPlaceholder(expr, "Identifier");
      this.next();
      stmt.body = super.parseStatementOrSloppyAnnexBFunctionDeclaration();
      return this.finishNode(stmt, "LabeledStatement");
    }
    this.semicolon();
    node.name = expr.name;
    return this.finishPlaceholder(node, "Statement");
  }
  parseBlock(allowDirectives, createNewLexicalScope, afterBlockParse) {
    return this.parsePlaceholder("BlockStatement") || super.parseBlock(allowDirectives, createNewLexicalScope, afterBlockParse);
  }
  parseFunctionId(requireId) {
    return this.parsePlaceholder("Identifier") || super.parseFunctionId(requireId);
  }
  parseClass(node, isStatement, optionalId) {
    const type = isStatement ? "ClassDeclaration" : "ClassExpression";
    this.next();
    const oldStrict = this.state.strict;
    const placeholder = this.parsePlaceholder("Identifier");
    if (placeholder) {
      if (this.match(81) || this.match(144) || this.match(5)) {
        node.id = placeholder;
      } else if (optionalId || !isStatement) {
        node.id = null;
        node.body = this.finishPlaceholder(placeholder, "ClassBody");
        return this.finishNode(node, type);
      } else {
        throw this.raise(PlaceholderErrors.ClassNameIsRequired, this.state.startLoc);
      }
    } else {
      this.parseClassId(node, isStatement, optionalId);
    }
    super.parseClassSuper(node);
    node.body = this.parsePlaceholder("ClassBody") || super.parseClassBody(!!node.superClass, oldStrict);
    return this.finishNode(node, type);
  }
  parseExport(node, decorators) {
    const placeholder = this.parsePlaceholder("Identifier");
    if (!placeholder) return super.parseExport(node, decorators);
    if (!this.isContextual(98) && !this.match(12)) {
      node.specifiers = [];
      node.source = null;
      node.declaration = this.finishPlaceholder(placeholder, "Declaration");
      return this.finishNode(node, "ExportNamedDeclaration");
    }
    this.expectPlugin("exportDefaultFrom");
    const specifier = this.startNode();
    specifier.exported = placeholder;
    node.specifiers = [this.finishNode(specifier, "ExportDefaultSpecifier")];
    return super.parseExport(node, decorators);
  }
  isExportDefaultSpecifier() {
    if (this.match(65)) {
      const next = this.nextTokenStart();
      if (this.isUnparsedContextual(next, "from")) {
        if (this.input.startsWith(tokenLabelName(144), this.nextTokenStartSince(next + 4))) {
          return true;
        }
      }
    }
    return super.isExportDefaultSpecifier();
  }
  maybeParseExportDefaultSpecifier(node, maybeDefaultIdentifier) {
    var _specifiers;
    if ((_specifiers = node.specifiers) != null && _specifiers.length) {
      return true;
    }
    return super.maybeParseExportDefaultSpecifier(node, maybeDefaultIdentifier);
  }
  checkExport(node) {
    const {
      specifiers
    } = node;
    if (specifiers != null && specifiers.length) {
      node.specifiers = specifiers.filter(node => node.exported.type === "Placeholder");
    }
    super.checkExport(node);
    node.specifiers = specifiers;
  }
  parseImport(node) {
    const placeholder = this.parsePlaceholder("Identifier");
    if (!placeholder) return super.parseImport(node);
    node.specifiers = [];
    if (!this.isContextual(98) && !this.match(12)) {
      node.source = this.finishPlaceholder(placeholder, "StringLiteral");
      this.semicolon();
      return this.finishNode(node, "ImportDeclaration");
    }
    const specifier = this.startNodeAtNode(placeholder);
    specifier.local = placeholder;
    node.specifiers.push(this.finishNode(specifier, "ImportDefaultSpecifier"));
    if (this.eat(12)) {
      const hasStarImport = this.maybeParseStarImportSpecifier(node);
      if (!hasStarImport) this.parseNamedImportSpecifiers(node);
    }
    this.expectContextual(98);
    node.source = this.parseImportSource();
    this.semicolon();
    return this.finishNode(node, "ImportDeclaration");
  }
  parseImportSource() {
    return this.parsePlaceholder("StringLiteral") || super.parseImportSource();
  }
  assertNoSpace() {
    if (this.state.start > this.state.lastTokEndLoc.index) {
      this.raise(PlaceholderErrors.UnexpectedSpace, this.state.lastTokEndLoc);
    }
  }
};
var v8intrinsic = superClass => class V8IntrinsicMixin extends superClass {
  parseV8Intrinsic() {
    if (this.match(54)) {
      const v8IntrinsicStartLoc = this.state.startLoc;
      const node = this.startNode();
      this.next();
      if (tokenIsIdentifier(this.state.type)) {
        const name = this.parseIdentifierName();
        const identifier = this.createIdentifier(node, name);
        identifier.type = "V8IntrinsicIdentifier";
        if (this.match(10)) {
          return identifier;
        }
      }
      this.unexpected(v8IntrinsicStartLoc);
    }
  }
  parseExprAtom(refExpressionErrors) {
    return this.parseV8Intrinsic() || super.parseExprAtom(refExpressionErrors);
  }
};
function hasPlugin(plugins, expectedConfig) {
  const [expectedName, expectedOptions] = typeof expectedConfig === "string" ? [expectedConfig, {}] : expectedConfig;
  const expectedKeys = Object.keys(expectedOptions);
  const expectedOptionsIsEmpty = expectedKeys.length === 0;
  return plugins.some(p => {
    if (typeof p === "string") {
      return expectedOptionsIsEmpty && p === expectedName;
    } else {
      const [pluginName, pluginOptions] = p;
      if (pluginName !== expectedName) {
        return false;
      }
      for (const key of expectedKeys) {
        if (pluginOptions[key] !== expectedOptions[key]) {
          return false;
        }
      }
      return true;
    }
  });
}
function getPluginOption(plugins, name, option) {
  const plugin = plugins.find(plugin => {
    if (Array.isArray(plugin)) {
      return plugin[0] === name;
    } else {
      return plugin === name;
    }
  });
  if (plugin && Array.isArray(plugin) && plugin.length > 1) {
    return plugin[1][option];
  }
  return null;
}
const PIPELINE_PROPOSALS = ["minimal", "fsharp", "hack", "smart"];
const TOPIC_TOKENS = ["^^", "@@", "^", "%", "#"];
const RECORD_AND_TUPLE_SYNTAX_TYPES = ["hash", "bar"];
function validatePlugins(plugins) {
  if (hasPlugin(plugins, "decorators")) {
    if (hasPlugin(plugins, "decorators-legacy")) {
      throw new Error("Cannot use the decorators and decorators-legacy plugin together");
    }
    const decoratorsBeforeExport = getPluginOption(plugins, "decorators", "decoratorsBeforeExport");
    if (decoratorsBeforeExport != null && typeof decoratorsBeforeExport !== "boolean") {
      throw new Error("'decoratorsBeforeExport' must be a boolean, if specified.");
    }
    const allowCallParenthesized = getPluginOption(plugins, "decorators", "allowCallParenthesized");
    if (allowCallParenthesized != null && typeof allowCallParenthesized !== "boolean") {
      throw new Error("'allowCallParenthesized' must be a boolean.");
    }
  }
  if (hasPlugin(plugins, "flow") && hasPlugin(plugins, "typescript")) {
    throw new Error("Cannot combine flow and typescript plugins.");
  }
  if (hasPlugin(plugins, "placeholders") && hasPlugin(plugins, "v8intrinsic")) {
    throw new Error("Cannot combine placeholders and v8intrinsic plugins.");
  }
  if (hasPlugin(plugins, "pipelineOperator")) {
    const proposal = getPluginOption(plugins, "pipelineOperator", "proposal");
    if (!PIPELINE_PROPOSALS.includes(proposal)) {
      const proposalList = PIPELINE_PROPOSALS.map(p => `"${p}"`).join(", ");
      throw new Error(`"pipelineOperator" requires "proposal" option whose value must be one of: ${proposalList}.`);
    }
    const tupleSyntaxIsHash = hasPlugin(plugins, ["recordAndTuple", {
      syntaxType: "hash"
    }]);
    if (proposal === "hack") {
      if (hasPlugin(plugins, "placeholders")) {
        throw new Error("Cannot combine placeholders plugin and Hack-style pipes.");
      }
      if (hasPlugin(plugins, "v8intrinsic")) {
        throw new Error("Cannot combine v8intrinsic plugin and Hack-style pipes.");
      }
      const topicToken = getPluginOption(plugins, "pipelineOperator", "topicToken");
      if (!TOPIC_TOKENS.includes(topicToken)) {
        const tokenList = TOPIC_TOKENS.map(t => `"${t}"`).join(", ");
        throw new Error(`"pipelineOperator" in "proposal": "hack" mode also requires a "topicToken" option whose value must be one of: ${tokenList}.`);
      }
      if (topicToken === "#" && tupleSyntaxIsHash) {
        throw new Error('Plugin conflict between `["pipelineOperator", { proposal: "hack", topicToken: "#" }]` and `["recordAndtuple", { syntaxType: "hash"}]`.');
      }
    } else if (proposal === "smart" && tupleSyntaxIsHash) {
      throw new Error('Plugin conflict between `["pipelineOperator", { proposal: "smart" }]` and `["recordAndtuple", { syntaxType: "hash"}]`.');
    }
  }
  if (hasPlugin(plugins, "moduleAttributes")) {
    {
      if (hasPlugin(plugins, "importAssertions") || hasPlugin(plugins, "importAttributes")) {
        throw new Error("Cannot combine importAssertions, importAttributes and moduleAttributes plugins.");
      }
      const moduleAttributesVersionPluginOption = getPluginOption(plugins, "moduleAttributes", "version");
      if (moduleAttributesVersionPluginOption !== "may-2020") {
        throw new Error("The 'moduleAttributes' plugin requires a 'version' option," + " representing the last proposal update. Currently, the" + " only supported value is 'may-2020'.");
      }
    }
  }
  if (hasPlugin(plugins, "importAssertions") && hasPlugin(plugins, "importAttributes")) {
    throw new Error("Cannot combine importAssertions and importAttributes plugins.");
  }
  if (hasPlugin(plugins, "recordAndTuple") && getPluginOption(plugins, "recordAndTuple", "syntaxType") != null && !RECORD_AND_TUPLE_SYNTAX_TYPES.includes(getPluginOption(plugins, "recordAndTuple", "syntaxType"))) {
    throw new Error("The 'syntaxType' option of the 'recordAndTuple' plugin must be one of: " + RECORD_AND_TUPLE_SYNTAX_TYPES.map(p => `'${p}'`).join(", "));
  }
  if (hasPlugin(plugins, "asyncDoExpressions") && !hasPlugin(plugins, "doExpressions")) {
    const error = new Error("'asyncDoExpressions' requires 'doExpressions', please add 'doExpressions' to parser plugins.");
    error.missingPlugins = "doExpressions";
    throw error;
  }
  if (hasPlugin(plugins, "optionalChainingAssign") && getPluginOption(plugins, "optionalChainingAssign", "version") !== "2023-07") {
    throw new Error("The 'optionalChainingAssign' plugin requires a 'version' option," + " representing the last proposal update. Currently, the" + " only supported value is '2023-07'.");
  }
}
const mixinPlugins = {
  estree,
  jsx,
  flow,
  typescript,
  v8intrinsic,
  placeholders
};
const mixinPluginNames = Object.keys(mixinPlugins);
const defaultOptions = {
  sourceType: "script",
  sourceFilename: undefined,
  startColumn: 0,
  startLine: 1,
  allowAwaitOutsideFunction: false,
  allowReturnOutsideFunction: false,
  allowNewTargetOutsideFunction: false,
  allowImportExportEverywhere: false,
  allowSuperOutsideMethod: false,
  allowUndeclaredExports: false,
  plugins: [],
  strictMode: null,
  ranges: false,
  tokens: false,
  createImportExpressions: false,
  createParenthesizedExpressions: false,
  errorRecovery: false,
  attachComment: true,
  annexB: true
};
function getOptions(opts) {
  if (opts == null) {
    return Object.assign({}, defaultOptions);
  }
  if (opts.annexB != null && opts.annexB !== false) {
    throw new Error("The `annexB` option can only be set to `false`.");
  }
  const options = {};
  for (const key of Object.keys(defaultOptions)) {
    var _opts$key;
    options[key] = (_opts$key = opts[key]) != null ? _opts$key : defaultOptions[key];
  }
  return options;
}
class ExpressionParser extends LValParser {
  checkProto(prop, isRecord, protoRef, refExpressionErrors) {
    if (prop.type === "SpreadElement" || this.isObjectMethod(prop) || prop.computed || prop.shorthand) {
      return;
    }
    const key = prop.key;
    const name = key.type === "Identifier" ? key.name : key.value;
    if (name === "__proto__") {
      if (isRecord) {
        this.raise(Errors.RecordNoProto, key);
        return;
      }
      if (protoRef.used) {
        if (refExpressionErrors) {
          if (refExpressionErrors.doubleProtoLoc === null) {
            refExpressionErrors.doubleProtoLoc = key.loc.start;
          }
        } else {
          this.raise(Errors.DuplicateProto, key);
        }
      }
      protoRef.used = true;
    }
  }
  shouldExitDescending(expr, potentialArrowAt) {
    return expr.type === "ArrowFunctionExpression" && expr.start === potentialArrowAt;
  }
  getExpression() {
    this.enterInitialScopes();
    this.nextToken();
    const expr = this.parseExpression();
    if (!this.match(139)) {
      this.unexpected();
    }
    this.finalizeRemainingComments();
    expr.comments = this.comments;
    expr.errors = this.state.errors;
    if (this.options.tokens) {
      expr.tokens = this.tokens;
    }
    return expr;
  }
  parseExpression(disallowIn, refExpressionErrors) {
    if (disallowIn) {
      return this.disallowInAnd(() => this.parseExpressionBase(refExpressionErrors));
    }
    return this.allowInAnd(() => this.parseExpressionBase(refExpressionErrors));
  }
  parseExpressionBase(refExpressionErrors) {
    const startLoc = this.state.startLoc;
    const expr = this.parseMaybeAssign(refExpressionErrors);
    if (this.match(12)) {
      const node = this.startNodeAt(startLoc);
      node.expressions = [expr];
      while (this.eat(12)) {
        node.expressions.push(this.parseMaybeAssign(refExpressionErrors));
      }
      this.toReferencedList(node.expressions);
      return this.finishNode(node, "SequenceExpression");
    }
    return expr;
  }
  parseMaybeAssignDisallowIn(refExpressionErrors, afterLeftParse) {
    return this.disallowInAnd(() => this.parseMaybeAssign(refExpressionErrors, afterLeftParse));
  }
  parseMaybeAssignAllowIn(refExpressionErrors, afterLeftParse) {
    return this.allowInAnd(() => this.parseMaybeAssign(refExpressionErrors, afterLeftParse));
  }
  setOptionalParametersError(refExpressionErrors, resultError) {
    var _resultError$loc;
    refExpressionErrors.optionalParametersLoc = (_resultError$loc = resultError == null ? void 0 : resultError.loc) != null ? _resultError$loc : this.state.startLoc;
  }
  parseMaybeAssign(refExpressionErrors, afterLeftParse) {
    const startLoc = this.state.startLoc;
    if (this.isContextual(108)) {
      if (this.prodParam.hasYield) {
        let left = this.parseYield();
        if (afterLeftParse) {
          left = afterLeftParse.call(this, left, startLoc);
        }
        return left;
      }
    }
    let ownExpressionErrors;
    if (refExpressionErrors) {
      ownExpressionErrors = false;
    } else {
      refExpressionErrors = new ExpressionErrors();
      ownExpressionErrors = true;
    }
    const {
      type
    } = this.state;
    if (type === 10 || tokenIsIdentifier(type)) {
      this.state.potentialArrowAt = this.state.start;
    }
    let left = this.parseMaybeConditional(refExpressionErrors);
    if (afterLeftParse) {
      left = afterLeftParse.call(this, left, startLoc);
    }
    if (tokenIsAssignment(this.state.type)) {
      const node = this.startNodeAt(startLoc);
      const operator = this.state.value;
      node.operator = operator;
      if (this.match(29)) {
        this.toAssignable(left, true);
        node.left = left;
        const startIndex = startLoc.index;
        if (refExpressionErrors.doubleProtoLoc != null && refExpressionErrors.doubleProtoLoc.index >= startIndex) {
          refExpressionErrors.doubleProtoLoc = null;
        }
        if (refExpressionErrors.shorthandAssignLoc != null && refExpressionErrors.shorthandAssignLoc.index >= startIndex) {
          refExpressionErrors.shorthandAssignLoc = null;
        }
        if (refExpressionErrors.privateKeyLoc != null && refExpressionErrors.privateKeyLoc.index >= startIndex) {
          this.checkDestructuringPrivate(refExpressionErrors);
          refExpressionErrors.privateKeyLoc = null;
        }
      } else {
        node.left = left;
      }
      this.next();
      node.right = this.parseMaybeAssign();
      this.checkLVal(left, {
        in: this.finishNode(node, "AssignmentExpression")
      });
      return node;
    } else if (ownExpressionErrors) {
      this.checkExpressionErrors(refExpressionErrors, true);
    }
    return left;
  }
  parseMaybeConditional(refExpressionErrors) {
    const startLoc = this.state.startLoc;
    const potentialArrowAt = this.state.potentialArrowAt;
    const expr = this.parseExprOps(refExpressionErrors);
    if (this.shouldExitDescending(expr, potentialArrowAt)) {
      return expr;
    }
    return this.parseConditional(expr, startLoc, refExpressionErrors);
  }
  parseConditional(expr, startLoc, refExpressionErrors) {
    if (this.eat(17)) {
      const node = this.startNodeAt(startLoc);
      node.test = expr;
      node.consequent = this.parseMaybeAssignAllowIn();
      this.expect(14);
      node.alternate = this.parseMaybeAssign();
      return this.finishNode(node, "ConditionalExpression");
    }
    return expr;
  }
  parseMaybeUnaryOrPrivate(refExpressionErrors) {
    return this.match(138) ? this.parsePrivateName() : this.parseMaybeUnary(refExpressionErrors);
  }
  parseExprOps(refExpressionErrors) {
    const startLoc = this.state.startLoc;
    const potentialArrowAt = this.state.potentialArrowAt;
    const expr = this.parseMaybeUnaryOrPrivate(refExpressionErrors);
    if (this.shouldExitDescending(expr, potentialArrowAt)) {
      return expr;
    }
    return this.parseExprOp(expr, startLoc, -1);
  }
  parseExprOp(left, leftStartLoc, minPrec) {
    if (this.isPrivateName(left)) {
      const value = this.getPrivateNameSV(left);
      if (minPrec >= tokenOperatorPrecedence(58) || !this.prodParam.hasIn || !this.match(58)) {
        this.raise(Errors.PrivateInExpectedIn, left, {
          identifierName: value
        });
      }
      this.classScope.usePrivateName(value, left.loc.start);
    }
    const op = this.state.type;
    if (tokenIsOperator(op) && (this.prodParam.hasIn || !this.match(58))) {
      let prec = tokenOperatorPrecedence(op);
      if (prec > minPrec) {
        if (op === 39) {
          this.expectPlugin("pipelineOperator");
          if (this.state.inFSharpPipelineDirectBody) {
            return left;
          }
          this.checkPipelineAtInfixOperator(left, leftStartLoc);
        }
        const node = this.startNodeAt(leftStartLoc);
        node.left = left;
        node.operator = this.state.value;
        const logical = op === 41 || op === 42;
        const coalesce = op === 40;
        if (coalesce) {
          prec = tokenOperatorPrecedence(42);
        }
        this.next();
        if (op === 39 && this.hasPlugin(["pipelineOperator", {
          proposal: "minimal"
        }])) {
          if (this.state.type === 96 && this.prodParam.hasAwait) {
            throw this.raise(Errors.UnexpectedAwaitAfterPipelineBody, this.state.startLoc);
          }
        }
        node.right = this.parseExprOpRightExpr(op, prec);
        const finishedNode = this.finishNode(node, logical || coalesce ? "LogicalExpression" : "BinaryExpression");
        const nextOp = this.state.type;
        if (coalesce && (nextOp === 41 || nextOp === 42) || logical && nextOp === 40) {
          throw this.raise(Errors.MixingCoalesceWithLogical, this.state.startLoc);
        }
        return this.parseExprOp(finishedNode, leftStartLoc, minPrec);
      }
    }
    return left;
  }
  parseExprOpRightExpr(op, prec) {
    const startLoc = this.state.startLoc;
    switch (op) {
      case 39:
        switch (this.getPluginOption("pipelineOperator", "proposal")) {
          case "hack":
            return this.withTopicBindingContext(() => {
              return this.parseHackPipeBody();
            });
          case "smart":
            return this.withTopicBindingContext(() => {
              if (this.prodParam.hasYield && this.isContextual(108)) {
                throw this.raise(Errors.PipeBodyIsTighter, this.state.startLoc);
              }
              return this.parseSmartPipelineBodyInStyle(this.parseExprOpBaseRightExpr(op, prec), startLoc);
            });
          case "fsharp":
            return this.withSoloAwaitPermittingContext(() => {
              return this.parseFSharpPipelineBody(prec);
            });
        }
      default:
        return this.parseExprOpBaseRightExpr(op, prec);
    }
  }
  parseExprOpBaseRightExpr(op, prec) {
    const startLoc = this.state.startLoc;
    return this.parseExprOp(this.parseMaybeUnaryOrPrivate(), startLoc, tokenIsRightAssociative(op) ? prec - 1 : prec);
  }
  parseHackPipeBody() {
    var _body$extra;
    const {
      startLoc
    } = this.state;
    const body = this.parseMaybeAssign();
    const requiredParentheses = UnparenthesizedPipeBodyDescriptions.has(body.type);
    if (requiredParentheses && !((_body$extra = body.extra) != null && _body$extra.parenthesized)) {
      this.raise(Errors.PipeUnparenthesizedBody, startLoc, {
        type: body.type
      });
    }
    if (!this.topicReferenceWasUsedInCurrentContext()) {
      this.raise(Errors.PipeTopicUnused, startLoc);
    }
    return body;
  }
  checkExponentialAfterUnary(node) {
    if (this.match(57)) {
      this.raise(Errors.UnexpectedTokenUnaryExponentiation, node.argument);
    }
  }
  parseMaybeUnary(refExpressionErrors, sawUnary) {
    const startLoc = this.state.startLoc;
    const isAwait = this.isContextual(96);
    if (isAwait && this.isAwaitAllowed()) {
      this.next();
      const expr = this.parseAwait(startLoc);
      if (!sawUnary) this.checkExponentialAfterUnary(expr);
      return expr;
    }
    const update = this.match(34);
    const node = this.startNode();
    if (tokenIsPrefix(this.state.type)) {
      node.operator = this.state.value;
      node.prefix = true;
      if (this.match(72)) {
        this.expectPlugin("throwExpressions");
      }
      const isDelete = this.match(89);
      this.next();
      node.argument = this.parseMaybeUnary(null, true);
      this.checkExpressionErrors(refExpressionErrors, true);
      if (this.state.strict && isDelete) {
        const arg = node.argument;
        if (arg.type === "Identifier") {
          this.raise(Errors.StrictDelete, node);
        } else if (this.hasPropertyAsPrivateName(arg)) {
          this.raise(Errors.DeletePrivateField, node);
        }
      }
      if (!update) {
        if (!sawUnary) {
          this.checkExponentialAfterUnary(node);
        }
        return this.finishNode(node, "UnaryExpression");
      }
    }
    const expr = this.parseUpdate(node, update, refExpressionErrors);
    if (isAwait) {
      const {
        type
      } = this.state;
      const startsExpr = this.hasPlugin("v8intrinsic") ? tokenCanStartExpression(type) : tokenCanStartExpression(type) && !this.match(54);
      if (startsExpr && !this.isAmbiguousAwait()) {
        this.raiseOverwrite(Errors.AwaitNotInAsyncContext, startLoc);
        return this.parseAwait(startLoc);
      }
    }
    return expr;
  }
  parseUpdate(node, update, refExpressionErrors) {
    if (update) {
      const updateExpressionNode = node;
      this.checkLVal(updateExpressionNode.argument, {
        in: this.finishNode(updateExpressionNode, "UpdateExpression")
      });
      return node;
    }
    const startLoc = this.state.startLoc;
    let expr = this.parseExprSubscripts(refExpressionErrors);
    if (this.checkExpressionErrors(refExpressionErrors, false)) return expr;
    while (tokenIsPostfix(this.state.type) && !this.canInsertSemicolon()) {
      const node = this.startNodeAt(startLoc);
      node.operator = this.state.value;
      node.prefix = false;
      node.argument = expr;
      this.next();
      this.checkLVal(expr, {
        in: expr = this.finishNode(node, "UpdateExpression")
      });
    }
    return expr;
  }
  parseExprSubscripts(refExpressionErrors) {
    const startLoc = this.state.startLoc;
    const potentialArrowAt = this.state.potentialArrowAt;
    const expr = this.parseExprAtom(refExpressionErrors);
    if (this.shouldExitDescending(expr, potentialArrowAt)) {
      return expr;
    }
    return this.parseSubscripts(expr, startLoc);
  }
  parseSubscripts(base, startLoc, noCalls) {
    const state = {
      optionalChainMember: false,
      maybeAsyncArrow: this.atPossibleAsyncArrow(base),
      stop: false
    };
    do {
      base = this.parseSubscript(base, startLoc, noCalls, state);
      state.maybeAsyncArrow = false;
    } while (!state.stop);
    return base;
  }
  parseSubscript(base, startLoc, noCalls, state) {
    const {
      type
    } = this.state;
    if (!noCalls && type === 15) {
      return this.parseBind(base, startLoc, noCalls, state);
    } else if (tokenIsTemplate(type)) {
      return this.parseTaggedTemplateExpression(base, startLoc, state);
    }
    let optional = false;
    if (type === 18) {
      if (noCalls) {
        this.raise(Errors.OptionalChainingNoNew, this.state.startLoc);
        if (this.lookaheadCharCode() === 40) {
          state.stop = true;
          return base;
        }
      }
      state.optionalChainMember = optional = true;
      this.next();
    }
    if (!noCalls && this.match(10)) {
      return this.parseCoverCallAndAsyncArrowHead(base, startLoc, state, optional);
    } else {
      const computed = this.eat(0);
      if (computed || optional || this.eat(16)) {
        return this.parseMember(base, startLoc, state, computed, optional);
      } else {
        state.stop = true;
        return base;
      }
    }
  }
  parseMember(base, startLoc, state, computed, optional) {
    const node = this.startNodeAt(startLoc);
    node.object = base;
    node.computed = computed;
    if (computed) {
      node.property = this.parseExpression();
      this.expect(3);
    } else if (this.match(138)) {
      if (base.type === "Super") {
        this.raise(Errors.SuperPrivateField, startLoc);
      }
      this.classScope.usePrivateName(this.state.value, this.state.startLoc);
      node.property = this.parsePrivateName();
    } else {
      node.property = this.parseIdentifier(true);
    }
    if (state.optionalChainMember) {
      node.optional = optional;
      return this.finishNode(node, "OptionalMemberExpression");
    } else {
      return this.finishNode(node, "MemberExpression");
    }
  }
  parseBind(base, startLoc, noCalls, state) {
    const node = this.startNodeAt(startLoc);
    node.object = base;
    this.next();
    node.callee = this.parseNoCallExpr();
    state.stop = true;
    return this.parseSubscripts(this.finishNode(node, "BindExpression"), startLoc, noCalls);
  }
  parseCoverCallAndAsyncArrowHead(base, startLoc, state, optional) {
    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
    let refExpressionErrors = null;
    this.state.maybeInArrowParameters = true;
    this.next();
    const node = this.startNodeAt(startLoc);
    node.callee = base;
    const {
      maybeAsyncArrow,
      optionalChainMember
    } = state;
    if (maybeAsyncArrow) {
      this.expressionScope.enter(newAsyncArrowScope());
      refExpressionErrors = new ExpressionErrors();
    }
    if (optionalChainMember) {
      node.optional = optional;
    }
    if (optional) {
      node.arguments = this.parseCallExpressionArguments(11);
    } else {
      node.arguments = this.parseCallExpressionArguments(11, base.type === "Import", base.type !== "Super", node, refExpressionErrors);
    }
    let finishedNode = this.finishCallExpression(node, optionalChainMember);
    if (maybeAsyncArrow && this.shouldParseAsyncArrow() && !optional) {
      state.stop = true;
      this.checkDestructuringPrivate(refExpressionErrors);
      this.expressionScope.validateAsPattern();
      this.expressionScope.exit();
      finishedNode = this.parseAsyncArrowFromCallExpression(this.startNodeAt(startLoc), finishedNode);
    } else {
      if (maybeAsyncArrow) {
        this.checkExpressionErrors(refExpressionErrors, true);
        this.expressionScope.exit();
      }
      this.toReferencedArguments(finishedNode);
    }
    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
    return finishedNode;
  }
  toReferencedArguments(node, isParenthesizedExpr) {
    this.toReferencedListDeep(node.arguments, isParenthesizedExpr);
  }
  parseTaggedTemplateExpression(base, startLoc, state) {
    const node = this.startNodeAt(startLoc);
    node.tag = base;
    node.quasi = this.parseTemplate(true);
    if (state.optionalChainMember) {
      this.raise(Errors.OptionalChainingNoTemplate, startLoc);
    }
    return this.finishNode(node, "TaggedTemplateExpression");
  }
  atPossibleAsyncArrow(base) {
    return base.type === "Identifier" && base.name === "async" && this.state.lastTokEndLoc.index === base.end && !this.canInsertSemicolon() && base.end - base.start === 5 && base.start === this.state.potentialArrowAt;
  }
  expectImportAttributesPlugin() {
    if (!this.hasPlugin("importAssertions")) {
      this.expectPlugin("importAttributes");
    }
  }
  finishCallExpression(node, optional) {
    if (node.callee.type === "Import") {
      if (node.arguments.length === 2) {
        {
          if (!this.hasPlugin("moduleAttributes")) {
            this.expectImportAttributesPlugin();
          }
        }
      }
      if (node.arguments.length === 0 || node.arguments.length > 2) {
        this.raise(Errors.ImportCallArity, node, {
          maxArgumentCount: this.hasPlugin("importAttributes") || this.hasPlugin("importAssertions") || this.hasPlugin("moduleAttributes") ? 2 : 1
        });
      } else {
        for (const arg of node.arguments) {
          if (arg.type === "SpreadElement") {
            this.raise(Errors.ImportCallSpreadArgument, arg);
          }
        }
      }
    }
    return this.finishNode(node, optional ? "OptionalCallExpression" : "CallExpression");
  }
  parseCallExpressionArguments(close, dynamicImport, allowPlaceholder, nodeForExtra, refExpressionErrors) {
    const elts = [];
    let first = true;
    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.inFSharpPipelineDirectBody = false;
    while (!this.eat(close)) {
      if (first) {
        first = false;
      } else {
        this.expect(12);
        if (this.match(close)) {
          if (dynamicImport && !this.hasPlugin("importAttributes") && !this.hasPlugin("importAssertions") && !this.hasPlugin("moduleAttributes")) {
            this.raise(Errors.ImportCallArgumentTrailingComma, this.state.lastTokStartLoc);
          }
          if (nodeForExtra) {
            this.addTrailingCommaExtraToNode(nodeForExtra);
          }
          this.next();
          break;
        }
      }
      elts.push(this.parseExprListItem(false, refExpressionErrors, allowPlaceholder));
    }
    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    return elts;
  }
  shouldParseAsyncArrow() {
    return this.match(19) && !this.canInsertSemicolon();
  }
  parseAsyncArrowFromCallExpression(node, call) {
    var _call$extra;
    this.resetPreviousNodeTrailingComments(call);
    this.expect(19);
    this.parseArrowExpression(node, call.arguments, true, (_call$extra = call.extra) == null ? void 0 : _call$extra.trailingCommaLoc);
    if (call.innerComments) {
      setInnerComments(node, call.innerComments);
    }
    if (call.callee.trailingComments) {
      setInnerComments(node, call.callee.trailingComments);
    }
    return node;
  }
  parseNoCallExpr() {
    const startLoc = this.state.startLoc;
    return this.parseSubscripts(this.parseExprAtom(), startLoc, true);
  }
  parseExprAtom(refExpressionErrors) {
    let node;
    let decorators = null;
    const {
      type
    } = this.state;
    switch (type) {
      case 79:
        return this.parseSuper();
      case 83:
        node = this.startNode();
        this.next();
        if (this.match(16)) {
          return this.parseImportMetaProperty(node);
        }
        if (this.match(10)) {
          if (this.options.createImportExpressions) {
            return this.parseImportCall(node);
          } else {
            return this.finishNode(node, "Import");
          }
        } else {
          this.raise(Errors.UnsupportedImport, this.state.lastTokStartLoc);
          return this.finishNode(node, "Import");
        }
      case 78:
        node = this.startNode();
        this.next();
        return this.finishNode(node, "ThisExpression");
      case 90:
        {
          return this.parseDo(this.startNode(), false);
        }
      case 56:
      case 31:
        {
          this.readRegexp();
          return this.parseRegExpLiteral(this.state.value);
        }
      case 134:
        return this.parseNumericLiteral(this.state.value);
      case 135:
        return this.parseBigIntLiteral(this.state.value);
      case 136:
        return this.parseDecimalLiteral(this.state.value);
      case 133:
        return this.parseStringLiteral(this.state.value);
      case 84:
        return this.parseNullLiteral();
      case 85:
        return this.parseBooleanLiteral(true);
      case 86:
        return this.parseBooleanLiteral(false);
      case 10:
        {
          const canBeArrow = this.state.potentialArrowAt === this.state.start;
          return this.parseParenAndDistinguishExpression(canBeArrow);
        }
      case 2:
      case 1:
        {
          return this.parseArrayLike(this.state.type === 2 ? 4 : 3, false, true);
        }
      case 0:
        {
          return this.parseArrayLike(3, true, false, refExpressionErrors);
        }
      case 6:
      case 7:
        {
          return this.parseObjectLike(this.state.type === 6 ? 9 : 8, false, true);
        }
      case 5:
        {
          return this.parseObjectLike(8, false, false, refExpressionErrors);
        }
      case 68:
        return this.parseFunctionOrFunctionSent();
      case 26:
        decorators = this.parseDecorators();
      case 80:
        return this.parseClass(this.maybeTakeDecorators(decorators, this.startNode()), false);
      case 77:
        return this.parseNewOrNewTarget();
      case 25:
      case 24:
        return this.parseTemplate(false);
      case 15:
        {
          node = this.startNode();
          this.next();
          node.object = null;
          const callee = node.callee = this.parseNoCallExpr();
          if (callee.type === "MemberExpression") {
            return this.finishNode(node, "BindExpression");
          } else {
            throw this.raise(Errors.UnsupportedBind, callee);
          }
        }
      case 138:
        {
          this.raise(Errors.PrivateInExpectedIn, this.state.startLoc, {
            identifierName: this.state.value
          });
          return this.parsePrivateName();
        }
      case 33:
        {
          return this.parseTopicReferenceThenEqualsSign(54, "%");
        }
      case 32:
        {
          return this.parseTopicReferenceThenEqualsSign(44, "^");
        }
      case 37:
      case 38:
        {
          return this.parseTopicReference("hack");
        }
      case 44:
      case 54:
      case 27:
        {
          const pipeProposal = this.getPluginOption("pipelineOperator", "proposal");
          if (pipeProposal) {
            return this.parseTopicReference(pipeProposal);
          }
          this.unexpected();
          break;
        }
      case 47:
        {
          const lookaheadCh = this.input.codePointAt(this.nextTokenStart());
          if (isIdentifierStart(lookaheadCh) || lookaheadCh === 62) {
            this.expectOnePlugin(["jsx", "flow", "typescript"]);
          } else {
            this.unexpected();
          }
          break;
        }
      default:
        if (tokenIsIdentifier(type)) {
          if (this.isContextual(127) && this.lookaheadInLineCharCode() === 123) {
            return this.parseModuleExpression();
          }
          const canBeArrow = this.state.potentialArrowAt === this.state.start;
          const containsEsc = this.state.containsEsc;
          const id = this.parseIdentifier();
          if (!containsEsc && id.name === "async" && !this.canInsertSemicolon()) {
            const {
              type
            } = this.state;
            if (type === 68) {
              this.resetPreviousNodeTrailingComments(id);
              this.next();
              return this.parseAsyncFunctionExpression(this.startNodeAtNode(id));
            } else if (tokenIsIdentifier(type)) {
              if (this.lookaheadCharCode() === 61) {
                return this.parseAsyncArrowUnaryFunction(this.startNodeAtNode(id));
              } else {
                return id;
              }
            } else if (type === 90) {
              this.resetPreviousNodeTrailingComments(id);
              return this.parseDo(this.startNodeAtNode(id), true);
            }
          }
          if (canBeArrow && this.match(19) && !this.canInsertSemicolon()) {
            this.next();
            return this.parseArrowExpression(this.startNodeAtNode(id), [id], false);
          }
          return id;
        } else {
          this.unexpected();
        }
    }
  }
  parseTopicReferenceThenEqualsSign(topicTokenType, topicTokenValue) {
    const pipeProposal = this.getPluginOption("pipelineOperator", "proposal");
    if (pipeProposal) {
      this.state.type = topicTokenType;
      this.state.value = topicTokenValue;
      this.state.pos--;
      this.state.end--;
      this.state.endLoc = createPositionWithColumnOffset(this.state.endLoc, -1);
      return this.parseTopicReference(pipeProposal);
    } else {
      this.unexpected();
    }
  }
  parseTopicReference(pipeProposal) {
    const node = this.startNode();
    const startLoc = this.state.startLoc;
    const tokenType = this.state.type;
    this.next();
    return this.finishTopicReference(node, startLoc, pipeProposal, tokenType);
  }
  finishTopicReference(node, startLoc, pipeProposal, tokenType) {
    if (this.testTopicReferenceConfiguration(pipeProposal, startLoc, tokenType)) {
      const nodeType = pipeProposal === "smart" ? "PipelinePrimaryTopicReference" : "TopicReference";
      if (!this.topicReferenceIsAllowedInCurrentContext()) {
        this.raise(pipeProposal === "smart" ? Errors.PrimaryTopicNotAllowed : Errors.PipeTopicUnbound, startLoc);
      }
      this.registerTopicReference();
      return this.finishNode(node, nodeType);
    } else {
      throw this.raise(Errors.PipeTopicUnconfiguredToken, startLoc, {
        token: tokenLabelName(tokenType)
      });
    }
  }
  testTopicReferenceConfiguration(pipeProposal, startLoc, tokenType) {
    switch (pipeProposal) {
      case "hack":
        {
          return this.hasPlugin(["pipelineOperator", {
            topicToken: tokenLabelName(tokenType)
          }]);
        }
      case "smart":
        return tokenType === 27;
      default:
        throw this.raise(Errors.PipeTopicRequiresHackPipes, startLoc);
    }
  }
  parseAsyncArrowUnaryFunction(node) {
    this.prodParam.enter(functionFlags(true, this.prodParam.hasYield));
    const params = [this.parseIdentifier()];
    this.prodParam.exit();
    if (this.hasPrecedingLineBreak()) {
      this.raise(Errors.LineTerminatorBeforeArrow, this.state.curPosition());
    }
    this.expect(19);
    return this.parseArrowExpression(node, params, true);
  }
  parseDo(node, isAsync) {
    this.expectPlugin("doExpressions");
    if (isAsync) {
      this.expectPlugin("asyncDoExpressions");
    }
    node.async = isAsync;
    this.next();
    const oldLabels = this.state.labels;
    this.state.labels = [];
    if (isAsync) {
      this.prodParam.enter(2);
      node.body = this.parseBlock();
      this.prodParam.exit();
    } else {
      node.body = this.parseBlock();
    }
    this.state.labels = oldLabels;
    return this.finishNode(node, "DoExpression");
  }
  parseSuper() {
    const node = this.startNode();
    this.next();
    if (this.match(10) && !this.scope.allowDirectSuper && !this.options.allowSuperOutsideMethod) {
      this.raise(Errors.SuperNotAllowed, node);
    } else if (!this.scope.allowSuper && !this.options.allowSuperOutsideMethod) {
      this.raise(Errors.UnexpectedSuper, node);
    }
    if (!this.match(10) && !this.match(0) && !this.match(16)) {
      this.raise(Errors.UnsupportedSuper, node);
    }
    return this.finishNode(node, "Super");
  }
  parsePrivateName() {
    const node = this.startNode();
    const id = this.startNodeAt(createPositionWithColumnOffset(this.state.startLoc, 1));
    const name = this.state.value;
    this.next();
    node.id = this.createIdentifier(id, name);
    return this.finishNode(node, "PrivateName");
  }
  parseFunctionOrFunctionSent() {
    const node = this.startNode();
    this.next();
    if (this.prodParam.hasYield && this.match(16)) {
      const meta = this.createIdentifier(this.startNodeAtNode(node), "function");
      this.next();
      if (this.match(103)) {
        this.expectPlugin("functionSent");
      } else if (!this.hasPlugin("functionSent")) {
        this.unexpected();
      }
      return this.parseMetaProperty(node, meta, "sent");
    }
    return this.parseFunction(node);
  }
  parseMetaProperty(node, meta, propertyName) {
    node.meta = meta;
    const containsEsc = this.state.containsEsc;
    node.property = this.parseIdentifier(true);
    if (node.property.name !== propertyName || containsEsc) {
      this.raise(Errors.UnsupportedMetaProperty, node.property, {
        target: meta.name,
        onlyValidPropertyName: propertyName
      });
    }
    return this.finishNode(node, "MetaProperty");
  }
  parseImportMetaProperty(node) {
    const id = this.createIdentifier(this.startNodeAtNode(node), "import");
    this.next();
    if (this.isContextual(101)) {
      if (!this.inModule) {
        this.raise(Errors.ImportMetaOutsideModule, id);
      }
      this.sawUnambiguousESM = true;
    } else if (this.isContextual(105) || this.isContextual(97)) {
      const isSource = this.isContextual(105);
      if (!isSource) this.unexpected();
      this.expectPlugin(isSource ? "sourcePhaseImports" : "deferredImportEvaluation");
      if (!this.options.createImportExpressions) {
        throw this.raise(Errors.DynamicImportPhaseRequiresImportExpressions, this.state.startLoc, {
          phase: this.state.value
        });
      }
      this.next();
      node.phase = isSource ? "source" : "defer";
      return this.parseImportCall(node);
    }
    return this.parseMetaProperty(node, id, "meta");
  }
  parseLiteralAtNode(value, type, node) {
    this.addExtra(node, "rawValue", value);
    this.addExtra(node, "raw", this.input.slice(node.start, this.state.end));
    node.value = value;
    this.next();
    return this.finishNode(node, type);
  }
  parseLiteral(value, type) {
    const node = this.startNode();
    return this.parseLiteralAtNode(value, type, node);
  }
  parseStringLiteral(value) {
    return this.parseLiteral(value, "StringLiteral");
  }
  parseNumericLiteral(value) {
    return this.parseLiteral(value, "NumericLiteral");
  }
  parseBigIntLiteral(value) {
    return this.parseLiteral(value, "BigIntLiteral");
  }
  parseDecimalLiteral(value) {
    return this.parseLiteral(value, "DecimalLiteral");
  }
  parseRegExpLiteral(value) {
    const node = this.parseLiteral(value.value, "RegExpLiteral");
    node.pattern = value.pattern;
    node.flags = value.flags;
    return node;
  }
  parseBooleanLiteral(value) {
    const node = this.startNode();
    node.value = value;
    this.next();
    return this.finishNode(node, "BooleanLiteral");
  }
  parseNullLiteral() {
    const node = this.startNode();
    this.next();
    return this.finishNode(node, "NullLiteral");
  }
  parseParenAndDistinguishExpression(canBeArrow) {
    const startLoc = this.state.startLoc;
    let val;
    this.next();
    this.expressionScope.enter(newArrowHeadScope());
    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.maybeInArrowParameters = true;
    this.state.inFSharpPipelineDirectBody = false;
    const innerStartLoc = this.state.startLoc;
    const exprList = [];
    const refExpressionErrors = new ExpressionErrors();
    let first = true;
    let spreadStartLoc;
    let optionalCommaStartLoc;
    while (!this.match(11)) {
      if (first) {
        first = false;
      } else {
        this.expect(12, refExpressionErrors.optionalParametersLoc === null ? null : refExpressionErrors.optionalParametersLoc);
        if (this.match(11)) {
          optionalCommaStartLoc = this.state.startLoc;
          break;
        }
      }
      if (this.match(21)) {
        const spreadNodeStartLoc = this.state.startLoc;
        spreadStartLoc = this.state.startLoc;
        exprList.push(this.parseParenItem(this.parseRestBinding(), spreadNodeStartLoc));
        if (!this.checkCommaAfterRest(41)) {
          break;
        }
      } else {
        exprList.push(this.parseMaybeAssignAllowIn(refExpressionErrors, this.parseParenItem));
      }
    }
    const innerEndLoc = this.state.lastTokEndLoc;
    this.expect(11);
    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    let arrowNode = this.startNodeAt(startLoc);
    if (canBeArrow && this.shouldParseArrow(exprList) && (arrowNode = this.parseArrow(arrowNode))) {
      this.checkDestructuringPrivate(refExpressionErrors);
      this.expressionScope.validateAsPattern();
      this.expressionScope.exit();
      this.parseArrowExpression(arrowNode, exprList, false);
      return arrowNode;
    }
    this.expressionScope.exit();
    if (!exprList.length) {
      this.unexpected(this.state.lastTokStartLoc);
    }
    if (optionalCommaStartLoc) this.unexpected(optionalCommaStartLoc);
    if (spreadStartLoc) this.unexpected(spreadStartLoc);
    this.checkExpressionErrors(refExpressionErrors, true);
    this.toReferencedListDeep(exprList, true);
    if (exprList.length > 1) {
      val = this.startNodeAt(innerStartLoc);
      val.expressions = exprList;
      this.finishNode(val, "SequenceExpression");
      this.resetEndLocation(val, innerEndLoc);
    } else {
      val = exprList[0];
    }
    return this.wrapParenthesis(startLoc, val);
  }
  wrapParenthesis(startLoc, expression) {
    if (!this.options.createParenthesizedExpressions) {
      this.addExtra(expression, "parenthesized", true);
      this.addExtra(expression, "parenStart", startLoc.index);
      this.takeSurroundingComments(expression, startLoc.index, this.state.lastTokEndLoc.index);
      return expression;
    }
    const parenExpression = this.startNodeAt(startLoc);
    parenExpression.expression = expression;
    return this.finishNode(parenExpression, "ParenthesizedExpression");
  }
  shouldParseArrow(params) {
    return !this.canInsertSemicolon();
  }
  parseArrow(node) {
    if (this.eat(19)) {
      return node;
    }
  }
  parseParenItem(node, startLoc) {
    return node;
  }
  parseNewOrNewTarget() {
    const node = this.startNode();
    this.next();
    if (this.match(16)) {
      const meta = this.createIdentifier(this.startNodeAtNode(node), "new");
      this.next();
      const metaProp = this.parseMetaProperty(node, meta, "target");
      if (!this.scope.inNonArrowFunction && !this.scope.inClass && !this.options.allowNewTargetOutsideFunction) {
        this.raise(Errors.UnexpectedNewTarget, metaProp);
      }
      return metaProp;
    }
    return this.parseNew(node);
  }
  parseNew(node) {
    this.parseNewCallee(node);
    if (this.eat(10)) {
      const args = this.parseExprList(11);
      this.toReferencedList(args);
      node.arguments = args;
    } else {
      node.arguments = [];
    }
    return this.finishNode(node, "NewExpression");
  }
  parseNewCallee(node) {
    const isImport = this.match(83);
    const callee = this.parseNoCallExpr();
    node.callee = callee;
    if (isImport && (callee.type === "Import" || callee.type === "ImportExpression")) {
      this.raise(Errors.ImportCallNotNewExpression, callee);
    }
  }
  parseTemplateElement(isTagged) {
    const {
      start,
      startLoc,
      end,
      value
    } = this.state;
    const elemStart = start + 1;
    const elem = this.startNodeAt(createPositionWithColumnOffset(startLoc, 1));
    if (value === null) {
      if (!isTagged) {
        this.raise(Errors.InvalidEscapeSequenceTemplate, createPositionWithColumnOffset(this.state.firstInvalidTemplateEscapePos, 1));
      }
    }
    const isTail = this.match(24);
    const endOffset = isTail ? -1 : -2;
    const elemEnd = end + endOffset;
    elem.value = {
      raw: this.input.slice(elemStart, elemEnd).replace(/\r\n?/g, "\n"),
      cooked: value === null ? null : value.slice(1, endOffset)
    };
    elem.tail = isTail;
    this.next();
    const finishedNode = this.finishNode(elem, "TemplateElement");
    this.resetEndLocation(finishedNode, createPositionWithColumnOffset(this.state.lastTokEndLoc, endOffset));
    return finishedNode;
  }
  parseTemplate(isTagged) {
    const node = this.startNode();
    node.expressions = [];
    let curElt = this.parseTemplateElement(isTagged);
    node.quasis = [curElt];
    while (!curElt.tail) {
      node.expressions.push(this.parseTemplateSubstitution());
      this.readTemplateContinuation();
      node.quasis.push(curElt = this.parseTemplateElement(isTagged));
    }
    return this.finishNode(node, "TemplateLiteral");
  }
  parseTemplateSubstitution() {
    return this.parseExpression();
  }
  parseObjectLike(close, isPattern, isRecord, refExpressionErrors) {
    if (isRecord) {
      this.expectPlugin("recordAndTuple");
    }
    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.inFSharpPipelineDirectBody = false;
    const propHash = Object.create(null);
    let first = true;
    const node = this.startNode();
    node.properties = [];
    this.next();
    while (!this.match(close)) {
      if (first) {
        first = false;
      } else {
        this.expect(12);
        if (this.match(close)) {
          this.addTrailingCommaExtraToNode(node);
          break;
        }
      }
      let prop;
      if (isPattern) {
        prop = this.parseBindingProperty();
      } else {
        prop = this.parsePropertyDefinition(refExpressionErrors);
        this.checkProto(prop, isRecord, propHash, refExpressionErrors);
      }
      if (isRecord && !this.isObjectProperty(prop) && prop.type !== "SpreadElement") {
        this.raise(Errors.InvalidRecordProperty, prop);
      }
      if (prop.shorthand) {
        this.addExtra(prop, "shorthand", true);
      }
      node.properties.push(prop);
    }
    this.next();
    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    let type = "ObjectExpression";
    if (isPattern) {
      type = "ObjectPattern";
    } else if (isRecord) {
      type = "RecordExpression";
    }
    return this.finishNode(node, type);
  }
  addTrailingCommaExtraToNode(node) {
    this.addExtra(node, "trailingComma", this.state.lastTokStartLoc.index);
    this.addExtra(node, "trailingCommaLoc", this.state.lastTokStartLoc, false);
  }
  maybeAsyncOrAccessorProp(prop) {
    return !prop.computed && prop.key.type === "Identifier" && (this.isLiteralPropertyName() || this.match(0) || this.match(55));
  }
  parsePropertyDefinition(refExpressionErrors) {
    let decorators = [];
    if (this.match(26)) {
      if (this.hasPlugin("decorators")) {
        this.raise(Errors.UnsupportedPropertyDecorator, this.state.startLoc);
      }
      while (this.match(26)) {
        decorators.push(this.parseDecorator());
      }
    }
    const prop = this.startNode();
    let isAsync = false;
    let isAccessor = false;
    let startLoc;
    if (this.match(21)) {
      if (decorators.length) this.unexpected();
      return this.parseSpread();
    }
    if (decorators.length) {
      prop.decorators = decorators;
      decorators = [];
    }
    prop.method = false;
    if (refExpressionErrors) {
      startLoc = this.state.startLoc;
    }
    let isGenerator = this.eat(55);
    this.parsePropertyNamePrefixOperator(prop);
    const containsEsc = this.state.containsEsc;
    const key = this.parsePropertyName(prop, refExpressionErrors);
    if (!isGenerator && !containsEsc && this.maybeAsyncOrAccessorProp(prop)) {
      const keyName = key.name;
      if (keyName === "async" && !this.hasPrecedingLineBreak()) {
        isAsync = true;
        this.resetPreviousNodeTrailingComments(key);
        isGenerator = this.eat(55);
        this.parsePropertyName(prop);
      }
      if (keyName === "get" || keyName === "set") {
        isAccessor = true;
        this.resetPreviousNodeTrailingComments(key);
        prop.kind = keyName;
        if (this.match(55)) {
          isGenerator = true;
          this.raise(Errors.AccessorIsGenerator, this.state.curPosition(), {
            kind: keyName
          });
          this.next();
        }
        this.parsePropertyName(prop);
      }
    }
    return this.parseObjPropValue(prop, startLoc, isGenerator, isAsync, false, isAccessor, refExpressionErrors);
  }
  getGetterSetterExpectedParamCount(method) {
    return method.kind === "get" ? 0 : 1;
  }
  getObjectOrClassMethodParams(method) {
    return method.params;
  }
  checkGetterSetterParams(method) {
    var _params;
    const paramCount = this.getGetterSetterExpectedParamCount(method);
    const params = this.getObjectOrClassMethodParams(method);
    if (params.length !== paramCount) {
      this.raise(method.kind === "get" ? Errors.BadGetterArity : Errors.BadSetterArity, method);
    }
    if (method.kind === "set" && ((_params = params[params.length - 1]) == null ? void 0 : _params.type) === "RestElement") {
      this.raise(Errors.BadSetterRestParameter, method);
    }
  }
  parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor) {
    if (isAccessor) {
      const finishedProp = this.parseMethod(prop, isGenerator, false, false, false, "ObjectMethod");
      this.checkGetterSetterParams(finishedProp);
      return finishedProp;
    }
    if (isAsync || isGenerator || this.match(10)) {
      if (isPattern) this.unexpected();
      prop.kind = "method";
      prop.method = true;
      return this.parseMethod(prop, isGenerator, isAsync, false, false, "ObjectMethod");
    }
  }
  parseObjectProperty(prop, startLoc, isPattern, refExpressionErrors) {
    prop.shorthand = false;
    if (this.eat(14)) {
      prop.value = isPattern ? this.parseMaybeDefault(this.state.startLoc) : this.parseMaybeAssignAllowIn(refExpressionErrors);
      return this.finishNode(prop, "ObjectProperty");
    }
    if (!prop.computed && prop.key.type === "Identifier") {
      this.checkReservedWord(prop.key.name, prop.key.loc.start, true, false);
      if (isPattern) {
        prop.value = this.parseMaybeDefault(startLoc, cloneIdentifier(prop.key));
      } else if (this.match(29)) {
        const shorthandAssignLoc = this.state.startLoc;
        if (refExpressionErrors != null) {
          if (refExpressionErrors.shorthandAssignLoc === null) {
            refExpressionErrors.shorthandAssignLoc = shorthandAssignLoc;
          }
        } else {
          this.raise(Errors.InvalidCoverInitializedName, shorthandAssignLoc);
        }
        prop.value = this.parseMaybeDefault(startLoc, cloneIdentifier(prop.key));
      } else {
        prop.value = cloneIdentifier(prop.key);
      }
      prop.shorthand = true;
      return this.finishNode(prop, "ObjectProperty");
    }
  }
  parseObjPropValue(prop, startLoc, isGenerator, isAsync, isPattern, isAccessor, refExpressionErrors) {
    const node = this.parseObjectMethod(prop, isGenerator, isAsync, isPattern, isAccessor) || this.parseObjectProperty(prop, startLoc, isPattern, refExpressionErrors);
    if (!node) this.unexpected();
    return node;
  }
  parsePropertyName(prop, refExpressionErrors) {
    if (this.eat(0)) {
      prop.computed = true;
      prop.key = this.parseMaybeAssignAllowIn();
      this.expect(3);
    } else {
      const {
        type,
        value
      } = this.state;
      let key;
      if (tokenIsKeywordOrIdentifier(type)) {
        key = this.parseIdentifier(true);
      } else {
        switch (type) {
          case 134:
            key = this.parseNumericLiteral(value);
            break;
          case 133:
            key = this.parseStringLiteral(value);
            break;
          case 135:
            key = this.parseBigIntLiteral(value);
            break;
          case 136:
            key = this.parseDecimalLiteral(value);
            break;
          case 138:
            {
              const privateKeyLoc = this.state.startLoc;
              if (refExpressionErrors != null) {
                if (refExpressionErrors.privateKeyLoc === null) {
                  refExpressionErrors.privateKeyLoc = privateKeyLoc;
                }
              } else {
                this.raise(Errors.UnexpectedPrivateField, privateKeyLoc);
              }
              key = this.parsePrivateName();
              break;
            }
          default:
            this.unexpected();
        }
      }
      prop.key = key;
      if (type !== 138) {
        prop.computed = false;
      }
    }
    return prop.key;
  }
  initFunction(node, isAsync) {
    node.id = null;
    node.generator = false;
    node.async = isAsync;
  }
  parseMethod(node, isGenerator, isAsync, isConstructor, allowDirectSuper, type, inClassScope = false) {
    this.initFunction(node, isAsync);
    node.generator = isGenerator;
    this.scope.enter(2 | 16 | (inClassScope ? 64 : 0) | (allowDirectSuper ? 32 : 0));
    this.prodParam.enter(functionFlags(isAsync, node.generator));
    this.parseFunctionParams(node, isConstructor);
    const finishedNode = this.parseFunctionBodyAndFinish(node, type, true);
    this.prodParam.exit();
    this.scope.exit();
    return finishedNode;
  }
  parseArrayLike(close, canBePattern, isTuple, refExpressionErrors) {
    if (isTuple) {
      this.expectPlugin("recordAndTuple");
    }
    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.inFSharpPipelineDirectBody = false;
    const node = this.startNode();
    this.next();
    node.elements = this.parseExprList(close, !isTuple, refExpressionErrors, node);
    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    return this.finishNode(node, isTuple ? "TupleExpression" : "ArrayExpression");
  }
  parseArrowExpression(node, params, isAsync, trailingCommaLoc) {
    this.scope.enter(2 | 4);
    let flags = functionFlags(isAsync, false);
    if (!this.match(5) && this.prodParam.hasIn) {
      flags |= 8;
    }
    this.prodParam.enter(flags);
    this.initFunction(node, isAsync);
    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
    if (params) {
      this.state.maybeInArrowParameters = true;
      this.setArrowFunctionParameters(node, params, trailingCommaLoc);
    }
    this.state.maybeInArrowParameters = false;
    this.parseFunctionBody(node, true);
    this.prodParam.exit();
    this.scope.exit();
    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
    return this.finishNode(node, "ArrowFunctionExpression");
  }
  setArrowFunctionParameters(node, params, trailingCommaLoc) {
    this.toAssignableList(params, trailingCommaLoc, false);
    node.params = params;
  }
  parseFunctionBodyAndFinish(node, type, isMethod = false) {
    this.parseFunctionBody(node, false, isMethod);
    return this.finishNode(node, type);
  }
  parseFunctionBody(node, allowExpression, isMethod = false) {
    const isExpression = allowExpression && !this.match(5);
    this.expressionScope.enter(newExpressionScope());
    if (isExpression) {
      node.body = this.parseMaybeAssign();
      this.checkParams(node, false, allowExpression, false);
    } else {
      const oldStrict = this.state.strict;
      const oldLabels = this.state.labels;
      this.state.labels = [];
      this.prodParam.enter(this.prodParam.currentFlags() | 4);
      node.body = this.parseBlock(true, false, hasStrictModeDirective => {
        const nonSimple = !this.isSimpleParamList(node.params);
        if (hasStrictModeDirective && nonSimple) {
          this.raise(Errors.IllegalLanguageModeDirective, (node.kind === "method" || node.kind === "constructor") && !!node.key ? node.key.loc.end : node);
        }
        const strictModeChanged = !oldStrict && this.state.strict;
        this.checkParams(node, !this.state.strict && !allowExpression && !isMethod && !nonSimple, allowExpression, strictModeChanged);
        if (this.state.strict && node.id) {
          this.checkIdentifier(node.id, 65, strictModeChanged);
        }
      });
      this.prodParam.exit();
      this.state.labels = oldLabels;
    }
    this.expressionScope.exit();
  }
  isSimpleParameter(node) {
    return node.type === "Identifier";
  }
  isSimpleParamList(params) {
    for (let i = 0, len = params.length; i < len; i++) {
      if (!this.isSimpleParameter(params[i])) return false;
    }
    return true;
  }
  checkParams(node, allowDuplicates, isArrowFunction, strictModeChanged = true) {
    const checkClashes = !allowDuplicates && new Set();
    const formalParameters = {
      type: "FormalParameters"
    };
    for (const param of node.params) {
      this.checkLVal(param, {
        in: formalParameters,
        binding: 5,
        checkClashes,
        strictModeChanged
      });
    }
  }
  parseExprList(close, allowEmpty, refExpressionErrors, nodeForExtra) {
    const elts = [];
    let first = true;
    while (!this.eat(close)) {
      if (first) {
        first = false;
      } else {
        this.expect(12);
        if (this.match(close)) {
          if (nodeForExtra) {
            this.addTrailingCommaExtraToNode(nodeForExtra);
          }
          this.next();
          break;
        }
      }
      elts.push(this.parseExprListItem(allowEmpty, refExpressionErrors));
    }
    return elts;
  }
  parseExprListItem(allowEmpty, refExpressionErrors, allowPlaceholder) {
    let elt;
    if (this.match(12)) {
      if (!allowEmpty) {
        this.raise(Errors.UnexpectedToken, this.state.curPosition(), {
          unexpected: ","
        });
      }
      elt = null;
    } else if (this.match(21)) {
      const spreadNodeStartLoc = this.state.startLoc;
      elt = this.parseParenItem(this.parseSpread(refExpressionErrors), spreadNodeStartLoc);
    } else if (this.match(17)) {
      this.expectPlugin("partialApplication");
      if (!allowPlaceholder) {
        this.raise(Errors.UnexpectedArgumentPlaceholder, this.state.startLoc);
      }
      const node = this.startNode();
      this.next();
      elt = this.finishNode(node, "ArgumentPlaceholder");
    } else {
      elt = this.parseMaybeAssignAllowIn(refExpressionErrors, this.parseParenItem);
    }
    return elt;
  }
  parseIdentifier(liberal) {
    const node = this.startNode();
    const name = this.parseIdentifierName(liberal);
    return this.createIdentifier(node, name);
  }
  createIdentifier(node, name) {
    node.name = name;
    node.loc.identifierName = name;
    return this.finishNode(node, "Identifier");
  }
  parseIdentifierName(liberal) {
    let name;
    const {
      startLoc,
      type
    } = this.state;
    if (tokenIsKeywordOrIdentifier(type)) {
      name = this.state.value;
    } else {
      this.unexpected();
    }
    const tokenIsKeyword = tokenKeywordOrIdentifierIsKeyword(type);
    if (liberal) {
      if (tokenIsKeyword) {
        this.replaceToken(132);
      }
    } else {
      this.checkReservedWord(name, startLoc, tokenIsKeyword, false);
    }
    this.next();
    return name;
  }
  checkReservedWord(word, startLoc, checkKeywords, isBinding) {
    if (word.length > 10) {
      return;
    }
    if (!canBeReservedWord(word)) {
      return;
    }
    if (checkKeywords && isKeyword(word)) {
      this.raise(Errors.UnexpectedKeyword, startLoc, {
        keyword: word
      });
      return;
    }
    const reservedTest = !this.state.strict ? isReservedWord : isBinding ? isStrictBindReservedWord : isStrictReservedWord;
    if (reservedTest(word, this.inModule)) {
      this.raise(Errors.UnexpectedReservedWord, startLoc, {
        reservedWord: word
      });
      return;
    } else if (word === "yield") {
      if (this.prodParam.hasYield) {
        this.raise(Errors.YieldBindingIdentifier, startLoc);
        return;
      }
    } else if (word === "await") {
      if (this.prodParam.hasAwait) {
        this.raise(Errors.AwaitBindingIdentifier, startLoc);
        return;
      }
      if (this.scope.inStaticBlock) {
        this.raise(Errors.AwaitBindingIdentifierInStaticBlock, startLoc);
        return;
      }
      this.expressionScope.recordAsyncArrowParametersError(startLoc);
    } else if (word === "arguments") {
      if (this.scope.inClassAndNotInNonArrowFunction) {
        this.raise(Errors.ArgumentsInClass, startLoc);
        return;
      }
    }
  }
  isAwaitAllowed() {
    if (this.prodParam.hasAwait) return true;
    if (this.options.allowAwaitOutsideFunction && !this.scope.inFunction) {
      return true;
    }
    return false;
  }
  parseAwait(startLoc) {
    const node = this.startNodeAt(startLoc);
    this.expressionScope.recordParameterInitializerError(Errors.AwaitExpressionFormalParameter, node);
    if (this.eat(55)) {
      this.raise(Errors.ObsoleteAwaitStar, node);
    }
    if (!this.scope.inFunction && !this.options.allowAwaitOutsideFunction) {
      if (this.isAmbiguousAwait()) {
        this.ambiguousScriptDifferentAst = true;
      } else {
        this.sawUnambiguousESM = true;
      }
    }
    if (!this.state.soloAwait) {
      node.argument = this.parseMaybeUnary(null, true);
    }
    return this.finishNode(node, "AwaitExpression");
  }
  isAmbiguousAwait() {
    if (this.hasPrecedingLineBreak()) return true;
    const {
      type
    } = this.state;
    return type === 53 || type === 10 || type === 0 || tokenIsTemplate(type) || type === 102 && !this.state.containsEsc || type === 137 || type === 56 || this.hasPlugin("v8intrinsic") && type === 54;
  }
  parseYield() {
    const node = this.startNode();
    this.expressionScope.recordParameterInitializerError(Errors.YieldInParameter, node);
    this.next();
    let delegating = false;
    let argument = null;
    if (!this.hasPrecedingLineBreak()) {
      delegating = this.eat(55);
      switch (this.state.type) {
        case 13:
        case 139:
        case 8:
        case 11:
        case 3:
        case 9:
        case 14:
        case 12:
          if (!delegating) break;
        default:
          argument = this.parseMaybeAssign();
      }
    }
    node.delegate = delegating;
    node.argument = argument;
    return this.finishNode(node, "YieldExpression");
  }
  parseImportCall(node) {
    this.next();
    node.source = this.parseMaybeAssignAllowIn();
    if (this.hasPlugin("importAttributes") || this.hasPlugin("importAssertions")) {
      node.options = null;
    }
    if (this.eat(12)) {
      this.expectImportAttributesPlugin();
      if (!this.match(11)) {
        node.options = this.parseMaybeAssignAllowIn();
        this.eat(12);
      }
    }
    this.expect(11);
    return this.finishNode(node, "ImportExpression");
  }
  checkPipelineAtInfixOperator(left, leftStartLoc) {
    if (this.hasPlugin(["pipelineOperator", {
      proposal: "smart"
    }])) {
      if (left.type === "SequenceExpression") {
        this.raise(Errors.PipelineHeadSequenceExpression, leftStartLoc);
      }
    }
  }
  parseSmartPipelineBodyInStyle(childExpr, startLoc) {
    if (this.isSimpleReference(childExpr)) {
      const bodyNode = this.startNodeAt(startLoc);
      bodyNode.callee = childExpr;
      return this.finishNode(bodyNode, "PipelineBareFunction");
    } else {
      const bodyNode = this.startNodeAt(startLoc);
      this.checkSmartPipeTopicBodyEarlyErrors(startLoc);
      bodyNode.expression = childExpr;
      return this.finishNode(bodyNode, "PipelineTopicExpression");
    }
  }
  isSimpleReference(expression) {
    switch (expression.type) {
      case "MemberExpression":
        return !expression.computed && this.isSimpleReference(expression.object);
      case "Identifier":
        return true;
      default:
        return false;
    }
  }
  checkSmartPipeTopicBodyEarlyErrors(startLoc) {
    if (this.match(19)) {
      throw this.raise(Errors.PipelineBodyNoArrow, this.state.startLoc);
    }
    if (!this.topicReferenceWasUsedInCurrentContext()) {
      this.raise(Errors.PipelineTopicUnused, startLoc);
    }
  }
  withTopicBindingContext(callback) {
    const outerContextTopicState = this.state.topicContext;
    this.state.topicContext = {
      maxNumOfResolvableTopics: 1,
      maxTopicIndex: null
    };
    try {
      return callback();
    } finally {
      this.state.topicContext = outerContextTopicState;
    }
  }
  withSmartMixTopicForbiddingContext(callback) {
    if (this.hasPlugin(["pipelineOperator", {
      proposal: "smart"
    }])) {
      const outerContextTopicState = this.state.topicContext;
      this.state.topicContext = {
        maxNumOfResolvableTopics: 0,
        maxTopicIndex: null
      };
      try {
        return callback();
      } finally {
        this.state.topicContext = outerContextTopicState;
      }
    } else {
      return callback();
    }
  }
  withSoloAwaitPermittingContext(callback) {
    const outerContextSoloAwaitState = this.state.soloAwait;
    this.state.soloAwait = true;
    try {
      return callback();
    } finally {
      this.state.soloAwait = outerContextSoloAwaitState;
    }
  }
  allowInAnd(callback) {
    const flags = this.prodParam.currentFlags();
    const prodParamToSet = 8 & ~flags;
    if (prodParamToSet) {
      this.prodParam.enter(flags | 8);
      try {
        return callback();
      } finally {
        this.prodParam.exit();
      }
    }
    return callback();
  }
  disallowInAnd(callback) {
    const flags = this.prodParam.currentFlags();
    const prodParamToClear = 8 & flags;
    if (prodParamToClear) {
      this.prodParam.enter(flags & ~8);
      try {
        return callback();
      } finally {
        this.prodParam.exit();
      }
    }
    return callback();
  }
  registerTopicReference() {
    this.state.topicContext.maxTopicIndex = 0;
  }
  topicReferenceIsAllowedInCurrentContext() {
    return this.state.topicContext.maxNumOfResolvableTopics >= 1;
  }
  topicReferenceWasUsedInCurrentContext() {
    return this.state.topicContext.maxTopicIndex != null && this.state.topicContext.maxTopicIndex >= 0;
  }
  parseFSharpPipelineBody(prec) {
    const startLoc = this.state.startLoc;
    this.state.potentialArrowAt = this.state.start;
    const oldInFSharpPipelineDirectBody = this.state.inFSharpPipelineDirectBody;
    this.state.inFSharpPipelineDirectBody = true;
    const ret = this.parseExprOp(this.parseMaybeUnaryOrPrivate(), startLoc, prec);
    this.state.inFSharpPipelineDirectBody = oldInFSharpPipelineDirectBody;
    return ret;
  }
  parseModuleExpression() {
    this.expectPlugin("moduleBlocks");
    const node = this.startNode();
    this.next();
    if (!this.match(5)) {
      this.unexpected(null, 5);
    }
    const program = this.startNodeAt(this.state.endLoc);
    this.next();
    const revertScopes = this.initializeScopes(true);
    this.enterInitialScopes();
    try {
      node.body = this.parseProgram(program, 8, "module");
    } finally {
      revertScopes();
    }
    return this.finishNode(node, "ModuleExpression");
  }
  parsePropertyNamePrefixOperator(prop) {}
}
const loopLabel = {
    kind: 1
  },
  switchLabel = {
    kind: 2
  };
const loneSurrogate = /[\uD800-\uDFFF]/u;
const keywordRelationalOperator = /in(?:stanceof)?/y;
function babel7CompatTokens(tokens, input) {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    const {
      type
    } = token;
    if (typeof type === "number") {
      {
        if (type === 138) {
          const {
            loc,
            start,
            value,
            end
          } = token;
          const hashEndPos = start + 1;
          const hashEndLoc = createPositionWithColumnOffset(loc.start, 1);
          tokens.splice(i, 1, new Token({
            type: getExportedToken(27),
            value: "#",
            start: start,
            end: hashEndPos,
            startLoc: loc.start,
            endLoc: hashEndLoc
          }), new Token({
            type: getExportedToken(132),
            value: value,
            start: hashEndPos,
            end: end,
            startLoc: hashEndLoc,
            endLoc: loc.end
          }));
          i++;
          continue;
        }
        if (tokenIsTemplate(type)) {
          const {
            loc,
            start,
            value,
            end
          } = token;
          const backquoteEnd = start + 1;
          const backquoteEndLoc = createPositionWithColumnOffset(loc.start, 1);
          let startToken;
          if (input.charCodeAt(start) === 96) {
            startToken = new Token({
              type: getExportedToken(22),
              value: "`",
              start: start,
              end: backquoteEnd,
              startLoc: loc.start,
              endLoc: backquoteEndLoc
            });
          } else {
            startToken = new Token({
              type: getExportedToken(8),
              value: "}",
              start: start,
              end: backquoteEnd,
              startLoc: loc.start,
              endLoc: backquoteEndLoc
            });
          }
          let templateValue, templateElementEnd, templateElementEndLoc, endToken;
          if (type === 24) {
            templateElementEnd = end - 1;
            templateElementEndLoc = createPositionWithColumnOffset(loc.end, -1);
            templateValue = value === null ? null : value.slice(1, -1);
            endToken = new Token({
              type: getExportedToken(22),
              value: "`",
              start: templateElementEnd,
              end: end,
              startLoc: templateElementEndLoc,
              endLoc: loc.end
            });
          } else {
            templateElementEnd = end - 2;
            templateElementEndLoc = createPositionWithColumnOffset(loc.end, -2);
            templateValue = value === null ? null : value.slice(1, -2);
            endToken = new Token({
              type: getExportedToken(23),
              value: "${",
              start: templateElementEnd,
              end: end,
              startLoc: templateElementEndLoc,
              endLoc: loc.end
            });
          }
          tokens.splice(i, 1, startToken, new Token({
            type: getExportedToken(20),
            value: templateValue,
            start: backquoteEnd,
            end: templateElementEnd,
            startLoc: backquoteEndLoc,
            endLoc: templateElementEndLoc
          }), endToken);
          i += 2;
          continue;
        }
      }
      token.type = getExportedToken(type);
    }
  }
  return tokens;
}
class StatementParser extends ExpressionParser {
  parseTopLevel(file, program) {
    file.program = this.parseProgram(program);
    file.comments = this.comments;
    if (this.options.tokens) {
      file.tokens = babel7CompatTokens(this.tokens, this.input);
    }
    return this.finishNode(file, "File");
  }
  parseProgram(program, end = 139, sourceType = this.options.sourceType) {
    program.sourceType = sourceType;
    program.interpreter = this.parseInterpreterDirective();
    this.parseBlockBody(program, true, true, end);
    if (this.inModule && !this.options.allowUndeclaredExports && this.scope.undefinedExports.size > 0) {
      for (const [localName, at] of Array.from(this.scope.undefinedExports)) {
        this.raise(Errors.ModuleExportUndefined, at, {
          localName
        });
      }
    }
    let finishedProgram;
    if (end === 139) {
      finishedProgram = this.finishNode(program, "Program");
    } else {
      finishedProgram = this.finishNodeAt(program, "Program", createPositionWithColumnOffset(this.state.startLoc, -1));
    }
    return finishedProgram;
  }
  stmtToDirective(stmt) {
    const directive = stmt;
    directive.type = "Directive";
    directive.value = directive.expression;
    delete directive.expression;
    const directiveLiteral = directive.value;
    const expressionValue = directiveLiteral.value;
    const raw = this.input.slice(directiveLiteral.start, directiveLiteral.end);
    const val = directiveLiteral.value = raw.slice(1, -1);
    this.addExtra(directiveLiteral, "raw", raw);
    this.addExtra(directiveLiteral, "rawValue", val);
    this.addExtra(directiveLiteral, "expressionValue", expressionValue);
    directiveLiteral.type = "DirectiveLiteral";
    return directive;
  }
  parseInterpreterDirective() {
    if (!this.match(28)) {
      return null;
    }
    const node = this.startNode();
    node.value = this.state.value;
    this.next();
    return this.finishNode(node, "InterpreterDirective");
  }
  isLet() {
    if (!this.isContextual(100)) {
      return false;
    }
    return this.hasFollowingBindingAtom();
  }
  chStartsBindingIdentifier(ch, pos) {
    if (isIdentifierStart(ch)) {
      keywordRelationalOperator.lastIndex = pos;
      if (keywordRelationalOperator.test(this.input)) {
        const endCh = this.codePointAtPos(keywordRelationalOperator.lastIndex);
        if (!isIdentifierChar(endCh) && endCh !== 92) {
          return false;
        }
      }
      return true;
    } else if (ch === 92) {
      return true;
    } else {
      return false;
    }
  }
  chStartsBindingPattern(ch) {
    return ch === 91 || ch === 123;
  }
  hasFollowingBindingAtom() {
    const next = this.nextTokenStart();
    const nextCh = this.codePointAtPos(next);
    return this.chStartsBindingPattern(nextCh) || this.chStartsBindingIdentifier(nextCh, next);
  }
  hasInLineFollowingBindingIdentifier() {
    const next = this.nextTokenInLineStart();
    const nextCh = this.codePointAtPos(next);
    return this.chStartsBindingIdentifier(nextCh, next);
  }
  startsUsingForOf() {
    const {
      type,
      containsEsc
    } = this.lookahead();
    if (type === 102 && !containsEsc) {
      return false;
    } else if (tokenIsIdentifier(type) && !this.hasFollowingLineBreak()) {
      this.expectPlugin("explicitResourceManagement");
      return true;
    }
  }
  startsAwaitUsing() {
    let next = this.nextTokenInLineStart();
    if (this.isUnparsedContextual(next, "using")) {
      next = this.nextTokenInLineStartSince(next + 5);
      const nextCh = this.codePointAtPos(next);
      if (this.chStartsBindingIdentifier(nextCh, next)) {
        this.expectPlugin("explicitResourceManagement");
        return true;
      }
    }
    return false;
  }
  parseModuleItem() {
    return this.parseStatementLike(1 | 2 | 4 | 8);
  }
  parseStatementListItem() {
    return this.parseStatementLike(2 | 4 | (!this.options.annexB || this.state.strict ? 0 : 8));
  }
  parseStatementOrSloppyAnnexBFunctionDeclaration(allowLabeledFunction = false) {
    let flags = 0;
    if (this.options.annexB && !this.state.strict) {
      flags |= 4;
      if (allowLabeledFunction) {
        flags |= 8;
      }
    }
    return this.parseStatementLike(flags);
  }
  parseStatement() {
    return this.parseStatementLike(0);
  }
  parseStatementLike(flags) {
    let decorators = null;
    if (this.match(26)) {
      decorators = this.parseDecorators(true);
    }
    return this.parseStatementContent(flags, decorators);
  }
  parseStatementContent(flags, decorators) {
    const starttype = this.state.type;
    const node = this.startNode();
    const allowDeclaration = !!(flags & 2);
    const allowFunctionDeclaration = !!(flags & 4);
    const topLevel = flags & 1;
    switch (starttype) {
      case 60:
        return this.parseBreakContinueStatement(node, true);
      case 63:
        return this.parseBreakContinueStatement(node, false);
      case 64:
        return this.parseDebuggerStatement(node);
      case 90:
        return this.parseDoWhileStatement(node);
      case 91:
        return this.parseForStatement(node);
      case 68:
        if (this.lookaheadCharCode() === 46) break;
        if (!allowFunctionDeclaration) {
          this.raise(this.state.strict ? Errors.StrictFunction : this.options.annexB ? Errors.SloppyFunctionAnnexB : Errors.SloppyFunction, this.state.startLoc);
        }
        return this.parseFunctionStatement(node, false, !allowDeclaration && allowFunctionDeclaration);
      case 80:
        if (!allowDeclaration) this.unexpected();
        return this.parseClass(this.maybeTakeDecorators(decorators, node), true);
      case 69:
        return this.parseIfStatement(node);
      case 70:
        return this.parseReturnStatement(node);
      case 71:
        return this.parseSwitchStatement(node);
      case 72:
        return this.parseThrowStatement(node);
      case 73:
        return this.parseTryStatement(node);
      case 96:
        if (!this.state.containsEsc && this.startsAwaitUsing()) {
          if (!this.isAwaitAllowed()) {
            this.raise(Errors.AwaitUsingNotInAsyncContext, node);
          } else if (!allowDeclaration) {
            this.raise(Errors.UnexpectedLexicalDeclaration, node);
          }
          this.next();
          return this.parseVarStatement(node, "await using");
        }
        break;
      case 107:
        if (this.state.containsEsc || !this.hasInLineFollowingBindingIdentifier()) {
          break;
        }
        this.expectPlugin("explicitResourceManagement");
        if (!this.scope.inModule && this.scope.inTopLevel) {
          this.raise(Errors.UnexpectedUsingDeclaration, this.state.startLoc);
        } else if (!allowDeclaration) {
          this.raise(Errors.UnexpectedLexicalDeclaration, this.state.startLoc);
        }
        return this.parseVarStatement(node, "using");
      case 100:
        {
          if (this.state.containsEsc) {
            break;
          }
          const next = this.nextTokenStart();
          const nextCh = this.codePointAtPos(next);
          if (nextCh !== 91) {
            if (!allowDeclaration && this.hasFollowingLineBreak()) break;
            if (!this.chStartsBindingIdentifier(nextCh, next) && nextCh !== 123) {
              break;
            }
          }
        }
      case 75:
        {
          if (!allowDeclaration) {
            this.raise(Errors.UnexpectedLexicalDeclaration, this.state.startLoc);
          }
        }
      case 74:
        {
          const kind = this.state.value;
          return this.parseVarStatement(node, kind);
        }
      case 92:
        return this.parseWhileStatement(node);
      case 76:
        return this.parseWithStatement(node);
      case 5:
        return this.parseBlock();
      case 13:
        return this.parseEmptyStatement(node);
      case 83:
        {
          const nextTokenCharCode = this.lookaheadCharCode();
          if (nextTokenCharCode === 40 || nextTokenCharCode === 46) {
            break;
          }
        }
      case 82:
        {
          if (!this.options.allowImportExportEverywhere && !topLevel) {
            this.raise(Errors.UnexpectedImportExport, this.state.startLoc);
          }
          this.next();
          let result;
          if (starttype === 83) {
            result = this.parseImport(node);
            if (result.type === "ImportDeclaration" && (!result.importKind || result.importKind === "value")) {
              this.sawUnambiguousESM = true;
            }
          } else {
            result = this.parseExport(node, decorators);
            if (result.type === "ExportNamedDeclaration" && (!result.exportKind || result.exportKind === "value") || result.type === "ExportAllDeclaration" && (!result.exportKind || result.exportKind === "value") || result.type === "ExportDefaultDeclaration") {
              this.sawUnambiguousESM = true;
            }
          }
          this.assertModuleNodeAllowed(result);
          return result;
        }
      default:
        {
          if (this.isAsyncFunction()) {
            if (!allowDeclaration) {
              this.raise(Errors.AsyncFunctionInSingleStatementContext, this.state.startLoc);
            }
            this.next();
            return this.parseFunctionStatement(node, true, !allowDeclaration && allowFunctionDeclaration);
          }
        }
    }
    const maybeName = this.state.value;
    const expr = this.parseExpression();
    if (tokenIsIdentifier(starttype) && expr.type === "Identifier" && this.eat(14)) {
      return this.parseLabeledStatement(node, maybeName, expr, flags);
    } else {
      return this.parseExpressionStatement(node, expr, decorators);
    }
  }
  assertModuleNodeAllowed(node) {
    if (!this.options.allowImportExportEverywhere && !this.inModule) {
      this.raise(Errors.ImportOutsideModule, node);
    }
  }
  decoratorsEnabledBeforeExport() {
    if (this.hasPlugin("decorators-legacy")) return true;
    return this.hasPlugin("decorators") && this.getPluginOption("decorators", "decoratorsBeforeExport") !== false;
  }
  maybeTakeDecorators(maybeDecorators, classNode, exportNode) {
    if (maybeDecorators) {
      if (classNode.decorators && classNode.decorators.length > 0) {
        if (typeof this.getPluginOption("decorators", "decoratorsBeforeExport") !== "boolean") {
          this.raise(Errors.DecoratorsBeforeAfterExport, classNode.decorators[0]);
        }
        classNode.decorators.unshift(...maybeDecorators);
      } else {
        classNode.decorators = maybeDecorators;
      }
      this.resetStartLocationFromNode(classNode, maybeDecorators[0]);
      if (exportNode) this.resetStartLocationFromNode(exportNode, classNode);
    }
    return classNode;
  }
  canHaveLeadingDecorator() {
    return this.match(80);
  }
  parseDecorators(allowExport) {
    const decorators = [];
    do {
      decorators.push(this.parseDecorator());
    } while (this.match(26));
    if (this.match(82)) {
      if (!allowExport) {
        this.unexpected();
      }
      if (!this.decoratorsEnabledBeforeExport()) {
        this.raise(Errors.DecoratorExportClass, this.state.startLoc);
      }
    } else if (!this.canHaveLeadingDecorator()) {
      throw this.raise(Errors.UnexpectedLeadingDecorator, this.state.startLoc);
    }
    return decorators;
  }
  parseDecorator() {
    this.expectOnePlugin(["decorators", "decorators-legacy"]);
    const node = this.startNode();
    this.next();
    if (this.hasPlugin("decorators")) {
      const startLoc = this.state.startLoc;
      let expr;
      if (this.match(10)) {
        const startLoc = this.state.startLoc;
        this.next();
        expr = this.parseExpression();
        this.expect(11);
        expr = this.wrapParenthesis(startLoc, expr);
        const paramsStartLoc = this.state.startLoc;
        node.expression = this.parseMaybeDecoratorArguments(expr);
        if (this.getPluginOption("decorators", "allowCallParenthesized") === false && node.expression !== expr) {
          this.raise(Errors.DecoratorArgumentsOutsideParentheses, paramsStartLoc);
        }
      } else {
        expr = this.parseIdentifier(false);
        while (this.eat(16)) {
          const node = this.startNodeAt(startLoc);
          node.object = expr;
          if (this.match(138)) {
            this.classScope.usePrivateName(this.state.value, this.state.startLoc);
            node.property = this.parsePrivateName();
          } else {
            node.property = this.parseIdentifier(true);
          }
          node.computed = false;
          expr = this.finishNode(node, "MemberExpression");
        }
        node.expression = this.parseMaybeDecoratorArguments(expr);
      }
    } else {
      node.expression = this.parseExprSubscripts();
    }
    return this.finishNode(node, "Decorator");
  }
  parseMaybeDecoratorArguments(expr) {
    if (this.eat(10)) {
      const node = this.startNodeAtNode(expr);
      node.callee = expr;
      node.arguments = this.parseCallExpressionArguments(11, false);
      this.toReferencedList(node.arguments);
      return this.finishNode(node, "CallExpression");
    }
    return expr;
  }
  parseBreakContinueStatement(node, isBreak) {
    this.next();
    if (this.isLineTerminator()) {
      node.label = null;
    } else {
      node.label = this.parseIdentifier();
      this.semicolon();
    }
    this.verifyBreakContinue(node, isBreak);
    return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
  }
  verifyBreakContinue(node, isBreak) {
    let i;
    for (i = 0; i < this.state.labels.length; ++i) {
      const lab = this.state.labels[i];
      if (node.label == null || lab.name === node.label.name) {
        if (lab.kind != null && (isBreak || lab.kind === 1)) {
          break;
        }
        if (node.label && isBreak) break;
      }
    }
    if (i === this.state.labels.length) {
      const type = isBreak ? "BreakStatement" : "ContinueStatement";
      this.raise(Errors.IllegalBreakContinue, node, {
        type
      });
    }
  }
  parseDebuggerStatement(node) {
    this.next();
    this.semicolon();
    return this.finishNode(node, "DebuggerStatement");
  }
  parseHeaderExpression() {
    this.expect(10);
    const val = this.parseExpression();
    this.expect(11);
    return val;
  }
  parseDoWhileStatement(node) {
    this.next();
    this.state.labels.push(loopLabel);
    node.body = this.withSmartMixTopicForbiddingContext(() => this.parseStatement());
    this.state.labels.pop();
    this.expect(92);
    node.test = this.parseHeaderExpression();
    this.eat(13);
    return this.finishNode(node, "DoWhileStatement");
  }
  parseForStatement(node) {
    this.next();
    this.state.labels.push(loopLabel);
    let awaitAt = null;
    if (this.isAwaitAllowed() && this.eatContextual(96)) {
      awaitAt = this.state.lastTokStartLoc;
    }
    this.scope.enter(0);
    this.expect(10);
    if (this.match(13)) {
      if (awaitAt !== null) {
        this.unexpected(awaitAt);
      }
      return this.parseFor(node, null);
    }
    const startsWithLet = this.isContextual(100);
    {
      const startsWithAwaitUsing = this.isContextual(96) && this.startsAwaitUsing();
      const starsWithUsingDeclaration = startsWithAwaitUsing || this.isContextual(107) && this.startsUsingForOf();
      const isLetOrUsing = startsWithLet && this.hasFollowingBindingAtom() || starsWithUsingDeclaration;
      if (this.match(74) || this.match(75) || isLetOrUsing) {
        const initNode = this.startNode();
        let kind;
        if (startsWithAwaitUsing) {
          kind = "await using";
          if (!this.isAwaitAllowed()) {
            this.raise(Errors.AwaitUsingNotInAsyncContext, this.state.startLoc);
          }
          this.next();
        } else {
          kind = this.state.value;
        }
        this.next();
        this.parseVar(initNode, true, kind);
        const init = this.finishNode(initNode, "VariableDeclaration");
        const isForIn = this.match(58);
        if (isForIn && starsWithUsingDeclaration) {
          this.raise(Errors.ForInUsing, init);
        }
        if ((isForIn || this.isContextual(102)) && init.declarations.length === 1) {
          return this.parseForIn(node, init, awaitAt);
        }
        if (awaitAt !== null) {
          this.unexpected(awaitAt);
        }
        return this.parseFor(node, init);
      }
    }
    const startsWithAsync = this.isContextual(95);
    const refExpressionErrors = new ExpressionErrors();
    const init = this.parseExpression(true, refExpressionErrors);
    const isForOf = this.isContextual(102);
    if (isForOf) {
      if (startsWithLet) {
        this.raise(Errors.ForOfLet, init);
      }
      if (awaitAt === null && startsWithAsync && init.type === "Identifier") {
        this.raise(Errors.ForOfAsync, init);
      }
    }
    if (isForOf || this.match(58)) {
      this.checkDestructuringPrivate(refExpressionErrors);
      this.toAssignable(init, true);
      const type = isForOf ? "ForOfStatement" : "ForInStatement";
      this.checkLVal(init, {
        in: {
          type
        }
      });
      return this.parseForIn(node, init, awaitAt);
    } else {
      this.checkExpressionErrors(refExpressionErrors, true);
    }
    if (awaitAt !== null) {
      this.unexpected(awaitAt);
    }
    return this.parseFor(node, init);
  }
  parseFunctionStatement(node, isAsync, isHangingDeclaration) {
    this.next();
    return this.parseFunction(node, 1 | (isHangingDeclaration ? 2 : 0) | (isAsync ? 8 : 0));
  }
  parseIfStatement(node) {
    this.next();
    node.test = this.parseHeaderExpression();
    node.consequent = this.parseStatementOrSloppyAnnexBFunctionDeclaration();
    node.alternate = this.eat(66) ? this.parseStatementOrSloppyAnnexBFunctionDeclaration() : null;
    return this.finishNode(node, "IfStatement");
  }
  parseReturnStatement(node) {
    if (!this.prodParam.hasReturn && !this.options.allowReturnOutsideFunction) {
      this.raise(Errors.IllegalReturn, this.state.startLoc);
    }
    this.next();
    if (this.isLineTerminator()) {
      node.argument = null;
    } else {
      node.argument = this.parseExpression();
      this.semicolon();
    }
    return this.finishNode(node, "ReturnStatement");
  }
  parseSwitchStatement(node) {
    this.next();
    node.discriminant = this.parseHeaderExpression();
    const cases = node.cases = [];
    this.expect(5);
    this.state.labels.push(switchLabel);
    this.scope.enter(0);
    let cur;
    for (let sawDefault; !this.match(8);) {
      if (this.match(61) || this.match(65)) {
        const isCase = this.match(61);
        if (cur) this.finishNode(cur, "SwitchCase");
        cases.push(cur = this.startNode());
        cur.consequent = [];
        this.next();
        if (isCase) {
          cur.test = this.parseExpression();
        } else {
          if (sawDefault) {
            this.raise(Errors.MultipleDefaultsInSwitch, this.state.lastTokStartLoc);
          }
          sawDefault = true;
          cur.test = null;
        }
        this.expect(14);
      } else {
        if (cur) {
          cur.consequent.push(this.parseStatementListItem());
        } else {
          this.unexpected();
        }
      }
    }
    this.scope.exit();
    if (cur) this.finishNode(cur, "SwitchCase");
    this.next();
    this.state.labels.pop();
    return this.finishNode(node, "SwitchStatement");
  }
  parseThrowStatement(node) {
    this.next();
    if (this.hasPrecedingLineBreak()) {
      this.raise(Errors.NewlineAfterThrow, this.state.lastTokEndLoc);
    }
    node.argument = this.parseExpression();
    this.semicolon();
    return this.finishNode(node, "ThrowStatement");
  }
  parseCatchClauseParam() {
    const param = this.parseBindingAtom();
    this.scope.enter(this.options.annexB && param.type === "Identifier" ? 8 : 0);
    this.checkLVal(param, {
      in: {
        type: "CatchClause"
      },
      binding: 9
    });
    return param;
  }
  parseTryStatement(node) {
    this.next();
    node.block = this.parseBlock();
    node.handler = null;
    if (this.match(62)) {
      const clause = this.startNode();
      this.next();
      if (this.match(10)) {
        this.expect(10);
        clause.param = this.parseCatchClauseParam();
        this.expect(11);
      } else {
        clause.param = null;
        this.scope.enter(0);
      }
      clause.body = this.withSmartMixTopicForbiddingContext(() => this.parseBlock(false, false));
      this.scope.exit();
      node.handler = this.finishNode(clause, "CatchClause");
    }
    node.finalizer = this.eat(67) ? this.parseBlock() : null;
    if (!node.handler && !node.finalizer) {
      this.raise(Errors.NoCatchOrFinally, node);
    }
    return this.finishNode(node, "TryStatement");
  }
  parseVarStatement(node, kind, allowMissingInitializer = false) {
    this.next();
    this.parseVar(node, false, kind, allowMissingInitializer);
    this.semicolon();
    return this.finishNode(node, "VariableDeclaration");
  }
  parseWhileStatement(node) {
    this.next();
    node.test = this.parseHeaderExpression();
    this.state.labels.push(loopLabel);
    node.body = this.withSmartMixTopicForbiddingContext(() => this.parseStatement());
    this.state.labels.pop();
    return this.finishNode(node, "WhileStatement");
  }
  parseWithStatement(node) {
    if (this.state.strict) {
      this.raise(Errors.StrictWith, this.state.startLoc);
    }
    this.next();
    node.object = this.parseHeaderExpression();
    node.body = this.withSmartMixTopicForbiddingContext(() => this.parseStatement());
    return this.finishNode(node, "WithStatement");
  }
  parseEmptyStatement(node) {
    this.next();
    return this.finishNode(node, "EmptyStatement");
  }
  parseLabeledStatement(node, maybeName, expr, flags) {
    for (const label of this.state.labels) {
      if (label.name === maybeName) {
        this.raise(Errors.LabelRedeclaration, expr, {
          labelName: maybeName
        });
      }
    }
    const kind = tokenIsLoop(this.state.type) ? 1 : this.match(71) ? 2 : null;
    for (let i = this.state.labels.length - 1; i >= 0; i--) {
      const label = this.state.labels[i];
      if (label.statementStart === node.start) {
        label.statementStart = this.state.start;
        label.kind = kind;
      } else {
        break;
      }
    }
    this.state.labels.push({
      name: maybeName,
      kind: kind,
      statementStart: this.state.start
    });
    node.body = flags & 8 ? this.parseStatementOrSloppyAnnexBFunctionDeclaration(true) : this.parseStatement();
    this.state.labels.pop();
    node.label = expr;
    return this.finishNode(node, "LabeledStatement");
  }
  parseExpressionStatement(node, expr, decorators) {
    node.expression = expr;
    this.semicolon();
    return this.finishNode(node, "ExpressionStatement");
  }
  parseBlock(allowDirectives = false, createNewLexicalScope = true, afterBlockParse) {
    const node = this.startNode();
    if (allowDirectives) {
      this.state.strictErrors.clear();
    }
    this.expect(5);
    if (createNewLexicalScope) {
      this.scope.enter(0);
    }
    this.parseBlockBody(node, allowDirectives, false, 8, afterBlockParse);
    if (createNewLexicalScope) {
      this.scope.exit();
    }
    return this.finishNode(node, "BlockStatement");
  }
  isValidDirective(stmt) {
    return stmt.type === "ExpressionStatement" && stmt.expression.type === "StringLiteral" && !stmt.expression.extra.parenthesized;
  }
  parseBlockBody(node, allowDirectives, topLevel, end, afterBlockParse) {
    const body = node.body = [];
    const directives = node.directives = [];
    this.parseBlockOrModuleBlockBody(body, allowDirectives ? directives : undefined, topLevel, end, afterBlockParse);
  }
  parseBlockOrModuleBlockBody(body, directives, topLevel, end, afterBlockParse) {
    const oldStrict = this.state.strict;
    let hasStrictModeDirective = false;
    let parsedNonDirective = false;
    while (!this.match(end)) {
      const stmt = topLevel ? this.parseModuleItem() : this.parseStatementListItem();
      if (directives && !parsedNonDirective) {
        if (this.isValidDirective(stmt)) {
          const directive = this.stmtToDirective(stmt);
          directives.push(directive);
          if (!hasStrictModeDirective && directive.value.value === "use strict") {
            hasStrictModeDirective = true;
            this.setStrict(true);
          }
          continue;
        }
        parsedNonDirective = true;
        this.state.strictErrors.clear();
      }
      body.push(stmt);
    }
    afterBlockParse == null || afterBlockParse.call(this, hasStrictModeDirective);
    if (!oldStrict) {
      this.setStrict(false);
    }
    this.next();
  }
  parseFor(node, init) {
    node.init = init;
    this.semicolon(false);
    node.test = this.match(13) ? null : this.parseExpression();
    this.semicolon(false);
    node.update = this.match(11) ? null : this.parseExpression();
    this.expect(11);
    node.body = this.withSmartMixTopicForbiddingContext(() => this.parseStatement());
    this.scope.exit();
    this.state.labels.pop();
    return this.finishNode(node, "ForStatement");
  }
  parseForIn(node, init, awaitAt) {
    const isForIn = this.match(58);
    this.next();
    if (isForIn) {
      if (awaitAt !== null) this.unexpected(awaitAt);
    } else {
      node.await = awaitAt !== null;
    }
    if (init.type === "VariableDeclaration" && init.declarations[0].init != null && (!isForIn || !this.options.annexB || this.state.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier")) {
      this.raise(Errors.ForInOfLoopInitializer, init, {
        type: isForIn ? "ForInStatement" : "ForOfStatement"
      });
    }
    if (init.type === "AssignmentPattern") {
      this.raise(Errors.InvalidLhs, init, {
        ancestor: {
          type: "ForStatement"
        }
      });
    }
    node.left = init;
    node.right = isForIn ? this.parseExpression() : this.parseMaybeAssignAllowIn();
    this.expect(11);
    node.body = this.withSmartMixTopicForbiddingContext(() => this.parseStatement());
    this.scope.exit();
    this.state.labels.pop();
    return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
  }
  parseVar(node, isFor, kind, allowMissingInitializer = false) {
    const declarations = node.declarations = [];
    node.kind = kind;
    for (;;) {
      const decl = this.startNode();
      this.parseVarId(decl, kind);
      decl.init = !this.eat(29) ? null : isFor ? this.parseMaybeAssignDisallowIn() : this.parseMaybeAssignAllowIn();
      if (decl.init === null && !allowMissingInitializer) {
        if (decl.id.type !== "Identifier" && !(isFor && (this.match(58) || this.isContextual(102)))) {
          this.raise(Errors.DeclarationMissingInitializer, this.state.lastTokEndLoc, {
            kind: "destructuring"
          });
        } else if (kind === "const" && !(this.match(58) || this.isContextual(102))) {
          this.raise(Errors.DeclarationMissingInitializer, this.state.lastTokEndLoc, {
            kind: "const"
          });
        }
      }
      declarations.push(this.finishNode(decl, "VariableDeclarator"));
      if (!this.eat(12)) break;
    }
    return node;
  }
  parseVarId(decl, kind) {
    const id = this.parseBindingAtom();
    this.checkLVal(id, {
      in: {
        type: "VariableDeclarator"
      },
      binding: kind === "var" ? 5 : 8201
    });
    decl.id = id;
  }
  parseAsyncFunctionExpression(node) {
    return this.parseFunction(node, 8);
  }
  parseFunction(node, flags = 0) {
    const hangingDeclaration = flags & 2;
    const isDeclaration = !!(flags & 1);
    const requireId = isDeclaration && !(flags & 4);
    const isAsync = !!(flags & 8);
    this.initFunction(node, isAsync);
    if (this.match(55)) {
      if (hangingDeclaration) {
        this.raise(Errors.GeneratorInSingleStatementContext, this.state.startLoc);
      }
      this.next();
      node.generator = true;
    }
    if (isDeclaration) {
      node.id = this.parseFunctionId(requireId);
    }
    const oldMaybeInArrowParameters = this.state.maybeInArrowParameters;
    this.state.maybeInArrowParameters = false;
    this.scope.enter(2);
    this.prodParam.enter(functionFlags(isAsync, node.generator));
    if (!isDeclaration) {
      node.id = this.parseFunctionId();
    }
    this.parseFunctionParams(node, false);
    this.withSmartMixTopicForbiddingContext(() => {
      this.parseFunctionBodyAndFinish(node, isDeclaration ? "FunctionDeclaration" : "FunctionExpression");
    });
    this.prodParam.exit();
    this.scope.exit();
    if (isDeclaration && !hangingDeclaration) {
      this.registerFunctionStatementId(node);
    }
    this.state.maybeInArrowParameters = oldMaybeInArrowParameters;
    return node;
  }
  parseFunctionId(requireId) {
    return requireId || tokenIsIdentifier(this.state.type) ? this.parseIdentifier() : null;
  }
  parseFunctionParams(node, isConstructor) {
    this.expect(10);
    this.expressionScope.enter(newParameterDeclarationScope());
    node.params = this.parseBindingList(11, 41, 2 | (isConstructor ? 4 : 0));
    this.expressionScope.exit();
  }
  registerFunctionStatementId(node) {
    if (!node.id) return;
    this.scope.declareName(node.id.name, !this.options.annexB || this.state.strict || node.generator || node.async ? this.scope.treatFunctionsAsVar ? 5 : 8201 : 17, node.id.loc.start);
  }
  parseClass(node, isStatement, optionalId) {
    this.next();
    const oldStrict = this.state.strict;
    this.state.strict = true;
    this.parseClassId(node, isStatement, optionalId);
    this.parseClassSuper(node);
    node.body = this.parseClassBody(!!node.superClass, oldStrict);
    return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
  }
  isClassProperty() {
    return this.match(29) || this.match(13) || this.match(8);
  }
  isClassMethod() {
    return this.match(10);
  }
  isNonstaticConstructor(method) {
    return !method.computed && !method.static && (method.key.name === "constructor" || method.key.value === "constructor");
  }
  parseClassBody(hadSuperClass, oldStrict) {
    this.classScope.enter();
    const state = {
      hadConstructor: false,
      hadSuperClass
    };
    let decorators = [];
    const classBody = this.startNode();
    classBody.body = [];
    this.expect(5);
    this.withSmartMixTopicForbiddingContext(() => {
      while (!this.match(8)) {
        if (this.eat(13)) {
          if (decorators.length > 0) {
            throw this.raise(Errors.DecoratorSemicolon, this.state.lastTokEndLoc);
          }
          continue;
        }
        if (this.match(26)) {
          decorators.push(this.parseDecorator());
          continue;
        }
        const member = this.startNode();
        if (decorators.length) {
          member.decorators = decorators;
          this.resetStartLocationFromNode(member, decorators[0]);
          decorators = [];
        }
        this.parseClassMember(classBody, member, state);
        if (member.kind === "constructor" && member.decorators && member.decorators.length > 0) {
          this.raise(Errors.DecoratorConstructor, member);
        }
      }
    });
    this.state.strict = oldStrict;
    this.next();
    if (decorators.length) {
      throw this.raise(Errors.TrailingDecorator, this.state.startLoc);
    }
    this.classScope.exit();
    return this.finishNode(classBody, "ClassBody");
  }
  parseClassMemberFromModifier(classBody, member) {
    const key = this.parseIdentifier(true);
    if (this.isClassMethod()) {
      const method = member;
      method.kind = "method";
      method.computed = false;
      method.key = key;
      method.static = false;
      this.pushClassMethod(classBody, method, false, false, false, false);
      return true;
    } else if (this.isClassProperty()) {
      const prop = member;
      prop.computed = false;
      prop.key = key;
      prop.static = false;
      classBody.body.push(this.parseClassProperty(prop));
      return true;
    }
    this.resetPreviousNodeTrailingComments(key);
    return false;
  }
  parseClassMember(classBody, member, state) {
    const isStatic = this.isContextual(106);
    if (isStatic) {
      if (this.parseClassMemberFromModifier(classBody, member)) {
        return;
      }
      if (this.eat(5)) {
        this.parseClassStaticBlock(classBody, member);
        return;
      }
    }
    this.parseClassMemberWithIsStatic(classBody, member, state, isStatic);
  }
  parseClassMemberWithIsStatic(classBody, member, state, isStatic) {
    const publicMethod = member;
    const privateMethod = member;
    const publicProp = member;
    const privateProp = member;
    const accessorProp = member;
    const method = publicMethod;
    const publicMember = publicMethod;
    member.static = isStatic;
    this.parsePropertyNamePrefixOperator(member);
    if (this.eat(55)) {
      method.kind = "method";
      const isPrivateName = this.match(138);
      this.parseClassElementName(method);
      if (isPrivateName) {
        this.pushClassPrivateMethod(classBody, privateMethod, true, false);
        return;
      }
      if (this.isNonstaticConstructor(publicMethod)) {
        this.raise(Errors.ConstructorIsGenerator, publicMethod.key);
      }
      this.pushClassMethod(classBody, publicMethod, true, false, false, false);
      return;
    }
    const isContextual = tokenIsIdentifier(this.state.type) && !this.state.containsEsc;
    const isPrivate = this.match(138);
    const key = this.parseClassElementName(member);
    const maybeQuestionTokenStartLoc = this.state.startLoc;
    this.parsePostMemberNameModifiers(publicMember);
    if (this.isClassMethod()) {
      method.kind = "method";
      if (isPrivate) {
        this.pushClassPrivateMethod(classBody, privateMethod, false, false);
        return;
      }
      const isConstructor = this.isNonstaticConstructor(publicMethod);
      let allowsDirectSuper = false;
      if (isConstructor) {
        publicMethod.kind = "constructor";
        if (state.hadConstructor && !this.hasPlugin("typescript")) {
          this.raise(Errors.DuplicateConstructor, key);
        }
        if (isConstructor && this.hasPlugin("typescript") && member.override) {
          this.raise(Errors.OverrideOnConstructor, key);
        }
        state.hadConstructor = true;
        allowsDirectSuper = state.hadSuperClass;
      }
      this.pushClassMethod(classBody, publicMethod, false, false, isConstructor, allowsDirectSuper);
    } else if (this.isClassProperty()) {
      if (isPrivate) {
        this.pushClassPrivateProperty(classBody, privateProp);
      } else {
        this.pushClassProperty(classBody, publicProp);
      }
    } else if (isContextual && key.name === "async" && !this.isLineTerminator()) {
      this.resetPreviousNodeTrailingComments(key);
      const isGenerator = this.eat(55);
      if (publicMember.optional) {
        this.unexpected(maybeQuestionTokenStartLoc);
      }
      method.kind = "method";
      const isPrivate = this.match(138);
      this.parseClassElementName(method);
      this.parsePostMemberNameModifiers(publicMember);
      if (isPrivate) {
        this.pushClassPrivateMethod(classBody, privateMethod, isGenerator, true);
      } else {
        if (this.isNonstaticConstructor(publicMethod)) {
          this.raise(Errors.ConstructorIsAsync, publicMethod.key);
        }
        this.pushClassMethod(classBody, publicMethod, isGenerator, true, false, false);
      }
    } else if (isContextual && (key.name === "get" || key.name === "set") && !(this.match(55) && this.isLineTerminator())) {
      this.resetPreviousNodeTrailingComments(key);
      method.kind = key.name;
      const isPrivate = this.match(138);
      this.parseClassElementName(publicMethod);
      if (isPrivate) {
        this.pushClassPrivateMethod(classBody, privateMethod, false, false);
      } else {
        if (this.isNonstaticConstructor(publicMethod)) {
          this.raise(Errors.ConstructorIsAccessor, publicMethod.key);
        }
        this.pushClassMethod(classBody, publicMethod, false, false, false, false);
      }
      this.checkGetterSetterParams(publicMethod);
    } else if (isContextual && key.name === "accessor" && !this.isLineTerminator()) {
      this.expectPlugin("decoratorAutoAccessors");
      this.resetPreviousNodeTrailingComments(key);
      const isPrivate = this.match(138);
      this.parseClassElementName(publicProp);
      this.pushClassAccessorProperty(classBody, accessorProp, isPrivate);
    } else if (this.isLineTerminator()) {
      if (isPrivate) {
        this.pushClassPrivateProperty(classBody, privateProp);
      } else {
        this.pushClassProperty(classBody, publicProp);
      }
    } else {
      this.unexpected();
    }
  }
  parseClassElementName(member) {
    const {
      type,
      value
    } = this.state;
    if ((type === 132 || type === 133) && member.static && value === "prototype") {
      this.raise(Errors.StaticPrototype, this.state.startLoc);
    }
    if (type === 138) {
      if (value === "constructor") {
        this.raise(Errors.ConstructorClassPrivateField, this.state.startLoc);
      }
      const key = this.parsePrivateName();
      member.key = key;
      return key;
    }
    return this.parsePropertyName(member);
  }
  parseClassStaticBlock(classBody, member) {
    var _member$decorators;
    this.scope.enter(64 | 128 | 16);
    const oldLabels = this.state.labels;
    this.state.labels = [];
    this.prodParam.enter(0);
    const body = member.body = [];
    this.parseBlockOrModuleBlockBody(body, undefined, false, 8);
    this.prodParam.exit();
    this.scope.exit();
    this.state.labels = oldLabels;
    classBody.body.push(this.finishNode(member, "StaticBlock"));
    if ((_member$decorators = member.decorators) != null && _member$decorators.length) {
      this.raise(Errors.DecoratorStaticBlock, member);
    }
  }
  pushClassProperty(classBody, prop) {
    if (!prop.computed && (prop.key.name === "constructor" || prop.key.value === "constructor")) {
      this.raise(Errors.ConstructorClassField, prop.key);
    }
    classBody.body.push(this.parseClassProperty(prop));
  }
  pushClassPrivateProperty(classBody, prop) {
    const node = this.parseClassPrivateProperty(prop);
    classBody.body.push(node);
    this.classScope.declarePrivateName(this.getPrivateNameSV(node.key), 0, node.key.loc.start);
  }
  pushClassAccessorProperty(classBody, prop, isPrivate) {
    if (!isPrivate && !prop.computed) {
      const key = prop.key;
      if (key.name === "constructor" || key.value === "constructor") {
        this.raise(Errors.ConstructorClassField, key);
      }
    }
    const node = this.parseClassAccessorProperty(prop);
    classBody.body.push(node);
    if (isPrivate) {
      this.classScope.declarePrivateName(this.getPrivateNameSV(node.key), 0, node.key.loc.start);
    }
  }
  pushClassMethod(classBody, method, isGenerator, isAsync, isConstructor, allowsDirectSuper) {
    classBody.body.push(this.parseMethod(method, isGenerator, isAsync, isConstructor, allowsDirectSuper, "ClassMethod", true));
  }
  pushClassPrivateMethod(classBody, method, isGenerator, isAsync) {
    const node = this.parseMethod(method, isGenerator, isAsync, false, false, "ClassPrivateMethod", true);
    classBody.body.push(node);
    const kind = node.kind === "get" ? node.static ? 6 : 2 : node.kind === "set" ? node.static ? 5 : 1 : 0;
    this.declareClassPrivateMethodInScope(node, kind);
  }
  declareClassPrivateMethodInScope(node, kind) {
    this.classScope.declarePrivateName(this.getPrivateNameSV(node.key), kind, node.key.loc.start);
  }
  parsePostMemberNameModifiers(methodOrProp) {}
  parseClassPrivateProperty(node) {
    this.parseInitializer(node);
    this.semicolon();
    return this.finishNode(node, "ClassPrivateProperty");
  }
  parseClassProperty(node) {
    this.parseInitializer(node);
    this.semicolon();
    return this.finishNode(node, "ClassProperty");
  }
  parseClassAccessorProperty(node) {
    this.parseInitializer(node);
    this.semicolon();
    return this.finishNode(node, "ClassAccessorProperty");
  }
  parseInitializer(node) {
    this.scope.enter(64 | 16);
    this.expressionScope.enter(newExpressionScope());
    this.prodParam.enter(0);
    node.value = this.eat(29) ? this.parseMaybeAssignAllowIn() : null;
    this.expressionScope.exit();
    this.prodParam.exit();
    this.scope.exit();
  }
  parseClassId(node, isStatement, optionalId, bindingType = 8331) {
    if (tokenIsIdentifier(this.state.type)) {
      node.id = this.parseIdentifier();
      if (isStatement) {
        this.declareNameFromIdentifier(node.id, bindingType);
      }
    } else {
      if (optionalId || !isStatement) {
        node.id = null;
      } else {
        throw this.raise(Errors.MissingClassName, this.state.startLoc);
      }
    }
  }
  parseClassSuper(node) {
    node.superClass = this.eat(81) ? this.parseExprSubscripts() : null;
  }
  parseExport(node, decorators) {
    const maybeDefaultIdentifier = this.parseMaybeImportPhase(node, true);
    const hasDefault = this.maybeParseExportDefaultSpecifier(node, maybeDefaultIdentifier);
    const parseAfterDefault = !hasDefault || this.eat(12);
    const hasStar = parseAfterDefault && this.eatExportStar(node);
    const hasNamespace = hasStar && this.maybeParseExportNamespaceSpecifier(node);
    const parseAfterNamespace = parseAfterDefault && (!hasNamespace || this.eat(12));
    const isFromRequired = hasDefault || hasStar;
    if (hasStar && !hasNamespace) {
      if (hasDefault) this.unexpected();
      if (decorators) {
        throw this.raise(Errors.UnsupportedDecoratorExport, node);
      }
      this.parseExportFrom(node, true);
      return this.finishNode(node, "ExportAllDeclaration");
    }
    const hasSpecifiers = this.maybeParseExportNamedSpecifiers(node);
    if (hasDefault && parseAfterDefault && !hasStar && !hasSpecifiers) {
      this.unexpected(null, 5);
    }
    if (hasNamespace && parseAfterNamespace) {
      this.unexpected(null, 98);
    }
    let hasDeclaration;
    if (isFromRequired || hasSpecifiers) {
      hasDeclaration = false;
      if (decorators) {
        throw this.raise(Errors.UnsupportedDecoratorExport, node);
      }
      this.parseExportFrom(node, isFromRequired);
    } else {
      hasDeclaration = this.maybeParseExportDeclaration(node);
    }
    if (isFromRequired || hasSpecifiers || hasDeclaration) {
      var _node2$declaration;
      const node2 = node;
      this.checkExport(node2, true, false, !!node2.source);
      if (((_node2$declaration = node2.declaration) == null ? void 0 : _node2$declaration.type) === "ClassDeclaration") {
        this.maybeTakeDecorators(decorators, node2.declaration, node2);
      } else if (decorators) {
        throw this.raise(Errors.UnsupportedDecoratorExport, node);
      }
      return this.finishNode(node2, "ExportNamedDeclaration");
    }
    if (this.eat(65)) {
      const node2 = node;
      const decl = this.parseExportDefaultExpression();
      node2.declaration = decl;
      if (decl.type === "ClassDeclaration") {
        this.maybeTakeDecorators(decorators, decl, node2);
      } else if (decorators) {
        throw this.raise(Errors.UnsupportedDecoratorExport, node);
      }
      this.checkExport(node2, true, true);
      return this.finishNode(node2, "ExportDefaultDeclaration");
    }
    this.unexpected(null, 5);
  }
  eatExportStar(node) {
    return this.eat(55);
  }
  maybeParseExportDefaultSpecifier(node, maybeDefaultIdentifier) {
    if (maybeDefaultIdentifier || this.isExportDefaultSpecifier()) {
      this.expectPlugin("exportDefaultFrom", maybeDefaultIdentifier == null ? void 0 : maybeDefaultIdentifier.loc.start);
      const id = maybeDefaultIdentifier || this.parseIdentifier(true);
      const specifier = this.startNodeAtNode(id);
      specifier.exported = id;
      node.specifiers = [this.finishNode(specifier, "ExportDefaultSpecifier")];
      return true;
    }
    return false;
  }
  maybeParseExportNamespaceSpecifier(node) {
    if (this.isContextual(93)) {
      if (!node.specifiers) node.specifiers = [];
      const specifier = this.startNodeAt(this.state.lastTokStartLoc);
      this.next();
      specifier.exported = this.parseModuleExportName();
      node.specifiers.push(this.finishNode(specifier, "ExportNamespaceSpecifier"));
      return true;
    }
    return false;
  }
  maybeParseExportNamedSpecifiers(node) {
    if (this.match(5)) {
      if (!node.specifiers) node.specifiers = [];
      const isTypeExport = node.exportKind === "type";
      node.specifiers.push(...this.parseExportSpecifiers(isTypeExport));
      node.source = null;
      node.declaration = null;
      if (this.hasPlugin("importAssertions")) {
        node.assertions = [];
      }
      return true;
    }
    return false;
  }
  maybeParseExportDeclaration(node) {
    if (this.shouldParseExportDeclaration()) {
      node.specifiers = [];
      node.source = null;
      if (this.hasPlugin("importAssertions")) {
        node.assertions = [];
      }
      node.declaration = this.parseExportDeclaration(node);
      return true;
    }
    return false;
  }
  isAsyncFunction() {
    if (!this.isContextual(95)) return false;
    const next = this.nextTokenInLineStart();
    return this.isUnparsedContextual(next, "function");
  }
  parseExportDefaultExpression() {
    const expr = this.startNode();
    if (this.match(68)) {
      this.next();
      return this.parseFunction(expr, 1 | 4);
    } else if (this.isAsyncFunction()) {
      this.next();
      this.next();
      return this.parseFunction(expr, 1 | 4 | 8);
    }
    if (this.match(80)) {
      return this.parseClass(expr, true, true);
    }
    if (this.match(26)) {
      if (this.hasPlugin("decorators") && this.getPluginOption("decorators", "decoratorsBeforeExport") === true) {
        this.raise(Errors.DecoratorBeforeExport, this.state.startLoc);
      }
      return this.parseClass(this.maybeTakeDecorators(this.parseDecorators(false), this.startNode()), true, true);
    }
    if (this.match(75) || this.match(74) || this.isLet()) {
      throw this.raise(Errors.UnsupportedDefaultExport, this.state.startLoc);
    }
    const res = this.parseMaybeAssignAllowIn();
    this.semicolon();
    return res;
  }
  parseExportDeclaration(node) {
    if (this.match(80)) {
      const node = this.parseClass(this.startNode(), true, false);
      return node;
    }
    return this.parseStatementListItem();
  }
  isExportDefaultSpecifier() {
    const {
      type
    } = this.state;
    if (tokenIsIdentifier(type)) {
      if (type === 95 && !this.state.containsEsc || type === 100) {
        return false;
      }
      if ((type === 130 || type === 129) && !this.state.containsEsc) {
        const {
          type: nextType
        } = this.lookahead();
        if (tokenIsIdentifier(nextType) && nextType !== 98 || nextType === 5) {
          this.expectOnePlugin(["flow", "typescript"]);
          return false;
        }
      }
    } else if (!this.match(65)) {
      return false;
    }
    const next = this.nextTokenStart();
    const hasFrom = this.isUnparsedContextual(next, "from");
    if (this.input.charCodeAt(next) === 44 || tokenIsIdentifier(this.state.type) && hasFrom) {
      return true;
    }
    if (this.match(65) && hasFrom) {
      const nextAfterFrom = this.input.charCodeAt(this.nextTokenStartSince(next + 4));
      return nextAfterFrom === 34 || nextAfterFrom === 39;
    }
    return false;
  }
  parseExportFrom(node, expect) {
    if (this.eatContextual(98)) {
      node.source = this.parseImportSource();
      this.checkExport(node);
      this.maybeParseImportAttributes(node);
      this.checkJSONModuleImport(node);
    } else if (expect) {
      this.unexpected();
    }
    this.semicolon();
  }
  shouldParseExportDeclaration() {
    const {
      type
    } = this.state;
    if (type === 26) {
      this.expectOnePlugin(["decorators", "decorators-legacy"]);
      if (this.hasPlugin("decorators")) {
        if (this.getPluginOption("decorators", "decoratorsBeforeExport") === true) {
          this.raise(Errors.DecoratorBeforeExport, this.state.startLoc);
        }
        return true;
      }
    }
    return type === 74 || type === 75 || type === 68 || type === 80 || this.isLet() || this.isAsyncFunction();
  }
  checkExport(node, checkNames, isDefault, isFrom) {
    if (checkNames) {
      var _node$specifiers;
      if (isDefault) {
        this.checkDuplicateExports(node, "default");
        if (this.hasPlugin("exportDefaultFrom")) {
          var _declaration$extra;
          const declaration = node.declaration;
          if (declaration.type === "Identifier" && declaration.name === "from" && declaration.end - declaration.start === 4 && !((_declaration$extra = declaration.extra) != null && _declaration$extra.parenthesized)) {
            this.raise(Errors.ExportDefaultFromAsIdentifier, declaration);
          }
        }
      } else if ((_node$specifiers = node.specifiers) != null && _node$specifiers.length) {
        for (const specifier of node.specifiers) {
          const {
            exported
          } = specifier;
          const exportName = exported.type === "Identifier" ? exported.name : exported.value;
          this.checkDuplicateExports(specifier, exportName);
          if (!isFrom && specifier.local) {
            const {
              local
            } = specifier;
            if (local.type !== "Identifier") {
              this.raise(Errors.ExportBindingIsString, specifier, {
                localName: local.value,
                exportName
              });
            } else {
              this.checkReservedWord(local.name, local.loc.start, true, false);
              this.scope.checkLocalExport(local);
            }
          }
        }
      } else if (node.declaration) {
        if (node.declaration.type === "FunctionDeclaration" || node.declaration.type === "ClassDeclaration") {
          const id = node.declaration.id;
          if (!id) throw new Error("Assertion failure");
          this.checkDuplicateExports(node, id.name);
        } else if (node.declaration.type === "VariableDeclaration") {
          for (const declaration of node.declaration.declarations) {
            this.checkDeclaration(declaration.id);
          }
        }
      }
    }
  }
  checkDeclaration(node) {
    if (node.type === "Identifier") {
      this.checkDuplicateExports(node, node.name);
    } else if (node.type === "ObjectPattern") {
      for (const prop of node.properties) {
        this.checkDeclaration(prop);
      }
    } else if (node.type === "ArrayPattern") {
      for (const elem of node.elements) {
        if (elem) {
          this.checkDeclaration(elem);
        }
      }
    } else if (node.type === "ObjectProperty") {
      this.checkDeclaration(node.value);
    } else if (node.type === "RestElement") {
      this.checkDeclaration(node.argument);
    } else if (node.type === "AssignmentPattern") {
      this.checkDeclaration(node.left);
    }
  }
  checkDuplicateExports(node, exportName) {
    if (this.exportedIdentifiers.has(exportName)) {
      if (exportName === "default") {
        this.raise(Errors.DuplicateDefaultExport, node);
      } else {
        this.raise(Errors.DuplicateExport, node, {
          exportName
        });
      }
    }
    this.exportedIdentifiers.add(exportName);
  }
  parseExportSpecifiers(isInTypeExport) {
    const nodes = [];
    let first = true;
    this.expect(5);
    while (!this.eat(8)) {
      if (first) {
        first = false;
      } else {
        this.expect(12);
        if (this.eat(8)) break;
      }
      const isMaybeTypeOnly = this.isContextual(130);
      const isString = this.match(133);
      const node = this.startNode();
      node.local = this.parseModuleExportName();
      nodes.push(this.parseExportSpecifier(node, isString, isInTypeExport, isMaybeTypeOnly));
    }
    return nodes;
  }
  parseExportSpecifier(node, isString, isInTypeExport, isMaybeTypeOnly) {
    if (this.eatContextual(93)) {
      node.exported = this.parseModuleExportName();
    } else if (isString) {
      node.exported = cloneStringLiteral(node.local);
    } else if (!node.exported) {
      node.exported = cloneIdentifier(node.local);
    }
    return this.finishNode(node, "ExportSpecifier");
  }
  parseModuleExportName() {
    if (this.match(133)) {
      const result = this.parseStringLiteral(this.state.value);
      const surrogate = result.value.match(loneSurrogate);
      if (surrogate) {
        this.raise(Errors.ModuleExportNameHasLoneSurrogate, result, {
          surrogateCharCode: surrogate[0].charCodeAt(0)
        });
      }
      return result;
    }
    return this.parseIdentifier(true);
  }
  isJSONModuleImport(node) {
    if (node.assertions != null) {
      return node.assertions.some(({
        key,
        value
      }) => {
        return value.value === "json" && (key.type === "Identifier" ? key.name === "type" : key.value === "type");
      });
    }
    return false;
  }
  checkImportReflection(node) {
    const {
      specifiers
    } = node;
    const singleBindingType = specifiers.length === 1 ? specifiers[0].type : null;
    if (node.phase === "source") {
      if (singleBindingType !== "ImportDefaultSpecifier") {
        this.raise(Errors.SourcePhaseImportRequiresDefault, specifiers[0].loc.start);
      }
    } else if (node.phase === "defer") {
      if (singleBindingType !== "ImportNamespaceSpecifier") {
        this.raise(Errors.DeferImportRequiresNamespace, specifiers[0].loc.start);
      }
    } else if (node.module) {
      var _node$assertions;
      if (singleBindingType !== "ImportDefaultSpecifier") {
        this.raise(Errors.ImportReflectionNotBinding, specifiers[0].loc.start);
      }
      if (((_node$assertions = node.assertions) == null ? void 0 : _node$assertions.length) > 0) {
        this.raise(Errors.ImportReflectionHasAssertion, specifiers[0].loc.start);
      }
    }
  }
  checkJSONModuleImport(node) {
    if (this.isJSONModuleImport(node) && node.type !== "ExportAllDeclaration") {
      const {
        specifiers
      } = node;
      if (specifiers != null) {
        const nonDefaultNamedSpecifier = specifiers.find(specifier => {
          let imported;
          if (specifier.type === "ExportSpecifier") {
            imported = specifier.local;
          } else if (specifier.type === "ImportSpecifier") {
            imported = specifier.imported;
          }
          if (imported !== undefined) {
            return imported.type === "Identifier" ? imported.name !== "default" : imported.value !== "default";
          }
        });
        if (nonDefaultNamedSpecifier !== undefined) {
          this.raise(Errors.ImportJSONBindingNotDefault, nonDefaultNamedSpecifier.loc.start);
        }
      }
    }
  }
  isPotentialImportPhase(isExport) {
    if (isExport) return false;
    return this.isContextual(105) || this.isContextual(97) || this.isContextual(127);
  }
  applyImportPhase(node, isExport, phase, loc) {
    if (isExport) {
      return;
    }
    if (phase === "module") {
      this.expectPlugin("importReflection", loc);
      node.module = true;
    } else if (this.hasPlugin("importReflection")) {
      node.module = false;
    }
    if (phase === "source") {
      this.expectPlugin("sourcePhaseImports", loc);
      node.phase = "source";
    } else if (phase === "defer") {
      this.expectPlugin("deferredImportEvaluation", loc);
      node.phase = "defer";
    } else if (this.hasPlugin("sourcePhaseImports")) {
      node.phase = null;
    }
  }
  parseMaybeImportPhase(node, isExport) {
    if (!this.isPotentialImportPhase(isExport)) {
      this.applyImportPhase(node, isExport, null);
      return null;
    }
    const phaseIdentifier = this.parseIdentifier(true);
    const {
      type
    } = this.state;
    const isImportPhase = tokenIsKeywordOrIdentifier(type) ? type !== 98 || this.lookaheadCharCode() === 102 : type !== 12;
    if (isImportPhase) {
      this.resetPreviousIdentifierLeadingComments(phaseIdentifier);
      this.applyImportPhase(node, isExport, phaseIdentifier.name, phaseIdentifier.loc.start);
      return null;
    } else {
      this.applyImportPhase(node, isExport, null);
      return phaseIdentifier;
    }
  }
  isPrecedingIdImportPhase(phase) {
    const {
      type
    } = this.state;
    return tokenIsIdentifier(type) ? type !== 98 || this.lookaheadCharCode() === 102 : type !== 12;
  }
  parseImport(node) {
    if (this.match(133)) {
      return this.parseImportSourceAndAttributes(node);
    }
    return this.parseImportSpecifiersAndAfter(node, this.parseMaybeImportPhase(node, false));
  }
  parseImportSpecifiersAndAfter(node, maybeDefaultIdentifier) {
    node.specifiers = [];
    const hasDefault = this.maybeParseDefaultImportSpecifier(node, maybeDefaultIdentifier);
    const parseNext = !hasDefault || this.eat(12);
    const hasStar = parseNext && this.maybeParseStarImportSpecifier(node);
    if (parseNext && !hasStar) this.parseNamedImportSpecifiers(node);
    this.expectContextual(98);
    return this.parseImportSourceAndAttributes(node);
  }
  parseImportSourceAndAttributes(node) {
    var _node$specifiers2;
    (_node$specifiers2 = node.specifiers) != null ? _node$specifiers2 : node.specifiers = [];
    node.source = this.parseImportSource();
    this.maybeParseImportAttributes(node);
    this.checkImportReflection(node);
    this.checkJSONModuleImport(node);
    this.semicolon();
    return this.finishNode(node, "ImportDeclaration");
  }
  parseImportSource() {
    if (!this.match(133)) this.unexpected();
    return this.parseExprAtom();
  }
  parseImportSpecifierLocal(node, specifier, type) {
    specifier.local = this.parseIdentifier();
    node.specifiers.push(this.finishImportSpecifier(specifier, type));
  }
  finishImportSpecifier(specifier, type, bindingType = 8201) {
    this.checkLVal(specifier.local, {
      in: {
        type
      },
      binding: bindingType
    });
    return this.finishNode(specifier, type);
  }
  parseImportAttributes() {
    this.expect(5);
    const attrs = [];
    const attrNames = new Set();
    do {
      if (this.match(8)) {
        break;
      }
      const node = this.startNode();
      const keyName = this.state.value;
      if (attrNames.has(keyName)) {
        this.raise(Errors.ModuleAttributesWithDuplicateKeys, this.state.startLoc, {
          key: keyName
        });
      }
      attrNames.add(keyName);
      if (this.match(133)) {
        node.key = this.parseStringLiteral(keyName);
      } else {
        node.key = this.parseIdentifier(true);
      }
      this.expect(14);
      if (!this.match(133)) {
        throw this.raise(Errors.ModuleAttributeInvalidValue, this.state.startLoc);
      }
      node.value = this.parseStringLiteral(this.state.value);
      attrs.push(this.finishNode(node, "ImportAttribute"));
    } while (this.eat(12));
    this.expect(8);
    return attrs;
  }
  parseModuleAttributes() {
    const attrs = [];
    const attributes = new Set();
    do {
      const node = this.startNode();
      node.key = this.parseIdentifier(true);
      if (node.key.name !== "type") {
        this.raise(Errors.ModuleAttributeDifferentFromType, node.key);
      }
      if (attributes.has(node.key.name)) {
        this.raise(Errors.ModuleAttributesWithDuplicateKeys, node.key, {
          key: node.key.name
        });
      }
      attributes.add(node.key.name);
      this.expect(14);
      if (!this.match(133)) {
        throw this.raise(Errors.ModuleAttributeInvalidValue, this.state.startLoc);
      }
      node.value = this.parseStringLiteral(this.state.value);
      attrs.push(this.finishNode(node, "ImportAttribute"));
    } while (this.eat(12));
    return attrs;
  }
  maybeParseImportAttributes(node) {
    let attributes;
    let useWith = false;
    if (this.match(76)) {
      if (this.hasPrecedingLineBreak() && this.lookaheadCharCode() === 40) {
        return;
      }
      this.next();
      {
        if (this.hasPlugin("moduleAttributes")) {
          attributes = this.parseModuleAttributes();
        } else {
          this.expectImportAttributesPlugin();
          attributes = this.parseImportAttributes();
        }
      }
      useWith = true;
    } else if (this.isContextual(94) && !this.hasPrecedingLineBreak()) {
      if (this.hasPlugin("importAttributes")) {
        if (this.getPluginOption("importAttributes", "deprecatedAssertSyntax") !== true) {
          this.raise(Errors.ImportAttributesUseAssert, this.state.startLoc);
        }
        this.addExtra(node, "deprecatedAssertSyntax", true);
      } else {
        this.expectOnePlugin(["importAttributes", "importAssertions"]);
      }
      this.next();
      attributes = this.parseImportAttributes();
    } else if (this.hasPlugin("importAttributes") || this.hasPlugin("importAssertions")) {
      attributes = [];
    } else {
      if (this.hasPlugin("moduleAttributes")) {
        attributes = [];
      } else return;
    }
    if (!useWith && this.hasPlugin("importAssertions")) {
      node.assertions = attributes;
    } else {
      node.attributes = attributes;
    }
  }
  maybeParseDefaultImportSpecifier(node, maybeDefaultIdentifier) {
    if (maybeDefaultIdentifier) {
      const specifier = this.startNodeAtNode(maybeDefaultIdentifier);
      specifier.local = maybeDefaultIdentifier;
      node.specifiers.push(this.finishImportSpecifier(specifier, "ImportDefaultSpecifier"));
      return true;
    } else if (tokenIsKeywordOrIdentifier(this.state.type)) {
      this.parseImportSpecifierLocal(node, this.startNode(), "ImportDefaultSpecifier");
      return true;
    }
    return false;
  }
  maybeParseStarImportSpecifier(node) {
    if (this.match(55)) {
      const specifier = this.startNode();
      this.next();
      this.expectContextual(93);
      this.parseImportSpecifierLocal(node, specifier, "ImportNamespaceSpecifier");
      return true;
    }
    return false;
  }
  parseNamedImportSpecifiers(node) {
    let first = true;
    this.expect(5);
    while (!this.eat(8)) {
      if (first) {
        first = false;
      } else {
        if (this.eat(14)) {
          throw this.raise(Errors.DestructureNamedImport, this.state.startLoc);
        }
        this.expect(12);
        if (this.eat(8)) break;
      }
      const specifier = this.startNode();
      const importedIsString = this.match(133);
      const isMaybeTypeOnly = this.isContextual(130);
      specifier.imported = this.parseModuleExportName();
      const importSpecifier = this.parseImportSpecifier(specifier, importedIsString, node.importKind === "type" || node.importKind === "typeof", isMaybeTypeOnly, undefined);
      node.specifiers.push(importSpecifier);
    }
  }
  parseImportSpecifier(specifier, importedIsString, isInTypeOnlyImport, isMaybeTypeOnly, bindingType) {
    if (this.eatContextual(93)) {
      specifier.local = this.parseIdentifier();
    } else {
      const {
        imported
      } = specifier;
      if (importedIsString) {
        throw this.raise(Errors.ImportBindingIsString, specifier, {
          importName: imported.value
        });
      }
      this.checkReservedWord(imported.name, specifier.loc.start, true, true);
      if (!specifier.local) {
        specifier.local = cloneIdentifier(imported);
      }
    }
    return this.finishImportSpecifier(specifier, "ImportSpecifier", bindingType);
  }
  isThisParam(param) {
    return param.type === "Identifier" && param.name === "this";
  }
}
class Parser extends StatementParser {
  constructor(options, input) {
    options = getOptions(options);
    super(options, input);
    this.options = options;
    this.initializeScopes();
    this.plugins = pluginsMap(this.options.plugins);
    this.filename = options.sourceFilename;
  }
  getScopeHandler() {
    return ScopeHandler;
  }
  parse() {
    this.enterInitialScopes();
    const file = this.startNode();
    const program = this.startNode();
    this.nextToken();
    file.errors = null;
    this.parseTopLevel(file, program);
    file.errors = this.state.errors;
    file.comments.length = this.state.commentsLen;
    return file;
  }
}
function pluginsMap(plugins) {
  const pluginMap = new Map();
  for (const plugin of plugins) {
    const [name, options] = Array.isArray(plugin) ? plugin : [plugin, {}];
    if (!pluginMap.has(name)) pluginMap.set(name, options || {});
  }
  return pluginMap;
}
function parse$1(input, options) {
  var _options;
  if (((_options = options) == null ? void 0 : _options.sourceType) === "unambiguous") {
    options = Object.assign({}, options);
    try {
      options.sourceType = "module";
      const parser = getParser(options, input);
      const ast = parser.parse();
      if (parser.sawUnambiguousESM) {
        return ast;
      }
      if (parser.ambiguousScriptDifferentAst) {
        try {
          options.sourceType = "script";
          return getParser(options, input).parse();
        } catch (_unused) {}
      } else {
        ast.program.sourceType = "script";
      }
      return ast;
    } catch (moduleError) {
      try {
        options.sourceType = "script";
        return getParser(options, input).parse();
      } catch (_unused2) {}
      throw moduleError;
    }
  } else {
    return getParser(options, input).parse();
  }
}
function parseExpression(input, options) {
  const parser = getParser(options, input);
  if (parser.options.strictMode) {
    parser.state.strict = true;
  }
  return parser.getExpression();
}
function generateExportedTokenTypes(internalTokenTypes) {
  const tokenTypes = {};
  for (const typeName of Object.keys(internalTokenTypes)) {
    tokenTypes[typeName] = getExportedToken(internalTokenTypes[typeName]);
  }
  return tokenTypes;
}
const tokTypes = generateExportedTokenTypes(tt);
function getParser(options, input) {
  let cls = Parser;
  if (options != null && options.plugins) {
    validatePlugins(options.plugins);
    cls = getParserClass(options.plugins);
  }
  return new cls(options, input);
}
const parserClassCache = {};
function getParserClass(pluginsFromOptions) {
  const pluginList = mixinPluginNames.filter(name => hasPlugin(pluginsFromOptions, name));
  const key = pluginList.join("/");
  let cls = parserClassCache[key];
  if (!cls) {
    cls = Parser;
    for (const plugin of pluginList) {
      cls = mixinPlugins[plugin](cls);
    }
    parserClassCache[key] = cls;
  }
  return cls;
}
var parse_1 = lib.parse = parse$1;
lib.parseExpression = parseExpression;
lib.tokTypes = tokTypes;

function sharedPlugin(fork) {
  var types = fork.use(typesPlugin);
  var Type = types.Type;
  var builtin = types.builtInTypes;
  var isNumber = builtin.number;
  function geq(than) {
    return Type.from(
      (value) => isNumber.check(value) && value >= than,
      isNumber + " >= " + than
    );
  }
  const defaults = {
    // Functions were used because (among other reasons) that's the most
    // elegant way to allow for the emptyArray one always to give a new
    // array instance.
    "null": function() {
      return null;
    },
    "emptyArray": function() {
      return [];
    },
    "false": function() {
      return false;
    },
    "true": function() {
      return true;
    },
    "undefined": function() {
    },
    "use strict": function() {
      return "use strict";
    }
  };
  var naiveIsPrimitive = Type.or(
    builtin.string,
    builtin.number,
    builtin.boolean,
    builtin.null,
    builtin.undefined
  );
  const isPrimitive = Type.from(
    (value) => {
      if (value === null)
        return true;
      var type = typeof value;
      if (type === "object" || type === "function") {
        return false;
      }
      return true;
    },
    naiveIsPrimitive.toString()
  );
  return {
    geq,
    defaults,
    isPrimitive
  };
}
function maybeSetModuleExports(moduleGetter) {
  try {
    var nodeModule = moduleGetter();
    var originalExports = nodeModule.exports;
    var defaultExport = originalExports["default"];
  } catch {
    return;
  }
  if (defaultExport && defaultExport !== originalExports && typeof originalExports === "object") {
    Object.assign(defaultExport, originalExports, { "default": defaultExport });
    if (originalExports.__esModule) {
      Object.defineProperty(defaultExport, "__esModule", { value: true });
    }
    nodeModule.exports = defaultExport;
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const Op$1 = Object.prototype;
const objToStr = Op$1.toString;
const hasOwn$6 = Op$1.hasOwnProperty;
class BaseType {
  assert(value, deep) {
    if (!this.check(value, deep)) {
      var str = shallowStringify(value);
      throw new Error(str + " does not match type " + this);
    }
    return true;
  }
  arrayOf() {
    const elemType = this;
    return new ArrayType(elemType);
  }
}
class ArrayType extends BaseType {
  constructor(elemType) {
    super();
    this.elemType = elemType;
    __publicField$2(this, "kind", "ArrayType");
  }
  toString() {
    return "[" + this.elemType + "]";
  }
  check(value, deep) {
    return Array.isArray(value) && value.every((elem) => this.elemType.check(elem, deep));
  }
}
class IdentityType extends BaseType {
  constructor(value) {
    super();
    this.value = value;
    __publicField$2(this, "kind", "IdentityType");
  }
  toString() {
    return String(this.value);
  }
  check(value, deep) {
    const result = value === this.value;
    if (!result && typeof deep === "function") {
      deep(this, value);
    }
    return result;
  }
}
class ObjectType extends BaseType {
  constructor(fields) {
    super();
    this.fields = fields;
    __publicField$2(this, "kind", "ObjectType");
  }
  toString() {
    return "{ " + this.fields.join(", ") + " }";
  }
  check(value, deep) {
    return objToStr.call(value) === objToStr.call({}) && this.fields.every((field) => {
      return field.type.check(value[field.name], deep);
    });
  }
}
class OrType extends BaseType {
  constructor(types) {
    super();
    this.types = types;
    __publicField$2(this, "kind", "OrType");
  }
  toString() {
    return this.types.join(" | ");
  }
  check(value, deep) {
    if (this.types.some((type) => type.check(value, !!deep))) {
      return true;
    }
    if (typeof deep === "function") {
      deep(this, value);
    }
    return false;
  }
}
class PredicateType extends BaseType {
  constructor(name, predicate) {
    super();
    this.name = name;
    this.predicate = predicate;
    __publicField$2(this, "kind", "PredicateType");
  }
  toString() {
    return this.name;
  }
  check(value, deep) {
    const result = this.predicate(value, deep);
    if (!result && typeof deep === "function") {
      deep(this, value);
    }
    return result;
  }
}
class Def {
  constructor(type, typeName) {
    this.type = type;
    this.typeName = typeName;
    __publicField$2(this, "baseNames", []);
    __publicField$2(this, "ownFields", /* @__PURE__ */ Object.create(null));
    // Includes own typeName. Populated during finalization.
    __publicField$2(this, "allSupertypes", /* @__PURE__ */ Object.create(null));
    // Linear inheritance hierarchy. Populated during finalization.
    __publicField$2(this, "supertypeList", []);
    // Includes inherited fields.
    __publicField$2(this, "allFields", /* @__PURE__ */ Object.create(null));
    // Non-hidden keys of allFields.
    __publicField$2(this, "fieldNames", []);
    // This property will be overridden as true by individual Def instances
    // when they are finalized.
    __publicField$2(this, "finalized", false);
    // False by default until .build(...) is called on an instance.
    __publicField$2(this, "buildable", false);
    __publicField$2(this, "buildParams", []);
  }
  isSupertypeOf(that) {
    if (that instanceof Def) {
      if (this.finalized !== true || that.finalized !== true) {
        throw new Error("");
      }
      return hasOwn$6.call(that.allSupertypes, this.typeName);
    } else {
      throw new Error(that + " is not a Def");
    }
  }
  checkAllFields(value, deep) {
    var allFields = this.allFields;
    if (this.finalized !== true) {
      throw new Error("" + this.typeName);
    }
    function checkFieldByName(name) {
      var field = allFields[name];
      var type = field.type;
      var child = field.getValue(value);
      return type.check(child, deep);
    }
    return value !== null && typeof value === "object" && Object.keys(allFields).every(checkFieldByName);
  }
  bases(...supertypeNames) {
    var bases = this.baseNames;
    if (this.finalized) {
      if (supertypeNames.length !== bases.length) {
        throw new Error("");
      }
      for (var i = 0; i < supertypeNames.length; i++) {
        if (supertypeNames[i] !== bases[i]) {
          throw new Error("");
        }
      }
      return this;
    }
    supertypeNames.forEach((baseName) => {
      if (bases.indexOf(baseName) < 0) {
        bases.push(baseName);
      }
    });
    return this;
  }
}
class Field {
  constructor(name, type, defaultFn, hidden) {
    this.name = name;
    this.type = type;
    this.defaultFn = defaultFn;
    __publicField$2(this, "hidden");
    this.hidden = !!hidden;
  }
  toString() {
    return JSON.stringify(this.name) + ": " + this.type;
  }
  getValue(obj) {
    var value = obj[this.name];
    if (typeof value !== "undefined") {
      return value;
    }
    if (typeof this.defaultFn === "function") {
      value = this.defaultFn.call(obj);
    }
    return value;
  }
}
function shallowStringify(value) {
  if (Array.isArray(value)) {
    return "[" + value.map(shallowStringify).join(", ") + "]";
  }
  if (value && typeof value === "object") {
    return "{ " + Object.keys(value).map(function(key) {
      return key + ": " + value[key];
    }).join(", ") + " }";
  }
  return JSON.stringify(value);
}
function typesPlugin(_fork) {
  const Type = {
    or(...types) {
      return new OrType(types.map((type) => Type.from(type)));
    },
    from(value, name) {
      if (value instanceof ArrayType || value instanceof IdentityType || value instanceof ObjectType || value instanceof OrType || value instanceof PredicateType) {
        return value;
      }
      if (value instanceof Def) {
        return value.type;
      }
      if (isArray.check(value)) {
        if (value.length !== 1) {
          throw new Error("only one element type is permitted for typed arrays");
        }
        return new ArrayType(Type.from(value[0]));
      }
      if (isObject.check(value)) {
        return new ObjectType(Object.keys(value).map((name2) => {
          return new Field(name2, Type.from(value[name2], name2));
        }));
      }
      if (typeof value === "function") {
        var bicfIndex = builtInCtorFns.indexOf(value);
        if (bicfIndex >= 0) {
          return builtInCtorTypes[bicfIndex];
        }
        if (typeof name !== "string") {
          throw new Error("missing name");
        }
        return new PredicateType(name, value);
      }
      return new IdentityType(value);
    },
    // Define a type whose name is registered in a namespace (the defCache) so
    // that future definitions will return the same type given the same name.
    // In particular, this system allows for circular and forward definitions.
    // The Def object d returned from Type.def may be used to configure the
    // type d.type by calling methods such as d.bases, d.build, and d.field.
    def(typeName) {
      return hasOwn$6.call(defCache, typeName) ? defCache[typeName] : defCache[typeName] = new DefImpl(typeName);
    },
    hasDef(typeName) {
      return hasOwn$6.call(defCache, typeName);
    }
  };
  var builtInCtorFns = [];
  var builtInCtorTypes = [];
  function defBuiltInType(name, example) {
    const objStr = objToStr.call(example);
    const type = new PredicateType(
      name,
      (value) => objToStr.call(value) === objStr
    );
    if (example && typeof example.constructor === "function") {
      builtInCtorFns.push(example.constructor);
      builtInCtorTypes.push(type);
    }
    return type;
  }
  const isString = defBuiltInType("string", "truthy");
  const isFunction = defBuiltInType("function", function() {
  });
  const isArray = defBuiltInType("array", []);
  const isObject = defBuiltInType("object", {});
  const isRegExp = defBuiltInType("RegExp", /./);
  const isDate = defBuiltInType("Date", /* @__PURE__ */ new Date());
  const isNumber = defBuiltInType("number", 3);
  const isBoolean = defBuiltInType("boolean", true);
  const isNull = defBuiltInType("null", null);
  const isUndefined = defBuiltInType("undefined", void 0);
  const isBigInt = typeof BigInt === "function" ? defBuiltInType("BigInt", BigInt(1234)) : new PredicateType("BigInt", () => false);
  const builtInTypes = {
    string: isString,
    function: isFunction,
    array: isArray,
    object: isObject,
    RegExp: isRegExp,
    Date: isDate,
    number: isNumber,
    boolean: isBoolean,
    null: isNull,
    undefined: isUndefined,
    BigInt: isBigInt
  };
  var defCache = /* @__PURE__ */ Object.create(null);
  function defFromValue(value) {
    if (value && typeof value === "object") {
      var type = value.type;
      if (typeof type === "string" && hasOwn$6.call(defCache, type)) {
        var d = defCache[type];
        if (d.finalized) {
          return d;
        }
      }
    }
    return null;
  }
  class DefImpl extends Def {
    constructor(typeName) {
      super(
        new PredicateType(typeName, (value, deep) => this.check(value, deep)),
        typeName
      );
    }
    check(value, deep) {
      if (this.finalized !== true) {
        throw new Error(
          "prematurely checking unfinalized type " + this.typeName
        );
      }
      if (value === null || typeof value !== "object") {
        return false;
      }
      var vDef = defFromValue(value);
      if (!vDef) {
        if (this.typeName === "SourceLocation" || this.typeName === "Position") {
          return this.checkAllFields(value, deep);
        }
        return false;
      }
      if (deep && vDef === this) {
        return this.checkAllFields(value, deep);
      }
      if (!this.isSupertypeOf(vDef)) {
        return false;
      }
      if (!deep) {
        return true;
      }
      return vDef.checkAllFields(value, deep) && this.checkAllFields(value, false);
    }
    build(...buildParams) {
      this.buildParams = buildParams;
      if (this.buildable) {
        return this;
      }
      this.field("type", String, () => this.typeName);
      this.buildable = true;
      const addParam = (built, param, arg, isArgAvailable) => {
        if (hasOwn$6.call(built, param))
          return;
        var all = this.allFields;
        if (!hasOwn$6.call(all, param)) {
          throw new Error("" + param);
        }
        var field = all[param];
        var type = field.type;
        var value;
        if (isArgAvailable) {
          value = arg;
        } else if (field.defaultFn) {
          value = field.defaultFn.call(built);
        } else {
          var message = "no value or default function given for field " + JSON.stringify(param) + " of " + this.typeName + "(" + this.buildParams.map(function(name) {
            return all[name];
          }).join(", ") + ")";
          throw new Error(message);
        }
        if (!type.check(value)) {
          throw new Error(
            shallowStringify(value) + " does not match field " + field + " of type " + this.typeName
          );
        }
        built[param] = value;
      };
      const builder = (...args) => {
        var argc = args.length;
        if (!this.finalized) {
          throw new Error(
            "attempting to instantiate unfinalized type " + this.typeName
          );
        }
        var built = Object.create(nodePrototype);
        this.buildParams.forEach(function(param, i) {
          if (i < argc) {
            addParam(built, param, args[i], true);
          } else {
            addParam(built, param, null, false);
          }
        });
        Object.keys(this.allFields).forEach(function(param) {
          addParam(built, param, null, false);
        });
        if (built.type !== this.typeName) {
          throw new Error("");
        }
        return built;
      };
      builder.from = (obj) => {
        if (!this.finalized) {
          throw new Error(
            "attempting to instantiate unfinalized type " + this.typeName
          );
        }
        var built = Object.create(nodePrototype);
        Object.keys(this.allFields).forEach(function(param) {
          if (hasOwn$6.call(obj, param)) {
            addParam(built, param, obj[param], true);
          } else {
            addParam(built, param, null, false);
          }
        });
        if (built.type !== this.typeName) {
          throw new Error("");
        }
        return built;
      };
      Object.defineProperty(builders, getBuilderName(this.typeName), {
        enumerable: true,
        value: builder
      });
      return this;
    }
    // The reason fields are specified using .field(...) instead of an object
    // literal syntax is somewhat subtle: the object literal syntax would
    // support only one key and one value, but with .field(...) we can pass
    // any number of arguments to specify the field.
    field(name, type, defaultFn, hidden) {
      if (this.finalized) {
        console.error("Ignoring attempt to redefine field " + JSON.stringify(name) + " of finalized type " + JSON.stringify(this.typeName));
        return this;
      }
      this.ownFields[name] = new Field(name, Type.from(type), defaultFn, hidden);
      return this;
    }
    finalize() {
      if (!this.finalized) {
        var allFields = this.allFields;
        var allSupertypes = this.allSupertypes;
        this.baseNames.forEach((name) => {
          var def = defCache[name];
          if (def instanceof Def) {
            def.finalize();
            extend(allFields, def.allFields);
            extend(allSupertypes, def.allSupertypes);
          } else {
            var message = "unknown supertype name " + JSON.stringify(name) + " for subtype " + JSON.stringify(this.typeName);
            throw new Error(message);
          }
        });
        extend(allFields, this.ownFields);
        allSupertypes[this.typeName] = this;
        this.fieldNames.length = 0;
        for (var fieldName in allFields) {
          if (hasOwn$6.call(allFields, fieldName) && !allFields[fieldName].hidden) {
            this.fieldNames.push(fieldName);
          }
        }
        Object.defineProperty(namedTypes, this.typeName, {
          enumerable: true,
          value: this.type
        });
        this.finalized = true;
        populateSupertypeList(this.typeName, this.supertypeList);
        if (this.buildable && this.supertypeList.lastIndexOf("Expression") >= 0) {
          wrapExpressionBuilderWithStatement(this.typeName);
        }
      }
    }
  }
  function getSupertypeNames(typeName) {
    if (!hasOwn$6.call(defCache, typeName)) {
      throw new Error("");
    }
    var d = defCache[typeName];
    if (d.finalized !== true) {
      throw new Error("");
    }
    return d.supertypeList.slice(1);
  }
  function computeSupertypeLookupTable(candidates) {
    var table = {};
    var typeNames = Object.keys(defCache);
    var typeNameCount = typeNames.length;
    for (var i = 0; i < typeNameCount; ++i) {
      var typeName = typeNames[i];
      var d = defCache[typeName];
      if (d.finalized !== true) {
        throw new Error("" + typeName);
      }
      for (var j = 0; j < d.supertypeList.length; ++j) {
        var superTypeName = d.supertypeList[j];
        if (hasOwn$6.call(candidates, superTypeName)) {
          table[typeName] = superTypeName;
          break;
        }
      }
    }
    return table;
  }
  var builders = /* @__PURE__ */ Object.create(null);
  var nodePrototype = {};
  function defineMethod(name, func) {
    var old = nodePrototype[name];
    if (isUndefined.check(func)) {
      delete nodePrototype[name];
    } else {
      isFunction.assert(func);
      Object.defineProperty(nodePrototype, name, {
        enumerable: true,
        // For discoverability.
        configurable: true,
        // For delete proto[name].
        value: func
      });
    }
    return old;
  }
  function getBuilderName(typeName) {
    return typeName.replace(/^[A-Z]+/, function(upperCasePrefix) {
      var len = upperCasePrefix.length;
      switch (len) {
        case 0:
          return "";
        case 1:
          return upperCasePrefix.toLowerCase();
        default:
          return upperCasePrefix.slice(
            0,
            len - 1
          ).toLowerCase() + upperCasePrefix.charAt(len - 1);
      }
    });
  }
  function getStatementBuilderName(typeName) {
    typeName = getBuilderName(typeName);
    return typeName.replace(/(Expression)?$/, "Statement");
  }
  var namedTypes = {};
  function getFieldNames(object) {
    var d = defFromValue(object);
    if (d) {
      return d.fieldNames.slice(0);
    }
    if ("type" in object) {
      throw new Error(
        "did not recognize object of type " + JSON.stringify(object.type)
      );
    }
    return Object.keys(object);
  }
  function getFieldValue(object, fieldName) {
    var d = defFromValue(object);
    if (d) {
      var field = d.allFields[fieldName];
      if (field) {
        return field.getValue(object);
      }
    }
    return object && object[fieldName];
  }
  function eachField(object, callback, context) {
    getFieldNames(object).forEach(function(name) {
      callback.call(this, name, getFieldValue(object, name));
    }, context);
  }
  function someField(object, callback, context) {
    return getFieldNames(object).some(function(name) {
      return callback.call(this, name, getFieldValue(object, name));
    }, context);
  }
  function wrapExpressionBuilderWithStatement(typeName) {
    var wrapperName = getStatementBuilderName(typeName);
    if (builders[wrapperName])
      return;
    var wrapped = builders[getBuilderName(typeName)];
    if (!wrapped)
      return;
    const builder = function(...args) {
      return builders.expressionStatement(wrapped.apply(builders, args));
    };
    builder.from = function(...args) {
      return builders.expressionStatement(wrapped.from.apply(builders, args));
    };
    builders[wrapperName] = builder;
  }
  function populateSupertypeList(typeName, list) {
    list.length = 0;
    list.push(typeName);
    var lastSeen = /* @__PURE__ */ Object.create(null);
    for (var pos = 0; pos < list.length; ++pos) {
      typeName = list[pos];
      var d = defCache[typeName];
      if (d.finalized !== true) {
        throw new Error("");
      }
      if (hasOwn$6.call(lastSeen, typeName)) {
        delete list[lastSeen[typeName]];
      }
      lastSeen[typeName] = pos;
      list.push.apply(list, d.baseNames);
    }
    for (var to = 0, from = to, len = list.length; from < len; ++from) {
      if (hasOwn$6.call(list, from)) {
        list[to++] = list[from];
      }
    }
    list.length = to;
  }
  function extend(into, from) {
    Object.keys(from).forEach(function(name) {
      into[name] = from[name];
    });
    return into;
  }
  function finalize() {
    Object.keys(defCache).forEach(function(name) {
      defCache[name].finalize();
    });
  }
  return {
    Type,
    builtInTypes,
    getSupertypeNames,
    computeSupertypeLookupTable,
    builders,
    defineMethod,
    getBuilderName,
    getStatementBuilderName,
    namedTypes,
    getFieldNames,
    getFieldValue,
    eachField,
    someField,
    finalize
  };
}
maybeSetModuleExports(() => module);

var Op = Object.prototype;
var hasOwn$5 = Op.hasOwnProperty;
function pathPlugin(fork) {
  var types = fork.use(typesPlugin);
  var isArray = types.builtInTypes.array;
  var isNumber = types.builtInTypes.number;
  const Path = function Path2(value, parentPath, name) {
    if (!(this instanceof Path2)) {
      throw new Error("Path constructor cannot be invoked without 'new'");
    }
    if (parentPath) {
      if (!(parentPath instanceof Path2)) {
        throw new Error("");
      }
    } else {
      parentPath = null;
      name = null;
    }
    this.value = value;
    this.parentPath = parentPath;
    this.name = name;
    this.__childCache = null;
  };
  var Pp = Path.prototype;
  function getChildCache(path) {
    return path.__childCache || (path.__childCache = /* @__PURE__ */ Object.create(null));
  }
  function getChildPath(path, name) {
    var cache = getChildCache(path);
    var actualChildValue = path.getValueProperty(name);
    var childPath = cache[name];
    if (!hasOwn$5.call(cache, name) || // Ensure consistency between cache and reality.
    childPath.value !== actualChildValue) {
      childPath = cache[name] = new path.constructor(
        actualChildValue,
        path,
        name
      );
    }
    return childPath;
  }
  Pp.getValueProperty = function getValueProperty(name) {
    return this.value[name];
  };
  Pp.get = function get(...names) {
    var path = this;
    var count = names.length;
    for (var i = 0; i < count; ++i) {
      path = getChildPath(path, names[i]);
    }
    return path;
  };
  Pp.each = function each(callback, context) {
    var childPaths = [];
    var len = this.value.length;
    var i = 0;
    for (var i = 0; i < len; ++i) {
      if (hasOwn$5.call(this.value, i)) {
        childPaths[i] = this.get(i);
      }
    }
    context = context || this;
    for (i = 0; i < len; ++i) {
      if (hasOwn$5.call(childPaths, i)) {
        callback.call(context, childPaths[i]);
      }
    }
  };
  Pp.map = function map(callback, context) {
    var result = [];
    this.each(function(childPath) {
      result.push(callback.call(this, childPath));
    }, context);
    return result;
  };
  Pp.filter = function filter(callback, context) {
    var result = [];
    this.each(function(childPath) {
      if (callback.call(this, childPath)) {
        result.push(childPath);
      }
    }, context);
    return result;
  };
  function emptyMoves() {
  }
  function getMoves(path, offset, start, end) {
    isArray.assert(path.value);
    if (offset === 0) {
      return emptyMoves;
    }
    var length = path.value.length;
    if (length < 1) {
      return emptyMoves;
    }
    var argc = arguments.length;
    if (argc === 2) {
      start = 0;
      end = length;
    } else if (argc === 3) {
      start = Math.max(start, 0);
      end = length;
    } else {
      start = Math.max(start, 0);
      end = Math.min(end, length);
    }
    isNumber.assert(start);
    isNumber.assert(end);
    var moves = /* @__PURE__ */ Object.create(null);
    var cache = getChildCache(path);
    for (var i = start; i < end; ++i) {
      if (hasOwn$5.call(path.value, i)) {
        var childPath = path.get(i);
        if (childPath.name !== i) {
          throw new Error("");
        }
        var newIndex = i + offset;
        childPath.name = newIndex;
        moves[newIndex] = childPath;
        delete cache[i];
      }
    }
    delete cache.length;
    return function() {
      for (var newIndex2 in moves) {
        var childPath2 = moves[newIndex2];
        if (childPath2.name !== +newIndex2) {
          throw new Error("");
        }
        cache[newIndex2] = childPath2;
        path.value[newIndex2] = childPath2.value;
      }
    };
  }
  Pp.shift = function shift() {
    var move = getMoves(this, -1);
    var result = this.value.shift();
    move();
    return result;
  };
  Pp.unshift = function unshift(...args) {
    var move = getMoves(this, args.length);
    var result = this.value.unshift.apply(this.value, args);
    move();
    return result;
  };
  Pp.push = function push(...args) {
    isArray.assert(this.value);
    delete getChildCache(this).length;
    return this.value.push.apply(this.value, args);
  };
  Pp.pop = function pop() {
    isArray.assert(this.value);
    var cache = getChildCache(this);
    delete cache[this.value.length - 1];
    delete cache.length;
    return this.value.pop();
  };
  Pp.insertAt = function insertAt(index) {
    var argc = arguments.length;
    var move = getMoves(this, argc - 1, index);
    if (move === emptyMoves && argc <= 1) {
      return this;
    }
    index = Math.max(index, 0);
    for (var i = 1; i < argc; ++i) {
      this.value[index + i - 1] = arguments[i];
    }
    move();
    return this;
  };
  Pp.insertBefore = function insertBefore(...args) {
    var pp = this.parentPath;
    var argc = args.length;
    var insertAtArgs = [this.name];
    for (var i = 0; i < argc; ++i) {
      insertAtArgs.push(args[i]);
    }
    return pp.insertAt.apply(pp, insertAtArgs);
  };
  Pp.insertAfter = function insertAfter(...args) {
    var pp = this.parentPath;
    var argc = args.length;
    var insertAtArgs = [this.name + 1];
    for (var i = 0; i < argc; ++i) {
      insertAtArgs.push(args[i]);
    }
    return pp.insertAt.apply(pp, insertAtArgs);
  };
  function repairRelationshipWithParent(path) {
    if (!(path instanceof Path)) {
      throw new Error("");
    }
    var pp = path.parentPath;
    if (!pp) {
      return path;
    }
    var parentValue = pp.value;
    var parentCache = getChildCache(pp);
    if (parentValue[path.name] === path.value) {
      parentCache[path.name] = path;
    } else if (isArray.check(parentValue)) {
      var i = parentValue.indexOf(path.value);
      if (i >= 0) {
        parentCache[path.name = i] = path;
      }
    } else {
      parentValue[path.name] = path.value;
      parentCache[path.name] = path;
    }
    if (parentValue[path.name] !== path.value) {
      throw new Error("");
    }
    if (path.parentPath.get(path.name) !== path) {
      throw new Error("");
    }
    return path;
  }
  Pp.replace = function replace(replacement) {
    var results = [];
    var parentValue = this.parentPath.value;
    var parentCache = getChildCache(this.parentPath);
    var count = arguments.length;
    repairRelationshipWithParent(this);
    if (isArray.check(parentValue)) {
      var originalLength = parentValue.length;
      var move = getMoves(this.parentPath, count - 1, this.name + 1);
      var spliceArgs = [this.name, 1];
      for (var i = 0; i < count; ++i) {
        spliceArgs.push(arguments[i]);
      }
      var splicedOut = parentValue.splice.apply(parentValue, spliceArgs);
      if (splicedOut[0] !== this.value) {
        throw new Error("");
      }
      if (parentValue.length !== originalLength - 1 + count) {
        throw new Error("");
      }
      move();
      if (count === 0) {
        delete this.value;
        delete parentCache[this.name];
        this.__childCache = null;
      } else {
        if (parentValue[this.name] !== replacement) {
          throw new Error("");
        }
        if (this.value !== replacement) {
          this.value = replacement;
          this.__childCache = null;
        }
        for (i = 0; i < count; ++i) {
          results.push(this.parentPath.get(this.name + i));
        }
        if (results[0] !== this) {
          throw new Error("");
        }
      }
    } else if (count === 1) {
      if (this.value !== replacement) {
        this.__childCache = null;
      }
      this.value = parentValue[this.name] = replacement;
      results.push(this);
    } else if (count === 0) {
      delete parentValue[this.name];
      delete this.value;
      this.__childCache = null;
    } else {
      throw new Error("Could not replace path");
    }
    return results;
  };
  return Path;
}
maybeSetModuleExports(() => module);

var hasOwn$4 = Object.prototype.hasOwnProperty;
function scopePlugin(fork) {
  var types = fork.use(typesPlugin);
  var Type = types.Type;
  var namedTypes = types.namedTypes;
  var Node = namedTypes.Node;
  var Expression = namedTypes.Expression;
  var isArray = types.builtInTypes.array;
  var b = types.builders;
  const Scope = function Scope2(path, parentScope) {
    if (!(this instanceof Scope2)) {
      throw new Error("Scope constructor cannot be invoked without 'new'");
    }
    if (!TypeParameterScopeType.check(path.value)) {
      ScopeType.assert(path.value);
    }
    var depth;
    if (parentScope) {
      if (!(parentScope instanceof Scope2)) {
        throw new Error("");
      }
      depth = parentScope.depth + 1;
    } else {
      parentScope = null;
      depth = 0;
    }
    Object.defineProperties(this, {
      path: { value: path },
      node: { value: path.value },
      isGlobal: { value: !parentScope, enumerable: true },
      depth: { value: depth },
      parent: { value: parentScope },
      bindings: { value: {} },
      types: { value: {} }
    });
  };
  var ScopeType = Type.or(
    // Program nodes introduce global scopes.
    namedTypes.Program,
    // Function is the supertype of FunctionExpression,
    // FunctionDeclaration, ArrowExpression, etc.
    namedTypes.Function,
    // In case you didn't know, the caught parameter shadows any variable
    // of the same name in an outer scope.
    namedTypes.CatchClause
  );
  var TypeParameterScopeType = Type.or(
    namedTypes.Function,
    namedTypes.ClassDeclaration,
    namedTypes.ClassExpression,
    namedTypes.InterfaceDeclaration,
    namedTypes.TSInterfaceDeclaration,
    namedTypes.TypeAlias,
    namedTypes.TSTypeAliasDeclaration
  );
  var FlowOrTSTypeParameterType = Type.or(
    namedTypes.TypeParameter,
    namedTypes.TSTypeParameter
  );
  Scope.isEstablishedBy = function(node) {
    return ScopeType.check(node) || TypeParameterScopeType.check(node);
  };
  var Sp = Scope.prototype;
  Sp.didScan = false;
  Sp.declares = function(name) {
    this.scan();
    return hasOwn$4.call(this.bindings, name);
  };
  Sp.declaresType = function(name) {
    this.scan();
    return hasOwn$4.call(this.types, name);
  };
  Sp.declareTemporary = function(prefix) {
    if (prefix) {
      if (!/^[a-z$_]/i.test(prefix)) {
        throw new Error("");
      }
    } else {
      prefix = "t$";
    }
    prefix += this.depth.toString(36) + "$";
    this.scan();
    var index = 0;
    while (this.declares(prefix + index)) {
      ++index;
    }
    var name = prefix + index;
    return this.bindings[name] = types.builders.identifier(name);
  };
  Sp.injectTemporary = function(identifier, init) {
    identifier || (identifier = this.declareTemporary());
    var bodyPath = this.path.get("body");
    if (namedTypes.BlockStatement.check(bodyPath.value)) {
      bodyPath = bodyPath.get("body");
    }
    bodyPath.unshift(
      b.variableDeclaration(
        "var",
        [b.variableDeclarator(identifier, init || null)]
      )
    );
    return identifier;
  };
  Sp.scan = function(force) {
    if (force || !this.didScan) {
      for (var name in this.bindings) {
        delete this.bindings[name];
      }
      for (var name in this.types) {
        delete this.types[name];
      }
      scanScope(this.path, this.bindings, this.types);
      this.didScan = true;
    }
  };
  Sp.getBindings = function() {
    this.scan();
    return this.bindings;
  };
  Sp.getTypes = function() {
    this.scan();
    return this.types;
  };
  function scanScope(path, bindings, scopeTypes) {
    var node = path.value;
    if (TypeParameterScopeType.check(node)) {
      const params = path.get("typeParameters", "params");
      if (isArray.check(params.value)) {
        params.each((childPath) => {
          addTypeParameter(childPath, scopeTypes);
        });
      }
    }
    if (ScopeType.check(node)) {
      if (namedTypes.CatchClause.check(node)) {
        addPattern(path.get("param"), bindings);
      } else {
        recursiveScanScope(path, bindings, scopeTypes);
      }
    }
  }
  function recursiveScanScope(path, bindings, scopeTypes) {
    var node = path.value;
    if (path.parent && namedTypes.FunctionExpression.check(path.parent.node) && path.parent.node.id) {
      addPattern(path.parent.get("id"), bindings);
    }
    if (!node) ; else if (isArray.check(node)) {
      path.each((childPath) => {
        recursiveScanChild(childPath, bindings, scopeTypes);
      });
    } else if (namedTypes.Function.check(node)) {
      path.get("params").each((paramPath) => {
        addPattern(paramPath, bindings);
      });
      recursiveScanChild(path.get("body"), bindings, scopeTypes);
      recursiveScanScope(path.get("typeParameters"), bindings, scopeTypes);
    } else if (namedTypes.TypeAlias && namedTypes.TypeAlias.check(node) || namedTypes.InterfaceDeclaration && namedTypes.InterfaceDeclaration.check(node) || namedTypes.TSTypeAliasDeclaration && namedTypes.TSTypeAliasDeclaration.check(node) || namedTypes.TSInterfaceDeclaration && namedTypes.TSInterfaceDeclaration.check(node)) {
      addTypePattern(path.get("id"), scopeTypes);
    } else if (namedTypes.VariableDeclarator.check(node)) {
      addPattern(path.get("id"), bindings);
      recursiveScanChild(path.get("init"), bindings, scopeTypes);
    } else if (node.type === "ImportSpecifier" || node.type === "ImportNamespaceSpecifier" || node.type === "ImportDefaultSpecifier") {
      addPattern(
        // Esprima used to use the .name field to refer to the local
        // binding identifier for ImportSpecifier nodes, but .id for
        // ImportNamespaceSpecifier and ImportDefaultSpecifier nodes.
        // ESTree/Acorn/ESpree use .local for all three node types.
        path.get(node.local ? "local" : node.name ? "name" : "id"),
        bindings
      );
    } else if (Node.check(node) && !Expression.check(node)) {
      types.eachField(node, function(name, child) {
        var childPath = path.get(name);
        if (!pathHasValue(childPath, child)) {
          throw new Error("");
        }
        recursiveScanChild(childPath, bindings, scopeTypes);
      });
    }
  }
  function pathHasValue(path, value) {
    if (path.value === value) {
      return true;
    }
    if (Array.isArray(path.value) && path.value.length === 0 && Array.isArray(value) && value.length === 0) {
      return true;
    }
    return false;
  }
  function recursiveScanChild(path, bindings, scopeTypes) {
    var node = path.value;
    if (!node || Expression.check(node)) ; else if (namedTypes.FunctionDeclaration.check(node) && node.id !== null) {
      addPattern(path.get("id"), bindings);
    } else if (namedTypes.ClassDeclaration && namedTypes.ClassDeclaration.check(node) && node.id !== null) {
      addPattern(path.get("id"), bindings);
      recursiveScanScope(path.get("typeParameters"), bindings, scopeTypes);
    } else if (namedTypes.InterfaceDeclaration && namedTypes.InterfaceDeclaration.check(node) || namedTypes.TSInterfaceDeclaration && namedTypes.TSInterfaceDeclaration.check(node)) {
      addTypePattern(path.get("id"), scopeTypes);
    } else if (ScopeType.check(node)) {
      if (namedTypes.CatchClause.check(node) && // TODO Broaden this to accept any pattern.
      namedTypes.Identifier.check(node.param)) {
        var catchParamName = node.param.name;
        var hadBinding = hasOwn$4.call(bindings, catchParamName);
        recursiveScanScope(path.get("body"), bindings, scopeTypes);
        if (!hadBinding) {
          delete bindings[catchParamName];
        }
      }
    } else {
      recursiveScanScope(path, bindings, scopeTypes);
    }
  }
  function addPattern(patternPath, bindings) {
    var pattern = patternPath.value;
    namedTypes.Pattern.assert(pattern);
    if (namedTypes.Identifier.check(pattern)) {
      if (hasOwn$4.call(bindings, pattern.name)) {
        bindings[pattern.name].push(patternPath);
      } else {
        bindings[pattern.name] = [patternPath];
      }
    } else if (namedTypes.AssignmentPattern && namedTypes.AssignmentPattern.check(pattern)) {
      addPattern(patternPath.get("left"), bindings);
    } else if (namedTypes.ObjectPattern && namedTypes.ObjectPattern.check(pattern)) {
      patternPath.get("properties").each(function(propertyPath) {
        var property = propertyPath.value;
        if (namedTypes.Pattern.check(property)) {
          addPattern(propertyPath, bindings);
        } else if (namedTypes.Property.check(property) || namedTypes.ObjectProperty && namedTypes.ObjectProperty.check(property)) {
          addPattern(propertyPath.get("value"), bindings);
        } else if (namedTypes.SpreadProperty && namedTypes.SpreadProperty.check(property)) {
          addPattern(propertyPath.get("argument"), bindings);
        }
      });
    } else if (namedTypes.ArrayPattern && namedTypes.ArrayPattern.check(pattern)) {
      patternPath.get("elements").each(function(elementPath) {
        var element = elementPath.value;
        if (namedTypes.Pattern.check(element)) {
          addPattern(elementPath, bindings);
        } else if (namedTypes.SpreadElement && namedTypes.SpreadElement.check(element)) {
          addPattern(elementPath.get("argument"), bindings);
        }
      });
    } else if (namedTypes.PropertyPattern && namedTypes.PropertyPattern.check(pattern)) {
      addPattern(patternPath.get("pattern"), bindings);
    } else if (namedTypes.SpreadElementPattern && namedTypes.SpreadElementPattern.check(pattern) || namedTypes.RestElement && namedTypes.RestElement.check(pattern) || namedTypes.SpreadPropertyPattern && namedTypes.SpreadPropertyPattern.check(pattern)) {
      addPattern(patternPath.get("argument"), bindings);
    }
  }
  function addTypePattern(patternPath, types2) {
    var pattern = patternPath.value;
    namedTypes.Pattern.assert(pattern);
    if (namedTypes.Identifier.check(pattern)) {
      if (hasOwn$4.call(types2, pattern.name)) {
        types2[pattern.name].push(patternPath);
      } else {
        types2[pattern.name] = [patternPath];
      }
    }
  }
  function addTypeParameter(parameterPath, types2) {
    var parameter = parameterPath.value;
    FlowOrTSTypeParameterType.assert(parameter);
    if (hasOwn$4.call(types2, parameter.name)) {
      types2[parameter.name].push(parameterPath);
    } else {
      types2[parameter.name] = [parameterPath];
    }
  }
  Sp.lookup = function(name) {
    for (var scope = this; scope; scope = scope.parent)
      if (scope.declares(name))
        break;
    return scope;
  };
  Sp.lookupType = function(name) {
    for (var scope = this; scope; scope = scope.parent)
      if (scope.declaresType(name))
        break;
    return scope;
  };
  Sp.getGlobalScope = function() {
    var scope = this;
    while (!scope.isGlobal)
      scope = scope.parent;
    return scope;
  };
  return Scope;
}
maybeSetModuleExports(() => module);

function nodePathPlugin(fork) {
  var types = fork.use(typesPlugin);
  var n = types.namedTypes;
  var b = types.builders;
  var isNumber = types.builtInTypes.number;
  var isArray = types.builtInTypes.array;
  var Path2 = fork.use(pathPlugin);
  var Scope2 = fork.use(scopePlugin);
  const NodePath = function NodePath2(value, parentPath, name) {
    if (!(this instanceof NodePath2)) {
      throw new Error("NodePath constructor cannot be invoked without 'new'");
    }
    Path2.call(this, value, parentPath, name);
  };
  var NPp = NodePath.prototype = Object.create(Path2.prototype, {
    constructor: {
      value: NodePath,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperties(NPp, {
    node: {
      get: function() {
        Object.defineProperty(this, "node", {
          configurable: true,
          // Enable deletion.
          value: this._computeNode()
        });
        return this.node;
      }
    },
    parent: {
      get: function() {
        Object.defineProperty(this, "parent", {
          configurable: true,
          // Enable deletion.
          value: this._computeParent()
        });
        return this.parent;
      }
    },
    scope: {
      get: function() {
        Object.defineProperty(this, "scope", {
          configurable: true,
          // Enable deletion.
          value: this._computeScope()
        });
        return this.scope;
      }
    }
  });
  NPp.replace = function() {
    delete this.node;
    delete this.parent;
    delete this.scope;
    return Path2.prototype.replace.apply(this, arguments);
  };
  NPp.prune = function() {
    var remainingNodePath = this.parent;
    this.replace();
    return cleanUpNodesAfterPrune(remainingNodePath);
  };
  NPp._computeNode = function() {
    var value = this.value;
    if (n.Node.check(value)) {
      return value;
    }
    var pp = this.parentPath;
    return pp && pp.node || null;
  };
  NPp._computeParent = function() {
    var value = this.value;
    var pp = this.parentPath;
    if (!n.Node.check(value)) {
      while (pp && !n.Node.check(pp.value)) {
        pp = pp.parentPath;
      }
      if (pp) {
        pp = pp.parentPath;
      }
    }
    while (pp && !n.Node.check(pp.value)) {
      pp = pp.parentPath;
    }
    return pp || null;
  };
  NPp._computeScope = function() {
    var value = this.value;
    var pp = this.parentPath;
    var scope = pp && pp.scope;
    if (n.Node.check(value) && Scope2.isEstablishedBy(value)) {
      scope = new Scope2(this, scope);
    }
    return scope || null;
  };
  NPp.getValueProperty = function(name) {
    return types.getFieldValue(this.value, name);
  };
  NPp.needsParens = function(assumeExpressionContext) {
    var pp = this.parentPath;
    if (!pp) {
      return false;
    }
    var node = this.value;
    if (!n.Expression.check(node)) {
      return false;
    }
    if (node.type === "Identifier") {
      return false;
    }
    while (!n.Node.check(pp.value)) {
      pp = pp.parentPath;
      if (!pp) {
        return false;
      }
    }
    var parent = pp.value;
    switch (node.type) {
      case "UnaryExpression":
      case "SpreadElement":
      case "SpreadProperty":
        return parent.type === "MemberExpression" && this.name === "object" && parent.object === node;
      case "BinaryExpression":
      case "LogicalExpression":
        switch (parent.type) {
          case "CallExpression":
            return this.name === "callee" && parent.callee === node;
          case "UnaryExpression":
          case "SpreadElement":
          case "SpreadProperty":
            return true;
          case "MemberExpression":
            return this.name === "object" && parent.object === node;
          case "BinaryExpression":
          case "LogicalExpression": {
            const n2 = node;
            const po = parent.operator;
            const pp2 = PRECEDENCE[po];
            const no = n2.operator;
            const np = PRECEDENCE[no];
            if (pp2 > np) {
              return true;
            }
            if (pp2 === np && this.name === "right") {
              if (parent.right !== n2) {
                throw new Error("Nodes must be equal");
              }
              return true;
            }
          }
          default:
            return false;
        }
      case "SequenceExpression":
        switch (parent.type) {
          case "ForStatement":
            return false;
          case "ExpressionStatement":
            return this.name !== "expression";
          default:
            return true;
        }
      case "YieldExpression":
        switch (parent.type) {
          case "BinaryExpression":
          case "LogicalExpression":
          case "UnaryExpression":
          case "SpreadElement":
          case "SpreadProperty":
          case "CallExpression":
          case "MemberExpression":
          case "NewExpression":
          case "ConditionalExpression":
          case "YieldExpression":
            return true;
          default:
            return false;
        }
      case "Literal":
        return parent.type === "MemberExpression" && isNumber.check(node.value) && this.name === "object" && parent.object === node;
      case "AssignmentExpression":
      case "ConditionalExpression":
        switch (parent.type) {
          case "UnaryExpression":
          case "SpreadElement":
          case "SpreadProperty":
          case "BinaryExpression":
          case "LogicalExpression":
            return true;
          case "CallExpression":
            return this.name === "callee" && parent.callee === node;
          case "ConditionalExpression":
            return this.name === "test" && parent.test === node;
          case "MemberExpression":
            return this.name === "object" && parent.object === node;
          default:
            return false;
        }
      default:
        if (parent.type === "NewExpression" && this.name === "callee" && parent.callee === node) {
          return containsCallExpression(node);
        }
    }
    if (assumeExpressionContext !== true && !this.canBeFirstInStatement() && this.firstInStatement())
      return true;
    return false;
  };
  function isBinary(node) {
    return n.BinaryExpression.check(node) || n.LogicalExpression.check(node);
  }
  var PRECEDENCE = {};
  [
    ["||"],
    ["&&"],
    ["|"],
    ["^"],
    ["&"],
    ["==", "===", "!=", "!=="],
    ["<", ">", "<=", ">=", "in", "instanceof"],
    [">>", "<<", ">>>"],
    ["+", "-"],
    ["*", "/", "%"]
  ].forEach(function(tier, i) {
    tier.forEach(function(op) {
      PRECEDENCE[op] = i;
    });
  });
  function containsCallExpression(node) {
    if (n.CallExpression.check(node)) {
      return true;
    }
    if (isArray.check(node)) {
      return node.some(containsCallExpression);
    }
    if (n.Node.check(node)) {
      return types.someField(node, function(_name, child) {
        return containsCallExpression(child);
      });
    }
    return false;
  }
  NPp.canBeFirstInStatement = function() {
    var node = this.node;
    return !n.FunctionExpression.check(node) && !n.ObjectExpression.check(node);
  };
  NPp.firstInStatement = function() {
    return firstInStatement(this);
  };
  function firstInStatement(path) {
    for (var node, parent; path.parent; path = path.parent) {
      node = path.node;
      parent = path.parent.node;
      if (n.BlockStatement.check(parent) && path.parent.name === "body" && path.name === 0) {
        if (parent.body[0] !== node) {
          throw new Error("Nodes must be equal");
        }
        return true;
      }
      if (n.ExpressionStatement.check(parent) && path.name === "expression") {
        if (parent.expression !== node) {
          throw new Error("Nodes must be equal");
        }
        return true;
      }
      if (n.SequenceExpression.check(parent) && path.parent.name === "expressions" && path.name === 0) {
        if (parent.expressions[0] !== node) {
          throw new Error("Nodes must be equal");
        }
        continue;
      }
      if (n.CallExpression.check(parent) && path.name === "callee") {
        if (parent.callee !== node) {
          throw new Error("Nodes must be equal");
        }
        continue;
      }
      if (n.MemberExpression.check(parent) && path.name === "object") {
        if (parent.object !== node) {
          throw new Error("Nodes must be equal");
        }
        continue;
      }
      if (n.ConditionalExpression.check(parent) && path.name === "test") {
        if (parent.test !== node) {
          throw new Error("Nodes must be equal");
        }
        continue;
      }
      if (isBinary(parent) && path.name === "left") {
        if (parent.left !== node) {
          throw new Error("Nodes must be equal");
        }
        continue;
      }
      if (n.UnaryExpression.check(parent) && !parent.prefix && path.name === "argument") {
        if (parent.argument !== node) {
          throw new Error("Nodes must be equal");
        }
        continue;
      }
      return false;
    }
    return true;
  }
  function cleanUpNodesAfterPrune(remainingNodePath) {
    if (n.VariableDeclaration.check(remainingNodePath.node)) {
      var declarations = remainingNodePath.get("declarations").value;
      if (!declarations || declarations.length === 0) {
        return remainingNodePath.prune();
      }
    } else if (n.ExpressionStatement.check(remainingNodePath.node)) {
      if (!remainingNodePath.get("expression").value) {
        return remainingNodePath.prune();
      }
    } else if (n.IfStatement.check(remainingNodePath.node)) {
      cleanUpIfStatementAfterPrune(remainingNodePath);
    }
    return remainingNodePath;
  }
  function cleanUpIfStatementAfterPrune(ifStatement) {
    var testExpression = ifStatement.get("test").value;
    var alternate = ifStatement.get("alternate").value;
    var consequent = ifStatement.get("consequent").value;
    if (!consequent && !alternate) {
      var testExpressionStatement = b.expressionStatement(testExpression);
      ifStatement.replace(testExpressionStatement);
    } else if (!consequent && alternate) {
      var negatedTestExpression = b.unaryExpression("!", testExpression, true);
      if (n.UnaryExpression.check(testExpression) && testExpression.operator === "!") {
        negatedTestExpression = testExpression.argument;
      }
      ifStatement.get("test").replace(negatedTestExpression);
      ifStatement.get("consequent").replace(alternate);
      ifStatement.get("alternate").replace();
    }
  }
  return NodePath;
}
maybeSetModuleExports(() => module);

var hasOwn$3 = Object.prototype.hasOwnProperty;
function pathVisitorPlugin(fork) {
  var types = fork.use(typesPlugin);
  var NodePath2 = fork.use(nodePathPlugin);
  var isArray = types.builtInTypes.array;
  var isObject = types.builtInTypes.object;
  var isFunction = types.builtInTypes.function;
  var undefined$1;
  const PathVisitor = function PathVisitor2() {
    if (!(this instanceof PathVisitor2)) {
      throw new Error(
        "PathVisitor constructor cannot be invoked without 'new'"
      );
    }
    this._reusableContextStack = [];
    this._methodNameTable = computeMethodNameTable(this);
    this._shouldVisitComments = hasOwn$3.call(this._methodNameTable, "Block") || hasOwn$3.call(this._methodNameTable, "Line");
    this.Context = makeContextConstructor(this);
    this._visiting = false;
    this._changeReported = false;
  };
  function computeMethodNameTable(visitor) {
    var typeNames = /* @__PURE__ */ Object.create(null);
    for (var methodName in visitor) {
      if (/^visit[A-Z]/.test(methodName)) {
        typeNames[methodName.slice("visit".length)] = true;
      }
    }
    var supertypeTable = types.computeSupertypeLookupTable(typeNames);
    var methodNameTable = /* @__PURE__ */ Object.create(null);
    var typeNameKeys = Object.keys(supertypeTable);
    var typeNameCount = typeNameKeys.length;
    for (var i = 0; i < typeNameCount; ++i) {
      var typeName = typeNameKeys[i];
      methodName = "visit" + supertypeTable[typeName];
      if (isFunction.check(visitor[methodName])) {
        methodNameTable[typeName] = methodName;
      }
    }
    return methodNameTable;
  }
  PathVisitor.fromMethodsObject = function fromMethodsObject(methods) {
    if (methods instanceof PathVisitor) {
      return methods;
    }
    if (!isObject.check(methods)) {
      return new PathVisitor();
    }
    const Visitor = function Visitor2() {
      if (!(this instanceof Visitor2)) {
        throw new Error(
          "Visitor constructor cannot be invoked without 'new'"
        );
      }
      PathVisitor.call(this);
    };
    var Vp = Visitor.prototype = Object.create(PVp);
    Vp.constructor = Visitor;
    extend(Vp, methods);
    extend(Visitor, PathVisitor);
    isFunction.assert(Visitor.fromMethodsObject);
    isFunction.assert(Visitor.visit);
    return new Visitor();
  };
  function extend(target, source) {
    for (var property in source) {
      if (hasOwn$3.call(source, property)) {
        target[property] = source[property];
      }
    }
    return target;
  }
  PathVisitor.visit = function visit(node, methods) {
    return PathVisitor.fromMethodsObject(methods).visit(node);
  };
  var PVp = PathVisitor.prototype;
  PVp.visit = function() {
    if (this._visiting) {
      throw new Error(
        "Recursively calling visitor.visit(path) resets visitor state. Try this.visit(path) or this.traverse(path) instead."
      );
    }
    this._visiting = true;
    this._changeReported = false;
    this._abortRequested = false;
    var argc = arguments.length;
    var args = new Array(argc);
    for (var i = 0; i < argc; ++i) {
      args[i] = arguments[i];
    }
    if (!(args[0] instanceof NodePath2)) {
      args[0] = new NodePath2({ root: args[0] }).get("root");
    }
    this.reset.apply(this, args);
    var didNotThrow;
    try {
      var root = this.visitWithoutReset(args[0]);
      didNotThrow = true;
    } finally {
      this._visiting = false;
      if (!didNotThrow && this._abortRequested) {
        return args[0].value;
      }
    }
    return root;
  };
  PVp.AbortRequest = function AbortRequest() {
  };
  PVp.abort = function() {
    var visitor = this;
    visitor._abortRequested = true;
    var request = new visitor.AbortRequest();
    request.cancel = function() {
      visitor._abortRequested = false;
    };
    throw request;
  };
  PVp.reset = function(_path) {
  };
  PVp.visitWithoutReset = function(path) {
    if (this instanceof this.Context) {
      return this.visitor.visitWithoutReset(path);
    }
    if (!(path instanceof NodePath2)) {
      throw new Error("");
    }
    var value = path.value;
    var methodName = value && typeof value === "object" && typeof value.type === "string" && this._methodNameTable[value.type];
    if (methodName) {
      var context = this.acquireContext(path);
      try {
        return context.invokeVisitorMethod(methodName);
      } finally {
        this.releaseContext(context);
      }
    } else {
      return visitChildren(path, this);
    }
  };
  function visitChildren(path, visitor) {
    if (!(path instanceof NodePath2)) {
      throw new Error("");
    }
    if (!(visitor instanceof PathVisitor)) {
      throw new Error("");
    }
    var value = path.value;
    if (isArray.check(value)) {
      path.each(visitor.visitWithoutReset, visitor);
    } else if (!isObject.check(value)) ; else {
      var childNames = types.getFieldNames(value);
      if (visitor._shouldVisitComments && value.comments && childNames.indexOf("comments") < 0) {
        childNames.push("comments");
      }
      var childCount = childNames.length;
      var childPaths = [];
      for (var i = 0; i < childCount; ++i) {
        var childName = childNames[i];
        if (!hasOwn$3.call(value, childName)) {
          value[childName] = types.getFieldValue(value, childName);
        }
        childPaths.push(path.get(childName));
      }
      for (var i = 0; i < childCount; ++i) {
        visitor.visitWithoutReset(childPaths[i]);
      }
    }
    return path.value;
  }
  PVp.acquireContext = function(path) {
    if (this._reusableContextStack.length === 0) {
      return new this.Context(path);
    }
    return this._reusableContextStack.pop().reset(path);
  };
  PVp.releaseContext = function(context) {
    if (!(context instanceof this.Context)) {
      throw new Error("");
    }
    this._reusableContextStack.push(context);
    context.currentPath = null;
  };
  PVp.reportChanged = function() {
    this._changeReported = true;
  };
  PVp.wasChangeReported = function() {
    return this._changeReported;
  };
  function makeContextConstructor(visitor) {
    function Context(path) {
      if (!(this instanceof Context)) {
        throw new Error("");
      }
      if (!(this instanceof PathVisitor)) {
        throw new Error("");
      }
      if (!(path instanceof NodePath2)) {
        throw new Error("");
      }
      Object.defineProperty(this, "visitor", {
        value: visitor,
        writable: false,
        enumerable: true,
        configurable: false
      });
      this.currentPath = path;
      this.needToCallTraverse = true;
      Object.seal(this);
    }
    if (!(visitor instanceof PathVisitor)) {
      throw new Error("");
    }
    var Cp = Context.prototype = Object.create(visitor);
    Cp.constructor = Context;
    extend(Cp, sharedContextProtoMethods);
    return Context;
  }
  var sharedContextProtoMethods = /* @__PURE__ */ Object.create(null);
  sharedContextProtoMethods.reset = function reset(path) {
    if (!(this instanceof this.Context)) {
      throw new Error("");
    }
    if (!(path instanceof NodePath2)) {
      throw new Error("");
    }
    this.currentPath = path;
    this.needToCallTraverse = true;
    return this;
  };
  sharedContextProtoMethods.invokeVisitorMethod = function invokeVisitorMethod(methodName) {
    if (!(this instanceof this.Context)) {
      throw new Error("");
    }
    if (!(this.currentPath instanceof NodePath2)) {
      throw new Error("");
    }
    var result = this.visitor[methodName].call(this, this.currentPath);
    if (result === false) {
      this.needToCallTraverse = false;
    } else if (result !== undefined$1) {
      this.currentPath = this.currentPath.replace(result)[0];
      if (this.needToCallTraverse) {
        this.traverse(this.currentPath);
      }
    }
    if (this.needToCallTraverse !== false) {
      throw new Error(
        "Must either call this.traverse or return false in " + methodName
      );
    }
    var path = this.currentPath;
    return path && path.value;
  };
  sharedContextProtoMethods.traverse = function traverse(path, newVisitor) {
    if (!(this instanceof this.Context)) {
      throw new Error("");
    }
    if (!(path instanceof NodePath2)) {
      throw new Error("");
    }
    if (!(this.currentPath instanceof NodePath2)) {
      throw new Error("");
    }
    this.needToCallTraverse = false;
    return visitChildren(path, PathVisitor.fromMethodsObject(
      newVisitor || this.visitor
    ));
  };
  sharedContextProtoMethods.visit = function visit(path, newVisitor) {
    if (!(this instanceof this.Context)) {
      throw new Error("");
    }
    if (!(path instanceof NodePath2)) {
      throw new Error("");
    }
    if (!(this.currentPath instanceof NodePath2)) {
      throw new Error("");
    }
    this.needToCallTraverse = false;
    return PathVisitor.fromMethodsObject(
      newVisitor || this.visitor
    ).visitWithoutReset(path);
  };
  sharedContextProtoMethods.reportChanged = function reportChanged() {
    this.visitor.reportChanged();
  };
  sharedContextProtoMethods.abort = function abort() {
    this.needToCallTraverse = false;
    this.visitor.abort();
  };
  return PathVisitor;
}
maybeSetModuleExports(() => module);

function equivPlugin(fork) {
  var types = fork.use(typesPlugin);
  var getFieldNames = types.getFieldNames;
  var getFieldValue = types.getFieldValue;
  var isArray = types.builtInTypes.array;
  var isObject = types.builtInTypes.object;
  var isDate = types.builtInTypes.Date;
  var isRegExp = types.builtInTypes.RegExp;
  var hasOwn = Object.prototype.hasOwnProperty;
  function astNodesAreEquivalent(a, b, problemPath) {
    if (isArray.check(problemPath)) {
      problemPath.length = 0;
    } else {
      problemPath = null;
    }
    return areEquivalent(a, b, problemPath);
  }
  astNodesAreEquivalent.assert = function(a, b) {
    var problemPath = [];
    if (!astNodesAreEquivalent(a, b, problemPath)) {
      if (problemPath.length === 0) {
        if (a !== b) {
          throw new Error("Nodes must be equal");
        }
      } else {
        throw new Error(
          "Nodes differ in the following path: " + problemPath.map(subscriptForProperty).join("")
        );
      }
    }
  };
  function subscriptForProperty(property) {
    if (/[_$a-z][_$a-z0-9]*/i.test(property)) {
      return "." + property;
    }
    return "[" + JSON.stringify(property) + "]";
  }
  function areEquivalent(a, b, problemPath) {
    if (a === b) {
      return true;
    }
    if (isArray.check(a)) {
      return arraysAreEquivalent(a, b, problemPath);
    }
    if (isObject.check(a)) {
      return objectsAreEquivalent(a, b, problemPath);
    }
    if (isDate.check(a)) {
      return isDate.check(b) && +a === +b;
    }
    if (isRegExp.check(a)) {
      return isRegExp.check(b) && (a.source === b.source && a.global === b.global && a.multiline === b.multiline && a.ignoreCase === b.ignoreCase);
    }
    return a == b;
  }
  function arraysAreEquivalent(a, b, problemPath) {
    isArray.assert(a);
    var aLength = a.length;
    if (!isArray.check(b) || b.length !== aLength) {
      if (problemPath) {
        problemPath.push("length");
      }
      return false;
    }
    for (var i = 0; i < aLength; ++i) {
      if (problemPath) {
        problemPath.push(i);
      }
      if (i in a !== i in b) {
        return false;
      }
      if (!areEquivalent(a[i], b[i], problemPath)) {
        return false;
      }
      if (problemPath) {
        var problemPathTail = problemPath.pop();
        if (problemPathTail !== i) {
          throw new Error("" + problemPathTail);
        }
      }
    }
    return true;
  }
  function objectsAreEquivalent(a, b, problemPath) {
    isObject.assert(a);
    if (!isObject.check(b)) {
      return false;
    }
    if (a.type !== b.type) {
      if (problemPath) {
        problemPath.push("type");
      }
      return false;
    }
    var aNames = getFieldNames(a);
    var aNameCount = aNames.length;
    var bNames = getFieldNames(b);
    var bNameCount = bNames.length;
    if (aNameCount === bNameCount) {
      for (var i = 0; i < aNameCount; ++i) {
        var name = aNames[i];
        var aChild = getFieldValue(a, name);
        var bChild = getFieldValue(b, name);
        if (problemPath) {
          problemPath.push(name);
        }
        if (!areEquivalent(aChild, bChild, problemPath)) {
          return false;
        }
        if (problemPath) {
          var problemPathTail = problemPath.pop();
          if (problemPathTail !== name) {
            throw new Error("" + problemPathTail);
          }
        }
      }
      return true;
    }
    if (!problemPath) {
      return false;
    }
    var seenNames = /* @__PURE__ */ Object.create(null);
    for (i = 0; i < aNameCount; ++i) {
      seenNames[aNames[i]] = true;
    }
    for (i = 0; i < bNameCount; ++i) {
      name = bNames[i];
      if (!hasOwn.call(seenNames, name)) {
        problemPath.push(name);
        return false;
      }
      delete seenNames[name];
    }
    for (name in seenNames) {
      problemPath.push(name);
      break;
    }
    return false;
  }
  return astNodesAreEquivalent;
}
maybeSetModuleExports(() => module);

function fork(plugins) {
  const fork = createFork();
  const types = fork.use(typesPlugin);
  plugins.forEach(fork.use);
  types.finalize();
  const PathVisitor = fork.use(pathVisitorPlugin);
  return {
    Type: types.Type,
    builtInTypes: types.builtInTypes,
    namedTypes: types.namedTypes,
    builders: types.builders,
    defineMethod: types.defineMethod,
    getFieldNames: types.getFieldNames,
    getFieldValue: types.getFieldValue,
    eachField: types.eachField,
    someField: types.someField,
    getSupertypeNames: types.getSupertypeNames,
    getBuilderName: types.getBuilderName,
    astNodesAreEquivalent: fork.use(equivPlugin),
    finalize: types.finalize,
    Path: fork.use(pathPlugin),
    NodePath: fork.use(nodePathPlugin),
    PathVisitor,
    use: fork.use,
    visit: PathVisitor.visit
  };
}
function createFork() {
  const used = [];
  const usedResult = [];
  function use(plugin) {
    var idx = used.indexOf(plugin);
    if (idx === -1) {
      idx = used.length;
      used.push(plugin);
      usedResult[idx] = plugin(fork);
    }
    return usedResult[idx];
  }
  var fork = { use };
  return fork;
}
maybeSetModuleExports(() => module);

function coreOpsDef() {
  return {
    BinaryOperators: [
      "==",
      "!=",
      "===",
      "!==",
      "<",
      "<=",
      ">",
      ">=",
      "<<",
      ">>",
      ">>>",
      "+",
      "-",
      "*",
      "/",
      "%",
      "&",
      "|",
      "^",
      "in",
      "instanceof"
    ],
    AssignmentOperators: [
      "=",
      "+=",
      "-=",
      "*=",
      "/=",
      "%=",
      "<<=",
      ">>=",
      ">>>=",
      "|=",
      "^=",
      "&="
    ],
    LogicalOperators: [
      "||",
      "&&"
    ]
  };
}
maybeSetModuleExports(() => module);

function es2016OpsDef(fork) {
  const result = fork.use(coreOpsDef);
  if (result.BinaryOperators.indexOf("**") < 0) {
    result.BinaryOperators.push("**");
  }
  if (result.AssignmentOperators.indexOf("**=") < 0) {
    result.AssignmentOperators.push("**=");
  }
  return result;
}
maybeSetModuleExports(() => module);

function es2020OpsDef(fork) {
  const result = fork.use(es2016OpsDef);
  if (result.LogicalOperators.indexOf("??") < 0) {
    result.LogicalOperators.push("??");
  }
  return result;
}
maybeSetModuleExports(() => module);

function es2021OpsDef(fork) {
  const result = fork.use(es2020OpsDef);
  result.LogicalOperators.forEach((op) => {
    const assignOp = op + "=";
    if (result.AssignmentOperators.indexOf(assignOp) < 0) {
      result.AssignmentOperators.push(assignOp);
    }
  });
  return result;
}
maybeSetModuleExports(() => module);

function coreDef(fork) {
  var types = fork.use(typesPlugin);
  var Type = types.Type;
  var def = Type.def;
  var or = Type.or;
  var shared = fork.use(sharedPlugin);
  var defaults = shared.defaults;
  var geq = shared.geq;
  const {
    BinaryOperators,
    AssignmentOperators,
    LogicalOperators
  } = fork.use(coreOpsDef);
  def("Printable").field("loc", or(
    def("SourceLocation"),
    null
  ), defaults["null"], true);
  def("Node").bases("Printable").field("type", String).field("comments", or(
    [def("Comment")],
    null
  ), defaults["null"], true);
  def("SourceLocation").field("start", def("Position")).field("end", def("Position")).field("source", or(String, null), defaults["null"]);
  def("Position").field("line", geq(1)).field("column", geq(0));
  def("File").bases("Node").build("program", "name").field("program", def("Program")).field("name", or(String, null), defaults["null"]);
  def("Program").bases("Node").build("body").field("body", [def("Statement")]);
  def("Function").bases("Node").field("id", or(def("Identifier"), null), defaults["null"]).field("params", [def("Pattern")]).field("body", def("BlockStatement")).field("generator", Boolean, defaults["false"]).field("async", Boolean, defaults["false"]);
  def("Statement").bases("Node");
  def("EmptyStatement").bases("Statement").build();
  def("BlockStatement").bases("Statement").build("body").field("body", [def("Statement")]);
  def("ExpressionStatement").bases("Statement").build("expression").field("expression", def("Expression"));
  def("IfStatement").bases("Statement").build("test", "consequent", "alternate").field("test", def("Expression")).field("consequent", def("Statement")).field("alternate", or(def("Statement"), null), defaults["null"]);
  def("LabeledStatement").bases("Statement").build("label", "body").field("label", def("Identifier")).field("body", def("Statement"));
  def("BreakStatement").bases("Statement").build("label").field("label", or(def("Identifier"), null), defaults["null"]);
  def("ContinueStatement").bases("Statement").build("label").field("label", or(def("Identifier"), null), defaults["null"]);
  def("WithStatement").bases("Statement").build("object", "body").field("object", def("Expression")).field("body", def("Statement"));
  def("SwitchStatement").bases("Statement").build("discriminant", "cases", "lexical").field("discriminant", def("Expression")).field("cases", [def("SwitchCase")]).field("lexical", Boolean, defaults["false"]);
  def("ReturnStatement").bases("Statement").build("argument").field("argument", or(def("Expression"), null));
  def("ThrowStatement").bases("Statement").build("argument").field("argument", def("Expression"));
  def("TryStatement").bases("Statement").build("block", "handler", "finalizer").field("block", def("BlockStatement")).field("handler", or(def("CatchClause"), null), function() {
    return this.handlers && this.handlers[0] || null;
  }).field("handlers", [def("CatchClause")], function() {
    return this.handler ? [this.handler] : [];
  }, true).field("guardedHandlers", [def("CatchClause")], defaults.emptyArray).field("finalizer", or(def("BlockStatement"), null), defaults["null"]);
  def("CatchClause").bases("Node").build("param", "guard", "body").field("param", def("Pattern")).field("guard", or(def("Expression"), null), defaults["null"]).field("body", def("BlockStatement"));
  def("WhileStatement").bases("Statement").build("test", "body").field("test", def("Expression")).field("body", def("Statement"));
  def("DoWhileStatement").bases("Statement").build("body", "test").field("body", def("Statement")).field("test", def("Expression"));
  def("ForStatement").bases("Statement").build("init", "test", "update", "body").field("init", or(
    def("VariableDeclaration"),
    def("Expression"),
    null
  )).field("test", or(def("Expression"), null)).field("update", or(def("Expression"), null)).field("body", def("Statement"));
  def("ForInStatement").bases("Statement").build("left", "right", "body").field("left", or(
    def("VariableDeclaration"),
    def("Expression")
  )).field("right", def("Expression")).field("body", def("Statement"));
  def("DebuggerStatement").bases("Statement").build();
  def("Declaration").bases("Statement");
  def("FunctionDeclaration").bases("Function", "Declaration").build("id", "params", "body").field("id", def("Identifier"));
  def("FunctionExpression").bases("Function", "Expression").build("id", "params", "body");
  def("VariableDeclaration").bases("Declaration").build("kind", "declarations").field("kind", or("var", "let", "const")).field("declarations", [def("VariableDeclarator")]);
  def("VariableDeclarator").bases("Node").build("id", "init").field("id", def("Pattern")).field("init", or(def("Expression"), null), defaults["null"]);
  def("Expression").bases("Node");
  def("ThisExpression").bases("Expression").build();
  def("ArrayExpression").bases("Expression").build("elements").field("elements", [or(def("Expression"), null)]);
  def("ObjectExpression").bases("Expression").build("properties").field("properties", [def("Property")]);
  def("Property").bases("Node").build("kind", "key", "value").field("kind", or("init", "get", "set")).field("key", or(def("Literal"), def("Identifier"))).field("value", def("Expression"));
  def("SequenceExpression").bases("Expression").build("expressions").field("expressions", [def("Expression")]);
  var UnaryOperator = or(
    "-",
    "+",
    "!",
    "~",
    "typeof",
    "void",
    "delete"
  );
  def("UnaryExpression").bases("Expression").build("operator", "argument", "prefix").field("operator", UnaryOperator).field("argument", def("Expression")).field("prefix", Boolean, defaults["true"]);
  const BinaryOperator = or(...BinaryOperators);
  def("BinaryExpression").bases("Expression").build("operator", "left", "right").field("operator", BinaryOperator).field("left", def("Expression")).field("right", def("Expression"));
  const AssignmentOperator = or(...AssignmentOperators);
  def("AssignmentExpression").bases("Expression").build("operator", "left", "right").field("operator", AssignmentOperator).field("left", or(def("Pattern"), def("MemberExpression"))).field("right", def("Expression"));
  var UpdateOperator = or("++", "--");
  def("UpdateExpression").bases("Expression").build("operator", "argument", "prefix").field("operator", UpdateOperator).field("argument", def("Expression")).field("prefix", Boolean);
  var LogicalOperator = or(...LogicalOperators);
  def("LogicalExpression").bases("Expression").build("operator", "left", "right").field("operator", LogicalOperator).field("left", def("Expression")).field("right", def("Expression"));
  def("ConditionalExpression").bases("Expression").build("test", "consequent", "alternate").field("test", def("Expression")).field("consequent", def("Expression")).field("alternate", def("Expression"));
  def("NewExpression").bases("Expression").build("callee", "arguments").field("callee", def("Expression")).field("arguments", [def("Expression")]);
  def("CallExpression").bases("Expression").build("callee", "arguments").field("callee", def("Expression")).field("arguments", [def("Expression")]);
  def("MemberExpression").bases("Expression").build("object", "property", "computed").field("object", def("Expression")).field("property", or(def("Identifier"), def("Expression"))).field("computed", Boolean, function() {
    var type = this.property.type;
    if (type === "Literal" || type === "MemberExpression" || type === "BinaryExpression") {
      return true;
    }
    return false;
  });
  def("Pattern").bases("Node");
  def("SwitchCase").bases("Node").build("test", "consequent").field("test", or(def("Expression"), null)).field("consequent", [def("Statement")]);
  def("Identifier").bases("Expression", "Pattern").build("name").field("name", String).field("optional", Boolean, defaults["false"]);
  def("Literal").bases("Expression").build("value").field("value", or(String, Boolean, null, Number, RegExp, BigInt));
  def("Comment").bases("Printable").field("value", String).field("leading", Boolean, defaults["true"]).field("trailing", Boolean, defaults["false"]);
}
maybeSetModuleExports(() => module);

function es6Def(fork) {
  fork.use(coreDef);
  const types = fork.use(typesPlugin);
  const def = types.Type.def;
  const or = types.Type.or;
  const defaults = fork.use(sharedPlugin).defaults;
  def("Function").field("generator", Boolean, defaults["false"]).field("expression", Boolean, defaults["false"]).field("defaults", [or(def("Expression"), null)], defaults.emptyArray).field("rest", or(def("Identifier"), null), defaults["null"]);
  def("RestElement").bases("Pattern").build("argument").field("argument", def("Pattern")).field(
    "typeAnnotation",
    // for Babylon. Flow parser puts it on the identifier
    or(def("TypeAnnotation"), def("TSTypeAnnotation"), null),
    defaults["null"]
  );
  def("SpreadElementPattern").bases("Pattern").build("argument").field("argument", def("Pattern"));
  def("FunctionDeclaration").build("id", "params", "body", "generator", "expression").field("id", or(def("Identifier"), null));
  def("FunctionExpression").build("id", "params", "body", "generator", "expression");
  def("ArrowFunctionExpression").bases("Function", "Expression").build("params", "body", "expression").field("id", null, defaults["null"]).field("body", or(def("BlockStatement"), def("Expression"))).field("generator", false, defaults["false"]);
  def("ForOfStatement").bases("Statement").build("left", "right", "body").field("left", or(
    def("VariableDeclaration"),
    def("Pattern")
  )).field("right", def("Expression")).field("body", def("Statement"));
  def("YieldExpression").bases("Expression").build("argument", "delegate").field("argument", or(def("Expression"), null)).field("delegate", Boolean, defaults["false"]);
  def("GeneratorExpression").bases("Expression").build("body", "blocks", "filter").field("body", def("Expression")).field("blocks", [def("ComprehensionBlock")]).field("filter", or(def("Expression"), null));
  def("ComprehensionExpression").bases("Expression").build("body", "blocks", "filter").field("body", def("Expression")).field("blocks", [def("ComprehensionBlock")]).field("filter", or(def("Expression"), null));
  def("ComprehensionBlock").bases("Node").build("left", "right", "each").field("left", def("Pattern")).field("right", def("Expression")).field("each", Boolean);
  def("Property").field("key", or(def("Literal"), def("Identifier"), def("Expression"))).field("value", or(def("Expression"), def("Pattern"))).field("method", Boolean, defaults["false"]).field("shorthand", Boolean, defaults["false"]).field("computed", Boolean, defaults["false"]);
  def("ObjectProperty").field("shorthand", Boolean, defaults["false"]);
  def("PropertyPattern").bases("Pattern").build("key", "pattern").field("key", or(def("Literal"), def("Identifier"), def("Expression"))).field("pattern", def("Pattern")).field("computed", Boolean, defaults["false"]);
  def("ObjectPattern").bases("Pattern").build("properties").field("properties", [or(def("PropertyPattern"), def("Property"))]);
  def("ArrayPattern").bases("Pattern").build("elements").field("elements", [or(def("Pattern"), null)]);
  def("SpreadElement").bases("Node").build("argument").field("argument", def("Expression"));
  def("ArrayExpression").field("elements", [or(
    def("Expression"),
    def("SpreadElement"),
    def("RestElement"),
    null
  )]);
  def("NewExpression").field("arguments", [or(def("Expression"), def("SpreadElement"))]);
  def("CallExpression").field("arguments", [or(def("Expression"), def("SpreadElement"))]);
  def("AssignmentPattern").bases("Pattern").build("left", "right").field("left", def("Pattern")).field("right", def("Expression"));
  def("MethodDefinition").bases("Declaration").build("kind", "key", "value", "static").field("kind", or("constructor", "method", "get", "set")).field("key", def("Expression")).field("value", def("Function")).field("computed", Boolean, defaults["false"]).field("static", Boolean, defaults["false"]);
  const ClassBodyElement = or(
    def("MethodDefinition"),
    def("VariableDeclarator"),
    def("ClassPropertyDefinition"),
    def("ClassProperty"),
    def("StaticBlock")
  );
  def("ClassProperty").bases("Declaration").build("key").field("key", or(def("Literal"), def("Identifier"), def("Expression"))).field("computed", Boolean, defaults["false"]);
  def("ClassPropertyDefinition").bases("Declaration").build("definition").field("definition", ClassBodyElement);
  def("ClassBody").bases("Declaration").build("body").field("body", [ClassBodyElement]);
  def("ClassDeclaration").bases("Declaration").build("id", "body", "superClass").field("id", or(def("Identifier"), null)).field("body", def("ClassBody")).field("superClass", or(def("Expression"), null), defaults["null"]);
  def("ClassExpression").bases("Expression").build("id", "body", "superClass").field("id", or(def("Identifier"), null), defaults["null"]).field("body", def("ClassBody")).field("superClass", or(def("Expression"), null), defaults["null"]);
  def("Super").bases("Expression").build();
  def("Specifier").bases("Node");
  def("ModuleSpecifier").bases("Specifier").field("local", or(def("Identifier"), null), defaults["null"]).field("id", or(def("Identifier"), null), defaults["null"]).field("name", or(def("Identifier"), null), defaults["null"]);
  def("ImportSpecifier").bases("ModuleSpecifier").build("imported", "local").field("imported", def("Identifier"));
  def("ImportDefaultSpecifier").bases("ModuleSpecifier").build("local");
  def("ImportNamespaceSpecifier").bases("ModuleSpecifier").build("local");
  def("ImportDeclaration").bases("Declaration").build("specifiers", "source", "importKind").field("specifiers", [or(
    def("ImportSpecifier"),
    def("ImportNamespaceSpecifier"),
    def("ImportDefaultSpecifier")
  )], defaults.emptyArray).field("source", def("Literal")).field("importKind", or(
    "value",
    "type"
  ), function() {
    return "value";
  });
  def("ExportNamedDeclaration").bases("Declaration").build("declaration", "specifiers", "source").field("declaration", or(def("Declaration"), null)).field("specifiers", [def("ExportSpecifier")], defaults.emptyArray).field("source", or(def("Literal"), null), defaults["null"]);
  def("ExportSpecifier").bases("ModuleSpecifier").build("local", "exported").field("exported", def("Identifier"));
  def("ExportDefaultDeclaration").bases("Declaration").build("declaration").field("declaration", or(def("Declaration"), def("Expression")));
  def("ExportAllDeclaration").bases("Declaration").build("source").field("source", def("Literal"));
  def("TaggedTemplateExpression").bases("Expression").build("tag", "quasi").field("tag", def("Expression")).field("quasi", def("TemplateLiteral"));
  def("TemplateLiteral").bases("Expression").build("quasis", "expressions").field("quasis", [def("TemplateElement")]).field("expressions", [def("Expression")]);
  def("TemplateElement").bases("Node").build("value", "tail").field("value", { "cooked": String, "raw": String }).field("tail", Boolean);
  def("MetaProperty").bases("Expression").build("meta", "property").field("meta", def("Identifier")).field("property", def("Identifier"));
}
maybeSetModuleExports(() => module);

function es2016Def(fork) {
  fork.use(es2016OpsDef);
  fork.use(es6Def);
}
maybeSetModuleExports(() => module);

function es2017Def(fork) {
  fork.use(es2016Def);
  const types = fork.use(typesPlugin);
  const def = types.Type.def;
  const defaults = fork.use(sharedPlugin).defaults;
  def("Function").field("async", Boolean, defaults["false"]);
  def("AwaitExpression").bases("Expression").build("argument").field("argument", def("Expression"));
}
maybeSetModuleExports(() => module);

function es2018Def(fork) {
  fork.use(es2017Def);
  const types = fork.use(typesPlugin);
  const def = types.Type.def;
  const or = types.Type.or;
  const defaults = fork.use(sharedPlugin).defaults;
  def("ForOfStatement").field("await", Boolean, defaults["false"]);
  def("SpreadProperty").bases("Node").build("argument").field("argument", def("Expression"));
  def("ObjectExpression").field("properties", [or(
    def("Property"),
    def("SpreadProperty"),
    // Legacy
    def("SpreadElement")
  )]);
  def("TemplateElement").field("value", { "cooked": or(String, null), "raw": String });
  def("SpreadPropertyPattern").bases("Pattern").build("argument").field("argument", def("Pattern"));
  def("ObjectPattern").field("properties", [or(def("PropertyPattern"), def("Property"), def("RestElement"), def("SpreadPropertyPattern"))]);
}
maybeSetModuleExports(() => module);

function es2019Def(fork) {
  fork.use(es2018Def);
  const types = fork.use(typesPlugin);
  const def = types.Type.def;
  const or = types.Type.or;
  const defaults = fork.use(sharedPlugin).defaults;
  def("CatchClause").field("param", or(def("Pattern"), null), defaults["null"]);
}
maybeSetModuleExports(() => module);

function es2020Def(fork) {
  fork.use(es2020OpsDef);
  fork.use(es2019Def);
  const types = fork.use(typesPlugin);
  const def = types.Type.def;
  const or = types.Type.or;
  const shared = fork.use(sharedPlugin);
  const defaults = shared.defaults;
  def("ImportExpression").bases("Expression").build("source").field("source", def("Expression"));
  def("ExportAllDeclaration").bases("Declaration").build("source", "exported").field("source", def("Literal")).field("exported", or(
    def("Identifier"),
    null,
    void 0
  ), defaults["null"]);
  def("ChainElement").bases("Node").field("optional", Boolean, defaults["false"]);
  def("CallExpression").bases("Expression", "ChainElement");
  def("MemberExpression").bases("Expression", "ChainElement");
  def("ChainExpression").bases("Expression").build("expression").field("expression", def("ChainElement"));
  def("OptionalCallExpression").bases("CallExpression").build("callee", "arguments", "optional").field("optional", Boolean, defaults["true"]);
  def("OptionalMemberExpression").bases("MemberExpression").build("object", "property", "computed", "optional").field("optional", Boolean, defaults["true"]);
}
maybeSetModuleExports(() => module);

function es2021Def(fork) {
  fork.use(es2021OpsDef);
  fork.use(es2020Def);
}
maybeSetModuleExports(() => module);

function es2022Def(fork) {
  fork.use(es2021Def);
  const types = fork.use(typesPlugin);
  const def = types.Type.def;
  def("StaticBlock").bases("Declaration").build("body").field("body", [def("Statement")]);
}
maybeSetModuleExports(() => module);

function esProposalsDef(fork) {
  fork.use(es2022Def);
  const types = fork.use(typesPlugin);
  const Type = types.Type;
  const def = types.Type.def;
  const or = Type.or;
  const shared = fork.use(sharedPlugin);
  const defaults = shared.defaults;
  def("AwaitExpression").build("argument", "all").field("argument", or(def("Expression"), null)).field("all", Boolean, defaults["false"]);
  def("Decorator").bases("Node").build("expression").field("expression", def("Expression"));
  def("Property").field(
    "decorators",
    or([def("Decorator")], null),
    defaults["null"]
  );
  def("MethodDefinition").field(
    "decorators",
    or([def("Decorator")], null),
    defaults["null"]
  );
  def("PrivateName").bases("Expression", "Pattern").build("id").field("id", def("Identifier"));
  def("ClassPrivateProperty").bases("ClassProperty").build("key", "value").field("key", def("PrivateName")).field("value", or(def("Expression"), null), defaults["null"]);
  def("ImportAttribute").bases("Node").build("key", "value").field("key", or(def("Identifier"), def("Literal"))).field("value", def("Expression"));
  [
    "ImportDeclaration",
    "ExportAllDeclaration",
    "ExportNamedDeclaration"
  ].forEach((decl) => {
    def(decl).field(
      "assertions",
      [def("ImportAttribute")],
      defaults.emptyArray
    );
  });
  def("RecordExpression").bases("Expression").build("properties").field("properties", [or(
    def("ObjectProperty"),
    def("ObjectMethod"),
    def("SpreadElement")
  )]);
  def("TupleExpression").bases("Expression").build("elements").field("elements", [or(
    def("Expression"),
    def("SpreadElement"),
    null
  )]);
  def("ModuleExpression").bases("Node").build("body").field("body", def("Program"));
}
maybeSetModuleExports(() => module);

function jsxDef(fork) {
  fork.use(esProposalsDef);
  const types = fork.use(typesPlugin);
  const def = types.Type.def;
  const or = types.Type.or;
  const defaults = fork.use(sharedPlugin).defaults;
  def("JSXAttribute").bases("Node").build("name", "value").field("name", or(def("JSXIdentifier"), def("JSXNamespacedName"))).field("value", or(
    def("Literal"),
    // attr="value"
    def("JSXExpressionContainer"),
    // attr={value}
    def("JSXElement"),
    // attr=<div />
    def("JSXFragment"),
    // attr=<></>
    null
    // attr= or just attr
  ), defaults["null"]);
  def("JSXIdentifier").bases("Identifier").build("name").field("name", String);
  def("JSXNamespacedName").bases("Node").build("namespace", "name").field("namespace", def("JSXIdentifier")).field("name", def("JSXIdentifier"));
  def("JSXMemberExpression").bases("MemberExpression").build("object", "property").field("object", or(def("JSXIdentifier"), def("JSXMemberExpression"))).field("property", def("JSXIdentifier")).field("computed", Boolean, defaults.false);
  const JSXElementName = or(
    def("JSXIdentifier"),
    def("JSXNamespacedName"),
    def("JSXMemberExpression")
  );
  def("JSXSpreadAttribute").bases("Node").build("argument").field("argument", def("Expression"));
  const JSXAttributes = [or(
    def("JSXAttribute"),
    def("JSXSpreadAttribute")
  )];
  def("JSXExpressionContainer").bases("Expression").build("expression").field("expression", or(def("Expression"), def("JSXEmptyExpression")));
  const JSXChildren = [or(
    def("JSXText"),
    def("JSXExpressionContainer"),
    def("JSXSpreadChild"),
    def("JSXElement"),
    def("JSXFragment"),
    def("Literal")
    // Legacy: Esprima should return JSXText instead.
  )];
  def("JSXElement").bases("Expression").build("openingElement", "closingElement", "children").field("openingElement", def("JSXOpeningElement")).field("closingElement", or(def("JSXClosingElement"), null), defaults["null"]).field("children", JSXChildren, defaults.emptyArray).field("name", JSXElementName, function() {
    return this.openingElement.name;
  }, true).field("selfClosing", Boolean, function() {
    return this.openingElement.selfClosing;
  }, true).field("attributes", JSXAttributes, function() {
    return this.openingElement.attributes;
  }, true);
  def("JSXOpeningElement").bases("Node").build("name", "attributes", "selfClosing").field("name", JSXElementName).field("attributes", JSXAttributes, defaults.emptyArray).field("selfClosing", Boolean, defaults["false"]);
  def("JSXClosingElement").bases("Node").build("name").field("name", JSXElementName);
  def("JSXFragment").bases("Expression").build("openingFragment", "closingFragment", "children").field("openingFragment", def("JSXOpeningFragment")).field("closingFragment", def("JSXClosingFragment")).field("children", JSXChildren, defaults.emptyArray);
  def("JSXOpeningFragment").bases("Node").build();
  def("JSXClosingFragment").bases("Node").build();
  def("JSXText").bases("Literal").build("value", "raw").field("value", String).field("raw", String, function() {
    return this.value;
  });
  def("JSXEmptyExpression").bases("Node").build();
  def("JSXSpreadChild").bases("Node").build("expression").field("expression", def("Expression"));
}
maybeSetModuleExports(() => module);

function typeAnnotationsDef(fork) {
  var types = fork.use(typesPlugin);
  var def = types.Type.def;
  var or = types.Type.or;
  var defaults = fork.use(sharedPlugin).defaults;
  var TypeAnnotation = or(
    def("TypeAnnotation"),
    def("TSTypeAnnotation"),
    null
  );
  var TypeParamDecl = or(
    def("TypeParameterDeclaration"),
    def("TSTypeParameterDeclaration"),
    null
  );
  def("Identifier").field("typeAnnotation", TypeAnnotation, defaults["null"]);
  def("ObjectPattern").field("typeAnnotation", TypeAnnotation, defaults["null"]);
  def("Function").field("returnType", TypeAnnotation, defaults["null"]).field("typeParameters", TypeParamDecl, defaults["null"]);
  def("ClassProperty").build("key", "value", "typeAnnotation", "static").field("value", or(def("Expression"), null)).field("static", Boolean, defaults["false"]).field("typeAnnotation", TypeAnnotation, defaults["null"]);
  [
    "ClassDeclaration",
    "ClassExpression"
  ].forEach((typeName) => {
    def(typeName).field("typeParameters", TypeParamDecl, defaults["null"]).field(
      "superTypeParameters",
      or(
        def("TypeParameterInstantiation"),
        def("TSTypeParameterInstantiation"),
        null
      ),
      defaults["null"]
    ).field(
      "implements",
      or(
        [def("ClassImplements")],
        [def("TSExpressionWithTypeArguments")]
      ),
      defaults.emptyArray
    );
  });
}
maybeSetModuleExports(() => module);

function flowDef(fork) {
  fork.use(esProposalsDef);
  fork.use(typeAnnotationsDef);
  const types = fork.use(typesPlugin);
  const def = types.Type.def;
  const or = types.Type.or;
  const defaults = fork.use(sharedPlugin).defaults;
  def("Flow").bases("Node");
  def("FlowType").bases("Flow");
  def("AnyTypeAnnotation").bases("FlowType").build();
  def("EmptyTypeAnnotation").bases("FlowType").build();
  def("MixedTypeAnnotation").bases("FlowType").build();
  def("VoidTypeAnnotation").bases("FlowType").build();
  def("SymbolTypeAnnotation").bases("FlowType").build();
  def("NumberTypeAnnotation").bases("FlowType").build();
  def("BigIntTypeAnnotation").bases("FlowType").build();
  def("NumberLiteralTypeAnnotation").bases("FlowType").build("value", "raw").field("value", Number).field("raw", String);
  def("NumericLiteralTypeAnnotation").bases("FlowType").build("value", "raw").field("value", Number).field("raw", String);
  def("BigIntLiteralTypeAnnotation").bases("FlowType").build("value", "raw").field("value", null).field("raw", String);
  def("StringTypeAnnotation").bases("FlowType").build();
  def("StringLiteralTypeAnnotation").bases("FlowType").build("value", "raw").field("value", String).field("raw", String);
  def("BooleanTypeAnnotation").bases("FlowType").build();
  def("BooleanLiteralTypeAnnotation").bases("FlowType").build("value", "raw").field("value", Boolean).field("raw", String);
  def("TypeAnnotation").bases("Node").build("typeAnnotation").field("typeAnnotation", def("FlowType"));
  def("NullableTypeAnnotation").bases("FlowType").build("typeAnnotation").field("typeAnnotation", def("FlowType"));
  def("NullLiteralTypeAnnotation").bases("FlowType").build();
  def("NullTypeAnnotation").bases("FlowType").build();
  def("ThisTypeAnnotation").bases("FlowType").build();
  def("ExistsTypeAnnotation").bases("FlowType").build();
  def("ExistentialTypeParam").bases("FlowType").build();
  def("FunctionTypeAnnotation").bases("FlowType").build("params", "returnType", "rest", "typeParameters").field("params", [def("FunctionTypeParam")]).field("returnType", def("FlowType")).field("rest", or(def("FunctionTypeParam"), null)).field("typeParameters", or(def("TypeParameterDeclaration"), null));
  def("FunctionTypeParam").bases("Node").build("name", "typeAnnotation", "optional").field("name", or(def("Identifier"), null)).field("typeAnnotation", def("FlowType")).field("optional", Boolean);
  def("ArrayTypeAnnotation").bases("FlowType").build("elementType").field("elementType", def("FlowType"));
  def("ObjectTypeAnnotation").bases("FlowType").build("properties", "indexers", "callProperties").field("properties", [
    or(
      def("ObjectTypeProperty"),
      def("ObjectTypeSpreadProperty")
    )
  ]).field("indexers", [def("ObjectTypeIndexer")], defaults.emptyArray).field(
    "callProperties",
    [def("ObjectTypeCallProperty")],
    defaults.emptyArray
  ).field("inexact", or(Boolean, void 0), defaults["undefined"]).field("exact", Boolean, defaults["false"]).field("internalSlots", [def("ObjectTypeInternalSlot")], defaults.emptyArray);
  def("Variance").bases("Node").build("kind").field("kind", or("plus", "minus"));
  const LegacyVariance = or(
    def("Variance"),
    "plus",
    "minus",
    null
  );
  def("ObjectTypeProperty").bases("Node").build("key", "value", "optional").field("key", or(def("Literal"), def("Identifier"))).field("value", def("FlowType")).field("optional", Boolean).field("variance", LegacyVariance, defaults["null"]);
  def("ObjectTypeIndexer").bases("Node").build("id", "key", "value").field("id", def("Identifier")).field("key", def("FlowType")).field("value", def("FlowType")).field("variance", LegacyVariance, defaults["null"]).field("static", Boolean, defaults["false"]);
  def("ObjectTypeCallProperty").bases("Node").build("value").field("value", def("FunctionTypeAnnotation")).field("static", Boolean, defaults["false"]);
  def("QualifiedTypeIdentifier").bases("Node").build("qualification", "id").field(
    "qualification",
    or(
      def("Identifier"),
      def("QualifiedTypeIdentifier")
    )
  ).field("id", def("Identifier"));
  def("GenericTypeAnnotation").bases("FlowType").build("id", "typeParameters").field("id", or(def("Identifier"), def("QualifiedTypeIdentifier"))).field("typeParameters", or(def("TypeParameterInstantiation"), null));
  def("MemberTypeAnnotation").bases("FlowType").build("object", "property").field("object", def("Identifier")).field(
    "property",
    or(
      def("MemberTypeAnnotation"),
      def("GenericTypeAnnotation")
    )
  );
  def("IndexedAccessType").bases("FlowType").build("objectType", "indexType").field("objectType", def("FlowType")).field("indexType", def("FlowType"));
  def("OptionalIndexedAccessType").bases("FlowType").build("objectType", "indexType", "optional").field("objectType", def("FlowType")).field("indexType", def("FlowType")).field("optional", Boolean);
  def("UnionTypeAnnotation").bases("FlowType").build("types").field("types", [def("FlowType")]);
  def("IntersectionTypeAnnotation").bases("FlowType").build("types").field("types", [def("FlowType")]);
  def("TypeofTypeAnnotation").bases("FlowType").build("argument").field("argument", def("FlowType"));
  def("ObjectTypeSpreadProperty").bases("Node").build("argument").field("argument", def("FlowType"));
  def("ObjectTypeInternalSlot").bases("Node").build("id", "value", "optional", "static", "method").field("id", def("Identifier")).field("value", def("FlowType")).field("optional", Boolean).field("static", Boolean).field("method", Boolean);
  def("TypeParameterDeclaration").bases("Node").build("params").field("params", [def("TypeParameter")]);
  def("TypeParameterInstantiation").bases("Node").build("params").field("params", [def("FlowType")]);
  def("TypeParameter").bases("FlowType").build("name", "variance", "bound", "default").field("name", String).field("variance", LegacyVariance, defaults["null"]).field("bound", or(def("TypeAnnotation"), null), defaults["null"]).field("default", or(def("FlowType"), null), defaults["null"]);
  def("ClassProperty").field("variance", LegacyVariance, defaults["null"]);
  def("ClassImplements").bases("Node").build("id").field("id", def("Identifier")).field("superClass", or(def("Expression"), null), defaults["null"]).field(
    "typeParameters",
    or(def("TypeParameterInstantiation"), null),
    defaults["null"]
  );
  def("InterfaceTypeAnnotation").bases("FlowType").build("body", "extends").field("body", def("ObjectTypeAnnotation")).field("extends", or([def("InterfaceExtends")], null), defaults["null"]);
  def("InterfaceDeclaration").bases("Declaration").build("id", "body", "extends").field("id", def("Identifier")).field(
    "typeParameters",
    or(def("TypeParameterDeclaration"), null),
    defaults["null"]
  ).field("body", def("ObjectTypeAnnotation")).field("extends", [def("InterfaceExtends")]);
  def("DeclareInterface").bases("InterfaceDeclaration").build("id", "body", "extends");
  def("InterfaceExtends").bases("Node").build("id").field("id", def("Identifier")).field(
    "typeParameters",
    or(def("TypeParameterInstantiation"), null),
    defaults["null"]
  );
  def("TypeAlias").bases("Declaration").build("id", "typeParameters", "right").field("id", def("Identifier")).field("typeParameters", or(def("TypeParameterDeclaration"), null)).field("right", def("FlowType"));
  def("DeclareTypeAlias").bases("TypeAlias").build("id", "typeParameters", "right");
  def("OpaqueType").bases("Declaration").build("id", "typeParameters", "impltype", "supertype").field("id", def("Identifier")).field("typeParameters", or(def("TypeParameterDeclaration"), null)).field("impltype", def("FlowType")).field("supertype", or(def("FlowType"), null));
  def("DeclareOpaqueType").bases("OpaqueType").build("id", "typeParameters", "supertype").field("impltype", or(def("FlowType"), null));
  def("TypeCastExpression").bases("Expression").build("expression", "typeAnnotation").field("expression", def("Expression")).field("typeAnnotation", def("TypeAnnotation"));
  def("TupleTypeAnnotation").bases("FlowType").build("types").field("types", [def("FlowType")]);
  def("DeclareVariable").bases("Statement").build("id").field("id", def("Identifier"));
  def("DeclareFunction").bases("Statement").build("id").field("id", def("Identifier")).field("predicate", or(def("FlowPredicate"), null), defaults["null"]);
  def("DeclareClass").bases("InterfaceDeclaration").build("id");
  def("DeclareModule").bases("Statement").build("id", "body").field("id", or(def("Identifier"), def("Literal"))).field("body", def("BlockStatement"));
  def("DeclareModuleExports").bases("Statement").build("typeAnnotation").field("typeAnnotation", def("TypeAnnotation"));
  def("DeclareExportDeclaration").bases("Declaration").build("default", "declaration", "specifiers", "source").field("default", Boolean).field("declaration", or(
    def("DeclareVariable"),
    def("DeclareFunction"),
    def("DeclareClass"),
    def("FlowType"),
    // Implies default.
    def("TypeAlias"),
    // Implies named type
    def("DeclareOpaqueType"),
    // Implies named opaque type
    def("InterfaceDeclaration"),
    null
  )).field("specifiers", [or(
    def("ExportSpecifier"),
    def("ExportBatchSpecifier")
  )], defaults.emptyArray).field("source", or(
    def("Literal"),
    null
  ), defaults["null"]);
  def("DeclareExportAllDeclaration").bases("Declaration").build("source").field("source", or(
    def("Literal"),
    null
  ), defaults["null"]);
  def("ImportDeclaration").field("importKind", or("value", "type", "typeof"), () => "value");
  def("FlowPredicate").bases("Flow");
  def("InferredPredicate").bases("FlowPredicate").build();
  def("DeclaredPredicate").bases("FlowPredicate").build("value").field("value", def("Expression"));
  def("Function").field("predicate", or(def("FlowPredicate"), null), defaults["null"]);
  def("CallExpression").field("typeArguments", or(
    null,
    def("TypeParameterInstantiation")
  ), defaults["null"]);
  def("NewExpression").field("typeArguments", or(
    null,
    def("TypeParameterInstantiation")
  ), defaults["null"]);
  def("EnumDeclaration").bases("Declaration").build("id", "body").field("id", def("Identifier")).field("body", or(
    def("EnumBooleanBody"),
    def("EnumNumberBody"),
    def("EnumStringBody"),
    def("EnumSymbolBody")
  ));
  def("EnumBooleanBody").build("members", "explicitType").field("members", [def("EnumBooleanMember")]).field("explicitType", Boolean);
  def("EnumNumberBody").build("members", "explicitType").field("members", [def("EnumNumberMember")]).field("explicitType", Boolean);
  def("EnumStringBody").build("members", "explicitType").field("members", or([def("EnumStringMember")], [def("EnumDefaultedMember")])).field("explicitType", Boolean);
  def("EnumSymbolBody").build("members").field("members", [def("EnumDefaultedMember")]);
  def("EnumBooleanMember").build("id", "init").field("id", def("Identifier")).field("init", or(def("Literal"), Boolean));
  def("EnumNumberMember").build("id", "init").field("id", def("Identifier")).field("init", def("Literal"));
  def("EnumStringMember").build("id", "init").field("id", def("Identifier")).field("init", def("Literal"));
  def("EnumDefaultedMember").build("id").field("id", def("Identifier"));
}
maybeSetModuleExports(() => module);

function esprimaDef(fork) {
  fork.use(esProposalsDef);
  var types = fork.use(typesPlugin);
  var defaults = fork.use(sharedPlugin).defaults;
  var def = types.Type.def;
  var or = types.Type.or;
  def("VariableDeclaration").field("declarations", [or(
    def("VariableDeclarator"),
    def("Identifier")
    // Esprima deviation.
  )]);
  def("Property").field("value", or(
    def("Expression"),
    def("Pattern")
    // Esprima deviation.
  ));
  def("ArrayPattern").field("elements", [or(
    def("Pattern"),
    def("SpreadElement"),
    null
  )]);
  def("ObjectPattern").field("properties", [or(
    def("Property"),
    def("PropertyPattern"),
    def("SpreadPropertyPattern"),
    def("SpreadProperty")
    // Used by Esprima.
  )]);
  def("ExportSpecifier").bases("ModuleSpecifier").build("id", "name");
  def("ExportBatchSpecifier").bases("Specifier").build();
  def("ExportDeclaration").bases("Declaration").build("default", "declaration", "specifiers", "source").field("default", Boolean).field("declaration", or(
    def("Declaration"),
    def("Expression"),
    // Implies default.
    null
  )).field("specifiers", [or(
    def("ExportSpecifier"),
    def("ExportBatchSpecifier")
  )], defaults.emptyArray).field("source", or(
    def("Literal"),
    null
  ), defaults["null"]);
  def("Block").bases("Comment").build(
    "value",
    /*optional:*/
    "leading",
    "trailing"
  );
  def("Line").bases("Comment").build(
    "value",
    /*optional:*/
    "leading",
    "trailing"
  );
}
maybeSetModuleExports(() => module);

function babelCoreDef(fork) {
  fork.use(esProposalsDef);
  const types = fork.use(typesPlugin);
  const defaults = fork.use(sharedPlugin).defaults;
  const def = types.Type.def;
  const or = types.Type.or;
  const {
    undefined: isUndefined
  } = types.builtInTypes;
  def("Noop").bases("Statement").build();
  def("DoExpression").bases("Expression").build("body").field("body", [def("Statement")]);
  def("BindExpression").bases("Expression").build("object", "callee").field("object", or(def("Expression"), null)).field("callee", def("Expression"));
  def("ParenthesizedExpression").bases("Expression").build("expression").field("expression", def("Expression"));
  def("ExportNamespaceSpecifier").bases("Specifier").build("exported").field("exported", def("Identifier"));
  def("ExportDefaultSpecifier").bases("Specifier").build("exported").field("exported", def("Identifier"));
  def("CommentBlock").bases("Comment").build(
    "value",
    /*optional:*/
    "leading",
    "trailing"
  );
  def("CommentLine").bases("Comment").build(
    "value",
    /*optional:*/
    "leading",
    "trailing"
  );
  def("Directive").bases("Node").build("value").field("value", def("DirectiveLiteral"));
  def("DirectiveLiteral").bases("Node", "Expression").build("value").field("value", String, defaults["use strict"]);
  def("InterpreterDirective").bases("Node").build("value").field("value", String);
  def("BlockStatement").bases("Statement").build("body").field("body", [def("Statement")]).field("directives", [def("Directive")], defaults.emptyArray);
  def("Program").bases("Node").build("body").field("body", [def("Statement")]).field("directives", [def("Directive")], defaults.emptyArray).field("interpreter", or(def("InterpreterDirective"), null), defaults["null"]);
  function makeLiteralExtra(rawValueType = String, toRaw) {
    return [
      "extra",
      {
        rawValue: rawValueType,
        raw: String
      },
      function getDefault() {
        const value = types.getFieldValue(this, "value");
        return {
          rawValue: value,
          raw: toRaw ? toRaw(value) : String(value)
        };
      }
    ];
  }
  def("StringLiteral").bases("Literal").build("value").field("value", String).field(...makeLiteralExtra(String, (val) => JSON.stringify(val)));
  def("NumericLiteral").bases("Literal").build("value").field("value", Number).field("raw", or(String, null), defaults["null"]).field(...makeLiteralExtra(Number));
  def("BigIntLiteral").bases("Literal").build("value").field("value", or(String, Number)).field(...makeLiteralExtra(String, (val) => val + "n"));
  def("DecimalLiteral").bases("Literal").build("value").field("value", String).field(...makeLiteralExtra(String, (val) => val + "m"));
  def("NullLiteral").bases("Literal").build().field("value", null, defaults["null"]);
  def("BooleanLiteral").bases("Literal").build("value").field("value", Boolean);
  def("RegExpLiteral").bases("Literal").build("pattern", "flags").field("pattern", String).field("flags", String).field("value", RegExp, function() {
    return new RegExp(this.pattern, this.flags);
  }).field(...makeLiteralExtra(
    or(RegExp, isUndefined),
    (exp) => `/${exp.pattern}/${exp.flags || ""}`
  )).field("regex", {
    pattern: String,
    flags: String
  }, function() {
    return {
      pattern: this.pattern,
      flags: this.flags
    };
  });
  var ObjectExpressionProperty = or(
    def("Property"),
    def("ObjectMethod"),
    def("ObjectProperty"),
    def("SpreadProperty"),
    def("SpreadElement")
  );
  def("ObjectExpression").bases("Expression").build("properties").field("properties", [ObjectExpressionProperty]);
  def("ObjectMethod").bases("Node", "Function").build("kind", "key", "params", "body", "computed").field("kind", or("method", "get", "set")).field("key", or(def("Literal"), def("Identifier"), def("Expression"))).field("params", [def("Pattern")]).field("body", def("BlockStatement")).field("computed", Boolean, defaults["false"]).field("generator", Boolean, defaults["false"]).field("async", Boolean, defaults["false"]).field(
    "accessibility",
    // TypeScript
    or(def("Literal"), null),
    defaults["null"]
  ).field(
    "decorators",
    or([def("Decorator")], null),
    defaults["null"]
  );
  def("ObjectProperty").bases("Node").build("key", "value").field("key", or(def("Literal"), def("Identifier"), def("Expression"))).field("value", or(def("Expression"), def("Pattern"))).field(
    "accessibility",
    // TypeScript
    or(def("Literal"), null),
    defaults["null"]
  ).field("computed", Boolean, defaults["false"]);
  var ClassBodyElement = or(
    def("MethodDefinition"),
    def("VariableDeclarator"),
    def("ClassPropertyDefinition"),
    def("ClassProperty"),
    def("ClassPrivateProperty"),
    def("ClassMethod"),
    def("ClassPrivateMethod"),
    def("ClassAccessorProperty"),
    def("StaticBlock")
  );
  def("ClassBody").bases("Declaration").build("body").field("body", [ClassBodyElement]);
  def("ClassMethod").bases("Declaration", "Function").build("kind", "key", "params", "body", "computed", "static").field("key", or(def("Literal"), def("Identifier"), def("Expression")));
  def("ClassPrivateMethod").bases("Declaration", "Function").build("key", "params", "body", "kind", "computed", "static").field("key", def("PrivateName"));
  def("ClassAccessorProperty").bases("Declaration").build("key", "value", "decorators", "computed", "static").field("key", or(
    def("Literal"),
    def("Identifier"),
    def("PrivateName"),
    // Only when .computed is true (TODO enforce this)
    def("Expression")
  )).field("value", or(def("Expression"), null), defaults["null"]);
  [
    "ClassMethod",
    "ClassPrivateMethod"
  ].forEach((typeName) => {
    def(typeName).field("kind", or("get", "set", "method", "constructor"), () => "method").field("body", def("BlockStatement")).field("access", or("public", "private", "protected", null), defaults["null"]);
  });
  [
    "ClassMethod",
    "ClassPrivateMethod",
    "ClassAccessorProperty"
  ].forEach((typeName) => {
    def(typeName).field("computed", Boolean, defaults["false"]).field("static", Boolean, defaults["false"]).field("abstract", Boolean, defaults["false"]).field("accessibility", or("public", "private", "protected", null), defaults["null"]).field("decorators", or([def("Decorator")], null), defaults["null"]).field("definite", Boolean, defaults["false"]).field("optional", Boolean, defaults["false"]).field("override", Boolean, defaults["false"]).field("readonly", Boolean, defaults["false"]);
  });
  var ObjectPatternProperty = or(
    def("Property"),
    def("PropertyPattern"),
    def("SpreadPropertyPattern"),
    def("SpreadProperty"),
    // Used by Esprima
    def("ObjectProperty"),
    // Babel 6
    def("RestProperty"),
    // Babel 6
    def("RestElement")
    // Babel 6
  );
  def("ObjectPattern").bases("Pattern").build("properties").field("properties", [ObjectPatternProperty]).field(
    "decorators",
    or([def("Decorator")], null),
    defaults["null"]
  );
  def("SpreadProperty").bases("Node").build("argument").field("argument", def("Expression"));
  def("RestProperty").bases("Node").build("argument").field("argument", def("Expression"));
  def("ForAwaitStatement").bases("Statement").build("left", "right", "body").field("left", or(
    def("VariableDeclaration"),
    def("Expression")
  )).field("right", def("Expression")).field("body", def("Statement"));
  def("Import").bases("Expression").build();
}
maybeSetModuleExports(() => module);

function babelDef(fork) {
  const types = fork.use(typesPlugin);
  const def = types.Type.def;
  fork.use(babelCoreDef);
  fork.use(flowDef);
  def("V8IntrinsicIdentifier").bases("Expression").build("name").field("name", String);
  def("TopicReference").bases("Expression").build();
}
maybeSetModuleExports(() => module);

function typescriptDef(fork) {
  fork.use(babelCoreDef);
  fork.use(typeAnnotationsDef);
  var types = fork.use(typesPlugin);
  var n = types.namedTypes;
  var def = types.Type.def;
  var or = types.Type.or;
  var defaults = fork.use(sharedPlugin).defaults;
  var StringLiteral = types.Type.from(function(value, deep) {
    if (n.StringLiteral && n.StringLiteral.check(value, deep)) {
      return true;
    }
    if (n.Literal && n.Literal.check(value, deep) && typeof value.value === "string") {
      return true;
    }
    return false;
  }, "StringLiteral");
  def("TSType").bases("Node");
  var TSEntityName = or(
    def("Identifier"),
    def("TSQualifiedName")
  );
  def("TSTypeReference").bases("TSType", "TSHasOptionalTypeParameterInstantiation").build("typeName", "typeParameters").field("typeName", TSEntityName);
  def("TSHasOptionalTypeParameterInstantiation").field(
    "typeParameters",
    or(def("TSTypeParameterInstantiation"), null),
    defaults["null"]
  );
  def("TSHasOptionalTypeParameters").field(
    "typeParameters",
    or(def("TSTypeParameterDeclaration"), null, void 0),
    defaults["null"]
  );
  def("TSHasOptionalTypeAnnotation").field(
    "typeAnnotation",
    or(def("TSTypeAnnotation"), null),
    defaults["null"]
  );
  def("TSQualifiedName").bases("Node").build("left", "right").field("left", TSEntityName).field("right", TSEntityName);
  def("TSAsExpression").bases("Expression", "Pattern").build("expression", "typeAnnotation").field("expression", def("Expression")).field("typeAnnotation", def("TSType")).field(
    "extra",
    or({ parenthesized: Boolean }, null),
    defaults["null"]
  );
  def("TSTypeCastExpression").bases("Expression").build("expression", "typeAnnotation").field("expression", def("Expression")).field("typeAnnotation", def("TSType"));
  def("TSSatisfiesExpression").bases("Expression", "Pattern").build("expression", "typeAnnotation").field("expression", def("Expression")).field("typeAnnotation", def("TSType"));
  def("TSNonNullExpression").bases("Expression", "Pattern").build("expression").field("expression", def("Expression"));
  [
    // Define all the simple keyword types.
    "TSAnyKeyword",
    "TSBigIntKeyword",
    "TSBooleanKeyword",
    "TSNeverKeyword",
    "TSNullKeyword",
    "TSNumberKeyword",
    "TSObjectKeyword",
    "TSStringKeyword",
    "TSSymbolKeyword",
    "TSUndefinedKeyword",
    "TSUnknownKeyword",
    "TSVoidKeyword",
    "TSIntrinsicKeyword",
    "TSThisType"
  ].forEach((keywordType) => {
    def(keywordType).bases("TSType").build();
  });
  def("TSArrayType").bases("TSType").build("elementType").field("elementType", def("TSType"));
  def("TSLiteralType").bases("TSType").build("literal").field("literal", or(
    def("NumericLiteral"),
    def("StringLiteral"),
    def("BooleanLiteral"),
    def("TemplateLiteral"),
    def("UnaryExpression"),
    def("BigIntLiteral")
  ));
  def("TemplateLiteral").field("expressions", or(
    [def("Expression")],
    [def("TSType")]
  ));
  [
    "TSUnionType",
    "TSIntersectionType"
  ].forEach((typeName) => {
    def(typeName).bases("TSType").build("types").field("types", [def("TSType")]);
  });
  def("TSConditionalType").bases("TSType").build("checkType", "extendsType", "trueType", "falseType").field("checkType", def("TSType")).field("extendsType", def("TSType")).field("trueType", def("TSType")).field("falseType", def("TSType"));
  def("TSInferType").bases("TSType").build("typeParameter").field("typeParameter", def("TSTypeParameter"));
  def("TSParenthesizedType").bases("TSType").build("typeAnnotation").field("typeAnnotation", def("TSType"));
  var ParametersType = [or(
    def("Identifier"),
    def("RestElement"),
    def("ArrayPattern"),
    def("ObjectPattern")
  )];
  [
    "TSFunctionType",
    "TSConstructorType"
  ].forEach((typeName) => {
    def(typeName).bases(
      "TSType",
      "TSHasOptionalTypeParameters",
      "TSHasOptionalTypeAnnotation"
    ).build("parameters").field("parameters", ParametersType);
  });
  def("TSDeclareFunction").bases("Declaration", "TSHasOptionalTypeParameters").build("id", "params", "returnType").field("declare", Boolean, defaults["false"]).field("async", Boolean, defaults["false"]).field("generator", Boolean, defaults["false"]).field("id", or(def("Identifier"), null), defaults["null"]).field("params", [def("Pattern")]).field(
    "returnType",
    or(
      def("TSTypeAnnotation"),
      def("Noop"),
      // Still used?
      null
    ),
    defaults["null"]
  );
  def("TSDeclareMethod").bases("Declaration", "TSHasOptionalTypeParameters").build("key", "params", "returnType").field("async", Boolean, defaults["false"]).field("generator", Boolean, defaults["false"]).field("params", [def("Pattern")]).field("abstract", Boolean, defaults["false"]).field(
    "accessibility",
    or("public", "private", "protected", void 0),
    defaults["undefined"]
  ).field("static", Boolean, defaults["false"]).field("computed", Boolean, defaults["false"]).field("optional", Boolean, defaults["false"]).field("key", or(
    def("Identifier"),
    def("StringLiteral"),
    def("NumericLiteral"),
    // Only allowed if .computed is true.
    def("Expression")
  )).field(
    "kind",
    or("get", "set", "method", "constructor"),
    function getDefault() {
      return "method";
    }
  ).field(
    "access",
    // Not "accessibility"?
    or("public", "private", "protected", void 0),
    defaults["undefined"]
  ).field(
    "decorators",
    or([def("Decorator")], null),
    defaults["null"]
  ).field(
    "returnType",
    or(
      def("TSTypeAnnotation"),
      def("Noop"),
      // Still used?
      null
    ),
    defaults["null"]
  );
  def("TSMappedType").bases("TSType").build("typeParameter", "typeAnnotation").field("readonly", or(Boolean, "+", "-"), defaults["false"]).field("typeParameter", def("TSTypeParameter")).field("optional", or(Boolean, "+", "-"), defaults["false"]).field(
    "typeAnnotation",
    or(def("TSType"), null),
    defaults["null"]
  );
  def("TSTupleType").bases("TSType").build("elementTypes").field("elementTypes", [or(
    def("TSType"),
    def("TSNamedTupleMember")
  )]);
  def("TSNamedTupleMember").bases("TSType").build("label", "elementType", "optional").field("label", def("Identifier")).field("optional", Boolean, defaults["false"]).field("elementType", def("TSType"));
  def("TSRestType").bases("TSType").build("typeAnnotation").field("typeAnnotation", def("TSType"));
  def("TSOptionalType").bases("TSType").build("typeAnnotation").field("typeAnnotation", def("TSType"));
  def("TSIndexedAccessType").bases("TSType").build("objectType", "indexType").field("objectType", def("TSType")).field("indexType", def("TSType"));
  def("TSTypeOperator").bases("TSType").build("operator").field("operator", String).field("typeAnnotation", def("TSType"));
  def("TSTypeAnnotation").bases("Node").build("typeAnnotation").field(
    "typeAnnotation",
    or(
      def("TSType"),
      def("TSTypeAnnotation")
    )
  );
  def("TSIndexSignature").bases("Declaration", "TSHasOptionalTypeAnnotation").build("parameters", "typeAnnotation").field("parameters", [def("Identifier")]).field("readonly", Boolean, defaults["false"]);
  def("TSPropertySignature").bases("Declaration", "TSHasOptionalTypeAnnotation").build("key", "typeAnnotation", "optional").field("key", def("Expression")).field("computed", Boolean, defaults["false"]).field("readonly", Boolean, defaults["false"]).field("optional", Boolean, defaults["false"]).field(
    "initializer",
    or(def("Expression"), null),
    defaults["null"]
  );
  def("TSMethodSignature").bases(
    "Declaration",
    "TSHasOptionalTypeParameters",
    "TSHasOptionalTypeAnnotation"
  ).build("key", "parameters", "typeAnnotation").field("key", def("Expression")).field("computed", Boolean, defaults["false"]).field("optional", Boolean, defaults["false"]).field("parameters", ParametersType);
  def("TSTypePredicate").bases("TSTypeAnnotation", "TSType").build("parameterName", "typeAnnotation", "asserts").field(
    "parameterName",
    or(
      def("Identifier"),
      def("TSThisType")
    )
  ).field(
    "typeAnnotation",
    or(def("TSTypeAnnotation"), null),
    defaults["null"]
  ).field("asserts", Boolean, defaults["false"]);
  [
    "TSCallSignatureDeclaration",
    "TSConstructSignatureDeclaration"
  ].forEach((typeName) => {
    def(typeName).bases(
      "Declaration",
      "TSHasOptionalTypeParameters",
      "TSHasOptionalTypeAnnotation"
    ).build("parameters", "typeAnnotation").field("parameters", ParametersType);
  });
  def("TSEnumMember").bases("Node").build("id", "initializer").field("id", or(def("Identifier"), StringLiteral)).field(
    "initializer",
    or(def("Expression"), null),
    defaults["null"]
  );
  def("TSTypeQuery").bases("TSType").build("exprName").field("exprName", or(TSEntityName, def("TSImportType")));
  var TSTypeMember = or(
    def("TSCallSignatureDeclaration"),
    def("TSConstructSignatureDeclaration"),
    def("TSIndexSignature"),
    def("TSMethodSignature"),
    def("TSPropertySignature")
  );
  def("TSTypeLiteral").bases("TSType").build("members").field("members", [TSTypeMember]);
  def("TSTypeParameter").bases("Identifier").build("name", "constraint", "default").field("name", or(def("Identifier"), String)).field("constraint", or(def("TSType"), void 0), defaults["undefined"]).field("default", or(def("TSType"), void 0), defaults["undefined"]);
  def("TSTypeAssertion").bases("Expression", "Pattern").build("typeAnnotation", "expression").field("typeAnnotation", def("TSType")).field("expression", def("Expression")).field(
    "extra",
    or({ parenthesized: Boolean }, null),
    defaults["null"]
  );
  def("TSTypeParameterDeclaration").bases("Declaration").build("params").field("params", [def("TSTypeParameter")]);
  def("TSInstantiationExpression").bases("Expression", "TSHasOptionalTypeParameterInstantiation").build("expression", "typeParameters").field("expression", def("Expression"));
  def("TSTypeParameterInstantiation").bases("Node").build("params").field("params", [def("TSType")]);
  def("TSEnumDeclaration").bases("Declaration").build("id", "members").field("id", def("Identifier")).field("const", Boolean, defaults["false"]).field("declare", Boolean, defaults["false"]).field("members", [def("TSEnumMember")]).field(
    "initializer",
    or(def("Expression"), null),
    defaults["null"]
  );
  def("TSTypeAliasDeclaration").bases("Declaration", "TSHasOptionalTypeParameters").build("id", "typeAnnotation").field("id", def("Identifier")).field("declare", Boolean, defaults["false"]).field("typeAnnotation", def("TSType"));
  def("TSModuleBlock").bases("Node").build("body").field("body", [def("Statement")]);
  def("TSModuleDeclaration").bases("Declaration").build("id", "body").field("id", or(StringLiteral, TSEntityName)).field("declare", Boolean, defaults["false"]).field("global", Boolean, defaults["false"]).field(
    "body",
    or(
      def("TSModuleBlock"),
      def("TSModuleDeclaration"),
      null
    ),
    defaults["null"]
  );
  def("TSImportType").bases("TSType", "TSHasOptionalTypeParameterInstantiation").build("argument", "qualifier", "typeParameters").field("argument", StringLiteral).field("qualifier", or(TSEntityName, void 0), defaults["undefined"]);
  def("TSImportEqualsDeclaration").bases("Declaration").build("id", "moduleReference").field("id", def("Identifier")).field("isExport", Boolean, defaults["false"]).field(
    "moduleReference",
    or(
      TSEntityName,
      def("TSExternalModuleReference")
    )
  );
  def("TSExternalModuleReference").bases("Declaration").build("expression").field("expression", StringLiteral);
  def("TSExportAssignment").bases("Statement").build("expression").field("expression", def("Expression"));
  def("TSNamespaceExportDeclaration").bases("Declaration").build("id").field("id", def("Identifier"));
  def("TSInterfaceBody").bases("Node").build("body").field("body", [TSTypeMember]);
  def("TSExpressionWithTypeArguments").bases("TSType", "TSHasOptionalTypeParameterInstantiation").build("expression", "typeParameters").field("expression", TSEntityName);
  def("TSInterfaceDeclaration").bases("Declaration", "TSHasOptionalTypeParameters").build("id", "body").field("id", TSEntityName).field("declare", Boolean, defaults["false"]).field(
    "extends",
    or([def("TSExpressionWithTypeArguments")], null),
    defaults["null"]
  ).field("body", def("TSInterfaceBody"));
  def("TSParameterProperty").bases("Pattern").build("parameter").field(
    "accessibility",
    or("public", "private", "protected", void 0),
    defaults["undefined"]
  ).field("readonly", Boolean, defaults["false"]).field("parameter", or(
    def("Identifier"),
    def("AssignmentPattern")
  ));
  def("ClassProperty").field(
    "access",
    // Not "accessibility"?
    or("public", "private", "protected", void 0),
    defaults["undefined"]
  );
  def("ClassAccessorProperty").bases("Declaration", "TSHasOptionalTypeAnnotation");
  def("ClassBody").field("body", [or(
    def("MethodDefinition"),
    def("VariableDeclarator"),
    def("ClassPropertyDefinition"),
    def("ClassProperty"),
    def("ClassPrivateProperty"),
    def("ClassAccessorProperty"),
    def("ClassMethod"),
    def("ClassPrivateMethod"),
    def("StaticBlock"),
    // Just need to add these types:
    def("TSDeclareMethod"),
    TSTypeMember
  )]);
}
maybeSetModuleExports(() => module);

var namedTypes$1;
((namedTypes2) => {
})(namedTypes$1 || (namedTypes$1 = {}));

const {
  astNodesAreEquivalent,
  builders: builders$1,
  builtInTypes,
  defineMethod,
  eachField,
  finalize,
  getBuilderName,
  getFieldNames,
  getFieldValue,
  getSupertypeNames,
  namedTypes: n$3,
  NodePath,
  Path,
  PathVisitor,
  someField,
  Type,
  use,
  visit
} = fork([
  // Feel free to add to or remove from this list of extension modules to
  // configure the precise type hierarchy that you need.
  esProposalsDef,
  jsxDef,
  flowDef,
  esprimaDef,
  babelDef,
  typescriptDef
]);
Object.assign(namedTypes$1, n$3);

const n$2 = namedTypes$1;
const SourceMapConsumer = sourceMap.SourceMapConsumer;
const SourceMapGenerator = sourceMap.SourceMapGenerator;
const hasOwn$2 = Object.prototype.hasOwnProperty;
function getLineTerminator() {
  return "\n";
}
function getOption(options, key, defaultValue) {
  if (options && hasOwn$2.call(options, key)) {
    return options[key];
  }
  return defaultValue;
}
function getUnionOfKeys(...args) {
  const result = {};
  const argc = args.length;
  for (let i = 0; i < argc; ++i) {
    const keys = Object.keys(args[i]);
    const keyCount = keys.length;
    for (let j = 0; j < keyCount; ++j) {
      result[keys[j]] = true;
    }
  }
  return result;
}
function comparePos(pos1, pos2) {
  return pos1.line - pos2.line || pos1.column - pos2.column;
}
function copyPos(pos) {
  return {
    line: pos.line,
    column: pos.column
  };
}
function composeSourceMaps(formerMap, latterMap) {
  if (formerMap) {
    if (!latterMap) {
      return formerMap;
    }
  } else {
    return latterMap || null;
  }
  const smcFormer = new SourceMapConsumer(formerMap);
  const smcLatter = new SourceMapConsumer(latterMap);
  const smg = new SourceMapGenerator({
    file: latterMap.file,
    sourceRoot: latterMap.sourceRoot
  });
  const sourcesToContents = {};
  smcLatter.eachMapping(function(mapping) {
    const origPos = smcFormer.originalPositionFor({
      line: mapping.originalLine,
      column: mapping.originalColumn
    });
    const sourceName = origPos.source;
    if (sourceName === null) {
      return;
    }
    smg.addMapping({
      source: sourceName,
      original: copyPos(origPos),
      generated: {
        line: mapping.generatedLine,
        column: mapping.generatedColumn
      },
      name: mapping.name
    });
    const sourceContent = smcFormer.sourceContentFor(sourceName);
    if (sourceContent && !hasOwn$2.call(sourcesToContents, sourceName)) {
      sourcesToContents[sourceName] = sourceContent;
      smg.setSourceContent(sourceName, sourceContent);
    }
  });
  return smg.toJSON();
}
function getTrueLoc(node, lines) {
  if (!node.loc) {
    return null;
  }
  const result = {
    start: node.loc.start,
    end: node.loc.end
  };
  function include(node2) {
    expandLoc(result, node2.loc);
  }
  if (node.declaration && node.declaration.decorators && isExportDeclaration(node)) {
    node.declaration.decorators.forEach(include);
  }
  if (comparePos(result.start, result.end) < 0) {
    result.start = copyPos(result.start);
    lines.skipSpaces(result.start, false, true);
    if (comparePos(result.start, result.end) < 0) {
      result.end = copyPos(result.end);
      lines.skipSpaces(result.end, true, true);
    }
  }
  if (node.comments) {
    node.comments.forEach(include);
  }
  return result;
}
function expandLoc(parentLoc, childLoc) {
  if (parentLoc && childLoc) {
    if (comparePos(childLoc.start, parentLoc.start) < 0) {
      parentLoc.start = childLoc.start;
    }
    if (comparePos(parentLoc.end, childLoc.end) < 0) {
      parentLoc.end = childLoc.end;
    }
  }
}
function fixFaultyLocations(node, lines) {
  const loc = node.loc;
  if (loc) {
    if (loc.start.line < 1) {
      loc.start.line = 1;
    }
    if (loc.end.line < 1) {
      loc.end.line = 1;
    }
  }
  if (node.type === "File") {
    loc.start = lines.firstPos();
    loc.end = lines.lastPos();
  }
  fixForLoopHead(node, lines);
  fixTemplateLiteral(node, lines);
  if (loc && node.decorators) {
    node.decorators.forEach(function(decorator) {
      expandLoc(loc, decorator.loc);
    });
  } else if (node.declaration && isExportDeclaration(node)) {
    node.declaration.loc = null;
    const decorators = node.declaration.decorators;
    if (decorators) {
      decorators.forEach(function(decorator) {
        expandLoc(loc, decorator.loc);
      });
    }
  } else if (n$2.MethodDefinition && n$2.MethodDefinition.check(node) || n$2.Property.check(node) && (node.method || node.shorthand)) {
    node.value.loc = null;
    if (n$2.FunctionExpression.check(node.value)) {
      node.value.id = null;
    }
  } else if (node.type === "ObjectTypeProperty") {
    const loc2 = node.loc;
    let end = loc2 && loc2.end;
    if (end) {
      end = copyPos(end);
      if (lines.prevPos(end) && lines.charAt(end) === ",") {
        if (end = lines.skipSpaces(end, true, true)) {
          loc2.end = end;
        }
      }
    }
  }
}
function fixForLoopHead(node, lines) {
  if (node.type !== "ForStatement") {
    return;
  }
  function fix(child) {
    const loc = child && child.loc;
    const start = loc && loc.start;
    const end = loc && copyPos(loc.end);
    while (start && end && comparePos(start, end) < 0) {
      lines.prevPos(end);
      if (lines.charAt(end) === ";") {
        loc.end.line = end.line;
        loc.end.column = end.column;
      } else {
        break;
      }
    }
  }
  fix(node.init);
  fix(node.test);
  fix(node.update);
}
function fixTemplateLiteral(node, lines) {
  if (node.type !== "TemplateLiteral") {
    return;
  }
  if (node.quasis.length === 0) {
    return;
  }
  if (node.loc) {
    const afterLeftBackTickPos = copyPos(node.loc.start);
    const firstQuasi = node.quasis[0];
    if (comparePos(firstQuasi.loc.start, afterLeftBackTickPos) < 0) {
      firstQuasi.loc.start = afterLeftBackTickPos;
    }
    const rightBackTickPos = copyPos(node.loc.end);
    const lastQuasi = node.quasis[node.quasis.length - 1];
    if (comparePos(rightBackTickPos, lastQuasi.loc.end) < 0) {
      lastQuasi.loc.end = rightBackTickPos;
    }
  }
  node.expressions.forEach(function(expr, i) {
    const dollarCurlyPos = lines.skipSpaces(expr.loc.start, true, false);
    if (lines.prevPos(dollarCurlyPos) && lines.charAt(dollarCurlyPos) === "{" && lines.prevPos(dollarCurlyPos) && lines.charAt(dollarCurlyPos) === "$") {
      const quasiBefore = node.quasis[i];
      if (comparePos(dollarCurlyPos, quasiBefore.loc.end) < 0) {
        quasiBefore.loc.end = dollarCurlyPos;
      }
    }
    const rightCurlyPos = lines.skipSpaces(expr.loc.end, false, false);
    if (lines.charAt(rightCurlyPos) === "}") {
      const quasiAfter = node.quasis[i + 1];
      if (comparePos(quasiAfter.loc.start, rightCurlyPos) < 0) {
        quasiAfter.loc.start = rightCurlyPos;
      }
    }
  });
}
function isExportDeclaration(node) {
  if (node)
    switch (node.type) {
      case "ExportDeclaration":
      case "ExportDefaultDeclaration":
      case "ExportDefaultSpecifier":
      case "DeclareExportDeclaration":
      case "ExportNamedDeclaration":
      case "ExportAllDeclaration":
        return true;
    }
  return false;
}
function getParentExportDeclaration(path) {
  const parentNode = path.getParentNode();
  if (path.getName() === "declaration" && isExportDeclaration(parentNode)) {
    return parentNode;
  }
  return null;
}
function isTrailingCommaEnabled(options, context) {
  const trailingComma = options.trailingComma;
  if (typeof trailingComma === "object") {
    return !!trailingComma[context];
  }
  return !!trailingComma;
}

const defaults = {
  tabWidth: 4,
  useTabs: false,
  reuseWhitespace: true,
  lineTerminator: getLineTerminator(),
  wrapColumn: 74,
  // Aspirational for now.
  sourceFileName: null,
  sourceMapName: null,
  sourceRoot: null,
  inputSourceMap: null,
  range: false,
  tolerant: true,
  quote: null,
  trailingComma: false,
  arrayBracketSpacing: false,
  objectCurlySpacing: true,
  arrowParensAlways: false,
  flowObjectCommas: true,
  tokens: true
};
const hasOwn$1 = defaults.hasOwnProperty;
function normalize(opts) {
  const options = opts || defaults;
  function get(key) {
    return hasOwn$1.call(options, key) ? options[key] : defaults[key];
  }
  return {
    tabWidth: +get("tabWidth"),
    useTabs: !!get("useTabs"),
    reuseWhitespace: !!get("reuseWhitespace"),
    lineTerminator: get("lineTerminator"),
    wrapColumn: Math.max(get("wrapColumn"), 0),
    sourceFileName: get("sourceFileName"),
    sourceMapName: get("sourceMapName"),
    sourceRoot: get("sourceRoot"),
    inputSourceMap: get("inputSourceMap"),
    parser: get("esprima") || get("parser"),
    range: get("range"),
    tolerant: get("tolerant"),
    quote: get("quote"),
    trailingComma: get("trailingComma"),
    arrayBracketSpacing: get("arrayBracketSpacing"),
    objectCurlySpacing: get("objectCurlySpacing"),
    arrowParensAlways: get("arrowParensAlways"),
    flowObjectCommas: get("flowObjectCommas"),
    tokens: !!get("tokens")
  };
}

class Mapping {
  constructor(sourceLines, sourceLoc, targetLoc = sourceLoc) {
    this.sourceLines = sourceLines;
    this.sourceLoc = sourceLoc;
    this.targetLoc = targetLoc;
  }
  slice(lines, start, end = lines.lastPos()) {
    const sourceLines = this.sourceLines;
    let sourceLoc = this.sourceLoc;
    let targetLoc = this.targetLoc;
    function skip(name) {
      const sourceFromPos = sourceLoc[name];
      const targetFromPos = targetLoc[name];
      let targetToPos = start;
      if (name === "end") {
        targetToPos = end;
      }
      return skipChars(
        sourceLines,
        sourceFromPos,
        lines,
        targetFromPos,
        targetToPos
      );
    }
    if (comparePos(start, targetLoc.start) <= 0) {
      if (comparePos(targetLoc.end, end) <= 0) {
        targetLoc = {
          start: subtractPos(targetLoc.start, start.line, start.column),
          end: subtractPos(targetLoc.end, start.line, start.column)
        };
      } else if (comparePos(end, targetLoc.start) <= 0) {
        return null;
      } else {
        sourceLoc = {
          start: sourceLoc.start,
          end: skip("end")
        };
        targetLoc = {
          start: subtractPos(targetLoc.start, start.line, start.column),
          end: subtractPos(end, start.line, start.column)
        };
      }
    } else {
      if (comparePos(targetLoc.end, start) <= 0) {
        return null;
      }
      if (comparePos(targetLoc.end, end) <= 0) {
        sourceLoc = {
          start: skip("start"),
          end: sourceLoc.end
        };
        targetLoc = {
          // Same as subtractPos(start, start.line, start.column):
          start: { line: 1, column: 0 },
          end: subtractPos(targetLoc.end, start.line, start.column)
        };
      } else {
        sourceLoc = {
          start: skip("start"),
          end: skip("end")
        };
        targetLoc = {
          // Same as subtractPos(start, start.line, start.column):
          start: { line: 1, column: 0 },
          end: subtractPos(end, start.line, start.column)
        };
      }
    }
    return new Mapping(this.sourceLines, sourceLoc, targetLoc);
  }
  add(line, column) {
    return new Mapping(this.sourceLines, this.sourceLoc, {
      start: addPos(this.targetLoc.start, line, column),
      end: addPos(this.targetLoc.end, line, column)
    });
  }
  subtract(line, column) {
    return new Mapping(this.sourceLines, this.sourceLoc, {
      start: subtractPos(this.targetLoc.start, line, column),
      end: subtractPos(this.targetLoc.end, line, column)
    });
  }
  indent(by, skipFirstLine = false, noNegativeColumns = false) {
    if (by === 0) {
      return this;
    }
    let targetLoc = this.targetLoc;
    const startLine = targetLoc.start.line;
    const endLine = targetLoc.end.line;
    if (skipFirstLine && startLine === 1 && endLine === 1) {
      return this;
    }
    targetLoc = {
      start: targetLoc.start,
      end: targetLoc.end
    };
    if (!skipFirstLine || startLine > 1) {
      const startColumn = targetLoc.start.column + by;
      targetLoc.start = {
        line: startLine,
        column: noNegativeColumns ? Math.max(0, startColumn) : startColumn
      };
    }
    if (!skipFirstLine || endLine > 1) {
      const endColumn = targetLoc.end.column + by;
      targetLoc.end = {
        line: endLine,
        column: noNegativeColumns ? Math.max(0, endColumn) : endColumn
      };
    }
    return new Mapping(this.sourceLines, this.sourceLoc, targetLoc);
  }
}
function addPos(toPos, line, column) {
  return {
    line: toPos.line + line - 1,
    column: toPos.line === 1 ? toPos.column + column : toPos.column
  };
}
function subtractPos(fromPos, line, column) {
  return {
    line: fromPos.line - line + 1,
    column: fromPos.line === line ? fromPos.column - column : fromPos.column
  };
}
function skipChars(sourceLines, sourceFromPos, targetLines, targetFromPos, targetToPos) {
  const targetComparison = comparePos(targetFromPos, targetToPos);
  if (targetComparison === 0) {
    return sourceFromPos;
  }
  let sourceCursor, targetCursor;
  if (targetComparison < 0) {
    sourceCursor = sourceLines.skipSpaces(sourceFromPos) || sourceLines.lastPos();
    targetCursor = targetLines.skipSpaces(targetFromPos) || targetLines.lastPos();
    const lineDiff = targetToPos.line - targetCursor.line;
    sourceCursor.line += lineDiff;
    targetCursor.line += lineDiff;
    if (lineDiff > 0) {
      sourceCursor.column = 0;
      targetCursor.column = 0;
    }
    while (comparePos(targetCursor, targetToPos) < 0 && targetLines.nextPos(targetCursor, true)) {
    }
  } else {
    sourceCursor = sourceLines.skipSpaces(sourceFromPos, true) || sourceLines.firstPos();
    targetCursor = targetLines.skipSpaces(targetFromPos, true) || targetLines.firstPos();
    const lineDiff = targetToPos.line - targetCursor.line;
    sourceCursor.line += lineDiff;
    targetCursor.line += lineDiff;
    if (lineDiff < 0) {
      sourceCursor.column = sourceLines.getLineLength(sourceCursor.line);
      targetCursor.column = targetLines.getLineLength(targetCursor.line);
    }
    while (comparePos(targetToPos, targetCursor) < 0 && targetLines.prevPos(targetCursor, true)) {
    }
  }
  return sourceCursor;
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Lines {
  constructor(infos, sourceFileName = null) {
    this.infos = infos;
    __publicField$1(this, "length");
    __publicField$1(this, "name");
    __publicField$1(this, "mappings", []);
    __publicField$1(this, "cachedSourceMap", null);
    __publicField$1(this, "cachedTabWidth");
    this.length = infos.length;
    this.name = sourceFileName || null;
    if (this.name) {
      this.mappings.push(
        new Mapping(this, {
          start: this.firstPos(),
          end: this.lastPos()
        })
      );
    }
  }
  toString(options) {
    return this.sliceString(this.firstPos(), this.lastPos(), options);
  }
  getSourceMap(sourceMapName, sourceRoot) {
    if (!sourceMapName) {
      return null;
    }
    const targetLines = this;
    function updateJSON(json) {
      json = json || {};
      json.file = sourceMapName;
      if (sourceRoot) {
        json.sourceRoot = sourceRoot;
      }
      return json;
    }
    if (targetLines.cachedSourceMap) {
      return updateJSON(targetLines.cachedSourceMap.toJSON());
    }
    const smg = new sourceMap.SourceMapGenerator(updateJSON());
    const sourcesToContents = {};
    targetLines.mappings.forEach(function(mapping) {
      const sourceCursor = mapping.sourceLines.skipSpaces(mapping.sourceLoc.start) || mapping.sourceLines.lastPos();
      const targetCursor = targetLines.skipSpaces(mapping.targetLoc.start) || targetLines.lastPos();
      while (comparePos(sourceCursor, mapping.sourceLoc.end) < 0 && comparePos(targetCursor, mapping.targetLoc.end) < 0) {
        mapping.sourceLines.charAt(sourceCursor);
        targetLines.charAt(targetCursor);
        const sourceName = mapping.sourceLines.name;
        smg.addMapping({
          source: sourceName,
          original: { line: sourceCursor.line, column: sourceCursor.column },
          generated: { line: targetCursor.line, column: targetCursor.column }
        });
        if (!hasOwn.call(sourcesToContents, sourceName)) {
          const sourceContent = mapping.sourceLines.toString();
          smg.setSourceContent(sourceName, sourceContent);
          sourcesToContents[sourceName] = sourceContent;
        }
        targetLines.nextPos(targetCursor, true);
        mapping.sourceLines.nextPos(sourceCursor, true);
      }
    });
    targetLines.cachedSourceMap = smg;
    return smg.toJSON();
  }
  bootstrapCharAt(pos) {
    const line = pos.line, column = pos.column, strings = this.toString().split(lineTerminatorSeqExp), string = strings[line - 1];
    if (typeof string === "undefined")
      return "";
    if (column === string.length && line < strings.length)
      return "\n";
    if (column >= string.length)
      return "";
    return string.charAt(column);
  }
  charAt(pos) {
    let line = pos.line, column = pos.column, secret = this, infos = secret.infos, info = infos[line - 1], c = column;
    if (typeof info === "undefined" || c < 0)
      return "";
    const indent = this.getIndentAt(line);
    if (c < indent)
      return " ";
    c += info.sliceStart - indent;
    if (c === info.sliceEnd && line < this.length)
      return "\n";
    if (c >= info.sliceEnd)
      return "";
    return info.line.charAt(c);
  }
  stripMargin(width, skipFirstLine) {
    if (width === 0)
      return this;
    if (skipFirstLine && this.length === 1)
      return this;
    const lines = new Lines(
      this.infos.map(function(info, i) {
        if (info.line && (i > 0 || !skipFirstLine)) {
          info = {
            ...info,
            indent: Math.max(0, info.indent - width)
          };
        }
        return info;
      })
    );
    if (this.mappings.length > 0) {
      const newMappings = lines.mappings;
      this.mappings.forEach(function(mapping) {
        newMappings.push(mapping.indent(width, skipFirstLine, true));
      });
    }
    return lines;
  }
  indent(by) {
    if (by === 0) {
      return this;
    }
    const lines = new Lines(
      this.infos.map(function(info) {
        if (info.line && !info.locked) {
          info = {
            ...info,
            indent: info.indent + by
          };
        }
        return info;
      })
    );
    if (this.mappings.length > 0) {
      const newMappings = lines.mappings;
      this.mappings.forEach(function(mapping) {
        newMappings.push(mapping.indent(by));
      });
    }
    return lines;
  }
  indentTail(by) {
    if (by === 0) {
      return this;
    }
    if (this.length < 2) {
      return this;
    }
    const lines = new Lines(
      this.infos.map(function(info, i) {
        if (i > 0 && info.line && !info.locked) {
          info = {
            ...info,
            indent: info.indent + by
          };
        }
        return info;
      })
    );
    if (this.mappings.length > 0) {
      const newMappings = lines.mappings;
      this.mappings.forEach(function(mapping) {
        newMappings.push(mapping.indent(by, true));
      });
    }
    return lines;
  }
  lockIndentTail() {
    if (this.length < 2) {
      return this;
    }
    return new Lines(
      this.infos.map((info, i) => ({
        ...info,
        locked: i > 0
      }))
    );
  }
  getIndentAt(line) {
    return Math.max(this.infos[line - 1].indent, 0);
  }
  guessTabWidth() {
    if (typeof this.cachedTabWidth === "number") {
      return this.cachedTabWidth;
    }
    const counts = [];
    let lastIndent = 0;
    for (let line = 1, last = this.length; line <= last; ++line) {
      const info = this.infos[line - 1];
      const sliced = info.line.slice(info.sliceStart, info.sliceEnd);
      if (isOnlyWhitespace(sliced)) {
        continue;
      }
      const diff = Math.abs(info.indent - lastIndent);
      counts[diff] = ~~counts[diff] + 1;
      lastIndent = info.indent;
    }
    let maxCount = -1;
    let result = 2;
    for (let tabWidth = 1; tabWidth < counts.length; tabWidth += 1) {
      if (hasOwn.call(counts, tabWidth) && counts[tabWidth] > maxCount) {
        maxCount = counts[tabWidth];
        result = tabWidth;
      }
    }
    return this.cachedTabWidth = result;
  }
  // Determine if the list of lines has a first line that starts with a //
  // or /* comment. If this is the case, the code may need to be wrapped in
  // parens to avoid ASI issues.
  startsWithComment() {
    if (this.infos.length === 0) {
      return false;
    }
    const firstLineInfo = this.infos[0], sliceStart = firstLineInfo.sliceStart, sliceEnd = firstLineInfo.sliceEnd, firstLine = firstLineInfo.line.slice(sliceStart, sliceEnd).trim();
    return firstLine.length === 0 || firstLine.slice(0, 2) === "//" || firstLine.slice(0, 2) === "/*";
  }
  isOnlyWhitespace() {
    return isOnlyWhitespace(this.toString());
  }
  isPrecededOnlyByWhitespace(pos) {
    const info = this.infos[pos.line - 1];
    const indent = Math.max(info.indent, 0);
    const diff = pos.column - indent;
    if (diff <= 0) {
      return true;
    }
    const start = info.sliceStart;
    const end = Math.min(start + diff, info.sliceEnd);
    const prefix = info.line.slice(start, end);
    return isOnlyWhitespace(prefix);
  }
  getLineLength(line) {
    const info = this.infos[line - 1];
    return this.getIndentAt(line) + info.sliceEnd - info.sliceStart;
  }
  nextPos(pos, skipSpaces = false) {
    const l = Math.max(pos.line, 0), c = Math.max(pos.column, 0);
    if (c < this.getLineLength(l)) {
      pos.column += 1;
      return skipSpaces ? !!this.skipSpaces(pos, false, true) : true;
    }
    if (l < this.length) {
      pos.line += 1;
      pos.column = 0;
      return skipSpaces ? !!this.skipSpaces(pos, false, true) : true;
    }
    return false;
  }
  prevPos(pos, skipSpaces = false) {
    let l = pos.line, c = pos.column;
    if (c < 1) {
      l -= 1;
      if (l < 1)
        return false;
      c = this.getLineLength(l);
    } else {
      c = Math.min(c - 1, this.getLineLength(l));
    }
    pos.line = l;
    pos.column = c;
    return skipSpaces ? !!this.skipSpaces(pos, true, true) : true;
  }
  firstPos() {
    return { line: 1, column: 0 };
  }
  lastPos() {
    return {
      line: this.length,
      column: this.getLineLength(this.length)
    };
  }
  skipSpaces(pos, backward = false, modifyInPlace = false) {
    if (pos) {
      pos = modifyInPlace ? pos : {
        line: pos.line,
        column: pos.column
      };
    } else if (backward) {
      pos = this.lastPos();
    } else {
      pos = this.firstPos();
    }
    if (backward) {
      while (this.prevPos(pos)) {
        if (!isOnlyWhitespace(this.charAt(pos)) && this.nextPos(pos)) {
          return pos;
        }
      }
      return null;
    } else {
      while (isOnlyWhitespace(this.charAt(pos))) {
        if (!this.nextPos(pos)) {
          return null;
        }
      }
      return pos;
    }
  }
  trimLeft() {
    const pos = this.skipSpaces(this.firstPos(), false, true);
    return pos ? this.slice(pos) : emptyLines;
  }
  trimRight() {
    const pos = this.skipSpaces(this.lastPos(), true, true);
    return pos ? this.slice(this.firstPos(), pos) : emptyLines;
  }
  trim() {
    const start = this.skipSpaces(this.firstPos(), false, true);
    if (start === null) {
      return emptyLines;
    }
    const end = this.skipSpaces(this.lastPos(), true, true);
    if (end === null) {
      return emptyLines;
    }
    return this.slice(start, end);
  }
  eachPos(callback, startPos = this.firstPos(), skipSpaces = false) {
    const pos = this.firstPos();
    if (startPos) {
      pos.line = startPos.line, pos.column = startPos.column;
    }
    if (skipSpaces && !this.skipSpaces(pos, false, true)) {
      return;
    }
    do
      callback.call(this, pos);
    while (this.nextPos(pos, skipSpaces));
  }
  bootstrapSlice(start, end) {
    const strings = this.toString().split(lineTerminatorSeqExp).slice(start.line - 1, end.line);
    if (strings.length > 0) {
      strings.push(strings.pop().slice(0, end.column));
      strings[0] = strings[0].slice(start.column);
    }
    return fromString(strings.join("\n"));
  }
  slice(start, end) {
    if (!end) {
      if (!start) {
        return this;
      }
      end = this.lastPos();
    }
    if (!start) {
      throw new Error("cannot slice with end but not start");
    }
    const sliced = this.infos.slice(start.line - 1, end.line);
    if (start.line === end.line) {
      sliced[0] = sliceInfo(sliced[0], start.column, end.column);
    } else {
      sliced[0] = sliceInfo(sliced[0], start.column);
      sliced.push(sliceInfo(sliced.pop(), 0, end.column));
    }
    const lines = new Lines(sliced);
    if (this.mappings.length > 0) {
      const newMappings = lines.mappings;
      this.mappings.forEach(function(mapping) {
        const sliced2 = mapping.slice(this, start, end);
        if (sliced2) {
          newMappings.push(sliced2);
        }
      }, this);
    }
    return lines;
  }
  bootstrapSliceString(start, end, options) {
    return this.slice(start, end).toString(options);
  }
  sliceString(start = this.firstPos(), end = this.lastPos(), options) {
    const { tabWidth, useTabs, reuseWhitespace, lineTerminator } = normalize(options);
    const parts = [];
    for (let line = start.line; line <= end.line; ++line) {
      let info = this.infos[line - 1];
      if (line === start.line) {
        if (line === end.line) {
          info = sliceInfo(info, start.column, end.column);
        } else {
          info = sliceInfo(info, start.column);
        }
      } else if (line === end.line) {
        info = sliceInfo(info, 0, end.column);
      }
      const indent = Math.max(info.indent, 0);
      const before = info.line.slice(0, info.sliceStart);
      if (reuseWhitespace && isOnlyWhitespace(before) && countSpaces(before, tabWidth) === indent) {
        parts.push(info.line.slice(0, info.sliceEnd));
        continue;
      }
      let tabs = 0;
      let spaces = indent;
      if (useTabs) {
        tabs = Math.floor(indent / tabWidth);
        spaces -= tabs * tabWidth;
      }
      let result = "";
      if (tabs > 0) {
        result += new Array(tabs + 1).join("	");
      }
      if (spaces > 0) {
        result += new Array(spaces + 1).join(" ");
      }
      result += info.line.slice(info.sliceStart, info.sliceEnd);
      parts.push(result);
    }
    return parts.join(lineTerminator);
  }
  isEmpty() {
    return this.length < 2 && this.getLineLength(1) < 1;
  }
  join(elements) {
    const separator = this;
    const infos = [];
    const mappings = [];
    let prevInfo;
    function appendLines(linesOrNull) {
      if (linesOrNull === null) {
        return;
      }
      if (prevInfo) {
        const info = linesOrNull.infos[0];
        const indent = new Array(info.indent + 1).join(" ");
        const prevLine = infos.length;
        const prevColumn = Math.max(prevInfo.indent, 0) + prevInfo.sliceEnd - prevInfo.sliceStart;
        prevInfo.line = prevInfo.line.slice(0, prevInfo.sliceEnd) + indent + info.line.slice(info.sliceStart, info.sliceEnd);
        prevInfo.locked = prevInfo.locked || info.locked;
        prevInfo.sliceEnd = prevInfo.line.length;
        if (linesOrNull.mappings.length > 0) {
          linesOrNull.mappings.forEach(function(mapping) {
            mappings.push(mapping.add(prevLine, prevColumn));
          });
        }
      } else if (linesOrNull.mappings.length > 0) {
        mappings.push.apply(mappings, linesOrNull.mappings);
      }
      linesOrNull.infos.forEach(function(info, i) {
        if (!prevInfo || i > 0) {
          prevInfo = { ...info };
          infos.push(prevInfo);
        }
      });
    }
    function appendWithSeparator(linesOrNull, i) {
      if (i > 0)
        appendLines(separator);
      appendLines(linesOrNull);
    }
    elements.map(function(elem) {
      const lines2 = fromString(elem);
      if (lines2.isEmpty())
        return null;
      return lines2;
    }).forEach((linesOrNull, i) => {
      if (separator.isEmpty()) {
        appendLines(linesOrNull);
      } else {
        appendWithSeparator(linesOrNull, i);
      }
    });
    if (infos.length < 1)
      return emptyLines;
    const lines = new Lines(infos);
    lines.mappings = mappings;
    return lines;
  }
  concat(...args) {
    const list = [this];
    list.push.apply(list, args);
    return emptyLines.join(list);
  }
}
const fromStringCache = {};
const hasOwn = fromStringCache.hasOwnProperty;
const maxCacheKeyLen = 10;
function countSpaces(spaces, tabWidth) {
  let count = 0;
  const len = spaces.length;
  for (let i = 0; i < len; ++i) {
    switch (spaces.charCodeAt(i)) {
      case 9: {
        const next = Math.ceil(count / tabWidth) * tabWidth;
        if (next === count) {
          count += tabWidth;
        } else {
          count = next;
        }
        break;
      }
      case 11:
      case 12:
      case 13:
      case 65279:
        break;
      case 32:
      default:
        count += 1;
        break;
    }
  }
  return count;
}
const leadingSpaceExp = /^\s*/;
const lineTerminatorSeqExp = /\u000D\u000A|\u000D(?!\u000A)|\u000A|\u2028|\u2029/;
function fromString(string, options) {
  if (string instanceof Lines)
    return string;
  string += "";
  const tabWidth = options && options.tabWidth;
  const tabless = string.indexOf("	") < 0;
  const cacheable = !options && tabless && string.length <= maxCacheKeyLen;
  if (cacheable && hasOwn.call(fromStringCache, string))
    return fromStringCache[string];
  const lines = new Lines(
    string.split(lineTerminatorSeqExp).map(function(line) {
      const spaces = leadingSpaceExp.exec(line)[0];
      return {
        line,
        indent: countSpaces(spaces, tabWidth),
        // Boolean indicating whether this line can be reindented.
        locked: false,
        sliceStart: spaces.length,
        sliceEnd: line.length
      };
    }),
    normalize(options).sourceFileName
  );
  if (cacheable)
    fromStringCache[string] = lines;
  return lines;
}
function isOnlyWhitespace(string) {
  return !/\S/.test(string);
}
function sliceInfo(info, startCol, endCol) {
  let sliceStart = info.sliceStart;
  let sliceEnd = info.sliceEnd;
  let indent = Math.max(info.indent, 0);
  let lineLength = indent + sliceEnd - sliceStart;
  if (typeof endCol === "undefined") {
    endCol = lineLength;
  }
  startCol = Math.max(startCol, 0);
  endCol = Math.min(endCol, lineLength);
  endCol = Math.max(endCol, startCol);
  if (endCol < indent) {
    indent = endCol;
    sliceEnd = sliceStart;
  } else {
    sliceEnd -= lineLength - endCol;
  }
  lineLength = endCol;
  lineLength -= startCol;
  if (startCol < indent) {
    indent -= startCol;
  } else {
    startCol -= indent;
    indent = 0;
    sliceStart += startCol;
  }
  if (info.indent === indent && info.sliceStart === sliceStart && info.sliceEnd === sliceEnd) {
    return info;
  }
  return {
    line: info.line,
    indent,
    // A destructive slice always unlocks indentation.
    locked: false,
    sliceStart,
    sliceEnd
  };
}
function concat(elements) {
  return emptyLines.join(elements);
}
const emptyLines = fromString("");

const n$1 = namedTypes$1;
const isArray$3 = builtInTypes.array;
const isObject$3 = builtInTypes.object;
const childNodesCache = /* @__PURE__ */ new WeakMap();
function getSortedChildNodes(node, lines, resultArray) {
  if (!node) {
    return resultArray;
  }
  fixFaultyLocations(node, lines);
  if (resultArray) {
    if (n$1.Node.check(node) && n$1.SourceLocation.check(node.loc)) {
      let i = resultArray.length - 1;
      for (; i >= 0; --i) {
        const child = resultArray[i];
        if (child && child.loc && comparePos(child.loc.end, node.loc.start) <= 0) {
          break;
        }
      }
      resultArray.splice(i + 1, 0, node);
      return resultArray;
    }
  } else {
    const childNodes = childNodesCache.get(node);
    if (childNodes) {
      return childNodes;
    }
  }
  let names;
  if (isArray$3.check(node)) {
    names = Object.keys(node);
  } else if (isObject$3.check(node)) {
    names = getFieldNames(node);
  } else {
    return resultArray;
  }
  if (!resultArray) {
    childNodesCache.set(node, resultArray = []);
  }
  for (let i = 0, nameCount = names.length; i < nameCount; ++i) {
    getSortedChildNodes(node[names[i]], lines, resultArray);
  }
  return resultArray;
}
function decorateComment(node, comment, lines) {
  const childNodes = getSortedChildNodes(node, lines);
  let left = 0;
  let right = childNodes && childNodes.length;
  let precedingNode;
  let followingNode;
  while (typeof right === "number" && left < right) {
    const middle = left + right >> 1;
    const child = childNodes[middle];
    if (comparePos(child.loc.start, comment.loc.start) <= 0 && comparePos(comment.loc.end, child.loc.end) <= 0) {
      decorateComment(comment.enclosingNode = child, comment, lines);
      return;
    }
    if (comparePos(child.loc.end, comment.loc.start) <= 0) {
      precedingNode = child;
      left = middle + 1;
      continue;
    }
    if (comparePos(comment.loc.end, child.loc.start) <= 0) {
      followingNode = child;
      right = middle;
      continue;
    }
    throw new Error("Comment location overlaps with node location");
  }
  if (precedingNode) {
    comment.precedingNode = precedingNode;
  }
  if (followingNode) {
    comment.followingNode = followingNode;
  }
}
function attach(comments, ast, lines) {
  if (!isArray$3.check(comments)) {
    return;
  }
  const tiesToBreak = [];
  comments.forEach(function(comment) {
    comment.loc.lines = lines;
    decorateComment(ast, comment, lines);
    const pn = comment.precedingNode;
    const en = comment.enclosingNode;
    const fn = comment.followingNode;
    if (pn && fn) {
      const tieCount = tiesToBreak.length;
      if (tieCount > 0) {
        const lastTie = tiesToBreak[tieCount - 1];
        if (lastTie.followingNode !== comment.followingNode) {
          breakTies(tiesToBreak, lines);
        }
      }
      tiesToBreak.push(comment);
    } else if (pn) {
      breakTies(tiesToBreak, lines);
      addTrailingComment(pn, comment);
    } else if (fn) {
      breakTies(tiesToBreak, lines);
      addLeadingComment(fn, comment);
    } else if (en) {
      breakTies(tiesToBreak, lines);
      addDanglingComment(en, comment);
    } else {
      throw new Error("AST contains no nodes at all?");
    }
  });
  breakTies(tiesToBreak, lines);
  comments.forEach(function(comment) {
    delete comment.precedingNode;
    delete comment.enclosingNode;
    delete comment.followingNode;
  });
}
function breakTies(tiesToBreak, lines) {
  const tieCount = tiesToBreak.length;
  if (tieCount === 0) {
    return;
  }
  const pn = tiesToBreak[0].precedingNode;
  const fn = tiesToBreak[0].followingNode;
  let gapEndPos = fn.loc.start;
  let indexOfFirstLeadingComment = tieCount;
  let comment;
  for (; indexOfFirstLeadingComment > 0; --indexOfFirstLeadingComment) {
    comment = tiesToBreak[indexOfFirstLeadingComment - 1];
    const gap = lines.sliceString(comment.loc.end, gapEndPos);
    if (/\S/.test(gap)) {
      break;
    }
    gapEndPos = comment.loc.start;
  }
  while (indexOfFirstLeadingComment <= tieCount && (comment = tiesToBreak[indexOfFirstLeadingComment]) && // If the comment is a //-style comment and indented more
  // deeply than the node itself, reconsider it as trailing.
  (comment.type === "Line" || comment.type === "CommentLine") && comment.loc.start.column > fn.loc.start.column) {
    ++indexOfFirstLeadingComment;
  }
  if (indexOfFirstLeadingComment) {
    const { enclosingNode } = tiesToBreak[indexOfFirstLeadingComment - 1];
    if (enclosingNode?.type === "CallExpression") {
      --indexOfFirstLeadingComment;
    }
  }
  tiesToBreak.forEach(function(comment2, i) {
    if (i < indexOfFirstLeadingComment) {
      addTrailingComment(pn, comment2);
    } else {
      addLeadingComment(fn, comment2);
    }
  });
  tiesToBreak.length = 0;
}
function addCommentHelper(node, comment) {
  const comments = node.comments || (node.comments = []);
  comments.push(comment);
}
function addLeadingComment(node, comment) {
  comment.leading = true;
  comment.trailing = false;
  addCommentHelper(node, comment);
}
function addDanglingComment(node, comment) {
  comment.leading = false;
  comment.trailing = false;
  addCommentHelper(node, comment);
}
function addTrailingComment(node, comment) {
  comment.leading = false;
  comment.trailing = true;
  addCommentHelper(node, comment);
}
function printLeadingComment(commentPath, print) {
  const comment = commentPath.getValue();
  n$1.Comment.assert(comment);
  const loc = comment.loc;
  const lines = loc && loc.lines;
  const parts = [print(commentPath)];
  if (comment.trailing) {
    parts.push("\n");
  } else if (lines instanceof Lines) {
    const trailingSpace = lines.slice(
      loc.end,
      lines.skipSpaces(loc.end) || lines.lastPos()
    );
    if (trailingSpace.length === 1) {
      parts.push(trailingSpace);
    } else {
      parts.push(new Array(trailingSpace.length).join("\n"));
    }
  } else {
    parts.push("\n");
  }
  return concat(parts);
}
function printTrailingComment(commentPath, print) {
  const comment = commentPath.getValue(commentPath);
  n$1.Comment.assert(comment);
  const loc = comment.loc;
  const lines = loc && loc.lines;
  const parts = [];
  if (lines instanceof Lines) {
    const fromPos = lines.skipSpaces(loc.start, true) || lines.firstPos();
    const leadingSpace = lines.slice(fromPos, loc.start);
    if (leadingSpace.length === 1) {
      parts.push(leadingSpace);
    } else {
      parts.push(new Array(leadingSpace.length).join("\n"));
    }
  }
  parts.push(print(commentPath));
  return concat(parts);
}
function printComments(path, print) {
  const value = path.getValue();
  const innerLines = print(path);
  const comments = n$1.Node.check(value) && getFieldValue(value, "comments");
  if (!comments || comments.length === 0) {
    return innerLines;
  }
  const leadingParts = [];
  const trailingParts = [innerLines];
  path.each(function(commentPath) {
    const comment = commentPath.getValue();
    const leading = getFieldValue(comment, "leading");
    const trailing = getFieldValue(comment, "trailing");
    if (leading || trailing && !(n$1.Statement.check(value) || comment.type === "Block" || comment.type === "CommentBlock")) {
      leadingParts.push(printLeadingComment(commentPath, print));
    } else if (trailing) {
      trailingParts.push(printTrailingComment(commentPath, print));
    }
  }, "comments");
  leadingParts.push.apply(leadingParts, trailingParts);
  return concat(leadingParts);
}

const b$5 = builders$1;
const isObject$2 = builtInTypes.object;
const isArray$2 = builtInTypes.array;
function parse(source, options) {
  options = normalize(options);
  const lines = fromString(source, options);
  const sourceWithoutTabs = lines.toString({
    tabWidth: options.tabWidth,
    reuseWhitespace: false,
    useTabs: false
  });
  let comments = [];
  const ast = options.parser.parse(sourceWithoutTabs, {
    jsx: true,
    loc: true,
    locations: true,
    range: options.range,
    comment: true,
    onComment: comments,
    tolerant: getOption(options, "tolerant", true),
    ecmaVersion: 6,
    sourceType: getOption(options, "sourceType", "module")
  });
  const tokens = Array.isArray(ast.tokens) ? ast.tokens : false;
  delete ast.tokens;
  tokens.forEach(function(token) {
    if (typeof token.value !== "string") {
      token.value = lines.sliceString(token.loc.start, token.loc.end);
    }
  });
  if (Array.isArray(ast.comments)) {
    comments = ast.comments;
    delete ast.comments;
  }
  if (ast.loc) {
    fixFaultyLocations(ast, lines);
  } else {
    ast.loc = {
      start: lines.firstPos(),
      end: lines.lastPos()
    };
  }
  ast.loc.lines = lines;
  ast.loc.indent = 0;
  let file;
  let program;
  if (ast.type === "Program") {
    program = ast;
    file = b$5.file(ast, options.sourceFileName || null);
    file.loc = {
      start: lines.firstPos(),
      end: lines.lastPos(),
      lines,
      indent: 0
    };
  } else if (ast.type === "File") {
    file = ast;
    program = file.program;
  }
  if (options.tokens) {
    file.tokens = tokens;
  }
  const trueProgramLoc = getTrueLoc(
    {
      type: program.type,
      loc: program.loc,
      body: [],
      comments
    },
    lines
  );
  program.loc.start = trueProgramLoc.start;
  program.loc.end = trueProgramLoc.end;
  attach(comments, program.body.length ? file.program : file, lines);
  return new TreeCopier(lines, tokens).copy(file);
}
const TreeCopier = function TreeCopier2(lines, tokens) {
  this.lines = lines;
  this.tokens = tokens;
  this.startTokenIndex = 0;
  this.endTokenIndex = tokens.length;
  this.indent = 0;
  this.seen = /* @__PURE__ */ new Map();
};
const TCp = TreeCopier.prototype;
TCp.copy = function(node) {
  if (this.seen.has(node)) {
    return this.seen.get(node);
  }
  if (isArray$2.check(node)) {
    const copy2 = new Array(node.length);
    this.seen.set(node, copy2);
    node.forEach(function(item, i) {
      copy2[i] = this.copy(item);
    }, this);
    return copy2;
  }
  if (!isObject$2.check(node)) {
    return node;
  }
  fixFaultyLocations(node, this.lines);
  const copy = Object.create(Object.getPrototypeOf(node), {
    original: {
      // Provide a link from the copy to the original.
      value: node,
      configurable: false,
      enumerable: false,
      writable: true
    }
  });
  this.seen.set(node, copy);
  const loc = node.loc;
  const oldIndent = this.indent;
  let newIndent = oldIndent;
  const oldStartTokenIndex = this.startTokenIndex;
  const oldEndTokenIndex = this.endTokenIndex;
  if (loc) {
    if (node.type === "Block" || node.type === "Line" || node.type === "CommentBlock" || node.type === "CommentLine" || this.lines.isPrecededOnlyByWhitespace(loc.start)) {
      newIndent = this.indent = loc.start.column;
    }
    loc.lines = this.lines;
    loc.tokens = this.tokens;
    loc.indent = newIndent;
    this.findTokenRange(loc);
  }
  const keys = Object.keys(node);
  const keyCount = keys.length;
  for (let i = 0; i < keyCount; ++i) {
    const key = keys[i];
    if (key === "loc") {
      copy[key] = node[key];
    } else if (key === "tokens" && node.type === "File") {
      copy[key] = node[key];
    } else {
      copy[key] = this.copy(node[key]);
    }
  }
  this.indent = oldIndent;
  this.startTokenIndex = oldStartTokenIndex;
  this.endTokenIndex = oldEndTokenIndex;
  return copy;
};
TCp.findTokenRange = function(loc) {
  while (this.startTokenIndex > 0) {
    const token = loc.tokens[this.startTokenIndex];
    if (comparePos(loc.start, token.loc.start) < 0) {
      --this.startTokenIndex;
    } else
      break;
  }
  while (this.endTokenIndex < loc.tokens.length) {
    const token = loc.tokens[this.endTokenIndex];
    if (comparePos(token.loc.end, loc.end) < 0) {
      ++this.endTokenIndex;
    } else
      break;
  }
  while (this.startTokenIndex < this.endTokenIndex) {
    const token = loc.tokens[this.startTokenIndex];
    if (comparePos(token.loc.start, loc.start) < 0) {
      ++this.startTokenIndex;
    } else
      break;
  }
  loc.start.token = this.startTokenIndex;
  while (this.endTokenIndex > this.startTokenIndex) {
    const token = loc.tokens[this.endTokenIndex - 1];
    if (comparePos(loc.end, token.loc.end) < 0) {
      --this.endTokenIndex;
    } else
      break;
  }
  loc.end.token = this.endTokenIndex;
};

const n = namedTypes$1;
const isArray$1 = builtInTypes.array;
const isNumber = builtInTypes.number;
const PRECEDENCE = {};
[
  ["??"],
  ["||"],
  ["&&"],
  ["|"],
  ["^"],
  ["&"],
  ["==", "===", "!=", "!=="],
  ["<", ">", "<=", ">=", "in", "instanceof"],
  [">>", "<<", ">>>"],
  ["+", "-"],
  ["*", "/", "%"],
  ["**"]
].forEach(function(tier, i) {
  tier.forEach(function(op) {
    PRECEDENCE[op] = i;
  });
});
const FastPath = function FastPath2(value) {
  this.stack = [value];
};
const FPp = FastPath.prototype;
FastPath.from = function(obj) {
  if (obj instanceof FastPath) {
    return obj.copy();
  }
  if (obj instanceof NodePath) {
    const copy2 = Object.create(FastPath.prototype);
    const stack = [obj.value];
    for (let pp; pp = obj.parentPath; obj = pp)
      stack.push(obj.name, pp.value);
    copy2.stack = stack.reverse();
    return copy2;
  }
  return new FastPath(obj);
};
FPp.copy = function copy() {
  const copy2 = Object.create(FastPath.prototype);
  copy2.stack = this.stack.slice(0);
  return copy2;
};
FPp.getName = function getName() {
  const s = this.stack;
  const len = s.length;
  if (len > 1) {
    return s[len - 2];
  }
  return null;
};
FPp.getValue = function getValue() {
  const s = this.stack;
  return s[s.length - 1];
};
FPp.valueIsDuplicate = function() {
  const s = this.stack;
  const valueIndex = s.length - 1;
  return s.lastIndexOf(s[valueIndex], valueIndex - 1) >= 0;
};
function getNodeHelper(path, count) {
  const s = path.stack;
  for (let i = s.length - 1; i >= 0; i -= 2) {
    const value = s[i];
    if (n.Node.check(value) && --count < 0) {
      return value;
    }
  }
  return null;
}
FPp.getNode = function getNode(count = 0) {
  return getNodeHelper(this, ~~count);
};
FPp.getParentNode = function getParentNode(count = 0) {
  return getNodeHelper(this, ~~count + 1);
};
FPp.getRootValue = function getRootValue() {
  const s = this.stack;
  if (s.length % 2 === 0) {
    return s[1];
  }
  return s[0];
};
FPp.call = function call(callback) {
  const s = this.stack;
  const origLen = s.length;
  let value = s[origLen - 1];
  const argc = arguments.length;
  for (let i = 1; i < argc; ++i) {
    const name = arguments[i];
    value = value[name];
    s.push(name, value);
  }
  const result = callback(this);
  s.length = origLen;
  return result;
};
FPp.each = function each(callback) {
  const s = this.stack;
  const origLen = s.length;
  let value = s[origLen - 1];
  const argc = arguments.length;
  for (let i = 1; i < argc; ++i) {
    const name = arguments[i];
    value = value[name];
    s.push(name, value);
  }
  for (let i = 0; i < value.length; ++i) {
    if (i in value) {
      s.push(i, value[i]);
      callback(this);
      s.length -= 2;
    }
  }
  s.length = origLen;
};
FPp.map = function map(callback) {
  const s = this.stack;
  const origLen = s.length;
  let value = s[origLen - 1];
  const argc = arguments.length;
  for (let i = 1; i < argc; ++i) {
    const name = arguments[i];
    value = value[name];
    s.push(name, value);
  }
  const result = new Array(value.length);
  for (let i = 0; i < value.length; ++i) {
    if (i in value) {
      s.push(i, value[i]);
      result[i] = callback(this, i);
      s.length -= 2;
    }
  }
  s.length = origLen;
  return result;
};
FPp.hasParens = function() {
  const node = this.getNode();
  const prevToken = this.getPrevToken(node);
  if (!prevToken) {
    return false;
  }
  const nextToken = this.getNextToken(node);
  if (!nextToken) {
    return false;
  }
  if (prevToken.value === "(") {
    if (nextToken.value === ")") {
      return true;
    }
    const justNeedsOpeningParen = !this.canBeFirstInStatement() && this.firstInStatement() && !this.needsParens(true);
    if (justNeedsOpeningParen) {
      return true;
    }
  }
  return false;
};
FPp.getPrevToken = function(node) {
  node = node || this.getNode();
  const loc = node && node.loc;
  const tokens = loc && loc.tokens;
  if (tokens && loc.start.token > 0) {
    const token = tokens[loc.start.token - 1];
    if (token) {
      const rootLoc = this.getRootValue().loc;
      if (comparePos(rootLoc.start, token.loc.start) <= 0) {
        return token;
      }
    }
  }
  return null;
};
FPp.getNextToken = function(node) {
  node = node || this.getNode();
  const loc = node && node.loc;
  const tokens = loc && loc.tokens;
  if (tokens && loc.end.token < tokens.length) {
    const token = tokens[loc.end.token];
    if (token) {
      const rootLoc = this.getRootValue().loc;
      if (comparePos(token.loc.end, rootLoc.end) <= 0) {
        return token;
      }
    }
  }
  return null;
};
FPp.needsParens = function(assumeExpressionContext) {
  const node = this.getNode();
  if (node.type === "AssignmentExpression" && node.left.type === "ObjectPattern") {
    return true;
  }
  const parent = this.getParentNode();
  const name = this.getName();
  if (this.getValue() !== node) {
    return false;
  }
  if (n.Statement.check(node)) {
    return false;
  }
  if (node.type === "Identifier") {
    return false;
  }
  if (parent && parent.type === "ParenthesizedExpression") {
    return false;
  }
  if (node.extra && node.extra.parenthesized) {
    return true;
  }
  if (!parent)
    return false;
  if (node.type === "UnaryExpression" && parent.type === "BinaryExpression" && name === "left" && parent.left === node && parent.operator === "**") {
    return true;
  }
  switch (node.type) {
    case "UnaryExpression":
    case "SpreadElement":
    case "SpreadProperty":
      return parent.type === "MemberExpression" && name === "object" && parent.object === node;
    case "BinaryExpression":
    case "LogicalExpression":
      switch (parent.type) {
        case "CallExpression":
          return name === "callee" && parent.callee === node;
        case "UnaryExpression":
        case "SpreadElement":
        case "SpreadProperty":
          return true;
        case "MemberExpression":
          return name === "object" && parent.object === node;
        case "BinaryExpression":
        case "LogicalExpression": {
          const po = parent.operator;
          const pp = PRECEDENCE[po];
          const no = node.operator;
          const np = PRECEDENCE[no];
          if (pp > np) {
            return true;
          }
          if (pp === np && name === "right") {
            return true;
          }
          break;
        }
        default:
          return false;
      }
      break;
    case "SequenceExpression":
      switch (parent.type) {
        case "ReturnStatement":
          return false;
        case "ForStatement":
          return false;
        case "ExpressionStatement":
          return name !== "expression";
        default:
          return true;
      }
    case "OptionalIndexedAccessType":
      return node.optional && parent.type === "IndexedAccessType";
    case "IntersectionTypeAnnotation":
    case "UnionTypeAnnotation":
      return parent.type === "NullableTypeAnnotation";
    case "Literal":
      return parent.type === "MemberExpression" && isNumber.check(node.value) && name === "object" && parent.object === node;
    case "NumericLiteral":
      return parent.type === "MemberExpression" && name === "object" && parent.object === node;
    case "YieldExpression":
    case "AwaitExpression":
    case "AssignmentExpression":
    case "ConditionalExpression":
      switch (parent.type) {
        case "UnaryExpression":
        case "SpreadElement":
        case "SpreadProperty":
        case "BinaryExpression":
        case "LogicalExpression":
          return true;
        case "CallExpression":
        case "NewExpression":
          return name === "callee" && parent.callee === node;
        case "ConditionalExpression":
          return name === "test" && parent.test === node;
        case "MemberExpression":
          return name === "object" && parent.object === node;
        default:
          return false;
      }
    case "ArrowFunctionExpression":
      if (n.CallExpression.check(parent) && name === "callee" && parent.callee === node) {
        return true;
      }
      if (n.MemberExpression.check(parent) && name === "object" && parent.object === node) {
        return true;
      }
      if (n.TSAsExpression && n.TSAsExpression.check(parent) && name === "expression" && parent.expression === node) {
        return true;
      }
      return isBinary(parent);
    case "ObjectExpression":
      if (parent.type === "ArrowFunctionExpression" && name === "body" && parent.body === node) {
        return true;
      }
      break;
    case "TSAsExpression":
      if (parent.type === "ArrowFunctionExpression" && name === "body" && parent.body === node && node.expression.type === "ObjectExpression") {
        return true;
      }
      break;
    case "CallExpression":
      if (name === "declaration" && n.ExportDefaultDeclaration.check(parent) && n.FunctionExpression.check(node.callee)) {
        return true;
      }
  }
  if (parent.type === "NewExpression" && name === "callee" && parent.callee === node) {
    return containsCallExpression(node);
  }
  if (assumeExpressionContext !== true && !this.canBeFirstInStatement() && this.firstInStatement()) {
    return true;
  }
  return false;
};
function isBinary(node) {
  return n.BinaryExpression.check(node) || n.LogicalExpression.check(node);
}
function containsCallExpression(node) {
  if (n.CallExpression.check(node)) {
    return true;
  }
  if (isArray$1.check(node)) {
    return node.some(containsCallExpression);
  }
  if (n.Node.check(node)) {
    return someField(
      node,
      (_name, child) => containsCallExpression(child)
    );
  }
  return false;
}
FPp.canBeFirstInStatement = function() {
  const node = this.getNode();
  if (n.FunctionExpression.check(node)) {
    return false;
  }
  if (n.ObjectExpression.check(node)) {
    return false;
  }
  if (n.ClassExpression.check(node)) {
    return false;
  }
  return true;
};
FPp.firstInStatement = function() {
  const s = this.stack;
  let parentName, parent;
  let childName, child;
  for (let i = s.length - 1; i >= 0; i -= 2) {
    if (n.Node.check(s[i])) {
      childName = parentName;
      child = parent;
      parentName = s[i - 1];
      parent = s[i];
    }
    if (!parent || !child) {
      continue;
    }
    if (n.BlockStatement.check(parent) && parentName === "body" && childName === 0) {
      return true;
    }
    if (n.ExpressionStatement.check(parent) && childName === "expression") {
      return true;
    }
    if (n.AssignmentExpression.check(parent) && childName === "left") {
      return true;
    }
    if (n.ArrowFunctionExpression.check(parent) && childName === "body") {
      return true;
    }
    if (n.SequenceExpression.check(parent) && s[i + 1] === "expressions" && childName === 0) {
      continue;
    }
    if (n.CallExpression.check(parent) && childName === "callee") {
      continue;
    }
    if (n.MemberExpression.check(parent) && childName === "object") {
      continue;
    }
    if (n.ConditionalExpression.check(parent) && childName === "test") {
      continue;
    }
    if (isBinary(parent) && childName === "left") {
      continue;
    }
    if (n.UnaryExpression.check(parent) && !parent.prefix && childName === "argument") {
      continue;
    }
    return false;
  }
  return true;
};

const Printable = namedTypes$1.Printable;
const Expression = namedTypes$1.Expression;
const ReturnStatement = namedTypes$1.ReturnStatement;
const SourceLocation = namedTypes$1.SourceLocation;
const isObject$1 = builtInTypes.object;
const isArray = builtInTypes.array;
const isString$1 = builtInTypes.string;
const riskyAdjoiningCharExp = /[0-9a-z_$]/i;
const Patcher = function Patcher2(lines) {
  const self = this, replacements = [];
  self.replace = function(loc, lines2) {
    if (isString$1.check(lines2))
      lines2 = fromString(lines2);
    replacements.push({
      lines: lines2,
      start: loc.start,
      end: loc.end
    });
  };
  self.get = function(loc) {
    loc = loc || {
      start: { line: 1, column: 0 },
      end: { line: lines.length, column: lines.getLineLength(lines.length) }
    };
    let sliceFrom = loc.start, toConcat = [];
    function pushSlice(from, to) {
      toConcat.push(lines.slice(from, to));
    }
    replacements.sort((a, b) => comparePos(a.start, b.start)).forEach(function(rep) {
      if (comparePos(sliceFrom, rep.start) > 0) ; else {
        pushSlice(sliceFrom, rep.start);
        toConcat.push(rep.lines);
        sliceFrom = rep.end;
      }
    });
    pushSlice(sliceFrom, loc.end);
    return concat(toConcat);
  };
};
const Pp = Patcher.prototype;
Pp.tryToReprintComments = function(newNode, oldNode, print) {
  const patcher = this;
  if (!newNode.comments && !oldNode.comments) {
    return true;
  }
  const newPath = FastPath.from(newNode);
  const oldPath = FastPath.from(oldNode);
  newPath.stack.push("comments", getSurroundingComments(newNode));
  oldPath.stack.push("comments", getSurroundingComments(oldNode));
  const reprints = [];
  const ableToReprintComments = findArrayReprints(newPath, oldPath, reprints);
  if (ableToReprintComments && reprints.length > 0) {
    reprints.forEach(function(reprint) {
      const oldComment = reprint.oldPath.getValue();
      patcher.replace(
        oldComment.loc,
        // Comments can't have .comments, so it doesn't matter whether we
        // print with comments or without.
        print(reprint.newPath).indentTail(oldComment.loc.indent)
      );
    });
  }
  return ableToReprintComments;
};
function getSurroundingComments(node) {
  const result = [];
  if (node.comments && node.comments.length > 0) {
    node.comments.forEach(function(comment) {
      if (comment.leading || comment.trailing) {
        result.push(comment);
      }
    });
  }
  return result;
}
Pp.deleteComments = function(node) {
  if (!node.comments) {
    return;
  }
  const patcher = this;
  node.comments.forEach(function(comment) {
    if (comment.leading) {
      patcher.replace(
        {
          start: comment.loc.start,
          end: node.loc.lines.skipSpaces(comment.loc.end, false, false)
        },
        ""
      );
    } else if (comment.trailing) {
      patcher.replace(
        {
          start: node.loc.lines.skipSpaces(comment.loc.start, true, false),
          end: comment.loc.end
        },
        ""
      );
    }
  });
};
function getReprinter(path) {
  const node = path.getValue();
  if (!Printable.check(node))
    return;
  const orig = node.original;
  const origLoc = orig && orig.loc;
  const lines = origLoc && origLoc.lines;
  const reprints = [];
  if (!lines || !findReprints(path, reprints))
    return;
  return function(print) {
    const patcher = new Patcher(lines);
    reprints.forEach(function(reprint) {
      const newNode = reprint.newPath.getValue();
      const oldNode = reprint.oldPath.getValue();
      SourceLocation.assert(oldNode.loc, true);
      const needToPrintNewPathWithComments = !patcher.tryToReprintComments(
        newNode,
        oldNode,
        print
      );
      if (needToPrintNewPathWithComments) {
        patcher.deleteComments(oldNode);
      }
      let newLines = print(reprint.newPath, {
        includeComments: needToPrintNewPathWithComments,
        // If the oldNode we're replacing already had parentheses, we may
        // not need to print the new node with any extra parentheses,
        // because the existing parentheses will suffice. However, if the
        // newNode has a different type than the oldNode, let the printer
        // decide if reprint.newPath needs parentheses, as usual.
        avoidRootParens: oldNode.type === newNode.type && reprint.oldPath.hasParens()
      }).indentTail(oldNode.loc.indent);
      const nls = needsLeadingSpace(lines, oldNode.loc, newLines);
      const nts = needsTrailingSpace(lines, oldNode.loc, newLines);
      if (nls || nts) {
        const newParts = [];
        nls && newParts.push(" ");
        newParts.push(newLines);
        nts && newParts.push(" ");
        newLines = concat(newParts);
      }
      patcher.replace(oldNode.loc, newLines);
    });
    const patchedLines = patcher.get(origLoc).indentTail(-orig.loc.indent);
    if (path.needsParens()) {
      return concat(["(", patchedLines, ")"]);
    }
    return patchedLines;
  };
}
function needsLeadingSpace(oldLines, oldLoc, newLines) {
  const posBeforeOldLoc = copyPos(oldLoc.start);
  const charBeforeOldLoc = oldLines.prevPos(posBeforeOldLoc) && oldLines.charAt(posBeforeOldLoc);
  const newFirstChar = newLines.charAt(newLines.firstPos());
  return charBeforeOldLoc && riskyAdjoiningCharExp.test(charBeforeOldLoc) && newFirstChar && riskyAdjoiningCharExp.test(newFirstChar);
}
function needsTrailingSpace(oldLines, oldLoc, newLines) {
  const charAfterOldLoc = oldLines.charAt(oldLoc.end);
  const newLastPos = newLines.lastPos();
  const newLastChar = newLines.prevPos(newLastPos) && newLines.charAt(newLastPos);
  return newLastChar && riskyAdjoiningCharExp.test(newLastChar) && charAfterOldLoc && riskyAdjoiningCharExp.test(charAfterOldLoc);
}
function findReprints(newPath, reprints) {
  const newNode = newPath.getValue();
  Printable.assert(newNode);
  const oldNode = newNode.original;
  Printable.assert(oldNode);
  if (newNode.type !== oldNode.type) {
    return false;
  }
  const oldPath = new FastPath(oldNode);
  const canReprint = findChildReprints(newPath, oldPath, reprints);
  if (!canReprint) {
    reprints.length = 0;
  }
  return canReprint;
}
function findAnyReprints(newPath, oldPath, reprints) {
  const newNode = newPath.getValue();
  const oldNode = oldPath.getValue();
  if (newNode === oldNode)
    return true;
  if (isArray.check(newNode))
    return findArrayReprints(newPath, oldPath, reprints);
  if (isObject$1.check(newNode))
    return findObjectReprints(newPath, oldPath, reprints);
  return false;
}
function findArrayReprints(newPath, oldPath, reprints) {
  const newNode = newPath.getValue();
  const oldNode = oldPath.getValue();
  if (newNode === oldNode || newPath.valueIsDuplicate() || oldPath.valueIsDuplicate()) {
    return true;
  }
  isArray.assert(newNode);
  const len = newNode.length;
  if (!(isArray.check(oldNode) && oldNode.length === len))
    return false;
  for (let i = 0; i < len; ++i) {
    newPath.stack.push(i, newNode[i]);
    oldPath.stack.push(i, oldNode[i]);
    const canReprint = findAnyReprints(newPath, oldPath, reprints);
    newPath.stack.length -= 2;
    oldPath.stack.length -= 2;
    if (!canReprint) {
      return false;
    }
  }
  return true;
}
function findObjectReprints(newPath, oldPath, reprints) {
  const newNode = newPath.getValue();
  isObject$1.assert(newNode);
  if (newNode.original === null) {
    return false;
  }
  const oldNode = oldPath.getValue();
  if (!isObject$1.check(oldNode))
    return false;
  if (newNode === oldNode || newPath.valueIsDuplicate() || oldPath.valueIsDuplicate()) {
    return true;
  }
  if (Printable.check(newNode)) {
    if (!Printable.check(oldNode)) {
      return false;
    }
    const newParentNode = newPath.getParentNode();
    const oldParentNode = oldPath.getParentNode();
    if (oldParentNode !== null && oldParentNode.type === "FunctionTypeAnnotation" && newParentNode !== null && newParentNode.type === "FunctionTypeAnnotation") {
      const oldNeedsParens = oldParentNode.params.length !== 1 || !!oldParentNode.params[0].name;
      const newNeedParens = newParentNode.params.length !== 1 || !!newParentNode.params[0].name;
      if (!oldNeedsParens && newNeedParens) {
        return false;
      }
    }
    if (newNode.type === oldNode.type) {
      const childReprints = [];
      if (findChildReprints(newPath, oldPath, childReprints)) {
        reprints.push.apply(reprints, childReprints);
      } else if (oldNode.loc) {
        reprints.push({
          oldPath: oldPath.copy(),
          newPath: newPath.copy()
        });
      } else {
        return false;
      }
      return true;
    }
    if (Expression.check(newNode) && Expression.check(oldNode) && // If we have no .loc information for oldNode, then we won't be
    // able to reprint it.
    oldNode.loc) {
      reprints.push({
        oldPath: oldPath.copy(),
        newPath: newPath.copy()
      });
      return true;
    }
    return false;
  }
  return findChildReprints(newPath, oldPath, reprints);
}
function findChildReprints(newPath, oldPath, reprints) {
  const newNode = newPath.getValue();
  const oldNode = oldPath.getValue();
  isObject$1.assert(newNode);
  isObject$1.assert(oldNode);
  if (newNode.original === null) {
    return false;
  }
  if (newPath.needsParens() && !oldPath.hasParens()) {
    return false;
  }
  const keys = getUnionOfKeys(oldNode, newNode);
  if (oldNode.type === "File" || newNode.type === "File") {
    delete keys.tokens;
  }
  delete keys.loc;
  const originalReprintCount = reprints.length;
  for (let k in keys) {
    if (k.charAt(0) === "_") {
      continue;
    }
    newPath.stack.push(k, getFieldValue(newNode, k));
    oldPath.stack.push(k, getFieldValue(oldNode, k));
    const canReprint = findAnyReprints(newPath, oldPath, reprints);
    newPath.stack.length -= 2;
    oldPath.stack.length -= 2;
    if (!canReprint) {
      return false;
    }
  }
  if (ReturnStatement.check(newPath.getNode()) && reprints.length > originalReprintCount) {
    return false;
  }
  return true;
}

const namedTypes = namedTypes$1;
const isString = builtInTypes.string;
const isObject = builtInTypes.object;
const PrintResult = function PrintResult2(code, sourceMap) {
  isString.assert(code);
  this.code = code;
  if (sourceMap) {
    isObject.assert(sourceMap);
    this.map = sourceMap;
  }
};
const PRp = PrintResult.prototype;
let warnedAboutToString = false;
PRp.toString = function() {
  if (!warnedAboutToString) {
    console.warn(
      "Deprecation warning: recast.print now returns an object with a .code property. You appear to be treating the object as a string, which might still work but is strongly discouraged."
    );
    warnedAboutToString = true;
  }
  return this.code;
};
const emptyPrintResult = new PrintResult("");
const Printer = function Printer2(config) {
  const explicitTabWidth = config && config.tabWidth;
  config = normalize(config);
  config.sourceFileName = null;
  function makePrintFunctionWith(options, overrides) {
    options = Object.assign({}, options, overrides);
    return (path) => print(path, options);
  }
  function print(path, options) {
    options = options || {};
    if (options.includeComments) {
      return printComments(
        path,
        makePrintFunctionWith(options, {
          includeComments: false
        })
      );
    }
    const oldTabWidth = config.tabWidth;
    if (!explicitTabWidth) {
      const loc = path.getNode().loc;
      if (loc && loc.lines && loc.lines.guessTabWidth) {
        config.tabWidth = loc.lines.guessTabWidth();
      }
    }
    const reprinter = getReprinter(path);
    const lines = reprinter ? (
      // Since the print function that we pass to the reprinter will
      // be used to print "new" nodes, it's tempting to think we
      // should pass printRootGenerically instead of print, to avoid
      // calling maybeReprint again, but that would be a mistake
      // because the new nodes might not be entirely new, but merely
      // moved from elsewhere in the AST. The print function is the
      // right choice because it gives us the opportunity to reprint
      // such nodes using their original source.
      reprinter(print)
    ) : genericPrint(
      path,
      config,
      options,
      makePrintFunctionWith(options, {
        includeComments: true,
        avoidRootParens: false
      })
    );
    config.tabWidth = oldTabWidth;
    return lines;
  }
  this.print = function(ast) {
    if (!ast) {
      return emptyPrintResult;
    }
    const lines = print(FastPath.from(ast), {
      includeComments: true,
      avoidRootParens: false
    });
    return new PrintResult(
      lines.toString(config),
      composeSourceMaps(
        config.inputSourceMap,
        lines.getSourceMap(config.sourceMapName, config.sourceRoot)
      )
    );
  };
  this.printGenerically = function(ast) {
    if (!ast) {
      return emptyPrintResult;
    }
    function printGenerically(path2) {
      return printComments(
        path2,
        (path3) => genericPrint(
          path3,
          config,
          {
            includeComments: true,
            avoidRootParens: false
          },
          printGenerically
        )
      );
    }
    const path = FastPath.from(ast);
    const oldReuseWhitespace = config.reuseWhitespace;
    config.reuseWhitespace = false;
    const pr = new PrintResult(printGenerically(path).toString(config));
    config.reuseWhitespace = oldReuseWhitespace;
    return pr;
  };
};
function genericPrint(path, config, options, printPath) {
  const node = path.getValue();
  const parts = [];
  const linesWithoutParens = genericPrintNoParens(path, config, printPath);
  if (!node || linesWithoutParens.isEmpty()) {
    return linesWithoutParens;
  }
  let shouldAddParens = false;
  const decoratorsLines = printDecorators(path, printPath);
  if (decoratorsLines.isEmpty()) {
    if (!options.avoidRootParens) {
      shouldAddParens = path.needsParens();
    }
  } else {
    parts.push(decoratorsLines);
  }
  if (shouldAddParens) {
    parts.unshift("(");
  }
  parts.push(linesWithoutParens);
  if (shouldAddParens) {
    parts.push(")");
  }
  return concat(parts);
}
function genericPrintNoParens(path, options, print) {
  const n = path.getValue();
  if (!n) {
    return fromString("");
  }
  if (typeof n === "string") {
    return fromString(n, options);
  }
  namedTypes.Printable.assert(n);
  const parts = [];
  switch (n.type) {
    case "File":
      return path.call(print, "program");
    case "Program":
      if (n.directives) {
        path.each(function(childPath) {
          parts.push(print(childPath), ";\n");
        }, "directives");
      }
      if (n.interpreter) {
        parts.push(path.call(print, "interpreter"));
      }
      parts.push(
        path.call(
          (bodyPath) => printStatementSequence(bodyPath, options, print),
          "body"
        )
      );
      return concat(parts);
    case "Noop":
    case "EmptyStatement":
      return fromString("");
    case "ExpressionStatement":
      return concat([path.call(print, "expression"), ";"]);
    case "ParenthesizedExpression":
      return concat(["(", path.call(print, "expression"), ")"]);
    case "BinaryExpression":
    case "LogicalExpression":
    case "AssignmentExpression":
      return fromString(" ").join([
        path.call(print, "left"),
        n.operator,
        path.call(print, "right")
      ]);
    case "AssignmentPattern":
      return concat([
        path.call(print, "left"),
        " = ",
        path.call(print, "right")
      ]);
    case "MemberExpression":
    case "OptionalMemberExpression": {
      parts.push(path.call(print, "object"));
      const property = path.call(print, "property");
      const optional = getFieldValue(n, "optional");
      if (n.computed) {
        parts.push(optional ? "?.[" : "[", property, "]");
      } else {
        parts.push(optional ? "?." : ".", property);
      }
      return concat(parts);
    }
    case "ChainExpression":
      return path.call(print, "expression");
    case "MetaProperty":
      return concat([
        path.call(print, "meta"),
        ".",
        path.call(print, "property")
      ]);
    case "BindExpression":
      if (n.object) {
        parts.push(path.call(print, "object"));
      }
      parts.push("::", path.call(print, "callee"));
      return concat(parts);
    case "Path":
      return fromString(".").join(n.body);
    case "Identifier":
      return concat([
        fromString(n.name, options),
        n.optional ? "?" : "",
        path.call(print, "typeAnnotation")
      ]);
    case "SpreadElement":
    case "SpreadElementPattern":
    case "RestProperty":
    case "SpreadProperty":
    case "SpreadPropertyPattern":
    case "ObjectTypeSpreadProperty":
    case "RestElement":
      return concat([
        "...",
        path.call(print, "argument"),
        path.call(print, "typeAnnotation")
      ]);
    case "FunctionDeclaration":
    case "FunctionExpression":
    case "TSDeclareFunction":
      if (n.declare) {
        parts.push("declare ");
      }
      if (n.async) {
        parts.push("async ");
      }
      parts.push("function");
      if (n.generator)
        parts.push("*");
      if (n.id) {
        parts.push(
          " ",
          path.call(print, "id"),
          path.call(print, "typeParameters")
        );
      } else {
        if (n.typeParameters) {
          parts.push(path.call(print, "typeParameters"));
        }
      }
      parts.push(
        "(",
        printFunctionParams(path, options, print),
        ")",
        path.call(print, "returnType")
      );
      if (n.body) {
        parts.push(" ", path.call(print, "body"));
      }
      return concat(parts);
    case "ArrowFunctionExpression":
      if (n.async) {
        parts.push("async ");
      }
      if (n.typeParameters) {
        parts.push(path.call(print, "typeParameters"));
      }
      if (!options.arrowParensAlways && n.params.length === 1 && !n.rest && n.params[0].type === "Identifier" && !n.params[0].typeAnnotation && !n.returnType) {
        parts.push(path.call(print, "params", 0));
      } else {
        parts.push(
          "(",
          printFunctionParams(path, options, print),
          ")",
          path.call(print, "returnType")
        );
      }
      parts.push(" => ", path.call(print, "body"));
      return concat(parts);
    case "MethodDefinition":
      return printMethod(path, options, print);
    case "YieldExpression":
      parts.push("yield");
      if (n.delegate)
        parts.push("*");
      if (n.argument)
        parts.push(" ", path.call(print, "argument"));
      return concat(parts);
    case "AwaitExpression":
      parts.push("await");
      if (n.all)
        parts.push("*");
      if (n.argument)
        parts.push(" ", path.call(print, "argument"));
      return concat(parts);
    case "ModuleExpression":
      return concat([
        "module {\n",
        path.call(print, "body").indent(options.tabWidth),
        "\n}"
      ]);
    case "ModuleDeclaration":
      parts.push("module", path.call(print, "id"));
      if (n.source) {
        parts.push("from", path.call(print, "source"));
      } else {
        parts.push(path.call(print, "body"));
      }
      return fromString(" ").join(parts);
    case "ImportSpecifier":
      if (n.importKind && n.importKind !== "value") {
        parts.push(n.importKind + " ");
      }
      if (n.imported) {
        parts.push(path.call(print, "imported"));
        if (n.local && n.local.name !== n.imported.name) {
          parts.push(" as ", path.call(print, "local"));
        }
      } else if (n.id) {
        parts.push(path.call(print, "id"));
        if (n.name) {
          parts.push(" as ", path.call(print, "name"));
        }
      }
      return concat(parts);
    case "ExportSpecifier":
      if (n.exportKind && n.exportKind !== "value") {
        parts.push(n.exportKind + " ");
      }
      if (n.local) {
        parts.push(path.call(print, "local"));
        if (n.exported && n.exported.name !== n.local.name) {
          parts.push(" as ", path.call(print, "exported"));
        }
      } else if (n.id) {
        parts.push(path.call(print, "id"));
        if (n.name) {
          parts.push(" as ", path.call(print, "name"));
        }
      }
      return concat(parts);
    case "ExportBatchSpecifier":
      return fromString("*");
    case "ImportNamespaceSpecifier":
      parts.push("* as ");
      if (n.local) {
        parts.push(path.call(print, "local"));
      } else if (n.id) {
        parts.push(path.call(print, "id"));
      }
      return concat(parts);
    case "ImportDefaultSpecifier":
      if (n.local) {
        return path.call(print, "local");
      }
      return path.call(print, "id");
    case "TSExportAssignment":
      return concat(["export = ", path.call(print, "expression")]);
    case "ExportDeclaration":
    case "ExportDefaultDeclaration":
    case "ExportNamedDeclaration":
      return printExportDeclaration(path, options, print);
    case "ExportAllDeclaration":
      parts.push("export *");
      if (n.exported) {
        parts.push(" as ", path.call(print, "exported"));
      }
      parts.push(" from ", path.call(print, "source"), ";");
      return concat(parts);
    case "TSNamespaceExportDeclaration":
      parts.push("export as namespace ", path.call(print, "id"));
      return maybeAddSemicolon(concat(parts));
    case "ExportNamespaceSpecifier":
      return concat(["* as ", path.call(print, "exported")]);
    case "ExportDefaultSpecifier":
      return path.call(print, "exported");
    case "Import":
      return fromString("import", options);
    case "ImportExpression":
      return concat(["import(", path.call(print, "source"), ")"]);
    case "ImportDeclaration": {
      parts.push("import ");
      if (n.importKind && n.importKind !== "value") {
        parts.push(n.importKind + " ");
      }
      if (n.specifiers && n.specifiers.length > 0) {
        const unbracedSpecifiers = [];
        const bracedSpecifiers = [];
        path.each(function(specifierPath) {
          const spec = specifierPath.getValue();
          if (spec.type === "ImportSpecifier") {
            bracedSpecifiers.push(print(specifierPath));
          } else if (spec.type === "ImportDefaultSpecifier" || spec.type === "ImportNamespaceSpecifier") {
            unbracedSpecifiers.push(print(specifierPath));
          }
        }, "specifiers");
        unbracedSpecifiers.forEach((lines, i) => {
          if (i > 0) {
            parts.push(", ");
          }
          parts.push(lines);
        });
        if (bracedSpecifiers.length > 0) {
          let lines = fromString(", ").join(bracedSpecifiers);
          if (lines.getLineLength(1) > options.wrapColumn) {
            lines = concat([
              fromString(",\n").join(bracedSpecifiers).indent(options.tabWidth),
              ","
            ]);
          }
          if (unbracedSpecifiers.length > 0) {
            parts.push(", ");
          }
          if (lines.length > 1) {
            parts.push("{\n", lines, "\n}");
          } else if (options.objectCurlySpacing) {
            parts.push("{ ", lines, " }");
          } else {
            parts.push("{", lines, "}");
          }
        }
        parts.push(" from ");
      }
      parts.push(
        path.call(print, "source"),
        maybePrintImportAssertions(path, options, print),
        ";"
      );
      return concat(parts);
    }
    case "ImportAttribute":
      return concat([path.call(print, "key"), ": ", path.call(print, "value")]);
    case "StaticBlock":
      parts.push("static ");
    case "BlockStatement": {
      const naked = path.call(
        (bodyPath) => printStatementSequence(bodyPath, options, print),
        "body"
      );
      if (naked.isEmpty()) {
        if (!n.directives || n.directives.length === 0) {
          parts.push("{}");
          return concat(parts);
        }
      }
      parts.push("{\n");
      if (n.directives) {
        path.each(function(childPath) {
          parts.push(
            maybeAddSemicolon(print(childPath).indent(options.tabWidth)),
            n.directives.length > 1 || !naked.isEmpty() ? "\n" : ""
          );
        }, "directives");
      }
      parts.push(naked.indent(options.tabWidth));
      parts.push("\n}");
      return concat(parts);
    }
    case "ReturnStatement": {
      parts.push("return");
      if (n.argument) {
        const argLines = path.call(print, "argument");
        if (argLines.startsWithComment() || argLines.length > 1 && namedTypes.JSXElement && namedTypes.JSXElement.check(n.argument)) {
          parts.push(" (\n", argLines.indent(options.tabWidth), "\n)");
        } else {
          parts.push(" ", argLines);
        }
      }
      parts.push(";");
      return concat(parts);
    }
    case "CallExpression":
    case "OptionalCallExpression":
      parts.push(path.call(print, "callee"));
      if (n.typeParameters) {
        parts.push(path.call(print, "typeParameters"));
      }
      if (n.typeArguments) {
        parts.push(path.call(print, "typeArguments"));
      }
      if (getFieldValue(n, "optional")) {
        parts.push("?.");
      }
      parts.push(printArgumentsList(path, options, print));
      return concat(parts);
    case "RecordExpression":
      parts.push("#");
    case "ObjectExpression":
    case "ObjectPattern":
    case "ObjectTypeAnnotation": {
      const isTypeAnnotation = n.type === "ObjectTypeAnnotation";
      const separator = options.flowObjectCommas ? "," : isTypeAnnotation ? ";" : ",";
      const fields = [];
      let allowBreak = false;
      if (isTypeAnnotation) {
        fields.push("indexers", "callProperties");
        if (n.internalSlots != null) {
          fields.push("internalSlots");
        }
      }
      fields.push("properties");
      let len = 0;
      fields.forEach(function(field) {
        len += n[field].length;
      });
      const oneLine = isTypeAnnotation && len === 1 || len === 0;
      const leftBrace = n.exact ? "{|" : "{";
      const rightBrace = n.exact ? "|}" : "}";
      parts.push(oneLine ? leftBrace : leftBrace + "\n");
      const leftBraceIndex = parts.length - 1;
      let i = 0;
      fields.forEach(function(field) {
        path.each(function(childPath) {
          let lines = print(childPath);
          if (!oneLine) {
            lines = lines.indent(options.tabWidth);
          }
          const multiLine = !isTypeAnnotation && lines.length > 1;
          if (multiLine && allowBreak) {
            parts.push("\n");
          }
          parts.push(lines);
          if (i < len - 1) {
            parts.push(separator + (multiLine ? "\n\n" : "\n"));
            allowBreak = !multiLine;
          } else if (len !== 1 && isTypeAnnotation) {
            parts.push(separator);
          } else if (!oneLine && isTrailingCommaEnabled(options, "objects") && childPath.getValue().type !== "RestElement") {
            parts.push(separator);
          }
          i++;
        }, field);
      });
      if (n.inexact) {
        const line = fromString("...", options);
        if (oneLine) {
          if (len > 0) {
            parts.push(separator, " ");
          }
          parts.push(line);
        } else {
          parts.push("\n", line.indent(options.tabWidth));
        }
      }
      parts.push(oneLine ? rightBrace : "\n" + rightBrace);
      if (i !== 0 && oneLine && options.objectCurlySpacing) {
        parts[leftBraceIndex] = leftBrace + " ";
        parts[parts.length - 1] = " " + rightBrace;
      }
      if (n.typeAnnotation) {
        parts.push(path.call(print, "typeAnnotation"));
      }
      return concat(parts);
    }
    case "PropertyPattern":
      return concat([
        path.call(print, "key"),
        ": ",
        path.call(print, "pattern")
      ]);
    case "ObjectProperty":
    case "Property": {
      if (n.method || n.kind === "get" || n.kind === "set") {
        return printMethod(path, options, print);
      }
      if (n.shorthand && n.value.type === "AssignmentPattern") {
        return path.call(print, "value");
      }
      const key = path.call(print, "key");
      if (n.computed) {
        parts.push("[", key, "]");
      } else {
        parts.push(key);
      }
      if (!n.shorthand || n.key.name !== n.value.name) {
        parts.push(": ", path.call(print, "value"));
      }
      return concat(parts);
    }
    case "ClassMethod":
    case "ObjectMethod":
    case "ClassPrivateMethod":
    case "TSDeclareMethod":
      return printMethod(path, options, print);
    case "PrivateName":
      return concat(["#", path.call(print, "id")]);
    case "Decorator":
      return concat(["@", path.call(print, "expression")]);
    case "TupleExpression":
      parts.push("#");
    case "ArrayExpression":
    case "ArrayPattern": {
      const elems = n.elements;
      const len = elems.length;
      const printed = path.map(print, "elements");
      const joined = fromString(", ").join(printed);
      const oneLine = joined.getLineLength(1) <= options.wrapColumn;
      if (oneLine) {
        if (options.arrayBracketSpacing) {
          parts.push("[ ");
        } else {
          parts.push("[");
        }
      } else {
        parts.push("[\n");
      }
      path.each(function(elemPath) {
        const i = elemPath.getName();
        const elem = elemPath.getValue();
        if (!elem) {
          parts.push(",");
        } else {
          let lines = printed[i];
          if (oneLine) {
            if (i > 0)
              parts.push(" ");
          } else {
            lines = lines.indent(options.tabWidth);
          }
          parts.push(lines);
          if (i < len - 1 || !oneLine && isTrailingCommaEnabled(options, "arrays"))
            parts.push(",");
          if (!oneLine)
            parts.push("\n");
        }
      }, "elements");
      if (oneLine && options.arrayBracketSpacing) {
        parts.push(" ]");
      } else {
        parts.push("]");
      }
      if (n.typeAnnotation) {
        parts.push(path.call(print, "typeAnnotation"));
      }
      return concat(parts);
    }
    case "SequenceExpression":
      return fromString(", ").join(path.map(print, "expressions"));
    case "ThisExpression":
      return fromString("this");
    case "Super":
      return fromString("super");
    case "NullLiteral":
      return fromString("null");
    case "RegExpLiteral":
      return fromString(
        getPossibleRaw(n) || `/${n.pattern}/${n.flags || ""}`,
        options
      );
    case "BigIntLiteral":
      return fromString(getPossibleRaw(n) || n.value + "n", options);
    case "NumericLiteral":
      return fromString(getPossibleRaw(n) || n.value, options);
    case "DecimalLiteral":
      return fromString(getPossibleRaw(n) || n.value + "m", options);
    case "StringLiteral":
      return fromString(nodeStr(n.value, options));
    case "BooleanLiteral":
    case "Literal":
      return fromString(
        getPossibleRaw(n) || (typeof n.value === "string" ? nodeStr(n.value, options) : n.value),
        options
      );
    case "Directive":
      return path.call(print, "value");
    case "DirectiveLiteral":
      return fromString(
        getPossibleRaw(n) || nodeStr(n.value, options),
        options
      );
    case "InterpreterDirective":
      return fromString(`#!${n.value}
`, options);
    case "ModuleSpecifier":
      if (n.local) {
        throw new Error("The ESTree ModuleSpecifier type should be abstract");
      }
      return fromString(nodeStr(n.value, options), options);
    case "UnaryExpression":
      parts.push(n.operator);
      if (/[a-z]$/.test(n.operator))
        parts.push(" ");
      parts.push(path.call(print, "argument"));
      return concat(parts);
    case "UpdateExpression":
      parts.push(path.call(print, "argument"), n.operator);
      if (n.prefix)
        parts.reverse();
      return concat(parts);
    case "ConditionalExpression":
      return concat([
        path.call(print, "test"),
        " ? ",
        path.call(print, "consequent"),
        " : ",
        path.call(print, "alternate")
      ]);
    case "NewExpression": {
      parts.push("new ", path.call(print, "callee"));
      if (n.typeParameters) {
        parts.push(path.call(print, "typeParameters"));
      }
      if (n.typeArguments) {
        parts.push(path.call(print, "typeArguments"));
      }
      const args = n.arguments;
      if (args) {
        parts.push(printArgumentsList(path, options, print));
      }
      return concat(parts);
    }
    case "VariableDeclaration": {
      if (n.declare) {
        parts.push("declare ");
      }
      parts.push(n.kind, " ");
      let maxLen = 0;
      const printed = path.map(function(childPath) {
        const lines = print(childPath);
        maxLen = Math.max(lines.length, maxLen);
        return lines;
      }, "declarations");
      if (maxLen === 1) {
        parts.push(fromString(", ").join(printed));
      } else if (printed.length > 1) {
        parts.push(
          fromString(",\n").join(printed).indentTail(n.kind.length + 1)
        );
      } else {
        parts.push(printed[0]);
      }
      const parentNode = path.getParentNode();
      if (!namedTypes.ForStatement.check(parentNode) && !namedTypes.ForInStatement.check(parentNode) && !(namedTypes.ForOfStatement && namedTypes.ForOfStatement.check(parentNode)) && !(namedTypes.ForAwaitStatement && namedTypes.ForAwaitStatement.check(parentNode))) {
        parts.push(";");
      }
      return concat(parts);
    }
    case "VariableDeclarator":
      return n.init ? fromString(" = ").join([
        path.call(print, "id"),
        path.call(print, "init")
      ]) : path.call(print, "id");
    case "WithStatement":
      return concat([
        "with (",
        path.call(print, "object"),
        ") ",
        path.call(print, "body")
      ]);
    case "IfStatement": {
      const con = adjustClause(path.call(print, "consequent"), options);
      parts.push("if (", path.call(print, "test"), ")", con);
      if (n.alternate)
        parts.push(
          endsWithBrace(con) ? " else" : "\nelse",
          adjustClause(path.call(print, "alternate"), options)
        );
      return concat(parts);
    }
    case "ForStatement": {
      const init = path.call(print, "init");
      const sep = init.length > 1 ? ";\n" : "; ";
      const forParen = "for (";
      const indented = fromString(sep).join([init, path.call(print, "test"), path.call(print, "update")]).indentTail(forParen.length);
      const head = concat([forParen, indented, ")"]);
      let clause = adjustClause(path.call(print, "body"), options);
      parts.push(head);
      if (head.length > 1) {
        parts.push("\n");
        clause = clause.trimLeft();
      }
      parts.push(clause);
      return concat(parts);
    }
    case "WhileStatement":
      return concat([
        "while (",
        path.call(print, "test"),
        ")",
        adjustClause(path.call(print, "body"), options)
      ]);
    case "ForInStatement":
      return concat([
        n.each ? "for each (" : "for (",
        path.call(print, "left"),
        " in ",
        path.call(print, "right"),
        ")",
        adjustClause(path.call(print, "body"), options)
      ]);
    case "ForOfStatement":
    case "ForAwaitStatement":
      parts.push("for ");
      if (n.await || n.type === "ForAwaitStatement") {
        parts.push("await ");
      }
      parts.push(
        "(",
        path.call(print, "left"),
        " of ",
        path.call(print, "right"),
        ")",
        adjustClause(path.call(print, "body"), options)
      );
      return concat(parts);
    case "DoWhileStatement": {
      const doBody = concat([
        "do",
        adjustClause(path.call(print, "body"), options)
      ]);
      parts.push(doBody);
      if (endsWithBrace(doBody))
        parts.push(" while");
      else
        parts.push("\nwhile");
      parts.push(" (", path.call(print, "test"), ");");
      return concat(parts);
    }
    case "DoExpression": {
      const statements = path.call(
        (bodyPath) => printStatementSequence(bodyPath, options, print),
        "body"
      );
      return concat(["do {\n", statements.indent(options.tabWidth), "\n}"]);
    }
    case "BreakStatement":
      parts.push("break");
      if (n.label)
        parts.push(" ", path.call(print, "label"));
      parts.push(";");
      return concat(parts);
    case "ContinueStatement":
      parts.push("continue");
      if (n.label)
        parts.push(" ", path.call(print, "label"));
      parts.push(";");
      return concat(parts);
    case "LabeledStatement":
      return concat([
        path.call(print, "label"),
        ":\n",
        path.call(print, "body")
      ]);
    case "TryStatement":
      parts.push("try ", path.call(print, "block"));
      if (n.handler) {
        parts.push(" ", path.call(print, "handler"));
      } else if (n.handlers) {
        path.each(function(handlerPath) {
          parts.push(" ", print(handlerPath));
        }, "handlers");
      }
      if (n.finalizer) {
        parts.push(" finally ", path.call(print, "finalizer"));
      }
      return concat(parts);
    case "CatchClause":
      parts.push("catch ");
      if (n.param) {
        parts.push("(", path.call(print, "param"));
      }
      if (n.guard) {
        parts.push(" if ", path.call(print, "guard"));
      }
      if (n.param) {
        parts.push(") ");
      }
      parts.push(path.call(print, "body"));
      return concat(parts);
    case "ThrowStatement":
      return concat(["throw ", path.call(print, "argument"), ";"]);
    case "SwitchStatement":
      return concat([
        "switch (",
        path.call(print, "discriminant"),
        ") {\n",
        fromString("\n").join(path.map(print, "cases")),
        "\n}"
      ]);
    case "SwitchCase":
      if (n.test)
        parts.push("case ", path.call(print, "test"), ":");
      else
        parts.push("default:");
      if (n.consequent.length > 0) {
        parts.push(
          "\n",
          path.call(
            (consequentPath) => printStatementSequence(consequentPath, options, print),
            "consequent"
          ).indent(options.tabWidth)
        );
      }
      return concat(parts);
    case "DebuggerStatement":
      return fromString("debugger;");
    case "JSXAttribute":
      parts.push(path.call(print, "name"));
      if (n.value)
        parts.push("=", path.call(print, "value"));
      return concat(parts);
    case "JSXIdentifier":
      return fromString(n.name, options);
    case "JSXNamespacedName":
      return fromString(":").join([
        path.call(print, "namespace"),
        path.call(print, "name")
      ]);
    case "JSXMemberExpression":
      return fromString(".").join([
        path.call(print, "object"),
        path.call(print, "property")
      ]);
    case "JSXSpreadAttribute":
      return concat(["{...", path.call(print, "argument"), "}"]);
    case "JSXSpreadChild":
      return concat(["{...", path.call(print, "expression"), "}"]);
    case "JSXExpressionContainer":
      return concat(["{", path.call(print, "expression"), "}"]);
    case "JSXElement":
    case "JSXFragment": {
      const openingPropName = "opening" + (n.type === "JSXElement" ? "Element" : "Fragment");
      const closingPropName = "closing" + (n.type === "JSXElement" ? "Element" : "Fragment");
      const openingLines = path.call(print, openingPropName);
      if (n[openingPropName].selfClosing) {
        return openingLines;
      }
      const childLines = concat(
        path.map(function(childPath) {
          const child = childPath.getValue();
          if (namedTypes.Literal.check(child) && typeof child.value === "string") {
            if (/\S/.test(child.value)) {
              return child.value.replace(/^\s+|\s+$/g, "");
            } else if (/\n/.test(child.value)) {
              return "\n";
            }
          }
          return print(childPath);
        }, "children")
      ).indentTail(options.tabWidth);
      const closingLines = path.call(print, closingPropName);
      return concat([openingLines, childLines, closingLines]);
    }
    case "JSXOpeningElement": {
      parts.push("<", path.call(print, "name"));
      const attrParts = [];
      path.each(function(attrPath) {
        attrParts.push(" ", print(attrPath));
      }, "attributes");
      let attrLines = concat(attrParts);
      const needLineWrap = attrLines.length > 1 || attrLines.getLineLength(1) > options.wrapColumn;
      if (needLineWrap) {
        attrParts.forEach(function(part, i) {
          if (part === " ") {
            attrParts[i] = "\n";
          }
        });
        attrLines = concat(attrParts).indentTail(options.tabWidth);
      }
      parts.push(attrLines, n.selfClosing ? " />" : ">");
      return concat(parts);
    }
    case "JSXClosingElement":
      return concat(["</", path.call(print, "name"), ">"]);
    case "JSXOpeningFragment":
      return fromString("<>");
    case "JSXClosingFragment":
      return fromString("</>");
    case "JSXText":
      return fromString(n.value, options);
    case "JSXEmptyExpression":
      return fromString("");
    case "TypeAnnotatedIdentifier":
      return concat([
        path.call(print, "annotation"),
        " ",
        path.call(print, "identifier")
      ]);
    case "ClassBody":
      if (n.body.length === 0) {
        return fromString("{}");
      }
      return concat([
        "{\n",
        path.call(
          (bodyPath) => printStatementSequence(bodyPath, options, print),
          "body"
        ).indent(options.tabWidth),
        "\n}"
      ]);
    case "ClassPropertyDefinition":
      parts.push("static ", path.call(print, "definition"));
      if (!namedTypes.MethodDefinition.check(n.definition))
        parts.push(";");
      return concat(parts);
    case "ClassProperty": {
      if (n.declare) {
        parts.push("declare ");
      }
      const access = n.accessibility || n.access;
      if (typeof access === "string") {
        parts.push(access, " ");
      }
      if (n.static) {
        parts.push("static ");
      }
      if (n.abstract) {
        parts.push("abstract ");
      }
      if (n.readonly) {
        parts.push("readonly ");
      }
      let key = path.call(print, "key");
      if (n.computed) {
        key = concat(["[", key, "]"]);
      }
      if (n.variance) {
        key = concat([printVariance(path, print), key]);
      }
      parts.push(key);
      if (n.optional) {
        parts.push("?");
      }
      if (n.definite) {
        parts.push("!");
      }
      if (n.typeAnnotation) {
        parts.push(path.call(print, "typeAnnotation"));
      }
      if (n.value) {
        parts.push(" = ", path.call(print, "value"));
      }
      parts.push(";");
      return concat(parts);
    }
    case "ClassPrivateProperty":
      if (n.static) {
        parts.push("static ");
      }
      parts.push(path.call(print, "key"));
      if (n.typeAnnotation) {
        parts.push(path.call(print, "typeAnnotation"));
      }
      if (n.value) {
        parts.push(" = ", path.call(print, "value"));
      }
      parts.push(";");
      return concat(parts);
    case "ClassAccessorProperty": {
      parts.push(
        ...printClassMemberModifiers(n),
        "accessor "
      );
      if (n.computed) {
        parts.push("[", path.call(print, "key"), "]");
      } else {
        parts.push(path.call(print, "key"));
      }
      if (n.optional) {
        parts.push("?");
      }
      if (n.definite) {
        parts.push("!");
      }
      if (n.typeAnnotation) {
        parts.push(path.call(print, "typeAnnotation"));
      }
      if (n.value) {
        parts.push(" = ", path.call(print, "value"));
      }
      parts.push(";");
      return concat(parts);
    }
    case "ClassDeclaration":
    case "ClassExpression":
    case "DeclareClass":
      if (n.declare) {
        parts.push("declare ");
      }
      if (n.abstract) {
        parts.push("abstract ");
      }
      parts.push("class");
      if (n.id) {
        parts.push(" ", path.call(print, "id"));
      }
      if (n.typeParameters) {
        parts.push(path.call(print, "typeParameters"));
      }
      if (n.superClass) {
        parts.push(
          " extends ",
          path.call(print, "superClass"),
          path.call(print, "superTypeParameters")
        );
      }
      if (n.extends && n.extends.length > 0) {
        parts.push(
          " extends ",
          fromString(", ").join(path.map(print, "extends"))
        );
      }
      if (n["implements"] && n["implements"].length > 0) {
        parts.push(
          " implements ",
          fromString(", ").join(path.map(print, "implements"))
        );
      }
      parts.push(" ", path.call(print, "body"));
      if (n.type === "DeclareClass") {
        return printFlowDeclaration(path, parts);
      } else {
        return concat(parts);
      }
    case "TemplateElement":
      return fromString(n.value.raw, options).lockIndentTail();
    case "TemplateLiteral": {
      const expressions = path.map(print, "expressions");
      parts.push("`");
      path.each(function(childPath) {
        const i = childPath.getName();
        parts.push(print(childPath));
        if (i < expressions.length) {
          parts.push("${", expressions[i], "}");
        }
      }, "quasis");
      parts.push("`");
      return concat(parts).lockIndentTail();
    }
    case "TaggedTemplateExpression":
      return concat([path.call(print, "tag"), path.call(print, "quasi")]);
    case "Node":
    case "Printable":
    case "SourceLocation":
    case "Position":
    case "Statement":
    case "Function":
    case "Pattern":
    case "Expression":
    case "Declaration":
    case "Specifier":
    case "NamedSpecifier":
    case "Comment":
    case "Flow":
    case "FlowType":
    case "FlowPredicate":
    case "MemberTypeAnnotation":
    case "Type":
    case "TSHasOptionalTypeParameterInstantiation":
    case "TSHasOptionalTypeParameters":
    case "TSHasOptionalTypeAnnotation":
    case "ChainElement":
      throw new Error("unprintable type: " + JSON.stringify(n.type));
    case "CommentBlock":
    case "Block":
      return concat(["/*", fromString(n.value, options), "*/"]);
    case "CommentLine":
    case "Line":
      return concat(["//", fromString(n.value, options)]);
    case "TypeAnnotation":
      if (n.typeAnnotation) {
        if (n.typeAnnotation.type !== "FunctionTypeAnnotation") {
          parts.push(": ");
        }
        parts.push(path.call(print, "typeAnnotation"));
        return concat(parts);
      }
      return fromString("");
    case "ExistentialTypeParam":
    case "ExistsTypeAnnotation":
      return fromString("*", options);
    case "EmptyTypeAnnotation":
      return fromString("empty", options);
    case "AnyTypeAnnotation":
      return fromString("any", options);
    case "MixedTypeAnnotation":
      return fromString("mixed", options);
    case "ArrayTypeAnnotation":
      return concat([path.call(print, "elementType"), "[]"]);
    case "TupleTypeAnnotation": {
      const printed = path.map(print, "types");
      const joined = fromString(", ").join(printed);
      const oneLine = joined.getLineLength(1) <= options.wrapColumn;
      if (oneLine) {
        if (options.arrayBracketSpacing) {
          parts.push("[ ");
        } else {
          parts.push("[");
        }
      } else {
        parts.push("[\n");
      }
      path.each(function(elemPath) {
        const i = elemPath.getName();
        const elem = elemPath.getValue();
        if (!elem) {
          parts.push(",");
        } else {
          let lines = printed[i];
          if (oneLine) {
            if (i > 0)
              parts.push(" ");
          } else {
            lines = lines.indent(options.tabWidth);
          }
          parts.push(lines);
          if (i < n.types.length - 1 || !oneLine && isTrailingCommaEnabled(options, "arrays"))
            parts.push(",");
          if (!oneLine)
            parts.push("\n");
        }
      }, "types");
      if (oneLine && options.arrayBracketSpacing) {
        parts.push(" ]");
      } else {
        parts.push("]");
      }
      return concat(parts);
    }
    case "BooleanTypeAnnotation":
      return fromString("boolean", options);
    case "BooleanLiteralTypeAnnotation":
      return fromString("" + n.value, options);
    case "InterfaceTypeAnnotation":
      parts.push("interface");
      if (n.extends && n.extends.length > 0) {
        parts.push(
          " extends ",
          fromString(", ").join(path.map(print, "extends"))
        );
      }
      parts.push(" ", path.call(print, "body"));
      return concat(parts);
    case "DeclareFunction":
      return printFlowDeclaration(path, [
        "function ",
        path.call(print, "id"),
        ";"
      ]);
    case "DeclareModule":
      return printFlowDeclaration(path, [
        "module ",
        path.call(print, "id"),
        " ",
        path.call(print, "body")
      ]);
    case "DeclareModuleExports":
      return printFlowDeclaration(path, [
        "module.exports",
        path.call(print, "typeAnnotation")
      ]);
    case "DeclareVariable":
      return printFlowDeclaration(path, ["var ", path.call(print, "id"), ";"]);
    case "DeclareExportDeclaration":
    case "DeclareExportAllDeclaration":
      return concat(["declare ", printExportDeclaration(path, options, print)]);
    case "EnumDeclaration":
      return concat([
        "enum ",
        path.call(print, "id"),
        path.call(print, "body")
      ]);
    case "EnumBooleanBody":
    case "EnumNumberBody":
    case "EnumStringBody":
    case "EnumSymbolBody": {
      if (n.type === "EnumSymbolBody" || n.explicitType) {
        parts.push(
          " of ",
          // EnumBooleanBody => boolean, etc.
          n.type.slice(4, -4).toLowerCase()
        );
      }
      parts.push(
        " {\n",
        fromString("\n").join(path.map(print, "members")).indent(options.tabWidth),
        "\n}"
      );
      return concat(parts);
    }
    case "EnumDefaultedMember":
      return concat([path.call(print, "id"), ","]);
    case "EnumBooleanMember":
    case "EnumNumberMember":
    case "EnumStringMember":
      return concat([
        path.call(print, "id"),
        " = ",
        path.call(print, "init"),
        ","
      ]);
    case "InferredPredicate":
      return fromString("%checks", options);
    case "DeclaredPredicate":
      return concat(["%checks(", path.call(print, "value"), ")"]);
    case "FunctionTypeAnnotation": {
      const parent = path.getParentNode(0);
      const isArrowFunctionTypeAnnotation = !(namedTypes.ObjectTypeCallProperty.check(parent) || namedTypes.ObjectTypeInternalSlot.check(parent) && parent.method || namedTypes.DeclareFunction.check(path.getParentNode(2)));
      const needsColon = isArrowFunctionTypeAnnotation && !namedTypes.FunctionTypeParam.check(parent) && !namedTypes.TypeAlias.check(parent);
      if (needsColon) {
        parts.push(": ");
      }
      const hasTypeParameters = !!n.typeParameters;
      const needsParens = hasTypeParameters || n.params.length !== 1 || n.params[0].name;
      parts.push(
        hasTypeParameters ? path.call(print, "typeParameters") : "",
        needsParens ? "(" : "",
        printFunctionParams(path, options, print),
        needsParens ? ")" : ""
      );
      if (n.returnType) {
        parts.push(
          isArrowFunctionTypeAnnotation ? " => " : ": ",
          path.call(print, "returnType")
        );
      }
      return concat(parts);
    }
    case "FunctionTypeParam": {
      const name = path.call(print, "name");
      parts.push(name);
      if (n.optional) {
        parts.push("?");
      }
      if (name.infos[0].line) {
        parts.push(": ");
      }
      parts.push(path.call(print, "typeAnnotation"));
      return concat(parts);
    }
    case "GenericTypeAnnotation":
      return concat([
        path.call(print, "id"),
        path.call(print, "typeParameters")
      ]);
    case "DeclareInterface":
      parts.push("declare ");
    case "InterfaceDeclaration":
    case "TSInterfaceDeclaration":
      if (n.declare) {
        parts.push("declare ");
      }
      parts.push(
        "interface ",
        path.call(print, "id"),
        path.call(print, "typeParameters"),
        " "
      );
      if (n["extends"] && n["extends"].length > 0) {
        parts.push(
          "extends ",
          fromString(", ").join(path.map(print, "extends")),
          " "
        );
      }
      if (n.body) {
        parts.push(path.call(print, "body"));
      }
      return concat(parts);
    case "ClassImplements":
    case "InterfaceExtends":
      return concat([
        path.call(print, "id"),
        path.call(print, "typeParameters")
      ]);
    case "IntersectionTypeAnnotation":
      return fromString(" & ").join(path.map(print, "types"));
    case "NullableTypeAnnotation":
      return concat(["?", path.call(print, "typeAnnotation")]);
    case "NullLiteralTypeAnnotation":
      return fromString("null", options);
    case "ThisTypeAnnotation":
      return fromString("this", options);
    case "NumberTypeAnnotation":
      return fromString("number", options);
    case "ObjectTypeCallProperty":
      return path.call(print, "value");
    case "ObjectTypeIndexer":
      if (n.static) {
        parts.push("static ");
      }
      parts.push(printVariance(path, print), "[");
      if (n.id) {
        parts.push(path.call(print, "id"), ": ");
      }
      parts.push(path.call(print, "key"), "]: ", path.call(print, "value"));
      return concat(parts);
    case "ObjectTypeProperty":
      return concat([
        printVariance(path, print),
        path.call(print, "key"),
        n.optional ? "?" : "",
        ": ",
        path.call(print, "value")
      ]);
    case "ObjectTypeInternalSlot":
      return concat([
        n.static ? "static " : "",
        "[[",
        path.call(print, "id"),
        "]]",
        n.optional ? "?" : "",
        n.value.type !== "FunctionTypeAnnotation" ? ": " : "",
        path.call(print, "value")
      ]);
    case "QualifiedTypeIdentifier":
      return concat([
        path.call(print, "qualification"),
        ".",
        path.call(print, "id")
      ]);
    case "StringLiteralTypeAnnotation":
      return fromString(nodeStr(n.value, options), options);
    case "NumberLiteralTypeAnnotation":
    case "NumericLiteralTypeAnnotation":
      return fromString(JSON.stringify(n.value), options);
    case "BigIntLiteralTypeAnnotation":
      return fromString(n.raw, options);
    case "StringTypeAnnotation":
      return fromString("string", options);
    case "DeclareTypeAlias":
      parts.push("declare ");
    case "TypeAlias":
      return concat([
        "type ",
        path.call(print, "id"),
        path.call(print, "typeParameters"),
        " = ",
        path.call(print, "right"),
        ";"
      ]);
    case "DeclareOpaqueType":
      parts.push("declare ");
    case "OpaqueType":
      parts.push(
        "opaque type ",
        path.call(print, "id"),
        path.call(print, "typeParameters")
      );
      if (n["supertype"]) {
        parts.push(": ", path.call(print, "supertype"));
      }
      if (n["impltype"]) {
        parts.push(" = ", path.call(print, "impltype"));
      }
      parts.push(";");
      return concat(parts);
    case "TypeCastExpression":
      return concat([
        "(",
        path.call(print, "expression"),
        path.call(print, "typeAnnotation"),
        ")"
      ]);
    case "TypeParameterDeclaration":
    case "TypeParameterInstantiation":
      return concat([
        "<",
        fromString(", ").join(path.map(print, "params")),
        ">"
      ]);
    case "Variance":
      if (n.kind === "plus") {
        return fromString("+");
      }
      if (n.kind === "minus") {
        return fromString("-");
      }
      return fromString("");
    case "TypeParameter":
      if (n.variance) {
        parts.push(printVariance(path, print));
      }
      parts.push(path.call(print, "name"));
      if (n.bound) {
        parts.push(path.call(print, "bound"));
      }
      if (n["default"]) {
        parts.push("=", path.call(print, "default"));
      }
      return concat(parts);
    case "TypeofTypeAnnotation":
      return concat([
        fromString("typeof ", options),
        path.call(print, "argument")
      ]);
    case "IndexedAccessType":
    case "OptionalIndexedAccessType":
      return concat([
        path.call(print, "objectType"),
        n.optional ? "?." : "",
        "[",
        path.call(print, "indexType"),
        "]"
      ]);
    case "UnionTypeAnnotation":
      return fromString(" | ").join(path.map(print, "types"));
    case "VoidTypeAnnotation":
      return fromString("void", options);
    case "NullTypeAnnotation":
      return fromString("null", options);
    case "SymbolTypeAnnotation":
      return fromString("symbol", options);
    case "BigIntTypeAnnotation":
      return fromString("bigint", options);
    case "TSType":
      throw new Error("unprintable type: " + JSON.stringify(n.type));
    case "TSNumberKeyword":
      return fromString("number", options);
    case "TSBigIntKeyword":
      return fromString("bigint", options);
    case "TSObjectKeyword":
      return fromString("object", options);
    case "TSBooleanKeyword":
      return fromString("boolean", options);
    case "TSStringKeyword":
      return fromString("string", options);
    case "TSSymbolKeyword":
      return fromString("symbol", options);
    case "TSAnyKeyword":
      return fromString("any", options);
    case "TSVoidKeyword":
      return fromString("void", options);
    case "TSIntrinsicKeyword":
      return fromString("intrinsic", options);
    case "TSThisType":
      return fromString("this", options);
    case "TSNullKeyword":
      return fromString("null", options);
    case "TSUndefinedKeyword":
      return fromString("undefined", options);
    case "TSUnknownKeyword":
      return fromString("unknown", options);
    case "TSNeverKeyword":
      return fromString("never", options);
    case "TSArrayType":
      return concat([path.call(print, "elementType"), "[]"]);
    case "TSLiteralType":
      return path.call(print, "literal");
    case "TSUnionType":
      return fromString(" | ").join(path.map(print, "types"));
    case "TSIntersectionType":
      return fromString(" & ").join(path.map(print, "types"));
    case "TSConditionalType":
      parts.push(
        path.call(print, "checkType"),
        " extends ",
        path.call(print, "extendsType"),
        " ? ",
        path.call(print, "trueType"),
        " : ",
        path.call(print, "falseType")
      );
      return concat(parts);
    case "TSInferType":
      parts.push("infer ", path.call(print, "typeParameter"));
      return concat(parts);
    case "TSParenthesizedType":
      return concat(["(", path.call(print, "typeAnnotation"), ")"]);
    case "TSFunctionType":
      return concat([
        path.call(print, "typeParameters"),
        "(",
        printFunctionParams(path, options, print),
        ") => ",
        path.call(print, "typeAnnotation", "typeAnnotation")
      ]);
    case "TSConstructorType":
      return concat([
        "new ",
        path.call(print, "typeParameters"),
        "(",
        printFunctionParams(path, options, print),
        ") => ",
        path.call(print, "typeAnnotation", "typeAnnotation")
      ]);
    case "TSMappedType": {
      parts.push(
        n.readonly ? "readonly " : "",
        "[",
        path.call(print, "typeParameter"),
        "]",
        n.optional ? "?" : ""
      );
      if (n.typeAnnotation) {
        parts.push(": ", path.call(print, "typeAnnotation"), ";");
      }
      return concat(["{\n", concat(parts).indent(options.tabWidth), "\n}"]);
    }
    case "TSTupleType":
      return concat([
        "[",
        fromString(", ").join(path.map(print, "elementTypes")),
        "]"
      ]);
    case "TSNamedTupleMember":
      parts.push(path.call(print, "label"));
      if (n.optional) {
        parts.push("?");
      }
      parts.push(": ", path.call(print, "elementType"));
      return concat(parts);
    case "TSRestType":
      return concat(["...", path.call(print, "typeAnnotation")]);
    case "TSOptionalType":
      return concat([path.call(print, "typeAnnotation"), "?"]);
    case "TSIndexedAccessType":
      return concat([
        path.call(print, "objectType"),
        "[",
        path.call(print, "indexType"),
        "]"
      ]);
    case "TSTypeOperator":
      return concat([
        path.call(print, "operator"),
        " ",
        path.call(print, "typeAnnotation")
      ]);
    case "TSTypeLiteral": {
      const members = fromString("\n").join(
        path.map(print, "members").map((member) => {
          if (lastNonSpaceCharacter(member) !== ";") {
            return member.concat(";");
          }
          return member;
        })
      );
      if (members.isEmpty()) {
        return fromString("{}", options);
      }
      parts.push("{\n", members.indent(options.tabWidth), "\n}");
      return concat(parts);
    }
    case "TSEnumMember":
      parts.push(path.call(print, "id"));
      if (n.initializer) {
        parts.push(" = ", path.call(print, "initializer"));
      }
      return concat(parts);
    case "TSTypeQuery":
      return concat(["typeof ", path.call(print, "exprName")]);
    case "TSParameterProperty":
      if (n.accessibility) {
        parts.push(n.accessibility, " ");
      }
      if (n.export) {
        parts.push("export ");
      }
      if (n.static) {
        parts.push("static ");
      }
      if (n.readonly) {
        parts.push("readonly ");
      }
      parts.push(path.call(print, "parameter"));
      return concat(parts);
    case "TSTypeReference":
      return concat([
        path.call(print, "typeName"),
        path.call(print, "typeParameters")
      ]);
    case "TSQualifiedName":
      return concat([path.call(print, "left"), ".", path.call(print, "right")]);
    case "TSAsExpression":
    case "TSSatisfiesExpression": {
      const expression = path.call(print, "expression");
      parts.push(
        expression,
        n.type === "TSSatisfiesExpression" ? " satisfies " : " as ",
        path.call(print, "typeAnnotation")
      );
      return concat(parts);
    }
    case "TSTypeCastExpression":
      return concat([
        path.call(print, "expression"),
        path.call(print, "typeAnnotation")
      ]);
    case "TSNonNullExpression":
      return concat([path.call(print, "expression"), "!"]);
    case "TSTypeAnnotation":
      return concat([": ", path.call(print, "typeAnnotation")]);
    case "TSIndexSignature":
      return concat([
        n.readonly ? "readonly " : "",
        "[",
        path.map(print, "parameters"),
        "]",
        path.call(print, "typeAnnotation")
      ]);
    case "TSPropertySignature":
      parts.push(printVariance(path, print), n.readonly ? "readonly " : "");
      if (n.computed) {
        parts.push("[", path.call(print, "key"), "]");
      } else {
        parts.push(path.call(print, "key"));
      }
      parts.push(n.optional ? "?" : "", path.call(print, "typeAnnotation"));
      return concat(parts);
    case "TSMethodSignature":
      if (n.computed) {
        parts.push("[", path.call(print, "key"), "]");
      } else {
        parts.push(path.call(print, "key"));
      }
      if (n.optional) {
        parts.push("?");
      }
      parts.push(
        path.call(print, "typeParameters"),
        "(",
        printFunctionParams(path, options, print),
        ")",
        path.call(print, "typeAnnotation")
      );
      return concat(parts);
    case "TSTypePredicate":
      if (n.asserts) {
        parts.push("asserts ");
      }
      parts.push(path.call(print, "parameterName"));
      if (n.typeAnnotation) {
        parts.push(
          " is ",
          path.call(print, "typeAnnotation", "typeAnnotation")
        );
      }
      return concat(parts);
    case "TSCallSignatureDeclaration":
      return concat([
        path.call(print, "typeParameters"),
        "(",
        printFunctionParams(path, options, print),
        ")",
        path.call(print, "typeAnnotation")
      ]);
    case "TSConstructSignatureDeclaration":
      if (n.typeParameters) {
        parts.push("new", path.call(print, "typeParameters"));
      } else {
        parts.push("new ");
      }
      parts.push(
        "(",
        printFunctionParams(path, options, print),
        ")",
        path.call(print, "typeAnnotation")
      );
      return concat(parts);
    case "TSTypeAliasDeclaration":
      return concat([
        n.declare ? "declare " : "",
        "type ",
        path.call(print, "id"),
        path.call(print, "typeParameters"),
        " = ",
        path.call(print, "typeAnnotation"),
        ";"
      ]);
    case "TSTypeParameter": {
      parts.push(path.call(print, "name"));
      const parent = path.getParentNode(0);
      const isInMappedType = namedTypes.TSMappedType.check(parent);
      if (n.constraint) {
        parts.push(
          isInMappedType ? " in " : " extends ",
          path.call(print, "constraint")
        );
      }
      if (n["default"]) {
        parts.push(" = ", path.call(print, "default"));
      }
      return concat(parts);
    }
    case "TSTypeAssertion": {
      parts.push(
        "<",
        path.call(print, "typeAnnotation"),
        "> ",
        path.call(print, "expression")
      );
      return concat(parts);
    }
    case "TSTypeParameterDeclaration":
    case "TSTypeParameterInstantiation":
      return concat([
        "<",
        fromString(", ").join(path.map(print, "params")),
        ">"
      ]);
    case "TSEnumDeclaration": {
      parts.push(
        n.declare ? "declare " : "",
        n.const ? "const " : "",
        "enum ",
        path.call(print, "id")
      );
      const memberLines = fromString(",\n").join(path.map(print, "members"));
      if (memberLines.isEmpty()) {
        parts.push(" {}");
      } else {
        parts.push(" {\n", memberLines.indent(options.tabWidth), "\n}");
      }
      return concat(parts);
    }
    case "TSExpressionWithTypeArguments":
      return concat([
        path.call(print, "expression"),
        path.call(print, "typeParameters")
      ]);
    case "TSInterfaceBody": {
      const lines = fromString("\n").join(
        path.map(print, "body").map((element) => {
          if (lastNonSpaceCharacter(element) !== ";") {
            return element.concat(";");
          }
          return element;
        })
      );
      if (lines.isEmpty()) {
        return fromString("{}", options);
      }
      return concat(["{\n", lines.indent(options.tabWidth), "\n}"]);
    }
    case "TSImportType":
      parts.push("import(", path.call(print, "argument"), ")");
      if (n.qualifier) {
        parts.push(".", path.call(print, "qualifier"));
      }
      if (n.typeParameters) {
        parts.push(path.call(print, "typeParameters"));
      }
      return concat(parts);
    case "TSImportEqualsDeclaration":
      if (n.isExport) {
        parts.push("export ");
      }
      parts.push(
        "import ",
        path.call(print, "id"),
        " = ",
        path.call(print, "moduleReference")
      );
      return maybeAddSemicolon(concat(parts));
    case "TSExternalModuleReference":
      return concat(["require(", path.call(print, "expression"), ")"]);
    case "TSModuleDeclaration": {
      const parent = path.getParentNode();
      if (parent.type === "TSModuleDeclaration") {
        parts.push(".");
      } else {
        if (n.declare) {
          parts.push("declare ");
        }
        if (!n.global) {
          const isExternal = n.id.type === "StringLiteral" || n.id.type === "Literal" && typeof n.id.value === "string";
          if (isExternal) {
            parts.push("module ");
          } else if (n.loc && n.loc.lines && n.id.loc) {
            const prefix = n.loc.lines.sliceString(n.loc.start, n.id.loc.start);
            if (prefix.indexOf("module") >= 0) {
              parts.push("module ");
            } else {
              parts.push("namespace ");
            }
          } else {
            parts.push("namespace ");
          }
        }
      }
      parts.push(path.call(print, "id"));
      if (n.body) {
        parts.push(" ");
        parts.push(path.call(print, "body"));
      }
      return concat(parts);
    }
    case "TSModuleBlock": {
      const naked = path.call(
        (bodyPath) => printStatementSequence(bodyPath, options, print),
        "body"
      );
      if (naked.isEmpty()) {
        parts.push("{}");
      } else {
        parts.push("{\n", naked.indent(options.tabWidth), "\n}");
      }
      return concat(parts);
    }
    case "TSInstantiationExpression": {
      parts.push(
        path.call(print, "expression"),
        path.call(print, "typeParameters")
      );
      return concat(parts);
    }
    case "V8IntrinsicIdentifier":
      return concat(["%", path.call(print, "name")]);
    case "TopicReference":
      return fromString("#");
    case "ClassHeritage":
    case "ComprehensionBlock":
    case "ComprehensionExpression":
    case "Glob":
    case "GeneratorExpression":
    case "LetStatement":
    case "LetExpression":
    case "GraphExpression":
    case "GraphIndexExpression":
    case "XMLDefaultDeclaration":
    case "XMLAnyName":
    case "XMLQualifiedIdentifier":
    case "XMLFunctionQualifiedIdentifier":
    case "XMLAttributeSelector":
    case "XMLFilterExpression":
    case "XML":
    case "XMLElement":
    case "XMLList":
    case "XMLEscape":
    case "XMLText":
    case "XMLStartTag":
    case "XMLEndTag":
    case "XMLPointTag":
    case "XMLName":
    case "XMLAttribute":
    case "XMLCdata":
    case "XMLComment":
    case "XMLProcessingInstruction":
    default:
      debugger;
      throw new Error("unknown type: " + JSON.stringify(n.type));
  }
}
function printDecorators(path, printPath) {
  const parts = [];
  const node = path.getValue();
  if (node.decorators && node.decorators.length > 0 && // If the parent node is an export declaration, it will be
  // responsible for printing node.decorators.
  !getParentExportDeclaration(path)) {
    path.each(function(decoratorPath) {
      parts.push(printPath(decoratorPath), "\n");
    }, "decorators");
  } else if (isExportDeclaration(node) && node.declaration && node.declaration.decorators) {
    path.each(
      function(decoratorPath) {
        parts.push(printPath(decoratorPath), "\n");
      },
      "declaration",
      "decorators"
    );
  }
  return concat(parts);
}
function printStatementSequence(path, options, print) {
  const filtered = [];
  path.each(function(stmtPath) {
    const stmt = stmtPath.getValue();
    if (!stmt) {
      return;
    }
    if (stmt.type === "EmptyStatement" && !(stmt.comments && stmt.comments.length > 0)) {
      return;
    }
    if (namedTypes.Comment.check(stmt)) ; else if (namedTypes.Statement.check(stmt)) ; else {
      isString.assert(stmt);
    }
    filtered.push({
      node: stmt,
      printed: print(stmtPath)
    });
  });
  let prevTrailingSpace = null;
  const len = filtered.length;
  const parts = [];
  filtered.forEach(function(info, i) {
    const printed = info.printed;
    const stmt = info.node;
    const multiLine = printed.length > 1;
    const notFirst = i > 0;
    const notLast = i < len - 1;
    let leadingSpace;
    let trailingSpace;
    const lines = stmt && stmt.loc && stmt.loc.lines;
    const trueLoc = lines && options.reuseWhitespace && getTrueLoc(stmt, lines);
    if (notFirst) {
      if (trueLoc) {
        const beforeStart = lines.skipSpaces(trueLoc.start, true);
        const beforeStartLine = beforeStart ? beforeStart.line : 1;
        const leadingGap = trueLoc.start.line - beforeStartLine;
        leadingSpace = Array(leadingGap + 1).join("\n");
      } else {
        leadingSpace = multiLine ? "\n\n" : "\n";
      }
    } else {
      leadingSpace = "";
    }
    if (notLast) {
      if (trueLoc) {
        const afterEnd = lines.skipSpaces(trueLoc.end);
        const afterEndLine = afterEnd ? afterEnd.line : lines.length;
        const trailingGap = afterEndLine - trueLoc.end.line;
        trailingSpace = Array(trailingGap + 1).join("\n");
      } else {
        trailingSpace = multiLine ? "\n\n" : "\n";
      }
    } else {
      trailingSpace = "";
    }
    parts.push(maxSpace(prevTrailingSpace, leadingSpace), printed);
    if (notLast) {
      prevTrailingSpace = trailingSpace;
    } else if (trailingSpace) {
      parts.push(trailingSpace);
    }
  });
  return concat(parts);
}
function maxSpace(s1, s2) {
  if (!s1 && !s2) {
    return fromString("");
  }
  if (!s1) {
    return fromString(s2);
  }
  if (!s2) {
    return fromString(s1);
  }
  const spaceLines1 = fromString(s1);
  const spaceLines2 = fromString(s2);
  if (spaceLines2.length > spaceLines1.length) {
    return spaceLines2;
  }
  return spaceLines1;
}
function printClassMemberModifiers(node) {
  const parts = [];
  if (node.declare) {
    parts.push("declare ");
  }
  const access = node.accessibility || node.access;
  if (typeof access === "string") {
    parts.push(access, " ");
  }
  if (node.static) {
    parts.push("static ");
  }
  if (node.override) {
    parts.push("override ");
  }
  if (node.abstract) {
    parts.push("abstract ");
  }
  if (node.readonly) {
    parts.push("readonly ");
  }
  return parts;
}
function printMethod(path, options, print) {
  const node = path.getNode();
  const kind = node.kind;
  const parts = [];
  let nodeValue = node.value;
  if (!namedTypes.FunctionExpression.check(nodeValue)) {
    nodeValue = node;
  }
  parts.push(...printClassMemberModifiers(node));
  if (nodeValue.async) {
    parts.push("async ");
  }
  if (nodeValue.generator) {
    parts.push("*");
  }
  if (kind === "get" || kind === "set") {
    parts.push(kind, " ");
  }
  let key = path.call(print, "key");
  if (node.computed) {
    key = concat(["[", key, "]"]);
  }
  parts.push(key);
  if (node.optional) {
    parts.push("?");
  }
  if (node === nodeValue) {
    parts.push(
      path.call(print, "typeParameters"),
      "(",
      printFunctionParams(path, options, print),
      ")",
      path.call(print, "returnType")
    );
    if (node.body) {
      parts.push(" ", path.call(print, "body"));
    } else {
      parts.push(";");
    }
  } else {
    parts.push(
      path.call(print, "value", "typeParameters"),
      "(",
      path.call(
        (valuePath) => printFunctionParams(valuePath, options, print),
        "value"
      ),
      ")",
      path.call(print, "value", "returnType")
    );
    if (nodeValue.body) {
      parts.push(" ", path.call(print, "value", "body"));
    } else {
      parts.push(";");
    }
  }
  return concat(parts);
}
function printArgumentsList(path, options, print) {
  const printed = path.map(print, "arguments");
  const trailingComma = isTrailingCommaEnabled(options, "parameters");
  let joined = fromString(", ").join(printed);
  if (joined.getLineLength(1) > options.wrapColumn) {
    joined = fromString(",\n").join(printed);
    return concat([
      "(\n",
      joined.indent(options.tabWidth),
      trailingComma ? ",\n)" : "\n)"
    ]);
  }
  return concat(["(", joined, ")"]);
}
function printFunctionParams(path, options, print) {
  const fun = path.getValue();
  let params;
  let printed = [];
  if (fun.params) {
    params = fun.params;
    printed = path.map(print, "params");
  } else if (fun.parameters) {
    params = fun.parameters;
    printed = path.map(print, "parameters");
  }
  if (fun.defaults) {
    path.each(function(defExprPath) {
      const i = defExprPath.getName();
      const p = printed[i];
      if (p && defExprPath.getValue()) {
        printed[i] = concat([p, " = ", print(defExprPath)]);
      }
    }, "defaults");
  }
  if (fun.rest) {
    printed.push(concat(["...", path.call(print, "rest")]));
  }
  let joined = fromString(", ").join(printed);
  if (joined.length > 1 || joined.getLineLength(1) > options.wrapColumn) {
    joined = fromString(",\n").join(printed);
    if (isTrailingCommaEnabled(options, "parameters") && !fun.rest && params[params.length - 1].type !== "RestElement") {
      joined = concat([joined, ",\n"]);
    } else {
      joined = concat([joined, "\n"]);
    }
    return concat(["\n", joined.indent(options.tabWidth)]);
  }
  return joined;
}
function maybePrintImportAssertions(path, options, print) {
  const n = path.getValue();
  if (n.assertions && n.assertions.length > 0) {
    const parts = [" assert {"];
    const printed = path.map(print, "assertions");
    const flat = fromString(", ").join(printed);
    if (flat.length > 1 || flat.getLineLength(1) > options.wrapColumn) {
      parts.push(
        "\n",
        fromString(",\n").join(printed).indent(options.tabWidth),
        "\n}"
      );
    } else {
      parts.push(" ", flat, " }");
    }
    return concat(parts);
  }
  return fromString("");
}
function printExportDeclaration(path, options, print) {
  const decl = path.getValue();
  const parts = ["export "];
  if (decl.exportKind && decl.exportKind === "type") {
    if (!decl.declaration) {
      parts.push("type ");
    }
  }
  const shouldPrintSpaces = options.objectCurlySpacing;
  namedTypes.Declaration.assert(decl);
  if (decl["default"] || decl.type === "ExportDefaultDeclaration") {
    parts.push("default ");
  }
  if (decl.declaration) {
    parts.push(path.call(print, "declaration"));
  } else if (decl.specifiers) {
    if (decl.specifiers.length === 1 && decl.specifiers[0].type === "ExportBatchSpecifier") {
      parts.push("*");
    } else if (decl.specifiers.length === 0) {
      parts.push("{}");
    } else if (decl.specifiers[0].type === "ExportDefaultSpecifier") {
      const unbracedSpecifiers = [];
      const bracedSpecifiers = [];
      path.each(function(specifierPath) {
        const spec = specifierPath.getValue();
        if (spec.type === "ExportDefaultSpecifier") {
          unbracedSpecifiers.push(print(specifierPath));
        } else {
          bracedSpecifiers.push(print(specifierPath));
        }
      }, "specifiers");
      unbracedSpecifiers.forEach((lines2, i) => {
        if (i > 0) {
          parts.push(", ");
        }
        parts.push(lines2);
      });
      if (bracedSpecifiers.length > 0) {
        let lines2 = fromString(", ").join(bracedSpecifiers);
        if (lines2.getLineLength(1) > options.wrapColumn) {
          lines2 = concat([
            fromString(",\n").join(bracedSpecifiers).indent(options.tabWidth),
            ","
          ]);
        }
        if (unbracedSpecifiers.length > 0) {
          parts.push(", ");
        }
        if (lines2.length > 1) {
          parts.push("{\n", lines2, "\n}");
        } else if (options.objectCurlySpacing) {
          parts.push("{ ", lines2, " }");
        } else {
          parts.push("{", lines2, "}");
        }
      }
    } else {
      parts.push(
        shouldPrintSpaces ? "{ " : "{",
        fromString(", ").join(path.map(print, "specifiers")),
        shouldPrintSpaces ? " }" : "}"
      );
    }
    if (decl.source) {
      parts.push(
        " from ",
        path.call(print, "source"),
        maybePrintImportAssertions(path, options, print)
      );
    }
  }
  let lines = concat(parts);
  if (lastNonSpaceCharacter(lines) !== ";" && !(decl.declaration && (decl.declaration.type === "FunctionDeclaration" || decl.declaration.type === "ClassDeclaration" || decl.declaration.type === "TSModuleDeclaration" || decl.declaration.type === "TSInterfaceDeclaration" || decl.declaration.type === "TSEnumDeclaration"))) {
    lines = concat([lines, ";"]);
  }
  return lines;
}
function printFlowDeclaration(path, parts) {
  const parentExportDecl = getParentExportDeclaration(path);
  if (parentExportDecl) ; else {
    parts.unshift("declare ");
  }
  return concat(parts);
}
function printVariance(path, print) {
  return path.call(function(variancePath) {
    const value = variancePath.getValue();
    if (value) {
      if (value === "plus") {
        return fromString("+");
      }
      if (value === "minus") {
        return fromString("-");
      }
      return print(variancePath);
    }
    return fromString("");
  }, "variance");
}
function adjustClause(clause, options) {
  if (clause.length > 1)
    return concat([" ", clause]);
  return concat(["\n", maybeAddSemicolon(clause).indent(options.tabWidth)]);
}
function lastNonSpaceCharacter(lines) {
  const pos = lines.lastPos();
  do {
    const ch = lines.charAt(pos);
    if (/\S/.test(ch))
      return ch;
  } while (lines.prevPos(pos));
}
function endsWithBrace(lines) {
  return lastNonSpaceCharacter(lines) === "}";
}
function swapQuotes(str) {
  return str.replace(/['"]/g, (m) => m === '"' ? "'" : '"');
}
function getPossibleRaw(node) {
  const value = getFieldValue(node, "value");
  const extra = getFieldValue(node, "extra");
  if (extra && typeof extra.raw === "string" && value == extra.rawValue) {
    return extra.raw;
  }
  if (node.type === "Literal") {
    const raw = node.raw;
    if (typeof raw === "string" && value == raw) {
      return raw;
    }
  }
}
function jsSafeStringify(str) {
  return JSON.stringify(str).replace(/[\u2028\u2029]/g, function(m) {
    return "\\u" + m.charCodeAt(0).toString(16);
  });
}
function nodeStr(str, options) {
  isString.assert(str);
  switch (options.quote) {
    case "auto": {
      const double = jsSafeStringify(str);
      const single = swapQuotes(jsSafeStringify(swapQuotes(str)));
      return double.length > single.length ? single : double;
    }
    case "single":
      return swapQuotes(jsSafeStringify(swapQuotes(str)));
    case "double":
    default:
      return jsSafeStringify(str);
  }
}
function maybeAddSemicolon(lines) {
  const eoc = lastNonSpaceCharacter(lines);
  if (!eoc || "\n};".indexOf(eoc) < 0)
    return concat([lines, ";"]);
  return lines;
}

function print(node, options) {
  return new Printer(options).print(node);
}

let _babelParser;
function getBabelParser() {
  if (_babelParser) {
    return _babelParser;
  }
  const babelOptions = _getBabelOptions();
  _babelParser = {
    parse(source, options) {
      return parse_1(source, {
        ...babelOptions,
        ...options
      });
    }
  };
  return _babelParser;
}
function _getBabelOptions() {
  return {
    sourceType: "module",
    strictMode: false,
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    startLine: 1,
    tokens: true,
    plugins: [
      "asyncGenerators",
      "bigInt",
      "classPrivateMethods",
      "classPrivateProperties",
      "classProperties",
      "classStaticBlock",
      "decimal",
      "decorators-legacy",
      "doExpressions",
      "dynamicImport",
      "exportDefaultFrom",
      "exportExtensions",
      "exportNamespaceFrom",
      "functionBind",
      "functionSent",
      "importAssertions",
      "importMeta",
      "nullishCoalescingOperator",
      "numericSeparator",
      "objectRestSpread",
      "optionalCatchBinding",
      "optionalChaining",
      [
        "pipelineOperator",
        {
          proposal: "minimal"
        }
      ],
      [
        "recordAndTuple",
        {
          syntaxType: "hash"
        }
      ],
      "throwExpressions",
      "topLevelAwait",
      "v8intrinsic",
      "jsx",
      "typescript"
    ]
  };
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class MagicastError extends Error {
  constructor(message, options) {
    super("");
    __publicField(this, "rawMessage");
    __publicField(this, "options");
    this.name = "MagicastError";
    this.rawMessage = message;
    this.options = options;
    if (options?.ast && options?.code && options.ast.loc) {
      const { line, column } = options.ast.loc.start;
      const lines = options.code.split("\n");
      const start = Math.max(0, line - 3);
      const end = Math.min(lines.length, line + 3);
      const codeFrame = lines.slice(start, end).map((lineCode, i) => {
        const number = (start + i + 1).toString().padStart(3, " ");
        lineCode = `${number} | ${lineCode}`;
        if (start + i === line - 1) {
          lineCode += `
${" ".repeat(6 + column)}^`;
        }
        return lineCode;
      });
      message += `

${codeFrame.join("\n")}
`;
    }
    this.message = message;
  }
}

const LITERALS_AST = /* @__PURE__ */ new Set([
  "Literal",
  "StringLiteral",
  "NumericLiteral",
  "BooleanLiteral",
  "NullLiteral",
  "RegExpLiteral",
  "BigIntLiteral"
]);
const LITERALS_TYPEOF = /* @__PURE__ */ new Set([
  "string",
  "number",
  "boolean",
  "bigint",
  "symbol",
  "undefined"
]);
const b$4 = builders$1;
function isValidPropName(name) {
  return /^[$A-Z_a-z][\w$]*$/.test(name);
}
const PROXY_KEY = "__magicast_proxy";
function literalToAst(value, seen = /* @__PURE__ */ new Set()) {
  if (value === void 0) {
    return b$4.identifier("undefined");
  }
  if (value === null) {
    return b$4.literal(null);
  }
  if (LITERALS_TYPEOF.has(typeof value)) {
    return b$4.literal(value);
  }
  if (seen.has(value)) {
    throw new MagicastError("Can not serialize circular reference");
  }
  seen.add(value);
  if (value[PROXY_KEY]) {
    return value.$ast;
  }
  if (value instanceof RegExp) {
    const regex = b$4.regExpLiteral(value.source, value.flags);
    delete regex.extra.raw;
    return regex;
  }
  if (value instanceof Set) {
    return b$4.newExpression(b$4.identifier("Set"), [
      b$4.arrayExpression([...value].map((n) => literalToAst(n, seen)))
    ]);
  }
  if (value instanceof Date) {
    return b$4.newExpression(b$4.identifier("Date"), [
      b$4.literal(value.toISOString())
    ]);
  }
  if (value instanceof Map) {
    return b$4.newExpression(b$4.identifier("Map"), [
      b$4.arrayExpression(
        [...value].map(([key, value2]) => {
          return b$4.arrayExpression([
            literalToAst(key, seen),
            literalToAst(value2, seen)
          ]);
        })
      )
    ]);
  }
  if (Array.isArray(value)) {
    return b$4.arrayExpression(
      value.map((n) => literalToAst(n, seen))
    );
  }
  if (typeof value === "object") {
    return b$4.objectExpression(
      Object.entries(value).map(([key, value2]) => {
        return b$4.property(
          "init",
          /^[$A-Z_a-z][\w$]*$/g.test(key) ? b$4.identifier(key) : b$4.literal(key),
          literalToAst(value2, seen)
        );
      })
    );
  }
  return b$4.literal(value);
}
function makeProxyUtils(node, extend = {}) {
  const obj = extend;
  obj[PROXY_KEY] = true;
  obj.$ast = node;
  obj.$type || (obj.$type = "object");
  return obj;
}
const propertyDescriptor = {
  enumerable: true,
  configurable: true
};
function createProxy(node, extend, handler) {
  const utils = makeProxyUtils(node, extend);
  return new Proxy(
    {},
    {
      ownKeys() {
        return Object.keys(utils).filter(
          (i) => i !== PROXY_KEY && !i.startsWith("$")
        );
      },
      getOwnPropertyDescriptor() {
        return propertyDescriptor;
      },
      has(_target, key) {
        if (key in utils) {
          return true;
        }
        return false;
      },
      ...handler,
      get(target, key, receiver) {
        if (key in utils) {
          return utils[key];
        }
        if (handler.get) {
          return handler.get(target, key, receiver);
        }
      },
      set(target, key, value, receiver) {
        if (key in utils) {
          utils[key] = value;
          return true;
        }
        if (handler.set) {
          return handler.set(target, key, value, receiver);
        }
        return false;
      }
    }
  );
}

const b$3 = builders$1;
const _importProxyCache = /* @__PURE__ */ new WeakMap();
function creatImportProxy(node, specifier, root) {
  if (_importProxyCache.has(specifier)) {
    return _importProxyCache.get(specifier);
  }
  const proxy = createProxy(
    specifier,
    {
      get $declaration() {
        return node;
      },
      get imported() {
        if (specifier.type === "ImportDefaultSpecifier") {
          return "default";
        }
        if (specifier.type === "ImportNamespaceSpecifier") {
          return "*";
        }
        if (specifier.imported.type === "Identifier") {
          return specifier.imported.name;
        }
        return specifier.imported.value;
      },
      set imported(value) {
        if (specifier.type !== "ImportSpecifier") {
          throw new MagicastError(
            "Changing import name is not yet implemented"
          );
        }
        if (specifier.imported.type === "Identifier") {
          specifier.imported.name = value;
        } else {
          specifier.imported.value = value;
        }
      },
      get local() {
        return specifier.local.name;
      },
      set local(value) {
        specifier.local.name = value;
      },
      get from() {
        return node.source.value;
      },
      set from(value) {
        if (value === node.source.value) {
          return;
        }
        node.specifiers = node.specifiers.filter((s) => s !== specifier);
        if (node.specifiers.length === 0) {
          root.body = root.body.filter((s) => s !== node);
        }
        const declaration = root.body.find(
          (i) => i.type === "ImportDeclaration" && i.source.value === value
        );
        if (declaration) {
          declaration.specifiers.push(specifier);
        } else {
          root.body.unshift(
            b$3.importDeclaration(
              [specifier],
              b$3.stringLiteral(value)
            )
          );
        }
      },
      toJSON() {
        return {
          imported: this.imported,
          local: this.local,
          from: this.from
        };
      }
    },
    {
      ownKeys() {
        return ["imported", "local", "from", "toJSON"];
      }
    }
  );
  _importProxyCache.set(specifier, proxy);
  return proxy;
}
function createImportsProxy(root, mod) {
  const getAllImports = () => {
    const imports = [];
    for (const n of root.body) {
      if (n.type === "ImportDeclaration") {
        for (const specifier of n.specifiers) {
          imports.push(creatImportProxy(n, specifier, root));
        }
      }
    }
    return imports;
  };
  const updateImport = (key, value) => {
    const imports = getAllImports();
    const item = imports.find((i) => i.local === key);
    const local = value.local || key;
    if (item) {
      item.imported = value.imported;
      item.local = local;
      item.from = value.from;
      return true;
    }
    const specifier = value.imported === "default" ? b$3.importDefaultSpecifier(b$3.identifier(local)) : value.imported === "*" ? b$3.importNamespaceSpecifier(b$3.identifier(local)) : b$3.importSpecifier(
      b$3.identifier(value.imported),
      b$3.identifier(local)
    );
    const declaration = imports.find(
      (i) => i.from === value.from
    )?.$declaration;
    if (declaration) {
      declaration.specifiers.push(specifier);
    } else {
      root.body.unshift(
        b$3.importDeclaration([specifier], b$3.stringLiteral(value.from))
      );
    }
    return true;
  };
  const removeImport = (key) => {
    const item = getAllImports().find((i) => i.local === key);
    if (!item) {
      return false;
    }
    const node = item.$declaration;
    const specifier = item.$ast;
    node.specifiers = node.specifiers.filter((s) => s !== specifier);
    if (node.specifiers.length === 0) {
      root.body = root.body.filter((n) => n !== node);
    }
    return true;
  };
  const proxy = createProxy(
    root,
    {
      $type: "imports",
      $add(item) {
        proxy[item.local || item.imported] = item;
      },
      get $items() {
        return getAllImports();
      },
      toJSON() {
        return getAllImports().reduce((acc, i) => {
          acc[i.local] = i;
          return acc;
        }, {});
      }
    },
    {
      get(_, prop) {
        return getAllImports().find((i) => i.local === prop);
      },
      set(_, prop, value) {
        return updateImport(prop, value);
      },
      deleteProperty(_, prop) {
        return removeImport(prop);
      },
      ownKeys() {
        return getAllImports().map((i) => i.local);
      },
      has(_, prop) {
        return getAllImports().some((i) => i.local === prop);
      }
    }
  );
  return proxy;
}

function proxifyArrayElements(node, elements, mod) {
  const getItem = (key) => {
    return elements[key];
  };
  const replaceItem = (key, value) => {
    elements[key] = value;
  };
  return createProxy(
    node,
    {
      $type: "array",
      push(value) {
        elements.push(literalToAst(value));
      },
      pop() {
        return proxify(elements.pop(), mod);
      },
      unshift(value) {
        elements.unshift(literalToAst(value));
      },
      shift() {
        return proxify(elements.shift(), mod);
      },
      splice(start, deleteCount, ...items) {
        const deleted = elements.splice(
          start,
          deleteCount,
          ...items.map((n) => literalToAst(n))
        );
        return deleted.map((n) => proxify(n, mod));
      },
      find(predicate) {
        return elements.map((n) => proxify(n, mod)).find(predicate);
      },
      findIndex(predicate) {
        return elements.map((n) => proxify(n, mod)).findIndex(predicate);
      },
      includes(value) {
        return elements.map((n) => proxify(n, mod)).includes(value);
      },
      toJSON() {
        return elements.map((n) => proxify(n, mod));
      }
    },
    {
      get(_, key) {
        if (key === "length") {
          return elements.length;
        }
        if (key === Symbol.iterator) {
          return function* () {
            for (const item of elements) {
              yield proxify(item, mod);
            }
          };
        }
        if (typeof key === "symbol") {
          return;
        }
        const index = +key;
        if (Number.isNaN(index)) {
          return;
        }
        const prop = getItem(index);
        if (prop) {
          return proxify(prop, mod);
        }
      },
      set(_, key, value) {
        if (typeof key === "symbol") {
          return false;
        }
        const index = +key;
        if (Number.isNaN(index)) {
          return false;
        }
        replaceItem(index, literalToAst(value));
        return true;
      },
      deleteProperty(_, key) {
        if (typeof key === "symbol") {
          return false;
        }
        const index = +key;
        if (Number.isNaN(index)) {
          return false;
        }
        elements[index] = literalToAst(void 0);
        return true;
      },
      ownKeys() {
        return ["length", ...elements.map((_, i) => i.toString())];
      }
    }
  );
}
function proxifyArray(node, mod) {
  if (!("elements" in node)) {
    return void 0;
  }
  return proxifyArrayElements(node, node.elements, mod);
}

function proxifyFunctionCall(node, mod) {
  if (node.type !== "CallExpression") {
    throw new MagicastError("Not a function call");
  }
  function stringifyExpression(node2) {
    if (node2.type === "Identifier") {
      return node2.name;
    }
    if (node2.type === "MemberExpression") {
      return `${stringifyExpression(node2.object)}.${stringifyExpression(
        node2.property
      )}`;
    }
    throw new MagicastError("Not implemented");
  }
  const argumentsProxy = proxifyArrayElements(node, node.arguments, mod);
  return createProxy(
    node,
    {
      $type: "function-call",
      $callee: stringifyExpression(node.callee),
      $args: argumentsProxy
    },
    {}
  );
}

function proxifyArrowFunctionExpression(node, mod) {
  if (node.type !== "ArrowFunctionExpression") {
    throw new MagicastError("Not an arrow function expression");
  }
  const parametersProxy = proxifyArrayElements(node, node.params, mod);
  return createProxy(
    node,
    {
      $type: "arrow-function-expression",
      $params: parametersProxy,
      $body: proxify(node.body, mod)
    },
    {}
  );
}

const b$2 = builders$1;
function proxifyObject(node, mod) {
  if (!("properties" in node)) {
    return void 0;
  }
  const getProp = (key) => {
    for (const prop of node.properties) {
      if ("key" in prop && "name" in prop.key && prop.key.name === key) {
        return prop.value;
      }
      if (prop.type === "ObjectProperty" && (prop.key.type === "StringLiteral" || prop.key.type === "NumericLiteral" || prop.key.type === "BooleanLiteral") && prop.key.value.toString() === key) {
        return prop.value.value ?? prop.value;
      }
    }
  };
  const getPropName = (prop, throwError = false) => {
    if ("key" in prop && "name" in prop.key) {
      return prop.key.name;
    }
    if (prop.type === "ObjectProperty" && (prop.key.type === "StringLiteral" || prop.key.type === "NumericLiteral" || prop.key.type === "BooleanLiteral")) {
      return prop.key.value.toString();
    }
    if (throwError) {
      throw new MagicastError(`Casting "${prop.type}" is not supported`, {
        ast: prop,
        code: mod?.$code
      });
    }
  };
  const replaceOrAddProp = (key, value) => {
    const prop = node.properties.find(
      (prop2) => getPropName(prop2) === key
    );
    if (prop) {
      prop.value = value;
    } else if (isValidPropName(key)) {
      node.properties.push({
        type: "Property",
        key: {
          type: "Identifier",
          name: key
        },
        value
      });
    } else {
      node.properties.push({
        type: "ObjectProperty",
        key: b$2.stringLiteral(key),
        value
      });
    }
  };
  return createProxy(
    node,
    {
      $type: "object",
      toJSON() {
        return node.properties.reduce((acc, prop) => {
          if ("key" in prop && "name" in prop.key) {
            acc[prop.key.name] = proxify(prop.value, mod);
          }
          return acc;
        }, {});
      }
    },
    {
      get(_, key) {
        const prop = getProp(key);
        if (prop) {
          return proxify(prop, mod);
        }
      },
      set(_, key, value) {
        if (typeof key !== "string") {
          key = String(key);
        }
        replaceOrAddProp(key, literalToAst(value));
        return true;
      },
      deleteProperty(_, key) {
        if (typeof key !== "string") {
          key = String(key);
        }
        const index = node.properties.findIndex(
          (prop) => "key" in prop && "name" in prop.key && prop.key.name === key
        );
        if (index !== -1) {
          node.properties.splice(index, 1);
        }
        return true;
      },
      ownKeys() {
        return node.properties.map((prop) => getPropName(prop, true)).filter(Boolean);
      }
    }
  );
}

function proxifyNewExpression(node, mod) {
  if (node.type !== "NewExpression") {
    throw new MagicastError("Not a new expression");
  }
  function stringifyExpression(node2) {
    if (node2.type === "Identifier") {
      return node2.name;
    }
    if (node2.type === "MemberExpression") {
      return `${stringifyExpression(node2.object)}.${stringifyExpression(
        node2.property
      )}`;
    }
    throw new MagicastError("Not implemented");
  }
  const argumentsProxy = proxifyArrayElements(node, node.arguments, mod);
  return createProxy(
    node,
    {
      $type: "new-expression",
      $callee: stringifyExpression(node.callee),
      $args: argumentsProxy
    },
    {}
  );
}

function proxifyIdentifier(node) {
  if (node.type !== "Identifier") {
    throw new MagicastError("Not an identifier");
  }
  return createProxy(
    node,
    {
      $type: "identifier",
      $name: node.name
    },
    {}
  );
}

const _cache = /* @__PURE__ */ new WeakMap();
function proxify(node, mod) {
  if (LITERALS_TYPEOF.has(typeof node)) {
    return node;
  }
  if (LITERALS_AST.has(node.type)) {
    return node.value;
  }
  if (_cache.has(node)) {
    return _cache.get(node);
  }
  let proxy;
  switch (node.type) {
    case "ObjectExpression": {
      proxy = proxifyObject(node, mod);
      break;
    }
    case "ArrayExpression": {
      proxy = proxifyArray(node, mod);
      break;
    }
    case "CallExpression": {
      proxy = proxifyFunctionCall(node, mod);
      break;
    }
    case "ArrowFunctionExpression": {
      proxy = proxifyArrowFunctionExpression(node, mod);
      break;
    }
    case "NewExpression": {
      proxy = proxifyNewExpression(node, mod);
      break;
    }
    case "Identifier": {
      proxy = proxifyIdentifier(node);
      break;
    }
    case "TSAsExpression":
    case "TSSatisfiesExpression": {
      proxy = proxify(node.expression, mod);
      break;
    }
    default: {
      throw new MagicastError(`Casting "${node.type}" is not supported`, {
        ast: node,
        code: mod?.$code
      });
    }
  }
  _cache.set(node, proxy);
  return proxy;
}

const b$1 = builders$1;
function createExportsProxy(root, mod) {
  const findExport = (key) => {
    const type = key === "default" ? "ExportDefaultDeclaration" : "ExportNamedDeclaration";
    for (const n of root.body) {
      if (n.type === type) {
        if (key === "default") {
          return n.declaration;
        }
        if (n.declaration && "declarations" in n.declaration) {
          const dec = n.declaration.declarations[0];
          if ("name" in dec.id && dec.id.name === key) {
            return dec.init;
          }
        }
      }
    }
  };
  const updateOrAddExport = (key, value) => {
    const type = key === "default" ? "ExportDefaultDeclaration" : "ExportNamedDeclaration";
    const node = literalToAst(value);
    for (const n of root.body) {
      if (n.type === type) {
        if (key === "default") {
          n.declaration = node;
          return;
        }
        if (n.declaration && "declarations" in n.declaration) {
          const dec = n.declaration.declarations[0];
          if ("name" in dec.id && dec.id.name === key) {
            dec.init = node;
            return;
          }
        }
      }
    }
    root.body.push(
      key === "default" ? b$1.exportDefaultDeclaration(node) : b$1.exportNamedDeclaration(
        b$1.variableDeclaration("const", [
          b$1.variableDeclarator(b$1.identifier(key), node)
        ])
      )
    );
  };
  return createProxy(
    root,
    {
      $type: "exports"
    },
    {
      get(_, prop) {
        const node = findExport(prop);
        if (node) {
          return proxify(node, mod);
        }
      },
      set(_, prop, value) {
        updateOrAddExport(prop, value);
        return true;
      },
      ownKeys() {
        return root.body.flatMap((i) => {
          if (i.type === "ExportDefaultDeclaration") {
            return ["default"];
          }
          if (i.type === "ExportNamedDeclaration" && i.declaration && "declarations" in i.declaration) {
            return i.declaration.declarations.map(
              (d) => "name" in d.id ? d.id.name : ""
            );
          }
          return [];
        }).filter(Boolean);
      },
      deleteProperty(_, prop) {
        const type = prop === "default" ? "ExportDefaultDeclaration" : "ExportNamedDeclaration";
        for (let i = 0; i < root.body.length; i++) {
          const n = root.body[i];
          if (n.type === type) {
            if (prop === "default") {
              root.body.splice(i, 1);
              return true;
            }
            if (n.declaration && "declarations" in n.declaration) {
              const dec = n.declaration.declarations[0];
              if ("name" in dec.id && dec.id.name === prop) {
                root.body.splice(i, 1);
                return true;
              }
            }
          }
        }
        return false;
      }
    }
  );
}

function proxifyModule(ast, code) {
  const root = ast.program;
  if (root.type !== "Program") {
    throw new MagicastError(`Cannot proxify ${ast.type} as module`);
  }
  const util = {
    $code: code,
    $type: "module"
  };
  const mod = createProxy(root, util, {
    ownKeys() {
      return ["imports", "exports", "generate"];
    }
  });
  util.exports = createExportsProxy(root, mod);
  util.imports = createImportsProxy(root);
  util.generate = (options) => generateCode(mod, options);
  return mod;
}

function detectCodeFormat(code, userStyles = {}) {
  const detect = {
    wrapColumn: userStyles.wrapColumn === void 0,
    indent: userStyles.tabWidth === void 0 || userStyles.useTabs === void 0,
    quote: userStyles.quote === void 0,
    arrowParens: userStyles.arrowParensAlways === void 0,
    trailingComma: userStyles.trailingComma === void 0
  };
  let codeIndent = 2;
  let tabUsages = 0;
  let semiUsages = 0;
  let maxLineLength = 0;
  let multiLineTrailingCommaUsages = 0;
  const syntaxDetectRegex = /(?<doubleQuote>"[^"]+")|(?<singleQuote>'[^']+')|(?<singleParam>\([^),]+\)\s*=>)|(?<trailingComma>,\s*[\]}])/g;
  const syntaxUsages = {
    doubleQuote: 0,
    singleQuote: 0,
    singleParam: 0,
    trailingComma: 0
  };
  const lines = (code || "").split("\n");
  let previousLineTrailing = false;
  for (const line of lines) {
    const trimmitedLine = line.trim();
    if (trimmitedLine.length === 0) {
      continue;
    }
    if (detect.wrapColumn && line.length > maxLineLength) {
      maxLineLength = line.length;
    }
    if (detect.indent) {
      const lineIndent = line.match(/^\s+/)?.[0] || "";
      if (lineIndent.length > 0) {
        if (lineIndent.length > 0 && lineIndent.length < codeIndent) {
          codeIndent = lineIndent.length;
        }
        if (lineIndent[0] === "	") {
          tabUsages++;
        } else if (lineIndent.length > 0) {
          tabUsages--;
        }
      }
    }
    if (trimmitedLine.at(-1) === ";") {
      semiUsages++;
    } else if (trimmitedLine.length > 0) {
      semiUsages--;
    }
    if (detect.quote || detect.arrowParens) {
      const matches = trimmitedLine.matchAll(syntaxDetectRegex);
      for (const match of matches) {
        if (!match.groups) {
          continue;
        }
        for (const key in syntaxUsages) {
          if (match.groups[key]) {
            syntaxUsages[key]++;
          }
        }
      }
    }
    if (detect.trailingComma) {
      if (line.startsWith("}") || line.startsWith("]")) {
        if (previousLineTrailing) {
          multiLineTrailingCommaUsages++;
        } else {
          multiLineTrailingCommaUsages--;
        }
      }
      previousLineTrailing = trimmitedLine.endsWith(",");
    }
  }
  return {
    wrapColumn: maxLineLength,
    useTabs: tabUsages > 0,
    tabWidth: codeIndent,
    quote: syntaxUsages.singleQuote > syntaxUsages.doubleQuote ? "single" : "double",
    arrowParensAlways: syntaxUsages.singleParam > 0,
    trailingComma: multiLineTrailingCommaUsages > 0 || syntaxUsages.trailingComma > 0,
    useSemi: semiUsages > 0,
    arrayBracketSpacing: void 0,
    // TODO
    objectCurlySpacing: void 0,
    // TODO
    ...userStyles
  };
}

function parseModule(code, options) {
  const node = parse(code, {
    parser: options?.parser || getBabelParser(),
    ...options
  });
  return proxifyModule(node, code);
}
function generateCode(node, options = {}) {
  const ast = node.$ast || node;
  const formatOptions = options.format === false || !("$code" in node) ? {} : detectCodeFormat(node.$code, options.format);
  const { code, map } = print(ast, {
    ...options,
    ...formatOptions
  });
  return { code, map };
}
async function loadFile(filename, options = {}) {
  const contents = await promises.readFile(filename, "utf8");
  options.sourceFileName = options.sourceFileName ?? filename;
  return parseModule(contents, options);
}
async function writeFile(node, filename, options) {
  const ast = "$ast" in node ? node.$ast : node;
  const { code, map } = generateCode(ast, options);
  await promises.writeFile(filename, code);
  if (map) {
    await promises.writeFile(filename + ".map", map);
  }
}

const add = defineCommand({
  meta: {
    name: "add",
    description: "Add Nuxt modules"
  },
  args: {
    ...sharedArgs,
    moduleName: {
      type: "positional",
      description: "Module name"
    },
    skipInstall: {
      type: "boolean",
      description: "Skip npm install"
    },
    skipConfig: {
      type: "boolean",
      description: "Skip nuxt.config.ts update"
    }
  },
  async setup(ctx) {
    const cwd = resolve(ctx.args.cwd || ".");
    const projectPkg = await getProjectPackage(cwd);
    if (!projectPkg.dependencies?.nuxt && !projectPkg.devDependencies?.nuxt) {
      consola.warn(`No \`nuxt\` dependency detected in \`${cwd}\`.`);
      const shouldContinue = await consola.prompt(
        `Do you want to continue anyway?`,
        {
          type: "confirm",
          initial: false
        }
      );
      if (shouldContinue !== true) {
        return false;
      }
    }
    const r = await resolveModule(ctx.args.moduleName, cwd);
    if (r === false) {
      return;
    }
    if (!ctx.args.skipInstall) {
      const isDev = Boolean(projectPkg.devDependencies?.nuxt);
      consola.info(
        `Installing \`${r.pkg}\`${isDev ? " development" : ""} dependency`
      );
      const res = await addDependency(r.pkg, { cwd, dev: isDev }).catch(
        (error) => {
          consola.error(error);
          return consola.prompt(
            `Install failed for ${colors.cyan(
              r.pkg
            )}. Do you want to continue adding the module to ${colors.cyan(
              "nuxt.config"
            )}?`,
            {
              type: "confirm",
              initial: false
            }
          );
        }
      );
      if (res === false) {
        return;
      }
    }
    if (!ctx.args.skipConfig) {
      await updateNuxtConfig(cwd, (config) => {
        if (!config.modules) {
          config.modules = [];
        }
        if (config.modules.includes(r.pkgName)) {
          consola.info(`\`${r.pkgName}\` is already in the \`modules\``);
          return;
        }
        consola.info(`Adding \`${r.pkgName}\` to the \`modules\``);
        config.modules.push(r.pkgName);
      }).catch((err) => {
        consola.error(err);
        consola.error(
          `Please manually add \`${r.pkgName}\` to the \`modules\` in \`nuxt.config.ts\``
        );
      });
    }
  }
});
async function updateNuxtConfig(rootDir, update) {
  let _module;
  const nuxtConfigFile = resolve(rootDir, "nuxt.config.ts");
  if (existsSync(nuxtConfigFile)) {
    consola.info("Updating `nuxt.config.ts`");
    _module = await loadFile(nuxtConfigFile);
  } else {
    consola.info("Creating `nuxt.config.ts`");
    _module = parseModule(getDefaultNuxtConfig());
  }
  const defaultExport = _module.exports.default;
  if (!defaultExport) {
    throw new Error("`nuxt.config.ts` does not have a default export!");
  }
  if (defaultExport.$type === "function-call") {
    update(defaultExport.$args[0]);
  } else {
    update(defaultExport);
  }
  await writeFile(_module, nuxtConfigFile);
  consola.success("`nuxt.config.ts` updated");
}
function getDefaultNuxtConfig() {
  return `
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: []
})`;
}
const packageRegex = /^(@[a-z0-9-~][a-z0-9-._~]*\/)?([a-z0-9-~][a-z0-9-._~]*)(@[^@]+)?$/;
async function resolveModule(moduleName, cwd) {
  let pkgName = moduleName;
  let pkgVersion;
  const reMatch = moduleName.match(packageRegex);
  if (reMatch) {
    if (reMatch[3]) {
      pkgName = `${reMatch[1] || ""}${reMatch[2] || ""}`;
      pkgVersion = reMatch[3].slice(1);
    }
  } else {
    consola.error(`Invalid package name \`${pkgName}\`.`);
    return false;
  }
  const modulesDB = await fetchModules().catch((err) => {
    consola.warn("Cannot search in the Nuxt Modules database: " + err);
    return [];
  });
  const matchedModule = modulesDB.find(
    (module) => module.name === moduleName || module.npm === pkgName || module.aliases?.includes(pkgName)
  );
  if (matchedModule?.npm) {
    pkgName = matchedModule.npm;
  }
  if (matchedModule && matchedModule.compatibility.nuxt) {
    const nuxtVersion = await getNuxtVersion(cwd);
    if (!checkNuxtCompatibility(matchedModule, nuxtVersion)) {
      consola.warn(
        `The module \`${pkgName}\` is not compatible with Nuxt \`${nuxtVersion}\` (requires \`${matchedModule.compatibility.nuxt}\`)`
      );
      const shouldContinue = await consola.prompt(
        "Do you want to continue installing incompatible version?",
        {
          type: "confirm",
          initial: false
        }
      );
      if (shouldContinue !== true) {
        return false;
      }
    }
    const versionMap = matchedModule.compatibility.versionMap;
    if (versionMap) {
      for (const [_nuxtVersion, _moduleVersion] of Object.entries(versionMap)) {
        if (semver.satisfies(nuxtVersion, _nuxtVersion)) {
          if (!pkgVersion) {
            pkgVersion = _moduleVersion;
          } else {
            consola.warn(
              `Recommended version of \`${pkgName}\` for Nuxt \`${nuxtVersion}\` is \`${_moduleVersion}\` but you have requested \`${pkgVersion}\``
            );
            pkgVersion = await consola.prompt("Choose a version:", {
              type: "select",
              options: [_moduleVersion, pkgVersion]
            });
          }
          break;
        }
      }
    }
  }
  pkgVersion = pkgVersion || "latest";
  const pkg = await $fetch(
    `https://registry.npmjs.org/${pkgName}/${pkgVersion}`
  );
  const pkgDependencies = Object.assign(
    pkg.dependencies || {},
    pkg.devDependencies || {}
  );
  if (!pkgDependencies["nuxt"] && !pkgDependencies["nuxt-edge"] && !pkgDependencies["@nuxt/kit"]) {
    consola.warn(`It seems that \`${pkgName}\` is not a Nuxt module.`);
    const shouldContinue = await consola.prompt(
      `Do you want to continue installing \`${pkgName}\` anyway?`,
      {
        type: "confirm",
        initial: false
      }
    );
    if (shouldContinue !== true) {
      return false;
    }
  }
  return {
    nuxtModule: matchedModule,
    pkg: `${pkgName}@${pkgVersion}`,
    pkgName,
    pkgVersion
  };
}

export { add as default };
