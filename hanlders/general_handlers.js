/**
 * 通用借口模块 author:panhm date:2012-12-27
 * 
 */
var http = require("http");
var querystring = require("querystring"); // 核心模块
var url = require("url");
var stringBuilder = require('../utils/stringBuilder');
var expandableByteBuffer = require('../utils/expandableByteBuffer');
//使用global config
//var config = require('../config').config;
var navidog2NewsServer = config.navidog2NewsServer; // 消息推送统计日志
var writeLogs = require('../utils/writeLogsV2');
var common = require('../utils/common')
var error = config.error; // 错误信息统计日志
var reqeustWithTimeout = require('../utils/reqWithTimeOut.js').reqeustWithTimeout;
var redis_pool = require('../utils/connection_pool.js').redis_pool; // 引入连接池
var zlib = require('zlib');




/**
 * 向后台发起请求GET方式
 * 
 * @param request
 * @param response
 */
function get_method(request, response) {
	logger.debug('进入通用接口get方式');
	var header_obj = packagHeaders(request);// 获取头部信息
	var headerStr = querystring.stringify(header_obj, sep = '&', eq = '='); // 将请求参数对象中&转换成=
	logger.debug(header_obj.mobileid + ' get方式通用接口头部信息：' + headerStr)
	var url_obj = url.parse(request.url, true);
	var query_obj = url_obj.query;
	var queryStr = querystring.stringify(query_obj, sep = '&', eq = '='); // 将请求参数对象中&转换成=
	logger.debug(header_obj.mobileid + ' get方式通用接口参数信息：' +  queryStr)
	var actionlocation = header_obj.actionlocation;
	logger.debug('1');
	if (!actionlocation) {
		logger.debug('2');
		actionlocation = query_obj.actionlocation;
		logger.debug(actionlocation);
	}

	if (actionlocation&&actionlocation!="") {
		var paramsStr = queryStr + '&' + headerStr;
		var options = {
			host : config.general_host, // 远端服务器域名
			port : config.general_port, // 远端服务器端口号
			path : actionlocation, // 访问远端服务器地址
			headers : {
				'Connection' : 'keep-alive',
				'x-real-ip' : header_obj.reqip,
				'x-forwarded-for' : header_obj.forward
			}
		// 设置node和服务端的http链接为长链接
		};
		options.path = encodeURI(options.path + '?' + paramsStr);
		response.setHeader("Content-Type", config.contentType);
		response.setHeader(config.headerkey, config.headerval);
		//logger.info(options);
		reqeustServer(options, '', response);// 请求后台数据
	} else {
		logger.debug('get方法actionlocation不合法');
		response.statusCode = 500;
		response.end();
	}

}

/**
 * 向后台发起请求post方式
 * 
 * @param request
 * @param response
 */
function post_method(request, response) {
	logger.debug('进入通用接口post方式');
	var header_obj = packagHeaders(request);// 获取头部信息
	var headerStr = querystring.stringify(header_obj, sep = '&', eq = '='); // 将请求参数对象中&转换成=
	logger.debug(header_obj.mobileid + ' post方式通用接口头部信息：' + headerStr)
	request.setEncoding("utf-8");
	var postData = request.body; // 获取请求参数
	var query = querystring.stringify(postData, sep = '&', eq = '='); // 将请求参数对象中&转换成=
	logger.debug(header_obj.mobileid + ' post方式通用接口参数信息:' + query);
	var reqData = new Buffer(query + '&' + headerStr); // 组织向服务后端的请求数据
	var actionlocation = header_obj.actionlocation;
	if (!actionlocation) {
		actionlocation = postData.actionlocation;
	}
	if (actionlocation&&actionlocation!="") {
		var options = {
			host : config.general_host, // 远端服务器域名
			port : config.general_port, // 远端服务器端口号
			method : 'POST', // 请求方式
			path : actionlocation, // 访问远端服务器地址
			headers : {
				'Connection' : 'keep-alive',
				'Content-Type' : 'application/x-www-form-urlencoded',
				'Content-Length' : reqData.length,
				'x-real-ip' : header_obj.reqip,
				'x-forwarded-for' : header_obj.forward
			}
		// 设置node和服务端的http链接为长链接
		};
		response.setHeader("Content-Type", config.contentType);
		response.setHeader(config.headerkey, config.headerval);
		var redis_key = postData.rediskey;// 重复提交key过滤
		if (redis_key) {
			redis_key = header_obj.mobileid + "-" + actionlocation + redis_key;// 组装成唯一key
			redisReqeustServer(response, options, reqData, redis_key);// 先检测缓存数据
		} else {
			reqeustServer(options, reqData, response); // 直接请求后台，不需要设置缓存
		}
	} else {
		logger.debug('post方法actionlocation不合法');
		response.statusCode = 500;
		response.end();
	}

}

// /**
// * 返回客户端数据
// *
// * @param request
// * @param response
// */
// function responseClient(res, response) {
// var status = res.statusCode;
// var resultStr = "";
// res.setEncoding('utf-8');
// res.on('data', function(chunk) {
// resultStr = resultStr + chunk;
// });
// res.on('end', function() {
// var resultObj = common.isJson(response, resultStr, 'general'); //
// 判断返回结果是否是json格式
// if (resultObj) { // 返回结果是json格式
// var outstr = JSON.stringify(resultObj);
// logger.debug(' 通用接口下行结果' + outstr);
// var resultBuffer = new Buffer(outstr);
// response.statusCode = status;
// response.setHeader("Content-Length", resultBuffer.length);
// response.write(resultBuffer); // 以二进制流的方式输出数据
// response.end();
// } else {
// response.setHeader("Content-Type", config.contentType);
// response.statusCode = 500;
// response.end('{"msg":["服务器返回数据非JSON格式"]}');
// }
// });
// }

/**
 * 设置缓存
 * 
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

/**
 * 从缓存中获取数据，如果获取不到，则请求后台返回的数据返回给客户端 并且将返回的数据设置到redis缓存
 * 
 * @param redis_key
 * @param request
 * @param response
 */
function redisReqeustServer(response, options, reqData, redis_key) {
	redis_pool.acquire(function(err, client) {
		if (!err) {
			client.get(redis_key, function(err, date) {
				redis_pool.release(client) // 用完之后释放链接
				if (!err && date != null) {
					var resultBuffer = new Buffer(date);
					response.statusCode = 200;
					response.setHeader("Content-Length", resultBuffer.length);
					response.write(resultBuffer); // 以二进制流的方式输出数据
					response.end();
					logger.debug(redis_key + '通用接口下行缓存数据:' + date);
				} else {
					reqeustServer(options, reqData, response, redis_key);
				}
			});
		} else {
			reqeustServer(options, reqData, response, redis_key)
		}
	});
}
/**
 * 请求后台服务，并且返回数据结果给客户端
 * 
 * @param options
 *            请求后台服务配置
 * @param reqData
 *            请求参数
 * @param response
 * @param redis_key
 *            缓存key (存在此参数时需要做缓存)
 */
function reqeustServer(options, reqData, response, redis_key) {
	var req = reqeustWithTimeout(options, config.timeout, function(res) {
		
		var status = res.statusCode;
		var resultStr = '';
		res.setEncoding('utf-8');
		res.on('data', function(chunk) {
			resultStr = resultStr + chunk;
		});
		res.on('end', function() {
			var resultObj = common.isJson(response, resultStr, 'general'); // 判断返回结果是否是json格式
			if (resultObj) { // 返回结果是json格式
				resultStr = JSON.stringify(resultObj);
				response.statusCode = status;
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
		
			if (redis_key) {
				var redis_time = 60 * 2;// 缓存2分钟
				setRedisData(redis_key, redis_time, resultStr); // 设置缓存
			}
		});
	});
	req.on('error', function(e) {
		writeLogs.logs(error, 'error', {
			msg : '101 通用接口post方式请求后台服务失败' + e.stack,
			errorCode : 101
		});
		response.setHeader("Content-Type", config.contentType);
		response.statusCode = 500;
		response.end('{}');
	});
	req.on('timeout', function(e) {
		req.emit('error', new Error('have been timeout...'));
	});
	req.end(reqData);
}



/*
 * 向后台发起请求post方式[上传文件]
 * 
 * @param request @param response
 */
function upload_method(request, response) {
	logger.debug('进入通用接口post方式[上传文件]');
	var header_obj = packagHeaders(request);// 获取头部信息
	var headerStr = querystring.stringify(header_obj, sep = '&', eq = '='); // 将请求参数对象中&转换成=
	logger.debug(header_obj.mobileid + ' post方式通用接口头部信息：' + headerStr)
	var reqData; // 获取请求参数

	var reqExbBuf = expandableByteBuffer.createBuffer(100);// 创建可扩展buffer，指定初始大小
	request.on("data", function(chunk) {
		reqExbBuf.append(chunk);
	});
	request.on("end", function() {
		reqData = reqExbBuf.trim();
		logger.debug('客户端传递数据结束，数据长度:' + reqData.length);
		response.setHeader("Content-Type", 'application/octet-stream');
		response.setHeader(config.headerkey, config.headerval);
		var actionlocation = header_obj.actionlocation;
		
		logger.debug("转换前：actionlocation=" + actionlocation);
		if(actionlocation.indexOf("?") > 0 )
		{
		    actionlocation = actionlocation+"&"+headerStr;
		    logger.debug("加了&符号");
		}else{
			actionlocation = actionlocation+"?"+headerStr;
			logger.debug("加了?符号");
		}
		logger.debug("转换后：actionlocation=" + actionlocation);
		
		if (!actionlocation) {
			actionlocation = postData.actionlocation;
		}
		var options = {
			host : config.general_host, // 远端服务器域名
			port : config.general_port, // 远端服务器端口号
			method : 'POST', // 请求方式
			path : actionlocation, // 访问远端服务器地址
			headers : {
				'Connection' : 'keep-alive',
				'Content-Type' : 'application/octet-stream',
				'Content-Length' : reqData.length,
				'x-real-ip' : header_obj.reqip,
				'x-forwarded-for' : header_obj.forward
			}
		// 设置node和服务端的http链接为长链接
		};
		response.setHeader("Content-Type", config.contentType);
		response.setHeader(config.headerkey, config.headerval);
		var req = reqeustWithTimeout(options, config.timeout, function(res) {
			logger.debug('HEADERS: ' + JSON.stringify(res.headers));
			var temp = res.headers["content-encoding"];
			logger.debug('获取服务端Content-Encoding:' + temp);
			if(temp){
				response.setHeader("Content-Encoding", "gzip");
			}
			var status = res.statusCode;
			var serverExpandableBuf = expandableByteBuffer.createBuffer(100);
			res.on('data', function(chunk) {
				serverExpandableBuf.append(chunk);
			});
			res.on('end', function() {
				var resultData = serverExpandableBuf.trim(); // 可扩展数组tirm得到服务端返回的信息
				common.sendData2Client(response, resultData, status);
			});
		});
		req.on('error', function(e) {
			writeLogs.logs(error, 'error', {
				msg : '101 通用接口post方式请求后台服务失败' + e.stack,
				errorCode : 101
			});
			response.statusCode = 500;
			response.end('{}');
		});
		req.on('timeout', function(e) {
			req.emit('error', new Error('have been timeout...'));
		});
		req.end(reqData);
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
        	logger.debug('gis压缩成功,压缩前:'+resultBuffer.length+',压缩后:'+buffer.length);
        	response.setHeader('Content-Encoding', 'gzip');					//压缩标志
        } else {
			buffer = new Buffer( '{"msg":["gis服务器返回数据非JSON格式"]}');
			response.statusCode=500;
        }
        response.setHeader("Content-Length", buffer.length);
		response.write(buffer);
	    response.end();	
	});
}


 
exports.get_method = get_method;
exports.post_method = post_method;
exports.upload_method = upload_method;
