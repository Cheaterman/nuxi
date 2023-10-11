import { mkdir as mkdir$2, rm, readFile, writeFile } from 'node:fs/promises';
import fs$a, { existsSync, readdirSync as readdirSync$1, createWriteStream } from 'node:fs';
import { c as commonjsGlobal$1 } from '../shared/nuxi.2155838d.mjs';
import require$$0$9 from 'events';
import require$$0$a from 'stream';
import require$$2$2 from 'string_decoder';
import require$$0$c from 'assert';
import require$$1$5 from 'buffer';
import require$$0$b from 'zlib';
import require$$0$d from 'path';
import require$$0$e from 'fs';
import { y as yallist } from '../shared/nuxi.cc8dd4a9.mjs';
import require$$9 from 'process';
import require$$0$f from 'util';
import require$$0$g from 'crypto';
import { d as defu } from '../shared/nuxi.eaa29140.mjs';
import { i as installDependencies } from '../shared/nuxi.0f575f79.mjs';
import me$1, { pipeline as pipeline$3 } from 'node:stream';
import { spawnSync } from 'node:child_process';
import os, { homedir } from 'node:os';
import require$$9$1, { promisify as promisify$3 } from 'node:util';
import vt$1 from 'node:http';
import https$3 from 'node:https';
import require$$10 from 'node:url';
import assert$e from 'node:assert';
import require$$12 from 'node:net';
import require$$8$2 from 'node:buffer';
import require$$16 from 'node:querystring';
import require$$17 from 'node:diagnostics_channel';
import EventEmitter$1 from 'node:events';
import require$$20 from 'node:tls';
import st from 'node:zlib';
import require$$22 from 'node:perf_hooks';
import require$$23 from 'node:util/types';
import require$$25 from 'node:async_hooks';
import 'node:console';
import require$$29 from 'node:worker_threads';
import require$$0$h from 'http';
import require$$1$6 from 'https';
import require$$32 from 'net';
import require$$33 from 'tls';
import tty__default from 'tty';
import require$$2$3 from 'os';
import require$$7 from 'url';
import path$7 from 'node:path';
import { r as resolve$1, a as relative, d as dirname$3, b as basename, s as sharedArgs } from '../shared/nuxi.610c92ff.mjs';
import { d as defineCommand, c as consola } from '../shared/nuxi.b4d08588.mjs';
import 'node:process';
import 'node:tty';

// turn tar(1) style args like `C` into the more verbose things like `cwd`

const argmap = new Map([
  ['C', 'cwd'],
  ['f', 'file'],
  ['z', 'gzip'],
  ['P', 'preservePaths'],
  ['U', 'unlink'],
  ['strip-components', 'strip'],
  ['stripComponents', 'strip'],
  ['keep-newer', 'newer'],
  ['keepNewer', 'newer'],
  ['keep-newer-files', 'newer'],
  ['keepNewerFiles', 'newer'],
  ['k', 'keep'],
  ['keep-existing', 'keep'],
  ['keepExisting', 'keep'],
  ['m', 'noMtime'],
  ['no-mtime', 'noMtime'],
  ['p', 'preserveOwner'],
  ['L', 'follow'],
  ['h', 'follow'],
]);

var highLevelOpt = opt => opt ? Object.keys(opt).map(k => [
  argmap.has(k) ? argmap.get(k) : k, opt[k],
]).reduce((set, kv) => (set[kv[0]] = kv[1], set), Object.create(null)) : {};

var minipass$1 = {};

const proc$1 =
  typeof process === 'object' && process
    ? process
    : {
        stdout: null,
        stderr: null,
      };
const EE$4 = require$$0$9;
const Stream$3 = require$$0$a;
const stringdecoder = require$$2$2;
const SD$1 = stringdecoder.StringDecoder;

const EOF$2 = Symbol('EOF');
const MAYBE_EMIT_END$1 = Symbol('maybeEmitEnd');
const EMITTED_END$1 = Symbol('emittedEnd');
const EMITTING_END$1 = Symbol('emittingEnd');
const EMITTED_ERROR$1 = Symbol('emittedError');
const CLOSED$1 = Symbol('closed');
const READ$2 = Symbol('read');
const FLUSH$1 = Symbol('flush');
const FLUSHCHUNK$1 = Symbol('flushChunk');
const ENCODING$1 = Symbol('encoding');
const DECODER$1 = Symbol('decoder');
const FLOWING$1 = Symbol('flowing');
const PAUSED$1 = Symbol('paused');
const RESUME$1 = Symbol('resume');
const BUFFER$1 = Symbol('buffer');
const PIPES = Symbol('pipes');
const BUFFERLENGTH$1 = Symbol('bufferLength');
const BUFFERPUSH$1 = Symbol('bufferPush');
const BUFFERSHIFT$1 = Symbol('bufferShift');
const OBJECTMODE$1 = Symbol('objectMode');
// internal event when stream is destroyed
const DESTROYED$1 = Symbol('destroyed');
// internal event when stream has an error
const ERROR = Symbol('error');
const EMITDATA$1 = Symbol('emitData');
const EMITEND$1 = Symbol('emitEnd');
const EMITEND2$1 = Symbol('emitEnd2');
const ASYNC$1 = Symbol('async');
const ABORT = Symbol('abort');
const ABORTED$1 = Symbol('aborted');
const SIGNAL = Symbol('signal');

const defer$1 = fn => Promise.resolve().then(fn);

// TODO remove when Node v8 support drops
const doIter$1 = commonjsGlobal$1._MP_NO_ITERATOR_SYMBOLS_ !== '1';
const ASYNCITERATOR$1 =
  (doIter$1 && Symbol.asyncIterator) || Symbol('asyncIterator not implemented');
const ITERATOR$1 =
  (doIter$1 && Symbol.iterator) || Symbol('iterator not implemented');

// events that mean 'the stream is over'
// these are treated specially, and re-emitted
// if they are listened for after emitting.
const isEndish$1 = ev => ev === 'end' || ev === 'finish' || ev === 'prefinish';

const isArrayBuffer$1 = b =>
  b instanceof ArrayBuffer ||
  (typeof b === 'object' &&
    b.constructor &&
    b.constructor.name === 'ArrayBuffer' &&
    b.byteLength >= 0);

const isArrayBufferView$1 = b => !Buffer.isBuffer(b) && ArrayBuffer.isView(b);

let Pipe$1 = class Pipe {
  constructor(src, dest, opts) {
    this.src = src;
    this.dest = dest;
    this.opts = opts;
    this.ondrain = () => src[RESUME$1]();
    dest.on('drain', this.ondrain);
  }
  unpipe() {
    this.dest.removeListener('drain', this.ondrain);
  }
  // istanbul ignore next - only here for the prototype
  proxyErrors() {}
  end() {
    this.unpipe();
    if (this.opts.end) this.dest.end();
  }
};

let PipeProxyErrors$1 = class PipeProxyErrors extends Pipe$1 {
  unpipe() {
    this.src.removeListener('error', this.proxyErrors);
    super.unpipe();
  }
  constructor(src, dest, opts) {
    super(src, dest, opts);
    this.proxyErrors = er => dest.emit('error', er);
    src.on('error', this.proxyErrors);
  }
};

let Minipass$4 = class Minipass extends Stream$3 {
  constructor(options) {
    super();
    this[FLOWING$1] = false;
    // whether we're explicitly paused
    this[PAUSED$1] = false;
    this[PIPES] = [];
    this[BUFFER$1] = [];
    this[OBJECTMODE$1] = (options && options.objectMode) || false;
    if (this[OBJECTMODE$1]) this[ENCODING$1] = null;
    else this[ENCODING$1] = (options && options.encoding) || null;
    if (this[ENCODING$1] === 'buffer') this[ENCODING$1] = null;
    this[ASYNC$1] = (options && !!options.async) || false;
    this[DECODER$1] = this[ENCODING$1] ? new SD$1(this[ENCODING$1]) : null;
    this[EOF$2] = false;
    this[EMITTED_END$1] = false;
    this[EMITTING_END$1] = false;
    this[CLOSED$1] = false;
    this[EMITTED_ERROR$1] = null;
    this.writable = true;
    this.readable = true;
    this[BUFFERLENGTH$1] = 0;
    this[DESTROYED$1] = false;
    if (options && options.debugExposeBuffer === true) {
      Object.defineProperty(this, 'buffer', { get: () => this[BUFFER$1] });
    }
    if (options && options.debugExposePipes === true) {
      Object.defineProperty(this, 'pipes', { get: () => this[PIPES] });
    }
    this[SIGNAL] = options && options.signal;
    this[ABORTED$1] = false;
    if (this[SIGNAL]) {
      this[SIGNAL].addEventListener('abort', () => this[ABORT]());
      if (this[SIGNAL].aborted) {
        this[ABORT]();
      }
    }
  }

  get bufferLength() {
    return this[BUFFERLENGTH$1]
  }

  get encoding() {
    return this[ENCODING$1]
  }
  set encoding(enc) {
    if (this[OBJECTMODE$1]) throw new Error('cannot set encoding in objectMode')

    if (
      this[ENCODING$1] &&
      enc !== this[ENCODING$1] &&
      ((this[DECODER$1] && this[DECODER$1].lastNeed) || this[BUFFERLENGTH$1])
    )
      throw new Error('cannot change encoding')

    if (this[ENCODING$1] !== enc) {
      this[DECODER$1] = enc ? new SD$1(enc) : null;
      if (this[BUFFER$1].length)
        this[BUFFER$1] = this[BUFFER$1].map(chunk => this[DECODER$1].write(chunk));
    }

    this[ENCODING$1] = enc;
  }

  setEncoding(enc) {
    this.encoding = enc;
  }

  get objectMode() {
    return this[OBJECTMODE$1]
  }
  set objectMode(om) {
    this[OBJECTMODE$1] = this[OBJECTMODE$1] || !!om;
  }

  get ['async']() {
    return this[ASYNC$1]
  }
  set ['async'](a) {
    this[ASYNC$1] = this[ASYNC$1] || !!a;
  }

  // drop everything and get out of the flow completely
  [ABORT]() {
    this[ABORTED$1] = true;
    this.emit('abort', this[SIGNAL].reason);
    this.destroy(this[SIGNAL].reason);
  }

  get aborted() {
    return this[ABORTED$1]
  }
  set aborted(_) {}

  write(chunk, encoding, cb) {
    if (this[ABORTED$1]) return false
    if (this[EOF$2]) throw new Error('write after end')

    if (this[DESTROYED$1]) {
      this.emit(
        'error',
        Object.assign(
          new Error('Cannot call write after a stream was destroyed'),
          { code: 'ERR_STREAM_DESTROYED' }
        )
      );
      return true
    }

    if (typeof encoding === 'function') (cb = encoding), (encoding = 'utf8');

    if (!encoding) encoding = 'utf8';

    const fn = this[ASYNC$1] ? defer$1 : f => f();

    // convert array buffers and typed array views into buffers
    // at some point in the future, we may want to do the opposite!
    // leave strings and buffers as-is
    // anything else switches us into object mode
    if (!this[OBJECTMODE$1] && !Buffer.isBuffer(chunk)) {
      if (isArrayBufferView$1(chunk))
        chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
      else if (isArrayBuffer$1(chunk)) chunk = Buffer.from(chunk);
      else if (typeof chunk !== 'string')
        // use the setter so we throw if we have encoding set
        this.objectMode = true;
    }

    // handle object mode up front, since it's simpler
    // this yields better performance, fewer checks later.
    if (this[OBJECTMODE$1]) {
      /* istanbul ignore if - maybe impossible? */
      if (this.flowing && this[BUFFERLENGTH$1] !== 0) this[FLUSH$1](true);

      if (this.flowing) this.emit('data', chunk);
      else this[BUFFERPUSH$1](chunk);

      if (this[BUFFERLENGTH$1] !== 0) this.emit('readable');

      if (cb) fn(cb);

      return this.flowing
    }

    // at this point the chunk is a buffer or string
    // don't buffer it up or send it to the decoder
    if (!chunk.length) {
      if (this[BUFFERLENGTH$1] !== 0) this.emit('readable');
      if (cb) fn(cb);
      return this.flowing
    }

    // fast-path writing strings of same encoding to a stream with
    // an empty buffer, skipping the buffer/decoder dance
    if (
      typeof chunk === 'string' &&
      // unless it is a string already ready for us to use
      !(encoding === this[ENCODING$1] && !this[DECODER$1].lastNeed)
    ) {
      chunk = Buffer.from(chunk, encoding);
    }

    if (Buffer.isBuffer(chunk) && this[ENCODING$1])
      chunk = this[DECODER$1].write(chunk);

    // Note: flushing CAN potentially switch us into not-flowing mode
    if (this.flowing && this[BUFFERLENGTH$1] !== 0) this[FLUSH$1](true);

    if (this.flowing) this.emit('data', chunk);
    else this[BUFFERPUSH$1](chunk);

    if (this[BUFFERLENGTH$1] !== 0) this.emit('readable');

    if (cb) fn(cb);

    return this.flowing
  }

  read(n) {
    if (this[DESTROYED$1]) return null

    if (this[BUFFERLENGTH$1] === 0 || n === 0 || n > this[BUFFERLENGTH$1]) {
      this[MAYBE_EMIT_END$1]();
      return null
    }

    if (this[OBJECTMODE$1]) n = null;

    if (this[BUFFER$1].length > 1 && !this[OBJECTMODE$1]) {
      if (this.encoding) this[BUFFER$1] = [this[BUFFER$1].join('')];
      else this[BUFFER$1] = [Buffer.concat(this[BUFFER$1], this[BUFFERLENGTH$1])];
    }

    const ret = this[READ$2](n || null, this[BUFFER$1][0]);
    this[MAYBE_EMIT_END$1]();
    return ret
  }

  [READ$2](n, chunk) {
    if (n === chunk.length || n === null) this[BUFFERSHIFT$1]();
    else {
      this[BUFFER$1][0] = chunk.slice(n);
      chunk = chunk.slice(0, n);
      this[BUFFERLENGTH$1] -= n;
    }

    this.emit('data', chunk);

    if (!this[BUFFER$1].length && !this[EOF$2]) this.emit('drain');

    return chunk
  }

  end(chunk, encoding, cb) {
    if (typeof chunk === 'function') (cb = chunk), (chunk = null);
    if (typeof encoding === 'function') (cb = encoding), (encoding = 'utf8');
    if (chunk) this.write(chunk, encoding);
    if (cb) this.once('end', cb);
    this[EOF$2] = true;
    this.writable = false;

    // if we haven't written anything, then go ahead and emit,
    // even if we're not reading.
    // we'll re-emit if a new 'end' listener is added anyway.
    // This makes MP more suitable to write-only use cases.
    if (this.flowing || !this[PAUSED$1]) this[MAYBE_EMIT_END$1]();
    return this
  }

  // don't let the internal resume be overwritten
  [RESUME$1]() {
    if (this[DESTROYED$1]) return

    this[PAUSED$1] = false;
    this[FLOWING$1] = true;
    this.emit('resume');
    if (this[BUFFER$1].length) this[FLUSH$1]();
    else if (this[EOF$2]) this[MAYBE_EMIT_END$1]();
    else this.emit('drain');
  }

  resume() {
    return this[RESUME$1]()
  }

  pause() {
    this[FLOWING$1] = false;
    this[PAUSED$1] = true;
  }

  get destroyed() {
    return this[DESTROYED$1]
  }

  get flowing() {
    return this[FLOWING$1]
  }

  get paused() {
    return this[PAUSED$1]
  }

  [BUFFERPUSH$1](chunk) {
    if (this[OBJECTMODE$1]) this[BUFFERLENGTH$1] += 1;
    else this[BUFFERLENGTH$1] += chunk.length;
    this[BUFFER$1].push(chunk);
  }

  [BUFFERSHIFT$1]() {
    if (this[OBJECTMODE$1]) this[BUFFERLENGTH$1] -= 1;
    else this[BUFFERLENGTH$1] -= this[BUFFER$1][0].length;
    return this[BUFFER$1].shift()
  }

  [FLUSH$1](noDrain) {
    do {} while (this[FLUSHCHUNK$1](this[BUFFERSHIFT$1]()) && this[BUFFER$1].length)

    if (!noDrain && !this[BUFFER$1].length && !this[EOF$2]) this.emit('drain');
  }

  [FLUSHCHUNK$1](chunk) {
    this.emit('data', chunk);
    return this.flowing
  }

  pipe(dest, opts) {
    if (this[DESTROYED$1]) return

    const ended = this[EMITTED_END$1];
    opts = opts || {};
    if (dest === proc$1.stdout || dest === proc$1.stderr) opts.end = false;
    else opts.end = opts.end !== false;
    opts.proxyErrors = !!opts.proxyErrors;

    // piping an ended stream ends immediately
    if (ended) {
      if (opts.end) dest.end();
    } else {
      this[PIPES].push(
        !opts.proxyErrors
          ? new Pipe$1(this, dest, opts)
          : new PipeProxyErrors$1(this, dest, opts)
      );
      if (this[ASYNC$1]) defer$1(() => this[RESUME$1]());
      else this[RESUME$1]();
    }

    return dest
  }

  unpipe(dest) {
    const p = this[PIPES].find(p => p.dest === dest);
    if (p) {
      this[PIPES].splice(this[PIPES].indexOf(p), 1);
      p.unpipe();
    }
  }

  addListener(ev, fn) {
    return this.on(ev, fn)
  }

  on(ev, fn) {
    const ret = super.on(ev, fn);
    if (ev === 'data' && !this[PIPES].length && !this.flowing) this[RESUME$1]();
    else if (ev === 'readable' && this[BUFFERLENGTH$1] !== 0)
      super.emit('readable');
    else if (isEndish$1(ev) && this[EMITTED_END$1]) {
      super.emit(ev);
      this.removeAllListeners(ev);
    } else if (ev === 'error' && this[EMITTED_ERROR$1]) {
      if (this[ASYNC$1]) defer$1(() => fn.call(this, this[EMITTED_ERROR$1]));
      else fn.call(this, this[EMITTED_ERROR$1]);
    }
    return ret
  }

  get emittedEnd() {
    return this[EMITTED_END$1]
  }

  [MAYBE_EMIT_END$1]() {
    if (
      !this[EMITTING_END$1] &&
      !this[EMITTED_END$1] &&
      !this[DESTROYED$1] &&
      this[BUFFER$1].length === 0 &&
      this[EOF$2]
    ) {
      this[EMITTING_END$1] = true;
      this.emit('end');
      this.emit('prefinish');
      this.emit('finish');
      if (this[CLOSED$1]) this.emit('close');
      this[EMITTING_END$1] = false;
    }
  }

  emit(ev, data, ...extra) {
    // error and close are only events allowed after calling destroy()
    if (ev !== 'error' && ev !== 'close' && ev !== DESTROYED$1 && this[DESTROYED$1])
      return
    else if (ev === 'data') {
      return !this[OBJECTMODE$1] && !data
        ? false
        : this[ASYNC$1]
        ? defer$1(() => this[EMITDATA$1](data))
        : this[EMITDATA$1](data)
    } else if (ev === 'end') {
      return this[EMITEND$1]()
    } else if (ev === 'close') {
      this[CLOSED$1] = true;
      // don't emit close before 'end' and 'finish'
      if (!this[EMITTED_END$1] && !this[DESTROYED$1]) return
      const ret = super.emit('close');
      this.removeAllListeners('close');
      return ret
    } else if (ev === 'error') {
      this[EMITTED_ERROR$1] = data;
      super.emit(ERROR, data);
      const ret =
        !this[SIGNAL] || this.listeners('error').length
          ? super.emit('error', data)
          : false;
      this[MAYBE_EMIT_END$1]();
      return ret
    } else if (ev === 'resume') {
      const ret = super.emit('resume');
      this[MAYBE_EMIT_END$1]();
      return ret
    } else if (ev === 'finish' || ev === 'prefinish') {
      const ret = super.emit(ev);
      this.removeAllListeners(ev);
      return ret
    }

    // Some other unknown event
    const ret = super.emit(ev, data, ...extra);
    this[MAYBE_EMIT_END$1]();
    return ret
  }

  [EMITDATA$1](data) {
    for (const p of this[PIPES]) {
      if (p.dest.write(data) === false) this.pause();
    }
    const ret = super.emit('data', data);
    this[MAYBE_EMIT_END$1]();
    return ret
  }

  [EMITEND$1]() {
    if (this[EMITTED_END$1]) return

    this[EMITTED_END$1] = true;
    this.readable = false;
    if (this[ASYNC$1]) defer$1(() => this[EMITEND2$1]());
    else this[EMITEND2$1]();
  }

  [EMITEND2$1]() {
    if (this[DECODER$1]) {
      const data = this[DECODER$1].end();
      if (data) {
        for (const p of this[PIPES]) {
          p.dest.write(data);
        }
        super.emit('data', data);
      }
    }

    for (const p of this[PIPES]) {
      p.end();
    }
    const ret = super.emit('end');
    this.removeAllListeners('end');
    return ret
  }

  // const all = await stream.collect()
  collect() {
    const buf = [];
    if (!this[OBJECTMODE$1]) buf.dataLength = 0;
    // set the promise first, in case an error is raised
    // by triggering the flow here.
    const p = this.promise();
    this.on('data', c => {
      buf.push(c);
      if (!this[OBJECTMODE$1]) buf.dataLength += c.length;
    });
    return p.then(() => buf)
  }

  // const data = await stream.concat()
  concat() {
    return this[OBJECTMODE$1]
      ? Promise.reject(new Error('cannot concat in objectMode'))
      : this.collect().then(buf =>
          this[OBJECTMODE$1]
            ? Promise.reject(new Error('cannot concat in objectMode'))
            : this[ENCODING$1]
            ? buf.join('')
            : Buffer.concat(buf, buf.dataLength)
        )
  }

  // stream.promise().then(() => done, er => emitted error)
  promise() {
    return new Promise((resolve, reject) => {
      this.on(DESTROYED$1, () => reject(new Error('stream destroyed')));
      this.on('error', er => reject(er));
      this.on('end', () => resolve());
    })
  }

  // for await (let chunk of stream)
  [ASYNCITERATOR$1]() {
    let stopped = false;
    const stop = () => {
      this.pause();
      stopped = true;
      return Promise.resolve({ done: true })
    };
    const next = () => {
      if (stopped) return stop()
      const res = this.read();
      if (res !== null) return Promise.resolve({ done: false, value: res })

      if (this[EOF$2]) return stop()

      let resolve = null;
      let reject = null;
      const onerr = er => {
        this.removeListener('data', ondata);
        this.removeListener('end', onend);
        this.removeListener(DESTROYED$1, ondestroy);
        stop();
        reject(er);
      };
      const ondata = value => {
        this.removeListener('error', onerr);
        this.removeListener('end', onend);
        this.removeListener(DESTROYED$1, ondestroy);
        this.pause();
        resolve({ value: value, done: !!this[EOF$2] });
      };
      const onend = () => {
        this.removeListener('error', onerr);
        this.removeListener('data', ondata);
        this.removeListener(DESTROYED$1, ondestroy);
        stop();
        resolve({ done: true });
      };
      const ondestroy = () => onerr(new Error('stream destroyed'));
      return new Promise((res, rej) => {
        reject = rej;
        resolve = res;
        this.once(DESTROYED$1, ondestroy);
        this.once('error', onerr);
        this.once('end', onend);
        this.once('data', ondata);
      })
    };

    return {
      next,
      throw: stop,
      return: stop,
      [ASYNCITERATOR$1]() {
        return this
      },
    }
  }

  // for (let chunk of stream)
  [ITERATOR$1]() {
    let stopped = false;
    const stop = () => {
      this.pause();
      this.removeListener(ERROR, stop);
      this.removeListener(DESTROYED$1, stop);
      this.removeListener('end', stop);
      stopped = true;
      return { done: true }
    };

    const next = () => {
      if (stopped) return stop()
      const value = this.read();
      return value === null ? stop() : { value }
    };
    this.once('end', stop);
    this.once(ERROR, stop);
    this.once(DESTROYED$1, stop);

    return {
      next,
      throw: stop,
      return: stop,
      [ITERATOR$1]() {
        return this
      },
    }
  }

  destroy(er) {
    if (this[DESTROYED$1]) {
      if (er) this.emit('error', er);
      else this.emit(DESTROYED$1);
      return this
    }

    this[DESTROYED$1] = true;

    // throw away all buffered data, it's never coming out
    this[BUFFER$1].length = 0;
    this[BUFFERLENGTH$1] = 0;

    if (typeof this.close === 'function' && !this[CLOSED$1]) this.close();

    if (er) this.emit('error', er);
    // if no error to emit, still reject pending promises
    else this.emit(DESTROYED$1);

    return this
  }

  static isStream(s) {
    return (
      !!s &&
      (s instanceof Minipass ||
        s instanceof Stream$3 ||
        (s instanceof EE$4 &&
          // readable
          (typeof s.pipe === 'function' ||
            // writable
            (typeof s.write === 'function' && typeof s.end === 'function'))))
    )
  }
};

minipass$1.Minipass = Minipass$4;

var minizlib = {};

// Update with any zlib constants that are added or changed in the future.
// Node v6 didn't export this, so we just hard code the version and rely
// on all the other hard-coded values from zlib v4736.  When node v6
// support drops, we can just export the realZlibConstants object.
const realZlibConstants = require$$0$b.constants ||
  /* istanbul ignore next */ { ZLIB_VERNUM: 4736 };

var constants$7 = Object.freeze(Object.assign(Object.create(null), {
  Z_NO_FLUSH: 0,
  Z_PARTIAL_FLUSH: 1,
  Z_SYNC_FLUSH: 2,
  Z_FULL_FLUSH: 3,
  Z_FINISH: 4,
  Z_BLOCK: 5,
  Z_OK: 0,
  Z_STREAM_END: 1,
  Z_NEED_DICT: 2,
  Z_ERRNO: -1,
  Z_STREAM_ERROR: -2,
  Z_DATA_ERROR: -3,
  Z_MEM_ERROR: -4,
  Z_BUF_ERROR: -5,
  Z_VERSION_ERROR: -6,
  Z_NO_COMPRESSION: 0,
  Z_BEST_SPEED: 1,
  Z_BEST_COMPRESSION: 9,
  Z_DEFAULT_COMPRESSION: -1,
  Z_FILTERED: 1,
  Z_HUFFMAN_ONLY: 2,
  Z_RLE: 3,
  Z_FIXED: 4,
  Z_DEFAULT_STRATEGY: 0,
  DEFLATE: 1,
  INFLATE: 2,
  GZIP: 3,
  GUNZIP: 4,
  DEFLATERAW: 5,
  INFLATERAW: 6,
  UNZIP: 7,
  BROTLI_DECODE: 8,
  BROTLI_ENCODE: 9,
  Z_MIN_WINDOWBITS: 8,
  Z_MAX_WINDOWBITS: 15,
  Z_DEFAULT_WINDOWBITS: 15,
  Z_MIN_CHUNK: 64,
  Z_MAX_CHUNK: Infinity,
  Z_DEFAULT_CHUNK: 16384,
  Z_MIN_MEMLEVEL: 1,
  Z_MAX_MEMLEVEL: 9,
  Z_DEFAULT_MEMLEVEL: 8,
  Z_MIN_LEVEL: -1,
  Z_MAX_LEVEL: 9,
  Z_DEFAULT_LEVEL: -1,
  BROTLI_OPERATION_PROCESS: 0,
  BROTLI_OPERATION_FLUSH: 1,
  BROTLI_OPERATION_FINISH: 2,
  BROTLI_OPERATION_EMIT_METADATA: 3,
  BROTLI_MODE_GENERIC: 0,
  BROTLI_MODE_TEXT: 1,
  BROTLI_MODE_FONT: 2,
  BROTLI_DEFAULT_MODE: 0,
  BROTLI_MIN_QUALITY: 0,
  BROTLI_MAX_QUALITY: 11,
  BROTLI_DEFAULT_QUALITY: 11,
  BROTLI_MIN_WINDOW_BITS: 10,
  BROTLI_MAX_WINDOW_BITS: 24,
  BROTLI_LARGE_MAX_WINDOW_BITS: 30,
  BROTLI_DEFAULT_WINDOW: 22,
  BROTLI_MIN_INPUT_BLOCK_BITS: 16,
  BROTLI_MAX_INPUT_BLOCK_BITS: 24,
  BROTLI_PARAM_MODE: 0,
  BROTLI_PARAM_QUALITY: 1,
  BROTLI_PARAM_LGWIN: 2,
  BROTLI_PARAM_LGBLOCK: 3,
  BROTLI_PARAM_DISABLE_LITERAL_CONTEXT_MODELING: 4,
  BROTLI_PARAM_SIZE_HINT: 5,
  BROTLI_PARAM_LARGE_WINDOW: 6,
  BROTLI_PARAM_NPOSTFIX: 7,
  BROTLI_PARAM_NDIRECT: 8,
  BROTLI_DECODER_RESULT_ERROR: 0,
  BROTLI_DECODER_RESULT_SUCCESS: 1,
  BROTLI_DECODER_RESULT_NEEDS_MORE_INPUT: 2,
  BROTLI_DECODER_RESULT_NEEDS_MORE_OUTPUT: 3,
  BROTLI_DECODER_PARAM_DISABLE_RING_BUFFER_REALLOCATION: 0,
  BROTLI_DECODER_PARAM_LARGE_WINDOW: 1,
  BROTLI_DECODER_NO_ERROR: 0,
  BROTLI_DECODER_SUCCESS: 1,
  BROTLI_DECODER_NEEDS_MORE_INPUT: 2,
  BROTLI_DECODER_NEEDS_MORE_OUTPUT: 3,
  BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_NIBBLE: -1,
  BROTLI_DECODER_ERROR_FORMAT_RESERVED: -2,
  BROTLI_DECODER_ERROR_FORMAT_EXUBERANT_META_NIBBLE: -3,
  BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_ALPHABET: -4,
  BROTLI_DECODER_ERROR_FORMAT_SIMPLE_HUFFMAN_SAME: -5,
  BROTLI_DECODER_ERROR_FORMAT_CL_SPACE: -6,
  BROTLI_DECODER_ERROR_FORMAT_HUFFMAN_SPACE: -7,
  BROTLI_DECODER_ERROR_FORMAT_CONTEXT_MAP_REPEAT: -8,
  BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_1: -9,
  BROTLI_DECODER_ERROR_FORMAT_BLOCK_LENGTH_2: -10,
  BROTLI_DECODER_ERROR_FORMAT_TRANSFORM: -11,
  BROTLI_DECODER_ERROR_FORMAT_DICTIONARY: -12,
  BROTLI_DECODER_ERROR_FORMAT_WINDOW_BITS: -13,
  BROTLI_DECODER_ERROR_FORMAT_PADDING_1: -14,
  BROTLI_DECODER_ERROR_FORMAT_PADDING_2: -15,
  BROTLI_DECODER_ERROR_FORMAT_DISTANCE: -16,
  BROTLI_DECODER_ERROR_DICTIONARY_NOT_SET: -19,
  BROTLI_DECODER_ERROR_INVALID_ARGUMENTS: -20,
  BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MODES: -21,
  BROTLI_DECODER_ERROR_ALLOC_TREE_GROUPS: -22,
  BROTLI_DECODER_ERROR_ALLOC_CONTEXT_MAP: -25,
  BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_1: -26,
  BROTLI_DECODER_ERROR_ALLOC_RING_BUFFER_2: -27,
  BROTLI_DECODER_ERROR_ALLOC_BLOCK_TYPE_TREES: -30,
  BROTLI_DECODER_ERROR_UNREACHABLE: -31,
}, realZlibConstants));

const proc = typeof process === 'object' && process ? process : {
  stdout: null,
  stderr: null,
};
const EE$3 = require$$0$9;
const Stream$2 = require$$0$a;
const SD = require$$2$2.StringDecoder;

const EOF$1 = Symbol('EOF');
const MAYBE_EMIT_END = Symbol('maybeEmitEnd');
const EMITTED_END = Symbol('emittedEnd');
const EMITTING_END = Symbol('emittingEnd');
const EMITTED_ERROR = Symbol('emittedError');
const CLOSED = Symbol('closed');
const READ$1 = Symbol('read');
const FLUSH = Symbol('flush');
const FLUSHCHUNK = Symbol('flushChunk');
const ENCODING = Symbol('encoding');
const DECODER = Symbol('decoder');
const FLOWING = Symbol('flowing');
const PAUSED = Symbol('paused');
const RESUME = Symbol('resume');
const BUFFERLENGTH = Symbol('bufferLength');
const BUFFERPUSH = Symbol('bufferPush');
const BUFFERSHIFT = Symbol('bufferShift');
const OBJECTMODE = Symbol('objectMode');
const DESTROYED = Symbol('destroyed');
const EMITDATA = Symbol('emitData');
const EMITEND = Symbol('emitEnd');
const EMITEND2 = Symbol('emitEnd2');
const ASYNC = Symbol('async');

const defer = fn => Promise.resolve().then(fn);

// TODO remove when Node v8 support drops
const doIter = commonjsGlobal$1._MP_NO_ITERATOR_SYMBOLS_  !== '1';
const ASYNCITERATOR = doIter && Symbol.asyncIterator
  || Symbol('asyncIterator not implemented');
const ITERATOR = doIter && Symbol.iterator
  || Symbol('iterator not implemented');

// events that mean 'the stream is over'
// these are treated specially, and re-emitted
// if they are listened for after emitting.
const isEndish = ev =>
  ev === 'end' ||
  ev === 'finish' ||
  ev === 'prefinish';

const isArrayBuffer = b => b instanceof ArrayBuffer ||
  typeof b === 'object' &&
  b.constructor &&
  b.constructor.name === 'ArrayBuffer' &&
  b.byteLength >= 0;

const isArrayBufferView = b => !Buffer.isBuffer(b) && ArrayBuffer.isView(b);

class Pipe {
  constructor (src, dest, opts) {
    this.src = src;
    this.dest = dest;
    this.opts = opts;
    this.ondrain = () => src[RESUME]();
    dest.on('drain', this.ondrain);
  }
  unpipe () {
    this.dest.removeListener('drain', this.ondrain);
  }
  // istanbul ignore next - only here for the prototype
  proxyErrors () {}
  end () {
    this.unpipe();
    if (this.opts.end)
      this.dest.end();
  }
}

class PipeProxyErrors extends Pipe {
  unpipe () {
    this.src.removeListener('error', this.proxyErrors);
    super.unpipe();
  }
  constructor (src, dest, opts) {
    super(src, dest, opts);
    this.proxyErrors = er => dest.emit('error', er);
    src.on('error', this.proxyErrors);
  }
}

var minipass = class Minipass extends Stream$2 {
  constructor (options) {
    super();
    this[FLOWING] = false;
    // whether we're explicitly paused
    this[PAUSED] = false;
    this.pipes = [];
    this.buffer = [];
    this[OBJECTMODE] = options && options.objectMode || false;
    if (this[OBJECTMODE])
      this[ENCODING] = null;
    else
      this[ENCODING] = options && options.encoding || null;
    if (this[ENCODING] === 'buffer')
      this[ENCODING] = null;
    this[ASYNC] = options && !!options.async || false;
    this[DECODER] = this[ENCODING] ? new SD(this[ENCODING]) : null;
    this[EOF$1] = false;
    this[EMITTED_END] = false;
    this[EMITTING_END] = false;
    this[CLOSED] = false;
    this[EMITTED_ERROR] = null;
    this.writable = true;
    this.readable = true;
    this[BUFFERLENGTH] = 0;
    this[DESTROYED] = false;
  }

  get bufferLength () { return this[BUFFERLENGTH] }

  get encoding () { return this[ENCODING] }
  set encoding (enc) {
    if (this[OBJECTMODE])
      throw new Error('cannot set encoding in objectMode')

    if (this[ENCODING] && enc !== this[ENCODING] &&
        (this[DECODER] && this[DECODER].lastNeed || this[BUFFERLENGTH]))
      throw new Error('cannot change encoding')

    if (this[ENCODING] !== enc) {
      this[DECODER] = enc ? new SD(enc) : null;
      if (this.buffer.length)
        this.buffer = this.buffer.map(chunk => this[DECODER].write(chunk));
    }

    this[ENCODING] = enc;
  }

  setEncoding (enc) {
    this.encoding = enc;
  }

  get objectMode () { return this[OBJECTMODE] }
  set objectMode (om) { this[OBJECTMODE] = this[OBJECTMODE] || !!om; }

  get ['async'] () { return this[ASYNC] }
  set ['async'] (a) { this[ASYNC] = this[ASYNC] || !!a; }

  write (chunk, encoding, cb) {
    if (this[EOF$1])
      throw new Error('write after end')

    if (this[DESTROYED]) {
      this.emit('error', Object.assign(
        new Error('Cannot call write after a stream was destroyed'),
        { code: 'ERR_STREAM_DESTROYED' }
      ));
      return true
    }

    if (typeof encoding === 'function')
      cb = encoding, encoding = 'utf8';

    if (!encoding)
      encoding = 'utf8';

    const fn = this[ASYNC] ? defer : f => f();

    // convert array buffers and typed array views into buffers
    // at some point in the future, we may want to do the opposite!
    // leave strings and buffers as-is
    // anything else switches us into object mode
    if (!this[OBJECTMODE] && !Buffer.isBuffer(chunk)) {
      if (isArrayBufferView(chunk))
        chunk = Buffer.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
      else if (isArrayBuffer(chunk))
        chunk = Buffer.from(chunk);
      else if (typeof chunk !== 'string')
        // use the setter so we throw if we have encoding set
        this.objectMode = true;
    }

    // handle object mode up front, since it's simpler
    // this yields better performance, fewer checks later.
    if (this[OBJECTMODE]) {
      /* istanbul ignore if - maybe impossible? */
      if (this.flowing && this[BUFFERLENGTH] !== 0)
        this[FLUSH](true);

      if (this.flowing)
        this.emit('data', chunk);
      else
        this[BUFFERPUSH](chunk);

      if (this[BUFFERLENGTH] !== 0)
        this.emit('readable');

      if (cb)
        fn(cb);

      return this.flowing
    }

    // at this point the chunk is a buffer or string
    // don't buffer it up or send it to the decoder
    if (!chunk.length) {
      if (this[BUFFERLENGTH] !== 0)
        this.emit('readable');
      if (cb)
        fn(cb);
      return this.flowing
    }

    // fast-path writing strings of same encoding to a stream with
    // an empty buffer, skipping the buffer/decoder dance
    if (typeof chunk === 'string' &&
        // unless it is a string already ready for us to use
        !(encoding === this[ENCODING] && !this[DECODER].lastNeed)) {
      chunk = Buffer.from(chunk, encoding);
    }

    if (Buffer.isBuffer(chunk) && this[ENCODING])
      chunk = this[DECODER].write(chunk);

    // Note: flushing CAN potentially switch us into not-flowing mode
    if (this.flowing && this[BUFFERLENGTH] !== 0)
      this[FLUSH](true);

    if (this.flowing)
      this.emit('data', chunk);
    else
      this[BUFFERPUSH](chunk);

    if (this[BUFFERLENGTH] !== 0)
      this.emit('readable');

    if (cb)
      fn(cb);

    return this.flowing
  }

  read (n) {
    if (this[DESTROYED])
      return null

    if (this[BUFFERLENGTH] === 0 || n === 0 || n > this[BUFFERLENGTH]) {
      this[MAYBE_EMIT_END]();
      return null
    }

    if (this[OBJECTMODE])
      n = null;

    if (this.buffer.length > 1 && !this[OBJECTMODE]) {
      if (this.encoding)
        this.buffer = [this.buffer.join('')];
      else
        this.buffer = [Buffer.concat(this.buffer, this[BUFFERLENGTH])];
    }

    const ret = this[READ$1](n || null, this.buffer[0]);
    this[MAYBE_EMIT_END]();
    return ret
  }

  [READ$1] (n, chunk) {
    if (n === chunk.length || n === null)
      this[BUFFERSHIFT]();
    else {
      this.buffer[0] = chunk.slice(n);
      chunk = chunk.slice(0, n);
      this[BUFFERLENGTH] -= n;
    }

    this.emit('data', chunk);

    if (!this.buffer.length && !this[EOF$1])
      this.emit('drain');

    return chunk
  }

  end (chunk, encoding, cb) {
    if (typeof chunk === 'function')
      cb = chunk, chunk = null;
    if (typeof encoding === 'function')
      cb = encoding, encoding = 'utf8';
    if (chunk)
      this.write(chunk, encoding);
    if (cb)
      this.once('end', cb);
    this[EOF$1] = true;
    this.writable = false;

    // if we haven't written anything, then go ahead and emit,
    // even if we're not reading.
    // we'll re-emit if a new 'end' listener is added anyway.
    // This makes MP more suitable to write-only use cases.
    if (this.flowing || !this[PAUSED])
      this[MAYBE_EMIT_END]();
    return this
  }

  // don't let the internal resume be overwritten
  [RESUME] () {
    if (this[DESTROYED])
      return

    this[PAUSED] = false;
    this[FLOWING] = true;
    this.emit('resume');
    if (this.buffer.length)
      this[FLUSH]();
    else if (this[EOF$1])
      this[MAYBE_EMIT_END]();
    else
      this.emit('drain');
  }

  resume () {
    return this[RESUME]()
  }

  pause () {
    this[FLOWING] = false;
    this[PAUSED] = true;
  }

  get destroyed () {
    return this[DESTROYED]
  }

  get flowing () {
    return this[FLOWING]
  }

  get paused () {
    return this[PAUSED]
  }

  [BUFFERPUSH] (chunk) {
    if (this[OBJECTMODE])
      this[BUFFERLENGTH] += 1;
    else
      this[BUFFERLENGTH] += chunk.length;
    this.buffer.push(chunk);
  }

  [BUFFERSHIFT] () {
    if (this.buffer.length) {
      if (this[OBJECTMODE])
        this[BUFFERLENGTH] -= 1;
      else
        this[BUFFERLENGTH] -= this.buffer[0].length;
    }
    return this.buffer.shift()
  }

  [FLUSH] (noDrain) {
    do {} while (this[FLUSHCHUNK](this[BUFFERSHIFT]()))

    if (!noDrain && !this.buffer.length && !this[EOF$1])
      this.emit('drain');
  }

  [FLUSHCHUNK] (chunk) {
    return chunk ? (this.emit('data', chunk), this.flowing) : false
  }

  pipe (dest, opts) {
    if (this[DESTROYED])
      return

    const ended = this[EMITTED_END];
    opts = opts || {};
    if (dest === proc.stdout || dest === proc.stderr)
      opts.end = false;
    else
      opts.end = opts.end !== false;
    opts.proxyErrors = !!opts.proxyErrors;

    // piping an ended stream ends immediately
    if (ended) {
      if (opts.end)
        dest.end();
    } else {
      this.pipes.push(!opts.proxyErrors ? new Pipe(this, dest, opts)
        : new PipeProxyErrors(this, dest, opts));
      if (this[ASYNC])
        defer(() => this[RESUME]());
      else
        this[RESUME]();
    }

    return dest
  }

  unpipe (dest) {
    const p = this.pipes.find(p => p.dest === dest);
    if (p) {
      this.pipes.splice(this.pipes.indexOf(p), 1);
      p.unpipe();
    }
  }

  addListener (ev, fn) {
    return this.on(ev, fn)
  }

  on (ev, fn) {
    const ret = super.on(ev, fn);
    if (ev === 'data' && !this.pipes.length && !this.flowing)
      this[RESUME]();
    else if (ev === 'readable' && this[BUFFERLENGTH] !== 0)
      super.emit('readable');
    else if (isEndish(ev) && this[EMITTED_END]) {
      super.emit(ev);
      this.removeAllListeners(ev);
    } else if (ev === 'error' && this[EMITTED_ERROR]) {
      if (this[ASYNC])
        defer(() => fn.call(this, this[EMITTED_ERROR]));
      else
        fn.call(this, this[EMITTED_ERROR]);
    }
    return ret
  }

  get emittedEnd () {
    return this[EMITTED_END]
  }

  [MAYBE_EMIT_END] () {
    if (!this[EMITTING_END] &&
        !this[EMITTED_END] &&
        !this[DESTROYED] &&
        this.buffer.length === 0 &&
        this[EOF$1]) {
      this[EMITTING_END] = true;
      this.emit('end');
      this.emit('prefinish');
      this.emit('finish');
      if (this[CLOSED])
        this.emit('close');
      this[EMITTING_END] = false;
    }
  }

  emit (ev, data, ...extra) {
    // error and close are only events allowed after calling destroy()
    if (ev !== 'error' && ev !== 'close' && ev !== DESTROYED && this[DESTROYED])
      return
    else if (ev === 'data') {
      return !data ? false
        : this[ASYNC] ? defer(() => this[EMITDATA](data))
        : this[EMITDATA](data)
    } else if (ev === 'end') {
      return this[EMITEND]()
    } else if (ev === 'close') {
      this[CLOSED] = true;
      // don't emit close before 'end' and 'finish'
      if (!this[EMITTED_END] && !this[DESTROYED])
        return
      const ret = super.emit('close');
      this.removeAllListeners('close');
      return ret
    } else if (ev === 'error') {
      this[EMITTED_ERROR] = data;
      const ret = super.emit('error', data);
      this[MAYBE_EMIT_END]();
      return ret
    } else if (ev === 'resume') {
      const ret = super.emit('resume');
      this[MAYBE_EMIT_END]();
      return ret
    } else if (ev === 'finish' || ev === 'prefinish') {
      const ret = super.emit(ev);
      this.removeAllListeners(ev);
      return ret
    }

    // Some other unknown event
    const ret = super.emit(ev, data, ...extra);
    this[MAYBE_EMIT_END]();
    return ret
  }

  [EMITDATA] (data) {
    for (const p of this.pipes) {
      if (p.dest.write(data) === false)
        this.pause();
    }
    const ret = super.emit('data', data);
    this[MAYBE_EMIT_END]();
    return ret
  }

  [EMITEND] () {
    if (this[EMITTED_END])
      return

    this[EMITTED_END] = true;
    this.readable = false;
    if (this[ASYNC])
      defer(() => this[EMITEND2]());
    else
      this[EMITEND2]();
  }

  [EMITEND2] () {
    if (this[DECODER]) {
      const data = this[DECODER].end();
      if (data) {
        for (const p of this.pipes) {
          p.dest.write(data);
        }
        super.emit('data', data);
      }
    }

    for (const p of this.pipes) {
      p.end();
    }
    const ret = super.emit('end');
    this.removeAllListeners('end');
    return ret
  }

  // const all = await stream.collect()
  collect () {
    const buf = [];
    if (!this[OBJECTMODE])
      buf.dataLength = 0;
    // set the promise first, in case an error is raised
    // by triggering the flow here.
    const p = this.promise();
    this.on('data', c => {
      buf.push(c);
      if (!this[OBJECTMODE])
        buf.dataLength += c.length;
    });
    return p.then(() => buf)
  }

  // const data = await stream.concat()
  concat () {
    return this[OBJECTMODE]
      ? Promise.reject(new Error('cannot concat in objectMode'))
      : this.collect().then(buf =>
          this[OBJECTMODE]
            ? Promise.reject(new Error('cannot concat in objectMode'))
            : this[ENCODING] ? buf.join('') : Buffer.concat(buf, buf.dataLength))
  }

  // stream.promise().then(() => done, er => emitted error)
  promise () {
    return new Promise((resolve, reject) => {
      this.on(DESTROYED, () => reject(new Error('stream destroyed')));
      this.on('error', er => reject(er));
      this.on('end', () => resolve());
    })
  }

  // for await (let chunk of stream)
  [ASYNCITERATOR] () {
    const next = () => {
      const res = this.read();
      if (res !== null)
        return Promise.resolve({ done: false, value: res })

      if (this[EOF$1])
        return Promise.resolve({ done: true })

      let resolve = null;
      let reject = null;
      const onerr = er => {
        this.removeListener('data', ondata);
        this.removeListener('end', onend);
        reject(er);
      };
      const ondata = value => {
        this.removeListener('error', onerr);
        this.removeListener('end', onend);
        this.pause();
        resolve({ value: value, done: !!this[EOF$1] });
      };
      const onend = () => {
        this.removeListener('error', onerr);
        this.removeListener('data', ondata);
        resolve({ done: true });
      };
      const ondestroy = () => onerr(new Error('stream destroyed'));
      return new Promise((res, rej) => {
        reject = rej;
        resolve = res;
        this.once(DESTROYED, ondestroy);
        this.once('error', onerr);
        this.once('end', onend);
        this.once('data', ondata);
      })
    };

    return { next }
  }

  // for (let chunk of stream)
  [ITERATOR] () {
    const next = () => {
      const value = this.read();
      const done = value === null;
      return { value, done }
    };
    return { next }
  }

  destroy (er) {
    if (this[DESTROYED]) {
      if (er)
        this.emit('error', er);
      else
        this.emit(DESTROYED);
      return this
    }

    this[DESTROYED] = true;

    // throw away all buffered data, it's never coming out
    this.buffer.length = 0;
    this[BUFFERLENGTH] = 0;

    if (typeof this.close === 'function' && !this[CLOSED])
      this.close();

    if (er)
      this.emit('error', er);
    else // if no error to emit, still reject pending promises
      this.emit(DESTROYED);

    return this
  }

  static isStream (s) {
    return !!s && (s instanceof Minipass || s instanceof Stream$2 ||
      s instanceof EE$3 && (
        typeof s.pipe === 'function' || // readable
        (typeof s.write === 'function' && typeof s.end === 'function') // writable
      ))
  }
};

const assert$d = require$$0$c;
const Buffer$1 = require$$1$5.Buffer;
const realZlib = require$$0$b;

const constants$6 = minizlib.constants = constants$7;
const Minipass$3 = minipass;

const OriginalBufferConcat = Buffer$1.concat;

const _superWrite = Symbol('_superWrite');
class ZlibError extends Error {
  constructor (err) {
    super('zlib: ' + err.message);
    this.code = err.code;
    this.errno = err.errno;
    /* istanbul ignore if */
    if (!this.code)
      this.code = 'ZLIB_ERROR';

    this.message = 'zlib: ' + err.message;
    Error.captureStackTrace(this, this.constructor);
  }

  get name () {
    return 'ZlibError'
  }
}

// the Zlib class they all inherit from
// This thing manages the queue of requests, and returns
// true or false if there is anything in the queue when
// you call the .write() method.
const _opts = Symbol('opts');
const _flushFlag = Symbol('flushFlag');
const _finishFlushFlag = Symbol('finishFlushFlag');
const _fullFlushFlag = Symbol('fullFlushFlag');
const _handle = Symbol('handle');
const _onError = Symbol('onError');
const _sawError = Symbol('sawError');
const _level = Symbol('level');
const _strategy = Symbol('strategy');
const _ended$1 = Symbol('ended');

class ZlibBase extends Minipass$3 {
  constructor (opts, mode) {
    if (!opts || typeof opts !== 'object')
      throw new TypeError('invalid options for ZlibBase constructor')

    super(opts);
    this[_sawError] = false;
    this[_ended$1] = false;
    this[_opts] = opts;

    this[_flushFlag] = opts.flush;
    this[_finishFlushFlag] = opts.finishFlush;
    // this will throw if any options are invalid for the class selected
    try {
      this[_handle] = new realZlib[mode](opts);
    } catch (er) {
      // make sure that all errors get decorated properly
      throw new ZlibError(er)
    }

    this[_onError] = (err) => {
      // no sense raising multiple errors, since we abort on the first one.
      if (this[_sawError])
        return

      this[_sawError] = true;

      // there is no way to cleanly recover.
      // continuing only obscures problems.
      this.close();
      this.emit('error', err);
    };

    this[_handle].on('error', er => this[_onError](new ZlibError(er)));
    this.once('end', () => this.close);
  }

  close () {
    if (this[_handle]) {
      this[_handle].close();
      this[_handle] = null;
      this.emit('close');
    }
  }

  reset () {
    if (!this[_sawError]) {
      assert$d(this[_handle], 'zlib binding closed');
      return this[_handle].reset()
    }
  }

  flush (flushFlag) {
    if (this.ended)
      return

    if (typeof flushFlag !== 'number')
      flushFlag = this[_fullFlushFlag];
    this.write(Object.assign(Buffer$1.alloc(0), { [_flushFlag]: flushFlag }));
  }

  end (chunk, encoding, cb) {
    if (chunk)
      this.write(chunk, encoding);
    this.flush(this[_finishFlushFlag]);
    this[_ended$1] = true;
    return super.end(null, null, cb)
  }

  get ended () {
    return this[_ended$1]
  }

  write (chunk, encoding, cb) {
    // process the chunk using the sync process
    // then super.write() all the outputted chunks
    if (typeof encoding === 'function')
      cb = encoding, encoding = 'utf8';

    if (typeof chunk === 'string')
      chunk = Buffer$1.from(chunk, encoding);

    if (this[_sawError])
      return
    assert$d(this[_handle], 'zlib binding closed');

    // _processChunk tries to .close() the native handle after it's done, so we
    // intercept that by temporarily making it a no-op.
    const nativeHandle = this[_handle]._handle;
    const originalNativeClose = nativeHandle.close;
    nativeHandle.close = () => {};
    const originalClose = this[_handle].close;
    this[_handle].close = () => {};
    // It also calls `Buffer.concat()` at the end, which may be convenient
    // for some, but which we are not interested in as it slows us down.
    Buffer$1.concat = (args) => args;
    let result;
    try {
      const flushFlag = typeof chunk[_flushFlag] === 'number'
        ? chunk[_flushFlag] : this[_flushFlag];
      result = this[_handle]._processChunk(chunk, flushFlag);
      // if we don't throw, reset it back how it was
      Buffer$1.concat = OriginalBufferConcat;
    } catch (err) {
      // or if we do, put Buffer.concat() back before we emit error
      // Error events call into user code, which may call Buffer.concat()
      Buffer$1.concat = OriginalBufferConcat;
      this[_onError](new ZlibError(err));
    } finally {
      if (this[_handle]) {
        // Core zlib resets `_handle` to null after attempting to close the
        // native handle. Our no-op handler prevented actual closure, but we
        // need to restore the `._handle` property.
        this[_handle]._handle = nativeHandle;
        nativeHandle.close = originalNativeClose;
        this[_handle].close = originalClose;
        // `_processChunk()` adds an 'error' listener. If we don't remove it
        // after each call, these handlers start piling up.
        this[_handle].removeAllListeners('error');
        // make sure OUR error listener is still attached tho
      }
    }

    if (this[_handle])
      this[_handle].on('error', er => this[_onError](new ZlibError(er)));

    let writeReturn;
    if (result) {
      if (Array.isArray(result) && result.length > 0) {
        // The first buffer is always `handle._outBuffer`, which would be
        // re-used for later invocations; so, we always have to copy that one.
        writeReturn = this[_superWrite](Buffer$1.from(result[0]));
        for (let i = 1; i < result.length; i++) {
          writeReturn = this[_superWrite](result[i]);
        }
      } else {
        writeReturn = this[_superWrite](Buffer$1.from(result));
      }
    }

    if (cb)
      cb();
    return writeReturn
  }

  [_superWrite] (data) {
    return super.write(data)
  }
}

class Zlib extends ZlibBase {
  constructor (opts, mode) {
    opts = opts || {};

    opts.flush = opts.flush || constants$6.Z_NO_FLUSH;
    opts.finishFlush = opts.finishFlush || constants$6.Z_FINISH;
    super(opts, mode);

    this[_fullFlushFlag] = constants$6.Z_FULL_FLUSH;
    this[_level] = opts.level;
    this[_strategy] = opts.strategy;
  }

  params (level, strategy) {
    if (this[_sawError])
      return

    if (!this[_handle])
      throw new Error('cannot switch params when binding is closed')

    // no way to test this without also not supporting params at all
    /* istanbul ignore if */
    if (!this[_handle].params)
      throw new Error('not supported in this implementation')

    if (this[_level] !== level || this[_strategy] !== strategy) {
      this.flush(constants$6.Z_SYNC_FLUSH);
      assert$d(this[_handle], 'zlib binding closed');
      // .params() calls .flush(), but the latter is always async in the
      // core zlib. We override .flush() temporarily to intercept that and
      // flush synchronously.
      const origFlush = this[_handle].flush;
      this[_handle].flush = (flushFlag, cb) => {
        this.flush(flushFlag);
        cb();
      };
      try {
        this[_handle].params(level, strategy);
      } finally {
        this[_handle].flush = origFlush;
      }
      /* istanbul ignore else */
      if (this[_handle]) {
        this[_level] = level;
        this[_strategy] = strategy;
      }
    }
  }
}

// minimal 2-byte header
class Deflate extends Zlib {
  constructor (opts) {
    super(opts, 'Deflate');
  }
}

class Inflate extends Zlib {
  constructor (opts) {
    super(opts, 'Inflate');
  }
}

// gzip - bigger header, same deflate compression
const _portable = Symbol('_portable');
class Gzip extends Zlib {
  constructor (opts) {
    super(opts, 'Gzip');
    this[_portable] = opts && !!opts.portable;
  }

  [_superWrite] (data) {
    if (!this[_portable])
      return super[_superWrite](data)

    // we'll always get the header emitted in one first chunk
    // overwrite the OS indicator byte with 0xFF
    this[_portable] = false;
    data[9] = 255;
    return super[_superWrite](data)
  }
}

class Gunzip extends Zlib {
  constructor (opts) {
    super(opts, 'Gunzip');
  }
}

// raw - no header
class DeflateRaw extends Zlib {
  constructor (opts) {
    super(opts, 'DeflateRaw');
  }
}

class InflateRaw extends Zlib {
  constructor (opts) {
    super(opts, 'InflateRaw');
  }
}

// auto-detect header.
class Unzip extends Zlib {
  constructor (opts) {
    super(opts, 'Unzip');
  }
}

class Brotli extends ZlibBase {
  constructor (opts, mode) {
    opts = opts || {};

    opts.flush = opts.flush || constants$6.BROTLI_OPERATION_PROCESS;
    opts.finishFlush = opts.finishFlush || constants$6.BROTLI_OPERATION_FINISH;

    super(opts, mode);

    this[_fullFlushFlag] = constants$6.BROTLI_OPERATION_FLUSH;
  }
}

class BrotliCompress extends Brotli {
  constructor (opts) {
    super(opts, 'BrotliCompress');
  }
}

class BrotliDecompress extends Brotli {
  constructor (opts) {
    super(opts, 'BrotliDecompress');
  }
}

minizlib.Deflate = Deflate;
minizlib.Inflate = Inflate;
minizlib.Gzip = Gzip;
minizlib.Gunzip = Gunzip;
minizlib.DeflateRaw = DeflateRaw;
minizlib.InflateRaw = InflateRaw;
minizlib.Unzip = Unzip;
/* istanbul ignore else */
if (typeof realZlib.BrotliCompress === 'function') {
  minizlib.BrotliCompress = BrotliCompress;
  minizlib.BrotliDecompress = BrotliDecompress;
} else {
  minizlib.BrotliCompress = minizlib.BrotliDecompress = class {
    constructor () {
      throw new Error('Brotli is not supported in this version of Node.js')
    }
  };
}

// on windows, either \ or / are valid directory separators.
// on unix, \ is a valid character in filenames.
// so, on windows, and only on windows, we replace all \ chars with /,
// so that we can use / as our one and only directory separator char.

const platform$4 = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
var normalizeWindowsPath = platform$4 !== 'win32' ? p => p
  : p => p && p.replace(/\\/g, '/');

const { Minipass: Minipass$2 } = minipass$1;
const normPath$4 = normalizeWindowsPath;

const SLURP$1 = Symbol('slurp');
var readEntry = class ReadEntry extends Minipass$2 {
  constructor (header, ex, gex) {
    super();
    // read entries always start life paused.  this is to avoid the
    // situation where Minipass's auto-ending empty streams results
    // in an entry ending before we're ready for it.
    this.pause();
    this.extended = ex;
    this.globalExtended = gex;
    this.header = header;
    this.startBlockSize = 512 * Math.ceil(header.size / 512);
    this.blockRemain = this.startBlockSize;
    this.remain = header.size;
    this.type = header.type;
    this.meta = false;
    this.ignore = false;
    switch (this.type) {
      case 'File':
      case 'OldFile':
      case 'Link':
      case 'SymbolicLink':
      case 'CharacterDevice':
      case 'BlockDevice':
      case 'Directory':
      case 'FIFO':
      case 'ContiguousFile':
      case 'GNUDumpDir':
        break

      case 'NextFileHasLongLinkpath':
      case 'NextFileHasLongPath':
      case 'OldGnuLongPath':
      case 'GlobalExtendedHeader':
      case 'ExtendedHeader':
      case 'OldExtendedHeader':
        this.meta = true;
        break

      // NOTE: gnutar and bsdtar treat unrecognized types as 'File'
      // it may be worth doing the same, but with a warning.
      default:
        this.ignore = true;
    }

    this.path = normPath$4(header.path);
    this.mode = header.mode;
    if (this.mode) {
      this.mode = this.mode & 0o7777;
    }
    this.uid = header.uid;
    this.gid = header.gid;
    this.uname = header.uname;
    this.gname = header.gname;
    this.size = header.size;
    this.mtime = header.mtime;
    this.atime = header.atime;
    this.ctime = header.ctime;
    this.linkpath = normPath$4(header.linkpath);
    this.uname = header.uname;
    this.gname = header.gname;

    if (ex) {
      this[SLURP$1](ex);
    }
    if (gex) {
      this[SLURP$1](gex, true);
    }
  }

  write (data) {
    const writeLen = data.length;
    if (writeLen > this.blockRemain) {
      throw new Error('writing more to entry than is appropriate')
    }

    const r = this.remain;
    const br = this.blockRemain;
    this.remain = Math.max(0, r - writeLen);
    this.blockRemain = Math.max(0, br - writeLen);
    if (this.ignore) {
      return true
    }

    if (r >= writeLen) {
      return super.write(data)
    }

    // r < writeLen
    return super.write(data.slice(0, r))
  }

  [SLURP$1] (ex, global) {
    for (const k in ex) {
      // we slurp in everything except for the path attribute in
      // a global extended header, because that's weird.
      if (ex[k] !== null && ex[k] !== undefined &&
          !(global && k === 'path')) {
        this[k] = k === 'path' || k === 'linkpath' ? normPath$4(ex[k]) : ex[k];
      }
    }
  }
};

var types$1 = {};

(function (exports) {
	// map types from key to human-friendly name
	exports.name = new Map([
	  ['0', 'File'],
	  // same as File
	  ['', 'OldFile'],
	  ['1', 'Link'],
	  ['2', 'SymbolicLink'],
	  // Devices and FIFOs aren't fully supported
	  // they are parsed, but skipped when unpacking
	  ['3', 'CharacterDevice'],
	  ['4', 'BlockDevice'],
	  ['5', 'Directory'],
	  ['6', 'FIFO'],
	  // same as File
	  ['7', 'ContiguousFile'],
	  // pax headers
	  ['g', 'GlobalExtendedHeader'],
	  ['x', 'ExtendedHeader'],
	  // vendor-specific stuff
	  // skip
	  ['A', 'SolarisACL'],
	  // like 5, but with data, which should be skipped
	  ['D', 'GNUDumpDir'],
	  // metadata only, skip
	  ['I', 'Inode'],
	  // data = link path of next file
	  ['K', 'NextFileHasLongLinkpath'],
	  // data = path of next file
	  ['L', 'NextFileHasLongPath'],
	  // skip
	  ['M', 'ContinuationFile'],
	  // like L
	  ['N', 'OldGnuLongPath'],
	  // skip
	  ['S', 'SparseFile'],
	  // skip
	  ['V', 'TapeVolumeHeader'],
	  // like x
	  ['X', 'OldExtendedHeader'],
	]);

	// map the other direction
	exports.code = new Map(Array.from(exports.name).map(kv => [kv[1], kv[0]])); 
} (types$1));

// Tar can encode large and negative numbers using a leading byte of
// 0xff for negative, and 0x80 for positive.

const encode = (num, buf) => {
  if (!Number.isSafeInteger(num)) {
  // The number is so large that javascript cannot represent it with integer
  // precision.
    throw Error('cannot encode number outside of javascript safe integer range')
  } else if (num < 0) {
    encodeNegative(num, buf);
  } else {
    encodePositive(num, buf);
  }
  return buf
};

const encodePositive = (num, buf) => {
  buf[0] = 0x80;

  for (var i = buf.length; i > 1; i--) {
    buf[i - 1] = num & 0xff;
    num = Math.floor(num / 0x100);
  }
};

const encodeNegative = (num, buf) => {
  buf[0] = 0xff;
  var flipped = false;
  num = num * -1;
  for (var i = buf.length; i > 1; i--) {
    var byte = num & 0xff;
    num = Math.floor(num / 0x100);
    if (flipped) {
      buf[i - 1] = onesComp(byte);
    } else if (byte === 0) {
      buf[i - 1] = 0;
    } else {
      flipped = true;
      buf[i - 1] = twosComp(byte);
    }
  }
};

const parse$4 = (buf) => {
  const pre = buf[0];
  const value = pre === 0x80 ? pos(buf.slice(1, buf.length))
    : pre === 0xff ? twos(buf)
    : null;
  if (value === null) {
    throw Error('invalid base256 encoding')
  }

  if (!Number.isSafeInteger(value)) {
  // The number is so large that javascript cannot represent it with integer
  // precision.
    throw Error('parsed number outside of javascript safe integer range')
  }

  return value
};

const twos = (buf) => {
  var len = buf.length;
  var sum = 0;
  var flipped = false;
  for (var i = len - 1; i > -1; i--) {
    var byte = buf[i];
    var f;
    if (flipped) {
      f = onesComp(byte);
    } else if (byte === 0) {
      f = byte;
    } else {
      flipped = true;
      f = twosComp(byte);
    }
    if (f !== 0) {
      sum -= f * Math.pow(256, len - i - 1);
    }
  }
  return sum
};

const pos = (buf) => {
  var len = buf.length;
  var sum = 0;
  for (var i = len - 1; i > -1; i--) {
    var byte = buf[i];
    if (byte !== 0) {
      sum += byte * Math.pow(256, len - i - 1);
    }
  }
  return sum
};

const onesComp = byte => (0xff ^ byte) & 0xff;

const twosComp = byte => ((0xff ^ byte) + 1) & 0xff;

var largeNumbers = {
  encode,
  parse: parse$4,
};

// parse a 512-byte header block to a data object, or vice-versa
// encode returns `true` if a pax extended header is needed, because
// the data could not be faithfully encoded in a simple header.
// (Also, check header.needPax to see if it needs a pax header.)

const types = types$1;
const pathModule = require$$0$d.posix;
const large = largeNumbers;

const SLURP = Symbol('slurp');
const TYPE = Symbol('type');

let Header$3 = class Header {
  constructor (data, off, ex, gex) {
    this.cksumValid = false;
    this.needPax = false;
    this.nullBlock = false;

    this.block = null;
    this.path = null;
    this.mode = null;
    this.uid = null;
    this.gid = null;
    this.size = null;
    this.mtime = null;
    this.cksum = null;
    this[TYPE] = '0';
    this.linkpath = null;
    this.uname = null;
    this.gname = null;
    this.devmaj = 0;
    this.devmin = 0;
    this.atime = null;
    this.ctime = null;

    if (Buffer.isBuffer(data)) {
      this.decode(data, off || 0, ex, gex);
    } else if (data) {
      this.set(data);
    }
  }

  decode (buf, off, ex, gex) {
    if (!off) {
      off = 0;
    }

    if (!buf || !(buf.length >= off + 512)) {
      throw new Error('need 512 bytes for header')
    }

    this.path = decString(buf, off, 100);
    this.mode = decNumber(buf, off + 100, 8);
    this.uid = decNumber(buf, off + 108, 8);
    this.gid = decNumber(buf, off + 116, 8);
    this.size = decNumber(buf, off + 124, 12);
    this.mtime = decDate(buf, off + 136, 12);
    this.cksum = decNumber(buf, off + 148, 12);

    // if we have extended or global extended headers, apply them now
    // See https://github.com/npm/node-tar/pull/187
    this[SLURP](ex);
    this[SLURP](gex, true);

    // old tar versions marked dirs as a file with a trailing /
    this[TYPE] = decString(buf, off + 156, 1);
    if (this[TYPE] === '') {
      this[TYPE] = '0';
    }
    if (this[TYPE] === '0' && this.path.slice(-1) === '/') {
      this[TYPE] = '5';
    }

    // tar implementations sometimes incorrectly put the stat(dir).size
    // as the size in the tarball, even though Directory entries are
    // not able to have any body at all.  In the very rare chance that
    // it actually DOES have a body, we weren't going to do anything with
    // it anyway, and it'll just be a warning about an invalid header.
    if (this[TYPE] === '5') {
      this.size = 0;
    }

    this.linkpath = decString(buf, off + 157, 100);
    if (buf.slice(off + 257, off + 265).toString() === 'ustar\u000000') {
      this.uname = decString(buf, off + 265, 32);
      this.gname = decString(buf, off + 297, 32);
      this.devmaj = decNumber(buf, off + 329, 8);
      this.devmin = decNumber(buf, off + 337, 8);
      if (buf[off + 475] !== 0) {
        // definitely a prefix, definitely >130 chars.
        const prefix = decString(buf, off + 345, 155);
        this.path = prefix + '/' + this.path;
      } else {
        const prefix = decString(buf, off + 345, 130);
        if (prefix) {
          this.path = prefix + '/' + this.path;
        }
        this.atime = decDate(buf, off + 476, 12);
        this.ctime = decDate(buf, off + 488, 12);
      }
    }

    let sum = 8 * 0x20;
    for (let i = off; i < off + 148; i++) {
      sum += buf[i];
    }

    for (let i = off + 156; i < off + 512; i++) {
      sum += buf[i];
    }

    this.cksumValid = sum === this.cksum;
    if (this.cksum === null && sum === 8 * 0x20) {
      this.nullBlock = true;
    }
  }

  [SLURP] (ex, global) {
    for (const k in ex) {
      // we slurp in everything except for the path attribute in
      // a global extended header, because that's weird.
      if (ex[k] !== null && ex[k] !== undefined &&
          !(global && k === 'path')) {
        this[k] = ex[k];
      }
    }
  }

  encode (buf, off) {
    if (!buf) {
      buf = this.block = Buffer.alloc(512);
      off = 0;
    }

    if (!off) {
      off = 0;
    }

    if (!(buf.length >= off + 512)) {
      throw new Error('need 512 bytes for header')
    }

    const prefixSize = this.ctime || this.atime ? 130 : 155;
    const split = splitPrefix(this.path || '', prefixSize);
    const path = split[0];
    const prefix = split[1];
    this.needPax = split[2];

    this.needPax = encString(buf, off, 100, path) || this.needPax;
    this.needPax = encNumber(buf, off + 100, 8, this.mode) || this.needPax;
    this.needPax = encNumber(buf, off + 108, 8, this.uid) || this.needPax;
    this.needPax = encNumber(buf, off + 116, 8, this.gid) || this.needPax;
    this.needPax = encNumber(buf, off + 124, 12, this.size) || this.needPax;
    this.needPax = encDate(buf, off + 136, 12, this.mtime) || this.needPax;
    buf[off + 156] = this[TYPE].charCodeAt(0);
    this.needPax = encString(buf, off + 157, 100, this.linkpath) || this.needPax;
    buf.write('ustar\u000000', off + 257, 8);
    this.needPax = encString(buf, off + 265, 32, this.uname) || this.needPax;
    this.needPax = encString(buf, off + 297, 32, this.gname) || this.needPax;
    this.needPax = encNumber(buf, off + 329, 8, this.devmaj) || this.needPax;
    this.needPax = encNumber(buf, off + 337, 8, this.devmin) || this.needPax;
    this.needPax = encString(buf, off + 345, prefixSize, prefix) || this.needPax;
    if (buf[off + 475] !== 0) {
      this.needPax = encString(buf, off + 345, 155, prefix) || this.needPax;
    } else {
      this.needPax = encString(buf, off + 345, 130, prefix) || this.needPax;
      this.needPax = encDate(buf, off + 476, 12, this.atime) || this.needPax;
      this.needPax = encDate(buf, off + 488, 12, this.ctime) || this.needPax;
    }

    let sum = 8 * 0x20;
    for (let i = off; i < off + 148; i++) {
      sum += buf[i];
    }

    for (let i = off + 156; i < off + 512; i++) {
      sum += buf[i];
    }

    this.cksum = sum;
    encNumber(buf, off + 148, 8, this.cksum);
    this.cksumValid = true;

    return this.needPax
  }

  set (data) {
    for (const i in data) {
      if (data[i] !== null && data[i] !== undefined) {
        this[i] = data[i];
      }
    }
  }

  get type () {
    return types.name.get(this[TYPE]) || this[TYPE]
  }

  get typeKey () {
    return this[TYPE]
  }

  set type (type) {
    if (types.code.has(type)) {
      this[TYPE] = types.code.get(type);
    } else {
      this[TYPE] = type;
    }
  }
};

const splitPrefix = (p, prefixSize) => {
  const pathSize = 100;
  let pp = p;
  let prefix = '';
  let ret;
  const root = pathModule.parse(p).root || '.';

  if (Buffer.byteLength(pp) < pathSize) {
    ret = [pp, prefix, false];
  } else {
    // first set prefix to the dir, and path to the base
    prefix = pathModule.dirname(pp);
    pp = pathModule.basename(pp);

    do {
      if (Buffer.byteLength(pp) <= pathSize &&
          Buffer.byteLength(prefix) <= prefixSize) {
        // both fit!
        ret = [pp, prefix, false];
      } else if (Buffer.byteLength(pp) > pathSize &&
          Buffer.byteLength(prefix) <= prefixSize) {
        // prefix fits in prefix, but path doesn't fit in path
        ret = [pp.slice(0, pathSize - 1), prefix, true];
      } else {
        // make path take a bit from prefix
        pp = pathModule.join(pathModule.basename(prefix), pp);
        prefix = pathModule.dirname(prefix);
      }
    } while (prefix !== root && !ret)

    // at this point, found no resolution, just truncate
    if (!ret) {
      ret = [p.slice(0, pathSize - 1), '', true];
    }
  }
  return ret
};

const decString = (buf, off, size) =>
  buf.slice(off, off + size).toString('utf8').replace(/\0.*/, '');

const decDate = (buf, off, size) =>
  numToDate(decNumber(buf, off, size));

const numToDate = num => num === null ? null : new Date(num * 1000);

const decNumber = (buf, off, size) =>
  buf[off] & 0x80 ? large.parse(buf.slice(off, off + size))
  : decSmallNumber(buf, off, size);

const nanNull = value => isNaN(value) ? null : value;

const decSmallNumber = (buf, off, size) =>
  nanNull(parseInt(
    buf.slice(off, off + size)
      .toString('utf8').replace(/\0.*$/, '').trim(), 8));

// the maximum encodable as a null-terminated octal, by field size
const MAXNUM = {
  12: 0o77777777777,
  8: 0o7777777,
};

const encNumber = (buf, off, size, number) =>
  number === null ? false :
  number > MAXNUM[size] || number < 0
    ? (large.encode(number, buf.slice(off, off + size)), true)
    : (encSmallNumber(buf, off, size, number), false);

const encSmallNumber = (buf, off, size, number) =>
  buf.write(octalString(number, size), off, size, 'ascii');

const octalString = (number, size) =>
  padOctal(Math.floor(number).toString(8), size);

const padOctal = (string, size) =>
  (string.length === size - 1 ? string
  : new Array(size - string.length - 1).join('0') + string + ' ') + '\0';

const encDate = (buf, off, size, date) =>
  date === null ? false :
  encNumber(buf, off, size, date.getTime() / 1000);

// enough to fill the longest string we've got
const NULLS = new Array(156).join('\0');
// pad with nulls, return true if it's longer or non-ascii
const encString = (buf, off, size, string) =>
  string === null ? false :
  (buf.write(string + NULLS, off, size, 'utf8'),
  string.length !== Buffer.byteLength(string) || string.length > size);

var header = Header$3;

const Header$2 = header;
const path$6 = require$$0$d;

let Pax$2 = class Pax {
  constructor (obj, global) {
    this.atime = obj.atime || null;
    this.charset = obj.charset || null;
    this.comment = obj.comment || null;
    this.ctime = obj.ctime || null;
    this.gid = obj.gid || null;
    this.gname = obj.gname || null;
    this.linkpath = obj.linkpath || null;
    this.mtime = obj.mtime || null;
    this.path = obj.path || null;
    this.size = obj.size || null;
    this.uid = obj.uid || null;
    this.uname = obj.uname || null;
    this.dev = obj.dev || null;
    this.ino = obj.ino || null;
    this.nlink = obj.nlink || null;
    this.global = global || false;
  }

  encode () {
    const body = this.encodeBody();
    if (body === '') {
      return null
    }

    const bodyLen = Buffer.byteLength(body);
    // round up to 512 bytes
    // add 512 for header
    const bufLen = 512 * Math.ceil(1 + bodyLen / 512);
    const buf = Buffer.allocUnsafe(bufLen);

    // 0-fill the header section, it might not hit every field
    for (let i = 0; i < 512; i++) {
      buf[i] = 0;
    }

    new Header$2({
      // XXX split the path
      // then the path should be PaxHeader + basename, but less than 99,
      // prepend with the dirname
      path: ('PaxHeader/' + path$6.basename(this.path)).slice(0, 99),
      mode: this.mode || 0o644,
      uid: this.uid || null,
      gid: this.gid || null,
      size: bodyLen,
      mtime: this.mtime || null,
      type: this.global ? 'GlobalExtendedHeader' : 'ExtendedHeader',
      linkpath: '',
      uname: this.uname || '',
      gname: this.gname || '',
      devmaj: 0,
      devmin: 0,
      atime: this.atime || null,
      ctime: this.ctime || null,
    }).encode(buf);

    buf.write(body, 512, bodyLen, 'utf8');

    // null pad after the body
    for (let i = bodyLen + 512; i < buf.length; i++) {
      buf[i] = 0;
    }

    return buf
  }

  encodeBody () {
    return (
      this.encodeField('path') +
      this.encodeField('ctime') +
      this.encodeField('atime') +
      this.encodeField('dev') +
      this.encodeField('ino') +
      this.encodeField('nlink') +
      this.encodeField('charset') +
      this.encodeField('comment') +
      this.encodeField('gid') +
      this.encodeField('gname') +
      this.encodeField('linkpath') +
      this.encodeField('mtime') +
      this.encodeField('size') +
      this.encodeField('uid') +
      this.encodeField('uname')
    )
  }

  encodeField (field) {
    if (this[field] === null || this[field] === undefined) {
      return ''
    }
    const v = this[field] instanceof Date ? this[field].getTime() / 1000
      : this[field];
    const s = ' ' +
      (field === 'dev' || field === 'ino' || field === 'nlink'
        ? 'SCHILY.' : '') +
      field + '=' + v + '\n';
    const byteLen = Buffer.byteLength(s);
    // the digits includes the length of the digits in ascii base-10
    // so if it's 9 characters, then adding 1 for the 9 makes it 10
    // which makes it 11 chars.
    let digits = Math.floor(Math.log(byteLen) / Math.log(10)) + 1;
    if (byteLen + digits >= Math.pow(10, digits)) {
      digits += 1;
    }
    const len = digits + byteLen;
    return len + s
  }
};

Pax$2.parse = (string, ex, g) => new Pax$2(merge(parseKV(string), ex), g);

const merge = (a, b) =>
  b ? Object.keys(a).reduce((s, k) => (s[k] = a[k], s), b) : a;

const parseKV = string =>
  string
    .replace(/\n$/, '')
    .split('\n')
    .reduce(parseKVLine, Object.create(null));

const parseKVLine = (set, line) => {
  const n = parseInt(line, 10);

  // XXX Values with \n in them will fail this.
  // Refactor to not be a naive line-by-line parse.
  if (n !== Buffer.byteLength(line) + 1) {
    return set
  }

  line = line.slice((n + ' ').length);
  const kv = line.split('=');
  const k = kv.shift().replace(/^SCHILY\.(dev|ino|nlink)/, '$1');
  if (!k) {
    return set
  }

  const v = kv.join('=');
  set[k] = /^([A-Z]+\.)?([mac]|birth|creation)time$/.test(k)
    ? new Date(v * 1000)
    : /^[0-9]+$/.test(v) ? +v
    : v;
  return set
};

var pax = Pax$2;

// warning: extremely hot code path.
// This has been meticulously optimized for use
// within npm install on large package trees.
// Do not edit without careful benchmarking.
var stripTrailingSlashes = str => {
  let i = str.length - 1;
  let slashesStart = -1;
  while (i > -1 && str.charAt(i) === '/') {
    slashesStart = i;
    i--;
  }
  return slashesStart === -1 ? str : str.slice(0, slashesStart)
};

var warnMixin = Base => class extends Base {
  warn (code, message, data = {}) {
    if (this.file) {
      data.file = this.file;
    }
    if (this.cwd) {
      data.cwd = this.cwd;
    }
    data.code = message instanceof Error && message.code || code;
    data.tarCode = code;
    if (!this.strict && data.recoverable !== false) {
      if (message instanceof Error) {
        data = Object.assign(message, data);
        message = message.message;
      }
      this.emit('warn', data.tarCode, message, data);
    } else if (message instanceof Error) {
      this.emit('error', Object.assign(message, data));
    } else {
      this.emit('error', Object.assign(new Error(`${code}: ${message}`), data));
    }
  }
};

// When writing files on Windows, translate the characters to their
// 0xf000 higher-encoded versions.

const raw = [
  '|',
  '<',
  '>',
  '?',
  ':',
];

const win = raw.map(char =>
  String.fromCharCode(0xf000 + char.charCodeAt(0)));

const toWin = new Map(raw.map((char, i) => [char, win[i]]));
const toRaw = new Map(win.map((char, i) => [char, raw[i]]));

var winchars$1 = {
  encode: s => raw.reduce((s, c) => s.split(c).join(toWin.get(c)), s),
  decode: s => win.reduce((s, c) => s.split(c).join(toRaw.get(c)), s),
};

// unix absolute paths are also absolute on win32, so we use this for both
const { isAbsolute, parse: parse$3 } = require$$0$d.win32;

// returns [root, stripped]
// Note that windows will think that //x/y/z/a has a "root" of //x/y, and in
// those cases, we want to sanitize it to x/y/z/a, not z/a, so we strip /
// explicitly if it's the first character.
// drive-specific relative paths on Windows get their root stripped off even
// though they are not absolute, so `c:../foo` becomes ['c:', '../foo']
var stripAbsolutePath$2 = path => {
  let r = '';

  let parsed = parse$3(path);
  while (isAbsolute(path) || parsed.root) {
    // windows will think that //x/y/z has a "root" of //x/y/
    // but strip the //?/C:/ off of //?/C:/path
    const root = path.charAt(0) === '/' && path.slice(0, 4) !== '//?/' ? '/'
      : parsed.root;
    path = path.slice(root.length);
    r += root;
    parsed = parse$3(path);
  }
  return [r, path]
};

var modeFix$1;
var hasRequiredModeFix;

function requireModeFix () {
	if (hasRequiredModeFix) return modeFix$1;
	hasRequiredModeFix = 1;
	modeFix$1 = (mode, isDir, portable) => {
	  mode &= 0o7777;

	  // in portable mode, use the minimum reasonable umask
	  // if this system creates files with 0o664 by default
	  // (as some linux distros do), then we'll write the
	  // archive with 0o644 instead.  Also, don't ever create
	  // a file that is not readable/writable by the owner.
	  if (portable) {
	    mode = (mode | 0o600) & ~0o22;
	  }

	  // if dirs are readable, then they should be listable
	  if (isDir) {
	    if (mode & 0o400) {
	      mode |= 0o100;
	    }
	    if (mode & 0o40) {
	      mode |= 0o10;
	    }
	    if (mode & 0o4) {
	      mode |= 0o1;
	    }
	  }
	  return mode
	};
	return modeFix$1;
}

const { Minipass: Minipass$1 } = minipass$1;
const Pax$1 = pax;
const Header$1 = header;
const fs$9 = require$$0$e;
const path$5 = require$$0$d;
const normPath$3 = normalizeWindowsPath;
const stripSlash$2 = stripTrailingSlashes;

const prefixPath = (path, prefix) => {
  if (!prefix) {
    return normPath$3(path)
  }
  path = normPath$3(path).replace(/^\.(\/|$)/, '');
  return stripSlash$2(prefix) + '/' + path
};

const maxReadSize = 16 * 1024 * 1024;
const PROCESS$1 = Symbol('process');
const FILE$1 = Symbol('file');
const DIRECTORY$1 = Symbol('directory');
const SYMLINK$1 = Symbol('symlink');
const HARDLINK$1 = Symbol('hardlink');
const HEADER = Symbol('header');
const READ = Symbol('read');
const LSTAT = Symbol('lstat');
const ONLSTAT = Symbol('onlstat');
const ONREAD = Symbol('onread');
const ONREADLINK = Symbol('onreadlink');
const OPENFILE = Symbol('openfile');
const ONOPENFILE = Symbol('onopenfile');
const CLOSE = Symbol('close');
const MODE = Symbol('mode');
const AWAITDRAIN = Symbol('awaitDrain');
const ONDRAIN$1 = Symbol('ondrain');
const PREFIX = Symbol('prefix');
const HAD_ERROR = Symbol('hadError');
const warner$2 = warnMixin;
const winchars = winchars$1;
const stripAbsolutePath$1 = stripAbsolutePath$2;

const modeFix = requireModeFix();

const WriteEntry$1 = warner$2(class WriteEntry extends Minipass$1 {
  constructor (p, opt) {
    opt = opt || {};
    super(opt);
    if (typeof p !== 'string') {
      throw new TypeError('path is required')
    }
    this.path = normPath$3(p);
    // suppress atime, ctime, uid, gid, uname, gname
    this.portable = !!opt.portable;
    // until node has builtin pwnam functions, this'll have to do
    this.myuid = process.getuid && process.getuid() || 0;
    this.myuser = process.env.USER || '';
    this.maxReadSize = opt.maxReadSize || maxReadSize;
    this.linkCache = opt.linkCache || new Map();
    this.statCache = opt.statCache || new Map();
    this.preservePaths = !!opt.preservePaths;
    this.cwd = normPath$3(opt.cwd || process.cwd());
    this.strict = !!opt.strict;
    this.noPax = !!opt.noPax;
    this.noMtime = !!opt.noMtime;
    this.mtime = opt.mtime || null;
    this.prefix = opt.prefix ? normPath$3(opt.prefix) : null;

    this.fd = null;
    this.blockLen = null;
    this.blockRemain = null;
    this.buf = null;
    this.offset = null;
    this.length = null;
    this.pos = null;
    this.remain = null;

    if (typeof opt.onwarn === 'function') {
      this.on('warn', opt.onwarn);
    }

    let pathWarn = false;
    if (!this.preservePaths) {
      const [root, stripped] = stripAbsolutePath$1(this.path);
      if (root) {
        this.path = stripped;
        pathWarn = root;
      }
    }

    this.win32 = !!opt.win32 || process.platform === 'win32';
    if (this.win32) {
      // force the \ to / normalization, since we might not *actually*
      // be on windows, but want \ to be considered a path separator.
      this.path = winchars.decode(this.path.replace(/\\/g, '/'));
      p = p.replace(/\\/g, '/');
    }

    this.absolute = normPath$3(opt.absolute || path$5.resolve(this.cwd, p));

    if (this.path === '') {
      this.path = './';
    }

    if (pathWarn) {
      this.warn('TAR_ENTRY_INFO', `stripping ${pathWarn} from absolute path`, {
        entry: this,
        path: pathWarn + this.path,
      });
    }

    if (this.statCache.has(this.absolute)) {
      this[ONLSTAT](this.statCache.get(this.absolute));
    } else {
      this[LSTAT]();
    }
  }

  emit (ev, ...data) {
    if (ev === 'error') {
      this[HAD_ERROR] = true;
    }
    return super.emit(ev, ...data)
  }

  [LSTAT] () {
    fs$9.lstat(this.absolute, (er, stat) => {
      if (er) {
        return this.emit('error', er)
      }
      this[ONLSTAT](stat);
    });
  }

  [ONLSTAT] (stat) {
    this.statCache.set(this.absolute, stat);
    this.stat = stat;
    if (!stat.isFile()) {
      stat.size = 0;
    }
    this.type = getType(stat);
    this.emit('stat', stat);
    this[PROCESS$1]();
  }

  [PROCESS$1] () {
    switch (this.type) {
      case 'File': return this[FILE$1]()
      case 'Directory': return this[DIRECTORY$1]()
      case 'SymbolicLink': return this[SYMLINK$1]()
      // unsupported types are ignored.
      default: return this.end()
    }
  }

  [MODE] (mode) {
    return modeFix(mode, this.type === 'Directory', this.portable)
  }

  [PREFIX] (path) {
    return prefixPath(path, this.prefix)
  }

  [HEADER] () {
    if (this.type === 'Directory' && this.portable) {
      this.noMtime = true;
    }

    this.header = new Header$1({
      path: this[PREFIX](this.path),
      // only apply the prefix to hard links.
      linkpath: this.type === 'Link' ? this[PREFIX](this.linkpath)
      : this.linkpath,
      // only the permissions and setuid/setgid/sticky bitflags
      // not the higher-order bits that specify file type
      mode: this[MODE](this.stat.mode),
      uid: this.portable ? null : this.stat.uid,
      gid: this.portable ? null : this.stat.gid,
      size: this.stat.size,
      mtime: this.noMtime ? null : this.mtime || this.stat.mtime,
      type: this.type,
      uname: this.portable ? null :
      this.stat.uid === this.myuid ? this.myuser : '',
      atime: this.portable ? null : this.stat.atime,
      ctime: this.portable ? null : this.stat.ctime,
    });

    if (this.header.encode() && !this.noPax) {
      super.write(new Pax$1({
        atime: this.portable ? null : this.header.atime,
        ctime: this.portable ? null : this.header.ctime,
        gid: this.portable ? null : this.header.gid,
        mtime: this.noMtime ? null : this.mtime || this.header.mtime,
        path: this[PREFIX](this.path),
        linkpath: this.type === 'Link' ? this[PREFIX](this.linkpath)
        : this.linkpath,
        size: this.header.size,
        uid: this.portable ? null : this.header.uid,
        uname: this.portable ? null : this.header.uname,
        dev: this.portable ? null : this.stat.dev,
        ino: this.portable ? null : this.stat.ino,
        nlink: this.portable ? null : this.stat.nlink,
      }).encode());
    }
    super.write(this.header.block);
  }

  [DIRECTORY$1] () {
    if (this.path.slice(-1) !== '/') {
      this.path += '/';
    }
    this.stat.size = 0;
    this[HEADER]();
    this.end();
  }

  [SYMLINK$1] () {
    fs$9.readlink(this.absolute, (er, linkpath) => {
      if (er) {
        return this.emit('error', er)
      }
      this[ONREADLINK](linkpath);
    });
  }

  [ONREADLINK] (linkpath) {
    this.linkpath = normPath$3(linkpath);
    this[HEADER]();
    this.end();
  }

  [HARDLINK$1] (linkpath) {
    this.type = 'Link';
    this.linkpath = normPath$3(path$5.relative(this.cwd, linkpath));
    this.stat.size = 0;
    this[HEADER]();
    this.end();
  }

  [FILE$1] () {
    if (this.stat.nlink > 1) {
      const linkKey = this.stat.dev + ':' + this.stat.ino;
      if (this.linkCache.has(linkKey)) {
        const linkpath = this.linkCache.get(linkKey);
        if (linkpath.indexOf(this.cwd) === 0) {
          return this[HARDLINK$1](linkpath)
        }
      }
      this.linkCache.set(linkKey, this.absolute);
    }

    this[HEADER]();
    if (this.stat.size === 0) {
      return this.end()
    }

    this[OPENFILE]();
  }

  [OPENFILE] () {
    fs$9.open(this.absolute, 'r', (er, fd) => {
      if (er) {
        return this.emit('error', er)
      }
      this[ONOPENFILE](fd);
    });
  }

  [ONOPENFILE] (fd) {
    this.fd = fd;
    if (this[HAD_ERROR]) {
      return this[CLOSE]()
    }

    this.blockLen = 512 * Math.ceil(this.stat.size / 512);
    this.blockRemain = this.blockLen;
    const bufLen = Math.min(this.blockLen, this.maxReadSize);
    this.buf = Buffer.allocUnsafe(bufLen);
    this.offset = 0;
    this.pos = 0;
    this.remain = this.stat.size;
    this.length = this.buf.length;
    this[READ]();
  }

  [READ] () {
    const { fd, buf, offset, length, pos } = this;
    fs$9.read(fd, buf, offset, length, pos, (er, bytesRead) => {
      if (er) {
        // ignoring the error from close(2) is a bad practice, but at
        // this point we already have an error, don't need another one
        return this[CLOSE](() => this.emit('error', er))
      }
      this[ONREAD](bytesRead);
    });
  }

  [CLOSE] (cb) {
    fs$9.close(this.fd, cb);
  }

  [ONREAD] (bytesRead) {
    if (bytesRead <= 0 && this.remain > 0) {
      const er = new Error('encountered unexpected EOF');
      er.path = this.absolute;
      er.syscall = 'read';
      er.code = 'EOF';
      return this[CLOSE](() => this.emit('error', er))
    }

    if (bytesRead > this.remain) {
      const er = new Error('did not encounter expected EOF');
      er.path = this.absolute;
      er.syscall = 'read';
      er.code = 'EOF';
      return this[CLOSE](() => this.emit('error', er))
    }

    // null out the rest of the buffer, if we could fit the block padding
    // at the end of this loop, we've incremented bytesRead and this.remain
    // to be incremented up to the blockRemain level, as if we had expected
    // to get a null-padded file, and read it until the end.  then we will
    // decrement both remain and blockRemain by bytesRead, and know that we
    // reached the expected EOF, without any null buffer to append.
    if (bytesRead === this.remain) {
      for (let i = bytesRead; i < this.length && bytesRead < this.blockRemain; i++) {
        this.buf[i + this.offset] = 0;
        bytesRead++;
        this.remain++;
      }
    }

    const writeBuf = this.offset === 0 && bytesRead === this.buf.length ?
      this.buf : this.buf.slice(this.offset, this.offset + bytesRead);

    const flushed = this.write(writeBuf);
    if (!flushed) {
      this[AWAITDRAIN](() => this[ONDRAIN$1]());
    } else {
      this[ONDRAIN$1]();
    }
  }

  [AWAITDRAIN] (cb) {
    this.once('drain', cb);
  }

  write (writeBuf) {
    if (this.blockRemain < writeBuf.length) {
      const er = new Error('writing more data than expected');
      er.path = this.absolute;
      return this.emit('error', er)
    }
    this.remain -= writeBuf.length;
    this.blockRemain -= writeBuf.length;
    this.pos += writeBuf.length;
    this.offset += writeBuf.length;
    return super.write(writeBuf)
  }

  [ONDRAIN$1] () {
    if (!this.remain) {
      if (this.blockRemain) {
        super.write(Buffer.alloc(this.blockRemain));
      }
      return this[CLOSE](er => er ? this.emit('error', er) : this.end())
    }

    if (this.offset >= this.length) {
      // if we only have a smaller bit left to read, alloc a smaller buffer
      // otherwise, keep it the same length it was before.
      this.buf = Buffer.allocUnsafe(Math.min(this.blockRemain, this.buf.length));
      this.offset = 0;
    }
    this.length = this.buf.length - this.offset;
    this[READ]();
  }
});

let WriteEntrySync$1 = class WriteEntrySync extends WriteEntry$1 {
  [LSTAT] () {
    this[ONLSTAT](fs$9.lstatSync(this.absolute));
  }

  [SYMLINK$1] () {
    this[ONREADLINK](fs$9.readlinkSync(this.absolute));
  }

  [OPENFILE] () {
    this[ONOPENFILE](fs$9.openSync(this.absolute, 'r'));
  }

  [READ] () {
    let threw = true;
    try {
      const { fd, buf, offset, length, pos } = this;
      const bytesRead = fs$9.readSync(fd, buf, offset, length, pos);
      this[ONREAD](bytesRead);
      threw = false;
    } finally {
      // ignoring the error from close(2) is a bad practice, but at
      // this point we already have an error, don't need another one
      if (threw) {
        try {
          this[CLOSE](() => {});
        } catch (er) {}
      }
    }
  }

  [AWAITDRAIN] (cb) {
    cb();
  }

  [CLOSE] (cb) {
    fs$9.closeSync(this.fd);
    cb();
  }
};

const WriteEntryTar$1 = warner$2(class WriteEntryTar extends Minipass$1 {
  constructor (readEntry, opt) {
    opt = opt || {};
    super(opt);
    this.preservePaths = !!opt.preservePaths;
    this.portable = !!opt.portable;
    this.strict = !!opt.strict;
    this.noPax = !!opt.noPax;
    this.noMtime = !!opt.noMtime;

    this.readEntry = readEntry;
    this.type = readEntry.type;
    if (this.type === 'Directory' && this.portable) {
      this.noMtime = true;
    }

    this.prefix = opt.prefix || null;

    this.path = normPath$3(readEntry.path);
    this.mode = this[MODE](readEntry.mode);
    this.uid = this.portable ? null : readEntry.uid;
    this.gid = this.portable ? null : readEntry.gid;
    this.uname = this.portable ? null : readEntry.uname;
    this.gname = this.portable ? null : readEntry.gname;
    this.size = readEntry.size;
    this.mtime = this.noMtime ? null : opt.mtime || readEntry.mtime;
    this.atime = this.portable ? null : readEntry.atime;
    this.ctime = this.portable ? null : readEntry.ctime;
    this.linkpath = normPath$3(readEntry.linkpath);

    if (typeof opt.onwarn === 'function') {
      this.on('warn', opt.onwarn);
    }

    let pathWarn = false;
    if (!this.preservePaths) {
      const [root, stripped] = stripAbsolutePath$1(this.path);
      if (root) {
        this.path = stripped;
        pathWarn = root;
      }
    }

    this.remain = readEntry.size;
    this.blockRemain = readEntry.startBlockSize;

    this.header = new Header$1({
      path: this[PREFIX](this.path),
      linkpath: this.type === 'Link' ? this[PREFIX](this.linkpath)
      : this.linkpath,
      // only the permissions and setuid/setgid/sticky bitflags
      // not the higher-order bits that specify file type
      mode: this.mode,
      uid: this.portable ? null : this.uid,
      gid: this.portable ? null : this.gid,
      size: this.size,
      mtime: this.noMtime ? null : this.mtime,
      type: this.type,
      uname: this.portable ? null : this.uname,
      atime: this.portable ? null : this.atime,
      ctime: this.portable ? null : this.ctime,
    });

    if (pathWarn) {
      this.warn('TAR_ENTRY_INFO', `stripping ${pathWarn} from absolute path`, {
        entry: this,
        path: pathWarn + this.path,
      });
    }

    if (this.header.encode() && !this.noPax) {
      super.write(new Pax$1({
        atime: this.portable ? null : this.atime,
        ctime: this.portable ? null : this.ctime,
        gid: this.portable ? null : this.gid,
        mtime: this.noMtime ? null : this.mtime,
        path: this[PREFIX](this.path),
        linkpath: this.type === 'Link' ? this[PREFIX](this.linkpath)
        : this.linkpath,
        size: this.size,
        uid: this.portable ? null : this.uid,
        uname: this.portable ? null : this.uname,
        dev: this.portable ? null : this.readEntry.dev,
        ino: this.portable ? null : this.readEntry.ino,
        nlink: this.portable ? null : this.readEntry.nlink,
      }).encode());
    }

    super.write(this.header.block);
    readEntry.pipe(this);
  }

  [PREFIX] (path) {
    return prefixPath(path, this.prefix)
  }

  [MODE] (mode) {
    return modeFix(mode, this.type === 'Directory', this.portable)
  }

  write (data) {
    const writeLen = data.length;
    if (writeLen > this.blockRemain) {
      throw new Error('writing more to entry than is appropriate')
    }
    this.blockRemain -= writeLen;
    return super.write(data)
  }

  end () {
    if (this.blockRemain) {
      super.write(Buffer.alloc(this.blockRemain));
    }
    return super.end()
  }
});

WriteEntry$1.Sync = WriteEntrySync$1;
WriteEntry$1.Tar = WriteEntryTar$1;

const getType = stat =>
  stat.isFile() ? 'File'
  : stat.isDirectory() ? 'Directory'
  : stat.isSymbolicLink() ? 'SymbolicLink'
  : 'Unsupported';

var writeEntry = WriteEntry$1;

// A readable tar stream creator
// Technically, this is a transform stream that you write paths into,
// and tar format comes out of.
// The `add()` method is like `write()` but returns this,
// and end() return `this` as well, so you can
// do `new Pack(opt).add('files').add('dir').end().pipe(output)
// You could also do something like:
// streamOfPaths().pipe(new Pack()).pipe(new fs.WriteStream('out.tar'))

class PackJob {
  constructor (path, absolute) {
    this.path = path || './';
    this.absolute = absolute;
    this.entry = null;
    this.stat = null;
    this.readdir = null;
    this.pending = false;
    this.ignore = false;
    this.piped = false;
  }
}

const { Minipass } = minipass$1;
const zlib$3 = minizlib;
const ReadEntry = readEntry;
const WriteEntry = writeEntry;
const WriteEntrySync = WriteEntry.Sync;
const WriteEntryTar = WriteEntry.Tar;
const Yallist$1 = yallist;
const EOF = Buffer.alloc(1024);
const ONSTAT = Symbol('onStat');
const ENDED$2 = Symbol('ended');
const QUEUE$1 = Symbol('queue');
const CURRENT = Symbol('current');
const PROCESS = Symbol('process');
const PROCESSING = Symbol('processing');
const PROCESSJOB = Symbol('processJob');
const JOBS = Symbol('jobs');
const JOBDONE = Symbol('jobDone');
const ADDFSENTRY = Symbol('addFSEntry');
const ADDTARENTRY = Symbol('addTarEntry');
const STAT = Symbol('stat');
const READDIR = Symbol('readdir');
const ONREADDIR = Symbol('onreaddir');
const PIPE = Symbol('pipe');
const ENTRY = Symbol('entry');
const ENTRYOPT = Symbol('entryOpt');
const WRITEENTRYCLASS = Symbol('writeEntryClass');
const WRITE = Symbol('write');
const ONDRAIN = Symbol('ondrain');

const fs$8 = require$$0$e;
const path$4 = require$$0$d;
const warner$1 = warnMixin;
const normPath$2 = normalizeWindowsPath;

const Pack = warner$1(class Pack extends Minipass {
  constructor (opt) {
    super(opt);
    opt = opt || Object.create(null);
    this.opt = opt;
    this.file = opt.file || '';
    this.cwd = opt.cwd || process.cwd();
    this.maxReadSize = opt.maxReadSize;
    this.preservePaths = !!opt.preservePaths;
    this.strict = !!opt.strict;
    this.noPax = !!opt.noPax;
    this.prefix = normPath$2(opt.prefix || '');
    this.linkCache = opt.linkCache || new Map();
    this.statCache = opt.statCache || new Map();
    this.readdirCache = opt.readdirCache || new Map();

    this[WRITEENTRYCLASS] = WriteEntry;
    if (typeof opt.onwarn === 'function') {
      this.on('warn', opt.onwarn);
    }

    this.portable = !!opt.portable;
    this.zip = null;

    if (opt.gzip || opt.brotli) {
      if (opt.gzip && opt.brotli) {
        throw new TypeError('gzip and brotli are mutually exclusive')
      }
      if (opt.gzip) {
        if (typeof opt.gzip !== 'object') {
          opt.gzip = {};
        }
        if (this.portable) {
          opt.gzip.portable = true;
        }
        this.zip = new zlib$3.Gzip(opt.gzip);
      }
      if (opt.brotli) {
        if (typeof opt.brotli !== 'object') {
          opt.brotli = {};
        }
        this.zip = new zlib$3.BrotliCompress(opt.brotli);
      }
      this.zip.on('data', chunk => super.write(chunk));
      this.zip.on('end', _ => super.end());
      this.zip.on('drain', _ => this[ONDRAIN]());
      this.on('resume', _ => this.zip.resume());
    } else {
      this.on('drain', this[ONDRAIN]);
    }

    this.noDirRecurse = !!opt.noDirRecurse;
    this.follow = !!opt.follow;
    this.noMtime = !!opt.noMtime;
    this.mtime = opt.mtime || null;

    this.filter = typeof opt.filter === 'function' ? opt.filter : _ => true;

    this[QUEUE$1] = new Yallist$1();
    this[JOBS] = 0;
    this.jobs = +opt.jobs || 4;
    this[PROCESSING] = false;
    this[ENDED$2] = false;
  }

  [WRITE] (chunk) {
    return super.write(chunk)
  }

  add (path) {
    this.write(path);
    return this
  }

  end (path) {
    if (path) {
      this.write(path);
    }
    this[ENDED$2] = true;
    this[PROCESS]();
    return this
  }

  write (path) {
    if (this[ENDED$2]) {
      throw new Error('write after end')
    }

    if (path instanceof ReadEntry) {
      this[ADDTARENTRY](path);
    } else {
      this[ADDFSENTRY](path);
    }
    return this.flowing
  }

  [ADDTARENTRY] (p) {
    const absolute = normPath$2(path$4.resolve(this.cwd, p.path));
    // in this case, we don't have to wait for the stat
    if (!this.filter(p.path, p)) {
      p.resume();
    } else {
      const job = new PackJob(p.path, absolute, false);
      job.entry = new WriteEntryTar(p, this[ENTRYOPT](job));
      job.entry.on('end', _ => this[JOBDONE](job));
      this[JOBS] += 1;
      this[QUEUE$1].push(job);
    }

    this[PROCESS]();
  }

  [ADDFSENTRY] (p) {
    const absolute = normPath$2(path$4.resolve(this.cwd, p));
    this[QUEUE$1].push(new PackJob(p, absolute));
    this[PROCESS]();
  }

  [STAT] (job) {
    job.pending = true;
    this[JOBS] += 1;
    const stat = this.follow ? 'stat' : 'lstat';
    fs$8[stat](job.absolute, (er, stat) => {
      job.pending = false;
      this[JOBS] -= 1;
      if (er) {
        this.emit('error', er);
      } else {
        this[ONSTAT](job, stat);
      }
    });
  }

  [ONSTAT] (job, stat) {
    this.statCache.set(job.absolute, stat);
    job.stat = stat;

    // now we have the stat, we can filter it.
    if (!this.filter(job.path, stat)) {
      job.ignore = true;
    }

    this[PROCESS]();
  }

  [READDIR] (job) {
    job.pending = true;
    this[JOBS] += 1;
    fs$8.readdir(job.absolute, (er, entries) => {
      job.pending = false;
      this[JOBS] -= 1;
      if (er) {
        return this.emit('error', er)
      }
      this[ONREADDIR](job, entries);
    });
  }

  [ONREADDIR] (job, entries) {
    this.readdirCache.set(job.absolute, entries);
    job.readdir = entries;
    this[PROCESS]();
  }

  [PROCESS] () {
    if (this[PROCESSING]) {
      return
    }

    this[PROCESSING] = true;
    for (let w = this[QUEUE$1].head;
      w !== null && this[JOBS] < this.jobs;
      w = w.next) {
      this[PROCESSJOB](w.value);
      if (w.value.ignore) {
        const p = w.next;
        this[QUEUE$1].removeNode(w);
        w.next = p;
      }
    }

    this[PROCESSING] = false;

    if (this[ENDED$2] && !this[QUEUE$1].length && this[JOBS] === 0) {
      if (this.zip) {
        this.zip.end(EOF);
      } else {
        super.write(EOF);
        super.end();
      }
    }
  }

  get [CURRENT] () {
    return this[QUEUE$1] && this[QUEUE$1].head && this[QUEUE$1].head.value
  }

  [JOBDONE] (job) {
    this[QUEUE$1].shift();
    this[JOBS] -= 1;
    this[PROCESS]();
  }

  [PROCESSJOB] (job) {
    if (job.pending) {
      return
    }

    if (job.entry) {
      if (job === this[CURRENT] && !job.piped) {
        this[PIPE](job);
      }
      return
    }

    if (!job.stat) {
      if (this.statCache.has(job.absolute)) {
        this[ONSTAT](job, this.statCache.get(job.absolute));
      } else {
        this[STAT](job);
      }
    }
    if (!job.stat) {
      return
    }

    // filtered out!
    if (job.ignore) {
      return
    }

    if (!this.noDirRecurse && job.stat.isDirectory() && !job.readdir) {
      if (this.readdirCache.has(job.absolute)) {
        this[ONREADDIR](job, this.readdirCache.get(job.absolute));
      } else {
        this[READDIR](job);
      }
      if (!job.readdir) {
        return
      }
    }

    // we know it doesn't have an entry, because that got checked above
    job.entry = this[ENTRY](job);
    if (!job.entry) {
      job.ignore = true;
      return
    }

    if (job === this[CURRENT] && !job.piped) {
      this[PIPE](job);
    }
  }

  [ENTRYOPT] (job) {
    return {
      onwarn: (code, msg, data) => this.warn(code, msg, data),
      noPax: this.noPax,
      cwd: this.cwd,
      absolute: job.absolute,
      preservePaths: this.preservePaths,
      maxReadSize: this.maxReadSize,
      strict: this.strict,
      portable: this.portable,
      linkCache: this.linkCache,
      statCache: this.statCache,
      noMtime: this.noMtime,
      mtime: this.mtime,
      prefix: this.prefix,
    }
  }

  [ENTRY] (job) {
    this[JOBS] += 1;
    try {
      return new this[WRITEENTRYCLASS](job.path, this[ENTRYOPT](job))
        .on('end', () => this[JOBDONE](job))
        .on('error', er => this.emit('error', er))
    } catch (er) {
      this.emit('error', er);
    }
  }

  [ONDRAIN] () {
    if (this[CURRENT] && this[CURRENT].entry) {
      this[CURRENT].entry.resume();
    }
  }

  // like .pipe() but using super, because our write() is special
  [PIPE] (job) {
    job.piped = true;

    if (job.readdir) {
      job.readdir.forEach(entry => {
        const p = job.path;
        const base = p === './' ? '' : p.replace(/\/*$/, '/');
        this[ADDFSENTRY](base + entry);
      });
    }

    const source = job.entry;
    const zip = this.zip;

    if (zip) {
      source.on('data', chunk => {
        if (!zip.write(chunk)) {
          source.pause();
        }
      });
    } else {
      source.on('data', chunk => {
        if (!super.write(chunk)) {
          source.pause();
        }
      });
    }
  }

  pause () {
    if (this.zip) {
      this.zip.pause();
    }
    return super.pause()
  }
});

class PackSync extends Pack {
  constructor (opt) {
    super(opt);
    this[WRITEENTRYCLASS] = WriteEntrySync;
  }

  // pause/resume are no-ops in sync streams.
  pause () {}
  resume () {}

  [STAT] (job) {
    const stat = this.follow ? 'statSync' : 'lstatSync';
    this[ONSTAT](job, fs$8[stat](job.absolute));
  }

  [READDIR] (job, stat) {
    this[ONREADDIR](job, fs$8.readdirSync(job.absolute));
  }

  // gotta get it all in this tick
  [PIPE] (job) {
    const source = job.entry;
    const zip = this.zip;

    if (job.readdir) {
      job.readdir.forEach(entry => {
        const p = job.path;
        const base = p === './' ? '' : p.replace(/\/*$/, '/');
        this[ADDFSENTRY](base + entry);
      });
    }

    if (zip) {
      source.on('data', chunk => {
        zip.write(chunk);
      });
    } else {
      source.on('data', chunk => {
        super[WRITE](chunk);
      });
    }
  }
}

Pack.Sync = PackSync;

var fsMinipass = {};

const MiniPass = minipass;
const EE$2 = require$$0$9.EventEmitter;
const fs$7 = require$$0$e;

let writev = fs$7.writev;
/* istanbul ignore next */
if (!writev) {
  // This entire block can be removed if support for earlier than Node.js
  // 12.9.0 is not needed.
  const binding = process.binding('fs');
  const FSReqWrap = binding.FSReqWrap || binding.FSReqCallback;

  writev = (fd, iovec, pos, cb) => {
    const done = (er, bw) => cb(er, bw, iovec);
    const req = new FSReqWrap();
    req.oncomplete = done;
    binding.writeBuffers(fd, iovec, pos, req);
  };
}

const _autoClose = Symbol('_autoClose');
const _close = Symbol('_close');
const _ended = Symbol('_ended');
const _fd = Symbol('_fd');
const _finished = Symbol('_finished');
const _flags = Symbol('_flags');
const _flush = Symbol('_flush');
const _handleChunk = Symbol('_handleChunk');
const _makeBuf = Symbol('_makeBuf');
const _mode = Symbol('_mode');
const _needDrain = Symbol('_needDrain');
const _onerror = Symbol('_onerror');
const _onopen = Symbol('_onopen');
const _onread = Symbol('_onread');
const _onwrite = Symbol('_onwrite');
const _open = Symbol('_open');
const _path = Symbol('_path');
const _pos = Symbol('_pos');
const _queue = Symbol('_queue');
const _read = Symbol('_read');
const _readSize = Symbol('_readSize');
const _reading = Symbol('_reading');
const _remain = Symbol('_remain');
const _size = Symbol('_size');
const _write = Symbol('_write');
const _writing = Symbol('_writing');
const _defaultFlag = Symbol('_defaultFlag');
const _errored = Symbol('_errored');

class ReadStream extends MiniPass {
  constructor (path, opt) {
    opt = opt || {};
    super(opt);

    this.readable = true;
    this.writable = false;

    if (typeof path !== 'string')
      throw new TypeError('path must be a string')

    this[_errored] = false;
    this[_fd] = typeof opt.fd === 'number' ? opt.fd : null;
    this[_path] = path;
    this[_readSize] = opt.readSize || 16*1024*1024;
    this[_reading] = false;
    this[_size] = typeof opt.size === 'number' ? opt.size : Infinity;
    this[_remain] = this[_size];
    this[_autoClose] = typeof opt.autoClose === 'boolean' ?
      opt.autoClose : true;

    if (typeof this[_fd] === 'number')
      this[_read]();
    else
      this[_open]();
  }

  get fd () { return this[_fd] }
  get path () { return this[_path] }

  write () {
    throw new TypeError('this is a readable stream')
  }

  end () {
    throw new TypeError('this is a readable stream')
  }

  [_open] () {
    fs$7.open(this[_path], 'r', (er, fd) => this[_onopen](er, fd));
  }

  [_onopen] (er, fd) {
    if (er)
      this[_onerror](er);
    else {
      this[_fd] = fd;
      this.emit('open', fd);
      this[_read]();
    }
  }

  [_makeBuf] () {
    return Buffer.allocUnsafe(Math.min(this[_readSize], this[_remain]))
  }

  [_read] () {
    if (!this[_reading]) {
      this[_reading] = true;
      const buf = this[_makeBuf]();
      /* istanbul ignore if */
      if (buf.length === 0)
        return process.nextTick(() => this[_onread](null, 0, buf))
      fs$7.read(this[_fd], buf, 0, buf.length, null, (er, br, buf) =>
        this[_onread](er, br, buf));
    }
  }

  [_onread] (er, br, buf) {
    this[_reading] = false;
    if (er)
      this[_onerror](er);
    else if (this[_handleChunk](br, buf))
      this[_read]();
  }

  [_close] () {
    if (this[_autoClose] && typeof this[_fd] === 'number') {
      const fd = this[_fd];
      this[_fd] = null;
      fs$7.close(fd, er => er ? this.emit('error', er) : this.emit('close'));
    }
  }

  [_onerror] (er) {
    this[_reading] = true;
    this[_close]();
    this.emit('error', er);
  }

  [_handleChunk] (br, buf) {
    let ret = false;
    // no effect if infinite
    this[_remain] -= br;
    if (br > 0)
      ret = super.write(br < buf.length ? buf.slice(0, br) : buf);

    if (br === 0 || this[_remain] <= 0) {
      ret = false;
      this[_close]();
      super.end();
    }

    return ret
  }

  emit (ev, data) {
    switch (ev) {
      case 'prefinish':
      case 'finish':
        break

      case 'drain':
        if (typeof this[_fd] === 'number')
          this[_read]();
        break

      case 'error':
        if (this[_errored])
          return
        this[_errored] = true;
        return super.emit(ev, data)

      default:
        return super.emit(ev, data)
    }
  }
}

class ReadStreamSync extends ReadStream {
  [_open] () {
    let threw = true;
    try {
      this[_onopen](null, fs$7.openSync(this[_path], 'r'));
      threw = false;
    } finally {
      if (threw)
        this[_close]();
    }
  }

  [_read] () {
    let threw = true;
    try {
      if (!this[_reading]) {
        this[_reading] = true;
        do {
          const buf = this[_makeBuf]();
          /* istanbul ignore next */
          const br = buf.length === 0 ? 0
            : fs$7.readSync(this[_fd], buf, 0, buf.length, null);
          if (!this[_handleChunk](br, buf))
            break
        } while (true)
        this[_reading] = false;
      }
      threw = false;
    } finally {
      if (threw)
        this[_close]();
    }
  }

  [_close] () {
    if (this[_autoClose] && typeof this[_fd] === 'number') {
      const fd = this[_fd];
      this[_fd] = null;
      fs$7.closeSync(fd);
      this.emit('close');
    }
  }
}

class WriteStream extends EE$2 {
  constructor (path, opt) {
    opt = opt || {};
    super(opt);
    this.readable = false;
    this.writable = true;
    this[_errored] = false;
    this[_writing] = false;
    this[_ended] = false;
    this[_needDrain] = false;
    this[_queue] = [];
    this[_path] = path;
    this[_fd] = typeof opt.fd === 'number' ? opt.fd : null;
    this[_mode] = opt.mode === undefined ? 0o666 : opt.mode;
    this[_pos] = typeof opt.start === 'number' ? opt.start : null;
    this[_autoClose] = typeof opt.autoClose === 'boolean' ?
      opt.autoClose : true;

    // truncating makes no sense when writing into the middle
    const defaultFlag = this[_pos] !== null ? 'r+' : 'w';
    this[_defaultFlag] = opt.flags === undefined;
    this[_flags] = this[_defaultFlag] ? defaultFlag : opt.flags;

    if (this[_fd] === null)
      this[_open]();
  }

  emit (ev, data) {
    if (ev === 'error') {
      if (this[_errored])
        return
      this[_errored] = true;
    }
    return super.emit(ev, data)
  }


  get fd () { return this[_fd] }
  get path () { return this[_path] }

  [_onerror] (er) {
    this[_close]();
    this[_writing] = true;
    this.emit('error', er);
  }

  [_open] () {
    fs$7.open(this[_path], this[_flags], this[_mode],
      (er, fd) => this[_onopen](er, fd));
  }

  [_onopen] (er, fd) {
    if (this[_defaultFlag] &&
        this[_flags] === 'r+' &&
        er && er.code === 'ENOENT') {
      this[_flags] = 'w';
      this[_open]();
    } else if (er)
      this[_onerror](er);
    else {
      this[_fd] = fd;
      this.emit('open', fd);
      this[_flush]();
    }
  }

  end (buf, enc) {
    if (buf)
      this.write(buf, enc);

    this[_ended] = true;

    // synthetic after-write logic, where drain/finish live
    if (!this[_writing] && !this[_queue].length &&
        typeof this[_fd] === 'number')
      this[_onwrite](null, 0);
    return this
  }

  write (buf, enc) {
    if (typeof buf === 'string')
      buf = Buffer.from(buf, enc);

    if (this[_ended]) {
      this.emit('error', new Error('write() after end()'));
      return false
    }

    if (this[_fd] === null || this[_writing] || this[_queue].length) {
      this[_queue].push(buf);
      this[_needDrain] = true;
      return false
    }

    this[_writing] = true;
    this[_write](buf);
    return true
  }

  [_write] (buf) {
    fs$7.write(this[_fd], buf, 0, buf.length, this[_pos], (er, bw) =>
      this[_onwrite](er, bw));
  }

  [_onwrite] (er, bw) {
    if (er)
      this[_onerror](er);
    else {
      if (this[_pos] !== null)
        this[_pos] += bw;
      if (this[_queue].length)
        this[_flush]();
      else {
        this[_writing] = false;

        if (this[_ended] && !this[_finished]) {
          this[_finished] = true;
          this[_close]();
          this.emit('finish');
        } else if (this[_needDrain]) {
          this[_needDrain] = false;
          this.emit('drain');
        }
      }
    }
  }

  [_flush] () {
    if (this[_queue].length === 0) {
      if (this[_ended])
        this[_onwrite](null, 0);
    } else if (this[_queue].length === 1)
      this[_write](this[_queue].pop());
    else {
      const iovec = this[_queue];
      this[_queue] = [];
      writev(this[_fd], iovec, this[_pos],
        (er, bw) => this[_onwrite](er, bw));
    }
  }

  [_close] () {
    if (this[_autoClose] && typeof this[_fd] === 'number') {
      const fd = this[_fd];
      this[_fd] = null;
      fs$7.close(fd, er => er ? this.emit('error', er) : this.emit('close'));
    }
  }
}

class WriteStreamSync extends WriteStream {
  [_open] () {
    let fd;
    // only wrap in a try{} block if we know we'll retry, to avoid
    // the rethrow obscuring the error's source frame in most cases.
    if (this[_defaultFlag] && this[_flags] === 'r+') {
      try {
        fd = fs$7.openSync(this[_path], this[_flags], this[_mode]);
      } catch (er) {
        if (er.code === 'ENOENT') {
          this[_flags] = 'w';
          return this[_open]()
        } else
          throw er
      }
    } else
      fd = fs$7.openSync(this[_path], this[_flags], this[_mode]);

    this[_onopen](null, fd);
  }

  [_close] () {
    if (this[_autoClose] && typeof this[_fd] === 'number') {
      const fd = this[_fd];
      this[_fd] = null;
      fs$7.closeSync(fd);
      this.emit('close');
    }
  }

  [_write] (buf) {
    // throw the original, but try to close if it fails
    let threw = true;
    try {
      this[_onwrite](null,
        fs$7.writeSync(this[_fd], buf, 0, buf.length, this[_pos]));
      threw = false;
    } finally {
      if (threw)
        try { this[_close](); } catch (_) {}
    }
  }
}

fsMinipass.ReadStream = ReadStream;
fsMinipass.ReadStreamSync = ReadStreamSync;

fsMinipass.WriteStream = WriteStream;
fsMinipass.WriteStreamSync = WriteStreamSync;

// this[BUFFER] is the remainder of a chunk if we're waiting for
// the full 512 bytes of a header to come in.  We will Buffer.concat()
// it to the next write(), which is a mem copy, but a small one.
//
// this[QUEUE] is a Yallist of entries that haven't been emitted
// yet this can only get filled up if the user keeps write()ing after
// a write() returns false, or does a write() with more than one entry
//
// We don't buffer chunks, we always parse them and either create an
// entry, or push it into the active entry.  The ReadEntry class knows
// to throw data away if .ignore=true
//
// Shift entry off the buffer when it emits 'end', and emit 'entry' for
// the next one in the list.
//
// At any time, we're pushing body chunks into the entry at WRITEENTRY,
// and waiting for 'end' on the entry at READENTRY
//
// ignored entries get .resume() called on them straight away

const warner = warnMixin;
const Header = header;
const EE$1 = require$$0$9;
const Yallist = yallist;
const maxMetaEntrySize = 1024 * 1024;
const Entry = readEntry;
const Pax = pax;
const zlib$2 = minizlib;
const { nextTick } = require$$9;

const gzipHeader = Buffer.from([0x1f, 0x8b]);
const STATE = Symbol('state');
const WRITEENTRY = Symbol('writeEntry');
const READENTRY = Symbol('readEntry');
const NEXTENTRY = Symbol('nextEntry');
const PROCESSENTRY = Symbol('processEntry');
const EX = Symbol('extendedHeader');
const GEX = Symbol('globalExtendedHeader');
const META = Symbol('meta');
const EMITMETA = Symbol('emitMeta');
const BUFFER = Symbol('buffer');
const QUEUE = Symbol('queue');
const ENDED$1 = Symbol('ended');
const EMITTEDEND = Symbol('emittedEnd');
const EMIT = Symbol('emit');
const UNZIP = Symbol('unzip');
const CONSUMECHUNK = Symbol('consumeChunk');
const CONSUMECHUNKSUB = Symbol('consumeChunkSub');
const CONSUMEBODY = Symbol('consumeBody');
const CONSUMEMETA = Symbol('consumeMeta');
const CONSUMEHEADER = Symbol('consumeHeader');
const CONSUMING = Symbol('consuming');
const BUFFERCONCAT = Symbol('bufferConcat');
const MAYBEEND = Symbol('maybeEnd');
const WRITING = Symbol('writing');
const ABORTED = Symbol('aborted');
const DONE = Symbol('onDone');
const SAW_VALID_ENTRY = Symbol('sawValidEntry');
const SAW_NULL_BLOCK = Symbol('sawNullBlock');
const SAW_EOF = Symbol('sawEOF');
const CLOSESTREAM = Symbol('closeStream');

const noop$1 = _ => true;

var parse$2 = warner(class Parser extends EE$1 {
  constructor (opt) {
    opt = opt || {};
    super(opt);

    this.file = opt.file || '';

    // set to boolean false when an entry starts.  1024 bytes of \0
    // is technically a valid tarball, albeit a boring one.
    this[SAW_VALID_ENTRY] = null;

    // these BADARCHIVE errors can't be detected early. listen on DONE.
    this.on(DONE, _ => {
      if (this[STATE] === 'begin' || this[SAW_VALID_ENTRY] === false) {
        // either less than 1 block of data, or all entries were invalid.
        // Either way, probably not even a tarball.
        this.warn('TAR_BAD_ARCHIVE', 'Unrecognized archive format');
      }
    });

    if (opt.ondone) {
      this.on(DONE, opt.ondone);
    } else {
      this.on(DONE, _ => {
        this.emit('prefinish');
        this.emit('finish');
        this.emit('end');
      });
    }

    this.strict = !!opt.strict;
    this.maxMetaEntrySize = opt.maxMetaEntrySize || maxMetaEntrySize;
    this.filter = typeof opt.filter === 'function' ? opt.filter : noop$1;
    // Unlike gzip, brotli doesn't have any magic bytes to identify it
    // Users need to explicitly tell us they're extracting a brotli file
    // Or we infer from the file extension
    const isTBR = (opt.file && (
        opt.file.endsWith('.tar.br') || opt.file.endsWith('.tbr')));
    // if it's a tbr file it MIGHT be brotli, but we don't know until
    // we look at it and verify it's not a valid tar file.
    this.brotli = !opt.gzip && opt.brotli !== undefined ? opt.brotli
      : isTBR ? undefined
      : false;

    // have to set this so that streams are ok piping into it
    this.writable = true;
    this.readable = false;

    this[QUEUE] = new Yallist();
    this[BUFFER] = null;
    this[READENTRY] = null;
    this[WRITEENTRY] = null;
    this[STATE] = 'begin';
    this[META] = '';
    this[EX] = null;
    this[GEX] = null;
    this[ENDED$1] = false;
    this[UNZIP] = null;
    this[ABORTED] = false;
    this[SAW_NULL_BLOCK] = false;
    this[SAW_EOF] = false;

    this.on('end', () => this[CLOSESTREAM]());

    if (typeof opt.onwarn === 'function') {
      this.on('warn', opt.onwarn);
    }
    if (typeof opt.onentry === 'function') {
      this.on('entry', opt.onentry);
    }
  }

  [CONSUMEHEADER] (chunk, position) {
    if (this[SAW_VALID_ENTRY] === null) {
      this[SAW_VALID_ENTRY] = false;
    }
    let header;
    try {
      header = new Header(chunk, position, this[EX], this[GEX]);
    } catch (er) {
      return this.warn('TAR_ENTRY_INVALID', er)
    }

    if (header.nullBlock) {
      if (this[SAW_NULL_BLOCK]) {
        this[SAW_EOF] = true;
        // ending an archive with no entries.  pointless, but legal.
        if (this[STATE] === 'begin') {
          this[STATE] = 'header';
        }
        this[EMIT]('eof');
      } else {
        this[SAW_NULL_BLOCK] = true;
        this[EMIT]('nullBlock');
      }
    } else {
      this[SAW_NULL_BLOCK] = false;
      if (!header.cksumValid) {
        this.warn('TAR_ENTRY_INVALID', 'checksum failure', { header });
      } else if (!header.path) {
        this.warn('TAR_ENTRY_INVALID', 'path is required', { header });
      } else {
        const type = header.type;
        if (/^(Symbolic)?Link$/.test(type) && !header.linkpath) {
          this.warn('TAR_ENTRY_INVALID', 'linkpath required', { header });
        } else if (!/^(Symbolic)?Link$/.test(type) && header.linkpath) {
          this.warn('TAR_ENTRY_INVALID', 'linkpath forbidden', { header });
        } else {
          const entry = this[WRITEENTRY] = new Entry(header, this[EX], this[GEX]);

          // we do this for meta & ignored entries as well, because they
          // are still valid tar, or else we wouldn't know to ignore them
          if (!this[SAW_VALID_ENTRY]) {
            if (entry.remain) {
              // this might be the one!
              const onend = () => {
                if (!entry.invalid) {
                  this[SAW_VALID_ENTRY] = true;
                }
              };
              entry.on('end', onend);
            } else {
              this[SAW_VALID_ENTRY] = true;
            }
          }

          if (entry.meta) {
            if (entry.size > this.maxMetaEntrySize) {
              entry.ignore = true;
              this[EMIT]('ignoredEntry', entry);
              this[STATE] = 'ignore';
              entry.resume();
            } else if (entry.size > 0) {
              this[META] = '';
              entry.on('data', c => this[META] += c);
              this[STATE] = 'meta';
            }
          } else {
            this[EX] = null;
            entry.ignore = entry.ignore || !this.filter(entry.path, entry);

            if (entry.ignore) {
              // probably valid, just not something we care about
              this[EMIT]('ignoredEntry', entry);
              this[STATE] = entry.remain ? 'ignore' : 'header';
              entry.resume();
            } else {
              if (entry.remain) {
                this[STATE] = 'body';
              } else {
                this[STATE] = 'header';
                entry.end();
              }

              if (!this[READENTRY]) {
                this[QUEUE].push(entry);
                this[NEXTENTRY]();
              } else {
                this[QUEUE].push(entry);
              }
            }
          }
        }
      }
    }
  }

  [CLOSESTREAM] () {
    nextTick(() => this.emit('close'));
  }

  [PROCESSENTRY] (entry) {
    let go = true;

    if (!entry) {
      this[READENTRY] = null;
      go = false;
    } else if (Array.isArray(entry)) {
      this.emit.apply(this, entry);
    } else {
      this[READENTRY] = entry;
      this.emit('entry', entry);
      if (!entry.emittedEnd) {
        entry.on('end', _ => this[NEXTENTRY]());
        go = false;
      }
    }

    return go
  }

  [NEXTENTRY] () {
    do {} while (this[PROCESSENTRY](this[QUEUE].shift()))

    if (!this[QUEUE].length) {
      // At this point, there's nothing in the queue, but we may have an
      // entry which is being consumed (readEntry).
      // If we don't, then we definitely can handle more data.
      // If we do, and either it's flowing, or it has never had any data
      // written to it, then it needs more.
      // The only other possibility is that it has returned false from a
      // write() call, so we wait for the next drain to continue.
      const re = this[READENTRY];
      const drainNow = !re || re.flowing || re.size === re.remain;
      if (drainNow) {
        if (!this[WRITING]) {
          this.emit('drain');
        }
      } else {
        re.once('drain', _ => this.emit('drain'));
      }
    }
  }

  [CONSUMEBODY] (chunk, position) {
    // write up to but no  more than writeEntry.blockRemain
    const entry = this[WRITEENTRY];
    const br = entry.blockRemain;
    const c = (br >= chunk.length && position === 0) ? chunk
      : chunk.slice(position, position + br);

    entry.write(c);

    if (!entry.blockRemain) {
      this[STATE] = 'header';
      this[WRITEENTRY] = null;
      entry.end();
    }

    return c.length
  }

  [CONSUMEMETA] (chunk, position) {
    const entry = this[WRITEENTRY];
    const ret = this[CONSUMEBODY](chunk, position);

    // if we finished, then the entry is reset
    if (!this[WRITEENTRY]) {
      this[EMITMETA](entry);
    }

    return ret
  }

  [EMIT] (ev, data, extra) {
    if (!this[QUEUE].length && !this[READENTRY]) {
      this.emit(ev, data, extra);
    } else {
      this[QUEUE].push([ev, data, extra]);
    }
  }

  [EMITMETA] (entry) {
    this[EMIT]('meta', this[META]);
    switch (entry.type) {
      case 'ExtendedHeader':
      case 'OldExtendedHeader':
        this[EX] = Pax.parse(this[META], this[EX], false);
        break

      case 'GlobalExtendedHeader':
        this[GEX] = Pax.parse(this[META], this[GEX], true);
        break

      case 'NextFileHasLongPath':
      case 'OldGnuLongPath':
        this[EX] = this[EX] || Object.create(null);
        this[EX].path = this[META].replace(/\0.*/, '');
        break

      case 'NextFileHasLongLinkpath':
        this[EX] = this[EX] || Object.create(null);
        this[EX].linkpath = this[META].replace(/\0.*/, '');
        break

      /* istanbul ignore next */
      default: throw new Error('unknown meta: ' + entry.type)
    }
  }

  abort (error) {
    this[ABORTED] = true;
    this.emit('abort', error);
    // always throws, even in non-strict mode
    this.warn('TAR_ABORT', error, { recoverable: false });
  }

  write (chunk) {
    if (this[ABORTED]) {
      return
    }

    // first write, might be gzipped
    const needSniff = this[UNZIP] === null ||
      this.brotli === undefined && this[UNZIP] === false;
    if (needSniff && chunk) {
      if (this[BUFFER]) {
        chunk = Buffer.concat([this[BUFFER], chunk]);
        this[BUFFER] = null;
      }
      if (chunk.length < gzipHeader.length) {
        this[BUFFER] = chunk;
        return true
      }

      // look for gzip header
      for (let i = 0; this[UNZIP] === null && i < gzipHeader.length; i++) {
        if (chunk[i] !== gzipHeader[i]) {
          this[UNZIP] = false;
        }
      }

      const maybeBrotli = this.brotli === undefined;
      if (this[UNZIP] === false && maybeBrotli) {
        // read the first header to see if it's a valid tar file. If so,
        // we can safely assume that it's not actually brotli, despite the
        // .tbr or .tar.br file extension.
        // if we ended before getting a full chunk, yes, def brotli
        if (chunk.length < 512) {
          if (this[ENDED$1]) {
            this.brotli = true;
          } else {
            this[BUFFER] = chunk;
            return true
          }
        } else {
          // if it's tar, it's pretty reliably not brotli, chances of
          // that happening are astronomical.
          try {
            new Header(chunk.slice(0, 512));
            this.brotli = false;
          } catch (_) {
            this.brotli = true;
          }
        }
      }

      if (this[UNZIP] === null || (this[UNZIP] === false && this.brotli)) {
        const ended = this[ENDED$1];
        this[ENDED$1] = false;
        this[UNZIP] = this[UNZIP] === null
          ? new zlib$2.Unzip()
          : new zlib$2.BrotliDecompress();
        this[UNZIP].on('data', chunk => this[CONSUMECHUNK](chunk));
        this[UNZIP].on('error', er => this.abort(er));
        this[UNZIP].on('end', _ => {
          this[ENDED$1] = true;
          this[CONSUMECHUNK]();
        });
        this[WRITING] = true;
        const ret = this[UNZIP][ended ? 'end' : 'write'](chunk);
        this[WRITING] = false;
        return ret
      }
    }

    this[WRITING] = true;
    if (this[UNZIP]) {
      this[UNZIP].write(chunk);
    } else {
      this[CONSUMECHUNK](chunk);
    }
    this[WRITING] = false;

    // return false if there's a queue, or if the current entry isn't flowing
    const ret =
      this[QUEUE].length ? false :
      this[READENTRY] ? this[READENTRY].flowing :
      true;

    // if we have no queue, then that means a clogged READENTRY
    if (!ret && !this[QUEUE].length) {
      this[READENTRY].once('drain', _ => this.emit('drain'));
    }

    return ret
  }

  [BUFFERCONCAT] (c) {
    if (c && !this[ABORTED]) {
      this[BUFFER] = this[BUFFER] ? Buffer.concat([this[BUFFER], c]) : c;
    }
  }

  [MAYBEEND] () {
    if (this[ENDED$1] &&
        !this[EMITTEDEND] &&
        !this[ABORTED] &&
        !this[CONSUMING]) {
      this[EMITTEDEND] = true;
      const entry = this[WRITEENTRY];
      if (entry && entry.blockRemain) {
        // truncated, likely a damaged file
        const have = this[BUFFER] ? this[BUFFER].length : 0;
        this.warn('TAR_BAD_ARCHIVE', `Truncated input (needed ${
          entry.blockRemain} more bytes, only ${have} available)`, { entry });
        if (this[BUFFER]) {
          entry.write(this[BUFFER]);
        }
        entry.end();
      }
      this[EMIT](DONE);
    }
  }

  [CONSUMECHUNK] (chunk) {
    if (this[CONSUMING]) {
      this[BUFFERCONCAT](chunk);
    } else if (!chunk && !this[BUFFER]) {
      this[MAYBEEND]();
    } else {
      this[CONSUMING] = true;
      if (this[BUFFER]) {
        this[BUFFERCONCAT](chunk);
        const c = this[BUFFER];
        this[BUFFER] = null;
        this[CONSUMECHUNKSUB](c);
      } else {
        this[CONSUMECHUNKSUB](chunk);
      }

      while (this[BUFFER] &&
          this[BUFFER].length >= 512 &&
          !this[ABORTED] &&
          !this[SAW_EOF]) {
        const c = this[BUFFER];
        this[BUFFER] = null;
        this[CONSUMECHUNKSUB](c);
      }
      this[CONSUMING] = false;
    }

    if (!this[BUFFER] || this[ENDED$1]) {
      this[MAYBEEND]();
    }
  }

  [CONSUMECHUNKSUB] (chunk) {
    // we know that we are in CONSUMING mode, so anything written goes into
    // the buffer.  Advance the position and put any remainder in the buffer.
    let position = 0;
    const length = chunk.length;
    while (position + 512 <= length && !this[ABORTED] && !this[SAW_EOF]) {
      switch (this[STATE]) {
        case 'begin':
        case 'header':
          this[CONSUMEHEADER](chunk, position);
          position += 512;
          break

        case 'ignore':
        case 'body':
          position += this[CONSUMEBODY](chunk, position);
          break

        case 'meta':
          position += this[CONSUMEMETA](chunk, position);
          break

        /* istanbul ignore next */
        default:
          throw new Error('invalid state: ' + this[STATE])
      }
    }

    if (position < length) {
      if (this[BUFFER]) {
        this[BUFFER] = Buffer.concat([chunk.slice(position), this[BUFFER]]);
      } else {
        this[BUFFER] = chunk.slice(position);
      }
    }
  }

  end (chunk) {
    if (!this[ABORTED]) {
      if (this[UNZIP]) {
        this[UNZIP].end(chunk);
      } else {
        this[ENDED$1] = true;
        if (this.brotli === undefined) chunk = chunk || Buffer.alloc(0);
        this.write(chunk);
      }
    }
  }
});

var mkdir$1 = {exports: {}};

const { promisify: promisify$2 } = require$$0$f;
const fs$6 = require$$0$e;
const optsArg$1 = opts => {
  if (!opts)
    opts = { mode: 0o777, fs: fs$6 };
  else if (typeof opts === 'object')
    opts = { mode: 0o777, fs: fs$6, ...opts };
  else if (typeof opts === 'number')
    opts = { mode: opts, fs: fs$6 };
  else if (typeof opts === 'string')
    opts = { mode: parseInt(opts, 8), fs: fs$6 };
  else
    throw new TypeError('invalid options argument')

  opts.mkdir = opts.mkdir || opts.fs.mkdir || fs$6.mkdir;
  opts.mkdirAsync = promisify$2(opts.mkdir);
  opts.stat = opts.stat || opts.fs.stat || fs$6.stat;
  opts.statAsync = promisify$2(opts.stat);
  opts.statSync = opts.statSync || opts.fs.statSync || fs$6.statSync;
  opts.mkdirSync = opts.mkdirSync || opts.fs.mkdirSync || fs$6.mkdirSync;
  return opts
};
var optsArg_1 = optsArg$1;

const platform$3 = process.env.__TESTING_MKDIRP_PLATFORM__ || process.platform;
const { resolve, parse: parse$1 } = require$$0$d;
const pathArg$1 = path => {
  if (/\0/.test(path)) {
    // simulate same failure that node raises
    throw Object.assign(
      new TypeError('path must be a string without null bytes'),
      {
        path,
        code: 'ERR_INVALID_ARG_VALUE',
      }
    )
  }

  path = resolve(path);
  if (platform$3 === 'win32') {
    const badWinChars = /[*|"<>?:]/;
    const {root} = parse$1(path);
    if (badWinChars.test(path.substr(root.length))) {
      throw Object.assign(new Error('Illegal characters in path.'), {
        path,
        code: 'EINVAL',
      })
    }
  }

  return path
};
var pathArg_1 = pathArg$1;

const {dirname: dirname$2} = require$$0$d;

const findMade$1 = (opts, parent, path = undefined) => {
  // we never want the 'made' return value to be a root directory
  if (path === parent)
    return Promise.resolve()

  return opts.statAsync(parent).then(
    st => st.isDirectory() ? path : undefined, // will fail later
    er => er.code === 'ENOENT'
      ? findMade$1(opts, dirname$2(parent), parent)
      : undefined
  )
};

const findMadeSync$1 = (opts, parent, path = undefined) => {
  if (path === parent)
    return undefined

  try {
    return opts.statSync(parent).isDirectory() ? path : undefined
  } catch (er) {
    return er.code === 'ENOENT'
      ? findMadeSync$1(opts, dirname$2(parent), parent)
      : undefined
  }
};

var findMade_1 = {findMade: findMade$1, findMadeSync: findMadeSync$1};

const {dirname: dirname$1} = require$$0$d;

const mkdirpManual$2 = (path, opts, made) => {
  opts.recursive = false;
  const parent = dirname$1(path);
  if (parent === path) {
    return opts.mkdirAsync(path, opts).catch(er => {
      // swallowed by recursive implementation on posix systems
      // any other error is a failure
      if (er.code !== 'EISDIR')
        throw er
    })
  }

  return opts.mkdirAsync(path, opts).then(() => made || path, er => {
    if (er.code === 'ENOENT')
      return mkdirpManual$2(parent, opts)
        .then(made => mkdirpManual$2(path, opts, made))
    if (er.code !== 'EEXIST' && er.code !== 'EROFS')
      throw er
    return opts.statAsync(path).then(st => {
      if (st.isDirectory())
        return made
      else
        throw er
    }, () => { throw er })
  })
};

const mkdirpManualSync$2 = (path, opts, made) => {
  const parent = dirname$1(path);
  opts.recursive = false;

  if (parent === path) {
    try {
      return opts.mkdirSync(path, opts)
    } catch (er) {
      // swallowed by recursive implementation on posix systems
      // any other error is a failure
      if (er.code !== 'EISDIR')
        throw er
      else
        return
    }
  }

  try {
    opts.mkdirSync(path, opts);
    return made || path
  } catch (er) {
    if (er.code === 'ENOENT')
      return mkdirpManualSync$2(path, opts, mkdirpManualSync$2(parent, opts, made))
    if (er.code !== 'EEXIST' && er.code !== 'EROFS')
      throw er
    try {
      if (!opts.statSync(path).isDirectory())
        throw er
    } catch (_) {
      throw er
    }
  }
};

var mkdirpManual_1 = {mkdirpManual: mkdirpManual$2, mkdirpManualSync: mkdirpManualSync$2};

const {dirname} = require$$0$d;
const {findMade, findMadeSync} = findMade_1;
const {mkdirpManual: mkdirpManual$1, mkdirpManualSync: mkdirpManualSync$1} = mkdirpManual_1;

const mkdirpNative$1 = (path, opts) => {
  opts.recursive = true;
  const parent = dirname(path);
  if (parent === path)
    return opts.mkdirAsync(path, opts)

  return findMade(opts, path).then(made =>
    opts.mkdirAsync(path, opts).then(() => made)
    .catch(er => {
      if (er.code === 'ENOENT')
        return mkdirpManual$1(path, opts)
      else
        throw er
    }))
};

const mkdirpNativeSync$1 = (path, opts) => {
  opts.recursive = true;
  const parent = dirname(path);
  if (parent === path)
    return opts.mkdirSync(path, opts)

  const made = findMadeSync(opts, path);
  try {
    opts.mkdirSync(path, opts);
    return made
  } catch (er) {
    if (er.code === 'ENOENT')
      return mkdirpManualSync$1(path, opts)
    else
      throw er
  }
};

var mkdirpNative_1 = {mkdirpNative: mkdirpNative$1, mkdirpNativeSync: mkdirpNativeSync$1};

const fs$5 = require$$0$e;

const version = process.env.__TESTING_MKDIRP_NODE_VERSION__ || process.version;
const versArr = version.replace(/^v/, '').split('.');
const hasNative = +versArr[0] > 10 || +versArr[0] === 10 && +versArr[1] >= 12;

const useNative$1 = !hasNative ? () => false : opts => opts.mkdir === fs$5.mkdir;
const useNativeSync$1 = !hasNative ? () => false : opts => opts.mkdirSync === fs$5.mkdirSync;

var useNative_1 = {useNative: useNative$1, useNativeSync: useNativeSync$1};

const optsArg = optsArg_1;
const pathArg = pathArg_1;

const {mkdirpNative, mkdirpNativeSync} = mkdirpNative_1;
const {mkdirpManual, mkdirpManualSync} = mkdirpManual_1;
const {useNative, useNativeSync} = useNative_1;


const mkdirp$1 = (path, opts) => {
  path = pathArg(path);
  opts = optsArg(opts);
  return useNative(opts)
    ? mkdirpNative(path, opts)
    : mkdirpManual(path, opts)
};

const mkdirpSync = (path, opts) => {
  path = pathArg(path);
  opts = optsArg(opts);
  return useNativeSync(opts)
    ? mkdirpNativeSync(path, opts)
    : mkdirpManualSync(path, opts)
};

mkdirp$1.sync = mkdirpSync;
mkdirp$1.native = (path, opts) => mkdirpNative(pathArg(path), optsArg(opts));
mkdirp$1.manual = (path, opts) => mkdirpManual(pathArg(path), optsArg(opts));
mkdirp$1.nativeSync = (path, opts) => mkdirpNativeSync(pathArg(path), optsArg(opts));
mkdirp$1.manualSync = (path, opts) => mkdirpManualSync(pathArg(path), optsArg(opts));

var mkdirp_1 = mkdirp$1;

const fs$4 = require$$0$e;
const path$3 = require$$0$d;

/* istanbul ignore next */
const LCHOWN = fs$4.lchown ? 'lchown' : 'chown';
/* istanbul ignore next */
const LCHOWNSYNC = fs$4.lchownSync ? 'lchownSync' : 'chownSync';

/* istanbul ignore next */
const needEISDIRHandled = fs$4.lchown &&
  !process.version.match(/v1[1-9]+\./) &&
  !process.version.match(/v10\.[6-9]/);

const lchownSync = (path, uid, gid) => {
  try {
    return fs$4[LCHOWNSYNC](path, uid, gid)
  } catch (er) {
    if (er.code !== 'ENOENT')
      throw er
  }
};

/* istanbul ignore next */
const chownSync = (path, uid, gid) => {
  try {
    return fs$4.chownSync(path, uid, gid)
  } catch (er) {
    if (er.code !== 'ENOENT')
      throw er
  }
};

/* istanbul ignore next */
const handleEISDIR =
  needEISDIRHandled ? (path, uid, gid, cb) => er => {
    // Node prior to v10 had a very questionable implementation of
    // fs.lchown, which would always try to call fs.open on a directory
    // Fall back to fs.chown in those cases.
    if (!er || er.code !== 'EISDIR')
      cb(er);
    else
      fs$4.chown(path, uid, gid, cb);
  }
  : (_, __, ___, cb) => cb;

/* istanbul ignore next */
const handleEISDirSync =
  needEISDIRHandled ? (path, uid, gid) => {
    try {
      return lchownSync(path, uid, gid)
    } catch (er) {
      if (er.code !== 'EISDIR')
        throw er
      chownSync(path, uid, gid);
    }
  }
  : (path, uid, gid) => lchownSync(path, uid, gid);

// fs.readdir could only accept an options object as of node v6
const nodeVersion = process.version;
let readdir = (path, options, cb) => fs$4.readdir(path, options, cb);
let readdirSync = (path, options) => fs$4.readdirSync(path, options);
/* istanbul ignore next */
if (/^v4\./.test(nodeVersion))
  readdir = (path, options, cb) => fs$4.readdir(path, cb);

const chown = (cpath, uid, gid, cb) => {
  fs$4[LCHOWN](cpath, uid, gid, handleEISDIR(cpath, uid, gid, er => {
    // Skip ENOENT error
    cb(er && er.code !== 'ENOENT' ? er : null);
  }));
};

const chownrKid = (p, child, uid, gid, cb) => {
  if (typeof child === 'string')
    return fs$4.lstat(path$3.resolve(p, child), (er, stats) => {
      // Skip ENOENT error
      if (er)
        return cb(er.code !== 'ENOENT' ? er : null)
      stats.name = child;
      chownrKid(p, stats, uid, gid, cb);
    })

  if (child.isDirectory()) {
    chownr$1(path$3.resolve(p, child.name), uid, gid, er => {
      if (er)
        return cb(er)
      const cpath = path$3.resolve(p, child.name);
      chown(cpath, uid, gid, cb);
    });
  } else {
    const cpath = path$3.resolve(p, child.name);
    chown(cpath, uid, gid, cb);
  }
};


const chownr$1 = (p, uid, gid, cb) => {
  readdir(p, { withFileTypes: true }, (er, children) => {
    // any error other than ENOTDIR or ENOTSUP means it's not readable,
    // or doesn't exist.  give up.
    if (er) {
      if (er.code === 'ENOENT')
        return cb()
      else if (er.code !== 'ENOTDIR' && er.code !== 'ENOTSUP')
        return cb(er)
    }
    if (er || !children.length)
      return chown(p, uid, gid, cb)

    let len = children.length;
    let errState = null;
    const then = er => {
      if (errState)
        return
      if (er)
        return cb(errState = er)
      if (-- len === 0)
        return chown(p, uid, gid, cb)
    };

    children.forEach(child => chownrKid(p, child, uid, gid, then));
  });
};

const chownrKidSync = (p, child, uid, gid) => {
  if (typeof child === 'string') {
    try {
      const stats = fs$4.lstatSync(path$3.resolve(p, child));
      stats.name = child;
      child = stats;
    } catch (er) {
      if (er.code === 'ENOENT')
        return
      else
        throw er
    }
  }

  if (child.isDirectory())
    chownrSync(path$3.resolve(p, child.name), uid, gid);

  handleEISDirSync(path$3.resolve(p, child.name), uid, gid);
};

const chownrSync = (p, uid, gid) => {
  let children;
  try {
    children = readdirSync(p, { withFileTypes: true });
  } catch (er) {
    if (er.code === 'ENOENT')
      return
    else if (er.code === 'ENOTDIR' || er.code === 'ENOTSUP')
      return handleEISDirSync(p, uid, gid)
    else
      throw er
  }

  if (children && children.length)
    children.forEach(child => chownrKidSync(p, child, uid, gid));

  return handleEISDirSync(p, uid, gid)
};

var chownr_1 = chownr$1;
chownr$1.sync = chownrSync;

// wrapper around mkdirp for tar's needs.

// TODO: This should probably be a class, not functionally
// passing around state in a gazillion args.

const mkdirp = mkdirp_1;
const fs$3 = require$$0$e;
const path$2 = require$$0$d;
const chownr = chownr_1;
const normPath$1 = normalizeWindowsPath;

class SymlinkError extends Error {
  constructor (symlink, path) {
    super('Cannot extract through symbolic link');
    this.path = path;
    this.symlink = symlink;
  }

  get name () {
    return 'SylinkError'
  }
}

class CwdError extends Error {
  constructor (path, code) {
    super(code + ': Cannot cd into \'' + path + '\'');
    this.path = path;
    this.code = code;
  }

  get name () {
    return 'CwdError'
  }
}

const cGet = (cache, key) => cache.get(normPath$1(key));
const cSet = (cache, key, val) => cache.set(normPath$1(key), val);

const checkCwd = (dir, cb) => {
  fs$3.stat(dir, (er, st) => {
    if (er || !st.isDirectory()) {
      er = new CwdError(dir, er && er.code || 'ENOTDIR');
    }
    cb(er);
  });
};

mkdir$1.exports = (dir, opt, cb) => {
  dir = normPath$1(dir);

  // if there's any overlap between mask and mode,
  // then we'll need an explicit chmod
  const umask = opt.umask;
  const mode = opt.mode | 0o0700;
  const needChmod = (mode & umask) !== 0;

  const uid = opt.uid;
  const gid = opt.gid;
  const doChown = typeof uid === 'number' &&
    typeof gid === 'number' &&
    (uid !== opt.processUid || gid !== opt.processGid);

  const preserve = opt.preserve;
  const unlink = opt.unlink;
  const cache = opt.cache;
  const cwd = normPath$1(opt.cwd);

  const done = (er, created) => {
    if (er) {
      cb(er);
    } else {
      cSet(cache, dir, true);
      if (created && doChown) {
        chownr(created, uid, gid, er => done(er));
      } else if (needChmod) {
        fs$3.chmod(dir, mode, cb);
      } else {
        cb();
      }
    }
  };

  if (cache && cGet(cache, dir) === true) {
    return done()
  }

  if (dir === cwd) {
    return checkCwd(dir, done)
  }

  if (preserve) {
    return mkdirp(dir, { mode }).then(made => done(null, made), done)
  }

  const sub = normPath$1(path$2.relative(cwd, dir));
  const parts = sub.split('/');
  mkdir_(cwd, parts, mode, cache, unlink, cwd, null, done);
};

const mkdir_ = (base, parts, mode, cache, unlink, cwd, created, cb) => {
  if (!parts.length) {
    return cb(null, created)
  }
  const p = parts.shift();
  const part = normPath$1(path$2.resolve(base + '/' + p));
  if (cGet(cache, part)) {
    return mkdir_(part, parts, mode, cache, unlink, cwd, created, cb)
  }
  fs$3.mkdir(part, mode, onmkdir(part, parts, mode, cache, unlink, cwd, created, cb));
};

const onmkdir = (part, parts, mode, cache, unlink, cwd, created, cb) => er => {
  if (er) {
    fs$3.lstat(part, (statEr, st) => {
      if (statEr) {
        statEr.path = statEr.path && normPath$1(statEr.path);
        cb(statEr);
      } else if (st.isDirectory()) {
        mkdir_(part, parts, mode, cache, unlink, cwd, created, cb);
      } else if (unlink) {
        fs$3.unlink(part, er => {
          if (er) {
            return cb(er)
          }
          fs$3.mkdir(part, mode, onmkdir(part, parts, mode, cache, unlink, cwd, created, cb));
        });
      } else if (st.isSymbolicLink()) {
        return cb(new SymlinkError(part, part + '/' + parts.join('/')))
      } else {
        cb(er);
      }
    });
  } else {
    created = created || part;
    mkdir_(part, parts, mode, cache, unlink, cwd, created, cb);
  }
};

const checkCwdSync = dir => {
  let ok = false;
  let code = 'ENOTDIR';
  try {
    ok = fs$3.statSync(dir).isDirectory();
  } catch (er) {
    code = er.code;
  } finally {
    if (!ok) {
      throw new CwdError(dir, code)
    }
  }
};

mkdir$1.exports.sync = (dir, opt) => {
  dir = normPath$1(dir);
  // if there's any overlap between mask and mode,
  // then we'll need an explicit chmod
  const umask = opt.umask;
  const mode = opt.mode | 0o0700;
  const needChmod = (mode & umask) !== 0;

  const uid = opt.uid;
  const gid = opt.gid;
  const doChown = typeof uid === 'number' &&
    typeof gid === 'number' &&
    (uid !== opt.processUid || gid !== opt.processGid);

  const preserve = opt.preserve;
  const unlink = opt.unlink;
  const cache = opt.cache;
  const cwd = normPath$1(opt.cwd);

  const done = (created) => {
    cSet(cache, dir, true);
    if (created && doChown) {
      chownr.sync(created, uid, gid);
    }
    if (needChmod) {
      fs$3.chmodSync(dir, mode);
    }
  };

  if (cache && cGet(cache, dir) === true) {
    return done()
  }

  if (dir === cwd) {
    checkCwdSync(cwd);
    return done()
  }

  if (preserve) {
    return done(mkdirp.sync(dir, mode))
  }

  const sub = normPath$1(path$2.relative(cwd, dir));
  const parts = sub.split('/');
  let created = null;
  for (let p = parts.shift(), part = cwd;
    p && (part += '/' + p);
    p = parts.shift()) {
    part = normPath$1(path$2.resolve(part));
    if (cGet(cache, part)) {
      continue
    }

    try {
      fs$3.mkdirSync(part, mode);
      created = created || part;
      cSet(cache, part, true);
    } catch (er) {
      const st = fs$3.lstatSync(part);
      if (st.isDirectory()) {
        cSet(cache, part, true);
        continue
      } else if (unlink) {
        fs$3.unlinkSync(part);
        fs$3.mkdirSync(part, mode);
        created = created || part;
        cSet(cache, part, true);
        continue
      } else if (st.isSymbolicLink()) {
        return new SymlinkError(part, part + '/' + parts.join('/'))
      }
    }
  }

  return done(created)
};

var mkdirExports = mkdir$1.exports;

// warning: extremely hot code path.
// This has been meticulously optimized for use
// within npm install on large package trees.
// Do not edit without careful benchmarking.
const normalizeCache = Object.create(null);
const { hasOwnProperty } = Object.prototype;
var normalizeUnicode = s => {
  if (!hasOwnProperty.call(normalizeCache, s)) {
    normalizeCache[s] = s.normalize('NFD');
  }
  return normalizeCache[s]
};

// A path exclusive reservation system
// reserve([list, of, paths], fn)
// When the fn is first in line for all its paths, it
// is called with a cb that clears the reservation.
//
// Used by async unpack to avoid clobbering paths in use,
// while still allowing maximal safe parallelization.

const assert$c = require$$0$c;
const normalize$1 = normalizeUnicode;
const stripSlashes = stripTrailingSlashes;
const { join } = require$$0$d;

const platform$2 = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
const isWindows$2 = platform$2 === 'win32';

var pathReservations$1 = () => {
  // path => [function or Set]
  // A Set object means a directory reservation
  // A fn is a direct reservation on that path
  const queues = new Map();

  // fn => {paths:[path,...], dirs:[path, ...]}
  const reservations = new Map();

  // return a set of parent dirs for a given path
  // '/a/b/c/d' -> ['/', '/a', '/a/b', '/a/b/c', '/a/b/c/d']
  const getDirs = path => {
    const dirs = path.split('/').slice(0, -1).reduce((set, path) => {
      if (set.length) {
        path = join(set[set.length - 1], path);
      }
      set.push(path || '/');
      return set
    }, []);
    return dirs
  };

  // functions currently running
  const running = new Set();

  // return the queues for each path the function cares about
  // fn => {paths, dirs}
  const getQueues = fn => {
    const res = reservations.get(fn);
    /* istanbul ignore if - unpossible */
    if (!res) {
      throw new Error('function does not have any path reservations')
    }
    return {
      paths: res.paths.map(path => queues.get(path)),
      dirs: [...res.dirs].map(path => queues.get(path)),
    }
  };

  // check if fn is first in line for all its paths, and is
  // included in the first set for all its dir queues
  const check = fn => {
    const { paths, dirs } = getQueues(fn);
    return paths.every(q => q[0] === fn) &&
      dirs.every(q => q[0] instanceof Set && q[0].has(fn))
  };

  // run the function if it's first in line and not already running
  const run = fn => {
    if (running.has(fn) || !check(fn)) {
      return false
    }
    running.add(fn);
    fn(() => clear(fn));
    return true
  };

  const clear = fn => {
    if (!running.has(fn)) {
      return false
    }

    const { paths, dirs } = reservations.get(fn);
    const next = new Set();

    paths.forEach(path => {
      const q = queues.get(path);
      assert$c.equal(q[0], fn);
      if (q.length === 1) {
        queues.delete(path);
      } else {
        q.shift();
        if (typeof q[0] === 'function') {
          next.add(q[0]);
        } else {
          q[0].forEach(fn => next.add(fn));
        }
      }
    });

    dirs.forEach(dir => {
      const q = queues.get(dir);
      assert$c(q[0] instanceof Set);
      if (q[0].size === 1 && q.length === 1) {
        queues.delete(dir);
      } else if (q[0].size === 1) {
        q.shift();

        // must be a function or else the Set would've been reused
        next.add(q[0]);
      } else {
        q[0].delete(fn);
      }
    });
    running.delete(fn);

    next.forEach(fn => run(fn));
    return true
  };

  const reserve = (paths, fn) => {
    // collide on matches across case and unicode normalization
    // On windows, thanks to the magic of 8.3 shortnames, it is fundamentally
    // impossible to determine whether two paths refer to the same thing on
    // disk, without asking the kernel for a shortname.
    // So, we just pretend that every path matches every other path here,
    // effectively removing all parallelization on windows.
    paths = isWindows$2 ? ['win32 parallelization disabled'] : paths.map(p => {
      // don't need normPath, because we skip this entirely for windows
      return stripSlashes(join(normalize$1(p))).toLowerCase()
    });

    const dirs = new Set(
      paths.map(path => getDirs(path)).reduce((a, b) => a.concat(b))
    );
    reservations.set(fn, { dirs, paths });
    paths.forEach(path => {
      const q = queues.get(path);
      if (!q) {
        queues.set(path, [fn]);
      } else {
        q.push(fn);
      }
    });
    dirs.forEach(dir => {
      const q = queues.get(dir);
      if (!q) {
        queues.set(dir, [new Set([fn])]);
      } else if (q[q.length - 1] instanceof Set) {
        q[q.length - 1].add(fn);
      } else {
        q.push(new Set([fn]));
      }
    });

    return run(fn)
  };

  return { check, reserve }
};

// Get the appropriate flag to use for creating files
// We use fmap on Windows platforms for files less than
// 512kb.  This is a fairly low limit, but avoids making
// things slower in some cases.  Since most of what this
// library is used for is extracting tarballs of many
// relatively small files in npm packages and the like,
// it can be a big boost on Windows platforms.
// Only supported in Node v12.9.0 and above.
const platform$1 = process.env.__FAKE_PLATFORM__ || process.platform;
const isWindows$1 = platform$1 === 'win32';
const fs$2 = commonjsGlobal$1.__FAKE_TESTING_FS__ || require$$0$e;

/* istanbul ignore next */
const { O_CREAT, O_TRUNC, O_WRONLY, UV_FS_O_FILEMAP = 0 } = fs$2.constants;

const fMapEnabled = isWindows$1 && !!UV_FS_O_FILEMAP;
const fMapLimit = 512 * 1024;
const fMapFlag = UV_FS_O_FILEMAP | O_TRUNC | O_CREAT | O_WRONLY;
var getWriteFlag = !fMapEnabled ? () => 'w'
  : size => size < fMapLimit ? fMapFlag : 'w';

// the PEND/UNPEND stuff tracks whether we're ready to emit end/close yet.
// but the path reservations are required to avoid race conditions where
// parallelized unpack ops may mess with one another, due to dependencies
// (like a Link depending on its target) or destructive operations (like
// clobbering an fs object to create one of a different type.)

const assert$b = require$$0$c;
const Parser$1 = parse$2;
const fs$1 = require$$0$e;
const fsm$1 = fsMinipass;
const path$1 = require$$0$d;
const mkdir = mkdirExports;
const wc = winchars$1;
const pathReservations = pathReservations$1;
const stripAbsolutePath = stripAbsolutePath$2;
const normPath = normalizeWindowsPath;
const stripSlash$1 = stripTrailingSlashes;
const normalize = normalizeUnicode;

const ONENTRY = Symbol('onEntry');
const CHECKFS = Symbol('checkFs');
const CHECKFS2 = Symbol('checkFs2');
const PRUNECACHE = Symbol('pruneCache');
const ISREUSABLE = Symbol('isReusable');
const MAKEFS = Symbol('makeFs');
const FILE = Symbol('file');
const DIRECTORY = Symbol('directory');
const LINK = Symbol('link');
const SYMLINK = Symbol('symlink');
const HARDLINK = Symbol('hardlink');
const UNSUPPORTED = Symbol('unsupported');
const CHECKPATH = Symbol('checkPath');
const MKDIR = Symbol('mkdir');
const ONERROR = Symbol('onError');
const PENDING = Symbol('pending');
const PEND = Symbol('pend');
const UNPEND = Symbol('unpend');
const ENDED = Symbol('ended');
const MAYBECLOSE = Symbol('maybeClose');
const SKIP = Symbol('skip');
const DOCHOWN = Symbol('doChown');
const UID = Symbol('uid');
const GID = Symbol('gid');
const CHECKED_CWD = Symbol('checkedCwd');
const crypto = require$$0$g;
const getFlag = getWriteFlag;
const platform = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform;
const isWindows = platform === 'win32';

// Unlinks on Windows are not atomic.
//
// This means that if you have a file entry, followed by another
// file entry with an identical name, and you cannot re-use the file
// (because it's a hardlink, or because unlink:true is set, or it's
// Windows, which does not have useful nlink values), then the unlink
// will be committed to the disk AFTER the new file has been written
// over the old one, deleting the new file.
//
// To work around this, on Windows systems, we rename the file and then
// delete the renamed file.  It's a sloppy kludge, but frankly, I do not
// know of a better way to do this, given windows' non-atomic unlink
// semantics.
//
// See: https://github.com/npm/node-tar/issues/183
/* istanbul ignore next */
const unlinkFile = (path, cb) => {
  if (!isWindows) {
    return fs$1.unlink(path, cb)
  }

  const name = path + '.DELETE.' + crypto.randomBytes(16).toString('hex');
  fs$1.rename(path, name, er => {
    if (er) {
      return cb(er)
    }
    fs$1.unlink(name, cb);
  });
};

/* istanbul ignore next */
const unlinkFileSync = path => {
  if (!isWindows) {
    return fs$1.unlinkSync(path)
  }

  const name = path + '.DELETE.' + crypto.randomBytes(16).toString('hex');
  fs$1.renameSync(path, name);
  fs$1.unlinkSync(name);
};

// this.gid, entry.gid, this.processUid
const uint32 = (a, b, c) =>
  a === a >>> 0 ? a
  : b === b >>> 0 ? b
  : c;

// clear the cache if it's a case-insensitive unicode-squashing match.
// we can't know if the current file system is case-sensitive or supports
// unicode fully, so we check for similarity on the maximally compatible
// representation.  Err on the side of pruning, since all it's doing is
// preventing lstats, and it's not the end of the world if we get a false
// positive.
// Note that on windows, we always drop the entire cache whenever a
// symbolic link is encountered, because 8.3 filenames are impossible
// to reason about, and collisions are hazards rather than just failures.
const cacheKeyNormalize = path => stripSlash$1(normPath(normalize(path)))
  .toLowerCase();

const pruneCache = (cache, abs) => {
  abs = cacheKeyNormalize(abs);
  for (const path of cache.keys()) {
    const pnorm = cacheKeyNormalize(path);
    if (pnorm === abs || pnorm.indexOf(abs + '/') === 0) {
      cache.delete(path);
    }
  }
};

const dropCache = cache => {
  for (const key of cache.keys()) {
    cache.delete(key);
  }
};

let Unpack$1 = class Unpack extends Parser$1 {
  constructor (opt) {
    if (!opt) {
      opt = {};
    }

    opt.ondone = _ => {
      this[ENDED] = true;
      this[MAYBECLOSE]();
    };

    super(opt);

    this[CHECKED_CWD] = false;

    this.reservations = pathReservations();

    this.transform = typeof opt.transform === 'function' ? opt.transform : null;

    this.writable = true;
    this.readable = false;

    this[PENDING] = 0;
    this[ENDED] = false;

    this.dirCache = opt.dirCache || new Map();

    if (typeof opt.uid === 'number' || typeof opt.gid === 'number') {
      // need both or neither
      if (typeof opt.uid !== 'number' || typeof opt.gid !== 'number') {
        throw new TypeError('cannot set owner without number uid and gid')
      }
      if (opt.preserveOwner) {
        throw new TypeError(
          'cannot preserve owner in archive and also set owner explicitly')
      }
      this.uid = opt.uid;
      this.gid = opt.gid;
      this.setOwner = true;
    } else {
      this.uid = null;
      this.gid = null;
      this.setOwner = false;
    }

    // default true for root
    if (opt.preserveOwner === undefined && typeof opt.uid !== 'number') {
      this.preserveOwner = process.getuid && process.getuid() === 0;
    } else {
      this.preserveOwner = !!opt.preserveOwner;
    }

    this.processUid = (this.preserveOwner || this.setOwner) && process.getuid ?
      process.getuid() : null;
    this.processGid = (this.preserveOwner || this.setOwner) && process.getgid ?
      process.getgid() : null;

    // mostly just for testing, but useful in some cases.
    // Forcibly trigger a chown on every entry, no matter what
    this.forceChown = opt.forceChown === true;

    // turn ><?| in filenames into 0xf000-higher encoded forms
    this.win32 = !!opt.win32 || isWindows;

    // do not unpack over files that are newer than what's in the archive
    this.newer = !!opt.newer;

    // do not unpack over ANY files
    this.keep = !!opt.keep;

    // do not set mtime/atime of extracted entries
    this.noMtime = !!opt.noMtime;

    // allow .., absolute path entries, and unpacking through symlinks
    // without this, warn and skip .., relativize absolutes, and error
    // on symlinks in extraction path
    this.preservePaths = !!opt.preservePaths;

    // unlink files and links before writing. This breaks existing hard
    // links, and removes symlink directories rather than erroring
    this.unlink = !!opt.unlink;

    this.cwd = normPath(path$1.resolve(opt.cwd || process.cwd()));
    this.strip = +opt.strip || 0;
    // if we're not chmodding, then we don't need the process umask
    this.processUmask = opt.noChmod ? 0 : process.umask();
    this.umask = typeof opt.umask === 'number' ? opt.umask : this.processUmask;

    // default mode for dirs created as parents
    this.dmode = opt.dmode || (0o0777 & (~this.umask));
    this.fmode = opt.fmode || (0o0666 & (~this.umask));

    this.on('entry', entry => this[ONENTRY](entry));
  }

  // a bad or damaged archive is a warning for Parser, but an error
  // when extracting.  Mark those errors as unrecoverable, because
  // the Unpack contract cannot be met.
  warn (code, msg, data = {}) {
    if (code === 'TAR_BAD_ARCHIVE' || code === 'TAR_ABORT') {
      data.recoverable = false;
    }
    return super.warn(code, msg, data)
  }

  [MAYBECLOSE] () {
    if (this[ENDED] && this[PENDING] === 0) {
      this.emit('prefinish');
      this.emit('finish');
      this.emit('end');
    }
  }

  [CHECKPATH] (entry) {
    if (this.strip) {
      const parts = normPath(entry.path).split('/');
      if (parts.length < this.strip) {
        return false
      }
      entry.path = parts.slice(this.strip).join('/');

      if (entry.type === 'Link') {
        const linkparts = normPath(entry.linkpath).split('/');
        if (linkparts.length >= this.strip) {
          entry.linkpath = linkparts.slice(this.strip).join('/');
        } else {
          return false
        }
      }
    }

    if (!this.preservePaths) {
      const p = normPath(entry.path);
      const parts = p.split('/');
      if (parts.includes('..') || isWindows && /^[a-z]:\.\.$/i.test(parts[0])) {
        this.warn('TAR_ENTRY_ERROR', `path contains '..'`, {
          entry,
          path: p,
        });
        return false
      }

      // strip off the root
      const [root, stripped] = stripAbsolutePath(p);
      if (root) {
        entry.path = stripped;
        this.warn('TAR_ENTRY_INFO', `stripping ${root} from absolute path`, {
          entry,
          path: p,
        });
      }
    }

    if (path$1.isAbsolute(entry.path)) {
      entry.absolute = normPath(path$1.resolve(entry.path));
    } else {
      entry.absolute = normPath(path$1.resolve(this.cwd, entry.path));
    }

    // if we somehow ended up with a path that escapes the cwd, and we are
    // not in preservePaths mode, then something is fishy!  This should have
    // been prevented above, so ignore this for coverage.
    /* istanbul ignore if - defense in depth */
    if (!this.preservePaths &&
        entry.absolute.indexOf(this.cwd + '/') !== 0 &&
        entry.absolute !== this.cwd) {
      this.warn('TAR_ENTRY_ERROR', 'path escaped extraction target', {
        entry,
        path: normPath(entry.path),
        resolvedPath: entry.absolute,
        cwd: this.cwd,
      });
      return false
    }

    // an archive can set properties on the extraction directory, but it
    // may not replace the cwd with a different kind of thing entirely.
    if (entry.absolute === this.cwd &&
        entry.type !== 'Directory' &&
        entry.type !== 'GNUDumpDir') {
      return false
    }

    // only encode : chars that aren't drive letter indicators
    if (this.win32) {
      const { root: aRoot } = path$1.win32.parse(entry.absolute);
      entry.absolute = aRoot + wc.encode(entry.absolute.slice(aRoot.length));
      const { root: pRoot } = path$1.win32.parse(entry.path);
      entry.path = pRoot + wc.encode(entry.path.slice(pRoot.length));
    }

    return true
  }

  [ONENTRY] (entry) {
    if (!this[CHECKPATH](entry)) {
      return entry.resume()
    }

    assert$b.equal(typeof entry.absolute, 'string');

    switch (entry.type) {
      case 'Directory':
      case 'GNUDumpDir':
        if (entry.mode) {
          entry.mode = entry.mode | 0o700;
        }

      // eslint-disable-next-line no-fallthrough
      case 'File':
      case 'OldFile':
      case 'ContiguousFile':
      case 'Link':
      case 'SymbolicLink':
        return this[CHECKFS](entry)

      case 'CharacterDevice':
      case 'BlockDevice':
      case 'FIFO':
      default:
        return this[UNSUPPORTED](entry)
    }
  }

  [ONERROR] (er, entry) {
    // Cwd has to exist, or else nothing works. That's serious.
    // Other errors are warnings, which raise the error in strict
    // mode, but otherwise continue on.
    if (er.name === 'CwdError') {
      this.emit('error', er);
    } else {
      this.warn('TAR_ENTRY_ERROR', er, { entry });
      this[UNPEND]();
      entry.resume();
    }
  }

  [MKDIR] (dir, mode, cb) {
    mkdir(normPath(dir), {
      uid: this.uid,
      gid: this.gid,
      processUid: this.processUid,
      processGid: this.processGid,
      umask: this.processUmask,
      preserve: this.preservePaths,
      unlink: this.unlink,
      cache: this.dirCache,
      cwd: this.cwd,
      mode: mode,
      noChmod: this.noChmod,
    }, cb);
  }

  [DOCHOWN] (entry) {
    // in preserve owner mode, chown if the entry doesn't match process
    // in set owner mode, chown if setting doesn't match process
    return this.forceChown ||
      this.preserveOwner &&
      (typeof entry.uid === 'number' && entry.uid !== this.processUid ||
        typeof entry.gid === 'number' && entry.gid !== this.processGid)
      ||
      (typeof this.uid === 'number' && this.uid !== this.processUid ||
        typeof this.gid === 'number' && this.gid !== this.processGid)
  }

  [UID] (entry) {
    return uint32(this.uid, entry.uid, this.processUid)
  }

  [GID] (entry) {
    return uint32(this.gid, entry.gid, this.processGid)
  }

  [FILE] (entry, fullyDone) {
    const mode = entry.mode & 0o7777 || this.fmode;
    const stream = new fsm$1.WriteStream(entry.absolute, {
      flags: getFlag(entry.size),
      mode: mode,
      autoClose: false,
    });
    stream.on('error', er => {
      if (stream.fd) {
        fs$1.close(stream.fd, () => {});
      }

      // flush all the data out so that we aren't left hanging
      // if the error wasn't actually fatal.  otherwise the parse
      // is blocked, and we never proceed.
      stream.write = () => true;
      this[ONERROR](er, entry);
      fullyDone();
    });

    let actions = 1;
    const done = er => {
      if (er) {
        /* istanbul ignore else - we should always have a fd by now */
        if (stream.fd) {
          fs$1.close(stream.fd, () => {});
        }

        this[ONERROR](er, entry);
        fullyDone();
        return
      }

      if (--actions === 0) {
        fs$1.close(stream.fd, er => {
          if (er) {
            this[ONERROR](er, entry);
          } else {
            this[UNPEND]();
          }
          fullyDone();
        });
      }
    };

    stream.on('finish', _ => {
      // if futimes fails, try utimes
      // if utimes fails, fail with the original error
      // same for fchown/chown
      const abs = entry.absolute;
      const fd = stream.fd;

      if (entry.mtime && !this.noMtime) {
        actions++;
        const atime = entry.atime || new Date();
        const mtime = entry.mtime;
        fs$1.futimes(fd, atime, mtime, er =>
          er ? fs$1.utimes(abs, atime, mtime, er2 => done(er2 && er))
          : done());
      }

      if (this[DOCHOWN](entry)) {
        actions++;
        const uid = this[UID](entry);
        const gid = this[GID](entry);
        fs$1.fchown(fd, uid, gid, er =>
          er ? fs$1.chown(abs, uid, gid, er2 => done(er2 && er))
          : done());
      }

      done();
    });

    const tx = this.transform ? this.transform(entry) || entry : entry;
    if (tx !== entry) {
      tx.on('error', er => {
        this[ONERROR](er, entry);
        fullyDone();
      });
      entry.pipe(tx);
    }
    tx.pipe(stream);
  }

  [DIRECTORY] (entry, fullyDone) {
    const mode = entry.mode & 0o7777 || this.dmode;
    this[MKDIR](entry.absolute, mode, er => {
      if (er) {
        this[ONERROR](er, entry);
        fullyDone();
        return
      }

      let actions = 1;
      const done = _ => {
        if (--actions === 0) {
          fullyDone();
          this[UNPEND]();
          entry.resume();
        }
      };

      if (entry.mtime && !this.noMtime) {
        actions++;
        fs$1.utimes(entry.absolute, entry.atime || new Date(), entry.mtime, done);
      }

      if (this[DOCHOWN](entry)) {
        actions++;
        fs$1.chown(entry.absolute, this[UID](entry), this[GID](entry), done);
      }

      done();
    });
  }

  [UNSUPPORTED] (entry) {
    entry.unsupported = true;
    this.warn('TAR_ENTRY_UNSUPPORTED',
      `unsupported entry type: ${entry.type}`, { entry });
    entry.resume();
  }

  [SYMLINK] (entry, done) {
    this[LINK](entry, entry.linkpath, 'symlink', done);
  }

  [HARDLINK] (entry, done) {
    const linkpath = normPath(path$1.resolve(this.cwd, entry.linkpath));
    this[LINK](entry, linkpath, 'link', done);
  }

  [PEND] () {
    this[PENDING]++;
  }

  [UNPEND] () {
    this[PENDING]--;
    this[MAYBECLOSE]();
  }

  [SKIP] (entry) {
    this[UNPEND]();
    entry.resume();
  }

  // Check if we can reuse an existing filesystem entry safely and
  // overwrite it, rather than unlinking and recreating
  // Windows doesn't report a useful nlink, so we just never reuse entries
  [ISREUSABLE] (entry, st) {
    return entry.type === 'File' &&
      !this.unlink &&
      st.isFile() &&
      st.nlink <= 1 &&
      !isWindows
  }

  // check if a thing is there, and if so, try to clobber it
  [CHECKFS] (entry) {
    this[PEND]();
    const paths = [entry.path];
    if (entry.linkpath) {
      paths.push(entry.linkpath);
    }
    this.reservations.reserve(paths, done => this[CHECKFS2](entry, done));
  }

  [PRUNECACHE] (entry) {
    // if we are not creating a directory, and the path is in the dirCache,
    // then that means we are about to delete the directory we created
    // previously, and it is no longer going to be a directory, and neither
    // is any of its children.
    // If a symbolic link is encountered, all bets are off.  There is no
    // reasonable way to sanitize the cache in such a way we will be able to
    // avoid having filesystem collisions.  If this happens with a non-symlink
    // entry, it'll just fail to unpack, but a symlink to a directory, using an
    // 8.3 shortname or certain unicode attacks, can evade detection and lead
    // to arbitrary writes to anywhere on the system.
    if (entry.type === 'SymbolicLink') {
      dropCache(this.dirCache);
    } else if (entry.type !== 'Directory') {
      pruneCache(this.dirCache, entry.absolute);
    }
  }

  [CHECKFS2] (entry, fullyDone) {
    this[PRUNECACHE](entry);

    const done = er => {
      this[PRUNECACHE](entry);
      fullyDone(er);
    };

    const checkCwd = () => {
      this[MKDIR](this.cwd, this.dmode, er => {
        if (er) {
          this[ONERROR](er, entry);
          done();
          return
        }
        this[CHECKED_CWD] = true;
        start();
      });
    };

    const start = () => {
      if (entry.absolute !== this.cwd) {
        const parent = normPath(path$1.dirname(entry.absolute));
        if (parent !== this.cwd) {
          return this[MKDIR](parent, this.dmode, er => {
            if (er) {
              this[ONERROR](er, entry);
              done();
              return
            }
            afterMakeParent();
          })
        }
      }
      afterMakeParent();
    };

    const afterMakeParent = () => {
      fs$1.lstat(entry.absolute, (lstatEr, st) => {
        if (st && (this.keep || this.newer && st.mtime > entry.mtime)) {
          this[SKIP](entry);
          done();
          return
        }
        if (lstatEr || this[ISREUSABLE](entry, st)) {
          return this[MAKEFS](null, entry, done)
        }

        if (st.isDirectory()) {
          if (entry.type === 'Directory') {
            const needChmod = !this.noChmod &&
              entry.mode &&
              (st.mode & 0o7777) !== entry.mode;
            const afterChmod = er => this[MAKEFS](er, entry, done);
            if (!needChmod) {
              return afterChmod()
            }
            return fs$1.chmod(entry.absolute, entry.mode, afterChmod)
          }
          // Not a dir entry, have to remove it.
          // NB: the only way to end up with an entry that is the cwd
          // itself, in such a way that == does not detect, is a
          // tricky windows absolute path with UNC or 8.3 parts (and
          // preservePaths:true, or else it will have been stripped).
          // In that case, the user has opted out of path protections
          // explicitly, so if they blow away the cwd, c'est la vie.
          if (entry.absolute !== this.cwd) {
            return fs$1.rmdir(entry.absolute, er =>
              this[MAKEFS](er, entry, done))
          }
        }

        // not a dir, and not reusable
        // don't remove if the cwd, we want that error
        if (entry.absolute === this.cwd) {
          return this[MAKEFS](null, entry, done)
        }

        unlinkFile(entry.absolute, er =>
          this[MAKEFS](er, entry, done));
      });
    };

    if (this[CHECKED_CWD]) {
      start();
    } else {
      checkCwd();
    }
  }

  [MAKEFS] (er, entry, done) {
    if (er) {
      this[ONERROR](er, entry);
      done();
      return
    }

    switch (entry.type) {
      case 'File':
      case 'OldFile':
      case 'ContiguousFile':
        return this[FILE](entry, done)

      case 'Link':
        return this[HARDLINK](entry, done)

      case 'SymbolicLink':
        return this[SYMLINK](entry, done)

      case 'Directory':
      case 'GNUDumpDir':
        return this[DIRECTORY](entry, done)
    }
  }

  [LINK] (entry, linkpath, link, done) {
    // XXX: get the type ('symlink' or 'junction') for windows
    fs$1[link](linkpath, entry.absolute, er => {
      if (er) {
        this[ONERROR](er, entry);
      } else {
        this[UNPEND]();
        entry.resume();
      }
      done();
    });
  }
};

const callSync = fn => {
  try {
    return [null, fn()]
  } catch (er) {
    return [er, null]
  }
};
class UnpackSync extends Unpack$1 {
  [MAKEFS] (er, entry) {
    return super[MAKEFS](er, entry, () => {})
  }

  [CHECKFS] (entry) {
    this[PRUNECACHE](entry);

    if (!this[CHECKED_CWD]) {
      const er = this[MKDIR](this.cwd, this.dmode);
      if (er) {
        return this[ONERROR](er, entry)
      }
      this[CHECKED_CWD] = true;
    }

    // don't bother to make the parent if the current entry is the cwd,
    // we've already checked it.
    if (entry.absolute !== this.cwd) {
      const parent = normPath(path$1.dirname(entry.absolute));
      if (parent !== this.cwd) {
        const mkParent = this[MKDIR](parent, this.dmode);
        if (mkParent) {
          return this[ONERROR](mkParent, entry)
        }
      }
    }

    const [lstatEr, st] = callSync(() => fs$1.lstatSync(entry.absolute));
    if (st && (this.keep || this.newer && st.mtime > entry.mtime)) {
      return this[SKIP](entry)
    }

    if (lstatEr || this[ISREUSABLE](entry, st)) {
      return this[MAKEFS](null, entry)
    }

    if (st.isDirectory()) {
      if (entry.type === 'Directory') {
        const needChmod = !this.noChmod &&
          entry.mode &&
          (st.mode & 0o7777) !== entry.mode;
        const [er] = needChmod ? callSync(() => {
          fs$1.chmodSync(entry.absolute, entry.mode);
        }) : [];
        return this[MAKEFS](er, entry)
      }
      // not a dir entry, have to remove it
      const [er] = callSync(() => fs$1.rmdirSync(entry.absolute));
      this[MAKEFS](er, entry);
    }

    // not a dir, and not reusable.
    // don't remove if it's the cwd, since we want that error.
    const [er] = entry.absolute === this.cwd ? []
      : callSync(() => unlinkFileSync(entry.absolute));
    this[MAKEFS](er, entry);
  }

  [FILE] (entry, done) {
    const mode = entry.mode & 0o7777 || this.fmode;

    const oner = er => {
      let closeError;
      try {
        fs$1.closeSync(fd);
      } catch (e) {
        closeError = e;
      }
      if (er || closeError) {
        this[ONERROR](er || closeError, entry);
      }
      done();
    };

    let fd;
    try {
      fd = fs$1.openSync(entry.absolute, getFlag(entry.size), mode);
    } catch (er) {
      return oner(er)
    }
    const tx = this.transform ? this.transform(entry) || entry : entry;
    if (tx !== entry) {
      tx.on('error', er => this[ONERROR](er, entry));
      entry.pipe(tx);
    }

    tx.on('data', chunk => {
      try {
        fs$1.writeSync(fd, chunk, 0, chunk.length);
      } catch (er) {
        oner(er);
      }
    });

    tx.on('end', _ => {
      let er = null;
      // try both, falling futimes back to utimes
      // if either fails, handle the first error
      if (entry.mtime && !this.noMtime) {
        const atime = entry.atime || new Date();
        const mtime = entry.mtime;
        try {
          fs$1.futimesSync(fd, atime, mtime);
        } catch (futimeser) {
          try {
            fs$1.utimesSync(entry.absolute, atime, mtime);
          } catch (utimeser) {
            er = futimeser;
          }
        }
      }

      if (this[DOCHOWN](entry)) {
        const uid = this[UID](entry);
        const gid = this[GID](entry);

        try {
          fs$1.fchownSync(fd, uid, gid);
        } catch (fchowner) {
          try {
            fs$1.chownSync(entry.absolute, uid, gid);
          } catch (chowner) {
            er = er || fchowner;
          }
        }
      }

      oner(er);
    });
  }

  [DIRECTORY] (entry, done) {
    const mode = entry.mode & 0o7777 || this.dmode;
    const er = this[MKDIR](entry.absolute, mode);
    if (er) {
      this[ONERROR](er, entry);
      done();
      return
    }
    if (entry.mtime && !this.noMtime) {
      try {
        fs$1.utimesSync(entry.absolute, entry.atime || new Date(), entry.mtime);
      } catch (er) {}
    }
    if (this[DOCHOWN](entry)) {
      try {
        fs$1.chownSync(entry.absolute, this[UID](entry), this[GID](entry));
      } catch (er) {}
    }
    done();
    entry.resume();
  }

  [MKDIR] (dir, mode) {
    try {
      return mkdir.sync(normPath(dir), {
        uid: this.uid,
        gid: this.gid,
        processUid: this.processUid,
        processGid: this.processGid,
        umask: this.processUmask,
        preserve: this.preservePaths,
        unlink: this.unlink,
        cache: this.dirCache,
        cwd: this.cwd,
        mode: mode,
      })
    } catch (er) {
      return er
    }
  }

  [LINK] (entry, linkpath, link, done) {
    try {
      fs$1[link + 'Sync'](linkpath, entry.absolute);
      done();
      entry.resume();
    } catch (er) {
      return this[ONERROR](er, entry)
    }
  }
}

Unpack$1.Sync = UnpackSync;
var unpack = Unpack$1;

// tar -x
const hlo = highLevelOpt;
const Unpack = unpack;
const fs = require$$0$e;
const fsm = fsMinipass;
const path = require$$0$d;
const stripSlash = stripTrailingSlashes;

var extract_1 = (opt_, files, cb) => {
  if (typeof opt_ === 'function') {
    cb = opt_, files = null, opt_ = {};
  } else if (Array.isArray(opt_)) {
    files = opt_, opt_ = {};
  }

  if (typeof files === 'function') {
    cb = files, files = null;
  }

  if (!files) {
    files = [];
  } else {
    files = Array.from(files);
  }

  const opt = hlo(opt_);

  if (opt.sync && typeof cb === 'function') {
    throw new TypeError('callback not supported for sync tar functions')
  }

  if (!opt.file && typeof cb === 'function') {
    throw new TypeError('callback only supported with file option')
  }

  if (files.length) {
    filesFilter(opt, files);
  }

  return opt.file && opt.sync ? extractFileSync(opt)
    : opt.file ? extractFile(opt, cb)
    : opt.sync ? extractSync(opt)
    : extract$1(opt)
};

// construct a filter that limits the file entries listed
// include child entries if a dir is included
const filesFilter = (opt, files) => {
  const map = new Map(files.map(f => [stripSlash(f), true]));
  const filter = opt.filter;

  const mapHas = (file, r) => {
    const root = r || path.parse(file).root || '.';
    const ret = file === root ? false
      : map.has(file) ? map.get(file)
      : mapHas(path.dirname(file), root);

    map.set(file, ret);
    return ret
  };

  opt.filter = filter
    ? (file, entry) => filter(file, entry) && mapHas(stripSlash(file))
    : file => mapHas(stripSlash(file));
};

const extractFileSync = opt => {
  const u = new Unpack.Sync(opt);

  const file = opt.file;
  const stat = fs.statSync(file);
  // This trades a zero-byte read() syscall for a stat
  // However, it will usually result in less memory allocation
  const readSize = opt.maxReadSize || 16 * 1024 * 1024;
  const stream = new fsm.ReadStreamSync(file, {
    readSize: readSize,
    size: stat.size,
  });
  stream.pipe(u);
};

const extractFile = (opt, cb) => {
  const u = new Unpack(opt);
  const readSize = opt.maxReadSize || 16 * 1024 * 1024;

  const file = opt.file;
  const p = new Promise((resolve, reject) => {
    u.on('error', reject);
    u.on('close', resolve);

    // This trades a zero-byte read() syscall for a stat
    // However, it will usually result in less memory allocation
    fs.stat(file, (er, stat) => {
      if (er) {
        reject(er);
      } else {
        const stream = new fsm.ReadStream(file, {
          readSize: readSize,
          size: stat.size,
        });
        stream.on('error', reject);
        stream.pipe(u);
      }
    });
  });
  return cb ? p.then(cb, cb) : p
};

const extractSync = opt => new Unpack.Sync(opt);

const extract$1 = opt => new Unpack(opt);

var extract;
extract = extract_1;

var nodeFetchNative_61758d11 = {};

var l$1=Object.defineProperty;var o$1=(e,t)=>l$1(e,"name",{value:t,configurable:!0});var commonjsGlobal=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof commonjsGlobal$1<"u"?commonjsGlobal$1:typeof self<"u"?self:{};function getDefaultExportFromCjs(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}o$1(getDefaultExportFromCjs,"getDefaultExportFromCjs"),nodeFetchNative_61758d11.commonjsGlobal=commonjsGlobal,nodeFetchNative_61758d11.getDefaultExportFromCjs=getDefaultExportFromCjs;

var dist$3 = {};

var node$2 = {};

var ms$1=Object.defineProperty;var u$1=(c,l)=>ms$1(c,"name",{value:l,configurable:!0});var Po=(c,l,d)=>{if(!l.has(c))throw TypeError("Cannot "+d)};var D=(c,l,d)=>(Po(c,l,"read from private field"),d?d.call(c):l.get(c)),ye$1=(c,l,d)=>{if(l.has(c))throw TypeError("Cannot add the same private member more than once");l instanceof WeakSet?l.add(c):l.set(c,d);},ne=(c,l,d,y)=>(Po(c,l,"write to private field"),y?y.call(c,d):l.set(c,d),d);var Pe$1,bt$1,ot,Zt,Ue$1,mt$1,yt$1,gt$1,oe,_t,Me$1,xe$1,St$1;Object.defineProperty(node$2,"__esModule",{value:!0});const http$4=vt$1,https$2=https$3,zlib$1=st,Stream$1=me$1,require$$6$2=require$$8$2,require$$0$8=require$$9$1,_commonjsHelpers$1=nodeFetchNative_61758d11,require$$1$4=require$$10,require$$4$3=require$$12,node_fs=fs$a,node_path=path$7;function _interopDefaultCompat$1(c){return c&&typeof c=="object"&&"default"in c?c.default:c}u$1(_interopDefaultCompat$1,"_interopDefaultCompat");const http__default$1=_interopDefaultCompat$1(http$4),https__default=_interopDefaultCompat$1(https$2),zlib__default$1=_interopDefaultCompat$1(zlib$1),Stream__default$1=_interopDefaultCompat$1(Stream$1);function dataUriToBuffer(c){if(!/^data:/i.test(c))throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');c=c.replace(/\r?\n/g,"");const l=c.indexOf(",");if(l===-1||l<=4)throw new TypeError("malformed data: URI");const d=c.substring(5,l).split(";");let y="",b=!1;const R=d[0]||"text/plain";let w=R;for(let F=1;F<d.length;F++)d[F]==="base64"?b=!0:d[F]&&(w+=`;${d[F]}`,d[F].indexOf("charset=")===0&&(y=d[F].substring(8)));!d[0]&&!y.length&&(w+=";charset=US-ASCII",y="US-ASCII");const v=b?"base64":"ascii",I=unescape(c.substring(l+1)),B=Buffer.from(I,v);return B.type=R,B.typeFull=w,B.charset=y,B}u$1(dataUriToBuffer,"dataUriToBuffer");var ponyfill_es2018={exports:{}};/**
 * @license
 * web-streams-polyfill v3.3.3
 * Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
 * This code is released under the MIT license.
 * SPDX-License-Identifier: MIT
 */var hasRequiredPonyfill_es2018;function requirePonyfill_es2018(){return hasRequiredPonyfill_es2018||(hasRequiredPonyfill_es2018=1,function(c,l){(function(d,y){y(l);})(_commonjsHelpers$1.commonjsGlobal,function(d){function y(){}u$1(y,"noop");function b(n){return typeof n=="object"&&n!==null||typeof n=="function"}u$1(b,"typeIsObject");const R=y;function w(n,o){try{Object.defineProperty(n,"name",{value:o,configurable:!0});}catch{}}u$1(w,"setFunctionName");const v=Promise,I=Promise.prototype.then,B=Promise.reject.bind(v);function F(n){return new v(n)}u$1(F,"newPromise");function k(n){return F(o=>o(n))}u$1(k,"promiseResolvedWith");function T(n){return B(n)}u$1(T,"promiseRejectedWith");function $(n,o,a){return I.call(n,o,a)}u$1($,"PerformPromiseThen");function E(n,o,a){$($(n,o,a),void 0,R);}u$1(E,"uponPromise");function K(n,o){E(n,o);}u$1(K,"uponFulfillment");function U(n,o){E(n,void 0,o);}u$1(U,"uponRejection");function N(n,o,a){return $(n,o,a)}u$1(N,"transformPromiseWith");function J(n){$(n,void 0,R);}u$1(J,"setPromiseIsHandledToTrue");let ge=u$1(n=>{if(typeof queueMicrotask=="function")ge=queueMicrotask;else {const o=k(void 0);ge=u$1(a=>$(o,a),"_queueMicrotask");}return ge(n)},"_queueMicrotask");function M(n,o,a){if(typeof n!="function")throw new TypeError("Argument is not a function");return Function.prototype.apply.call(n,o,a)}u$1(M,"reflectCall");function H(n,o,a){try{return k(M(n,o,a))}catch(p){return T(p)}}u$1(H,"promiseCall");const G=16384,Dr=class Dr{constructor(){this._cursor=0,this._size=0,this._front={_elements:[],_next:void 0},this._back=this._front,this._cursor=0,this._size=0;}get length(){return this._size}push(o){const a=this._back;let p=a;a._elements.length===G-1&&(p={_elements:[],_next:void 0}),a._elements.push(o),p!==a&&(this._back=p,a._next=p),++this._size;}shift(){const o=this._front;let a=o;const p=this._cursor;let g=p+1;const _=o._elements,S=_[p];return g===G&&(a=o._next,g=0),--this._size,this._cursor=g,o!==a&&(this._front=a),_[p]=void 0,S}forEach(o){let a=this._cursor,p=this._front,g=p._elements;for(;(a!==g.length||p._next!==void 0)&&!(a===g.length&&(p=p._next,g=p._elements,a=0,g.length===0));)o(g[a]),++a;}peek(){const o=this._front,a=this._cursor;return o._elements[a]}};u$1(Dr,"SimpleQueue");let Q=Dr;const wt=Symbol("[[AbortSteps]]"),un=Symbol("[[ErrorSteps]]"),er=Symbol("[[CancelSteps]]"),tr=Symbol("[[PullSteps]]"),rr=Symbol("[[ReleaseSteps]]");function ln(n,o){n._ownerReadableStream=o,o._reader=n,o._state==="readable"?or(n):o._state==="closed"?vo(n):fn(n,o._storedError);}u$1(ln,"ReadableStreamReaderGenericInitialize");function nr(n,o){const a=n._ownerReadableStream;return le(a,o)}u$1(nr,"ReadableStreamReaderGenericCancel");function _e(n){const o=n._ownerReadableStream;o._state==="readable"?ir(n,new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")):Eo(n,new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")),o._readableStreamController[rr](),o._reader=void 0,n._ownerReadableStream=void 0;}u$1(_e,"ReadableStreamReaderGenericRelease");function Rt(n){return new TypeError("Cannot "+n+" a stream using a released reader")}u$1(Rt,"readerLockException");function or(n){n._closedPromise=F((o,a)=>{n._closedPromise_resolve=o,n._closedPromise_reject=a;});}u$1(or,"defaultReaderClosedPromiseInitialize");function fn(n,o){or(n),ir(n,o);}u$1(fn,"defaultReaderClosedPromiseInitializeAsRejected");function vo(n){or(n),cn(n);}u$1(vo,"defaultReaderClosedPromiseInitializeAsResolved");function ir(n,o){n._closedPromise_reject!==void 0&&(J(n._closedPromise),n._closedPromise_reject(o),n._closedPromise_resolve=void 0,n._closedPromise_reject=void 0);}u$1(ir,"defaultReaderClosedPromiseReject");function Eo(n,o){fn(n,o);}u$1(Eo,"defaultReaderClosedPromiseResetToRejected");function cn(n){n._closedPromise_resolve!==void 0&&(n._closedPromise_resolve(void 0),n._closedPromise_resolve=void 0,n._closedPromise_reject=void 0);}u$1(cn,"defaultReaderClosedPromiseResolve");const dn=Number.isFinite||function(n){return typeof n=="number"&&isFinite(n)},Ao=Math.trunc||function(n){return n<0?Math.ceil(n):Math.floor(n)};function Bo(n){return typeof n=="object"||typeof n=="function"}u$1(Bo,"isDictionary");function ce(n,o){if(n!==void 0&&!Bo(n))throw new TypeError(`${o} is not an object.`)}u$1(ce,"assertDictionary");function ee(n,o){if(typeof n!="function")throw new TypeError(`${o} is not a function.`)}u$1(ee,"assertFunction");function qo(n){return typeof n=="object"&&n!==null||typeof n=="function"}u$1(qo,"isObject");function hn(n,o){if(!qo(n))throw new TypeError(`${o} is not an object.`)}u$1(hn,"assertObject");function Se(n,o,a){if(n===void 0)throw new TypeError(`Parameter ${o} is required in '${a}'.`)}u$1(Se,"assertRequiredArgument");function sr(n,o,a){if(n===void 0)throw new TypeError(`${o} is required in '${a}'.`)}u$1(sr,"assertRequiredField");function ar(n){return Number(n)}u$1(ar,"convertUnrestrictedDouble");function pn(n){return n===0?0:n}u$1(pn,"censorNegativeZero");function ko(n){return pn(Ao(n))}u$1(ko,"integerPart");function ur(n,o){const p=Number.MAX_SAFE_INTEGER;let g=Number(n);if(g=pn(g),!dn(g))throw new TypeError(`${o} is not a finite number`);if(g=ko(g),g<0||g>p)throw new TypeError(`${o} is outside the accepted range of 0 to ${p}, inclusive`);return !dn(g)||g===0?0:g}u$1(ur,"convertUnsignedLongLongWithEnforceRange");function lr(n,o){if(!qe(n))throw new TypeError(`${o} is not a ReadableStream.`)}u$1(lr,"assertReadableStream");function Ne(n){return new de(n)}u$1(Ne,"AcquireReadableStreamDefaultReader");function bn(n,o){n._reader._readRequests.push(o);}u$1(bn,"ReadableStreamAddReadRequest");function fr(n,o,a){const g=n._reader._readRequests.shift();a?g._closeSteps():g._chunkSteps(o);}u$1(fr,"ReadableStreamFulfillReadRequest");function Tt(n){return n._reader._readRequests.length}u$1(Tt,"ReadableStreamGetNumReadRequests");function mn(n){const o=n._reader;return !(o===void 0||!ve(o))}u$1(mn,"ReadableStreamHasDefaultReader");const Mr=class Mr{constructor(o){if(Se(o,1,"ReadableStreamDefaultReader"),lr(o,"First parameter"),ke(o))throw new TypeError("This stream has already been locked for exclusive reading by another reader");ln(this,o),this._readRequests=new Q;}get closed(){return ve(this)?this._closedPromise:T(Ct("closed"))}cancel(o=void 0){return ve(this)?this._ownerReadableStream===void 0?T(Rt("cancel")):nr(this,o):T(Ct("cancel"))}read(){if(!ve(this))return T(Ct("read"));if(this._ownerReadableStream===void 0)return T(Rt("read from"));let o,a;const p=F((_,S)=>{o=_,a=S;});return it(this,{_chunkSteps:_=>o({value:_,done:!1}),_closeSteps:()=>o({value:void 0,done:!0}),_errorSteps:_=>a(_)}),p}releaseLock(){if(!ve(this))throw Ct("releaseLock");this._ownerReadableStream!==void 0&&Wo(this);}};u$1(Mr,"ReadableStreamDefaultReader");let de=Mr;Object.defineProperties(de.prototype,{cancel:{enumerable:!0},read:{enumerable:!0},releaseLock:{enumerable:!0},closed:{enumerable:!0}}),w(de.prototype.cancel,"cancel"),w(de.prototype.read,"read"),w(de.prototype.releaseLock,"releaseLock"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(de.prototype,Symbol.toStringTag,{value:"ReadableStreamDefaultReader",configurable:!0});function ve(n){return !b(n)||!Object.prototype.hasOwnProperty.call(n,"_readRequests")?!1:n instanceof de}u$1(ve,"IsReadableStreamDefaultReader");function it(n,o){const a=n._ownerReadableStream;a._disturbed=!0,a._state==="closed"?o._closeSteps():a._state==="errored"?o._errorSteps(a._storedError):a._readableStreamController[tr](o);}u$1(it,"ReadableStreamDefaultReaderRead");function Wo(n){_e(n);const o=new TypeError("Reader was released");yn(n,o);}u$1(Wo,"ReadableStreamDefaultReaderRelease");function yn(n,o){const a=n._readRequests;n._readRequests=new Q,a.forEach(p=>{p._errorSteps(o);});}u$1(yn,"ReadableStreamDefaultReaderErrorReadRequests");function Ct(n){return new TypeError(`ReadableStreamDefaultReader.prototype.${n} can only be used on a ReadableStreamDefaultReader`)}u$1(Ct,"defaultReaderBrandCheckException");const Oo=Object.getPrototypeOf(Object.getPrototypeOf(async function*(){}).prototype),xr=class xr{constructor(o,a){this._ongoingPromise=void 0,this._isFinished=!1,this._reader=o,this._preventCancel=a;}next(){const o=u$1(()=>this._nextSteps(),"nextSteps");return this._ongoingPromise=this._ongoingPromise?N(this._ongoingPromise,o,o):o(),this._ongoingPromise}return(o){const a=u$1(()=>this._returnSteps(o),"returnSteps");return this._ongoingPromise?N(this._ongoingPromise,a,a):a()}_nextSteps(){if(this._isFinished)return Promise.resolve({value:void 0,done:!0});const o=this._reader;let a,p;const g=F((S,C)=>{a=S,p=C;});return it(o,{_chunkSteps:S=>{this._ongoingPromise=void 0,ge(()=>a({value:S,done:!1}));},_closeSteps:()=>{this._ongoingPromise=void 0,this._isFinished=!0,_e(o),a({value:void 0,done:!0});},_errorSteps:S=>{this._ongoingPromise=void 0,this._isFinished=!0,_e(o),p(S);}}),g}_returnSteps(o){if(this._isFinished)return Promise.resolve({value:o,done:!0});this._isFinished=!0;const a=this._reader;if(!this._preventCancel){const p=nr(a,o);return _e(a),N(p,()=>({value:o,done:!0}))}return _e(a),k({value:o,done:!0})}};u$1(xr,"ReadableStreamAsyncIteratorImpl");let Pt=xr;const gn={next(){return _n(this)?this._asyncIteratorImpl.next():T(Sn("next"))},return(n){return _n(this)?this._asyncIteratorImpl.return(n):T(Sn("return"))}};Object.setPrototypeOf(gn,Oo);function zo(n,o){const a=Ne(n),p=new Pt(a,o),g=Object.create(gn);return g._asyncIteratorImpl=p,g}u$1(zo,"AcquireReadableStreamAsyncIterator");function _n(n){if(!b(n)||!Object.prototype.hasOwnProperty.call(n,"_asyncIteratorImpl"))return !1;try{return n._asyncIteratorImpl instanceof Pt}catch{return !1}}u$1(_n,"IsReadableStreamAsyncIterator");function Sn(n){return new TypeError(`ReadableStreamAsyncIterator.${n} can only be used on a ReadableSteamAsyncIterator`)}u$1(Sn,"streamAsyncIteratorBrandCheckException");const wn=Number.isNaN||function(n){return n!==n};var cr,dr,hr;function st(n){return n.slice()}u$1(st,"CreateArrayFromList");function Rn(n,o,a,p,g){new Uint8Array(n).set(new Uint8Array(a,p,g),o);}u$1(Rn,"CopyDataBlockBytes");let we=u$1(n=>(typeof n.transfer=="function"?we=u$1(o=>o.transfer(),"TransferArrayBuffer"):typeof structuredClone=="function"?we=u$1(o=>structuredClone(o,{transfer:[o]}),"TransferArrayBuffer"):we=u$1(o=>o,"TransferArrayBuffer"),we(n)),"TransferArrayBuffer"),Ee=u$1(n=>(typeof n.detached=="boolean"?Ee=u$1(o=>o.detached,"IsDetachedBuffer"):Ee=u$1(o=>o.byteLength===0,"IsDetachedBuffer"),Ee(n)),"IsDetachedBuffer");function Tn(n,o,a){if(n.slice)return n.slice(o,a);const p=a-o,g=new ArrayBuffer(p);return Rn(g,0,n,o,p),g}u$1(Tn,"ArrayBufferSlice");function vt(n,o){const a=n[o];if(a!=null){if(typeof a!="function")throw new TypeError(`${String(o)} is not a function`);return a}}u$1(vt,"GetMethod");function Fo(n){const o={[Symbol.iterator]:()=>n.iterator},a=async function*(){return yield*o}(),p=a.next;return {iterator:a,nextMethod:p,done:!1}}u$1(Fo,"CreateAsyncFromSyncIterator");const pr=(hr=(cr=Symbol.asyncIterator)!==null&&cr!==void 0?cr:(dr=Symbol.for)===null||dr===void 0?void 0:dr.call(Symbol,"Symbol.asyncIterator"))!==null&&hr!==void 0?hr:"@@asyncIterator";function Cn(n,o="sync",a){if(a===void 0)if(o==="async"){if(a=vt(n,pr),a===void 0){const _=vt(n,Symbol.iterator),S=Cn(n,"sync",_);return Fo(S)}}else a=vt(n,Symbol.iterator);if(a===void 0)throw new TypeError("The object is not iterable");const p=M(a,n,[]);if(!b(p))throw new TypeError("The iterator method must return an object");const g=p.next;return {iterator:p,nextMethod:g,done:!1}}u$1(Cn,"GetIterator");function Io(n){const o=M(n.nextMethod,n.iterator,[]);if(!b(o))throw new TypeError("The iterator.next() method must return an object");return o}u$1(Io,"IteratorNext");function jo(n){return !!n.done}u$1(jo,"IteratorComplete");function Lo(n){return n.value}u$1(Lo,"IteratorValue");function $o(n){return !(typeof n!="number"||wn(n)||n<0)}u$1($o,"IsNonNegativeNumber");function Pn(n){const o=Tn(n.buffer,n.byteOffset,n.byteOffset+n.byteLength);return new Uint8Array(o)}u$1(Pn,"CloneAsUint8Array");function br(n){const o=n._queue.shift();return n._queueTotalSize-=o.size,n._queueTotalSize<0&&(n._queueTotalSize=0),o.value}u$1(br,"DequeueValue");function mr(n,o,a){if(!$o(a)||a===1/0)throw new RangeError("Size must be a finite, non-NaN, non-negative number.");n._queue.push({value:o,size:a}),n._queueTotalSize+=a;}u$1(mr,"EnqueueValueWithSize");function Do(n){return n._queue.peek().value}u$1(Do,"PeekQueueValue");function Ae(n){n._queue=new Q,n._queueTotalSize=0;}u$1(Ae,"ResetQueue");function vn(n){return n===DataView}u$1(vn,"isDataViewConstructor");function Mo(n){return vn(n.constructor)}u$1(Mo,"isDataView");function xo(n){return vn(n)?1:n.BYTES_PER_ELEMENT}u$1(xo,"arrayBufferViewElementSize");const Ur=class Ur{constructor(){throw new TypeError("Illegal constructor")}get view(){if(!yr(this))throw Rr("view");return this._view}respond(o){if(!yr(this))throw Rr("respond");if(Se(o,1,"respond"),o=ur(o,"First parameter"),this._associatedReadableByteStreamController===void 0)throw new TypeError("This BYOB request has been invalidated");if(Ee(this._view.buffer))throw new TypeError("The BYOB request's buffer has been detached and so cannot be used as a response");qt(this._associatedReadableByteStreamController,o);}respondWithNewView(o){if(!yr(this))throw Rr("respondWithNewView");if(Se(o,1,"respondWithNewView"),!ArrayBuffer.isView(o))throw new TypeError("You can only respond with array buffer views");if(this._associatedReadableByteStreamController===void 0)throw new TypeError("This BYOB request has been invalidated");if(Ee(o.buffer))throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");kt(this._associatedReadableByteStreamController,o);}};u$1(Ur,"ReadableStreamBYOBRequest");let Re=Ur;Object.defineProperties(Re.prototype,{respond:{enumerable:!0},respondWithNewView:{enumerable:!0},view:{enumerable:!0}}),w(Re.prototype.respond,"respond"),w(Re.prototype.respondWithNewView,"respondWithNewView"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(Re.prototype,Symbol.toStringTag,{value:"ReadableStreamBYOBRequest",configurable:!0});const Nr=class Nr{constructor(){throw new TypeError("Illegal constructor")}get byobRequest(){if(!Oe(this))throw ut("byobRequest");return wr(this)}get desiredSize(){if(!Oe(this))throw ut("desiredSize");return In(this)}close(){if(!Oe(this))throw ut("close");if(this._closeRequested)throw new TypeError("The stream has already been closed; do not close it again!");const o=this._controlledReadableByteStream._state;if(o!=="readable")throw new TypeError(`The stream (in ${o} state) is not in the readable state and cannot be closed`);at(this);}enqueue(o){if(!Oe(this))throw ut("enqueue");if(Se(o,1,"enqueue"),!ArrayBuffer.isView(o))throw new TypeError("chunk must be an array buffer view");if(o.byteLength===0)throw new TypeError("chunk must have non-zero byteLength");if(o.buffer.byteLength===0)throw new TypeError("chunk's buffer must have non-zero byteLength");if(this._closeRequested)throw new TypeError("stream is closed or draining");const a=this._controlledReadableByteStream._state;if(a!=="readable")throw new TypeError(`The stream (in ${a} state) is not in the readable state and cannot be enqueued to`);Bt(this,o);}error(o=void 0){if(!Oe(this))throw ut("error");te(this,o);}[er](o){En(this),Ae(this);const a=this._cancelAlgorithm(o);return At(this),a}[tr](o){const a=this._controlledReadableByteStream;if(this._queueTotalSize>0){Fn(this,o);return}const p=this._autoAllocateChunkSize;if(p!==void 0){let g;try{g=new ArrayBuffer(p);}catch(S){o._errorSteps(S);return}const _={buffer:g,bufferByteLength:p,byteOffset:0,byteLength:p,bytesFilled:0,minimumFill:1,elementSize:1,viewConstructor:Uint8Array,readerType:"default"};this._pendingPullIntos.push(_);}bn(a,o),ze(this);}[rr](){if(this._pendingPullIntos.length>0){const o=this._pendingPullIntos.peek();o.readerType="none",this._pendingPullIntos=new Q,this._pendingPullIntos.push(o);}}};u$1(Nr,"ReadableByteStreamController");let ie=Nr;Object.defineProperties(ie.prototype,{close:{enumerable:!0},enqueue:{enumerable:!0},error:{enumerable:!0},byobRequest:{enumerable:!0},desiredSize:{enumerable:!0}}),w(ie.prototype.close,"close"),w(ie.prototype.enqueue,"enqueue"),w(ie.prototype.error,"error"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(ie.prototype,Symbol.toStringTag,{value:"ReadableByteStreamController",configurable:!0});function Oe(n){return !b(n)||!Object.prototype.hasOwnProperty.call(n,"_controlledReadableByteStream")?!1:n instanceof ie}u$1(Oe,"IsReadableByteStreamController");function yr(n){return !b(n)||!Object.prototype.hasOwnProperty.call(n,"_associatedReadableByteStreamController")?!1:n instanceof Re}u$1(yr,"IsReadableStreamBYOBRequest");function ze(n){if(!Qo(n))return;if(n._pulling){n._pullAgain=!0;return}n._pulling=!0;const a=n._pullAlgorithm();E(a,()=>(n._pulling=!1,n._pullAgain&&(n._pullAgain=!1,ze(n)),null),p=>(te(n,p),null));}u$1(ze,"ReadableByteStreamControllerCallPullIfNeeded");function En(n){_r(n),n._pendingPullIntos=new Q;}u$1(En,"ReadableByteStreamControllerClearPendingPullIntos");function gr(n,o){let a=!1;n._state==="closed"&&(a=!0);const p=An(o);o.readerType==="default"?fr(n,p,a):Xo(n,p,a);}u$1(gr,"ReadableByteStreamControllerCommitPullIntoDescriptor");function An(n){const o=n.bytesFilled,a=n.elementSize;return new n.viewConstructor(n.buffer,n.byteOffset,o/a)}u$1(An,"ReadableByteStreamControllerConvertPullIntoDescriptor");function Et(n,o,a,p){n._queue.push({buffer:o,byteOffset:a,byteLength:p}),n._queueTotalSize+=p;}u$1(Et,"ReadableByteStreamControllerEnqueueChunkToQueue");function Bn(n,o,a,p){let g;try{g=Tn(o,a,a+p);}catch(_){throw te(n,_),_}Et(n,g,0,p);}u$1(Bn,"ReadableByteStreamControllerEnqueueClonedChunkToQueue");function qn(n,o){o.bytesFilled>0&&Bn(n,o.buffer,o.byteOffset,o.bytesFilled),He(n);}u$1(qn,"ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue");function kn(n,o){const a=Math.min(n._queueTotalSize,o.byteLength-o.bytesFilled),p=o.bytesFilled+a;let g=a,_=!1;const S=p%o.elementSize,C=p-S;C>=o.minimumFill&&(g=C-o.bytesFilled,_=!0);const q=n._queue;for(;g>0;){const P=q.peek(),W=Math.min(g,P.byteLength),O=o.byteOffset+o.bytesFilled;Rn(o.buffer,O,P.buffer,P.byteOffset,W),P.byteLength===W?q.shift():(P.byteOffset+=W,P.byteLength-=W),n._queueTotalSize-=W,Wn(n,W,o),g-=W;}return _}u$1(kn,"ReadableByteStreamControllerFillPullIntoDescriptorFromQueue");function Wn(n,o,a){a.bytesFilled+=o;}u$1(Wn,"ReadableByteStreamControllerFillHeadPullIntoDescriptor");function On(n){n._queueTotalSize===0&&n._closeRequested?(At(n),pt(n._controlledReadableByteStream)):ze(n);}u$1(On,"ReadableByteStreamControllerHandleQueueDrain");function _r(n){n._byobRequest!==null&&(n._byobRequest._associatedReadableByteStreamController=void 0,n._byobRequest._view=null,n._byobRequest=null);}u$1(_r,"ReadableByteStreamControllerInvalidateBYOBRequest");function Sr(n){for(;n._pendingPullIntos.length>0;){if(n._queueTotalSize===0)return;const o=n._pendingPullIntos.peek();kn(n,o)&&(He(n),gr(n._controlledReadableByteStream,o));}}u$1(Sr,"ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue");function Uo(n){const o=n._controlledReadableByteStream._reader;for(;o._readRequests.length>0;){if(n._queueTotalSize===0)return;const a=o._readRequests.shift();Fn(n,a);}}u$1(Uo,"ReadableByteStreamControllerProcessReadRequestsUsingQueue");function No(n,o,a,p){const g=n._controlledReadableByteStream,_=o.constructor,S=xo(_),{byteOffset:C,byteLength:q}=o,P=a*S;let W;try{W=we(o.buffer);}catch(j){p._errorSteps(j);return}const O={buffer:W,bufferByteLength:W.byteLength,byteOffset:C,byteLength:q,bytesFilled:0,minimumFill:P,elementSize:S,viewConstructor:_,readerType:"byob"};if(n._pendingPullIntos.length>0){n._pendingPullIntos.push(O),$n(g,p);return}if(g._state==="closed"){const j=new _(O.buffer,O.byteOffset,0);p._closeSteps(j);return}if(n._queueTotalSize>0){if(kn(n,O)){const j=An(O);On(n),p._chunkSteps(j);return}if(n._closeRequested){const j=new TypeError("Insufficient bytes to fill elements in the given buffer");te(n,j),p._errorSteps(j);return}}n._pendingPullIntos.push(O),$n(g,p),ze(n);}u$1(No,"ReadableByteStreamControllerPullInto");function Ho(n,o){o.readerType==="none"&&He(n);const a=n._controlledReadableByteStream;if(Tr(a))for(;Dn(a)>0;){const p=He(n);gr(a,p);}}u$1(Ho,"ReadableByteStreamControllerRespondInClosedState");function Vo(n,o,a){if(Wn(n,o,a),a.readerType==="none"){qn(n,a),Sr(n);return}if(a.bytesFilled<a.minimumFill)return;He(n);const p=a.bytesFilled%a.elementSize;if(p>0){const g=a.byteOffset+a.bytesFilled;Bn(n,a.buffer,g-p,p);}a.bytesFilled-=p,gr(n._controlledReadableByteStream,a),Sr(n);}u$1(Vo,"ReadableByteStreamControllerRespondInReadableState");function zn(n,o){const a=n._pendingPullIntos.peek();_r(n),n._controlledReadableByteStream._state==="closed"?Ho(n,a):Vo(n,o,a),ze(n);}u$1(zn,"ReadableByteStreamControllerRespondInternal");function He(n){return n._pendingPullIntos.shift()}u$1(He,"ReadableByteStreamControllerShiftPendingPullInto");function Qo(n){const o=n._controlledReadableByteStream;return o._state!=="readable"||n._closeRequested||!n._started?!1:!!(mn(o)&&Tt(o)>0||Tr(o)&&Dn(o)>0||In(n)>0)}u$1(Qo,"ReadableByteStreamControllerShouldCallPull");function At(n){n._pullAlgorithm=void 0,n._cancelAlgorithm=void 0;}u$1(At,"ReadableByteStreamControllerClearAlgorithms");function at(n){const o=n._controlledReadableByteStream;if(!(n._closeRequested||o._state!=="readable")){if(n._queueTotalSize>0){n._closeRequested=!0;return}if(n._pendingPullIntos.length>0){const a=n._pendingPullIntos.peek();if(a.bytesFilled%a.elementSize!==0){const p=new TypeError("Insufficient bytes to fill elements in the given buffer");throw te(n,p),p}}At(n),pt(o);}}u$1(at,"ReadableByteStreamControllerClose");function Bt(n,o){const a=n._controlledReadableByteStream;if(n._closeRequested||a._state!=="readable")return;const{buffer:p,byteOffset:g,byteLength:_}=o;if(Ee(p))throw new TypeError("chunk's buffer is detached and so cannot be enqueued");const S=we(p);if(n._pendingPullIntos.length>0){const C=n._pendingPullIntos.peek();if(Ee(C.buffer))throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");_r(n),C.buffer=we(C.buffer),C.readerType==="none"&&qn(n,C);}if(mn(a))if(Uo(n),Tt(a)===0)Et(n,S,g,_);else {n._pendingPullIntos.length>0&&He(n);const C=new Uint8Array(S,g,_);fr(a,C,!1);}else Tr(a)?(Et(n,S,g,_),Sr(n)):Et(n,S,g,_);ze(n);}u$1(Bt,"ReadableByteStreamControllerEnqueue");function te(n,o){const a=n._controlledReadableByteStream;a._state==="readable"&&(En(n),Ae(n),At(n),fo(a,o));}u$1(te,"ReadableByteStreamControllerError");function Fn(n,o){const a=n._queue.shift();n._queueTotalSize-=a.byteLength,On(n);const p=new Uint8Array(a.buffer,a.byteOffset,a.byteLength);o._chunkSteps(p);}u$1(Fn,"ReadableByteStreamControllerFillReadRequestFromQueue");function wr(n){if(n._byobRequest===null&&n._pendingPullIntos.length>0){const o=n._pendingPullIntos.peek(),a=new Uint8Array(o.buffer,o.byteOffset+o.bytesFilled,o.byteLength-o.bytesFilled),p=Object.create(Re.prototype);Yo(p,n,a),n._byobRequest=p;}return n._byobRequest}u$1(wr,"ReadableByteStreamControllerGetBYOBRequest");function In(n){const o=n._controlledReadableByteStream._state;return o==="errored"?null:o==="closed"?0:n._strategyHWM-n._queueTotalSize}u$1(In,"ReadableByteStreamControllerGetDesiredSize");function qt(n,o){const a=n._pendingPullIntos.peek();if(n._controlledReadableByteStream._state==="closed"){if(o!==0)throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream")}else {if(o===0)throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");if(a.bytesFilled+o>a.byteLength)throw new RangeError("bytesWritten out of range")}a.buffer=we(a.buffer),zn(n,o);}u$1(qt,"ReadableByteStreamControllerRespond");function kt(n,o){const a=n._pendingPullIntos.peek();if(n._controlledReadableByteStream._state==="closed"){if(o.byteLength!==0)throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream")}else if(o.byteLength===0)throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");if(a.byteOffset+a.bytesFilled!==o.byteOffset)throw new RangeError("The region specified by view does not match byobRequest");if(a.bufferByteLength!==o.buffer.byteLength)throw new RangeError("The buffer of view has different capacity than byobRequest");if(a.bytesFilled+o.byteLength>a.byteLength)throw new RangeError("The region specified by view is larger than byobRequest");const g=o.byteLength;a.buffer=we(o.buffer),zn(n,g);}u$1(kt,"ReadableByteStreamControllerRespondWithNewView");function jn(n,o,a,p,g,_,S){o._controlledReadableByteStream=n,o._pullAgain=!1,o._pulling=!1,o._byobRequest=null,o._queue=o._queueTotalSize=void 0,Ae(o),o._closeRequested=!1,o._started=!1,o._strategyHWM=_,o._pullAlgorithm=p,o._cancelAlgorithm=g,o._autoAllocateChunkSize=S,o._pendingPullIntos=new Q,n._readableStreamController=o;const C=a();E(k(C),()=>(o._started=!0,ze(o),null),q=>(te(o,q),null));}u$1(jn,"SetUpReadableByteStreamController");function Go(n,o,a){const p=Object.create(ie.prototype);let g,_,S;o.start!==void 0?g=u$1(()=>o.start(p),"startAlgorithm"):g=u$1(()=>{},"startAlgorithm"),o.pull!==void 0?_=u$1(()=>o.pull(p),"pullAlgorithm"):_=u$1(()=>k(void 0),"pullAlgorithm"),o.cancel!==void 0?S=u$1(q=>o.cancel(q),"cancelAlgorithm"):S=u$1(()=>k(void 0),"cancelAlgorithm");const C=o.autoAllocateChunkSize;if(C===0)throw new TypeError("autoAllocateChunkSize must be greater than 0");jn(n,p,g,_,S,a,C);}u$1(Go,"SetUpReadableByteStreamControllerFromUnderlyingSource");function Yo(n,o,a){n._associatedReadableByteStreamController=o,n._view=a;}u$1(Yo,"SetUpReadableStreamBYOBRequest");function Rr(n){return new TypeError(`ReadableStreamBYOBRequest.prototype.${n} can only be used on a ReadableStreamBYOBRequest`)}u$1(Rr,"byobRequestBrandCheckException");function ut(n){return new TypeError(`ReadableByteStreamController.prototype.${n} can only be used on a ReadableByteStreamController`)}u$1(ut,"byteStreamControllerBrandCheckException");function Zo(n,o){ce(n,o);const a=n?.mode;return {mode:a===void 0?void 0:Ko(a,`${o} has member 'mode' that`)}}u$1(Zo,"convertReaderOptions");function Ko(n,o){if(n=`${n}`,n!=="byob")throw new TypeError(`${o} '${n}' is not a valid enumeration value for ReadableStreamReaderMode`);return n}u$1(Ko,"convertReadableStreamReaderMode");function Jo(n,o){var a;ce(n,o);const p=(a=n?.min)!==null&&a!==void 0?a:1;return {min:ur(p,`${o} has member 'min' that`)}}u$1(Jo,"convertByobReadOptions");function Ln(n){return new he(n)}u$1(Ln,"AcquireReadableStreamBYOBReader");function $n(n,o){n._reader._readIntoRequests.push(o);}u$1($n,"ReadableStreamAddReadIntoRequest");function Xo(n,o,a){const g=n._reader._readIntoRequests.shift();a?g._closeSteps(o):g._chunkSteps(o);}u$1(Xo,"ReadableStreamFulfillReadIntoRequest");function Dn(n){return n._reader._readIntoRequests.length}u$1(Dn,"ReadableStreamGetNumReadIntoRequests");function Tr(n){const o=n._reader;return !(o===void 0||!Fe(o))}u$1(Tr,"ReadableStreamHasBYOBReader");const Hr=class Hr{constructor(o){if(Se(o,1,"ReadableStreamBYOBReader"),lr(o,"First parameter"),ke(o))throw new TypeError("This stream has already been locked for exclusive reading by another reader");if(!Oe(o._readableStreamController))throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");ln(this,o),this._readIntoRequests=new Q;}get closed(){return Fe(this)?this._closedPromise:T(Wt("closed"))}cancel(o=void 0){return Fe(this)?this._ownerReadableStream===void 0?T(Rt("cancel")):nr(this,o):T(Wt("cancel"))}read(o,a={}){if(!Fe(this))return T(Wt("read"));if(!ArrayBuffer.isView(o))return T(new TypeError("view must be an array buffer view"));if(o.byteLength===0)return T(new TypeError("view must have non-zero byteLength"));if(o.buffer.byteLength===0)return T(new TypeError("view's buffer must have non-zero byteLength"));if(Ee(o.buffer))return T(new TypeError("view's buffer has been detached"));let p;try{p=Jo(a,"options");}catch(P){return T(P)}const g=p.min;if(g===0)return T(new TypeError("options.min must be greater than 0"));if(Mo(o)){if(g>o.byteLength)return T(new RangeError("options.min must be less than or equal to view's byteLength"))}else if(g>o.length)return T(new RangeError("options.min must be less than or equal to view's length"));if(this._ownerReadableStream===void 0)return T(Rt("read from"));let _,S;const C=F((P,W)=>{_=P,S=W;});return Mn(this,o,g,{_chunkSteps:P=>_({value:P,done:!1}),_closeSteps:P=>_({value:P,done:!0}),_errorSteps:P=>S(P)}),C}releaseLock(){if(!Fe(this))throw Wt("releaseLock");this._ownerReadableStream!==void 0&&ei(this);}};u$1(Hr,"ReadableStreamBYOBReader");let he=Hr;Object.defineProperties(he.prototype,{cancel:{enumerable:!0},read:{enumerable:!0},releaseLock:{enumerable:!0},closed:{enumerable:!0}}),w(he.prototype.cancel,"cancel"),w(he.prototype.read,"read"),w(he.prototype.releaseLock,"releaseLock"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(he.prototype,Symbol.toStringTag,{value:"ReadableStreamBYOBReader",configurable:!0});function Fe(n){return !b(n)||!Object.prototype.hasOwnProperty.call(n,"_readIntoRequests")?!1:n instanceof he}u$1(Fe,"IsReadableStreamBYOBReader");function Mn(n,o,a,p){const g=n._ownerReadableStream;g._disturbed=!0,g._state==="errored"?p._errorSteps(g._storedError):No(g._readableStreamController,o,a,p);}u$1(Mn,"ReadableStreamBYOBReaderRead");function ei(n){_e(n);const o=new TypeError("Reader was released");xn(n,o);}u$1(ei,"ReadableStreamBYOBReaderRelease");function xn(n,o){const a=n._readIntoRequests;n._readIntoRequests=new Q,a.forEach(p=>{p._errorSteps(o);});}u$1(xn,"ReadableStreamBYOBReaderErrorReadIntoRequests");function Wt(n){return new TypeError(`ReadableStreamBYOBReader.prototype.${n} can only be used on a ReadableStreamBYOBReader`)}u$1(Wt,"byobReaderBrandCheckException");function lt(n,o){const{highWaterMark:a}=n;if(a===void 0)return o;if(wn(a)||a<0)throw new RangeError("Invalid highWaterMark");return a}u$1(lt,"ExtractHighWaterMark");function Ot(n){const{size:o}=n;return o||(()=>1)}u$1(Ot,"ExtractSizeAlgorithm");function zt(n,o){ce(n,o);const a=n?.highWaterMark,p=n?.size;return {highWaterMark:a===void 0?void 0:ar(a),size:p===void 0?void 0:ti(p,`${o} has member 'size' that`)}}u$1(zt,"convertQueuingStrategy");function ti(n,o){return ee(n,o),a=>ar(n(a))}u$1(ti,"convertQueuingStrategySize");function ri(n,o){ce(n,o);const a=n?.abort,p=n?.close,g=n?.start,_=n?.type,S=n?.write;return {abort:a===void 0?void 0:ni(a,n,`${o} has member 'abort' that`),close:p===void 0?void 0:oi(p,n,`${o} has member 'close' that`),start:g===void 0?void 0:ii(g,n,`${o} has member 'start' that`),write:S===void 0?void 0:si(S,n,`${o} has member 'write' that`),type:_}}u$1(ri,"convertUnderlyingSink");function ni(n,o,a){return ee(n,a),p=>H(n,o,[p])}u$1(ni,"convertUnderlyingSinkAbortCallback");function oi(n,o,a){return ee(n,a),()=>H(n,o,[])}u$1(oi,"convertUnderlyingSinkCloseCallback");function ii(n,o,a){return ee(n,a),p=>M(n,o,[p])}u$1(ii,"convertUnderlyingSinkStartCallback");function si(n,o,a){return ee(n,a),(p,g)=>H(n,o,[p,g])}u$1(si,"convertUnderlyingSinkWriteCallback");function Un(n,o){if(!Ve(n))throw new TypeError(`${o} is not a WritableStream.`)}u$1(Un,"assertWritableStream");function ai(n){if(typeof n!="object"||n===null)return !1;try{return typeof n.aborted=="boolean"}catch{return !1}}u$1(ai,"isAbortSignal");const ui=typeof AbortController=="function";function li(){if(ui)return new AbortController}u$1(li,"createAbortController");const Vr=class Vr{constructor(o={},a={}){o===void 0?o=null:hn(o,"First parameter");const p=zt(a,"Second parameter"),g=ri(o,"First parameter");if(Hn(this),g.type!==void 0)throw new RangeError("Invalid type is specified");const S=Ot(p),C=lt(p,1);Ti(this,g,C,S);}get locked(){if(!Ve(this))throw $t("locked");return Qe(this)}abort(o=void 0){return Ve(this)?Qe(this)?T(new TypeError("Cannot abort a stream that already has a writer")):Ft(this,o):T($t("abort"))}close(){return Ve(this)?Qe(this)?T(new TypeError("Cannot close a stream that already has a writer")):be(this)?T(new TypeError("Cannot close an already-closing stream")):Vn(this):T($t("close"))}getWriter(){if(!Ve(this))throw $t("getWriter");return Nn(this)}};u$1(Vr,"WritableStream");let pe=Vr;Object.defineProperties(pe.prototype,{abort:{enumerable:!0},close:{enumerable:!0},getWriter:{enumerable:!0},locked:{enumerable:!0}}),w(pe.prototype.abort,"abort"),w(pe.prototype.close,"close"),w(pe.prototype.getWriter,"getWriter"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(pe.prototype,Symbol.toStringTag,{value:"WritableStream",configurable:!0});function Nn(n){return new se(n)}u$1(Nn,"AcquireWritableStreamDefaultWriter");function fi(n,o,a,p,g=1,_=()=>1){const S=Object.create(pe.prototype);Hn(S);const C=Object.create(Be.prototype);return Jn(S,C,n,o,a,p,g,_),S}u$1(fi,"CreateWritableStream");function Hn(n){n._state="writable",n._storedError=void 0,n._writer=void 0,n._writableStreamController=void 0,n._writeRequests=new Q,n._inFlightWriteRequest=void 0,n._closeRequest=void 0,n._inFlightCloseRequest=void 0,n._pendingAbortRequest=void 0,n._backpressure=!1;}u$1(Hn,"InitializeWritableStream");function Ve(n){return !b(n)||!Object.prototype.hasOwnProperty.call(n,"_writableStreamController")?!1:n instanceof pe}u$1(Ve,"IsWritableStream");function Qe(n){return n._writer!==void 0}u$1(Qe,"IsWritableStreamLocked");function Ft(n,o){var a;if(n._state==="closed"||n._state==="errored")return k(void 0);n._writableStreamController._abortReason=o,(a=n._writableStreamController._abortController)===null||a===void 0||a.abort(o);const p=n._state;if(p==="closed"||p==="errored")return k(void 0);if(n._pendingAbortRequest!==void 0)return n._pendingAbortRequest._promise;let g=!1;p==="erroring"&&(g=!0,o=void 0);const _=F((S,C)=>{n._pendingAbortRequest={_promise:void 0,_resolve:S,_reject:C,_reason:o,_wasAlreadyErroring:g};});return n._pendingAbortRequest._promise=_,g||Pr(n,o),_}u$1(Ft,"WritableStreamAbort");function Vn(n){const o=n._state;if(o==="closed"||o==="errored")return T(new TypeError(`The stream (in ${o} state) is not in the writable state and cannot be closed`));const a=F((g,_)=>{const S={_resolve:g,_reject:_};n._closeRequest=S;}),p=n._writer;return p!==void 0&&n._backpressure&&o==="writable"&&Or(p),Ci(n._writableStreamController),a}u$1(Vn,"WritableStreamClose");function ci(n){return F((a,p)=>{const g={_resolve:a,_reject:p};n._writeRequests.push(g);})}u$1(ci,"WritableStreamAddWriteRequest");function Cr(n,o){if(n._state==="writable"){Pr(n,o);return}vr(n);}u$1(Cr,"WritableStreamDealWithRejection");function Pr(n,o){const a=n._writableStreamController;n._state="erroring",n._storedError=o;const p=n._writer;p!==void 0&&Gn(p,o),!mi(n)&&a._started&&vr(n);}u$1(Pr,"WritableStreamStartErroring");function vr(n){n._state="errored",n._writableStreamController[un]();const o=n._storedError;if(n._writeRequests.forEach(g=>{g._reject(o);}),n._writeRequests=new Q,n._pendingAbortRequest===void 0){It(n);return}const a=n._pendingAbortRequest;if(n._pendingAbortRequest=void 0,a._wasAlreadyErroring){a._reject(o),It(n);return}const p=n._writableStreamController[wt](a._reason);E(p,()=>(a._resolve(),It(n),null),g=>(a._reject(g),It(n),null));}u$1(vr,"WritableStreamFinishErroring");function di(n){n._inFlightWriteRequest._resolve(void 0),n._inFlightWriteRequest=void 0;}u$1(di,"WritableStreamFinishInFlightWrite");function hi(n,o){n._inFlightWriteRequest._reject(o),n._inFlightWriteRequest=void 0,Cr(n,o);}u$1(hi,"WritableStreamFinishInFlightWriteWithError");function pi(n){n._inFlightCloseRequest._resolve(void 0),n._inFlightCloseRequest=void 0,n._state==="erroring"&&(n._storedError=void 0,n._pendingAbortRequest!==void 0&&(n._pendingAbortRequest._resolve(),n._pendingAbortRequest=void 0)),n._state="closed";const a=n._writer;a!==void 0&&ro(a);}u$1(pi,"WritableStreamFinishInFlightClose");function bi(n,o){n._inFlightCloseRequest._reject(o),n._inFlightCloseRequest=void 0,n._pendingAbortRequest!==void 0&&(n._pendingAbortRequest._reject(o),n._pendingAbortRequest=void 0),Cr(n,o);}u$1(bi,"WritableStreamFinishInFlightCloseWithError");function be(n){return !(n._closeRequest===void 0&&n._inFlightCloseRequest===void 0)}u$1(be,"WritableStreamCloseQueuedOrInFlight");function mi(n){return !(n._inFlightWriteRequest===void 0&&n._inFlightCloseRequest===void 0)}u$1(mi,"WritableStreamHasOperationMarkedInFlight");function yi(n){n._inFlightCloseRequest=n._closeRequest,n._closeRequest=void 0;}u$1(yi,"WritableStreamMarkCloseRequestInFlight");function gi(n){n._inFlightWriteRequest=n._writeRequests.shift();}u$1(gi,"WritableStreamMarkFirstWriteRequestInFlight");function It(n){n._closeRequest!==void 0&&(n._closeRequest._reject(n._storedError),n._closeRequest=void 0);const o=n._writer;o!==void 0&&kr(o,n._storedError);}u$1(It,"WritableStreamRejectCloseAndClosedPromiseIfNeeded");function Er(n,o){const a=n._writer;a!==void 0&&o!==n._backpressure&&(o?ki(a):Or(a)),n._backpressure=o;}u$1(Er,"WritableStreamUpdateBackpressure");const Qr=class Qr{constructor(o){if(Se(o,1,"WritableStreamDefaultWriter"),Un(o,"First parameter"),Qe(o))throw new TypeError("This stream has already been locked for exclusive writing by another writer");this._ownerWritableStream=o,o._writer=this;const a=o._state;if(a==="writable")!be(o)&&o._backpressure?Mt(this):no(this),Dt(this);else if(a==="erroring")Wr(this,o._storedError),Dt(this);else if(a==="closed")no(this),Bi(this);else {const p=o._storedError;Wr(this,p),to(this,p);}}get closed(){return Ie(this)?this._closedPromise:T(je("closed"))}get desiredSize(){if(!Ie(this))throw je("desiredSize");if(this._ownerWritableStream===void 0)throw ct("desiredSize");return Ri(this)}get ready(){return Ie(this)?this._readyPromise:T(je("ready"))}abort(o=void 0){return Ie(this)?this._ownerWritableStream===void 0?T(ct("abort")):_i(this,o):T(je("abort"))}close(){if(!Ie(this))return T(je("close"));const o=this._ownerWritableStream;return o===void 0?T(ct("close")):be(o)?T(new TypeError("Cannot close an already-closing stream")):Qn(this)}releaseLock(){if(!Ie(this))throw je("releaseLock");this._ownerWritableStream!==void 0&&Yn(this);}write(o=void 0){return Ie(this)?this._ownerWritableStream===void 0?T(ct("write to")):Zn(this,o):T(je("write"))}};u$1(Qr,"WritableStreamDefaultWriter");let se=Qr;Object.defineProperties(se.prototype,{abort:{enumerable:!0},close:{enumerable:!0},releaseLock:{enumerable:!0},write:{enumerable:!0},closed:{enumerable:!0},desiredSize:{enumerable:!0},ready:{enumerable:!0}}),w(se.prototype.abort,"abort"),w(se.prototype.close,"close"),w(se.prototype.releaseLock,"releaseLock"),w(se.prototype.write,"write"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(se.prototype,Symbol.toStringTag,{value:"WritableStreamDefaultWriter",configurable:!0});function Ie(n){return !b(n)||!Object.prototype.hasOwnProperty.call(n,"_ownerWritableStream")?!1:n instanceof se}u$1(Ie,"IsWritableStreamDefaultWriter");function _i(n,o){const a=n._ownerWritableStream;return Ft(a,o)}u$1(_i,"WritableStreamDefaultWriterAbort");function Qn(n){const o=n._ownerWritableStream;return Vn(o)}u$1(Qn,"WritableStreamDefaultWriterClose");function Si(n){const o=n._ownerWritableStream,a=o._state;return be(o)||a==="closed"?k(void 0):a==="errored"?T(o._storedError):Qn(n)}u$1(Si,"WritableStreamDefaultWriterCloseWithErrorPropagation");function wi(n,o){n._closedPromiseState==="pending"?kr(n,o):qi(n,o);}u$1(wi,"WritableStreamDefaultWriterEnsureClosedPromiseRejected");function Gn(n,o){n._readyPromiseState==="pending"?oo(n,o):Wi(n,o);}u$1(Gn,"WritableStreamDefaultWriterEnsureReadyPromiseRejected");function Ri(n){const o=n._ownerWritableStream,a=o._state;return a==="errored"||a==="erroring"?null:a==="closed"?0:Xn(o._writableStreamController)}u$1(Ri,"WritableStreamDefaultWriterGetDesiredSize");function Yn(n){const o=n._ownerWritableStream,a=new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");Gn(n,a),wi(n,a),o._writer=void 0,n._ownerWritableStream=void 0;}u$1(Yn,"WritableStreamDefaultWriterRelease");function Zn(n,o){const a=n._ownerWritableStream,p=a._writableStreamController,g=Pi(p,o);if(a!==n._ownerWritableStream)return T(ct("write to"));const _=a._state;if(_==="errored")return T(a._storedError);if(be(a)||_==="closed")return T(new TypeError("The stream is closing or closed and cannot be written to"));if(_==="erroring")return T(a._storedError);const S=ci(a);return vi(p,o,g),S}u$1(Zn,"WritableStreamDefaultWriterWrite");const Kn={},Gr=class Gr{constructor(){throw new TypeError("Illegal constructor")}get abortReason(){if(!Ar(this))throw qr("abortReason");return this._abortReason}get signal(){if(!Ar(this))throw qr("signal");if(this._abortController===void 0)throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");return this._abortController.signal}error(o=void 0){if(!Ar(this))throw qr("error");this._controlledWritableStream._state==="writable"&&eo(this,o);}[wt](o){const a=this._abortAlgorithm(o);return jt(this),a}[un](){Ae(this);}};u$1(Gr,"WritableStreamDefaultController");let Be=Gr;Object.defineProperties(Be.prototype,{abortReason:{enumerable:!0},signal:{enumerable:!0},error:{enumerable:!0}}),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(Be.prototype,Symbol.toStringTag,{value:"WritableStreamDefaultController",configurable:!0});function Ar(n){return !b(n)||!Object.prototype.hasOwnProperty.call(n,"_controlledWritableStream")?!1:n instanceof Be}u$1(Ar,"IsWritableStreamDefaultController");function Jn(n,o,a,p,g,_,S,C){o._controlledWritableStream=n,n._writableStreamController=o,o._queue=void 0,o._queueTotalSize=void 0,Ae(o),o._abortReason=void 0,o._abortController=li(),o._started=!1,o._strategySizeAlgorithm=C,o._strategyHWM=S,o._writeAlgorithm=p,o._closeAlgorithm=g,o._abortAlgorithm=_;const q=Br(o);Er(n,q);const P=a(),W=k(P);E(W,()=>(o._started=!0,Lt(o),null),O=>(o._started=!0,Cr(n,O),null));}u$1(Jn,"SetUpWritableStreamDefaultController");function Ti(n,o,a,p){const g=Object.create(Be.prototype);let _,S,C,q;o.start!==void 0?_=u$1(()=>o.start(g),"startAlgorithm"):_=u$1(()=>{},"startAlgorithm"),o.write!==void 0?S=u$1(P=>o.write(P,g),"writeAlgorithm"):S=u$1(()=>k(void 0),"writeAlgorithm"),o.close!==void 0?C=u$1(()=>o.close(),"closeAlgorithm"):C=u$1(()=>k(void 0),"closeAlgorithm"),o.abort!==void 0?q=u$1(P=>o.abort(P),"abortAlgorithm"):q=u$1(()=>k(void 0),"abortAlgorithm"),Jn(n,g,_,S,C,q,a,p);}u$1(Ti,"SetUpWritableStreamDefaultControllerFromUnderlyingSink");function jt(n){n._writeAlgorithm=void 0,n._closeAlgorithm=void 0,n._abortAlgorithm=void 0,n._strategySizeAlgorithm=void 0;}u$1(jt,"WritableStreamDefaultControllerClearAlgorithms");function Ci(n){mr(n,Kn,0),Lt(n);}u$1(Ci,"WritableStreamDefaultControllerClose");function Pi(n,o){try{return n._strategySizeAlgorithm(o)}catch(a){return ft(n,a),1}}u$1(Pi,"WritableStreamDefaultControllerGetChunkSize");function Xn(n){return n._strategyHWM-n._queueTotalSize}u$1(Xn,"WritableStreamDefaultControllerGetDesiredSize");function vi(n,o,a){try{mr(n,o,a);}catch(g){ft(n,g);return}const p=n._controlledWritableStream;if(!be(p)&&p._state==="writable"){const g=Br(n);Er(p,g);}Lt(n);}u$1(vi,"WritableStreamDefaultControllerWrite");function Lt(n){const o=n._controlledWritableStream;if(!n._started||o._inFlightWriteRequest!==void 0)return;if(o._state==="erroring"){vr(o);return}if(n._queue.length===0)return;const p=Do(n);p===Kn?Ei(n):Ai(n,p);}u$1(Lt,"WritableStreamDefaultControllerAdvanceQueueIfNeeded");function ft(n,o){n._controlledWritableStream._state==="writable"&&eo(n,o);}u$1(ft,"WritableStreamDefaultControllerErrorIfNeeded");function Ei(n){const o=n._controlledWritableStream;yi(o),br(n);const a=n._closeAlgorithm();jt(n),E(a,()=>(pi(o),null),p=>(bi(o,p),null));}u$1(Ei,"WritableStreamDefaultControllerProcessClose");function Ai(n,o){const a=n._controlledWritableStream;gi(a);const p=n._writeAlgorithm(o);E(p,()=>{di(a);const g=a._state;if(br(n),!be(a)&&g==="writable"){const _=Br(n);Er(a,_);}return Lt(n),null},g=>(a._state==="writable"&&jt(n),hi(a,g),null));}u$1(Ai,"WritableStreamDefaultControllerProcessWrite");function Br(n){return Xn(n)<=0}u$1(Br,"WritableStreamDefaultControllerGetBackpressure");function eo(n,o){const a=n._controlledWritableStream;jt(n),Pr(a,o);}u$1(eo,"WritableStreamDefaultControllerError");function $t(n){return new TypeError(`WritableStream.prototype.${n} can only be used on a WritableStream`)}u$1($t,"streamBrandCheckException$2");function qr(n){return new TypeError(`WritableStreamDefaultController.prototype.${n} can only be used on a WritableStreamDefaultController`)}u$1(qr,"defaultControllerBrandCheckException$2");function je(n){return new TypeError(`WritableStreamDefaultWriter.prototype.${n} can only be used on a WritableStreamDefaultWriter`)}u$1(je,"defaultWriterBrandCheckException");function ct(n){return new TypeError("Cannot "+n+" a stream using a released writer")}u$1(ct,"defaultWriterLockException");function Dt(n){n._closedPromise=F((o,a)=>{n._closedPromise_resolve=o,n._closedPromise_reject=a,n._closedPromiseState="pending";});}u$1(Dt,"defaultWriterClosedPromiseInitialize");function to(n,o){Dt(n),kr(n,o);}u$1(to,"defaultWriterClosedPromiseInitializeAsRejected");function Bi(n){Dt(n),ro(n);}u$1(Bi,"defaultWriterClosedPromiseInitializeAsResolved");function kr(n,o){n._closedPromise_reject!==void 0&&(J(n._closedPromise),n._closedPromise_reject(o),n._closedPromise_resolve=void 0,n._closedPromise_reject=void 0,n._closedPromiseState="rejected");}u$1(kr,"defaultWriterClosedPromiseReject");function qi(n,o){to(n,o);}u$1(qi,"defaultWriterClosedPromiseResetToRejected");function ro(n){n._closedPromise_resolve!==void 0&&(n._closedPromise_resolve(void 0),n._closedPromise_resolve=void 0,n._closedPromise_reject=void 0,n._closedPromiseState="resolved");}u$1(ro,"defaultWriterClosedPromiseResolve");function Mt(n){n._readyPromise=F((o,a)=>{n._readyPromise_resolve=o,n._readyPromise_reject=a;}),n._readyPromiseState="pending";}u$1(Mt,"defaultWriterReadyPromiseInitialize");function Wr(n,o){Mt(n),oo(n,o);}u$1(Wr,"defaultWriterReadyPromiseInitializeAsRejected");function no(n){Mt(n),Or(n);}u$1(no,"defaultWriterReadyPromiseInitializeAsResolved");function oo(n,o){n._readyPromise_reject!==void 0&&(J(n._readyPromise),n._readyPromise_reject(o),n._readyPromise_resolve=void 0,n._readyPromise_reject=void 0,n._readyPromiseState="rejected");}u$1(oo,"defaultWriterReadyPromiseReject");function ki(n){Mt(n);}u$1(ki,"defaultWriterReadyPromiseReset");function Wi(n,o){Wr(n,o);}u$1(Wi,"defaultWriterReadyPromiseResetToRejected");function Or(n){n._readyPromise_resolve!==void 0&&(n._readyPromise_resolve(void 0),n._readyPromise_resolve=void 0,n._readyPromise_reject=void 0,n._readyPromiseState="fulfilled");}u$1(Or,"defaultWriterReadyPromiseResolve");function Oi(){if(typeof globalThis<"u")return globalThis;if(typeof self<"u")return self;if(typeof _commonjsHelpers$1.commonjsGlobal<"u")return _commonjsHelpers$1.commonjsGlobal}u$1(Oi,"getGlobals");const zr=Oi();function zi(n){if(!(typeof n=="function"||typeof n=="object")||n.name!=="DOMException")return !1;try{return new n,!0}catch{return !1}}u$1(zi,"isDOMExceptionConstructor");function Fi(){const n=zr?.DOMException;return zi(n)?n:void 0}u$1(Fi,"getFromGlobal");function Ii(){const n=u$1(function(a,p){this.message=a||"",this.name=p||"Error",Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor);},"DOMException");return w(n,"DOMException"),n.prototype=Object.create(Error.prototype),Object.defineProperty(n.prototype,"constructor",{value:n,writable:!0,configurable:!0}),n}u$1(Ii,"createPolyfill");const ji=Fi()||Ii();function io(n,o,a,p,g,_){const S=Ne(n),C=Nn(o);n._disturbed=!0;let q=!1,P=k(void 0);return F((W,O)=>{let j;if(_!==void 0){if(j=u$1(()=>{const A=_.reason!==void 0?_.reason:new ji("Aborted","AbortError"),z=[];p||z.push(()=>o._state==="writable"?Ft(o,A):k(void 0)),g||z.push(()=>n._state==="readable"?le(n,A):k(void 0)),Z(()=>Promise.all(z.map(L=>L())),!0,A);},"abortAlgorithm"),_.aborted){j();return}_.addEventListener("abort",j);}function fe(){return F((A,z)=>{function L(X){X?A():$(et(),L,z);}u$1(L,"next"),L(!1);})}u$1(fe,"pipeLoop");function et(){return q?k(!0):$(C._readyPromise,()=>F((A,z)=>{it(S,{_chunkSteps:L=>{P=$(Zn(C,L),void 0,y),A(!1);},_closeSteps:()=>A(!0),_errorSteps:z});}))}if(u$1(et,"pipeStep"),Te(n,S._closedPromise,A=>(p?re(!0,A):Z(()=>Ft(o,A),!0,A),null)),Te(o,C._closedPromise,A=>(g?re(!0,A):Z(()=>le(n,A),!0,A),null)),Y(n,S._closedPromise,()=>(a?re():Z(()=>Si(C)),null)),be(o)||o._state==="closed"){const A=new TypeError("the destination writable stream closed before all data could be piped to it");g?re(!0,A):Z(()=>le(n,A),!0,A);}J(fe());function We(){const A=P;return $(P,()=>A!==P?We():void 0)}u$1(We,"waitForWritesToFinish");function Te(A,z,L){A._state==="errored"?L(A._storedError):U(z,L);}u$1(Te,"isOrBecomesErrored");function Y(A,z,L){A._state==="closed"?L():K(z,L);}u$1(Y,"isOrBecomesClosed");function Z(A,z,L){if(q)return;q=!0,o._state==="writable"&&!be(o)?K(We(),X):X();function X(){return E(A(),()=>Ce(z,L),tt=>Ce(!0,tt)),null}u$1(X,"doTheRest");}u$1(Z,"shutdownWithAction");function re(A,z){q||(q=!0,o._state==="writable"&&!be(o)?K(We(),()=>Ce(A,z)):Ce(A,z));}u$1(re,"shutdown");function Ce(A,z){return Yn(C),_e(S),_!==void 0&&_.removeEventListener("abort",j),A?O(z):W(void 0),null}u$1(Ce,"finalize");})}u$1(io,"ReadableStreamPipeTo");const Yr=class Yr{constructor(){throw new TypeError("Illegal constructor")}get desiredSize(){if(!xt(this))throw Nt("desiredSize");return Fr(this)}close(){if(!xt(this))throw Nt("close");if(!Ye(this))throw new TypeError("The stream is not in a state that permits close");Le(this);}enqueue(o=void 0){if(!xt(this))throw Nt("enqueue");if(!Ye(this))throw new TypeError("The stream is not in a state that permits enqueue");return Ge(this,o)}error(o=void 0){if(!xt(this))throw Nt("error");ue(this,o);}[er](o){Ae(this);const a=this._cancelAlgorithm(o);return Ut(this),a}[tr](o){const a=this._controlledReadableStream;if(this._queue.length>0){const p=br(this);this._closeRequested&&this._queue.length===0?(Ut(this),pt(a)):dt(this),o._chunkSteps(p);}else bn(a,o),dt(this);}[rr](){}};u$1(Yr,"ReadableStreamDefaultController");let ae=Yr;Object.defineProperties(ae.prototype,{close:{enumerable:!0},enqueue:{enumerable:!0},error:{enumerable:!0},desiredSize:{enumerable:!0}}),w(ae.prototype.close,"close"),w(ae.prototype.enqueue,"enqueue"),w(ae.prototype.error,"error"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(ae.prototype,Symbol.toStringTag,{value:"ReadableStreamDefaultController",configurable:!0});function xt(n){return !b(n)||!Object.prototype.hasOwnProperty.call(n,"_controlledReadableStream")?!1:n instanceof ae}u$1(xt,"IsReadableStreamDefaultController");function dt(n){if(!so(n))return;if(n._pulling){n._pullAgain=!0;return}n._pulling=!0;const a=n._pullAlgorithm();E(a,()=>(n._pulling=!1,n._pullAgain&&(n._pullAgain=!1,dt(n)),null),p=>(ue(n,p),null));}u$1(dt,"ReadableStreamDefaultControllerCallPullIfNeeded");function so(n){const o=n._controlledReadableStream;return !Ye(n)||!n._started?!1:!!(ke(o)&&Tt(o)>0||Fr(n)>0)}u$1(so,"ReadableStreamDefaultControllerShouldCallPull");function Ut(n){n._pullAlgorithm=void 0,n._cancelAlgorithm=void 0,n._strategySizeAlgorithm=void 0;}u$1(Ut,"ReadableStreamDefaultControllerClearAlgorithms");function Le(n){if(!Ye(n))return;const o=n._controlledReadableStream;n._closeRequested=!0,n._queue.length===0&&(Ut(n),pt(o));}u$1(Le,"ReadableStreamDefaultControllerClose");function Ge(n,o){if(!Ye(n))return;const a=n._controlledReadableStream;if(ke(a)&&Tt(a)>0)fr(a,o,!1);else {let p;try{p=n._strategySizeAlgorithm(o);}catch(g){throw ue(n,g),g}try{mr(n,o,p);}catch(g){throw ue(n,g),g}}dt(n);}u$1(Ge,"ReadableStreamDefaultControllerEnqueue");function ue(n,o){const a=n._controlledReadableStream;a._state==="readable"&&(Ae(n),Ut(n),fo(a,o));}u$1(ue,"ReadableStreamDefaultControllerError");function Fr(n){const o=n._controlledReadableStream._state;return o==="errored"?null:o==="closed"?0:n._strategyHWM-n._queueTotalSize}u$1(Fr,"ReadableStreamDefaultControllerGetDesiredSize");function Li(n){return !so(n)}u$1(Li,"ReadableStreamDefaultControllerHasBackpressure");function Ye(n){const o=n._controlledReadableStream._state;return !n._closeRequested&&o==="readable"}u$1(Ye,"ReadableStreamDefaultControllerCanCloseOrEnqueue");function ao(n,o,a,p,g,_,S){o._controlledReadableStream=n,o._queue=void 0,o._queueTotalSize=void 0,Ae(o),o._started=!1,o._closeRequested=!1,o._pullAgain=!1,o._pulling=!1,o._strategySizeAlgorithm=S,o._strategyHWM=_,o._pullAlgorithm=p,o._cancelAlgorithm=g,n._readableStreamController=o;const C=a();E(k(C),()=>(o._started=!0,dt(o),null),q=>(ue(o,q),null));}u$1(ao,"SetUpReadableStreamDefaultController");function $i(n,o,a,p){const g=Object.create(ae.prototype);let _,S,C;o.start!==void 0?_=u$1(()=>o.start(g),"startAlgorithm"):_=u$1(()=>{},"startAlgorithm"),o.pull!==void 0?S=u$1(()=>o.pull(g),"pullAlgorithm"):S=u$1(()=>k(void 0),"pullAlgorithm"),o.cancel!==void 0?C=u$1(q=>o.cancel(q),"cancelAlgorithm"):C=u$1(()=>k(void 0),"cancelAlgorithm"),ao(n,g,_,S,C,a,p);}u$1($i,"SetUpReadableStreamDefaultControllerFromUnderlyingSource");function Nt(n){return new TypeError(`ReadableStreamDefaultController.prototype.${n} can only be used on a ReadableStreamDefaultController`)}u$1(Nt,"defaultControllerBrandCheckException$1");function Di(n,o){return Oe(n._readableStreamController)?xi(n):Mi(n)}u$1(Di,"ReadableStreamTee");function Mi(n,o){const a=Ne(n);let p=!1,g=!1,_=!1,S=!1,C,q,P,W,O;const j=F(Y=>{O=Y;});function fe(){return p?(g=!0,k(void 0)):(p=!0,it(a,{_chunkSteps:Z=>{ge(()=>{g=!1;const re=Z,Ce=Z;_||Ge(P._readableStreamController,re),S||Ge(W._readableStreamController,Ce),p=!1,g&&fe();});},_closeSteps:()=>{p=!1,_||Le(P._readableStreamController),S||Le(W._readableStreamController),(!_||!S)&&O(void 0);},_errorSteps:()=>{p=!1;}}),k(void 0))}u$1(fe,"pullAlgorithm");function et(Y){if(_=!0,C=Y,S){const Z=st([C,q]),re=le(n,Z);O(re);}return j}u$1(et,"cancel1Algorithm");function We(Y){if(S=!0,q=Y,_){const Z=st([C,q]),re=le(n,Z);O(re);}return j}u$1(We,"cancel2Algorithm");function Te(){}return u$1(Te,"startAlgorithm"),P=ht(Te,fe,et),W=ht(Te,fe,We),U(a._closedPromise,Y=>(ue(P._readableStreamController,Y),ue(W._readableStreamController,Y),(!_||!S)&&O(void 0),null)),[P,W]}u$1(Mi,"ReadableStreamDefaultTee");function xi(n){let o=Ne(n),a=!1,p=!1,g=!1,_=!1,S=!1,C,q,P,W,O;const j=F(A=>{O=A;});function fe(A){U(A._closedPromise,z=>(A!==o||(te(P._readableStreamController,z),te(W._readableStreamController,z),(!_||!S)&&O(void 0)),null));}u$1(fe,"forwardReaderError");function et(){Fe(o)&&(_e(o),o=Ne(n),fe(o)),it(o,{_chunkSteps:z=>{ge(()=>{p=!1,g=!1;const L=z;let X=z;if(!_&&!S)try{X=Pn(z);}catch(tt){te(P._readableStreamController,tt),te(W._readableStreamController,tt),O(le(n,tt));return}_||Bt(P._readableStreamController,L),S||Bt(W._readableStreamController,X),a=!1,p?Te():g&&Y();});},_closeSteps:()=>{a=!1,_||at(P._readableStreamController),S||at(W._readableStreamController),P._readableStreamController._pendingPullIntos.length>0&&qt(P._readableStreamController,0),W._readableStreamController._pendingPullIntos.length>0&&qt(W._readableStreamController,0),(!_||!S)&&O(void 0);},_errorSteps:()=>{a=!1;}});}u$1(et,"pullWithDefaultReader");function We(A,z){ve(o)&&(_e(o),o=Ln(n),fe(o));const L=z?W:P,X=z?P:W;Mn(o,A,1,{_chunkSteps:rt=>{ge(()=>{p=!1,g=!1;const nt=z?S:_;if(z?_:S)nt||kt(L._readableStreamController,rt);else {let Co;try{Co=Pn(rt);}catch(tn){te(L._readableStreamController,tn),te(X._readableStreamController,tn),O(le(n,tn));return}nt||kt(L._readableStreamController,rt),Bt(X._readableStreamController,Co);}a=!1,p?Te():g&&Y();});},_closeSteps:rt=>{a=!1;const nt=z?S:_,Yt=z?_:S;nt||at(L._readableStreamController),Yt||at(X._readableStreamController),rt!==void 0&&(nt||kt(L._readableStreamController,rt),!Yt&&X._readableStreamController._pendingPullIntos.length>0&&qt(X._readableStreamController,0)),(!nt||!Yt)&&O(void 0);},_errorSteps:()=>{a=!1;}});}u$1(We,"pullWithBYOBReader");function Te(){if(a)return p=!0,k(void 0);a=!0;const A=wr(P._readableStreamController);return A===null?et():We(A._view,!1),k(void 0)}u$1(Te,"pull1Algorithm");function Y(){if(a)return g=!0,k(void 0);a=!0;const A=wr(W._readableStreamController);return A===null?et():We(A._view,!0),k(void 0)}u$1(Y,"pull2Algorithm");function Z(A){if(_=!0,C=A,S){const z=st([C,q]),L=le(n,z);O(L);}return j}u$1(Z,"cancel1Algorithm");function re(A){if(S=!0,q=A,_){const z=st([C,q]),L=le(n,z);O(L);}return j}u$1(re,"cancel2Algorithm");function Ce(){}return u$1(Ce,"startAlgorithm"),P=lo(Ce,Te,Z),W=lo(Ce,Y,re),fe(o),[P,W]}u$1(xi,"ReadableByteStreamTee");function Ui(n){return b(n)&&typeof n.getReader<"u"}u$1(Ui,"isReadableStreamLike");function Ni(n){return Ui(n)?Vi(n.getReader()):Hi(n)}u$1(Ni,"ReadableStreamFrom");function Hi(n){let o;const a=Cn(n,"async"),p=y;function g(){let S;try{S=Io(a);}catch(q){return T(q)}const C=k(S);return N(C,q=>{if(!b(q))throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");if(jo(q))Le(o._readableStreamController);else {const W=Lo(q);Ge(o._readableStreamController,W);}})}u$1(g,"pullAlgorithm");function _(S){const C=a.iterator;let q;try{q=vt(C,"return");}catch(O){return T(O)}if(q===void 0)return k(void 0);let P;try{P=M(q,C,[S]);}catch(O){return T(O)}const W=k(P);return N(W,O=>{if(!b(O))throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object")})}return u$1(_,"cancelAlgorithm"),o=ht(p,g,_,0),o}u$1(Hi,"ReadableStreamFromIterable");function Vi(n){let o;const a=y;function p(){let _;try{_=n.read();}catch(S){return T(S)}return N(_,S=>{if(!b(S))throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");if(S.done)Le(o._readableStreamController);else {const C=S.value;Ge(o._readableStreamController,C);}})}u$1(p,"pullAlgorithm");function g(_){try{return k(n.cancel(_))}catch(S){return T(S)}}return u$1(g,"cancelAlgorithm"),o=ht(a,p,g,0),o}u$1(Vi,"ReadableStreamFromDefaultReader");function Qi(n,o){ce(n,o);const a=n,p=a?.autoAllocateChunkSize,g=a?.cancel,_=a?.pull,S=a?.start,C=a?.type;return {autoAllocateChunkSize:p===void 0?void 0:ur(p,`${o} has member 'autoAllocateChunkSize' that`),cancel:g===void 0?void 0:Gi(g,a,`${o} has member 'cancel' that`),pull:_===void 0?void 0:Yi(_,a,`${o} has member 'pull' that`),start:S===void 0?void 0:Zi(S,a,`${o} has member 'start' that`),type:C===void 0?void 0:Ki(C,`${o} has member 'type' that`)}}u$1(Qi,"convertUnderlyingDefaultOrByteSource");function Gi(n,o,a){return ee(n,a),p=>H(n,o,[p])}u$1(Gi,"convertUnderlyingSourceCancelCallback");function Yi(n,o,a){return ee(n,a),p=>H(n,o,[p])}u$1(Yi,"convertUnderlyingSourcePullCallback");function Zi(n,o,a){return ee(n,a),p=>M(n,o,[p])}u$1(Zi,"convertUnderlyingSourceStartCallback");function Ki(n,o){if(n=`${n}`,n!=="bytes")throw new TypeError(`${o} '${n}' is not a valid enumeration value for ReadableStreamType`);return n}u$1(Ki,"convertReadableStreamType");function Ji(n,o){return ce(n,o),{preventCancel:!!n?.preventCancel}}u$1(Ji,"convertIteratorOptions");function uo(n,o){ce(n,o);const a=n?.preventAbort,p=n?.preventCancel,g=n?.preventClose,_=n?.signal;return _!==void 0&&Xi(_,`${o} has member 'signal' that`),{preventAbort:!!a,preventCancel:!!p,preventClose:!!g,signal:_}}u$1(uo,"convertPipeOptions");function Xi(n,o){if(!ai(n))throw new TypeError(`${o} is not an AbortSignal.`)}u$1(Xi,"assertAbortSignal");function es(n,o){ce(n,o);const a=n?.readable;sr(a,"readable","ReadableWritablePair"),lr(a,`${o} has member 'readable' that`);const p=n?.writable;return sr(p,"writable","ReadableWritablePair"),Un(p,`${o} has member 'writable' that`),{readable:a,writable:p}}u$1(es,"convertReadableWritablePair");const Zr=class Zr{constructor(o={},a={}){o===void 0?o=null:hn(o,"First parameter");const p=zt(a,"Second parameter"),g=Qi(o,"First parameter");if(Ir(this),g.type==="bytes"){if(p.size!==void 0)throw new RangeError("The strategy for a byte stream cannot have a size function");const _=lt(p,0);Go(this,g,_);}else {const _=Ot(p),S=lt(p,1);$i(this,g,S,_);}}get locked(){if(!qe(this))throw $e("locked");return ke(this)}cancel(o=void 0){return qe(this)?ke(this)?T(new TypeError("Cannot cancel a stream that already has a reader")):le(this,o):T($e("cancel"))}getReader(o=void 0){if(!qe(this))throw $e("getReader");return Zo(o,"First parameter").mode===void 0?Ne(this):Ln(this)}pipeThrough(o,a={}){if(!qe(this))throw $e("pipeThrough");Se(o,1,"pipeThrough");const p=es(o,"First parameter"),g=uo(a,"Second parameter");if(ke(this))throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");if(Qe(p.writable))throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");const _=io(this,p.writable,g.preventClose,g.preventAbort,g.preventCancel,g.signal);return J(_),p.readable}pipeTo(o,a={}){if(!qe(this))return T($e("pipeTo"));if(o===void 0)return T("Parameter 1 is required in 'pipeTo'.");if(!Ve(o))return T(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));let p;try{p=uo(a,"Second parameter");}catch(g){return T(g)}return ke(this)?T(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")):Qe(o)?T(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")):io(this,o,p.preventClose,p.preventAbort,p.preventCancel,p.signal)}tee(){if(!qe(this))throw $e("tee");const o=Di(this);return st(o)}values(o=void 0){if(!qe(this))throw $e("values");const a=Ji(o,"First parameter");return zo(this,a.preventCancel)}[pr](o){return this.values(o)}static from(o){return Ni(o)}};u$1(Zr,"ReadableStream");let V=Zr;Object.defineProperties(V,{from:{enumerable:!0}}),Object.defineProperties(V.prototype,{cancel:{enumerable:!0},getReader:{enumerable:!0},pipeThrough:{enumerable:!0},pipeTo:{enumerable:!0},tee:{enumerable:!0},values:{enumerable:!0},locked:{enumerable:!0}}),w(V.from,"from"),w(V.prototype.cancel,"cancel"),w(V.prototype.getReader,"getReader"),w(V.prototype.pipeThrough,"pipeThrough"),w(V.prototype.pipeTo,"pipeTo"),w(V.prototype.tee,"tee"),w(V.prototype.values,"values"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(V.prototype,Symbol.toStringTag,{value:"ReadableStream",configurable:!0}),Object.defineProperty(V.prototype,pr,{value:V.prototype.values,writable:!0,configurable:!0});function ht(n,o,a,p=1,g=()=>1){const _=Object.create(V.prototype);Ir(_);const S=Object.create(ae.prototype);return ao(_,S,n,o,a,p,g),_}u$1(ht,"CreateReadableStream");function lo(n,o,a){const p=Object.create(V.prototype);Ir(p);const g=Object.create(ie.prototype);return jn(p,g,n,o,a,0,void 0),p}u$1(lo,"CreateReadableByteStream");function Ir(n){n._state="readable",n._reader=void 0,n._storedError=void 0,n._disturbed=!1;}u$1(Ir,"InitializeReadableStream");function qe(n){return !b(n)||!Object.prototype.hasOwnProperty.call(n,"_readableStreamController")?!1:n instanceof V}u$1(qe,"IsReadableStream");function ke(n){return n._reader!==void 0}u$1(ke,"IsReadableStreamLocked");function le(n,o){if(n._disturbed=!0,n._state==="closed")return k(void 0);if(n._state==="errored")return T(n._storedError);pt(n);const a=n._reader;if(a!==void 0&&Fe(a)){const g=a._readIntoRequests;a._readIntoRequests=new Q,g.forEach(_=>{_._closeSteps(void 0);});}const p=n._readableStreamController[er](o);return N(p,y)}u$1(le,"ReadableStreamCancel");function pt(n){n._state="closed";const o=n._reader;if(o!==void 0&&(cn(o),ve(o))){const a=o._readRequests;o._readRequests=new Q,a.forEach(p=>{p._closeSteps();});}}u$1(pt,"ReadableStreamClose");function fo(n,o){n._state="errored",n._storedError=o;const a=n._reader;a!==void 0&&(ir(a,o),ve(a)?yn(a,o):xn(a,o));}u$1(fo,"ReadableStreamError");function $e(n){return new TypeError(`ReadableStream.prototype.${n} can only be used on a ReadableStream`)}u$1($e,"streamBrandCheckException$1");function co(n,o){ce(n,o);const a=n?.highWaterMark;return sr(a,"highWaterMark","QueuingStrategyInit"),{highWaterMark:ar(a)}}u$1(co,"convertQueuingStrategyInit");const ho=u$1(n=>n.byteLength,"byteLengthSizeFunction");w(ho,"size");const Kr=class Kr{constructor(o){Se(o,1,"ByteLengthQueuingStrategy"),o=co(o,"First parameter"),this._byteLengthQueuingStrategyHighWaterMark=o.highWaterMark;}get highWaterMark(){if(!bo(this))throw po("highWaterMark");return this._byteLengthQueuingStrategyHighWaterMark}get size(){if(!bo(this))throw po("size");return ho}};u$1(Kr,"ByteLengthQueuingStrategy");let Ze=Kr;Object.defineProperties(Ze.prototype,{highWaterMark:{enumerable:!0},size:{enumerable:!0}}),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(Ze.prototype,Symbol.toStringTag,{value:"ByteLengthQueuingStrategy",configurable:!0});function po(n){return new TypeError(`ByteLengthQueuingStrategy.prototype.${n} can only be used on a ByteLengthQueuingStrategy`)}u$1(po,"byteLengthBrandCheckException");function bo(n){return !b(n)||!Object.prototype.hasOwnProperty.call(n,"_byteLengthQueuingStrategyHighWaterMark")?!1:n instanceof Ze}u$1(bo,"IsByteLengthQueuingStrategy");const mo=u$1(()=>1,"countSizeFunction");w(mo,"size");const Jr=class Jr{constructor(o){Se(o,1,"CountQueuingStrategy"),o=co(o,"First parameter"),this._countQueuingStrategyHighWaterMark=o.highWaterMark;}get highWaterMark(){if(!go(this))throw yo("highWaterMark");return this._countQueuingStrategyHighWaterMark}get size(){if(!go(this))throw yo("size");return mo}};u$1(Jr,"CountQueuingStrategy");let Ke=Jr;Object.defineProperties(Ke.prototype,{highWaterMark:{enumerable:!0},size:{enumerable:!0}}),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(Ke.prototype,Symbol.toStringTag,{value:"CountQueuingStrategy",configurable:!0});function yo(n){return new TypeError(`CountQueuingStrategy.prototype.${n} can only be used on a CountQueuingStrategy`)}u$1(yo,"countBrandCheckException");function go(n){return !b(n)||!Object.prototype.hasOwnProperty.call(n,"_countQueuingStrategyHighWaterMark")?!1:n instanceof Ke}u$1(go,"IsCountQueuingStrategy");function ts(n,o){ce(n,o);const a=n?.cancel,p=n?.flush,g=n?.readableType,_=n?.start,S=n?.transform,C=n?.writableType;return {cancel:a===void 0?void 0:is(a,n,`${o} has member 'cancel' that`),flush:p===void 0?void 0:rs(p,n,`${o} has member 'flush' that`),readableType:g,start:_===void 0?void 0:ns(_,n,`${o} has member 'start' that`),transform:S===void 0?void 0:os(S,n,`${o} has member 'transform' that`),writableType:C}}u$1(ts,"convertTransformer");function rs(n,o,a){return ee(n,a),p=>H(n,o,[p])}u$1(rs,"convertTransformerFlushCallback");function ns(n,o,a){return ee(n,a),p=>M(n,o,[p])}u$1(ns,"convertTransformerStartCallback");function os(n,o,a){return ee(n,a),(p,g)=>H(n,o,[p,g])}u$1(os,"convertTransformerTransformCallback");function is(n,o,a){return ee(n,a),p=>H(n,o,[p])}u$1(is,"convertTransformerCancelCallback");const Xr=class Xr{constructor(o={},a={},p={}){o===void 0&&(o=null);const g=zt(a,"Second parameter"),_=zt(p,"Third parameter"),S=ts(o,"First parameter");if(S.readableType!==void 0)throw new RangeError("Invalid readableType specified");if(S.writableType!==void 0)throw new RangeError("Invalid writableType specified");const C=lt(_,0),q=Ot(_),P=lt(g,1),W=Ot(g);let O;const j=F(fe=>{O=fe;});ss(this,j,P,W,C,q),us(this,S),S.start!==void 0?O(S.start(this._transformStreamController)):O(void 0);}get readable(){if(!_o(this))throw To("readable");return this._readable}get writable(){if(!_o(this))throw To("writable");return this._writable}};u$1(Xr,"TransformStream");let Je=Xr;Object.defineProperties(Je.prototype,{readable:{enumerable:!0},writable:{enumerable:!0}}),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(Je.prototype,Symbol.toStringTag,{value:"TransformStream",configurable:!0});function ss(n,o,a,p,g,_){function S(){return o}u$1(S,"startAlgorithm");function C(j){return cs(n,j)}u$1(C,"writeAlgorithm");function q(j){return ds(n,j)}u$1(q,"abortAlgorithm");function P(){return hs(n)}u$1(P,"closeAlgorithm"),n._writable=fi(S,C,P,q,a,p);function W(){return ps(n)}u$1(W,"pullAlgorithm");function O(j){return bs(n,j)}u$1(O,"cancelAlgorithm"),n._readable=ht(S,W,O,g,_),n._backpressure=void 0,n._backpressureChangePromise=void 0,n._backpressureChangePromise_resolve=void 0,Ht(n,!0),n._transformStreamController=void 0;}u$1(ss,"InitializeTransformStream");function _o(n){return !b(n)||!Object.prototype.hasOwnProperty.call(n,"_transformStreamController")?!1:n instanceof Je}u$1(_o,"IsTransformStream");function So(n,o){ue(n._readable._readableStreamController,o),jr(n,o);}u$1(So,"TransformStreamError");function jr(n,o){Qt(n._transformStreamController),ft(n._writable._writableStreamController,o),Lr(n);}u$1(jr,"TransformStreamErrorWritableAndUnblockWrite");function Lr(n){n._backpressure&&Ht(n,!1);}u$1(Lr,"TransformStreamUnblockWrite");function Ht(n,o){n._backpressureChangePromise!==void 0&&n._backpressureChangePromise_resolve(),n._backpressureChangePromise=F(a=>{n._backpressureChangePromise_resolve=a;}),n._backpressure=o;}u$1(Ht,"TransformStreamSetBackpressure");const en=class en{constructor(){throw new TypeError("Illegal constructor")}get desiredSize(){if(!Vt(this))throw Gt("desiredSize");const o=this._controlledTransformStream._readable._readableStreamController;return Fr(o)}enqueue(o=void 0){if(!Vt(this))throw Gt("enqueue");wo(this,o);}error(o=void 0){if(!Vt(this))throw Gt("error");ls(this,o);}terminate(){if(!Vt(this))throw Gt("terminate");fs(this);}};u$1(en,"TransformStreamDefaultController");let me=en;Object.defineProperties(me.prototype,{enqueue:{enumerable:!0},error:{enumerable:!0},terminate:{enumerable:!0},desiredSize:{enumerable:!0}}),w(me.prototype.enqueue,"enqueue"),w(me.prototype.error,"error"),w(me.prototype.terminate,"terminate"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(me.prototype,Symbol.toStringTag,{value:"TransformStreamDefaultController",configurable:!0});function Vt(n){return !b(n)||!Object.prototype.hasOwnProperty.call(n,"_controlledTransformStream")?!1:n instanceof me}u$1(Vt,"IsTransformStreamDefaultController");function as(n,o,a,p,g){o._controlledTransformStream=n,n._transformStreamController=o,o._transformAlgorithm=a,o._flushAlgorithm=p,o._cancelAlgorithm=g,o._finishPromise=void 0,o._finishPromise_resolve=void 0,o._finishPromise_reject=void 0;}u$1(as,"SetUpTransformStreamDefaultController");function us(n,o){const a=Object.create(me.prototype);let p,g,_;o.transform!==void 0?p=u$1(S=>o.transform(S,a),"transformAlgorithm"):p=u$1(S=>{try{return wo(a,S),k(void 0)}catch(C){return T(C)}},"transformAlgorithm"),o.flush!==void 0?g=u$1(()=>o.flush(a),"flushAlgorithm"):g=u$1(()=>k(void 0),"flushAlgorithm"),o.cancel!==void 0?_=u$1(S=>o.cancel(S),"cancelAlgorithm"):_=u$1(()=>k(void 0),"cancelAlgorithm"),as(n,a,p,g,_);}u$1(us,"SetUpTransformStreamDefaultControllerFromTransformer");function Qt(n){n._transformAlgorithm=void 0,n._flushAlgorithm=void 0,n._cancelAlgorithm=void 0;}u$1(Qt,"TransformStreamDefaultControllerClearAlgorithms");function wo(n,o){const a=n._controlledTransformStream,p=a._readable._readableStreamController;if(!Ye(p))throw new TypeError("Readable side is not in a state that permits enqueue");try{Ge(p,o);}catch(_){throw jr(a,_),a._readable._storedError}Li(p)!==a._backpressure&&Ht(a,!0);}u$1(wo,"TransformStreamDefaultControllerEnqueue");function ls(n,o){So(n._controlledTransformStream,o);}u$1(ls,"TransformStreamDefaultControllerError");function Ro(n,o){const a=n._transformAlgorithm(o);return N(a,void 0,p=>{throw So(n._controlledTransformStream,p),p})}u$1(Ro,"TransformStreamDefaultControllerPerformTransform");function fs(n){const o=n._controlledTransformStream,a=o._readable._readableStreamController;Le(a);const p=new TypeError("TransformStream terminated");jr(o,p);}u$1(fs,"TransformStreamDefaultControllerTerminate");function cs(n,o){const a=n._transformStreamController;if(n._backpressure){const p=n._backpressureChangePromise;return N(p,()=>{const g=n._writable;if(g._state==="erroring")throw g._storedError;return Ro(a,o)})}return Ro(a,o)}u$1(cs,"TransformStreamDefaultSinkWriteAlgorithm");function ds(n,o){const a=n._transformStreamController;if(a._finishPromise!==void 0)return a._finishPromise;const p=n._readable;a._finishPromise=F((_,S)=>{a._finishPromise_resolve=_,a._finishPromise_reject=S;});const g=a._cancelAlgorithm(o);return Qt(a),E(g,()=>(p._state==="errored"?Xe(a,p._storedError):(ue(p._readableStreamController,o),$r(a)),null),_=>(ue(p._readableStreamController,_),Xe(a,_),null)),a._finishPromise}u$1(ds,"TransformStreamDefaultSinkAbortAlgorithm");function hs(n){const o=n._transformStreamController;if(o._finishPromise!==void 0)return o._finishPromise;const a=n._readable;o._finishPromise=F((g,_)=>{o._finishPromise_resolve=g,o._finishPromise_reject=_;});const p=o._flushAlgorithm();return Qt(o),E(p,()=>(a._state==="errored"?Xe(o,a._storedError):(Le(a._readableStreamController),$r(o)),null),g=>(ue(a._readableStreamController,g),Xe(o,g),null)),o._finishPromise}u$1(hs,"TransformStreamDefaultSinkCloseAlgorithm");function ps(n){return Ht(n,!1),n._backpressureChangePromise}u$1(ps,"TransformStreamDefaultSourcePullAlgorithm");function bs(n,o){const a=n._transformStreamController;if(a._finishPromise!==void 0)return a._finishPromise;const p=n._writable;a._finishPromise=F((_,S)=>{a._finishPromise_resolve=_,a._finishPromise_reject=S;});const g=a._cancelAlgorithm(o);return Qt(a),E(g,()=>(p._state==="errored"?Xe(a,p._storedError):(ft(p._writableStreamController,o),Lr(n),$r(a)),null),_=>(ft(p._writableStreamController,_),Lr(n),Xe(a,_),null)),a._finishPromise}u$1(bs,"TransformStreamDefaultSourceCancelAlgorithm");function Gt(n){return new TypeError(`TransformStreamDefaultController.prototype.${n} can only be used on a TransformStreamDefaultController`)}u$1(Gt,"defaultControllerBrandCheckException");function $r(n){n._finishPromise_resolve!==void 0&&(n._finishPromise_resolve(),n._finishPromise_resolve=void 0,n._finishPromise_reject=void 0);}u$1($r,"defaultControllerFinishPromiseResolve");function Xe(n,o){n._finishPromise_reject!==void 0&&(J(n._finishPromise),n._finishPromise_reject(o),n._finishPromise_resolve=void 0,n._finishPromise_reject=void 0);}u$1(Xe,"defaultControllerFinishPromiseReject");function To(n){return new TypeError(`TransformStream.prototype.${n} can only be used on a TransformStream`)}u$1(To,"streamBrandCheckException"),d.ByteLengthQueuingStrategy=Ze,d.CountQueuingStrategy=Ke,d.ReadableByteStreamController=ie,d.ReadableStream=V,d.ReadableStreamBYOBReader=he,d.ReadableStreamBYOBRequest=Re,d.ReadableStreamDefaultController=ae,d.ReadableStreamDefaultReader=de,d.TransformStream=Je,d.TransformStreamDefaultController=me,d.WritableStream=pe,d.WritableStreamDefaultController=Be,d.WritableStreamDefaultWriter=se;});}(ponyfill_es2018,ponyfill_es2018.exports)),ponyfill_es2018.exports}u$1(requirePonyfill_es2018,"requirePonyfill_es2018");const POOL_SIZE$1=65536;if(!globalThis.ReadableStream)try{const c=require("node:process"),{emitWarning:l}=c;try{c.emitWarning=()=>{},Object.assign(globalThis,require("node:stream/web")),c.emitWarning=l;}catch(d){throw c.emitWarning=l,d}}catch{Object.assign(globalThis,requirePonyfill_es2018());}try{const{Blob:c}=require("buffer");c&&!c.prototype.stream&&(c.prototype.stream=u$1(function(d){let y=0;const b=this;return new ReadableStream({type:"bytes",async pull(R){const v=await b.slice(y,Math.min(b.size,y+POOL_SIZE$1)).arrayBuffer();y+=v.byteLength,R.enqueue(new Uint8Array(v)),y===b.size&&R.close();}})},"name"));}catch{}/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */const POOL_SIZE=65536;async function*toIterator(c,l=!0){for(const d of c)if("stream"in d)yield*d.stream();else if(ArrayBuffer.isView(d))if(l){let y=d.byteOffset;const b=d.byteOffset+d.byteLength;for(;y!==b;){const R=Math.min(b-y,POOL_SIZE),w=d.buffer.slice(y,y+R);y+=w.byteLength,yield new Uint8Array(w);}}else yield d;else {let y=0,b=d;for(;y!==b.size;){const w=await b.slice(y,Math.min(b.size,y+POOL_SIZE)).arrayBuffer();y+=w.byteLength,yield new Uint8Array(w);}}}u$1(toIterator,"toIterator");const _Blob=(Ue$1=class{constructor(l=[],d={}){ye$1(this,Pe$1,[]);ye$1(this,bt$1,"");ye$1(this,ot,0);ye$1(this,Zt,"transparent");if(typeof l!="object"||l===null)throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");if(typeof l[Symbol.iterator]!="function")throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");if(typeof d!="object"&&typeof d!="function")throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");d===null&&(d={});const y=new TextEncoder;for(const R of l){let w;ArrayBuffer.isView(R)?w=new Uint8Array(R.buffer.slice(R.byteOffset,R.byteOffset+R.byteLength)):R instanceof ArrayBuffer?w=new Uint8Array(R.slice(0)):R instanceof Ue$1?w=R:w=y.encode(`${R}`),ne(this,ot,D(this,ot)+(ArrayBuffer.isView(w)?w.byteLength:w.size)),D(this,Pe$1).push(w);}ne(this,Zt,`${d.endings===void 0?"transparent":d.endings}`);const b=d.type===void 0?"":String(d.type);ne(this,bt$1,/^[\x20-\x7E]*$/.test(b)?b:"");}get size(){return D(this,ot)}get type(){return D(this,bt$1)}async text(){const l=new TextDecoder;let d="";for await(const y of toIterator(D(this,Pe$1),!1))d+=l.decode(y,{stream:!0});return d+=l.decode(),d}async arrayBuffer(){const l=new Uint8Array(this.size);let d=0;for await(const y of toIterator(D(this,Pe$1),!1))l.set(y,d),d+=y.length;return l.buffer}stream(){const l=toIterator(D(this,Pe$1),!0);return new globalThis.ReadableStream({type:"bytes",async pull(d){const y=await l.next();y.done?d.close():d.enqueue(y.value);},async cancel(){await l.return();}})}slice(l=0,d=this.size,y=""){const{size:b}=this;let R=l<0?Math.max(b+l,0):Math.min(l,b),w=d<0?Math.max(b+d,0):Math.min(d,b);const v=Math.max(w-R,0),I=D(this,Pe$1),B=[];let F=0;for(const T of I){if(F>=v)break;const $=ArrayBuffer.isView(T)?T.byteLength:T.size;if(R&&$<=R)R-=$,w-=$;else {let E;ArrayBuffer.isView(T)?(E=T.subarray(R,Math.min($,w)),F+=E.byteLength):(E=T.slice(R,Math.min($,w)),F+=E.size),w-=$,B.push(E),R=0;}}const k=new Ue$1([],{type:String(y).toLowerCase()});return ne(k,ot,v),ne(k,Pe$1,B),k}get[Symbol.toStringTag](){return "Blob"}static[Symbol.hasInstance](l){return l&&typeof l=="object"&&typeof l.constructor=="function"&&(typeof l.stream=="function"||typeof l.arrayBuffer=="function")&&/^(Blob|File)$/.test(l[Symbol.toStringTag])}},Pe$1=new WeakMap,bt$1=new WeakMap,ot=new WeakMap,Zt=new WeakMap,u$1(Ue$1,"Blob"),Ue$1);Object.defineProperties(_Blob.prototype,{size:{enumerable:!0},type:{enumerable:!0},slice:{enumerable:!0}});const Blob$3=_Blob,r$1=Blob$3,_File=(gt$1=class extends r$1{constructor(d,y,b={}){if(arguments.length<2)throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);super(d,b);ye$1(this,mt$1,0);ye$1(this,yt$1,"");b===null&&(b={});const R=b.lastModified===void 0?Date.now():Number(b.lastModified);Number.isNaN(R)||ne(this,mt$1,R),ne(this,yt$1,String(y));}get name(){return D(this,yt$1)}get lastModified(){return D(this,mt$1)}get[Symbol.toStringTag](){return "File"}static[Symbol.hasInstance](d){return !!d&&d instanceof r$1&&/^(File)$/.test(d[Symbol.toStringTag])}},mt$1=new WeakMap,yt$1=new WeakMap,u$1(gt$1,"File"),gt$1),File$1=_File,File$1$1=File$1;/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */var{toStringTag:t$1,iterator:i$2,hasInstance:h$1}=Symbol,r=Math.random,m="append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(","),f=u$1((c,l,d)=>(c+="",/^(Blob|File)$/.test(l&&l[t$1])?[(d=d!==void 0?d+"":l[t$1]=="File"?l.name:"blob",c),l.name!==d||l[t$1]=="blob"?new File$1$1([l],d,l):l]:[c,l+""]),"f"),e$1=u$1((c,l)=>(l?c:c.replace(/\r?\n|\r/g,`\r
`)).replace(/\n/g,"%0A").replace(/\r/g,"%0D").replace(/"/g,"%22"),"e$1"),x$1=u$1((c,l,d)=>{if(l.length<d)throw new TypeError(`Failed to execute '${c}' on 'FormData': ${d} arguments required, but only ${l.length} present.`)},"x");const FormData$1=(_t=class{constructor(...l){ye$1(this,oe,[]);if(l.length)throw new TypeError("Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.")}get[t$1](){return "FormData"}[i$2](){return this.entries()}static[h$1](l){return l&&typeof l=="object"&&l[t$1]==="FormData"&&!m.some(d=>typeof l[d]!="function")}append(...l){x$1("append",arguments,2),D(this,oe).push(f(...l));}delete(l){x$1("delete",arguments,1),l+="",ne(this,oe,D(this,oe).filter(([d])=>d!==l));}get(l){x$1("get",arguments,1),l+="";for(var d=D(this,oe),y=d.length,b=0;b<y;b++)if(d[b][0]===l)return d[b][1];return null}getAll(l,d){return x$1("getAll",arguments,1),d=[],l+="",D(this,oe).forEach(y=>y[0]===l&&d.push(y[1])),d}has(l){return x$1("has",arguments,1),l+="",D(this,oe).some(d=>d[0]===l)}forEach(l,d){x$1("forEach",arguments,1);for(var[y,b]of this)l.call(d,b,y,this);}set(...l){x$1("set",arguments,2);var d=[],y=!0;l=f(...l),D(this,oe).forEach(b=>{b[0]===l[0]?y&&(y=!d.push(l)):d.push(b);}),y&&d.push(l),ne(this,oe,d);}*entries(){yield*D(this,oe);}*keys(){for(var[l]of this)yield l;}*values(){for(var[,l]of this)yield l;}},oe=new WeakMap,u$1(_t,"FormData"),_t);function formDataToBlob(c,l=r$1){var d=`${r()}${r()}`.replace(/\./g,"").slice(-28).padStart(32,"-"),y=[],b=`--${d}\r
Content-Disposition: form-data; name="`;return c.forEach((R,w)=>typeof R=="string"?y.push(b+e$1(w)+`"\r
\r
${R.replace(/\r(?!\n)|(?<!\r)\n/g,`\r
`)}\r
`):y.push(b+e$1(w)+`"; filename="${e$1(R.name,1)}"\r
Content-Type: ${R.type||"application/octet-stream"}\r
\r
`,R,`\r
`)),y.push(`--${d}--`),new l(y,{type:"multipart/form-data; boundary="+d})}u$1(formDataToBlob,"formDataToBlob");const rn=class rn extends Error{constructor(l,d){super(l),Error.captureStackTrace(this,this.constructor),this.type=d;}get name(){return this.constructor.name}get[Symbol.toStringTag](){return this.constructor.name}};u$1(rn,"FetchBaseError");let FetchBaseError=rn;const nn=class nn extends FetchBaseError{constructor(l,d,y){super(l,d),y&&(this.code=this.errno=y.code,this.erroredSysCall=y.syscall);}};u$1(nn,"FetchError");let FetchError=nn;const NAME=Symbol.toStringTag,isURLSearchParameters=u$1(c=>typeof c=="object"&&typeof c.append=="function"&&typeof c.delete=="function"&&typeof c.get=="function"&&typeof c.getAll=="function"&&typeof c.has=="function"&&typeof c.set=="function"&&typeof c.sort=="function"&&c[NAME]==="URLSearchParams","isURLSearchParameters"),isBlob=u$1(c=>c&&typeof c=="object"&&typeof c.arrayBuffer=="function"&&typeof c.type=="string"&&typeof c.stream=="function"&&typeof c.constructor=="function"&&/^(Blob|File)$/.test(c[NAME]),"isBlob"),isAbortSignal=u$1(c=>typeof c=="object"&&(c[NAME]==="AbortSignal"||c[NAME]==="EventTarget"),"isAbortSignal"),isDomainOrSubdomain=u$1((c,l)=>{const d=new URL(l).hostname,y=new URL(c).hostname;return d===y||d.endsWith(`.${y}`)},"isDomainOrSubdomain"),isSameProtocol=u$1((c,l)=>{const d=new URL(l).protocol,y=new URL(c).protocol;return d===y},"isSameProtocol"),pipeline$2=require$$0$8.promisify(Stream__default$1.pipeline),INTERNALS$2=Symbol("Body internals"),on=class on{constructor(l,{size:d=0}={}){let y=null;l===null?l=null:isURLSearchParameters(l)?l=require$$6$2.Buffer.from(l.toString()):isBlob(l)||require$$6$2.Buffer.isBuffer(l)||(require$$0$8.types.isAnyArrayBuffer(l)?l=require$$6$2.Buffer.from(l):ArrayBuffer.isView(l)?l=require$$6$2.Buffer.from(l.buffer,l.byteOffset,l.byteLength):l instanceof Stream__default$1||(l instanceof FormData$1?(l=formDataToBlob(l),y=l.type.split("=")[1]):l=require$$6$2.Buffer.from(String(l))));let b=l;require$$6$2.Buffer.isBuffer(l)?b=Stream__default$1.Readable.from(l):isBlob(l)&&(b=Stream__default$1.Readable.from(l.stream())),this[INTERNALS$2]={body:l,stream:b,boundary:y,disturbed:!1,error:null},this.size=d,l instanceof Stream__default$1&&l.on("error",R=>{const w=R instanceof FetchBaseError?R:new FetchError(`Invalid response body while trying to fetch ${this.url}: ${R.message}`,"system",R);this[INTERNALS$2].error=w;});}get body(){return this[INTERNALS$2].stream}get bodyUsed(){return this[INTERNALS$2].disturbed}async arrayBuffer(){const{buffer:l,byteOffset:d,byteLength:y}=await consumeBody(this);return l.slice(d,d+y)}async formData(){const l=this.headers.get("content-type");if(l.startsWith("application/x-www-form-urlencoded")){const y=new FormData$1,b=new URLSearchParams(await this.text());for(const[R,w]of b)y.append(R,w);return y}const{toFormData:d}=await import('./multipart-parser.mjs').then(function (n) { return n.m; });return d(this.body,l)}async blob(){const l=this.headers&&this.headers.get("content-type")||this[INTERNALS$2].body&&this[INTERNALS$2].body.type||"",d=await this.arrayBuffer();return new r$1([d],{type:l})}async json(){const l=await this.text();return JSON.parse(l)}async text(){const l=await consumeBody(this);return new TextDecoder().decode(l)}buffer(){return consumeBody(this)}};u$1(on,"Body");let Body=on;Body.prototype.buffer=require$$0$8.deprecate(Body.prototype.buffer,"Please use 'response.arrayBuffer()' instead of 'response.buffer()'","node-fetch#buffer"),Object.defineProperties(Body.prototype,{body:{enumerable:!0},bodyUsed:{enumerable:!0},arrayBuffer:{enumerable:!0},blob:{enumerable:!0},json:{enumerable:!0},text:{enumerable:!0},data:{get:require$$0$8.deprecate(()=>{},"data doesn't exist, use json(), text(), arrayBuffer(), or body instead","https://github.com/node-fetch/node-fetch/issues/1000 (response)")}});async function consumeBody(c){if(c[INTERNALS$2].disturbed)throw new TypeError(`body used already for: ${c.url}`);if(c[INTERNALS$2].disturbed=!0,c[INTERNALS$2].error)throw c[INTERNALS$2].error;const{body:l}=c;if(l===null||!(l instanceof Stream__default$1))return require$$6$2.Buffer.alloc(0);const d=[];let y=0;try{for await(const b of l){if(c.size>0&&y+b.length>c.size){const R=new FetchError(`content size at ${c.url} over limit: ${c.size}`,"max-size");throw l.destroy(R),R}y+=b.length,d.push(b);}}catch(b){throw b instanceof FetchBaseError?b:new FetchError(`Invalid response body while trying to fetch ${c.url}: ${b.message}`,"system",b)}if(l.readableEnded===!0||l._readableState.ended===!0)try{return d.every(b=>typeof b=="string")?require$$6$2.Buffer.from(d.join("")):require$$6$2.Buffer.concat(d,y)}catch(b){throw new FetchError(`Could not create Buffer from response body for ${c.url}: ${b.message}`,"system",b)}else throw new FetchError(`Premature close of server response while trying to fetch ${c.url}`)}u$1(consumeBody,"consumeBody");const clone=u$1((c,l)=>{let d,y,{body:b}=c[INTERNALS$2];if(c.bodyUsed)throw new Error("cannot clone body after it is used");return b instanceof Stream__default$1&&typeof b.getBoundary!="function"&&(d=new Stream$1.PassThrough({highWaterMark:l}),y=new Stream$1.PassThrough({highWaterMark:l}),b.pipe(d),b.pipe(y),c[INTERNALS$2].stream=d,b=y),b},"clone"),getNonSpecFormDataBoundary=require$$0$8.deprecate(c=>c.getBoundary(),"form-data doesn't follow the spec and requires special treatment. Use alternative package","https://github.com/node-fetch/node-fetch/issues/1167"),extractContentType=u$1((c,l)=>c===null?null:typeof c=="string"?"text/plain;charset=UTF-8":isURLSearchParameters(c)?"application/x-www-form-urlencoded;charset=UTF-8":isBlob(c)?c.type||null:require$$6$2.Buffer.isBuffer(c)||require$$0$8.types.isAnyArrayBuffer(c)||ArrayBuffer.isView(c)?null:c instanceof FormData$1?`multipart/form-data; boundary=${l[INTERNALS$2].boundary}`:c&&typeof c.getBoundary=="function"?`multipart/form-data;boundary=${getNonSpecFormDataBoundary(c)}`:c instanceof Stream__default$1?null:"text/plain;charset=UTF-8","extractContentType"),getTotalBytes=u$1(c=>{const{body:l}=c[INTERNALS$2];return l===null?0:isBlob(l)?l.size:require$$6$2.Buffer.isBuffer(l)?l.length:l&&typeof l.getLengthSync=="function"&&l.hasKnownLength&&l.hasKnownLength()?l.getLengthSync():null},"getTotalBytes"),writeToStream=u$1(async(c,{body:l})=>{l===null?c.end():await pipeline$2(l,c);},"writeToStream"),validateHeaderName=typeof http__default$1.validateHeaderName=="function"?http__default$1.validateHeaderName:c=>{if(!/^[\^`\-\w!#$%&'*+.|~]+$/.test(c)){const l=new TypeError(`Header name must be a valid HTTP token [${c}]`);throw Object.defineProperty(l,"code",{value:"ERR_INVALID_HTTP_TOKEN"}),l}},validateHeaderValue=typeof http__default$1.validateHeaderValue=="function"?http__default$1.validateHeaderValue:(c,l)=>{if(/[^\t\u0020-\u007E\u0080-\u00FF]/.test(l)){const d=new TypeError(`Invalid character in header content ["${c}"]`);throw Object.defineProperty(d,"code",{value:"ERR_INVALID_CHAR"}),d}},Kt=class Kt extends URLSearchParams{constructor(l){let d=[];if(l instanceof Kt){const y=l.raw();for(const[b,R]of Object.entries(y))d.push(...R.map(w=>[b,w]));}else if(l!=null)if(typeof l=="object"&&!require$$0$8.types.isBoxedPrimitive(l)){const y=l[Symbol.iterator];if(y==null)d.push(...Object.entries(l));else {if(typeof y!="function")throw new TypeError("Header pairs must be iterable");d=[...l].map(b=>{if(typeof b!="object"||require$$0$8.types.isBoxedPrimitive(b))throw new TypeError("Each header pair must be an iterable object");return [...b]}).map(b=>{if(b.length!==2)throw new TypeError("Each header pair must be a name/value tuple");return [...b]});}}else throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");return d=d.length>0?d.map(([y,b])=>(validateHeaderName(y),validateHeaderValue(y,String(b)),[String(y).toLowerCase(),String(b)])):void 0,super(d),new Proxy(this,{get(y,b,R){switch(b){case"append":case"set":return (w,v)=>(validateHeaderName(w),validateHeaderValue(w,String(v)),URLSearchParams.prototype[b].call(y,String(w).toLowerCase(),String(v)));case"delete":case"has":case"getAll":return w=>(validateHeaderName(w),URLSearchParams.prototype[b].call(y,String(w).toLowerCase()));case"keys":return ()=>(y.sort(),new Set(URLSearchParams.prototype.keys.call(y)).keys());default:return Reflect.get(y,b,R)}}})}get[Symbol.toStringTag](){return this.constructor.name}toString(){return Object.prototype.toString.call(this)}get(l){const d=this.getAll(l);if(d.length===0)return null;let y=d.join(", ");return /^content-encoding$/i.test(l)&&(y=y.toLowerCase()),y}forEach(l,d=void 0){for(const y of this.keys())Reflect.apply(l,d,[this.get(y),y,this]);}*values(){for(const l of this.keys())yield this.get(l);}*entries(){for(const l of this.keys())yield [l,this.get(l)];}[Symbol.iterator](){return this.entries()}raw(){return [...this.keys()].reduce((l,d)=>(l[d]=this.getAll(d),l),{})}[Symbol.for("nodejs.util.inspect.custom")](){return [...this.keys()].reduce((l,d)=>{const y=this.getAll(d);return d==="host"?l[d]=y[0]:l[d]=y.length>1?y:y[0],l},{})}};u$1(Kt,"Headers");let Headers$1=Kt;Object.defineProperties(Headers$1.prototype,["get","entries","forEach","values"].reduce((c,l)=>(c[l]={enumerable:!0},c),{}));function fromRawHeaders(c=[]){return new Headers$1(c.reduce((l,d,y,b)=>(y%2===0&&l.push(b.slice(y,y+2)),l),[]).filter(([l,d])=>{try{return validateHeaderName(l),validateHeaderValue(l,String(d)),!0}catch{return !1}}))}u$1(fromRawHeaders,"fromRawHeaders");const redirectStatus=new Set([301,302,303,307,308]),isRedirect=u$1(c=>redirectStatus.has(c),"isRedirect"),INTERNALS$1=Symbol("Response internals"),De$1=class De extends Body{constructor(l=null,d={}){super(l,d);const y=d.status!=null?d.status:200,b=new Headers$1(d.headers);if(l!==null&&!b.has("Content-Type")){const R=extractContentType(l,this);R&&b.append("Content-Type",R);}this[INTERNALS$1]={type:"default",url:d.url,status:y,statusText:d.statusText||"",headers:b,counter:d.counter,highWaterMark:d.highWaterMark};}get type(){return this[INTERNALS$1].type}get url(){return this[INTERNALS$1].url||""}get status(){return this[INTERNALS$1].status}get ok(){return this[INTERNALS$1].status>=200&&this[INTERNALS$1].status<300}get redirected(){return this[INTERNALS$1].counter>0}get statusText(){return this[INTERNALS$1].statusText}get headers(){return this[INTERNALS$1].headers}get highWaterMark(){return this[INTERNALS$1].highWaterMark}clone(){return new De(clone(this,this.highWaterMark),{type:this.type,url:this.url,status:this.status,statusText:this.statusText,headers:this.headers,ok:this.ok,redirected:this.redirected,size:this.size,highWaterMark:this.highWaterMark})}static redirect(l,d=302){if(!isRedirect(d))throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');return new De(null,{headers:{location:new URL(l).toString()},status:d})}static error(){const l=new De(null,{status:0,statusText:""});return l[INTERNALS$1].type="error",l}static json(l=void 0,d={}){const y=JSON.stringify(l);if(y===void 0)throw new TypeError("data is not JSON serializable");const b=new Headers$1(d&&d.headers);return b.has("content-type")||b.set("content-type","application/json"),new De(y,{...d,headers:b})}get[Symbol.toStringTag](){return "Response"}};u$1(De$1,"Response");let Response$1=De$1;Object.defineProperties(Response$1.prototype,{type:{enumerable:!0},url:{enumerable:!0},status:{enumerable:!0},ok:{enumerable:!0},redirected:{enumerable:!0},statusText:{enumerable:!0},headers:{enumerable:!0},clone:{enumerable:!0}});const getSearch=u$1(c=>{if(c.search)return c.search;const l=c.href.length-1,d=c.hash||(c.href[l]==="#"?"#":"");return c.href[l-d.length]==="?"?"?":""},"getSearch");function stripURLForUseAsAReferrer(c,l=!1){return c==null||(c=new URL(c),/^(about|blob|data):$/.test(c.protocol))?"no-referrer":(c.username="",c.password="",c.hash="",l&&(c.pathname="",c.search=""),c)}u$1(stripURLForUseAsAReferrer,"stripURLForUseAsAReferrer");const ReferrerPolicy=new Set(["","no-referrer","no-referrer-when-downgrade","same-origin","origin","strict-origin","origin-when-cross-origin","strict-origin-when-cross-origin","unsafe-url"]),DEFAULT_REFERRER_POLICY="strict-origin-when-cross-origin";function validateReferrerPolicy(c){if(!ReferrerPolicy.has(c))throw new TypeError(`Invalid referrerPolicy: ${c}`);return c}u$1(validateReferrerPolicy,"validateReferrerPolicy");function isOriginPotentiallyTrustworthy(c){if(/^(http|ws)s:$/.test(c.protocol))return !0;const l=c.host.replace(/(^\[)|(]$)/g,""),d=require$$4$3.isIP(l);return d===4&&/^127\./.test(l)||d===6&&/^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(l)?!0:c.host==="localhost"||c.host.endsWith(".localhost")?!1:c.protocol==="file:"}u$1(isOriginPotentiallyTrustworthy,"isOriginPotentiallyTrustworthy");function isUrlPotentiallyTrustworthy(c){return /^about:(blank|srcdoc)$/.test(c)||c.protocol==="data:"||/^(blob|filesystem):$/.test(c.protocol)?!0:isOriginPotentiallyTrustworthy(c)}u$1(isUrlPotentiallyTrustworthy,"isUrlPotentiallyTrustworthy");function determineRequestsReferrer(c,{referrerURLCallback:l,referrerOriginCallback:d}={}){if(c.referrer==="no-referrer"||c.referrerPolicy==="")return null;const y=c.referrerPolicy;if(c.referrer==="about:client")return "no-referrer";const b=c.referrer;let R=stripURLForUseAsAReferrer(b),w=stripURLForUseAsAReferrer(b,!0);R.toString().length>4096&&(R=w),l&&(R=l(R)),d&&(w=d(w));const v=new URL(c.url);switch(y){case"no-referrer":return "no-referrer";case"origin":return w;case"unsafe-url":return R;case"strict-origin":return isUrlPotentiallyTrustworthy(R)&&!isUrlPotentiallyTrustworthy(v)?"no-referrer":w.toString();case"strict-origin-when-cross-origin":return R.origin===v.origin?R:isUrlPotentiallyTrustworthy(R)&&!isUrlPotentiallyTrustworthy(v)?"no-referrer":w;case"same-origin":return R.origin===v.origin?R:"no-referrer";case"origin-when-cross-origin":return R.origin===v.origin?R:w;case"no-referrer-when-downgrade":return isUrlPotentiallyTrustworthy(R)&&!isUrlPotentiallyTrustworthy(v)?"no-referrer":R;default:throw new TypeError(`Invalid referrerPolicy: ${y}`)}}u$1(determineRequestsReferrer,"determineRequestsReferrer");function parseReferrerPolicyFromHeader(c){const l=(c.get("referrer-policy")||"").split(/[,\s]+/);let d="";for(const y of l)y&&ReferrerPolicy.has(y)&&(d=y);return d}u$1(parseReferrerPolicyFromHeader,"parseReferrerPolicyFromHeader");const INTERNALS=Symbol("Request internals"),isRequest=u$1(c=>typeof c=="object"&&typeof c[INTERNALS]=="object","isRequest"),doBadDataWarn=require$$0$8.deprecate(()=>{},".data is not a valid RequestInit property, use .body instead","https://github.com/node-fetch/node-fetch/issues/1000 (request)"),Jt$1=class Jt extends Body{constructor(l,d={}){let y;if(isRequest(l)?y=new URL(l.url):(y=new URL(l),l={}),y.username!==""||y.password!=="")throw new TypeError(`${y} is an url with embedded credentials.`);let b=d.method||l.method||"GET";if(/^(delete|get|head|options|post|put)$/i.test(b)&&(b=b.toUpperCase()),!isRequest(d)&&"data"in d&&doBadDataWarn(),(d.body!=null||isRequest(l)&&l.body!==null)&&(b==="GET"||b==="HEAD"))throw new TypeError("Request with GET/HEAD method cannot have body");const R=d.body?d.body:isRequest(l)&&l.body!==null?clone(l):null;super(R,{size:d.size||l.size||0});const w=new Headers$1(d.headers||l.headers||{});if(R!==null&&!w.has("Content-Type")){const B=extractContentType(R,this);B&&w.set("Content-Type",B);}let v=isRequest(l)?l.signal:null;if("signal"in d&&(v=d.signal),v!=null&&!isAbortSignal(v))throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");let I=d.referrer==null?l.referrer:d.referrer;if(I==="")I="no-referrer";else if(I){const B=new URL(I);I=/^about:(\/\/)?client$/.test(B)?"client":B;}else I=void 0;this[INTERNALS]={method:b,redirect:d.redirect||l.redirect||"follow",headers:w,parsedURL:y,signal:v,referrer:I},this.follow=d.follow===void 0?l.follow===void 0?20:l.follow:d.follow,this.compress=d.compress===void 0?l.compress===void 0?!0:l.compress:d.compress,this.counter=d.counter||l.counter||0,this.agent=d.agent||l.agent,this.highWaterMark=d.highWaterMark||l.highWaterMark||16384,this.insecureHTTPParser=d.insecureHTTPParser||l.insecureHTTPParser||!1,this.referrerPolicy=d.referrerPolicy||l.referrerPolicy||"";}get method(){return this[INTERNALS].method}get url(){return require$$1$4.format(this[INTERNALS].parsedURL)}get headers(){return this[INTERNALS].headers}get redirect(){return this[INTERNALS].redirect}get signal(){return this[INTERNALS].signal}get referrer(){if(this[INTERNALS].referrer==="no-referrer")return "";if(this[INTERNALS].referrer==="client")return "about:client";if(this[INTERNALS].referrer)return this[INTERNALS].referrer.toString()}get referrerPolicy(){return this[INTERNALS].referrerPolicy}set referrerPolicy(l){this[INTERNALS].referrerPolicy=validateReferrerPolicy(l);}clone(){return new Jt(this)}get[Symbol.toStringTag](){return "Request"}};u$1(Jt$1,"Request");let Request$3=Jt$1;Object.defineProperties(Request$3.prototype,{method:{enumerable:!0},url:{enumerable:!0},headers:{enumerable:!0},redirect:{enumerable:!0},clone:{enumerable:!0},signal:{enumerable:!0},referrer:{enumerable:!0},referrerPolicy:{enumerable:!0}});const getNodeRequestOptions=u$1(c=>{const{parsedURL:l}=c[INTERNALS],d=new Headers$1(c[INTERNALS].headers);d.has("Accept")||d.set("Accept","*/*");let y=null;if(c.body===null&&/^(post|put)$/i.test(c.method)&&(y="0"),c.body!==null){const v=getTotalBytes(c);typeof v=="number"&&!Number.isNaN(v)&&(y=String(v));}y&&d.set("Content-Length",y),c.referrerPolicy===""&&(c.referrerPolicy=DEFAULT_REFERRER_POLICY),c.referrer&&c.referrer!=="no-referrer"?c[INTERNALS].referrer=determineRequestsReferrer(c):c[INTERNALS].referrer="no-referrer",c[INTERNALS].referrer instanceof URL&&d.set("Referer",c.referrer),d.has("User-Agent")||d.set("User-Agent","node-fetch"),c.compress&&!d.has("Accept-Encoding")&&d.set("Accept-Encoding","gzip, deflate, br");let{agent:b}=c;typeof b=="function"&&(b=b(l));const R=getSearch(l),w={path:l.pathname+R,method:c.method,headers:d[Symbol.for("nodejs.util.inspect.custom")](),insecureHTTPParser:c.insecureHTTPParser,agent:b};return {parsedURL:l,options:w}},"getNodeRequestOptions"),sn=class sn extends FetchBaseError{constructor(l,d="aborted"){super(l,d);}};u$1(sn,"AbortError");let AbortError$2=sn;/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */if(!globalThis.DOMException)try{const{MessageChannel:c}=require("worker_threads"),l=new c().port1,d=new ArrayBuffer;l.postMessage(d,[d,d]);}catch(c){c.constructor.name==="DOMException"&&(globalThis.DOMException=c.constructor);}var nodeDomexception=globalThis.DOMException;const DOMException$1=_commonjsHelpers$1.getDefaultExportFromCjs(nodeDomexception),{stat}=node_fs.promises,blobFromSync=u$1((c,l)=>fromBlob(node_fs.statSync(c),c,l),"blobFromSync"),blobFrom=u$1((c,l)=>stat(c).then(d=>fromBlob(d,c,l)),"blobFrom"),fileFrom=u$1((c,l)=>stat(c).then(d=>fromFile(d,c,l)),"fileFrom"),fileFromSync=u$1((c,l)=>fromFile(node_fs.statSync(c),c,l),"fileFromSync"),fromBlob=u$1((c,l,d="")=>new r$1([new BlobDataItem({path:l,size:c.size,lastModified:c.mtimeMs,start:0})],{type:d}),"fromBlob"),fromFile=u$1((c,l,d="")=>new File$1$1([new BlobDataItem({path:l,size:c.size,lastModified:c.mtimeMs,start:0})],node_path.basename(l),{type:d,lastModified:c.mtimeMs}),"fromFile"),Xt$1=class Xt{constructor(l){ye$1(this,Me$1,void 0);ye$1(this,xe$1,void 0);ne(this,Me$1,l.path),ne(this,xe$1,l.start),this.size=l.size,this.lastModified=l.lastModified;}slice(l,d){return new Xt({path:D(this,Me$1),lastModified:this.lastModified,size:d-l,start:D(this,xe$1)+l})}async*stream(){const{mtimeMs:l}=await stat(D(this,Me$1));if(l>this.lastModified)throw new DOMException$1("The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.","NotReadableError");yield*node_fs.createReadStream(D(this,Me$1),{start:D(this,xe$1),end:D(this,xe$1)+this.size-1});}get[Symbol.toStringTag](){return "Blob"}};Me$1=new WeakMap,xe$1=new WeakMap,u$1(Xt$1,"BlobDataItem");let BlobDataItem=Xt$1;const supportedSchemas=new Set(["data:","http:","https:"]);async function fetch$1$1(c,l){return new Promise((d,y)=>{const b=new Request$3(c,l),{parsedURL:R,options:w}=getNodeRequestOptions(b);if(!supportedSchemas.has(R.protocol))throw new TypeError(`node-fetch cannot load ${c}. URL scheme "${R.protocol.replace(/:$/,"")}" is not supported.`);if(R.protocol==="data:"){const E=dataUriToBuffer(b.url),K=new Response$1(E,{headers:{"Content-Type":E.typeFull}});d(K);return}const v=(R.protocol==="https:"?https__default:http__default$1).request,{signal:I}=b;let B=null;const F=u$1(()=>{const E=new AbortError$2("The operation was aborted.");y(E),b.body&&b.body instanceof Stream__default$1.Readable&&b.body.destroy(E),!(!B||!B.body)&&B.body.emit("error",E);},"abort");if(I&&I.aborted){F();return}const k=u$1(()=>{F(),$();},"abortAndFinalize"),T=v(R.toString(),w);I&&I.addEventListener("abort",k);const $=u$1(()=>{T.abort(),I&&I.removeEventListener("abort",k);},"finalize");T.on("error",E=>{y(new FetchError(`request to ${b.url} failed, reason: ${E.message}`,"system",E)),$();}),fixResponseChunkedTransferBadEnding(T,E=>{B&&B.body&&B.body.destroy(E);}),process.version<"v14"&&T.on("socket",E=>{let K;E.prependListener("end",()=>{K=E._eventsCount;}),E.prependListener("close",U=>{if(B&&K<E._eventsCount&&!U){const N=new Error("Premature close");N.code="ERR_STREAM_PREMATURE_CLOSE",B.body.emit("error",N);}});}),T.on("response",E=>{T.setTimeout(0);const K=fromRawHeaders(E.rawHeaders);if(isRedirect(E.statusCode)){const M=K.get("Location");let H=null;try{H=M===null?null:new URL(M,b.url);}catch{if(b.redirect!=="manual"){y(new FetchError(`uri requested responds with an invalid redirect URL: ${M}`,"invalid-redirect")),$();return}}switch(b.redirect){case"error":y(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${b.url}`,"no-redirect")),$();return;case"manual":break;case"follow":{if(H===null)break;if(b.counter>=b.follow){y(new FetchError(`maximum redirect reached at: ${b.url}`,"max-redirect")),$();return}const G={headers:new Headers$1(b.headers),follow:b.follow,counter:b.counter+1,agent:b.agent,compress:b.compress,method:b.method,body:clone(b),signal:b.signal,size:b.size,referrer:b.referrer,referrerPolicy:b.referrerPolicy};if(!isDomainOrSubdomain(b.url,H)||!isSameProtocol(b.url,H))for(const wt of ["authorization","www-authenticate","cookie","cookie2"])G.headers.delete(wt);if(E.statusCode!==303&&b.body&&l.body instanceof Stream__default$1.Readable){y(new FetchError("Cannot follow redirect with body being a readable stream","unsupported-redirect")),$();return}(E.statusCode===303||(E.statusCode===301||E.statusCode===302)&&b.method==="POST")&&(G.method="GET",G.body=void 0,G.headers.delete("content-length"));const Q=parseReferrerPolicyFromHeader(K);Q&&(G.referrerPolicy=Q),d(fetch$1$1(new Request$3(H,G))),$();return}default:return y(new TypeError(`Redirect option '${b.redirect}' is not a valid value of RequestRedirect`))}}I&&E.once("end",()=>{I.removeEventListener("abort",k);});let U=Stream$1.pipeline(E,new Stream$1.PassThrough,M=>{M&&y(M);});process.version<"v12.10"&&E.on("aborted",k);const N={url:b.url,status:E.statusCode,statusText:E.statusMessage,headers:K,size:b.size,counter:b.counter,highWaterMark:b.highWaterMark},J=K.get("Content-Encoding");if(!b.compress||b.method==="HEAD"||J===null||E.statusCode===204||E.statusCode===304){B=new Response$1(U,N),d(B);return}const ge={flush:zlib__default$1.Z_SYNC_FLUSH,finishFlush:zlib__default$1.Z_SYNC_FLUSH};if(J==="gzip"||J==="x-gzip"){U=Stream$1.pipeline(U,zlib__default$1.createGunzip(ge),M=>{M&&y(M);}),B=new Response$1(U,N),d(B);return}if(J==="deflate"||J==="x-deflate"){const M=Stream$1.pipeline(E,new Stream$1.PassThrough,H=>{H&&y(H);});M.once("data",H=>{(H[0]&15)===8?U=Stream$1.pipeline(U,zlib__default$1.createInflate(),G=>{G&&y(G);}):U=Stream$1.pipeline(U,zlib__default$1.createInflateRaw(),G=>{G&&y(G);}),B=new Response$1(U,N),d(B);}),M.once("end",()=>{B||(B=new Response$1(U,N),d(B));});return}if(J==="br"){U=Stream$1.pipeline(U,zlib__default$1.createBrotliDecompress(),M=>{M&&y(M);}),B=new Response$1(U,N),d(B);return}B=new Response$1(U,N),d(B);}),writeToStream(T,b).catch(y);})}u$1(fetch$1$1,"fetch$1");function fixResponseChunkedTransferBadEnding(c,l){const d=require$$6$2.Buffer.from(`0\r
\r
`);let y=!1,b=!1,R;c.on("response",w=>{const{headers:v}=w;y=v["transfer-encoding"]==="chunked"&&!v["content-length"];}),c.on("socket",w=>{const v=u$1(()=>{if(y&&!b){const B=new Error("Premature close");B.code="ERR_STREAM_PREMATURE_CLOSE",l(B);}},"onSocketClose"),I=u$1(B=>{b=require$$6$2.Buffer.compare(B.slice(-5),d)===0,!b&&R&&(b=require$$6$2.Buffer.compare(R.slice(-3),d.slice(0,3))===0&&require$$6$2.Buffer.compare(B.slice(-2),d.slice(3))===0),R=B;},"onData");w.prependListener("close",v),w.on("data",I),c.on("close",()=>{w.removeListener("close",v),w.removeListener("data",I);});});}u$1(fixResponseChunkedTransferBadEnding,"fixResponseChunkedTransferBadEnding");const privateData=new WeakMap,wrappers=new WeakMap;function pd(c){const l=privateData.get(c);return console.assert(l!=null,"'this' is expected an Event object, but got",c),l}u$1(pd,"pd");function setCancelFlag(c){if(c.passiveListener!=null){typeof console<"u"&&typeof console.error=="function"&&console.error("Unable to preventDefault inside passive event listener invocation.",c.passiveListener);return}c.event.cancelable&&(c.canceled=!0,typeof c.event.preventDefault=="function"&&c.event.preventDefault());}u$1(setCancelFlag,"setCancelFlag");function Event$1(c,l){privateData.set(this,{eventTarget:c,event:l,eventPhase:2,currentTarget:c,canceled:!1,stopped:!1,immediateStopped:!1,passiveListener:null,timeStamp:l.timeStamp||Date.now()}),Object.defineProperty(this,"isTrusted",{value:!1,enumerable:!0});const d=Object.keys(l);for(let y=0;y<d.length;++y){const b=d[y];b in this||Object.defineProperty(this,b,defineRedirectDescriptor(b));}}u$1(Event$1,"Event"),Event$1.prototype={get type(){return pd(this).event.type},get target(){return pd(this).eventTarget},get currentTarget(){return pd(this).currentTarget},composedPath(){const c=pd(this).currentTarget;return c==null?[]:[c]},get NONE(){return 0},get CAPTURING_PHASE(){return 1},get AT_TARGET(){return 2},get BUBBLING_PHASE(){return 3},get eventPhase(){return pd(this).eventPhase},stopPropagation(){const c=pd(this);c.stopped=!0,typeof c.event.stopPropagation=="function"&&c.event.stopPropagation();},stopImmediatePropagation(){const c=pd(this);c.stopped=!0,c.immediateStopped=!0,typeof c.event.stopImmediatePropagation=="function"&&c.event.stopImmediatePropagation();},get bubbles(){return !!pd(this).event.bubbles},get cancelable(){return !!pd(this).event.cancelable},preventDefault(){setCancelFlag(pd(this));},get defaultPrevented(){return pd(this).canceled},get composed(){return !!pd(this).event.composed},get timeStamp(){return pd(this).timeStamp},get srcElement(){return pd(this).eventTarget},get cancelBubble(){return pd(this).stopped},set cancelBubble(c){if(!c)return;const l=pd(this);l.stopped=!0,typeof l.event.cancelBubble=="boolean"&&(l.event.cancelBubble=!0);},get returnValue(){return !pd(this).canceled},set returnValue(c){c||setCancelFlag(pd(this));},initEvent(){}},Object.defineProperty(Event$1.prototype,"constructor",{value:Event$1,configurable:!0,writable:!0}),typeof window<"u"&&typeof window.Event<"u"&&(Object.setPrototypeOf(Event$1.prototype,window.Event.prototype),wrappers.set(window.Event.prototype,Event$1));function defineRedirectDescriptor(c){return {get(){return pd(this).event[c]},set(l){pd(this).event[c]=l;},configurable:!0,enumerable:!0}}u$1(defineRedirectDescriptor,"defineRedirectDescriptor");function defineCallDescriptor(c){return {value(){const l=pd(this).event;return l[c].apply(l,arguments)},configurable:!0,enumerable:!0}}u$1(defineCallDescriptor,"defineCallDescriptor");function defineWrapper(c,l){const d=Object.keys(l);if(d.length===0)return c;function y(b,R){c.call(this,b,R);}u$1(y,"CustomEvent"),y.prototype=Object.create(c.prototype,{constructor:{value:y,configurable:!0,writable:!0}});for(let b=0;b<d.length;++b){const R=d[b];if(!(R in c.prototype)){const v=typeof Object.getOwnPropertyDescriptor(l,R).value=="function";Object.defineProperty(y.prototype,R,v?defineCallDescriptor(R):defineRedirectDescriptor(R));}}return y}u$1(defineWrapper,"defineWrapper");function getWrapper(c){if(c==null||c===Object.prototype)return Event$1;let l=wrappers.get(c);return l==null&&(l=defineWrapper(getWrapper(Object.getPrototypeOf(c)),c),wrappers.set(c,l)),l}u$1(getWrapper,"getWrapper");function wrapEvent(c,l){const d=getWrapper(Object.getPrototypeOf(l));return new d(c,l)}u$1(wrapEvent,"wrapEvent");function isStopped(c){return pd(c).immediateStopped}u$1(isStopped,"isStopped");function setEventPhase(c,l){pd(c).eventPhase=l;}u$1(setEventPhase,"setEventPhase");function setCurrentTarget(c,l){pd(c).currentTarget=l;}u$1(setCurrentTarget,"setCurrentTarget");function setPassiveListener(c,l){pd(c).passiveListener=l;}u$1(setPassiveListener,"setPassiveListener");const listenersMap=new WeakMap,CAPTURE=1,BUBBLE=2,ATTRIBUTE=3;function isObject(c){return c!==null&&typeof c=="object"}u$1(isObject,"isObject");function getListeners(c){const l=listenersMap.get(c);if(l==null)throw new TypeError("'this' is expected an EventTarget object, but got another value.");return l}u$1(getListeners,"getListeners");function defineEventAttributeDescriptor(c){return {get(){let d=getListeners(this).get(c);for(;d!=null;){if(d.listenerType===ATTRIBUTE)return d.listener;d=d.next;}return null},set(l){typeof l!="function"&&!isObject(l)&&(l=null);const d=getListeners(this);let y=null,b=d.get(c);for(;b!=null;)b.listenerType===ATTRIBUTE?y!==null?y.next=b.next:b.next!==null?d.set(c,b.next):d.delete(c):y=b,b=b.next;if(l!==null){const R={listener:l,listenerType:ATTRIBUTE,passive:!1,once:!1,next:null};y===null?d.set(c,R):y.next=R;}},configurable:!0,enumerable:!0}}u$1(defineEventAttributeDescriptor,"defineEventAttributeDescriptor");function defineEventAttribute(c,l){Object.defineProperty(c,`on${l}`,defineEventAttributeDescriptor(l));}u$1(defineEventAttribute,"defineEventAttribute");function defineCustomEventTarget(c){function l(){EventTarget$1.call(this);}u$1(l,"CustomEventTarget"),l.prototype=Object.create(EventTarget$1.prototype,{constructor:{value:l,configurable:!0,writable:!0}});for(let d=0;d<c.length;++d)defineEventAttribute(l.prototype,c[d]);return l}u$1(defineCustomEventTarget,"defineCustomEventTarget");function EventTarget$1(){if(this instanceof EventTarget$1){listenersMap.set(this,new Map);return}if(arguments.length===1&&Array.isArray(arguments[0]))return defineCustomEventTarget(arguments[0]);if(arguments.length>0){const c=new Array(arguments.length);for(let l=0;l<arguments.length;++l)c[l]=arguments[l];return defineCustomEventTarget(c)}throw new TypeError("Cannot call a class as a function")}u$1(EventTarget$1,"EventTarget"),EventTarget$1.prototype={addEventListener(c,l,d){if(l==null)return;if(typeof l!="function"&&!isObject(l))throw new TypeError("'listener' should be a function or an object.");const y=getListeners(this),b=isObject(d),w=(b?!!d.capture:!!d)?CAPTURE:BUBBLE,v={listener:l,listenerType:w,passive:b&&!!d.passive,once:b&&!!d.once,next:null};let I=y.get(c);if(I===void 0){y.set(c,v);return}let B=null;for(;I!=null;){if(I.listener===l&&I.listenerType===w)return;B=I,I=I.next;}B.next=v;},removeEventListener(c,l,d){if(l==null)return;const y=getListeners(this),R=(isObject(d)?!!d.capture:!!d)?CAPTURE:BUBBLE;let w=null,v=y.get(c);for(;v!=null;){if(v.listener===l&&v.listenerType===R){w!==null?w.next=v.next:v.next!==null?y.set(c,v.next):y.delete(c);return}w=v,v=v.next;}},dispatchEvent(c){if(c==null||typeof c.type!="string")throw new TypeError('"event.type" should be a string.');const l=getListeners(this),d=c.type;let y=l.get(d);if(y==null)return !0;const b=wrapEvent(this,c);let R=null;for(;y!=null;){if(y.once?R!==null?R.next=y.next:y.next!==null?l.set(d,y.next):l.delete(d):R=y,setPassiveListener(b,y.passive?y.listener:null),typeof y.listener=="function")try{y.listener.call(this,b);}catch(w){typeof console<"u"&&typeof console.error=="function"&&console.error(w);}else y.listenerType!==ATTRIBUTE&&typeof y.listener.handleEvent=="function"&&y.listener.handleEvent(b);if(isStopped(b))break;y=y.next;}return setPassiveListener(b,null),setEventPhase(b,0),setCurrentTarget(b,null),!b.defaultPrevented}},Object.defineProperty(EventTarget$1.prototype,"constructor",{value:EventTarget$1,configurable:!0,writable:!0}),typeof window<"u"&&typeof window.EventTarget<"u"&&Object.setPrototypeOf(EventTarget$1.prototype,window.EventTarget.prototype);const an=class an extends EventTarget$1{constructor(){throw super(),new TypeError("AbortSignal cannot be constructed directly")}get aborted(){const l=abortedFlags.get(this);if(typeof l!="boolean")throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this===null?"null":typeof this}`);return l}};u$1(an,"AbortSignal");let AbortSignal$1=an;defineEventAttribute(AbortSignal$1.prototype,"abort");function createAbortSignal(){const c=Object.create(AbortSignal$1.prototype);return EventTarget$1.call(c),abortedFlags.set(c,!1),c}u$1(createAbortSignal,"createAbortSignal");function abortSignal$1(c){abortedFlags.get(c)===!1&&(abortedFlags.set(c,!0),c.dispatchEvent({type:"abort"}));}u$1(abortSignal$1,"abortSignal");const abortedFlags=new WeakMap;Object.defineProperties(AbortSignal$1.prototype,{aborted:{enumerable:!0}}),typeof Symbol=="function"&&typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(AbortSignal$1.prototype,Symbol.toStringTag,{configurable:!0,value:"AbortSignal"});let AbortController$1$1=(St$1=class{constructor(){signals.set(this,createAbortSignal());}get signal(){return getSignal(this)}abort(){abortSignal$1(getSignal(this));}},u$1(St$1,"AbortController"),St$1);const signals=new WeakMap;function getSignal(c){const l=signals.get(c);if(l==null)throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${c===null?"null":typeof c}`);return l}u$1(getSignal,"getSignal"),Object.defineProperties(AbortController$1$1.prototype,{signal:{enumerable:!0},abort:{enumerable:!0}}),typeof Symbol=="function"&&typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(AbortController$1$1.prototype,Symbol.toStringTag,{configurable:!0,value:"AbortController"});var t=Object.defineProperty,e$2=u$1((c,l)=>t(c,"name",{value:l,configurable:!0}),"e");const fetch$3=fetch$1$1;s$2();function s$2(){!globalThis.process?.versions?.node&&!globalThis.process?.env.DISABLE_NODE_FETCH_NATIVE_WARN&&console.warn("[node-fetch-native] Node.js compatible build of `node-fetch-native` is being used in a non-Node.js environment. Please make sure you are using proper export conditions or report this issue to https://github.com/unjs/node-fetch-native. You can set `process.env.DISABLE_NODE_FETCH_NATIVE_WARN` to disable this warning.");}u$1(s$2,"s"),e$2(s$2,"checkNodeEnvironment"),node$2.AbortController=AbortController$1$1,node$2.AbortError=AbortError$2,node$2.Blob=r$1,node$2.FetchError=FetchError,node$2.File=File$1$1,node$2.FormData=FormData$1,node$2.Headers=Headers$1,node$2.Request=Request$3,node$2.Response=Response$1,node$2.blobFrom=blobFrom,node$2.blobFromSync=blobFromSync,node$2.default=fetch$3,node$2.fetch=fetch$3,node$2.fileFrom=fileFrom,node$2.fileFromSync=fileFromSync,node$2.isRedirect=isRedirect;

var i$1=Object.defineProperty;var l=(r,t)=>i$1(r,"name",{value:t,configurable:!0});Object.defineProperty(dist$3,"__esModule",{value:!0});const node$1=node$2;var s$1=Object.defineProperty,e=l((r,t)=>s$1(r,"name",{value:t,configurable:!0}),"e");const o=!!globalThis.process?.env?.FORCE_NODE_FETCH;function p(){return !o&&globalThis.fetch?globalThis.fetch:node$1.fetch}l(p,"p"),e(p,"_getFetch");const fetch$2=p(),Blob$2=!o&&globalThis.Blob||node$1.Blob,File=!o&&globalThis.File||node$1.File,FormData=!o&&globalThis.FormData||node$1.FormData,Headers=!o&&globalThis.Headers||node$1.Headers,Request$2=!o&&globalThis.Request||node$1.Request,Response=!o&&globalThis.Response||node$1.Response,AbortController$1=!o&&globalThis.AbortController||node$1.AbortController;dist$3.AbortError=node$1.AbortError,dist$3.FetchError=node$1.FetchError,dist$3.blobFrom=node$1.blobFrom,dist$3.blobFromSync=node$1.blobFromSync,dist$3.fileFrom=node$1.fileFrom,dist$3.fileFromSync=node$1.fileFromSync,dist$3.isRedirect=node$1.isRedirect,dist$3.AbortController=AbortController$1,dist$3.Blob=Blob$2,dist$3.File=File,dist$3.FormData=FormData,dist$3.Headers=Headers,dist$3.Request=Request$2,dist$3.Response=Response,dist$3.default=fetch$2,dist$3.fetch=fetch$2;

const nodeFetch = dist$3;

function fetch$1(input, options) {
  return nodeFetch.fetch(input, options);
}

for (const key in nodeFetch) {
  fetch$1[key] = nodeFetch[key];
}

var lib = fetch$1;

var fetch_2;
var xt=Object.defineProperty;var Xt=(e,A,t)=>A in e?xt(e,A,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[A]=t;var Q=(e,A)=>xt(e,"name",{value:A,configurable:!0});var ZA=(e,A,t)=>(Xt(e,typeof A!="symbol"?A+"":A,t),t),ht=(e,A,t)=>{if(!A.has(e))throw TypeError("Cannot "+t)},Wt=(e,A)=>{if(Object(A)!==A)throw TypeError('Cannot use the "in" operator on this value');return e.has(A)},x=(e,A,t)=>(ht(e,A,"read from private field"),t?t.call(e):A.get(e)),FA=(e,A,t)=>{if(A.has(e))throw TypeError("Cannot add the same private member more than once");A instanceof WeakSet?A.add(e):A.set(e,t);},DA=(e,A,t,r)=>(ht(e,A,"write to private field"),r?r.call(e,t):A.set(e,t),t);var xA=(e,A,t)=>(ht(e,A,"access private method"),t);var ye,De,Re,we,ke,pe,Fe,Ne,be,Se,me,Ue,Le,Me,Ye,Je,Ge,Te,He,Ve,ve,xe,le,We,qe,Oe,Pe,Ze,Xe,Ke,$e,je,ze,_e,gt,qt,At,ue,et,tt,rt;const http$2=vt$1,https$1=https$3,require$$1=require$$10,require$$0=assert$e,require$$4=require$$12,Stream=me$1,require$$6=require$$8$2,require$$0$1=require$$9$1,require$$8=require$$16,require$$0$2=require$$17,require$$0$3=EventEmitter$1,_commonjsHelpers=nodeFetchNative_61758d11,require$$4$1=require$$20,zlib=st,require$$5=require$$22,require$$8$1=require$$23,require$$0$4=os,require$$4$2=require$$25;const require$$6$1=require$$0$f,require$$5$1=require$$2$2,require$$2=require$$29,require$$0$5=require$$0$h,require$$1$1=require$$1$6,require$$0$7=require$$32,require$$1$3=require$$33,require$$1$2=tty__default,require$$0$6=require$$2$3,require$$3=require$$0$9,require$$5$2=require$$7,require$$2$1=require$$0$c,nodeFetchNative=lib;function _interopDefaultCompat(e){return e&&typeof e=="object"&&"default"in e?e.default:e}Q(_interopDefaultCompat,"_interopDefaultCompat");function _interopNamespaceCompat(e){if(e&&typeof e=="object"&&"default"in e)return e;const A=Object.create(null);if(e)for(const t in e)A[t]=e[t];return A.default=e,A}Q(_interopNamespaceCompat,"_interopNamespaceCompat");const http__default=_interopDefaultCompat(http$2),http__namespace=_interopNamespaceCompat(http$2),https__namespace=_interopNamespaceCompat(https$1),require$$1__default=_interopDefaultCompat(require$$1),require$$0__default=_interopDefaultCompat(require$$0),require$$4__default=_interopDefaultCompat(require$$4),Stream__default=_interopDefaultCompat(Stream),require$$6__default=_interopDefaultCompat(require$$6),require$$0__default$1=_interopDefaultCompat(require$$0$1),require$$8__default=_interopDefaultCompat(require$$8),require$$0__default$2=_interopDefaultCompat(require$$0$2),require$$0__default$3=_interopDefaultCompat(require$$0$3),require$$4__default$1=_interopDefaultCompat(require$$4$1),zlib__default=_interopDefaultCompat(zlib),require$$5__default=_interopDefaultCompat(require$$5),require$$8__default$1=_interopDefaultCompat(require$$8$1),require$$0__default$4=_interopDefaultCompat(require$$0$4),require$$4__default$2=_interopDefaultCompat(require$$4$2),require$$6__default$1=_interopDefaultCompat(require$$6$1),require$$5__default$1=_interopDefaultCompat(require$$5$1),require$$2__default=_interopDefaultCompat(require$$2),require$$0__default$5=_interopDefaultCompat(require$$0$5),require$$1__default$1=_interopDefaultCompat(require$$1$1),require$$0__default$7=_interopDefaultCompat(require$$0$7),require$$1__default$3=_interopDefaultCompat(require$$1$3),require$$1__default$2=_interopDefaultCompat(require$$1$2),require$$0__default$6=_interopDefaultCompat(require$$0$6),require$$3__default=_interopDefaultCompat(require$$3),require$$5__default$2=_interopDefaultCompat(require$$5$2),require$$2__default$1=_interopDefaultCompat(require$$2$1);var symbols$4={kClose:Symbol("close"),kDestroy:Symbol("destroy"),kDispatch:Symbol("dispatch"),kUrl:Symbol("url"),kWriting:Symbol("writing"),kResuming:Symbol("resuming"),kQueue:Symbol("queue"),kConnect:Symbol("connect"),kConnecting:Symbol("connecting"),kHeadersList:Symbol("headers list"),kKeepAliveDefaultTimeout:Symbol("default keep alive timeout"),kKeepAliveMaxTimeout:Symbol("max keep alive timeout"),kKeepAliveTimeoutThreshold:Symbol("keep alive timeout threshold"),kKeepAliveTimeoutValue:Symbol("keep alive timeout"),kKeepAlive:Symbol("keep alive"),kHeadersTimeout:Symbol("headers timeout"),kBodyTimeout:Symbol("body timeout"),kServerName:Symbol("server name"),kLocalAddress:Symbol("local address"),kHost:Symbol("host"),kNoRef:Symbol("no ref"),kBodyUsed:Symbol("used"),kRunning:Symbol("running"),kBlocking:Symbol("blocking"),kPending:Symbol("pending"),kSize:Symbol("size"),kBusy:Symbol("busy"),kQueued:Symbol("queued"),kFree:Symbol("free"),kConnected:Symbol("connected"),kClosed:Symbol("closed"),kNeedDrain:Symbol("need drain"),kReset:Symbol("reset"),kDestroyed:Symbol.for("nodejs.stream.destroyed"),kResume:Symbol("resume"),kOnError:Symbol("on error"),kMaxHeadersSize:Symbol("max headers size"),kRunningIdx:Symbol("running index"),kPendingIdx:Symbol("pending index"),kError:Symbol("error"),kClients:Symbol("clients"),kClient:Symbol("client"),kParser:Symbol("parser"),kOnDestroyed:Symbol("destroy callbacks"),kPipelining:Symbol("pipelining"),kSocket:Symbol("socket"),kHostHeader:Symbol("host header"),kConnector:Symbol("connector"),kStrictContentLength:Symbol("strict content length"),kMaxRedirections:Symbol("maxRedirections"),kMaxRequests:Symbol("maxRequestsPerClient"),kProxy:Symbol("proxy agent options"),kCounter:Symbol("socket request counter"),kInterceptors:Symbol("dispatch interceptors"),kMaxResponseSize:Symbol("max response size"),kHTTP2Session:Symbol("http2Session"),kHTTP2SessionState:Symbol("http2Session state"),kRetryHandlerDefaultRetry:Symbol("retry agent default retry"),kConstruct:Symbol("constructable"),kListeners:Symbol("listeners"),kHTTPContext:Symbol("http context"),kMaxConcurrentStreams:Symbol("max concurrent streams")};let UndiciError$1=(ye=class extends Error{constructor(A){super(A),this.name="UndiciError",this.code="UND_ERR";}},Q(ye,"UndiciError"),ye),ConnectTimeoutError$1=(De=class extends UndiciError$1{constructor(A){super(A),this.name="ConnectTimeoutError",this.message=A||"Connect Timeout Error",this.code="UND_ERR_CONNECT_TIMEOUT";}},Q(De,"ConnectTimeoutError"),De),HeadersTimeoutError$1=(Re=class extends UndiciError$1{constructor(A){super(A),this.name="HeadersTimeoutError",this.message=A||"Headers Timeout Error",this.code="UND_ERR_HEADERS_TIMEOUT";}},Q(Re,"HeadersTimeoutError"),Re),HeadersOverflowError$1=(we=class extends UndiciError$1{constructor(A){super(A),this.name="HeadersOverflowError",this.message=A||"Headers Overflow Error",this.code="UND_ERR_HEADERS_OVERFLOW";}},Q(we,"HeadersOverflowError"),we),BodyTimeoutError$1=(ke=class extends UndiciError$1{constructor(A){super(A),this.name="BodyTimeoutError",this.message=A||"Body Timeout Error",this.code="UND_ERR_BODY_TIMEOUT";}},Q(ke,"BodyTimeoutError"),ke),ResponseStatusCodeError$1=(pe=class extends UndiciError$1{constructor(A,t,r,n){super(A),this.name="ResponseStatusCodeError",this.message=A||"Response Status Code Error",this.code="UND_ERR_RESPONSE_STATUS_CODE",this.body=n,this.status=t,this.statusCode=t,this.headers=r;}},Q(pe,"ResponseStatusCodeError"),pe),InvalidArgumentError$k=(Fe=class extends UndiciError$1{constructor(A){super(A),this.name="InvalidArgumentError",this.message=A||"Invalid Argument Error",this.code="UND_ERR_INVALID_ARG";}},Q(Fe,"InvalidArgumentError"),Fe),InvalidReturnValueError$2=(Ne=class extends UndiciError$1{constructor(A){super(A),this.name="InvalidReturnValueError",this.message=A||"Invalid Return Value Error",this.code="UND_ERR_INVALID_RETURN_VALUE";}},Q(Ne,"InvalidReturnValueError"),Ne),AbortError$1=(be=class extends UndiciError$1{constructor(A){super(A),this.name="AbortError",this.message=A||"The operation was aborted";}},Q(be,"AbortError"),be),RequestAbortedError$a=(Se=class extends AbortError$1{constructor(A){super(A),this.name="AbortError",this.message=A||"Request aborted",this.code="UND_ERR_ABORTED";}},Q(Se,"RequestAbortedError"),Se),InformationalError$3=(me=class extends UndiciError$1{constructor(A){super(A),this.name="InformationalError",this.message=A||"Request information",this.code="UND_ERR_INFO";}},Q(me,"InformationalError"),me),RequestContentLengthMismatchError$2=(Ue=class extends UndiciError$1{constructor(A){super(A),this.name="RequestContentLengthMismatchError",this.message=A||"Request body length does not match content-length header",this.code="UND_ERR_REQ_CONTENT_LENGTH_MISMATCH";}},Q(Ue,"RequestContentLengthMismatchError"),Ue),ResponseContentLengthMismatchError$1=(Le=class extends UndiciError$1{constructor(A){super(A),this.name="ResponseContentLengthMismatchError",this.message=A||"Response body length does not match content-length header",this.code="UND_ERR_RES_CONTENT_LENGTH_MISMATCH";}},Q(Le,"ResponseContentLengthMismatchError"),Le),ClientDestroyedError$2=(Me=class extends UndiciError$1{constructor(A){super(A),this.name="ClientDestroyedError",this.message=A||"The client is destroyed",this.code="UND_ERR_DESTROYED";}},Q(Me,"ClientDestroyedError"),Me),ClientClosedError$1=(Ye=class extends UndiciError$1{constructor(A){super(A),this.name="ClientClosedError",this.message=A||"The client is closed",this.code="UND_ERR_CLOSED";}},Q(Ye,"ClientClosedError"),Ye),SocketError$4=(Je=class extends UndiciError$1{constructor(A,t){super(A),this.name="SocketError",this.message=A||"Socket error",this.code="UND_ERR_SOCKET",this.socket=t;}},Q(Je,"SocketError"),Je),NotSupportedError$2=(Ge=class extends UndiciError$1{constructor(A){super(A),this.name="NotSupportedError",this.message=A||"Not supported error",this.code="UND_ERR_NOT_SUPPORTED";}},Q(Ge,"NotSupportedError"),Ge);const ft=class ft extends UndiciError$1{constructor(A){super(A),this.name="MissingUpstreamError",this.message=A||"No upstream has been added to the BalancedPool",this.code="UND_ERR_BPL_MISSING_UPSTREAM";}};Q(ft,"BalancedPoolMissingUpstreamError");let BalancedPoolMissingUpstreamError=ft,HTTPParserError$1=(Te=class extends Error{constructor(A,t,r){super(A),this.name="HTTPParserError",this.code=t?`HPE_${t}`:void 0,this.data=r?r.toString():void 0;}},Q(Te,"HTTPParserError"),Te),ResponseExceededMaxSizeError$1=(He=class extends UndiciError$1{constructor(A){super(A),this.name="ResponseExceededMaxSizeError",this.message=A||"Response content exceeded max size",this.code="UND_ERR_RES_EXCEEDED_MAX_SIZE";}},Q(He,"ResponseExceededMaxSizeError"),He);const yt=class yt extends UndiciError$1{constructor(A,t,{headers:r,data:n}){super(A),this.name="RequestRetryError",this.message=A||"Request retry error",this.code="UND_ERR_REQ_RETRY",this.statusCode=t,this.data=n,this.headers=r;}};Q(yt,"RequestRetryError");let RequestRetryError=yt,SecureProxyConnectionError$1=(Ve=class extends UndiciError$1{constructor(A,t,r){super(t,{cause:A,...r??{}}),this.name="SecureProxyConnectionError",this.message=t||"Secure Proxy Connection failed",this.code="UND_ERR_PRX_TLS",this.cause=A;}},Q(Ve,"SecureProxyConnectionError"),Ve);var errors$1={AbortError:AbortError$1,HTTPParserError:HTTPParserError$1,UndiciError:UndiciError$1,HeadersTimeoutError:HeadersTimeoutError$1,HeadersOverflowError:HeadersOverflowError$1,BodyTimeoutError:BodyTimeoutError$1,RequestContentLengthMismatchError:RequestContentLengthMismatchError$2,ConnectTimeoutError:ConnectTimeoutError$1,ResponseStatusCodeError:ResponseStatusCodeError$1,InvalidArgumentError:InvalidArgumentError$k,InvalidReturnValueError:InvalidReturnValueError$2,RequestAbortedError:RequestAbortedError$a,ClientDestroyedError:ClientDestroyedError$2,ClientClosedError:ClientClosedError$1,InformationalError:InformationalError$3,SocketError:SocketError$4,NotSupportedError:NotSupportedError$2,ResponseContentLengthMismatchError:ResponseContentLengthMismatchError$1,BalancedPoolMissingUpstreamError,ResponseExceededMaxSizeError:ResponseExceededMaxSizeError$1,RequestRetryError,SecureProxyConnectionError:SecureProxyConnectionError$1};const headerNameLowerCasedRecord$3={},wellknownHeaderNames$1=["Accept","Accept-Encoding","Accept-Language","Accept-Ranges","Access-Control-Allow-Credentials","Access-Control-Allow-Headers","Access-Control-Allow-Methods","Access-Control-Allow-Origin","Access-Control-Expose-Headers","Access-Control-Max-Age","Access-Control-Request-Headers","Access-Control-Request-Method","Age","Allow","Alt-Svc","Alt-Used","Authorization","Cache-Control","Clear-Site-Data","Connection","Content-Disposition","Content-Encoding","Content-Language","Content-Length","Content-Location","Content-Range","Content-Security-Policy","Content-Security-Policy-Report-Only","Content-Type","Cookie","Cross-Origin-Embedder-Policy","Cross-Origin-Opener-Policy","Cross-Origin-Resource-Policy","Date","Device-Memory","Downlink","ECT","ETag","Expect","Expect-CT","Expires","Forwarded","From","Host","If-Match","If-Modified-Since","If-None-Match","If-Range","If-Unmodified-Since","Keep-Alive","Last-Modified","Link","Location","Max-Forwards","Origin","Permissions-Policy","Pragma","Proxy-Authenticate","Proxy-Authorization","RTT","Range","Referer","Referrer-Policy","Refresh","Retry-After","Sec-WebSocket-Accept","Sec-WebSocket-Extensions","Sec-WebSocket-Key","Sec-WebSocket-Protocol","Sec-WebSocket-Version","Server","Server-Timing","Service-Worker-Allowed","Service-Worker-Navigation-Preload","Set-Cookie","SourceMap","Strict-Transport-Security","Supports-Loading-Mode","TE","Timing-Allow-Origin","Trailer","Transfer-Encoding","Upgrade","Upgrade-Insecure-Requests","User-Agent","Vary","Via","WWW-Authenticate","X-Content-Type-Options","X-DNS-Prefetch-Control","X-Frame-Options","X-Permitted-Cross-Domain-Policies","X-Powered-By","X-Requested-With","X-XSS-Protection"];for(let e=0;e<wellknownHeaderNames$1.length;++e){const A=wellknownHeaderNames$1[e],t=A.toLowerCase();headerNameLowerCasedRecord$3[A]=headerNameLowerCasedRecord$3[t]=t;}Object.setPrototypeOf(headerNameLowerCasedRecord$3,null);var constants$5={wellknownHeaderNames:wellknownHeaderNames$1,headerNameLowerCasedRecord:headerNameLowerCasedRecord$3};const{wellknownHeaderNames,headerNameLowerCasedRecord:headerNameLowerCasedRecord$2}=constants$5,Qe=class Qe{constructor(A,t,r){ZA(this,"value",null);ZA(this,"left",null);ZA(this,"middle",null);ZA(this,"right",null);ZA(this,"code");if(r===void 0||r>=A.length)throw new TypeError("Unreachable");if((this.code=A.charCodeAt(r))>127)throw new TypeError("key must be ascii string");A.length!==++r?this.middle=new Qe(A,t,r):this.value=t;}add(A,t){const r=A.length;if(r===0)throw new TypeError("Unreachable");let n=0,o=this;for(;;){const B=A.charCodeAt(n);if(B>127)throw new TypeError("key must be ascii string");if(o.code===B)if(r===++n){o.value=t;break}else if(o.middle!==null)o=o.middle;else {o.middle=new Qe(A,t,n);break}else if(o.code<B)if(o.left!==null)o=o.left;else {o.left=new Qe(A,t,n);break}else if(o.right!==null)o=o.right;else {o.right=new Qe(A,t,n);break}}}search(A){const t=A.length;let r=0,n=this;for(;n!==null&&r<t;){let o=A[r];for(o<=90&&o>=65&&(o|=32);n!==null;){if(o===n.code){if(t===++r)return n;n=n.middle;break}n=n.code<o?n.left:n.right;}}return null}};Q(Qe,"TstNode");let TstNode=Qe;const Dt=class Dt{constructor(){ZA(this,"node",null);}insert(A,t){this.node===null?this.node=new TstNode(A,t,0):this.node.add(A,t);}lookup(A){return this.node?.search(A)?.value??null}};Q(Dt,"TernarySearchTree");let TernarySearchTree=Dt;const tree$1=new TernarySearchTree;for(let e=0;e<wellknownHeaderNames.length;++e){const A=headerNameLowerCasedRecord$2[wellknownHeaderNames[e]];tree$1.insert(A,A);}var tree_1={TernarySearchTree,tree:tree$1};const assert$a=require$$0__default,{kDestroyed:kDestroyed$1,kBodyUsed:kBodyUsed$1}=symbols$4,{IncomingMessage}=http__default,stream$1=Stream__default,net$4=require$$4__default,{InvalidArgumentError:InvalidArgumentError$j}=errors$1,{Blob:Blob$1}=require$$6__default,nodeUtil=require$$0__default$1,{stringify}=require$$8__default,{headerNameLowerCasedRecord:headerNameLowerCasedRecord$1}=constants$5,{tree}=tree_1,[nodeMajor,nodeMinor]=process.versions.node.split(".").map(e=>Number(e));function nop$1(){}Q(nop$1,"nop$1");function isStream$1(e){return e&&typeof e=="object"&&typeof e.pipe=="function"&&typeof e.on=="function"}Q(isStream$1,"isStream$1");function isBlobLike$1(e){return Blob$1&&e instanceof Blob$1||e&&typeof e=="object"&&(typeof e.stream=="function"||typeof e.arrayBuffer=="function")&&/^(Blob|File)$/.test(e[Symbol.toStringTag])}Q(isBlobLike$1,"isBlobLike$1");function buildURL$3(e,A){if(e.includes("?")||e.includes("#"))throw new Error('Query params cannot be passed when url already contains "?" or "#".');const t=stringify(A);return t&&(e+="?"+t),e}Q(buildURL$3,"buildURL$3");function parseURL(e){if(typeof e=="string"){if(e=new URL(e),!/^https?:/.test(e.origin||e.protocol))throw new InvalidArgumentError$j("Invalid URL protocol: the URL must start with `http:` or `https:`.");return e}if(!e||typeof e!="object")throw new InvalidArgumentError$j("Invalid URL: The URL argument must be a non-null object.");if(!/^https?:/.test(e.origin||e.protocol))throw new InvalidArgumentError$j("Invalid URL protocol: the URL must start with `http:` or `https:`.");if(!(e instanceof URL)){if(e.port!=null&&e.port!==""&&!Number.isFinite(parseInt(e.port)))throw new InvalidArgumentError$j("Invalid URL: port must be a valid integer or a string representation of an integer.");if(e.path!=null&&typeof e.path!="string")throw new InvalidArgumentError$j("Invalid URL path: the path must be a string or null/undefined.");if(e.pathname!=null&&typeof e.pathname!="string")throw new InvalidArgumentError$j("Invalid URL pathname: the pathname must be a string or null/undefined.");if(e.hostname!=null&&typeof e.hostname!="string")throw new InvalidArgumentError$j("Invalid URL hostname: the hostname must be a string or null/undefined.");if(e.origin!=null&&typeof e.origin!="string")throw new InvalidArgumentError$j("Invalid URL origin: the origin must be a string or null/undefined.");const A=e.port!=null?e.port:e.protocol==="https:"?443:80;let t=e.origin!=null?e.origin:`${e.protocol}//${e.hostname}:${A}`,r=e.path!=null?e.path:`${e.pathname||""}${e.search||""}`;t.endsWith("/")&&(t=t.substring(0,t.length-1)),r&&!r.startsWith("/")&&(r=`/${r}`),e=new URL(t+r);}return e}Q(parseURL,"parseURL");function parseOrigin(e){if(e=parseURL(e),e.pathname!=="/"||e.search||e.hash)throw new InvalidArgumentError$j("invalid url");return e}Q(parseOrigin,"parseOrigin");function getHostname(e){if(e[0]==="["){const t=e.indexOf("]");return assert$a(t!==-1),e.substring(1,t)}const A=e.indexOf(":");return A===-1?e:e.substring(0,A)}Q(getHostname,"getHostname");function getServerName$1(e){if(!e)return null;assert$a.strictEqual(typeof e,"string");const A=getHostname(e);return net$4.isIP(A)?"":A}Q(getServerName$1,"getServerName$1");function deepClone(e){return JSON.parse(JSON.stringify(e))}Q(deepClone,"deepClone");function isAsyncIterable(e){return e!=null&&typeof e[Symbol.asyncIterator]=="function"}Q(isAsyncIterable,"isAsyncIterable");function isIterable$1(e){return e!=null&&(typeof e[Symbol.iterator]=="function"||typeof e[Symbol.asyncIterator]=="function")}Q(isIterable$1,"isIterable$1");function bodyLength(e){if(e==null)return 0;if(isStream$1(e)){const A=e._readableState;return A&&A.objectMode===!1&&A.ended===!0&&Number.isFinite(A.length)?A.length:null}else {if(isBlobLike$1(e))return e.size!=null?e.size:null;if(isBuffer$1(e))return e.byteLength}return null}Q(bodyLength,"bodyLength");function isDestroyed(e){return e&&!!(e.destroyed||e[kDestroyed$1]||stream$1.isDestroyed?.(e))}Q(isDestroyed,"isDestroyed");function isReadableAborted(e){const A=e?._readableState;return isDestroyed(e)&&A&&!A.endEmitted}Q(isReadableAborted,"isReadableAborted");function destroy$1(e,A){e==null||!isStream$1(e)||isDestroyed(e)||(typeof e.destroy=="function"?(Object.getPrototypeOf(e).constructor===IncomingMessage&&(e.socket=null),e.destroy(A)):A&&queueMicrotask(()=>{e.emit("error",A);}),e.destroyed!==!0&&(e[kDestroyed$1]=!0));}Q(destroy$1,"destroy$1");const KEEPALIVE_TIMEOUT_EXPR=/timeout=(\d+)/;function parseKeepAliveTimeout(e){const A=e.toString().match(KEEPALIVE_TIMEOUT_EXPR);return A?parseInt(A[1],10)*1e3:null}Q(parseKeepAliveTimeout,"parseKeepAliveTimeout");function headerNameToString(e){return typeof e=="string"?headerNameLowerCasedRecord$1[e]??e.toLowerCase():tree.lookup(e)??e.toString("latin1").toLowerCase()}Q(headerNameToString,"headerNameToString");function bufferToLowerCasedHeaderName(e){return tree.lookup(e)??e.toString("latin1").toLowerCase()}Q(bufferToLowerCasedHeaderName,"bufferToLowerCasedHeaderName");function parseHeaders(e,A){if(!Array.isArray(e))return e;A===void 0&&(A={});for(let t=0;t<e.length;t+=2){const r=headerNameToString(e[t]);let n=A[r];if(n)typeof n=="string"&&(n=[n],A[r]=n),n.push(e[t+1].toString("utf8"));else {const o=e[t+1];typeof o=="string"?A[r]=o:A[r]=Array.isArray(o)?o.map(B=>B.toString("utf8")):o.toString("utf8");}}return "content-length"in A&&"content-disposition"in A&&(A["content-disposition"]=Buffer.from(A["content-disposition"]).toString("latin1")),A}Q(parseHeaders,"parseHeaders");function parseRawHeaders(e){const A=e.length,t=new Array(A);let r=!1,n=-1,o,B,l=0;for(let C=0;C<e.length;C+=2)o=e[C],B=e[C+1],typeof o!="string"&&(o=o.toString()),typeof B!="string"&&(B=B.toString("utf8")),l=o.length,l===14&&o[7]==="-"&&(o==="content-length"||o.toLowerCase()==="content-length")?r=!0:l===19&&o[7]==="-"&&(o==="content-disposition"||o.toLowerCase()==="content-disposition")&&(n=C+1),t[C]=o,t[C+1]=B;return r&&n!==-1&&(t[n]=Buffer.from(t[n]).toString("latin1")),t}Q(parseRawHeaders,"parseRawHeaders");function isBuffer$1(e){return e instanceof Uint8Array||Buffer.isBuffer(e)}Q(isBuffer$1,"isBuffer$1");function validateHandler$1(e,A,t){if(!e||typeof e!="object")throw new InvalidArgumentError$j("handler must be an object");if(typeof e.onConnect!="function")throw new InvalidArgumentError$j("invalid onConnect method");if(typeof e.onError!="function")throw new InvalidArgumentError$j("invalid onError method");if(typeof e.onBodySent!="function"&&e.onBodySent!==void 0)throw new InvalidArgumentError$j("invalid onBodySent method");if(t||A==="CONNECT"){if(typeof e.onUpgrade!="function")throw new InvalidArgumentError$j("invalid onUpgrade method")}else {if(typeof e.onHeaders!="function")throw new InvalidArgumentError$j("invalid onHeaders method");if(typeof e.onData!="function")throw new InvalidArgumentError$j("invalid onData method");if(typeof e.onComplete!="function")throw new InvalidArgumentError$j("invalid onComplete method")}}Q(validateHandler$1,"validateHandler$1");function isDisturbed(e){return !!(e&&(stream$1.isDisturbed(e)||e[kBodyUsed$1]))}Q(isDisturbed,"isDisturbed");function isErrored(e){return !!(e&&stream$1.isErrored(e))}Q(isErrored,"isErrored");function isReadable(e){return !!(e&&stream$1.isReadable(e))}Q(isReadable,"isReadable");function getSocketInfo(e){return {localAddress:e.localAddress,localPort:e.localPort,remoteAddress:e.remoteAddress,remotePort:e.remotePort,remoteFamily:e.remoteFamily,timeout:e.timeout,bytesWritten:e.bytesWritten,bytesRead:e.bytesRead}}Q(getSocketInfo,"getSocketInfo");function ReadableStreamFrom$1(e){let A;return new ReadableStream({async start(){A=e[Symbol.asyncIterator]();},async pull(t){const{done:r,value:n}=await A.next();if(r)queueMicrotask(()=>{t.close(),t.byobRequest?.respond(0);});else {const o=Buffer.isBuffer(n)?n:Buffer.from(n);o.byteLength&&t.enqueue(new Uint8Array(o));}return t.desiredSize>0},async cancel(t){await A.return();},type:"bytes"})}Q(ReadableStreamFrom$1,"ReadableStreamFrom$1");function isFormDataLike$1(e){return e&&typeof e=="object"&&typeof e.append=="function"&&typeof e.delete=="function"&&typeof e.get=="function"&&typeof e.getAll=="function"&&typeof e.has=="function"&&typeof e.set=="function"&&e[Symbol.toStringTag]==="FormData"}Q(isFormDataLike$1,"isFormDataLike$1");function addAbortListener$1(e,A){return "addEventListener"in e?(e.addEventListener("abort",A,{once:!0}),()=>e.removeEventListener("abort",A)):(e.addListener("abort",A),()=>e.removeListener("abort",A))}Q(addAbortListener$1,"addAbortListener$1");const hasToWellFormed=typeof String.prototype.toWellFormed=="function",hasIsWellFormed=typeof String.prototype.isWellFormed=="function";function toUSVString(e){return hasToWellFormed?`${e}`.toWellFormed():nodeUtil.toUSVString(e)}Q(toUSVString,"toUSVString");function isUSVString(e){return hasIsWellFormed?`${e}`.isWellFormed():toUSVString(e)===`${e}`}Q(isUSVString,"isUSVString");function isTokenCharCode(e){switch(e){case 34:case 40:case 41:case 44:case 47:case 58:case 59:case 60:case 61:case 62:case 63:case 64:case 91:case 92:case 93:case 123:case 125:return !1;default:return e>=33&&e<=126}}Q(isTokenCharCode,"isTokenCharCode");function isValidHTTPToken$1(e){if(e.length===0)return !1;for(let A=0;A<e.length;++A)if(!isTokenCharCode(e.charCodeAt(A)))return !1;return !0}Q(isValidHTTPToken$1,"isValidHTTPToken$1");const headerCharRegex=/[^\t\x20-\x7e\x80-\xff]/;function isValidHeaderChar$1(e){return !headerCharRegex.test(e)}Q(isValidHeaderChar$1,"isValidHeaderChar$1");function parseRangeHeader(e){if(e==null||e==="")return {start:0,end:null,size:null};const A=e?e.match(/^bytes (\d+)-(\d+)\/(\d+)?$/):null;return A?{start:parseInt(A[1]),end:A[2]?parseInt(A[2]):null,size:A[3]?parseInt(A[3]):null}:null}Q(parseRangeHeader,"parseRangeHeader");const kEnumerableProperty=Object.create(null);kEnumerableProperty.enumerable=!0;var util$m={kEnumerableProperty,nop:nop$1,isDisturbed,isErrored,isReadable,toUSVString,isUSVString,isReadableAborted,isBlobLike:isBlobLike$1,parseOrigin,parseURL,getServerName:getServerName$1,isStream:isStream$1,isIterable:isIterable$1,isAsyncIterable,isDestroyed,headerNameToString,bufferToLowerCasedHeaderName,parseRawHeaders,parseHeaders,parseKeepAliveTimeout,destroy:destroy$1,bodyLength,deepClone,ReadableStreamFrom:ReadableStreamFrom$1,isBuffer:isBuffer$1,validateHandler:validateHandler$1,getSocketInfo,isFormDataLike:isFormDataLike$1,buildURL:buildURL$3,addAbortListener:addAbortListener$1,isValidHTTPToken:isValidHTTPToken$1,isValidHeaderChar:isValidHeaderChar$1,isTokenCharCode,parseRangeHeader,nodeMajor,nodeMinor,nodeHasAutoSelectFamily:nodeMajor>18||nodeMajor===18&&nodeMinor>=13,safeHTTPMethods:["GET","HEAD","OPTIONS","TRACE"]};const diagnosticsChannel=require$$0__default$2,util$l=require$$0__default$1,undiciDebugLog=util$l.debuglog("undici"),fetchDebuglog=util$l.debuglog("fetch"),websocketDebuglog=util$l.debuglog("websocket");let isClientSet=!1;const channels$3={beforeConnect:diagnosticsChannel.channel("undici:client:beforeConnect"),connected:diagnosticsChannel.channel("undici:client:connected"),connectError:diagnosticsChannel.channel("undici:client:connectError"),sendHeaders:diagnosticsChannel.channel("undici:client:sendHeaders"),create:diagnosticsChannel.channel("undici:request:create"),bodySent:diagnosticsChannel.channel("undici:request:bodySent"),headers:diagnosticsChannel.channel("undici:request:headers"),trailers:diagnosticsChannel.channel("undici:request:trailers"),error:diagnosticsChannel.channel("undici:request:error"),open:diagnosticsChannel.channel("undici:websocket:open"),close:diagnosticsChannel.channel("undici:websocket:close"),socketError:diagnosticsChannel.channel("undici:websocket:socket_error"),ping:diagnosticsChannel.channel("undici:websocket:ping"),pong:diagnosticsChannel.channel("undici:websocket:pong")};if(undiciDebugLog.enabled||fetchDebuglog.enabled){const e=fetchDebuglog.enabled?fetchDebuglog:undiciDebugLog;diagnosticsChannel.channel("undici:client:beforeConnect").subscribe(A=>{const{connectParams:{version:t,protocol:r,port:n,host:o}}=A;e("connecting to %s using %s%s",`${o}${n?`:${n}`:""}`,r,t);}),diagnosticsChannel.channel("undici:client:connected").subscribe(A=>{const{connectParams:{version:t,protocol:r,port:n,host:o}}=A;e("connected to %s using %s%s",`${o}${n?`:${n}`:""}`,r,t);}),diagnosticsChannel.channel("undici:client:connectError").subscribe(A=>{const{connectParams:{version:t,protocol:r,port:n,host:o},error:B}=A;e("connection to %s using %s%s errored - %s",`${o}${n?`:${n}`:""}`,r,t,B.message);}),diagnosticsChannel.channel("undici:client:sendHeaders").subscribe(A=>{const{request:{method:t,path:r,origin:n}}=A;e("sending request to %s %s/%s",t,n,r);}),diagnosticsChannel.channel("undici:request:headers").subscribe(A=>{const{request:{method:t,path:r,origin:n},response:{statusCode:o}}=A;e("received response to %s %s/%s - HTTP %d",t,n,r,o);}),diagnosticsChannel.channel("undici:request:trailers").subscribe(A=>{const{request:{method:t,path:r,origin:n}}=A;e("trailers received from %s %s/%s",t,n,r);}),diagnosticsChannel.channel("undici:request:error").subscribe(A=>{const{request:{method:t,path:r,origin:n},error:o}=A;e("request to %s %s/%s errored - %s",t,n,r,o.message);}),isClientSet=!0;}if(websocketDebuglog.enabled){if(!isClientSet){const e=undiciDebugLog.enabled?undiciDebugLog:websocketDebuglog;diagnosticsChannel.channel("undici:client:beforeConnect").subscribe(A=>{const{connectParams:{version:t,protocol:r,port:n,host:o}}=A;e("connecting to %s%s using %s%s",o,n?`:${n}`:"",r,t);}),diagnosticsChannel.channel("undici:client:connected").subscribe(A=>{const{connectParams:{version:t,protocol:r,port:n,host:o}}=A;e("connected to %s%s using %s%s",o,n?`:${n}`:"",r,t);}),diagnosticsChannel.channel("undici:client:connectError").subscribe(A=>{const{connectParams:{version:t,protocol:r,port:n,host:o},error:B}=A;e("connection to %s%s using %s%s errored - %s",o,n?`:${n}`:"",r,t,B.message);}),diagnosticsChannel.channel("undici:client:sendHeaders").subscribe(A=>{const{request:{method:t,path:r,origin:n}}=A;e("sending request to %s %s/%s",t,n,r);});}diagnosticsChannel.channel("undici:websocket:open").subscribe(e=>{const{address:{address:A,port:t}}=e;websocketDebuglog("connection opened %s%s",A,t?`:${t}`:"");}),diagnosticsChannel.channel("undici:websocket:close").subscribe(e=>{const{websocket:A,code:t,reason:r}=e;websocketDebuglog("closed connection to %s - %s %s",A.url,t,r);}),diagnosticsChannel.channel("undici:websocket:socket_error").subscribe(e=>{websocketDebuglog("connection errored - %s",e.message);}),diagnosticsChannel.channel("undici:websocket:ping").subscribe(e=>{websocketDebuglog("ping received");}),diagnosticsChannel.channel("undici:websocket:pong").subscribe(e=>{websocketDebuglog("pong received");});}var diagnostics={channels:channels$3};const{InvalidArgumentError:InvalidArgumentError$i,NotSupportedError:NotSupportedError$1}=errors$1,assert$9=require$$0__default,{isValidHTTPToken,isValidHeaderChar,isStream,destroy,isBuffer,isFormDataLike,isIterable,isBlobLike,buildURL:buildURL$2,validateHandler,getServerName}=util$m,{channels:channels$2}=diagnostics,{headerNameLowerCasedRecord}=constants$5,invalidPathRegex=/[^\u0021-\u00ff]/,kHandler=Symbol("handler");let Request$1=(ve=class{constructor(A,{path:t,method:r,body:n,headers:o,query:B,idempotent:l,blocking:C,upgrade:f,headersTimeout:c,bodyTimeout:I,reset:y,throwOnError:w,expectContinue:U,servername:k},F){if(typeof t!="string")throw new InvalidArgumentError$i("path must be a string");if(t[0]!=="/"&&!(t.startsWith("http://")||t.startsWith("https://"))&&r!=="CONNECT")throw new InvalidArgumentError$i("path must be an absolute URL or start with a slash");if(invalidPathRegex.exec(t)!==null)throw new InvalidArgumentError$i("invalid request path");if(typeof r!="string")throw new InvalidArgumentError$i("method must be a string");if(!isValidHTTPToken(r))throw new InvalidArgumentError$i("invalid request method");if(f&&typeof f!="string")throw new InvalidArgumentError$i("upgrade must be a string");if(c!=null&&(!Number.isFinite(c)||c<0))throw new InvalidArgumentError$i("invalid headersTimeout");if(I!=null&&(!Number.isFinite(I)||I<0))throw new InvalidArgumentError$i("invalid bodyTimeout");if(y!=null&&typeof y!="boolean")throw new InvalidArgumentError$i("invalid reset");if(U!=null&&typeof U!="boolean")throw new InvalidArgumentError$i("invalid expectContinue");if(this.headersTimeout=c,this.bodyTimeout=I,this.throwOnError=w===!0,this.method=r,this.abort=null,n==null)this.body=null;else if(isStream(n)){this.body=n;const S=this.body._readableState;(!S||!S.autoDestroy)&&(this.endHandler=Q(function(){destroy(this);},"autoDestroy"),this.body.on("end",this.endHandler)),this.errorHandler=M=>{this.abort?this.abort(M):this.error=M;},this.body.on("error",this.errorHandler);}else if(isBuffer(n))this.body=n.byteLength?n:null;else if(ArrayBuffer.isView(n))this.body=n.buffer.byteLength?Buffer.from(n.buffer,n.byteOffset,n.byteLength):null;else if(n instanceof ArrayBuffer)this.body=n.byteLength?Buffer.from(n):null;else if(typeof n=="string")this.body=n.length?Buffer.from(n):null;else if(isFormDataLike(n)||isIterable(n)||isBlobLike(n))this.body=n;else throw new InvalidArgumentError$i("body must be a string, a Buffer, a Readable stream, an iterable, or an async iterable");if(this.completed=!1,this.aborted=!1,this.upgrade=f||null,this.path=B?buildURL$2(t,B):t,this.origin=A,this.idempotent=l??(r==="HEAD"||r==="GET"),this.blocking=C??!1,this.reset=y??null,this.host=null,this.contentLength=null,this.contentType=null,this.headers=[],this.expectContinue=U??!1,Array.isArray(o)){if(o.length%2!==0)throw new InvalidArgumentError$i("headers array must be even");for(let S=0;S<o.length;S+=2)processHeader(this,o[S],o[S+1]);}else if(o&&typeof o=="object")if(o[Symbol.iterator])for(const S of o){if(!Array.isArray(S)||S.length!==2)throw new InvalidArgumentError$i("headers must be in key-value pair format");processHeader(this,S[0],S[1]);}else {const S=Object.keys(o);for(let M=0;M<S.length;++M)processHeader(this,S[M],o[S[M]]);}else if(o!=null)throw new InvalidArgumentError$i("headers must be an object or an array");validateHandler(F,r,f),this.servername=k||getServerName(this.host),this[kHandler]=F,channels$2.create.hasSubscribers&&channels$2.create.publish({request:this});}onBodySent(A){if(this[kHandler].onBodySent)try{return this[kHandler].onBodySent(A)}catch(t){this.abort(t);}}onRequestSent(){if(channels$2.bodySent.hasSubscribers&&channels$2.bodySent.publish({request:this}),this[kHandler].onRequestSent)try{return this[kHandler].onRequestSent()}catch(A){this.abort(A);}}onConnect(A){if(assert$9(!this.aborted),assert$9(!this.completed),this.error)A(this.error);else return this.abort=A,this[kHandler].onConnect(A)}onResponseStarted(){return this[kHandler].onResponseStarted?.()}onHeaders(A,t,r,n){assert$9(!this.aborted),assert$9(!this.completed),channels$2.headers.hasSubscribers&&channels$2.headers.publish({request:this,response:{statusCode:A,headers:t,statusText:n}});try{return this[kHandler].onHeaders(A,t,r,n)}catch(o){this.abort(o);}}onData(A){assert$9(!this.aborted),assert$9(!this.completed);try{return this[kHandler].onData(A)}catch(t){return this.abort(t),!1}}onUpgrade(A,t,r){return assert$9(!this.aborted),assert$9(!this.completed),this[kHandler].onUpgrade(A,t,r)}onComplete(A){this.onFinally(),assert$9(!this.aborted),this.completed=!0,channels$2.trailers.hasSubscribers&&channels$2.trailers.publish({request:this,trailers:A});try{return this[kHandler].onComplete(A)}catch(t){this.onError(t);}}onError(A){if(this.onFinally(),channels$2.error.hasSubscribers&&channels$2.error.publish({request:this,error:A}),!this.aborted)return this.aborted=!0,this[kHandler].onError(A)}onFinally(){this.errorHandler&&(this.body.off("error",this.errorHandler),this.errorHandler=null),this.endHandler&&(this.body.off("end",this.endHandler),this.endHandler=null);}addHeader(A,t){return processHeader(this,A,t),this}},Q(ve,"Request"),ve);function processHeader(e,A,t){if(t&&typeof t=="object"&&!Array.isArray(t))throw new InvalidArgumentError$i(`invalid ${A} header`);if(t===void 0)return;let r=headerNameLowerCasedRecord[A];if(r===void 0&&(r=A.toLowerCase(),headerNameLowerCasedRecord[r]===void 0&&!isValidHTTPToken(r)))throw new InvalidArgumentError$i("invalid header key");if(Array.isArray(t)){const n=[];for(let o=0;o<t.length;o++)if(typeof t[o]=="string"){if(!isValidHeaderChar(t[o]))throw new InvalidArgumentError$i(`invalid ${A} header`);n.push(t[o]);}else if(t[o]===null)n.push("");else {if(typeof t[o]=="object")throw new InvalidArgumentError$i(`invalid ${A} header`);n.push(`${t[o]}`);}t=n;}else if(typeof t=="string"){if(!isValidHeaderChar(t))throw new InvalidArgumentError$i(`invalid ${A} header`)}else if(t===null)t="";else {if(typeof t=="object")throw new InvalidArgumentError$i(`invalid ${A} header`);t=`${t}`;}if(e.host===null&&r==="host"){if(typeof t!="string")throw new InvalidArgumentError$i("invalid host header");e.host=t;}else if(e.contentLength===null&&r==="content-length"){if(e.contentLength=parseInt(t,10),!Number.isFinite(e.contentLength))throw new InvalidArgumentError$i("invalid content-length header")}else if(e.contentType===null&&r==="content-type")e.contentType=t,e.headers.push(A,t);else {if(r==="transfer-encoding"||r==="keep-alive"||r==="upgrade")throw new InvalidArgumentError$i(`invalid ${r} header`);if(r==="connection"){const n=typeof t=="string"?t.toLowerCase():null;if(n!=="close"&&n!=="keep-alive")throw new InvalidArgumentError$i("invalid connection header");n==="close"&&(e.reset=!0);}else {if(r==="expect")throw new NotSupportedError$1("expect header not supported");e.headers.push(A,t);}}}Q(processHeader,"processHeader");var request$2=Request$1;const EventEmitter=require$$0__default$3;let Dispatcher$2=(xe=class extends EventEmitter{dispatch(){throw new Error("not implemented")}close(){throw new Error("not implemented")}destroy(){throw new Error("not implemented")}compose(...A){const t=Array.isArray(A[0])?A[0]:A;let r=this.dispatch.bind(this);for(const n of t)if(n!=null){if(typeof n!="function")throw new TypeError(`invalid interceptor, expected function received ${typeof n}`);if(r=n(r),r==null||typeof r!="function"||r.length!==2)throw new TypeError("invalid interceptor")}return new ComposedDispatcher(this,r)}},Q(xe,"Dispatcher"),xe);const Rt=class Rt extends Dispatcher$2{constructor(t,r){super();FA(this,le,null);FA(this,We,null);DA(this,le,t),DA(this,We,r);}dispatch(...t){x(this,We).call(this,...t);}close(...t){return x(this,le).close(...t)}destroy(...t){return x(this,le).destroy(...t)}};le=new WeakMap,We=new WeakMap,Q(Rt,"ComposedDispatcher");let ComposedDispatcher=Rt;var dispatcher=Dispatcher$2;const Dispatcher$1=dispatcher,{ClientDestroyedError:ClientDestroyedError$1,ClientClosedError,InvalidArgumentError:InvalidArgumentError$h}=errors$1,{kDestroy:kDestroy$4,kClose:kClose$6,kDispatch:kDispatch$3,kInterceptors:kInterceptors$4}=symbols$4,kDestroyed=Symbol("destroyed"),kClosed=Symbol("closed"),kOnDestroyed=Symbol("onDestroyed"),kOnClosed=Symbol("onClosed"),kInterceptedDispatch=Symbol("Intercepted Dispatch");let DispatcherBase$4=(qe=class extends Dispatcher$1{constructor(){super(),this[kDestroyed]=!1,this[kOnDestroyed]=null,this[kClosed]=!1,this[kOnClosed]=[];}get destroyed(){return this[kDestroyed]}get closed(){return this[kClosed]}get interceptors(){return this[kInterceptors$4]}set interceptors(A){if(A){for(let t=A.length-1;t>=0;t--)if(typeof this[kInterceptors$4][t]!="function")throw new InvalidArgumentError$h("interceptor must be an function")}this[kInterceptors$4]=A;}close(A){if(A===void 0)return new Promise((r,n)=>{this.close((o,B)=>o?n(o):r(B));});if(typeof A!="function")throw new InvalidArgumentError$h("invalid callback");if(this[kDestroyed]){queueMicrotask(()=>A(new ClientDestroyedError$1,null));return}if(this[kClosed]){this[kOnClosed]?this[kOnClosed].push(A):queueMicrotask(()=>A(null,null));return}this[kClosed]=!0,this[kOnClosed].push(A);const t=Q(()=>{const r=this[kOnClosed];this[kOnClosed]=null;for(let n=0;n<r.length;n++)r[n](null,null);},"onClosed");this[kClose$6]().then(()=>this.destroy()).then(()=>{queueMicrotask(t);});}destroy(A,t){if(typeof A=="function"&&(t=A,A=null),t===void 0)return new Promise((n,o)=>{this.destroy(A,(B,l)=>B?o(B):n(l));});if(typeof t!="function")throw new InvalidArgumentError$h("invalid callback");if(this[kDestroyed]){this[kOnDestroyed]?this[kOnDestroyed].push(t):queueMicrotask(()=>t(null,null));return}A||(A=new ClientDestroyedError$1),this[kDestroyed]=!0,this[kOnDestroyed]=this[kOnDestroyed]||[],this[kOnDestroyed].push(t);const r=Q(()=>{const n=this[kOnDestroyed];this[kOnDestroyed]=null;for(let o=0;o<n.length;o++)n[o](null,null);},"onDestroyed");this[kDestroy$4](A).then(()=>{queueMicrotask(r);});}[kInterceptedDispatch](A,t){if(!this[kInterceptors$4]||this[kInterceptors$4].length===0)return this[kInterceptedDispatch]=this[kDispatch$3],this[kDispatch$3](A,t);let r=this[kDispatch$3].bind(this);for(let n=this[kInterceptors$4].length-1;n>=0;n--)r=this[kInterceptors$4][n](r);return this[kInterceptedDispatch]=r,r(A,t)}dispatch(A,t){if(!t||typeof t!="object")throw new InvalidArgumentError$h("handler must be an object");try{if(!A||typeof A!="object")throw new InvalidArgumentError$h("opts must be an object.");if(this[kDestroyed]||this[kOnDestroyed])throw new ClientDestroyedError$1;if(this[kClosed])throw new ClientClosedError;return this[kInterceptedDispatch](A,t)}catch(r){if(typeof t.onError!="function")throw new InvalidArgumentError$h("invalid onError method");return t.onError(r),!1}}},Q(qe,"DispatcherBase"),qe);var dispatcherBase=DispatcherBase$4;const net$3=require$$4__default,assert$8=require$$0__default,util$k=util$m,{InvalidArgumentError:InvalidArgumentError$g,ConnectTimeoutError}=errors$1;let tls$2,SessionCache;_commonjsHelpers.commonjsGlobal.FinalizationRegistry&&!(process.env.NODE_V8_COVERAGE||process.env.UNDICI_NO_FG)?SessionCache=(Oe=class{constructor(A){this._maxCachedSessions=A,this._sessionCache=new Map,this._sessionRegistry=new _commonjsHelpers.commonjsGlobal.FinalizationRegistry(t=>{if(this._sessionCache.size<this._maxCachedSessions)return;const r=this._sessionCache.get(t);r!==void 0&&r.deref()===void 0&&this._sessionCache.delete(t);});}get(A){const t=this._sessionCache.get(A);return t?t.deref():null}set(A,t){this._maxCachedSessions!==0&&(this._sessionCache.set(A,new WeakRef(t)),this._sessionRegistry.register(t,A));}},Q(Oe,"WeakSessionCache"),Oe):SessionCache=(Pe=class{constructor(A){this._maxCachedSessions=A,this._sessionCache=new Map;}get(A){return this._sessionCache.get(A)}set(A,t){if(this._maxCachedSessions!==0){if(this._sessionCache.size>=this._maxCachedSessions){const{value:r}=this._sessionCache.keys().next();this._sessionCache.delete(r);}this._sessionCache.set(A,t);}}},Q(Pe,"SimpleSessionCache"),Pe);function buildConnector$3({allowH2:e,maxCachedSessions:A,socketPath:t,timeout:r,...n}){if(A!=null&&(!Number.isInteger(A)||A<0))throw new InvalidArgumentError$g("maxCachedSessions must be a positive integer or zero");const o={path:t,...n},B=new SessionCache(A??100);return r=r??1e4,e=e??!1,Q(function({hostname:C,host:f,protocol:c,port:I,servername:y,localAddress:w,httpSocket:U},k){let F;if(c==="https:"){tls$2||(tls$2=require$$4__default$1),y=y||o.servername||util$k.getServerName(f)||null;const M=y||C,p=B.get(M)||null;assert$8(M),F=tls$2.connect({highWaterMark:16384,...o,servername:y,session:p,localAddress:w,ALPNProtocols:e?["http/1.1","h2"]:["http/1.1"],socket:U,port:I||443,host:C}),F.on("session",function(V){B.set(M,V);});}else assert$8(!U,"httpSocket can only be sent on TLS update"),F=net$3.connect({highWaterMark:64*1024,...o,localAddress:w,port:I||80,host:C});if(o.keepAlive==null||o.keepAlive){const M=o.keepAliveInitialDelay===void 0?6e4:o.keepAliveInitialDelay;F.setKeepAlive(!0,M);}const S=setupTimeout(()=>onConnectTimeout(F),r);return F.setNoDelay(!0).once(c==="https:"?"secureConnect":"connect",function(){if(S(),k){const M=k;k=null,M(null,this);}}).on("error",function(M){if(S(),k){const p=k;k=null,p(M);}}),F},"connect")}Q(buildConnector$3,"buildConnector$3");function setupTimeout(e,A){if(!A)return ()=>{};let t=null,r=null;const n=setTimeout(()=>{t=setImmediate(()=>{process.platform==="win32"?r=setImmediate(()=>e()):e();});},A);return ()=>{clearTimeout(n),clearImmediate(t),clearImmediate(r);}}Q(setupTimeout,"setupTimeout");function onConnectTimeout(e){let A="Connect Timeout Error";Array.isArray(e.autoSelectFamilyAttemptedAddresses)&&(A=+` (attempted addresses: ${e.autoSelectFamilyAttemptedAddresses.join(", ")})`),util$k.destroy(e,new ConnectTimeoutError(A));}Q(onConnectTimeout,"onConnectTimeout");var connect$2=buildConnector$3;let fastNow=Date.now(),fastNowTimeout;const fastTimers=[];function onTimeout(){fastNow=Date.now();let e=fastTimers.length,A=0;for(;A<e;){const t=fastTimers[A];t.state===0?t.state=fastNow+t.delay:t.state>0&&fastNow>=t.state&&(t.state=-1,t.callback(t.opaque)),t.state===-1?(t.state=-2,A!==e-1?fastTimers[A]=fastTimers.pop():fastTimers.pop(),e-=1):A+=1;}fastTimers.length>0&&refreshTimeout();}Q(onTimeout,"onTimeout");function refreshTimeout(){fastNowTimeout?.refresh?fastNowTimeout.refresh():(clearTimeout(fastNowTimeout),fastNowTimeout=setTimeout(onTimeout,1e3),fastNowTimeout.unref&&fastNowTimeout.unref());}Q(refreshTimeout,"refreshTimeout");const wt=class wt{constructor(A,t,r){this.callback=A,this.delay=t,this.opaque=r,this.state=-2,this.refresh();}refresh(){this.state===-2&&(fastTimers.push(this),(!fastNowTimeout||fastTimers.length===1)&&refreshTimeout()),this.state=0;}clear(){this.state=-1;}};Q(wt,"Timeout");let Timeout=wt;var timers$1={setTimeout(e,A,t){return A<1e3?setTimeout(e,A,t):new Timeout(e,A,t)},clearTimeout(e){e instanceof Timeout?e.clear():clearTimeout(e);}},constants$4={},utils={};Object.defineProperty(utils,"__esModule",{value:!0}),utils.enumToMap=void 0;function enumToMap(e){const A={};return Object.keys(e).forEach(t=>{const r=e[t];typeof r=="number"&&(A[t]=r);}),A}Q(enumToMap,"enumToMap"),utils.enumToMap=enumToMap,function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.SPECIAL_HEADERS=e.HEADER_STATE=e.MINOR=e.MAJOR=e.CONNECTION_TOKEN_CHARS=e.HEADER_CHARS=e.TOKEN=e.STRICT_TOKEN=e.HEX=e.URL_CHAR=e.STRICT_URL_CHAR=e.USERINFO_CHARS=e.MARK=e.ALPHANUM=e.NUM=e.HEX_MAP=e.NUM_MAP=e.ALPHA=e.FINISH=e.H_METHOD_MAP=e.METHOD_MAP=e.METHODS_RTSP=e.METHODS_ICE=e.METHODS_HTTP=e.METHODS=e.LENIENT_FLAGS=e.FLAGS=e.TYPE=e.ERROR=void 0;const A=utils;((function(n){n[n.OK=0]="OK",n[n.INTERNAL=1]="INTERNAL",n[n.STRICT=2]="STRICT",n[n.LF_EXPECTED=3]="LF_EXPECTED",n[n.UNEXPECTED_CONTENT_LENGTH=4]="UNEXPECTED_CONTENT_LENGTH",n[n.CLOSED_CONNECTION=5]="CLOSED_CONNECTION",n[n.INVALID_METHOD=6]="INVALID_METHOD",n[n.INVALID_URL=7]="INVALID_URL",n[n.INVALID_CONSTANT=8]="INVALID_CONSTANT",n[n.INVALID_VERSION=9]="INVALID_VERSION",n[n.INVALID_HEADER_TOKEN=10]="INVALID_HEADER_TOKEN",n[n.INVALID_CONTENT_LENGTH=11]="INVALID_CONTENT_LENGTH",n[n.INVALID_CHUNK_SIZE=12]="INVALID_CHUNK_SIZE",n[n.INVALID_STATUS=13]="INVALID_STATUS",n[n.INVALID_EOF_STATE=14]="INVALID_EOF_STATE",n[n.INVALID_TRANSFER_ENCODING=15]="INVALID_TRANSFER_ENCODING",n[n.CB_MESSAGE_BEGIN=16]="CB_MESSAGE_BEGIN",n[n.CB_HEADERS_COMPLETE=17]="CB_HEADERS_COMPLETE",n[n.CB_MESSAGE_COMPLETE=18]="CB_MESSAGE_COMPLETE",n[n.CB_CHUNK_HEADER=19]="CB_CHUNK_HEADER",n[n.CB_CHUNK_COMPLETE=20]="CB_CHUNK_COMPLETE",n[n.PAUSED=21]="PAUSED",n[n.PAUSED_UPGRADE=22]="PAUSED_UPGRADE",n[n.PAUSED_H2_UPGRADE=23]="PAUSED_H2_UPGRADE",n[n.USER=24]="USER";}))(e.ERROR||(e.ERROR={})),function(n){n[n.BOTH=0]="BOTH",n[n.REQUEST=1]="REQUEST",n[n.RESPONSE=2]="RESPONSE";}(e.TYPE||(e.TYPE={})),function(n){n[n.CONNECTION_KEEP_ALIVE=1]="CONNECTION_KEEP_ALIVE",n[n.CONNECTION_CLOSE=2]="CONNECTION_CLOSE",n[n.CONNECTION_UPGRADE=4]="CONNECTION_UPGRADE",n[n.CHUNKED=8]="CHUNKED",n[n.UPGRADE=16]="UPGRADE",n[n.CONTENT_LENGTH=32]="CONTENT_LENGTH",n[n.SKIPBODY=64]="SKIPBODY",n[n.TRAILING=128]="TRAILING",n[n.TRANSFER_ENCODING=512]="TRANSFER_ENCODING";}(e.FLAGS||(e.FLAGS={})),function(n){n[n.HEADERS=1]="HEADERS",n[n.CHUNKED_LENGTH=2]="CHUNKED_LENGTH",n[n.KEEP_ALIVE=4]="KEEP_ALIVE";}(e.LENIENT_FLAGS||(e.LENIENT_FLAGS={}));var t;((function(n){n[n.DELETE=0]="DELETE",n[n.GET=1]="GET",n[n.HEAD=2]="HEAD",n[n.POST=3]="POST",n[n.PUT=4]="PUT",n[n.CONNECT=5]="CONNECT",n[n.OPTIONS=6]="OPTIONS",n[n.TRACE=7]="TRACE",n[n.COPY=8]="COPY",n[n.LOCK=9]="LOCK",n[n.MKCOL=10]="MKCOL",n[n.MOVE=11]="MOVE",n[n.PROPFIND=12]="PROPFIND",n[n.PROPPATCH=13]="PROPPATCH",n[n.SEARCH=14]="SEARCH",n[n.UNLOCK=15]="UNLOCK",n[n.BIND=16]="BIND",n[n.REBIND=17]="REBIND",n[n.UNBIND=18]="UNBIND",n[n.ACL=19]="ACL",n[n.REPORT=20]="REPORT",n[n.MKACTIVITY=21]="MKACTIVITY",n[n.CHECKOUT=22]="CHECKOUT",n[n.MERGE=23]="MERGE",n[n["M-SEARCH"]=24]="M-SEARCH",n[n.NOTIFY=25]="NOTIFY",n[n.SUBSCRIBE=26]="SUBSCRIBE",n[n.UNSUBSCRIBE=27]="UNSUBSCRIBE",n[n.PATCH=28]="PATCH",n[n.PURGE=29]="PURGE",n[n.MKCALENDAR=30]="MKCALENDAR",n[n.LINK=31]="LINK",n[n.UNLINK=32]="UNLINK",n[n.SOURCE=33]="SOURCE",n[n.PRI=34]="PRI",n[n.DESCRIBE=35]="DESCRIBE",n[n.ANNOUNCE=36]="ANNOUNCE",n[n.SETUP=37]="SETUP",n[n.PLAY=38]="PLAY",n[n.PAUSE=39]="PAUSE",n[n.TEARDOWN=40]="TEARDOWN",n[n.GET_PARAMETER=41]="GET_PARAMETER",n[n.SET_PARAMETER=42]="SET_PARAMETER",n[n.REDIRECT=43]="REDIRECT",n[n.RECORD=44]="RECORD",n[n.FLUSH=45]="FLUSH";}))(t=e.METHODS||(e.METHODS={})),e.METHODS_HTTP=[t.DELETE,t.GET,t.HEAD,t.POST,t.PUT,t.CONNECT,t.OPTIONS,t.TRACE,t.COPY,t.LOCK,t.MKCOL,t.MOVE,t.PROPFIND,t.PROPPATCH,t.SEARCH,t.UNLOCK,t.BIND,t.REBIND,t.UNBIND,t.ACL,t.REPORT,t.MKACTIVITY,t.CHECKOUT,t.MERGE,t["M-SEARCH"],t.NOTIFY,t.SUBSCRIBE,t.UNSUBSCRIBE,t.PATCH,t.PURGE,t.MKCALENDAR,t.LINK,t.UNLINK,t.PRI,t.SOURCE],e.METHODS_ICE=[t.SOURCE],e.METHODS_RTSP=[t.OPTIONS,t.DESCRIBE,t.ANNOUNCE,t.SETUP,t.PLAY,t.PAUSE,t.TEARDOWN,t.GET_PARAMETER,t.SET_PARAMETER,t.REDIRECT,t.RECORD,t.FLUSH,t.GET,t.POST],e.METHOD_MAP=A.enumToMap(t),e.H_METHOD_MAP={},Object.keys(e.METHOD_MAP).forEach(n=>{/^H/.test(n)&&(e.H_METHOD_MAP[n]=e.METHOD_MAP[n]);}),function(n){n[n.SAFE=0]="SAFE",n[n.SAFE_WITH_CB=1]="SAFE_WITH_CB",n[n.UNSAFE=2]="UNSAFE";}(e.FINISH||(e.FINISH={})),e.ALPHA=[];for(let n=65;n<=90;n++)e.ALPHA.push(String.fromCharCode(n)),e.ALPHA.push(String.fromCharCode(n+32));e.NUM_MAP={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9},e.HEX_MAP={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,A:10,B:11,C:12,D:13,E:14,F:15,a:10,b:11,c:12,d:13,e:14,f:15},e.NUM=["0","1","2","3","4","5","6","7","8","9"],e.ALPHANUM=e.ALPHA.concat(e.NUM),e.MARK=["-","_",".","!","~","*","'","(",")"],e.USERINFO_CHARS=e.ALPHANUM.concat(e.MARK).concat(["%",";",":","&","=","+","$",","]),e.STRICT_URL_CHAR=["!",'"',"$","%","&","'","(",")","*","+",",","-",".","/",":",";","<","=",">","@","[","\\","]","^","_","`","{","|","}","~"].concat(e.ALPHANUM),e.URL_CHAR=e.STRICT_URL_CHAR.concat(["	","\f"]);for(let n=128;n<=255;n++)e.URL_CHAR.push(n);e.HEX=e.NUM.concat(["a","b","c","d","e","f","A","B","C","D","E","F"]),e.STRICT_TOKEN=["!","#","$","%","&","'","*","+","-",".","^","_","`","|","~"].concat(e.ALPHANUM),e.TOKEN=e.STRICT_TOKEN.concat([" "]),e.HEADER_CHARS=["	"];for(let n=32;n<=255;n++)n!==127&&e.HEADER_CHARS.push(n);e.CONNECTION_TOKEN_CHARS=e.HEADER_CHARS.filter(n=>n!==44),e.MAJOR=e.NUM_MAP,e.MINOR=e.MAJOR;var r;((function(n){n[n.GENERAL=0]="GENERAL",n[n.CONNECTION=1]="CONNECTION",n[n.CONTENT_LENGTH=2]="CONTENT_LENGTH",n[n.TRANSFER_ENCODING=3]="TRANSFER_ENCODING",n[n.UPGRADE=4]="UPGRADE",n[n.CONNECTION_KEEP_ALIVE=5]="CONNECTION_KEEP_ALIVE",n[n.CONNECTION_CLOSE=6]="CONNECTION_CLOSE",n[n.CONNECTION_UPGRADE=7]="CONNECTION_UPGRADE",n[n.TRANSFER_ENCODING_CHUNKED=8]="TRANSFER_ENCODING_CHUNKED";}))(r=e.HEADER_STATE||(e.HEADER_STATE={})),e.SPECIAL_HEADERS={connection:r.CONNECTION,"content-length":r.CONTENT_LENGTH,"proxy-connection":r.CONNECTION,"transfer-encoding":r.TRANSFER_ENCODING,upgrade:r.UPGRADE};}(constants$4);var llhttpWasm,hasRequiredLlhttpWasm;function requireLlhttpWasm(){if(hasRequiredLlhttpWasm)return llhttpWasm;hasRequiredLlhttpWasm=1;const{Buffer:e}=require$$6__default;return llhttpWasm=e.from("AGFzbQEAAAABMAhgAX8Bf2ADf39/AX9gBH9/f38Bf2AAAGADf39/AGABfwBgAn9/AGAGf39/f39/AALLAQgDZW52GHdhc21fb25faGVhZGVyc19jb21wbGV0ZQACA2VudhV3YXNtX29uX21lc3NhZ2VfYmVnaW4AAANlbnYLd2FzbV9vbl91cmwAAQNlbnYOd2FzbV9vbl9zdGF0dXMAAQNlbnYUd2FzbV9vbl9oZWFkZXJfZmllbGQAAQNlbnYUd2FzbV9vbl9oZWFkZXJfdmFsdWUAAQNlbnYMd2FzbV9vbl9ib2R5AAEDZW52GHdhc21fb25fbWVzc2FnZV9jb21wbGV0ZQAAA0ZFAwMEAAAFAAAAAAAABQEFAAUFBQAABgAAAAAGBgYGAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAAABAQcAAAUFAwABBAUBcAESEgUDAQACBggBfwFBgNQECwfRBSIGbWVtb3J5AgALX2luaXRpYWxpemUACRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQALbGxodHRwX2luaXQAChhsbGh0dHBfc2hvdWxkX2tlZXBfYWxpdmUAQQxsbGh0dHBfYWxsb2MADAZtYWxsb2MARgtsbGh0dHBfZnJlZQANBGZyZWUASA9sbGh0dHBfZ2V0X3R5cGUADhVsbGh0dHBfZ2V0X2h0dHBfbWFqb3IADxVsbGh0dHBfZ2V0X2h0dHBfbWlub3IAEBFsbGh0dHBfZ2V0X21ldGhvZAARFmxsaHR0cF9nZXRfc3RhdHVzX2NvZGUAEhJsbGh0dHBfZ2V0X3VwZ3JhZGUAEwxsbGh0dHBfcmVzZXQAFA5sbGh0dHBfZXhlY3V0ZQAVFGxsaHR0cF9zZXR0aW5nc19pbml0ABYNbGxodHRwX2ZpbmlzaAAXDGxsaHR0cF9wYXVzZQAYDWxsaHR0cF9yZXN1bWUAGRtsbGh0dHBfcmVzdW1lX2FmdGVyX3VwZ3JhZGUAGhBsbGh0dHBfZ2V0X2Vycm5vABsXbGxodHRwX2dldF9lcnJvcl9yZWFzb24AHBdsbGh0dHBfc2V0X2Vycm9yX3JlYXNvbgAdFGxsaHR0cF9nZXRfZXJyb3JfcG9zAB4RbGxodHRwX2Vycm5vX25hbWUAHxJsbGh0dHBfbWV0aG9kX25hbWUAIBJs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ADcDACAAQShqQgA3AwAgAEEgakIANwMAIABBEGpCADcDACAAQQhqQgA3AwAgAEHdATYCHEEAC3sBAX8CQCAAKAIMIgMNAAJAIAAoAgRFDQAgACABNgIECwJAIAAgASACEMSAgIAAIgMNACAAKAIMDwsgACADNgIcQQAhAyAAKAIEIgFFDQAgACABIAIgACgCCBGBgICAAAAiAUUNACAAIAI2AhQgACABNgIMIAEhAwsgAwvk8wEDDn8DfgR/I4CAgIAAQRBrIgMkgICAgAAgASEEIAEhBSABIQYgASEHIAEhCCABIQkgASEKIAEhCyABIQwgASENIAEhDiABIQ8CQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAgACgCHCIQQX9qDt0B2gEB2QECAwQFBgcICQoLDA0O2AEPENcBERLWARMUFRYXGBkaG+AB3wEcHR7VAR8gISIjJCXUASYnKCkqKyzTAdIBLS7RAdABLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVG2wFHSElKzwHOAUvNAUzMAU1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4ABgQGCAYMBhAGFAYYBhwGIAYkB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QAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkAC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FCAAIBA2AgxBACEQDLIBCyAAKAIEIRAgAEEANgIEAkAgACAQIAEQp4CAgAAiEA0AIAEhAQxNCyAAQdMANgIcIAAgATYCFCAAIBA2AgxBACEQDLEBCyAAKAIEIRAgAEEANgIEAkAgACAQIAEQp4CAgAAiEA0AIAEhAQxRCyAAQeUANgIcIAAgATYCFCAAIBA2AgxBACEQDLABCyAAQQA2AhwgACABNgIUIABBxoqAgAA2AhAgAEEHNgIMQQAhEAyvAQsgACgCBCEQIABBADYCBAJAIAAgECABEKeAgIAAIhANACABIQEMSQsgAEHSADYCHCAAIAE2AhQgACAQNgIMQQAhEAyuAQsgACgCBCEQIABBADYCBAJAIAAgECABEKeAgIAAIhANACABIQEMSQsgAEHTADYCHCAAIAE2AhQgACAQNgIMQQAhEAytAQsgACgCBCEQIABBADYCBAJAIAAgECABEKeAgIAAIhANACABIQEMTQsgAEHlADYCHCAAIAE2AhQgACAQNgIMQQAhEAysAQsgAEEANgIcIAAgATYCFCAAQdyIgIAANgIQIABBBzYCDEEAIRAMqwELIBBBP0cNASABQQFqIQELQQUhEAyQAQtBACEQIABBADYCHCAAIAE2AhQgAEH9koCAADYCECAAQQc2AgwMqAELIAAoAgQhECAAQQA2AgQCQCAAIBAgARCngICAACIQDQAgASEBDEILIABB0gA2AhwgACABNgIUIAAgEDYCDEEAIRAMpwELIAAoAgQhECAAQQA2AgQCQCAAIBAgARCngICAACIQDQAgASEBDEILIABB0wA2AhwgACABNgIUIAAgEDYCDEEAIRAMpgELIAAoAgQhECAAQQA2AgQCQCAAIBAgARCngICAACIQDQAgASEBDEYLIABB5QA2AhwgACABNgIUIAAgEDYCDEEAIRAMpQELIAAoAgQhASAAQQA2AgQCQCAAIAEgFBCngICAACIBDQAgFCEBDD8LIABB0gA2AhwgACAUNgIUIAAgATYCDEEAIRAMpAELIAAoAgQhASAAQQA2AgQCQCAAIAEgFBCngICAACIBDQAgFCEBDD8LIABB0wA2AhwgACAUNgIUIAAgATYCDEEAIRAMowELIAAoAgQhASAAQQA2AgQCQCAAIAEgFBCngICAACIBDQAgFCEBDEMLIABB5QA2AhwgACAU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YWdlX2JlZ2luYCBjYWxsYmFjayBlcnJvcgBgb25fY2h1bmtfZXh0ZW5zaW9uX3ZhbHVlYCBjYWxsYmFjayBlcnJvcgBgb25fc3RhdHVzX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fdmVyc2lvbl9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX3VybF9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX2NodW5rX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25faGVhZGVyX3ZhbHVlX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fbWVzc2FnZV9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX21ldGhvZF9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX2hlYWRlcl9maWVsZF9jb21wbGV0ZWAgY2FsbGJhY2sgZXJyb3IAYG9uX2NodW5rX2V4dGVuc2lvbl9uYW1lYCBjYWxsYmFjayBlcnJvcgBVbmV4cGVjdGVkIGNoYXIgaW4gdXJsIHNlcnZlcgBJbnZhbGlkIGhlYWRlciB2YWx1ZSBjaGFyAEludmFsaWQgaGVhZGVyIGZpZWxkIGNoYXIAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl92ZXJzaW9uAEludmFsaWQgbWlub3IgdmVyc2lvbgBJbnZhbGlkIG1ham9yIHZlcnNpb24ARXhwZWN0ZWQgc3BhY2UgYWZ0ZXIgdmVyc2lvbgBFeHBlY3RlZCBDUkxGIGFmdGVyIHZlcnNpb24ASW52YWxpZCBIVFRQIHZlcnNpb24ASW52YWxpZCBoZWFkZXIgdG9rZW4AU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl91cmwASW52YWxpZCBjaGFyYWN0ZXJzIGluIHVybABVbmV4cGVjdGVkIHN0YXJ0IGNoYXIgaW4gdXJsAERvdWJsZSBAIGluIHVybABFbXB0eSBDb250ZW50LUxlbmd0aABJbnZhbGlkIGNoYXJhY3RlciBpbiBDb250ZW50LUxlbmd0aABEdXBsaWNhdGUgQ29udGVudC1MZW5ndGgASW52YWxpZCBjaGFyIGluIHVybCBwYXRoAENvbnRlbnQtTGVuZ3RoIGNhbid0IGJlIHByZXNlbnQgd2l0aCBUcmFuc2Zlci1FbmNvZGluZwBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBzaXplAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25faGVhZGVyX3ZhbHVlAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25fY2h1bmtfZXh0ZW5zaW9uX3ZhbHVlAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIGV4dGVuc2lvbnMgdmFsdWUATWlzc2luZyBleHBlY3RlZCBMRiBhZnRlciBoZWFkZXIgdmFsdWUASW52YWxpZCBgVHJhbnNmZXItRW5jb2RpbmdgIGhlYWRlciB2YWx1ZQBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBleHRlbnNpb25zIHF1b3RlIHZhbHVlAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIGV4dGVuc2lvbnMgcXVvdGVkIHZhbHVlAFBhdXNlZCBieSBvbl9oZWFkZXJzX2NvbXBsZXRlAEludmFsaWQgRU9GIHN0YXRlAG9uX3Jlc2V0IHBhdXNlAG9uX2NodW5rX2hlYWRlciBwYXVzZQBvbl9tZXNzYWdlX2JlZ2luIHBhdXNlAG9uX2NodW5rX2V4dGVuc2lvbl92YWx1ZSBwYXVzZQBvbl9zdGF0dXNfY29tcGxldGUgcGF1c2UAb25fdmVyc2lvbl9jb21wbGV0ZSBwYXVzZQBvbl91cmxfY29tcGxldGUgcGF1c2UAb25fY2h1bmtfY29tcGxldGUgcGF1c2UAb25faGVhZGVyX3ZhbHVlX2NvbXBsZXRlIHBhdXNlAG9uX21lc3NhZ2VfY29tcGxldGUgcGF1c2UAb25fbWV0aG9kX2NvbXBsZXRlIHBhdXNlAG9uX2hlYWRlcl9maWVsZF9jb21wbGV0ZSBwYXVzZQBvbl9jaHVua19leHRlbnNpb25fbmFtZSBwYXVzZQBVbmV4cGVjdGVkIHNwYWNlIGFmdGVyIHN0YXJ0IGxpbmUAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9jaHVua19leHRlbnNpb25fbmFtZQBJbnZhbGlkIGNoYXJhY3RlciBpbiBjaHVuayBleHRlbnNpb25zIG5hbWUAUGF1c2Ugb24gQ09OTkVDVC9VcGdyYWRlAFBhdXNlIG9uIFBSSS9VcGdyYWRlAEV4cGVjdGVkIEhUVFAvMiBDb25uZWN0aW9uIFByZWZhY2UAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9tZXRob2QARXhwZWN0ZWQgc3BhY2UgYWZ0ZXIgbWV0aG9kAFNwYW4gY2FsbGJhY2sgZXJyb3IgaW4gb25faGVhZGVyX2ZpZWxkAFBhdXNlZABJbnZhbGlkIHdvcmQgZW5jb3VudGVyZWQASW52YWxpZCBtZXRob2QgZW5jb3VudGVyZWQAVW5leHBlY3RlZCBjaGFyIGluIHVybCBzY2hlbWEAUmVxdWVzdCBoYXMgaW52YWxpZCBgVHJhbnNmZXItRW5jb2RpbmdgAFNXSVRDSF9QUk9YWQBVU0VfUFJPWFkATUtBQ1RJVklUWQBVTlBST0NFU1NBQkxFX0VOVElUWQBDT1BZAE1PVkVEX1BFUk1BTkVOVExZAFRPT19FQVJMWQBOT1RJRlkARkFJTEVEX0RFUEVOREVOQ1kAQkFEX0dBVEVXQVkAUExBWQBQVVQAQ0hFQ0tPVVQAR0FURVdBWV9USU1FT1VUAFJFUVVFU1RfVElNRU9VVABORVRXT1JLX0NPTk5FQ1RfVElNRU9VVABDT05ORUNUSU9OX1RJTUVPVVQATE9HSU5fVElNRU9VVABORVRXT1JLX1JFQURfVElNRU9VVABQT1NUAE1JU0RJUkVDVEVEX1JFUVVFU1QAQ0xJRU5UX0NMT1NFRF9SRVFVRVNUAENMSUVOVF9DTE9TRURfTE9BRF9CQUxBTkNFRF9SRVFVRVNUAEJBRF9SRVFVRVNUAEhUVFBfUkVRVUVTVF9TRU5UX1RPX0hUVFBTX1BPUlQAUkVQT1JUAElNX0FfVEVBUE9UAFJFU0VUX0NPTlRFTlQATk9fQ09OVEVOVABQQVJUSUFMX0NPTlRFTlQASFBFX0lOVkFMSURfQ09OU1RBTlQASFBFX0NCX1JFU0VUAEdFVABIUEVfU1RSSUNUAENPTkZMSUNUAFRFTVBPUkFSWV9SRURJUkVDVABQRVJNQU5FTlRfUkVESVJFQ1QAQ09OTkVDVABNVUxUSV9TVEFUVVMASFBFX0lOVkFMSURfU1RBVFVTAFRPT19NQU5ZX1JFUVVFU1RTAEVBUkxZX0hJTlRTAFVOQVZBSUxBQkxFX0ZPUl9MRUdBTF9SRUFTT05TAE9QVElPTlMAU1dJVENISU5HX1BST1RPQ09MUwBWQVJJQU5UX0FMU09fTkVHT1RJQVRFUwBNVUxUSVBMRV9DSE9JQ0VTAElOVEVSTkFMX1NFUlZFUl9FUlJPUgBXRUJfU0VSVkVSX1VOS05PV05fRVJST1IAUkFJTEdVTl9FUlJPUgBJREVOVElUWV9QUk9WSURFUl9BVVRIRU5USUNBVElPTl9FUlJPUgBTU0xfQ0VSVElGSUNBVEVfRVJST1IASU5WQUxJRF9YX0ZPUldBUkRFRF9GT1IAU0VUX1BBUkFNRVRFUgBHRVRfUEFSQU1FVEVSAEhQRV9VU0VSAFNFRV9PVEhFUgBIUEVfQ0JfQ0hVTktfSEVBREVSAE1LQ0FMRU5EQVIAU0VUVVAAV0VCX1NFUlZFUl9JU19ET1dOAFRFQVJET1dOAEhQRV9DTE9TRURfQ09OTkVDVElPTgBIRVVSSVNUSUNfRVhQSVJBVElPTgBESVNDT05ORUNURURfT1BFUkFUSU9OAE5PTl9BVVRIT1JJVEFUSVZFX0lORk9STUFUSU9OAEhQRV9JTlZBTElEX1ZFUlNJT04ASFBFX0NCX01FU1NBR0VfQkVHSU4AU0lURV9JU19GUk9aRU4ASFBFX0lOVkFMSURfSEVBREVSX1RPS0VOAElOVkFMSURfVE9LRU4ARk9SQklEREVOAEVOSEFOQ0VfWU9VUl9DQUxNAEhQRV9JTlZBTElEX1VSTABCTE9DS0VEX0JZX1BBUkVOVEFMX0NPTlRST0wATUtDT0wAQUNMAEhQRV9JTlRFUk5BTABSRVFVRVNUX0hFQURFUl9GSUVMRFNfVE9PX0xBUkdFX1VOT0ZGSUNJQUwASFBFX09LAFVOTElOSwBVTkxPQ0sAUFJJAFJFVFJZX1dJVEgASFBFX0lOVkFMSURfQ09OVEVOVF9MRU5HVEgASFBFX1VORVhQRUNURURfQ09OVEVOVF9MRU5HVEgARkxVU0gAUFJPUFBBVENIAE0tU0VBUkNIAFVSSV9UT09fTE9ORwBQUk9DRVNTSU5HAE1JU0NFTExBTkVPVVNfUEVSU0lTVEVOVF9XQVJOSU5HAE1JU0NFTExBTkVPVVNfV0FSTklORwBIUEVfSU5WQUxJRF9UUkFOU0ZFUl9FTkNPRElORwBFeHBlY3RlZCBDUkxGAEhQRV9JTlZBTElEX0NIVU5LX1NJWkUATU9WRQBDT05USU5VRQBIUEVfQ0JfU1RBVFVTX0NPTVBMRVRFAEhQRV9DQl9IRUFERVJTX0NPTVBMRVRFAEhQRV9DQl9WRVJTSU9OX0NPTVBMRVRFAEhQRV9DQl9VUkxfQ09NUExFVEUASFBFX0NCX0NIVU5LX0NPTVBMRVRFAEhQRV9DQl9IRUFERVJfVkFMVUVfQ09NUExFVEUASFBFX0NCX0NIVU5LX0VYVEVOU0lPTl9WQUxVRV9DT01QTEVURQBIUEVfQ0JfQ0hVTktfRVhURU5TSU9OX05BTUVfQ09NUExFVEUASFBFX0NCX01FU1NBR0VfQ09NUExFVEUASFBFX0NCX01FVEhPRF9DT01QTEVURQBIUEVfQ0JfSEVBREVSX0ZJRUxEX0NPTVBMRVRFAERFTEVURQBIUEVfSU5WQUxJRF9FT0ZfU1RBVEUASU5WQUxJRF9TU0xfQ0VSVElGSUNBVEUAUEFVU0UATk9fUkVTUE9OU0UAVU5TVVBQT1JURURfTUVESUFfVFlQRQBHT05FAE5PVF9BQ0NFUFRBQkxFAFNFUlZJQ0VfVU5BVkFJTEFCTEUAUkFOR0VfTk9UX1NBVElTRklBQkxFAE9SSUdJTl9JU19VTlJFQUNIQUJMRQBSRVNQT05TRV9JU19TVEFMRQBQVVJHRQBNRVJHRQBSRVFVRVNUX0hFQURFUl9GSUVMRFNfVE9PX0xBUkdFAFJFUVVFU1RfSEVBREVSX1RPT19MQVJHRQBQQVlMT0FEX1RPT19MQVJHRQBJTlNVRkZJQ0lFTlRfU1RPUkFHRQBIUEVfUEFVU0VEX1VQR1JBREUASFBFX1BBVVNFRF9IMl9VUEdSQURFAFNPVVJDRQBBTk5PVU5DRQBUUkFDRQBIUEVfVU5FWFBFQ1RFRF9TUEFDRQBERVNDUklCRQBVTlNVQlNDUklCRQBSRUNPUkQASFBFX0lOVkFMSURfTUVUSE9EAE5PVF9GT1VORABQUk9QRklORABVTkJJTkQAUkVCSU5EAFVOQVVUSE9SSVpFRABNRVRIT0RfTk9UX0FMTE9XRUQASFRUUF9WRVJTSU9OX05PVF9TVVBQT1JURUQAQUxSRUFEWV9SRVBPUlRFRABBQ0NFUFRFRABOT1RfSU1QTEVNRU5URUQATE9PUF9ERVRFQ1RFRABIUEVfQ1JfRVhQRUNURUQASFBFX0xGX0VYUEVDVEVEAENSRUFURUQASU1fVVNFRABIUEVfUEFVU0VEAFRJTUVPVVRfT0NDVVJFRABQQVlNRU5UX1JFUVVJUkVEAFBSRUNPTkRJVElPTl9SRVFVSVJFRABQUk9YWV9BVVRIRU5USUNBVElPTl9SRVFVSVJFRABORVRXT1JLX0FVVEhFTlRJQ0FUSU9OX1JFUVVJUkVEAExFTkdUSF9SRVFVSVJFRABTU0xfQ0VSVElGSUNBVEVfUkVRVUlSRUQAVVBHUkFERV9SRVFVSVJFRABQQUdFX0VYUElSRUQAUFJFQ09ORElUSU9OX0ZBSUxFRABFWFBFQ1RBVElPTl9GQUlMRUQAUkVWQUxJREFUSU9OX0ZBSUxFRABTU0xfSEFORFNIQUtFX0ZBSUxFRABMT0NLRUQAVFJBTlNGT1JNQVRJT05fQVBQTElFRABOT1RfTU9ESUZJRUQATk9UX0VYVEVOREVEAEJBTkRXSURUSF9MSU1JVF9FWENFRURFRABTSVRFX0lTX09WRVJMT0FERUQASEVBRABFeHBlY3RlZCBIVFRQLwAAXhMAACYTAAAwEAAA8BcAAJ0TAAAVEgAAORcAAPASAAAKEAAAdRIAAK0SAACCEwAATxQAAH8QAACgFQAAIxQAAIkSAACLFAAATRUAANQRAADPFAAAEBgAAMkWAADcFgAAwREAAOAXAAC7FAAAdBQAAHwVAADlFAAACBcAAB8QAABlFQAAoxQAACgVAAACFQAAmRUAACwQAACLGQAATw8AANQOAABqEAAAzhAAAAIXAACJDgAAbhMAABwTAABmFAAAVhcAAMETAADNEwAAbBMAAGgXAABmFwAAXxcAACITAADODwAAaQ4AANgOAABjFgAAyxMAAKoOAAAoFwAAJhcAAMUTAABdFgAA6BEAAGcTAABlEwAA8hYAAHMTAAAdFwAA+RYAAPMRAADPDgAAzhUAAAwSAACzEQAApREAAGEQAAAyFwAAuxMAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAIDAgICAgIAAAICAAICAAICAgICAgICAgIABAAAAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgIAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgACAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAACAAICAgICAAACAgACAgACAgICAgICAgICAAMABAAAAAICAgICAgICAgICAgICAgICAgICAgICAgICAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAAgACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbG9zZWVlcC1hbGl2ZQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQEBAQEBAQEBAQIBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBY2h1bmtlZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEAAQEBAQEAAAEBAAEBAAEBAQEBAQEBAQEAAAAAAAAAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABlY3Rpb25lbnQtbGVuZ3Rob25yb3h5LWNvbm5lY3Rpb24AAAAAAAAAAAAAAAAAAAByYW5zZmVyLWVuY29kaW5ncGdyYWRlDQoNCg0KU00NCg0KVFRQL0NFL1RTUC8AAAAAAAAAAAAAAAABAgABAwAAAAAAAAAAAAAAAAAAAAAAAAQBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAQIAAQMAAAAAAAAAAAAAAAAAAAAAAAAEAQEFAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAEAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAAAAQAAAgAAAAAAAAAAAAAAAAAAAAAAAAMEAAAEBAQEBAQEBAQEBAUEBAQEBAQEBAQEBAQABAAGBwQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEAAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAEAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwAAAAAAAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAABAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAIAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAAAAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABOT1VOQ0VFQ0tPVVRORUNURVRFQ1JJQkVMVVNIRVRFQURTRUFSQ0hSR0VDVElWSVRZTEVOREFSVkVPVElGWVBUSU9OU0NIU0VBWVNUQVRDSEdFT1JESVJFQ1RPUlRSQ0hQQVJBTUVURVJVUkNFQlNDUklCRUFSRE9XTkFDRUlORE5LQ0tVQlNDUklCRUhUVFAvQURUUC8=","base64"),llhttpWasm}Q(requireLlhttpWasm,"requireLlhttpWasm");var llhttp_simdWasm,hasRequiredLlhttp_simdWasm;function requireLlhttp_simdWasm(){if(hasRequiredLlhttp_simdWasm)return llhttp_simdWasm;hasRequiredLlhttp_simdWasm=1;const{Buffer:e}=require$$6__default;return llhttp_simdWasm=e.from("AGFzbQEAAAABMAhgAX8Bf2ADf39/AX9gBH9/f38Bf2AAAGADf39/AGABfwBgAn9/AGAGf39/f39/AALLAQgDZW52GHdhc21fb25faGVhZGVyc19jb21wbGV0ZQACA2VudhV3YXNtX29uX21lc3NhZ2VfYmVnaW4AAANlbnYLd2FzbV9vbl91cmwAAQNlbnYOd2FzbV9vbl9zdGF0dXMAAQNlbnYUd2FzbV9vbl9oZWFkZXJfZmllbGQAAQNlbnYUd2FzbV9vbl9oZWFkZXJfdmFsdWUAAQNlbnYMd2FzbV9vbl9ib2R5AAEDZW52GHdhc21fb25fbWVzc2FnZV9jb21wbGV0ZQAAA0ZFAwMEAAAFAAAAAAAABQEFAAUFBQAABgAAAAAGBgYGAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAAABAQcAAAUFAwABBAUBcAESEgUDAQACBggBfwFBgNQECwfRBSIGbWVtb3J5AgALX2luaXRpYWxpemUACRlfX2luZGlyZWN0X2Z1bmN0aW9uX3RhYmxlAQALbGxodHRwX2luaXQAChhsbGh0dHBfc2hvdWxkX2tlZXBfYWxpdmUAQQxsbGh0dHBfYWxsb2MADAZtYWxsb2MARgtsbGh0dHBfZnJlZQANBGZyZWUASA9sbGh0dHBfZ2V0X3R5cGUADhVsbGh0dHBfZ2V0X2h0dHBfbWFqb3IADxVsbGh0dHBfZ2V0X2h0dHBfbWlub3IAEBFsbGh0dHBfZ2V0X21ldGhvZAARFmxsaHR0cF9nZXRfc3RhdHVzX2NvZGUAEhJsbGh0dHBfZ2V0X3VwZ3JhZGUAEwxsbGh0dHBfcmVzZXQAFA5sbGh0dHBfZXhlY3V0ZQAVFGxsaHR0cF9zZXR0aW5nc19pbml0ABYNbGxodHRwX2ZpbmlzaAAXDGxsaHR0cF9wYXVzZQAYDWxsaHR0cF9yZXN1bWUAGRtsbGh0dHBfcmVzdW1lX2FmdGVyX3VwZ3JhZGUAGhBsbGh0dHBfZ2V0X2Vycm5vABsXbGxodHRwX2dldF9lcnJvcl9yZWFzb24AHBdsbGh0dHBfc2V0X2Vycm9yX3JlYXNvbgAdFGxsaHR0cF9nZXRfZXJyb3JfcG9zAB4RbGxodHRwX2Vycm5vX25hbWUAHxJsbGh0dHBfbWV0aG9kX25hbWUAIBJs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IAH9CwMAIABBMGogAf0LAwAgAEEgaiAB/QsDACAAQd0BNgIcQQALewEBfwJAIAAoAgwiAw0AAkAgACgCBEUNACAAIAE2AgQLAkAgACABIAIQxICAgAAiAw0AIAAoAgwPCyAAIAM2AhxBACEDIAAoAgQiAUUNACAAIAEgAiAAKAIIEYGAgIAAACIBRQ0AIAAgAjYCFCAAIAE2AgwgASEDCyADC+TzAQMOfwN+BH8jgICAgABBEGsiAySAgICAACABIQQgASEFIAEhBiABIQcgASEIIAEhCSABIQogASELIAEhDCABIQ0gASEOIAEhDwJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCAAKAIcIhBBf2oO3QHaAQHZAQIDBAUGBwgJCgsMDQ7YAQ8Q1wEREtYBExQVFhcYGRob4AHfARwdHtUBHyAhIiMkJdQBJicoKSorLNMB0gEtLtEB0AEvMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUbbAUdISUrPAc4BS80BTMwBTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gAGBAYIBgwGEAYUBhgGHAYgBiQGKAYsBjAGNAY4BjwGQAZEB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QAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIBAOxwEAAQID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YWNrIGVycm9yAGBvbl9jaHVua19leHRlbnNpb25fdmFsdWVgIGNhbGxiYWNrIGVycm9yAGBvbl9zdGF0dXNfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl92ZXJzaW9uX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fdXJsX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fY2h1bmtfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9oZWFkZXJfdmFsdWVfY29tcGxldGVgIGNhbGxiYWNrIGVycm9yAGBvbl9tZXNzYWdlX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fbWV0aG9kX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25faGVhZGVyX2ZpZWxkX2NvbXBsZXRlYCBjYWxsYmFjayBlcnJvcgBgb25fY2h1bmtfZXh0ZW5zaW9uX25hbWVgIGNhbGxiYWNrIGVycm9yAFVuZXhwZWN0ZWQgY2hhciBpbiB1cmwgc2VydmVyAEludmFsaWQgaGVhZGVyIHZhbHVlIGNoYXIASW52YWxpZCBoZWFkZXIgZmllbGQgY2hhcgBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX3ZlcnNpb24ASW52YWxpZCBtaW5vciB2ZXJzaW9uAEludmFsaWQgbWFqb3IgdmVyc2lvbgBFeHBlY3RlZCBzcGFjZSBhZnRlciB2ZXJzaW9uAEV4cGVjdGVkIENSTEYgYWZ0ZXIgdmVyc2lvbgBJbnZhbGlkIEhUVFAgdmVyc2lvbgBJbnZhbGlkIGhlYWRlciB0b2tlbgBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX3VybABJbnZhbGlkIGNoYXJhY3RlcnMgaW4gdXJsAFVuZXhwZWN0ZWQgc3RhcnQgY2hhciBpbiB1cmwARG91YmxlIEAgaW4gdXJsAEVtcHR5IENvbnRlbnQtTGVuZ3RoAEludmFsaWQgY2hhcmFjdGVyIGluIENvbnRlbnQtTGVuZ3RoAER1cGxpY2F0ZSBDb250ZW50LUxlbmd0aABJbnZhbGlkIGNoYXIgaW4gdXJsIHBhdGgAQ29udGVudC1MZW5ndGggY2FuJ3QgYmUgcHJlc2VudCB3aXRoIFRyYW5zZmVyLUVuY29kaW5nAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIHNpemUAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9oZWFkZXJfdmFsdWUAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9jaHVua19leHRlbnNpb25fdmFsdWUASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgZXh0ZW5zaW9ucyB2YWx1ZQBNaXNzaW5nIGV4cGVjdGVkIExGIGFmdGVyIGhlYWRlciB2YWx1ZQBJbnZhbGlkIGBUcmFuc2Zlci1FbmNvZGluZ2AgaGVhZGVyIHZhbHVlAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIGV4dGVuc2lvbnMgcXVvdGUgdmFsdWUASW52YWxpZCBjaGFyYWN0ZXIgaW4gY2h1bmsgZXh0ZW5zaW9ucyBxdW90ZWQgdmFsdWUAUGF1c2VkIGJ5IG9uX2hlYWRlcnNfY29tcGxldGUASW52YWxpZCBFT0Ygc3RhdGUAb25fcmVzZXQgcGF1c2UAb25fY2h1bmtfaGVhZGVyIHBhdXNlAG9uX21lc3NhZ2VfYmVnaW4gcGF1c2UAb25fY2h1bmtfZXh0ZW5zaW9uX3ZhbHVlIHBhdXNlAG9uX3N0YXR1c19jb21wbGV0ZSBwYXVzZQBvbl92ZXJzaW9uX2NvbXBsZXRlIHBhdXNlAG9uX3VybF9jb21wbGV0ZSBwYXVzZQBvbl9jaHVua19jb21wbGV0ZSBwYXVzZQBvbl9oZWFkZXJfdmFsdWVfY29tcGxldGUgcGF1c2UAb25fbWVzc2FnZV9jb21wbGV0ZSBwYXVzZQBvbl9tZXRob2RfY29tcGxldGUgcGF1c2UAb25faGVhZGVyX2ZpZWxkX2NvbXBsZXRlIHBhdXNlAG9uX2NodW5rX2V4dGVuc2lvbl9uYW1lIHBhdXNlAFVuZXhwZWN0ZWQgc3BhY2UgYWZ0ZXIgc3RhcnQgbGluZQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX2NodW5rX2V4dGVuc2lvbl9uYW1lAEludmFsaWQgY2hhcmFjdGVyIGluIGNodW5rIGV4dGVuc2lvbnMgbmFtZQBQYXVzZSBvbiBDT05ORUNUL1VwZ3JhZGUAUGF1c2Ugb24gUFJJL1VwZ3JhZGUARXhwZWN0ZWQgSFRUUC8yIENvbm5lY3Rpb24gUHJlZmFjZQBTcGFuIGNhbGxiYWNrIGVycm9yIGluIG9uX21ldGhvZABFeHBlY3RlZCBzcGFjZSBhZnRlciBtZXRob2QAU3BhbiBjYWxsYmFjayBlcnJvciBpbiBvbl9oZWFkZXJfZmllbGQAUGF1c2VkAEludmFsaWQgd29yZCBlbmNvdW50ZXJlZABJbnZhbGlkIG1ldGhvZCBlbmNvdW50ZXJlZABVbmV4cGVjdGVkIGNoYXIgaW4gdXJsIHNjaGVtYQBSZXF1ZXN0IGhhcyBpbnZhbGlkIGBUcmFuc2Zlci1FbmNvZGluZ2AAU1dJVENIX1BST1hZAFVTRV9QUk9YWQBNS0FDVElWSVRZAFVOUFJPQ0VTU0FCTEVfRU5USVRZAENPUFkATU9WRURfUEVSTUFORU5UTFkAVE9PX0VBUkxZAE5PVElGWQBGQUlMRURfREVQRU5ERU5DWQBCQURfR0FURVdBWQBQTEFZAFBVVABDSEVDS09VVABHQVRFV0FZX1RJTUVPVVQAUkVRVUVTVF9USU1FT1VUAE5FVFdPUktfQ09OTkVDVF9USU1FT1VUAENPTk5FQ1RJT05fVElNRU9VVABMT0dJTl9USU1FT1VUAE5FVFdPUktfUkVBRF9USU1FT1VUAFBPU1QATUlTRElSRUNURURfUkVRVUVTVABDTElFTlRfQ0xPU0VEX1JFUVVFU1QAQ0xJRU5UX0NMT1NFRF9MT0FEX0JBTEFOQ0VEX1JFUVVFU1QAQkFEX1JFUVVFU1QASFRUUF9SRVFVRVNUX1NFTlRfVE9fSFRUUFNfUE9SVABSRVBPUlQASU1fQV9URUFQT1QAUkVTRVRfQ09OVEVOVABOT19DT05URU5UAFBBUlRJQUxfQ09OVEVOVABIUEVfSU5WQUxJRF9DT05TVEFOVABIUEVfQ0JfUkVTRVQAR0VUAEhQRV9TVFJJQ1QAQ09ORkxJQ1QAVEVNUE9SQVJZX1JFRElSRUNUAFBFUk1BTkVOVF9SRURJUkVDVABDT05ORUNUAE1VTFRJX1NUQVRVUwBIUEVfSU5WQUxJRF9TVEFUVVMAVE9PX01BTllfUkVRVUVTVFMARUFSTFlfSElOVFMAVU5BVkFJTEFCTEVfRk9SX0xFR0FMX1JFQVNPTlMAT1BUSU9OUwBTV0lUQ0hJTkdfUFJPVE9DT0xTAFZBUklBTlRfQUxTT19ORUdPVElBVEVTAE1VTFRJUExFX0NIT0lDRVMASU5URVJOQUxfU0VSVkVSX0VSUk9SAFdFQl9TRVJWRVJfVU5LTk9XTl9FUlJPUgBSQUlMR1VOX0VSUk9SAElERU5USVRZX1BST1ZJREVSX0FVVEhFTlRJQ0FUSU9OX0VSUk9SAFNTTF9DRVJUSUZJQ0FURV9FUlJPUgBJTlZBTElEX1hfRk9SV0FSREVEX0ZPUgBTRVRfUEFSQU1FVEVSAEdFVF9QQVJBTUVURVIASFBFX1VTRVIAU0VFX09USEVSAEhQRV9DQl9DSFVOS19IRUFERVIATUtDQUxFTkRBUgBTRVRVUABXRUJfU0VSVkVSX0lTX0RPV04AVEVBUkRPV04ASFBFX0NMT1NFRF9DT05ORUNUSU9OAEhFVVJJU1RJQ19FWFBJUkFUSU9OAERJU0NPTk5FQ1RFRF9PUEVSQVRJT04ATk9OX0FVVEhPUklUQVRJVkVfSU5GT1JNQVRJT04ASFBFX0lOVkFMSURfVkVSU0lPTgBIUEVfQ0JfTUVTU0FHRV9CRUdJTgBTSVRFX0lTX0ZST1pFTgBIUEVfSU5WQUxJRF9IRUFERVJfVE9LRU4ASU5WQUxJRF9UT0tFTgBGT1JCSURERU4ARU5IQU5DRV9ZT1VSX0NBTE0ASFBFX0lOVkFMSURfVVJMAEJMT0NLRURfQllfUEFSRU5UQUxfQ09OVFJPTABNS0NPTABBQ0wASFBFX0lOVEVSTkFMAFJFUVVFU1RfSEVBREVSX0ZJRUxEU19UT09fTEFSR0VfVU5PRkZJQ0lBTABIUEVfT0sAVU5MSU5LAFVOTE9DSwBQUkkAUkVUUllfV0lUSABIUEVfSU5WQUxJRF9DT05URU5UX0xFTkdUSABIUEVfVU5FWFBFQ1RFRF9DT05URU5UX0xFTkdUSABGTFVTSABQUk9QUEFUQ0gATS1TRUFSQ0gAVVJJX1RPT19MT05HAFBST0NFU1NJTkcATUlTQ0VMTEFORU9VU19QRVJTSVNURU5UX1dBUk5JTkcATUlTQ0VMTEFORU9VU19XQVJOSU5HAEhQRV9JTlZBTElEX1RSQU5TRkVSX0VOQ09ESU5HAEV4cGVjdGVkIENSTEYASFBFX0lOVkFMSURfQ0hVTktfU0laRQBNT1ZFAENPTlRJTlVFAEhQRV9DQl9TVEFUVVNfQ09NUExFVEUASFBFX0NCX0hFQURFUlNfQ09NUExFVEUASFBFX0NCX1ZFUlNJT05fQ09NUExFVEUASFBFX0NCX1VSTF9DT01QTEVURQBIUEVfQ0JfQ0hVTktfQ09NUExFVEUASFBFX0NCX0hFQURFUl9WQUxVRV9DT01QTEVURQBIUEVfQ0JfQ0hVTktfRVhURU5TSU9OX1ZBTFVFX0NPTVBMRVRFAEhQRV9DQl9DSFVOS19FWFRFTlNJT05fTkFNRV9DT01QTEVURQBIUEVfQ0JfTUVTU0FHRV9DT01QTEVURQBIUEVfQ0JfTUVUSE9EX0NPTVBMRVRFAEhQRV9DQl9IRUFERVJfRklFTERfQ09NUExFVEUAREVMRVRFAEhQRV9JTlZBTElEX0VPRl9TVEFURQBJTlZBTElEX1NTTF9DRVJUSUZJQ0FURQBQQVVTRQBOT19SRVNQT05TRQBVTlNVUFBPUlRFRF9NRURJQV9UWVBFAEdPTkUATk9UX0FDQ0VQVEFCTEUAU0VSVklDRV9VTkFWQUlMQUJMRQBSQU5HRV9OT1RfU0FUSVNGSUFCTEUAT1JJR0lOX0lTX1VOUkVBQ0hBQkxFAFJFU1BPTlNFX0lTX1NUQUxFAFBVUkdFAE1FUkdFAFJFUVVFU1RfSEVBREVSX0ZJRUxEU19UT09fTEFSR0UAUkVRVUVTVF9IRUFERVJfVE9PX0xBUkdFAFBBWUxPQURfVE9PX0xBUkdFAElOU1VGRklDSUVOVF9TVE9SQUdFAEhQRV9QQVVTRURfVVBHUkFERQBIUEVfUEFVU0VEX0gyX1VQR1JBREUAU09VUkNFAEFOTk9VTkNFAFRSQUNFAEhQRV9VTkVYUEVDVEVEX1NQQUNFAERFU0NSSUJFAFVOU1VCU0NSSUJFAFJFQ09SRABIUEVfSU5WQUxJRF9NRVRIT0QATk9UX0ZPVU5EAFBST1BGSU5EAFVOQklORABSRUJJTkQAVU5BVVRIT1JJWkVEAE1FVEhPRF9OT1RfQUxMT1dFRABIVFRQX1ZFUlNJT05fTk9UX1NVUFBPUlRFRABBTFJFQURZX1JFUE9SVEVEAEFDQ0VQVEVEAE5PVF9JTVBMRU1FTlRFRABMT09QX0RFVEVDVEVEAEhQRV9DUl9FWFBFQ1RFRABIUEVfTEZfRVhQRUNURUQAQ1JFQVRFRABJTV9VU0VEAEhQRV9QQVVTRUQAVElNRU9VVF9PQ0NVUkVEAFBBWU1FTlRfUkVRVUlSRUQAUFJFQ09ORElUSU9OX1JFUVVJUkVEAFBST1hZX0FVVEhFTlRJQ0FUSU9OX1JFUVVJUkVEAE5FVFdPUktfQVVUSEVOVElDQVRJT05fUkVRVUlSRUQATEVOR1RIX1JFUVVJUkVEAFNTTF9DRVJUSUZJQ0FURV9SRVFVSVJFRABVUEdSQURFX1JFUVVJUkVEAFBBR0VfRVhQSVJFRABQUkVDT05ESVRJT05fRkFJTEVEAEVYUEVDVEFUSU9OX0ZBSUxFRABSRVZBTElEQVRJT05fRkFJTEVEAFNTTF9IQU5EU0hBS0VfRkFJTEVEAExPQ0tFRABUUkFOU0ZPUk1BVElPTl9BUFBMSUVEAE5PVF9NT0RJRklFRABOT1RfRVhURU5ERUQAQkFORFdJRFRIX0xJTUlUX0VYQ0VFREVEAFNJVEVfSVNfT1ZFUkxPQURFRABIRUFEAEV4cGVjdGVkIEhUVFAvAABeEwAAJhMAADAQAADwFwAAnRMAABUSAAA5FwAA8BIAAAoQAAB1EgAArRIAAIITAABPFAAAfxAAAKAVAAAjFAAAiRIAAIsUAABNFQAA1BEAAM8UAAAQGAAAyRYAANwWAADBEQAA4BcAALsUAAB0FAAAfBUAAOUUAAAIFwAAHxAAAGUVAACjFAAAKBUAAAIVAACZFQAALBAAAIsZAABPDwAA1A4AAGoQAADOEAAAAhcAAIkOAABuEwAAHBMAAGYUAABWFwAAwRMAAM0TAABsEwAAaBcAAGYXAABfFwAAIhMAAM4PAABpDgAA2A4AAGMWAADLEwAAqg4AACgXAAAmFwAAxRMAAF0WAADoEQAAZxMAAGUTAADyFgAAcxMAAB0XAAD5FgAA8xEAAM8OAADOFQAADBIAALMRAAClEQAAYRAAADIXAAC7EwAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAgMCAgICAgAAAgIAAgIAAgICAgICAgICAgAEAAAAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgAAAAICAgICAgICAgICAgICAgICAgICAgICAgICAgICAAIAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAIAAgICAgIAAAICAAICAAICAgICAgICAgIAAwAEAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgIAAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgACAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABsb3NlZWVwLWFsaXZlAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAQEBAQEBAQEBAgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQFjaHVua2VkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQABAQEBAQAAAQEAAQEAAQEBAQEBAQEBAQAAAAAAAAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGVjdGlvbmVudC1sZW5ndGhvbnJveHktY29ubmVjdGlvbgAAAAAAAAAAAAAAAAAAAHJhbnNmZXItZW5jb2RpbmdwZ3JhZGUNCg0KDQpTTQ0KDQpUVFAvQ0UvVFNQLwAAAAAAAAAAAAAAAAECAAEDAAAAAAAAAAAAAAAAAAAAAAAABAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAAAAAAAAAAABAgABAwAAAAAAAAAAAAAAAAAAAAAAAAQBAQUBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAAAAAAAAAQAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAQEAAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQAAAAAAAAAAAAABAAACAAAAAAAAAAAAAAAAAAAAAAAAAwQAAAQEBAQEBAQEBAQEBQQEBAQEBAQEBAQEBAAEAAYHBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAAQABAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAQAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAAAAAAAAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAEAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAgAAAAACAAAAAAAAAAAAAAAAAAAAAAADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwAAAAAAAAMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE5PVU5DRUVDS09VVE5FQ1RFVEVDUklCRUxVU0hFVEVBRFNFQVJDSFJHRUNUSVZJVFlMRU5EQVJWRU9USUZZUFRJT05TQ0hTRUFZU1RBVENIR0VPUkRJUkVDVE9SVFJDSFBBUkFNRVRFUlVSQ0VCU0NSSUJFQVJET1dOQUNFSU5ETktDS1VCU0NSSUJFSFRUUC9BRFRQLw==","base64"),llhttp_simdWasm}Q(requireLlhttp_simdWasm,"requireLlhttp_simdWasm");var constants$3,hasRequiredConstants$2;function requireConstants$2(){if(hasRequiredConstants$2)return constants$3;hasRequiredConstants$2=1;const e=["GET","HEAD","POST"],A=new Set(e),t=[101,204,205,304],r=[301,302,303,307,308],n=new Set(r),o=["1","7","9","11","13","15","17","19","20","21","22","23","25","37","42","43","53","69","77","79","87","95","101","102","103","104","109","110","111","113","115","117","119","123","135","137","139","143","161","179","389","427","465","512","513","514","515","526","530","531","532","540","548","554","556","563","587","601","636","989","990","993","995","1719","1720","1723","2049","3659","4045","5060","5061","6000","6566","6665","6666","6667","6668","6669","6697","10080"],B=new Set(o),l=["","no-referrer","no-referrer-when-downgrade","same-origin","origin","strict-origin","origin-when-cross-origin","strict-origin-when-cross-origin","unsafe-url"],C=new Set(l),f=["follow","manual","error"],c=["GET","HEAD","OPTIONS","TRACE"],I=new Set(c),y=["navigate","same-origin","no-cors","cors"],w=["omit","same-origin","include"],U=["default","no-store","reload","no-cache","force-cache","only-if-cached"],k=["content-encoding","content-language","content-location","content-type","content-length"],F=["half"],S=["CONNECT","TRACE","TRACK"],M=new Set(S),p=["audio","audioworklet","font","image","manifest","paintworklet","script","style","track","video","xslt",""],V=new Set(p);return constants$3={subresource:p,forbiddenMethods:S,requestBodyHeader:k,referrerPolicy:l,requestRedirect:f,requestMode:y,requestCredentials:w,requestCache:U,redirectStatus:r,corsSafeListedMethods:e,nullBodyStatus:t,safeMethods:c,badPorts:o,requestDuplex:F,subresourceSet:V,badPortsSet:B,redirectStatusSet:n,corsSafeListedMethodsSet:A,safeMethodsSet:I,forbiddenMethodsSet:M,referrerPolicySet:C},constants$3}Q(requireConstants$2,"requireConstants$2");var global$1,hasRequiredGlobal;function requireGlobal(){if(hasRequiredGlobal)return global$1;hasRequiredGlobal=1;const e=Symbol.for("undici.globalOrigin.1");function A(){return globalThis[e]}Q(A,"getGlobalOrigin");function t(r){if(r===void 0){Object.defineProperty(globalThis,e,{value:void 0,writable:!0,enumerable:!1,configurable:!1});return}const n=new URL(r);if(n.protocol!=="http:"&&n.protocol!=="https:")throw new TypeError(`Only http & https urls are allowed, received ${n.protocol}`);Object.defineProperty(globalThis,e,{value:n,writable:!0,enumerable:!1,configurable:!1});}return Q(t,"setGlobalOrigin"),global$1={getGlobalOrigin:A,setGlobalOrigin:t},global$1}Q(requireGlobal,"requireGlobal");var dataUrl,hasRequiredDataUrl;function requireDataUrl(){if(hasRequiredDataUrl)return dataUrl;hasRequiredDataUrl=1;const e=require$$0__default,A=new TextEncoder,t=/^[!#$%&'*+-.^_|~A-Za-z0-9]+$/,r=/[\u000A|\u000D|\u0009|\u0020]/,n=/[\u0009\u000A\u000C\u000D\u0020]/g,o=/[\u0009|\u0020-\u007E|\u0080-\u00FF]/;function B(D){e(D.protocol==="data:");let b=l(D,!0);b=b.slice(5);const W={position:0};let J=f(",",b,W);const N=J.length;if(J=Y(J,!0,!0),W.position>=b.length)return "failure";W.position++;const v=b.slice(N+1);let Z=c(v);if(/;(\u0020){0,}base64$/i.test(J)){const K=m(Z);if(Z=k(K),Z==="failure")return "failure";J=J.slice(0,-6),J=J.replace(/(\u0020)+$/,""),J=J.slice(0,-1);}J.startsWith(";")&&(J="text/plain"+J);let X=U(J);return X==="failure"&&(X=U("text/plain;charset=US-ASCII")),{mimeType:X,body:Z}}Q(B,"dataURLProcessor");function l(D,b=!1){if(!b)return D.href;const W=D.href,J=D.hash.length,N=J===0?W:W.substring(0,W.length-J);return !J&&W.endsWith("#")?N.slice(0,-1):N}Q(l,"URLSerializer");function C(D,b,W){let J="";for(;W.position<b.length&&D(b[W.position]);)J+=b[W.position],W.position++;return J}Q(C,"collectASequenceOfCodePoints");function f(D,b,W){const J=b.indexOf(D,W.position),N=W.position;return J===-1?(W.position=b.length,b.slice(N)):(W.position=J,b.slice(N,W.position))}Q(f,"collectASequenceOfCodePointsFast");function c(D){const b=A.encode(D);return w(b)}Q(c,"stringPercentDecode");function I(D){return D>=48&&D<=57||D>=65&&D<=70||D>=97&&D<=102}Q(I,"isHexCharByte");function y(D){return D>=48&&D<=57?D-48:(D&223)-55}Q(y,"hexByteToNumber");function w(D){const b=D.length,W=new Uint8Array(b);let J=0;for(let N=0;N<b;++N){const v=D[N];v!==37?W[J++]=v:v===37&&!(I(D[N+1])&&I(D[N+2]))?W[J++]=37:(W[J++]=y(D[N+1])<<4|y(D[N+2]),N+=2);}return b===J?W:W.subarray(0,J)}Q(w,"percentDecode");function U(D){D=p(D,!0,!0);const b={position:0},W=f("/",D,b);if(W.length===0||!t.test(W)||b.position>D.length)return "failure";b.position++;let J=f(";",D,b);if(J=p(J,!1,!0),J.length===0||!t.test(J))return "failure";const N=W.toLowerCase(),v=J.toLowerCase(),Z={type:N,subtype:v,parameters:new Map,essence:`${N}/${v}`};for(;b.position<D.length;){b.position++,C(gA=>r.test(gA),D,b);let X=C(gA=>gA!==";"&&gA!=="=",D,b);if(X=X.toLowerCase(),b.position<D.length){if(D[b.position]===";")continue;b.position++;}if(b.position>D.length)break;let K=null;if(D[b.position]==='"')K=F(D,b,!0),f(";",D,b);else if(K=f(";",D,b),K=p(K,!1,!0),K.length===0)continue;X.length!==0&&t.test(X)&&(K.length===0||o.test(K))&&!Z.parameters.has(X)&&Z.parameters.set(X,K);}return Z}Q(U,"parseMIMEType");function k(D){D=D.replace(n,"");let b=D.length;if(b%4===0&&D.charCodeAt(b-1)===61&&(--b,D.charCodeAt(b-1)===61&&--b),b%4===1||/[^+/0-9A-Za-z]/.test(D.length===b?D:D.substring(0,b)))return "failure";const W=Buffer.from(D,"base64");return new Uint8Array(W.buffer,W.byteOffset,W.byteLength)}Q(k,"forgivingBase64");function F(D,b,W){const J=b.position;let N="";for(e(D[b.position]==='"'),b.position++;N+=C(Z=>Z!=='"'&&Z!=="\\",D,b),!(b.position>=D.length);){const v=D[b.position];if(b.position++,v==="\\"){if(b.position>=D.length){N+="\\";break}N+=D[b.position],b.position++;}else {e(v==='"');break}}return W?N:D.slice(J,b.position)}Q(F,"collectAnHTTPQuotedString");function S(D){e(D!=="failure");const{parameters:b,essence:W}=D;let J=W;for(let[N,v]of b.entries())J+=";",J+=N,J+="=",t.test(v)||(v=v.replace(/(\\|")/g,"\\$1"),v='"'+v,v+='"'),J+=v;return J}Q(S,"serializeAMimeType");function M(D){return D===13||D===10||D===9||D===32}Q(M,"isHTTPWhiteSpace");function p(D,b=!0,W=!0){return R(D,b,W,M)}Q(p,"removeHTTPWhitespace");function V(D){return D===13||D===10||D===9||D===12||D===32}Q(V,"isASCIIWhitespace");function Y(D,b=!0,W=!0){return R(D,b,W,V)}Q(Y,"removeASCIIWhitespace");function R(D,b,W,J){let N=0,v=D.length-1;if(b)for(;N<D.length&&J(D.charCodeAt(N));)N++;if(W)for(;v>0&&J(D.charCodeAt(v));)v--;return N===0&&v===D.length-1?D:D.slice(N,v+1)}Q(R,"removeChars");function m(D){const b=D.length;if(65535>b)return String.fromCharCode.apply(null,D);let W="",J=0,N=65535;for(;J<b;)J+N>b&&(N=b-J),W+=String.fromCharCode.apply(null,D.subarray(J,J+=N));return W}Q(m,"isomorphicDecode");function _(D){switch(D.essence){case"application/ecmascript":case"application/javascript":case"application/x-ecmascript":case"application/x-javascript":case"text/ecmascript":case"text/javascript":case"text/javascript1.0":case"text/javascript1.1":case"text/javascript1.2":case"text/javascript1.3":case"text/javascript1.4":case"text/javascript1.5":case"text/jscript":case"text/livescript":case"text/x-ecmascript":case"text/x-javascript":return "text/javascript";case"application/json":case"text/json":return "application/json";case"image/svg+xml":return "image/svg+xml";case"text/xml":case"application/xml":return "application/xml"}return D.subtype.endsWith("+json")?"application/json":D.subtype.endsWith("+xml")?"application/xml":""}return Q(_,"minimizeSupportedMimeType"),dataUrl={dataURLProcessor:B,URLSerializer:l,collectASequenceOfCodePoints:C,collectASequenceOfCodePointsFast:f,stringPercentDecode:c,parseMIMEType:U,collectAnHTTPQuotedString:F,serializeAMimeType:S,removeChars:R,minimizeSupportedMimeType:_,HTTP_TOKEN_CODEPOINTS:t,isomorphicDecode:m},dataUrl}Q(requireDataUrl,"requireDataUrl");var webidl_1,hasRequiredWebidl;function requireWebidl(){if(hasRequiredWebidl)return webidl_1;hasRequiredWebidl=1;const{types:e,inspect:A}=require$$0__default$1,{toUSVString:t}=util$m,r={};return r.converters={},r.util={},r.errors={},r.errors.exception=function(n){return new TypeError(`${n.header}: ${n.message}`)},r.errors.conversionFailed=function(n){const o=n.types.length===1?"":" one of",B=`${n.argument} could not be converted to${o}: ${n.types.join(", ")}.`;return r.errors.exception({header:n.prefix,message:B})},r.errors.invalidArgument=function(n){return r.errors.exception({header:n.prefix,message:`"${n.value}" is an invalid ${n.type}.`})},r.brandCheck=function(n,o,B=void 0){if(B?.strict!==!1){if(!(n instanceof o))throw new TypeError("Illegal invocation")}else if(n?.[Symbol.toStringTag]!==o.prototype[Symbol.toStringTag])throw new TypeError("Illegal invocation")},r.argumentLengthCheck=function({length:n},o,B){if(n<o)throw r.errors.exception({message:`${o} argument${o!==1?"s":""} required, but${n?" only":""} ${n} found.`,...B})},r.illegalConstructor=function(){throw r.errors.exception({header:"TypeError",message:"Illegal constructor"})},r.util.Type=function(n){switch(typeof n){case"undefined":return "Undefined";case"boolean":return "Boolean";case"string":return "String";case"symbol":return "Symbol";case"number":return "Number";case"bigint":return "BigInt";case"function":case"object":return n===null?"Null":"Object"}},r.util.ConvertToInt=function(n,o,B,l={}){let C,f;o===64?(C=Math.pow(2,53)-1,B==="unsigned"?f=0:f=Math.pow(-2,53)+1):B==="unsigned"?(f=0,C=Math.pow(2,o)-1):(f=Math.pow(-2,o)-1,C=Math.pow(2,o-1)-1);let c=Number(n);if(c===0&&(c=0),l.enforceRange===!0){if(Number.isNaN(c)||c===Number.POSITIVE_INFINITY||c===Number.NEGATIVE_INFINITY)throw r.errors.exception({header:"Integer conversion",message:`Could not convert ${r.util.Stringify(n)} to an integer.`});if(c=r.util.IntegerPart(c),c<f||c>C)throw r.errors.exception({header:"Integer conversion",message:`Value must be between ${f}-${C}, got ${c}.`});return c}return !Number.isNaN(c)&&l.clamp===!0?(c=Math.min(Math.max(c,f),C),Math.floor(c)%2===0?c=Math.floor(c):c=Math.ceil(c),c):Number.isNaN(c)||c===0&&Object.is(0,c)||c===Number.POSITIVE_INFINITY||c===Number.NEGATIVE_INFINITY?0:(c=r.util.IntegerPart(c),c=c%Math.pow(2,o),B==="signed"&&c>=Math.pow(2,o)-1?c-Math.pow(2,o):c)},r.util.IntegerPart=function(n){const o=Math.floor(Math.abs(n));return n<0?-1*o:o},r.util.Stringify=function(n){switch(r.util.Type(n)){case"Symbol":return `Symbol(${n.description})`;case"Object":return A(n);case"String":return `"${n}"`;default:return `${n}`}},r.sequenceConverter=function(n){return (o,B)=>{if(r.util.Type(o)!=="Object")throw r.errors.exception({header:"Sequence",message:`Value of type ${r.util.Type(o)} is not an Object.`});const l=typeof B=="function"?B():o?.[Symbol.iterator]?.(),C=[];if(l===void 0||typeof l.next!="function")throw r.errors.exception({header:"Sequence",message:"Object is not an iterator."});for(;;){const{done:f,value:c}=l.next();if(f)break;C.push(n(c));}return C}},r.recordConverter=function(n,o){return B=>{if(r.util.Type(B)!=="Object")throw r.errors.exception({header:"Record",message:`Value of type ${r.util.Type(B)} is not an Object.`});const l={};if(!e.isProxy(B)){const f=[...Object.getOwnPropertyNames(B),...Object.getOwnPropertySymbols(B)];for(const c of f){const I=n(c),y=o(B[c]);l[I]=y;}return l}const C=Reflect.ownKeys(B);for(const f of C)if(Reflect.getOwnPropertyDescriptor(B,f)?.enumerable){const I=n(f),y=o(B[f]);l[I]=y;}return l}},r.interfaceConverter=function(n){return (o,B={})=>{if(B.strict!==!1&&!(o instanceof n))throw r.errors.exception({header:n.name,message:`Expected ${r.util.Stringify(o)} to be an instance of ${n.name}.`});return o}},r.dictionaryConverter=function(n){return o=>{const B=r.util.Type(o),l={};if(B==="Null"||B==="Undefined")return l;if(B!=="Object")throw r.errors.exception({header:"Dictionary",message:`Expected ${o} to be one of: Null, Undefined, Object.`});for(const C of n){const{key:f,defaultValue:c,required:I,converter:y}=C;if(I===!0&&!Object.hasOwn(o,f))throw r.errors.exception({header:"Dictionary",message:`Missing required key "${f}".`});let w=o[f];const U=Object.hasOwn(C,"defaultValue");if(U&&w!==null&&(w=w??c),I||U||w!==void 0){if(w=y(w),C.allowedValues&&!C.allowedValues.includes(w))throw r.errors.exception({header:"Dictionary",message:`${w} is not an accepted type. Expected one of ${C.allowedValues.join(", ")}.`});l[f]=w;}}return l}},r.nullableConverter=function(n){return o=>o===null?o:n(o)},r.converters.DOMString=function(n,o={}){if(n===null&&o.legacyNullToEmptyString)return "";if(typeof n=="symbol")throw new TypeError("Could not convert argument of type symbol to string.");return String(n)},r.converters.ByteString=function(n){const o=r.converters.DOMString(n);for(let B=0;B<o.length;B++)if(o.charCodeAt(B)>255)throw new TypeError(`Cannot convert argument to a ByteString because the character at index ${B} has a value of ${o.charCodeAt(B)} which is greater than 255.`);return o},r.converters.USVString=t,r.converters.boolean=function(n){return !!n},r.converters.any=function(n){return n},r.converters["long long"]=function(n){return r.util.ConvertToInt(n,64,"signed")},r.converters["unsigned long long"]=function(n){return r.util.ConvertToInt(n,64,"unsigned")},r.converters["unsigned long"]=function(n){return r.util.ConvertToInt(n,32,"unsigned")},r.converters["unsigned short"]=function(n,o){return r.util.ConvertToInt(n,16,"unsigned",o)},r.converters.ArrayBuffer=function(n,o={}){if(r.util.Type(n)!=="Object"||!e.isAnyArrayBuffer(n))throw r.errors.conversionFailed({prefix:r.util.Stringify(n),argument:r.util.Stringify(n),types:["ArrayBuffer"]});if(o.allowShared===!1&&e.isSharedArrayBuffer(n))throw r.errors.exception({header:"ArrayBuffer",message:"SharedArrayBuffer is not allowed."});if(n.resizable||n.growable)throw r.errors.exception({header:"ArrayBuffer",message:"Received a resizable ArrayBuffer."});return n},r.converters.TypedArray=function(n,o,B={}){if(r.util.Type(n)!=="Object"||!e.isTypedArray(n)||n.constructor.name!==o.name)throw r.errors.conversionFailed({prefix:`${o.name}`,argument:r.util.Stringify(n),types:[o.name]});if(B.allowShared===!1&&e.isSharedArrayBuffer(n.buffer))throw r.errors.exception({header:"ArrayBuffer",message:"SharedArrayBuffer is not allowed."});if(n.buffer.resizable||n.buffer.growable)throw r.errors.exception({header:"ArrayBuffer",message:"Received a resizable ArrayBuffer."});return n},r.converters.DataView=function(n,o={}){if(r.util.Type(n)!=="Object"||!e.isDataView(n))throw r.errors.exception({header:"DataView",message:"Object is not a DataView."});if(o.allowShared===!1&&e.isSharedArrayBuffer(n.buffer))throw r.errors.exception({header:"ArrayBuffer",message:"SharedArrayBuffer is not allowed."});if(n.buffer.resizable||n.buffer.growable)throw r.errors.exception({header:"ArrayBuffer",message:"Received a resizable ArrayBuffer."});return n},r.converters.BufferSource=function(n,o={}){if(e.isAnyArrayBuffer(n))return r.converters.ArrayBuffer(n,{...o,allowShared:!1});if(e.isTypedArray(n))return r.converters.TypedArray(n,n.constructor,{...o,allowShared:!1});if(e.isDataView(n))return r.converters.DataView(n,o,{...o,allowShared:!1});throw new TypeError(`Could not convert ${r.util.Stringify(n)} to a BufferSource.`)},r.converters["sequence<ByteString>"]=r.sequenceConverter(r.converters.ByteString),r.converters["sequence<sequence<ByteString>>"]=r.sequenceConverter(r.converters["sequence<ByteString>"]),r.converters["record<ByteString, ByteString>"]=r.recordConverter(r.converters.ByteString,r.converters.ByteString),webidl_1={webidl:r},webidl_1}Q(requireWebidl,"requireWebidl");var util$j,hasRequiredUtil$5;function requireUtil$5(){if(hasRequiredUtil$5)return util$j;hasRequiredUtil$5=1;const{Transform:e}=Stream__default,A=zlib__default,{redirectStatusSet:t,referrerPolicySet:r,badPortsSet:n}=requireConstants$2(),{getGlobalOrigin:o}=requireGlobal(),{collectASequenceOfCodePoints:B,collectAnHTTPQuotedString:l,removeChars:C,parseMIMEType:f}=requireDataUrl(),{performance:c}=require$$5__default,{isBlobLike:I,ReadableStreamFrom:y,isValidHTTPToken:w}=util$m,U=require$$0__default,{isUint8Array:k}=require$$8__default$1,{webidl:F}=requireWebidl();let S;try{S=require("node:crypto");}catch{}function M(G){const j=G.urlList,iA=j.length;return iA===0?null:j[iA-1].toString()}Q(M,"responseURL");function p(G,j){if(!t.has(G.status))return null;let iA=G.headersList.get("location",!0);return iA!==null&&D(iA)&&(iA=new URL(iA,M(G))),iA&&!iA.hash&&(iA.hash=j),iA}Q(p,"responseLocationURL");function V(G){return G.urlList[G.urlList.length-1]}Q(V,"requestCurrentURL");function Y(G){const j=V(G);return NA(j)&&n.has(j.port)?"blocked":"allowed"}Q(Y,"requestBadPort");function R(G){return G instanceof Error||G?.constructor?.name==="Error"||G?.constructor?.name==="DOMException"}Q(R,"isErrorLike");function m(G){for(let j=0;j<G.length;++j){const iA=G.charCodeAt(j);if(!(iA===9||iA>=32&&iA<=126||iA>=128&&iA<=255))return !1}return !0}Q(m,"isValidReasonPhrase");const _=w;function D(G){return !(G.startsWith("	")||G.startsWith(" ")||G.endsWith("	")||G.endsWith(" ")||G.includes("\0")||G.includes("\r")||G.includes(`
`))}Q(D,"isValidHeaderValue");function b(G,j){const{headersList:iA}=j,EA=(iA.get("referrer-policy",!0)??"").split(",");let dA="";if(EA.length>0)for(let yA=EA.length;yA!==0;yA--){const wA=EA[yA-1].trim();if(r.has(wA)){dA=wA;break}}dA!==""&&(G.referrerPolicy=dA);}Q(b,"setRequestReferrerPolicyOnRedirect");function W(){return "allowed"}Q(W,"crossOriginResourcePolicyCheck");function J(){return "success"}Q(J,"corsCheck");function N(){return "success"}Q(N,"TAOCheck");function v(G){let j=null;j=G.mode,G.headersList.set("sec-fetch-mode",j,!0);}Q(v,"appendFetchMetadata");function Z(G){let j=G.origin;if(G.responseTainting==="cors"||G.mode==="websocket")j&&G.headersList.append("origin",j,!0);else if(G.method!=="GET"&&G.method!=="HEAD"){switch(G.referrerPolicy){case"no-referrer":j=null;break;case"no-referrer-when-downgrade":case"strict-origin":case"strict-origin-when-cross-origin":G.origin&&ne(G.origin)&&!ne(V(G))&&(j=null);break;case"same-origin":hA(G,V(G))||(j=null);break}j&&G.headersList.append("origin",j,!0);}}Q(Z,"appendRequestOriginHeader");function X(G,j){return G}Q(X,"coarsenTime");function K(G,j,iA){return !G?.startTime||G.startTime<j?{domainLookupStartTime:j,domainLookupEndTime:j,connectionStartTime:j,connectionEndTime:j,secureConnectionStartTime:j,ALPNNegotiatedProtocol:G?.ALPNNegotiatedProtocol}:{domainLookupStartTime:X(G.domainLookupStartTime),domainLookupEndTime:X(G.domainLookupEndTime),connectionStartTime:X(G.connectionStartTime),connectionEndTime:X(G.connectionEndTime),secureConnectionStartTime:X(G.secureConnectionStartTime),ALPNNegotiatedProtocol:G.ALPNNegotiatedProtocol}}Q(K,"clampAndCoarsenConnectionTimingInfo");function gA(G){return X(c.now())}Q(gA,"coarsenedSharedCurrentTime");function tA(G){return {startTime:G.startTime??0,redirectStartTime:0,redirectEndTime:0,postRedirectStartTime:G.startTime??0,finalServiceWorkerStartTime:0,finalNetworkResponseStartTime:0,finalNetworkRequestStartTime:0,endTime:0,encodedBodySize:0,decodedBodySize:0,finalConnectionTimingInfo:null}}Q(tA,"createOpaqueTimingInfo");function cA(){return {referrerPolicy:"strict-origin-when-cross-origin"}}Q(cA,"makePolicyContainer");function sA(G){return {referrerPolicy:G.referrerPolicy}}Q(sA,"clonePolicyContainer");function aA(G){const j=G.referrerPolicy;U(j);let iA=null;if(G.referrer==="client"){const UA=o();if(!UA||UA.origin==="null")return "no-referrer";iA=new URL(UA);}else G.referrer instanceof URL&&(iA=G.referrer);let EA=bA(iA);const dA=bA(iA,!0);EA.toString().length>4096&&(EA=dA);const yA=hA(G,EA),wA=rA(EA)&&!rA(G.url);switch(j){case"origin":return dA??bA(iA,!0);case"unsafe-url":return EA;case"same-origin":return yA?dA:"no-referrer";case"origin-when-cross-origin":return yA?EA:dA;case"strict-origin-when-cross-origin":{const UA=V(G);return hA(EA,UA)?EA:rA(EA)&&!rA(UA)?"no-referrer":dA}case"strict-origin":case"no-referrer-when-downgrade":default:return wA?"no-referrer":dA}}Q(aA,"determineRequestsReferrer");function bA(G,j){return U(G instanceof URL),G=new URL(G),G.protocol==="file:"||G.protocol==="about:"||G.protocol==="blank:"?"no-referrer":(G.username="",G.password="",G.hash="",j&&(G.pathname="",G.search=""),G)}Q(bA,"stripURLForReferrer");function rA(G){if(!(G instanceof URL))return !1;if(G.href==="about:blank"||G.href==="about:srcdoc"||G.protocol==="data:"||G.protocol==="file:")return !0;return j(G.origin);function j(iA){if(iA==null||iA==="null")return !1;const EA=new URL(iA);return !!(EA.protocol==="https:"||EA.protocol==="wss:"||/^127(?:\.[0-9]+){0,2}\.[0-9]+$|^\[(?:0*:)*?:?0*1\]$/.test(EA.hostname)||EA.hostname==="localhost"||EA.hostname.includes("localhost.")||EA.hostname.endsWith(".localhost"))}}Q(rA,"isURLPotentiallyTrustworthy");function QA(G,j){if(S===void 0)return !0;const iA=AA(j);if(iA==="no metadata"||iA.length===0)return !0;const EA=iA.sort((wA,UA)=>UA.algo.localeCompare(wA.algo)),dA=EA[0].algo,yA=EA.filter(wA=>wA.algo===dA);for(const wA of yA){const UA=wA.algo;let SA=wA.hash;SA.endsWith("==")&&(SA=SA.slice(0,-2));let qA=S.createHash(UA).update(G).digest("base64");if(qA.endsWith("==")&&(qA=qA.slice(0,-2)),qA===SA)return !0;let VA=S.createHash(UA).update(G).digest("base64url");if(VA.endsWith("==")&&(VA=VA.slice(0,-2)),VA===SA)return !0}return !1}Q(QA,"bytesMatch");const $=/(?<algo>sha256|sha384|sha512)-(?<hash>[A-Za-z0-9+/]+={0,2}(?=\s|$))( +[!-~]*)?/i;function AA(G){const j=[];let iA=!0;const EA=S.getHashes();for(const dA of G.split(" ")){iA=!1;const yA=$.exec(dA);if(yA===null||yA.groups===void 0)continue;const wA=yA.groups.algo;EA.includes(wA.toLowerCase())&&j.push(yA.groups);}return iA===!0?"no metadata":j}Q(AA,"parseMetadata");function oA(G){}Q(oA,"tryUpgradeRequestToAPotentiallyTrustworthyURL");function hA(G,j){return G.origin===j.origin&&G.origin==="null"||G.protocol===j.protocol&&G.hostname===j.hostname&&G.port===j.port}Q(hA,"sameOrigin");function fA(){let G,j;return {promise:new Promise((EA,dA)=>{G=EA,j=dA;}),resolve:G,reject:j}}Q(fA,"createDeferredPromise");function RA(G){return G.controller.state==="aborted"}Q(RA,"isAborted");function kA(G){return G.controller.state==="aborted"||G.controller.state==="terminated"}Q(kA,"isCancelled");const lA={delete:"DELETE",DELETE:"DELETE",get:"GET",GET:"GET",head:"HEAD",HEAD:"HEAD",options:"OPTIONS",OPTIONS:"OPTIONS",post:"POST",POST:"POST",put:"PUT",PUT:"PUT"},CA={...lA,patch:"patch",PATCH:"PATCH"};Object.setPrototypeOf(lA,null),Object.setPrototypeOf(CA,null);function WA(G){return lA[G.toLowerCase()]??G}Q(WA,"normalizeMethod");function Ce(G){const j=JSON.stringify(G);if(j===void 0)throw new TypeError("Value is not JSON serializable");return U(typeof j=="string"),j}Q(Ce,"serializeJavascriptValueToJSONString");const HA=Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));function oe(G,j,iA=0,EA=1){var yA,wA,UA;const SA=class SA{constructor(VA,q){FA(this,yA,void 0);FA(this,wA,void 0);FA(this,UA,void 0);DA(this,yA,VA),DA(this,wA,q),DA(this,UA,0);}next(){if(typeof this!="object"||this===null||!Wt(yA,this))throw new TypeError(`'next' called on an object that does not implement interface ${G} Iterator.`);const VA=x(this,UA),q=x(this,yA)[j],BA=q.length;if(VA>=BA)return {value:void 0,done:!0};const{[iA]:z,[EA]:eA}=q[VA];DA(this,UA,VA+1);let IA;switch(x(this,wA)){case"key":IA=z;break;case"value":IA=eA;break;case"key+value":IA=[z,eA];break}return {value:IA,done:!1}}};yA=new WeakMap,wA=new WeakMap,UA=new WeakMap,Q(SA,"FastIterableIterator");let dA=SA;return delete dA.prototype.constructor,Object.setPrototypeOf(dA.prototype,HA),Object.defineProperties(dA.prototype,{[Symbol.toStringTag]:{writable:!1,enumerable:!1,configurable:!0,value:`${G} Iterator`},next:{writable:!0,enumerable:!0,configurable:!0}}),function(qA,VA){return new dA(qA,VA)}}Q(oe,"createIterator");function re(G,j,iA,EA=0,dA=1){const yA=oe(G,iA,EA,dA),wA={keys:{writable:!0,enumerable:!0,configurable:!0,value:Q(function(){return F.brandCheck(this,j),yA(this,"key")},"keys")},values:{writable:!0,enumerable:!0,configurable:!0,value:Q(function(){return F.brandCheck(this,j),yA(this,"value")},"values")},entries:{writable:!0,enumerable:!0,configurable:!0,value:Q(function(){return F.brandCheck(this,j),yA(this,"key+value")},"entries")},forEach:{writable:!0,enumerable:!0,configurable:!0,value:Q(function(SA,qA=globalThis){if(F.brandCheck(this,j),F.argumentLengthCheck(arguments,1,{header:`${G}.forEach`}),typeof SA!="function")throw new TypeError(`Failed to execute 'forEach' on '${G}': parameter 1 is not of type 'Function'.`);for(const{0:VA,1:q}of yA(this,"key+value"))SA.call(qA,q,VA,this);},"forEach")}};return Object.defineProperties(j.prototype,{...wA,[Symbol.iterator]:{writable:!0,enumerable:!1,configurable:!0,value:wA.entries.value}})}Q(re,"iteratorMixin");async function Be(G,j,iA){const EA=j,dA=iA;let yA;try{yA=G.stream.getReader();}catch(wA){dA(wA);return}try{const wA=await _A(yA);EA(wA);}catch(wA){dA(wA);}}Q(Be,"fullyReadBody");function KA(G){return G instanceof ReadableStream||G[Symbol.toStringTag]==="ReadableStream"&&typeof G.tee=="function"}Q(KA,"isReadableStreamLike");function zA(G){try{G.close(),G.byobRequest?.respond(0);}catch(j){if(!j.message.includes("Controller is already closed")&&!j.message.includes("ReadableStream is already closed"))throw j}}Q(zA,"readableStreamClose");function OA(G){for(let j=0;j<G.length;j++)U(G.charCodeAt(j)<=255);return G}Q(OA,"isomorphicEncode");async function _A(G){const j=[];let iA=0;for(;;){const{done:EA,value:dA}=await G.read();if(EA)return Buffer.concat(j,iA);if(!k(dA))throw new TypeError("Received non-Uint8Array chunk");j.push(dA),iA+=dA.length;}}Q(_A,"readAllBytes");function ie(G){U("protocol"in G);const j=G.protocol;return j==="about:"||j==="blob:"||j==="data:"}Q(ie,"urlIsLocal");function ne(G){return typeof G=="string"?G.startsWith("https:"):G.protocol==="https:"}Q(ne,"urlHasHttpsScheme");function NA(G){U("protocol"in G);const j=G.protocol;return j==="http:"||j==="https:"}Q(NA,"urlIsHttpHttpsScheme");function mA(G,j){const iA=G;if(!iA.startsWith("bytes"))return "failure";const EA={position:5};if(j&&B(SA=>SA==="	"||SA===" ",iA,EA),iA.charCodeAt(EA.position)!==61)return "failure";EA.position++,j&&B(SA=>SA==="	"||SA===" ",iA,EA);const dA=B(SA=>{const qA=SA.charCodeAt(0);return qA>=48&&qA<=57},iA,EA),yA=dA.length?Number(dA):null;if(j&&B(SA=>SA==="	"||SA===" ",iA,EA),iA.charCodeAt(EA.position)!==45)return "failure";EA.position++,j&&B(SA=>SA==="	"||SA===" ",iA,EA);const wA=B(SA=>{const qA=SA.charCodeAt(0);return qA>=48&&qA<=57},iA,EA),UA=wA.length?Number(wA):null;return EA.position<iA.length||UA===null&&yA===null||yA>UA?"failure":{rangeStartValue:yA,rangeEndValue:UA}}Q(mA,"simpleRangeHeaderValue");function Ae(G,j,iA){let EA="bytes ";return EA+=OA(`${G}`),EA+="-",EA+=OA(`${j}`),EA+="/",EA+=OA(`${iA}`),EA}Q(Ae,"buildContentRange");const Ie=class Ie extends e{_transform(j,iA,EA){if(!this._inflateStream){if(j.length===0){EA();return}this._inflateStream=(j[0]&15)===8?A.createInflate():A.createInflateRaw(),this._inflateStream.on("data",this.push.bind(this)),this._inflateStream.on("end",()=>this.push(null)),this._inflateStream.on("error",dA=>this.destroy(dA));}this._inflateStream.write(j,iA,EA);}_final(j){this._inflateStream&&(this._inflateStream.end(),this._inflateStream=null),j();}};Q(Ie,"InflateStream");let ge=Ie;function Et(){return new ge}Q(Et,"createInflate");function Qt(G){let j=null,iA=null,EA=null;const dA=Ee("content-type",G);if(dA===null)return "failure";for(const yA of dA){const wA=f(yA);wA==="failure"||wA.essence==="*/*"||(EA=wA,EA.essence!==iA?(j=null,EA.parameters.has("charset")&&(j=EA.parameters.get("charset")),iA=EA.essence):!EA.parameters.has("charset")&&j!==null&&EA.parameters.set("charset",j));}return EA??"failure"}Q(Qt,"extractMimeType");function de(G){const j=G,iA={position:0},EA=[];let dA="";for(;iA.position<j.length;){if(dA+=B(yA=>yA!=='"'&&yA!==",",j,iA),iA.position<j.length)if(j.charCodeAt(iA.position)===34){if(dA+=l(j,iA),iA.position<j.length)continue}else U(j.charCodeAt(iA.position)===44),iA.position++;dA=C(dA,!0,!0,yA=>yA===9||yA===32),EA.push(dA),dA="";}return EA}Q(de,"gettingDecodingSplitting");function Ee(G,j){const iA=j.get(G,!0);return iA===null?null:de(iA)}Q(Ee,"getDecodeSplit");const Ct=new TextDecoder;function nt(G){return G.length===0?"":(G[0]===239&&G[1]===187&&G[2]===191&&(G=G.subarray(3)),Ct.decode(G))}return Q(nt,"utf8DecodeBytes"),util$j={isAborted:RA,isCancelled:kA,createDeferredPromise:fA,ReadableStreamFrom:y,tryUpgradeRequestToAPotentiallyTrustworthyURL:oA,clampAndCoarsenConnectionTimingInfo:K,coarsenedSharedCurrentTime:gA,determineRequestsReferrer:aA,makePolicyContainer:cA,clonePolicyContainer:sA,appendFetchMetadata:v,appendRequestOriginHeader:Z,TAOCheck:N,corsCheck:J,crossOriginResourcePolicyCheck:W,createOpaqueTimingInfo:tA,setRequestReferrerPolicyOnRedirect:b,isValidHTTPToken:w,requestBadPort:Y,requestCurrentURL:V,responseURL:M,responseLocationURL:p,isBlobLike:I,isURLPotentiallyTrustworthy:rA,isValidReasonPhrase:m,sameOrigin:hA,normalizeMethod:WA,serializeJavascriptValueToJSONString:Ce,iteratorMixin:re,createIterator:oe,isValidHeaderName:_,isValidHeaderValue:D,isErrorLike:R,fullyReadBody:Be,bytesMatch:QA,isReadableStreamLike:KA,readableStreamClose:zA,isomorphicEncode:OA,urlIsLocal:ie,urlHasHttpsScheme:ne,urlIsHttpHttpsScheme:NA,readAllBytes:_A,normalizeMethodRecord:CA,simpleRangeHeaderValue:mA,buildContentRange:Ae,parseMetadata:AA,createInflate:Et,extractMimeType:Qt,getDecodeSplit:Ee,utf8DecodeBytes:nt},util$j}Q(requireUtil$5,"requireUtil$5");var symbols$3,hasRequiredSymbols$3;function requireSymbols$3(){return hasRequiredSymbols$3||(hasRequiredSymbols$3=1,symbols$3={kUrl:Symbol("url"),kHeaders:Symbol("headers"),kSignal:Symbol("signal"),kState:Symbol("state"),kGuard:Symbol("guard"),kRealm:Symbol("realm"),kDispatcher:Symbol("dispatcher")}),symbols$3}Q(requireSymbols$3,"requireSymbols$3");var file,hasRequiredFile;function requireFile(){if(hasRequiredFile)return file;hasRequiredFile=1;const{EOL:e}=require$$0__default$4,{Blob:A,File:t}=require$$6__default,{types:r}=require$$0__default$1,{kState:n}=requireSymbols$3(),{isBlobLike:o}=requireUtil$5(),{webidl:B}=requireWebidl(),{parseMIMEType:l,serializeAMimeType:C}=requireDataUrl(),{kEnumerableProperty:f}=util$m,c=new TextEncoder,F=class F extends A{constructor(p,V,Y={}){B.argumentLengthCheck(arguments,2,{header:"File constructor"}),p=B.converters["sequence<BlobPart>"](p),V=B.converters.USVString(V),Y=B.converters.FilePropertyBag(Y);const R=V;let m=Y.type,_;A:{if(m){if(m=l(m),m==="failure"){m="";break A}m=C(m).toLowerCase();}_=Y.lastModified;}super(w(p,Y),{type:m}),this[n]={name:R,lastModified:_,type:m};}get name(){return B.brandCheck(this,F),this[n].name}get lastModified(){return B.brandCheck(this,F),this[n].lastModified}get type(){return B.brandCheck(this,F),this[n].type}};Q(F,"File");let I=F;const S=class S{constructor(p,V,Y={}){const R=V,m=Y.type,_=Y.lastModified??Date.now();this[n]={blobLike:p,name:R,type:m,lastModified:_};}stream(...p){return B.brandCheck(this,S),this[n].blobLike.stream(...p)}arrayBuffer(...p){return B.brandCheck(this,S),this[n].blobLike.arrayBuffer(...p)}slice(...p){return B.brandCheck(this,S),this[n].blobLike.slice(...p)}text(...p){return B.brandCheck(this,S),this[n].blobLike.text(...p)}get size(){return B.brandCheck(this,S),this[n].blobLike.size}get type(){return B.brandCheck(this,S),this[n].blobLike.type}get name(){return B.brandCheck(this,S),this[n].name}get lastModified(){return B.brandCheck(this,S),this[n].lastModified}get[Symbol.toStringTag](){return "File"}};Q(S,"FileLike");let y=S;Object.defineProperties(I.prototype,{[Symbol.toStringTag]:{value:"File",configurable:!0},name:f,lastModified:f}),B.converters.Blob=B.interfaceConverter(A),B.converters.BlobPart=function(M,p){if(B.util.Type(M)==="Object"){if(o(M))return B.converters.Blob(M,{strict:!1});if(ArrayBuffer.isView(M)||r.isAnyArrayBuffer(M))return B.converters.BufferSource(M,p)}return B.converters.USVString(M,p)},B.converters["sequence<BlobPart>"]=B.sequenceConverter(B.converters.BlobPart),B.converters.FilePropertyBag=B.dictionaryConverter([{key:"lastModified",converter:B.converters["long long"],get defaultValue(){return Date.now()}},{key:"type",converter:B.converters.DOMString,defaultValue:""},{key:"endings",converter:M=>(M=B.converters.DOMString(M),M=M.toLowerCase(),M!=="native"&&(M="transparent"),M),defaultValue:"transparent"}]);function w(M,p){const V=[];for(const Y of M)if(typeof Y=="string"){let R=Y;p.endings==="native"&&(R=U(R)),V.push(c.encode(R));}else ArrayBuffer.isView(Y)||r.isArrayBuffer(Y)?Y.buffer?V.push(new Uint8Array(Y.buffer,Y.byteOffset,Y.byteLength)):V.push(new Uint8Array(Y)):o(Y)&&V.push(Y);return V}Q(w,"processBlobParts");function U(M){return M.replace(/\r?\n/g,e)}Q(U,"convertLineEndingsNative");function k(M){return t&&M instanceof t||M instanceof I||M&&(typeof M.stream=="function"||typeof M.arrayBuffer=="function")&&M[Symbol.toStringTag]==="File"}return Q(k,"isFileLike"),file={File:I,FileLike:y,isFileLike:k},file}Q(requireFile,"requireFile");var formdata,hasRequiredFormdata;function requireFormdata(){if(hasRequiredFormdata)return formdata;hasRequiredFormdata=1;const{isBlobLike:e,iteratorMixin:A}=requireUtil$5(),{kState:t}=requireSymbols$3(),{kEnumerableProperty:r}=util$m,{File:n,FileLike:o,isFileLike:B}=requireFile(),{webidl:l}=requireWebidl(),{File:C}=require$$6__default,f=require$$0__default$1,c=C??n,w=class w{constructor(k){if(k!==void 0)throw l.errors.conversionFailed({prefix:"FormData constructor",argument:"Argument 1",types:["undefined"]});this[t]=[];}append(k,F,S=void 0){if(l.brandCheck(this,w),l.argumentLengthCheck(arguments,2,{header:"FormData.append"}),arguments.length===3&&!e(F))throw new TypeError("Failed to execute 'append' on 'FormData': parameter 2 is not of type 'Blob'");k=l.converters.USVString(k),F=e(F)?l.converters.Blob(F,{strict:!1}):l.converters.USVString(F),S=arguments.length===3?l.converters.USVString(S):void 0;const M=y(k,F,S);this[t].push(M);}delete(k){l.brandCheck(this,w),l.argumentLengthCheck(arguments,1,{header:"FormData.delete"}),k=l.converters.USVString(k),this[t]=this[t].filter(F=>F.name!==k);}get(k){l.brandCheck(this,w),l.argumentLengthCheck(arguments,1,{header:"FormData.get"}),k=l.converters.USVString(k);const F=this[t].findIndex(S=>S.name===k);return F===-1?null:this[t][F].value}getAll(k){return l.brandCheck(this,w),l.argumentLengthCheck(arguments,1,{header:"FormData.getAll"}),k=l.converters.USVString(k),this[t].filter(F=>F.name===k).map(F=>F.value)}has(k){return l.brandCheck(this,w),l.argumentLengthCheck(arguments,1,{header:"FormData.has"}),k=l.converters.USVString(k),this[t].findIndex(F=>F.name===k)!==-1}set(k,F,S=void 0){if(l.brandCheck(this,w),l.argumentLengthCheck(arguments,2,{header:"FormData.set"}),arguments.length===3&&!e(F))throw new TypeError("Failed to execute 'set' on 'FormData': parameter 2 is not of type 'Blob'");k=l.converters.USVString(k),F=e(F)?l.converters.Blob(F,{strict:!1}):l.converters.USVString(F),S=arguments.length===3?l.converters.USVString(S):void 0;const M=y(k,F,S),p=this[t].findIndex(V=>V.name===k);p!==-1?this[t]=[...this[t].slice(0,p),M,...this[t].slice(p+1).filter(V=>V.name!==k)]:this[t].push(M);}[f.inspect.custom](k,F){const S=this[t].reduce((p,V)=>(p[V.name]?Array.isArray(p[V.name])?p[V.name].push(V.value):p[V.name]=[p[V.name],V.value]:p[V.name]=V.value,p),{__proto__:null});F.depth??(F.depth=k),F.colors??(F.colors=!0);const M=f.formatWithOptions(F,S);return `FormData ${M.slice(M.indexOf("]")+2)}`}};Q(w,"FormData");let I=w;A("FormData",I,t,"name","value"),Object.defineProperties(I.prototype,{append:r,delete:r,get:r,getAll:r,has:r,set:r,[Symbol.toStringTag]:{value:"FormData",configurable:!0}});function y(U,k,F){if(typeof k!="string"){if(B(k)||(k=k instanceof Blob?new c([k],"blob",{type:k.type}):new o(k,"blob",{type:k.type})),F!==void 0){const S={type:k.type,lastModified:k.lastModified};k=C&&k instanceof C||k instanceof n?new c([k],F,S):new o(k,F,S);}}return {name:U,value:k}}return Q(y,"makeEntry"),formdata={FormData:I,makeEntry:y},formdata}Q(requireFormdata,"requireFormdata");var formdataParser,hasRequiredFormdataParser;function requireFormdataParser(){if(hasRequiredFormdataParser)return formdataParser;hasRequiredFormdataParser=1;const{toUSVString:e,isUSVString:A,bufferToLowerCasedHeaderName:t}=util$m,{utf8DecodeBytes:r}=requireUtil$5(),{HTTP_TOKEN_CODEPOINTS:n,isomorphicDecode:o}=requireDataUrl(),{isFileLike:B,File:l}=requireFile(),{makeEntry:C}=requireFormdata(),f=require$$0__default,{File:c}=require$$6__default,I=globalThis.File??c??l,y=Buffer.from('form-data; name="'),w=Buffer.from("; filename"),U=Buffer.from("--"),k=Buffer.from(`--\r
`);function F(D){for(let b=0;b<D.length;++b)if(D.charCodeAt(b)&-128)return !1;return !0}Q(F,"isAsciiString");function S(D){const b=D.length;if(b<27||b>70)return !1;for(let W=0;W<b;++W){const J=D.charCodeAt(W);if(!(J>=48&&J<=57||J>=65&&J<=90||J>=97&&J<=122||J===39||J===45||J===95))return !1}return !0}Q(S,"validateBoundary");function M(D,b="utf-8",W=!1){return W?D=e(D):(f(A(D)),D=D.replace(/\r\n?|\r?\n/g,`\r
`)),f(Buffer.isEncoding(b)),D=D.replace(/\n/g,"%0A").replace(/\r/g,"%0D").replace(/"/g,"%22"),Buffer.from(D,b)}Q(M,"escapeFormDataName");function p(D,b){f(b!=="failure"&&b.essence==="multipart/form-data");const W=b.parameters.get("boundary");if(W===void 0)return "failure";const J=Buffer.from(`--${W}`,"utf8"),N=[],v={position:0};for(D[0]===13&&D[1]===10&&(v.position+=2);;){if(D.subarray(v.position,v.position+J.length).equals(J))v.position+=J.length;else return "failure";if(v.position===D.length-2&&_(D,U,v)||v.position===D.length-4&&_(D,k,v))return N;if(D[v.position]!==13||D[v.position+1]!==10)return "failure";v.position+=2;const Z=V(D,v);if(Z==="failure")return "failure";let{name:X,filename:K,contentType:gA,encoding:tA}=Z;v.position+=2;let cA;{const aA=D.indexOf(J.subarray(2),v.position);if(aA===-1)return "failure";cA=D.subarray(v.position,aA-4),v.position+=cA.length,tA==="base64"&&(cA=Buffer.from(cA.toString(),"base64"));}if(D[v.position]!==13||D[v.position+1]!==10)return "failure";v.position+=2;let sA;K!==null?(gA??(gA="text/plain"),F(gA)||(gA=""),sA=new I([cA],K,{type:gA})):sA=r(Buffer.from(cA)),f(A(X)),f(typeof sA=="string"&&A(sA)||B(sA)),N.push(C(X,sA,K));}}Q(p,"multipartFormDataParser");function V(D,b){let W=null,J=null,N=null,v=null;for(;;){if(D[b.position]===13&&D[b.position+1]===10)return W===null?"failure":{name:W,filename:J,contentType:N,encoding:v};let Z=R(X=>X!==10&&X!==13&&X!==58,D,b);if(Z=m(Z,!0,!0,X=>X===9||X===32),!n.test(Z.toString())||D[b.position]!==58)return "failure";switch(b.position++,R(X=>X===32||X===9,D,b),t(Z)){case"content-disposition":{if(W=J=null,!_(D,y,b)||(b.position+=17,W=Y(D,b),W===null))return "failure";if(_(D,w,b)){let X=b.position+w.length;if(D[X]===42&&(b.position+=1,X+=1),D[X]!==61||D[X+1]!==34||(b.position+=12,J=Y(D,b),J===null))return "failure"}break}case"content-type":{let X=R(K=>K!==10&&K!==13,D,b);X=m(X,!1,!0,K=>K===9||K===32),N=o(X);break}case"content-transfer-encoding":{let X=R(K=>K!==10&&K!==13,D,b);X=m(X,!1,!0,K=>K===9||K===32),v=o(X);break}default:R(X=>X!==10&&X!==13,D,b);}if(D[b.position]!==13&&D[b.position+1]!==10)return "failure";b.position+=2;}}Q(V,"parseMultipartFormDataHeaders");function Y(D,b){f(D[b.position-1]===34);let W=R(J=>J!==10&&J!==13&&J!==34,D,b);return D[b.position]!==34?null:(b.position++,W=new TextDecoder().decode(W).replace(/%0A/ig,`
`).replace(/%0D/ig,"\r").replace(/%22/g,'"'),W)}Q(Y,"parseMultipartFormDataName");function R(D,b,W){let J=W.position;for(;J<b.length&&D(b[J]);)++J;return b.subarray(W.position,W.position=J)}Q(R,"collectASequenceOfBytes");function m(D,b,W,J){let N=0,v=D.length-1;if(b)for(;N<D.length&&J(D[N]);)N++;if(W)for(;v>0&&J(D[v]);)v--;return N===0&&v===D.length-1?D:D.subarray(N,v+1)}Q(m,"removeChars");function _(D,b,W){if(D.length<b.length)return !1;for(let J=0;J<b.length;J++)if(b[J]!==D[W.position+J])return !1;return !0}return Q(_,"bufferStartsWith"),formdataParser={multipartFormDataParser:p,validateBoundary:S,escapeFormDataName:M},formdataParser}Q(requireFormdataParser,"requireFormdataParser");var body,hasRequiredBody;function requireBody(){if(hasRequiredBody)return body;hasRequiredBody=1;const e=util$m,{ReadableStreamFrom:A,isBlobLike:t,isReadableStreamLike:r,readableStreamClose:n,createDeferredPromise:o,fullyReadBody:B,extractMimeType:l,utf8DecodeBytes:C}=requireUtil$5(),{FormData:f}=requireFormdata(),{kState:c}=requireSymbols$3(),{webidl:I}=requireWebidl(),{Blob:y}=require$$6__default,w=require$$0__default,{isErrored:U}=util$m,{isArrayBuffer:k}=require$$8__default$1,{serializeAMimeType:F}=requireDataUrl(),{multipartFormDataParser:S}=requireFormdataParser(),M=new TextEncoder;function p(N,v=!1){let Z=null;N instanceof ReadableStream?Z=N:t(N)?Z=N.stream():Z=new ReadableStream({async pull(sA){const aA=typeof K=="string"?M.encode(K):K;aA.byteLength&&sA.enqueue(aA),queueMicrotask(()=>n(sA));},start(){},type:"bytes"}),w(r(Z));let X=null,K=null,gA=null,tA=null;if(typeof N=="string")K=N,tA="text/plain;charset=UTF-8";else if(N instanceof URLSearchParams)K=N.toString(),tA="application/x-www-form-urlencoded;charset=UTF-8";else if(k(N))K=new Uint8Array(N.slice());else if(ArrayBuffer.isView(N))K=new Uint8Array(N.buffer.slice(N.byteOffset,N.byteOffset+N.byteLength));else if(e.isFormDataLike(N)){const sA=`----formdata-undici-0${`${Math.floor(Math.random()*1e11)}`.padStart(11,"0")}`,aA=`--${sA}\r
Content-Disposition: form-data`;/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */const bA=Q(hA=>hA.replace(/\n/g,"%0A").replace(/\r/g,"%0D").replace(/"/g,"%22"),"escape"),rA=Q(hA=>hA.replace(/\r?\n|\r/g,`\r
`),"normalizeLinefeeds"),QA=[],$=new Uint8Array([13,10]);gA=0;let AA=!1;for(const[hA,fA]of N)if(typeof fA=="string"){const RA=M.encode(aA+`; name="${bA(rA(hA))}"\r
\r
${rA(fA)}\r
`);QA.push(RA),gA+=RA.byteLength;}else {const RA=M.encode(`${aA}; name="${bA(rA(hA))}"`+(fA.name?`; filename="${bA(fA.name)}"`:"")+`\r
Content-Type: ${fA.type||"application/octet-stream"}\r
\r
`);QA.push(RA,fA,$),typeof fA.size=="number"?gA+=RA.byteLength+fA.size+$.byteLength:AA=!0;}const oA=M.encode(`--${sA}--`);QA.push(oA),gA+=oA.byteLength,AA&&(gA=null),K=N,X=Q(async function*(){for(const hA of QA)hA.stream?yield*hA.stream():yield hA;},"action"),tA=`multipart/form-data; boundary=${sA}`;}else if(t(N))K=N,gA=N.size,N.type&&(tA=N.type);else if(typeof N[Symbol.asyncIterator]=="function"){if(v)throw new TypeError("keepalive");if(e.isDisturbed(N)||N.locked)throw new TypeError("Response body object should not be disturbed or locked");Z=N instanceof ReadableStream?N:A(N);}if((typeof K=="string"||e.isBuffer(K))&&(gA=Buffer.byteLength(K)),X!=null){let sA;Z=new ReadableStream({async start(){sA=X(N)[Symbol.asyncIterator]();},async pull(aA){const{value:bA,done:rA}=await sA.next();if(rA)queueMicrotask(()=>{aA.close(),aA.byobRequest?.respond(0);});else if(!U(Z)){const QA=new Uint8Array(bA);QA.byteLength&&aA.enqueue(QA);}return aA.desiredSize>0},async cancel(aA){await sA.return();},type:"bytes"});}return [{stream:Z,source:K,length:gA},tA]}Q(p,"extractBody");function V(N,v=!1){return N instanceof ReadableStream&&(w(!e.isDisturbed(N),"The body has already been consumed."),w(!N.locked,"The stream is locked.")),p(N,v)}Q(V,"safelyExtractBody");function Y(N){const[v,Z]=N.stream.tee();return N.stream=v,{stream:Z,length:N.length,source:N.source}}Q(Y,"cloneBody");function R(N){if(N.aborted)throw new DOMException("The operation was aborted.","AbortError")}Q(R,"throwIfAborted");function m(N){return {blob(){return D(this,Z=>{let X=J(this);return X===null?X="":X&&(X=F(X)),new y([Z],{type:X})},N)},arrayBuffer(){return D(this,Z=>new Uint8Array(Z).buffer,N)},text(){return D(this,C,N)},json(){return D(this,W,N)},formData(){return D(this,Z=>{const X=J(this);if(X!==null)switch(X.essence){case"multipart/form-data":{const K=S(Z,X);if(K==="failure")throw new TypeError("Failed to parse body as FormData.");const gA=new f;return gA[c]=K,gA}case"application/x-www-form-urlencoded":{const K=new URLSearchParams(Z.toString()),gA=new f;for(const[tA,cA]of K)gA.append(tA,cA);return gA}}throw new TypeError('Content-Type was not one of "multipart/form-data" or "application/x-www-form-urlencoded".')},N)}}}Q(m,"bodyMixinMethods");function _(N){Object.assign(N.prototype,m(N));}Q(_,"mixinBody");async function D(N,v,Z){if(I.brandCheck(N,Z),R(N[c]),b(N[c].body))throw new TypeError("Body is unusable");const X=o(),K=Q(tA=>X.reject(tA),"errorSteps"),gA=Q(tA=>{try{X.resolve(v(tA));}catch(cA){K(cA);}},"successSteps");return N[c].body==null?(gA(new Uint8Array),X.promise):(await B(N[c].body,gA,K),X.promise)}Q(D,"consumeBody");function b(N){return N!=null&&(N.stream.locked||e.isDisturbed(N.stream))}Q(b,"bodyUnusable");function W(N){return JSON.parse(C(N))}Q(W,"parseJSONFromBytes");function J(N){const v=N[c].headersList,Z=l(v);return Z==="failure"?null:Z}return Q(J,"bodyMimeType"),body={extractBody:p,safelyExtractBody:V,cloneBody:Y,mixinBody:_},body}Q(requireBody,"requireBody");const assert$7=require$$0__default,util$i=util$m,{channels:channels$1}=diagnostics,timers=timers$1,{RequestContentLengthMismatchError:RequestContentLengthMismatchError$1,ResponseContentLengthMismatchError,RequestAbortedError:RequestAbortedError$9,HeadersTimeoutError,HeadersOverflowError,SocketError:SocketError$3,InformationalError:InformationalError$2,BodyTimeoutError,HTTPParserError,ResponseExceededMaxSizeError}=errors$1,{kUrl:kUrl$4,kReset:kReset$1,kClient:kClient$3,kParser,kBlocking,kRunning:kRunning$5,kPending:kPending$4,kSize:kSize$4,kWriting,kQueue:kQueue$3,kNoRef,kKeepAliveDefaultTimeout:kKeepAliveDefaultTimeout$1,kHostHeader:kHostHeader$1,kPendingIdx:kPendingIdx$2,kRunningIdx:kRunningIdx$2,kError:kError$2,kPipelining:kPipelining$1,kSocket:kSocket$1,kKeepAliveTimeoutValue:kKeepAliveTimeoutValue$1,kMaxHeadersSize:kMaxHeadersSize$1,kKeepAliveMaxTimeout:kKeepAliveMaxTimeout$1,kKeepAliveTimeoutThreshold:kKeepAliveTimeoutThreshold$1,kHeadersTimeout:kHeadersTimeout$1,kBodyTimeout:kBodyTimeout$1,kStrictContentLength:kStrictContentLength$2,kMaxRequests:kMaxRequests$1,kCounter:kCounter$1,kMaxResponseSize:kMaxResponseSize$1,kListeners,kOnError:kOnError$2,kResume:kResume$3,kHTTPContext:kHTTPContext$1}=symbols$4,constants$2=constants$4,EMPTY_BUF=Buffer.alloc(0),FastBuffer=Buffer[Symbol.species];let extractBody;function addListener(e,A,t){return (e[kListeners]??(e[kListeners]=[])).push([A,t]),e.on(A,t),e}Q(addListener,"addListener");function removeAllListeners(e){for(const[A,t]of e[kListeners]??[])e.removeListener(A,t);e[kListeners]=null;}Q(removeAllListeners,"removeAllListeners");async function lazyllhttp(){const e=process.env.JEST_WORKER_ID?requireLlhttpWasm():void 0;let A;try{A=await WebAssembly.compile(requireLlhttp_simdWasm());}catch{A=await WebAssembly.compile(e||requireLlhttpWasm());}return await WebAssembly.instantiate(A,{env:{wasm_on_url:(t,r,n)=>0,wasm_on_status:(t,r,n)=>{assert$7.strictEqual(currentParser.ptr,t);const o=r-currentBufferPtr+currentBufferRef.byteOffset;return currentParser.onStatus(new FastBuffer(currentBufferRef.buffer,o,n))||0},wasm_on_message_begin:t=>(assert$7.strictEqual(currentParser.ptr,t),currentParser.onMessageBegin()||0),wasm_on_header_field:(t,r,n)=>{assert$7.strictEqual(currentParser.ptr,t);const o=r-currentBufferPtr+currentBufferRef.byteOffset;return currentParser.onHeaderField(new FastBuffer(currentBufferRef.buffer,o,n))||0},wasm_on_header_value:(t,r,n)=>{assert$7.strictEqual(currentParser.ptr,t);const o=r-currentBufferPtr+currentBufferRef.byteOffset;return currentParser.onHeaderValue(new FastBuffer(currentBufferRef.buffer,o,n))||0},wasm_on_headers_complete:(t,r,n,o)=>(assert$7.strictEqual(currentParser.ptr,t),currentParser.onHeadersComplete(r,!!n,!!o)||0),wasm_on_body:(t,r,n)=>{assert$7.strictEqual(currentParser.ptr,t);const o=r-currentBufferPtr+currentBufferRef.byteOffset;return currentParser.onBody(new FastBuffer(currentBufferRef.buffer,o,n))||0},wasm_on_message_complete:t=>(assert$7.strictEqual(currentParser.ptr,t),currentParser.onMessageComplete()||0)}})}Q(lazyllhttp,"lazyllhttp");let llhttpInstance=null,llhttpPromise=lazyllhttp();llhttpPromise.catch();let currentParser=null,currentBufferRef=null,currentBufferSize=0,currentBufferPtr=null;const TIMEOUT_HEADERS=1,TIMEOUT_BODY=2,TIMEOUT_IDLE=3,kt=class kt{constructor(A,t,{exports:r}){assert$7(Number.isFinite(A[kMaxHeadersSize$1])&&A[kMaxHeadersSize$1]>0),this.llhttp=r,this.ptr=this.llhttp.llhttp_alloc(constants$2.TYPE.RESPONSE),this.client=A,this.socket=t,this.timeout=null,this.timeoutValue=null,this.timeoutType=null,this.statusCode=null,this.statusText="",this.upgrade=!1,this.headers=[],this.headersSize=0,this.headersMaxSize=A[kMaxHeadersSize$1],this.shouldKeepAlive=!1,this.paused=!1,this.resume=this.resume.bind(this),this.bytesRead=0,this.keepAlive="",this.contentLength="",this.connection="",this.maxResponseSize=A[kMaxResponseSize$1];}setTimeout(A,t){this.timeoutType=t,A!==this.timeoutValue?(timers.clearTimeout(this.timeout),A?(this.timeout=timers.setTimeout(onParserTimeout,A,this),this.timeout.unref&&this.timeout.unref()):this.timeout=null,this.timeoutValue=A):this.timeout&&this.timeout.refresh&&this.timeout.refresh();}resume(){this.socket.destroyed||!this.paused||(assert$7(this.ptr!=null),assert$7(currentParser==null),this.llhttp.llhttp_resume(this.ptr),assert$7(this.timeoutType===TIMEOUT_BODY),this.timeout&&this.timeout.refresh&&this.timeout.refresh(),this.paused=!1,this.execute(this.socket.read()||EMPTY_BUF),this.readMore());}readMore(){for(;!this.paused&&this.ptr;){const A=this.socket.read();if(A===null)break;this.execute(A);}}execute(A){assert$7(this.ptr!=null),assert$7(currentParser==null),assert$7(!this.paused);const{socket:t,llhttp:r}=this;A.length>currentBufferSize&&(currentBufferPtr&&r.free(currentBufferPtr),currentBufferSize=Math.ceil(A.length/4096)*4096,currentBufferPtr=r.malloc(currentBufferSize)),new Uint8Array(r.memory.buffer,currentBufferPtr,currentBufferSize).set(A);try{let n;try{currentBufferRef=A,currentParser=this,n=r.llhttp_execute(this.ptr,currentBufferPtr,A.length);}catch(B){throw B}finally{currentParser=null,currentBufferRef=null;}const o=r.llhttp_get_error_pos(this.ptr)-currentBufferPtr;if(n===constants$2.ERROR.PAUSED_UPGRADE)this.onUpgrade(A.slice(o));else if(n===constants$2.ERROR.PAUSED)this.paused=!0,t.unshift(A.slice(o));else if(n!==constants$2.ERROR.OK){const B=r.llhttp_get_error_reason(this.ptr);let l="";if(B){const C=new Uint8Array(r.memory.buffer,B).indexOf(0);l="Response does not match the HTTP/1.1 protocol ("+Buffer.from(r.memory.buffer,B,C).toString()+")";}throw new HTTPParserError(l,constants$2.ERROR[n],A.slice(o))}}catch(n){util$i.destroy(t,n);}}destroy(){assert$7(this.ptr!=null),assert$7(currentParser==null),this.llhttp.llhttp_free(this.ptr),this.ptr=null,timers.clearTimeout(this.timeout),this.timeout=null,this.timeoutValue=null,this.timeoutType=null,this.paused=!1;}onStatus(A){this.statusText=A.toString();}onMessageBegin(){const{socket:A,client:t}=this;if(A.destroyed)return -1;const r=t[kQueue$3][t[kRunningIdx$2]];if(!r)return -1;r.onResponseStarted();}onHeaderField(A){const t=this.headers.length;t&1?this.headers[t-1]=Buffer.concat([this.headers[t-1],A]):this.headers.push(A),this.trackHeader(A.length);}onHeaderValue(A){let t=this.headers.length;(t&1)===1?(this.headers.push(A),t+=1):this.headers[t-1]=Buffer.concat([this.headers[t-1],A]);const r=this.headers[t-2];if(r.length===10){const n=util$i.bufferToLowerCasedHeaderName(r);n==="keep-alive"?this.keepAlive+=A.toString():n==="connection"&&(this.connection+=A.toString());}else r.length===14&&util$i.bufferToLowerCasedHeaderName(r)==="content-length"&&(this.contentLength+=A.toString());this.trackHeader(A.length);}trackHeader(A){this.headersSize+=A,this.headersSize>=this.headersMaxSize&&util$i.destroy(this.socket,new HeadersOverflowError);}onUpgrade(A){const{upgrade:t,client:r,socket:n,headers:o,statusCode:B}=this;assert$7(t);const l=r[kQueue$3][r[kRunningIdx$2]];assert$7(l),assert$7(!n.destroyed),assert$7(n===r[kSocket$1]),assert$7(!this.paused),assert$7(l.upgrade||l.method==="CONNECT"),this.statusCode=null,this.statusText="",this.shouldKeepAlive=null,assert$7(this.headers.length%2===0),this.headers=[],this.headersSize=0,n.unshift(A),n[kParser].destroy(),n[kParser]=null,n[kClient$3]=null,n[kError$2]=null,removeAllListeners(n),r[kSocket$1]=null,r[kHTTPContext$1]=null,r[kQueue$3][r[kRunningIdx$2]++]=null,r.emit("disconnect",r[kUrl$4],[r],new InformationalError$2("upgrade"));try{l.onUpgrade(B,o,n);}catch(C){util$i.destroy(n,C);}r[kResume$3]();}onHeadersComplete(A,t,r){const{client:n,socket:o,headers:B,statusText:l}=this;if(o.destroyed)return -1;const C=n[kQueue$3][n[kRunningIdx$2]];if(!C)return -1;if(assert$7(!this.upgrade),assert$7(this.statusCode<200),A===100)return util$i.destroy(o,new SocketError$3("bad response",util$i.getSocketInfo(o))),-1;if(t&&!C.upgrade)return util$i.destroy(o,new SocketError$3("bad upgrade",util$i.getSocketInfo(o))),-1;if(assert$7.strictEqual(this.timeoutType,TIMEOUT_HEADERS),this.statusCode=A,this.shouldKeepAlive=r||C.method==="HEAD"&&!o[kReset$1]&&this.connection.toLowerCase()==="keep-alive",this.statusCode>=200){const c=C.bodyTimeout!=null?C.bodyTimeout:n[kBodyTimeout$1];this.setTimeout(c,TIMEOUT_BODY);}else this.timeout&&this.timeout.refresh&&this.timeout.refresh();if(C.method==="CONNECT")return assert$7(n[kRunning$5]===1),this.upgrade=!0,2;if(t)return assert$7(n[kRunning$5]===1),this.upgrade=!0,2;if(assert$7(this.headers.length%2===0),this.headers=[],this.headersSize=0,this.shouldKeepAlive&&n[kPipelining$1]){const c=this.keepAlive?util$i.parseKeepAliveTimeout(this.keepAlive):null;if(c!=null){const I=Math.min(c-n[kKeepAliveTimeoutThreshold$1],n[kKeepAliveMaxTimeout$1]);I<=0?o[kReset$1]=!0:n[kKeepAliveTimeoutValue$1]=I;}else n[kKeepAliveTimeoutValue$1]=n[kKeepAliveDefaultTimeout$1];}else o[kReset$1]=!0;const f=C.onHeaders(A,B,this.resume,l)===!1;return C.aborted?-1:C.method==="HEAD"||A<200?1:(o[kBlocking]&&(o[kBlocking]=!1,n[kResume$3]()),f?constants$2.ERROR.PAUSED:0)}onBody(A){const{client:t,socket:r,statusCode:n,maxResponseSize:o}=this;if(r.destroyed)return -1;const B=t[kQueue$3][t[kRunningIdx$2]];if(assert$7(B),assert$7.strictEqual(this.timeoutType,TIMEOUT_BODY),this.timeout&&this.timeout.refresh&&this.timeout.refresh(),assert$7(n>=200),o>-1&&this.bytesRead+A.length>o)return util$i.destroy(r,new ResponseExceededMaxSizeError),-1;if(this.bytesRead+=A.length,B.onData(A)===!1)return constants$2.ERROR.PAUSED}onMessageComplete(){const{client:A,socket:t,statusCode:r,upgrade:n,headers:o,contentLength:B,bytesRead:l,shouldKeepAlive:C}=this;if(t.destroyed&&(!r||C))return -1;if(n)return;const f=A[kQueue$3][A[kRunningIdx$2]];if(assert$7(f),assert$7(r>=100),this.statusCode=null,this.statusText="",this.bytesRead=0,this.contentLength="",this.keepAlive="",this.connection="",assert$7(this.headers.length%2===0),this.headers=[],this.headersSize=0,!(r<200)){if(f.method!=="HEAD"&&B&&l!==parseInt(B,10))return util$i.destroy(t,new ResponseContentLengthMismatchError),-1;if(f.onComplete(o),A[kQueue$3][A[kRunningIdx$2]++]=null,t[kWriting])return assert$7.strictEqual(A[kRunning$5],0),util$i.destroy(t,new InformationalError$2("reset")),constants$2.ERROR.PAUSED;if(C){if(t[kReset$1]&&A[kRunning$5]===0)return util$i.destroy(t,new InformationalError$2("reset")),constants$2.ERROR.PAUSED;A[kPipelining$1]==null||A[kPipelining$1]===1?setImmediate(()=>A[kResume$3]()):A[kResume$3]();}else return util$i.destroy(t,new InformationalError$2("reset")),constants$2.ERROR.PAUSED}}};Q(kt,"Parser");let Parser=kt;function onParserTimeout(e){const{socket:A,timeoutType:t,client:r}=e;t===TIMEOUT_HEADERS?(!A[kWriting]||A.writableNeedDrain||r[kRunning$5]>1)&&(assert$7(!e.paused,"cannot be paused while waiting for headers"),util$i.destroy(A,new HeadersTimeoutError)):t===TIMEOUT_BODY?e.paused||util$i.destroy(A,new BodyTimeoutError):t===TIMEOUT_IDLE&&(assert$7(r[kRunning$5]===0&&r[kKeepAliveTimeoutValue$1]),util$i.destroy(A,new InformationalError$2("socket idle timeout")));}Q(onParserTimeout,"onParserTimeout");async function connectH1$1(e,A){e[kSocket$1]=A,llhttpInstance||(llhttpInstance=await llhttpPromise,llhttpPromise=null),A[kNoRef]=!1,A[kWriting]=!1,A[kReset$1]=!1,A[kBlocking]=!1,A[kParser]=new Parser(e,A,llhttpInstance),addListener(A,"error",function(r){const n=this[kParser];if(assert$7(r.code!=="ERR_TLS_CERT_ALTNAME_INVALID"),r.code==="ECONNRESET"&&n.statusCode&&!n.shouldKeepAlive){n.onMessageComplete();return}this[kError$2]=r,this[kClient$3][kOnError$2](r);}),addListener(A,"readable",function(){const r=this[kParser];r&&r.readMore();}),addListener(A,"end",function(){const r=this[kParser];if(r.statusCode&&!r.shouldKeepAlive){r.onMessageComplete();return}util$i.destroy(this,new SocketError$3("other side closed",util$i.getSocketInfo(this)));}),addListener(A,"close",function(){const r=this[kClient$3],n=this[kParser];n&&(!this[kError$2]&&n.statusCode&&!n.shouldKeepAlive&&n.onMessageComplete(),this[kParser].destroy(),this[kParser]=null);const o=this[kError$2]||new SocketError$3("closed",util$i.getSocketInfo(this));if(r[kSocket$1]=null,r[kHTTPContext$1]=null,r.destroyed){assert$7(r[kPending$4]===0);const B=r[kQueue$3].splice(r[kRunningIdx$2]);for(let l=0;l<B.length;l++){const C=B[l];errorRequest$2(r,C,o);}}else if(r[kRunning$5]>0&&o.code!=="UND_ERR_INFO"){const B=r[kQueue$3][r[kRunningIdx$2]];r[kQueue$3][r[kRunningIdx$2]++]=null,errorRequest$2(r,B,o);}r[kPendingIdx$2]=r[kRunningIdx$2],assert$7(r[kRunning$5]===0),r.emit("disconnect",r[kUrl$4],[r],o),r[kResume$3]();});let t=!1;return A.on("close",()=>{t=!0;}),{version:"h1",defaultPipelining:1,write(...r){return writeH1(e,...r)},resume(){resumeH1(e);},destroy(r,n){t?queueMicrotask(n):A.destroy(r).on("close",n);},get destroyed(){return A.destroyed},busy(r){return !!(A[kWriting]||A[kReset$1]||A[kBlocking]||r&&(e[kRunning$5]>0&&!r.idempotent||e[kRunning$5]>0&&(r.upgrade||r.method==="CONNECT")||e[kRunning$5]>0&&util$i.bodyLength(r.body)!==0&&(util$i.isStream(r.body)||util$i.isAsyncIterable(r.body)||util$i.isFormDataLike(r.body))))}}}Q(connectH1$1,"connectH1$1");function resumeH1(e){const A=e[kSocket$1];if(A&&!A.destroyed){if(e[kSize$4]===0?!A[kNoRef]&&A.unref&&(A.unref(),A[kNoRef]=!0):A[kNoRef]&&A.ref&&(A.ref(),A[kNoRef]=!1),e[kSize$4]===0)A[kParser].timeoutType!==TIMEOUT_IDLE&&A[kParser].setTimeout(e[kKeepAliveTimeoutValue$1],TIMEOUT_IDLE);else if(e[kRunning$5]>0&&A[kParser].statusCode<200&&A[kParser].timeoutType!==TIMEOUT_HEADERS){const t=e[kQueue$3][e[kRunningIdx$2]],r=t.headersTimeout!=null?t.headersTimeout:e[kHeadersTimeout$1];A[kParser].setTimeout(r,TIMEOUT_HEADERS);}}}Q(resumeH1,"resumeH1");function errorRequest$2(e,A,t){try{A.onError(t),assert$7(A.aborted);}catch(r){e.emit("error",r);}}Q(errorRequest$2,"errorRequest$2");function shouldSendContentLength$1(e){return e!=="GET"&&e!=="HEAD"&&e!=="OPTIONS"&&e!=="TRACE"&&e!=="CONNECT"}Q(shouldSendContentLength$1,"shouldSendContentLength$1");function writeH1(e,A){const{method:t,path:r,host:n,upgrade:o,blocking:B,reset:l}=A;let{body:C,headers:f,contentLength:c}=A;const I=t==="PUT"||t==="POST"||t==="PATCH";if(util$i.isFormDataLike(C)){extractBody||(extractBody=requireBody().extractBody);const[k,F]=extractBody(C);A.contentType==null&&f.push("content-type",F),C=k.stream,c=k.length;}else util$i.isBlobLike(C)&&A.contentType==null&&C.type&&f.push("content-type",C.type);C&&typeof C.read=="function"&&C.read(0);const y=util$i.bodyLength(C);if(c=y??c,c===null&&(c=A.contentLength),c===0&&!I&&(c=null),shouldSendContentLength$1(t)&&c>0&&A.contentLength!==null&&A.contentLength!==c){if(e[kStrictContentLength$2])return errorRequest$2(e,A,new RequestContentLengthMismatchError$1),!1;process.emitWarning(new RequestContentLengthMismatchError$1);}const w=e[kSocket$1];try{A.onConnect(k=>{A.aborted||A.completed||(errorRequest$2(e,A,k||new RequestAbortedError$9),util$i.destroy(w,new InformationalError$2("aborted")));});}catch(k){errorRequest$2(e,A,k);}if(A.aborted)return util$i.destroy(C),!1;t==="HEAD"&&(w[kReset$1]=!0),(o||t==="CONNECT")&&(w[kReset$1]=!0),l!=null&&(w[kReset$1]=l),e[kMaxRequests$1]&&w[kCounter$1]++>=e[kMaxRequests$1]&&(w[kReset$1]=!0),B&&(w[kBlocking]=!0);let U=`${t} ${r} HTTP/1.1\r
`;if(typeof n=="string"?U+=`host: ${n}\r
`:U+=e[kHostHeader$1],o?U+=`connection: upgrade\r
upgrade: ${o}\r
`:e[kPipelining$1]&&!w[kReset$1]?U+=`connection: keep-alive\r
`:U+=`connection: close\r
`,Array.isArray(f))for(let k=0;k<f.length;k+=2){const F=f[k+0],S=f[k+1];if(Array.isArray(S))for(let M=0;M<S.length;M++)U+=`${F}: ${S[M]}\r
`;else U+=`${F}: ${S}\r
`;}return channels$1.sendHeaders.hasSubscribers&&channels$1.sendHeaders.publish({request:A,headers:U,socket:w}),!C||y===0?(c===0?w.write(`${U}content-length: 0\r
\r
`,"latin1"):(assert$7(c===null,"no body must not have content length"),w.write(`${U}\r
`,"latin1")),A.onRequestSent()):util$i.isBuffer(C)?(assert$7(c===C.byteLength,"buffer body must have content length"),w.cork(),w.write(`${U}content-length: ${c}\r
\r
`,"latin1"),w.write(C),w.uncork(),A.onBodySent(C),A.onRequestSent(),I||(w[kReset$1]=!0)):util$i.isBlobLike(C)?typeof C.stream=="function"?writeIterable$1({body:C.stream(),client:e,request:A,socket:w,contentLength:c,header:U,expectsPayload:I}):writeBlob$1({body:C,client:e,request:A,socket:w,contentLength:c,header:U,expectsPayload:I}):util$i.isStream(C)?writeStream$1({body:C,client:e,request:A,socket:w,contentLength:c,header:U,expectsPayload:I}):util$i.isIterable(C)?writeIterable$1({body:C,client:e,request:A,socket:w,contentLength:c,header:U,expectsPayload:I}):assert$7(!1),!0}Q(writeH1,"writeH1");function writeStream$1({h2stream:e,body:A,client:t,request:r,socket:n,contentLength:o,header:B,expectsPayload:l}){assert$7(o!==0||t[kRunning$5]===0,"stream body cannot be pipelined");let C=!1;const f=new AsyncWriter({socket:n,request:r,contentLength:o,client:t,expectsPayload:l,header:B}),c=Q(function(U){if(!C)try{!f.write(U)&&this.pause&&this.pause();}catch(k){util$i.destroy(this,k);}},"onData"),I=Q(function(){C||A.resume&&A.resume();},"onDrain"),y=Q(function(){if(queueMicrotask(()=>{A.removeListener("error",w);}),!C){const U=new RequestAbortedError$9;queueMicrotask(()=>w(U));}},"onClose"),w=Q(function(U){if(!C){if(C=!0,assert$7(n.destroyed||n[kWriting]&&t[kRunning$5]<=1),n.off("drain",I).off("error",w),A.removeListener("data",c).removeListener("end",w).removeListener("close",y),!U)try{f.end();}catch(k){U=k;}f.destroy(U),U&&(U.code!=="UND_ERR_INFO"||U.message!=="reset")?util$i.destroy(A,U):util$i.destroy(A);}},"onFinished");A.on("data",c).on("end",w).on("error",w).on("close",y),A.resume&&A.resume(),n.on("drain",I).on("error",w),A.errorEmitted??A.errored?setImmediate(()=>w(A.errored)):(A.endEmitted??A.readableEnded)&&setImmediate(()=>w(null)),(A.closeEmitted??A.closed)&&setImmediate(y);}Q(writeStream$1,"writeStream$1");async function writeBlob$1({h2stream:e,body:A,client:t,request:r,socket:n,contentLength:o,header:B,expectsPayload:l}){assert$7(o===A.size,"blob body must have content length");try{if(o!=null&&o!==A.size)throw new RequestContentLengthMismatchError$1;const C=Buffer.from(await A.arrayBuffer());n.cork(),n.write(`${B}content-length: ${o}\r
\r
`,"latin1"),n.write(C),n.uncork(),r.onBodySent(C),r.onRequestSent(),l||(n[kReset$1]=!0),t[kResume$3]();}catch(C){util$i.destroy(n,C);}}Q(writeBlob$1,"writeBlob$1");async function writeIterable$1({h2stream:e,body:A,client:t,request:r,socket:n,contentLength:o,header:B,expectsPayload:l}){assert$7(o!==0||t[kRunning$5]===0,"iterator body cannot be pipelined");let C=null;function f(){if(C){const y=C;C=null,y();}}Q(f,"onDrain");const c=Q(()=>new Promise((y,w)=>{assert$7(C===null),n[kError$2]?w(n[kError$2]):C=y;}),"waitForDrain");n.on("close",f).on("drain",f);const I=new AsyncWriter({socket:n,request:r,contentLength:o,client:t,expectsPayload:l,header:B});try{for await(const y of A){if(n[kError$2])throw n[kError$2];I.write(y)||await c();}I.end();}catch(y){I.destroy(y);}finally{n.off("close",f).off("drain",f);}}Q(writeIterable$1,"writeIterable$1");const pt=class pt{constructor({socket:A,request:t,contentLength:r,client:n,expectsPayload:o,header:B}){this.socket=A,this.request=t,this.contentLength=r,this.client=n,this.bytesWritten=0,this.expectsPayload=o,this.header=B,A[kWriting]=!0;}write(A){const{socket:t,request:r,contentLength:n,client:o,bytesWritten:B,expectsPayload:l,header:C}=this;if(t[kError$2])throw t[kError$2];if(t.destroyed)return !1;const f=Buffer.byteLength(A);if(!f)return !0;if(n!==null&&B+f>n){if(o[kStrictContentLength$2])throw new RequestContentLengthMismatchError$1;process.emitWarning(new RequestContentLengthMismatchError$1);}t.cork(),B===0&&(l||(t[kReset$1]=!0),n===null?t.write(`${C}transfer-encoding: chunked\r
`,"latin1"):t.write(`${C}content-length: ${n}\r
\r
`,"latin1")),n===null&&t.write(`\r
${f.toString(16)}\r
`,"latin1"),this.bytesWritten+=f;const c=t.write(A);return t.uncork(),r.onBodySent(A),c||t[kParser].timeout&&t[kParser].timeoutType===TIMEOUT_HEADERS&&t[kParser].timeout.refresh&&t[kParser].timeout.refresh(),c}end(){const{socket:A,contentLength:t,client:r,bytesWritten:n,expectsPayload:o,header:B,request:l}=this;if(l.onRequestSent(),A[kWriting]=!1,A[kError$2])throw A[kError$2];if(!A.destroyed){if(n===0?o?A.write(`${B}content-length: 0\r
\r
`,"latin1"):A.write(`${B}\r
`,"latin1"):t===null&&A.write(`\r
0\r
\r
`,"latin1"),t!==null&&n!==t){if(r[kStrictContentLength$2])throw new RequestContentLengthMismatchError$1;process.emitWarning(new RequestContentLengthMismatchError$1);}A[kParser].timeout&&A[kParser].timeoutType===TIMEOUT_HEADERS&&A[kParser].timeout.refresh&&A[kParser].timeout.refresh(),r[kResume$3]();}}destroy(A){const{socket:t,client:r}=this;t[kWriting]=!1,A&&(assert$7(r[kRunning$5]<=1,"pipeline should only contain this request"),util$i.destroy(t,A));}};Q(pt,"AsyncWriter");let AsyncWriter=pt;var clientH1=connectH1$1;const assert$6=require$$0__default,{pipeline:pipeline$1}=Stream__default,util$h=util$m,{RequestContentLengthMismatchError,RequestAbortedError:RequestAbortedError$8,SocketError:SocketError$2,InformationalError:InformationalError$1}=errors$1,{kUrl:kUrl$3,kReset,kClient:kClient$2,kRunning:kRunning$4,kPending:kPending$3,kQueue:kQueue$2,kPendingIdx:kPendingIdx$1,kRunningIdx:kRunningIdx$1,kError:kError$1,kSocket,kStrictContentLength:kStrictContentLength$1,kOnError:kOnError$1,kMaxConcurrentStreams:kMaxConcurrentStreams$1,kHTTP2Session,kResume:kResume$2}=symbols$4,kOpenStreams=Symbol("open streams");let h2ExperimentalWarned=!1,http2;try{http2=require("node:http2");}catch{http2={constants:{}};}const{constants:{HTTP2_HEADER_AUTHORITY,HTTP2_HEADER_METHOD,HTTP2_HEADER_PATH,HTTP2_HEADER_SCHEME,HTTP2_HEADER_CONTENT_LENGTH,HTTP2_HEADER_EXPECT,HTTP2_HEADER_STATUS}}=http2;async function connectH2$1(e,A){e[kSocket]=A,h2ExperimentalWarned||(h2ExperimentalWarned=!0,process.emitWarning("H2 support is experimental, expect them to change at any time.",{code:"UNDICI-H2"}));const t=http2.connect(e[kUrl$3],{createConnection:()=>A,peerMaxConcurrentStreams:e[kMaxConcurrentStreams$1]});t[kOpenStreams]=0,t[kClient$2]=e,t[kSocket]=A,t.on("error",onHttp2SessionError),t.on("frameError",onHttp2FrameError),t.on("end",onHttp2SessionEnd),t.on("goaway",onHTTP2GoAway),t.on("close",function(){const{[kClient$2]:n}=this,o=this[kError$1]||new SocketError$2("closed",util$h.getSocketInfo(this));n[kSocket]=null,assert$6(n[kPending$3]===0);const B=n[kQueue$2].splice(n[kRunningIdx$1]);for(let l=0;l<B.length;l++){const C=B[l];errorRequest$1(n,C,o);}n[kPendingIdx$1]=n[kRunningIdx$1],assert$6(n[kRunning$4]===0),n.emit("disconnect",n[kUrl$3],[n],o),n[kResume$2]();}),t.unref(),e[kHTTP2Session]=t,A[kHTTP2Session]=t,A.on("error",function(n){assert$6(n.code!=="ERR_TLS_CERT_ALTNAME_INVALID"),this[kError$1]=n,this[kClient$2][kOnError$1](n);}),A.on("end",function(){util$h.destroy(this,new SocketError$2("other side closed",util$h.getSocketInfo(this)));});let r=!1;return A.on("close",()=>{r=!0;}),{version:"h2",defaultPipelining:1/0,write(...n){writeH2(e,...n);},resume(){},destroy(n,o){t.destroy(n),r?queueMicrotask(o):A.destroy(n).on("close",o);},get destroyed(){return A.destroyed},busy(){return !1}}}Q(connectH2$1,"connectH2$1");function onHttp2SessionError(e){assert$6(e.code!=="ERR_TLS_CERT_ALTNAME_INVALID"),this[kSocket][kError$1]=e,this[kClient$2][kOnError$1](e);}Q(onHttp2SessionError,"onHttp2SessionError");function onHttp2FrameError(e,A,t){const r=new InformationalError$1(`HTTP/2: "frameError" received - type ${e}, code ${A}`);t===0&&(this[kSocket][kError$1]=r,this[kClient$2][kOnError$1](r));}Q(onHttp2FrameError,"onHttp2FrameError");function onHttp2SessionEnd(){this.destroy(new SocketError$2("other side closed")),util$h.destroy(this[kSocket],new SocketError$2("other side closed"));}Q(onHttp2SessionEnd,"onHttp2SessionEnd");function onHTTP2GoAway(e){const A=this[kClient$2],t=new InformationalError$1(`HTTP/2: "GOAWAY" frame received with code ${e}`);if(A[kSocket]=null,A[kHTTP2Session]=null,A.destroyed){assert$6(this[kPending$3]===0);const r=A[kQueue$2].splice(A[kRunningIdx$1]);for(let n=0;n<r.length;n++){const o=r[n];errorRequest$1(this,o,t);}}else if(A[kRunning$4]>0){const r=A[kQueue$2][A[kRunningIdx$1]];A[kQueue$2][A[kRunningIdx$1]++]=null,errorRequest$1(A,r,t);}A[kPendingIdx$1]=A[kRunningIdx$1],assert$6(A[kRunning$4]===0),A.emit("disconnect",A[kUrl$3],[A],t),A[kResume$2]();}Q(onHTTP2GoAway,"onHTTP2GoAway");function errorRequest$1(e,A,t){try{A.onError(t),assert$6(A.aborted);}catch(r){e.emit("error",r);}}Q(errorRequest$1,"errorRequest$1");function shouldSendContentLength(e){return e!=="GET"&&e!=="HEAD"&&e!=="OPTIONS"&&e!=="TRACE"&&e!=="CONNECT"}Q(shouldSendContentLength,"shouldSendContentLength");function writeH2(e,A){const t=e[kHTTP2Session],{body:r,method:n,path:o,host:B,upgrade:l,expectContinue:C,signal:f,headers:c}=A;if(l)return errorRequest$1(e,A,new Error("Upgrade not supported for H2")),!1;if(A.aborted)return !1;const I={};for(let p=0;p<c.length;p+=2){const V=c[p+0],Y=c[p+1];if(Array.isArray(Y))for(let R=0;R<Y.length;R++)I[V]?I[V]+=`,${Y[R]}`:I[V]=Y[R];else I[V]=Y;}let y;const{hostname:w,port:U}=e[kUrl$3];I[HTTP2_HEADER_AUTHORITY]=B||`${w}${U?`:${U}`:""}`,I[HTTP2_HEADER_METHOD]=n;try{A.onConnect(p=>{A.aborted||A.completed||(p=p||new RequestAbortedError$8,y!=null&&(util$h.destroy(y,p),t[kOpenStreams]-=1,t[kOpenStreams]===0&&t.unref()),errorRequest$1(e,A,p));});}catch(p){errorRequest$1(e,A,p);}if(n==="CONNECT")return t.ref(),y=t.request(I,{endStream:!1,signal:f}),y.id&&!y.pending?(A.onUpgrade(null,null,y),++t[kOpenStreams]):y.once("ready",()=>{A.onUpgrade(null,null,y),++t[kOpenStreams];}),y.once("close",()=>{t[kOpenStreams]-=1,t[kOpenStreams]===0&&t.unref();}),!0;I[HTTP2_HEADER_PATH]=o,I[HTTP2_HEADER_SCHEME]="https";const k=n==="PUT"||n==="POST"||n==="PATCH";r&&typeof r.read=="function"&&r.read(0);let F=util$h.bodyLength(r);if(F==null&&(F=A.contentLength),(F===0||!k)&&(F=null),shouldSendContentLength(n)&&F>0&&A.contentLength!=null&&A.contentLength!==F){if(e[kStrictContentLength$1])return errorRequest$1(e,A,new RequestContentLengthMismatchError),!1;process.emitWarning(new RequestContentLengthMismatchError);}F!=null&&(assert$6(r,"no body must not have content length"),I[HTTP2_HEADER_CONTENT_LENGTH]=`${F}`),t.ref();const S=n==="GET"||n==="HEAD"||r===null;return C?(I[HTTP2_HEADER_EXPECT]="100-continue",y=t.request(I,{endStream:S,signal:f}),y.once("continue",M)):(y=t.request(I,{endStream:S,signal:f}),M()),++t[kOpenStreams],y.once("response",p=>{const{[HTTP2_HEADER_STATUS]:V,...Y}=p;A.onResponseStarted(),A.onHeaders(Number(V),Y,y.resume.bind(y),"")===!1&&y.pause();}),y.once("end",()=>{if(y.state?.state==null||y.state.state<6){A.onComplete([]);return}t[kOpenStreams]-=1,t[kOpenStreams]===0&&t.unref();const p=new InformationalError$1("HTTP/2: stream half-closed (remote)");errorRequest$1(e,A,p),util$h.destroy(y,p);}),y.on("data",p=>{A.onData(p)===!1&&y.pause();}),y.once("close",()=>{t[kOpenStreams]-=1,t[kOpenStreams]===0&&t.unref();}),y.once("error",function(p){e[kHTTP2Session]&&!e[kHTTP2Session].destroyed&&!this.closed&&!this.destroyed&&(t[kOpenStreams]-=1,util$h.destroy(y,p));}),y.once("frameError",(p,V)=>{const Y=new InformationalError$1(`HTTP/2: "frameError" received - type ${p}, code ${V}`);errorRequest$1(e,A,Y),e[kHTTP2Session]&&!e[kHTTP2Session].destroyed&&!this.closed&&!this.destroyed&&(t[kOpenStreams]-=1,util$h.destroy(y,Y));}),!0;function M(){r?util$h.isBuffer(r)?(assert$6(F===r.byteLength,"buffer body must have content length"),y.cork(),y.write(r),y.uncork(),y.end(),A.onBodySent(r),A.onRequestSent()):util$h.isBlobLike(r)?typeof r.stream=="function"?writeIterable({client:e,request:A,contentLength:F,h2stream:y,expectsPayload:k,body:r.stream(),socket:e[kSocket],header:""}):writeBlob({body:r,client:e,request:A,contentLength:F,expectsPayload:k,h2stream:y,header:"",socket:e[kSocket]}):util$h.isStream(r)?writeStream({body:r,client:e,request:A,contentLength:F,expectsPayload:k,socket:e[kSocket],h2stream:y,header:""}):util$h.isIterable(r)?writeIterable({body:r,client:e,request:A,contentLength:F,expectsPayload:k,header:"",h2stream:y,socket:e[kSocket]}):assert$6(!1):A.onRequestSent();}}Q(writeH2,"writeH2");function writeStream({h2stream:e,body:A,client:t,request:r,socket:n,contentLength:o,header:B,expectsPayload:l}){assert$6(o!==0||t[kRunning$4]===0,"stream body cannot be pipelined");const C=pipeline$1(A,e,c=>{c?(util$h.destroy(A,c),util$h.destroy(e,c)):r.onRequestSent();});C.on("data",f),C.once("end",()=>{C.removeListener("data",f),util$h.destroy(C);});function f(c){r.onBodySent(c);}Q(f,"onPipeData");}Q(writeStream,"writeStream");async function writeBlob({h2stream:e,body:A,client:t,request:r,socket:n,contentLength:o,header:B,expectsPayload:l}){assert$6(o===A.size,"blob body must have content length");try{if(o!=null&&o!==A.size)throw new RequestContentLengthMismatchError;const C=Buffer.from(await A.arrayBuffer());e.cork(),e.write(C),e.uncork(),r.onBodySent(C),r.onRequestSent(),l||(n[kReset]=!0),t[kResume$2]();}catch{util$h.destroy(e);}}Q(writeBlob,"writeBlob");async function writeIterable({h2stream:e,body:A,client:t,request:r,socket:n,contentLength:o,header:B,expectsPayload:l}){assert$6(o!==0||t[kRunning$4]===0,"iterator body cannot be pipelined");let C=null;function f(){if(C){const I=C;C=null,I();}}Q(f,"onDrain");const c=Q(()=>new Promise((I,y)=>{assert$6(C===null),n[kError$1]?y(n[kError$1]):C=I;}),"waitForDrain");e.on("close",f).on("drain",f);try{for await(const I of A){if(n[kError$1])throw n[kError$1];const y=e.write(I);r.onBodySent(I),y||await c();}}catch(I){e.destroy(I);}finally{r.onRequestSent(),e.end(),e.off("close",f).off("drain",f);}}Q(writeIterable,"writeIterable");var clientH2=connectH2$1;const util$g=util$m,{kBodyUsed}=symbols$4,assert$5=require$$0__default,{InvalidArgumentError:InvalidArgumentError$f}=errors$1,EE=require$$0__default$3,redirectableStatusCodes=[300,301,302,303,307,308],kBody$1=Symbol("body"),Ft=class Ft{constructor(A){this[kBody$1]=A,this[kBodyUsed]=!1;}async*[Symbol.asyncIterator](){assert$5(!this[kBodyUsed],"disturbed"),this[kBodyUsed]=!0,yield*this[kBody$1];}};Q(Ft,"BodyAsyncIterable");let BodyAsyncIterable=Ft,RedirectHandler$1=(Ze=class{constructor(A,t,r,n){if(t!=null&&(!Number.isInteger(t)||t<0))throw new InvalidArgumentError$f("maxRedirections must be a positive number");util$g.validateHandler(n,r.method,r.upgrade),this.dispatch=A,this.location=null,this.abort=null,this.opts={...r,maxRedirections:0},this.maxRedirections=t,this.handler=n,this.history=[],this.redirectionLimitReached=!1,util$g.isStream(this.opts.body)?(util$g.bodyLength(this.opts.body)===0&&this.opts.body.on("data",function(){assert$5(!1);}),typeof this.opts.body.readableDidRead!="boolean"&&(this.opts.body[kBodyUsed]=!1,EE.prototype.on.call(this.opts.body,"data",function(){this[kBodyUsed]=!0;}))):this.opts.body&&typeof this.opts.body.pipeTo=="function"?this.opts.body=new BodyAsyncIterable(this.opts.body):this.opts.body&&typeof this.opts.body!="string"&&!ArrayBuffer.isView(this.opts.body)&&util$g.isIterable(this.opts.body)&&(this.opts.body=new BodyAsyncIterable(this.opts.body));}onConnect(A){this.abort=A,this.handler.onConnect(A,{history:this.history});}onUpgrade(A,t,r){this.handler.onUpgrade(A,t,r);}onError(A){this.handler.onError(A);}onHeaders(A,t,r,n){if(this.location=this.history.length>=this.maxRedirections||util$g.isDisturbed(this.opts.body)?null:parseLocation(A,t),this.opts.throwOnMaxRedirect&&this.history.length>=this.maxRedirections){this.request&&this.request.abort(new Error("max redirects")),this.redirectionLimitReached=!0,this.abort(new Error("max redirects"));return}if(this.opts.origin&&this.history.push(new URL(this.opts.path,this.opts.origin)),!this.location)return this.handler.onHeaders(A,t,r,n);const{origin:o,pathname:B,search:l}=util$g.parseURL(new URL(this.location,this.opts.origin&&new URL(this.opts.path,this.opts.origin))),C=l?`${B}${l}`:B;this.opts.headers=cleanRequestHeaders(this.opts.headers,A===303,this.opts.origin!==o),this.opts.path=C,this.opts.origin=o,this.opts.maxRedirections=0,this.opts.query=null,A===303&&this.opts.method!=="HEAD"&&(this.opts.method="GET",this.opts.body=null);}onData(A){if(!this.location)return this.handler.onData(A)}onComplete(A){this.location?(this.location=null,this.abort=null,this.dispatch(this.opts,this)):this.handler.onComplete(A);}onBodySent(A){this.handler.onBodySent&&this.handler.onBodySent(A);}},Q(Ze,"RedirectHandler"),Ze);function parseLocation(e,A){if(redirectableStatusCodes.indexOf(e)===-1)return null;for(let t=0;t<A.length;t+=2)if(A[t].length===8&&util$g.headerNameToString(A[t])==="location")return A[t+1]}Q(parseLocation,"parseLocation");function shouldRemoveHeader(e,A,t){if(e.length===4)return util$g.headerNameToString(e)==="host";if(A&&util$g.headerNameToString(e).startsWith("content-"))return !0;if(t&&(e.length===13||e.length===6)){const r=util$g.headerNameToString(e);return r==="authorization"||r==="cookie"}return !1}Q(shouldRemoveHeader,"shouldRemoveHeader");function cleanRequestHeaders(e,A,t){const r=[];if(Array.isArray(e))for(let n=0;n<e.length;n+=2)shouldRemoveHeader(e[n],A,t)||r.push(e[n],e[n+1]);else if(e&&typeof e=="object")for(const n of Object.keys(e))shouldRemoveHeader(n,A,t)||r.push(n,e[n]);else assert$5(e==null,"headers must be an object or an array");return r}Q(cleanRequestHeaders,"cleanRequestHeaders");var redirectHandler=RedirectHandler$1;const RedirectHandler=redirectHandler;function createRedirectInterceptor$2({maxRedirections:e}){return A=>Q(function(r,n){const{maxRedirections:o=e}=r;if(!o)return A(r,n);const B=new RedirectHandler(A,o,r,n);return r={...r,maxRedirections:0},A(r,B)},"Intercept")}Q(createRedirectInterceptor$2,"createRedirectInterceptor$2");var redirectInterceptor=createRedirectInterceptor$2;const assert$4=require$$0__default,net$2=require$$4__default,http$1=http__default,util$f=util$m,{channels}=diagnostics,Request=request$2,DispatcherBase$3=dispatcherBase,{InvalidArgumentError:InvalidArgumentError$e,InformationalError,ClientDestroyedError}=errors$1,buildConnector$2=connect$2,{kUrl:kUrl$2,kServerName,kClient:kClient$1,kBusy:kBusy$1,kConnect,kResuming,kRunning:kRunning$3,kPending:kPending$2,kSize:kSize$3,kQueue:kQueue$1,kConnected:kConnected$4,kConnecting,kNeedDrain:kNeedDrain$2,kKeepAliveDefaultTimeout,kHostHeader,kPendingIdx,kRunningIdx,kError,kPipelining,kKeepAliveTimeoutValue,kMaxHeadersSize,kKeepAliveMaxTimeout,kKeepAliveTimeoutThreshold,kHeadersTimeout,kBodyTimeout,kStrictContentLength,kConnector,kMaxRedirections:kMaxRedirections$1,kMaxRequests,kCounter,kClose:kClose$5,kDestroy:kDestroy$3,kDispatch:kDispatch$2,kInterceptors:kInterceptors$3,kLocalAddress,kMaxResponseSize,kOnError,kHTTPContext,kMaxConcurrentStreams,kResume:kResume$1}=symbols$4,connectH1=clientH1,connectH2=clientH2;let deprecatedInterceptorWarned=!1;const kClosedResolve$1=Symbol("kClosedResolve");function getPipelining(e){return e[kPipelining]??e[kHTTPContext]?.defaultPipelining??1}Q(getPipelining,"getPipelining");let Client$3=(Xe=class extends DispatcherBase$3{constructor(A,{interceptors:t,maxHeaderSize:r,headersTimeout:n,socketTimeout:o,requestTimeout:B,connectTimeout:l,bodyTimeout:C,idleTimeout:f,keepAlive:c,keepAliveTimeout:I,maxKeepAliveTimeout:y,keepAliveMaxTimeout:w,keepAliveTimeoutThreshold:U,socketPath:k,pipelining:F,tls:S,strictContentLength:M,maxCachedSessions:p,maxRedirections:V,connect:Y,maxRequestsPerClient:R,localAddress:m,maxResponseSize:_,autoSelectFamily:D,autoSelectFamilyAttemptTimeout:b,maxConcurrentStreams:W,allowH2:J}={}){if(super(),c!==void 0)throw new InvalidArgumentError$e("unsupported keepAlive, use pipelining=0 instead");if(o!==void 0)throw new InvalidArgumentError$e("unsupported socketTimeout, use headersTimeout & bodyTimeout instead");if(B!==void 0)throw new InvalidArgumentError$e("unsupported requestTimeout, use headersTimeout & bodyTimeout instead");if(f!==void 0)throw new InvalidArgumentError$e("unsupported idleTimeout, use keepAliveTimeout instead");if(y!==void 0)throw new InvalidArgumentError$e("unsupported maxKeepAliveTimeout, use keepAliveMaxTimeout instead");if(r!=null&&!Number.isFinite(r))throw new InvalidArgumentError$e("invalid maxHeaderSize");if(k!=null&&typeof k!="string")throw new InvalidArgumentError$e("invalid socketPath");if(l!=null&&(!Number.isFinite(l)||l<0))throw new InvalidArgumentError$e("invalid connectTimeout");if(I!=null&&(!Number.isFinite(I)||I<=0))throw new InvalidArgumentError$e("invalid keepAliveTimeout");if(w!=null&&(!Number.isFinite(w)||w<=0))throw new InvalidArgumentError$e("invalid keepAliveMaxTimeout");if(U!=null&&!Number.isFinite(U))throw new InvalidArgumentError$e("invalid keepAliveTimeoutThreshold");if(n!=null&&(!Number.isInteger(n)||n<0))throw new InvalidArgumentError$e("headersTimeout must be a positive integer or zero");if(C!=null&&(!Number.isInteger(C)||C<0))throw new InvalidArgumentError$e("bodyTimeout must be a positive integer or zero");if(Y!=null&&typeof Y!="function"&&typeof Y!="object")throw new InvalidArgumentError$e("connect must be a function or an object");if(V!=null&&(!Number.isInteger(V)||V<0))throw new InvalidArgumentError$e("maxRedirections must be a positive number");if(R!=null&&(!Number.isInteger(R)||R<0))throw new InvalidArgumentError$e("maxRequestsPerClient must be a positive number");if(m!=null&&(typeof m!="string"||net$2.isIP(m)===0))throw new InvalidArgumentError$e("localAddress must be valid string IP address");if(_!=null&&(!Number.isInteger(_)||_<-1))throw new InvalidArgumentError$e("maxResponseSize must be a positive number");if(b!=null&&(!Number.isInteger(b)||b<-1))throw new InvalidArgumentError$e("autoSelectFamilyAttemptTimeout must be a positive number");if(J!=null&&typeof J!="boolean")throw new InvalidArgumentError$e("allowH2 must be a valid boolean value");if(W!=null&&(typeof W!="number"||W<1))throw new InvalidArgumentError$e("maxConcurrentStreams must be a positive integer, greater than 0");typeof Y!="function"&&(Y=buildConnector$2({...S,maxCachedSessions:p,allowH2:J,socketPath:k,timeout:l,...util$f.nodeHasAutoSelectFamily&&D?{autoSelectFamily:D,autoSelectFamilyAttemptTimeout:b}:void 0,...Y})),t?.Client&&Array.isArray(t.Client)?(this[kInterceptors$3]=t.Client,deprecatedInterceptorWarned||(deprecatedInterceptorWarned=!0,process.emitWarning("Client.Options#interceptor is deprecated. Use Dispatcher#compose instead.",{code:"UNDICI-CLIENT-INTERCEPTOR-DEPRECATED"}))):this[kInterceptors$3]=[createRedirectInterceptor$1({maxRedirections:V})],this[kUrl$2]=util$f.parseOrigin(A),this[kConnector]=Y,this[kPipelining]=F??1,this[kMaxHeadersSize]=r||http$1.maxHeaderSize,this[kKeepAliveDefaultTimeout]=I??4e3,this[kKeepAliveMaxTimeout]=w??6e5,this[kKeepAliveTimeoutThreshold]=U??1e3,this[kKeepAliveTimeoutValue]=this[kKeepAliveDefaultTimeout],this[kServerName]=null,this[kLocalAddress]=m??null,this[kResuming]=0,this[kNeedDrain$2]=0,this[kHostHeader]=`host: ${this[kUrl$2].hostname}${this[kUrl$2].port?`:${this[kUrl$2].port}`:""}\r
`,this[kBodyTimeout]=C??3e5,this[kHeadersTimeout]=n??3e5,this[kStrictContentLength]=M??!0,this[kMaxRedirections$1]=V,this[kMaxRequests]=R,this[kClosedResolve$1]=null,this[kMaxResponseSize]=_>-1?_:-1,this[kMaxConcurrentStreams]=W??100,this[kHTTPContext]=null,this[kQueue$1]=[],this[kRunningIdx]=0,this[kPendingIdx]=0,this[kResume$1]=N=>resume$1(this,N),this[kOnError]=N=>onError(this,N);}get pipelining(){return this[kPipelining]}set pipelining(A){this[kPipelining]=A,this[kResume$1](!0);}get[kPending$2](){return this[kQueue$1].length-this[kPendingIdx]}get[kRunning$3](){return this[kPendingIdx]-this[kRunningIdx]}get[kSize$3](){return this[kQueue$1].length-this[kRunningIdx]}get[kConnected$4](){return !!this[kHTTPContext]&&!this[kConnecting]&&!this[kHTTPContext].destroyed}get[kBusy$1](){return !!(this[kHTTPContext]?.busy(null)||this[kSize$3]>=(getPipelining(this)||1)||this[kPending$2]>0)}[kConnect](A){connect$1(this),this.once("connect",A);}[kDispatch$2](A,t){const r=A.origin||this[kUrl$2].origin,n=new Request(r,A,t);return this[kQueue$1].push(n),this[kResuming]||(util$f.bodyLength(n.body)==null&&util$f.isIterable(n.body)?(this[kResuming]=1,queueMicrotask(()=>resume$1(this))):this[kResume$1](!0)),this[kResuming]&&this[kNeedDrain$2]!==2&&this[kBusy$1]&&(this[kNeedDrain$2]=2),this[kNeedDrain$2]<2}async[kClose$5](){return new Promise(A=>{this[kSize$3]?this[kClosedResolve$1]=A:A(null);})}async[kDestroy$3](A){return new Promise(t=>{const r=this[kQueue$1].splice(this[kPendingIdx]);for(let o=0;o<r.length;o++){const B=r[o];errorRequest(this,B,A);}const n=Q(()=>{this[kClosedResolve$1]&&(this[kClosedResolve$1](),this[kClosedResolve$1]=null),t(null);},"callback");this[kHTTPContext]?(this[kHTTPContext].destroy(A,n),this[kHTTPContext]=null):queueMicrotask(n),this[kResume$1]();})}},Q(Xe,"Client"),Xe);const createRedirectInterceptor$1=redirectInterceptor;function onError(e,A){if(e[kRunning$3]===0&&A.code!=="UND_ERR_INFO"&&A.code!=="UND_ERR_SOCKET"){assert$4(e[kPendingIdx]===e[kRunningIdx]);const t=e[kQueue$1].splice(e[kRunningIdx]);for(let r=0;r<t.length;r++){const n=t[r];errorRequest(e,n,A);}assert$4(e[kSize$3]===0);}}Q(onError,"onError");async function connect$1(e){assert$4(!e[kConnecting]),assert$4(!e[kHTTPContext]);let{host:A,hostname:t,protocol:r,port:n}=e[kUrl$2];if(t[0]==="["){const o=t.indexOf("]");assert$4(o!==-1);const B=t.substring(1,o);assert$4(net$2.isIP(B)),t=B;}e[kConnecting]=!0,channels.beforeConnect.hasSubscribers&&channels.beforeConnect.publish({connectParams:{host:A,hostname:t,protocol:r,port:n,version:e[kHTTPContext]?.version,servername:e[kServerName],localAddress:e[kLocalAddress]},connector:e[kConnector]});try{const o=await new Promise((B,l)=>{e[kConnector]({host:A,hostname:t,protocol:r,port:n,servername:e[kServerName],localAddress:e[kLocalAddress]},(C,f)=>{C?l(C):B(f);});});if(e.destroyed){util$f.destroy(o.on("error",()=>{}),new ClientDestroyedError);return}assert$4(o);try{e[kHTTPContext]=o.alpnProtocol==="h2"?await connectH2(e,o):await connectH1(e,o);}catch(B){throw o.destroy().on("error",()=>{}),B}e[kConnecting]=!1,o[kCounter]=0,o[kMaxRequests]=e[kMaxRequests],o[kClient$1]=e,o[kError]=null,channels.connected.hasSubscribers&&channels.connected.publish({connectParams:{host:A,hostname:t,protocol:r,port:n,version:e[kHTTPContext]?.version,servername:e[kServerName],localAddress:e[kLocalAddress]},connector:e[kConnector],socket:o}),e.emit("connect",e[kUrl$2],[e]);}catch(o){if(e.destroyed)return;if(e[kConnecting]=!1,channels.connectError.hasSubscribers&&channels.connectError.publish({connectParams:{host:A,hostname:t,protocol:r,port:n,version:e[kHTTPContext]?.version,servername:e[kServerName],localAddress:e[kLocalAddress]},connector:e[kConnector],error:o}),o.code==="ERR_TLS_CERT_ALTNAME_INVALID")for(assert$4(e[kRunning$3]===0);e[kPending$2]>0&&e[kQueue$1][e[kPendingIdx]].servername===e[kServerName];){const B=e[kQueue$1][e[kPendingIdx]++];errorRequest(e,B,o);}else onError(e,o);e.emit("connectionError",e[kUrl$2],[e],o);}e[kResume$1]();}Q(connect$1,"connect$1");function emitDrain(e){e[kNeedDrain$2]=0,e.emit("drain",e[kUrl$2],[e]);}Q(emitDrain,"emitDrain");function resume$1(e,A){e[kResuming]!==2&&(e[kResuming]=2,_resume(e,A),e[kResuming]=0,e[kRunningIdx]>256&&(e[kQueue$1].splice(0,e[kRunningIdx]),e[kPendingIdx]-=e[kRunningIdx],e[kRunningIdx]=0));}Q(resume$1,"resume$1");function _resume(e,A){for(;;){if(e.destroyed){assert$4(e[kPending$2]===0);return}if(e[kClosedResolve$1]&&!e[kSize$3]){e[kClosedResolve$1](),e[kClosedResolve$1]=null;return}if(e[kHTTPContext]&&e[kHTTPContext].resume(),e[kBusy$1])e[kNeedDrain$2]=2;else if(e[kNeedDrain$2]===2){A?(e[kNeedDrain$2]=1,queueMicrotask(()=>emitDrain(e))):emitDrain(e);continue}if(e[kPending$2]===0||e[kRunning$3]>=(getPipelining(e)||1))return;const t=e[kQueue$1][e[kPendingIdx]];if(e[kUrl$2].protocol==="https:"&&e[kServerName]!==t.servername){if(e[kRunning$3]>0)return;e[kServerName]=t.servername,e[kHTTPContext]?.destroy(new InformationalError("servername changed"));}if(e[kConnecting])return;if(!e[kHTTPContext]){connect$1(e);return}if(e[kHTTPContext].destroyed||e[kHTTPContext].busy(t))return;!t.aborted&&e[kHTTPContext].write(t)?e[kPendingIdx]++:e[kQueue$1].splice(e[kPendingIdx],1);}}Q(_resume,"_resume");function errorRequest(e,A,t){try{A.onError(t),assert$4(A.aborted);}catch(r){e.emit("error",r);}}Q(errorRequest,"errorRequest");var client=Client$3;const kSize$2=2048,kMask=kSize$2-1,Nt=class Nt{constructor(){this.bottom=0,this.top=0,this.list=new Array(kSize$2),this.next=null;}isEmpty(){return this.top===this.bottom}isFull(){return (this.top+1&kMask)===this.bottom}push(A){this.list[this.top]=A,this.top=this.top+1&kMask;}shift(){const A=this.list[this.bottom];return A===void 0?null:(this.list[this.bottom]=void 0,this.bottom=this.bottom+1&kMask,A)}};Q(Nt,"FixedCircularBuffer");let FixedCircularBuffer=Nt;var fixedQueue=(Ke=class{constructor(){this.head=this.tail=new FixedCircularBuffer;}isEmpty(){return this.head.isEmpty()}push(A){this.head.isFull()&&(this.head=this.head.next=new FixedCircularBuffer),this.head.push(A);}shift(){const A=this.tail,t=A.shift();return A.isEmpty()&&A.next!==null&&(this.tail=A.next),t}},Q(Ke,"FixedQueue"),Ke);const{kFree:kFree$1,kConnected:kConnected$3,kPending:kPending$1,kQueued:kQueued$1,kRunning:kRunning$2,kSize:kSize$1}=symbols$4,kPool=Symbol("pool");let PoolStats$1=($e=class{constructor(A){this[kPool]=A;}get connected(){return this[kPool][kConnected$3]}get free(){return this[kPool][kFree$1]}get pending(){return this[kPool][kPending$1]}get queued(){return this[kPool][kQueued$1]}get running(){return this[kPool][kRunning$2]}get size(){return this[kPool][kSize$1]}},Q($e,"PoolStats"),$e);var poolStats=PoolStats$1;const DispatcherBase$2=dispatcherBase,FixedQueue=fixedQueue,{kConnected:kConnected$2,kSize,kRunning:kRunning$1,kPending,kQueued,kBusy,kFree,kUrl:kUrl$1,kClose:kClose$4,kDestroy:kDestroy$2,kDispatch:kDispatch$1}=symbols$4,PoolStats=poolStats,kClients$2=Symbol("clients"),kNeedDrain$1=Symbol("needDrain"),kQueue=Symbol("queue"),kClosedResolve=Symbol("closed resolve"),kOnDrain$1=Symbol("onDrain"),kOnConnect$1=Symbol("onConnect"),kOnDisconnect$1=Symbol("onDisconnect"),kOnConnectionError$1=Symbol("onConnectionError"),kGetDispatcher$1=Symbol("get dispatcher"),kAddClient$1=Symbol("add client"),kRemoveClient=Symbol("remove client"),kStats=Symbol("stats");let PoolBase$1=(je=class extends DispatcherBase$2{constructor(){super(),this[kQueue]=new FixedQueue,this[kClients$2]=[],this[kQueued]=0;const A=this;this[kOnDrain$1]=Q(function(r,n){const o=A[kQueue];let B=!1;for(;!B;){const l=o.shift();if(!l)break;A[kQueued]--,B=!this.dispatch(l.opts,l.handler);}this[kNeedDrain$1]=B,!this[kNeedDrain$1]&&A[kNeedDrain$1]&&(A[kNeedDrain$1]=!1,A.emit("drain",r,[A,...n])),A[kClosedResolve]&&o.isEmpty()&&Promise.all(A[kClients$2].map(l=>l.close())).then(A[kClosedResolve]);},"onDrain"),this[kOnConnect$1]=(t,r)=>{A.emit("connect",t,[A,...r]);},this[kOnDisconnect$1]=(t,r,n)=>{A.emit("disconnect",t,[A,...r],n);},this[kOnConnectionError$1]=(t,r,n)=>{A.emit("connectionError",t,[A,...r],n);},this[kStats]=new PoolStats(this);}get[kBusy](){return this[kNeedDrain$1]}get[kConnected$2](){return this[kClients$2].filter(A=>A[kConnected$2]).length}get[kFree](){return this[kClients$2].filter(A=>A[kConnected$2]&&!A[kNeedDrain$1]).length}get[kPending](){let A=this[kQueued];for(const{[kPending]:t}of this[kClients$2])A+=t;return A}get[kRunning$1](){let A=0;for(const{[kRunning$1]:t}of this[kClients$2])A+=t;return A}get[kSize](){let A=this[kQueued];for(const{[kSize]:t}of this[kClients$2])A+=t;return A}get stats(){return this[kStats]}async[kClose$4](){return this[kQueue].isEmpty()?Promise.all(this[kClients$2].map(A=>A.close())):new Promise(A=>{this[kClosedResolve]=A;})}async[kDestroy$2](A){for(;;){const t=this[kQueue].shift();if(!t)break;t.handler.onError(A);}return Promise.all(this[kClients$2].map(t=>t.destroy(A)))}[kDispatch$1](A,t){const r=this[kGetDispatcher$1]();return r?r.dispatch(A,t)||(r[kNeedDrain$1]=!0,this[kNeedDrain$1]=!this[kGetDispatcher$1]()):(this[kNeedDrain$1]=!0,this[kQueue].push({opts:A,handler:t}),this[kQueued]++),!this[kNeedDrain$1]}[kAddClient$1](A){return A.on("drain",this[kOnDrain$1]).on("connect",this[kOnConnect$1]).on("disconnect",this[kOnDisconnect$1]).on("connectionError",this[kOnConnectionError$1]),this[kClients$2].push(A),this[kNeedDrain$1]&&queueMicrotask(()=>{this[kNeedDrain$1]&&this[kOnDrain$1](A[kUrl$1],[this,A]);}),this}[kRemoveClient](A){A.close(()=>{const t=this[kClients$2].indexOf(A);t!==-1&&this[kClients$2].splice(t,1);}),this[kNeedDrain$1]=this[kClients$2].some(t=>!t[kNeedDrain$1]&&t.closed!==!0&&t.destroyed!==!0);}},Q(je,"PoolBase"),je);var poolBase={PoolBase:PoolBase$1,kClients:kClients$2,kNeedDrain:kNeedDrain$1,kAddClient:kAddClient$1,kRemoveClient,kGetDispatcher:kGetDispatcher$1};const{PoolBase,kClients:kClients$1,kNeedDrain,kAddClient,kGetDispatcher}=poolBase,Client$2=client,{InvalidArgumentError:InvalidArgumentError$d}=errors$1,util$e=util$m,{kUrl,kInterceptors:kInterceptors$2}=symbols$4,buildConnector$1=connect$2,kOptions$1=Symbol("options"),kConnections=Symbol("connections"),kFactory$1=Symbol("factory");function defaultFactory$2(e,A){return new Client$2(e,A)}Q(defaultFactory$2,"defaultFactory$2");let Pool$3=(ze=class extends PoolBase{constructor(A,{connections:t,factory:r=defaultFactory$2,connect:n,connectTimeout:o,tls:B,maxCachedSessions:l,socketPath:C,autoSelectFamily:f,autoSelectFamilyAttemptTimeout:c,allowH2:I,...y}={}){if(super(),t!=null&&(!Number.isFinite(t)||t<0))throw new InvalidArgumentError$d("invalid connections");if(typeof r!="function")throw new InvalidArgumentError$d("factory must be a function.");if(n!=null&&typeof n!="function"&&typeof n!="object")throw new InvalidArgumentError$d("connect must be a function or an object");typeof n!="function"&&(n=buildConnector$1({...B,maxCachedSessions:l,allowH2:I,socketPath:C,timeout:o,...util$e.nodeHasAutoSelectFamily&&f?{autoSelectFamily:f,autoSelectFamilyAttemptTimeout:c}:void 0,...n})),this[kInterceptors$2]=y.interceptors?.Pool&&Array.isArray(y.interceptors.Pool)?y.interceptors.Pool:[],this[kConnections]=t||null,this[kUrl]=util$e.parseOrigin(A),this[kOptions$1]={...util$e.deepClone(y),connect:n,allowH2:I},this[kOptions$1].interceptors=y.interceptors?{...y.interceptors}:void 0,this[kFactory$1]=r;}[kGetDispatcher](){for(const A of this[kClients$1])if(!A[kNeedDrain])return A;if(!this[kConnections]||this[kClients$1].length<this[kConnections]){const A=this[kFactory$1](this[kUrl],this[kOptions$1]);return this[kAddClient](A),A}}},Q(ze,"Pool"),ze);var pool=Pool$3;const{InvalidArgumentError:InvalidArgumentError$c}=errors$1,{kClients,kRunning,kClose:kClose$3,kDestroy:kDestroy$1,kDispatch,kInterceptors:kInterceptors$1}=symbols$4,DispatcherBase$1=dispatcherBase,Pool$2=pool,Client$1=client,util$d=util$m,createRedirectInterceptor=redirectInterceptor,kOnConnect=Symbol("onConnect"),kOnDisconnect=Symbol("onDisconnect"),kOnConnectionError=Symbol("onConnectionError"),kMaxRedirections=Symbol("maxRedirections"),kOnDrain=Symbol("onDrain"),kFactory=Symbol("factory"),kOptions=Symbol("options");function defaultFactory$1(e,A){return A&&A.connections===1?new Client$1(e,A):new Pool$2(e,A)}Q(defaultFactory$1,"defaultFactory$1");let Agent$3=(_e=class extends DispatcherBase$1{constructor({factory:A=defaultFactory$1,maxRedirections:t=0,connect:r,...n}={}){if(super(),typeof A!="function")throw new InvalidArgumentError$c("factory must be a function.");if(r!=null&&typeof r!="function"&&typeof r!="object")throw new InvalidArgumentError$c("connect must be a function or an object");if(!Number.isInteger(t)||t<0)throw new InvalidArgumentError$c("maxRedirections must be a positive number");r&&typeof r!="function"&&(r={...r}),this[kInterceptors$1]=n.interceptors?.Agent&&Array.isArray(n.interceptors.Agent)?n.interceptors.Agent:[createRedirectInterceptor({maxRedirections:t})],this[kOptions]={...util$d.deepClone(n),connect:r},this[kOptions].interceptors=n.interceptors?{...n.interceptors}:void 0,this[kMaxRedirections]=t,this[kFactory]=A,this[kClients]=new Map,this[kOnDrain]=(o,B)=>{this.emit("drain",o,[this,...B]);},this[kOnConnect]=(o,B)=>{this.emit("connect",o,[this,...B]);},this[kOnDisconnect]=(o,B,l)=>{this.emit("disconnect",o,[this,...B],l);},this[kOnConnectionError]=(o,B,l)=>{this.emit("connectionError",o,[this,...B],l);};}get[kRunning](){let A=0;for(const t of this[kClients].values())A+=t[kRunning];return A}[kDispatch](A,t){let r;if(A.origin&&(typeof A.origin=="string"||A.origin instanceof URL))r=String(A.origin);else throw new InvalidArgumentError$c("opts.origin must be a non-empty string or URL.");let n=this[kClients].get(r);return n||(n=this[kFactory](A.origin,this[kOptions]).on("drain",this[kOnDrain]).on("connect",this[kOnConnect]).on("disconnect",this[kOnDisconnect]).on("connectionError",this[kOnConnectionError]),this[kClients].set(r,n)),n.dispatch(A,t)}async[kClose$3](){const A=[];for(const t of this[kClients].values())A.push(t.close());this[kClients].clear(),await Promise.all(A);}async[kDestroy$1](A){const t=[];for(const r of this[kClients].values())t.push(r.destroy(A));this[kClients].clear(),await Promise.all(t);}},Q(_e,"Agent"),_e);var agent=Agent$3;const{kProxy,kClose:kClose$2,kDestroy,kInterceptors}=symbols$4,{URL:URL$1}=require$$1__default,Agent$2=agent,Pool$1=pool,DispatcherBase=dispatcherBase,{InvalidArgumentError:InvalidArgumentError$b,RequestAbortedError:RequestAbortedError$7,SecureProxyConnectionError}=errors$1,buildConnector=connect$2,kAgent=Symbol("proxy agent"),kClient=Symbol("proxy client"),kProxyHeaders=Symbol("proxy headers"),kRequestTls=Symbol("request tls settings"),kProxyTls=Symbol("proxy tls settings"),kConnectEndpoint=Symbol("connect endpoint function");function defaultProtocolPort(e){return e==="https:"?443:80}Q(defaultProtocolPort,"defaultProtocolPort");function defaultFactory(e,A){return new Pool$1(e,A)}Q(defaultFactory,"defaultFactory");let ProxyAgent$1=(At=class extends DispatcherBase{constructor(t){super();FA(this,gt);if(!t||typeof t=="object"&&!(t instanceof URL$1)&&!t.uri)throw new InvalidArgumentError$b("Proxy uri is mandatory");const{clientFactory:r=defaultFactory}=t;if(typeof r!="function")throw new InvalidArgumentError$b("Proxy opts.clientFactory must be a function.");const n=xA(this,gt,qt).call(this,t),{href:o,origin:B,port:l,protocol:C,username:f,password:c,hostname:I}=n;if(this[kProxy]={uri:o,protocol:C},this[kInterceptors]=t.interceptors?.ProxyAgent&&Array.isArray(t.interceptors.ProxyAgent)?t.interceptors.ProxyAgent:[],this[kRequestTls]=t.requestTls,this[kProxyTls]=t.proxyTls,this[kProxyHeaders]=t.headers||{},t.auth&&t.token)throw new InvalidArgumentError$b("opts.auth cannot be used in combination with opts.token");t.auth?this[kProxyHeaders]["proxy-authorization"]=`Basic ${t.auth}`:t.token?this[kProxyHeaders]["proxy-authorization"]=t.token:f&&c&&(this[kProxyHeaders]["proxy-authorization"]=`Basic ${Buffer.from(`${decodeURIComponent(f)}:${decodeURIComponent(c)}`).toString("base64")}`);const y=buildConnector({...t.proxyTls});this[kConnectEndpoint]=buildConnector({...t.requestTls}),this[kClient]=r(n,{connect:y}),this[kAgent]=new Agent$2({...t,connect:async(w,U)=>{let k=w.host;w.port||(k+=`:${defaultProtocolPort(w.protocol)}`);try{const{socket:F,statusCode:S}=await this[kClient].connect({origin:B,port:l,path:k,signal:w.signal,headers:{...this[kProxyHeaders],host:k},servername:this[kProxyTls]?.servername||I});if(S!==200&&(F.on("error",()=>{}).destroy(),U(new RequestAbortedError$7(`Proxy response (${S}) !== 200 when HTTP Tunneling`))),w.protocol!=="https:"){U(null,F);return}let M;this[kRequestTls]?M=this[kRequestTls].servername:M=w.servername,this[kConnectEndpoint]({...w,servername:M,httpSocket:F},U);}catch(F){F.code==="ERR_TLS_CERT_ALTNAME_INVALID"?U(new SecureProxyConnectionError(F)):U(F);}}});}dispatch(t,r){const{host:n}=new URL$1(t.origin),o=buildHeaders(t.headers);return throwIfProxyAuthIsSent(o),this[kAgent].dispatch({...t,headers:{...o,host:n}},r)}async[kClose$2](){await this[kAgent].close(),await this[kClient].close();}async[kDestroy](){await this[kAgent].destroy(),await this[kClient].destroy();}},gt=new WeakSet,qt=Q(function(t){return typeof t=="string"?new URL$1(t):t instanceof URL$1?t:new URL$1(t.uri)},"#getUrl"),Q(At,"ProxyAgent"),At);function buildHeaders(e){if(Array.isArray(e)){const A={};for(let t=0;t<e.length;t+=2)A[e[t]]=e[t+1];return A}return e}Q(buildHeaders,"buildHeaders");function throwIfProxyAuthIsSent(e){if(e&&Object.keys(e).find(t=>t.toLowerCase()==="proxy-authorization"))throw new InvalidArgumentError$b("Proxy-Authorization should be sent in ProxyAgent constructor")}Q(throwIfProxyAuthIsSent,"throwIfProxyAuthIsSent");var proxyAgent=ProxyAgent$1,api$1={},apiRequest={exports:{}};const assert$3=require$$0__default,{Readable:Readable$2}=Stream__default,{RequestAbortedError:RequestAbortedError$6,NotSupportedError,InvalidArgumentError:InvalidArgumentError$a,AbortError}=errors$1,util$c=util$m,{ReadableStreamFrom}=util$m,kConsume=Symbol("kConsume"),kReading=Symbol("kReading"),kBody=Symbol("kBody"),kAbort=Symbol("kAbort"),kContentType=Symbol("kContentType"),kContentLength$1=Symbol("kContentLength"),noop=Q(()=>{},"noop"),bt=class bt extends Readable$2{constructor({resume:A,abort:t,contentType:r="",contentLength:n,highWaterMark:o=64*1024}){super({autoDestroy:!0,read:A,highWaterMark:o}),this._readableState.dataEmitted=!1,this[kAbort]=t,this[kConsume]=null,this[kBody]=null,this[kContentType]=r,this[kContentLength$1]=n,this[kReading]=!1;}destroy(A){return !A&&!this._readableState.endEmitted&&(A=new RequestAbortedError$6),A&&this[kAbort](),super.destroy(A)}_destroy(A,t){queueMicrotask(()=>{t(A);});}on(A,...t){return (A==="data"||A==="readable")&&(this[kReading]=!0),super.on(A,...t)}addListener(A,...t){return this.on(A,...t)}off(A,...t){const r=super.off(A,...t);return (A==="data"||A==="readable")&&(this[kReading]=this.listenerCount("data")>0||this.listenerCount("readable")>0),r}removeListener(A,...t){return this.off(A,...t)}push(A){return this[kConsume]&&A!==null?(consumePush(this[kConsume],A),this[kReading]?super.push(A):!0):super.push(A)}async text(){return consume(this,"text")}async json(){return consume(this,"json")}async blob(){return consume(this,"blob")}async arrayBuffer(){return consume(this,"arrayBuffer")}async formData(){throw new NotSupportedError}get bodyUsed(){return util$c.isDisturbed(this)}get body(){return this[kBody]||(this[kBody]=ReadableStreamFrom(this),this[kConsume]&&(this[kBody].getReader(),assert$3(this[kBody].locked))),this[kBody]}async dump(A){let t=Number.isFinite(A?.limit)?A.limit:131072;const r=A?.signal;if(r!=null&&(typeof r!="object"||!("aborted"in r)))throw new InvalidArgumentError$a("signal must be an AbortSignal");return r?.throwIfAborted(),this._readableState.closeEmitted?null:await new Promise((n,o)=>{this[kContentLength$1]>t&&this.destroy(new AbortError);const B=Q(()=>{this.destroy(r.reason??new AbortError);},"onAbort");r?.addEventListener("abort",B),this.on("close",function(){r?.removeEventListener("abort",B),r?.aborted?o(r.reason??new AbortError):n(null);}).on("error",noop).on("data",function(l){t-=l.length,t<=0&&this.destroy();}).resume();})}};Q(bt,"BodyReadable");let BodyReadable=bt;function isLocked(e){return e[kBody]&&e[kBody].locked===!0||e[kConsume]}Q(isLocked,"isLocked");function isUnusable(e){return util$c.isDisturbed(e)||isLocked(e)}Q(isUnusable,"isUnusable");async function consume(e,A){return assert$3(!e[kConsume]),new Promise((t,r)=>{if(isUnusable(e)){const n=e._readableState;n.destroyed&&n.closeEmitted===!1?e.on("error",o=>{r(o);}).on("close",()=>{r(new TypeError("unusable"));}):r(n.errored??new TypeError("unusable"));}else queueMicrotask(()=>{e[kConsume]={type:A,stream:e,resolve:t,reject:r,length:0,body:[]},e.on("error",function(n){consumeFinish(this[kConsume],n);}).on("close",function(){this[kConsume].body!==null&&consumeFinish(this[kConsume],new RequestAbortedError$6);}),consumeStart(e[kConsume]);});})}Q(consume,"consume");function consumeStart(e){if(e.body===null)return;const{_readableState:A}=e.stream;if(A.bufferIndex){const t=A.bufferIndex,r=A.buffer.length;for(let n=t;n<r;n++)consumePush(e,A.buffer[n]);}else for(const t of A.buffer)consumePush(e,t);for(A.endEmitted?consumeEnd(this[kConsume]):e.stream.on("end",function(){consumeEnd(this[kConsume]);}),e.stream.resume();e.stream.read()!=null;);}Q(consumeStart,"consumeStart");function chunksDecode$1(e,A){if(e.length===0||A===0)return "";const t=e.length===1?e[0]:Buffer.concat(e,A),r=t.length,n=r>2&&t[0]===239&&t[1]===187&&t[2]===191?3:0;return t.utf8Slice(n,r)}Q(chunksDecode$1,"chunksDecode$1");function consumeEnd(e){const{type:A,body:t,resolve:r,stream:n,length:o}=e;try{if(A==="text")r(chunksDecode$1(t,o));else if(A==="json")r(JSON.parse(chunksDecode$1(t,o)));else if(A==="arrayBuffer"){const B=new Uint8Array(o);let l=0;for(const C of t)B.set(C,l),l+=C.byteLength;r(B.buffer);}else A==="blob"&&r(new Blob(t,{type:n[kContentType]}));consumeFinish(e);}catch(B){n.destroy(B);}}Q(consumeEnd,"consumeEnd");function consumePush(e,A){e.length+=A.length,e.body.push(A);}Q(consumePush,"consumePush");function consumeFinish(e,A){e.body!==null&&(A?e.reject(A):e.resolve(),e.type=null,e.stream=null,e.resolve=null,e.reject=null,e.length=0,e.body=null);}Q(consumeFinish,"consumeFinish");var readable={Readable:BodyReadable,chunksDecode:chunksDecode$1};const assert$2=require$$0__default,{ResponseStatusCodeError}=errors$1,{chunksDecode}=readable,CHUNK_LIMIT=128*1024;async function getResolveErrorBodyCallback$2({callback:e,body:A,contentType:t,statusCode:r,statusMessage:n,headers:o}){assert$2(A);let B=[],l=0;for await(const I of A)if(B.push(I),l+=I.length,l>CHUNK_LIMIT){B=null;break}const C=`Response status code ${r}${n?`: ${n}`:""}`;if(r===204||!t||!B){queueMicrotask(()=>e(new ResponseStatusCodeError(C,r,o)));return}const f=Error.stackTraceLimit;Error.stackTraceLimit=0;let c;try{isContentTypeApplicationJson(t)?c=JSON.parse(chunksDecode(B,l)):isContentTypeText(t)&&(c=chunksDecode(B,l));}catch{}finally{Error.stackTraceLimit=f;}queueMicrotask(()=>e(new ResponseStatusCodeError(C,r,o,c)));}Q(getResolveErrorBodyCallback$2,"getResolveErrorBodyCallback$2");const isContentTypeApplicationJson=Q(e=>e.length>15&&e[11]==="/"&&e[0]==="a"&&e[1]==="p"&&e[2]==="p"&&e[3]==="l"&&e[4]==="i"&&e[5]==="c"&&e[6]==="a"&&e[7]==="t"&&e[8]==="i"&&e[9]==="o"&&e[10]==="n"&&e[12]==="j"&&e[13]==="s"&&e[14]==="o"&&e[15]==="n","isContentTypeApplicationJson"),isContentTypeText=Q(e=>e.length>4&&e[4]==="/"&&e[0]==="t"&&e[1]==="e"&&e[2]==="x"&&e[3]==="t","isContentTypeText");var util$b={getResolveErrorBodyCallback:getResolveErrorBodyCallback$2,isContentTypeApplicationJson,isContentTypeText};const{addAbortListener}=util$m,{RequestAbortedError:RequestAbortedError$5}=errors$1,kListener=Symbol("kListener"),kSignal=Symbol("kSignal");function abort(e){e.abort?e.abort(e[kSignal]?.reason):e.onError(e[kSignal]?.reason??new RequestAbortedError$5);}Q(abort,"abort");function addSignal$5(e,A){if(e[kSignal]=null,e[kListener]=null,!!A){if(A.aborted){abort(e);return}e[kSignal]=A,e[kListener]=()=>{abort(e);},addAbortListener(e[kSignal],e[kListener]);}}Q(addSignal$5,"addSignal$5");function removeSignal$5(e){e[kSignal]&&("removeEventListener"in e[kSignal]?e[kSignal].removeEventListener("abort",e[kListener]):e[kSignal].removeListener("abort",e[kListener]),e[kSignal]=null,e[kListener]=null);}Q(removeSignal$5,"removeSignal$5");var abortSignal={addSignal:addSignal$5,removeSignal:removeSignal$5};const{Readable:Readable$1}=readable,{InvalidArgumentError:InvalidArgumentError$9,RequestAbortedError:RequestAbortedError$4}=errors$1,util$a=util$m,{getResolveErrorBodyCallback:getResolveErrorBodyCallback$1}=util$b,{AsyncResource:AsyncResource$4}=require$$4__default$2,{addSignal:addSignal$4,removeSignal:removeSignal$4}=abortSignal,St=class St extends AsyncResource$4{constructor(A,t){if(!A||typeof A!="object")throw new InvalidArgumentError$9("invalid opts");const{signal:r,method:n,opaque:o,body:B,onInfo:l,responseHeaders:C,throwOnError:f,highWaterMark:c}=A;try{if(typeof t!="function")throw new InvalidArgumentError$9("invalid callback");if(c&&(typeof c!="number"||c<0))throw new InvalidArgumentError$9("invalid highWaterMark");if(r&&typeof r.on!="function"&&typeof r.addEventListener!="function")throw new InvalidArgumentError$9("signal must be an EventEmitter or EventTarget");if(n==="CONNECT")throw new InvalidArgumentError$9("invalid method");if(l&&typeof l!="function")throw new InvalidArgumentError$9("invalid onInfo callback");super("UNDICI_REQUEST");}catch(I){throw util$a.isStream(B)&&util$a.destroy(B.on("error",util$a.nop),I),I}this.responseHeaders=C||null,this.opaque=o||null,this.callback=t,this.res=null,this.abort=null,this.body=B,this.trailers={},this.context=null,this.onInfo=l||null,this.throwOnError=f,this.highWaterMark=c,util$a.isStream(B)&&B.on("error",I=>{this.onError(I);}),addSignal$4(this,r);}onConnect(A,t){if(!this.callback)throw new RequestAbortedError$4;this.abort=A,this.context=t;}onHeaders(A,t,r,n){const{callback:o,opaque:B,abort:l,context:C,responseHeaders:f,highWaterMark:c}=this,I=f==="raw"?util$a.parseRawHeaders(t):util$a.parseHeaders(t);if(A<200){this.onInfo&&this.onInfo({statusCode:A,headers:I});return}const y=f==="raw"?util$a.parseHeaders(t):I,w=y["content-type"],U=y["content-length"],k=new Readable$1({resume:r,abort:l,contentType:w,contentLength:U,highWaterMark:c});this.callback=null,this.res=k,o!==null&&(this.throwOnError&&A>=400?this.runInAsyncScope(getResolveErrorBodyCallback$1,null,{callback:o,body:k,contentType:w,statusCode:A,statusMessage:n,headers:I}):this.runInAsyncScope(o,null,null,{statusCode:A,headers:I,trailers:this.trailers,opaque:B,body:k,context:C}));}onData(A){const{res:t}=this;return t.push(A)}onComplete(A){const{res:t}=this;removeSignal$4(this),util$a.parseHeaders(A,this.trailers),t.push(null);}onError(A){const{res:t,callback:r,body:n,opaque:o}=this;removeSignal$4(this),r&&(this.callback=null,queueMicrotask(()=>{this.runInAsyncScope(r,null,A,{opaque:o});})),t&&(this.res=null,queueMicrotask(()=>{util$a.destroy(t,A);})),n&&(this.body=null,util$a.destroy(n,A));}};Q(St,"RequestHandler");let RequestHandler=St;function request$1(e,A){if(A===void 0)return new Promise((t,r)=>{request$1.call(this,e,(n,o)=>n?r(n):t(o));});try{this.dispatch(e,new RequestHandler(e,A));}catch(t){if(typeof A!="function")throw t;const r=e?.opaque;queueMicrotask(()=>A(t,{opaque:r}));}}Q(request$1,"request$1"),apiRequest.exports=request$1,apiRequest.exports.RequestHandler=RequestHandler;var apiRequestExports=apiRequest.exports;const{finished,PassThrough:PassThrough$1}=Stream__default,{InvalidArgumentError:InvalidArgumentError$8,InvalidReturnValueError:InvalidReturnValueError$1,RequestAbortedError:RequestAbortedError$3}=errors$1,util$9=util$m,{getResolveErrorBodyCallback}=util$b,{AsyncResource:AsyncResource$3}=require$$4__default$2,{addSignal:addSignal$3,removeSignal:removeSignal$3}=abortSignal,mt=class mt extends AsyncResource$3{constructor(A,t,r){if(!A||typeof A!="object")throw new InvalidArgumentError$8("invalid opts");const{signal:n,method:o,opaque:B,body:l,onInfo:C,responseHeaders:f,throwOnError:c}=A;try{if(typeof r!="function")throw new InvalidArgumentError$8("invalid callback");if(typeof t!="function")throw new InvalidArgumentError$8("invalid factory");if(n&&typeof n.on!="function"&&typeof n.addEventListener!="function")throw new InvalidArgumentError$8("signal must be an EventEmitter or EventTarget");if(o==="CONNECT")throw new InvalidArgumentError$8("invalid method");if(C&&typeof C!="function")throw new InvalidArgumentError$8("invalid onInfo callback");super("UNDICI_STREAM");}catch(I){throw util$9.isStream(l)&&util$9.destroy(l.on("error",util$9.nop),I),I}this.responseHeaders=f||null,this.opaque=B||null,this.factory=t,this.callback=r,this.res=null,this.abort=null,this.context=null,this.trailers=null,this.body=l,this.onInfo=C||null,this.throwOnError=c||!1,util$9.isStream(l)&&l.on("error",I=>{this.onError(I);}),addSignal$3(this,n);}onConnect(A,t){if(!this.callback)throw new RequestAbortedError$3;this.abort=A,this.context=t;}onHeaders(A,t,r,n){const{factory:o,opaque:B,context:l,callback:C,responseHeaders:f}=this,c=f==="raw"?util$9.parseRawHeaders(t):util$9.parseHeaders(t);if(A<200){this.onInfo&&this.onInfo({statusCode:A,headers:c});return}this.factory=null;let I;if(this.throwOnError&&A>=400){const U=(f==="raw"?util$9.parseHeaders(t):c)["content-type"];I=new PassThrough$1,this.callback=null,this.runInAsyncScope(getResolveErrorBodyCallback,null,{callback:C,body:I,contentType:U,statusCode:A,statusMessage:n,headers:c});}else {if(o===null)return;if(I=this.runInAsyncScope(o,null,{statusCode:A,headers:c,opaque:B,context:l}),!I||typeof I.write!="function"||typeof I.end!="function"||typeof I.on!="function")throw new InvalidReturnValueError$1("expected Writable");finished(I,{readable:!1},w=>{const{callback:U,res:k,opaque:F,trailers:S,abort:M}=this;this.res=null,(w||!k.readable)&&util$9.destroy(k,w),this.callback=null,this.runInAsyncScope(U,null,w||null,{opaque:F,trailers:S}),w&&M();});}return I.on("drain",r),this.res=I,(I.writableNeedDrain!==void 0?I.writableNeedDrain:I._writableState?.needDrain)!==!0}onData(A){const{res:t}=this;return t?t.write(A):!0}onComplete(A){const{res:t}=this;removeSignal$3(this),t&&(this.trailers=util$9.parseHeaders(A),t.end());}onError(A){const{res:t,callback:r,opaque:n,body:o}=this;removeSignal$3(this),this.factory=null,t?(this.res=null,util$9.destroy(t,A)):r&&(this.callback=null,queueMicrotask(()=>{this.runInAsyncScope(r,null,A,{opaque:n});})),o&&(this.body=null,util$9.destroy(o,A));}};Q(mt,"StreamHandler");let StreamHandler=mt;function stream(e,A,t){if(t===void 0)return new Promise((r,n)=>{stream.call(this,e,A,(o,B)=>o?n(o):r(B));});try{this.dispatch(e,new StreamHandler(e,A,t));}catch(r){if(typeof t!="function")throw r;const n=e?.opaque;queueMicrotask(()=>t(r,{opaque:n}));}}Q(stream,"stream");var apiStream=stream;const{Readable,Duplex,PassThrough}=Stream__default,{InvalidArgumentError:InvalidArgumentError$7,InvalidReturnValueError,RequestAbortedError:RequestAbortedError$2}=errors$1,util$8=util$m,{AsyncResource:AsyncResource$2}=require$$4__default$2,{addSignal:addSignal$2,removeSignal:removeSignal$2}=abortSignal,assert$1=require$$0__default,kResume=Symbol("resume"),Ut=class Ut extends Readable{constructor(){super({autoDestroy:!0}),this[kResume]=null;}_read(){const{[kResume]:A}=this;A&&(this[kResume]=null,A());}_destroy(A,t){this._read(),t(A);}};Q(Ut,"PipelineRequest");let PipelineRequest=Ut;const Lt=class Lt extends Readable{constructor(A){super({autoDestroy:!0}),this[kResume]=A;}_read(){this[kResume]();}_destroy(A,t){!A&&!this._readableState.endEmitted&&(A=new RequestAbortedError$2),t(A);}};Q(Lt,"PipelineResponse");let PipelineResponse=Lt;const Mt=class Mt extends AsyncResource$2{constructor(A,t){if(!A||typeof A!="object")throw new InvalidArgumentError$7("invalid opts");if(typeof t!="function")throw new InvalidArgumentError$7("invalid handler");const{signal:r,method:n,opaque:o,onInfo:B,responseHeaders:l}=A;if(r&&typeof r.on!="function"&&typeof r.addEventListener!="function")throw new InvalidArgumentError$7("signal must be an EventEmitter or EventTarget");if(n==="CONNECT")throw new InvalidArgumentError$7("invalid method");if(B&&typeof B!="function")throw new InvalidArgumentError$7("invalid onInfo callback");super("UNDICI_PIPELINE"),this.opaque=o||null,this.responseHeaders=l||null,this.handler=t,this.abort=null,this.context=null,this.onInfo=B||null,this.req=new PipelineRequest().on("error",util$8.nop),this.ret=new Duplex({readableObjectMode:A.objectMode,autoDestroy:!0,read:()=>{const{body:C}=this;C?.resume&&C.resume();},write:(C,f,c)=>{const{req:I}=this;I.push(C,f)||I._readableState.destroyed?c():I[kResume]=c;},destroy:(C,f)=>{const{body:c,req:I,res:y,ret:w,abort:U}=this;!C&&!w._readableState.endEmitted&&(C=new RequestAbortedError$2),U&&C&&U(),util$8.destroy(c,C),util$8.destroy(I,C),util$8.destroy(y,C),removeSignal$2(this),f(C);}}).on("prefinish",()=>{const{req:C}=this;C.push(null);}),this.res=null,addSignal$2(this,r);}onConnect(A,t){const{ret:r,res:n}=this;if(assert$1(!n,"pipeline cannot be retried"),r.destroyed)throw new RequestAbortedError$2;this.abort=A,this.context=t;}onHeaders(A,t,r){const{opaque:n,handler:o,context:B}=this;if(A<200){if(this.onInfo){const C=this.responseHeaders==="raw"?util$8.parseRawHeaders(t):util$8.parseHeaders(t);this.onInfo({statusCode:A,headers:C});}return}this.res=new PipelineResponse(r);let l;try{this.handler=null;const C=this.responseHeaders==="raw"?util$8.parseRawHeaders(t):util$8.parseHeaders(t);l=this.runInAsyncScope(o,null,{statusCode:A,headers:C,opaque:n,body:this.res,context:B});}catch(C){throw this.res.on("error",util$8.nop),C}if(!l||typeof l.on!="function")throw new InvalidReturnValueError("expected Readable");l.on("data",C=>{const{ret:f,body:c}=this;!f.push(C)&&c.pause&&c.pause();}).on("error",C=>{const{ret:f}=this;util$8.destroy(f,C);}).on("end",()=>{const{ret:C}=this;C.push(null);}).on("close",()=>{const{ret:C}=this;C._readableState.ended||util$8.destroy(C,new RequestAbortedError$2);}),this.body=l;}onData(A){const{res:t}=this;return t.push(A)}onComplete(A){const{res:t}=this;t.push(null);}onError(A){const{ret:t}=this;this.handler=null,util$8.destroy(t,A);}};Q(Mt,"PipelineHandler");let PipelineHandler=Mt;function pipeline(e,A){try{const t=new PipelineHandler(e,A);return this.dispatch({...e,body:t.req},t),t.ret}catch(t){return new PassThrough().destroy(t)}}Q(pipeline,"pipeline");var apiPipeline=pipeline;const{InvalidArgumentError:InvalidArgumentError$6,RequestAbortedError:RequestAbortedError$1,SocketError:SocketError$1}=errors$1,{AsyncResource:AsyncResource$1}=require$$4__default$2,util$7=util$m,{addSignal:addSignal$1,removeSignal:removeSignal$1}=abortSignal,assert=require$$0__default,Yt=class Yt extends AsyncResource$1{constructor(A,t){if(!A||typeof A!="object")throw new InvalidArgumentError$6("invalid opts");if(typeof t!="function")throw new InvalidArgumentError$6("invalid callback");const{signal:r,opaque:n,responseHeaders:o}=A;if(r&&typeof r.on!="function"&&typeof r.addEventListener!="function")throw new InvalidArgumentError$6("signal must be an EventEmitter or EventTarget");super("UNDICI_UPGRADE"),this.responseHeaders=o||null,this.opaque=n||null,this.callback=t,this.abort=null,this.context=null,addSignal$1(this,r);}onConnect(A,t){if(!this.callback)throw new RequestAbortedError$1;this.abort=A,this.context=null;}onHeaders(){throw new SocketError$1("bad upgrade",null)}onUpgrade(A,t,r){const{callback:n,opaque:o,context:B}=this;assert.strictEqual(A,101),removeSignal$1(this),this.callback=null;const l=this.responseHeaders==="raw"?util$7.parseRawHeaders(t):util$7.parseHeaders(t);this.runInAsyncScope(n,null,null,{headers:l,socket:r,opaque:o,context:B});}onError(A){const{callback:t,opaque:r}=this;removeSignal$1(this),t&&(this.callback=null,queueMicrotask(()=>{this.runInAsyncScope(t,null,A,{opaque:r});}));}};Q(Yt,"UpgradeHandler");let UpgradeHandler=Yt;function upgrade(e,A){if(A===void 0)return new Promise((t,r)=>{upgrade.call(this,e,(n,o)=>n?r(n):t(o));});try{const t=new UpgradeHandler(e,A);this.dispatch({...e,method:e.method||"GET",upgrade:e.protocol||"Websocket"},t);}catch(t){if(typeof A!="function")throw t;const r=e?.opaque;queueMicrotask(()=>A(t,{opaque:r}));}}Q(upgrade,"upgrade");var apiUpgrade=upgrade;const{AsyncResource}=require$$4__default$2,{InvalidArgumentError:InvalidArgumentError$5,RequestAbortedError,SocketError}=errors$1,util$6=util$m,{addSignal,removeSignal}=abortSignal,Jt=class Jt extends AsyncResource{constructor(A,t){if(!A||typeof A!="object")throw new InvalidArgumentError$5("invalid opts");if(typeof t!="function")throw new InvalidArgumentError$5("invalid callback");const{signal:r,opaque:n,responseHeaders:o}=A;if(r&&typeof r.on!="function"&&typeof r.addEventListener!="function")throw new InvalidArgumentError$5("signal must be an EventEmitter or EventTarget");super("UNDICI_CONNECT"),this.opaque=n||null,this.responseHeaders=o||null,this.callback=t,this.abort=null,addSignal(this,r);}onConnect(A,t){if(!this.callback)throw new RequestAbortedError;this.abort=A,this.context=t;}onHeaders(){throw new SocketError("bad connect",null)}onUpgrade(A,t,r){const{callback:n,opaque:o,context:B}=this;removeSignal(this),this.callback=null;let l=t;l!=null&&(l=this.responseHeaders==="raw"?util$6.parseRawHeaders(t):util$6.parseHeaders(t)),this.runInAsyncScope(n,null,null,{statusCode:A,headers:l,socket:r,opaque:o,context:B});}onError(A){const{callback:t,opaque:r}=this;removeSignal(this),t&&(this.callback=null,queueMicrotask(()=>{this.runInAsyncScope(t,null,A,{opaque:r});}));}};Q(Jt,"ConnectHandler");let ConnectHandler=Jt;function connect(e,A){if(A===void 0)return new Promise((t,r)=>{connect.call(this,e,(n,o)=>n?r(n):t(o));});try{const t=new ConnectHandler(e,A);this.dispatch({...e,method:"CONNECT"},t);}catch(t){if(typeof A!="function")throw t;const r=e?.opaque;queueMicrotask(()=>A(t,{opaque:r}));}}Q(connect,"connect");var apiConnect=connect;api$1.request=apiRequestExports,api$1.stream=apiStream,api$1.pipeline=apiPipeline,api$1.upgrade=apiUpgrade,api$1.connect=apiConnect;const{UndiciError}=errors$1;let MockNotMatchedError$1=(ue=class extends UndiciError{constructor(A){super(A),Error.captureStackTrace(this,ue),this.name="MockNotMatchedError",this.message=A||"The request does not match any registered mock dispatches",this.code="UND_MOCK_ERR_MOCK_NOT_MATCHED";}},Q(ue,"MockNotMatchedError"),ue);var mockErrors={MockNotMatchedError:MockNotMatchedError$1},mockSymbols={kAgent:Symbol("agent"),kOptions:Symbol("options"),kFactory:Symbol("factory"),kDispatches:Symbol("dispatches"),kDispatchKey:Symbol("dispatch key"),kDefaultHeaders:Symbol("default headers"),kDefaultTrailers:Symbol("default trailers"),kContentLength:Symbol("content length"),kMockAgent:Symbol("mock agent"),kMockAgentSet:Symbol("mock agent set"),kMockAgentGet:Symbol("mock agent get"),kMockDispatch:Symbol("mock dispatch"),kClose:Symbol("close"),kOriginalClose:Symbol("original agent close"),kOrigin:Symbol("origin"),kIsMockActive:Symbol("is mock active"),kNetConnect:Symbol("net connect"),kGetNetConnect:Symbol("get net connect"),kConnected:Symbol("connected")};const{MockNotMatchedError}=mockErrors,{kDispatches:kDispatches$3,kMockAgent:kMockAgent$2,kOriginalDispatch:kOriginalDispatch$2,kOrigin:kOrigin$2,kGetNetConnect}=mockSymbols,{buildURL:buildURL$1,nop}=util$m,{STATUS_CODES}=http__default,{types:{isPromise}}=require$$0__default$1;function matchValue(e,A){return typeof e=="string"?e===A:e instanceof RegExp?e.test(A):typeof e=="function"?e(A)===!0:!1}Q(matchValue,"matchValue");function lowerCaseEntries(e){return Object.fromEntries(Object.entries(e).map(([A,t])=>[A.toLocaleLowerCase(),t]))}Q(lowerCaseEntries,"lowerCaseEntries");function getHeaderByName(e,A){if(Array.isArray(e)){for(let t=0;t<e.length;t+=2)if(e[t].toLocaleLowerCase()===A.toLocaleLowerCase())return e[t+1];return}else return typeof e.get=="function"?e.get(A):lowerCaseEntries(e)[A.toLocaleLowerCase()]}Q(getHeaderByName,"getHeaderByName");function buildHeadersFromArray(e){const A=e.slice(),t=[];for(let r=0;r<A.length;r+=2)t.push([A[r],A[r+1]]);return Object.fromEntries(t)}Q(buildHeadersFromArray,"buildHeadersFromArray");function matchHeaders(e,A){if(typeof e.headers=="function")return Array.isArray(A)&&(A=buildHeadersFromArray(A)),e.headers(A?lowerCaseEntries(A):{});if(typeof e.headers>"u")return !0;if(typeof A!="object"||typeof e.headers!="object")return !1;for(const[t,r]of Object.entries(e.headers)){const n=getHeaderByName(A,t);if(!matchValue(r,n))return !1}return !0}Q(matchHeaders,"matchHeaders");function safeUrl(e){if(typeof e!="string")return e;const A=e.split("?");if(A.length!==2)return e;const t=new URLSearchParams(A.pop());return t.sort(),[...A,t.toString()].join("?")}Q(safeUrl,"safeUrl");function matchKey(e,{path:A,method:t,body:r,headers:n}){const o=matchValue(e.path,A),B=matchValue(e.method,t),l=typeof e.body<"u"?matchValue(e.body,r):!0,C=matchHeaders(e,n);return o&&B&&l&&C}Q(matchKey,"matchKey");function getResponseData$1(e){return Buffer.isBuffer(e)?e:typeof e=="object"?JSON.stringify(e):e.toString()}Q(getResponseData$1,"getResponseData$1");function getMockDispatch(e,A){const t=A.query?buildURL$1(A.path,A.query):A.path,r=typeof t=="string"?safeUrl(t):t;let n=e.filter(({consumed:o})=>!o).filter(({path:o})=>matchValue(safeUrl(o),r));if(n.length===0)throw new MockNotMatchedError(`Mock dispatch not matched for path '${r}'`);if(n=n.filter(({method:o})=>matchValue(o,A.method)),n.length===0)throw new MockNotMatchedError(`Mock dispatch not matched for method '${A.method}' on path '${r}'`);if(n=n.filter(({body:o})=>typeof o<"u"?matchValue(o,A.body):!0),n.length===0)throw new MockNotMatchedError(`Mock dispatch not matched for body '${A.body}' on path '${r}'`);if(n=n.filter(o=>matchHeaders(o,A.headers)),n.length===0){const o=typeof A.headers=="object"?JSON.stringify(A.headers):A.headers;throw new MockNotMatchedError(`Mock dispatch not matched for headers '${o}' on path '${r}'`)}return n[0]}Q(getMockDispatch,"getMockDispatch");function addMockDispatch$1(e,A,t){const r={timesInvoked:0,times:1,persist:!1,consumed:!1},n=typeof t=="function"?{callback:t}:{...t},o={...r,...A,pending:!0,data:{error:null,...n}};return e.push(o),o}Q(addMockDispatch$1,"addMockDispatch$1");function deleteMockDispatch(e,A){const t=e.findIndex(r=>r.consumed?matchKey(r,A):!1);t!==-1&&e.splice(t,1);}Q(deleteMockDispatch,"deleteMockDispatch");function buildKey$1(e){const{path:A,method:t,body:r,headers:n,query:o}=e;return {path:A,method:t,body:r,headers:n,query:o}}Q(buildKey$1,"buildKey$1");function generateKeyValues(e){const A=Object.keys(e),t=[];for(let r=0;r<A.length;++r){const n=A[r],o=e[n],B=Buffer.from(`${n}`);if(Array.isArray(o))for(let l=0;l<o.length;++l)t.push(B,Buffer.from(`${o[l]}`));else t.push(B,Buffer.from(`${o}`));}return t}Q(generateKeyValues,"generateKeyValues");function getStatusText(e){return STATUS_CODES[e]||"unknown"}Q(getStatusText,"getStatusText");async function getResponse(e){const A=[];for await(const t of e)A.push(t);return Buffer.concat(A).toString("utf8")}Q(getResponse,"getResponse");function mockDispatch(e,A){const t=buildKey$1(e),r=getMockDispatch(this[kDispatches$3],t);r.timesInvoked++,r.data.callback&&(r.data={...r.data,...r.data.callback(e)});const{data:{statusCode:n,data:o,headers:B,trailers:l,error:C},delay:f,persist:c}=r,{timesInvoked:I,times:y}=r;if(r.consumed=!c&&I>=y,r.pending=I<y,C!==null)return deleteMockDispatch(this[kDispatches$3],t),A.onError(C),!0;typeof f=="number"&&f>0?setTimeout(()=>{w(this[kDispatches$3]);},f):w(this[kDispatches$3]);function w(k,F=o){const S=Array.isArray(e.headers)?buildHeadersFromArray(e.headers):e.headers,M=typeof F=="function"?F({...e,headers:S}):F;if(isPromise(M)){M.then(R=>w(k,R));return}const p=getResponseData$1(M),V=generateKeyValues(B),Y=generateKeyValues(l);A.abort=nop,A.onHeaders(n,V,U,getStatusText(n)),A.onData(Buffer.from(p)),A.onComplete(Y),deleteMockDispatch(k,t);}Q(w,"handleReply");function U(){}return Q(U,"resume"),!0}Q(mockDispatch,"mockDispatch");function buildMockDispatch$2(){const e=this[kMockAgent$2],A=this[kOrigin$2],t=this[kOriginalDispatch$2];return Q(function(n,o){if(e.isMockActive)try{mockDispatch.call(this,n,o);}catch(B){if(B instanceof MockNotMatchedError){const l=e[kGetNetConnect]();if(l===!1)throw new MockNotMatchedError(`${B.message}: subsequent request to origin ${A} was not allowed (net.connect disabled)`);if(checkNetConnect(l,A))t.call(this,n,o);else throw new MockNotMatchedError(`${B.message}: subsequent request to origin ${A} was not allowed (net.connect is not enabled for this origin)`)}else throw B}else t.call(this,n,o);},"dispatch")}Q(buildMockDispatch$2,"buildMockDispatch$2");function checkNetConnect(e,A){const t=new URL(A);return e===!0?!0:!!(Array.isArray(e)&&e.some(r=>matchValue(r,t.host)))}Q(checkNetConnect,"checkNetConnect");function buildMockOptions(e){if(e){const{agent:A,...t}=e;return t}}Q(buildMockOptions,"buildMockOptions");var mockUtils={getResponseData:getResponseData$1,getMockDispatch,addMockDispatch:addMockDispatch$1,deleteMockDispatch,buildKey:buildKey$1,generateKeyValues,matchValue,getResponse,getStatusText,mockDispatch,buildMockDispatch:buildMockDispatch$2,checkNetConnect,buildMockOptions,getHeaderByName,buildHeadersFromArray},mockInterceptor={};const{getResponseData,buildKey,addMockDispatch}=mockUtils,{kDispatches:kDispatches$2,kDispatchKey,kDefaultHeaders,kDefaultTrailers,kContentLength,kMockDispatch}=mockSymbols,{InvalidArgumentError:InvalidArgumentError$4}=errors$1,{buildURL}=util$m,Gt=class Gt{constructor(A){this[kMockDispatch]=A;}delay(A){if(typeof A!="number"||!Number.isInteger(A)||A<=0)throw new InvalidArgumentError$4("waitInMs must be a valid integer > 0");return this[kMockDispatch].delay=A,this}persist(){return this[kMockDispatch].persist=!0,this}times(A){if(typeof A!="number"||!Number.isInteger(A)||A<=0)throw new InvalidArgumentError$4("repeatTimes must be a valid integer > 0");return this[kMockDispatch].times=A,this}};Q(Gt,"MockScope");let MockScope=Gt,MockInterceptor$2=(et=class{constructor(A,t){if(typeof A!="object")throw new InvalidArgumentError$4("opts must be an object");if(typeof A.path>"u")throw new InvalidArgumentError$4("opts.path must be defined");if(typeof A.method>"u"&&(A.method="GET"),typeof A.path=="string")if(A.query)A.path=buildURL(A.path,A.query);else {const r=new URL(A.path,"data://");A.path=r.pathname+r.search;}typeof A.method=="string"&&(A.method=A.method.toUpperCase()),this[kDispatchKey]=buildKey(A),this[kDispatches$2]=t,this[kDefaultHeaders]={},this[kDefaultTrailers]={},this[kContentLength]=!1;}createMockScopeDispatchData(A,t,r={}){const n=getResponseData(t),o=this[kContentLength]?{"content-length":n.length}:{},B={...this[kDefaultHeaders],...o,...r.headers},l={...this[kDefaultTrailers],...r.trailers};return {statusCode:A,data:t,headers:B,trailers:l}}validateReplyParameters(A,t,r){if(typeof A>"u")throw new InvalidArgumentError$4("statusCode must be defined");if(typeof t>"u")throw new InvalidArgumentError$4("data must be defined");if(typeof r!="object"||r===null)throw new InvalidArgumentError$4("responseOptions must be an object")}reply(A){if(typeof A=="function"){const l=Q(f=>{const c=A(f);if(typeof c!="object")throw new InvalidArgumentError$4("reply options callback must return an object");const{statusCode:I,data:y="",responseOptions:w={}}=c;return this.validateReplyParameters(I,y,w),{...this.createMockScopeDispatchData(I,y,w)}},"wrappedDefaultsCallback"),C=addMockDispatch(this[kDispatches$2],this[kDispatchKey],l);return new MockScope(C)}const[t,r="",n={}]=[...arguments];this.validateReplyParameters(t,r,n);const o=this.createMockScopeDispatchData(t,r,n),B=addMockDispatch(this[kDispatches$2],this[kDispatchKey],o);return new MockScope(B)}replyWithError(A){if(typeof A>"u")throw new InvalidArgumentError$4("error must be defined");const t=addMockDispatch(this[kDispatches$2],this[kDispatchKey],{error:A});return new MockScope(t)}defaultReplyHeaders(A){if(typeof A>"u")throw new InvalidArgumentError$4("headers must be defined");return this[kDefaultHeaders]=A,this}defaultReplyTrailers(A){if(typeof A>"u")throw new InvalidArgumentError$4("trailers must be defined");return this[kDefaultTrailers]=A,this}replyContentLength(){return this[kContentLength]=!0,this}},Q(et,"MockInterceptor"),et);mockInterceptor.MockInterceptor=MockInterceptor$2,mockInterceptor.MockScope=MockScope;const{promisify:promisify$1}=require$$0__default$1,Client=client,{buildMockDispatch:buildMockDispatch$1}=mockUtils,{kDispatches:kDispatches$1,kMockAgent:kMockAgent$1,kClose:kClose$1,kOriginalClose:kOriginalClose$1,kOrigin:kOrigin$1,kOriginalDispatch:kOriginalDispatch$1,kConnected:kConnected$1}=mockSymbols,{MockInterceptor:MockInterceptor$1}=mockInterceptor,Symbols$1=symbols$4,{InvalidArgumentError:InvalidArgumentError$3}=errors$1,Tt=class Tt extends Client{constructor(A,t){if(super(A,t),!t||!t.agent||typeof t.agent.dispatch!="function")throw new InvalidArgumentError$3("Argument opts.agent must implement Agent");this[kMockAgent$1]=t.agent,this[kOrigin$1]=A,this[kDispatches$1]=[],this[kConnected$1]=1,this[kOriginalDispatch$1]=this.dispatch,this[kOriginalClose$1]=this.close.bind(this),this.dispatch=buildMockDispatch$1.call(this),this.close=this[kClose$1];}get[Symbols$1.kConnected](){return this[kConnected$1]}intercept(A){return new MockInterceptor$1(A,this[kDispatches$1])}async[kClose$1](){await promisify$1(this[kOriginalClose$1])(),this[kConnected$1]=0,this[kMockAgent$1][Symbols$1.kClients].delete(this[kOrigin$1]);}};Q(Tt,"MockClient");const{promisify}=require$$0__default$1,Pool=pool,{buildMockDispatch}=mockUtils,{kDispatches,kMockAgent,kClose,kOriginalClose,kOrigin,kOriginalDispatch,kConnected}=mockSymbols,{MockInterceptor}=mockInterceptor,Symbols=symbols$4,{InvalidArgumentError:InvalidArgumentError$2}=errors$1,Ht=class Ht extends Pool{constructor(A,t){if(super(A,t),!t||!t.agent||typeof t.agent.dispatch!="function")throw new InvalidArgumentError$2("Argument opts.agent must implement Agent");this[kMockAgent]=t.agent,this[kOrigin]=A,this[kDispatches]=[],this[kConnected]=1,this[kOriginalDispatch]=this.dispatch,this[kOriginalClose]=this.close.bind(this),this.dispatch=buildMockDispatch.call(this),this.close=this[kClose];}get[Symbols.kConnected](){return this[kConnected]}intercept(A){return new MockInterceptor(A,this[kDispatches])}async[kClose](){await promisify(this[kOriginalClose])(),this[kConnected]=0,this[kMockAgent][Symbols.kClients].delete(this[kOrigin]);}};Q(Ht,"MockPool");const globalDispatcher=Symbol.for("undici.globalDispatcher.1"),{InvalidArgumentError:InvalidArgumentError$1}=errors$1,Agent$1=agent;getGlobalDispatcher$1()===void 0&&setGlobalDispatcher$1(new Agent$1);function setGlobalDispatcher$1(e){if(!e||typeof e.dispatch!="function")throw new InvalidArgumentError$1("Argument agent must implement Agent");Object.defineProperty(globalThis,globalDispatcher,{value:e,writable:!0,enumerable:!1,configurable:!1});}Q(setGlobalDispatcher$1,"setGlobalDispatcher$1");function getGlobalDispatcher$1(){return globalThis[globalDispatcher]}Q(getGlobalDispatcher$1,"getGlobalDispatcher$1");var global={setGlobalDispatcher:setGlobalDispatcher$1,getGlobalDispatcher:getGlobalDispatcher$1},headers,hasRequiredHeaders;function requireHeaders(){if(hasRequiredHeaders)return headers;hasRequiredHeaders=1;const{kHeadersList:e,kConstruct:A}=symbols$4,{kGuard:t}=requireSymbols$3(),{kEnumerableProperty:r}=util$m,{iteratorMixin:n,isValidHeaderName:o,isValidHeaderValue:B}=requireUtil$5(),{webidl:l}=requireWebidl(),C=require$$0__default,f=require$$6__default$1,c=Symbol("headers map"),I=Symbol("headers map sorted");function y(Y){return Y===10||Y===13||Y===9||Y===32}Q(y,"isHTTPWhiteSpaceCharCode");function w(Y){let R=0,m=Y.length;for(;m>R&&y(Y.charCodeAt(m-1));)--m;for(;m>R&&y(Y.charCodeAt(R));)++R;return R===0&&m===Y.length?Y:Y.substring(R,m)}Q(w,"headerValueNormalize");function U(Y,R){if(Array.isArray(R))for(let m=0;m<R.length;++m){const _=R[m];if(_.length!==2)throw l.errors.exception({header:"Headers constructor",message:`expected name/value pair to be length 2, found ${_.length}.`});k(Y,_[0],_[1]);}else if(typeof R=="object"&&R!==null){const m=Object.keys(R);for(let _=0;_<m.length;++_)k(Y,m[_],R[m[_]]);}else throw l.errors.conversionFailed({prefix:"Headers constructor",argument:"Argument 1",types:["sequence<sequence<ByteString>>","record<ByteString, ByteString>"]})}Q(U,"fill");function k(Y,R,m){if(m=w(m),o(R)){if(!B(m))throw l.errors.invalidArgument({prefix:"Headers.append",value:m,type:"header value"})}else throw l.errors.invalidArgument({prefix:"Headers.append",value:R,type:"header name"});if(Y[t]==="immutable")throw new TypeError("immutable");return Y[t],Y[e].append(R,m,!1)}Q(k,"appendHeader");function F(Y,R){return Y[0]<R[0]?-1:1}Q(F,"compareHeaderName");const p=class p{constructor(R){ZA(this,"cookies",null);R instanceof p?(this[c]=new Map(R[c]),this[I]=R[I],this.cookies=R.cookies===null?null:[...R.cookies]):(this[c]=new Map(R),this[I]=null);}contains(R,m){return this[c].has(m?R:R.toLowerCase())}clear(){this[c].clear(),this[I]=null,this.cookies=null;}append(R,m,_){this[I]=null;const D=_?R:R.toLowerCase(),b=this[c].get(D);if(b){const W=D==="cookie"?"; ":", ";this[c].set(D,{name:b.name,value:`${b.value}${W}${m}`});}else this[c].set(D,{name:R,value:m});D==="set-cookie"&&(this.cookies??(this.cookies=[])).push(m);}set(R,m,_){this[I]=null;const D=_?R:R.toLowerCase();D==="set-cookie"&&(this.cookies=[m]),this[c].set(D,{name:R,value:m});}delete(R,m){this[I]=null,m||(R=R.toLowerCase()),R==="set-cookie"&&(this.cookies=null),this[c].delete(R);}get(R,m){return this[c].get(m?R:R.toLowerCase())?.value??null}*[Symbol.iterator](){for(const{0:R,1:{value:m}}of this[c])yield [R,m];}get entries(){const R={};if(this[c].size)for(const{name:m,value:_}of this[c].values())R[m]=_;return R}toSortedArray(){const R=this[c].size,m=new Array(R);if(R<=32){if(R===0)return m;const _=this[c][Symbol.iterator](),D=_.next().value;m[0]=[D[0],D[1].value],C(D[1].value!==null);for(let b=1,W=0,J=0,N=0,v=0,Z,X;b<R;++b){for(X=_.next().value,Z=m[b]=[X[0],X[1].value],C(Z[1]!==null),N=0,J=b;N<J;)v=N+(J-N>>1),m[v][0]<=Z[0]?N=v+1:J=v;if(b!==v){for(W=b;W>N;)m[W]=m[--W];m[N]=Z;}}if(!_.next().done)throw new TypeError("Unreachable");return m}else {let _=0;for(const{0:D,1:{value:b}}of this[c])m[_++]=[D,b],C(b!==null);return m.sort(F)}}};Q(p,"HeadersList");let S=p;const V=class V{constructor(R=void 0){R!==A&&(this[e]=new S,this[t]="none",R!==void 0&&(R=l.converters.HeadersInit(R),U(this,R)));}append(R,m){return l.brandCheck(this,V),l.argumentLengthCheck(arguments,2,{header:"Headers.append"}),R=l.converters.ByteString(R),m=l.converters.ByteString(m),k(this,R,m)}delete(R){if(l.brandCheck(this,V),l.argumentLengthCheck(arguments,1,{header:"Headers.delete"}),R=l.converters.ByteString(R),!o(R))throw l.errors.invalidArgument({prefix:"Headers.delete",value:R,type:"header name"});if(this[t]==="immutable")throw new TypeError("immutable");this[t],this[e].contains(R,!1)&&this[e].delete(R,!1);}get(R){if(l.brandCheck(this,V),l.argumentLengthCheck(arguments,1,{header:"Headers.get"}),R=l.converters.ByteString(R),!o(R))throw l.errors.invalidArgument({prefix:"Headers.get",value:R,type:"header name"});return this[e].get(R,!1)}has(R){if(l.brandCheck(this,V),l.argumentLengthCheck(arguments,1,{header:"Headers.has"}),R=l.converters.ByteString(R),!o(R))throw l.errors.invalidArgument({prefix:"Headers.has",value:R,type:"header name"});return this[e].contains(R,!1)}set(R,m){if(l.brandCheck(this,V),l.argumentLengthCheck(arguments,2,{header:"Headers.set"}),R=l.converters.ByteString(R),m=l.converters.ByteString(m),m=w(m),o(R)){if(!B(m))throw l.errors.invalidArgument({prefix:"Headers.set",value:m,type:"header value"})}else throw l.errors.invalidArgument({prefix:"Headers.set",value:R,type:"header name"});if(this[t]==="immutable")throw new TypeError("immutable");this[t],this[e].set(R,m,!1);}getSetCookie(){l.brandCheck(this,V);const R=this[e].cookies;return R?[...R]:[]}get[I](){if(this[e][I])return this[e][I];const R=[],m=this[e].toSortedArray(),_=this[e].cookies;if(_===null||_.length===1)return this[e][I]=m;for(let D=0;D<m.length;++D){const{0:b,1:W}=m[D];if(b==="set-cookie")for(let J=0;J<_.length;++J)R.push([b,_[J]]);else R.push([b,W]);}return this[e][I]=R}[f.inspect.custom](R,m){return m.depth??(m.depth=R),`Headers ${f.formatWithOptions(m,this[e].entries)}`}};Q(V,"Headers");let M=V;return Object.defineProperty(M.prototype,f.inspect.custom,{enumerable:!1}),n("Headers",M,I,0,1),Object.defineProperties(M.prototype,{append:r,delete:r,get:r,has:r,set:r,getSetCookie:r,[Symbol.toStringTag]:{value:"Headers",configurable:!0}}),l.converters.HeadersInit=function(Y){if(l.util.Type(Y)==="Object"){const R=Reflect.get(Y,Symbol.iterator);return typeof R=="function"?l.converters["sequence<sequence<ByteString>>"](Y,R.bind(Y)):l.converters["record<ByteString, ByteString>"](Y)}throw l.errors.conversionFailed({prefix:"Headers constructor",argument:"Argument 1",types:["sequence<sequence<ByteString>>","record<ByteString, ByteString>"]})},headers={fill:U,compareHeaderName:F,Headers:M,HeadersList:S},headers}Q(requireHeaders,"requireHeaders");var response,hasRequiredResponse;function requireResponse(){if(hasRequiredResponse)return response;hasRequiredResponse=1;const{Headers:e,HeadersList:A,fill:t}=requireHeaders(),{extractBody:r,cloneBody:n,mixinBody:o}=requireBody(),B=util$m,l=require$$0__default$1,{kEnumerableProperty:C}=B,{isValidReasonPhrase:f,isCancelled:c,isAborted:I,isBlobLike:y,serializeJavascriptValueToJSONString:w,isErrorLike:U,isomorphicEncode:k}=requireUtil$5(),{redirectStatusSet:F,nullBodyStatus:S}=requireConstants$2(),{kState:M,kHeaders:p,kGuard:V,kRealm:Y}=requireSymbols$3(),{webidl:R}=requireWebidl(),{FormData:m}=requireFormdata(),{getGlobalOrigin:_}=requireGlobal(),{URLSerializer:D}=requireDataUrl(),{kHeadersList:b,kConstruct:W}=symbols$4,J=require$$0__default,{types:N}=require$$0__default$1,v=new TextEncoder("utf-8"),QA=class QA{static error(){const AA={settingsObject:{}};return rA(gA(),"immutable",AA)}static json(AA,oA={}){R.argumentLengthCheck(arguments,1,{header:"Response.json"}),oA!==null&&(oA=R.converters.ResponseInit(oA));const hA=v.encode(w(AA)),fA=r(hA),RA={settingsObject:{}},kA=rA(K({}),"response",RA);return bA(kA,oA,{body:fA[0],type:"application/json"}),kA}static redirect(AA,oA=302){const hA={settingsObject:{}};R.argumentLengthCheck(arguments,1,{header:"Response.redirect"}),AA=R.converters.USVString(AA),oA=R.converters["unsigned short"](oA);let fA;try{fA=new URL(AA,_());}catch(lA){throw new TypeError(`Failed to parse URL from ${AA}`,{cause:lA})}if(!F.has(oA))throw new RangeError(`Invalid status code ${oA}`);const RA=rA(K({}),"immutable",hA);RA[M].status=oA;const kA=k(D(fA));return RA[M].headersList.append("location",kA,!0),RA}constructor(AA=null,oA={}){if(AA===W)return;AA!==null&&(AA=R.converters.BodyInit(AA)),oA=R.converters.ResponseInit(oA),this[Y]={settingsObject:{}},this[M]=K({}),this[p]=new e(W),this[p][V]="response",this[p][b]=this[M].headersList,this[p][Y]=this[Y];let hA=null;if(AA!=null){const[fA,RA]=r(AA);hA={body:fA,type:RA};}bA(this,oA,hA);}get type(){return R.brandCheck(this,QA),this[M].type}get url(){R.brandCheck(this,QA);const AA=this[M].urlList,oA=AA[AA.length-1]??null;return oA===null?"":D(oA,!0)}get redirected(){return R.brandCheck(this,QA),this[M].urlList.length>1}get status(){return R.brandCheck(this,QA),this[M].status}get ok(){return R.brandCheck(this,QA),this[M].status>=200&&this[M].status<=299}get statusText(){return R.brandCheck(this,QA),this[M].statusText}get headers(){return R.brandCheck(this,QA),this[p]}get body(){return R.brandCheck(this,QA),this[M].body?this[M].body.stream:null}get bodyUsed(){return R.brandCheck(this,QA),!!this[M].body&&B.isDisturbed(this[M].body.stream)}clone(){if(R.brandCheck(this,QA),this.bodyUsed||this.body?.locked)throw R.errors.exception({header:"Response.clone",message:"Body has already been consumed."});const AA=X(this[M]);return rA(AA,this[p][V],this[Y])}[l.inspect.custom](AA,oA){oA.depth===null&&(oA.depth=2),oA.colors??(oA.colors=!0);const hA={status:this.status,statusText:this.statusText,headers:this.headers,body:this.body,bodyUsed:this.bodyUsed,ok:this.ok,redirected:this.redirected,type:this.type,url:this.url};return `Response ${l.formatWithOptions(oA,hA)}`}};Q(QA,"Response");let Z=QA;o(Z),Object.defineProperties(Z.prototype,{type:C,url:C,status:C,ok:C,redirected:C,statusText:C,headers:C,clone:C,body:C,bodyUsed:C,[Symbol.toStringTag]:{value:"Response",configurable:!0}}),Object.defineProperties(Z,{json:C,redirect:C,error:C});function X($){if($.internalResponse)return sA(X($.internalResponse),$.type);const AA=K({...$,body:null});return $.body!=null&&(AA.body=n($.body)),AA}Q(X,"cloneResponse");function K($){return {aborted:!1,rangeRequested:!1,timingAllowPassed:!1,requestIncludesCredentials:!1,type:"default",status:200,timingInfo:null,cacheState:"",statusText:"",...$,headersList:$?.headersList?new A($?.headersList):new A,urlList:$?.urlList?[...$.urlList]:[]}}Q(K,"makeResponse");function gA($){const AA=U($);return K({type:"error",status:0,error:AA?$:new Error($&&String($)),aborted:$&&$.name==="AbortError"})}Q(gA,"makeNetworkError");function tA($){return $.type==="error"&&$.status===0}Q(tA,"isNetworkError");function cA($,AA){return AA={internalResponse:$,...AA},new Proxy($,{get(oA,hA){return hA in AA?AA[hA]:oA[hA]},set(oA,hA,fA){return J(!(hA in AA)),oA[hA]=fA,!0}})}Q(cA,"makeFilteredResponse");function sA($,AA){if(AA==="basic")return cA($,{type:"basic",headersList:$.headersList});if(AA==="cors")return cA($,{type:"cors",headersList:$.headersList});if(AA==="opaque")return cA($,{type:"opaque",urlList:Object.freeze([]),status:0,statusText:"",body:null});if(AA==="opaqueredirect")return cA($,{type:"opaqueredirect",status:0,statusText:"",headersList:[],body:null});J(!1);}Q(sA,"filterResponse");function aA($,AA=null){return J(c($)),I($)?gA(Object.assign(new DOMException("The operation was aborted.","AbortError"),{cause:AA})):gA(Object.assign(new DOMException("Request was cancelled."),{cause:AA}))}Q(aA,"makeAppropriateNetworkError");function bA($,AA,oA){if(AA.status!==null&&(AA.status<200||AA.status>599))throw new RangeError('init["status"] must be in the range of 200 to 599, inclusive.');if("statusText"in AA&&AA.statusText!=null&&!f(String(AA.statusText)))throw new TypeError("Invalid statusText");if("status"in AA&&AA.status!=null&&($[M].status=AA.status),"statusText"in AA&&AA.statusText!=null&&($[M].statusText=AA.statusText),"headers"in AA&&AA.headers!=null&&t($[p],AA.headers),oA){if(S.includes($.status))throw R.errors.exception({header:"Response constructor",message:`Invalid response status code ${$.status}`});$[M].body=oA.body,oA.type!=null&&!$[M].headersList.contains("content-type",!0)&&$[M].headersList.append("content-type",oA.type,!0);}}Q(bA,"initializeResponse");function rA($,AA,oA){const hA=new Z(W);return hA[M]=$,hA[Y]=oA,hA[p]=new e(W),hA[p][b]=$.headersList,hA[p][V]=AA,hA[p][Y]=oA,hA}return Q(rA,"fromInnerResponse"),R.converters.ReadableStream=R.interfaceConverter(ReadableStream),R.converters.FormData=R.interfaceConverter(m),R.converters.URLSearchParams=R.interfaceConverter(URLSearchParams),R.converters.XMLHttpRequestBodyInit=function($){return typeof $=="string"?R.converters.USVString($):y($)?R.converters.Blob($,{strict:!1}):ArrayBuffer.isView($)||N.isArrayBuffer($)?R.converters.BufferSource($):B.isFormDataLike($)?R.converters.FormData($,{strict:!1}):$ instanceof URLSearchParams?R.converters.URLSearchParams($):R.converters.DOMString($)},R.converters.BodyInit=function($){return $ instanceof ReadableStream?R.converters.ReadableStream($):$?.[Symbol.asyncIterator]?$:R.converters.XMLHttpRequestBodyInit($)},R.converters.ResponseInit=R.dictionaryConverter([{key:"status",converter:R.converters["unsigned short"],defaultValue:200},{key:"statusText",converter:R.converters.ByteString,defaultValue:""},{key:"headers",converter:R.converters.HeadersInit}]),response={isNetworkError:tA,makeNetworkError:gA,makeResponse:K,makeAppropriateNetworkError:aA,filterResponse:sA,Response:Z,cloneResponse:X,fromInnerResponse:rA},response}Q(requireResponse,"requireResponse");var dispatcherWeakref,hasRequiredDispatcherWeakref;function requireDispatcherWeakref(){if(hasRequiredDispatcherWeakref)return dispatcherWeakref;hasRequiredDispatcherWeakref=1;const{kConnected:e,kSize:A}=symbols$4,n=class n{constructor(l){this.value=l;}deref(){return this.value[e]===0&&this.value[A]===0?void 0:this.value}};Q(n,"CompatWeakRef");let t=n;const o=class o{constructor(l){this.finalizer=l;}register(l,C){l.on&&l.on("disconnect",()=>{l[e]===0&&l[A]===0&&this.finalizer(C);});}unregister(l){}};Q(o,"CompatFinalizer");let r=o;return dispatcherWeakref=Q(function(){return process.env.NODE_V8_COVERAGE?{WeakRef:t,FinalizationRegistry:r}:{WeakRef,FinalizationRegistry}},"dispatcherWeakref"),dispatcherWeakref}Q(requireDispatcherWeakref,"requireDispatcherWeakref");var request,hasRequiredRequest;function requireRequest(){if(hasRequiredRequest)return request;hasRequiredRequest=1;const{extractBody:e,mixinBody:A,cloneBody:t}=requireBody(),{Headers:r,fill:n,HeadersList:o}=requireHeaders(),{FinalizationRegistry:B}=requireDispatcherWeakref()(),l=util$m,C=require$$0__default$1,{isValidHTTPToken:f,sameOrigin:c,normalizeMethod:I,makePolicyContainer:y,normalizeMethodRecord:w}=requireUtil$5(),{forbiddenMethodsSet:U,corsSafeListedMethodsSet:k,referrerPolicy:F,requestRedirect:S,requestMode:M,requestCredentials:p,requestCache:V,requestDuplex:Y}=requireConstants$2(),{kEnumerableProperty:R}=l,{kHeaders:m,kSignal:_,kState:D,kGuard:b,kRealm:W,kDispatcher:J}=requireSymbols$3(),{webidl:N}=requireWebidl(),{getGlobalOrigin:v}=requireGlobal(),{URLSerializer:Z}=requireDataUrl(),{kHeadersList:X,kConstruct:K}=symbols$4,gA=require$$0__default,{getMaxListeners:tA,setMaxListeners:cA,getEventListeners:sA,defaultMaxListeners:aA}=require$$0__default$3,bA=Symbol("abortController"),rA=new B(({signal:RA,abort:kA})=>{RA.removeEventListener("abort",kA);});let QA=!1;const fA=class fA{constructor(kA,lA={}){if(kA===K)return;N.argumentLengthCheck(arguments,1,{header:"Request constructor"}),kA=N.converters.RequestInfo(kA),lA=N.converters.RequestInit(lA),this[W]={settingsObject:{baseUrl:v(),get origin(){return this.baseUrl?.origin},policyContainer:y()}};let CA=null,WA=null;const Ce=this[W].settingsObject.baseUrl;let HA=null;if(typeof kA=="string"){this[J]=lA.dispatcher;let NA;try{NA=new URL(kA,Ce);}catch(mA){throw new TypeError("Failed to parse URL from "+kA,{cause:mA})}if(NA.username||NA.password)throw new TypeError("Request cannot be constructed from a URL that includes credentials: "+kA);CA=AA({urlList:[NA]}),WA="cors";}else this[J]=lA.dispatcher||kA[J],gA(kA instanceof fA),CA=kA[D],HA=kA[_];const oe=this[W].settingsObject.origin;let re="client";if(CA.window?.constructor?.name==="EnvironmentSettingsObject"&&c(CA.window,oe)&&(re=CA.window),lA.window!=null)throw new TypeError(`'window' option '${re}' must be null`);"window"in lA&&(re="no-window"),CA=AA({method:CA.method,headersList:CA.headersList,unsafeRequest:CA.unsafeRequest,client:this[W].settingsObject,window:re,priority:CA.priority,origin:CA.origin,referrer:CA.referrer,referrerPolicy:CA.referrerPolicy,mode:CA.mode,credentials:CA.credentials,cache:CA.cache,redirect:CA.redirect,integrity:CA.integrity,keepalive:CA.keepalive,reloadNavigation:CA.reloadNavigation,historyNavigation:CA.historyNavigation,urlList:[...CA.urlList]});const Be=Object.keys(lA).length!==0;if(Be&&(CA.mode==="navigate"&&(CA.mode="same-origin"),CA.reloadNavigation=!1,CA.historyNavigation=!1,CA.origin="client",CA.referrer="client",CA.referrerPolicy="",CA.url=CA.urlList[CA.urlList.length-1],CA.urlList=[CA.url]),lA.referrer!==void 0){const NA=lA.referrer;if(NA==="")CA.referrer="no-referrer";else {let mA;try{mA=new URL(NA,Ce);}catch(Ae){throw new TypeError(`Referrer "${NA}" is not a valid URL.`,{cause:Ae})}mA.protocol==="about:"&&mA.hostname==="client"||oe&&!c(mA,this[W].settingsObject.baseUrl)?CA.referrer="client":CA.referrer=mA;}}lA.referrerPolicy!==void 0&&(CA.referrerPolicy=lA.referrerPolicy);let KA;if(lA.mode!==void 0?KA=lA.mode:KA=WA,KA==="navigate")throw N.errors.exception({header:"Request constructor",message:"invalid request mode navigate."});if(KA!=null&&(CA.mode=KA),lA.credentials!==void 0&&(CA.credentials=lA.credentials),lA.cache!==void 0&&(CA.cache=lA.cache),CA.cache==="only-if-cached"&&CA.mode!=="same-origin")throw new TypeError("'only-if-cached' can be set only with 'same-origin' mode");if(lA.redirect!==void 0&&(CA.redirect=lA.redirect),lA.integrity!=null&&(CA.integrity=String(lA.integrity)),lA.keepalive!==void 0&&(CA.keepalive=!!lA.keepalive),lA.method!==void 0){let NA=lA.method;const mA=w[NA];if(mA!==void 0)CA.method=mA;else {if(!f(NA))throw new TypeError(`'${NA}' is not a valid HTTP method.`);if(U.has(NA.toUpperCase()))throw new TypeError(`'${NA}' HTTP method is unsupported.`);NA=I(NA),CA.method=NA;}!QA&&CA.method==="patch"&&(process.emitWarning("Using `patch` is highly likely to result in a `405 Method Not Allowed`. `PATCH` is much more likely to succeed.",{code:"UNDICI-FETCH-patch"}),QA=!0);}lA.signal!==void 0&&(HA=lA.signal),this[D]=CA;const zA=new AbortController;if(this[_]=zA.signal,this[_][W]=this[W],HA!=null){if(!HA||typeof HA.aborted!="boolean"||typeof HA.addEventListener!="function")throw new TypeError("Failed to construct 'Request': member signal is not of type AbortSignal.");if(HA.aborted)zA.abort(HA.reason);else {this[bA]=zA;const NA=new WeakRef(zA),mA=Q(function(){const Ae=NA.deref();Ae!==void 0&&(rA.unregister(mA),this.removeEventListener("abort",mA),Ae.abort(this.reason));},"abort");try{(typeof tA=="function"&&tA(HA)===aA||sA(HA,"abort").length>=aA)&&cA(100,HA);}catch{}l.addAbortListener(HA,mA),rA.register(zA,{signal:HA,abort:mA},mA);}}if(this[m]=new r(K),this[m][X]=CA.headersList,this[m][b]="request",this[m][W]=this[W],KA==="no-cors"){if(!k.has(CA.method))throw new TypeError(`'${CA.method} is unsupported in no-cors mode.`);this[m][b]="request-no-cors";}if(Be){const NA=this[m][X],mA=lA.headers!==void 0?lA.headers:new o(NA);if(NA.clear(),mA instanceof o){for(const[Ae,ge]of mA)NA.append(Ae,ge);NA.cookies=mA.cookies;}else n(this[m],mA);}const OA=kA instanceof fA?kA[D].body:null;if((lA.body!=null||OA!=null)&&(CA.method==="GET"||CA.method==="HEAD"))throw new TypeError("Request with GET/HEAD method cannot have body.");let _A=null;if(lA.body!=null){const[NA,mA]=e(lA.body,CA.keepalive);_A=NA,mA&&!this[m][X].contains("content-type",!0)&&this[m].append("content-type",mA);}const ie=_A??OA;if(ie!=null&&ie.source==null){if(_A!=null&&lA.duplex==null)throw new TypeError("RequestInit: duplex option is required when sending a body.");if(CA.mode!=="same-origin"&&CA.mode!=="cors")throw new TypeError('If request is made from ReadableStream, mode should be "same-origin" or "cors"');CA.useCORSPreflightFlag=!0;}let ne=ie;if(_A==null&&OA!=null){if(l.isDisturbed(OA.stream)||OA.stream.locked)throw new TypeError("Cannot construct a Request with a Request object that has already been used.");const NA=new TransformStream;OA.stream.pipeThrough(NA),ne={source:OA.source,length:OA.length,stream:NA.readable};}this[D].body=ne;}get method(){return N.brandCheck(this,fA),this[D].method}get url(){return N.brandCheck(this,fA),Z(this[D].url)}get headers(){return N.brandCheck(this,fA),this[m]}get destination(){return N.brandCheck(this,fA),this[D].destination}get referrer(){return N.brandCheck(this,fA),this[D].referrer==="no-referrer"?"":this[D].referrer==="client"?"about:client":this[D].referrer.toString()}get referrerPolicy(){return N.brandCheck(this,fA),this[D].referrerPolicy}get mode(){return N.brandCheck(this,fA),this[D].mode}get credentials(){return this[D].credentials}get cache(){return N.brandCheck(this,fA),this[D].cache}get redirect(){return N.brandCheck(this,fA),this[D].redirect}get integrity(){return N.brandCheck(this,fA),this[D].integrity}get keepalive(){return N.brandCheck(this,fA),this[D].keepalive}get isReloadNavigation(){return N.brandCheck(this,fA),this[D].reloadNavigation}get isHistoryNavigation(){return N.brandCheck(this,fA),this[D].historyNavigation}get signal(){return N.brandCheck(this,fA),this[_]}get body(){return N.brandCheck(this,fA),this[D].body?this[D].body.stream:null}get bodyUsed(){return N.brandCheck(this,fA),!!this[D].body&&l.isDisturbed(this[D].body.stream)}get duplex(){return N.brandCheck(this,fA),"half"}clone(){if(N.brandCheck(this,fA),this.bodyUsed||this.body?.locked)throw new TypeError("unusable");const kA=oA(this[D]),lA=new AbortController;return this.signal.aborted?lA.abort(this.signal.reason):l.addAbortListener(this.signal,()=>{lA.abort(this.signal.reason);}),hA(kA,lA.signal,this[m][b],this[W])}[C.inspect.custom](kA,lA){lA.depth===null&&(lA.depth=2),lA.colors??(lA.colors=!0);const CA={method:this.method,url:this.url,headers:this.headers,destination:this.destination,referrer:this.referrer,referrerPolicy:this.referrerPolicy,mode:this.mode,credentials:this.credentials,cache:this.cache,redirect:this.redirect,integrity:this.integrity,keepalive:this.keepalive,isReloadNavigation:this.isReloadNavigation,isHistoryNavigation:this.isHistoryNavigation,signal:this.signal};return `Request ${C.formatWithOptions(lA,CA)}`}};Q(fA,"Request");let $=fA;A($);function AA(RA){const kA={method:"GET",localURLsOnly:!1,unsafeRequest:!1,body:null,client:null,reservedClient:null,replacesClientId:"",window:"client",keepalive:!1,serviceWorkers:"all",initiator:"",destination:"",priority:null,origin:"client",policyContainer:"client",referrer:"client",referrerPolicy:"",mode:"no-cors",useCORSPreflightFlag:!1,credentials:"same-origin",useCredentials:!1,cache:"default",redirect:"follow",integrity:"",cryptoGraphicsNonceMetadata:"",parserMetadata:"",reloadNavigation:!1,historyNavigation:!1,userActivation:!1,taintedOrigin:!1,redirectCount:0,responseTainting:"basic",preventNoCacheCacheControlHeaderModification:!1,done:!1,timingAllowFailed:!1,...RA,headersList:RA.headersList?new o(RA.headersList):new o};return kA.url=kA.urlList[0],kA}Q(AA,"makeRequest");function oA(RA){const kA=AA({...RA,body:null});return RA.body!=null&&(kA.body=t(RA.body)),kA}Q(oA,"cloneRequest");function hA(RA,kA,lA,CA){const WA=new $(K);return WA[D]=RA,WA[W]=CA,WA[_]=kA,WA[_][W]=CA,WA[m]=new r(K),WA[m][X]=RA.headersList,WA[m][b]=lA,WA[m][W]=CA,WA}return Q(hA,"fromInnerRequest"),Object.defineProperties($.prototype,{method:R,url:R,headers:R,redirect:R,clone:R,signal:R,duplex:R,destination:R,body:R,bodyUsed:R,isHistoryNavigation:R,isReloadNavigation:R,keepalive:R,integrity:R,cache:R,credentials:R,attribute:R,referrerPolicy:R,referrer:R,mode:R,[Symbol.toStringTag]:{value:"Request",configurable:!0}}),N.converters.Request=N.interfaceConverter($),N.converters.RequestInfo=function(RA){return typeof RA=="string"?N.converters.USVString(RA):RA instanceof $?N.converters.Request(RA):N.converters.USVString(RA)},N.converters.AbortSignal=N.interfaceConverter(AbortSignal),N.converters.RequestInit=N.dictionaryConverter([{key:"method",converter:N.converters.ByteString},{key:"headers",converter:N.converters.HeadersInit},{key:"body",converter:N.nullableConverter(N.converters.BodyInit)},{key:"referrer",converter:N.converters.USVString},{key:"referrerPolicy",converter:N.converters.DOMString,allowedValues:F},{key:"mode",converter:N.converters.DOMString,allowedValues:M},{key:"credentials",converter:N.converters.DOMString,allowedValues:p},{key:"cache",converter:N.converters.DOMString,allowedValues:V},{key:"redirect",converter:N.converters.DOMString,allowedValues:S},{key:"integrity",converter:N.converters.DOMString},{key:"keepalive",converter:N.converters.boolean},{key:"signal",converter:N.nullableConverter(RA=>N.converters.AbortSignal(RA,{strict:!1}))},{key:"window",converter:N.converters.any},{key:"duplex",converter:N.converters.DOMString,allowedValues:Y},{key:"dispatcher",converter:N.converters.any}]),request={Request:$,makeRequest:AA,fromInnerRequest:hA,cloneRequest:oA},request}Q(requireRequest,"requireRequest");var fetch_1,hasRequiredFetch;function requireFetch(){if(hasRequiredFetch)return fetch_1;hasRequiredFetch=1;const{makeNetworkError:e,makeAppropriateNetworkError:A,filterResponse:t,makeResponse:r,fromInnerResponse:n}=requireResponse(),{HeadersList:o}=requireHeaders(),{Request:B,cloneRequest:l}=requireRequest(),C=zlib__default,{bytesMatch:f,makePolicyContainer:c,clonePolicyContainer:I,requestBadPort:y,TAOCheck:w,appendRequestOriginHeader:U,responseLocationURL:k,requestCurrentURL:F,setRequestReferrerPolicyOnRedirect:S,tryUpgradeRequestToAPotentiallyTrustworthyURL:M,createOpaqueTimingInfo:p,appendFetchMetadata:V,corsCheck:Y,crossOriginResourcePolicyCheck:R,determineRequestsReferrer:m,coarsenedSharedCurrentTime:_,createDeferredPromise:D,isBlobLike:b,sameOrigin:W,isCancelled:J,isAborted:N,isErrorLike:v,fullyReadBody:Z,readableStreamClose:X,isomorphicEncode:K,urlIsLocal:gA,urlIsHttpHttpsScheme:tA,urlHasHttpsScheme:cA,clampAndCoarsenConnectionTimingInfo:sA,simpleRangeHeaderValue:aA,buildContentRange:bA,createInflate:rA,extractMimeType:QA}=requireUtil$5(),{kState:$,kDispatcher:AA}=requireSymbols$3(),oA=require$$0__default,{safelyExtractBody:hA,extractBody:fA}=requireBody(),{redirectStatusSet:RA,nullBodyStatus:kA,safeMethodsSet:lA,requestBodyHeader:CA,subresourceSet:WA}=requireConstants$2(),Ce=require$$0__default$3,{Readable:HA,pipeline:oe}=Stream__default,{addAbortListener:re,isErrored:Be,isReadable:KA,nodeMajor:zA,nodeMinor:OA,bufferToLowerCasedHeaderName:_A}=util$m,{dataURLProcessor:ie,serializeAMimeType:ne,minimizeSupportedMimeType:NA}=requireDataUrl(),{getGlobalDispatcher:mA}=global,{webidl:Ae}=requireWebidl(),{STATUS_CODES:ge}=http__default,Et=["GET","HEAD"],Qt=typeof __UNDICI_IS_NODE__<"u"||typeof esbuildDetection<"u"?"node":"undici";let de;const VA=class VA extends Ce{constructor(BA){super(),this.dispatcher=BA,this.connection=null,this.dump=!1,this.state="ongoing";}terminate(BA){this.state==="ongoing"&&(this.state="terminated",this.connection?.destroy(BA),this.emit("terminated",BA));}abort(BA){this.state==="ongoing"&&(this.state="aborted",BA||(BA=new DOMException("The operation was aborted.","AbortError")),this.serializedAbortReason=BA,this.connection?.destroy(BA),this.emit("terminated",BA));}};Q(VA,"Fetch");let Ee=VA;function Ct(q,BA=void 0){Ae.argumentLengthCheck(arguments,1,{header:"globalThis.fetch"});const z=D();let eA;try{eA=new B(q,BA);}catch(uA){return z.reject(uA),z.promise}const IA=eA[$];if(eA.signal.aborted)return G(z,IA,null,eA.signal.reason),z.promise;IA.client.globalObject?.constructor?.name==="ServiceWorkerGlobalScope"&&(IA.serviceWorkers="none");let pA=null;const MA=null;let YA=!1,LA=null;return re(eA.signal,()=>{YA=!0,oA(LA!=null),LA.abort(eA.signal.reason),G(z,IA,pA,eA.signal.reason);}),LA=j({request:IA,processResponseEndOfBody:Q(uA=>nt(uA,"fetch"),"handleFetchDone"),processResponse:Q(uA=>{if(!YA){if(uA.aborted){G(z,IA,pA,LA.serializedAbortReason);return}if(uA.type==="error"){z.reject(new TypeError("fetch failed",{cause:uA.error}));return}pA=n(uA,"immutable",MA),z.resolve(pA);}},"processResponse"),dispatcher:eA[AA]}),z.promise}Q(Ct,"fetch");function nt(q,BA="other"){if(q.type==="error"&&q.aborted||!q.urlList?.length)return;const z=q.urlList[0];let eA=q.timingInfo,IA=q.cacheState;tA(z)&&eA!==null&&(q.timingAllowPassed||(eA=p({startTime:eA.startTime}),IA=""),eA.endTime=_(),q.timingInfo=eA,Ie(eA,z.href,BA,globalThis,IA));}Q(nt,"finalizeAndReportTiming");const Ie=zA>18||zA===18&&OA>=2?performance.markResourceTiming:()=>{};function G(q,BA,z,eA){if(q.reject(eA),BA.body!=null&&KA(BA.body?.stream)&&BA.body.stream.cancel(eA).catch(nA=>{if(nA.code!=="ERR_INVALID_STATE")throw nA}),z==null)return;const IA=z[$];IA.body!=null&&KA(IA.body?.stream)&&IA.body.stream.cancel(eA).catch(nA=>{if(nA.code!=="ERR_INVALID_STATE")throw nA});}Q(G,"abortFetch");function j({request:q,processRequestBodyChunkLength:BA,processRequestEndOfBody:z,processResponse:eA,processResponseEndOfBody:IA,processResponseConsumeBody:nA,useParallelQueue:pA=!1,dispatcher:MA=mA()}){oA(MA);let YA=null,LA=!1;q.client!=null&&(YA=q.client.globalObject,LA=q.client.crossOriginIsolatedCapability);const PA=_(LA),jA=p({startTime:PA}),uA={controller:new Ee(MA),request:q,timingInfo:jA,processRequestBodyChunkLength:BA,processRequestEndOfBody:z,processResponse:eA,processResponseConsumeBody:nA,processResponseEndOfBody:IA,taskDestination:YA,crossOriginIsolatedCapability:LA};return oA(!q.body||q.body.stream),q.window==="client"&&(q.window=q.client?.globalObject?.constructor?.name==="Window"?q.client:"no-window"),q.origin==="client"&&(q.origin=q.client?.origin),q.policyContainer==="client"&&(q.client!=null?q.policyContainer=I(q.client.policyContainer):q.policyContainer=c()),q.headersList.contains("accept",!0)||q.headersList.append("accept","*/*",!0),q.headersList.contains("accept-language",!0)||q.headersList.append("accept-language","*",!0),q.priority,WA.has(q.destination),iA(uA).catch(TA=>{uA.controller.terminate(TA);}),uA.controller}Q(j,"fetching");async function iA(q,BA=!1){const z=q.request;let eA=null;if(z.localURLsOnly&&!gA(F(z))&&(eA=e("local URLs only")),M(z),y(z)==="blocked"&&(eA=e("bad port")),z.referrerPolicy===""&&(z.referrerPolicy=z.policyContainer.referrerPolicy),z.referrer!=="no-referrer"&&(z.referrer=m(z)),eA===null&&(eA=await(async()=>{const nA=F(z);return W(nA,z.url)&&z.responseTainting==="basic"||nA.protocol==="data:"||z.mode==="navigate"||z.mode==="websocket"?(z.responseTainting="basic",await EA(q)):z.mode==="same-origin"?e('request mode cannot be "same-origin"'):z.mode==="no-cors"?z.redirect!=="follow"?e('redirect mode cannot be "follow" for "no-cors" request'):(z.responseTainting="opaque",await EA(q)):tA(F(z))?(z.responseTainting="cors",await wA(q)):e("URL scheme must be a HTTP(S) scheme")})()),BA)return eA;eA.status!==0&&!eA.internalResponse&&(z.responseTainting,z.responseTainting==="basic"?eA=t(eA,"basic"):z.responseTainting==="cors"?eA=t(eA,"cors"):z.responseTainting==="opaque"?eA=t(eA,"opaque"):oA(!1));let IA=eA.status===0?eA:eA.internalResponse;if(IA.urlList.length===0&&IA.urlList.push(...z.urlList),z.timingAllowFailed||(eA.timingAllowPassed=!0),eA.type==="opaque"&&IA.status===206&&IA.rangeRequested&&!z.headers.contains("range",!0)&&(eA=IA=e()),eA.status!==0&&(z.method==="HEAD"||z.method==="CONNECT"||kA.includes(IA.status))&&(IA.body=null,q.controller.dump=!0),z.integrity){const nA=Q(MA=>yA(q,e(MA)),"processBodyError");if(z.responseTainting==="opaque"||eA.body==null){nA(eA.error);return}const pA=Q(MA=>{if(!f(MA,z.integrity)){nA("integrity mismatch");return}eA.body=hA(MA)[0],yA(q,eA);},"processBody");await Z(eA.body,pA,nA);}else yA(q,eA);}Q(iA,"mainFetch");function EA(q){if(J(q)&&q.request.redirectCount===0)return Promise.resolve(A(q));const{request:BA}=q,{protocol:z}=F(BA);switch(z){case"about:":return Promise.resolve(e("about scheme is not supported"));case"blob:":{de||(de=require$$6__default.resolveObjectURL);const eA=F(BA);if(eA.search.length!==0)return Promise.resolve(e("NetworkError when attempting to fetch resource."));const IA=de(eA.toString());if(BA.method!=="GET"||!b(IA))return Promise.resolve(e("invalid method"));const nA=r(),pA=IA.size,MA=K(`${pA}`),YA=IA.type;if(BA.headersList.contains("range",!0)){nA.rangeRequested=!0;const LA=BA.headersList.get("range",!0),PA=aA(LA,!0);if(PA==="failure")return Promise.resolve(e("failed to fetch the data URL"));let{rangeStartValue:jA,rangeEndValue:uA}=PA;if(jA===null)jA=pA-uA,uA=jA+uA-1;else {if(jA>=pA)return Promise.resolve(e("Range start is greater than the blob's size."));(uA===null||uA>=pA)&&(uA=pA-1);}const TA=IA.slice(jA,uA,YA),$A=fA(TA);nA.body=$A[0];const JA=K(`${TA.size}`),se=bA(jA,uA,pA);nA.status=206,nA.statusText="Partial Content",nA.headersList.set("content-length",JA,!0),nA.headersList.set("content-type",YA,!0),nA.headersList.set("content-range",se,!0);}else {const LA=fA(IA);nA.statusText="OK",nA.body=LA[0],nA.headersList.set("content-length",MA,!0),nA.headersList.set("content-type",YA,!0);}return Promise.resolve(nA)}case"data:":{const eA=F(BA),IA=ie(eA);if(IA==="failure")return Promise.resolve(e("failed to fetch the data URL"));const nA=ne(IA.mimeType);return Promise.resolve(r({statusText:"OK",headersList:[["content-type",{name:"Content-Type",value:nA}]],body:hA(IA.body)[0]}))}case"file:":return Promise.resolve(e("not implemented... yet..."));case"http:":case"https:":return wA(q).catch(eA=>e(eA));default:return Promise.resolve(e("unknown scheme"))}}Q(EA,"schemeFetch");function dA(q,BA){q.request.done=!0,q.processResponseDone!=null&&queueMicrotask(()=>q.processResponseDone(BA));}Q(dA,"finalizeResponse");function yA(q,BA){let z=q.timingInfo;const eA=Q(()=>{const nA=Date.now();q.request.destination==="document"&&(q.controller.fullTimingInfo=z),q.controller.reportTimingSteps=()=>{if(q.request.url.protocol!=="https:")return;z.endTime=nA;let MA=BA.cacheState;const YA=BA.bodyInfo;BA.timingAllowPassed||(z=p(z),MA="");let LA=0;if(q.request.mode!=="navigator"||!BA.hasCrossOriginRedirects){LA=BA.status;const PA=QA(BA.headersList);PA!=="failure"&&(YA.contentType=NA(PA));}q.request.initiatorType!=null&&Ie(z,q.request.url.href,q.request.initiatorType,globalThis,MA,YA,LA);};const pA=Q(()=>{q.request.done=!0,q.processResponseEndOfBody!=null&&queueMicrotask(()=>q.processResponseEndOfBody(BA)),q.request.initiatorType!=null&&q.controller.reportTimingSteps();},"processResponseEndOfBodyTask");queueMicrotask(()=>pA());},"processResponseEndOfBody");q.processResponse!=null&&queueMicrotask(()=>q.processResponse(BA));const IA=BA.type==="error"?BA:BA.internalResponse??BA;if(IA.body==null)eA();else {const nA=new TransformStream({start(){},transform(MA,YA){YA.enqueue(MA);},flush:eA});IA.body.stream.pipeThrough(nA);const pA=new ReadableStream({readableStream:nA.readable,async start(){this._bodyReader=this.readableStream.getReader();},async pull(MA){for(;MA.desiredSize>=0;){const{done:YA,value:LA}=await this._bodyReader.read();if(YA){queueMicrotask(()=>X(MA));break}MA.enqueue(LA);}},type:"bytes"});IA.body.stream=pA;}}Q(yA,"fetchFinale");async function wA(q){const BA=q.request;let z=null,eA=null;const IA=q.timingInfo;if(BA.serviceWorkers,z===null){if(BA.redirect==="follow"&&(BA.serviceWorkers="none"),eA=z=await SA(q),BA.responseTainting==="cors"&&Y(BA,z)==="failure")return e("cors failure");w(BA,z)==="failure"&&(BA.timingAllowFailed=!0);}return (BA.responseTainting==="opaque"||z.type==="opaque")&&R(BA.origin,BA.client,BA.destination,eA)==="blocked"?e("blocked"):(RA.has(eA.status)&&(BA.redirect!=="manual"&&q.controller.connection.destroy(void 0,!1),BA.redirect==="error"?z=e("unexpected redirect"):BA.redirect==="manual"?z=eA:BA.redirect==="follow"?z=await UA(q,z):oA(!1)),z.timingInfo=IA,z)}Q(wA,"httpFetch");function UA(q,BA){const z=q.request,eA=BA.internalResponse?BA.internalResponse:BA;let IA;try{if(IA=k(eA,F(z).hash),IA==null)return BA}catch(pA){return Promise.resolve(e(pA))}if(!tA(IA))return Promise.resolve(e("URL scheme must be a HTTP(S) scheme"));if(z.redirectCount===20)return Promise.resolve(e("redirect count exceeded"));if(z.redirectCount+=1,z.mode==="cors"&&(IA.username||IA.password)&&!W(z,IA))return Promise.resolve(e('cross origin not allowed for request mode "cors"'));if(z.responseTainting==="cors"&&(IA.username||IA.password))return Promise.resolve(e('URL cannot contain credentials for request mode "cors"'));if(eA.status!==303&&z.body!=null&&z.body.source==null)return Promise.resolve(e());if([301,302].includes(eA.status)&&z.method==="POST"||eA.status===303&&!Et.includes(z.method)){z.method="GET",z.body=null;for(const pA of CA)z.headersList.delete(pA);}W(F(z),IA)||(z.headersList.delete("authorization",!0),z.headersList.delete("proxy-authorization",!0),z.headersList.delete("cookie",!0),z.headersList.delete("host",!0)),z.body!=null&&(oA(z.body.source!=null),z.body=hA(z.body.source)[0]);const nA=q.timingInfo;return nA.redirectEndTime=nA.postRedirectStartTime=_(q.crossOriginIsolatedCapability),nA.redirectStartTime===0&&(nA.redirectStartTime=nA.startTime),z.urlList.push(IA),S(z,eA),iA(q,!0)}Q(UA,"httpRedirectFetch");async function SA(q,BA=!1,z=!1){const eA=q.request;let IA=null,nA=null,pA=null;eA.window==="no-window"&&eA.redirect==="error"?(IA=q,nA=eA):(nA=l(eA),IA={...q},IA.request=nA);const MA=eA.credentials==="include"||eA.credentials==="same-origin"&&eA.responseTainting==="basic",YA=nA.body?nA.body.length:null;let LA=null;if(nA.body==null&&["POST","PUT"].includes(nA.method)&&(LA="0"),YA!=null&&(LA=K(`${YA}`)),LA!=null&&nA.headersList.append("content-length",LA,!0),YA!=null&&nA.keepalive,nA.referrer instanceof URL&&nA.headersList.append("referer",K(nA.referrer.href),!0),U(nA),V(nA),nA.headersList.contains("user-agent",!0)||nA.headersList.append("user-agent",Qt),nA.cache==="default"&&(nA.headersList.contains("if-modified-since",!0)||nA.headersList.contains("if-none-match",!0)||nA.headersList.contains("if-unmodified-since",!0)||nA.headersList.contains("if-match",!0)||nA.headersList.contains("if-range",!0))&&(nA.cache="no-store"),nA.cache==="no-cache"&&!nA.preventNoCacheCacheControlHeaderModification&&!nA.headersList.contains("cache-control",!0)&&nA.headersList.append("cache-control","max-age=0",!0),(nA.cache==="no-store"||nA.cache==="reload")&&(nA.headersList.contains("pragma",!0)||nA.headersList.append("pragma","no-cache",!0),nA.headersList.contains("cache-control",!0)||nA.headersList.append("cache-control","no-cache",!0)),nA.headersList.contains("range",!0)&&nA.headersList.append("accept-encoding","identity",!0),nA.headersList.contains("accept-encoding",!0)||(cA(F(nA))?nA.headersList.append("accept-encoding","br, gzip, deflate",!0):nA.headersList.append("accept-encoding","gzip, deflate",!0)),nA.headersList.delete("host",!0),nA.cache="no-store",nA.mode!=="no-store"&&nA.mode,pA==null){if(nA.mode==="only-if-cached")return e("only if cached");const PA=await qA(IA,MA,z);!lA.has(nA.method)&&PA.status>=200&&PA.status<=399,pA==null&&(pA=PA);}if(pA.urlList=[...nA.urlList],nA.headersList.contains("range",!0)&&(pA.rangeRequested=!0),pA.requestIncludesCredentials=MA,pA.status===407)return eA.window==="no-window"?e():J(q)?A(q):e("proxy authentication required");if(pA.status===421&&!z&&(eA.body==null||eA.body.source!=null)){if(J(q))return A(q);q.controller.connection.destroy(),pA=await SA(q,BA,!0);}return pA}Q(SA,"httpNetworkOrCacheFetch");async function qA(q,BA=!1,z=!1){oA(!q.controller.connection||q.controller.connection.destroyed),q.controller.connection={abort:null,destroyed:!1,destroy(uA,TA=!0){this.destroyed||(this.destroyed=!0,TA&&this.abort?.(uA??new DOMException("The operation was aborted.","AbortError")));}};const eA=q.request;let IA=null;const nA=q.timingInfo;eA.cache="no-store",eA.mode;let pA=null;if(eA.body==null&&q.processRequestEndOfBody)queueMicrotask(()=>q.processRequestEndOfBody());else if(eA.body!=null){const uA=Q(async function*(JA){J(q)||(yield JA,q.processRequestBodyChunkLength?.(JA.byteLength));},"processBodyChunk"),TA=Q(()=>{J(q)||q.processRequestEndOfBody&&q.processRequestEndOfBody();},"processEndOfBody"),$A=Q(JA=>{J(q)||(JA.name==="AbortError"?q.controller.abort():q.controller.terminate(JA));},"processBodyError");pA=async function*(){try{for await(const JA of eA.body.stream)yield*uA(JA);TA();}catch(JA){$A(JA);}}();}try{const{body:uA,status:TA,statusText:$A,headersList:JA,socket:se}=await jA({body:pA});if(se)IA=r({status:TA,statusText:$A,headersList:JA,socket:se});else {const GA=uA[Symbol.asyncIterator]();q.controller.next=()=>GA.next(),IA=r({status:TA,statusText:$A,headersList:JA});}}catch(uA){return uA.name==="AbortError"?(q.controller.connection.destroy(),A(q,uA)):e(uA)}const MA=Q(async()=>{await q.controller.resume();},"pullAlgorithm"),YA=Q(uA=>{q.controller.abort(uA);},"cancelAlgorithm"),LA=new ReadableStream({async start(uA){q.controller.controller=uA;},async pull(uA){await MA();},async cancel(uA){await YA(uA);},type:"bytes"});IA.body={stream:LA,source:null,length:null},q.controller.onAborted=PA,q.controller.on("terminated",PA),q.controller.resume=async()=>{for(;;){let uA,TA;try{const{done:JA,value:se}=await q.controller.next();if(N(q))break;uA=JA?void 0:se;}catch(JA){q.controller.ended&&!nA.encodedBodySize?uA=void 0:(uA=JA,TA=!0);}if(uA===void 0){X(q.controller.controller),dA(q,IA);return}if(nA.decodedBodySize+=uA?.byteLength??0,TA){q.controller.terminate(uA);return}const $A=new Uint8Array(uA);if($A.byteLength&&q.controller.controller.enqueue($A),Be(LA)){q.controller.terminate();return}if(q.controller.controller.desiredSize<=0)return}};function PA(uA){N(q)?(IA.aborted=!0,KA(LA)&&q.controller.controller.error(q.controller.serializedAbortReason)):KA(LA)&&q.controller.controller.error(new TypeError("terminated",{cause:v(uA)?uA:void 0})),q.controller.connection.destroy();}return Q(PA,"onAborted"),IA;function jA({body:uA}){const TA=F(eA),$A=q.controller.dispatcher;return new Promise((JA,se)=>$A.dispatch({path:TA.pathname+TA.search,origin:TA.origin,method:eA.method,body:$A.isMockActive?eA.body&&(eA.body.source||eA.body.stream):uA,headers:eA.headersList.entries,maxRedirections:0,upgrade:eA.mode==="websocket"?"websocket":void 0},{body:null,abort:null,onConnect(GA){const{connection:vA}=q.controller;nA.finalConnectionTimingInfo=sA(void 0,nA.postRedirectStartTime,q.crossOriginIsolatedCapability),vA.destroyed?GA(new DOMException("The operation was aborted.","AbortError")):(q.controller.on("terminated",GA),this.abort=vA.abort=GA),nA.finalNetworkRequestStartTime=_(q.crossOriginIsolatedCapability);},onResponseStarted(){nA.finalNetworkResponseStartTime=_(q.crossOriginIsolatedCapability);},onHeaders(GA,vA,Bt,st){if(GA<200)return;let ee=[],It="";const ae=new o;if(Array.isArray(vA)){for(let XA=0;XA<vA.length;XA+=2)ae.append(_A(vA[XA]),vA[XA+1].toString("latin1"),!0);const te=ae.get("content-encoding",!0);te&&(ee=te.toLowerCase().split(",").map(XA=>XA.trim())),It=ae.get("location",!0);}else {const te=Object.keys(vA);for(let fe=0;fe<te.length;++fe){const ot=te[fe],at=vA[ot];if(ot==="set-cookie")for(let ct=0;ct<at.length;++ct)ae.append(ot,at[ct],!0);else ae.append(ot,at,!0);}const XA=vA["content-encoding"];XA&&(ee=XA.toLowerCase().split(",").map(fe=>fe.trim()).reverse()),It=vA.location;}this.body=new HA({read:Bt});const ce=[],Zt=It&&eA.redirect==="follow"&&RA.has(GA);if(eA.method!=="HEAD"&&eA.method!=="CONNECT"&&!kA.includes(GA)&&!Zt)for(let te=0;te<ee.length;++te){const XA=ee[te];if(XA==="x-gzip"||XA==="gzip")ce.push(C.createGunzip({flush:C.constants.Z_SYNC_FLUSH,finishFlush:C.constants.Z_SYNC_FLUSH}));else if(XA==="deflate")ce.push(rA());else if(XA==="br")ce.push(C.createBrotliDecompress());else {ce.length=0;break}}return JA({status:GA,statusText:st,headersList:ae,body:ce.length?oe(this.body,...ce,()=>{}):this.body.on("error",()=>{})}),!0},onData(GA){if(q.controller.dump)return;const vA=GA;return nA.encodedBodySize+=vA.byteLength,this.body.push(vA)},onComplete(){this.abort&&q.controller.off("terminated",this.abort),q.controller.onAborted&&q.controller.off("terminated",q.controller.onAborted),q.controller.ended=!0,this.body.push(null);},onError(GA){this.abort&&q.controller.off("terminated",this.abort),this.body?.destroy(GA),q.controller.terminate(GA),se(GA);},onUpgrade(GA,vA,Bt){if(GA!==101)return;const st=new o;for(let ee=0;ee<vA.length;ee+=2)st.append(_A(vA[ee]),vA[ee+1].toString("latin1"),!0);return JA({status:GA,statusText:ge[GA],headersList:st,socket:Bt}),!0}}))}}return Q(qA,"httpNetworkFetch"),fetch_1={fetch:Ct,Fetch:Ee,fetching:j,finalizeAndReportTiming:nt},fetch_1}Q(requireFetch,"requireFetch");var symbols$2,hasRequiredSymbols$2;function requireSymbols$2(){return hasRequiredSymbols$2||(hasRequiredSymbols$2=1,symbols$2={kState:Symbol("FileReader state"),kResult:Symbol("FileReader result"),kError:Symbol("FileReader error"),kLastProgressEventFired:Symbol("FileReader last progress event fired timestamp"),kEvents:Symbol("FileReader events"),kAborted:Symbol("FileReader aborted")}),symbols$2}Q(requireSymbols$2,"requireSymbols$2");var progressevent,hasRequiredProgressevent;function requireProgressevent(){if(hasRequiredProgressevent)return progressevent;hasRequiredProgressevent=1;const{webidl:e}=requireWebidl(),A=Symbol("ProgressEvent state"),r=class r extends Event{constructor(o,B={}){o=e.converters.DOMString(o),B=e.converters.ProgressEventInit(B??{}),super(o,B),this[A]={lengthComputable:B.lengthComputable,loaded:B.loaded,total:B.total};}get lengthComputable(){return e.brandCheck(this,r),this[A].lengthComputable}get loaded(){return e.brandCheck(this,r),this[A].loaded}get total(){return e.brandCheck(this,r),this[A].total}};Q(r,"ProgressEvent");let t=r;return e.converters.ProgressEventInit=e.dictionaryConverter([{key:"lengthComputable",converter:e.converters.boolean,defaultValue:!1},{key:"loaded",converter:e.converters["unsigned long long"],defaultValue:0},{key:"total",converter:e.converters["unsigned long long"],defaultValue:0},{key:"bubbles",converter:e.converters.boolean,defaultValue:!1},{key:"cancelable",converter:e.converters.boolean,defaultValue:!1},{key:"composed",converter:e.converters.boolean,defaultValue:!1}]),progressevent={ProgressEvent:t},progressevent}Q(requireProgressevent,"requireProgressevent");var encoding,hasRequiredEncoding;function requireEncoding(){if(hasRequiredEncoding)return encoding;hasRequiredEncoding=1;function e(A){if(!A)return "failure";switch(A.trim().toLowerCase()){case"unicode-1-1-utf-8":case"unicode11utf8":case"unicode20utf8":case"utf-8":case"utf8":case"x-unicode20utf8":return "UTF-8";case"866":case"cp866":case"csibm866":case"ibm866":return "IBM866";case"csisolatin2":case"iso-8859-2":case"iso-ir-101":case"iso8859-2":case"iso88592":case"iso_8859-2":case"iso_8859-2:1987":case"l2":case"latin2":return "ISO-8859-2";case"csisolatin3":case"iso-8859-3":case"iso-ir-109":case"iso8859-3":case"iso88593":case"iso_8859-3":case"iso_8859-3:1988":case"l3":case"latin3":return "ISO-8859-3";case"csisolatin4":case"iso-8859-4":case"iso-ir-110":case"iso8859-4":case"iso88594":case"iso_8859-4":case"iso_8859-4:1988":case"l4":case"latin4":return "ISO-8859-4";case"csisolatincyrillic":case"cyrillic":case"iso-8859-5":case"iso-ir-144":case"iso8859-5":case"iso88595":case"iso_8859-5":case"iso_8859-5:1988":return "ISO-8859-5";case"arabic":case"asmo-708":case"csiso88596e":case"csiso88596i":case"csisolatinarabic":case"ecma-114":case"iso-8859-6":case"iso-8859-6-e":case"iso-8859-6-i":case"iso-ir-127":case"iso8859-6":case"iso88596":case"iso_8859-6":case"iso_8859-6:1987":return "ISO-8859-6";case"csisolatingreek":case"ecma-118":case"elot_928":case"greek":case"greek8":case"iso-8859-7":case"iso-ir-126":case"iso8859-7":case"iso88597":case"iso_8859-7":case"iso_8859-7:1987":case"sun_eu_greek":return "ISO-8859-7";case"csiso88598e":case"csisolatinhebrew":case"hebrew":case"iso-8859-8":case"iso-8859-8-e":case"iso-ir-138":case"iso8859-8":case"iso88598":case"iso_8859-8":case"iso_8859-8:1988":case"visual":return "ISO-8859-8";case"csiso88598i":case"iso-8859-8-i":case"logical":return "ISO-8859-8-I";case"csisolatin6":case"iso-8859-10":case"iso-ir-157":case"iso8859-10":case"iso885910":case"l6":case"latin6":return "ISO-8859-10";case"iso-8859-13":case"iso8859-13":case"iso885913":return "ISO-8859-13";case"iso-8859-14":case"iso8859-14":case"iso885914":return "ISO-8859-14";case"csisolatin9":case"iso-8859-15":case"iso8859-15":case"iso885915":case"iso_8859-15":case"l9":return "ISO-8859-15";case"iso-8859-16":return "ISO-8859-16";case"cskoi8r":case"koi":case"koi8":case"koi8-r":case"koi8_r":return "KOI8-R";case"koi8-ru":case"koi8-u":return "KOI8-U";case"csmacintosh":case"mac":case"macintosh":case"x-mac-roman":return "macintosh";case"iso-8859-11":case"iso8859-11":case"iso885911":case"tis-620":case"windows-874":return "windows-874";case"cp1250":case"windows-1250":case"x-cp1250":return "windows-1250";case"cp1251":case"windows-1251":case"x-cp1251":return "windows-1251";case"ansi_x3.4-1968":case"ascii":case"cp1252":case"cp819":case"csisolatin1":case"ibm819":case"iso-8859-1":case"iso-ir-100":case"iso8859-1":case"iso88591":case"iso_8859-1":case"iso_8859-1:1987":case"l1":case"latin1":case"us-ascii":case"windows-1252":case"x-cp1252":return "windows-1252";case"cp1253":case"windows-1253":case"x-cp1253":return "windows-1253";case"cp1254":case"csisolatin5":case"iso-8859-9":case"iso-ir-148":case"iso8859-9":case"iso88599":case"iso_8859-9":case"iso_8859-9:1989":case"l5":case"latin5":case"windows-1254":case"x-cp1254":return "windows-1254";case"cp1255":case"windows-1255":case"x-cp1255":return "windows-1255";case"cp1256":case"windows-1256":case"x-cp1256":return "windows-1256";case"cp1257":case"windows-1257":case"x-cp1257":return "windows-1257";case"cp1258":case"windows-1258":case"x-cp1258":return "windows-1258";case"x-mac-cyrillic":case"x-mac-ukrainian":return "x-mac-cyrillic";case"chinese":case"csgb2312":case"csiso58gb231280":case"gb2312":case"gb_2312":case"gb_2312-80":case"gbk":case"iso-ir-58":case"x-gbk":return "GBK";case"gb18030":return "gb18030";case"big5":case"big5-hkscs":case"cn-big5":case"csbig5":case"x-x-big5":return "Big5";case"cseucpkdfmtjapanese":case"euc-jp":case"x-euc-jp":return "EUC-JP";case"csiso2022jp":case"iso-2022-jp":return "ISO-2022-JP";case"csshiftjis":case"ms932":case"ms_kanji":case"shift-jis":case"shift_jis":case"sjis":case"windows-31j":case"x-sjis":return "Shift_JIS";case"cseuckr":case"csksc56011987":case"euc-kr":case"iso-ir-149":case"korean":case"ks_c_5601-1987":case"ks_c_5601-1989":case"ksc5601":case"ksc_5601":case"windows-949":return "EUC-KR";case"csiso2022kr":case"hz-gb-2312":case"iso-2022-cn":case"iso-2022-cn-ext":case"iso-2022-kr":case"replacement":return "replacement";case"unicodefffe":case"utf-16be":return "UTF-16BE";case"csunicode":case"iso-10646-ucs-2":case"ucs-2":case"unicode":case"unicodefeff":case"utf-16":case"utf-16le":return "UTF-16LE";case"x-user-defined":return "x-user-defined";default:return "failure"}}return Q(e,"getEncoding"),encoding={getEncoding:e},encoding}Q(requireEncoding,"requireEncoding");var util$5,hasRequiredUtil$4;function requireUtil$4(){if(hasRequiredUtil$4)return util$5;hasRequiredUtil$4=1;const{kState:e,kError:A,kResult:t,kAborted:r,kLastProgressEventFired:n}=requireSymbols$2(),{ProgressEvent:o}=requireProgressevent(),{getEncoding:B}=requireEncoding(),{serializeAMimeType:l,parseMIMEType:C}=requireDataUrl(),{types:f}=require$$0__default$1,{StringDecoder:c}=require$$5__default$1,{btoa:I}=require$$6__default,y={enumerable:!0,writable:!1,configurable:!1};function w(p,V,Y,R){if(p[e]==="loading")throw new DOMException("Invalid state","InvalidStateError");p[e]="loading",p[t]=null,p[A]=null;const _=V.stream().getReader(),D=[];let b=_.read(),W=!0;(async()=>{for(;!p[r];)try{const{done:J,value:N}=await b;if(W&&!p[r]&&queueMicrotask(()=>{U("loadstart",p);}),W=!1,!J&&f.isUint8Array(N))D.push(N),(p[n]===void 0||Date.now()-p[n]>=50)&&!p[r]&&(p[n]=Date.now(),queueMicrotask(()=>{U("progress",p);})),b=_.read();else if(J){queueMicrotask(()=>{p[e]="done";try{const v=k(D,Y,V.type,R);if(p[r])return;p[t]=v,U("load",p);}catch(v){p[A]=v,U("error",p);}p[e]!=="loading"&&U("loadend",p);});break}}catch(J){if(p[r])return;queueMicrotask(()=>{p[e]="done",p[A]=J,U("error",p),p[e]!=="loading"&&U("loadend",p);});break}})();}Q(w,"readOperation");function U(p,V){const Y=new o(p,{bubbles:!1,cancelable:!1});V.dispatchEvent(Y);}Q(U,"fireAProgressEvent");function k(p,V,Y,R){switch(V){case"DataURL":{let m="data:";const _=C(Y||"application/octet-stream");_!=="failure"&&(m+=l(_)),m+=";base64,";const D=new c("latin1");for(const b of p)m+=I(D.write(b));return m+=I(D.end()),m}case"Text":{let m="failure";if(R&&(m=B(R)),m==="failure"&&Y){const _=C(Y);_!=="failure"&&(m=B(_.parameters.get("charset")));}return m==="failure"&&(m="UTF-8"),F(p,m)}case"ArrayBuffer":return M(p).buffer;case"BinaryString":{let m="";const _=new c("latin1");for(const D of p)m+=_.write(D);return m+=_.end(),m}}}Q(k,"packageData");function F(p,V){const Y=M(p),R=S(Y);let m=0;R!==null&&(V=R,m=R==="UTF-8"?3:2);const _=Y.slice(m);return new TextDecoder(V).decode(_)}Q(F,"decode");function S(p){const[V,Y,R]=p;return V===239&&Y===187&&R===191?"UTF-8":V===254&&Y===255?"UTF-16BE":V===255&&Y===254?"UTF-16LE":null}Q(S,"BOMSniffing");function M(p){const V=p.reduce((R,m)=>R+m.byteLength,0);let Y=0;return p.reduce((R,m)=>(R.set(m,Y),Y+=m.byteLength,R),new Uint8Array(V))}return Q(M,"combineByteSequences"),util$5={staticPropertyDescriptors:y,readOperation:w,fireAProgressEvent:U},util$5}Q(requireUtil$4,"requireUtil$4");var filereader,hasRequiredFilereader;function requireFilereader(){if(hasRequiredFilereader)return filereader;hasRequiredFilereader=1;const{staticPropertyDescriptors:e,readOperation:A,fireAProgressEvent:t}=requireUtil$4(),{kState:r,kError:n,kResult:o,kEvents:B,kAborted:l}=requireSymbols$2(),{webidl:C}=requireWebidl(),{kEnumerableProperty:f}=util$m,I=class I extends EventTarget{constructor(){super(),this[r]="empty",this[o]=null,this[n]=null,this[B]={loadend:null,error:null,abort:null,load:null,progress:null,loadstart:null};}readAsArrayBuffer(w){C.brandCheck(this,I),C.argumentLengthCheck(arguments,1,{header:"FileReader.readAsArrayBuffer"}),w=C.converters.Blob(w,{strict:!1}),A(this,w,"ArrayBuffer");}readAsBinaryString(w){C.brandCheck(this,I),C.argumentLengthCheck(arguments,1,{header:"FileReader.readAsBinaryString"}),w=C.converters.Blob(w,{strict:!1}),A(this,w,"BinaryString");}readAsText(w,U=void 0){C.brandCheck(this,I),C.argumentLengthCheck(arguments,1,{header:"FileReader.readAsText"}),w=C.converters.Blob(w,{strict:!1}),U!==void 0&&(U=C.converters.DOMString(U)),A(this,w,"Text",U);}readAsDataURL(w){C.brandCheck(this,I),C.argumentLengthCheck(arguments,1,{header:"FileReader.readAsDataURL"}),w=C.converters.Blob(w,{strict:!1}),A(this,w,"DataURL");}abort(){if(this[r]==="empty"||this[r]==="done"){this[o]=null;return}this[r]==="loading"&&(this[r]="done",this[o]=null),this[l]=!0,t("abort",this),this[r]!=="loading"&&t("loadend",this);}get readyState(){switch(C.brandCheck(this,I),this[r]){case"empty":return this.EMPTY;case"loading":return this.LOADING;case"done":return this.DONE}}get result(){return C.brandCheck(this,I),this[o]}get error(){return C.brandCheck(this,I),this[n]}get onloadend(){return C.brandCheck(this,I),this[B].loadend}set onloadend(w){C.brandCheck(this,I),this[B].loadend&&this.removeEventListener("loadend",this[B].loadend),typeof w=="function"?(this[B].loadend=w,this.addEventListener("loadend",w)):this[B].loadend=null;}get onerror(){return C.brandCheck(this,I),this[B].error}set onerror(w){C.brandCheck(this,I),this[B].error&&this.removeEventListener("error",this[B].error),typeof w=="function"?(this[B].error=w,this.addEventListener("error",w)):this[B].error=null;}get onloadstart(){return C.brandCheck(this,I),this[B].loadstart}set onloadstart(w){C.brandCheck(this,I),this[B].loadstart&&this.removeEventListener("loadstart",this[B].loadstart),typeof w=="function"?(this[B].loadstart=w,this.addEventListener("loadstart",w)):this[B].loadstart=null;}get onprogress(){return C.brandCheck(this,I),this[B].progress}set onprogress(w){C.brandCheck(this,I),this[B].progress&&this.removeEventListener("progress",this[B].progress),typeof w=="function"?(this[B].progress=w,this.addEventListener("progress",w)):this[B].progress=null;}get onload(){return C.brandCheck(this,I),this[B].load}set onload(w){C.brandCheck(this,I),this[B].load&&this.removeEventListener("load",this[B].load),typeof w=="function"?(this[B].load=w,this.addEventListener("load",w)):this[B].load=null;}get onabort(){return C.brandCheck(this,I),this[B].abort}set onabort(w){C.brandCheck(this,I),this[B].abort&&this.removeEventListener("abort",this[B].abort),typeof w=="function"?(this[B].abort=w,this.addEventListener("abort",w)):this[B].abort=null;}};Q(I,"FileReader");let c=I;return c.EMPTY=c.prototype.EMPTY=0,c.LOADING=c.prototype.LOADING=1,c.DONE=c.prototype.DONE=2,Object.defineProperties(c.prototype,{EMPTY:e,LOADING:e,DONE:e,readAsArrayBuffer:f,readAsBinaryString:f,readAsText:f,readAsDataURL:f,abort:f,readyState:f,result:f,error:f,onloadstart:f,onprogress:f,onload:f,onabort:f,onerror:f,onloadend:f,[Symbol.toStringTag]:{value:"FileReader",writable:!1,enumerable:!1,configurable:!0}}),Object.defineProperties(c,{EMPTY:e,LOADING:e,DONE:e}),filereader={FileReader:c},filereader}Q(requireFilereader,"requireFilereader");var symbols$1,hasRequiredSymbols$1;function requireSymbols$1(){return hasRequiredSymbols$1||(hasRequiredSymbols$1=1,symbols$1={kConstruct:symbols$4.kConstruct}),symbols$1}Q(requireSymbols$1,"requireSymbols$1");var util$4,hasRequiredUtil$3;function requireUtil$3(){if(hasRequiredUtil$3)return util$4;hasRequiredUtil$3=1;const e=require$$0__default,{URLSerializer:A}=requireDataUrl(),{isValidHeaderName:t}=requireUtil$5();function r(o,B,l=!1){const C=A(o,l),f=A(B,l);return C===f}Q(r,"urlEquals");function n(o){e(o!==null);const B=[];for(let l of o.split(","))l=l.trim(),t(l)&&B.push(l);return B}return Q(n,"getFieldValues"),util$4={urlEquals:r,getFieldValues:n},util$4}Q(requireUtil$3,"requireUtil$3");var cache,hasRequiredCache;function requireCache(){var p,V,it,R,he,_,Ot,b,lt;if(hasRequiredCache)return cache;hasRequiredCache=1;const{kConstruct:e}=requireSymbols$1(),{urlEquals:A,getFieldValues:t}=requireUtil$3(),{kEnumerableProperty:r,isDisturbed:n}=util$m,{webidl:o}=requireWebidl(),{Response:B,cloneResponse:l,fromInnerResponse:C}=requireResponse(),{Request:f,fromInnerRequest:c}=requireRequest(),{kState:I}=requireSymbols$3(),{fetching:y}=requireFetch(),{urlIsHttpHttpsScheme:w,createDeferredPromise:U,readAllBytes:k}=requireUtil$5(),F=require$$0__default,J=class J{constructor(){FA(this,V);FA(this,R);FA(this,_);FA(this,b);FA(this,p,void 0);arguments[0]!==e&&o.illegalConstructor(),DA(this,p,arguments[1]);}async match(v,Z={}){o.brandCheck(this,J),o.argumentLengthCheck(arguments,1,{header:"Cache.match"}),v=o.converters.RequestInfo(v),Z=o.converters.CacheQueryOptions(Z);const X=xA(this,b,lt).call(this,v,Z,1);if(X.length!==0)return X[0]}async matchAll(v=void 0,Z={}){return o.brandCheck(this,J),v!==void 0&&(v=o.converters.RequestInfo(v)),Z=o.converters.CacheQueryOptions(Z),xA(this,b,lt).call(this,v,Z)}async add(v){o.brandCheck(this,J),o.argumentLengthCheck(arguments,1,{header:"Cache.add"}),v=o.converters.RequestInfo(v);const Z=[v];return await this.addAll(Z)}async addAll(v){o.brandCheck(this,J),o.argumentLengthCheck(arguments,1,{header:"Cache.addAll"});const Z=[],X=[];for(let rA of v){if(rA===void 0)throw o.errors.conversionFailed({prefix:"Cache.addAll",argument:"Argument 1",types:["undefined is not allowed"]});if(rA=o.converters.RequestInfo(rA),typeof rA=="string")continue;const QA=rA[I];if(!w(QA.url)||QA.method!=="GET")throw o.errors.exception({header:"Cache.addAll",message:"Expected http/s scheme when method is not GET."})}const K=[];for(const rA of v){const QA=new f(rA)[I];if(!w(QA.url))throw o.errors.exception({header:"Cache.addAll",message:"Expected http/s scheme."});QA.initiator="fetch",QA.destination="subresource",X.push(QA);const $=U();K.push(y({request:QA,processResponse(AA){if(AA.type==="error"||AA.status===206||AA.status<200||AA.status>299)$.reject(o.errors.exception({header:"Cache.addAll",message:"Received an invalid status code or the request failed."}));else if(AA.headersList.contains("vary")){const oA=t(AA.headersList.get("vary"));for(const hA of oA)if(hA==="*"){$.reject(o.errors.exception({header:"Cache.addAll",message:"invalid vary field value"}));for(const fA of K)fA.abort();return}}},processResponseEndOfBody(AA){if(AA.aborted){$.reject(new DOMException("aborted","AbortError"));return}$.resolve(AA);}})),Z.push($.promise);}const tA=await Promise.all(Z),cA=[];let sA=0;for(const rA of tA){const QA={type:"put",request:X[sA],response:rA};cA.push(QA),sA++;}const aA=U();let bA=null;try{xA(this,V,it).call(this,cA);}catch(rA){bA=rA;}return queueMicrotask(()=>{bA===null?aA.resolve(void 0):aA.reject(bA);}),aA.promise}async put(v,Z){o.brandCheck(this,J),o.argumentLengthCheck(arguments,2,{header:"Cache.put"}),v=o.converters.RequestInfo(v),Z=o.converters.Response(Z);let X=null;if(v instanceof f?X=v[I]:X=new f(v)[I],!w(X.url)||X.method!=="GET")throw o.errors.exception({header:"Cache.put",message:"Expected an http/s scheme when method is not GET"});const K=Z[I];if(K.status===206)throw o.errors.exception({header:"Cache.put",message:"Got 206 status"});if(K.headersList.contains("vary")){const QA=t(K.headersList.get("vary"));for(const $ of QA)if($==="*")throw o.errors.exception({header:"Cache.put",message:"Got * vary field value"})}if(K.body&&(n(K.body.stream)||K.body.stream.locked))throw o.errors.exception({header:"Cache.put",message:"Response body is locked or disturbed"});const gA=l(K),tA=U();if(K.body!=null){const $=K.body.stream.getReader();k($).then(tA.resolve,tA.reject);}else tA.resolve(void 0);const cA=[],sA={type:"put",request:X,response:gA};cA.push(sA);const aA=await tA.promise;gA.body!=null&&(gA.body.source=aA);const bA=U();let rA=null;try{xA(this,V,it).call(this,cA);}catch(QA){rA=QA;}return queueMicrotask(()=>{rA===null?bA.resolve():bA.reject(rA);}),bA.promise}async delete(v,Z={}){o.brandCheck(this,J),o.argumentLengthCheck(arguments,1,{header:"Cache.delete"}),v=o.converters.RequestInfo(v),Z=o.converters.CacheQueryOptions(Z);let X=null;if(v instanceof f){if(X=v[I],X.method!=="GET"&&!Z.ignoreMethod)return !1}else F(typeof v=="string"),X=new f(v)[I];const K=[],gA={type:"delete",request:X,options:Z};K.push(gA);const tA=U();let cA=null,sA;try{sA=xA(this,V,it).call(this,K);}catch(aA){cA=aA;}return queueMicrotask(()=>{cA===null?tA.resolve(!!sA?.length):tA.reject(cA);}),tA.promise}async keys(v=void 0,Z={}){o.brandCheck(this,J),v!==void 0&&(v=o.converters.RequestInfo(v)),Z=o.converters.CacheQueryOptions(Z);let X=null;if(v!==void 0)if(v instanceof f){if(X=v[I],X.method!=="GET"&&!Z.ignoreMethod)return []}else typeof v=="string"&&(X=new f(v)[I]);const K=U(),gA=[];if(v===void 0)for(const tA of x(this,p))gA.push(tA[0]);else {const tA=xA(this,R,he).call(this,X,Z);for(const cA of tA)gA.push(cA[0]);}return queueMicrotask(()=>{const tA=[];for(const cA of gA){const sA=c(cA,new AbortController().signal,"immutable",{settingsObject:cA.client});tA.push(sA);}K.resolve(Object.freeze(tA));}),K.promise}};p=new WeakMap,V=new WeakSet,it=Q(function(v){const Z=x(this,p),X=[...Z],K=[],gA=[];try{for(const tA of v){if(tA.type!=="delete"&&tA.type!=="put")throw o.errors.exception({header:"Cache.#batchCacheOperations",message:'operation type does not match "delete" or "put"'});if(tA.type==="delete"&&tA.response!=null)throw o.errors.exception({header:"Cache.#batchCacheOperations",message:"delete operation should not have an associated response"});if(xA(this,R,he).call(this,tA.request,tA.options,K).length)throw new DOMException("???","InvalidStateError");let cA;if(tA.type==="delete"){if(cA=xA(this,R,he).call(this,tA.request,tA.options),cA.length===0)return [];for(const sA of cA){const aA=Z.indexOf(sA);F(aA!==-1),Z.splice(aA,1);}}else if(tA.type==="put"){if(tA.response==null)throw o.errors.exception({header:"Cache.#batchCacheOperations",message:"put operation should have an associated response"});const sA=tA.request;if(!w(sA.url))throw o.errors.exception({header:"Cache.#batchCacheOperations",message:"expected http or https scheme"});if(sA.method!=="GET")throw o.errors.exception({header:"Cache.#batchCacheOperations",message:"not get method"});if(tA.options!=null)throw o.errors.exception({header:"Cache.#batchCacheOperations",message:"options must not be defined"});cA=xA(this,R,he).call(this,tA.request);for(const aA of cA){const bA=Z.indexOf(aA);F(bA!==-1),Z.splice(bA,1);}Z.push([tA.request,tA.response]),K.push([tA.request,tA.response]);}gA.push([tA.request,tA.response]);}return gA}catch(tA){throw x(this,p).length=0,DA(this,p,X),tA}},"#batchCacheOperations"),R=new WeakSet,he=Q(function(v,Z,X){const K=[],gA=X??x(this,p);for(const tA of gA){const[cA,sA]=tA;xA(this,_,Ot).call(this,v,cA,sA,Z)&&K.push(tA);}return K},"#queryCache"),_=new WeakSet,Ot=Q(function(v,Z,X=null,K){const gA=new URL(v.url),tA=new URL(Z.url);if(K?.ignoreSearch&&(tA.search="",gA.search=""),!A(gA,tA,!0))return !1;if(X==null||K?.ignoreVary||!X.headersList.contains("vary"))return !0;const cA=t(X.headersList.get("vary"));for(const sA of cA){if(sA==="*")return !1;const aA=Z.headersList.get(sA),bA=v.headersList.get(sA);if(aA!==bA)return !1}return !0},"#requestMatchesCachedItem"),b=new WeakSet,lt=Q(function(v,Z,X=1/0){let K=null;if(v!==void 0)if(v instanceof f){if(K=v[I],K.method!=="GET"&&!Z.ignoreMethod)return []}else typeof v=="string"&&(K=new f(v)[I]);const gA=[];if(v===void 0)for(const cA of x(this,p))gA.push(cA[1]);else {const cA=xA(this,R,he).call(this,K,Z);for(const sA of cA)gA.push(sA[1]);}const tA=[];for(const cA of gA){const sA=C(cA,"immutable",{settingsObject:{}});if(tA.push(sA.clone()),tA.length>=X)break}return Object.freeze(tA)},"#internalMatchAll"),Q(J,"Cache");let S=J;Object.defineProperties(S.prototype,{[Symbol.toStringTag]:{value:"Cache",configurable:!0},match:r,matchAll:r,add:r,addAll:r,put:r,delete:r,keys:r});const M=[{key:"ignoreSearch",converter:o.converters.boolean,defaultValue:!1},{key:"ignoreMethod",converter:o.converters.boolean,defaultValue:!1},{key:"ignoreVary",converter:o.converters.boolean,defaultValue:!1}];return o.converters.CacheQueryOptions=o.dictionaryConverter(M),o.converters.MultiCacheQueryOptions=o.dictionaryConverter([...M,{key:"cacheName",converter:o.converters.DOMString}]),o.converters.Response=o.interfaceConverter(B),o.converters["sequence<RequestInfo>"]=o.sequenceConverter(o.converters.RequestInfo),cache={Cache:S},cache}Q(requireCache,"requireCache");var cachestorage,hasRequiredCachestorage;function requireCachestorage(){var o;if(hasRequiredCachestorage)return cachestorage;hasRequiredCachestorage=1;const{kConstruct:e}=requireSymbols$1(),{Cache:A}=requireCache(),{webidl:t}=requireWebidl(),{kEnumerableProperty:r}=util$m,B=class B{constructor(){FA(this,o,new Map);arguments[0]!==e&&t.illegalConstructor();}async match(C,f={}){if(t.brandCheck(this,B),t.argumentLengthCheck(arguments,1,{header:"CacheStorage.match"}),C=t.converters.RequestInfo(C),f=t.converters.MultiCacheQueryOptions(f),f.cacheName!=null){if(x(this,o).has(f.cacheName)){const c=x(this,o).get(f.cacheName);return await new A(e,c).match(C,f)}}else for(const c of x(this,o).values()){const y=await new A(e,c).match(C,f);if(y!==void 0)return y}}async has(C){return t.brandCheck(this,B),t.argumentLengthCheck(arguments,1,{header:"CacheStorage.has"}),C=t.converters.DOMString(C),x(this,o).has(C)}async open(C){if(t.brandCheck(this,B),t.argumentLengthCheck(arguments,1,{header:"CacheStorage.open"}),C=t.converters.DOMString(C),x(this,o).has(C)){const c=x(this,o).get(C);return new A(e,c)}const f=[];return x(this,o).set(C,f),new A(e,f)}async delete(C){return t.brandCheck(this,B),t.argumentLengthCheck(arguments,1,{header:"CacheStorage.delete"}),C=t.converters.DOMString(C),x(this,o).delete(C)}async keys(){return t.brandCheck(this,B),[...x(this,o).keys()]}};o=new WeakMap,Q(B,"CacheStorage");let n=B;return Object.defineProperties(n.prototype,{[Symbol.toStringTag]:{value:"CacheStorage",configurable:!0},match:r,has:r,open:r,delete:r,keys:r}),cachestorage={CacheStorage:n},cachestorage}Q(requireCachestorage,"requireCachestorage");var constants$1,hasRequiredConstants$1;function requireConstants$1(){return hasRequiredConstants$1||(hasRequiredConstants$1=1,constants$1={maxAttributeValueSize:1024,maxNameValuePairSize:4096}),constants$1}Q(requireConstants$1,"requireConstants$1");var util$3,hasRequiredUtil$2;function requireUtil$2(){if(hasRequiredUtil$2)return util$3;hasRequiredUtil$2=1;const e=require$$0__default,{kHeadersList:A}=symbols$4;function t(k){for(let F=0;F<k.length;++F){const S=k.charCodeAt(F);if(S>=0&&S<=8||S>=10&&S<=31||S===127)return !0}return !1}Q(t,"isCTLExcludingHtab");function r(k){for(let F=0;F<k.length;++F){const S=k.charCodeAt(F);if(S<33||S>126||S===34||S===40||S===41||S===60||S===62||S===64||S===44||S===59||S===58||S===92||S===47||S===91||S===93||S===63||S===61||S===123||S===125)throw new Error("Invalid cookie name")}}Q(r,"validateCookieName");function n(k){let F=k.length,S=0;if(k[0]==='"'){if(F===1||k[F-1]!=='"')throw new Error("Invalid cookie value");--F,++S;}for(;S<F;){const M=k.charCodeAt(S++);if(M<33||M>126||M===34||M===44||M===59||M===92)throw new Error("Invalid cookie value")}}Q(n,"validateCookieValue");function o(k){for(let F=0;F<k.length;++F){const S=k.charCodeAt(F);if(S<32||S===127||S===59)throw new Error("Invalid cookie path")}}Q(o,"validateCookiePath");function B(k){if(k.startsWith("-")||k.endsWith(".")||k.endsWith("-"))throw new Error("Invalid cookie domain")}Q(B,"validateCookieDomain");const l=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],C=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],f=Array(61).fill(0).map((k,F)=>F.toString().padStart(2,"0"));function c(k){return typeof k=="number"&&(k=new Date(k)),`${l[k.getUTCDay()]}, ${f[k.getUTCDate()]} ${C[k.getUTCMonth()]} ${k.getUTCFullYear()} ${f[k.getUTCHours()]}:${f[k.getUTCMinutes()]}:${f[k.getUTCSeconds()]} GMT`}Q(c,"toIMFDate");function I(k){if(k<0)throw new Error("Invalid cookie max-age")}Q(I,"validateCookieMaxAge");function y(k){if(k.name.length===0)return null;r(k.name),n(k.value);const F=[`${k.name}=${k.value}`];k.name.startsWith("__Secure-")&&(k.secure=!0),k.name.startsWith("__Host-")&&(k.secure=!0,k.domain=null,k.path="/"),k.secure&&F.push("Secure"),k.httpOnly&&F.push("HttpOnly"),typeof k.maxAge=="number"&&(I(k.maxAge),F.push(`Max-Age=${k.maxAge}`)),k.domain&&(B(k.domain),F.push(`Domain=${k.domain}`)),k.path&&(o(k.path),F.push(`Path=${k.path}`)),k.expires&&k.expires.toString()!=="Invalid Date"&&F.push(`Expires=${c(k.expires)}`),k.sameSite&&F.push(`SameSite=${k.sameSite}`);for(const S of k.unparsed){if(!S.includes("="))throw new Error("Invalid unparsed");const[M,...p]=S.split("=");F.push(`${M.trim()}=${p.join("=")}`);}return F.join("; ")}Q(y,"stringify");let w;function U(k){if(k[A])return k[A];w||(w=Object.getOwnPropertySymbols(k).find(S=>S.description==="headers list"),e(w,"Headers cannot be parsed"));const F=k[w];return e(F),F}return Q(U,"getHeadersList"),util$3={isCTLExcludingHtab:t,validateCookieName:r,validateCookiePath:o,validateCookieValue:n,toIMFDate:c,stringify:y,getHeadersList:U},util$3}Q(requireUtil$2,"requireUtil$2");var parse,hasRequiredParse;function requireParse(){if(hasRequiredParse)return parse;hasRequiredParse=1;const{maxNameValuePairSize:e,maxAttributeValueSize:A}=requireConstants$1(),{isCTLExcludingHtab:t}=requireUtil$2(),{collectASequenceOfCodePointsFast:r}=requireDataUrl(),n=require$$0__default;function o(l){if(t(l))return null;let C="",f="",c="",I="";if(l.includes(";")){const y={position:0};C=r(";",l,y),f=l.slice(y.position);}else C=l;if(!C.includes("="))I=C;else {const y={position:0};c=r("=",C,y),I=C.slice(y.position+1);}return c=c.trim(),I=I.trim(),c.length+I.length>e?null:{name:c,value:I,...B(f)}}Q(o,"parseSetCookie");function B(l,C={}){if(l.length===0)return C;n(l[0]===";"),l=l.slice(1);let f="";l.includes(";")?(f=r(";",l,{position:0}),l=l.slice(f.length)):(f=l,l="");let c="",I="";if(f.includes("=")){const w={position:0};c=r("=",f,w),I=f.slice(w.position+1);}else c=f;if(c=c.trim(),I=I.trim(),I.length>A)return B(l,C);const y=c.toLowerCase();if(y==="expires"){const w=new Date(I);C.expires=w;}else if(y==="max-age"){const w=I.charCodeAt(0);if((w<48||w>57)&&I[0]!=="-"||!/^\d+$/.test(I))return B(l,C);const U=Number(I);C.maxAge=U;}else if(y==="domain"){let w=I;w[0]==="."&&(w=w.slice(1)),w=w.toLowerCase(),C.domain=w;}else if(y==="path"){let w="";I.length===0||I[0]!=="/"?w="/":w=I,C.path=w;}else if(y==="secure")C.secure=!0;else if(y==="httponly")C.httpOnly=!0;else if(y==="samesite"){let w="Default";const U=I.toLowerCase();U.includes("none")&&(w="None"),U.includes("strict")&&(w="Strict"),U.includes("lax")&&(w="Lax"),C.sameSite=w;}else C.unparsed??(C.unparsed=[]),C.unparsed.push(`${c}=${I}`);return B(l,C)}return Q(B,"parseUnparsedAttributes"),parse={parseSetCookie:o,parseUnparsedAttributes:B},parse}Q(requireParse,"requireParse");var cookies,hasRequiredCookies;function requireCookies(){if(hasRequiredCookies)return cookies;hasRequiredCookies=1;const{parseSetCookie:e}=requireParse(),{stringify:A,getHeadersList:t}=requireUtil$2(),{webidl:r}=requireWebidl(),{Headers:n}=requireHeaders();function o(f){r.argumentLengthCheck(arguments,1,{header:"getCookies"}),r.brandCheck(f,n,{strict:!1});const c=f.get("cookie"),I={};if(!c)return I;for(const y of c.split(";")){const[w,...U]=y.split("=");I[w.trim()]=U.join("=");}return I}Q(o,"getCookies");function B(f,c,I){r.argumentLengthCheck(arguments,2,{header:"deleteCookie"}),r.brandCheck(f,n,{strict:!1}),c=r.converters.DOMString(c),I=r.converters.DeleteCookieAttributes(I),C(f,{name:c,value:"",expires:new Date(0),...I});}Q(B,"deleteCookie");function l(f){r.argumentLengthCheck(arguments,1,{header:"getSetCookies"}),r.brandCheck(f,n,{strict:!1});const c=t(f).cookies;return c?c.map(I=>e(Array.isArray(I)?I[1]:I)):[]}Q(l,"getSetCookies");function C(f,c){r.argumentLengthCheck(arguments,2,{header:"setCookie"}),r.brandCheck(f,n,{strict:!1}),c=r.converters.Cookie(c),A(c)&&f.append("Set-Cookie",A(c));}return Q(C,"setCookie"),r.converters.DeleteCookieAttributes=r.dictionaryConverter([{converter:r.nullableConverter(r.converters.DOMString),key:"path",defaultValue:null},{converter:r.nullableConverter(r.converters.DOMString),key:"domain",defaultValue:null}]),r.converters.Cookie=r.dictionaryConverter([{converter:r.converters.DOMString,key:"name"},{converter:r.converters.DOMString,key:"value"},{converter:r.nullableConverter(f=>typeof f=="number"?r.converters["unsigned long long"](f):new Date(f)),key:"expires",defaultValue:null},{converter:r.nullableConverter(r.converters["long long"]),key:"maxAge",defaultValue:null},{converter:r.nullableConverter(r.converters.DOMString),key:"domain",defaultValue:null},{converter:r.nullableConverter(r.converters.DOMString),key:"path",defaultValue:null},{converter:r.nullableConverter(r.converters.boolean),key:"secure",defaultValue:null},{converter:r.nullableConverter(r.converters.boolean),key:"httpOnly",defaultValue:null},{converter:r.converters.USVString,key:"sameSite",allowedValues:["Strict","Lax","None"]},{converter:r.sequenceConverter(r.converters.DOMString),key:"unparsed",defaultValue:[]}]),cookies={getCookies:o,deleteCookie:B,getSetCookies:l,setCookie:C},cookies}Q(requireCookies,"requireCookies");var events,hasRequiredEvents;function requireEvents(){var l,f,I;if(hasRequiredEvents)return events;hasRequiredEvents=1;const{webidl:e}=requireWebidl(),{kEnumerableProperty:A}=util$m,{MessagePort:t}=require$$2__default,C=class C extends Event{constructor(k,F={}){e.argumentLengthCheck(arguments,1,{header:"MessageEvent constructor"}),k=e.converters.DOMString(k),F=e.converters.MessageEventInit(F);super(k,F);FA(this,l,void 0);DA(this,l,F);}get data(){return e.brandCheck(this,C),x(this,l).data}get origin(){return e.brandCheck(this,C),x(this,l).origin}get lastEventId(){return e.brandCheck(this,C),x(this,l).lastEventId}get source(){return e.brandCheck(this,C),x(this,l).source}get ports(){return e.brandCheck(this,C),Object.isFrozen(x(this,l).ports)||Object.freeze(x(this,l).ports),x(this,l).ports}initMessageEvent(k,F=!1,S=!1,M=null,p="",V="",Y=null,R=[]){return e.brandCheck(this,C),e.argumentLengthCheck(arguments,1,{header:"MessageEvent.initMessageEvent"}),new C(k,{bubbles:F,cancelable:S,data:M,origin:p,lastEventId:V,source:Y,ports:R})}};l=new WeakMap,Q(C,"MessageEvent");let r=C;const c=class c extends Event{constructor(k,F={}){e.argumentLengthCheck(arguments,1,{header:"CloseEvent constructor"}),k=e.converters.DOMString(k),F=e.converters.CloseEventInit(F);super(k,F);FA(this,f,void 0);DA(this,f,F);}get wasClean(){return e.brandCheck(this,c),x(this,f).wasClean}get code(){return e.brandCheck(this,c),x(this,f).code}get reason(){return e.brandCheck(this,c),x(this,f).reason}};f=new WeakMap,Q(c,"CloseEvent");let n=c;const y=class y extends Event{constructor(k,F){e.argumentLengthCheck(arguments,1,{header:"ErrorEvent constructor"});super(k,F);FA(this,I,void 0);k=e.converters.DOMString(k),F=e.converters.ErrorEventInit(F??{}),DA(this,I,F);}get message(){return e.brandCheck(this,y),x(this,I).message}get filename(){return e.brandCheck(this,y),x(this,I).filename}get lineno(){return e.brandCheck(this,y),x(this,I).lineno}get colno(){return e.brandCheck(this,y),x(this,I).colno}get error(){return e.brandCheck(this,y),x(this,I).error}};I=new WeakMap,Q(y,"ErrorEvent");let o=y;Object.defineProperties(r.prototype,{[Symbol.toStringTag]:{value:"MessageEvent",configurable:!0},data:A,origin:A,lastEventId:A,source:A,ports:A,initMessageEvent:A}),Object.defineProperties(n.prototype,{[Symbol.toStringTag]:{value:"CloseEvent",configurable:!0},reason:A,code:A,wasClean:A}),Object.defineProperties(o.prototype,{[Symbol.toStringTag]:{value:"ErrorEvent",configurable:!0},message:A,filename:A,lineno:A,colno:A,error:A}),e.converters.MessagePort=e.interfaceConverter(t),e.converters["sequence<MessagePort>"]=e.sequenceConverter(e.converters.MessagePort);const B=[{key:"bubbles",converter:e.converters.boolean,defaultValue:!1},{key:"cancelable",converter:e.converters.boolean,defaultValue:!1},{key:"composed",converter:e.converters.boolean,defaultValue:!1}];return e.converters.MessageEventInit=e.dictionaryConverter([...B,{key:"data",converter:e.converters.any,defaultValue:null},{key:"origin",converter:e.converters.USVString,defaultValue:""},{key:"lastEventId",converter:e.converters.DOMString,defaultValue:""},{key:"source",converter:e.nullableConverter(e.converters.MessagePort),defaultValue:null},{key:"ports",converter:e.converters["sequence<MessagePort>"],get defaultValue(){return []}}]),e.converters.CloseEventInit=e.dictionaryConverter([...B,{key:"wasClean",converter:e.converters.boolean,defaultValue:!1},{key:"code",converter:e.converters["unsigned short"],defaultValue:0},{key:"reason",converter:e.converters.USVString,defaultValue:""}]),e.converters.ErrorEventInit=e.dictionaryConverter([...B,{key:"message",converter:e.converters.DOMString,defaultValue:""},{key:"filename",converter:e.converters.USVString,defaultValue:""},{key:"lineno",converter:e.converters["unsigned long"],defaultValue:0},{key:"colno",converter:e.converters["unsigned long"],defaultValue:0},{key:"error",converter:e.converters.any}]),events={MessageEvent:r,CloseEvent:n,ErrorEvent:o},events}Q(requireEvents,"requireEvents");var constants,hasRequiredConstants;function requireConstants(){if(hasRequiredConstants)return constants;hasRequiredConstants=1;const e="258EAFA5-E914-47DA-95CA-C5AB0DC85B11",A={enumerable:!0,writable:!1,configurable:!1},t={CONNECTING:0,OPEN:1,CLOSING:2,CLOSED:3},r={NOT_SENT:0,PROCESSING:1,SENT:2},n={CONTINUATION:0,TEXT:1,BINARY:2,CLOSE:8,PING:9,PONG:10},o=2**16-1,B={INFO:0,PAYLOADLENGTH_16:2,PAYLOADLENGTH_64:3,READ_DATA:4},l=Buffer.allocUnsafe(0);return constants={uid:e,sentCloseFrameState:r,staticPropertyDescriptors:A,states:t,opcodes:n,maxUnsigned16Bit:o,parserStates:B,emptyBuffer:l},constants}Q(requireConstants,"requireConstants");var symbols,hasRequiredSymbols;function requireSymbols(){return hasRequiredSymbols||(hasRequiredSymbols=1,symbols={kWebSocketURL:Symbol("url"),kReadyState:Symbol("ready state"),kController:Symbol("controller"),kResponse:Symbol("response"),kBinaryType:Symbol("binary type"),kSentClose:Symbol("sent close"),kReceivedClose:Symbol("received close"),kByteParser:Symbol("byte parser")}),symbols}Q(requireSymbols,"requireSymbols");var util$2,hasRequiredUtil$1;function requireUtil$1(){if(hasRequiredUtil$1)return util$2;hasRequiredUtil$1=1;const{kReadyState:e,kController:A,kResponse:t,kBinaryType:r,kWebSocketURL:n}=requireSymbols(),{states:o,opcodes:B}=requireConstants(),{MessageEvent:l,ErrorEvent:C}=requireEvents();function f(p){return p[e]===o.CONNECTING}Q(f,"isConnecting");function c(p){return p[e]===o.OPEN}Q(c,"isEstablished");function I(p){return p[e]===o.CLOSING}Q(I,"isClosing");function y(p){return p[e]===o.CLOSED}Q(y,"isClosed");function w(p,V,Y=Event,R={}){const m=new Y(p,R);V.dispatchEvent(m);}Q(w,"fireEvent");const U=new TextDecoder("utf-8",{fatal:!0});function k(p,V,Y){if(p[e]!==o.OPEN)return;let R;if(V===B.TEXT)try{R=U.decode(Y);}catch{M(p,"Received invalid UTF-8 in text frame.");return}else V===B.BINARY&&(p[r]==="blob"?R=new Blob([Y]):R=new Uint8Array(Y).buffer);w("message",p,l,{origin:p[n].origin,data:R});}Q(k,"websocketMessageReceived");function F(p){if(p.length===0)return !1;for(let V=0;V<p.length;++V){const Y=p.charCodeAt(V);if(Y<33||Y>126||Y===34||Y===40||Y===41||Y===44||Y===47||Y===58||Y===59||Y===60||Y===61||Y===62||Y===63||Y===64||Y===91||Y===92||Y===93||Y===123||Y===125)return !1}return !0}Q(F,"isValidSubprotocol");function S(p){return p>=1e3&&p<1015?p!==1004&&p!==1005&&p!==1006:p>=3e3&&p<=4999}Q(S,"isValidStatusCode");function M(p,V){const{[A]:Y,[t]:R}=p;Y.abort(),R?.socket&&!R.socket.destroyed&&R.socket.destroy(),V&&w("error",p,C,{error:new Error(V)});}return Q(M,"failWebsocketConnection"),util$2={isConnecting:f,isEstablished:c,isClosing:I,isClosed:y,fireEvent:w,isValidSubprotocol:F,isValidStatusCode:S,failWebsocketConnection:M,websocketMessageReceived:k},util$2}Q(requireUtil$1,"requireUtil$1");var connection,hasRequiredConnection;function requireConnection(){if(hasRequiredConnection)return connection;hasRequiredConnection=1;const{uid:e,states:A,sentCloseFrameState:t}=requireConstants(),{kReadyState:r,kSentClose:n,kByteParser:o,kReceivedClose:B}=requireSymbols(),{fireEvent:l,failWebsocketConnection:C}=requireUtil$1(),{channels:f}=diagnostics,{CloseEvent:c}=requireEvents(),{makeRequest:I}=requireRequest(),{fetching:y}=requireFetch(),{Headers:w}=requireHeaders(),{getDecodeSplit:U}=requireUtil$5(),{kHeadersList:k}=symbols$4;let F;try{F=require("node:crypto");}catch{}function S(Y,R,m,_,D){const b=Y;b.protocol=Y.protocol==="ws:"?"http:":"https:";const W=I({urlList:[b],serviceWorkers:"none",referrer:"no-referrer",mode:"websocket",credentials:"include",cache:"no-store",redirect:"error"});if(D.headers){const Z=new w(D.headers)[k];W.headersList=Z;}const J=F.randomBytes(16).toString("base64");W.headersList.append("sec-websocket-key",J),W.headersList.append("sec-websocket-version","13");for(const Z of R)W.headersList.append("sec-websocket-protocol",Z);const N="";return y({request:W,useParallelQueue:!0,dispatcher:D.dispatcher,processResponse(Z){if(Z.type==="error"||Z.status!==101){C(m,"Received network error or non-101 status code.");return}if(R.length!==0&&!Z.headersList.get("Sec-WebSocket-Protocol")){C(m,"Server did not respond with sent protocols.");return}if(Z.headersList.get("Upgrade")?.toLowerCase()!=="websocket"){C(m,'Server did not set Upgrade header to "websocket".');return}if(Z.headersList.get("Connection")?.toLowerCase()!=="upgrade"){C(m,'Server did not set Connection header to "upgrade".');return}const X=Z.headersList.get("Sec-WebSocket-Accept"),K=F.createHash("sha1").update(J+e).digest("base64");if(X!==K){C(m,"Incorrect hash received in Sec-WebSocket-Accept header.");return}const gA=Z.headersList.get("Sec-WebSocket-Extensions");if(gA!==null&&gA!==N){C(m,"Received different permessage-deflate than the one set.");return}const tA=Z.headersList.get("Sec-WebSocket-Protocol");if(tA!==null&&!U("sec-websocket-protocol",W.headersList).includes(tA)){C(m,"Protocol was not set in the opening handshake.");return}Z.socket.on("data",M),Z.socket.on("close",p),Z.socket.on("error",V),f.open.hasSubscribers&&f.open.publish({address:Z.socket.address(),protocol:tA,extensions:gA}),_(Z);}})}Q(S,"establishWebSocketConnection");function M(Y){this.ws[o].write(Y)||this.pause();}Q(M,"onSocketData");function p(){const{ws:Y}=this,R=Y[n]===t.SENT&&Y[B];let m=1005,_="";const D=Y[o].closingInfo;D?(m=D.code??1005,_=D.reason):Y[n]!==t.SENT&&(m=1006),Y[r]=A.CLOSED,l("close",Y,c,{wasClean:R,code:m,reason:_}),f.close.hasSubscribers&&f.close.publish({websocket:Y,code:m,reason:_});}Q(p,"onSocketClose");function V(Y){const{ws:R}=this;R[r]=A.CLOSING,f.socketError.hasSubscribers&&f.socketError.publish(Y),this.destroy();}return Q(V,"onSocketError"),connection={establishWebSocketConnection:S},connection}Q(requireConnection,"requireConnection");var frame,hasRequiredFrame;function requireFrame(){if(hasRequiredFrame)return frame;hasRequiredFrame=1;const{maxUnsigned16Bit:e}=requireConstants();let A;try{A=require("node:crypto");}catch{}const r=class r{constructor(o){this.frameData=o,this.maskKey=A.randomBytes(4);}createFrame(o){const B=this.frameData?.byteLength??0;let l=B,C=6;B>e?(C+=8,l=127):B>125&&(C+=2,l=126);const f=Buffer.allocUnsafe(B+C);f[0]=f[1]=0,f[0]|=128,f[0]=(f[0]&240)+o;/*! ws. MIT License. Einar Otto Stangvik <einaros@gmail.com> */f[C-4]=this.maskKey[0],f[C-3]=this.maskKey[1],f[C-2]=this.maskKey[2],f[C-1]=this.maskKey[3],f[1]=l,l===126?f.writeUInt16BE(B,2):l===127&&(f[2]=f[3]=0,f.writeUIntBE(B,4,6)),f[1]|=128;for(let c=0;c<B;c++)f[C+c]=this.frameData[c]^this.maskKey[c%4];return f}};Q(r,"WebsocketFrameSend");let t=r;return frame={WebsocketFrameSend:t},frame}Q(requireFrame,"requireFrame");var receiver,hasRequiredReceiver;function requireReceiver(){var S,M,p,V,Y;if(hasRequiredReceiver)return receiver;hasRequiredReceiver=1;const{Writable:e}=Stream__default,{parserStates:A,opcodes:t,states:r,emptyBuffer:n,sentCloseFrameState:o}=requireConstants(),{kReadyState:B,kSentClose:l,kResponse:C,kReceivedClose:f}=requireSymbols(),{channels:c}=diagnostics,{isValidStatusCode:I,failWebsocketConnection:y,websocketMessageReceived:w}=requireUtil$1(),{WebsocketFrameSend:U}=requireFrame(),k=new TextDecoder("utf-8",{fatal:!0}),R=class R extends e{constructor(D){super();FA(this,S,[]);FA(this,M,0);FA(this,p,A.INFO);FA(this,V,{});FA(this,Y,[]);this.ws=D;}_write(D,b,W){x(this,S).push(D),DA(this,M,x(this,M)+D.length),this.run(W);}run(D){var b;for(;;){if(x(this,p)===A.INFO){if(x(this,M)<2)return D();const W=this.consume(2);if(x(this,V).fin=(W[0]&128)!==0,x(this,V).opcode=W[0]&15,(b=x(this,V)).originalOpcode??(b.originalOpcode=x(this,V).opcode),x(this,V).fragmented=!x(this,V).fin&&x(this,V).opcode!==t.CONTINUATION,x(this,V).fragmented&&x(this,V).opcode!==t.BINARY&&x(this,V).opcode!==t.TEXT){y(this.ws,"Invalid frame type was fragmented.");return}const J=W[1]&127;if(J<=125?(x(this,V).payloadLength=J,DA(this,p,A.READ_DATA)):J===126?DA(this,p,A.PAYLOADLENGTH_16):J===127&&DA(this,p,A.PAYLOADLENGTH_64),x(this,V).fragmented&&J>125){y(this.ws,"Fragmented frame exceeded 125 bytes.");return}else if((x(this,V).opcode===t.PING||x(this,V).opcode===t.PONG||x(this,V).opcode===t.CLOSE)&&J>125){y(this.ws,"Payload length for control frame exceeded 125 bytes.");return}else if(x(this,V).opcode===t.CLOSE){if(J===1){y(this.ws,"Received close frame with a 1-byte body.");return}const N=this.consume(J);if(x(this,V).closeInfo=this.parseCloseBody(N),this.ws[l]!==o.SENT){let v=n;x(this,V).closeInfo.code&&(v=Buffer.allocUnsafe(2),v.writeUInt16BE(x(this,V).closeInfo.code,0));const Z=new U(v);this.ws[C].socket.write(Z.createFrame(t.CLOSE),X=>{X||(this.ws[l]=o.SENT);});}this.ws[B]=r.CLOSING,this.ws[f]=!0,this.end();return}else if(x(this,V).opcode===t.PING){const N=this.consume(J);if(!this.ws[f]){const v=new U(N);this.ws[C].socket.write(v.createFrame(t.PONG)),c.ping.hasSubscribers&&c.ping.publish({payload:N});}if(DA(this,p,A.INFO),x(this,M)>0)continue;D();return}else if(x(this,V).opcode===t.PONG){const N=this.consume(J);if(c.pong.hasSubscribers&&c.pong.publish({payload:N}),x(this,M)>0)continue;D();return}}else if(x(this,p)===A.PAYLOADLENGTH_16){if(x(this,M)<2)return D();const W=this.consume(2);x(this,V).payloadLength=W.readUInt16BE(0),DA(this,p,A.READ_DATA);}else if(x(this,p)===A.PAYLOADLENGTH_64){if(x(this,M)<8)return D();const W=this.consume(8),J=W.readUInt32BE(0);if(J>2**31-1){y(this.ws,"Received payload length > 2^31 bytes.");return}const N=W.readUInt32BE(4);x(this,V).payloadLength=(J<<8)+N,DA(this,p,A.READ_DATA);}else if(x(this,p)===A.READ_DATA){if(x(this,M)<x(this,V).payloadLength)return D();if(x(this,M)>=x(this,V).payloadLength){const W=this.consume(x(this,V).payloadLength);if(x(this,Y).push(W),!x(this,V).fragmented||x(this,V).fin&&x(this,V).opcode===t.CONTINUATION){const J=Buffer.concat(x(this,Y));w(this.ws,x(this,V).originalOpcode,J),DA(this,V,{}),x(this,Y).length=0;}DA(this,p,A.INFO);}}if(x(this,M)===0){D();break}}}consume(D){if(D>x(this,M))return null;if(D===0)return n;if(x(this,S)[0].length===D)return DA(this,M,x(this,M)-x(this,S)[0].length),x(this,S).shift();const b=Buffer.allocUnsafe(D);let W=0;for(;W!==D;){const J=x(this,S)[0],{length:N}=J;if(N+W===D){b.set(x(this,S).shift(),W);break}else if(N+W>D){b.set(J.subarray(0,D-W),W),x(this,S)[0]=J.subarray(D-W);break}else b.set(x(this,S).shift(),W),W+=J.length;}return DA(this,M,x(this,M)-D),b}parseCloseBody(D){let b;D.length>=2&&(b=D.readUInt16BE(0));let W=D.subarray(2);if(W[0]===239&&W[1]===187&&W[2]===191&&(W=W.subarray(3)),b!==void 0&&!I(b))return null;try{W=k.decode(W);}catch{return null}return {code:b,reason:W}}get closingInfo(){return x(this,V).closeInfo}};S=new WeakMap,M=new WeakMap,p=new WeakMap,V=new WeakMap,Y=new WeakMap,Q(R,"ByteParser");let F=R;return receiver={ByteParser:F},receiver}Q(requireReceiver,"requireReceiver");var websocket,hasRequiredWebsocket;function requireWebsocket(){var Z,X,K,gA,tA,Pt;if(hasRequiredWebsocket)return websocket;hasRequiredWebsocket=1;const{webidl:e}=requireWebidl(),{URLSerializer:A}=requireDataUrl(),{getGlobalOrigin:t}=requireGlobal(),{staticPropertyDescriptors:r,states:n,sentCloseFrameState:o,opcodes:B,emptyBuffer:l}=requireConstants(),{kWebSocketURL:C,kReadyState:f,kController:c,kBinaryType:I,kResponse:y,kSentClose:w,kByteParser:U}=requireSymbols(),{isConnecting:k,isEstablished:F,isClosed:S,isClosing:M,isValidSubprotocol:p,failWebsocketConnection:V,fireEvent:Y}=requireUtil$1(),{establishWebSocketConnection:R}=requireConnection(),{WebsocketFrameSend:m}=requireFrame(),{ByteParser:_}=requireReceiver(),{kEnumerableProperty:D,isBlobLike:b}=util$m,{getGlobalDispatcher:W}=global,{types:J}=require$$0__default$1;let N=!1;const sA=class sA extends EventTarget{constructor(rA,QA=[]){super();FA(this,tA);FA(this,Z,{open:null,error:null,close:null,message:null});FA(this,X,0);FA(this,K,"");FA(this,gA,"");e.argumentLengthCheck(arguments,1,{header:"WebSocket constructor"}),N||(N=!0,process.emitWarning("WebSockets are experimental, expect them to change at any time.",{code:"UNDICI-WS"}));const $=e.converters["DOMString or sequence<DOMString> or WebSocketInit"](QA);rA=e.converters.USVString(rA),QA=$.protocols;const AA=t();let oA;try{oA=new URL(rA,AA);}catch(hA){throw new DOMException(hA,"SyntaxError")}if(oA.protocol==="http:"?oA.protocol="ws:":oA.protocol==="https:"&&(oA.protocol="wss:"),oA.protocol!=="ws:"&&oA.protocol!=="wss:")throw new DOMException(`Expected a ws: or wss: protocol, got ${oA.protocol}`,"SyntaxError");if(oA.hash||oA.href.endsWith("#"))throw new DOMException("Got fragment","SyntaxError");if(typeof QA=="string"&&(QA=[QA]),QA.length!==new Set(QA.map(hA=>hA.toLowerCase())).size)throw new DOMException("Invalid Sec-WebSocket-Protocol value","SyntaxError");if(QA.length>0&&!QA.every(hA=>p(hA)))throw new DOMException("Invalid Sec-WebSocket-Protocol value","SyntaxError");this[C]=new URL(oA.href),this[c]=R(oA,QA,this,hA=>xA(this,tA,Pt).call(this,hA),$),this[f]=sA.CONNECTING,this[w]=o.NOT_SENT,this[I]="blob";}close(rA=void 0,QA=void 0){if(e.brandCheck(this,sA),rA!==void 0&&(rA=e.converters["unsigned short"](rA,{clamp:!0})),QA!==void 0&&(QA=e.converters.USVString(QA)),rA!==void 0&&rA!==1e3&&(rA<3e3||rA>4999))throw new DOMException("invalid code","InvalidAccessError");let $=0;if(QA!==void 0&&($=Buffer.byteLength(QA),$>123))throw new DOMException(`Reason must be less than 123 bytes; received ${$}`,"SyntaxError");if(!(M(this)||S(this)))if(!F(this))V(this,"Connection was closed before it was established."),this[f]=sA.CLOSING;else if(this[w]===o.NOT_SENT){this[w]=o.PROCESSING;const AA=new m;rA!==void 0&&QA===void 0?(AA.frameData=Buffer.allocUnsafe(2),AA.frameData.writeUInt16BE(rA,0)):rA!==void 0&&QA!==void 0?(AA.frameData=Buffer.allocUnsafe(2+$),AA.frameData.writeUInt16BE(rA,0),AA.frameData.write(QA,2,"utf-8")):AA.frameData=l,this[y].socket.write(AA.createFrame(B.CLOSE),hA=>{hA||(this[w]=o.SENT);}),this[f]=n.CLOSING;}else this[f]=sA.CLOSING;}send(rA){if(e.brandCheck(this,sA),e.argumentLengthCheck(arguments,1,{header:"WebSocket.send"}),rA=e.converters.WebSocketSendData(rA),k(this))throw new DOMException("Sent before connected.","InvalidStateError");if(!F(this)||M(this))return;const QA=this[y].socket;if(typeof rA=="string"){const $=Buffer.from(rA),oA=new m($).createFrame(B.TEXT);DA(this,X,x(this,X)+$.byteLength),QA.write(oA,()=>{DA(this,X,x(this,X)-$.byteLength);});}else if(J.isArrayBuffer(rA)){const $=Buffer.from(rA),oA=new m($).createFrame(B.BINARY);DA(this,X,x(this,X)+$.byteLength),QA.write(oA,()=>{DA(this,X,x(this,X)-$.byteLength);});}else if(ArrayBuffer.isView(rA)){const $=Buffer.from(rA,rA.byteOffset,rA.byteLength),oA=new m($).createFrame(B.BINARY);DA(this,X,x(this,X)+$.byteLength),QA.write(oA,()=>{DA(this,X,x(this,X)-$.byteLength);});}else if(b(rA)){const $=new m;rA.arrayBuffer().then(AA=>{const oA=Buffer.from(AA);$.frameData=oA;const hA=$.createFrame(B.BINARY);DA(this,X,x(this,X)+oA.byteLength),QA.write(hA,()=>{DA(this,X,x(this,X)-oA.byteLength);});});}}get readyState(){return e.brandCheck(this,sA),this[f]}get bufferedAmount(){return e.brandCheck(this,sA),x(this,X)}get url(){return e.brandCheck(this,sA),A(this[C])}get extensions(){return e.brandCheck(this,sA),x(this,gA)}get protocol(){return e.brandCheck(this,sA),x(this,K)}get onopen(){return e.brandCheck(this,sA),x(this,Z).open}set onopen(rA){e.brandCheck(this,sA),x(this,Z).open&&this.removeEventListener("open",x(this,Z).open),typeof rA=="function"?(x(this,Z).open=rA,this.addEventListener("open",rA)):x(this,Z).open=null;}get onerror(){return e.brandCheck(this,sA),x(this,Z).error}set onerror(rA){e.brandCheck(this,sA),x(this,Z).error&&this.removeEventListener("error",x(this,Z).error),typeof rA=="function"?(x(this,Z).error=rA,this.addEventListener("error",rA)):x(this,Z).error=null;}get onclose(){return e.brandCheck(this,sA),x(this,Z).close}set onclose(rA){e.brandCheck(this,sA),x(this,Z).close&&this.removeEventListener("close",x(this,Z).close),typeof rA=="function"?(x(this,Z).close=rA,this.addEventListener("close",rA)):x(this,Z).close=null;}get onmessage(){return e.brandCheck(this,sA),x(this,Z).message}set onmessage(rA){e.brandCheck(this,sA),x(this,Z).message&&this.removeEventListener("message",x(this,Z).message),typeof rA=="function"?(x(this,Z).message=rA,this.addEventListener("message",rA)):x(this,Z).message=null;}get binaryType(){return e.brandCheck(this,sA),this[I]}set binaryType(rA){e.brandCheck(this,sA),rA!=="blob"&&rA!=="arraybuffer"?this[I]="blob":this[I]=rA;}};Z=new WeakMap,X=new WeakMap,K=new WeakMap,gA=new WeakMap,tA=new WeakSet,Pt=Q(function(rA){this[y]=rA;const QA=new _(this);QA.on("drain",Q(function(){this.ws[y].socket.resume();},"onParserDrain")),rA.socket.ws=this,this[U]=QA,this[f]=n.OPEN;const $=rA.headersList.get("sec-websocket-extensions");$!==null&&DA(this,gA,$);const AA=rA.headersList.get("sec-websocket-protocol");AA!==null&&DA(this,K,AA),Y("open",this);},"#onConnectionEstablished"),Q(sA,"WebSocket");let v=sA;return v.CONNECTING=v.prototype.CONNECTING=n.CONNECTING,v.OPEN=v.prototype.OPEN=n.OPEN,v.CLOSING=v.prototype.CLOSING=n.CLOSING,v.CLOSED=v.prototype.CLOSED=n.CLOSED,Object.defineProperties(v.prototype,{CONNECTING:r,OPEN:r,CLOSING:r,CLOSED:r,url:D,readyState:D,bufferedAmount:D,onopen:D,onerror:D,onclose:D,close:D,onmessage:D,binaryType:D,send:D,extensions:D,protocol:D,[Symbol.toStringTag]:{value:"WebSocket",writable:!1,enumerable:!1,configurable:!0}}),Object.defineProperties(v,{CONNECTING:r,OPEN:r,CLOSING:r,CLOSED:r}),e.converters["sequence<DOMString>"]=e.sequenceConverter(e.converters.DOMString),e.converters["DOMString or sequence<DOMString>"]=function(aA){return e.util.Type(aA)==="Object"&&Symbol.iterator in aA?e.converters["sequence<DOMString>"](aA):e.converters.DOMString(aA)},e.converters.WebSocketInit=e.dictionaryConverter([{key:"protocols",converter:e.converters["DOMString or sequence<DOMString>"],get defaultValue(){return []}},{key:"dispatcher",converter:aA=>aA,get defaultValue(){return W()}},{key:"headers",converter:e.nullableConverter(e.converters.HeadersInit)}]),e.converters["DOMString or sequence<DOMString> or WebSocketInit"]=function(aA){return e.util.Type(aA)==="Object"&&!(Symbol.iterator in aA)?e.converters.WebSocketInit(aA):{protocols:e.converters["DOMString or sequence<DOMString>"](aA)}},e.converters.WebSocketSendData=function(aA){if(e.util.Type(aA)==="Object"){if(b(aA))return e.converters.Blob(aA,{strict:!1});if(ArrayBuffer.isView(aA)||J.isArrayBuffer(aA))return e.converters.BufferSource(aA)}return e.converters.USVString(aA)},websocket={WebSocket:v},websocket}Q(requireWebsocket,"requireWebsocket");var util$1,hasRequiredUtil;function requireUtil(){if(hasRequiredUtil)return util$1;hasRequiredUtil=1;function e(r){return r.indexOf("\0")===-1}Q(e,"isValidLastEventId");function A(r){if(r.length===0)return !1;for(let n=0;n<r.length;n++)if(r.charCodeAt(n)<48||r.charCodeAt(n)>57)return !1;return !0}Q(A,"isASCIINumber");function t(r){return new Promise(n=>{setTimeout(n,r).unref();})}return Q(t,"delay"),util$1={isValidLastEventId:e,isASCIINumber:A,delay:t},util$1}Q(requireUtil,"requireUtil");var eventsourceStream,hasRequiredEventsourceStream;function requireEventsourceStream(){if(hasRequiredEventsourceStream)return eventsourceStream;hasRequiredEventsourceStream=1;const{Transform:e}=Stream__default,{isASCIINumber:A,isValidLastEventId:t}=requireUtil(),r=[239,187,191],n=10,o=13,B=58,l=32,f=class f extends e{constructor(y={}){y.readableObjectMode=!0;super(y);ZA(this,"state",null);ZA(this,"checkBOM",!0);ZA(this,"crlfCheck",!1);ZA(this,"eventEndCheck",!1);ZA(this,"buffer",null);ZA(this,"pos",0);ZA(this,"event",{data:void 0,event:void 0,id:void 0,retry:void 0});this.state=y.eventSourceSettings||{},y.push&&(this.push=y.push);}_transform(y,w,U){if(y.length===0){U();return}if(this.buffer?this.buffer=Buffer.concat([this.buffer,y]):this.buffer=y,this.checkBOM)switch(this.buffer.length){case 1:if(this.buffer[0]===r[0]){U();return}this.checkBOM=!1,U();return;case 2:if(this.buffer[0]===r[0]&&this.buffer[1]===r[1]){U();return}this.checkBOM=!1;break;case 3:if(this.buffer[0]===r[0]&&this.buffer[1]===r[1]&&this.buffer[2]===r[2]){this.buffer=Buffer.alloc(0),this.checkBOM=!1,U();return}this.checkBOM=!1;break;default:this.buffer[0]===r[0]&&this.buffer[1]===r[1]&&this.buffer[2]===r[2]&&(this.buffer=this.buffer.subarray(3)),this.checkBOM=!1;break}for(;this.pos<this.buffer.length;){if(this.eventEndCheck){if(this.crlfCheck){if(this.buffer[this.pos]===n){this.buffer=this.buffer.subarray(this.pos+1),this.pos=0,this.crlfCheck=!1;continue}this.crlfCheck=!1;}if(this.buffer[this.pos]===n||this.buffer[this.pos]===o){this.buffer[this.pos]===o&&(this.crlfCheck=!0),this.buffer=this.buffer.subarray(this.pos+1),this.pos=0,(this.event.data!==void 0||this.event.event||this.event.id||this.event.retry)&&this.processEvent(this.event),this.clearEvent();continue}this.eventEndCheck=!1;continue}if(this.buffer[this.pos]===n||this.buffer[this.pos]===o){this.buffer[this.pos]===o&&(this.crlfCheck=!0),this.parseLine(this.buffer.subarray(0,this.pos),this.event),this.buffer=this.buffer.subarray(this.pos+1),this.pos=0,this.eventEndCheck=!0;continue}this.pos++;}U();}parseLine(y,w){if(y.length===0)return;const U=y.indexOf(B);if(U===0)return;let k="",F="";if(U!==-1){k=y.subarray(0,U).toString("utf8");let S=U+1;y[S]===l&&++S,F=y.subarray(S).toString("utf8");}else k=y.toString("utf8"),F="";switch(k){case"data":w[k]===void 0?w[k]=F:w[k]+=`
${F}`;break;case"retry":A(F)&&(w[k]=F);break;case"id":t(F)&&(w[k]=F);break;case"event":F.length>0&&(w[k]=F);break}}processEvent(y){y.retry&&A(y.retry)&&(this.state.reconnectionTime=parseInt(y.retry,10)),y.id&&t(y.id)&&(this.state.lastEventId=y.id),y.data!==void 0&&this.push({type:y.event||"message",options:{data:y.data,lastEventId:this.state.lastEventId,origin:this.state.origin}});}clearEvent(){this.event={data:void 0,event:void 0,id:void 0,retry:void 0};}};Q(f,"EventSourceStream");let C=f;return eventsourceStream={EventSourceStream:C},eventsourceStream}Q(requireEventsourceStream,"requireEventsourceStream");var eventsource,hasRequiredEventsource;function requireEventsource(){var p,V,Y,R,m,_,D,b,ut,J,dt;if(hasRequiredEventsource)return eventsource;hasRequiredEventsource=1;const{pipeline:e}=Stream__default,{fetching:A}=requireFetch(),{makeRequest:t}=requireRequest(),{getGlobalOrigin:r}=requireGlobal(),{webidl:n}=requireWebidl(),{EventSourceStream:o}=requireEventsourceStream(),{parseMIMEType:B}=requireDataUrl(),{MessageEvent:l}=requireEvents(),{isNetworkError:C}=requireResponse(),{delay:f}=requireUtil();let c=!1;const I=3e3,y=0,w=1,U=2,k="anonymous",F="use-credentials",v=class v extends EventTarget{constructor(K,gA={}){super();FA(this,b);FA(this,J);FA(this,p,{open:null,error:null,message:null});FA(this,V,null);FA(this,Y,!1);FA(this,R,y);FA(this,m,null);FA(this,_,null);FA(this,D,null);n.argumentLengthCheck(arguments,1,{header:"EventSource constructor"}),c||(c=!0,process.emitWarning("EventSource is experimental, expect them to change at any time.",{code:"UNDICI-ES"})),K=n.converters.USVString(K),gA=n.converters.EventSourceInitDict(gA),DA(this,D,{origin:r(),policyContainer:{referrerPolicy:"no-referrer"},lastEventId:"",reconnectionTime:I});let tA;try{tA=new URL(K,x(this,D).origin),x(this,D).origin=tA.origin;}catch(aA){throw new DOMException(aA,"SyntaxError")}DA(this,V,tA.href);let cA=k;gA.withCredentials&&(cA=F,DA(this,Y,!0));const sA={redirect:"follow",keepalive:!0,mode:"cors",credentials:cA==="anonymous"?"same-origin":"omit",referrer:"no-referrer"};sA.client=x(this,D),sA.headersList=[["accept",{name:"accept",value:"text/event-stream"}]],sA.cache="no-store",sA.initiator="other",sA.urlList=[new URL(x(this,V))],DA(this,m,t(sA)),xA(this,b,ut).call(this);}get readyState(){return x(this,R)}get url(){return x(this,V)}get withCredentials(){return x(this,Y)}close(){n.brandCheck(this,v),x(this,R)!==U&&(DA(this,R,U),clearTimeout(x(this,D).reconnectionTimer),x(this,_).abort(),x(this,m)&&DA(this,m,null));}get onopen(){return x(this,p).open}set onopen(K){x(this,p).open&&this.removeEventListener("open",x(this,p).open),typeof K=="function"?(x(this,p).open=K,this.addEventListener("open",K)):x(this,p).open=null;}get onmessage(){return x(this,p).message}set onmessage(K){x(this,p).message&&this.removeEventListener("message",x(this,p).message),typeof K=="function"?(x(this,p).message=K,this.addEventListener("message",K)):x(this,p).message=null;}get onerror(){return x(this,p).error}set onerror(K){x(this,p).error&&this.removeEventListener("error",x(this,p).error),typeof K=="function"?(x(this,p).error=K,this.addEventListener("error",K)):x(this,p).error=null;}};p=new WeakMap,V=new WeakMap,Y=new WeakMap,R=new WeakMap,m=new WeakMap,_=new WeakMap,D=new WeakMap,b=new WeakSet,ut=Q(function(){if(x(this,R)===U)return;DA(this,R,y);const K={request:x(this,m)},gA=Q(tA=>{C(tA)&&(this.dispatchEvent(new Event("error")),this.close()),xA(this,J,dt).call(this);},"processEventSourceEndOfBody");K.processResponseEndOfBody=gA,K.processResponse=tA=>{if(C(tA))if(tA.aborted){this.close(),this.dispatchEvent(new Event("error"));return}else {xA(this,J,dt).call(this);return}const cA=tA.headersList.get("content-type",!0),sA=cA!==null?B(cA):"failure",aA=sA!=="failure"&&sA.essence==="text/event-stream";if(tA.status!==200||aA===!1){this.close(),this.dispatchEvent(new Event("error"));return}DA(this,R,w),this.dispatchEvent(new Event("open")),x(this,D).origin=tA.urlList[tA.urlList.length-1].origin;const bA=new o({eventSourceSettings:x(this,D),push:rA=>{this.dispatchEvent(new l(rA.type,rA.options));}});e(tA.body.stream,bA,rA=>{rA?.aborted===!1&&(this.close(),this.dispatchEvent(new Event("error")));});},DA(this,_,A(K));},"#connect"),J=new WeakSet,dt=Q(async function(){x(this,R)!==U&&(DA(this,R,y),this.dispatchEvent(new Event("error")),await f(x(this,D).reconnectionTime),x(this,R)===y&&(x(this,D).lastEventId!==""&&x(this,m).headersList.set("last-event-id",x(this,D).lastEventId,!0),xA(this,b,ut).call(this)));},"#reconnect"),Q(v,"EventSource");let S=v;const M={CONNECTING:{__proto__:null,configurable:!1,enumerable:!0,value:y,writable:!1},OPEN:{__proto__:null,configurable:!1,enumerable:!0,value:w,writable:!1},CLOSED:{__proto__:null,configurable:!1,enumerable:!0,value:U,writable:!1}};return Object.defineProperties(S,M),Object.defineProperties(S.prototype,M),n.converters.EventSourceInitDict=n.dictionaryConverter([{key:"withCredentials",converter:n.converters.boolean,defaultValue:!1}]),eventsource={EventSource:S,defaultReconnectionTime:I},eventsource}Q(requireEventsource,"requireEventsource");const Dispatcher=dispatcher,Agent=agent,ProxyAgent=proxyAgent,errors=errors$1,util=util$m,{InvalidArgumentError}=errors,api=api$1,{getGlobalDispatcher,setGlobalDispatcher}=global;Object.assign(Dispatcher.prototype,api);var Agent_1=Agent,ProxyAgent_1=ProxyAgent;function makeDispatcher(e){return (A,t,r)=>{if(typeof t=="function"&&(r=t,t=null),!A||typeof A!="string"&&typeof A!="object"&&!(A instanceof URL))throw new InvalidArgumentError("invalid url");if(t!=null&&typeof t!="object")throw new InvalidArgumentError("invalid opts");if(t&&t.path!=null){if(typeof t.path!="string")throw new InvalidArgumentError("invalid opts.path");let B=t.path;t.path.startsWith("/")||(B=`/${B}`),A=new URL(util.parseOrigin(A).origin+B);}else t||(t=typeof A=="object"?A:{}),A=util.parseURL(A);const{agent:n,dispatcher:o=getGlobalDispatcher()}=t;if(n)throw new InvalidArgumentError("unsupported opts.agent. Did you mean opts.client?");return e.call(o,{...t,origin:A.origin,path:A.search?`${A.pathname}${A.search}`:A.pathname,method:t.method||(t.body?"PUT":"GET")},r)}}Q(makeDispatcher,"makeDispatcher"),requireFetch().fetch,requireHeaders().Headers,requireResponse().Response,requireRequest().Request,requireFormdata().FormData,requireFile().File,requireFilereader().FileReader,requireGlobal();const{CacheStorage}=requireCachestorage(),{kConstruct}=requireSymbols$1();new CacheStorage(kConstruct),requireCookies(),requireDataUrl(),requireEvents(),requireWebsocket().WebSocket,makeDispatcher(api.request),makeDispatcher(api.stream),makeDispatcher(api.pipeline),makeDispatcher(api.connect),makeDispatcher(api.upgrade),requireEventsource();var dist$2={},helpers={},__createBinding$2=_commonjsHelpers.commonjsGlobal&&_commonjsHelpers.commonjsGlobal.__createBinding||(Object.create?function(e,A,t,r){r===void 0&&(r=t);var n=Object.getOwnPropertyDescriptor(A,t);(!n||("get"in n?!A.__esModule:n.writable||n.configurable))&&(n={enumerable:!0,get:function(){return A[t]}}),Object.defineProperty(e,r,n);}:function(e,A,t,r){r===void 0&&(r=t),e[r]=A[t];}),__setModuleDefault$2=_commonjsHelpers.commonjsGlobal&&_commonjsHelpers.commonjsGlobal.__setModuleDefault||(Object.create?function(e,A){Object.defineProperty(e,"default",{enumerable:!0,value:A});}:function(e,A){e.default=A;}),__importStar$2=_commonjsHelpers.commonjsGlobal&&_commonjsHelpers.commonjsGlobal.__importStar||function(e){if(e&&e.__esModule)return e;var A={};if(e!=null)for(var t in e)t!=="default"&&Object.prototype.hasOwnProperty.call(e,t)&&__createBinding$2(A,e,t);return __setModuleDefault$2(A,e),A};Object.defineProperty(helpers,"__esModule",{value:!0}),helpers.req=helpers.json=helpers.toBuffer=void 0;const http$3=__importStar$2(require$$0__default$5),https=__importStar$2(require$$1__default$1);async function toBuffer(e){let A=0;const t=[];for await(const r of e)A+=r.length,t.push(r);return Buffer.concat(t,A)}Q(toBuffer,"toBuffer"),helpers.toBuffer=toBuffer;async function json(e){const t=(await toBuffer(e)).toString("utf8");try{return JSON.parse(t)}catch(r){const n=r;throw n.message+=` (input: ${t})`,n}}Q(json,"json"),helpers.json=json;function req(e,A={}){const r=((typeof e=="string"?e:e.href).startsWith("https:")?https:http$3).request(e,A),n=new Promise((o,B)=>{r.once("response",o).once("error",B).end();});return r.then=n.then.bind(n),r}Q(req,"req"),helpers.req=req,function(e){var A=_commonjsHelpers.commonjsGlobal&&_commonjsHelpers.commonjsGlobal.__createBinding||(Object.create?function(f,c,I,y){y===void 0&&(y=I);var w=Object.getOwnPropertyDescriptor(c,I);(!w||("get"in w?!c.__esModule:w.writable||w.configurable))&&(w={enumerable:!0,get:function(){return c[I]}}),Object.defineProperty(f,y,w);}:function(f,c,I,y){y===void 0&&(y=I),f[y]=c[I];}),t=_commonjsHelpers.commonjsGlobal&&_commonjsHelpers.commonjsGlobal.__setModuleDefault||(Object.create?function(f,c){Object.defineProperty(f,"default",{enumerable:!0,value:c});}:function(f,c){f.default=c;}),r=_commonjsHelpers.commonjsGlobal&&_commonjsHelpers.commonjsGlobal.__importStar||function(f){if(f&&f.__esModule)return f;var c={};if(f!=null)for(var I in f)I!=="default"&&Object.prototype.hasOwnProperty.call(f,I)&&A(c,f,I);return t(c,f),c},n=_commonjsHelpers.commonjsGlobal&&_commonjsHelpers.commonjsGlobal.__exportStar||function(f,c){for(var I in f)I!=="default"&&!Object.prototype.hasOwnProperty.call(c,I)&&A(c,f,I);};Object.defineProperty(e,"__esModule",{value:!0}),e.Agent=void 0;const o=r(require$$0__default$5);n(helpers,e);const B=Symbol("AgentBaseInternalState"),C=class C extends o.Agent{constructor(c){super(c),this[B]={};}isSecureEndpoint(c){if(c){if(typeof c.secureEndpoint=="boolean")return c.secureEndpoint;if(typeof c.protocol=="string")return c.protocol==="https:"}const{stack:I}=new Error;return typeof I!="string"?!1:I.split(`
`).some(y=>y.indexOf("(https.js:")!==-1||y.indexOf("node:https:")!==-1)}createSocket(c,I,y){const w={...I,secureEndpoint:this.isSecureEndpoint(I)};Promise.resolve().then(()=>this.connect(c,w)).then(U=>{if(U instanceof o.Agent)return U.addRequest(c,w);this[B].currentSocket=U,super.createSocket(c,I,y);},y);}createConnection(){const c=this[B].currentSocket;if(this[B].currentSocket=void 0,!c)throw new Error("No socket was returned in the `connect()` function");return c}get defaultPort(){return this[B].defaultPort??(this.protocol==="https:"?443:80)}set defaultPort(c){this[B]&&(this[B].defaultPort=c);}get protocol(){return this[B].protocol??(this.isSecureEndpoint()?"https:":"http:")}set protocol(c){this[B]&&(this[B].protocol=c);}};Q(C,"Agent");let l=C;e.Agent=l;}(dist$2);var dist$1={},src={exports:{}},browser={exports:{}},ms,hasRequiredMs;function requireMs(){if(hasRequiredMs)return ms;hasRequiredMs=1;var e=1e3,A=e*60,t=A*60,r=t*24,n=r*7,o=r*365.25;ms=Q(function(c,I){I=I||{};var y=typeof c;if(y==="string"&&c.length>0)return B(c);if(y==="number"&&isFinite(c))return I.long?C(c):l(c);throw new Error("val is not a non-empty string or a valid number. val="+JSON.stringify(c))},"ms");function B(c){if(c=String(c),!(c.length>100)){var I=/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(c);if(I){var y=parseFloat(I[1]),w=(I[2]||"ms").toLowerCase();switch(w){case"years":case"year":case"yrs":case"yr":case"y":return y*o;case"weeks":case"week":case"w":return y*n;case"days":case"day":case"d":return y*r;case"hours":case"hour":case"hrs":case"hr":case"h":return y*t;case"minutes":case"minute":case"mins":case"min":case"m":return y*A;case"seconds":case"second":case"secs":case"sec":case"s":return y*e;case"milliseconds":case"millisecond":case"msecs":case"msec":case"ms":return y;default:return}}}}Q(B,"parse");function l(c){var I=Math.abs(c);return I>=r?Math.round(c/r)+"d":I>=t?Math.round(c/t)+"h":I>=A?Math.round(c/A)+"m":I>=e?Math.round(c/e)+"s":c+"ms"}Q(l,"fmtShort");function C(c){var I=Math.abs(c);return I>=r?f(c,I,r,"day"):I>=t?f(c,I,t,"hour"):I>=A?f(c,I,A,"minute"):I>=e?f(c,I,e,"second"):c+" ms"}Q(C,"fmtLong");function f(c,I,y,w){var U=I>=y*1.5;return Math.round(c/y)+" "+w+(U?"s":"")}return Q(f,"plural"),ms}Q(requireMs,"requireMs");var common,hasRequiredCommon;function requireCommon(){if(hasRequiredCommon)return common;hasRequiredCommon=1;function e(A){r.debug=r,r.default=r,r.coerce=f,r.disable=B,r.enable=o,r.enabled=l,r.humanize=requireMs(),r.destroy=c,Object.keys(A).forEach(I=>{r[I]=A[I];}),r.names=[],r.skips=[],r.formatters={};function t(I){let y=0;for(let w=0;w<I.length;w++)y=(y<<5)-y+I.charCodeAt(w),y|=0;return r.colors[Math.abs(y)%r.colors.length]}Q(t,"selectColor"),r.selectColor=t;function r(I){let y,w=null,U,k;function F(...S){if(!F.enabled)return;const M=F,p=Number(new Date),V=p-(y||p);M.diff=V,M.prev=y,M.curr=p,y=p,S[0]=r.coerce(S[0]),typeof S[0]!="string"&&S.unshift("%O");let Y=0;S[0]=S[0].replace(/%([a-zA-Z%])/g,(m,_)=>{if(m==="%%")return "%";Y++;const D=r.formatters[_];if(typeof D=="function"){const b=S[Y];m=D.call(M,b),S.splice(Y,1),Y--;}return m}),r.formatArgs.call(M,S),(M.log||r.log).apply(M,S);}return Q(F,"debug"),F.namespace=I,F.useColors=r.useColors(),F.color=r.selectColor(I),F.extend=n,F.destroy=r.destroy,Object.defineProperty(F,"enabled",{enumerable:!0,configurable:!1,get:()=>w!==null?w:(U!==r.namespaces&&(U=r.namespaces,k=r.enabled(I)),k),set:S=>{w=S;}}),typeof r.init=="function"&&r.init(F),F}Q(r,"createDebug");function n(I,y){const w=r(this.namespace+(typeof y>"u"?":":y)+I);return w.log=this.log,w}Q(n,"extend");function o(I){r.save(I),r.namespaces=I,r.names=[],r.skips=[];let y;const w=(typeof I=="string"?I:"").split(/[\s,]+/),U=w.length;for(y=0;y<U;y++)w[y]&&(I=w[y].replace(/\*/g,".*?"),I[0]==="-"?r.skips.push(new RegExp("^"+I.slice(1)+"$")):r.names.push(new RegExp("^"+I+"$")));}Q(o,"enable");function B(){const I=[...r.names.map(C),...r.skips.map(C).map(y=>"-"+y)].join(",");return r.enable(""),I}Q(B,"disable");function l(I){if(I[I.length-1]==="*")return !0;let y,w;for(y=0,w=r.skips.length;y<w;y++)if(r.skips[y].test(I))return !1;for(y=0,w=r.names.length;y<w;y++)if(r.names[y].test(I))return !0;return !1}Q(l,"enabled");function C(I){return I.toString().substring(2,I.toString().length-2).replace(/\.\*\?$/,"*")}Q(C,"toNamespace");function f(I){return I instanceof Error?I.stack||I.message:I}Q(f,"coerce");function c(){console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");}return Q(c,"destroy"),r.enable(r.load()),r}return Q(e,"setup"),common=e,common}Q(requireCommon,"requireCommon");var hasRequiredBrowser;function requireBrowser(){return hasRequiredBrowser||(hasRequiredBrowser=1,function(e,A){A.formatArgs=r,A.save=n,A.load=o,A.useColors=t,A.storage=B(),A.destroy=(()=>{let C=!1;return ()=>{C||(C=!0,console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));}})(),A.colors=["#0000CC","#0000FF","#0033CC","#0033FF","#0066CC","#0066FF","#0099CC","#0099FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#3300CC","#3300FF","#3333CC","#3333FF","#3366CC","#3366FF","#3399CC","#3399FF","#33CC00","#33CC33","#33CC66","#33CC99","#33CCCC","#33CCFF","#6600CC","#6600FF","#6633CC","#6633FF","#66CC00","#66CC33","#9900CC","#9900FF","#9933CC","#9933FF","#99CC00","#99CC33","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF","#CC6600","#CC6633","#CC9900","#CC9933","#CCCC00","#CCCC33","#FF0000","#FF0033","#FF0066","#FF0099","#FF00CC","#FF00FF","#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#FF6600","#FF6633","#FF9900","#FF9933","#FFCC00","#FFCC33"];function t(){return typeof window<"u"&&window.process&&(window.process.type==="renderer"||window.process.__nwjs)?!0:typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)?!1:typeof document<"u"&&document.documentElement&&document.documentElement.style&&document.documentElement.style.WebkitAppearance||typeof window<"u"&&window.console&&(window.console.firebug||window.console.exception&&window.console.table)||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)&&parseInt(RegExp.$1,10)>=31||typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)}Q(t,"useColors");function r(C){if(C[0]=(this.useColors?"%c":"")+this.namespace+(this.useColors?" %c":" ")+C[0]+(this.useColors?"%c ":" ")+"+"+e.exports.humanize(this.diff),!this.useColors)return;const f="color: "+this.color;C.splice(1,0,f,"color: inherit");let c=0,I=0;C[0].replace(/%[a-zA-Z%]/g,y=>{y!=="%%"&&(c++,y==="%c"&&(I=c));}),C.splice(I,0,f);}Q(r,"formatArgs"),A.log=console.debug||console.log||(()=>{});function n(C){try{C?A.storage.setItem("debug",C):A.storage.removeItem("debug");}catch{}}Q(n,"save");function o(){let C;try{C=A.storage.getItem("debug");}catch{}return !C&&typeof process<"u"&&"env"in process&&(C=process.env.DEBUG),C}Q(o,"load");function B(){try{return localStorage}catch{}}Q(B,"localstorage"),e.exports=requireCommon()(A);const{formatters:l}=e.exports;l.j=function(C){try{return JSON.stringify(C)}catch(f){return "[UnexpectedJSONParseError]: "+f.message}};}(browser,browser.exports)),browser.exports}Q(requireBrowser,"requireBrowser");var node={exports:{}},hasFlag,hasRequiredHasFlag;function requireHasFlag(){return hasRequiredHasFlag||(hasRequiredHasFlag=1,hasFlag=Q((e,A=process.argv)=>{const t=e.startsWith("-")?"":e.length===1?"-":"--",r=A.indexOf(t+e),n=A.indexOf("--");return r!==-1&&(n===-1||r<n)},"hasFlag")),hasFlag}Q(requireHasFlag,"requireHasFlag");var supportsColor_1,hasRequiredSupportsColor;function requireSupportsColor(){if(hasRequiredSupportsColor)return supportsColor_1;hasRequiredSupportsColor=1;const e=require$$0__default$6,A=require$$1__default$2,t=requireHasFlag(),{env:r}=process;let n;t("no-color")||t("no-colors")||t("color=false")||t("color=never")?n=0:(t("color")||t("colors")||t("color=true")||t("color=always"))&&(n=1),"FORCE_COLOR"in r&&(r.FORCE_COLOR==="true"?n=1:r.FORCE_COLOR==="false"?n=0:n=r.FORCE_COLOR.length===0?1:Math.min(parseInt(r.FORCE_COLOR,10),3));function o(C){return C===0?!1:{level:C,hasBasic:!0,has256:C>=2,has16m:C>=3}}Q(o,"translateLevel");function B(C,f){if(n===0)return 0;if(t("color=16m")||t("color=full")||t("color=truecolor"))return 3;if(t("color=256"))return 2;if(C&&!f&&n===void 0)return 0;const c=n||0;if(r.TERM==="dumb")return c;if(process.platform==="win32"){const I=e.release().split(".");return Number(I[0])>=10&&Number(I[2])>=10586?Number(I[2])>=14931?3:2:1}if("CI"in r)return ["TRAVIS","CIRCLECI","APPVEYOR","GITLAB_CI","GITHUB_ACTIONS","BUILDKITE"].some(I=>I in r)||r.CI_NAME==="codeship"?1:c;if("TEAMCITY_VERSION"in r)return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(r.TEAMCITY_VERSION)?1:0;if(r.COLORTERM==="truecolor")return 3;if("TERM_PROGRAM"in r){const I=parseInt((r.TERM_PROGRAM_VERSION||"").split(".")[0],10);switch(r.TERM_PROGRAM){case"iTerm.app":return I>=3?3:2;case"Apple_Terminal":return 2}}return /-256(color)?$/i.test(r.TERM)?2:/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(r.TERM)||"COLORTERM"in r?1:c}Q(B,"supportsColor");function l(C){const f=B(C,C&&C.isTTY);return o(f)}return Q(l,"getSupportLevel"),supportsColor_1={supportsColor:l,stdout:o(B(!0,A.isatty(1))),stderr:o(B(!0,A.isatty(2)))},supportsColor_1}Q(requireSupportsColor,"requireSupportsColor");var hasRequiredNode;function requireNode(){return hasRequiredNode||(hasRequiredNode=1,function(e,A){const t=require$$1__default$2,r=require$$6__default$1;A.init=c,A.log=l,A.formatArgs=o,A.save=C,A.load=f,A.useColors=n,A.destroy=r.deprecate(()=>{},"Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."),A.colors=[6,2,3,4,5,1];try{const y=requireSupportsColor();y&&(y.stderr||y).level>=2&&(A.colors=[20,21,26,27,32,33,38,39,40,41,42,43,44,45,56,57,62,63,68,69,74,75,76,77,78,79,80,81,92,93,98,99,112,113,128,129,134,135,148,149,160,161,162,163,164,165,166,167,168,169,170,171,172,173,178,179,184,185,196,197,198,199,200,201,202,203,204,205,206,207,208,209,214,215,220,221]);}catch{}A.inspectOpts=Object.keys(process.env).filter(y=>/^debug_/i.test(y)).reduce((y,w)=>{const U=w.substring(6).toLowerCase().replace(/_([a-z])/g,(F,S)=>S.toUpperCase());let k=process.env[w];return /^(yes|on|true|enabled)$/i.test(k)?k=!0:/^(no|off|false|disabled)$/i.test(k)?k=!1:k==="null"?k=null:k=Number(k),y[U]=k,y},{});function n(){return "colors"in A.inspectOpts?!!A.inspectOpts.colors:t.isatty(process.stderr.fd)}Q(n,"useColors");function o(y){const{namespace:w,useColors:U}=this;if(U){const k=this.color,F="\x1B[3"+(k<8?k:"8;5;"+k),S=`  ${F};1m${w} \x1B[0m`;y[0]=S+y[0].split(`
`).join(`
`+S),y.push(F+"m+"+e.exports.humanize(this.diff)+"\x1B[0m");}else y[0]=B()+w+" "+y[0];}Q(o,"formatArgs");function B(){return A.inspectOpts.hideDate?"":new Date().toISOString()+" "}Q(B,"getDate");function l(...y){return process.stderr.write(r.format(...y)+`
`)}Q(l,"log");function C(y){y?process.env.DEBUG=y:delete process.env.DEBUG;}Q(C,"save");function f(){return process.env.DEBUG}Q(f,"load");function c(y){y.inspectOpts={};const w=Object.keys(A.inspectOpts);for(let U=0;U<w.length;U++)y.inspectOpts[w[U]]=A.inspectOpts[w[U]];}Q(c,"init"),e.exports=requireCommon()(A);const{formatters:I}=e.exports;I.o=function(y){return this.inspectOpts.colors=this.useColors,r.inspect(y,this.inspectOpts).split(`
`).map(w=>w.trim()).join(" ")},I.O=function(y){return this.inspectOpts.colors=this.useColors,r.inspect(y,this.inspectOpts)};}(node,node.exports)),node.exports}Q(requireNode,"requireNode"),typeof process>"u"||process.type==="renderer"||process.browser===!0||process.__nwjs?src.exports=requireBrowser():src.exports=requireNode();var srcExports=src.exports,__createBinding$1=_commonjsHelpers.commonjsGlobal&&_commonjsHelpers.commonjsGlobal.__createBinding||(Object.create?function(e,A,t,r){r===void 0&&(r=t);var n=Object.getOwnPropertyDescriptor(A,t);(!n||("get"in n?!A.__esModule:n.writable||n.configurable))&&(n={enumerable:!0,get:function(){return A[t]}}),Object.defineProperty(e,r,n);}:function(e,A,t,r){r===void 0&&(r=t),e[r]=A[t];}),__setModuleDefault$1=_commonjsHelpers.commonjsGlobal&&_commonjsHelpers.commonjsGlobal.__setModuleDefault||(Object.create?function(e,A){Object.defineProperty(e,"default",{enumerable:!0,value:A});}:function(e,A){e.default=A;}),__importStar$1=_commonjsHelpers.commonjsGlobal&&_commonjsHelpers.commonjsGlobal.__importStar||function(e){if(e&&e.__esModule)return e;var A={};if(e!=null)for(var t in e)t!=="default"&&Object.prototype.hasOwnProperty.call(e,t)&&__createBinding$1(A,e,t);return __setModuleDefault$1(A,e),A},__importDefault$2=_commonjsHelpers.commonjsGlobal&&_commonjsHelpers.commonjsGlobal.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(dist$1,"__esModule",{value:!0});var HttpProxyAgent_1=dist$1.HttpProxyAgent=void 0;const net$1=__importStar$1(require$$0__default$7),tls$1=__importStar$1(require$$1__default$3),debug_1$2=__importDefault$2(srcExports),events_1=require$$3__default,agent_base_1$1=dist$2,url_1$1=require$$5__default$2,debug$2=(0, debug_1$2.default)("http-proxy-agent"),Vt=class Vt extends agent_base_1$1.Agent{constructor(A,t){super(t),this.proxy=typeof A=="string"?new url_1$1.URL(A):A,this.proxyHeaders=t?.headers??{},debug$2("Creating new HttpProxyAgent instance: %o",this.proxy.href);const r=(this.proxy.hostname||this.proxy.host).replace(/^\[|\]$/g,""),n=this.proxy.port?parseInt(this.proxy.port,10):this.proxy.protocol==="https:"?443:80;this.connectOpts={...t?omit$1(t,"headers"):null,host:r,port:n};}addRequest(A,t){A._header=null,this.setRequestProps(A,t),super.addRequest(A,t);}setRequestProps(A,t){const{proxy:r}=this,n=t.secureEndpoint?"https:":"http:",o=A.getHeader("host")||"localhost",B=`${n}//${o}`,l=new url_1$1.URL(A.path,B);t.port!==80&&(l.port=String(t.port)),A.path=String(l);const C=typeof this.proxyHeaders=="function"?this.proxyHeaders():{...this.proxyHeaders};if(r.username||r.password){const f=`${decodeURIComponent(r.username)}:${decodeURIComponent(r.password)}`;C["Proxy-Authorization"]=`Basic ${Buffer.from(f).toString("base64")}`;}C["Proxy-Connection"]||(C["Proxy-Connection"]=this.keepAlive?"Keep-Alive":"close");for(const f of Object.keys(C)){const c=C[f];c&&A.setHeader(f,c);}}async connect(A,t){A._header=null,A.path.includes("://")||this.setRequestProps(A,t);let r,n;debug$2("Regenerating stored HTTP header string for request"),A._implicitHeader(),A.outputData&&A.outputData.length>0&&(debug$2("Patching connection write() output buffer with updated header"),r=A.outputData[0].data,n=r.indexOf(`\r
\r
`)+4,A.outputData[0].data=A._header+r.substring(n),debug$2("Output buffer: %o",A.outputData[0].data));let o;return this.proxy.protocol==="https:"?(debug$2("Creating `tls.Socket`: %o",this.connectOpts),o=tls$1.connect(this.connectOpts)):(debug$2("Creating `net.Socket`: %o",this.connectOpts),o=net$1.connect(this.connectOpts)),await(0, events_1.once)(o,"connect"),o}};Q(Vt,"HttpProxyAgent");let HttpProxyAgent=Vt;HttpProxyAgent.protocols=["http","https"],HttpProxyAgent_1=dist$1.HttpProxyAgent=HttpProxyAgent;function omit$1(e,...A){const t={};let r;for(r in e)A.includes(r)||(t[r]=e[r]);return t}Q(omit$1,"omit$1");var dist={},parseProxyResponse$1={},__importDefault$1=_commonjsHelpers.commonjsGlobal&&_commonjsHelpers.commonjsGlobal.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(parseProxyResponse$1,"__esModule",{value:!0}),parseProxyResponse$1.parseProxyResponse=void 0;const debug_1$1=__importDefault$1(srcExports),debug$1=(0, debug_1$1.default)("https-proxy-agent:parse-proxy-response");function parseProxyResponse(e){return new Promise((A,t)=>{let r=0;const n=[];function o(){const c=e.read();c?f(c):e.once("readable",o);}Q(o,"read");function B(){e.removeListener("end",l),e.removeListener("error",C),e.removeListener("readable",o);}Q(B,"cleanup");function l(){B(),debug$1("onend"),t(new Error("Proxy connection ended before receiving CONNECT response"));}Q(l,"onend");function C(c){B(),debug$1("onerror %o",c),t(c);}Q(C,"onerror");function f(c){n.push(c),r+=c.length;const I=Buffer.concat(n,r),y=I.indexOf(`\r
\r
`);if(y===-1){debug$1("have not received end of HTTP headers yet..."),o();return}const w=I.slice(0,y).toString("ascii").split(`\r
`),U=w.shift();if(!U)return e.destroy(),t(new Error("No header received from proxy CONNECT response"));const k=U.split(" "),F=+k[1],S=k.slice(2).join(" "),M={};for(const p of w){if(!p)continue;const V=p.indexOf(":");if(V===-1)return e.destroy(),t(new Error(`Invalid header from proxy CONNECT response: "${p}"`));const Y=p.slice(0,V).toLowerCase(),R=p.slice(V+1).trimStart(),m=M[Y];typeof m=="string"?M[Y]=[m,R]:Array.isArray(m)?m.push(R):M[Y]=R;}debug$1("got proxy server response: %o %o",U,M),B(),A({connect:{statusCode:F,statusText:S,headers:M},buffered:I});}Q(f,"ondata"),e.on("error",C),e.on("end",l),o();})}Q(parseProxyResponse,"parseProxyResponse"),parseProxyResponse$1.parseProxyResponse=parseProxyResponse;var __createBinding=_commonjsHelpers.commonjsGlobal&&_commonjsHelpers.commonjsGlobal.__createBinding||(Object.create?function(e,A,t,r){r===void 0&&(r=t);var n=Object.getOwnPropertyDescriptor(A,t);(!n||("get"in n?!A.__esModule:n.writable||n.configurable))&&(n={enumerable:!0,get:function(){return A[t]}}),Object.defineProperty(e,r,n);}:function(e,A,t,r){r===void 0&&(r=t),e[r]=A[t];}),__setModuleDefault=_commonjsHelpers.commonjsGlobal&&_commonjsHelpers.commonjsGlobal.__setModuleDefault||(Object.create?function(e,A){Object.defineProperty(e,"default",{enumerable:!0,value:A});}:function(e,A){e.default=A;}),__importStar=_commonjsHelpers.commonjsGlobal&&_commonjsHelpers.commonjsGlobal.__importStar||function(e){if(e&&e.__esModule)return e;var A={};if(e!=null)for(var t in e)t!=="default"&&Object.prototype.hasOwnProperty.call(e,t)&&__createBinding(A,e,t);return __setModuleDefault(A,e),A},__importDefault=_commonjsHelpers.commonjsGlobal&&_commonjsHelpers.commonjsGlobal.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(dist,"__esModule",{value:!0});var HttpsProxyAgent_1=dist.HttpsProxyAgent=void 0;const net=__importStar(require$$0__default$7),tls=__importStar(require$$1__default$3),assert_1=__importDefault(require$$2__default$1),debug_1=__importDefault(srcExports),agent_base_1=dist$2,url_1=require$$5__default$2,parse_proxy_response_1=parseProxyResponse$1,debug$3=(0, debug_1.default)("https-proxy-agent"),vt=class vt extends agent_base_1.Agent{constructor(A,t){super(t),this.options={path:void 0},this.proxy=typeof A=="string"?new url_1.URL(A):A,this.proxyHeaders=t?.headers??{},debug$3("Creating new HttpsProxyAgent instance: %o",this.proxy.href);const r=(this.proxy.hostname||this.proxy.host).replace(/^\[|\]$/g,""),n=this.proxy.port?parseInt(this.proxy.port,10):this.proxy.protocol==="https:"?443:80;this.connectOpts={ALPNProtocols:["http/1.1"],...t?omit(t,"headers"):null,host:r,port:n};}async connect(A,t){const{proxy:r}=this;if(!t.host)throw new TypeError('No "host" provided');let n;if(r.protocol==="https:"){debug$3("Creating `tls.Socket`: %o",this.connectOpts);const y=this.connectOpts.servername||this.connectOpts.host;n=tls.connect({...this.connectOpts,servername:y&&net.isIP(y)?void 0:y});}else debug$3("Creating `net.Socket`: %o",this.connectOpts),n=net.connect(this.connectOpts);const o=typeof this.proxyHeaders=="function"?this.proxyHeaders():{...this.proxyHeaders},B=net.isIPv6(t.host)?`[${t.host}]`:t.host;let l=`CONNECT ${B}:${t.port} HTTP/1.1\r
`;if(r.username||r.password){const y=`${decodeURIComponent(r.username)}:${decodeURIComponent(r.password)}`;o["Proxy-Authorization"]=`Basic ${Buffer.from(y).toString("base64")}`;}o.Host=`${B}:${t.port}`,o["Proxy-Connection"]||(o["Proxy-Connection"]=this.keepAlive?"Keep-Alive":"close");for(const y of Object.keys(o))l+=`${y}: ${o[y]}\r
`;const C=(0, parse_proxy_response_1.parseProxyResponse)(n);n.write(`${l}\r
`);const{connect:f,buffered:c}=await C;if(A.emit("proxyConnect",f),this.emit("proxyConnect",f,A),f.statusCode===200){if(A.once("socket",resume),t.secureEndpoint){debug$3("Upgrading socket connection to TLS");const y=t.servername||t.host;return tls.connect({...omit(t,"host","path","port"),socket:n,servername:net.isIP(y)?void 0:y})}return n}n.destroy();const I=new net.Socket({writable:!1});return I.readable=!0,A.once("socket",y=>{debug$3("Replaying proxy buffer for failed request"),(0, assert_1.default)(y.listenerCount("data")>0),y.push(c),y.push(null);}),I}};Q(vt,"HttpsProxyAgent");let HttpsProxyAgent=vt;HttpsProxyAgent.protocols=["http","https"],HttpsProxyAgent_1=dist.HttpsProxyAgent=HttpsProxyAgent;function resume(e){e.resume();}Q(resume,"resume");function omit(e,...A){const t={};let r;for(r in e)A.includes(r)||(t[r]=e[r]);return t}Q(omit,"omit");var d=Object.defineProperty,O=Q((e,A,t)=>A in e?d(e,A,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[A]=t,"O"),s=Q((e,A)=>d(e,"name",{value:A,configurable:!0}),"s"),i=Q((e,A,t)=>(O(e,typeof A!="symbol"?A+"":A,t),t),"i");function H(...e){process.env.DEBUG&&console.debug("[node-fetch-native] [proxy]",...e);}Q(H,"H"),s(H,"debug");function P(e,A){if(!A)return !1;for(const t of A)if(t===e||t[0]==="."&&e.endsWith(t.slice(1)))return !0;return !1}Q(P,"P"),s(P,"bypassProxy");const g=(tt=class extends ProxyAgent_1{constructor(A){super(A),this._options=A,i(this,"_agent"),this._agent=new Agent_1;}dispatch(A,t){const r=new require$$1.URL(A.origin).hostname;return P(r,this._options.noProxy)?(H(`Bypassing proxy for: ${r}`),this._agent.dispatch(A,t)):super.dispatch(A,t)}},Q(tt,"g"),tt);s(g,"UndiciProxyAgent");let h=g;const T=["http","https"],E={http:[HttpProxyAgent_1,HttpsProxyAgent_1],https:[HttpProxyAgent_1,HttpsProxyAgent_1]};function L(e){return T.includes(e)}Q(L,"L"),s(L,"isValidProtocol");const u=(rt=class extends dist$2.Agent{constructor(A){super({}),this._options=A,i(this,"cache",new Map),i(this,"httpAgent"),i(this,"httpsAgent"),this.httpAgent=new http__namespace.Agent({}),this.httpsAgent=new https__namespace.Agent({});}connect(A,t){const r=A.getHeader("upgrade")==="websocket",n=t.secureEndpoint?r?"wss:":"https:":r?"ws:":"http:",o=A.getHeader("host");if(P(o,this._options.noProxy))return t.secureEndpoint?this.httpsAgent:this.httpAgent;const B=`${n}+${this._options.uri}`;let l=this.cache.get(B);if(!l){const C=new require$$1.URL(this._options.uri).protocol.replace(":","");if(!L(C))throw new Error(`Unsupported protocol for proxy URL: ${this._options.uri}`);const f=E[C][t.secureEndpoint||r?1:0];l=new f(this._options.uri,this._options),this.cache.set(B,l);}return l}destroy(){for(const A of this.cache.values())A.destroy();super.destroy();}},Q(rt,"u"),rt);s(u,"NodeProxyAgent");let a=u;function createProxy(e={}){const A=e.url||process.env.https_proxy||process.env.http_proxy||process.env.HTTPS_PROXY||process.env.HTTP_PROXY;if(!A)return {agent:void 0,dispatcher:void 0};const t=e.noProxy||process.env.no_proxy||process.env.NO_PROXY,r=typeof t=="string"?t.split(","):t,n=new a({uri:A,noProxy:r}),o=new h({uri:A,noProxy:r});return {agent:n,dispatcher:o}}Q(createProxy,"createProxy"),s(createProxy,"createProxy");function createFetch(e={}){const A=createProxy(e);return (t,r)=>nodeFetchNative.fetch(t,{...A,...r})}Q(createFetch,"createFetch"),s(createFetch,"createFetch");const fetch=createFetch({});fetch_2 = fetch;

async function download(url, filePath, options = {}) {
  const infoPath = filePath + ".json";
  const info = JSON.parse(
    await readFile(infoPath, "utf8").catch(() => "{}")
  );
  const headResponse = await sendFetch(url, {
    method: "HEAD",
    headers: options.headers
  }).catch(() => void 0);
  const etag = headResponse?.headers.get("etag");
  if (info.etag === etag && existsSync(filePath)) {
    return;
  }
  if (typeof etag === "string") {
    info.etag = etag;
  }
  const response = await sendFetch(url, { headers: options.headers });
  if (response.status >= 400) {
    throw new Error(
      `Failed to download ${url}: ${response.status} ${response.statusText}`
    );
  }
  const stream = createWriteStream(filePath);
  await promisify$3(pipeline$3)(response.body, stream);
  await writeFile(infoPath, JSON.stringify(info), "utf8");
}
const inputRegex = /^(?<repo>[\w.-]+\/[\w.-]+)(?<subdir>[^#]+)?(?<ref>#[\w./@-]+)?/;
function parseGitURI(input) {
  const m = input.match(inputRegex)?.groups || {};
  return {
    repo: m.repo,
    subdir: m.subdir || "/",
    ref: m.ref ? m.ref.slice(1) : "main"
  };
}
function debug(...args) {
  if (process.env.DEBUG) {
    console.debug("[giget]", ...args);
  }
}
async function sendFetch(url, options = {}) {
  if (options.headers?.["sec-fetch-mode"]) {
    options.mode = options.headers["sec-fetch-mode"];
  }
  const res = await fetch_2(url, {
    ...options,
    headers: normalizeHeaders(options.headers)
  }).catch((error) => {
    throw new Error(`Failed to download ${url}: ${error}`, { cause: error });
  });
  if (options.validateStatus && res.status >= 400) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res;
}
function cacheDirectory() {
  return process.env.XDG_CACHE_HOME ? resolve$1(process.env.XDG_CACHE_HOME, "giget") : resolve$1(homedir(), ".cache/giget");
}
function normalizeHeaders(headers = {}) {
  const normalized = {};
  for (const [key, value] of Object.entries(headers)) {
    if (!value) {
      continue;
    }
    normalized[key.toLowerCase()] = value;
  }
  return normalized;
}
function currentShell() {
  if (process.env.SHELL) {
    return process.env.SHELL;
  }
  if (process.platform === "win32") {
    return "cmd.exe";
  }
  return "/bin/bash";
}
function startShell(cwd) {
  cwd = resolve$1(cwd);
  const shell = currentShell();
  console.info(
    `(experimental) Opening shell in ${relative(process.cwd(), cwd)}...`
  );
  spawnSync(shell, [], {
    cwd,
    shell: true,
    stdio: "inherit"
  });
}

const http = async (input, options) => {
  if (input.endsWith(".json")) {
    return await _httpJSON(input, options);
  }
  const url = new URL(input);
  let name = basename(url.pathname);
  try {
    const head = await sendFetch(url.href, {
      method: "HEAD",
      validateStatus: true,
      headers: {
        authorization: options.auth ? `Bearer ${options.auth}` : void 0
      }
    });
    const _contentType = head.headers.get("content-type") || "";
    if (_contentType.includes("application/json")) {
      return await _httpJSON(input, options);
    }
    const filename = head.headers.get("content-disposition")?.match(/filename="?(.+)"?/)?.[1];
    if (filename) {
      name = filename.split(".")[0];
    }
  } catch (error) {
    debug(`Failed to fetch HEAD for ${url.href}:`, error);
  }
  return {
    name: `${name}-${url.href.slice(0, 8)}`,
    version: "",
    subdir: "",
    tar: url.href,
    defaultDir: name,
    headers: {
      Authorization: options.auth ? `Bearer ${options.auth}` : void 0
    }
  };
};
const _httpJSON = async (input, options) => {
  const result = await sendFetch(input, {
    validateStatus: true,
    headers: {
      authorization: options.auth ? `Bearer ${options.auth}` : void 0
    }
  });
  const info = await result.json();
  if (!info.tar || !info.name) {
    throw new Error(
      `Invalid template info from ${input}. name or tar fields are missing!`
    );
  }
  return info;
};
const github = (input, options) => {
  const parsed = parseGitURI(input);
  const githubAPIURL = process.env.GIGET_GITHUB_URL || "https://api.github.com";
  return {
    name: parsed.repo.replace("/", "-"),
    version: parsed.ref,
    subdir: parsed.subdir,
    headers: {
      Authorization: options.auth ? `Bearer ${options.auth}` : void 0,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
    url: `${githubAPIURL.replace("api.github.com", "github.com")}/${parsed.repo}/tree/${parsed.ref}${parsed.subdir}`,
    tar: `${githubAPIURL}/repos/${parsed.repo}/tarball/${parsed.ref}`
  };
};
const gitlab = (input, options) => {
  const parsed = parseGitURI(input);
  const gitlab2 = process.env.GIGET_GITLAB_URL || "https://gitlab.com";
  return {
    name: parsed.repo.replace("/", "-"),
    version: parsed.ref,
    subdir: parsed.subdir,
    headers: {
      authorization: options.auth ? `Bearer ${options.auth}` : void 0,
      // https://gitlab.com/gitlab-org/gitlab/-/commit/50c11f278d18fe1f3fb12eb595067216bb58ade2
      "sec-fetch-mode": "same-origin"
    },
    url: `${gitlab2}/${parsed.repo}/tree/${parsed.ref}${parsed.subdir}`,
    tar: `${gitlab2}/${parsed.repo}/-/archive/${parsed.ref}.tar.gz`
  };
};
const bitbucket = (input, options) => {
  const parsed = parseGitURI(input);
  return {
    name: parsed.repo.replace("/", "-"),
    version: parsed.ref,
    subdir: parsed.subdir,
    headers: {
      authorization: options.auth ? `Bearer ${options.auth}` : void 0
    },
    url: `https://bitbucket.com/${parsed.repo}/src/${parsed.ref}${parsed.subdir}`,
    tar: `https://bitbucket.org/${parsed.repo}/get/${parsed.ref}.tar.gz`
  };
};
const sourcehut = (input, options) => {
  const parsed = parseGitURI(input);
  return {
    name: parsed.repo.replace("/", "-"),
    version: parsed.ref,
    subdir: parsed.subdir,
    headers: {
      authorization: options.auth ? `Bearer ${options.auth}` : void 0
    },
    url: `https://git.sr.ht/~${parsed.repo}/tree/${parsed.ref}/item${parsed.subdir}`,
    tar: `https://git.sr.ht/~${parsed.repo}/archive/${parsed.ref}.tar.gz`
  };
};
const providers = {
  http,
  https: http,
  github,
  gh: github,
  gitlab,
  bitbucket,
  sourcehut
};

const DEFAULT_REGISTRY$1 = "https://raw.githubusercontent.com/unjs/giget/main/templates";
const registryProvider = (registryEndpoint = DEFAULT_REGISTRY$1, options = {}) => {
  return async (input) => {
    const start = Date.now();
    const registryURL = `${registryEndpoint}/${input}.json`;
    const result = await sendFetch(registryURL, {
      headers: {
        authorization: options.auth ? `Bearer ${options.auth}` : void 0
      }
    });
    if (result.status >= 400) {
      throw new Error(
        `Failed to download ${input} template info from ${registryURL}: ${result.status} ${result.statusText}`
      );
    }
    const info = await result.json();
    if (!info.tar || !info.name) {
      throw new Error(
        `Invalid template info from ${registryURL}. name or tar fields are missing!`
      );
    }
    debug(
      `Fetched ${input} template info from ${registryURL} in ${Date.now() - start}ms`
    );
    return info;
  };
};

const sourceProtoRe = /^([\w-.]+):/;
async function downloadTemplate(input, options = {}) {
  options = defu(
    {
      registry: process.env.GIGET_REGISTRY,
      auth: process.env.GIGET_AUTH
    },
    options
  );
  const registry = options.registry === false ? void 0 : registryProvider(options.registry, { auth: options.auth });
  let providerName = options.provider || (registry ? "registry" : "github");
  let source = input;
  const sourceProvierMatch = input.match(sourceProtoRe);
  if (sourceProvierMatch) {
    providerName = sourceProvierMatch[1];
    source = input.slice(sourceProvierMatch[0].length);
    if (providerName === "http" || providerName === "https") {
      source = input;
    }
  }
  const provider = options.providers?.[providerName] || providers[providerName] || registry;
  if (!provider) {
    throw new Error(`Unsupported provider: ${providerName}`);
  }
  const template = await Promise.resolve().then(() => provider(source, { auth: options.auth })).catch((error) => {
    throw new Error(
      `Failed to download template from ${providerName}: ${error.message}`
    );
  });
  if (!template) {
    throw new Error(`Failed to resolve template from ${providerName}`);
  }
  template.name = (template.name || "template").replace(/[^\da-z-]/gi, "-");
  template.defaultDir = (template.defaultDir || template.name).replace(
    /[^\da-z-]/gi,
    "-"
  );
  const temporaryDirectory = resolve$1(
    cacheDirectory(),
    providerName,
    template.name
  );
  const tarPath = resolve$1(
    temporaryDirectory,
    (template.version || template.name) + ".tar.gz"
  );
  if (options.preferOffline && existsSync(tarPath)) {
    options.offline = true;
  }
  if (!options.offline) {
    await mkdir$2(dirname$3(tarPath), { recursive: true });
    const s2 = Date.now();
    await download(template.tar, tarPath, {
      headers: {
        Authorization: options.auth ? `Bearer ${options.auth}` : void 0,
        ...normalizeHeaders(template.headers)
      }
    }).catch((error) => {
      if (!existsSync(tarPath)) {
        throw error;
      }
      debug("Download error. Using cached version:", error);
      options.offline = true;
    });
    debug(`Downloaded ${template.tar} to ${tarPath} in ${Date.now() - s2}ms`);
  }
  if (!existsSync(tarPath)) {
    throw new Error(
      `Tarball not found: ${tarPath} (offline: ${options.offline})`
    );
  }
  const cwd = resolve$1(options.cwd || ".");
  const extractPath = resolve$1(cwd, options.dir || template.defaultDir);
  if (options.forceClean) {
    await rm(extractPath, { recursive: true, force: true });
  }
  if (!options.force && existsSync(extractPath) && readdirSync$1(extractPath).length > 0) {
    throw new Error(`Destination ${extractPath} already exists.`);
  }
  await mkdir$2(extractPath, { recursive: true });
  const s = Date.now();
  const subdir = template.subdir?.replace(/^\//, "") || "";
  await extract({
    file: tarPath,
    cwd: extractPath,
    onentry(entry) {
      entry.path = entry.path.split("/").splice(1).join("/");
      if (subdir) {
        if (entry.path.startsWith(subdir + "/")) {
          entry.path = entry.path.slice(subdir.length);
        } else {
          entry.path = "";
        }
      }
    }
  });
  debug(`Extracted to ${extractPath} in ${Date.now() - s}ms`);
  if (options.install) {
    debug("Installing dependencies...");
    await installDependencies({
      cwd: extractPath,
      silent: options.silent
    });
  }
  return {
    ...template,
    source,
    dir: extractPath
  };
}

const DEFAULT_REGISTRY = "https://raw.githubusercontent.com/nuxt/starter/templates/templates";
const DEFAULT_TEMPLATE_NAME = "v3";
const init = defineCommand({
  meta: {
    name: "init",
    description: "Initialize a fresh project"
  },
  args: {
    ...sharedArgs,
    dir: {
      type: "positional",
      description: "Project directory",
      default: ""
    },
    template: {
      type: "string",
      alias: "t",
      description: "Template name"
    },
    force: {
      type: "boolean",
      alias: "f",
      description: "Override existing directory"
    },
    offline: {
      type: "boolean",
      description: "Force offline mode"
    },
    preferOffline: {
      type: "boolean",
      description: "Prefer offline mode"
    },
    install: {
      type: "boolean",
      default: true,
      description: "Skip installing dependencies"
    },
    gitInit: {
      type: "boolean",
      description: "Initialize git repository"
    },
    shell: {
      type: "boolean",
      description: "Start shell after installation in project directory"
    },
    packageManager: {
      type: "string",
      description: "Package manager choice (npm, pnpm, yarn, bun)"
    }
  },
  async run(ctx) {
    const cwd = resolve$1(ctx.args.cwd || ".");
    const templateName = ctx.args.template || DEFAULT_TEMPLATE_NAME;
    if (typeof templateName !== "string") {
      consola.error("Please specify a template!");
      process.exit(1);
    }
    let template;
    try {
      template = await downloadTemplate(templateName, {
        dir: ctx.args.dir,
        cwd,
        force: Boolean(ctx.args.force),
        offline: Boolean(ctx.args.offline),
        preferOffline: Boolean(ctx.args.preferOffline),
        registry: process.env.NUXI_INIT_REGISTRY || DEFAULT_REGISTRY
      });
    } catch (err) {
      if (process.env.DEBUG) {
        throw err;
      }
      consola.error(err.toString());
      process.exit(1);
    }
    const packageManagerOptions = [
      "npm",
      "pnpm",
      "yarn",
      "bun"
    ];
    const packageManagerArg = ctx.args.packageManager;
    const selectedPackageManager = packageManagerOptions.includes(
      packageManagerArg
    ) ? packageManagerArg : await consola.prompt("Which package manager would you like to use?", {
      type: "select",
      options: packageManagerOptions
    });
    if (ctx.args.install === false) {
      consola.info("Skipping install dependencies step.");
    } else {
      consola.start("Installing dependencies...");
      try {
        await installDependencies({
          cwd: template.dir,
          packageManager: {
            name: selectedPackageManager,
            command: selectedPackageManager
          }
        });
      } catch (err) {
        if (process.env.DEBUG) {
          throw err;
        }
        consola.error(err.toString());
        process.exit(1);
      }
      consola.success("Installation completed.");
    }
    if (ctx.args.gitInit === void 0) {
      ctx.args.gitInit = await consola.prompt("Initialize git repository?", {
        type: "confirm"
      });
    }
    if (ctx.args.gitInit) {
      consola.info("Initializing git repository...\n");
      const { execa } = await import('./index3.mjs');
      await execa("git", ["init", template.dir], {
        stdio: "inherit"
      }).catch((err) => {
        consola.warn(`Failed to initialize git repository: ${err}`);
      });
    }
    consola.log(
      `
\u2728 Nuxt project has been created with the \`${template.name}\` template. Next steps:`
    );
    const relativeTemplateDir = relative(process.cwd(), template.dir) || ".";
    const nextSteps = [
      !ctx.args.shell && relativeTemplateDir.length > 1 && `\`cd ${relativeTemplateDir}\``,
      `Start development server with \`${selectedPackageManager} run dev\``
    ].filter(Boolean);
    for (const step of nextSteps) {
      consola.log(` \u203A ${step}`);
    }
    if (ctx.args.shell) {
      startShell(template.dir);
    }
  }
});

const init$1 = {
  __proto__: null,
  default: init
};

export { init$1 as i, node$2 as n };
