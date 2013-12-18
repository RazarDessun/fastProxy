var http = require("http");
var querystring = require("querystring"); // 核心模块


 

function get_method (request, response){  
  
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
    doRequests(opt, "", response,getReqConfig("poiKeywordServer"),data,doRequestCallBack) ;
    
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
	Obj.errorCode=config[logName].errorCode||101;
	Obj.logger=log4tongji.getLogger(logName);
	Obj.name=logName;
	Obj.desc=config[logName].desc ||"通用接口";
	Obj.reqType=config[logName].reqType ||"通用接口";
	Obj.resType=config[logName].resType ||"通用接口";
	Obj.jsonck=config[logName].isjson ||0;
	return Obj;
}
/**
 *远程接口回调 
 *@param response   下行response
 *@param resulStr   请求结果
 *@param res        上行res 
 *@param ReqConfig  api接口信息
 *@param redisop    redis操作     
 */  
function doRequestCallBack(response,resultStr,res,ReqConfig){
	 
	var resultObj = common.isJson(response, resultStr, 'general'); // 判断返回结果是否是json格式
	if (resultObj) { // 返回结果是json格式
		resultStr = JSON.stringify(resultObj);
		response.statusCode = res.status;
	} else {
		resultStr = '{"msg":["服务器返回数据非JSON格式"]}';
		response.statusCode = 500;
	}
	var resultBuffer = new Buffer(resultStr);
	//压缩输出
	if(res.header['iszip']&&res.header['iszip']=="0"){
		outputgzip(resultBuffer, response);
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
function doRequests(options, reqData, response,ReqConf,TongjiObj,doRequestCB) {
	var redisOpt=arguments[6]||"";
	var req = EzHttpProxy(options, config.timeout, function(res) {
  
		var sbuffer=new SBuffer();
		res.on('data', function (trunk) {
			sbuffer.append(trunk);
		});
		res.on('end', function () {
			doRequestCB(response, sbuffer.toString(),res,ReqConf,TongjiObj,redisOpt);
		});
	});
	req.on('error', function(e) {
		//errorLog 为全局变量
		writeLogs.logs(errorLog, 'error',{ 
			msg : ReqConf.errorCode+ReqConf.name+ReqConf.desc+'请求后台服务失败' + e.stack,
			errorCode :ReqConf.errorCode 
		});
		
		
		writeLogs.logs(ReqConf.logger, ReqConf.name,TongjiObj);
		
		response.setHeader("Content-Type", config.contentType);
		response.statusCode = 500;
		response.end('{}');
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
			writeLogs.logs(error, 'error', {
				msg : 'redis_general保存数据到redis缓存数据库时链接redis数据库异常',
				err : 14
			});
			logger.debug(redis_key + '设置缓存数据失败！');
		}
	});
}


exports.modules=get_method;
 
