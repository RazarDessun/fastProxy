var SBuffer = function () {
  this.buffers = [];
  this.len=0;
  this.encoding="utf8";
};
SBuffer.prototype.encode = function (charset) {
  this.encoding=charset;
  return this;
};

SBuffer.prototype.append = function (buffer) {
  this.buffers.push(buffer);
  this.len+=Buffer.byteLength(buffer, this.encoding);
  return this;
};

SBuffer.prototype.empty = function () {
  this.buffers = [];
  this.len=0;
  return this;
};
/*
SBuffer.prototype.toBuffer = function () {
  return Buffer.concat(this.buffers);
};

SBuffer.prototype.toString = function (encoding) {
  return this.toBuffer().toString(encoding);
};
*/
SBuffer.prototype.toBuffer=function(){
   var len=this.buffers.length;
   var nread=this.len;
   var tmpbuffer=null;
   switch(len) {
        case 0: tmpbuffer = new Buffer(0);
            break;
        case 1: tmpbuffer = new Buffer(this.buffers[0]);  
            break;
        default:
            tmpbuffer = new Buffer(nread);
            for (var i = 0, pos = 0, l = len; i < l; i++) {
                //var chunk = new Buffer(this.buffers[i]);
                //console.log(typeof(chunk),chunk,pos,this.buffers[i]);
                //chunk.copy(buffer, pos);
                //pos += chunk.length;
                tmpbuffer.write(this.buffers[i],pos,this.encoding);
                pos += Buffer.byteLength(this.buffers[i], this.encoding)
            }
          break;
    }
    return tmpbuffer;
}


SBuffer.prototype.toString = function () {
	return this.toBuffer().toString(this.encoding);
};
SBuffer.prototype.load = function (stream, callback) {
  var that = this;
  stream.on('data', function (trunk) {
    that.append(trunk);
  });
  stream.on('end', function () {
    callback(null, that.toString());
  });
};

module.exports = SBuffer;
