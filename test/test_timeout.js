var http = require("http");
var querystring = require("querystring"); // 核心模块
var SBuffer=require("../tools/SBuffer");
var common=require("../tools/common");
var zlib=require("zlib");
var redis_pool=require("../tools/connection_pool"); 

function get_method (request, response){  
    console.time("req");
    var data = {  
        address: 'test@test.com',  
        subject: "test"  
    };  
  
    data = JSON.stringify(data);  
 
    var opt = {  
        method: "GET",  
        host: "192.168.1.124",  
        port: 8001,  
        path: "/data",  
         
    };  
    var  rqobjConf=getReqConfig("poiKeywordServer");
    rqobjConf.gzip=0;
    rqobjConf.isjson=1;
    doRequestsString(opt, "", response,rqobjConf,data,doRequestCallBack) ;
    
   //process.nextTick
}

var options = {
  hostname: 'www.google.com',
  port: 80,
  path: '/upload',
  method: 'POST'
};

var ztimeout=5000;

function EzHttpProxy(options,timeout,callback){
	var req = http.request(options, function(res) {
	   callback(res);
	});
	req.setTimeout(timeout,function(){
		 req.emit('timeout',{message:'have been timeout...'});
	});
	return req;
}

 

function getReqConfig(logName){
 
	var Obj={};
	Obj.errorCode=Config[logName].errorCode||101;
	Obj.logger=Analysis.getLogger(logName);
	Obj.name=logName;
	Obj.desc=Config[logName].desc ||"通用接口";
	Obj.reqType=Config[logName].reqType ||"通用接口";
	Obj.resType=Config[logName].resType ||"通用接口";
	Obj.isjson=Config[logName].isjson ||0;
	Obj.gzip = Config[logName].gzip ||0;
	return Obj;
}

/**
 *远程接口回调 
 *@param response   下行response
 *@param result   请求结果{"data":data,"status":res.statuscode}
 *@param ReqConfig  api接口信息
 *@param redisop    redis操作     
 */  
function doRequestCallBack(response,result,ReqConfig){
	var resultStr = result.data;
	if(ReqConfig.isjson==1){ 
		
		var resultObj = common.isJson(resultStr, 'general'); // 判断返回结果是否是json格式
		if (resultObj) { // 返回结果是json格式
			resultStr = JSON.stringify(resultObj);
			response.statusCode = result.status;
		} else {
			resultStr = '{"msg":["服务器返回数据非JSON格式"]}';
			response.statusCode = 500;
		}
	}
	else{
		response.statusCode = result.status;
	}

	var resultBuffer = new Buffer(resultStr);

	//压缩输出
	if( ReqConfig.gzip == 1){
		gzipOutPut(resultBuffer, response);
	}else{
		response.setHeader("Content-Length", resultBuffer.length);
		response.write(resultBuffer); // 以二进制流的方式输出数据
		response.end();
		logger.debug('通用接口下行结果:' + resultStr);
	}
    var redisOpt =arguments[4] || "";
	if ( typeof(redisOpt)=="object" && redisOpt.redis_key) {
		var redis_time = redisOpt.redis_time || 60 * 2;// 默认缓存2分钟
		setRedisData(redisOpt.redis_key, redis_time, resultStr); // 设置缓存
	}
}

/**
 * 请求远程接口
 *@param options 远程接口信息
 *@param reqData 转发请求数据 get 时为空
 *@param response 下行response
 *@param ReqConf  对象 默认调用 getReqConfig(LogName)
 *@param TongjiObj 待记录的统计对象 
 *@param doRequestCB  回调函数 参数 见 doRequestCallBack 
 *@param  redis    redis 对象
 */ 
function doRequestsString(options, reqData, response,ReqConf,TongjiObj,doRequestCB) {
	var redisOpt=arguments[6]||"";
	var req = EzHttpProxy(options, Config.timeout, function(res) {
  
		var sbuffer=new SBuffer();
		res.setEncoding("utf-8");
		res.on('data', function (trunk) {
			sbuffer.append(trunk);
		});
		res.on('end', function () {
			doRequestCB(response, {"data":sbuffer.toString(),"status":res.statusCode},ReqConf,TongjiObj,redisOpt);
		});
	});
	req.on('error', function(e) {
		response.setHeader("Content-Type", Config.contentType);
		response.statusCode = 500;
		response.end('{}');
		
		writeLogs.logs(Analysis.getLogger('error'), 'error',{ 
			msg : ReqConf.errorCode+ReqConf.name+ReqConf.desc+'请求后台服务失败' + e.stack,
			errorCode :ReqConf.errorCode 
		});
		TongjiObj.status=500;
		
		writeLogs.logs(ReqConf.logger, ReqConf.name,TongjiObj);
	});
	req.on('timeout', function(e) {
		req.emit('error', new Error('have been timeout...'));
	});
	req.end(reqData);
}

/**
 * 设置缓存
 * @param redis_key
 * @param redis_time
 * @param resultBuffer
 */
function setRedisData(redis_key, redis_time, resultBuffer) {
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
 * 输出gzip数据
 * @param resultBuffer 
 * @param response
 */
function gzipOutPut(resultBuffer,response){
	zlib.gzip(resultBuffer, function(code, buffer){						// 对服务器返回的数据进行压缩
        if (code != null) { // 如果正常结束
        	logger.debug('压缩成功,压缩前:'+resultBuffer.length+',压缩后:'+buffer.length);
        	response.setHeader('Content-Encoding', 'gzip');					//压缩标志
        } else {
			buffer = new Buffer( '{"msg":["服务器返回数据非JSON格式"]}');
			response.statusCode=500;
        }
        response.setHeader("Content-Length", buffer.length);
		response.write(buffer);
	    response.end();	
	});
}

exports.get_method=get_method;
 
