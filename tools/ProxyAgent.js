var http = require("http");
var querystring = require("querystring"); // 核心模块
var url = require("url");
var SBuffer=require("../tools/SBuffer");
var common=require("../tools/common");
var zlib=require("zlib");
var redis_pool=require("../tools/connection_pool"); 

var events = new require("events").EventEmitter;
var util = require('util'); 

function ProxyAgent(){
	this.headNeeds = "";           //头信息
	this.preAnalysisFields = "";   //统计字段定义 
	this.AnalysisFields = {};      //统计对象
	this.logName="";               //日志名称
	this.response=null;            //输出连接对象 
	this.reqConf={};               //配置信息
	this.retData=[];
	this.redis =null;              // redis {} redis_key
	this.mobileid="";              //设备信息id
	this.eAgent=null;              //eventProxy 对象
	this.objQuery={};               //url 参数 
	this.objHeaders={};             //头 参数 
	this.objBody={};                //body体 参数
	//events.EventEmitter.call(this);
}
//继承
util.inherits(ProxyAgent, events);

/**
 * 获取服务配置信息
 * @param 服务名
 * @return object 
 */ 
ProxyAgent.prototype.getReqConfig = function(logName){
	var _self=this;
	var Obj={};
	Obj=Config[logName];
	Obj.logger=Analysis.getLogger(logName);
	Obj.name=logName;
	_self.headNeeds= Obj.headers;
	_self.logName= Obj.logName;
	delete Obj.headers;
	_self.preAnalysisFields=Obj.Analysis || "";
	delete Obj.Analysis;
	_self.reqConf=Obj;
	return Obj;
}

/**
 * 设置对象
 * @param key 对象字段名称
 * @param val 对象字段内容
 */ 
ProxyAgent.prototype.setobj= function(key,val){
	//var _self=this;
	if(typeof(this[key])!="undefined"){
		this[key]=val;
	}
}

ProxyAgent.prototype.ezRequest=function(_req,_res){
	var _self=this;
	var opts=_self.getRequest(_req,_res);
	var httpopts=_self.buildReqOptions(opts);
	_self.doRequest(httpopts);
}


ProxyAgent.prototype.getRequest=function(_req,_res){
	var _self=this;
	_self.response=_res;
	logger.debug('进入'+_self.reqConf.desc+"服务");
	var header_obj = _self.objHeaders = this.packageHeaders(_req.headers,this.headNeeds);
	_self.mobileid =_req.headers['mobileid']||"no_mobileid";
	var url_obj = url.parse(_req.url, true);
	var query_obj = url_obj.query || {}; 
	
	var postData = _req.body|| ""; // 获取请求参数
	
	_res.setHeader("Content-Type", Config.contentType);
	_res.setHeader(Config.headerkey, Config.headerval);
	var opts=_self.packData(header_obj,query_obj,postData);
	logger.debug(header_obj.mobileid +_self.reqConf.desc+ '接口参数信息：'+opts[0].path +" data:"+  opts[1]);
	
	console.log(opts,"packData");
	return opts;
}


ProxyAgent.prototype.doRequest=function(opts){
	var trigger=arguments[1]||null;

	if(opts.length==3 && opts[2]=="redis"){
		this.getRedis(opts[0],opts[1],trigger);
	}
	else{
		this.httpProxy(opts[0],opts[1],trigger);
	}
}

ProxyAgent.prototype.buildReqOptions =function(opts){
	var _self=this;
	var conf =arguments[1] || "";
	var actionlocation = _self.objHeaders.actionlocation || "";
	if(actionlocation==""){
		actionlocation=_self.objQuery.actionlocation||"";
	}
	console.log(opts[1]);
	var opts2=_self.getRequestOptions(opts[1].length,actionlocation,conf);

	opts2.path+=((opts2.path.indexOf("?")>=0)?"&":"?")+opts[0];
	//option,
	return [opts2 ,opts[1]];
}
/**
 * 封装get post接口
 * @param headers
 * @param query
 * @param body
 * @return []
 */ 
ProxyAgent.prototype.packData=function(headers,query,body){
	var _self=this;
	//resType 解释 ""==>GET,"body"==>POST,"json"==>特殊poi,"raw"==>原始数据
	var type=_self.reqConf.resType || ""; 
	body = body || "";
	var len=0;
	var query_str="";
	var body_str="";
	if(type==""){
		query=common.extends(query,headers);
		_self.objQuery=query;
		query_str = querystring.stringify(query, '&', '=');
	}
	else if(type=="body"){
		body=common.extends(body,headers);
		_self.objBody=body;
		body_str = querystring.stringify(body, '&', '=');
		len=body_str.length;		
			if(body.redis_key){
				this.redis={};
				this.redis.redis_key=body.redis_key;
			}
	}
	else if(type=="json"){
		query=common.extends(query,headers);
		_self.objQuery=query;
		query_str = 'json='+JSON.stringify(query);
	}
	else if(type=="raw"){
		len=body.length;
		body_str=body;
	}

	return [query_str,body_str];
}

/**
 * 获取请求头信息
 * @param len数据长度
 * @param actiontion  通用访问地址
 * @param conf        http 信息
 * @return object  头信息
 */ 
ProxyAgent.prototype.getRequestOptions=function(len,actionlocation){
	var _self=this;
	var conf=arguments[2] || "";
	
	if(conf==""){
		conf= _self.reqConf;
	}
	
	var options = {												//http请求参数设置
	    host: conf.host,								// 远端服务器域名
	    port: conf.port,								// 远端服务器端口号
	    path: conf.reqPath||"",							
	    headers : {'Connection' : 'keep-alive'}
	};
	if(actionlocation.length>0){
		options.path=actionlocation;
	}
	
	var  rtype= conf.reqType || "";
	if(rtype.length>0){
		options.headers['Content-Type']=rtype; 
    }
    if(len>0){
		options.headers['Content-Length']=len;
    }

	return options;
}

ProxyAgent.prototype.getRedisOptions=function(options,actionlocation){
	var obj={};

	return obj;
}


/**
 * 获取头部信息进行封装
 * @param request.headers
 * @param need fields ;split with ','
 * @return object headers
 */
ProxyAgent.prototype.packageHeaders = function(headers) {
	var fields=arguments[1]||"";
	var query_obj = {};
	var reqip = headers['x-real-ip'] || '0'; // 客户端请求的真实ip地址
	var forward = headers['x-forwarded-for'] || '0'; // 客户端请求来源
	var osversion = headers['osversion'] || '0';// 客户端系统
	var devicemodel = headers['devicemodel'] || '0';// 客户端型号
	var manufacturername = headers['manufacturername'] || '0';// 制造厂商
	var actionlocation = headers['actionlocation']; // 请求后台地址
	var dpi = headers['dpi'] || '2.0';// 密度
	var imsi = headers['imsi'] || '0'; // 客户端imsi
	var mobileid = headers['mobileid'] || '0'; // 客户端mibileid
	var version = headers['version'] || '0';// 客户端版本version
	var selflon = headers['selflon'] || '0';// 经度
	var selflat = headers['selflat'] || '0';// 维度
	var uid = headers['uid'] || '0'; // 犬号
	var radius=headers['radius']||'0';//误差半径
	var platform=headers['platform']||"";//平台 ios ,android
 	var gender=  headers['gender'] || '0'; 
 	
 	query_obj.gender = gender;
	query_obj.reqip = reqip;
	query_obj.forward = forward;
	query_obj.osversion = osversion;
	query_obj.devicemodel = devicemodel;
	query_obj.manufacturername = manufacturername;
	query_obj.actionlocation = actionlocation;
	query_obj.dpi = dpi;
	query_obj.imsi = imsi;
	query_obj.mobileid = mobileid;
	query_obj.version = version;
	query_obj.selflon = selflon;
	query_obj.selflat = selflat;
	query_obj.uid = uid;
	query_obj.radius=radius;
	query_obj.platform=platform;
	
	if(fields.length > 0){
		var afields = fields.split(",");
		var newObj = {};
		for(var i = 0; i < afields.length ; i ++){
			newObj[afields[i]] = query_obj[afields[i]] || "";		
		}
		return newObj;
	}
	else{
		return query_obj;
	}
}


/**
 * http 请求代理
 * @param options 远程接口信息
 * @param reqData 请求内容 req.method== get时一般为空
 * @param trigger 并发请求时的 eventProxy name 
 */ 
ProxyAgent.prototype.httpProxy = function (options,reqData,trigger){
	var _self=this;
	var TongjiObj={};
	var req = http.request(options, function(res) {
		
		var location = res.headers['location']||"";
		if(location.length>0){
			logger.debug('跳转地址：' + location);
			 _self.response.redirect(location);
			 return false;
		}
		
		TongjiObj.statusCode = res.statusCode ||500;
		var tmptime=Date.now();
		TongjiObj.restime = tmptime;
		TongjiObj.resEnd =tmptime;	
		TongjiObj.ends = tmptime;
		TongjiObj.length = 0;
		TongjiObj.last = tmptime;

	    var sbuffer=new SBuffer();
		res.setEncoding("utf-8");
		res.on('data', function (trunk) {
			sbuffer.append(trunk);
		});
		res.on('end', function () {
			TongjiObj.resEnd = Date.now();
		
			//doRequestCB(response, {"data":sbuffer.toString(),"status":res.statusCode},TongjiObj,redisOpt);
			_self.emit("onDone",sbuffer,res.statusCode,TongjiObj,trigger);
		});
	});
	req.setTimeout(Config.timeout,function(){
		 req.emit('timeOut',{message:'have been timeout...'});
	});
	req.on('error', function(e) {
		TongjiObj.statusCode=500;
		//req.abort();
		_self.emit("onDone","",500,TongjiObj,trigger);
		logger.info("emit1,mobileid="+_self.mobile_id);
	});
	req.on('timeOut', function(e) {
		console.log("retdata__501\n");
		req.abort();
		TongjiObj.statusCode=500;
		TongjiObj.last = Date.now();
		_self.emit("onDone","",500,TongjiObj,trigger);
		logger.info("emit2,mobileid="+_self.mobile_id);
	});
	req.end(reqData);
}

/**
 * 设置缓存
 * @param redis_key
 * @param redis_time
 * @param resultBuffer
 */
ProxyAgent.prototype.setRedis = function (redis_key, redis_time, resultBuffer) {
	redis_pool.acquire(function(err, client) {
		if (!err) {
			client.setex(redis_key, redis_time, resultBuffer, function(err,
					repliy) {
				redis_pool.release(client); // 链接使用完毕释放链接
			});
			logger.debug(redis_key + '设置缓存数据成功！');
		} else {
			writeLogs.logs(Analysis.getLogger('error'), 'error', {
				msg : 'redis_general保存数据到redis缓存数据库时链接redis数据库异常',
				err : 14
			});
			logger.debug(redis_key + '设置缓存数据失败！');
		}
	});
}


/**
 * 从缓存中获取数据，如果获取不到，则请求后台返回的数据返回给客户端 并且将返回的数据设置到redis缓存
 * redis_key通过self变量中取
 * @param options
 * @param reqData
 * @param trigger 并发请求时的 eventProxy name 
 */
ProxyAgent.prototype.getRedis = function ( options, reqData,trigger) {
	var _self=this;
	var redis_key=this.redis.redis_key || "";
	redis_pool.acquire(function(err, client) {
		if (!err) {
			client.get(redis_key, function(err, date) {
				redis_pool.release(client) // 用完之后释放链接
				if (!err && date != null) {
					var resultBuffer = new Buffer(date);
					_self.response.statusCode = 200;
					_self.response.setHeader("Content-Length", resultBuffer.length);
					_self.response.write(resultBuffer); // 以二进制流的方式输出数据
					_self.response.end();
					logger.debug(redis_key + '通用接口下行缓存数据:' + date);
				} else {
					_self.httpProxy(options, reqData,trigger);
				}
			});
		} else {
			_self.httpProxy(options, reqData,trigger);
		}
	});
}

/**
 * 输出gzip数据
 * response 内置
 * @param resultBuffer 
 */
ProxyAgent.prototype.gzipOutPut = function (resultBuffer){
	var _self=this;
	zlib.gzip(resultBuffer, function(code, buffer){						// 对服务器返回的数据进行压缩
        if (code != null) { // 如果正常结束
        	logger.debug('压缩成功,压缩前:'+resultBuffer.length+',压缩后:'+buffer.length);
        	_self.response.setHeader('Content-Encoding', 'gzip');					//压缩标志
        } else {
			buffer = new Buffer( '{"msg":["服务器返回数据非JSON格式"]}');
			_self.response.statusCode=500;
        }
        _self.response.setHeader("Content-Length", buffer.length);
		_self.response.write(buffer);
	    _self.response.end();	
	});
}

/**
 * 请求完毕处理
 * @param buffer  type buffer/string
 * @param status  请求http状态
 * @param tongji  object统计对象 日志内容
 */ 
ProxyAgent.prototype.onDone =function(buffer,status){
	//logger.debug(arguments);
	var tongji=arguments[2] ||"";
	var _self=this;
	var resultStr = typeof(buffer)=="object"?buffer.toString():buffer;
	
	if(this.reqConf.isjson==1){
		var resultObj = common.isJson( resultStr, _self.reqConf.logName); // 判断返回结果是否是json格式
		if (resultObj) { // 返回结果是json格式
			resultStr = JSON.stringify(resultObj);
			_self.response.statusCode = status;
		} else {
			resultStr = '{"msg":["gis服务器返回数据非JSON格式"]}';
			_self.response.statusCode = 500;
		}
	}
	else{
		_self.response.statusCode = status ;
		if(status==500 && typeof(_self.reqConf.errormsg)!="undefined" && _self.reqConf.errormsg.length>0){
			resultStr =decodeURIComponent(_self.reqConf.errormsg);
		}
	}	
				  
	var resultBuffer = new Buffer(resultStr);
	if(tongji!=""){
		tongji.ends = Date.now();
		tongji.length = resultBuffer.length;
	}
	if(resultBuffer.length > 500 && _self.reqConf.gzip==1){
		//压缩输出
		_self.gzipOutPut(resultBuffer);
		
	}else{
		_self.response.setHeader("Content-Length", resultBuffer.length);
		_self.response.write(resultBuffer); // 以二进制流的方式输出数据
		_self.response.end();
	}
	
	if(tongji!="" && _self.preAnalysisFields!=""){
		tongji.last= Date.now();
		tongji=common.extends(tongji,_self.preAnalysisFields);
		logger.debug('耗时:' + (tongji.last - tongji.start)+'ms statusCode='+status);
		writeLogs.logs(poiDetailServer,'poiDetailServer',obj);
	}
}

/**
 * 并发请求结果处理
 * @param buffer 返回内容
 * @param status httpcode
 * @param tongji 日志内容
 * @param trigger （Eventproxy trigger name）
 * 
 */ 
ProxyAgent.prototype.onDones =function(buffer,status,tongji,trigger){
	var _self=this;
	console.log("function  ondones called",trigger);
	var strings=buffer.toString();
	this.retData.push([strings,status,tongji,trigger]);
	if(_self.eAgent!=null){
		_self.eAgent.trigger(trigger,[strings,status,tongji]);
	}
};

ProxyAgent.prototype.dealDones =function(){
	var tongji=arguments[2] ||"";
	this.retData.push([buffer,status,tongji]);
};

//ProxyAgent 从event 集成
//utils.inherit(ProxyAgent,event);

exports.ProxyAgent=ProxyAgent;

/**
 * 并行请求
 * 
exports.test2=function(req,res){
	var proxy=new proxyAgent.ProxyAgent();
	proxy.getReqConfig("testServerGet");
	var opts=proxy.getRequest(req,res);
	
	var opts1,opts2;
	console.log(opts,opts[1],"xxxx__"+opts[1].length);
	opts1=proxy.buildReqOptions(opts,Config.testServerGet);
	opts2=proxy.buildReqOptions(opts,Config.testServerPost);
	
	var jobs=function(first,last){
		//merge jobs return
		console.log(first,last);
		proxy.response.statusCode=first[1];
		var buffer=new sbuffer();
		
		buffer.append(first[0]).append(last[0]);
		proxy.response.end(buffer.toBuffer());
	}
	proxy.on("onDone",proxy.onDones);
	
	var eAgent = new EventProxy();
	eAgent.assign("first", "last", jobs);
	proxy.setobj("eAgent",eAgent);
	
	proxy.doRequest(opts1,"first");
	proxy.doRequest(opts2,"last");
	
   
};
