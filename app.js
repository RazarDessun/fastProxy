/***
 *node 服务转发系统 
 * 重写的原因 ，1 旧的node系统版本过低，存在容易攻击bug 2 需要代码精简和优化。
 * write：sundl 
 * date：2013-12-27
 * notice ： 现在定义的全局变量  Config errorLog logger
 */

var cluster = require('cluster');
process.setMaxListeners(0);					//不做限制 最好在linux 下设置 ulimit -n 65535

var configPath="config";
process.argv.forEach(function (val, index, array) {
    if(index==2)  {
		if (typeof(val)!="undefined"&& val.length>0) {
			configPath=val;
		}
	}
});

var numCPUs = require('os').cpus().length;
var path = require('path');
global.Config = require('./'+configPath).config; 		//全局变量 读取配置文件

var http = require('http')

var appName = path.basename(__dirname);
var express = require('express'); 				// 添加express模块
var routes = require('./routes/routes2'); 		// 加载路由模块

var static_dir = path.join(__dirname, 'public');

var log4js = require('log4js');
var log4tongji = require('tongji_log');
var initLogger = require('./tools/base').initLogger;


var nameLists=Config.loger4jsNames;
log4js.loadAppender('file');
logger.addAppender(logger.appenders.file(Config.logerPath+nameLists[0]+".log"),nameLists[0]);  //navidog4

initLogger(log4js,Config.loger4jsNames);            //初始化 loger对象
initLogger(log4tongji,Config.tongjiLogerNames);     //初始化 统计对象
global.errorLog=log4tongji.getLogger('error');		//全局变量 errorLog 
global.logger=log4js.getLogger('navidog4');			//全局变量 logger 

logger.setLevel('INFO');

var writeLogs = require('./tools/writeLogsV2');
 var app = express();
 

app.configure('development', function() {		// 定义开发环境
	app.use(express.static(static_dir));
	app.use(express.errorHandler({dumpExceptions : true,showStack : true}));
});

app.configure('production', function() {		// 定义生产环境
	var maxAge = 3600000 * 24 * 30;
	app.use(express.static(static_dir, { maxAge: maxAge }));
	app.use(express.errorHandler());
	app.set('view cache', true);
});

//routes.route(app); 					// 把应用传递给路由选择模块
app.listen(Config.port);
process.on('uncaughtException', function(err) {
	logger.error('nodejs 进程异常: ' + err.stack); // 打印出堆栈信息
	writeLogs.logs(errorLog,'error',{msg:'nodejs 进程异常,'+err.stack,errorCode:10});
});
logger.info('服务启动监听端口:' + config.port);
