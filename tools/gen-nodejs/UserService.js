//
// Autogenerated by Thrift Compiler (0.8.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
var Thrift = require('thrift').Thrift;

var ttypes = require('./user_types');
//HELPER FUNCTIONS AND STRUCTURES

var UserService_add_args = function(args) {
  this.u = null;
  if (args) {
    if (args.u !== undefined) {
      this.u = args.u;
    }
  }
};
UserService_add_args.prototype = {};
UserService_add_args.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRUCT) {
        this.u = new ttypes.User();
        this.u.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

UserService_add_args.prototype.write = function(output) {
  output.writeStructBegin('UserService_add_args');
  if (this.u) {
    output.writeFieldBegin('u', Thrift.Type.STRUCT, 1);
    this.u.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var UserService_add_result = function(args) {
};
UserService_add_result.prototype = {};
UserService_add_result.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    input.skip(ftype);
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

UserService_add_result.prototype.write = function(output) {
  output.writeStructBegin('UserService_add_result');
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var UserService_get_args = function(args) {
  this.uid = null;
  if (args) {
    if (args.uid !== undefined) {
      this.uid = args.uid;
    }
  }
};
UserService_get_args.prototype = {};
UserService_get_args.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.uid = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

UserService_get_args.prototype.write = function(output) {
  output.writeStructBegin('UserService_get_args');
  if (this.uid) {
    output.writeFieldBegin('uid', Thrift.Type.STRING, 1);
    output.writeString(this.uid);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var UserService_get_result = function(args) {
  this.success = null;
  if (args) {
    if (args.success !== undefined) {
      this.success = args.success;
    }
  }
};
UserService_get_result.prototype = {};
UserService_get_result.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 0:
      if (ftype == Thrift.Type.STRUCT) {
        this.success = new ttypes.User();
        this.success.read(input);
      } else {
        input.skip(ftype);
      }
      break;
      case 0:
        input.skip(ftype);
        break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

UserService_get_result.prototype.write = function(output) {
  output.writeStructBegin('UserService_get_result');
  if (this.success) {
    output.writeFieldBegin('success', Thrift.Type.STRUCT, 0);
    this.success.write(output);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var UserServiceClient = exports.Client = function(output, pClass) {
    this.output = output;
    this.pClass = pClass;
    this.seqid = 0;
    this._reqs = {};
	this.start=0;
};
UserServiceClient.prototype = {};
UserServiceClient.prototype.add = function(u, callback) {
	this.start=new Date().getTime();
  this.seqid += 1;
  this._reqs[this.seqid] = callback;
  this.send_add(u);
};

UserServiceClient.prototype.send_add = function(u) {
  var output = new this.pClass(this.output);
  output.writeMessageBegin('add', Thrift.MessageType.CALL, this.seqid);
  var args = new UserService_add_args();
  args.u = u;
  args.write(output);
  output.writeMessageEnd();
  return this.output.flush();
};

UserServiceClient.prototype.recv_add = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new UserService_add_result();
  result.read(input);
  input.readMessageEnd();

  callback(null)
};
UserServiceClient.prototype.get = function(uid, callback) {
  this.seqid += 1;
  this._reqs[this.seqid] = callback;
  this.send_get(uid);
};

UserServiceClient.prototype.send_get = function(uid) {
  var output = new this.pClass(this.output);
  output.writeMessageBegin('get', Thrift.MessageType.CALL, this.seqid);
  var args = new UserService_get_args();
  args.uid = uid;
  args.write(output);
  output.writeMessageEnd();
  return this.output.flush();
};

UserServiceClient.prototype.recv_get = function(input,mtype,rseqid) {
  var callback = this._reqs[rseqid] || function() {};
  delete this._reqs[rseqid];
  if (mtype == Thrift.MessageType.EXCEPTION) {
    var x = new Thrift.TApplicationException();
    x.read(input);
    input.readMessageEnd();
    return callback(x);
  }
  var result = new UserService_get_result();
  result.read(input);
  input.readMessageEnd();

  if (null !== result.success) {
    return callback(null, result.success);
  }
  return callback('get failed: unknown result');
};
var UserServiceProcessor = exports.Processor = function(handler) {
  this._handler = handler
}
UserServiceProcessor.prototype.process = function(input, output) {
  var r = input.readMessageBegin();
  if (this['process_' + r.fname]) {
    return this['process_' + r.fname].call(this, r.rseqid, input, output);
  } else {
    input.skip(Thrift.Type.STRUCT);
    input.readMessageEnd();
    var x = new Thrift.TApplicationException(Thrift.TApplicationExceptionType.UNKNOWN_METHOD, 'Unknown function ' + r.fname);
    output.writeMessageBegin(r.fname, Thrift.MessageType.Exception, r.rseqid);
    x.write(output);
    output.writeMessageEnd();
    output.flush();
  }
}

UserServiceProcessor.prototype.process_add = function(seqid, input, output) {
  var args = new UserService_add_args();
  args.read(input);
  input.readMessageEnd();
  var result = new UserService_add_result();
  this._handler.add(args.u, function (success) {
    result.success = success;
    output.writeMessageBegin("add", Thrift.MessageType.REPLY, seqid);
    result.write(output);
    output.writeMessageEnd();
    output.flush();
  })
}

UserServiceProcessor.prototype.process_get = function(seqid, input, output) {
  var args = new UserService_get_args();
  args.read(input);
  input.readMessageEnd();
  var result = new UserService_get_result();
  this._handler.get(args.uid, function (success) {
    result.success = success;
    output.writeMessageBegin("get", Thrift.MessageType.REPLY, seqid);
    result.write(output);
    output.writeMessageEnd();
    output.flush();
  })
}

