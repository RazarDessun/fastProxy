/**
 * author:sundl
 * date:2013-12-18  sundl 修改isJson方法,返回对象
 */

var writeLogs = require('./writeLogsV2');
var json = require('./json');

/**
 *判断数据是否是json格式
 *author:sundl
 *create:2013-12-18
 * @param {Object} response
 * @param {Object} data
 * 如果json格式解析正常，返回json转换后的object，否则记录日志
 */
exports.isJson= function(data,fname){	
	try{
    	var json_obj =json.parse(data);
    	return json_obj;
    }catch(e){
    	writeLogs.logs(Analysis.getLogger('error'),'error',{msg:fname+'服务器返回数据异常:'+data,errorCode:71});
		return false;
    }
}

/**
 * 发送数据给客户端通用方法，增强程序服用性
 * author: linbx
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

/**
 * 扩展一个对象
 * author ：sundl
 * @param destination
 * @param source
 */ 
exports.extends = function(destination, source) {
	for (var property in source) {
		destination[property] = source[property];
	}
	return destination;
}


/**
 * 过滤统计日志
 * @param string    s
 */
exports.stripscript =  function (s) {
	var pattern = new RegExp(
			"[`~!@#$^&*()=|{}':;',\\[\\]<>/?~！@#￥……&*（）|{}【】‘；：”“'。，、\"？]");
	var rs = "";
	for ( var i = 0; i < s.length; i++) {
		rs = rs + s.substr(i, 1).replace(pattern, '');
	}
	rs = rs.replace(/\\/g, "");
	return rs;
}


/**
 * 转换字符串为int类型
 * @param num
 */ 
var intval =function(num){
	num=parseInt(0+num);
	if(isNaN(num)) num=0;
	return num;
}

/**
 * 转换字符串为string类型
 * @param str
 */ 
var strval =function(str){
	str=""+str;
	return str;
}
/**
 * 自动根据参数确认浮点数长度
 * @param string 
 * @param likestring
 * @return float
 */ 
var autofloat=function(string,likestring){
	var tofix=( -1===likestring.lastIndexof(".") )? 0 : (likestring.length-1-likestring.lastIndexof("."));
	return parseFloat(string).toFixed(tofix);
}

/**
 * 转换目标为统计使用的对象的默认值和类型
 * @param object
 * @param formatStr
 * @return object
 */ 
exports.convTobj= function(object,formatStr){
	
	var v,dest=formatStr.split("|");
	for(var k in dest){
		v=dest[k].split(":");
		if(v[1]==="0" || (v.length==3 && ( v[2]==="i"  || v[2]==="f")) ){
			if(v[1] ===0 || v[2]=="i" ){
				object[v[0]]= parseInt(object[v[0]]) || intval(v[1]);
			}
			else{
				object[v[0]]= autofloat(object[v[0]],v[1]) || intval(v[1]);
			}
		}
		else if(v[1]=="date"){
			object[v[0]]= Date.now();
		}
		else{
			object[v[0]]= object[v[0]] || v[1];
		}
	}
	return object;
}
exports.intval=intval;
exports.strval=strval;
