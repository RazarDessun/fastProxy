var http = require("http");
var querystring = require("querystring"); // 核心模块
var SBuffer=require("../tools/SBuffer");
var common=require("../tools/common");
var zlib=require("zlib");
var redis_pool=require("../tools/connection_pool"); 

var events = require('events');
var util = require('util'); 

function ProxyAgent(preHeaders,preAnalysisFields,logName){
	this.headNeeds = preHeaders||"";
	this.preAnalysisFields = preAnalysisFields||"";
	this.AnalysisFields = {};
	this.logName=logName||"";
	this.response=null;
	this.reqConf={};
	this.retData=[];
	this.redis =null;  // redis {} redis_key
	events.EventEmitter.call(this);
}

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
	return Obj;
}

ProxyAgent.prototype.doRequest=function(_req,_res){
	var _self=this;
	_self.reqConf=_self.getReqConfig(this.logName);
	logger.debug('进入'+_self.reqConf.desc+"服务");
	
	var header_obj =this.packageHeaders(_req.headers,this.headNeeds);
		
	var url_obj = url.parse(request.url, true);
	var query_obj = url_obj.query; 
	
	var postData = request.body|| ""; // 获取请求参数
	
	_res.setHeader("Content-Type", config.contentType);
	_res.setHeader(config.headerkey, config.headerval);
	var opts=_self.packData(header_obj,query_obj,postData);
	logger.debug(header_obj.mobileid +_self.reqConf.desc+ '接口参数信息：'+opts[0].path +" data:"+  opts[1]);
	
	if(typeof(postData) =="object" && postData.redis_key.length>0){
	    this.getRedis(opts[0],opts[1]);
	}
	else{
		this.httpProxy(opts[0],opts[1]);
	}
	
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
		query_str = querystring.stringify(query, '&', '=');
	}
	else if(type=="body"){
		body=common.extends(body,headers);
		body_str = querystring.stringify(body, '&', '=');
		len=body_str.length;		
			if(body.redis_key){
				this.redis={};
				this.redis.redis_key=body.redis_key;
			}
	}
	else if(type=="json"){
		query=common.extends(query,headers);
		query_str = 'json='+querystring.stringify(query, '&', '=');
	}
	else if(type=="raw"){
		len=body.length;
		body_str=body;
	}
	var actionlocation = headers.actionlocation || "";
	if(actionlocation==""){
		actionlocation=query.actionlocation||"";
	}
	var opts=_self.getRequestOptions(len,actionlocation);

	opts.path+=((opts.path.indexOf("?")>=0)?"&":"?")+query_str;
	
	return [opts,body_str];
}

/**
 * 获取请求头信息
 * @param len数据长度
 * @param actiontion  通用访问地址
 * @return object  头信息
 */ 
ProxyAgent.prototype.getRequestOptions=function(len，actionlocation){
	var _self=this;
	
	var options = {												//http请求参数设置
	    host: _self.reqConf.host,								// 远端服务器域名
	    port: _self.reqConf.port,								// 远端服务器端口号
	    path: _self.reqConf.path||"",							
	    headers : {'Connection' : 'keep-alive'}
	};
	if(actionlocation.length>0){
		options.path=actionlocation;
	}
	
	var  rtype= _self.reqConf.reqType || "";
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
 */ 
ProxyAgent.prototype.httpProxy = function (options,reqData){
	var _self=this;
	var TongjiObj={};
	var req = http.request(options, function(res) {
		
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
			_self.emmit("onDone",sbuffer,TongjiObj);
		});
	});
	req.setTimeout(timeout,function(){
		 req.emit('timeOut',{message:'have been timeout...'});
	});
	req.on('error', function(e) {
		TongjiObj.statusCode=500;
		_self.emmit("onDone","",500,TongjiObj);
	});
	req.on('timeOut', function(e) {
		req.abort();
		TongjiObj.statusCode=500;
		TongjiObj.last = Date.now();
		_self.emmit("onDone","",500,TongjiObj);
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
 */
ProxyAgent.prototype.getRedis = function ( options, reqData) {
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
					_self.httpProxy(options, reqData);
				}
			});
		} else {
			_self.httpProxy(options, reqData);
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
 * @param tongji  object统计对象
 */ 
ProxyAgent.prototype.onDone =function(buffer,status){
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
		_self.response.statusCode = status;
	}	
				  
	var resultBuffer = new Buffer(resultStr);
	if(tongji!=""){
		tongji.ends = Date.now();
		tongji.length = resultBuffer.length;
	}
	if(resultBuffer.length > 500 ){
		//压缩输出
		_self.gzipOutPut(resultBuffer);
		
	}else{
		_self.response.setHeader("Content-Length", resultBuffer.length);
		_self.response.write(resultBuffer); // 以二进制流的方式输出数据
		_self.response.end();
	}
	
	if(tongji!=""){
		tongji.last= Date.now();
		tongji=common.extends(tongji,_self.preAnalysisFields);
		logger.debug('耗时:' + (tongji.last - tongji.start)+'ms statusCode='+status);
		writeLogs.logs(poiDetailServer,'poiDetailServer',obj);
	}
});


ProxyAgent.prototype.onDones =function(buffer,status){
	var tongji=arguments[2] ||"";
	this.retData.push([buffer,status,tongji];
});

ProxyAgent.prototype.dealDones =function(){
	var tongji=arguments[2] ||"";
	this.retData.push([buffer,status,tongji];
});

//ProxyAgent 从event 集成
//utils.inherit(ProxyAgent,event);

exports.ProxyAgent=ProxyAgent;
