/**
 * author:linbx
 * date:2012-08-02  linbx 修改isJson方法,返回对象
 */
var stringBuilder = require('./stringBuilder');
//user Global config
//var config = require('../config').config;
var error = config.error; 
var writeLogs = require('./writeLogsV2');
var json = require('./json');

/**
 *判断数据是否是json格式
 *author:linbx
 *create:2010-07-10
 * @param {Object} response
 * @param {Object} data
 * 如果json格式解析正常，返回json转换后的object，否则给科幻端返回一个500的错误响应
 */
exports.isJson= function(response,data,fname){	
	try{
    	var json_obj =json.parse(data);
    	return json_obj;
    }catch(e){
    	var errorCode;
    	writeLogs.logs(error,'error',{msg:fname+'服务器返回数据异常:'+data,errorCode:71});
		return false;
    }
}
/**
 * 发送数据给客户端通用方法，增强程序服用性
 * @param {Object} response		服务端响应对象
 * @param {Object} resData		发送给客户端数据
 * @param {Object} httpCode		http状态码
 */
exports.sendData2Client=function(response,resData,httpCode){
	if(httpCode==200){
		response.writeHead(httpCode, { 'Content-Length': resData.length});
		response.write(resData); 
		response.end();			//告诉客户端所有正文都已经发送完成
	}else{
		response.writeHead(httpCode);
		response.write(resData); 
		response.end();			
	}
}

