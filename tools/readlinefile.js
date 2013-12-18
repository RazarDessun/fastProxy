var fs = require('fs');
var path = require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
/**
* Read stream data line by line.
*
* @constructor
* @param {String|ReadStream} file File path or data stream object.
*/
function LineReader(file) {
  if (typeof file === 'string') {
    this.readstream = fs.createReadStream(file);
  } else {
    this.readstream = file;
  }
  this.remainBuffers = [];
  var self = this;
  this.readstream.on('data', function (data) {
    self.ondata(data);
  });
  this.readstream.on('error', function (err) {
    self.emit('error', err);
  });
  this.readstream.on('end', function () {
    self.emit('end');
  });
}
util.inherits(LineReader, EventEmitter);

/**
* `Stream` data event handler.
*
* @param {Buffer} data
* @private
*/
LineReader.prototype.ondata = function (data) {
  var i = 0;
  var found = false;
  for (var l = data.length; i < l; i++) {
    if (data[i] === 10) {
      found = true;
      break;
    }
  }
  if (!found) {
    this.remainBuffers.push(data);
    return;
  }
  var line = null;
  if (this.remainBuffers.length > 0) {
    var size = i;
    var j, jl = this.remainBuffers.length;
    for (j = 0; j < jl; j++) {
      size += this.remainBuffers[j].length;
    }
    line = new Buffer(size);
    var pos = 0;
    for (j = 0; j < jl; j++) {
      var buf = this.remainBuffers[j];
      buf.copy(line, pos);
      pos += buf.length;
    }
    // check if `\n` is the first char in `data`
    if (i > 0) {
      data.copy(line, pos, 0, i);
    }
    this.remainBuffers = [];
  } else {
    line = data.slice(0, i);
  }
  this.emit('line', line);
  this.ondata(data.slice(i + 1));
};

/**
* Line data reader
*
* @example
* var ndir = require('ndir');
* ndir.createLineReader('/tmp/access.log')
* .on('line', function(line) { console.log(line.toString()); })
* .on('end', function() {})
* .on('error', function(err) { console.error(err); });
*
* @param {String|ReadStream} file, file path or a `ReadStream` object.
*/
exports.createLineReader = function (file) {
  return new LineReader(file);
};