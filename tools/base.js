/**
 * node 基本函数类
 * author:sundl
 * date: 2013-11-28
 * 无依赖函数类（通过参数传递） 
 */
  
 
/**
 * 初始化 logger
 * author:sundl
 * create 2013-11-28
 * @param logger   可选 logger（logger4js），analysis(logger4tongji)
 * @param names    log 文件名前缀，log标识 
 */
exports.initLogger = function(logger,names){
	
	if(typeof(names) == 'string' )
		var nameLists=names.split(",");
	else
		var nameLists=names;
	
	for(var i = 0; i < nameLists.length ; i++){
	    logger.addAppender(logger.appenders.file(Config.logerPath+nameLists[i]+".log"),nameLists[i]);
	}
}

/**
 * 获取日志对象
 * author:sundl
 * create 2013-11-28
 * @param loggerObj
 * @param name
 */ 
exports.getLogger = function (loggerObj,name){
	return loggerObj.getLogger(name);
} 

/**
 * 获取头部信息进行封装
 * @param request.headers
 * @param need fields ;split with ','
 * @return object headers
 */
exports.packagHeaders = function(headers) {
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
 	var gender=  request.headers['gender'] || '0'; 
 	
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
			newObj[afields[i]] = query_obj[afields[i]];		
		}
		return newObj;
	}
	else{
		return query_obj;
	}
}
