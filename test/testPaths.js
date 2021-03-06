var url=require('url');
var querystring=require('querystring');

function get_method(request, response) {
	logger.debug('进入通用接口get方式');
	var header_obj = packagHeaders(request);// 获取头部信息
	var headerStr = querystring.stringify(header_obj, sep = '&', eq = '='); // 将请求参数对象中&转换成=
	 
	
	 
    
	var actionlocation = header_obj.actionlocation ;
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
 * 请求服务 
 * @param requestMethod POST GET UPLOAD
 * @param {host:"",port:"",path:""}
 * @param 日志对象 
 * @param redis/callback
 */
function proxyRequest(requestMethod,remoteInfo,logger){
	var saveRedis = arguments[3] || "";
	var saveKey = arguments[4] || "";
	return function(request, response){
		var queryStr,reqData;
		var header_obj = packagHeaders(request.headers);// 获取头部信息
		var headerStr = querystring.stringify(header_obj, sep = '&', eq = '='); // 将请求参数对象中&转换成=
		var query_obj = url.parse(request.url, true).query;            //        
		
		if(requestMethod=="POST"){
			request.setEncoding("utf-8");
			var postData = request.body; // 获取请求参数
			var query = querystring.stringify(postData, sep = '&', eq = '='); // 将请求参数对象中&转换成=
			reqData = new Buffer(query + '&' + headerStr); // 组织向服务后端的请求数据
			queryStr = querystring.stringify(query_obj, sep = '&', eq = '=');
		}
		else{
			reqData="";
			queryStr = querystring.stringify(query_obj, sep = '&', eq = '='); 
			queryStr = queryStr + '&' + headerString;
		}
		
		var actionlocation = header_obj.actionlocation  ;
		if(actionlocation == "" && query_obj.actionlocation.length > 0){
			actionlocation = query_obj.actionlocation;
		}
		
		if( typeof(remoteInfo.path) == "undefined" || remoteInfo.path.length == 0){
			remoteInfo.path=actionlocation;
		}
 
		logger.debug(header_obj.mobileid + requestMethod +' 方式通用接口参数信息：' +  queryStr)
		
		var headersForProxy = {
			'Connection' : 'keep-alive',
			'x-real-ip' : header_obj.reqip,
			'x-forwarded-for' : header_obj.forward
		}
		if(requestMethod=="POST"){
				headersForProxy.Content-Type == 'application/x-www-form-urlencoded';
				headersForProxy.Content-Length ==  reqData.length;
		}
		remoteInfo.headers=headersForProxy;
		remoteInfo.method = requestMethod;
		remoteInfo.path = remoteInfo.path + queryStr;
		
		response.setHeader("Content-Type", config.contentType);
		response.setHeader(config.headerkey, config.headerval);
		
		
		
	}	 
}


function headersAndData(RequestData,headerString){
	if(typeof(RequestData) == "object" &&  bodyOfRequest.length > 0  ){
		
	}
	else{
		return headerString; 
	}
}

var str=[poiKeywordServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	poiListServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	poiListInfoServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	poiDetailServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	loginServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	rvsServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	mapServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	npsServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	rtsServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	queryServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	scenicServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	friendServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	edriverServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	shorturlServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	themeServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	themegisServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	mapDownload: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	userloginServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	registphoneServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	error: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	navidog2NewsServer: {"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1},
	testServerPost: {"code":171,"desc":"","resType":"测试post","reqType":"","reqMethod":"GET","reqPath":"","isjson":0,"gzip":0},
	testServerGet: {"code":181,"desc":"","resType":"测试get","reqType":"","reqMethod":"GET","reqPath":"","isjson":0,"gzip":0}]

 var p=	["poiKeywordServer","poiListServer","poiListInfoServer","poiDetailServer","loginServer","rvsServer","mapServer","npsServer","rtsServer","queryServer","scenicServer","friendServer","edriverServer","shorturlServer","themeServer","themegisServer","mapDownload","userloginServer","registphoneServer","error","navidog2NewsServer","testServerPost","testServerGet"];
 var i;
 for(var i in p){
  console.log(p[i] +": "+'{"code":1,"desc":"","resType":"","reqType":"","reqMethod":"GET","reqPath":"","isjson":1,"gzip":1}') ;
 }
 
 



 

