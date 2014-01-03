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
 * @param logger   可选 analysis(logger4tongji)  // logger4js机制有所调整
 * @param names    log 文件名前缀，log标识 
 * @param isTypicallogger 默认false（加载tongjilogger ） ，true（log4js）
 */
exports.initLogger = function(logger,names){
	if(typeof(logger)=="undefined" || typeof(logger)=="string" ){
		console.log("init logger error");
		return false;
	}
	if(typeof(names) == 'string' )
		var nameLists=names.split(",");
	else
		var nameLists=names;
	var isTypicallogger=arguments[2]||false;
	
	if( isTypicallogger != false ){ logger.loadAppender('file'); }
	var name,logerPath;
	
	
	for(var i = 0; i < nameLists.length ; i++){
		name=nameLists[i].trim();
		if(name.length>0){
			logerPath= Config.logerPath+name[i];
			if(isTypicallogger===false){  
				logger.addAppender(logger.fileAppender(logerPath),name[i]);	
			}
			else{
				logger.addAppender(logger.appenders.file(logerPath+".log"),name[i]);  
			}
		}
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
 *添加反斜杠 安全提交或输出
 * @param string 待替换的字符 
 * @retun string 
 */  
exports.addslashes=function  (str) {
  return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
}
